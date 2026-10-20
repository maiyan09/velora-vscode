
import * as vscode from 'vscode';
import * as crypto from 'crypto';

const WELCOME_SHOWN_KEY = 'velora.welcomeShown.v1';

type WelcomeMessage = {
    command?: string;
};

export function registerWelcomeScreen(
    context: vscode.ExtensionContext
): void {

    const openWelcome = vscode.commands.registerCommand(
        'velora.openWelcome',
        () => {
            showWelcomePanel(context);
        }
    );

    const resetOnboarding = vscode.commands.registerCommand(
        'velora.resetOnboarding',
        async () => {
            await context.globalState.update(
                WELCOME_SHOWN_KEY,
                false
            );

            vscode.window.showInformationMessage(
                'Velora onboarding reset. Welcome will appear on the next activation.'
            );
        }
    );

    context.subscriptions.push(
        openWelcome,
        resetOnboarding
    );
}

export async function showWelcomeOnFirstRun(
    context: vscode.ExtensionContext
): Promise<void> {

    const alreadyShown = context.globalState.get<boolean>(
        WELCOME_SHOWN_KEY,
        false
    );

    if (alreadyShown) {
        return;
    }

    // Mark first, so multiple activations do not
    // open duplicate welcome panels.
    await context.globalState.update(
        WELCOME_SHOWN_KEY,
        true
    );

    showWelcomePanel(context);
}

function showWelcomePanel(
    context: vscode.ExtensionContext
): void {

    const panel = vscode.window.createWebviewPanel(
        'veloraWelcome',
        'Welcome to Velora',
        vscode.ViewColumn.One,
        {
            enableScripts: true,
            retainContextWhenHidden: true
        }
    );

    panel.webview.html = getWelcomeHtml();

    panel.webview.onDidReceiveMessage(
        async (message: WelcomeMessage) => {

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

                    case 'icons':
                        await vscode.workspace
                            .getConfiguration('workbench')
                            .update(
                                'iconTheme',
                                'velora-file-icons',
                                vscode.ConfigurationTarget.Global
                            );
                        break;

                    case 'font':
                        await vscode.commands.executeCommand(
                            'velora.selectFont'
                        );
                        break;

                    case 'controlCenter':
                        await vscode.commands.executeCommand(
                            'velora.openControlCenter'
                        );
                        break;

                    case 'done':
                        panel.dispose();
                        break;

                    default:
                        return;
                }

            } catch (error) {
                vscode.window.showErrorMessage(
                    `Velora onboarding: ${String(error)}`
                );
            }
        },
        undefined,
        context.subscriptions
    );
}

