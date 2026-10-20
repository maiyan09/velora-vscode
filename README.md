# Velora ✨

**Make your Visual Studio Code workspace feel more personal, beautiful, and comfortable.**

Velora is a VS Code customization extension that brings together elegant color themes, font presets, minimalist file icons, Focus Mode, and an easy-to-use Control Center.

Whether you're new to programming or use VS Code every day, Velora helps you customize your coding environment.

## ✨ Features

- **Dark and Light Themes** — Switch between Velora's color themes.
- **Font Presets** — Choose from different coding and handwriting-inspired fonts.
- **Minimalist File Icons** — Give your Explorer a clean, consistent appearance.
- **Focus Mode** — Reduce distractions while coding.
- **Control Center** — Access Velora's customization options in one place.
- **Welcome Screen** — Get started with Velora after installation.

## 🚀 Installation Guide

There are three ways to install Velora. If you're a beginner, we recommend **Method 1**.

### Method 1: Install from VS Code Marketplace (Recommended)

This is the easiest method. You do not need Git, Node.js, or any programming experience.

**Step 1:** Download and install [Visual Studio Code](https://code.visualstudio.com/) if you haven't already.

**Step 2:** Open VS Code.

**Step 3:** Click the Extensions icon on the left sidebar, or press:

`Ctrl + Shift + X`

**Step 4:** Search for `Velora`.

**Step 5:** Find the extension published by **maiyan09**.

**Step 6:** Click **Install**.

That's it! 🎉 Velora is now installed.

You can open the Command Palette with `Ctrl + Shift + P` and search for `Velora` to find its available commands.

### Method 2: Install from GitHub Releases (.vsix)

This method is useful if you want to install Velora manually.

**Step 1:** Visit the [Velora GitHub Releases page](https://github.com/maiyan09/velora-vscode/releases).

**Step 2:** Open the latest release.

**Step 3:** Under **Assets**, download the file ending in `.vsix`, if one is available.

**Step 4:** Open VS Code.

**Step 5:** Open the Extensions panel using `Ctrl + Shift + X`.

**Step 6:** Click the three-dot menu (`...`) at the top of the Extensions panel.

**Step 7:** Select **Install from VSIX...**.

**Step 8:** Choose the downloaded `.vsix` file.

Velora should now be installed!

**Note:** If no `.vsix` file is available on the Releases page, use Method 1 or follow Method 3 to build it yourself.

### Method 3: Download and Build from GitHub Source Code

This method is intended for developers and anyone interested in exploring or modifying Velora's source code.

#### Step 1: Install the required software

You will need:

- [Visual Studio Code](https://code.visualstudio.com/)
- [Node.js (LTS)](https://nodejs.org/)
- [Git](https://git-scm.com/) (optional if downloading a ZIP)

To check whether Node.js and npm are installed, open a terminal and run:

```bash
node --version
npm --version
```

Both commands should display version numbers.

#### Step 2: Download the project

Open the [Velora GitHub repository](https://github.com/maiyan09/velora-vscode).

Click **Code → Download ZIP**, then extract the downloaded file.

Alternatively, if you have Git installed, run:

```bash
git clone https://github.com/maiyan09/velora-vscode.git
cd velora-vscode
```

If you downloaded the ZIP instead, open a terminal inside the extracted project folder.

#### Step 3: Install dependencies

Run:

```bash
npm install
```

Wait for npm to finish installing the required packages.

#### Step 4: Compile the extension

Run:

```bash
npm run compile
```

This compiles the TypeScript source code.

#### Step 5: Create an installable VSIX package

Run:

```bash
npx @vscode/vsce package
```

A `.vsix` file will be generated in your project directory.

#### Step 6: Install the extension

Open VS Code and navigate to:

**Extensions → ... → Install from VSIX...**

Select the newly generated `.vsix` file.

Congratulations! You have successfully built and installed Velora from source.

## 🎨 How to Use Velora

### Open Velora Commands

1. Open VS Code.
2. Press `Ctrl + Shift + P` (Windows/Linux) or `Cmd + Shift + P` (macOS).
3. Type `Velora`.
4. Select an available command.

### Change the Color Theme

Open the Command Palette and select the Velora theme selection command.

You can also use VS Code's built-in theme picker:

`Ctrl + K`, then `Ctrl + T`

Choose a Velora theme from the list.

### Change Your Font

Open the Command Palette and select Velora's font selection command.

**Important:** Font presets reference fonts installed on your operating system. If a font is not installed, VS Code may display a fallback font instead.

### Enable File Icons

1. Open the Command Palette.
2. Search for `Preferences: File Icon Theme`.
3. Select **Velora File Icons**.

### Use Focus Mode

Open the Command Palette and select Velora's Focus Mode command.

Focus Mode helps reduce distractions by using VS Code's Zen Mode.

### Open the Control Center

Open the Command Palette and select the Velora Control Center command.

Use the available controls to customize your workspace.

## ❓ Troubleshooting

**I cannot find Velora in the Marketplace.**

Check that you're using Visual Studio Code and search for `Velora` or the publisher `maiyan09`.

**I downloaded the GitHub ZIP, but VS Code cannot install it.**

A ZIP containing source code is not the same as a VSIX package. Follow Method 3 to build a `.vsix` file, or install Velora directly from the Marketplace.

**The font I selected is not showing.**

Make sure the font is installed on your computer. Restart VS Code after installing it.

**The build command fails.**

Make sure Node.js and npm are installed. Run `npm install` inside the project folder before compiling.

**The icon theme is not showing.**

Open `Preferences: File Icon Theme` and select **Velora File Icons**.

## 🔄 Updating Velora

If you installed Velora through the Marketplace, VS Code can update it automatically when a newer version is published.

For manual VSIX installations, download a newer `.vsix` package and install it using **Install from VSIX...**.

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome!

1. Fork the [Velora repository](https://github.com/maiyan09/velora-vscode).
2. Create a new branch.
3. Make your changes.
4. Commit your work.
5. Open a Pull Request.

For bugs and feature requests, visit [GitHub Issues](https://github.com/maiyan09/velora-vscode/issues).

## 🔗 Links

- **GitHub:** https://github.com/maiyan09/velora-vscode
- **Releases:** https://github.com/maiyan09/velora-vscode/releases
- **Issues:** https://github.com/maiyan09/velora-vscode/issues
- **Visual Studio Code:** https://code.visualstudio.com/

## 📄 License

See the [LICENSE](LICENSE) file for licensing information.

---

**Made with ❤️ for developers who love a personalized coding experience.**