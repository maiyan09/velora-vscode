
import * as vscode from 'vscode';

export function registerControlCenter(
    context: vscode.ExtensionContext
): void {

    const disposable = vscode.commands.registerCommand(
        'velora.openControlCenter',
        () => {

            const panel = vscode.window.createWebviewPanel(
                'veloraControlCenter',
                'Velora Control Center',
                vscode.ViewColumn.One,
                {
                    enableScripts: true,
                    retainContextWhenHidden: true
                }
            );

            panel.webview.html = getControlCenterHtml(
                panel.webview
            );

            panel.webview.onDidReceiveMessage(
                async (message: { command?: string }) => {
                    try {
                        switch (message.command) {

                            case 'dark':
                                await vscode.commands.executeCommand(
                                    'velora.darkTheme'
                                );
                                break;

                            case 'light':
                                await vscode.commands.executeCommand(
                                    'velora.lightTheme'
                                );
                                break;

                            case 'font':
                                await vscode.commands.executeCommand(
                                    'velora.selectFont'
                                );
                                break;

                            case 'icons':
                                await vscode.workspace
                                    .getConfiguration('workbench')
                                    .update(
                                        'iconTheme',
                                        'velora-file-icons',
                                        vscode.ConfigurationTarget.Global
                                    );
                                break;

                            case 'focus':
                                await vscode.commands.executeCommand(
                                    'velora.toggleFocusMode'
                                );
                                break;
                            case 'openTextColorStudio': 
                                if (message.command === 'openTextColorStudio') {
                                    await vscode.commands.executeCommand(
                                        'velora.openTextColorStudio'
                                );
                                return;
                            }
                            default:
                                return;
                        }

                    } catch (error) {
                        vscode.window.showErrorMessage(
                            `Velora: ${String(error)}`
                        );
                    }
                },
                undefined,
                context.subscriptions
            );
        }
    );

    context.subscriptions.push(disposable);
}

function getControlCenterHtml(
    webview: vscode.Webview
): string {

    const nonce = getNonce();

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta
        name="viewport"
        content="width=device-width, initial-scale=1.0"
    >
    <meta
        http-equiv="Content-Security-Policy"
        content="
            default-src 'none';
            style-src 'nonce-${nonce}';
            script-src 'nonce-${nonce}';
        "
    >
    <title>Velora Control Center</title>

    <style nonce="${nonce}">
        :root {
            color-scheme: light dark;
        }

        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 36px 24px;
            background: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
            font-family: var(--vscode-font-family);
        }

        .container {
            max-width: 760px;
            margin: 0 auto;
        }

        .header {
            display: flex;
            align-items: center;
            gap: 16px;
            margin-bottom: 36px;
        }

        .logo {
            display: grid;
            place-items: center;
            width: 54px;
            height: 54px;
            border-radius: 16px;
            background: var(--vscode-button-secondaryBackground);
            font-size: 28px;
        }

        h1 {
            font-size: 28px;
            font-weight: 650;
            margin: 0;
        }

        .subtitle {
            margin: 6px 0 0;
            color: var(--vscode-descriptionForeground);
        }

        .section {
            margin-bottom: 32px;
        }

        .section-title {
            margin-bottom: 14px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 1.4px;
            text-transform: uppercase;
            color: var(--vscode-descriptionForeground);
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
        }

        .card {
            padding: 20px;
            border: 1px solid var(--vscode-panel-border);
            border-radius: 14px;
            background: var(--vscode-sideBar-background);
            cursor: pointer;
            color: inherit;
            text-align: left;
            font: inherit;
            transition: border-color .15s ease;
        }

        .card:hover {
            border-color: var(--vscode-focusBorder);
        }

        .card:focus-visible {
            outline: 2px solid var(--vscode-focusBorder);
            outline-offset: 2px;
        }

        .card-icon {
            font-size: 26px;
            margin-bottom: 16px;
        }

        .card-title {
            font-size: 16px;
            font-weight: 600;
            margin-bottom: 6px;
        }

        .card-desc {
            font-size: 12px;
            line-height: 1.6;
            color: var(--vscode-descriptionForeground);
        }

        .action {
            display: flex;
            align-items: center;
            gap: 14px;
            width: 100%;
            padding: 18px 20px;
            margin-bottom: 10px;
            border: 1px solid var(--vscode-panel-border);
            border-radius: 12px;
            background: var(--vscode-sideBar-background);
            color: inherit;
            text-align: left;
            font: inherit;
            cursor: pointer;
        }

        .action:hover {
            border-color: var(--vscode-focusBorder);
        }

        .action:focus-visible {
            outline: 2px solid var(--vscode-focusBorder);
            outline-offset: 2px;
        }

        .action-icon {
            font-size: 22px;
        }

        .action-title {
            font-size: 14px;
            font-weight: 600;
        }

        .action-desc {
            margin-top: 4px;
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
        }

        .footer {
            margin-top: 40px;
            text-align: center;
            font-size: 12px;
            color: var(--vscode-descriptionForeground);
        }

        @media (max-width: 520px) {
            .grid {
                grid-template-columns: 1fr;
            }
        }
    </style>
