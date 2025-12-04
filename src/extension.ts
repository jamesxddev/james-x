// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';
import { TextDecoder } from 'util';

// This method is called when your extension is activated
// Your extension is activated the very first time the command is executed
export function activate(context: vscode.ExtensionContext) {

	// Use the console to output diagnostic information (console.log) and errors (console.error)
	// This line of code will only be executed once when your extension is activated
	console.log('Congratulations, your extension "james-x" is now active!');

	// The command has been defined in the package.json file
	// Now provide the implementation of the command with registerCommand
	// The commandId parameter must match the command field in package.json
	const disposable = vscode.commands.registerCommand('james-x.helloWorld', () => {
		// The code you place here will be executed every time your command is executed
		// Display a message box to the user
		vscode.window.showInformationMessage('Hello World from james-x!');
	});

	context.subscriptions.push(disposable);

	const provider = new MySidePanelProvider(context.extensionUri);

	context.subscriptions.push(
		vscode.window.registerWebviewViewProvider(
		"mySidePanelView",
		provider
		)
	);
}

class MySidePanelProvider implements vscode.WebviewViewProvider {
  public static readonly viewType = "mySidePanelView";

  constructor(private readonly _extensionUri: vscode.Uri) {}

  async resolveWebviewView(
    webviewView: vscode.WebviewView
  ): Promise<void> {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };

    webviewView.webview.html = await this._getHtmlForWebview(webviewView.webview);

    // Listen for messages from the webview (button clicks)
    webviewView.webview.onDidReceiveMessage(async (message) => {
      const editor = vscode.window.activeTextEditor;
      if (!editor) {
        vscode.window.showWarningMessage('No active editor to process.');
        return;
      }

      const doc = editor.document;
      const fullRange = new vscode.Range(
        doc.positionAt(0),
        doc.positionAt(doc.getText().length)
      );

      switch (message?.command) {
        case 'trim': {
          const original = doc.getText();
          // Trim leading/trailing whitespace on every line and the whole document
          const trimmedByLine = original
            .split(/\r?\n/)
            .map((line) => line.trim())
            .join('\n')
            .trim();

          if (trimmedByLine !== original) {
            await editor.edit((builder) => {
              builder.replace(fullRange, trimmedByLine);
            });
            vscode.window.setStatusBarMessage('Trimmed document whitespace', 2000);
          } else {
            vscode.window.setStatusBarMessage('No trimming needed', 2000);
          }
          break;
        }
        case 'distinct': {
          const original = doc.getText();
          const lines = original.split(/\r?\n/);
          const seen = new Set<string>();
          const distinctLines: string[] = [];
          for (const line of lines) {
            if (!seen.has(line)) {
              seen.add(line);
              distinctLines.push(line);
            }
          }
          const result = distinctLines.join('\n');
          if (result !== original) {
            await editor.edit((builder) => {
              builder.replace(fullRange, result);
            });
            vscode.window.setStatusBarMessage('Removed duplicate lines in document', 2000);
          } else {
            vscode.window.setStatusBarMessage('No duplicates found', 2000);
          }
          break;
        }
        default:
          // Other commands not implemented yet
          break;
      }
    });
  }

  private async _getHtmlForWebview(webview: vscode.Webview): Promise<string> {
    // Load static HTML from src/media/panel.html
    const htmlUri = vscode.Uri.joinPath(this._extensionUri, 'src', 'media', 'panel.html');
    const raw = await vscode.workspace.fs.readFile(htmlUri);
    const decoder = new TextDecoder('utf-8');
    const html = decoder.decode(raw);
    return html;
  }
}

// This method is called when your extension is deactivated
export function deactivate() {}
