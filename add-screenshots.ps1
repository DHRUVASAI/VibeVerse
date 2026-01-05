# PowerShell Script to Add Screenshots to VibeVerse
# Run this script after you've saved your screenshots in docs/images/

Write-Host "📸 VibeVerse Screenshot Uploader" -ForegroundColor Cyan
Write-Host "=================================" -ForegroundColor Cyan
Write-Host ""

# Check if we're in the right directory
if (-not (Test-Path "docs\images")) {
    Write-Host "❌ Error: docs\images folder not found!" -ForegroundColor Red
    Write-Host "Please run this script from the VibeVerse project root." -ForegroundColor Yellow
    exit 1
}

# Required image files
$requiredImages = @(
    "hero-section",
    "mood-selection",
    "movie-recommendations",
    "music-player",
    "vibe-map",
    "vibe-journal"
)

Write-Host "Checking for required screenshots..." -ForegroundColor Yellow
Write-Host ""

$missingImages = @()
$foundImages = @()

foreach ($image in $requiredImages) {
    $pngPath = "docs\images\$image.png"
    $jpgPath = "docs\images\$image.jpg"
    
    if ((Test-Path $pngPath) -or (Test-Path $jpgPath)) {
        $foundImages += $image
        Write-Host "✅ Found: $image" -ForegroundColor Green
    } else {
        $missingImages += $image
        Write-Host "❌ Missing: $image" -ForegroundColor Red
    }
}

Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "  Found: $($foundImages.Count) / $($requiredImages.Count) images" -ForegroundColor $(if ($foundImages.Count -eq $requiredImages.Count) { "Green" } else { "Yellow" })

if ($missingImages.Count -gt 0) {
    Write-Host ""
    Write-Host "Missing images:" -ForegroundColor Red
    foreach ($missing in $missingImages) {
        Write-Host "  - $missing.png (or .jpg)" -ForegroundColor Yellow
    }
    Write-Host ""
    Write-Host "Please add the missing images to docs\images\ folder first." -ForegroundColor Yellow
    exit 1
}

Write-Host ""
Write-Host "All images found! Ready to commit and push." -ForegroundColor Green
Write-Host ""

# Ask for confirmation
$confirm = Read-Host "Do you want to add, commit, and push these images to GitHub? (Y/N)"
if ($confirm -ne "Y" -and $confirm -ne "y") {
    Write-Host "Cancelled." -ForegroundColor Yellow
    exit 0
}

Write-Host ""
Write-Host "Adding images to git..." -ForegroundColor Cyan
git add docs/images/*.png
git add docs/images/*.jpg

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error adding files to git" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Files added to staging area" -ForegroundColor Green
Write-Host ""

Write-Host "Committing changes..." -ForegroundColor Cyan
git commit -m "📸 Add app screenshots to README"

if ($LASTEXITCODE -ne 0) {
    Write-Host "❌ Error committing changes" -ForegroundColor Red
    exit 1
}

Write-Host "✅ Changes committed" -ForegroundColor Green
Write-Host ""

Write-Host "Pushing to GitHub..." -ForegroundColor Cyan
git push origin master

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "🎉 Success! Screenshots have been pushed to GitHub!" -ForegroundColor Green
    Write-Host "Visit: https://github.com/DHRUVASAI/VibeVerse to see your updated README" -ForegroundColor Cyan
} else {
    Write-Host "❌ Error pushing to GitHub" -ForegroundColor Red
    exit 1
}

