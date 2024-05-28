import * as vscode from "vscode";
import("node-fetch");

const outputChannel = vscode.window.createOutputChannel("Pangeia VSCode");

const createOutputChannel = () => {
  outputChannel.show(true);
  outputChannel.appendLine("Pangeia VSCode started.");
};
const registerChannel = (context: vscode.ExtensionContext) => {
  context.subscriptions.push(outputChannel);
};

function log(value: string) {
  outputChannel.appendLine(value);
}

const decorationType = vscode.window.createTextEditorDecorationType({
  color: "#ffffff",
  backgroundColor: "#a800ef",
  fontWeight: "bold",
});

let hasResponse = false;
// TODO: split methods
async function fetchData(apiTags: string): Promise<any> {
  try {
    const response = await fetch(apiTags);
    if (!response.ok) {
      throw new Error("Error not ok");
    }
    return await response.json();
  } catch (error) {
    console.error("error fetch:", error);
    throw error;
  }
}

// TODO: split methods
const regEx = /\[ref\.([^\]]+)\]/g;

let tags: string[][] = [];
export function activate(context: vscode.ExtensionContext) {
  const baseUrlTags = vscode.workspace
    .getConfiguration()
    .get("pangeiaVscode.apiTags") as string;

  fetchData(baseUrlTags)
    .then((res) => {
      tags = res;
      log(`Tags obtidas com sucesso com ${res?.length} items`);
    })
    .catch((error) => {
      log(`Erro on fetch available tags ${error}`);
    })
    .finally(() => {
      hasResponse = true;
    });

  createOutputChannel();
  registerChannel(context);
  const diagnostics = vscode.languages.createDiagnosticCollection("test");
  let activeEditor = vscode.window.activeTextEditor;

  function updateDiagnostics() {
    if (!activeEditor) {
      return;
    }

    const text = activeEditor.document.getText();

    const matchItems = [...text.matchAll(regEx)];

    const diagnosticsArray: vscode.Diagnostic[] = [];

    matchItems.forEach((match) => {
      const matchTags = match[1].split(".");
      const index = match.index;

      // TODO: use cache
      // TODO: use short return
      const hasAllTags = tags.some((tag) =>
        matchTags.every((matchTag) => tag.includes(matchTag))
      );

      if (activeEditor && !hasAllTags && hasResponse) {
        // TODO: english text
        let message = `Não existe referência que tenha as tags "${matchTags.join(
          ","
        )}", se existir, reinicie seu vscode para o pangeia-vscode atualizar as tags disponíveis`;

        if (tags.length === 0) {
          message = `Não existe nenhuma tag obtida, verifique na aba SAIDA > [Pangeia VSCode] para verificar se não houveram erros.
Você precisa de configurar a url da pangeia-api no seu vscode, no settings.json ou configurando nas preferencias do usuário. Depois de configurar é necessário reiniciar o vscode. Exemplo de configuração
{
  pangeiaVscode": {
    "apiTags": "http://127.0.0.1:3333/schemas/tags"
  }
}          
`;
        }
        const range = new vscode.Range(
          activeEditor.document.positionAt(index),
          activeEditor?.document.positionAt(index + match[0].length)
        );
        const diagnostic = new vscode.Diagnostic(
          range,
          message,
          vscode.DiagnosticSeverity.Error
        );
        diagnosticsArray.push(diagnostic);
      }
    });

    diagnostics.set(activeEditor.document.uri, diagnosticsArray);
  }

  function updateStyle() {
    if (!activeEditor) {
      return;
    }

    const text = activeEditor.document.getText();
    const decorationsArray: vscode.DecorationOptions[] = [];

    const matchItems = [...text.matchAll(regEx)];

    matchItems.forEach((match) => {
      if (activeEditor) {
        const startPos = activeEditor.document.positionAt(match.index);
        const endPos = activeEditor.document.positionAt(
          match.index + match[0].length
        );
        const decoration = {
          range: new vscode.Range(startPos, endPos),
          hoverMessage: "PANGEIA **VSCODE**",
        };
        decorationsArray.push(decoration);
      }
    });

    activeEditor.setDecorations(decorationType, decorationsArray);
  }

  if (activeEditor) {
    updateDiagnostics();
    updateStyle();
  }

  vscode.window.onDidChangeActiveTextEditor(
    (editor) => {
      activeEditor = editor;
      if (editor) {
        updateDiagnostics();
        updateStyle();
      }
    },
    null,
    context.subscriptions
  );

  vscode.workspace.onDidChangeTextDocument(
    (event) => {
      if (activeEditor && event.document === activeEditor.document) {
        updateDiagnostics();
        updateStyle();
      }
    },
    null,
    context.subscriptions
  );

  context.subscriptions.push(diagnostics);
}

export function deactivate() {}
