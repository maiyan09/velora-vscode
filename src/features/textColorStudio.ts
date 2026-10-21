
import * as vscode from 'vscode';
import { randomBytes } from 'crypto';

type ColorKey =
  | 'keyword'
  | 'string'
  | 'function'
  | 'comment'
  | 'normal';

type Palette = Record<ColorKey, string>;

const DEFAULT_COLORS: Palette = {
  keyword: '#C792EA',
  string: '#C3E88D',
  function: '#82AAFF',
  comment: '#7F8C98',
  normal: '#E4E8F2'
};

const STORAGE_KEY = 'velora.textColorStudio.v1';

const SCOPES: Record<Exclude<ColorKey, 'normal'>, string[]> = {
  keyword: ['keyword', 'storage.type', 'storage.modifier'],
  string: ['string'],
  function: ['entity.name.function', 'support.function'],
  comment: ['comment'],
};

const RULE_PREFIX = 'Velora Text Color Studio: ';

function isHexColor(value: unknown): value is string {
  return (
    typeof value === 'string' &&
    /^#[0-9a-fA-F]{6}$/.test(value)
  );
}

function validatePalette(value: unknown): Palette | undefined {
  if (!value || typeof value !== 'object') {
    return undefined;
  }

  const input = value as Record<string, unknown>;
  const keys: ColorKey[] = [
    'keyword', 'string', 'function', 'comment', 'normal'
  ];

  if (!keys.every(key => isHexColor(input[key]))) {
    return undefined;
  }

  return {
    keyword: input.keyword as string,
    string: input.string as string,
    function: input.function as string,
    comment: input.comment as string,
    normal: input.normal as string
  };
}

function cloneObject(value: unknown): Record<string, any> {
  if (!value || typeof value !== 'object' || Array.isArray(value)) {
    return {};
  }
  return JSON.parse(JSON.stringify(value));
}

function getCurrentPalette(
  context: vscode.ExtensionContext
): Palette {
  return context.globalState.get<Palette>(
    STORAGE_KEY,
    DEFAULT_COLORS
  );
}

async function applyPalette(
  context: vscode.ExtensionContext,
  palette: Palette
): Promise<void> {
  const editorConfig = vscode.workspace.getConfiguration('editor');
  const workbenchConfig = vscode.workspace.getConfiguration('workbench');

  // Preserve unrelated syntax customization rules.
  const existingTokenSettings = cloneObject(
    editorConfig.get('tokenColorCustomizations')
  );

  const existingRules: any[] = Array.isArray(
    existingTokenSettings.textMateRules
  )
    ? existingTokenSettings.textMateRules
    : [];

  const otherRules = existingRules.filter(
    rule =>
      typeof rule?.name !== 'string' ||
      !rule.name.startsWith(RULE_PREFIX)
  );

  const newRules = (
    Object.keys(SCOPES) as Array<Exclude<ColorKey, 'normal'>>
  ).map(key => ({
    name: RULE_PREFIX + key,
    scope: SCOPES[key],
    settings: {
      foreground: palette[key]
    }
  }));

  existingTokenSettings.textMateRules = [
    ...otherRules,
    ...newRules
  ];

  await editorConfig.update(
    'tokenColorCustomizations',
    existingTokenSettings,
    vscode.ConfigurationTarget.Global
  );

  // Normal editor text color.
  const existingWorkbenchSettings = cloneObject(
    workbenchConfig.get('colorCustomizations')
  );

  existingWorkbenchSettings['editor.foreground'] = palette.normal;

  await workbenchConfig.update(
    'colorCustomizations',
    existingWorkbenchSettings,
    vscode.ConfigurationTarget.Global
  );

  await context.globalState.update(STORAGE_KEY, palette);
}

async function resetPalette(
  context: vscode.ExtensionContext
): Promise<void> {
  const editorConfig = vscode.workspace.getConfiguration('editor');
  const workbenchConfig = vscode.workspace.getConfiguration('workbench');

  const tokenSettings = cloneObject(
    editorConfig.get('tokenColorCustomizations')
  );

  if (Array.isArray(tokenSettings.textMateRules)) {
    tokenSettings.textMateRules =
      tokenSettings.textMateRules.filter(
        (rule: any) =>
          typeof rule?.name !== 'string' ||
          !rule.name.startsWith(RULE_PREFIX)
      );
  }

  await editorConfig.update(
    'tokenColorCustomizations',
    tokenSettings,
    vscode.ConfigurationTarget.Global
  );

  const colorSettings = cloneObject(
    workbenchConfig.get('colorCustomizations')
  );

  // Only remove normal-text override when it matches
  // the color last applied by Velora.
  const previous = context.globalState.get<Palette>(STORAGE_KEY);

  if (
    previous &&
    colorSettings['editor.foreground'] === previous.normal
  ) {
    delete colorSettings['editor.foreground'];
  }

  await workbenchConfig.update(
    'colorCustomizations',
    colorSettings,
    vscode.ConfigurationTarget.Global
  );

  await context.globalState.update(STORAGE_KEY, undefined);
}

