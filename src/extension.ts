
import * as vscode from 'vscode';

import { registerTypographyCommands } from './features/typography';
import { registerThemeCommands } from './features/themeSwitcher';
import { registerFocusModeCommands } from './features/focusMode';
import { registerControlCenter } from './features/controlCenter';
import {
    registerWelcomeScreen,
    showWelcomeOnFirstRun
} from './features/welcomeScreen';

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
  registerFocusModeCommands(context);
  registerControlCenter(context);
  registerWelcomeScreen(context);

  void showWelcomeOnFirstRun(context).catch(error => {
      console.error('Velora welcome screen failed:', error);
  });

  console.log('Velora commands registered successfully!');
}

export function deactivate(): void {}
