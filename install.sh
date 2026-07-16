#!/usr/bin/env bash

set -euo pipefail

if [[ -n "${BASH_SOURCE[0]:-}" ]]; then
  SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
else
  SCRIPT_DIR="$(pwd)"
fi
LOCAL_THEMES_DIR="$SCRIPT_DIR/themes"
# Windows（Git Bash/MSYS）下 Warp 主题目录与 macOS/Linux 不同
if [[ -z "${WARP_THEMES_DIR:-}" ]]; then
  case "${OSTYPE:-}" in
    msys*|cygwin*|win32*)
      WARP_THEMES_DIR="${APPDATA:-$HOME/AppData/Roaming}/warp/Warp/data/themes"
      ;;
    *)
      WARP_THEMES_DIR="$HOME/.warp/themes"
      ;;
  esac
fi

# Remote repository used when the script is executed via curl | bash.
# Format: "github-username/repo-name"
PLACEHOLDER_REPO="your-username/oh-my-warp-palette"
DEFAULT_REMOTE_REPO="erub1t/oh-my-warp-palette"
REMOTE_REPO="${REMOTE_REPO:-$DEFAULT_REMOTE_REPO}"
force_remote=false

RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m'

BUILTIN_THEMES=(
  april
  cocoa-cream
  github-dark
  github-dark-dimmed
  github-light
  milk-tea
  muted-forest
  pastel-dawn
  twilight-slate
)

usage() {
  cat <<EOF
Usage: $(basename "$0") [OPTIONS] [THEME_NAME...]

Install Warp themes to $WARP_THEMES_DIR.

In local mode (default), themes are copied from the ./themes directory next to
this script. In remote mode, themes are downloaded from GitHub via curl.

Options:
  -a, --all       Install all available themes (default)
  -l, --list      List available themes
  -u, --uninstall Remove installed themes
  -r, --remote    Force remote installation from GitHub
  -h, --help      Show this help message

Environment variables:
  REMOTE_REPO     Override the GitHub repo to download from (default is set in script)
                  Example: REMOTE_REPO=yourname/oh-my-warp-palette
  WARP_THEMES_DIR Destination directory (default: ~/.warp/themes;
                  %APPDATA%\warp\Warp\data\themes on Windows)

Examples:
  $(basename "$0")                              # Install all themes locally
  $(basename "$0") github-dark                  # Install only github-dark locally
  $(basename "$0") -r                           # Install all themes from GitHub
  $(basename "$0") -r github-light              # Install github-light from GitHub
  $(basename "$0") -l                           # List available themes
  $(basename "$0") -u github-light              # Uninstall github-light

Remote install (after pushing to GitHub):
  curl -fsSL https://raw.githubusercontent.com/erub1t/oh-my-warp-palette/main/install.sh | bash

Remote install single theme:
  curl -fsSL https://raw.githubusercontent.com/erub1t/oh-my-warp-palette/main/install.sh | bash -s -- github-dark
EOF
}

is_local() {
  [[ -d "$LOCAL_THEMES_DIR" ]]
}

is_remote_mode() {
  ! is_local
}

check_remote_repo_configured() {
  if [[ "$DEFAULT_REMOTE_REPO" == "$PLACEHOLDER_REPO" ]]; then
    echo -e "${RED}Remote install is not configured yet.${NC}"
    echo "Please update DEFAULT_REMOTE_REPO at the top of install.sh, or set REMOTE_REPO."
    echo "Example: REMOTE_REPO=yourname/oh-my-warp-palette"
    exit 1
  fi
}

list_themes() {
  echo -e "${BLUE}Available themes:${NC}"
  for theme in "${BUILTIN_THEMES[@]}"; do
    echo "  • $theme"
  done
}

install_local_theme() {
  local theme="$1"
  local src="$LOCAL_THEMES_DIR/$theme.yaml"
  local dst="$WARP_THEMES_DIR/$theme.yaml"

  if [[ ! -f "$src" ]]; then
    echo -e "${RED}✗ Theme not found: $theme${NC}"
    return 1
  fi

  cp "$src" "$dst"
  echo -e "${GREEN}✓ Installed: $theme${NC}"
}

install_remote_theme() {
  local theme="$1"
  local url="https://raw.githubusercontent.com/$REMOTE_REPO/main/themes/$theme.yaml"
  local dst="$WARP_THEMES_DIR/$theme.yaml"

  if ! curl -fsSL "$url" -o "$dst"; then
    echo -e "${RED}✗ Failed to download: $theme${NC}"
    return 1
  fi

  echo -e "${GREEN}✓ Installed: $theme${NC}"
}

uninstall_theme() {
  local theme="$1"
  local dst="$WARP_THEMES_DIR/$theme.yaml"

  if [[ ! -f "$dst" ]]; then
    echo -e "${RED}✗ Not installed: $theme${NC}"
    return 1
  fi

  rm "$dst"
  echo -e "${YELLOW}✓ Removed: $theme${NC}"
}

install_themes() {
  local themes=("$@")
  local installed=0

  mkdir -p "$WARP_THEMES_DIR"

  if is_remote_mode || [[ "$force_remote" == true ]]; then
    if ! command -v curl >/dev/null 2>&1; then
      echo -e "${RED}curl is required for remote installation but was not found.${NC}"
      exit 1
    fi
    echo -e "${BLUE}Installing from remote repository: $REMOTE_REPO${NC}\n"
  fi

  for theme in "${themes[@]}"; do
    if is_remote_mode || [[ "$force_remote" == true ]]; then
      install_remote_theme "$theme" && ((installed++)) || true
    else
      install_local_theme "$theme" && ((installed++)) || true
    fi
  done

  echo -e "\n${BLUE}Installed $installed theme(s) to $WARP_THEMES_DIR.${NC}"
  echo -e "${BLUE}Open Warp → Settings → Appearance → Theme to select your theme.${NC}"
}

uninstall_themes() {
  local themes=("$@")
  local removed=0

  for theme in "${themes[@]}"; do
    uninstall_theme "$theme" && ((removed++)) || true
  done

  echo -e "\n${BLUE}Removed $removed theme(s).${NC}"
}

main() {
  if [[ $# -eq 0 ]]; then
    set -- --all
  fi

  local action="install"
  local themes=()

  while [[ $# -gt 0 ]]; do
    case "$1" in
      -a|--all)
        action="install"
        shift
        ;;
      -l|--list)
        list_themes
        exit 0
        ;;
      -u|--uninstall)
        action="uninstall"
        shift
        ;;
      -r|--remote)
        force_remote=true
        shift
        ;;
      -h|--help)
        usage
        exit 0
        ;;
      -*)
        echo -e "${RED}Unknown option: $1${NC}"
        usage
        exit 1
        ;;
      *)
        themes+=("$1")
        shift
        ;;
    esac
  done

  if [[ "$force_remote" == true || ("$action" == "install" && ! -d "$LOCAL_THEMES_DIR") ]]; then
    check_remote_repo_configured
  fi

  if [[ ${#themes[@]} -eq 0 && "$action" == "install" ]]; then
    themes=("${BUILTIN_THEMES[@]}")
  fi

  if [[ ${#themes[@]} -eq 0 ]]; then
    echo -e "${RED}No themes specified.${NC}"
    usage
    exit 1
  fi

  if [[ "$action" == "install" ]]; then
    install_themes "${themes[@]}"
  else
    uninstall_themes "${themes[@]}"
  fi
}

main "$@"