function getHtml(
  webview: vscode.Webview,
  palette: Palette
): string {
  const nonce = randomBytes(16).toString('hex');
  const safePalette = JSON.stringify(palette)
    .replace(/</g, '\\u003c');

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport"
        content="width=device-width, initial-scale=1.0">
  <meta http-equiv="Content-Security-Policy"
        content="default-src 'none';
                 style-src 'nonce-${nonce}';
                 script-src 'nonce-${nonce}';">
  <title>Velora Text Color Studio</title>
  <style nonce="${nonce}">
    * { box-sizing: border-box; }

    body {
      margin: 0;
      padding: 28px;
      font-family: var(--vscode-font-family);
      color: var(--vscode-foreground);
      background: var(--vscode-editor-background);
    }

    .container {
      max-width: 850px;
      margin: auto;
    }

    h1 {
      margin-bottom: 6px;
      font-size: 27px;
    }

    .subtitle {
      opacity: 0.7;
      margin-bottom: 24px;
      line-height: 1.6;
    }

    .panel {
      border: 1px solid var(--vscode-panel-border);
      border-radius: 12px;
      padding: 20px;
      margin-bottom: 20px;
    }

    h2 { font-size: 16px; margin-top: 0; }

    .preview {
      background: #171923;
      color: #E4E8F2;
      border-radius: 10px;
      padding: 20px;
      font-family: Consolas, monospace;
      font-size: 15px;
      line-height: 1.9;
      overflow-x: auto;
    }

    .filename {
      font-size: 12px;
      color: #9099AF;
      margin-bottom: 10px;
    }

    .line { white-space: pre; }

    .grid {
      display: grid;
      grid-template-columns: repeat(
        auto-fit, minmax(210px, 1fr)
      );
      gap: 14px;
    }

    .color-row {
      display: flex;
      align-items: center;
      gap: 12px;
      border: 1px solid var(--vscode-panel-border);
      padding: 12px;
      border-radius: 9px;
    }

    input[type="color"] {
      width: 45px;
      height: 38px;
      padding: 2px;
      border: none;
      cursor: pointer;
      background: transparent;
    }

    .field { flex: 1; min-width: 0; }

    label {
      display: block;
      margin-bottom: 5px;
      font-size: 13px;
      font-weight: 600;
    }

    input[type="text"] {
      width: 100%;
      padding: 8px;
      border-radius: 5px;
      border: 1px solid var(--vscode-input-border);
      color: var(--vscode-input-foreground);
      background: var(--vscode-input-background);
    }

    .actions {
      display: flex;
      flex-wrap: wrap;
      gap: 10px;
    }

    button {
      padding: 11px 17px;
      border: none;
      border-radius: 7px;
      cursor: pointer;
      background: var(--vscode-button-background);
      color: var(--vscode-button-foreground);
    }

    button:hover {
      background: var(--vscode-button-hoverBackground);
    }

    button.secondary {
      background: var(--vscode-button-secondaryBackground);
      color: var(--vscode-button-secondaryForeground);
    }

    #status {
      min-height: 24px;
      margin-top: 15px;
      opacity: 0.8;
    }

    .hint {
      font-size: 12px;
      opacity: 0.7;
      line-height: 1.6;
    }
  </style>
