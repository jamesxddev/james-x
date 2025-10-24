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
            font-family: sans-serif;
            padding: 10px;
          }
          button {
            background-color: #007acc;
            color: white;
            border: none;
            padding: 8px 12px;
            border-radius: 4px;
            cursor: pointer;
          }
        </style>
      </head>
      <body>
        <h3>Hello from My Side Panel</h3>
        <button id="btn">Click Me</button>

        <script>
          const vscode = acquireVsCodeApi();
          document.getElementById('btn').addEventListener('click', () => {
            vscode.postMessage({ command: 'buttonClicked' });
          });
        </script>
      </body>
      </html>
    `;
  }
}

// This method is called when your extension is deactivated
export function deactivate() {}