function getWelcomeHtml(): string {

    const nonce = crypto.randomBytes(16).toString('hex');

    return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport"
          content="width=device-width, initial-scale=1.0">

    <meta http-equiv="Content-Security-Policy"
          content="
            default-src 'none';
            style-src 'nonce-${nonce}';
            script-src 'nonce-${nonce}';
          ">

    <title>Welcome to Velora</title>

    <style nonce="${nonce}">
        * {
            box-sizing: border-box;
        }

        body {
            margin: 0;
            padding: 40px 24px;
            font-family: var(--vscode-font-family);
            background: var(--vscode-editor-background);
            color: var(--vscode-editor-foreground);
        }

        .container {
            max-width: 760px;
            margin: 0 auto;
        }

        .hero {
            text-align: center;
            padding: 36px 10px;
        }

        .logo {
            display: grid;
            place-items: center;
            width: 72px;
            height: 72px;
            margin: 0 auto 22px;
            border-radius: 22px;
            background: var(--vscode-button-secondaryBackground);
            font-size: 38px;
        }

        h1 {
            margin: 0;
            font-size: 34px;
            letter-spacing: -.8px;
        }

        .subtitle {
            color: var(--vscode-descriptionForeground);
            font-size: 15px;
            line-height: 1.7;
        }

        .section {
            margin: 28px 0;
        }

        .section-title {
            margin-bottom: 14px;
            font-size: 12px;
            font-weight: 700;
            letter-spacing: 1.5px;
            text-transform: uppercase;
            color: var(--vscode-descriptionForeground);
        }

        .grid {
            display: grid;
            grid-template-columns: repeat(2, minmax(0, 1fr));
            gap: 14px;
        }

        button {
            font: inherit;
            cursor: pointer;
        }

        .card {
            padding: 22px;
            text-align: left;
            border: 1px solid var(--vscode-panel-border);
            border-radius: 14px;
            background: var(--vscode-sideBar-background);
            color: inherit;
            transition: border-color .15s ease;
        }

        .card:hover {
            border-color: var(--vscode-focusBorder);
        }

        button:focus-visible {
            outline: 2px solid var(--vscode-focusBorder);
            outline-offset: 2px;
        }

        .card-icon {
            font-size: 28px;
            margin-bottom: 14px;
        }

        .card-title {
            font-weight: 650;
            font-size: 16px;
            margin-bottom: 7px;
        }

        .card-desc {
            font-size: 12px;
            line-height: 1.6;
            color: var(--vscode-descriptionForeground);
        }

        .action {
            width: 100%;
            display: flex;
            gap: 15px;
            align-items: center;
            padding: 19px;
            margin-bottom: 12px;
            border: 1px solid var(--vscode-panel-border);
            border-radius: 12px;
            background: var(--vscode-sideBar-background);
            color: inherit;
            text-align: left;
        }

        .action:hover {
            border-color: var(--vscode-focusBorder);
        }

        .action-icon {
            font-size: 24px;
        }

        .action-title {
            font-size: 14px;
            font-weight: 650;
        }

        .action-desc {
            font-size: 12px;
            margin-top: 5px;
            color: var(--vscode-descriptionForeground);
        }

        .primary {
            width: 100%;
            padding: 15px;
            margin-top: 20px;
            border: none;
            border-radius: 10px;
            background: var(--vscode-button-background);
            color: var(--vscode-button-foreground);
            font-weight: 650;
        }

        .primary:hover {
            background: var(--vscode-button-hoverBackground);
        }

        .secondary {
            width: 100%;
            padding: 13px;
            margin-top: 12px;
            border: 1px solid var(--vscode-panel-border);
            border-radius: 10px;
            background: transparent;
            color: inherit;
        }

        .footer {
            margin-top: 35px;
            text-align: center;
            color: var(--vscode-descriptionForeground);
            font-size: 12px;
        }

        @media (max-width: 520px) {
            .grid {
                grid-template-columns: 1fr;
            }

            h1 {
                font-size: 27px;
            }
        }
    </style>
</head>

<body>
    <main class="container">

        <section class="hero">
            <div class="logo">✦</div>

            <h1>Welcome to Velora</h1>

            <p class="subtitle">
                A calmer, more personal coding experience.
                <br>
                Let's make your workspace feel like yours.
            </p>
        </section>

        <section class="section">
            <div class="section-title">
                01 / Choose your color theme
            </div>

            <div class="grid">
                <button class="card" data-command="dark">
                    <div class="card-icon">☾</div>
                    <div class="card-title">Velora Dark</div>
                    <div class="card-desc">
                        Calm colors for late-night coding.
                    </div>
                </button>

                <button class="card" data-command="light">
                    <div class="card-icon">☀</div>
                    <div class="card-title">Velora Light</div>
                    <div class="card-desc">
                        A soft, bright coding environment.
                    </div>
                </button>
            </div>
        </section>

        <section class="section">
            <div class="section-title">
                02 / Personalize your workspace
            </div>

            <button class="action" data-command="icons">
                <span class="action-icon">▦</span>
                <span>
                    <div class="action-title">
                        Enable Velora File Icons
                    </div>
                    <div class="action-desc">
                        Apply minimalist file and folder icons.
                    </div>
                </span>
            </button>

            <button class="action" data-command="font">
                <span class="action-icon">Aa</span>
                <span>
                    <div class="action-title">
                        Choose Editor Font
                    </div>
                    <div class="action-desc">
                        Select from your available font presets.
                    </div>
                </span>
            </button>
        </section>

        <section class="section">
            <div class="section-title">
                03 / You're ready
            </div>

            <button class="primary" data-command="done">
                Start Coding →
            </button>

            <button class="secondary"
                    data-command="controlCenter">
                Open Appearance Control Center
            </button>
        </section>

        <div class="footer">
            Velora — Designed for a more beautiful workspace.
        </div>

    </main>

    <script nonce="${nonce}">
        const vscode = acquireVsCodeApi();

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