</head>
<body>
  <main class="container">
    <h1>🎨 Velora Text Color Studio</h1>
    <p class="subtitle">
      Personalize your code colors. Preview your palette
      before applying it to VS Code.
    </p>

    <section class="panel">
      <h2>Live Preview</h2>
      <div class="preview">
        <div class="filename">example.py</div>
        <div class="line"><span data-preview="keyword">def</span> <span data-preview="function">greet</span><span data-preview="normal">(name):</span></div>
        <div class="line"><span data-preview="comment">    # Welcome to Velora</span></div>
        <div class="line"><span data-preview="normal">    message = </span><span data-preview="string">"Hello, world!"</span></div>
        <div class="line"><span data-preview="keyword">    return</span><span data-preview="normal"> message</span></div>
      </div>
    </section>

    <section class="panel">
      <h2>Customize Colors</h2>
      <div class="grid" id="colorGrid"></div>
    </section>

    <div class="actions">
      <button id="apply">Apply Colors</button>
      <button class="secondary" id="defaults">
        Load Suggested Palette
      </button>
      <button class="secondary" id="reset">
        Reset Velora Overrides
      </button>
    </div>

    <p id="status" role="status" aria-live="polite"></p>

    <p class="hint">
      Changes are applied to your global VS Code settings.
      Workspace-specific or language-specific settings may
      take precedence. Semantic highlighting may also override
      some syntax colors.
    </p>
  </main>

  <script nonce="${nonce}">
    const vscode = acquireVsCodeApi();

    const defaults = ${JSON.stringify(DEFAULT_COLORS)};
    let palette = ${safePalette};

    const labels = {
      keyword: 'Keywords',
      string: 'Strings',
      function: 'Functions',
      comment: 'Comments',
      normal: 'Normal Text'
    };

    const grid = document.getElementById('colorGrid');
    const status = document.getElementById('status');

    function validHex(value) {
      return /^#[0-9a-fA-F]{6}$/.test(value);
    }

    function renderControls() {
      grid.replaceChildren();

      for (const key of Object.keys(labels)) {
        const row = document.createElement('div');
        row.className = 'color-row';

        const picker = document.createElement('input');
        picker.type = 'color';
        picker.value = palette[key];
        picker.setAttribute('aria-label', labels[key] + ' color');

        const field = document.createElement('div');
        field.className = 'field';

        const label = document.createElement('label');
        label.textContent = labels[key];

        const text = document.createElement('input');
        text.type = 'text';
        text.value = palette[key];
        text.maxLength = 7;

        picker.addEventListener('input', () => {
          palette[key] = picker.value;
          text.value = picker.value;
          renderPreview();
        });

        text.addEventListener('input', () => {
          if (validHex(text.value)) {
            palette[key] = text.value;
            picker.value = text.value;
            renderPreview();
          }
        });

        field.append(label, text);
        row.append(picker, field);
        grid.append(row);
      }
    }

    function renderPreview() {
      for (const element of document.querySelectorAll(
        '[data-preview]'
      )) {
        const key = element.getAttribute('data-preview');
        element.style.color = palette[key];
      }
    }

    document.getElementById('apply').addEventListener(
      'click',
      () => {
        status.textContent = 'Applying colors...';
        vscode.postMessage({
          type: 'apply',
          palette
        });
      }
    );

    document.getElementById('defaults').addEventListener(
      'click',
      () => {
        palette = { ...defaults };
        renderControls();
        renderPreview();
        status.textContent =
          'Suggested palette loaded. Click Apply Colors to save.';
      }
    );

    document.getElementById('reset').addEventListener(
      'click',
      () => {
        vscode.postMessage({ type: 'reset' });
      }
    );

    window.addEventListener('message', event => {
      const message = event.data;

      if (message.type === 'success') {
        status.textContent = message.text;
      }

      if (message.type === 'resetDone') {
        palette = { ...defaults };
        renderControls();
        renderPreview();
        status.textContent = 'Velora overrides removed.';
      }

      if (message.type === 'error') {
        status.textContent = message.text;
      }
    });

    renderControls();
    renderPreview();
  </script>
</body>
</html>`;
}

export function registerTextColorStudio(
  context: vscode.ExtensionContext
): void {
  const disposable = vscode.commands.registerCommand(
    'velora.openTextColorStudio',
    () => {
      const panel = vscode.window.createWebviewPanel(
        'veloraTextColorStudio',
        'Velora Text Color Studio',
        vscode.ViewColumn.One,
        {
          enableScripts: true,
          retainContextWhenHidden: true
        }
      );

      panel.webview.html = getHtml(
        panel.webview,
        getCurrentPalette(context)
      );

      panel.webview.onDidReceiveMessage(
        async message => {
          try {
            if (message.type === 'apply') {
              const palette = validatePalette(message.palette);

              if (!palette) {
                throw new Error('Invalid color values.');
              }

              await applyPalette(context, palette);

              await panel.webview.postMessage({
                type: 'success',
                text: 'Colors applied successfully!'
              });

              vscode.window.showInformationMessage(
                'Velora: Text colors updated!'
              );
            }

            if (message.type === 'reset') {
              await resetPalette(context);

              await panel.webview.postMessage({
                type: 'resetDone'
              });

              vscode.window.showInformationMessage(
                'Velora: Text color overrides reset.'
              );
            }
          } catch (error) {
            const text = error instanceof Error
              ? error.message
              : String(error);

            await panel.webview.postMessage({
              type: 'error',
              text
            });
          }
        },
        undefined,
        context.subscriptions
      );
    }
  );

  context.subscriptions.push(disposable);
}
