import * as vscode from "vscode";
import TSAlignment from "./tsalignment";

export function activate(context: vscode.ExtensionContext) {

  context.subscriptions.push(vscode.commands
    .registerCommand("tsalignment.align", () => {
      TSAlignment.align();
    }));

  context.subscriptions.push(vscode.commands
    .registerCommand("tsalignment.alignFirstSymbolOnly", () => {
      TSAlignment.align(true);
    }));

}
