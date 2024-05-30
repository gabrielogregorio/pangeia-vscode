import * as vscode from 'vscode';
import { setupOutputChannel } from './setupOutputChannel';
import { setupDiagnosticCollection, updateDiagnostics } from './setupDiagnosticCollection';
import { applyStyle } from './applyStyle';
import { fetchTags } from './fetch';
import { setupAutoComplete } from './setupAutoComplete';

const TIME_IN_MS_TO_FETCH_TAGS = 5000;

export function activate(context: vscode.ExtensionContext) {
  fetchTags();

  setInterval(() => {
    fetchTags();
  }, TIME_IN_MS_TO_FETCH_TAGS);

  setupAutoComplete(context);
  setupOutputChannel(context);
  setupDiagnosticCollection(context);

  let activeEditor = vscode.window.activeTextEditor;

  if (activeEditor) {
    updateDiagnostics(activeEditor);
    applyStyle(activeEditor);
  }

  vscode.window.onDidChangeActiveTextEditor(
    (editor) => {
      activeEditor = editor;
      if (!editor) {
        return;
      }

      updateDiagnostics(activeEditor);
      applyStyle(activeEditor);
    },
    null,
    context.subscriptions,
  );

  vscode.workspace.onDidChangeTextDocument(
    (event) => {
      if (!activeEditor || event.document !== activeEditor.document) {
        return;
      }

      updateDiagnostics(activeEditor);
      applyStyle(activeEditor);
    },
    null,
    context.subscriptions,
  );
}

export function deactivate() {}
