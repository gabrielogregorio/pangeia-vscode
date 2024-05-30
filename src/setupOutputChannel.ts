import * as vscode from 'vscode';

export const outputChannel = vscode.window.createOutputChannel('Pangeia VSCode');

(function createOutputChannel() {
  outputChannel.show(true);
  outputChannel.appendLine('Pangeia VSCode started.');
})();

export const setupOutputChannel = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(outputChannel);
};

export const logger = (value: string) => {
  outputChannel.appendLine(value);
};
