import * as hash              from "object-hash";
import * as vscode            from "vscode";

import Helper                 from "./helper";
import { IConfigAlignSymbol } from "./tsalignment";

/**
 * TODO detect multi cursor (many single character selections)
 * TODO timeout watchdog for all execution to kill anything stuck for the worst case
 * TODO public/private  and static, const readonly alignment
 * TODO proper multi source-code-language support settings (code works, but settings json specs not yet)
 */


interface ISelectedLines {
  lines:         string[];
  selectedRange: vscode.Range;
}


export interface IConfigAlignSymbol {
  symbol:          string;
  leftCount:       number;
  leftCharacter?:  string;
  rightCount:      number;
  rightCharacter?: string;
  enabledRegex?:   string;
}


export interface IPosition {
  symbol:   IConfigAlignSymbol;
  position: number;
}


// Modifying/Extending build in type string
declare global {
  interface String {
    trimHead(): string;
    trimTail(): string;
  }
}


/**
 * Remove white-characters at the beginning of the string.
 *
 * @returns string
 */
String.prototype.trimHead = function(): string {
  return this.replace(/^\s+/g, "");
};


/**
 * Remove white-characters at the end of the string.
 *
 * @returns string
 */
String.prototype.trimTail = function(): string {
  return this.replace(/\s+$/g, "");
};


export default class TSAlignment {

  // ************************** static fields **************************

  public static localPrioritySettings: IConfigAlignSymbol[];

  // ************************** static methods *************************

  /**
   * Will analyse what selections were made and decides to make the best effort
   * at making the correct method calls which will do the alignment.
   *
   * @param firstSymbolOnly
   */
  public static align(firstSymbolOnly: boolean = false) {
    const activeEditor: vscode.TextEditor = vscode.window.activeTextEditor;
    if (!activeEditor) return;

    if (activeEditor.selection.isEmpty) {
      // only a cursor is active without selection, so predict a usable selection
      const detectedSelection: vscode.Selection = this.detectSelection(activeEditor.selection);

      // if the detected is not anything meaningful then rather do nothing
      if (detectedSelection.isSingleLine) return;

      this.alignSelectionOrCursor([detectedSelection], firstSymbolOnly);
    }
    else {
      // already selected some text, so use it
      this.alignSelectionOrCursor(activeEditor.selections, firstSymbolOnly);
    }
  }

  /**
   * Will setup default values and value the content of the settings.
   *
   * @param alignSymbols
   */
  public static validateSettings(alignSymbols: IConfigAlignSymbol[]) {
    // validate if all settings are correctly specified as expected
    if (!alignSymbols || alignSymbols.length === 0) Helper.showError("No settings specified, need at lest one symbol");

    // detect duplicates, duplicate symbol is allowed if has different settings (regex condition)
    const unique: Set<string> = new Set();
    alignSymbols.forEach((item) => unique.add(hash({ symbol: item.symbol, enabledRegex: item.enabledRegex })));
    if (unique.size !== alignSymbols.length) {
      Helper.showError("A duplicate in settings was found, not using the settings and stopped execution!");
    }

    // validate each item in detail
    alignSymbols.forEach((item) => {
      this.isSymbolSet(item);
      this.setDefaultSymbolValues(item);
      this.isSymbolSettingValid(item);
      this.isSymbolSettingCorrectRanges(item);
    });
  }


  /**
   * Clears local settings
   */
  public static emptyLocalSettings() {
    this.localPrioritySettings = null;
  }


  /**
   * Uses given argument as the new local settings after they were validated
   * @param newSettings
   */
  public static setLocalSettings(newSettings: IConfigAlignSymbol[]) {
    this.validateSettings(newSettings);
    this.localPrioritySettings = newSettings;
  }


  /**
   * Checks if settings are populated at all
   *
   * @param  {IConfigAlignSymbol} symbolSettings
   * @returns boolean
   */
  private static isSymbolSet(symbolSettings: IConfigAlignSymbol): boolean {
    if (symbolSettings.symbol == null || symbolSettings.symbol.length === 0) {
      Helper.showError("A symbol character needs to be specified");
    }
    return true;
  }



