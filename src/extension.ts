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
          .button-grid {
            display: grid;
            grid-template-columns: repeat(3, 1fr);
            gap: 10px;
            max-width: 600px;
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
        <div class="button-grid">
          <button id="trim">Trim</button>
          <button id="distinct">Distinct</button>
          <button id="removeSpaces">Remove Spaces</button>
          
          <button id="lowercase">Lowercase</button>
          <button id="uppercase">Uppercase</button>
          <button id="titlecase">Titlecase</button>
          
          <button id="sqlString">In SQL string</button>
          <button id="sqlInt">In SQL Int</button>
          <button class="empty" disabled></button>
        </div>

        <script>
          const vscode = acquireVsCodeApi();
          
          document.getElementById('trim').addEventListener('click', () => {
            vscode.postMessage({ command: 'trim' });
          });
          document.getElementById('distinct').addEventListener('click', () => {
            vscode.postMessage({ command: 'distinct' });
          });
          document.getElementById('removeSpaces').addEventListener('click', () => {
            vscode.postMessage({ command: 'removeSpaces' });
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
