# 📸 Quick Guide: Adding Screenshots to VibeVerse

## Step-by-Step Instructions

### Step 1: Take Screenshots

Open your VibeVerse app and take screenshots of these sections:

1. **Hero Section & Splash Screen**
   - Open the app and capture the splash screen or main landing page
   - Save as: `hero-section.png`

2. **Mood Selection Interface**
   - Navigate to the mood selection page
   - Show the mood buttons and input field
   - Save as: `mood-selection.png`

3. **Movie Recommendations**
   - Search for a mood and show the movie grid results
   - Include filters if visible
   - Save as: `movie-recommendations.png`

4. **Music Player**
   - Show the music player interface
   - Include the playlist or currently playing song
   - Save as: `music-player.png`

5. **Vibe Map (Emotional Galaxy)**
   - Open the Vibe Map feature
   - Capture the interactive galaxy/orb interface
   - Save as: `vibe-map.png`

6. **Vibe Journal**
   - Open the Vibe Journal sidebar
   - Show the mood history
   - Save as: `vibe-journal.png`

### Step 2: Optimize Images (Optional but Recommended)

**Recommended Settings:**
- **Format**: PNG (best quality) or JPG (smaller file size)
- **Resolution**: 1920x1080 or 1280x720 (16:9 aspect ratio)
- **File Size**: Keep under 1MB each for faster loading

**Quick Optimization Tools:**
- Windows: Use Paint 3D or Photos app to resize
- Online: [TinyPNG](https://tinypng.com/) or [Squoosh](https://squoosh.app/)

### Step 3: Save Images to Correct Location

Save all 6 images in this folder:
```
VibeVerse/docs/images/
```

**Required File Names (exact match):**
- `hero-section.png`
- `mood-selection.png`
- `movie-recommendations.png`
- `music-player.png`
- `vibe-map.png`
- `vibe-journal.png`

### Step 4: Add to Git and Push

Once you've saved all images in `docs/images/`, run these commands:

```bash
# Navigate to project root (if not already there)
cd "C:\Users\Dhruva Sai\Desktop\SEM 3\VibeVerse"

# Add all images
git add docs/images/*.png
git add docs/images/*.jpg

# Commit with a descriptive message
git commit -m "📸 Add app screenshots to README"

# Push to GitHub
git push origin master
```

### Step 5: Verify on GitHub

1. Go to: https://github.com/DHRUVASAI/VibeVerse
2. Check the README - images should now display!
3. If images don't show, wait a few seconds for GitHub to process them

## Troubleshooting

**Images still not showing?**
- ✅ Check file names match exactly (case-sensitive)
- ✅ Verify images are in `docs/images/` folder
- ✅ Ensure images are committed and pushed
- ✅ Try refreshing the GitHub page (Ctrl+F5)

**File too large?**
- Use an image optimizer like TinyPNG
- Resize to 1280x720 if original is too large
- Convert to JPG if PNG is too big

**Need help?**
- Check that all 6 images are present
- Verify git status: `git status`
- Check if files are tracked: `git ls-files docs/images/`

