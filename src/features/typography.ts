
import * as vscode from 'vscode';

type FontSetting =
  | 'fontFamily'
  | 'fontSize'
  | 'fontLigatures'
  | 'lineHeight';

interface FontPreset {
  label: string;
  description: string;
  family: string;
  size: number;
  ligatures: boolean;
  lineHeight: number;
}

type SavedValue =
  | { exists: true; value: unknown }
  | { exists: false };

type FontBackup = Record<FontSetting, SavedValue>;

const BACKUP_KEY = 'velora.typographyBackup.v2';

const fontPresets: FontPreset[] = [
  {
    label: 'Velora Mono — Signature',
    description: 'Cascadia Code-based signature preset',
    family: "'Cascadia Code', Consolas, monospace",
    size: 15,
    ligatures: true,
    lineHeight: 24
  },
  {
    label: 'Velora Sketch — Handwriting',
    description: 'Caveat | Casual handwriting',
    family: "'Caveat', Consolas, monospace",
    size: 22,
    ligatures: false,
    lineHeight: 34
  },
  {
    label: 'Velora Ink — Artistic',
    description: 'Kalam | Artistic handwritten style',
    family: "'Kalam', Consolas, monospace",
    size: 18,
    ligatures: false,
    lineHeight: 29
  },
  {
    label: 'Velora Script — Calligraphy',
    description: 'Dancing Script | Elegant calligraphy',
    family: "'Dancing Script', Consolas, monospace",
    size: 21,
    ligatures: false,
    lineHeight: 33
  },
  {
    label: 'JetBrains Mono',
    description: 'Professional programming font',
    family: "'JetBrains Mono', Consolas, monospace",
    size: 14,
    ligatures: true,
    lineHeight: 23
  },
  {
    label: 'Fira Code',
    description: 'Programming font with ligatures',
    family: "'Fira Code', Consolas, monospace",
    size: 14,
    ligatures: true,
    lineHeight: 23
  },
  {
    label: 'Cascadia Code',
    description: 'Microsoft coding font',
    family: "'Cascadia Code', Consolas, monospace",
    size: 14,
    ligatures: true,
    lineHeight: 22
  },
  {
    label: 'Consolas',
    description: 'Classic monospace font',
    family: 'Consolas, monospace',
    size: 14,
    ligatures: false,
    lineHeight: 22
  },
  {
    label: 'Velora Pangolin — Soft Handwriting',
    description: 'Rounded, playful handwriting style',
    family: "'Pangolin', Consolas, monospace",
    size: 19,
    ligatures: false,
    lineHeight: 30
  },
  {
    label: 'Velora Patrick — Natural Handwriting',
    description: 'Clean and natural handwritten style',
    family: "'Patrick Hand', Consolas, monospace",
    size: 20,
    ligatures: false,
    lineHeight: 31
  },

];

const fontKeys: FontSetting[] = [
  'fontFamily',
  'fontSize',
  'fontLigatures',
  'lineHeight'
];

function getGlobalBackup(): FontBackup {
  const config = vscode.workspace.getConfiguration('editor');
  const backup = {} as FontBackup;

  for (const key of fontKeys) {
    const inspected = config.inspect(key);

    if (inspected?.globalValue !== undefined) {
      backup[key] = {
        exists: true,
        value: inspected.globalValue
      };
    } else {
      backup[key] = {
        exists: false
      };
    }
  }

  return backup;
}

async function applyValues(
  values: Record<FontSetting, unknown>
): Promise<void> {
  const config = vscode.workspace.getConfiguration('editor');

  for (const key of fontKeys) {
    await config.update(
      key,
      values[key],
      vscode.ConfigurationTarget.Global
    );
  }
}

async function restoreValues(
  backup: FontBackup
): Promise<void> {
  const config = vscode.workspace.getConfiguration('editor');

  for (const key of fontKeys) {
    const saved = backup[key];

    await config.update(
      key,
      saved.exists ? saved.value : undefined,
      vscode.ConfigurationTarget.Global
    );
  }
}

export function registerTypographyCommands(
  context: vscode.ExtensionContext
): void {

  const selectFont = vscode.commands.registerCommand(
    'velora.selectFont',
    async () => {
      const selected = await vscode.window.showQuickPick(
        fontPresets.map(preset => ({
          label: preset.label,
          description: preset.description,
          preset
        })),
        {
          placeHolder: 'Select your Velora font style'
        }
      );

      if (!selected) {
        return;
      }

      const preset = selected.preset;

      const values: Record<FontSetting, unknown> = {
        fontFamily: preset.family,
        fontSize: preset.size,
        fontLigatures: preset.ligatures,
        lineHeight: preset.lineHeight
      };

      // Preserve the original global settings only once.
      const existingBackup =
        context.globalState.get<FontBackup>(BACKUP_KEY);

      const backup = existingBackup ?? getGlobalBackup();

      try {
        if (!existingBackup) {
          await context.globalState.update(
            BACKUP_KEY,
            backup
          );
        }

        await applyValues(values);

        vscode.window.showInformationMessage(
          `${preset.label} applied successfully!`
        );
      } catch (error) {
        vscode.window.showErrorMessage(
          `Font preset failed: ${String(error)}`
        );
      }
    }
  );

  const restoreFont = vscode.commands.registerCommand(
    'velora.restoreFont',
    async () => {
      const backup =
        context.globalState.get<FontBackup>(BACKUP_KEY);

      if (!backup) {
        vscode.window.showInformationMessage(
          'No typography backup available.'
        );
        return;
      }

      try {
        await restoreValues(backup);

        await context.globalState.update(
          BACKUP_KEY,
          undefined
        );

        vscode.window.showInformationMessage(
          'Original global font settings restored!'
        );
      } catch (error) {
        vscode.window.showErrorMessage(
          `Restore failed: ${String(error)}`
        );
      }
    }
  );

  context.subscriptions.push(
    selectFont,
    restoreFont
  );
}
