import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    const disposable = vscode.commands.registerCommand('popup-r-novation.showPopup', () => {
        const panel = vscode.window.createWebviewPanel(
            'monPopupPersonnalise',
            'Rénovation de la mosquée',
            vscode.ViewColumn.One,
            { enableScripts: true }
        );

        panel.webview.html = `
            <!DOCTYPE html>
            <html lang="fr">
            <head>
                <meta charset="UTF-8">
                <style>
                    body { font-family: sans-serif; text-align: center; padding: 20px; color: var(--vscode-foreground); }
                    main { max-width: 560px; margin: 0 auto; }
                    button { background-color: #007acc; color: white; border: none; padding: 10px 20px; font-size: 16px; cursor: pointer; border-radius: 4px; margin-top: 15px; }
                    button:hover { background-color: #005999; }
                </style>
            </head>
            <body>
                <main>
                    <h2>Projet de rénovation</h2>
                    <p>Découvrez le projet et les informations pour contribuer à la rénovation de la mosquée.</p>
                    <button onclick="cliquer()">Voir le projet</button>
                </main>
                <script>
                    const vscode = acquireVsCodeApi();
                    function cliquer() {
                        vscode.postMessage({ command: 'ouvrirRenovation' });
                    }
                </script>
            </body>
            </html>
        `;

        // Écouter les messages venant du bouton HTML
        panel.webview.onDidReceiveMessage(
            message => {
                if (message.command === 'ouvrirRenovation') {
                    const url = 'https://mosquee-de-la-divinite.vercel.app/renovation';
                    void vscode.env.openExternal(vscode.Uri.parse(url));
                }
            },
            undefined,
            context.subscriptions
        );
    });

    context.subscriptions.push(disposable);
}

export function deactivate() {}
