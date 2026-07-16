#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const os = require('os');

const COLORS = {
  red: '\x1b[0;31m',
  green: '\x1b[0;32m',
  yellow: '\x1b[1;33m',
  blue: '\x1b[0;34m',
  reset: '\x1b[0m',
};

const PKG_ROOT = path.resolve(__dirname, '..');
const THEMES_DIR = path.join(PKG_ROOT, 'themes');

function defaultWarpThemesDir() {
  if (process.platform === 'win32') {
    // Windows 下 Warp 主题目录与 macOS/Linux（~/.warp/themes）不同
    const appData = process.env.APPDATA || path.join(os.homedir(), 'AppData', 'Roaming');
    return path.join(appData, 'warp', 'Warp', 'data', 'themes');
  }
  return path.join(os.homedir(), '.warp', 'themes');
}

const WARP_THEMES_DIR = process.env.WARP_THEMES_DIR || defaultWarpThemesDir();

function log(color, message) {
  console.log(`${COLORS[color] || ''}${message}${COLORS.reset}`);
}

function getAvailableThemes() {
  if (!fs.existsSync(THEMES_DIR)) {
    return [];
  }
  return fs
    .readdirSync(THEMES_DIR)
    .filter((file) => file.endsWith('.yaml'))
    .map((file) => file.slice(0, -5))
    .sort();
}

function resolveThemeName(name) {
  const available = getAvailableThemes();
  const exact = available.find((t) => t === name);
  if (exact) return exact;
  const lower = name.toLowerCase();
  const match = available.find((t) => t.toLowerCase() === lower);
  return match || name;
}

function usage() {
  console.log(`Usage: omwp <command> [theme...]

Commands:
  install [theme...]   Install themes (default: all)
  update [theme...]    Update/re-install themes (default: all)
  uninstall [theme...] Uninstall themes
  list                 List available themes
  help                 Show this help message

Aliases:
  -h, --help           Show this help message

Environment variables:
  WARP_THEMES_DIR      Destination directory (default: ~/.warp/themes;
                       %APPDATA%\\warp\\Warp\\data\\themes on Windows)

Examples:
  npx omwp install                    # Install all themes
  npx omwp install github-dark        # Install only github-dark
  npx omwp update github-dark         # Update github-dark
  npx omwp uninstall github-light     # Remove github-light
  npx omwp list                       # List available themes`);
}

function ensureDir(dir) {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir, { recursive: true });
  }
}

function installTheme(theme) {
  const src = path.join(THEMES_DIR, `${theme}.yaml`);
  const dst = path.join(WARP_THEMES_DIR, `${theme}.yaml`);

  if (!fs.existsSync(src)) {
    log('red', `✗ Theme not found: ${theme}`);
    return false;
  }

  ensureDir(WARP_THEMES_DIR);
  fs.copyFileSync(src, dst);
  log('green', `✓ Installed: ${theme}`);
  return true;
}

function updateTheme(theme) {
  const dst = path.join(WARP_THEMES_DIR, `${theme}.yaml`);
  if (!fs.existsSync(dst)) {
    log('yellow', `⚠ Not installed yet, installing: ${theme}`);
  }
  return installTheme(theme);
}

function uninstallTheme(theme) {
  const dst = path.join(WARP_THEMES_DIR, `${theme}.yaml`);

  if (!fs.existsSync(dst)) {
    log('red', `✗ Not installed: ${theme}`);
    return false;
  }

  fs.unlinkSync(dst);
  log('yellow', `✓ Removed: ${theme}`);
  return true;
}

function listThemes() {
  const themes = getAvailableThemes();
  if (themes.length === 0) {
    log('yellow', 'No themes found.');
    return;
  }
  log('blue', 'Available themes:');
  for (const theme of themes) {
    console.log(`  • ${theme}`);
  }
}

function runCommand(command, themes) {
  const available = getAvailableThemes();

  if (available.length === 0) {
    log('red', `No themes found in ${THEMES_DIR}`);
    process.exit(1);
  }

  const targetThemes = themes.length > 0 ? themes.map(resolveThemeName) : available;

  let ok = 0;
  for (const theme of targetThemes) {
    if (command === 'install') {
      if (installTheme(theme)) ok += 1;
    } else if (command === 'update') {
      if (updateTheme(theme)) ok += 1;
    } else if (command === 'uninstall') {
      if (uninstallTheme(theme)) ok += 1;
    }
  }

  const actionWord = command === 'uninstall' ? 'removed' : 'installed/updated';
  log('blue', `\n${ok} theme(s) ${actionWord}.`);
  if (command !== 'uninstall') {
    log('blue', 'Open Warp → Settings → Appearance → Theme to select your theme.');
  }
}

function main() {
  const args = process.argv.slice(2);

  if (args.length === 0 || args[0] === 'help' || args[0] === '--help' || args[0] === '-h') {
    usage();
    process.exit(args.length === 0 ? 1 : 0);
  }

  const command = args[0];
  const themes = args.slice(1);

  switch (command) {
    case 'install':
    case 'i':
      runCommand('install', themes);
      break;
    case 'update':
    case 'u':
      runCommand('update', themes);
      break;
    case 'uninstall':
    case 'remove':
    case 'rm':
      runCommand('uninstall', themes);
      break;
    case 'list':
    case 'ls':
      listThemes();
      break;
    default:
      log('red', `Unknown command: ${command}`);
      usage();
      process.exit(1);
  }
}

main();
