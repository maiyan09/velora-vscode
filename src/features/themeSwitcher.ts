
import * as vscode from 'vscode';

export function registerThemeCommands(
  context: vscode.ExtensionContext
): void {

  const darkTheme = vscode.commands.registerCommand(
    'velora.darkTheme',
    async () => {
      await applyTheme('Velora Dark');
    }
  );

  const lightTheme = vscode.commands.registerCommand(
    'velora.lightTheme',
    async () => {
      await applyTheme('Velora Light');
    }
  );

  const selectTheme = vscode.commands.registerCommand(
    'velora.selectTheme',
    async () => {
      const choice = await vscode.window.showQuickPick(
        [
          {
            label: '$(moon) Velora Dark',
            description: 'Minimal dark coding experience',
            theme: 'Velora Dark'
          },
          {
            label: '$(sun) Velora Light',
            description: 'Clean light coding experience',
            theme: 'Velora Light'
          }
        ],
        {
          placeHolder: 'Select your Velora theme'
        }
      );

      if (choice) {
        await applyTheme(choice.theme);
      }
    }
  );

  context.subscriptions.push(
    darkTheme,
    lightTheme,
    selectTheme
  );
}

async function applyTheme(themeName: string): Promise<void> {
  try {
    const config = vscode.workspace.getConfiguration('workbench');

    await config.update(
      'colorTheme',
      themeName,
      vscode.ConfigurationTarget.Global
    );

    vscode.window.showInformationMessage(
      `${themeName} activated successfully!`
    );
  } catch (error) {
    vscode.window.showErrorMessage(
      `Unable to apply theme: ${String(error)}`
    );
  }
}
