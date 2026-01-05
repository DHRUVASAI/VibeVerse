# VibeVerse Screenshot Automation Script
# This script helps you take screenshots of your app

Write-Host "📸 VibeVerse Screenshot Tool" -ForegroundColor Cyan
Write-Host "============================" -ForegroundColor Cyan
Write-Host ""

$appUrl = "http://localhost:5173"
$screenshotDir = "docs\images"

# Check if servers are running
Write-Host "Checking if servers are running..." -ForegroundColor Yellow
try {
    $response = Invoke-WebRequest -Uri "http://localhost:5173" -TimeoutSec 3 -UseBasicParsing -ErrorAction SilentlyContinue
    Write-Host "✅ Frontend server is running on http://localhost:5173" -ForegroundColor Green
} catch {
    Write-Host "❌ Frontend server not responding. Please start it first:" -ForegroundColor Red
    Write-Host "   cd server; npm run dev" -ForegroundColor Yellow
    Write-Host "   pnpm run dev" -ForegroundColor Yellow
    exit 1
}

try {
    $response = Invoke-WebRequest -Uri "http://localhost:5174/api/health" -TimeoutSec 3 -UseBasicParsing -ErrorAction SilentlyContinue
    Write-Host "✅ Backend server is running on http://localhost:5174" -ForegroundColor Green
} catch {
    Write-Host "⚠️  Backend server not responding. Starting it..." -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Opening browser..." -ForegroundColor Cyan
Start-Process $appUrl

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "📸 SCREENSHOT INSTRUCTIONS" -ForegroundColor Yellow
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "The app should now be open in your browser." -ForegroundColor White
Write-Host ""
Write-Host "Take screenshots in this order:" -ForegroundColor Yellow
Write-Host ""
Write-Host "1. HERO SECTION & SPLASH SCREEN" -ForegroundColor Green
Write-Host "   - Wait for splash screen or capture main landing page" -ForegroundColor Gray
Write-Host "   - Save as: hero-section.png" -ForegroundColor Gray
Write-Host ""
Write-Host "2. MOOD SELECTION INTERFACE" -ForegroundColor Green
Write-Host "   - Show the mood input and quick mood buttons" -ForegroundColor Gray
Write-Host "   - Save as: mood-selection.png" -ForegroundColor Gray
Write-Host ""
Write-Host "3. MOVIE RECOMMENDATIONS" -ForegroundColor Green
Write-Host "   - Search for a mood (e.g., 'happy' or 'thriller')" -ForegroundColor Gray
Write-Host "   - Capture the movie grid with results" -ForegroundColor Gray
Write-Host "   - Save as: movie-recommendations.png" -ForegroundColor Gray
Write-Host ""
Write-Host "4. MUSIC PLAYER" -ForegroundColor Green
Write-Host "   - Scroll to music section or open music player" -ForegroundColor Gray
Write-Host "   - Capture the music player interface" -ForegroundColor Gray
Write-Host "   - Save as: music-player.png" -ForegroundColor Gray
Write-Host ""
Write-Host "5. VIBE MAP (EMOTIONAL GALAXY)" -ForegroundColor Green
Write-Host "   - Click the 'Vibe Map' button in header" -ForegroundColor Gray
Write-Host "   - Capture the interactive galaxy interface" -ForegroundColor Gray
Write-Host "   - Save as: vibe-map.png" -ForegroundColor Gray
Write-Host ""
Write-Host "6. VIBE JOURNAL" -ForegroundColor Green
Write-Host "   - Click the 'Vibe Journal' button in header" -ForegroundColor Gray
Write-Host "   - Capture the mood history sidebar" -ForegroundColor Gray
Write-Host "   - Save as: vibe-journal.png" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "HOW TO TAKE SCREENSHOTS:" -ForegroundColor Yellow
Write-Host ""
Write-Host "Method 1: Windows Snipping Tool" -ForegroundColor White
Write-Host "  1. Press Windows + Shift + S" -ForegroundColor Gray
Write-Host "  2. Select area to capture" -ForegroundColor Gray
Write-Host "  3. Save to: $screenshotDir" -ForegroundColor Gray
Write-Host ""
Write-Host "Method 2: Print Screen" -ForegroundColor White
Write-Host "  1. Press Print Screen (PrtScn)" -ForegroundColor Gray
Write-Host "  2. Open Paint or any image editor" -ForegroundColor Gray
Write-Host "  3. Paste (Ctrl+V) and save" -ForegroundColor Gray
Write-Host ""
Write-Host "Method 3: Browser DevTools" -ForegroundColor White
Write-Host "  1. Press F12 to open DevTools" -ForegroundColor Gray
Write-Host "  2. Press Ctrl+Shift+P" -ForegroundColor Gray
Write-Host "  3. Type 'screenshot' and select 'Capture full size screenshot'" -ForegroundColor Gray
Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "After taking all screenshots, save them to:" -ForegroundColor Yellow
Write-Host "  $((Get-Location).Path)\$screenshotDir\" -ForegroundColor Cyan
Write-Host ""
Write-Host "Then run: .\add-screenshots.ps1" -ForegroundColor Green
Write-Host ""

# Wait for user
Read-Host "Press Enter when you've taken all screenshots and saved them to docs/images/"

# Check if images exist
Write-Host ""
Write-Host "Checking for screenshots..." -ForegroundColor Cyan
$images = @("hero-section", "mood-selection", "movie-recommendations", "music-player", "vibe-map", "vibe-journal")
$found = 0

foreach ($img in $images) {
    if ((Test-Path "$screenshotDir\$img.png") -or (Test-Path "$screenshotDir\$img.jpg")) {
        Write-Host "✅ Found: $img" -ForegroundColor Green
        $found++
    } else {
        Write-Host "❌ Missing: $img" -ForegroundColor Red
    }
}

if ($found -eq $images.Count) {
    Write-Host ""
    Write-Host "🎉 All screenshots found! Running add-screenshots.ps1..." -ForegroundColor Green
    & ".\add-screenshots.ps1"
} else {
    Write-Host ""
    Write-Host "⚠️  Some screenshots are missing. Please add them and run:" -ForegroundColor Yellow
    Write-Host "   .\add-screenshots.ps1" -ForegroundColor Cyan
}

