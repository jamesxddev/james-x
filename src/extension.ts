// The module 'vscode' contains the VS Code extensibility API
// Import the module and reference it with the alias vscode in your code below
import * as vscode from 'vscode';

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

  resolveWebviewView(
    webviewView: vscode.WebviewView
  ): void | Thenable<void> {
    webviewView.webview.options = {
      enableScripts: true,
      localResourceRoots: [this._extensionUri]
    };

    webviewView.webview.html = this._getHtmlForWebview(webviewView.webview);

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
        default:
          // Other commands not implemented yet
          break;
      }
    });
  }

  private _getHtmlForWebview(webview: vscode.Webview): string {
    return /* html */ `
      <!DOCTYPE html>
      <html lang="en">
      <head>
        <meta charset="UTF-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>My Side Panel</title>
        <style>
          body {
            font-family: var(--vscode-font-family);
            padding: 16px;
          }
          details {
            border: 1px solid var(--vscode-panel-border);
            border-radius: 4px;
            margin-bottom: 12px;
            background: var(--vscode-sideBar-background);
          }
          summary {
            cursor: pointer;
            padding: 8px 12px;
            font-weight: 600;
            outline: none;
          }
          summary::-webkit-details-marker { display: none; }
          details[open] summary {
            border-bottom: 1px solid var(--vscode-panel-border);
          }
          .section-buttons {
            display: grid;
            grid-template-columns: repeat(2, 1fr);
            gap: 8px;
            padding: 12px;
          }
          button {
            background-color: #007acc;
            color: white;
            border: none;
            padding: 10px 16px;
            border-radius: 2px;
            cursor: pointer;
            font-size: 13px;
            font-family: var(--vscode-font-family);
            transition: background-color 0.2s;
          }
          button:hover {
            background-color: #005a9e;
          }
          button:active {
            background-color: #004578;
          }
          button:disabled {
            opacity: 0.4;
            cursor: not-allowed;
          }
          button.empty {
            visibility: hidden;
          }
        </style>
      </head>
      <body>
        <details open>
          <summary>Text Sanitization</summary>
          <div class="section-buttons">
            <button id="trim">Trim</button>
            <button id="distinct">Distinct</button>
            <button id="removeInlineSpaces">Remove Inline Spaces</button>
          </div>
        </details>

        <details>
          <summary>Case Conversion</summary>
          <div class="section-buttons">
            <button id="lowercase">Lowercase</button>
            <button id="uppercase">Uppercase</button>
            <button id="titlecase">Titlecase</button>
          </div>
        </details>

        <details>
          <summary>SQL Formatting</summary>
          <div class="section-buttons">
            <button id="sqlString">In SQL String</button>
            <button id="sqlInt">In SQL Int</button>
          </div>
        </details>

        <script>
          const vscode = acquireVsCodeApi();
          
          document.getElementById('trim').addEventListener('click', () => {
            vscode.postMessage({ command: 'trim' });
          });
          document.getElementById('distinct').addEventListener('click', () => {
            vscode.postMessage({ command: 'distinct' });
          });
          document.getElementById('removeInlineSpaces').addEventListener('click', () => {
            vscode.postMessage({ command: 'removeInlineSpaces' });
          });
          document.getElementById('lowercase').addEventListener('click', () => {
            vscode.postMessage({ command: 'lowercase' });
          });
          document.getElementById('uppercase').addEventListener('click', () => {
            vscode.postMessage({ command: 'uppercase' });
          });
          document.getElementById('titlecase').addEventListener('click', () => {
            vscode.postMessage({ command: 'titlecase' });
          });
          document.getElementById('sqlString').addEventListener('click', () => {
            vscode.postMessage({ command: 'sqlString' });
          });
          document.getElementById('sqlInt').addEventListener('click', () => {
            vscode.postMessage({ command: 'sqlInt' });
          });
        </script>
      </body>
      </html>
    `;
  }
}

// This method is called when your extension is deactivated
export function deactivate() {}
