// Automated Screenshot Tool for VibeVerse
// Uses Puppeteer to take screenshots automatically

const puppeteer = require('puppeteer');
const fs = require('fs');
const path = require('path');

const APP_URL = 'http://localhost:5173';
const SCREENSHOT_DIR = path.join(__dirname, 'docs', 'images');
const DELAY = 2000; // 2 seconds delay between actions

// Ensure screenshot directory exists
if (!fs.existsSync(SCREENSHOT_DIR)) {
    fs.mkdirSync(SCREENSHOT_DIR, { recursive: true });
}

const screenshots = [
    { name: 'hero-section', desc: 'Hero Section & Splash Screen', wait: 3000 },
    { name: 'mood-selection', desc: 'Mood Selection Interface', wait: 2000 },
    { name: 'movie-recommendations', desc: 'Movie Recommendations', wait: 5000, action: async (page) => {
        // Search for a mood
        try {
            const moodInput = await page.$('#mainMoodInput');
            if (moodInput) {
                await moodInput.click();
                await moodInput.type('happy', { delay: 100 });
                const submitBtn = await page.$('#moodSubmitBtn');
                if (submitBtn) {
                    await submitBtn.click();
                    await page.waitForSelector('.movies-grid, .results-section', { timeout: 15000 }).catch(() => {});
                }
            }
        } catch (e) {
            console.log('  ⚠️  Could not trigger search, taking screenshot of current state');
        }
    }},
    { name: 'music-player', desc: 'Music Player', wait: 3000, action: async (page) => {
        // Scroll to music section if it exists
        await page.evaluate(() => {
            const musicSection = document.querySelector('#vibeMusicSection');
            if (musicSection) {
                musicSection.scrollIntoView({ behavior: 'smooth' });
            }
        });
    }},
    { name: 'vibe-map', desc: 'Vibe Map', wait: 3000, action: async (page) => {
        // Click Vibe Map button
        try {
            const vibeMapBtn = await page.$('#showVibeMapBtn');
            if (vibeMapBtn) {
                await vibeMapBtn.click();
                await page.waitForSelector('#vibeMapSection', { timeout: 5000 }).catch(() => {});
            }
        } catch (e) {
            console.log('  ⚠️  Could not open Vibe Map, taking screenshot of current state');
        }
    }},
    { name: 'vibe-journal', desc: 'Vibe Journal', wait: 3000, action: async (page) => {
        // Click Vibe Journal button
        try {
            const journalBtn = await page.$('#showMemoryLogBtn');
            if (journalBtn) {
                await journalBtn.click();
                await page.waitForSelector('#moodMemorySidebar', { timeout: 5000 }).catch(() => {});
            }
        } catch (e) {
            console.log('  ⚠️  Could not open Vibe Journal, taking screenshot of current state');
        }
    }}
];

async function takeScreenshots() {
    console.log('🚀 Starting automated screenshot capture...\n');
    
    let browser;
    try {
        // Launch browser
        console.log('📱 Launching browser...');
        browser = await puppeteer.launch({
            headless: false, // Show browser for debugging
            defaultViewport: { width: 1920, height: 1080 }
        });
        
        const page = await browser.newPage();
        
        // Navigate to app
        console.log(`🌐 Navigating to ${APP_URL}...`);
        await page.goto(APP_URL, { waitUntil: 'networkidle2', timeout: 30000 });
        
        // Wait for app to load
        await new Promise(resolve => setTimeout(resolve, 3000));
        
        // Take each screenshot
        for (const shot of screenshots) {
            console.log(`\n📸 Taking screenshot: ${shot.desc}...`);
            
            try {
                // Perform action if specified
                if (shot.action) {
                    await shot.action(page);
                    await new Promise(resolve => setTimeout(resolve, shot.wait || DELAY));
                } else {
                    await new Promise(resolve => setTimeout(resolve, shot.wait || DELAY));
                }
                
                // Take screenshot
                const filePath = path.join(SCREENSHOT_DIR, `${shot.name}.png`);
                await page.screenshot({
                    path: filePath,
                    fullPage: true
                });
                
                console.log(`✅ Saved: ${filePath}`);
            } catch (error) {
                console.error(`❌ Error capturing ${shot.name}:`, error.message);
                // Continue with next screenshot
            }
        }
        
        console.log('\n🎉 All screenshots captured successfully!');
        console.log(`📁 Location: ${SCREENSHOT_DIR}`);
        
    } catch (error) {
        console.error('❌ Error:', error.message);
        process.exit(1);
    } finally {
        if (browser) {
            await browser.close();
        }
    }
}

// Check if app is running
const http = require('http');
const checkApp = () => {
    return new Promise((resolve) => {
        const req = http.get(APP_URL, (res) => {
            resolve(res.statusCode === 200);
        });
        req.on('error', () => resolve(false));
        req.setTimeout(3000, () => {
            req.destroy();
            resolve(false);
        });
    });
};

// Main execution
(async () => {
    console.log('🔍 Checking if app is running...');
    const isRunning = await checkApp();
    
    if (!isRunning) {
        console.error('❌ App is not running!');
        console.error(`   Please start the app at ${APP_URL}`);
        console.error('   Run: pnpm run dev (or npm run dev)');
        process.exit(1);
    }
    
    console.log('✅ App is running!\n');
    await takeScreenshots();
})();

