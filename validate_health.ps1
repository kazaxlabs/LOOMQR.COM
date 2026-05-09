# LOOM Project Health Validator
# This script checks if the project adheres to the established best practices.

$essentialFiles = @(
    "src/app/layout.tsx",
    "src/app/page.tsx",
    "src/app/loading.tsx",
    "src/app/error.tsx",
    "src/app/not-found.tsx",
    "src/app/globals.css",
    "src/app/sitemap.ts",
    ".env.example",
    "package.json",
    "tsconfig.json",
    "firestore.rules",
    "firebase.json"
)

Write-Host "--- LOOM Project Health Audit ---" -ForegroundColor Cyan

$allPassed = $true

foreach ($file in $essentialFiles) {
    if (Test-Path $file) {
        Write-Host "[PASS] $file exists." -ForegroundColor Green
    } else {
        Write-Host "[FAIL] $file is missing!" -ForegroundColor Red
        $allPassed = $false
    }
}

# Check for premium design tokens in globals.css
if (Test-Path "src/app/globals.css") {
    $css = Get-Content "src/app/globals.css" -Raw
    if ($css -match "--shadow-premium" -and $css -match "--glass-bg") {
        Write-Host "[PASS] globals.css contains premium design tokens." -ForegroundColor Green
    } else {
        Write-Host "[WARN] globals.css might be missing advanced design tokens." -ForegroundColor Yellow
    }
}

# Check package.json for standard scripts
if (Test-Path "package.json") {
    $package = Get-Content "package.json" | ConvertFrom-Json
    if ($package.scripts.dev -and $package.scripts.build) {
        Write-Host "[PASS] package.json has standard scripts." -ForegroundColor Green
    } else {
        Write-Host "[FAIL] package.json is missing essential scripts!" -ForegroundColor Red
        $allPassed = $false
    }
}

Write-Host "--------------------------------" -ForegroundColor Cyan
if ($allPassed) {
    Write-Host "Result: HEALTHY" -ForegroundColor Green
} else {
    Write-Host "Result: UNHEALTHY - Please address the failures above." -ForegroundColor Red
}
