import * as vscode from 'vscode';
import { excludeCommonItems } from './utils';
import { mainDataTags } from './data';
import { cacheAutoComplete } from './cache';

const regexGetAutoComplete = /\[ref\.([^\s]+)/g;

class APIDataCompletionItemProvider implements vscode.CompletionItemProvider {
  public async provideCompletionItems(
    document: vscode.TextDocument,
    position: vscode.Position,
    token: vscode.CancellationToken,
  ): Promise<vscode.CompletionItem[] | undefined> {
    const line = document.lineAt(position).text;
    const notHasRefInLine = !line.includes('[ref.');
    if (notHasRefInLine) {
      return undefined;
    }

    const lineToPosition = line.substring(0, position.character);
    const matches = [...lineToPosition.matchAll(regexGetAutoComplete)];
    if (!matches.length) {
      const completionItems = [...new Set(mainDataTags.getData().flat())].map(
        (text) => new vscode.CompletionItem(text, vscode.CompletionItemKind.Function),
      );
      return completionItems;
    }

    const tagsText = matches[0][1];

    const tags = tagsText.split('.').filter((item) => item.trim());
    const keyCache = JSON.stringify(tags);

    const cache = cacheAutoComplete.get(keyCache);
    if (cache) {
      return cache;
    }

    const foundedRefs = mainDataTags.getData().filter((dataTag) => tags.every((tag) => dataTag.includes(tag)));

    const flatList = excludeCommonItems(foundedRefs.flat(), tags);

    const completionItems = [...new Set(flatList)].map(
      (text) => new vscode.CompletionItem(text, vscode.CompletionItemKind.Function),
    );

    cacheAutoComplete.trySet(keyCache, completionItems);
    return completionItems;
  }
}

export function setupAutoComplete(context: vscode.ExtensionContext) {
  const provider = new APIDataCompletionItemProvider();
  const disposable = vscode.languages.registerCompletionItemProvider({ pattern: '**/*' }, provider, '.');
  context.subscriptions.push(disposable);
}
