#!/usr/bin/env pwsh

param(
    [Parameter(Position = 0, ValueFromRemainingArguments = $true)]
    [string[]]$Themes = @(),

    [switch]$List,
    [switch]$Uninstall,
    [switch]$Help
)

$Repo = "eruship/oh-my-warp-palette"
$Branch = "main"
$WarpThemesDir = Join-Path $env:USERPROFILE ".warp" "themes"

$BuiltinThemes = @(
    "april",
    "github-dark",
    "github-dark-dimmed",
    "github-light"
)

function Show-Help {
    @"
Usage: .\install.ps1 [OPTIONS] [THEME_NAME...]

Install Warp themes to $WarpThemesDir.

Options:
  -List        List available themes
  -Uninstall   Remove installed themes
  -Help        Show this help message

Examples:
  .\install.ps1                  # Install all themes
  .\install.ps1 github-dark      # Install only github-dark
  .\install.ps1 -List            # List available themes
  .\install.ps1 -Uninstall github-light  # Uninstall github-light

Remote install (PowerShell):
  irm https://raw.githubusercontent.com/eruship/oh-my-warp-palette/main/install.ps1 | iex

Remote install single theme:
  irm https://raw.githubusercontent.com/eruship/oh-my-warp-palette/main/install.ps1 -OutFile install.ps1
  .\install.ps1 github-dark
"@
}

function Install-Theme {
    param([string]$Theme)

    $url = "https://raw.githubusercontent.com/$Repo/$Branch/themes/$Theme.yaml"
    $dst = Join-Path $WarpThemesDir "$Theme.yaml"

    try {
        Invoke-WebRequest -Uri $url -OutFile $dst -UseBasicParsing -ErrorAction Stop
        Write-Host "✓ Installed: $Theme" -ForegroundColor Green
    } catch {
        Write-Host "✗ Failed to download: $Theme" -ForegroundColor Red
    }
}

function Uninstall-Theme {
    param([string]$Theme)

    $dst = Join-Path $WarpThemesDir "$Theme.yaml"

    if (Test-Path $dst) {
        Remove-Item $dst
        Write-Host "✓ Removed: $Theme" -ForegroundColor Yellow
    } else {
        Write-Host "✗ Not installed: $Theme" -ForegroundColor Red
    }
}

if ($Help) {
    Show-Help
    exit 0
}

if ($List) {
    Write-Host "Available themes:" -ForegroundColor Blue
    foreach ($theme in $BuiltinThemes) {
        Write-Host "  • $theme"
    }
    exit 0
}

if (-not (Test-Path $WarpThemesDir)) {
    New-Item -ItemType Directory -Path $WarpThemesDir -Force | Out-Null
}

$targetThemes = if ($Themes.Count -eq 0) { $BuiltinThemes } else { $Themes }

if ($Uninstall) {
    foreach ($theme in $targetThemes) {
        Uninstall-Theme -Theme $theme
    }
} else {
    foreach ($theme in $targetThemes) {
        Install-Theme -Theme $theme
    }
}

Write-Host "`nDone. Open Warp → Settings → Appearance → Theme to select your theme." -ForegroundColor Blue
