import * as vscode from 'vscode';
import('node-fetch');

const decorationType = vscode.window.createTextEditorDecorationType({
  color: '#ffffff',
  backgroundColor: '#191a21',
  fontWeight: 'bold',
});

const regEx = /\[ref\.(.*)?\]/g;

export function applyStyle(activeEditor: vscode.TextEditor | undefined) {
  if (!activeEditor) {
    return;
  }

  const text = activeEditor.document.getText();
  const decorationsArray: vscode.DecorationOptions[] = [];

  const matchItems = [...text.matchAll(regEx)];

  matchItems.forEach((match) => {
    if (activeEditor) {
      const startPos = activeEditor.document.positionAt(match.index);
      const endPos = activeEditor.document.positionAt(match.index + match[0].length);
      const decoration = {
        range: new vscode.Range(startPos, endPos),
        hoverMessage: 'This is a reference in pangeia',
      };
      decorationsArray.push(decoration);
    }
  });

  activeEditor.setDecorations(decorationType, decorationsArray);
}
