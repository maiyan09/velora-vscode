
import * as vscode from 'vscode';

export function registerFocusModeCommands(
    context: vscode.ExtensionContext
): void {

    const toggleFocusMode =
        vscode.commands.registerCommand(
            'velora.toggleFocusMode',
            async () => {
                try {
                    await vscode.commands.executeCommand(
                        'workbench.action.toggleZenMode'
                    );
                } catch (error) {
                    vscode.window.showErrorMessage(
                        `Velora Focus Mode failed: ${String(error)}`
                    );
                }
            }
        );

    context.subscriptions.push(toggleFocusMode);
}
