import * as vscode from 'vscode';
import { mainDataTags } from './data';
import { cacheReferenceExists } from './cache';
import { getTemplateNoHasDataTags, getTemplateRefNotFound } from './templates';

const regexGetReferences = /\[ref\.(.*)?\]/g;
const diagnostics = vscode.languages.createDiagnosticCollection('pangeia-vscode');

export function setupDiagnosticCollection(context: vscode.ExtensionContext) {
  context.subscriptions.push(diagnostics);
}

export function updateDiagnostics(activeEditor: vscode.TextEditor | undefined) {
  if (!activeEditor) {
    return;
  }

  const text = activeEditor.document.getText();
  const diagnosticsArray: vscode.Diagnostic[] = [];

  const matches = [...text.matchAll(regexGetReferences)];

  matches.forEach((match) => {
    const tags = match[1].split('.').sort();
    const indexRef = match.index;
    const textRef = match[0];

    const keyCache = JSON.stringify(tags);
    let existRef = false;

    const cache = cacheReferenceExists.get(keyCache);
    if (cache !== undefined) {
      existRef = cache;
    } else {
      existRef = mainDataTags.getData().some((mainDataTag) => tags.every((tag) => mainDataTag.includes(tag)));
    }

    if (!mainDataTags.getHasResponse()) {
      return;
    }

    cacheReferenceExists.trySet(keyCache, existRef);
    if (existRef) {
      return;
    }

    let message = getTemplateRefNotFound(tags);

    if (!mainDataTags.getData().length) {
      message = getTemplateNoHasDataTags();
    }

    const range = new vscode.Range(
      activeEditor.document.positionAt(indexRef),
      activeEditor?.document.positionAt(indexRef + textRef.length),
    );
    const diagnostic = new vscode.Diagnostic(range, message, vscode.DiagnosticSeverity.Error);
    diagnosticsArray.push(diagnostic);
  });

  diagnostics.set(activeEditor.document.uri, diagnosticsArray);
}