</head>

<body>
    <main class="container">

        <header class="header">
            <div class="logo">✦</div>
            <div>
                <h1>Velora</h1>
                <p class="subtitle">
                    Your personal appearance control center
                </p>
            </div>
        </header>

        <section class="section">
            <div class="section-title">Color Themes</div>

            <div class="grid">
                <button class="card" data-command="dark">
                    <div class="card-icon">☾</div>
                    <div class="card-title">Velora Dark</div>
                    <div class="card-desc">
                        Calm, elegant colors for focused coding.
                    </div>
                </button>

                <button id="openTextColorStudio">
                    🎨 Open Text Color Studio
                </button>

                <button class="card" data-command="light">
                    <div class="card-icon">☀</div>
                    <div class="card-title">Velora Light</div>
                    <div class="card-desc">
                        Soft, clean colors for daytime work.
                    </div>
                </button>
            </div>
        </section>

        <section class="section">
            <div class="section-title">Typography</div>

            <button class="action" data-command="font">
                <span class="action-icon">Aa</span>
                <div>
                    <div class="action-title">
                        Choose Editor Font
                    </div>
                    <div class="action-desc">
                        Browse Velora typography presets.
                    </div>
                </div>
            </button>
        </section>

        <section class="section">
            <div class="section-title">Workspace</div>

            <button class="action" data-command="icons">
                <span class="action-icon">▦</span>
                <div>
                    <div class="action-title">
                        Velora File Icons
                    </div>
                    <div class="action-desc">
                        Activate minimalist file and folder icons.
                    </div>
                </div>
            </button>

            <button class="action" data-command="focus">
                <span class="action-icon">◈</span>
                <div>
                    <div class="action-title">
                        Toggle Focus Mode
                    </div>
                    <div class="action-desc">
                        Enter or exit distraction-free coding.
                    </div>
                </div>
            </button>
        </section>

        <div class="footer">
            Velora — Make your workspace feel like yours.
        </div>

    </main>

    <script nonce="${nonce}">
        const vscode = acquireVsCodeApi();

        document.getElementById('openTextColorStudio').addEventListener('click', () => {
            vscode.postMessage({
                command: 'openTextColorStudio'
            });
        });

        document.querySelectorAll('[data-command]')
            .forEach(button => {
                button.addEventListener('click', () => {
                    vscode.postMessage({
                        command: button.dataset.command
                    });
                });
            });
    </script>
</body>
</html>`;
}

function getNonce(): string {
    const characters =
        'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';

    let nonce = '';

    for (let i = 0; i < 32; i++) {
        nonce += characters.charAt(
            Math.floor(Math.random() * characters.length)
        );
    }

    return nonce;
}
