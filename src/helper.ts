import * as vscode from "vscode";
import util = require("util");

/**
 * Just small helper class helping with some simple tasks
 */
export default class Helper {


  /**
   * Will display the message in the vscode UI and then it will throw exception.
   * @param text
   */
  public static showError(text: string) {
    vscode.window.showErrorMessage(text);
    throw new Error(text);
  }


  /**
   * Will go through a editor to find first empty line above the cursor
   *
   * @param cursor
   */
  public static firstEmptyLineAbove(cursor: vscode.Selection): number {
    const document: vscode.TextDocument = vscode.window.activeTextEditor.document;

    for (let line: number = cursor.start.line; line > 0; line--) {
      if (document.lineAt(line).isEmptyOrWhitespace) {
        return line;
      }
    }

    // if nothing was found give line number where the document starts.
    return 0;
  }


  /**
   * Will go through a editor to find first empty line below the cursor
   *
   * @param cursor
   */
  public static firstEmptyLineBelow(cursor: vscode.Selection): number {
    const document: vscode.TextDocument = vscode.window.activeTextEditor.document;

    for (let line: number = cursor.start.line; line < document.lineCount; line++) {
      if (document.lineAt(line).isEmptyOrWhitespace) {
        return line;
      }
    }

    // if nothing was found give line number where the document ends.
    return document.lineCount - 1;
  }


}
