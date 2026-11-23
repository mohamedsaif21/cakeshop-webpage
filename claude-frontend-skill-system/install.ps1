$ErrorActionPreference = "Stop"

$sourceRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$targetRoot = Join-Path $HOME ".claude\skills"
$skillNames = @(
    "frontend-design",
    "frontend-engineering",
    "frontend-ux-audit",
    "frontend-visual-testing",
    "frontend-design-system"
)

New-Item -ItemType Directory -Force -Path $targetRoot | Out-Null

$timestamp = Get-Date -Format "yyyyMMdd-HHmmss"

foreach ($name in $skillNames) {
    $source = Join-Path $sourceRoot $name
    $destination = Join-Path $targetRoot $name

    if (-not (Test-Path (Join-Path $source "SKILL.md"))) {
        throw "Missing required file: $(Join-Path $source 'SKILL.md')"
    }

    if (Test-Path $destination) {
        $backup = "$destination.backup-$timestamp"
        Write-Host "Backing up existing skill: $destination -> $backup"
        Move-Item -Path $destination -Destination $backup
    }

    Copy-Item -Path $source -Destination $destination -Recurse
    Write-Host "Installed $name"
}

Write-Host ""
Write-Host "Frontend skills installed globally at: $targetRoot"
Write-Host "Restart or reload Claude Code, then check available skills."