  /**
   * Populate settings with a default content.
   *
   * @param  {IConfigAlignSymbol} symbolSettings
   */
  private static setDefaultSymbolValues(symbolSettings: IConfigAlignSymbol) {
    // fill default values in case if they are empty
    if (symbolSettings.leftCharacter == null) {
      symbolSettings.leftCharacter = " ";
    }

    if (symbolSettings.rightCharacter == null) {
      symbolSettings.rightCharacter = " ";
    }
  }


  /**
   * Check if valid combinations are enabled
   *
   * @param  {IConfigAlignSymbol} symbolSettings
   * @returns boolean
   */
  private static isSymbolSettingValid(symbolSettings: IConfigAlignSymbol): boolean {
    // check the values for valid content
    if (symbolSettings.leftCharacter === "" || symbolSettings.rightCharacter === "") {
      Helper.showError("\"" + symbolSettings.symbol + "\" needs to have  non empty character.");

    } else if (symbolSettings.enabledRegex != null &&
              (symbolSettings.enabledRegex.length === 0 || symbolSettings.enabledRegex.length > 200)) {
      Helper.showError("When the enabledRegex is set it needs to have valid length.");

    }

    return true;
  }


  /**
   * Checks the symbol for valid ranges
   *
   * @param  {IConfigAlignSymbol} symbolSettings
   * @returns boolean
   */
  private static isSymbolSettingCorrectRanges(symbolSettings: IConfigAlignSymbol): boolean {
    // check the values for valid ranges

    if (symbolSettings.leftCount  < -1 || symbolSettings.leftCount  > 100 ||
        symbolSettings.rightCount < -1 || symbolSettings.rightCount > 100) {
      Helper.showError("Count setting for \"" + symbolSettings.symbol + "\" symbol is out of range");

    } else if (symbolSettings.leftCount < 0 && symbolSettings.rightCount < 0) {
      Helper.showError("\"" + symbolSettings.symbol +
        "\" cannot be aligned both left and right (-1 setting) at the same time");
    }

    return true;
  }


  /**
   * Will round up the selection, starting of the selection will be at 0 column
   * and the ending will either be on the last column of the last line, or on
   * the previous line if the end is on 0 character.
   *
   * @param  {vscode.Selection} selection
   * @returns vscode
   */
  private static roundSelection(selection: vscode.Selection): vscode.Range {
    const endLine:       number = selection.end.character > 0 ? selection.end.line : selection.end.line - 1;
    const endLineLength: number = vscode.window.activeTextEditor.document.lineAt(endLine).text.length;

    return new vscode.Range(selection.start.line, 0, endLine, endLineLength);
  }


  /**
   * If just cursor is given it will try to find first empty lines above and
   * below the cursor and use these as the selection
   *
   * @param  {vscode.Selection} cursor
   * @returns vscode
   */
  private static detectSelection(cursor: vscode.Selection): vscode.Selection {
    const document: vscode.TextDocument = vscode.window.activeTextEditor.document;

    const startLine:     number       = Helper.firstEmptyLineAbove(cursor);
    const endLine:       number       = Helper.firstEmptyLineBelow(cursor);
    const endLineLength: number       = document.lineAt(endLine).text.length;
    const detectedRange: vscode.Range = new vscode.Range(startLine, 0, endLine, endLineLength);

    return new vscode.Selection(detectedRange.start, detectedRange.end);
  }


  /**
   * Extract the string lines array from the selection
   * (the selection will be rounded up first)
   *
   * @param  {vscode.Selection} selection
   * @returns SelectedLines
   */
  private static getSelectedLines(selection: vscode.Selection): ISelectedLines {
    const range: vscode.Range = this.roundSelection(selection);
    const lines: string[]     = vscode.window.activeTextEditor.document.getText(range).split(/\r\n|\r|\n/);

    return {
      lines,
      selectedRange: range,
    };
  }


  /**
   * Returns sorted and validated settings for all symbols (largest symbol first).
   * In case of a issue a error while parsing/validating the settings it
   * stop execution of the command and it will display the error message.
   *
   * @returns ConfigAlignSymbols
   */
  private static getSettings(): IConfigAlignSymbol[] {
    // source code language of the current editor
    const language: string = vscode.window.activeTextEditor.document.languageId;

    // get the character settings from the configuration file
    const alignSymbols: IConfigAlignSymbol[] =
      (this.localPrioritySettings == null) ?
        vscode.workspace.getConfiguration("tsalignment." + language).symbols :
        this.localPrioritySettings;

    this.validateSettings(alignSymbols);

    // sort the longest characters first to avoid the issue where the = would be applied before the ===
    // and the = is contained in ===
    alignSymbols.sort((a, b) => b.symbol.length - a.symbol.length);

    return alignSymbols;
  }


