import * as vscode         from "vscode";
import TSAlignment         from "../src/tsalignment";

import * as basic          from "./dataBasicAlign";
import * as corrupted      from "./dataCorrupted";
import * as mixing         from "./dataMixing";
import * as regex          from "./dataRegex";
import { ITestUnitConfig } from "./testUnitConfigI";

import * as assert         from "assert";


suite("Basic Trivial Extension ALIGN Tests [basic,align]", () => {
  basic.tests.forEach((testUnit) => {
    test(testUnit.title, () => {
  vscode.workspace.openTextDocument({ language: "ts", content: basic.input.join("\n") }).then(
    (doc) => {
      vscode.window.showTextDocument(doc).then((editor) => {
        // const position = editor.selection.active;


        // var newPosition = position.with(position.line, 0);
        // var newSelection = new vscode.Selection(newPosition, newPosition);
        // editor.selection = newSelection;

        const lastLine = editor.document.lineCount - 1;
        const firstPosition = new vscode.Position(0, 0);
        const lastPosition  = new vscode.Position(lastLine, editor.document.lineAt(lastLine).text.length);
        editor.selection = new vscode.Selection(firstPosition, lastPosition);
        //      const editor = vscode.window.activeTextEditor;

        // vscode.window.activeTextEditor.selection.start(vscode.Position(0, 0));
        TSAlignment.setLocalSettings(testUnit.config);

        const alignFirstSymbolOnly: boolean = testUnit.alignFirstSymbolOnly == null ? false : true;
        const myExtension = new TSAlignment(basic.input, testUnit.config, alignFirstSymbolOnly);

            // myExtension.alignLines();
            //     vscode.workspace.openTextDocument({ language: "ts", content: basic.input.join("\n") }).then(
            //       (doc) => {
            //     vscode.window.showTextDocument(doc);
            //   },
            // ).then( () => {
        TSAlignment.align();
        console.log(doc.lineAt(0));
        assert.deepEqual(doc.lineAt(1).text, testUnit.expected[1]);
            // });
          });
        });

      });
    },
  );
});

// suite("Regular expressions [basic,regex]", () => {
//   regex.tests.forEach((testUnit) => {
//     test(testUnit.title, () => {
//       TSAlignment.validateSettings(testUnit.config);
//       const myExtension = new TSAlignment(testUnit.input, testUnit.config, false);
//       myExtension.alignLines();

//       assert.deepEqual(myExtension.lines, testUnit.expected);
//     });
//   });
// });

// suite("Awkward mixing [basic,mixing]", () => {
//   mixing.tests.forEach((testUnit) => {
//     test(testUnit.title, () => {
//       TSAlignment.validateSettings(testUnit.config);
//       const myExtension = new TSAlignment(testUnit.input, testUnit.config, false);
//       myExtension.alignLines();

//       assert.deepEqual(myExtension.lines, testUnit.expected);
//     });
//   });
// });

// suite("UI [basic,ui]", () => {
//   test("static align without editor", () => {
//     TSAlignment.align();
//   });
// });

// suite("Corrupted configs [basic,faulty]", () => {
//   corrupted.tests.forEach((testUnit) => {
//     // expect.to.
//     test(testUnit.title, () => {
//       assert.throws( () => TSAlignment.validateSettings(testUnit.config), Error);
//     });
//   });
// });


