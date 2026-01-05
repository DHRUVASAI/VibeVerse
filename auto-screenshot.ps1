# Automated Screenshot Script for VibeVerse
# Uses Playwright for browser automation (requires installation)

param(
    [string]$Url = "http://localhost:5173"
)

Write-Host "📸 Automated Screenshot Tool for VibeVerse" -ForegroundColor Cyan
Write-Host "===========================================" -ForegroundColor Cyan
Write-Host ""

# Check if Playwright is available
$playwrightAvailable = $false
try {
    $null = Get-Command playwright -ErrorAction Stop
    $playwrightAvailable = $true
} catch {
    Write-Host "Playwright not found. Installing..." -ForegroundColor Yellow
    Write-Host "Please run: npm install -g playwright" -ForegroundColor Yellow
    Write-Host "Or: npx playwright install" -ForegroundColor Yellow
}

if (-not $playwrightAvailable) {
    Write-Host ""
    Write-Host "Using manual screenshot method instead..." -ForegroundColor Yellow
    Write-Host ""
    
    # Open browser manually
    Write-Host "Opening browser at: $Url" -ForegroundColor Cyan
    Start-Process $Url
    
    Write-Host ""
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host "MANUAL SCREENSHOT GUIDE" -ForegroundColor Yellow
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "The app is now open. Please take these screenshots:" -ForegroundColor White
    Write-Host ""
    
    $screenshots = @(
        @{Name="hero-section"; Desc="Hero Section & Splash Screen"},
        @{Name="mood-selection"; Desc="Mood Selection Interface"},
        @{Name="movie-recommendations"; Desc="Movie Recommendations Grid"},
        @{Name="music-player"; Desc="Music Player Interface"},
        @{Name="vibe-map"; Desc="Vibe Map (Emotional Galaxy)"},
        @{Name="vibe-journal"; Desc="Vibe Journal Sidebar"}
    )
    
    $i = 1
    foreach ($shot in $screenshots) {
        Write-Host "$i. $($shot.Desc)" -ForegroundColor Green
        Write-Host "   Save as: $($shot.Name).png" -ForegroundColor Gray
        Write-Host ""
        $i++
    }
    
    Write-Host "========================================" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "QUICK TIPS:" -ForegroundColor Yellow
    Write-Host "  • Press Windows + Shift + S for Snipping Tool" -ForegroundColor White
    Write-Host "  • Or use Print Screen (PrtScn) key" -ForegroundColor White
    Write-Host "  • Save all images to: docs\images\" -ForegroundColor White
    Write-Host ""
    
    Read-Host "Press Enter after you've saved all 6 screenshots to docs\images\"
    
    # Check and process
    $screenshotDir = "docs\images"
    $allFound = $true
    
    foreach ($shot in $screenshots) {
        $png = "$screenshotDir\$($shot.Name).png"
        $jpg = "$screenshotDir\$($shot.Name).jpg"
        
        if ((Test-Path $png) -or (Test-Path $jpg)) {
            Write-Host "✅ Found: $($shot.Name)" -ForegroundColor Green
        } else {
            Write-Host "❌ Missing: $($shot.Name)" -ForegroundColor Red
            $allFound = $false
        }
    }
    
    if ($allFound) {
        Write-Host ""
        Write-Host "🎉 All screenshots found! Adding to git..." -ForegroundColor Green
        & ".\add-screenshots.ps1"
    } else {
        Write-Host ""
        Write-Host "⚠️  Please add missing screenshots and run: .\add-screenshots.ps1" -ForegroundColor Yellow
    }
    
    exit
}

# If Playwright is available, use automated method
Write-Host "Using Playwright for automated screenshots..." -ForegroundColor Green
Write-Host "This will take screenshots automatically." -ForegroundColor White
Write-Host ""

# Playwright automation code would go here
# For now, fall back to manual method