  /**
   * Align the selections
   *
   * @param selections
   * @param firstSymbolOnly
   */
  private static alignSelectionOrCursor(selections: vscode.Selection[], firstSymbolOnly) {
    const activeEditor: vscode.TextEditor    = vscode.window.activeTextEditor;
    const alignSymbols: IConfigAlignSymbol[] = this.getSettings();

    selections.forEach((selection) => {
      const input:       ISelectedLines = this.getSelectedLines(selection);
      const myExtension: TSAlignment    = new TSAlignment(input.lines, alignSymbols, firstSymbolOnly);

      myExtension.alignLines();

      activeEditor.edit((editBuilder) => {
        editBuilder.replace(input.selectedRange, myExtension.lines.join("\n"));
      });
    });
  }


  // *********************** fields and constructor *************************

  public  lines:               string[];
  private alignEverythingHere: number;
  private alreadyAligned:      number;
  private alignSymbol:         IConfigAlignSymbol;
  private doAlignmentAgain:    boolean;
  private alignSymbols:        IConfigAlignSymbol[];
  private firstSymbolOnly:     boolean;

  /**
   * Constructor will setup fields with the given inputs
   *
   * @param  {string[]}            lines
   * @param  {ConfigAlignSymbol[]} alignSymbols
   * @param  {boolean}             firstSymbolOnly
   */
  constructor(lines:           string[],
              alignSymbols:    IConfigAlignSymbol[],
              firstSymbolOnly: boolean) {

    this.lines               = lines;
    this.alignSymbols        = alignSymbols;
    this.firstSymbolOnly     = firstSymbolOnly;
    this.alreadyAligned      = 0;
    this.alignEverythingHere = 0;
    this.doAlignmentAgain    = false;
    this.alignSymbol         = { symbol: "", leftCount: 0, rightCount: 0 };
  }


  // non static part of class

  /**
   * Align all the lines from a single selection
   */
  public alignLines() {
    // iterate until no new symbols for ANY of the lines was found.
    do {
      // find suiting symbol for this iteration
      this.findWhatAndWhereToAlign();

      // if nothing was found to align just skip this iteration
      if (this.alignSymbol.symbol === "") return;

      // align all the lines to this symbol
      this.lines = this.lines.map((line) => this.alignSingleLine(line) );

      // make sure the next pass will ignore already aligned parts
      this.alreadyAligned = this.alignEverythingHere + this.alignSymbol.symbol.length + 1;

      // if only first symbol alignment was chosen do not repeat again
      // for all other cases repeat until no other symbols were found for the alignment
    } while (this.doAlignmentAgain && !this.firstSymbolOnly);

    // trim away white-spaces in the end of the lines, only for linting, but not required
    this.lines = this.lines.map((line) => line.trimTail());
  }


  /**
   * Find the first symbol to align for the given line. It will consider what
   * parts were already aligned and only finds new symbols.
   *
   * @param  {string} line
   * @returns Position
   */
  private findFirstSymbol(line: string): IPosition {
    return this.alignSymbols
      .filter( (symbol) => {
        // if regex symbol is defined then the current line needs to pass the evaluation
        if (symbol.enabledRegex != null) return RegExp(symbol.enabledRegex).test(line);

        // all other symbols are enabled by default
        return true;
      })
      .map((item) => ({
        position: line.indexOf(item.symbol, this.alreadyAligned), // -1 in case it is not found
        symbol:   item,
      }))
      .sort((a, b) => a.position - b.position)    // smallest first
      .find((char) => char.position > -1);        // return the first good result
  }


