
import * as vscode from 'vscode';

import { registerTypographyCommands } from './features/typography';
import { registerThemeCommands } from './features/themeSwitcher';

export function activate(
  context: vscode.ExtensionContext
): void {
  console.log('Velora extension activated!');

  const welcome = vscode.commands.registerCommand(
    'velora.welcome',
    () => {
      vscode.window.showInformationMessage(
        'Welcome to Velora! Your minimal coding experience starts here.'
      );
    }
  );

  context.subscriptions.push(welcome);

  // Register typography features
  registerTypographyCommands(context);

  // Register theme switching features
  registerThemeCommands(context);

  console.log('Velora commands registered successfully!');
}

export function deactivate(): void {}
