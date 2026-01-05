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
    { 
        name: 'hero-section', 
        desc: 'Hero Section & Splash Screen', 
        wait: 5000,
        action: async (page) => {
            // Wait for splash screen or auth screen
            await page.waitForSelector('#splashScreen, #authSection', { timeout: 5000 }).catch(() => {});
            // If splash screen exists, wait for animation
            const splash = await page.$('#splashScreen');
            if (splash) {
                console.log('  ✨ Waiting for splash screen animation...');
                await new Promise(resolve => setTimeout(resolve, 3000));
            } else {
                // If auth screen, wait a bit
                await new Promise(resolve => setTimeout(resolve, 2000));
            }
        }
    },
    { 
        name: 'mood-selection', 
        desc: 'Mood Selection Interface (Guest Mode)', 
        wait: 4000,
        action: async (page) => {
            // Click guest login button
            try {
                const guestBtn = await page.$('#guestLoginBtn');
                if (guestBtn) {
                    console.log('  👤 Logging in as guest...');
                    await guestBtn.click();
                    await page.waitForSelector('#mainContainer, .search-section', { timeout: 10000 });
                    await new Promise(resolve => setTimeout(resolve, 3000));
                    // Scroll to show mood selection clearly
                    await page.evaluate(() => {
                        const searchSection = document.querySelector('.search-section');
                        if (searchSection) {
                            searchSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    });
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
            } catch (e) {
                console.log('  ⚠️  Already logged in, refreshing page...');
                await page.reload({ waitUntil: 'networkidle2' });
                await new Promise(resolve => setTimeout(resolve, 3000));
            }
        }
    },
    { 
        name: 'movie-recommendations', 
        desc: 'Movie Recommendations (Thriller Mood)', 
        wait: 10000,
        action: async (page) => {
            // Search for Thriller mood to get different results
            try {
                // Try quick mood button for Thriller
                const thrillerBtn = await page.$('.quick-mood-btn[data-mood="Thriller"]');
                if (thrillerBtn) {
                    console.log('  🎬 Clicking Thriller mood button...');
                    await thrillerBtn.click();
                    await page.waitForSelector('.movies-grid, .results-section', { timeout: 25000 });
                    await new Promise(resolve => setTimeout(resolve, 4000));
                    // Scroll to show movie grid
                    await page.evaluate(() => {
                        const moviesGrid = document.querySelector('.movies-grid');
                        if (moviesGrid) {
                            moviesGrid.scrollIntoView({ behavior: 'smooth', block: 'start' });
                        }
                    });
                    await new Promise(resolve => setTimeout(resolve, 2000));
                } else {
                    // Fallback to text input
                    const moodInput = await page.$('#mainMoodInput');
                    if (moodInput) {
                        await moodInput.click();
                        await page.evaluate((input) => input.value = '', moodInput);
                        await moodInput.type('thriller suspense', { delay: 150 });
                        const submitBtn = await page.$('#moodSubmitBtn');
                        if (submitBtn) {
                            await submitBtn.click();
                            await page.waitForSelector('.movies-grid, .results-section', { timeout: 25000 });
                            await new Promise(resolve => setTimeout(resolve, 4000));
                        }
                    }
                }
            } catch (e) {
                console.log('  ⚠️  Could not trigger search');
            }
        }
    },
    { 
        name: 'music-player', 
        desc: 'Music Player with Recommendations', 
        wait: 5000,
        action: async (page) => {
            // Scroll to music section and ensure it's visible
            try {
                await page.evaluate(() => {
                    window.scrollTo(0, 0);
                });
                await new Promise(resolve => setTimeout(resolve, 1000));
                
                const musicSection = await page.$('#vibeMusicSection');
                if (musicSection) {
                    console.log('  🎵 Scrolling to music section...');
                    await page.evaluate((section) => {
                        section.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }, musicSection);
                    await new Promise(resolve => setTimeout(resolve, 2500));
                    
                    // Try to expand music section if collapsed
                    const musicToggle = await page.$('#musicToggleBtn');
                    if (musicToggle) {
                        const isExpanded = await page.evaluate(() => {
                            const container = document.querySelector('#musicRecommendationsContainer');
                            return container && !container.classList.contains('hidden');
                        });
                        if (!isExpanded) {
                            console.log('  🎵 Expanding music section...');
                            await musicToggle.click();
                            await new Promise(resolve => setTimeout(resolve, 2000));
                        }
                    }
                } else {
                    // If no music section, scroll to show results with music
                    await page.evaluate(() => {
                        window.scrollBy(0, 600);
                    });
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }
            } catch (e) {
                console.log('  ⚠️  Music section not available');
            }
        }
    },
    { 
        name: 'vibe-map', 
        desc: 'Vibe Map (Emotional Galaxy)', 
        wait: 4000,
        action: async (page) => {
            // Click Vibe Map button
            try {
                const vibeMapBtn = await page.$('#showVibeMapBtn');
                if (vibeMapBtn) {
                    console.log('  🌌 Opening Vibe Map...');
                    await vibeMapBtn.click();
                    await page.waitForSelector('#vibeMapSection', { timeout: 8000 }).catch(() => {});
                    await new Promise(resolve => setTimeout(resolve, 2000));
                }
            } catch (e) {
                console.log('  ⚠️  Could not open Vibe Map');
            }
        }
    },
    { 
        name: 'vibe-journal', 
        desc: 'Vibe Journal (Mood History)', 
        wait: 3000,
        action: async (page) => {
            // Close vibe map if open, then open journal
            try {
                const vibeMapClose = await page.$('#vibeMapClose');
                if (vibeMapClose) {
                    await vibeMapClose.click();
                    await new Promise(resolve => setTimeout(resolve, 1000));
                }
                const journalBtn = await page.$('#showMemoryLogBtn');
                if (journalBtn) {
                    console.log('  📋 Opening Vibe Journal...');
                    await journalBtn.click();
                    await page.waitForSelector('#moodMemorySidebar', { timeout: 8000 }).catch(() => {});
                    await new Promise(resolve => setTimeout(resolve, 1500));
                }
            } catch (e) {
                console.log('  ⚠️  Could not open Vibe Journal');
            }
        }
    }
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
        
        // Clear any existing localStorage to start fresh
        await page.evaluate(() => {
            localStorage.clear();
        });
        
        // Wait for app to load
        await new Promise(resolve => setTimeout(resolve, 2000));
        
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