  /**
   * Makes decision what symbol to align and where the alignment will be
   * happening.
   *
   */
  private findWhatAndWhereToAlign() {

    // find out first symbols for each line
    const firstSymbols: IPosition[] = [];
    this.lines.forEach((line) => {
      const firstForThisLine: IPosition = this.findFirstSymbol(line);
      if (firstForThisLine != null) firstSymbols.push(firstForThisLine);
    });

    this.doAlignmentAgain = false;
    if (firstSymbols.length === 0) return; // exit if nothing found
    this.doAlignmentAgain = true; // got result so we can tell do the loop again

    // chose the symbol to which everybody will align
    this.alignSymbol = firstSymbols.sort((a, b) => a.position - b.position)[0].symbol;

    // find out where to align all lines
    this.alignEverythingHere = this.lines
      .filter((line) => {
        // if regex symbol is defined then the current line needs to pass the evaluation
        if (this.alignSymbol.enabledRegex != null) {
          return RegExp(this.alignSymbol.enabledRegex).test(line);
        }
        return true;
      })
      .map((line) => {
        // find out where is the first index of the symbol;
        const index = line.indexOf(this.alignSymbol.symbol, this.alreadyAligned);

        // remove all white-characters between symbol and a text preceding it
        // this will get the true index of the symbol where it should go
        // and removes all previous formating. if symbol was not found (-1)
        // then set the length to 0
        if (index === -1) return 0;
        return line.slice(0, index).trimTail().length;
      })
      .sort((a, b) => b - a)[0]; // sort by "larger -> smaller" and get the first one
  }


  /**
   * Align single line for a single symbol
   *
   * @param  {string} line
   * @returns string
   */
  private alignSingleLine(line: string): string {

    // if the regex enabled symbol is enabled validate each line if it will be aligned or ignored
    if (this.alignSymbol.enabledRegex != null && !RegExp(this.alignSymbol.enabledRegex).test(line)) {
      return line;
    }

    const smallestIndex: number = line.indexOf(this.alignSymbol.symbol, this.alreadyAligned);

    // if nothing found, do not change anything and exit
    if (smallestIndex === -1) return line;

    const delta: number = this.alignEverythingHere - smallestIndex;

    return this.lineToLeftRightOrMiddle(line, smallestIndex, delta);
  }


  /**
   * Depending on the symbol settings it will be aligned left/right/middle
   *
   * @param  {} this.alignSymbol.leftCount<0
   */
  private lineToLeftRightOrMiddle(line: string, smallestIndex: number, delta: number): string {
    if (this.alignSymbol.leftCount < 0) {
      // if symbol should be aligned to LEFT:
      // 1) copy all text before and including symbol
      // 2) create spacing after the symbol (the right spacing + missing spaces on the left)
      // 3) copy rest of the line after the symbol
      return line.slice(0, smallestIndex + this.alignSymbol.symbol.length) +
             this.alignSymbol.rightCharacter.repeat(delta + this.alignSymbol.rightCount) +
             line.slice(smallestIndex + this.alignSymbol.symbol.length).trimHead();
    }
    else if (this.alignSymbol.rightCount < 0) {
      // if symbol should be aligned to RIGHT:
      // 1) copy all text up-to the symbol
      // 2) create spacing after the symbol (the left spacing + missing spaces on the right)
      // 3) copy rest of the line including the symbol
      return line.slice(0, smallestIndex) +
             this.alignSymbol.leftCharacter.repeat(delta + this.alignSymbol.leftCount) +
             this.alignSymbol.symbol +
             line.slice(smallestIndex + this.alignSymbol.symbol.length).trimHead();
    }
    else {
      // if symbol will be spaced in the middle
      return this.lineToMiddle(line, smallestIndex, delta);
    }
  }



  /**
   * Align single line to middle even if the symbol is lagging/leading away
   * from the desired alignment point.
   *
   * @param  {string} line
   * @param  {number} smallestIndex
   * @param  {number} delta
   * @returns string
   */
  private lineToMiddle(line: string, smallestIndex: number, delta: number): string {
    let ret: string;
    if (delta >= 0) {
      // text is behind of the symbol alignment location
      ret = line.slice(0, smallestIndex) +
        this.alignSymbol.leftCharacter.repeat(delta + this.alignSymbol.leftCount);
    } else {
      // text is ahead of the symbol alignment location
      ret = line.slice(0, this.alignEverythingHere) +
        this.alignSymbol.leftCharacter.repeat(this.alignSymbol.leftCount);
    }

    // add the symbol and rest of the line after the symbol
    return ret + this.alignSymbol.symbol +
      this.alignSymbol.rightCharacter.repeat(this.alignSymbol.rightCount) +
      line.slice(smallestIndex + this.alignSymbol.symbol.length).trimHead();
  }


}
