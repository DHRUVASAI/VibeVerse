import { TMDB_PROXY_BASE, TMDB_IMAGE_BASE_URL, LANGUAGES, REGION, SPOTIFY_CLIENT_ID, SPOTIFY_CLIENT_SECRET, SPOTIFY_API_BASE, SPOTIFY_ACCOUNTS_BASE, SPOTIFY_EMBED_BASE, YOUTUBE_PROXY_BASE, YOUTUBE_EMBED_BASE, MOOD_MUSIC_KEYWORDS, LANGUAGE_MUSIC_KEYWORDS } from './config.js';

console.log('🚀 VibeVerse script loading...');
console.log('📦 Config loaded: proxy endpoints ->', { tmdb: TMDB_PROXY_BASE, youtube: YOUTUBE_PROXY_BASE });

// Splash Screen Handler
function hideSplashScreen() {
    const splashScreen = document.getElementById('splashScreen');
    if (splashScreen) {
        console.log('👋 Hiding splash screen...');
        splashScreen.classList.add('fade-out');
        setTimeout(() => {
            splashScreen.style.display = 'none';
            console.log('✅ Splash screen hidden - App ready!');
        }, 500);
    }
}

function initSplashScreen() {
    const splashScreen = document.getElementById('splashScreen');
    
    if (!splashScreen) {
        console.warn('⚠️ Splash screen element not found');
        return;
    }
    
    console.log('🎬 Splash screen initialized - will hide in 2 seconds');
    
    // Hide splash screen after 2 seconds
    setTimeout(() => {
        hideSplashScreen();
    }, 2000);
    
    // Allow clicking anywhere on splash screen to skip
    splashScreen.addEventListener('click', () => {
        console.log('👆 User clicked - skipping splash screen');
        hideSplashScreen();
    });
    
    // Allow pressing any key to skip
    document.addEventListener('keydown', function skipSplash() {
        console.log('⌨️ Key pressed - skipping splash screen');
        hideSplashScreen();
        document.removeEventListener('keydown', skipSplash);
    });
    
    // Backup: Force remove after 4 seconds no matter what
    setTimeout(() => {
        if (splashScreen && window.getComputedStyle(splashScreen).display !== 'none') {
            console.warn('⚠️ Force removing splash screen (backup timer)');
            splashScreen.style.display = 'none';
        }
    }, 4000);
}

// Initialize splash screen when DOM is loaded
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        console.log('📄 DOM Content Loaded');
        initSplashScreen();
    });
} else {
    console.log('📄 DOM already loaded');
    initSplashScreen();
}

// Emergency splash screen removal if everything else fails
window.addEventListener('load', () => {
    console.log('🌍 Window fully loaded');
    setTimeout(() => {
        const splashScreen = document.getElementById('splashScreen');
        if (splashScreen && window.getComputedStyle(splashScreen).display !== 'none') {
            console.warn('🚨 EMERGENCY: Force removing stuck splash screen');
            splashScreen.style.display = 'none';
            splashScreen.remove(); // Completely remove it
        }
    }, 5000);
});

// Mood/Genre to TMDb Genre ID Mapping with color themes and poetic interpretations
// EXPANDED MAJOR MOODS - 24 Total
const MOOD_MAPPINGS = {
    'Happy': { 
        genres: [35, 10751], // Comedy, Family - Perfect for happy mood
        color: '#ffcc00', 
        gradient: 'linear-gradient(135deg, #ffcc00, #ff6f00)',
        quote: "Joy dances in your heart tonight.",
        aura: 'radial-gradient(circle, rgba(255, 204, 0, 0.4), rgba(255, 111, 0, 0.2), transparent)',
        musicKeywords: 'happy upbeat pop cheerful'
    },
    'Romantic': { 
        genres: [10749, 18], // Romance, Drama - Love movies for romantic mood
        color: '#ec4899', 
        gradient: 'linear-gradient(135deg, #ec4899, #f43f5e)',
        quote: "Your heart yearns for moments of passion and tender connection.",
        aura: 'radial-gradient(circle, rgba(236, 72, 153, 0.4), rgba(244, 63, 94, 0.2), transparent)',
        musicKeywords: 'romantic love ballad emotional'
    },
    'Sad': { 
        genres: [18, 10749, 10751], // Drama, Romance, Family - Feel-good movies for sad mood
        color: '#6366f1', 
        gradient: 'linear-gradient(135deg, #6366f1, #4f46e5)',
        quote: "Deep emotions stir within, seeking stories that touch the heart.",
        aura: 'radial-gradient(circle, rgba(99, 102, 241, 0.4), rgba(79, 70, 229, 0.2), transparent)',
        musicKeywords: 'sad emotional melancholy uplifting'
    },
    'Comedy': { 
        genres: [35], // Comedy - Comedy movies for comedy mood
        color: '#f59e0b', 
        gradient: 'linear-gradient(135deg, #f59e0b, #fbbf24)',
        quote: "Laughter echoes in the chambers of your soul tonight.",
        aura: 'radial-gradient(circle, rgba(245, 158, 11, 0.4), rgba(251, 191, 36, 0.2), transparent)',
        musicKeywords: 'funny comedy upbeat'
    },
    'Action': { 
        genres: [28, 12], // Action, Adventure - Action movies for action mood
        color: '#ff3b30', 
        gradient: 'linear-gradient(135deg, #ff3b30, #ff6b6b)',
        quote: "Your heart beats with the rhythm of unstoppable energy.",
        aura: 'radial-gradient(circle, rgba(255, 59, 48, 0.4), rgba(255, 107, 107, 0.2), transparent)',
        musicKeywords: 'action epic powerful intense'
    },
    'Thriller': { 
        genres: [53, 80, 9648], // Thriller, Crime, Mystery - Thriller movies for thriller mood
        color: '#dc2626', 
        gradient: 'linear-gradient(135deg, #dc2626, #450a0a)',
        quote: "Suspense grips your soul as you crave the unexpected.",
        aura: 'radial-gradient(circle, rgba(220, 38, 38, 0.4), rgba(69, 10, 10, 0.3), transparent)',
        musicKeywords: 'thriller suspense dark tension'
    },
    'Horror': { 
        genres: [27], // Horror - Horror movies only
        color: '#7c2d12', 
        gradient: 'linear-gradient(135deg, #7c2d12, #000000)',
        quote: "Darkness calls to you with thrills that chill the spine.",
        aura: 'radial-gradient(circle, rgba(124, 45, 18, 0.4), rgba(0, 0, 0, 0.3), transparent)',
        musicKeywords: 'horror scary dark creepy'
    },
    'Sci-Fi': { 
        genres: [878, 12], // Sci-Fi, Adventure - Sci-fi focused
        color: '#00d4ff', 
        gradient: 'linear-gradient(135deg, #00d4ff, #0066ff)',
        quote: "You're gazing beyond the stars, seeking tomorrow's truth.",
        aura: 'radial-gradient(circle, rgba(0, 212, 255, 0.4), rgba(0, 102, 255, 0.2), transparent)',
        musicKeywords: 'scifi electronic futuristic space'
    },
    'Adventure': { 
        genres: [12, 14], // Adventure, Fantasy - Adventure focused
        color: '#ff9500', 
        gradient: 'linear-gradient(135deg, #ff9500, #ff5e3a)',
        quote: "Your spirit craves the thrill of the unknown.",
        aura: 'radial-gradient(circle, rgba(255, 149, 0, 0.4), rgba(255, 94, 58, 0.2), transparent)',
        musicKeywords: 'adventure epic journey quest'
    },
    'Mystery': { 
        genres: [9648, 53, 80], // Mystery, Thriller, Crime - Mystery movies for mystery mood
        color: '#5856d6', 
        gradient: 'linear-gradient(135deg, #5856d6, #000000)',
        quote: "Shadows hold secrets you're ready to uncover.",
        aura: 'radial-gradient(circle, rgba(88, 86, 214, 0.4), rgba(0, 0, 0, 0.3), transparent)',
        musicKeywords: 'mystery suspense detective'
    },
    'Chill': { 
        genres: [10749, 35, 10751, 18], // Romance, Comedy, Family, Drama - Relaxing content
        color: '#22c55e', 
        gradient: 'linear-gradient(135deg, #22c55e, #10b981)',
        quote: "Relaxation flows through your soul like a gentle breeze.",
        aura: 'radial-gradient(circle, rgba(34, 197, 94, 0.4), rgba(16, 185, 129, 0.2), transparent)',
        musicKeywords: 'chill relaxing ambient calm'
    },
    'Inspiring': { 
        genres: [18, 36, 10751], // Drama, History, Family - Inspirational content
        color: '#ffd60a', 
        gradient: 'linear-gradient(135deg, #ffd60a, #ff9500)',
        quote: "Your spirit soars, seeking stories that ignite possibility.",
        aura: 'radial-gradient(circle, rgba(255, 214, 10, 0.4), rgba(255, 149, 0, 0.2), transparent)',
        musicKeywords: 'inspiring motivational uplifting epic'
    }
};

// Moods that should show music recommendations (music-friendly moods)
const MUSIC_ENABLED_MOODS = [
    'Happy',
    'Sad', 
    'Romantic',
    'Comedy',
    'Action',
    'Chill',
    'Inspiring',
    'Adventure',
    'Sci-Fi'
];

// Custom mood keyword mapping (updated for 12 moods)
const CUSTOM_MOOD_KEYWORDS = {
    // Happy keywords
    'happy': ['Happy', 'Comedy'],
    'joy': ['Happy'],
    'cheerful': ['Happy', 'Comedy'],
    'upbeat': ['Happy', 'Chill'],
    
    // Romantic keywords
    'romantic': ['Romantic'],
    'romance': ['Romantic', 'Chill'],
    'love': ['Romantic', 'Happy'],
    'passionate': ['Romantic'],
    'intimate': ['Romantic', 'Sad'],
    'couples': ['Romantic'],
    'dating': ['Romantic', 'Comedy'],
    'wedding': ['Romantic', 'Happy'],
    
    // Sad keywords
    'sad': ['Sad', 'Inspiring'],
    'cry': ['Sad'],
    'emotional': ['Sad', 'Inspiring'],
    'heartbreak': ['Sad', 'Romantic'],
    'melancholy': ['Sad'],
    'tragic': ['Sad', 'Thriller'],
    
    // Comedy keywords
    'funny': ['Comedy', 'Happy'],
    'laugh': ['Comedy', 'Happy'],
    'hilarious': ['Comedy'],
    'comedy': ['Comedy'],
    'humorous': ['Comedy', 'Happy'],
    
    // Action keywords
    'action': ['Action', 'Adventure'],
    'exciting': ['Action', 'Adventure'],
    'fight': ['Action', 'Thriller'],
    'explosive': ['Action'],
    'intense': ['Action', 'Thriller'],
    'superhero': ['Action', 'Adventure'],
    'hero': ['Action', 'Inspiring'],
    
    // Thriller keywords
    'thriller': ['Thriller', 'Mystery'],
    'thrilling': ['Thriller', 'Action'],
    'suspense': ['Thriller', 'Mystery'],
    'tension': ['Thriller'],
    'edge': ['Thriller', 'Horror'],
    
    // Horror keywords
    'horror': ['Horror', 'Thriller'],
    'scary': ['Horror', 'Mystery'],
    'terrifying': ['Horror'],
    'creepy': ['Horror', 'Mystery'],
    'haunted': ['Horror', 'Mystery'],
    'ghost': ['Horror', 'Mystery'],
    'monster': ['Horror', 'Thriller'],
    
    // Sci-Fi keywords
    'scifi': ['Sci-Fi', 'Thriller'],
    'space': ['Sci-Fi', 'Adventure'],
    'futuristic': ['Sci-Fi', 'Action'],
    'aliens': ['Sci-Fi', 'Thriller'],
    'robots': ['Sci-Fi', 'Action'],
    'timetravel': ['Sci-Fi', 'Mystery'],
    
    // Adventure keywords
    'adventure': ['Adventure', 'Action'],
    'journey': ['Adventure', 'Inspiring'],
    'quest': ['Adventure', 'Mystery'],
    'explore': ['Adventure', 'Sci-Fi'],
    'epic': ['Adventure', 'Action'],
    
    // Mystery keywords
    'mystery': ['Mystery', 'Thriller'],
    'detective': ['Mystery', 'Thriller'],
    'whodunit': ['Mystery'],
    'investigation': ['Mystery', 'Thriller'],
    'puzzle': ['Mystery', 'Sci-Fi'],
    'secret': ['Mystery', 'Thriller'],
    
    // Chill keywords
    'chill': ['Chill', 'Romantic'],
    'relax': ['Chill', 'Happy'],
    'peaceful': ['Chill'],
    'calm': ['Chill', 'Inspiring'],
    'cozy': ['Chill', 'Happy'],
    'comfortable': ['Chill', 'Romantic'],
    
    // Inspiring keywords
    'inspiring': ['Inspiring', 'Happy'],
    'motivating': ['Inspiring', 'Action'],
    'uplifting': ['Inspiring', 'Happy'],
    'hope': ['Inspiring', 'Sad'],
    'dream': ['Inspiring', 'Adventure'],
    'courage': ['Inspiring', 'Action'],
    
    // General keywords
    'family': ['Happy', 'Comedy'],
    'kids': ['Happy', 'Comedy'],
    'cartoon': ['Happy', 'Comedy'],
    'fantasy': ['Adventure', 'Sci-Fi'],
    'magic': ['Adventure', 'Mystery'],
    'musical': ['Happy', 'Romantic'],
    'music': ['Happy', 'Chill'],
    'friendship': ['Happy', 'Inspiring'],
    'nostalgic': ['Sad', 'Romantic']
};

// Language regions
const LANGUAGE_REGIONS = {
    'Indian Languages': ['Hindi', 'Telugu', 'Tamil', 'Malayalam', 'Kannada', 'Bengali', 'Marathi', 'Punjabi', 'Gujarati'],
    'East Asian': ['Korean', 'Japanese', 'Chinese', 'Thai'],
    'European': ['English', 'Spanish', 'French', 'German', 'Italian', 'Portuguese', 'Russian'],
    'Other': ['Arabic', 'Turkish', 'Indonesian']
};

// Smart Suggestions Configuration
const MOOD_SUGGESTIONS = {
    'Happy': [
        { icon: '🎬', label: 'Family Comedies', filter: { sort: 'popularity.desc', rating: 6 } },
        { icon: '🌟', label: 'Feel-Good Classics', filter: { sort: 'vote_average.desc', rating: 7, year: '1950-1999' } },
        { icon: '🎭', label: 'Recent Comedies', filter: { year: '2023', sort: 'popularity.desc' } }
    ],
    'Romantic': [
        { icon: '💕', label: 'Romance Hits', filter: { sort: 'popularity.desc', rating: 7 } },
        { icon: '🌹', label: 'Classic Romance', filter: { sort: 'vote_average.desc', year: '1950-1999' } },
        { icon: '🎬', label: 'Recent Love Stories', filter: { year: '2023', sort: 'popularity.desc' } }
    ],
    'Sad': [
        { icon: '😢', label: 'Emotional Dramas', filter: { sort: 'vote_average.desc', rating: 7 } },
        { icon: '🎭', label: 'Heart-Touching Stories', filter: { sort: 'popularity.desc', rating: 6 } },
        { icon: '🌧️', label: 'Recent Dramas', filter: { year: '2023', sort: 'popularity.desc' } }
    ],
    'Comedy': [
        { icon: '😂', label: 'Top Comedies', filter: { sort: 'vote_average.desc', rating: 7 } },
        { icon: '🎪', label: 'Popular Laughs', filter: { sort: 'popularity.desc', rating: 6 } },
        { icon: '🎬', label: 'Recent Comedies', filter: { year: '2024', sort: 'popularity.desc' } }
    ],
    'Action': [
        { icon: '💥', label: 'Blockbuster Action', filter: { sort: 'popularity.desc', rating: 7 } },
        { icon: '🔥', label: 'High-Rated Action', filter: { sort: 'vote_average.desc', rating: 7 } },
        { icon: '⚡', label: 'Latest Action', filter: { year: '2024', sort: 'popularity.desc' } }
    ],
    'Thriller': [
        { icon: '😱', label: 'Edge of Seat', filter: { sort: 'vote_average.desc', rating: 7 } },
        { icon: '🔪', label: 'Popular Thrillers', filter: { sort: 'popularity.desc', rating: 6 } },
        { icon: '🎬', label: 'Recent Thrillers', filter: { year: '2023', sort: 'popularity.desc' } }
    ],
    'Horror': [
        { icon: '👻', label: 'Scariest Movies', filter: { sort: 'vote_average.desc', rating: 6 } },
        { icon: '🎃', label: 'Popular Horror', filter: { sort: 'popularity.desc', rating: 6 } },
        { icon: '🕷️', label: 'Recent Horror', filter: { year: '2024', sort: 'popularity.desc' } }
    ],
    'Sci-Fi': [
        { icon: '🚀', label: 'Sci-Fi Classics', filter: { sort: 'vote_average.desc', rating: 7, year: '1960-1999' } },
        { icon: '👽', label: 'Popular Sci-Fi', filter: { sort: 'popularity.desc', rating: 7 } },
        { icon: '🌌', label: 'Modern Sci-Fi', filter: { year: '2023', sort: 'popularity.desc' } }
    ],
    'Adventure': [
        { icon: '🗺️', label: 'Epic Adventures', filter: { sort: 'vote_average.desc', rating: 7 } },
        { icon: '⚔️', label: 'Popular Adventures', filter: { sort: 'popularity.desc', rating: 6 } },
        { icon: '🎬', label: 'Recent Adventures', filter: { year: '2024', sort: 'popularity.desc' } }
    ],
    'Mystery': [
        { icon: '🔍', label: 'Mind-Bending', filter: { sort: 'vote_average.desc', rating: 7 } },
        { icon: '🕵️', label: 'Popular Mysteries', filter: { sort: 'popularity.desc', rating: 6 } },
        { icon: '🎬', label: 'Recent Mysteries', filter: { year: '2023', sort: 'popularity.desc' } }
    ],
    'Chill': [
        { icon: '😌', label: 'Relaxing Picks', filter: { sort: 'vote_average.desc', rating: 6 } },
        { icon: '🌊', label: 'Easy Watching', filter: { sort: 'popularity.desc', rating: 6 } },
        { icon: '☕', label: 'Comfort Movies', filter: { year: '2020', sort: 'vote_average.desc' } }
    ],
    'Inspiring': [
        { icon: '⭐', label: 'Inspirational Stories', filter: { sort: 'vote_average.desc', rating: 7 } },
        { icon: '🏆', label: 'Motivational Hits', filter: { sort: 'popularity.desc', rating: 7 } },
        { icon: '💪', label: 'Recent Inspiration', filter: { year: '2023', sort: 'popularity.desc' } }
    ]
};

const LANGUAGE_SUGGESTIONS = {
    'en': [
        { icon: '🎬', label: 'Hollywood Hits', filter: { sort: 'popularity.desc', rating: 7 } },
        { icon: '🌟', label: 'Oscar Winners', filter: { sort: 'vote_average.desc', rating: 8 } }
    ],
    'hi': [
        { icon: '🎭', label: 'Bollywood Blockbusters', filter: { sort: 'popularity.desc', rating: 6 } },
        { icon: '⭐', label: 'Top Hindi Films', filter: { sort: 'vote_average.desc', rating: 7 } }
    ],
    'te': [
        { icon: '🎬', label: 'Tollywood Hits', filter: { sort: 'popularity.desc', rating: 6 } },
        { icon: '🌟', label: 'Best Telugu Cinema', filter: { sort: 'vote_average.desc', rating: 7 } }
    ],
    'ta': [
        { icon: '🎭', label: 'Kollywood Favorites', filter: { sort: 'popularity.desc', rating: 6 } },
        { icon: '⭐', label: 'Tamil Cinema Gems', filter: { sort: 'vote_average.desc', rating: 7 } }
    ],
    'ml': [
        { icon: '🎬', label: 'Malayalam Cinema', filter: { sort: 'popularity.desc', rating: 6 } },
        { icon: '🌟', label: 'Award-Winning Malayalam', filter: { sort: 'vote_average.desc', rating: 7 } }
    ],
    'kn': [
        { icon: '🎭', label: 'Sandalwood Hits', filter: { sort: 'popularity.desc', rating: 6 } },
        { icon: '⭐', label: 'Top Kannada Films', filter: { sort: 'vote_average.desc', rating: 7 } }
    ],
    'ko': [
        { icon: '🎬', label: 'K-Drama Movies', filter: { sort: 'popularity.desc', rating: 7 } },
        { icon: '🌟', label: 'Korean Cinema Gems', filter: { sort: 'vote_average.desc', rating: 7 } }
    ],
    'ja': [
        { icon: '🎭', label: 'Japanese Cinema', filter: { sort: 'popularity.desc', rating: 7 } },
        { icon: '⭐', label: 'Acclaimed Japanese Films', filter: { sort: 'vote_average.desc', rating: 7 } }
    ],
    'es': [
        { icon: '🎬', label: 'Spanish Cinema', filter: { sort: 'popularity.desc', rating: 6 } },
        { icon: '🌟', label: 'Hispanic Classics', filter: { sort: 'vote_average.desc', rating: 7 } }
    ],
    'fr': [
        { icon: '🎭', label: 'French Cinema', filter: { sort: 'popularity.desc', rating: 7 } },
        { icon: '⭐', label: 'French Masterpieces', filter: { sort: 'vote_average.desc', rating: 7 } }
    ]
};

const GENRE_SUGGESTIONS = [
    { icon: '🎬', label: 'Trending Now', filter: { sort: 'popularity.desc', rating: 6 } },
    { icon: '⭐', label: 'Highest Rated', filter: { sort: 'vote_average.desc', rating: 8 } },
    { icon: '�', label: 'Timeless Classics', filter: { sort: 'vote_average.desc', rating: 7, year: '1900-1999' } },
    { icon: '�🆕', label: '2024 Releases', filter: { year: '2024', sort: 'release_date.desc' } },
    { icon: '🏆', label: 'Award-Winning', filter: { sort: 'vote_average.desc', rating: 8, year: '2010-2024' } },
    { icon: '🔥', label: 'Popular Picks', filter: { sort: 'popularity.desc', rating: 7 } }
];

// State
let currentUser = null;
let primaryMood = null;
let selectedLanguage = '';
let allMovies = [];
let displayedMovies = [];
let currentPage = 1;
let totalPages = 0;
let isLoading = false;
let currentFilters = {
    sort: 'popularity.desc',
    rating: 0,
    year: '',
    language: ''
};

// Spotify State
let spotifyAccessToken = null;
let spotifyTokenExpiry = null;

// Quiz state
let quizAnswers = {
    energy: null,
    story: null,
    desire: null
};

// DOM Elements
const authSection = document.getElementById('authSection');
const mainContainer = document.getElementById('mainContainer');
const loginForm = document.getElementById('loginForm');
const signupForm = document.getElementById('signupForm');
const authTabs = document.querySelectorAll('.auth-tab');
const userName = document.getElementById('userName');
const logoutBtn = document.getElementById('logoutBtn');
const mainMoodInput = document.getElementById('mainMoodInput');
const moodSubmitBtn = document.getElementById('moodSubmitBtn');
const randomMoodBtn = document.getElementById('randomMoodBtn');
const moodInterpretation = document.getElementById('moodInterpretation');
const interpretationQuote = document.getElementById('interpretationQuote');
const interpretationMood = document.getElementById('interpretationMood');
const interpretationAura = document.getElementById('interpretationAura');
const advancedToggleBtn = document.getElementById('advancedToggleBtn');
const advancedOptions = document.getElementById('advancedOptions');
const primaryMoodGrid = document.getElementById('primaryMoodGrid');
const secondaryMoodGrid = document.getElementById('secondaryMoodGrid');
const moodBlendPreview = document.getElementById('moodBlendPreview');
const primaryChipPreview = document.getElementById('primaryChipPreview');
const secondaryChipPreview = document.getElementById('secondaryChipPreview');
const blendGradient = document.getElementById('blendGradient');
const clearBlendBtn = document.getElementById('clearBlendBtn');
const searchMoviesBtn = document.getElementById('searchMoviesBtn');
const searchSection = document.getElementById('searchSection');
const resultsSection = document.getElementById('resultsSection');
const currentSelection = document.getElementById('currentSelection');
const resultsCount = document.getElementById('resultsCount');
const backBtn = document.getElementById('backBtn');
const skeletonGrid = document.getElementById('skeletonGrid');
const loading = document.getElementById('loading');
const moviesGrid = document.getElementById('moviesGrid');
const loadMoreBtn = document.getElementById('loadMoreBtn');
const sortSelect = document.getElementById('sortSelect');
const ratingFilter = document.getElementById('ratingFilter');
const yearFilter = document.getElementById('yearFilter');
const languageFilter = document.getElementById('languageFilter');
const applyFiltersBtn = document.getElementById('applyFiltersBtn');
const trailerModal = document.getElementById('trailerModal');
const modalOverlay = document.getElementById('modalOverlay');
const modalClose = document.getElementById('modalClose');
const modalBody = document.getElementById('modalBody');
const streamingModal = document.getElementById('streamingModal');
const streamingOverlay = document.getElementById('streamingOverlay');
const streamingClose = document.getElementById('streamingClose');
const streamingBody = document.getElementById('streamingBody');
const particleCanvas = document.getElementById('particleCanvas');

// New Features: Vibe Map, Streaming Availability, Memory Log
const vibeMapSection = document.getElementById('vibeMapSection');
const vibeMapClose = document.getElementById('vibeMapClose');
const vibeOrbsContainer = document.getElementById('vibeOrbsContainer');
const moodMemorySidebar = document.getElementById('moodMemorySidebar');
const memoryList = document.getElementById('memoryList');
const memoryCloseBtn = document.getElementById('memoryCloseBtn');
const clearMemoryBtn = document.getElementById('clearMemoryBtn');

// Header Navigation Buttons
const showVibeMapBtn = document.getElementById('showVibeMapBtn');
const showMemoryLogBtn = document.getElementById('showMemoryLogBtn');
const vibeModeBtn = document.getElementById('vibeModeBtn');
const vibeModeCanvas = document.getElementById('vibeModeCanvas');

// State for new features
let upcomingMoviesData = [];
let currentUpcomingPage = 0;
let upcomingMoviesPerPage = 5;
let streamingDataCache = {};
let vibeMapSelectedMood = null;
let vibeMapInitialized = false;
let moodMemories = JSON.parse(localStorage.getItem('vibeverse_mood_memories') || '[]');
let currentMemoryPeriod = '3days';

// YouTube Player State
let youtubePlayer = null;
let youtubePlayerReady = false;
let currentYouTubeSong = null;

// YouTube IFrame API will be initialized by initYouTubePlayer() function

// Load YouTube Player
function loadYouTubePlayer(videoId, songData) {
    const popup = document.getElementById('youtubeMusicPopup');
    const container = document.getElementById('youtubePlayerContainer');
    const titleEl = document.getElementById('youtubeSongTitle');
    const artistEl = document.getElementById('youtubeSongArtist');
    
    // Store current song data
    currentYouTubeSong = songData;
    
    // Update popup info
    titleEl.textContent = songData.name;
    artistEl.textContent = songData.artist || (songData.artists ? songData.artists.map(a => a.name).join(', ') : 'Unknown Artist');
    
    // Show popup
    popup.classList.remove('hidden');
    
    // Destroy existing player if any
    if (youtubePlayer) {
        youtubePlayer.destroy();
    }
    
    // Wait for API to be ready
    const initPlayer = () => {
        // Clear container and create a new div for the player
        container.innerHTML = '<div id="youtube-player-frame"></div>';
        
        console.log('Initializing YouTube player with video ID:', videoId);
        
        // Create player
        youtubePlayer = new YT.Player('youtube-player-frame', {
            height: '100%',
            width: '100%',
            videoId: videoId,
            playerVars: {
                autoplay: 1,
                controls: 1,
                modestbranding: 1,
                rel: 0,
                showinfo: 0,
                fs: 1,
                playsinline: 1,
                origin: window.location.origin
            },
            events: {
                onReady: (event) => {
                    console.log('✅ YouTube player ready and playing');
                    event.target.playVideo();
                    showToast('🎵 Now playing full song!', 'success', 2500);
                },
                onStateChange: (event) => {
                    if (event.data === YT.PlayerState.ENDED) {
                        console.log('Song ended');
                        showToast('Song finished', 'info', 2000);
                    } else if (event.data === YT.PlayerState.PLAYING) {
                        console.log('▶️ Video playing');
                    } else if (event.data === YT.PlayerState.PAUSED) {
                        console.log('⏸️ Video paused');
                    } else if (event.data === YT.PlayerState.BUFFERING) {
                        console.log('⏳ Buffering...');
                    }
                },
                onError: (event) => {
                    console.error('❌ YouTube player error:', event.data);
                    let errorMsg = 'Error playing video';
                    switch(event.data) {
                        case 2: errorMsg = 'Invalid video ID'; break;
                        case 5: errorMsg = 'HTML5 player error'; break;
                        case 100: errorMsg = 'Video not found'; break;
                        case 101:
                        case 150: errorMsg = 'Video cannot be embedded'; break;
                    }
                    showToast(errorMsg, 'error', 3000);
                    setTimeout(() => {
                        closeYouTubePlayer();
                    }, 2000);
                }
            }
        });
    };
    
    if (typeof YT !== 'undefined' && YT.Player) {
        initPlayer();
    } else {
        // Wait for API to load
        const checkAPI = setInterval(() => {
            if (typeof YT !== 'undefined' && YT.Player) {
                clearInterval(checkAPI);
                initPlayer();
            }
        }, 100);
        
        // Timeout after 5 seconds
        setTimeout(() => {
            clearInterval(checkAPI);
            if (!youtubePlayer) {
                showToast('Failed to load YouTube player', 'error', 3000);
                closeYouTubePlayer();
            }
        }, 5000);
    }
}

// Minimize YouTube Player (play in background)
function minimizeYouTubePlayer() {
    const popup = document.getElementById('youtubeMusicPopup');
    const minimizedBar = document.getElementById('youtubeMinimizedBar');
    const minimizedTitle = document.getElementById('minimizedTitle');
    const minimizedArtist = document.getElementById('minimizedArtist');
    
    // Hide popup
    popup.classList.add('hidden');
    
    // Show minimized bar
    if (currentYouTubeSong) {
        minimizedTitle.textContent = currentYouTubeSong.name;
        minimizedArtist.textContent = currentYouTubeSong.artist;
        minimizedBar.classList.remove('hidden');
        showToast('🎵 Playing in background', 'success', 2000);
    }
}

// Restore YouTube Player
function restoreYouTubePlayer() {
    const popup = document.getElementById('youtubeMusicPopup');
    const minimizedBar = document.getElementById('youtubeMinimizedBar');
    
    // Hide minimized bar
    minimizedBar.classList.add('hidden');
    
    // Show popup
    popup.classList.remove('hidden');
}

// Close YouTube Player (stops playback)
function closeYouTubePlayer() {
    const popup = document.getElementById('youtubeMusicPopup');
    const minimizedBar = document.getElementById('youtubeMinimizedBar');
    
    // Hide both popup and minimized bar
    popup.classList.add('hidden');
    minimizedBar.classList.add('hidden');
    
    // Stop and destroy player
    if (youtubePlayer) {
        youtubePlayer.stopVideo();
        youtubePlayer.destroy();
        youtubePlayer = null;
    }
    
    currentYouTubeSong = null;
    showToast('Music stopped', 'info', 2000);
}

// Streaming Platform Information (Global + Indian Platforms)
const STREAMING_PLATFORMS = {
    // Global Platforms
    8: { name: 'Netflix', color: '#E50914', icon: '🎬', priority: 1 },
    15: { name: 'Prime Video', color: '#00A8E1', icon: '📺', priority: 2 },
    119: { name: 'Amazon Prime', color: '#00A8E1', icon: '📺', priority: 2 },
    337: { name: 'Disney+', color: '#113CCF', icon: '✨', priority: 3 },
    531: { name: 'Disney+ Hotstar', color: '#1E40AF', icon: '🌟', priority: 4 },
    384: { name: 'HBO Max', color: '#542D7A', icon: '🎭', priority: 5 },
    350: { name: 'Apple TV+', color: '#000000', icon: '🍎', priority: 6 },
    283: { name: 'Crunchyroll', color: '#F47521', icon: '📱', priority: 7 },
    
    // Indian OTT Platforms
    122: { name: 'Hotstar', color: '#1E40AF', icon: '⭐', priority: 8 },
    149: { name: 'Jio Cinema', color: '#8A2BE2', icon: '🎥', priority: 9 },
    499: { name: 'Zee5', color: '#9C27B0', icon: '📽️', priority: 10 },
    403: { name: 'Aha', color: '#FF6B6B', icon: '🎪', priority: 11 },
    444: { name: 'SonyLIV', color: '#FF4081', icon: '📹', priority: 12 },
    235: { name: 'Voot', color: '#FF6F00', icon: '🎦', priority: 13 },
    175: { name: 'Netflix India', color: '#E50914', icon: '🎬', priority: 14 },
    258: { name: 'MX Player', color: '#0277BD', icon: '▶️', priority: 15 },
    56: { name: 'Hoichoi', color: '#FF6B6B', icon: '🎨', priority: 16 },
    315: { name: 'Sun NXT', color: '#FF9800', icon: '☀️', priority: 17 },
    457: { name: 'ALTBalaji', color: '#E91E63', icon: '🎭', priority: 18 },
    545: { name: 'Lionsgate Play', color: '#FFD700', icon: '🦁', priority: 19 },
    521: { name: 'Eros Now', color: '#C62828', icon: '💫', priority: 20 }
};

// Particle System
class ParticleSystem {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.particles = [];
        this.particleCount = 60;
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    init() {
        this.particles = [];
        for (let i = 0; i < this.particleCount; i++) {
            this.particles.push(this.createParticle());
        }
    }

    createParticle() {
        return {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            vx: (Math.random() - 0.5) * 0.6,
            vy: (Math.random() - 0.5) * 0.6,
            size: Math.random() * 3 + 1,
            opacity: Math.random() * 0.4 + 0.1
        };
    }

    update() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((particle) => {
            particle.x += particle.vx;
            particle.y += particle.vy;

            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            this.ctx.save();
            this.ctx.globalAlpha = particle.opacity;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = '#6366f1';
            this.ctx.fill();
            this.ctx.restore();
        });
    }

    animate() {
        this.update();
        requestAnimationFrame(() => this.animate());
    }
}

const particleSystem = new ParticleSystem(particleCanvas);
particleSystem.init();
particleSystem.animate();

// ===========================
// Vibe Mode System
// ===========================

let currentVibeMode = localStorage.getItem('vibeverse_vibe_mode') || 'default';
let vibeAnimationId = null;

class VibeModeAnimations {
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        this.resize();
        window.addEventListener('resize', () => this.resize());
    }

    resize() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    clear() {
        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }

    // Happy - Disco Lights
    discoLights() {
        this.clear();
        const time = Date.now() * 0.001;
        
        for (let i = 0; i < 15; i++) {
            const x = (Math.sin(time + i) * 0.4 + 0.5) * this.canvas.width;
            const y = (Math.cos(time * 1.3 + i) * 0.4 + 0.5) * this.canvas.height;
            const radius = 50 + Math.sin(time * 2 + i) * 30;
            
            const gradient = this.ctx.createRadialGradient(x, y, 0, x, y, radius);
            const hue = (time * 50 + i * 40) % 360;
            gradient.addColorStop(0, `hsla(${hue}, 100%, 60%, 0.4)`);
            gradient.addColorStop(1, `hsla(${hue}, 100%, 60%, 0)`);
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        }
        
        vibeAnimationId = requestAnimationFrame(() => this.discoLights());
    }

    // Sad - Rain Drops
    rainEffect() {
        if (!this.rainDrops) {
            this.rainDrops = [];
            for (let i = 0; i < 100; i++) {
                this.rainDrops.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    length: Math.random() * 20 + 10,
                    speed: Math.random() * 3 + 2,
                    opacity: Math.random() * 0.3 + 0.1
                });
            }
        }
        
        this.clear();
        this.ctx.strokeStyle = 'rgba(150, 200, 255, 0.5)';
        this.ctx.lineWidth = 1;
        
        this.rainDrops.forEach(drop => {
            this.ctx.globalAlpha = drop.opacity;
            this.ctx.beginPath();
            this.ctx.moveTo(drop.x, drop.y);
            this.ctx.lineTo(drop.x, drop.y + drop.length);
            this.ctx.stroke();
            
            drop.y += drop.speed;
            if (drop.y > this.canvas.height) {
                drop.y = -drop.length;
                drop.x = Math.random() * this.canvas.width;
            }
        });
        
        this.ctx.globalAlpha = 1;
        vibeAnimationId = requestAnimationFrame(() => this.rainEffect());
    }

    // Energetic - Electric Bolts
    lightningBolts() {
        this.clear();
        
        if (Math.random() < 0.05) {
            const startX = Math.random() * this.canvas.width;
            const segments = 20;
            let x = startX;
            let y = 0;
            
            this.ctx.strokeStyle = 'rgba(147, 51, 234, 0.8)';
            this.ctx.lineWidth = 3;
            this.ctx.shadowBlur = 20;
            this.ctx.shadowColor = '#a855f7';
            
            this.ctx.beginPath();
            this.ctx.moveTo(x, y);
            
            for (let i = 0; i < segments; i++) {
                x += (Math.random() - 0.5) * 50;
                y += this.canvas.height / segments;
                this.ctx.lineTo(x, y);
            }
            
            this.ctx.stroke();
            this.ctx.shadowBlur = 0;
        }
        
        vibeAnimationId = requestAnimationFrame(() => this.lightningBolts());
    }

    // Romantic - Floating Hearts
    floatingHearts() {
        if (!this.hearts) {
            this.hearts = [];
            for (let i = 0; i < 20; i++) {
                this.hearts.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height + this.canvas.height,
                    size: Math.random() * 20 + 10,
                    speed: Math.random() * 0.5 + 0.3,
                    sway: Math.random() * 2,
                    opacity: Math.random() * 0.3 + 0.2
                });
            }
        }
        
        this.clear();
        
        this.hearts.forEach(heart => {
            this.ctx.globalAlpha = heart.opacity;
            this.ctx.fillStyle = '#ec4899';
            this.ctx.font = `${heart.size}px Arial`;
            this.ctx.fillText('💕', heart.x + Math.sin(heart.y * 0.05) * heart.sway, heart.y);
            
            heart.y -= heart.speed;
            if (heart.y < -heart.size) {
                heart.y = this.canvas.height + heart.size;
                heart.x = Math.random() * this.canvas.width;
            }
        });
        
        this.ctx.globalAlpha = 1;
        vibeAnimationId = requestAnimationFrame(() => this.floatingHearts());
    }

    // Calm - Starry Night
    starryNight() {
        if (!this.stars) {
            this.stars = [];
            for (let i = 0; i < 150; i++) {
                this.stars.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    size: Math.random() * 2 + 0.5,
                    twinkleSpeed: Math.random() * 0.02 + 0.01,
                    twinklePhase: Math.random() * Math.PI * 2
                });
            }
        }
        
        this.clear();
        const time = Date.now() * 0.001;
        
        this.stars.forEach(star => {
            const opacity = (Math.sin(time * star.twinkleSpeed + star.twinklePhase) + 1) * 0.3 + 0.2;
            this.ctx.globalAlpha = opacity;
            this.ctx.fillStyle = '#ffffff';
            this.ctx.beginPath();
            this.ctx.arc(star.x, star.y, star.size, 0, Math.PI * 2);
            this.ctx.fill();
        });
        
        this.ctx.globalAlpha = 1;
        vibeAnimationId = requestAnimationFrame(() => this.starryNight());
    }

    // Mystery - Fog Effect
    fogEffect() {
        if (!this.fogParticles) {
            this.fogParticles = [];
            for (let i = 0; i < 30; i++) {
                this.fogParticles.push({
                    x: Math.random() * this.canvas.width,
                    y: Math.random() * this.canvas.height,
                    radius: Math.random() * 100 + 50,
                    speedX: (Math.random() - 0.5) * 0.3,
                    speedY: (Math.random() - 0.5) * 0.2,
                    opacity: Math.random() * 0.15 + 0.05
                });
            }
        }
        
        this.clear();
        
        this.fogParticles.forEach(fog => {
            const gradient = this.ctx.createRadialGradient(fog.x, fog.y, 0, fog.x, fog.y, fog.radius);
            gradient.addColorStop(0, `rgba(139, 92, 246, ${fog.opacity})`);
            gradient.addColorStop(1, 'rgba(139, 92, 246, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            fog.x += fog.speedX;
            fog.y += fog.speedY;
            
            if (fog.x < -fog.radius) fog.x = this.canvas.width + fog.radius;
            if (fog.x > this.canvas.width + fog.radius) fog.x = -fog.radius;
            if (fog.y < -fog.radius) fog.y = this.canvas.height + fog.radius;
            if (fog.y > this.canvas.height + fog.radius) fog.y = -fog.radius;
        });
        
        vibeAnimationId = requestAnimationFrame(() => this.fogEffect());
    }

    // Horror - Dark Shadows
    darkShadows() {
        if (!this.shadows) {
            this.shadows = [];
            for (let i = 0; i < 10; i++) {
                this.shadows.push({
                    x: Math.random() * this.canvas.width,
                    y: this.canvas.height + 100,
                    size: Math.random() * 150 + 100,
                    speed: Math.random() * 0.5 + 0.2,
                    opacity: Math.random() * 0.3 + 0.2
                });
            }
        }
        
        this.clear();
        const time = Date.now() * 0.001;
        
        this.shadows.forEach(shadow => {
            const gradient = this.ctx.createRadialGradient(
                shadow.x, shadow.y, 0, 
                shadow.x, shadow.y, shadow.size
            );
            gradient.addColorStop(0, `rgba(20, 0, 0, ${shadow.opacity})`);
            gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
            
            this.ctx.fillStyle = gradient;
            this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
            
            shadow.y -= shadow.speed;
            shadow.x += Math.sin(time + shadow.y * 0.01) * 0.5;
            
            if (shadow.y < -shadow.size) {
                shadow.y = this.canvas.height + shadow.size;
                shadow.x = Math.random() * this.canvas.width;
            }
        });
        
        vibeAnimationId = requestAnimationFrame(() => this.darkShadows());
    }

    stop() {
        if (vibeAnimationId) {
            cancelAnimationFrame(vibeAnimationId);
            vibeAnimationId = null;
        }
        this.clear();
        // Reset animation-specific data
        this.rainDrops = null;
        this.hearts = null;
        this.stars = null;
        this.fogParticles = null;
        this.shadows = null;
    }
}

const vibeModeAnimations = new VibeModeAnimations(vibeModeCanvas);

// Mood to Vibe Mode Mapping
const MOOD_TO_VIBE_MAP = {
    'Happy': 'happy',
    'Joyful': 'happy',
    'Excited': 'energetic',
    'Energetic': 'energetic',
    'Cheerful': 'happy',
    'Sad': 'sad',
    'Melancholy': 'sad',
    'Depressed': 'sad',
    'Lonely': 'sad',
    'Nostalgic': 'calm',
    'Romantic': 'romantic',
    'Passionate': 'romantic',
    'Loving': 'romantic',
    'Heartwarming': 'romantic',
    'Calm': 'calm',
    'Peaceful': 'calm',
    'Relaxed': 'calm',
    'Serene': 'calm',
    'Meditative': 'calm',
    'Adventurous': 'energetic',
    'Thrilling': 'energetic',
    'Action': 'energetic',
    'Epic': 'energetic',
    'Mysterious': 'mystery',
    'Mystery': 'mystery',
    'Suspenseful': 'mystery',
    'Thriller': 'mystery',
    'Dark': 'horror',
    'Horror': 'horror',
    'Scary': 'horror',
    'Tense': 'horror',
    'Comedy': 'happy',
    'Funny': 'happy',
    'Inspiring': 'energetic',
    'Motivating': 'energetic',
    'Empowering': 'energetic',
    'Fantasy': 'mystery',
    'Magical': 'mystery',
    'Dreamy': 'calm',
    'Cozy': 'calm'
};

function autoApplyVibeModeForMood(mood) {
    // Map mood to vibe mode
    const vibeType = MOOD_TO_VIBE_MAP[mood] || 'default';
    
    // Apply the vibe mode
    applyVibeMode(vibeType);
    
    // Show a subtle notification
    showVibeChangeNotification(mood, vibeType);
    
    console.log(`Auto-applied vibe mode: ${vibeType} for mood: ${mood}`);
}

function showVibeChangeNotification(mood, vibeType) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'vibe-change-notification';
    notification.innerHTML = `
        <div class="vibe-notification-content">
            <span class="vibe-notification-icon">🎨</span>
            <div class="vibe-notification-text">
                <strong>Vibe Mode Active</strong>
                <span>${vibeType.charAt(0).toUpperCase() + vibeType.slice(1)} theme applied for ${mood} mood</span>
            </div>
        </div>
    `;
    
    document.body.appendChild(notification);
    
    // Animate in
    setTimeout(() => notification.classList.add('show'), 100);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

function showToast(message, type = 'info', duration = 3000) {
    const icons = {
        info: 'ℹ️',
        success: '✅',
        warning: '⚠️',
        error: '❌',
        music: '🎵'
    };
    
    const toast = document.createElement('div');
    toast.className = 'toast-notification';
    toast.innerHTML = `
        <span class="toast-icon">${icons[type] || icons.info}</span>
        <span class="toast-message">${message}</span>
    `;
    
    document.body.appendChild(toast);
    
    setTimeout(() => toast.classList.add('show'), 100);
    
    setTimeout(() => {
        toast.classList.remove('show');
        setTimeout(() => toast.remove(), 300);
    }, duration);
}

// Custom Alert Modal (styled replacement for browser alert)
function showCustomAlert(title, message, type = 'info') {
    const icons = {
        info: 'ℹ️',
        success: '✅',
        warning: '⚠️',
        error: '❌'
    };
    
    const colors = {
        info: '#3b82f6',
        success: '#10b981',
        warning: '#f59e0b',
        error: '#ef4444'
    };
    
    // Remove existing alert if any
    const existingAlert = document.getElementById('customAlertModal');
    if (existingAlert) existingAlert.remove();
    
    const alertModal = document.createElement('div');
    alertModal.id = 'customAlertModal';
    alertModal.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background: rgba(0, 0, 0, 0.75);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 10000;
        animation: fadeIn 0.3s ease;
    `;
    
    alertModal.innerHTML = `
        <div style="
            background: linear-gradient(135deg, var(--card-bg), var(--secondary-bg));
            border: 2px solid ${colors[type]};
            border-radius: 20px;
            padding: 35px;
            max-width: 450px;
            width: 90%;
            box-shadow: 0 20px 60px rgba(0, 0, 0, 0.5);
            animation: slideUp 0.3s ease;
            text-align: center;
        ">
            <div style="font-size: 3rem; margin-bottom: 15px;">${icons[type]}</div>
            <h2 style="
                color: var(--text-primary);
                font-size: 1.5rem;
                margin-bottom: 15px;
                font-weight: 700;
            ">${title}</h2>
            <p style="
                color: var(--text-secondary);
                font-size: 1rem;
                line-height: 1.6;
                margin-bottom: 25px;
            ">${message}</p>
            <button onclick="document.getElementById('customAlertModal').remove()" style="
                background: linear-gradient(135deg, ${colors[type]}, ${colors[type]}dd);
                color: white;
                border: none;
                padding: 12px 35px;
                border-radius: 12px;
                font-size: 1rem;
                font-weight: 600;
                cursor: pointer;
                transition: all 0.3s ease;
                box-shadow: 0 4px 15px ${colors[type]}40;
            " onmouseover="this.style.transform='scale(1.05)'; this.style.boxShadow='0 6px 25px ${colors[type]}60';" onmouseout="this.style.transform='scale(1)'; this.style.boxShadow='0 4px 15px ${colors[type]}40';">
                OK
            </button>
        </div>
    `;
    
    document.body.appendChild(alertModal);
    
    // Close on background click
    alertModal.addEventListener('click', (e) => {
        if (e.target === alertModal) {
            alertModal.remove();
        }
    });
}

function applyVibeMode(vibeType) {
    // Stop any current animation
    vibeModeAnimations.stop();
    
    // Update active card
    document.querySelectorAll('.vibe-mode-card').forEach(card => {
        card.classList.remove('active');
        if (card.dataset.vibe === vibeType) {
            card.classList.add('active');
        }
    });
    
    // Apply theme to body
    if (vibeType === 'default') {
        document.body.removeAttribute('data-vibe');
    } else {
        document.body.setAttribute('data-vibe', vibeType);
    }
    
    // Update indicator text
    const indicator = document.getElementById('vibeModeIndicator');
    if (indicator) {
        indicator.textContent = vibeType.charAt(0).toUpperCase() + vibeType.slice(1);
    }
    
    // Apply canvas animation
    if (vibeType === 'default') {
        vibeModeCanvas.classList.remove('active');
    } else {
        vibeModeCanvas.classList.add('active');
        
        switch(vibeType) {
            case 'happy':
                vibeModeAnimations.discoLights();
                break;
            case 'sad':
                vibeModeAnimations.rainEffect();
                break;
            case 'energetic':
                vibeModeAnimations.lightningBolts();
                break;
            case 'romantic':
                vibeModeAnimations.floatingHearts();
                break;
            case 'calm':
                vibeModeAnimations.starryNight();
                break;
            case 'mystery':
                vibeModeAnimations.fogEffect();
                break;
            case 'horror':
                vibeModeAnimations.darkShadows();
                break;
        }
    }
    
    // Save preference
    currentVibeMode = vibeType;
    localStorage.setItem('vibeverse_vibe_mode', vibeType);
}

// Event Listeners for Vibe Mode
const vibeModePanel = document.getElementById('vibeModePanel');
const vibeModeClose = document.getElementById('vibeModeClose');

vibeModeBtn.addEventListener('click', () => {
    vibeModePanel.classList.toggle('hidden');
});

vibeModeClose.addEventListener('click', () => {
    vibeModePanel.classList.add('hidden');
});

document.querySelectorAll('.vibe-mode-card').forEach(card => {
    card.addEventListener('click', () => {
        const vibeType = card.dataset.vibe;
        
        // Update active state
        document.querySelectorAll('.vibe-mode-card').forEach(c => c.classList.remove('active'));
        card.classList.add('active');
        
        // Apply vibe mode
        applyVibeMode(vibeType);
        
        // Close panel on mobile
        if (window.innerWidth <= 768) {
            vibeModePanel.classList.add('hidden');
        }
    });
});

// Event Listeners for YouTube Player
const youtubeClose = document.getElementById('youtubeClose');
const youtubePopupOverlay = document.getElementById('youtubePopupOverlay');
const youtubeMinimize = document.getElementById('youtubeMinimize');
const youtubeRestore = document.getElementById('youtubeRestore');
const youtubeMinimizedClose = document.getElementById('youtubeMinimizedClose');

if (youtubeClose) {
    youtubeClose.addEventListener('click', closeYouTubePlayer);
}

if (youtubePopupOverlay) {
    youtubePopupOverlay.addEventListener('click', minimizeYouTubePlayer);
}

if (youtubeMinimize) {
    youtubeMinimize.addEventListener('click', minimizeYouTubePlayer);
}

if (youtubeRestore) {
    youtubeRestore.addEventListener('click', restoreYouTubePlayer);
}

if (youtubeMinimizedClose) {
    youtubeMinimizedClose.addEventListener('click', closeYouTubePlayer);
}

// Initialize
function init() {
    checkAuth();
    setupQuiz();
    setupMemoryLogEventListeners();
    initCustomLanguagePicker();
    // YouTube Music Player controls are initialized automatically by initYouTubeMusicPlayerControls()
    
    // Apply saved vibe mode
    applyVibeMode(currentVibeMode);
    
    console.log('VibeVerse initialized - YouTube Music player ready');
}

// Custom Language Picker Functionality
function initCustomLanguagePicker() {
    const languageChips = document.querySelectorAll('.language-chip');
    const languageBadge = document.getElementById('languageBadge');
    const languageFilter = document.getElementById('languageFilter');
    const languageToggleBtn = document.getElementById('languageToggleBtn');
    const customLanguagePicker = document.getElementById('customLanguagePicker');
    
    if (!languageChips.length || !languageBadge || !languageFilter) return;
    
    // Toggle collapse/expand
    if (languageToggleBtn && customLanguagePicker) {
        languageToggleBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Toggle classes
            const isCollapsed = customLanguagePicker.classList.contains('collapsed');
            
            if (isCollapsed) {
                customLanguagePicker.classList.remove('collapsed');
                customLanguagePicker.classList.add('expanded');
                this.classList.remove('collapsed');
            } else {
                customLanguagePicker.classList.add('collapsed');
                customLanguagePicker.classList.remove('expanded');
                this.classList.add('collapsed');
            }
            
            // Add bounce animation to icon
            const icon = this.querySelector('.collapse-icon');
            if (icon) {
                icon.style.animation = 'none';
                setTimeout(() => {
                    icon.style.animation = 'iconBounce 0.3s ease';
                }, 10);
            }
        });
    }
    
    languageChips.forEach(chip => {
        chip.addEventListener('click', function() {
            // Remove active class from all chips
            languageChips.forEach(c => c.classList.remove('active'));
            
            // Add active class to clicked chip
            this.classList.add('active');
            
            // Get language code and name
            const langCode = this.dataset.lang;
            const langName = this.dataset.name;
            
            // Update badge
            languageBadge.textContent = langName;
            languageBadge.style.animation = 'none';
            setTimeout(() => {
                languageBadge.style.animation = 'badgePulse 0.5s ease';
            }, 10);
            
            // Update hidden select for backward compatibility
            languageFilter.value = langCode;
            
            // Update selected language and display suggestions
            selectedLanguage = langCode;
            displaySmartSuggestions();
            
            // Add ripple effect
            createRipple(this);
            
            // Trigger filter update if the apply button exists
            if (applyFiltersBtn) {
                setTimeout(() => {
                    applyFiltersBtn.click();
                }, 300);
            }
        });
        
        // Add hover sound effect (optional)
        chip.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
        });
    });
}

function createRipple(element) {
    const ripple = document.createElement('span');
    ripple.style.position = 'absolute';
    ripple.style.borderRadius = '50%';
    ripple.style.background = 'rgba(99, 102, 241, 0.5)';
    ripple.style.width = '20px';
    ripple.style.height = '20px';
    ripple.style.top = '50%';
    ripple.style.left = '50%';
    ripple.style.transform = 'translate(-50%, -50%)';
    ripple.style.pointerEvents = 'none';
    ripple.style.animation = 'ripple 0.6s ease-out';
    
    element.style.position = 'relative';
    element.appendChild(ripple);
    
    setTimeout(() => {
        ripple.remove();
    }, 600);
}

// ==================== MOOD MEMORY LOG FUNCTIONS ====================

/**
 * Save mood to memory log
 */
function saveMoodToMemory(mood) {
    const memory = {
        mood: mood,
        timestamp: Date.now(),
        date: new Date().toLocaleDateString(),
        movies: [] // Can store selected movies later
    };
    
    moodMemories.unshift(memory);
    
    // Keep only last 50 memories
    if (moodMemories.length > 50) {
        moodMemories = moodMemories.slice(0, 50);
    }
    
    localStorage.setItem('vibeverse_mood_memories', JSON.stringify(moodMemories));
}

/**
 * Show mood memory log sidebar
 */
function showMoodMemoryLog() {
    moodMemorySidebar.classList.remove('hidden');
    renderMemoryLog();
}

/**
 * Render memory log based on selected period
 */
function renderMemoryLog() {
    const now = Date.now();
    const periodMs = currentMemoryPeriod === '3days' ? 3 * 24 * 60 * 60 * 1000 : 7 * 24 * 60 * 60 * 1000;
    
    const filteredMemories = moodMemories.filter(memory => {
        return (now - memory.timestamp) <= periodMs;
    });
    
    if (filteredMemories.length === 0) {
        memoryList.innerHTML = `
            <div class="empty-memory">
                <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5">
                    <path d="M12 2.69l5.66 5.66a8 8 0 1 1-11.31 0z"/>
                </svg>
                <p>No mood memories yet</p>
                <span>Start exploring to build your vibe journal</span>
            </div>
        `;
        return;
    }
    
    memoryList.innerHTML = filteredMemories.map((memory, index) => {
        const moodData = MOOD_MAPPINGS[memory.mood];
        const timeAgo = getTimeAgo(memory.timestamp);
        
        return `
            <div class="memory-item" style="--delay: ${index * 0.05}s" data-mood="${memory.mood}">
                <div class="memory-mood-badge" style="background: ${moodData?.gradient || 'var(--accent-color)'}">
                    ${getMoodIcon(memory.mood)}
                </div>
                <div class="memory-details">
                    <div class="memory-mood-name">${memory.mood}</div>
                    <div class="memory-time">${timeAgo} • ${memory.date}</div>
                </div>
                <button class="memory-replay" data-mood="${memory.mood}" title="Replay this vibe">
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                        <polygon points="5 3 19 12 5 21 5 3"/>
                    </svg>
                </button>
            </div>
        `;
    }).join('');
    
    // Add event listeners to replay buttons
    document.querySelectorAll('.memory-replay').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const mood = btn.dataset.mood;
            replayMood(mood);
        });
    });
}

/**
 * Get relative time string
 */
function getTimeAgo(timestamp) {
    const seconds = Math.floor((Date.now() - timestamp) / 1000);
    
    if (seconds < 60) return 'Just now';
    if (seconds < 3600) return `${Math.floor(seconds / 60)}m ago`;
    if (seconds < 86400) return `${Math.floor(seconds / 3600)}h ago`;
    if (seconds < 172800) return 'Yesterday';
    return `${Math.floor(seconds / 86400)}d ago`;
}

/**
 * Replay a mood from memory
 */
function replayMood(mood) {
    primaryMood = mood;
    moodMemorySidebar.classList.add('hidden');
    searchMovies();
}

/**
 * Setup memory log event listeners
 */
function setupMemoryLogEventListeners() {
    // Close button
    if (memoryCloseBtn) {
        memoryCloseBtn.addEventListener('click', () => {
            moodMemorySidebar.classList.add('hidden');
        });
    }
    
    // Clear memory button
    if (clearMemoryBtn) {
        clearMemoryBtn.addEventListener('click', () => {
            if (confirm('Are you sure you want to clear your vibe journal?')) {
                moodMemories = [];
                localStorage.setItem('vibeverse_mood_memories', JSON.stringify(moodMemories));
                renderMemoryLog();
            }
        });
    }
    
    // Tab switching
    document.querySelectorAll('.memory-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            document.querySelectorAll('.memory-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            currentMemoryPeriod = tab.dataset.period;
            renderMemoryLog();
        });
    });
}

// Auth Functions
function checkAuth() {
    const user = localStorage.getItem('vibeverse_user');
    if (user) {
        currentUser = JSON.parse(user);
        showMainApp();
    } else {
        showAuth();
    }
}

function showAuth() {
    authSection.classList.remove('hidden');
    mainContainer.classList.add('hidden');
}

function showMainApp() {
    authSection.classList.add('hidden');
    mainContainer.classList.remove('hidden');
    userName.textContent = `Welcome, ${currentUser.name}!`;
}

// Auth Tab Switching
authTabs.forEach(tab => {
    tab.addEventListener('click', () => {
        authTabs.forEach(t => t.classList.remove('active'));
        tab.classList.add('active');
        
        if (tab.dataset.tab === 'login') {
            loginForm.classList.remove('hidden');
            signupForm.classList.add('hidden');
        } else {
            loginForm.classList.add('hidden');
            signupForm.classList.remove('hidden');
        }
    });
});

// Login
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const email = document.getElementById('loginEmail').value;
    const password = document.getElementById('loginPassword').value;
    
    const users = JSON.parse(localStorage.getItem('vibeverse_users') || '[]');
    const user = users.find(u => u.email === email && u.password === password);
    
    if (user) {
        currentUser = { name: user.name, email: user.email };
        localStorage.setItem('vibeverse_user', JSON.stringify(currentUser));
        showMainApp();
    } else {
        showToast('Invalid email or password', 'error', 3000);
    }
});

// Guest Login
const guestLoginBtn = document.getElementById('guestLoginBtn');
if (guestLoginBtn) {
    guestLoginBtn.addEventListener('click', () => {
        currentUser = { name: 'Guest', email: 'guest@vibeverse.com' };
        localStorage.setItem('vibeverse_user', JSON.stringify(currentUser));
        showMainApp();
    });
}

// Signup
signupForm.addEventListener('submit', (e) => {
    e.preventDefault();
    const name = document.getElementById('signupName').value;
    const email = document.getElementById('signupEmail').value;
    const password = document.getElementById('signupPassword').value;
    
    const users = JSON.parse(localStorage.getItem('vibeverse_users') || '[]');
    
    if (users.find(u => u.email === email)) {
        showToast('Email already registered', 'error', 3000);
        return;
    }
    
    users.push({ name, email, password });
    localStorage.setItem('vibeverse_users', JSON.stringify(users));
    
    currentUser = { name, email };
    localStorage.setItem('vibeverse_user', JSON.stringify(currentUser));
    showMainApp();
});

// Logout
logoutBtn.addEventListener('click', () => {
    localStorage.removeItem('vibeverse_user');
    currentUser = null;
    showAuth();
    resetApp();
});

function resetApp() {
    searchSection.classList.remove('hidden');
    resultsSection.classList.add('hidden');
    primaryMood = null;
    selectedLanguage = '';
    allMovies = [];
    displayedMovies = [];
    currentPage = 1;
    mainMoodInput.value = '';
    moodInterpretation.classList.add('hidden');
    advancedOptions.classList.add('hidden');
    
    // Reset quiz
    quizAnswers = { energy: null, story: null, desire: null };
    document.querySelectorAll('.quiz-option').forEach(opt => opt.classList.remove('selected'));
    
    // Reset filters
    sortSelect.value = 'popularity.desc';
    ratingFilter.value = '0';
    yearFilter.value = '';
    languageFilter.value = '';
    currentFilters = {
        sort: 'popularity.desc',
        rating: 0,
        year: '',
        language: ''
    };
    
    // Reset language chips to "All Languages"
    const languageChips = document.querySelectorAll('.language-chip');
    const languageBadge = document.getElementById('languageBadge');
    if (languageChips.length > 0) {
        languageChips.forEach(chip => chip.classList.remove('active'));
        // Set "All Languages" chip as active (the one with empty data-lang)
        const allLanguagesChip = Array.from(languageChips).find(chip => chip.dataset.lang === '');
        if (allLanguagesChip) {
            allLanguagesChip.classList.add('active');
        }
        if (languageBadge) {
            languageBadge.textContent = 'All';
        }
    }
}

// Advanced Options Toggle
advancedToggleBtn.addEventListener('click', () => {
    advancedOptions.classList.toggle('hidden');
    const chevron = advancedToggleBtn.querySelector('.chevron');
    chevron.style.transform = advancedOptions.classList.contains('hidden') ? 'rotate(0deg)' : 'rotate(180deg)';
});

// Main Mood Input Handler
mainMoodInput.addEventListener('input', (e) => {
    const value = e.target.value.trim().toLowerCase();
    
    if (value.length > 2) {
        // Find matching mood
        const matchedMood = findBestMoodMatch(value);
        if (matchedMood) {
            showMoodInterpretation(matchedMood);
        }
    } else {
        moodInterpretation.classList.add('hidden');
    }
});

// Find best mood match from input
function findBestMoodMatch(input) {
    const lowerInput = input.toLowerCase();
    
    // Direct match
    for (const [mood, data] of Object.entries(MOOD_MAPPINGS)) {
        if (mood.toLowerCase().includes(lowerInput) || lowerInput.includes(mood.toLowerCase())) {
            return mood;
        }
    }
    
    // Keyword match
    for (const [keyword, moods] of Object.entries(CUSTOM_MOOD_KEYWORDS)) {
        if (lowerInput.includes(keyword)) {
            return moods[0];
        }
    }
    
    // Special cases
    const moodMap = {
        'dream': 'Nostalgic',
        'calm': 'Cozy',
        'peace': 'Cozy',
        'warm': 'Heartwarming',
        'dark': 'Mystery',
        'bright': 'Uplifting',
        'wild': 'Adventure',
        'quiet': 'Cozy',
        'loud': 'Energetic',
        'soft': 'Heartwarming',
        'intense': 'Action'
    };
    
    for (const [key, mood] of Object.entries(moodMap)) {
        if (lowerInput.includes(key)) {
            return mood;
        }
    }
    
    return null;
}

// Show mood interpretation with poetic quote and aura
function showMoodInterpretation(moodName) {
    const moodData = MOOD_MAPPINGS[moodName];
    if (!moodData) return;
    
    // Update quote
    interpretationQuote.textContent = moodData.quote;
    interpretationMood.textContent = `~ ${moodName} ~`;
    interpretationMood.style.background = moodData.gradient;
    interpretationMood.style.webkitBackgroundClip = 'text';
    interpretationMood.style.webkitTextFillColor = 'transparent';
    interpretationMood.style.backgroundClip = 'text';
    
    // Update aura
    interpretationAura.style.background = moodData.aura;
    
    // Show interpretation
    moodInterpretation.classList.remove('hidden');
    
    // Auto-set as primary mood
    primaryMood = moodName;
}

// Mood Submit Button
moodSubmitBtn.addEventListener('click', () => {
    const value = mainMoodInput.value.trim();
    if (!value) {
        showToast('Please describe your mood', 'warning', 3000);
        return;
    }
    
    const matchedMood = findBestMoodMatch(value);
    if (matchedMood) {
        primaryMood = matchedMood;
        searchMovies();
    } else {
        showToast('Could not understand your mood. Try words like: dreamy, adventurous, cozy, exciting...', 'warning', 4000);
    }
});

mainMoodInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        moodSubmitBtn.click();
    }
});

// Random Mood Button - Feeling Random?
randomMoodBtn.addEventListener('click', () => {
    // Add shuffling animation
    randomMoodBtn.classList.add('shuffling');
    
    // Get all available moods
    const allMoods = Object.keys(MOOD_MAPPINGS);
    
    // Pick a random mood
    const randomIndex = Math.floor(Math.random() * allMoods.length);
    const randomMood = allMoods[randomIndex];
    
    // Show loading state
    const originalName = randomMoodBtn.querySelector('.mood-name').textContent;
    randomMoodBtn.querySelector('.mood-name').textContent = 'Shuffling...';
    randomMoodBtn.style.pointerEvents = 'none';
    
    // Simulate shuffle animation with multiple mood names
    let shuffleCount = 0;
    const shuffleInterval = setInterval(() => {
        const tempMood = allMoods[Math.floor(Math.random() * allMoods.length)];
        randomMoodBtn.querySelector('.mood-desc').textContent = `${tempMood} vibes...`;
        shuffleCount++;
        
        if (shuffleCount >= 8) {
            clearInterval(shuffleInterval);
            
            // Set the final random mood
            primaryMood = randomMood;
            
            // Update button text
            randomMoodBtn.querySelector('.mood-name').textContent = `${randomMood}! 🎲`;
            randomMoodBtn.querySelector('.mood-desc').textContent = `Loading ${randomMood.toLowerCase()} recommendations...`;
            
            // Remove shuffling animation
            setTimeout(() => {
                randomMoodBtn.classList.remove('shuffling');
                randomMoodBtn.style.pointerEvents = 'auto';
                
                // Search movies with random mood
                searchMovies();
                
                // Reset button after a delay
                setTimeout(() => {
                    randomMoodBtn.querySelector('.mood-name').textContent = 'Surprise Me!';
                    randomMoodBtn.querySelector('.mood-desc').textContent = 'Random mood magic';
                }, 2000);
            }, 500);
        }
    }, 100);
});

// Quick Mood Buttons - Direct mood selection
const quickMoodBtns = document.querySelectorAll('.quick-mood-btn[data-mood]');
quickMoodBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const mood = btn.dataset.mood;
        
        // Add click animation
        btn.style.transform = 'scale(0.95)';
        setTimeout(() => {
            btn.style.transform = '';
        }, 200);
        
        // Set mood and search
        primaryMood = mood;
        
        // Update button text temporarily
        const originalName = btn.querySelector('.mood-name').textContent;
        const originalDesc = btn.querySelector('.mood-desc').textContent;
        
        btn.querySelector('.mood-name').textContent = `${mood}! ✨`;
        btn.querySelector('.mood-desc').textContent = `Loading...`;
        
        // Search movies
        setTimeout(() => {
            searchMovies();
            
            // Reset button text
            setTimeout(() => {
                btn.querySelector('.mood-name').textContent = originalName;
                btn.querySelector('.mood-desc').textContent = originalDesc;
            }, 2000);
        }, 300);
    });
});

// Render Mood Grid - REMOVED (replaced with quiz)
// Quiz functionality
let currentQuizQuestion = 1;

function setupQuiz() {
    const quizOptions = document.querySelectorAll('.quiz-option');
    
    quizOptions.forEach(option => {
        option.addEventListener('click', (e) => {
            const question = e.currentTarget.dataset.question;
            const value = e.currentTarget.dataset.value;
            
            // Remove selected state from siblings
            const siblings = document.querySelectorAll(`[data-question="${question}"]`);
            siblings.forEach(sib => sib.classList.remove('selected'));
            
            // Add selected state
            e.currentTarget.classList.add('selected');
            
            // Store answer
            if (question === '1') quizAnswers.energy = value;
            if (question === '2') quizAnswers.story = value;
            if (question === '3') quizAnswers.desire = value;
            
            // Move to next question after a short delay
            setTimeout(() => {
                moveToNextQuestion(parseInt(question));
            }, 400);
        });
    });
}

function moveToNextQuestion(currentQuestion) {
    // Hide current question
    const currentQuestionEl = document.getElementById(`question${currentQuestion}`);
    if (currentQuestionEl) {
        currentQuestionEl.classList.add('hidden');
    }
    
    // Show next question or final button
    if (currentQuestion < 3) {
        const nextQuestionEl = document.getElementById(`question${currentQuestion + 1}`);
        if (nextQuestionEl) {
            nextQuestionEl.classList.remove('hidden');
            nextQuestionEl.style.animation = 'fadeInUp 0.5s ease-out';
        }
        currentQuizQuestion = currentQuestion + 1;
        updateQuizProgress();
    } else {
        // All questions answered, show submit button
        const submitBtn = document.getElementById('searchMoviesBtn');
        if (submitBtn) {
            submitBtn.classList.remove('hidden');
            submitBtn.style.animation = 'fadeInUp 0.5s ease-out';
        }
        checkQuizCompletion();
    }
}

function updateQuizProgress() {
    const progressFill = document.getElementById('quizProgress');
    const progressText = document.getElementById('progressText');
    
    if (progressFill) {
        const percentage = (currentQuizQuestion / 3) * 100;
        progressFill.style.width = `${percentage}%`;
    }
    
    if (progressText) {
        progressText.textContent = `Question ${currentQuizQuestion} of 3`;
    }
}

function checkQuizCompletion() {
    const allAnswered = quizAnswers.energy && quizAnswers.story && quizAnswers.desire;
    
    if (allAnswered) {
        // Determine mood based on quiz answers
        primaryMood = determineMoodFromQuiz(quizAnswers);
        
        // Show mood interpretation
        if (primaryMood) {
            showMoodInterpretation(primaryMood);
            
            // Display smart suggestions for the detected mood
            displaySmartSuggestions();
            
            // Automatically trigger search after showing interpretation
            setTimeout(() => {
                console.log('🎯 Quiz completed, auto-searching for mood:', primaryMood);
                searchMovies();
            }, 1500); // Small delay to show mood interpretation first
        }
    }
}

function determineMoodFromQuiz(answers) {
    // Energy: low, medium, high
    // Story: reality, fantasy
    // Desire: laugh, think, thrill, feel
    
    const moodMap = {
        'low_reality_laugh': 'Comedy',
        'low_reality_think': 'Heartwarming',
        'low_reality_thrill': 'Mystery',
        'low_reality_feel': 'Heartwarming',
        'low_fantasy_laugh': 'Comedy',
        'low_fantasy_think': 'Nostalgic',
        'low_fantasy_thrill': 'Mystery',
        'low_fantasy_feel': 'Fantasy',
        'medium_reality_laugh': 'Comedy',
        'medium_reality_think': 'Inspiring',
        'medium_reality_thrill': 'Mystery',
        'medium_reality_feel': 'Romantic',
        'medium_fantasy_laugh': 'Comedy',
        'medium_fantasy_think': 'Fantasy',
        'medium_fantasy_thrill': 'Sci-Fi',
        'medium_fantasy_feel': 'Fantasy',
        'high_reality_laugh': 'Comedy',
        'high_reality_think': 'Inspiring',
        'high_reality_thrill': 'Action',
        'high_reality_feel': 'Romantic',
        'high_fantasy_laugh': 'Adventure',
        'high_fantasy_think': 'Sci-Fi',
        'high_fantasy_thrill': 'Action',
        'high_fantasy_feel': 'Adventure'
    };
    
    const key = `${answers.energy}_${answers.story}_${answers.desire}`;
    return moodMap[key] || 'Adventure';
}

function applyQuizFiltersToGenres(baseGenres, answers) {
    // Quiz can refine genre selection based on answers
    // For now, just return base genres
    return baseGenres;
}

// Custom Mood Input
function parseCustomMood(input) {
    const lowerInput = input.toLowerCase();
    const matchedMoods = new Set();
    
    Object.entries(CUSTOM_MOOD_KEYWORDS).forEach(([keyword, moods]) => {
        if (lowerInput.includes(keyword)) {
            moods.forEach(mood => matchedMoods.add(mood));
        }
    });
    
    return matchedMoods.size > 0 ? Array.from(matchedMoods) : ['Feel-Good'];
}

// Search Movies
searchMoviesBtn.addEventListener('click', () => {
    if (!primaryMood) {
        showToast('Please select a primary mood/genre or describe your mood', 'warning', 3000);
        return;
    }
    searchMovies();
});

// Header Navigation Button Listeners
showVibeMapBtn.addEventListener('click', () => {
    showVibeMap();
});

showMemoryLogBtn.addEventListener('click', () => {
    showMoodMemoryLog();
});

async function searchMovies() {
    if (!TMDB_PROXY_BASE) {
        showToast('Server TMDb proxy is not configured. Ensure the server is running and config.js has TMDB_PROXY_BASE set.', 'error', 4000);
        return;
    }

    // Ensure sections are properly toggled
    searchSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');
    skeletonGrid.classList.remove('hidden');
    moviesGrid.innerHTML = '';
    moviesGrid.style.display = 'grid'; // Ensure grid is visible
    loadMoreBtn.classList.add('hidden');
    
    // Display mood
    currentSelection.textContent = primaryMood;
    console.log(`🎯 Starting search for mood: ${primaryMood}`);
    
    // Save mood to memory log
    saveMoodToMemory(primaryMood);
    
    // Display smart suggestions
    displaySmartSuggestions();
    
    // Automatically apply vibe mode based on mood
    autoApplyVibeModeForMood(primaryMood);
    
    // Load music recommendations for this mood
    loadMusicRecommendations(primaryMood);
    
    currentPage = 1;
    allMovies = [];
    displayedMovies = [];
    
    try {
        // Always fetch both movies and TV series
        await fetchBothContent();
        
        // If no content found after fetching
        if (allMovies.length === 0) {
            moviesGrid.innerHTML = `<p style="text-align: center; color: var(--text-secondary); padding: 60px 20px; font-size: 1.1rem;">No content found for this mood. Try different filters or select another mood.</p>`;
            showToast('No content found. Try adjusting filters.', 'warning', 3000);
        }
    } catch (error) {
        console.error('Error fetching content:', error);
        moviesGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 60px 20px; font-size: 1.1rem;">Failed to load content. Please try again.</p>';
        showToast('Failed to load content. Check your internet connection.', 'error', 3000);
    } finally {
        skeletonGrid.classList.add('hidden');
    }
}

// Fetch Movies
async function fetchMovies() {
    if (isLoading) return;
    isLoading = true;
    
    // Get genres from primary mood only
    let genreIds = [];
    if (primaryMood) {
        const moodData = MOOD_MAPPINGS[primaryMood];
        if (moodData && moodData.genres) {
            genreIds = [...moodData.genres];
            console.log(`🎭 Selected mood: ${primaryMood} with genres:`, genreIds);
        } else {
            console.error(`❌ Mood "${primaryMood}" not found in MOOD_MAPPINGS`);
        }
    }
    
    // Apply quiz answers if available
    if (quizAnswers.energy || quizAnswers.story || quizAnswers.desire) {
        genreIds = applyQuizFiltersToGenres(genreIds, quizAnswers);
    }
    
    const genres = genreIds.join(',');
    console.log(`🎬 Fetching movies with genres: ${genres}`);
    console.log(`🔧 Active filters:`, JSON.stringify(currentFilters, null, 2));
    
    if (currentFilters.year) {
        console.log(`📅 Year filter active: "${currentFilters.year}"`);
    }
    if (currentFilters.language) {
        console.log(`🌍 Language filter active: "${currentFilters.language}"`);
    }
    
    // CRITICAL: If no genres found, something is wrong - don't fetch random movies!
    if (!genres) {
        console.error('❌ CRITICAL: No genres found for mood!');
        console.error(`   Mood: "${primaryMood}", Genre IDs: ${JSON.stringify(genreIds)}`);
        console.error('   MOOD_MAPPINGS:', MOOD_MAPPINGS[primaryMood]);
        
        // Show error to user
        moviesGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <div style="background: rgba(239, 68, 68, 0.1); border: 2px solid rgba(239, 68, 68, 0.3); border-radius: 12px; padding: 30px; max-width: 600px; margin: 0 auto;">
                    <p style="font-size: 2rem; margin-bottom: 15px;">⚠️</p>
                    <h3 style="color: var(--text-primary); margin-bottom: 10px;">Configuration Error</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 15px;">
                        No genres found for mood "${primaryMood}". This is a configuration issue.
                    </p>
                    <p style="font-size: 0.85rem; opacity: 0.8;">
                        Check the browser console (F12) for details.
                    </p>
                </div>
            </div>
        `;
        isLoading = false;
        return; // Stop execution - don't fetch random movies!
    }
    
    try {
        // Request aggregated discover results from the server proxy (deduped across pages)
        // We ask server to fetch up to 15 pages to ensure we have plenty of movies per mood+filter combination
        const params = new URLSearchParams();
        params.append('with_genres', genres);
        params.append('sort_by', currentFilters.sort);
        params.append('vote_count.gte', '2');
        params.append('pages', '15'); // Increased from 10 to 15 for better filter coverage

        if (currentFilters.language) params.append('with_original_language', currentFilters.language);
        if (currentFilters.rating > 0) params.append('vote_average.gte', String(currentFilters.rating));
        if (currentFilters.year) {
            if (currentFilters.year.includes('-')) {
                const [start, end] = currentFilters.year.split('-');
                params.append('primary_release_date.gte', `${start}-01-01`);
                params.append('primary_release_date.lte', `${end}-12-31`);
            } else {
                params.append('primary_release_year', currentFilters.year);
            }
        }

        console.log('🔍 Fetching aggregated discover from proxy:', `${TMDB_PROXY_BASE}/aggregate-discover?${params.toString()}`);
        const resp = await fetch(`${TMDB_PROXY_BASE}/aggregate-discover?${params.toString()}`);
        const results = await resp.json();
        // Server returns { results: [movies], count }
        let moviesArray = (results && results.results) ? results.results : (results && results.items ? results.items : []);
        console.log(`   Proxy returned ${moviesArray.length} raw movies`);

        // ACCURACY: Filter for quality and genre relevance
        const genreArray = genres.split(',').map(g => parseInt(g));
        moviesArray = moviesArray.filter(movie => {
            // Quality checks - more lenient thresholds
            const hasGoodRating = movie.vote_average >= 4.0; // Lowered from 5.0
            const hasEnoughVotes = movie.vote_count >= 20; // Lowered from 100
            const hasPoster = movie.poster_path != null;
            const hasTitle = movie.title && movie.title.trim().length > 0;
            const hasOverview = movie.overview && movie.overview.trim().length > 10; // Lowered from 20
            const isNotTooOld = !movie.release_date || new Date(movie.release_date).getFullYear() >= 1960; // Lowered from 1970
            
            // Genre relevance check
            const movieGenres = movie.genre_ids || [];
            const genreMatches = movieGenres.filter(g => genreArray.includes(g));
            const hasGenreMatch = genreMatches.length > 0;
            
            return hasGoodRating && hasEnoughVotes && hasPoster && hasTitle && hasOverview && isNotTooOld && hasGenreMatch;
        });

        console.log(`   ✨ After quality filter: ${moviesArray.length} high-quality movies`);

        // Log sample for validation
        if (moviesArray.length > 0) {
            const sample = moviesArray[0];
            console.log(`   📌 Sample movie: "${sample.title}" (${sample.release_date?.substring(0,4) || 'N/A'}, ⭐${sample.vote_average})`);
            console.log(`      Genre IDs in movie: ${JSON.stringify(sample.genre_ids)}`);
            console.log(`      Expected genres: ${genres}`);
        }

        allMovies.push(...moviesArray);

        // If not enough movies, optionally attempt a relaxed broader fetch (less strict filters)
        if (allMovies.length < 20) {
            // Read Auto-relax toggle (default: enabled)
            const autoRelaxEl = document.getElementById('autoRelaxToggle');
            const autoRelaxEnabled = autoRelaxEl ? !!autoRelaxEl.checked : true;

            if (autoRelaxEnabled) {
                console.log(`⚠️ Only ${allMovies.length} movies found — performing relaxed discover to reach 20+`);
                const relaxedParams = new URLSearchParams();
                relaxedParams.append('with_genres', genres);
                relaxedParams.append('sort_by', 'popularity.desc');
                relaxedParams.append('vote_count.gte', '0');
                relaxedParams.append('pages', '20'); // Get more pages when relaxing filters
                
                // Keep language filter if present (helps with relevance)
                if (currentFilters.language) {
                    relaxedParams.append('with_original_language', currentFilters.language);
                }
                
                // Relax year filter by expanding to nearby years
                if (currentFilters.year && !currentFilters.year.includes('-')) {
                    const year = parseInt(currentFilters.year);
                    relaxedParams.append('primary_release_date.gte', `${year - 3}-01-01`);
                    relaxedParams.append('primary_release_date.lte', `${year + 3}-12-31`);
                }
                try {
                    const rresp = await fetch(`${TMDB_PROXY_BASE}/aggregate-discover?${relaxedParams.toString()}`);
                    if (rresp.ok) {
                        const rdata = await rresp.json();
                        const rmovies = (rdata && rdata.results) ? rdata.results : [];
                        console.log(`   Relaxed fetch returned ${rmovies.length} movies`);
                        allMovies.push(...rmovies);
                    } else {
                        console.warn('   Relaxed discover failed:', rresp.status);
                    }
                } catch (e) {
                    console.warn('   Relaxed discover error:', e && e.message);
                }
            } else {
                console.log(`🔒 Auto-relax disabled — skipping relaxed discover. Only ${allMovies.length} movies will be used.`);
                // Inform user with a toast and an inline hint in the grid
                try { showToast('Auto-relax filters is OFF — enable it to broaden results automatically.', 'info', 4000); } catch (e) { /* ignore */ }
                if (moviesGrid) {
                    const hint = document.createElement('div');
                    hint.style.gridColumn = '1/-1';
                    hint.style.textAlign = 'center';
                    hint.style.padding = '18px 12px';
                    hint.style.color = 'var(--text-secondary)';
                    hint.style.fontSize = '0.98rem';
                    hint.innerHTML = `Only ${allMovies.length} movies found. Toggle <strong>Auto-relax filters</strong> in Filters to automatically broaden results.`;
                    moviesGrid.appendChild(hint);
                }
            }
        }
        
        // Remove duplicates
        const beforeDedup = allMovies.length;
        const uniqueMovies = Array.from(new Map(allMovies.map(m => [m.id, m])).values());
        console.log(`   🔄 Deduplication: ${beforeDedup} raw → ${uniqueMovies.length} unique movies`);
        
        // Keep up to 200 movies for better variety (will show first 40, load more for rest)
        allMovies = uniqueMovies.slice(0, 200);
        
        console.log(`✅ Fetched ${allMovies.length} movies for mood: ${primaryMood}`);
        
        // Display first 40
        if (allMovies.length > 0) {
            displayedMovies = allMovies.slice(0, 40);
            displayMovies(displayedMovies);
            
            // Show load more if there are more movies
            if (allMovies.length > 40) {
                loadMoreBtn.classList.remove('hidden');
            }
        } else {
            console.warn('⚠️ No movies returned from TMDB API - showing helpful message');
            moviesGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px 20px;">
                    <div style="background: rgba(59, 130, 246, 0.1); border: 2px solid rgba(59, 130, 246, 0.3); border-radius: 12px; padding: 30px; max-width: 600px; margin: 0 auto;">
                        <p style="font-size: 2rem; margin-bottom: 15px;">🎬</p>
                        <h3 style="color: var(--text-primary); margin-bottom: 10px; font-size: 1.2rem;">No Movies Found</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 20px; line-height: 1.6;">
                            No movies matched your current filters for this mood.
                        </p>
                        <div style="background: rgba(255, 255, 255, 0.05); border-radius: 8px; padding: 15px; margin-bottom: 20px;">
                            <p style="font-weight: 600; margin-bottom: 10px;">💡 Try:</p>
                            <ul style="list-style: none; padding: 0; margin: 0; text-align: left;">
                                <li style="padding: 5px 0;">✓ Removing language filter</li>
                                <li style="padding: 5px 0;">✓ Selecting a different year range</li>
                                <li style="padding: 5px 0;">✓ Lowering the rating requirement</li>
                                <li style="padding: 5px 0;">✓ Trying a different mood</li>
                            </ul>
                        </div>
                        <button onclick="location.reload()" style="padding: 12px 24px; background: linear-gradient(135deg, #3b82f6, #2563eb); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 1rem;">
                            Reset & Try Again
                        </button>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('❌ Error in fetchMovies:', error);
        // Show user-friendly error message instead of crashing
        moviesGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px 20px;">
                <div style="background: rgba(239, 68, 68, 0.1); border: 2px solid rgba(239, 68, 68, 0.3); border-radius: 12px; padding: 30px; max-width: 600px; margin: 0 auto;">
                    <p style="font-size: 2rem; margin-bottom: 15px;">⚠️</p>
                    <h3 style="color: var(--text-primary); margin-bottom: 10px; font-size: 1.2rem;">Movie Loading Error</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 15px; line-height: 1.6;">
                        Unable to load movies. This could be due to:
                    </p>
                    <ul style="list-style: none; padding: 0; text-align: left; max-width: 400px; margin: 0 auto 20px;">
                        <li style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">🔑 TMDB API key issue</li>
                        <li style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">📊 API quota exceeded</li>
                        <li style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">🌐 Network connection problem</li>
                        <li style="padding: 8px 0;">⚙️ Configuration error</li>
                    </ul>
                    <button onclick="location.reload()" style="padding: 12px 24px; background: linear-gradient(135deg, #ef4444, #dc2626); color: white; border: none; border-radius: 8px; font-weight: 600; cursor: pointer; font-size: 1rem;">
                        Reload Page
                    </button>
                    <p style="margin-top: 15px; font-size: 0.85rem; opacity: 0.8;">
                        Check the browser console (F12) for details
                    </p>
                </div>
            </div>
        `;
    } finally {
        isLoading = false;
    }
}

// Fetch TV Series
async function fetchTVSeries() {
    if (isLoading) return;
    isLoading = true;
    
    // Get genres from primary mood only
    let genreIds = [];
    if (primaryMood) {
        const moodData = MOOD_MAPPINGS[primaryMood];
        if (moodData && moodData.genres) {
            genreIds = [...moodData.genres];
            console.log(`📺 Selected mood: ${primaryMood} with genres:`, genreIds);
        } else {
            console.error(`❌ Mood "${primaryMood}" not found in MOOD_MAPPINGS`);
        }
    }
    
    // Apply quiz answers if available
    if (quizAnswers.energy || quizAnswers.story || quizAnswers.desire) {
        genreIds = applyQuizFiltersToGenres(genreIds, quizAnswers);
    }
    
    const genres = genreIds.join(',');
    console.log(`📺 Fetching TV series with genres: ${genres}`);
    console.log(`🔧 Active filters:`, JSON.stringify(currentFilters, null, 2));
    
    if (!genres) {
        console.error('❌ CRITICAL: No genres found for mood!');
        moviesGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <div style="background: rgba(239, 68, 68, 0.1); border: 2px solid rgba(239, 68, 68, 0.3); border-radius: 12px; padding: 30px; max-width: 600px; margin: 0 auto;">
                    <p style="font-size: 2rem; margin-bottom: 15px;">⚠️</p>
                    <h3 style="color: var(--text-primary); margin-bottom: 10px;">Configuration Error</h3>
                    <p style="color: var(--text-secondary); margin-bottom: 15px;">
                        No genres found for mood "${primaryMood}". This is a configuration issue.
                    </p>
                </div>
            </div>
        `;
        isLoading = false;
        return;
    }
    
    try {
        const params = new URLSearchParams();
        params.append('with_genres', genres);
        params.append('sort_by', currentFilters.sort.replace('release_date', 'first_air_date'));
        params.append('vote_count.gte', '2');
        params.append('pages', '15');

        if (currentFilters.language) params.append('with_original_language', currentFilters.language);
        if (currentFilters.rating > 0) params.append('vote_average.gte', String(currentFilters.rating));
        if (currentFilters.year) {
            if (currentFilters.year.includes('-')) {
                const [start, end] = currentFilters.year.split('-');
                params.append('first_air_date.gte', `${start}-01-01`);
                params.append('first_air_date.lte', `${end}-12-31`);
            } else {
                params.append('first_air_year', currentFilters.year);
            }
        }

        console.log('🔍 Fetching TV series from proxy:', `${TMDB_PROXY_BASE}/aggregate-discover-tv?${params.toString()}`);
        const resp = await fetch(`${TMDB_PROXY_BASE}/aggregate-discover-tv?${params.toString()}`);
        const results = await resp.json();
        let seriesArray = (results && results.results) ? results.results : [];
        console.log(`   Proxy returned ${seriesArray.length} raw TV series`);

        // ACCURACY: Filter for quality and genre relevance
        const genreArray = genres.split(',').map(g => parseInt(g));
        seriesArray = seriesArray.filter(series => {
            // Quality checks - balanced thresholds
            const hasGoodRating = series.vote_average >= 4.5; // Lowered from 6.0
            const hasEnoughVotes = series.vote_count >= 15; // Lowered from 50
            const hasPoster = series.poster_path != null;
            const hasName = series.name && series.name.trim().length > 0;
            const hasOverview = series.overview && series.overview.trim().length > 10; // Lowered from 20
            const isNotTooOld = !series.first_air_date || new Date(series.first_air_date).getFullYear() >= 1960; // Lowered from 1980
            const isNotCancelled = !series.status || series.status !== 'Canceled' || (series.number_of_seasons && series.number_of_seasons >= 2);
            
            // Genre relevance check
            const seriesGenres = series.genre_ids || [];
            const genreMatches = seriesGenres.filter(g => genreArray.includes(g));
            const hasGenreMatch = genreMatches.length > 0;
            
            return hasGoodRating && hasEnoughVotes && hasPoster && hasName && hasOverview && isNotTooOld && isNotCancelled && hasGenreMatch;
        });

        console.log(`   ✨ After quality filter: ${seriesArray.length} high-quality series`);

        if (seriesArray.length > 0) {
            const sample = seriesArray[0];
            console.log(`   📌 Sample series: "${sample.name}" (${sample.first_air_date?.substring(0,4) || 'N/A'}, ⭐${sample.vote_average})`);
        }

        allMovies.push(...seriesArray);

        // Relaxed fetch if not enough series
        if (allMovies.length < 20) {
            const autoRelaxEl = document.getElementById('autoRelaxToggle');
            const autoRelaxEnabled = autoRelaxEl ? !!autoRelaxEl.checked : true;

            if (autoRelaxEnabled) {
                console.log(`⚠️ Only ${allMovies.length} series found — performing relaxed discover`);
                const relaxedParams = new URLSearchParams();
                relaxedParams.append('with_genres', genres);
                relaxedParams.append('sort_by', 'popularity.desc');
                relaxedParams.append('vote_count.gte', '0');
                relaxedParams.append('pages', '20');
                
                if (currentFilters.language) {
                    relaxedParams.append('with_original_language', currentFilters.language);
                }
                
                if (currentFilters.year && !currentFilters.year.includes('-')) {
                    const year = parseInt(currentFilters.year);
                    relaxedParams.append('first_air_date.gte', `${year - 3}-01-01`);
                    relaxedParams.append('first_air_date.lte', `${year + 3}-12-31`);
                }
                try {
                    const rresp = await fetch(`${TMDB_PROXY_BASE}/aggregate-discover-tv?${relaxedParams.toString()}`);
                    if (rresp.ok) {
                        const rdata = await rresp.json();
                        const rseries = (rdata && rdata.results) ? rdata.results : [];
                        console.log(`   Relaxed fetch returned ${rseries.length} series`);
                        allMovies.push(...rseries);
                    }
                } catch (e) {
                    console.warn('   Relaxed discover error:', e && e.message);
                }
            }
        }
        
        const beforeDedup = allMovies.length;
        const uniqueSeries = Array.from(new Map(allMovies.map(s => [s.id, s])).values());
        console.log(`   🔄 Deduplication: ${beforeDedup} raw → ${uniqueSeries.length} unique series`);
        
        allMovies = uniqueSeries.slice(0, 200);
        
        console.log(`✅ Fetched ${allMovies.length} TV series for mood: ${primaryMood}`);
        
        if (allMovies.length > 0) {
            displayedMovies = allMovies.slice(0, 40);
            displayTVSeries(displayedMovies);
            
            if (allMovies.length > 40) {
                loadMoreBtn.classList.remove('hidden');
            }
        } else {
            moviesGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px 20px;">
                    <div style="background: rgba(59, 130, 246, 0.1); border: 2px solid rgba(59, 130, 246, 0.3); border-radius: 12px; padding: 30px; max-width: 600px; margin: 0 auto;">
                        <p style="font-size: 2rem; margin-bottom: 15px;">📺</p>
                        <h3 style="color: var(--text-primary); margin-bottom: 10px;">No TV Series Found</h3>
                        <p style="color: var(--text-secondary); margin-bottom: 20px;">
                            No series matched your current filters for this mood.
                        </p>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('❌ Error in fetchTVSeries:', error);
        moviesGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px 20px;">
                <div style="background: rgba(239, 68, 68, 0.1); border: 2px solid rgba(239, 68, 68, 0.3); border-radius: 12px; padding: 30px; max-width: 600px; margin: 0 auto;">
                    <p style="font-size: 2rem; margin-bottom: 15px;">⚠️</p>
                    <h3 style="color: var(--text-primary); margin-bottom: 10px;">Series Loading Error</h3>
                    <p style="color: var(--text-secondary);">Unable to load TV series.</p>
                </div>
            </div>
        `;
    } finally {
        isLoading = false;
    }
}

// Fetch Both Movies and TV Series
async function fetchBothContent() {
    if (isLoading) return;
    isLoading = true;
    
    try {
        const params = buildParams(false);
        const tvParams = buildParams(true);
        
        console.log('🎭 Fetching both movies and TV series with enhanced accuracy...');
        
        const [moviesResp, seriesResp] = await Promise.all([
            fetch(`${TMDB_PROXY_BASE}/aggregate-discover?${params}`),
            fetch(`${TMDB_PROXY_BASE}/aggregate-discover-tv?${tvParams}`)
        ]);
        
        const moviesData = await moviesResp.json();
        const seriesData = await seriesResp.json();
        
        let movies = (moviesData && moviesData.results) || [];
        let series = (seriesData && seriesData.results) || [];
        
        console.log(`   📊 Raw fetch: ${movies.length} movies and ${series.length} series`);
        
        // ACCURACY IMPROVEMENT 1: Filter out low-quality content
        movies = movies.filter(m => {
            const hasVotes = m.vote_count >= 20; // Lowered from 50
            const hasRating = m.vote_average >= 4.0; // Lowered from 5.0
            const hasPoster = m.poster_path != null;
            const hasTitle = m.title && m.title.trim().length > 0;
            const notTooOld = !m.release_date || new Date(m.release_date).getFullYear() >= 1960; // Lowered from 1980
            return hasVotes && hasRating && hasPoster && hasTitle && notTooOld;
        });
        
        series = series.filter(s => {
            const hasVotes = s.vote_count >= 15; // Lowered from 30
            const hasRating = s.vote_average >= 4.5; // Lowered from 5.0
            const hasPoster = s.poster_path != null;
            const hasName = s.name && s.name.trim().length > 0;
            const notTooOld = !s.first_air_date || new Date(s.first_air_date).getFullYear() >= 1960; // Lowered from 1980
            return hasVotes && hasRating && hasPoster && hasName && notTooOld;
        });
        
        console.log(`   ✨ After quality filter: ${movies.length} movies and ${series.length} series`);
        
        // ACCURACY IMPROVEMENT 2: Verify genre matching
        const moodGenres = primaryMood ? (MOOD_MAPPINGS[primaryMood]?.genres || []) : [];
        if (moodGenres.length > 0) {
            movies = movies.filter(m => {
                const matchedGenres = m.genre_ids?.filter(g => moodGenres.includes(g)) || [];
                return matchedGenres.length > 0; // Must have at least one matching genre
            });
            
            series = series.filter(s => {
                const matchedGenres = s.genre_ids?.filter(g => moodGenres.includes(g)) || [];
                return matchedGenres.length > 0;
            });
            
            console.log(`   🎯 After genre matching: ${movies.length} movies and ${series.length} series`);
        }
        
        // ACCURACY IMPROVEMENT 3: Sort by relevance score
        const calculateRelevanceScore = (item, isSeries = false) => {
            let score = 0;
            
            // Popularity component (0-40 points)
            score += Math.min(item.popularity / 10, 40);
            
            // Rating component (0-30 points)
            score += (item.vote_average / 10) * 30;
            
            // Vote count reliability (0-20 points)
            const voteThreshold = isSeries ? 100 : 200;
            score += Math.min(item.vote_count / voteThreshold * 20, 20);
            
            // Genre match bonus (0-10 points)
            if (moodGenres.length > 0 && item.genre_ids) {
                const matchedGenres = item.genre_ids.filter(g => moodGenres.includes(g));
                score += (matchedGenres.length / moodGenres.length) * 10;
            }
            
            return score;
        };
        
        movies.forEach(m => {
            m._relevanceScore = calculateRelevanceScore(m, false);
            m._contentType = 'movie';
        });
        
        series.forEach(s => {
            s._relevanceScore = calculateRelevanceScore(s, true);
            s._contentType = 'tv';
        });
        
        // Sort by relevance
        movies.sort((a, b) => b._relevanceScore - a._relevanceScore);
        series.sort((a, b) => b._relevanceScore - a._relevanceScore);
        
        console.log(`   🏆 Top movie score: ${movies[0]?._relevanceScore.toFixed(2)}, Top series score: ${series[0]?._relevanceScore.toFixed(2)}`);
        
        // ACCURACY IMPROVEMENT 4: Balanced mixing (60% movies, 40% series for variety)
        const movieLimit = Math.min(Math.ceil(movies.length * 0.6), 60);
        const seriesLimit = Math.min(Math.ceil(series.length * 0.4), 40);
        
        const selectedMovies = movies.slice(0, movieLimit);
        const selectedSeries = series.slice(0, seriesLimit);
        
        // Interleave for better distribution
        const combined = [];
        const maxLength = Math.max(selectedMovies.length, selectedSeries.length);
        
        for (let i = 0; i < maxLength; i++) {
            if (i < selectedMovies.length && (i % 3 !== 2 || i >= selectedSeries.length)) {
                combined.push(selectedMovies[i]);
            }
            if (i < selectedSeries.length && (i % 3 === 2 || i >= selectedMovies.length)) {
                combined.push(selectedSeries[i]);
            }
        }
        
        allMovies = combined.slice(0, 200);
        
        console.log(`✅ Final curated selection: ${allMovies.length} items (${selectedMovies.length} movies, ${selectedSeries.length} series)`);
        
        if (allMovies.length > 0) {
            displayedMovies = allMovies.slice(0, 40);
            displayMixedContent(displayedMovies);
            
            if (allMovies.length > 40) {
                loadMoreBtn.classList.remove('hidden');
            }
        } else {
            moviesGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px 20px;">
                    <div style="background: rgba(59, 130, 246, 0.1); border: 2px solid rgba(59, 130, 246, 0.3); border-radius: 12px; padding: 30px; max-width: 600px; margin: 0 auto;">
                        <p style="font-size: 2rem; margin-bottom: 15px;">🎭</p>
                        <h3 style="color: var(--text-primary); margin-bottom: 10px;">No Content Found</h3>
                        <p style="color: var(--text-secondary);">No movies or series matched your filters.</p>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('❌ Error in fetchBothContent:', error);
        moviesGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px 20px;">
                <div style="background: rgba(239, 68, 68, 0.1); border: 2px solid rgba(239, 68, 68, 0.3); border-radius: 12px; padding: 30px; max-width: 600px; margin: 0 auto;">
                    <p style="font-size: 2rem; margin-bottom: 15px;">⚠️</p>
                    <h3 style="color: var(--text-primary); margin-bottom: 10px;">Loading Error</h3>
                    <p style="color: var(--text-secondary);">Unable to load content.</p>
                </div>
            </div>
        `;
    } finally {
        isLoading = false;
    }
}

// Load More Movies
loadMoreBtn.addEventListener('click', () => {
    const currentLength = displayedMovies.length;
    const nextMovies = allMovies.slice(currentLength, currentLength + 20);
    
    console.log(`📦 Load More: Showing ${currentLength} → ${currentLength + nextMovies.length} of ${allMovies.length} items`);
    
    if (nextMovies.length > 0) {
        displayedMovies.push(...nextMovies);
        
        // Check if we have mixed content
        const hasMixedContent = allMovies.some(item => item._contentType);
        
        if (hasMixedContent) {
            // Append mixed content
            nextMovies.forEach((item, index) => {
                if (item._contentType === 'tv') {
                    displaySingleTVSeries(item, currentLength + index);
                } else {
                    displaySingleMovie(item, currentLength + index);
                }
            });
        } else {
            // Check if it's all TV series
            const isTVSeries = allMovies[0] && allMovies[0].name && !allMovies[0].title;
            if (isTVSeries) {
                nextMovies.forEach((show, index) => {
                    displaySingleTVSeries(show, currentLength + index);
                });
            } else {
                appendMovies(nextMovies);
            }
        }
    }
    
    // Hide button if all movies are shown
    if (displayedMovies.length >= allMovies.length) {
        loadMoreBtn.classList.add('hidden');
        console.log('✅ All content loaded');
    }
});

// Display Movies
function displayMovies(movies) {
    displayMoviesWithStreaming(movies);
}

// Display TV Series
function displayTVSeries(series) {
    moviesGrid.innerHTML = '';
    series.forEach((show, index) => {
        const card = document.createElement('div');
        card.className = 'movie-card';
        card.style.animationDelay = `${index * 0.05}s`;
        
        const posterPath = show.poster_path 
            ? `https://image.tmdb.org/t/p/w500${show.poster_path}` 
            : 'https://via.placeholder.com/500x750?text=No+Poster';
        
        const year = show.first_air_date ? show.first_air_date.substring(0, 4) : 'N/A';
        const rating = show.vote_average ? show.vote_average.toFixed(1) : 'N/A';
        
        // Badge for series (show number of seasons if available)
        const seasonBadge = show.number_of_seasons 
            ? `<span style="background: rgba(147, 51, 234, 0.9); padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; display: inline-block; margin-top: 6px;">📺 ${show.number_of_seasons} Season${show.number_of_seasons > 1 ? 's' : ''}</span>`
            : '<span style="background: rgba(147, 51, 234, 0.9); padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; display: inline-block; margin-top: 6px;">📺 TV Series</span>';
        
        card.innerHTML = `
            <div class="movie-poster">
                <img src="${posterPath}" alt="${show.name}" loading="lazy">
                <div class="movie-overlay">
                    <button class="play-btn" onclick="showSeriesDetails(${show.id})">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                    </button>
                </div>
            </div>
            <div class="movie-info">
                <h3 class="movie-title">${show.name}</h3>
                <div class="movie-meta">
                    <span class="movie-year">${year}</span>
                    <span class="movie-rating">⭐ ${rating}</span>
                </div>
                ${seasonBadge}
            </div>
        `;
        
        moviesGrid.appendChild(card);
    });
}

// Append Movies (for load more)
function appendMovies(movies) {
    // Calculate the correct starting index for animation delays
    const startIndex = displayedMovies.length - movies.length;
    
    console.log(`➕ Appending ${movies.length} movies (total displayed: ${displayedMovies.length})`);
    
    movies.forEach((movie, index) => {
        const card = document.createElement('div');
        card.innerHTML = createMovieCard(movie, startIndex + index);
        moviesGrid.appendChild(card.firstElementChild);
    });
    
    attachMovieEventListeners();
    resultsCount.textContent = `${displayedMovies.length} of ${allMovies.length} movies`;
}

// Create Movie Card HTML (with streaming pulse support)
function createMovieCard(movie, index) {
    const posterUrl = movie.poster_path 
        ? `${TMDB_IMAGE_BASE_URL}/w500${movie.poster_path}`
        : 'https://via.placeholder.com/500x750?text=No+Poster';
    
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    const language = movie.original_language ? movie.original_language.toUpperCase() : 'N/A';
    const year = movie.release_date ? new Date(movie.release_date).getFullYear() : 'N/A';
    
    return `
        <div class="movie-card" data-movie-id="${movie.id}" style="animation-delay: ${index * 0.05}s">
            <img src="${posterUrl}" alt="${movie.title}" class="movie-poster" loading="lazy">
            <div class="movie-info">
                <h3 class="movie-title">${movie.title}</h3>
                <div class="movie-meta">
                    <span class="rating">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z"/>
                        </svg>
                        ${rating}
                    </span>
                    <span class="language">${language}</span>
                    <span class="year">${year}</span>
                </div>
                <p class="movie-description">${movie.overview || 'No description available.'}</p>
                <div class="movie-actions">
                    <button class="btn btn-primary watch-trailer" data-movie-id="${movie.id}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                        Trailer
                    </button>
                    <button class="btn btn-secondary watch-where" data-movie-id="${movie.id}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                            <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                            <polyline points="17 2 12 7 7 2"></polyline>
                        </svg>
                        Where to Watch
                    </button>
                </div>
            </div>
        </div>
    `;
}

// Attach Event Listeners to Movie Cards
function attachMovieEventListeners() {
    document.querySelectorAll('.watch-trailer').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openTrailerModal(btn.dataset.movieId);
        });
    });

    document.querySelectorAll('.watch-where').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            openStreamingModal(btn.dataset.movieId);
        });
    });
    
    // Add streaming indicators on hover
    document.querySelectorAll('.movie-card').forEach(card => {
        const movieId = card.dataset.movieId;
        
        card.addEventListener('mouseenter', () => {
            addStreamingIndicators(card, movieId);
        });
    });
}

// Language filter change - update music immediately
languageFilter.addEventListener('change', () => {
    currentFilters.language = languageFilter.value;
    console.log('🌍 Language Filter Changed to:', currentFilters.language || 'All Languages');
    console.log('   Filter value type:', typeof currentFilters.language);
    
    // Reload music recommendations with new language filter
    if (primaryMood) {
        const musicGrid = document.getElementById('musicRecommendationsGrid');
        const musicLoading = document.getElementById('musicLoading');
        
        if (musicGrid && musicLoading) {
            musicGrid.style.opacity = '0.5';
            musicLoading.classList.remove('hidden');
            
            console.log('🎵 Reloading music for language change...');
            setTimeout(() => {
                loadMusicRecommendations(primaryMood).then(() => {
                    musicGrid.style.opacity = '1';
                });
            }, 300);
        }
    }
});

// Year filter change - update music immediately
yearFilter.addEventListener('change', () => {
    currentFilters.year = yearFilter.value;
    console.log('📅 Year Filter Changed to:', currentFilters.year || 'All Years');
    console.log('   Filter value type:', typeof currentFilters.year);
    
    // Reload music recommendations with new year filter
    if (primaryMood) {
        const musicGrid = document.getElementById('musicRecommendationsGrid');
        const musicLoading = document.getElementById('musicLoading');
        
        if (musicGrid && musicLoading) {
            musicGrid.style.opacity = '0.5';
            musicLoading.classList.remove('hidden');
            
            console.log('🎵 Reloading music for year change...');
            setTimeout(() => {
                loadMusicRecommendations(primaryMood).then(() => {
                    musicGrid.style.opacity = '1';
                });
            }, 300);
        }
    }
});

// Helper function to build API parameters for movies or TV series
function buildParams(isTv = false) {
    let genreIds = [];
    if (primaryMood) {
        const moodData = MOOD_MAPPINGS[primaryMood];
        if (moodData && moodData.genres) {
            genreIds = [...moodData.genres];
        }
    }
    const genres = genreIds.join(',');
    
    const params = new URLSearchParams();
    params.append('with_genres', genres);
    params.append('sort_by', isTv ? currentFilters.sort.replace('release_date', 'first_air_date') : currentFilters.sort);
    
    // ACCURACY: Balanced minimum vote threshold for better results
    const minVotes = currentFilters.language ? '10' : '20'; // More lenient for better coverage
    params.append('vote_count.gte', minVotes);
    
    // ACCURACY: Fetch more pages to have better selection after filtering
    params.append('pages', '20');
    
    if (currentFilters.language) params.append('with_original_language', currentFilters.language);
    
    // ACCURACY: Use user's rating filter or a lenient default
    const minRating = currentFilters.rating > 0 ? String(currentFilters.rating) : '4.0'; // Lowered from 5.0
    params.append('vote_average.gte', minRating);
    
    if (currentFilters.year) {
        const dateField = isTv ? 'first_air_date' : 'primary_release_date';
        const yearField = isTv ? 'first_air_year' : 'primary_release_year';
        
        if (currentFilters.year.includes('-')) {
            const [start, end] = currentFilters.year.split('-');
            params.append(`${dateField}.gte`, `${start}-01-01`);
            params.append(`${dateField}.lte`, `${end}-12-31`);
        } else {
            params.append(yearField, currentFilters.year);
        }
    }
    
    return params.toString();
}

function displayMixedContent(items) {
    moviesGrid.innerHTML = '';
    items.forEach((item, index) => {
        if (item._contentType === 'tv') {
            displaySingleTVSeries(item, index);
        } else {
            displaySingleMovie(item, index);
        }
    });
}

function displaySingleTVSeries(show, index) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.style.animationDelay = `${index * 0.05}s`;
    card.dataset.movieId = show.id;
    card.dataset.contentType = 'tv';
    
    const posterPath = show.poster_path 
        ? `https://image.tmdb.org/t/p/w500${show.poster_path}` 
        : 'https://via.placeholder.com/500x750?text=No+Poster';
    
    const year = show.first_air_date ? show.first_air_date.substring(0, 4) : 'N/A';
    const rating = show.vote_average ? show.vote_average.toFixed(1) : 'N/A';
    
    card.innerHTML = `
        <div class="movie-poster">
            <img src="${posterPath}" alt="${show.name}" loading="lazy">
            <div class="movie-overlay">
                <button class="play-btn watch-trailer-tv" data-show-id="${show.id}" title="Play Trailer">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </button>
                <button class="watch-where-btn" data-show-id="${show.id}" data-content-type="tv" title="Where to Watch">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                        <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                        <polyline points="17 2 12 7 7 2"></polyline>
                    </svg>
                </button>
            </div>
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${show.name}</h3>
            <div class="movie-meta">
                <span class="movie-year">${year}</span>
                <span class="movie-rating">⭐ ${rating}</span>
            </div>
            <span style="background: rgba(147, 51, 234, 0.9); padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; display: inline-block; margin-top: 6px;">📺 TV Series</span>
        </div>
    `;
    
    moviesGrid.appendChild(card);
    
    // Attach event listeners
    const watchBtn = card.querySelector('.watch-trailer-tv');
    const whereBtn = card.querySelector('.watch-where-btn');
    
    if (watchBtn) {
        watchBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log(`🎬 Playing trailer for TV series ID: ${show.id}`);
            showSeriesDetails(show.id);
        });
    }
    
    if (whereBtn) {
        whereBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log(`📺 Opening streaming info for TV series ID: ${show.id}`);
            openStreamingModal(show.id, 'tv');
        });
    }
}

function displaySingleMovie(movie, index) {
    const card = document.createElement('div');
    card.className = 'movie-card';
    card.style.animationDelay = `${index * 0.05}s`;
    card.dataset.movieId = movie.id;
    card.dataset.contentType = 'movie';
    
    const posterPath = movie.poster_path 
        ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` 
        : 'https://via.placeholder.com/500x750?text=No+Poster';
    
    const year = movie.release_date ? movie.release_date.substring(0, 4) : 'N/A';
    const rating = movie.vote_average ? movie.vote_average.toFixed(1) : 'N/A';
    
    card.innerHTML = `
        <div class="movie-poster">
            <img src="${posterPath}" alt="${movie.title}" loading="lazy">
            <div class="movie-overlay">
                <button class="play-btn watch-trailer" data-movie-id="${movie.id}" title="Play Trailer">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </button>
                <button class="watch-where-btn" data-movie-id="${movie.id}" data-content-type="movie" title="Where to Watch">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" stroke-width="2">
                        <rect x="2" y="7" width="20" height="15" rx="2" ry="2"></rect>
                        <polyline points="17 2 12 7 7 2"></polyline>
                    </svg>
                </button>
            </div>
        </div>
        <div class="movie-info">
            <h3 class="movie-title">${movie.title}</h3>
            <div class="movie-meta">
                <span class="movie-year">${year}</span>
                <span class="movie-rating">⭐ ${rating}</span>
            </div>
            <span style="background: rgba(59, 130, 246, 0.9); padding: 4px 10px; border-radius: 6px; font-size: 0.75rem; font-weight: 600; display: inline-block; margin-top: 6px;">🎬 Movie</span>
        </div>
    `;
    
    moviesGrid.appendChild(card);
    
    // Attach event listeners
    const watchBtn = card.querySelector('.watch-trailer');
    const whereBtn = card.querySelector('.watch-where-btn');
    
    if (watchBtn) {
        watchBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log(`🎬 Playing trailer for movie ID: ${movie.id}`);
            openTrailerModal(movie.id);
        });
    }
    
    if (whereBtn) {
        whereBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            console.log(`📺 Opening streaming info for movie ID: ${movie.id}`);
            openStreamingModal(movie.id, 'movie');
        });
    }
}

// Apply Filters
// Apply Filters Button
applyFiltersBtn.addEventListener('click', () => {
    // Validate that we have a mood selected
    if (!primaryMood) {
        showToast('Please select a mood first', 'warning', 3000);
        return;
    }
    
    // Update all filters from UI
    currentFilters.sort = sortSelect.value;
    currentFilters.rating = parseInt(ratingFilter.value) || 0;
    currentFilters.year = yearFilter.value;
    currentFilters.language = languageFilter.value;
    
    // Log filter application
    console.log('🎛️ Apply Filters Clicked:', {
        mood: primaryMood,
        language: currentFilters.language,
        year: currentFilters.year,
        rating: currentFilters.rating,
        sort: currentFilters.sort
    });
    
    // Show loading state
    skeletonGrid.classList.remove('hidden');
    moviesGrid.innerHTML = '';
    loadMoreBtn.classList.add('hidden');
    
    // Reset pagination
    allMovies = [];
    displayedMovies = [];
    currentPage = 1;
    
    // Reload music recommendations with updated filters
    if (primaryMood) {
        console.log('🎵 Reloading music with filters...');
        loadMusicRecommendations(primaryMood);
    }
    
    // Always fetch both movies and TV series
    fetchBothContent().finally(() => {
        skeletonGrid.classList.add('hidden');
    });
    
    // Count active filters for feedback
    let activeFilters = 0;
    if (currentFilters.rating > 0) activeFilters++;
    if (currentFilters.year) activeFilters++;
    if (currentFilters.language) activeFilters++;
    if (currentFilters.sort !== 'popularity.desc') activeFilters++;
    
    // Show feedback toast
    const filterMessage = activeFilters > 0 
        ? `✓ ${activeFilters} filter${activeFilters > 1 ? 's' : ''} applied` 
        : 'Filters cleared';
    showToast(filterMessage, 'success', 2000);
});

// Sort Select - Apply immediately on change
if (sortSelect) {
    sortSelect.addEventListener('change', () => {
        currentFilters.sort = sortSelect.value;
        
        // Re-sort existing movies without fetching
        if (allMovies.length > 0) {
            sortMoviesLocally();
            displayedMovies = [];
            displayMovies(allMovies.slice(0, 12));
            showToast('Movies re-sorted', 'info', 1500);
        }
    });
}

// Rating Filter - Show feedback
if (ratingFilter) {
    ratingFilter.addEventListener('change', () => {
        const rating = parseInt(ratingFilter.value);
        if (rating > 0) {
            showToast(`Filter set: ${rating}+ rating`, 'info', 1500);
        }
    });
}

// Year Filter - Show feedback
if (yearFilter) {
    yearFilter.addEventListener('change', () => {
        const year = yearFilter.value;
        if (year) {
            const displayYear = year.includes('-') ? year : year;
            showToast(`Filter set: ${displayYear}`, 'info', 1500);
        }
    });
}

// Helper function to sort movies locally
function sortMoviesLocally() {
    if (currentFilters.sort === 'popularity.desc') {
        allMovies.sort((a, b) => b.popularity - a.popularity);
    } else if (currentFilters.sort === 'popularity.asc') {
        allMovies.sort((a, b) => a.popularity - b.popularity);
    } else if (currentFilters.sort === 'vote_average.desc') {
        allMovies.sort((a, b) => b.vote_average - a.vote_average);
    } else if (currentFilters.sort === 'vote_average.asc') {
        allMovies.sort((a, b) => a.vote_average - b.vote_average);
    } else if (currentFilters.sort === 'release_date.desc') {
        allMovies.sort((a, b) => new Date(b.release_date) - new Date(a.release_date));
    } else if (currentFilters.sort === 'release_date.asc') {
        allMovies.sort((a, b) => new Date(a.release_date) - new Date(b.release_date));
    }
}

// Back Button
backBtn.addEventListener('click', () => {
    resultsSection.classList.add('hidden');
    searchSection.classList.remove('hidden');
    
    // Hide Spotify section
    const vibeMusicSection = document.getElementById('vibeMusicSection');
    if (vibeMusicSection) {
        vibeMusicSection.classList.add('hidden');
    }
});

// Open Trailer Modal
async function openTrailerModal(movieId) {
    console.log('🎬 Opening trailer for movie ID:', movieId);
    
    if (!trailerModal || !modalBody) {
        console.error('❌ Trailer modal elements not found');
        showToast('Unable to load trailer', 'error', 3000);
        return;
    }
    
    try {
        const response = await fetch(
            `${TMDB_PROXY_BASE}/movie/${movieId}/videos`
        );
        
        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📹 Videos data:', data);
        
        const trailer = data.results.find(video => 
            video.type === 'Trailer' && video.site === 'YouTube'
        ) || data.results[0];

        if (trailer && trailer.key) {
            modalBody.innerHTML = `
                <iframe 
                    src="https://www.youtube.com/embed/${trailer.key}?autoplay=1" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen
                    style="width: 100%; height: 100%;">
                </iframe>
            `;
            trailerModal.classList.remove('hidden');
            console.log('✅ Trailer loaded successfully');
        } else {
            console.warn('⚠️ No trailer found');
            showToast('🎬 No Trailer Available - Sorry, no trailer is available for this movie.', 'info', 3000);
        }
    } catch (error) {
        console.error('❌ Error fetching trailer:', error);
        showToast('⚠️ Error - Failed to load trailer. Please try again later.', 'error', 3000);
    }
}

// Show Series Details Modal
async function showSeriesDetails(seriesId) {
    console.log('📺 Opening trailer for series ID:', seriesId);
    
    if (!trailerModal || !modalBody) {
        console.error('❌ Trailer modal elements not found');
        showToast('Unable to load trailer', 'error', 3000);
        return;
    }
    
    try {
        const response = await fetch(`${TMDB_PROXY_BASE}/tv/${seriesId}/videos`);
        
        if (!response.ok) {
            throw new Error(`API returned ${response.status}`);
        }
        
        const data = await response.json();
        console.log('📹 Series videos data:', data);
        
        const trailer = data.results.find(video => 
            video.type === 'Trailer' && video.site === 'YouTube'
        ) || data.results[0];

        if (trailer && trailer.key) {
            modalBody.innerHTML = `
                <iframe 
                    src="https://www.youtube.com/embed/${trailer.key}?autoplay=1" 
                    frameborder="0" 
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowfullscreen
                    style="width: 100%; height: 100%;">
                </iframe>
            `;
            trailerModal.classList.remove('hidden');
            console.log('✅ Series trailer loaded successfully');
        } else {
            console.warn('⚠️ No trailer found for series');
            showToast('📺 No Trailer Available - Sorry, no trailer is available for this series.', 'info', 3000);
        }
    } catch (error) {
        console.error('❌ Error fetching series trailer:', error);
        showToast('⚠️ Error - Failed to load trailer. Please try again later.', 'error', 3000);
    }
}

// Open Streaming Modal
// Helper function to get streaming platform URLs
function getStreamingUrl(providerName, movieTitle) {
    const searchQuery = encodeURIComponent(movieTitle);
    const providerUrls = {
        'Netflix': 'https://www.netflix.com/search?q=' + searchQuery,
        'Amazon Prime Video': 'https://www.primevideo.com/search?phrase=' + searchQuery,
        'Prime Video': 'https://www.primevideo.com/search?phrase=' + searchQuery,
        'Disney Plus': 'https://www.disneyplus.com/search?q=' + searchQuery,
        'Disney+': 'https://www.disneyplus.com/search?q=' + searchQuery,
        'Hulu': 'https://www.hulu.com/search?q=' + searchQuery,
        'HBO Max': 'https://www.max.com/search?q=' + searchQuery,
        'Max': 'https://www.max.com/search?q=' + searchQuery,
        'Apple TV Plus': 'https://tv.apple.com/search?q=' + searchQuery,
        'Apple TV': 'https://tv.apple.com/search?q=' + searchQuery,
        'Paramount Plus': 'https://www.paramountplus.com/search/?query=' + searchQuery,
        'Paramount+': 'https://www.paramountplus.com/search/?query=' + searchQuery,
        'Peacock': 'https://www.peacocktv.com/search/' + searchQuery,
        'YouTube': 'https://www.youtube.com/results?search_query=' + searchQuery,
        'Google Play Movies': 'https://play.google.com/store/search?q=' + searchQuery,
        'YouTube Premium': 'https://www.youtube.com/results?search_query=' + searchQuery,
        'Hotstar': 'https://www.hotstar.com/search?q=' + searchQuery,
        'Zee5': 'https://www.zee5.com/search?q=' + searchQuery,
        'SonyLIV': 'https://www.sonyliv.com/search?q=' + searchQuery,
        'Voot': 'https://www.voot.com/search?q=' + searchQuery,
        'JioCinema': 'https://www.jiocinema.com/search?q=' + searchQuery
    };
    
    // Return the specific URL or default TMDB link
    return providerUrls[providerName] || `https://www.google.com/search?q=watch+${searchQuery}+online`;
}

async function openStreamingModal(contentId, contentType = 'movie') {
    try {
        console.log(`🎬 Opening streaming modal for ${contentType}: ${contentId}`);
        
        const endpoint = contentType === 'tv' ? 'tv' : 'movie';
        console.log(`📡 Fetching from: ${TMDB_PROXY_BASE}/${endpoint}/${contentId}`);
        console.log(`📡 Fetching providers from: ${TMDB_PROXY_BASE}/${endpoint}/${contentId}/watch/providers`);
        
        const [contentResponse, providersResponse] = await Promise.all([
            fetch(`${TMDB_PROXY_BASE}/${endpoint}/${contentId}`),
            fetch(`${TMDB_PROXY_BASE}/${endpoint}/${contentId}/watch/providers`)
        ]);

        console.log(`📊 Content response status: ${contentResponse.status}`);
        console.log(`📊 Providers response status: ${providersResponse.status}`);

        if (!contentResponse.ok || !providersResponse.ok) {
            throw new Error(`HTTP error! content: ${contentResponse.status}, providers: ${providersResponse.status}`);
        }

        const content = await contentResponse.json();
        const providersData = await providersResponse.json();
        
        console.log('📦 Providers data:', providersData);
        
        const providers = providersData.results?.[REGION] || providersData.results?.US || {};
        console.log(`🌍 Using region: ${REGION}, providers:`, providers);
        
        const title = contentType === 'tv' ? content.name : content.title;
        const releaseDate = contentType === 'tv' ? content.first_air_date : content.release_date;
        const year = releaseDate ? new Date(releaseDate).getFullYear() : 'N/A';
        const runtime = contentType === 'tv' 
            ? (content.number_of_seasons ? `${content.number_of_seasons} Season${content.number_of_seasons > 1 ? 's' : ''}` : 'N/A')
            : (content.runtime ? `${content.runtime} min` : 'N/A');

        let streamingHTML = `
            <h2 class="streaming-title">${title}</h2>
            <p class="streaming-subtitle">${year} • ${runtime}</p>
        `;
        
        if (providers.flatrate) {
            console.log(`✅ Found ${providers.flatrate.length} streaming services`);
            streamingHTML += `
                <div class="streaming-section">
                    <h3>Stream</h3>
                    <div class="provider-grid">
                        ${providers.flatrate.map(provider => `
                            <a href="${getStreamingUrl(provider.provider_name, title)}" target="_blank" rel="noopener noreferrer" class="provider-item" title="Watch ${title} on ${provider.provider_name}">
                                <img src="${TMDB_IMAGE_BASE_URL}/original${provider.logo_path}" alt="${provider.provider_name}" class="provider-logo">
                                <p class="provider-name">${provider.provider_name}</p>
                            </a>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        if (providers.rent) {
            console.log(`✅ Found ${providers.rent.length} rental services`);
            streamingHTML += `
                <div class="streaming-section">
                    <h3>Rent</h3>
                    <div class="provider-grid">
                        ${providers.rent.map(provider => `
                            <a href="${getStreamingUrl(provider.provider_name, title)}" target="_blank" rel="noopener noreferrer" class="provider-item" title="Rent ${title} on ${provider.provider_name}">
                                <img src="${TMDB_IMAGE_BASE_URL}/original${provider.logo_path}" alt="${provider.provider_name}" class="provider-logo">
                                <p class="provider-name">${provider.provider_name}</p>
                            </a>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        if (providers.buy) {
            console.log(`✅ Found ${providers.buy.length} purchase services`);
            streamingHTML += `
                <div class="streaming-section">
                    <h3>Buy</h3>
                    <div class="provider-grid">
                        ${providers.buy.map(provider => `
                            <a href="${getStreamingUrl(provider.provider_name, title)}" target="_blank" rel="noopener noreferrer" class="provider-item" title="Buy ${title} on ${provider.provider_name}">
                                <img src="${TMDB_IMAGE_BASE_URL}/original${provider.logo_path}" alt="${provider.provider_name}" class="provider-logo">
                                <p class="provider-name">${provider.provider_name}</p>
                            </a>
                        `).join('')}
                    </div>
                </div>
            `;
        }

        if (!providers.flatrate && !providers.rent && !providers.buy) {
            console.warn('⚠️ No streaming providers found for this content');
            streamingHTML += `
                <div class="no-streaming">
                    <p>Streaming information not available for your region (${REGION}).</p>
                    <p style="margin-top: 10px; font-size: 0.9rem;">Try searching on your preferred streaming platform.</p>
                </div>
            `;
        }

        streamingBody.innerHTML = streamingHTML;
        streamingModal.classList.remove('hidden');
        
        console.log('✅ Streaming modal opened successfully');
    } catch (error) {
        console.error('❌ Error fetching streaming info:', error);
        showToast('⚠️ Error - Failed to load streaming information. Please try again later.', 'error', 3000);
        streamingBody.innerHTML = `
            <div class="no-streaming">
                <p>Failed to load streaming information.</p>
                <p style="margin-top: 10px;">Please try again later.</p>
            </div>
        `;
        streamingModal.classList.remove('hidden');
    }
}

// Modal Close Events
modalClose.addEventListener('click', () => {
    trailerModal.classList.add('hidden');
    modalBody.innerHTML = '';
});

modalOverlay.addEventListener('click', () => {
    trailerModal.classList.add('hidden');
    modalBody.innerHTML = '';
});

streamingClose.addEventListener('click', () => {
    streamingModal.classList.add('hidden');
    streamingBody.innerHTML = '';
});

streamingOverlay.addEventListener('click', () => {
    streamingModal.classList.add('hidden');
    streamingBody.innerHTML = '';
});

// ============================================
// INTERACTIVE ENHANCEMENTS
// ============================================

// Add ripple effect to all buttons
function addRippleEffect(button) {
    button.addEventListener('click', function (e) {
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        ripple.classList.add('ripple');
        
        this.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    });
}

// Apply ripple effect to all clickable elements
document.querySelectorAll('button, [role="button"]').forEach(button => {
    addRippleEffect(button);
});

// Smooth scroll animation for page transitions
function smoothScrollToElement(element) {
    element.scrollIntoView({ behavior: 'smooth', block: 'start' });
}

// Add hover animations to movie cards
function enhanceMovieCards() {
    const movieCards = document.querySelectorAll('.movie-card, .movie-item');
    movieCards.forEach(card => {
        card.addEventListener('mouseenter', function () {
            this.style.transform = 'translateY(-10px) scale(1.02)';
        });
        card.addEventListener('mouseleave', function () {
            this.style.transform = 'translateY(0) scale(1)';
        });
    });
}

// Add parallax effect to background
function setupParallax() {
    window.addEventListener('mousemove', (e) => {
        const xPos = (e.clientX / window.innerWidth) * 10;
        const yPos = (e.clientY / window.innerHeight) * 10;
        const gradientOrbs = document.querySelectorAll('.gradient-orb');
        gradientOrbs.forEach((orb, index) => {
            orb.style.transform = `translate(${xPos * (index + 1)}px, ${yPos * (index + 1)}px)`;
        });
    });
}

// Animate elements on scroll
function setupScrollAnimations() {
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.animation = 'fadeInUp 0.6s ease-out';
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('.movie-item, .feature-item, .filter-chip').forEach(el => {
        observer.observe(el);
    });
}

// Pulse animation for main CTA
function pulseAnimation(element) {
    if (element) {
        element.style.animation = 'pulse 2s cubic-bezier(0.4, 0, 0.6, 1) infinite';
    }
}

// Add keyboard shortcuts
document.addEventListener('keydown', (e) => {
    // Escape to close modals
    if (e.key === 'Escape') {
        trailerModal.classList.add('hidden');
        streamingModal.classList.add('hidden');
    }
    // Enter to submit mood search
    if (e.key === 'Enter' && document.activeElement === mainMoodInput) {
        moodSubmitBtn.click();
    }
});

// Add loading state animations
function setLoadingState(button, isLoading) {
    if (isLoading) {
        button.style.opacity = '0.7';
        button.style.pointerEvents = 'none';
    } else {
        button.style.opacity = '1';
        button.style.pointerEvents = 'auto';
    }
}

// Initialize interactive enhancements after page load
window.addEventListener('load', () => {
    setupParallax();
    setupScrollAnimations();
    
    // Add animations to form inputs
    document.querySelectorAll('input').forEach(input => {
        input.addEventListener('focus', function () {
            this.parentElement.style.transform = 'scale(1.01)';
        });
        input.addEventListener('blur', function () {
            this.parentElement.style.transform = 'scale(1)';
        });
    });
    
    // Add stagger animation to form groups
    const formGroups = document.querySelectorAll('.form-group');
    formGroups.forEach((group, index) => {
        group.style.animationDelay = `${index * 0.1}s`;
    });
});

// Add CSS for ripple effect and additional animations
const style = document.createElement('style');
style.textContent = `
    @keyframes pulse {
        0%, 100% {
            box-shadow: 0 4px 16px rgba(99, 102, 241, 0.3);
        }
        50% {
            box-shadow: 0 4px 30px rgba(99, 102, 241, 0.6);
        }
    }
    
    @keyframes fadeInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .ripple {
        position: absolute;
        width: 20px;
        height: 20px;
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        pointer-events: none;
        transform: scale(0);
        animation: rippleAnimation 0.6s ease-out;
    }
    
    @keyframes rippleAnimation {
        to {
            transform: scale(4);
            opacity: 0;
        }
    }
    
    button, [role="button"] {
        position: relative;
        overflow: visible;
    }
    
    .movie-card, .movie-item {
        transition: transform 0.3s cubic-bezier(0.4, 0, 0.2, 1), 
                    box-shadow 0.3s ease-out;
    }
    
    .form-group {
        transition: transform 0.3s ease-out;
    }
`;
document.head.appendChild(style);

// ==================== INTERACTIVE VIBE MAP FUNCTIONS ====================

/**
 * Initialize the Emotional Galaxy Vibe Map
 * Creates interactive mood orbs with orbital layout
 */
function initializeVibeMap() {
    const orbConfigs = Object.entries(MOOD_MAPPINGS).map(([mood, config], index) => ({
        mood,
        color: config.color,
        gradient: config.gradient,
        icon: getMoodIcon(mood)
    }));

    renderVibeOrbs(orbConfigs);
    setupVibeMapEventListeners();
}

/**
 * Get emoji icon for each mood
 */
function getMoodIcon(mood) {
    const moodIcons = {
        'Adventure': '🧭', 
        'Comedy': '😄', 
        'Sci-Fi': '🚀', 
        'Action': '💥',
        'Fantasy': '🧙', 
        'Heartwarming': '💖', 
        'Mystery': '🔍', 
        'Cozy': '☕',
        'Inspiring': '🌟', 
        'Nostalgic': '📼', 
        'Romantic': '💕', 
        'Horror': '👻',
        'Thriller': '😱', 
        'Drama': '🎭', 
        'Animated': '🎬', 
        'Documentary': '📚',
        'Family': '👪', 
        'Crime': '🕵️', 
        'Musical': '🎵', 
        'War': '⚔️',
        'Western': '🤠', 
        'Historical': '🏛️', 
        'Biography': '👤', 
        'Sports': '⚽',
        'Mind-Bending': '🌀',
        'Paranormal': '👽',
        'Survival': '🏕️',
        'Heist': '💰',
        'Superhero': '🦸',
        'Dark Comedy': '😈',
        'Epic': '⚔️',
        'Magical': '✨',
        'Coming-of-Age': '🌱',
        'Revenge': '🗡️',
        'Conspiracy': '🕵️‍♂️'
    };
    return moodIcons[mood] || '🎬';
}

/**
 * Render glowing orbs in multi-ring galaxy pattern
 */
function renderVibeOrbs(orbConfigs) {
    const container = vibeOrbsContainer;
    
    // Clear existing orbs and force reflow to reset animations
    container.innerHTML = '';
    void container.offsetWidth; // Force reflow
    
    const centerX = 450; // Center X - adjusted for better fit
    const centerY = 250; // Centered vertically
    const orbCount = orbConfigs.length;
    
    // Create 2-ring circular layout for 12 moods - larger icons for better visibility
    const rings = [
        { count: 6, radius: 90, size: 70 },    // Inner ring - 6 moods (larger icons)
        { count: 6, radius: 170, size: 70 }    // Outer ring - 6 moods (170 + 70/2 = 205 < 250)
    ];
    
    let orbIndex = 0;
    
    rings.forEach((ring, ringIndex) => {
        const orbsInRing = Math.min(ring.count, orbCount - orbIndex);
        const startAngle = -Math.PI / 2; // Start from top (12 o'clock position)
        
        for (let i = 0; i < orbsInRing && orbIndex < orbCount; i++) {
            const config = orbConfigs[orbIndex];
            const angle = startAngle + (i / orbsInRing) * Math.PI * 2;
            const x = centerX + ring.radius * Math.cos(angle);
            const y = centerY + ring.radius * Math.sin(angle);
            
            const orb = document.createElement('div');
            orb.className = 'vibe-orb';
            orb.dataset.mood = config.mood;
            orb.style.setProperty('--orb-color', config.color);
            orb.style.left = `${x}px`;
            orb.style.top = `${y}px`;
            orb.style.width = `${ring.size}px`;
            orb.style.height = `${ring.size}px`;
            orb.style.marginLeft = `-${ring.size / 2}px`;
            orb.style.marginTop = `-${ring.size / 2}px`;
            
            orb.innerHTML = `
                <div class="vibe-orb-inner">
                    <div class="vibe-orb-icon">${config.icon}</div>
                </div>
                <div class="vibe-orb-label">${config.mood}</div>
            `;
            
            // Set static - no animations
            orb.style.opacity = '1';
            orb.style.transform = 'scale(1)';
            
            container.appendChild(orb);
            
            orbIndex++;
        }
    });
}

/**
 * Setup event listeners for vibe map interaction
 */
function setupVibeMapEventListeners() {
    const orbs = document.querySelectorAll('.vibe-orb');
    
    orbs.forEach(orb => {
        orb.addEventListener('click', (e) => {
            e.stopPropagation();
            selectVibeMapMood(orb.dataset.mood);
        });
    });
    
    // Close button - return to search section
    vibeMapClose.addEventListener('click', () => {
        vibeMapSection.classList.add('hidden');
        searchSection.classList.remove('hidden');
    });
}

/**
 * Display smart suggestions based on current context
 */
function displaySmartSuggestions() {
    console.log('💡 Displaying smart suggestions...');
    console.log('   Primary Mood:', primaryMood);
    console.log('   Selected Language:', selectedLanguage);
    console.log('   Available mood suggestions:', Object.keys(MOOD_SUGGESTIONS));
    
    const suggestionsBanner = document.getElementById('suggestionsBanner');
    const suggestionsChips = document.getElementById('suggestionsChips');
    const suggestionContext = document.getElementById('suggestionContext');
    
    if (!suggestionsBanner || !suggestionsChips) {
        console.warn('⚠️ Suggestions banner elements not found in DOM');
        return;
    }
    
    suggestionsChips.innerHTML = '';
    let suggestions = [];
    let contextText = '';
    
    // Priority 1: Mood-based suggestions (ALWAYS prefer mood if available)
    if (primaryMood && MOOD_SUGGESTIONS[primaryMood]) {
        suggestions = MOOD_SUGGESTIONS[primaryMood];
        contextText = `Perfect for your ${primaryMood} mood`;
        console.log(`✅ Using mood-based suggestions for "${primaryMood}":`, suggestions.map(s => s.label));
    }
    // Priority 2: Language-based suggestions
    else if (selectedLanguage && LANGUAGE_SUGGESTIONS[selectedLanguage]) {
        suggestions = LANGUAGE_SUGGESTIONS[selectedLanguage];
        const langName = document.querySelector(`[data-lang="${selectedLanguage}"]`)?.dataset.name || 'this language';
        contextText = `${langName} cinema recommendations`;
        console.log('✅ Using language-based suggestions:', suggestions.map(s => s.label));
    }
    // Priority 3: General suggestions
    else {
        suggestions = GENRE_SUGGESTIONS;
        contextText = 'Popular recommendations for you';
        console.log('✅ Using general suggestions:', suggestions.map(s => s.label));
    }
    
    // Update context text
    if (suggestionContext) {
        suggestionContext.textContent = contextText;
    }
    
    // Create suggestion chips
    suggestions.forEach(suggestion => {
        const chip = document.createElement('button');
        chip.className = 'suggestion-chip';
        chip.innerHTML = `
            <span class="chip-icon">${suggestion.icon}</span>
            <span>${suggestion.label}</span>
        `;
        
        chip.addEventListener('click', () => {
            applySuggestionFilter(suggestion.filter);
        });
        
        suggestionsChips.appendChild(chip);
    });
    
    // Show the banner with animation
    suggestionsBanner.classList.remove('hidden');
}

/**
 * Apply filter from suggestion chip
 */
function applySuggestionFilter(filterConfig) {
    // Update filter UI elements
    if (filterConfig.sort) {
        const sortSelect = document.getElementById('sortSelect');
        if (sortSelect) sortSelect.value = filterConfig.sort;
        currentFilters.sort = filterConfig.sort;
    }
    
    if (filterConfig.rating !== undefined) {
        const ratingFilter = document.getElementById('ratingFilter');
        if (ratingFilter) ratingFilter.value = filterConfig.rating;
        currentFilters.rating = filterConfig.rating;
    }
    
    if (filterConfig.year) {
        const yearFilter = document.getElementById('yearFilter');
        if (yearFilter) yearFilter.value = filterConfig.year;
        currentFilters.year = filterConfig.year;
    }
    
    // Apply filters and refresh results
    if (primaryMood) {
        fetchMoviesByMood(primaryMood);
    }
    
    // Scroll to results
    setTimeout(() => {
        resultsSection?.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }, 100);
}

/**
 * Select a mood from the vibe map
 */
function selectVibeMapMood(mood) {
    // Check if selecting the same mood
    const isSameMood = vibeMapSelectedMood === mood;
    
    // Deselect all orbs first with smooth animation
    document.querySelectorAll('.vibe-orb').forEach(orb => {
        orb.classList.remove('selected');
        orb.style.transform = 'scale(1)';
    });
    
    // Select the new orb with pulse animation
    const selectedOrb = document.querySelector(`[data-mood="${mood}"]`);
    if (selectedOrb) {
        selectedOrb.classList.add('selected');
        
        // Add selection pulse effect
        selectedOrb.style.animation = 'none';
        setTimeout(() => {
            selectedOrb.style.animation = 'orbPulse 0.6s ease-out';
        }, 10);
    }
    
    // Update global state
    vibeMapSelectedMood = mood;
    
    // Add loading overlay for smooth transition
    const vibeMap = document.querySelector('.vibe-map-canvas');
    if (vibeMap && !isSameMood) {
        vibeMap.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
    }
    
    // Morph UI to selected mood's aesthetic with delay
    setTimeout(() => {
        morphUIToMood(mood);
    }, 100);
    
    // Fetch and display movies matching this mood
    if (!isSameMood) {
        // Add fade transition to results section
        if (resultsSection && !resultsSection.classList.contains('hidden')) {
            resultsSection.style.opacity = '0';
            setTimeout(() => {
                fetchMoviesByMood(mood);
                resultsSection.style.opacity = '1';
            }, 300);
        } else {
            fetchMoviesByMood(mood);
        }
    }
}

/**
 * Morph UI background and colors to match selected mood
 */
function morphUIToMood(mood) {
    const moodConfig = MOOD_MAPPINGS[mood];
    if (!moodConfig) return;
    
    // Update gradient background with smooth transition
    const vibeMap = document.querySelector('.vibe-map-canvas');
    if (vibeMap) {
        vibeMap.style.transition = 'all 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
        vibeMap.style.background = moodConfig.gradient;
        vibeMap.style.opacity = '0.15';
    }
    
    // Update header colors with smooth transition
    const title = document.querySelector('.vibe-map-title');
    if (title) {
        title.style.transition = 'all 0.6s ease-out';
        title.style.background = moodConfig.gradient;
        title.style.webkitBackgroundClip = 'text';
        title.style.webkitTextFillColor = 'transparent';
        title.style.backgroundClip = 'text';
        
        // Add subtle glow effect
        title.style.filter = `drop-shadow(0 0 20px ${moodConfig.color}40)`;
    }
    
    // Update close button color
    const closeBtn = document.getElementById('vibeMapClose');
    if (closeBtn) {
        closeBtn.style.transition = 'all 0.5s ease';
        closeBtn.style.borderColor = moodConfig.color + '40';
    }
    
    // Add ambient glow to entire section
    const vibeMapSection = document.getElementById('vibeMapSection');
    if (vibeMapSection) {
        vibeMapSection.style.transition = 'box-shadow 0.8s ease';
        vibeMapSection.style.boxShadow = `0 0 100px ${moodConfig.color}20`;
    }
}

async function fetchMoviesByMood(mood) {
    if (isLoading) return;
    
    console.log('🗺️ Vibe Map: Fetching content for mood:', mood);
    
    // Check if mood is changing
    const isChangingMood = primaryMood && primaryMood !== mood;
    primaryMood = mood;
    
    // Save to memory
    saveMoodToMemory(mood);
    
    // Automatically apply vibe mode based on mood
    autoApplyVibeModeForMood(mood);
    
    // Hide vibe map and show results
    vibeMapSection.classList.add('hidden');
    resultsSection.classList.remove('hidden');
    searchSection.classList.add('hidden');
    
    // Update current selection display
    const moodConfig = MOOD_MAPPINGS[mood];
    currentSelection.innerHTML = `
        <span style="color: ${moodConfig.color};">${getMoodIcon(mood)}</span>
        ${mood}
    `;
    
    // Display smart suggestions for this mood
    displaySmartSuggestions();
    
    // Show transition message if changing mood
    if (isChangingMood) {
        moviesGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 60px 20px;">
                <div style="font-size: 3rem; margin-bottom: 20px; animation: pulse 1s ease-in-out infinite;">
                    ${getMoodIcon(mood)}
                </div>
                <h3 style="font-size: 1.5rem; color: ${moodConfig.color}; margin-bottom: 10px;">
                    Switching to ${mood} vibes...
                </h3>
                <p style="color: var(--text-secondary);">
                    Finding your perfect ${mood.toLowerCase()} movies & music
                </p>
            </div>
        `;
        
        // Small delay for smooth transition
        await new Promise(resolve => setTimeout(resolve, 800));
    }
    
    skeletonGrid.classList.remove('hidden');
    moviesGrid.innerHTML = '';
    moviesGrid.style.display = 'grid'; // Ensure grid is visible
    loadMoreBtn.classList.add('hidden');
    allMovies = [];
    displayedMovies = [];
    
    // Load BOTH music and movies
    console.log('🎵 Loading music recommendations for:', mood);
    loadMusicRecommendations(mood);
    
    console.log('🎬 Loading movie recommendations for:', mood);
    await fetchMovies().finally(() => {
        skeletonGrid.classList.add('hidden');
        console.log('✅ Vibe Map: Completed loading movies and music for:', mood);
    });
}

// ==================== YOUTUBE MUSIC API INTEGRATION ====================

// YouTube Music Player state (use existing youtubePlayer variable)
let currentYouTubePlaylist = [];
let currentYouTubeIndex = -1;

/**
 * Initialize YouTube IFrame Player
 */
function initYouTubePlayer() {
    // Only initialize once
    if (youtubePlayer) return;
    
    // Wait for YouTube IFrame API to be ready
    if (typeof YT === 'undefined' || !YT.Player) {
        console.log('⏳ Waiting for YouTube IFrame API...');
        window.onYouTubeIframeAPIReady = createYouTubePlayer;
        return;
    }
    
    createYouTubePlayer();
}

function createYouTubePlayer() {
    if (youtubePlayer) return;
    
    console.log('🎬 Creating YouTube Music Player...');
    
    youtubePlayer = new YT.Player('youtubePlayer', {
        height: '0',
        width: '0',
        playerVars: {
            autoplay: 0,
            controls: 0,
            disablekb: 1,
            fs: 0,
            modestbranding: 1,
            playsinline: 1,
            rel: 0
        },
        events: {
            onReady: onYouTubePlayerReady,
            onStateChange: onYouTubePlayerStateChange,
            onError: onYouTubePlayerError
        }
    });
}

function onYouTubePlayerReady(event) {
    youtubePlayerReady = true;
    console.log('✅ YouTube Music Player Ready!');
}

function onYouTubePlayerStateChange(event) {
    const playerBar = document.getElementById('musicPlayerBar');
    const playPauseBtn = document.getElementById('playerPlayPauseBtn');
    
    if (event.data === YT.PlayerState.PLAYING) {
        // Update UI to show pause button
        if (playPauseBtn) {
            playPauseBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                </svg>
            `;
        }
        // Start progress updates
        startProgressUpdates();
    } else if (event.data === YT.PlayerState.PAUSED) {
        // Update UI to show play button
        if (playPauseBtn) {
            playPauseBtn.innerHTML = `
                <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M8 5v14l11-7z"/>
                </svg>
            `;
        }
        stopProgressUpdates();
    } else if (event.data === YT.PlayerState.ENDED) {
        // Auto-play next song
        playNextYouTubeSong();
    }
}

function onYouTubePlayerError(event) {
    console.error('YouTube Player Error:', event.data);
    showToast('Error playing song. Trying next...', 'error', 3000);
    playNextYouTubeSong();
}

/**
 * Search YouTube Music for tracks
 */
async function searchYouTubeMusicTracks(query, maxResults = 15) {
    try {
        let allTracks = [];
        let apiQuotaExceeded = false; // Track if we hit 403 errors
        
        // Strategy: Try multiple search variations - VERIFIED/OFFICIAL CONTENT ONLY
        const searchStrategies = [
            // Strategy 1: Official audio with VEVO/Topic channels
            `${query} official audio VEVO topic`,
            // Strategy 2: Official music video
            `${query} official music video`,
            // Strategy 3: Official lyric video
            `${query} official lyric video`,
            // Strategy 4: Just official (fallback)
            `${query} official`
        ];
        
        console.log(`🎵 Searching YouTube Music with ${searchStrategies.length} strategies to get AT LEAST ${maxResults} tracks...`);
        
        // Use server-side aggregate search which runs multiple strategies and ranks results
        console.log(`🎵 Requesting aggregated YouTube search for "${query}" (limit ${maxResults})`);
        const ytResp = await fetch(`${YOUTUBE_PROXY_BASE}/aggregate-search?q=${encodeURIComponent(query)}&limit=${maxResults}`);
        if (!ytResp.ok) {
            console.warn('YouTube aggregate search failed:', ytResp.status);
        } else {
            const data = await ytResp.json();
            if (data && Array.isArray(data.items) && data.items.length > 0) {
                // Map items to simplified track objects expected by the player
                const mapped = data.items.map(item => {
                    const vid = item.id && (item.id.videoId || item.id);
                    return {
                        id: vid,
                        title: item.snippet?.title || 'Unknown',
                        channel: item.snippet?.channelTitle || 'Unknown',
                        thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url || '',
                        _yt_stats: item._yt_stats || {}
                    };
                });
                // Return up to maxResults tracks
                allTracks = mapped.slice(0, maxResults);
            }
        }
        
        // If server-side search returned fewer tracks than requested, fall back to the previous multi-strategy client search as a last resort
        if (allTracks.length < maxResults) {
            console.log(`   ⚠️ Aggregated search returned ${allTracks.length} tracks, falling back to client strategies to fill to ${maxResults}`);
            // previous strategy-based code preserved here as fallback
            for (const [index, musicQuery] of searchStrategies.entries()) {
                if (allTracks.length >= maxResults) break;
                console.log(`   Fallback Strategy ${index + 1}: "${musicQuery.substring(0,50)}..." (current: ${allTracks.length} tracks)`);
                const searchLimit = Math.min(50, maxResults - allTracks.length);
                const url = `${YOUTUBE_PROXY_BASE}/search?q=${encodeURIComponent(musicQuery)}&maxResults=${searchLimit}`;
                try {
                    const response = await fetch(url);
                    if (!response.ok) {
                        if (response.status === 403) {
                            apiQuotaExceeded = true;
                            console.warn(`   ⚠️ Fallback Strategy ${index + 1} failed: 403 - API Quota Exceeded`);
                        } else {
                            console.warn(`   ⚠️ Fallback Strategy ${index + 1} failed:`, response.status);
                        }
                        continue;
                    }
                    const d = await response.json();
                    if (!d.items || d.items.length === 0) continue;
                    for (const it of d.items) {
                        const vid = it.id && (it.id.videoId || it.id);
                        if (!vid) continue;
                        if (allTracks.find(t => t.id === vid)) continue;
                        allTracks.push({ id: vid, title: it.snippet?.title, channel: it.snippet?.channelTitle, thumbnail: it.snippet?.thumbnails?.high?.url });
                        if (allTracks.length >= maxResults) break;
                    }
                } catch (e) {
                    console.warn('Fallback YouTube fetch error', e && e.message);
                }
            }
        }

        // If still fewer than desired, perform a relaxed aggregate search (broaden strategies)
        if (allTracks.length < Math.min(15, maxResults)) {
            console.log(`⚠️ Only ${allTracks.length} tracks found — performing relaxed aggregated search to reach 15+`);
            const extraStrategies = encodeURIComponent(`${query},${query} song,${query} soundtrack,${query} ost,${query} official audio`);
            try {
                const relaxedResp = await fetch(`${YOUTUBE_PROXY_BASE}/aggregate-search?q=${encodeURIComponent(query)}&limit=50&strategies=${extraStrategies}`);
                if (relaxedResp.ok) {
                    const relaxed = await relaxedResp.json();
                    const items = (relaxed && relaxed.items) ? relaxed.items : [];
                    const mapped = items.map(item => {
                        const vid = item.id && (item.id.videoId || item.id);
                        return { id: vid, title: item.snippet?.title, channel: item.snippet?.channelTitle, thumbnail: item.snippet?.thumbnails?.high?.url, _yt_stats: item._yt_stats || {} };
                    });
                    // Merge without duplicates
                    for (const t of mapped) {
                        if (!allTracks.find(x => x.id === t.id)) allTracks.push(t);
                        if (allTracks.length >= maxResults) break;
                    }
                    console.log(`   Relaxed aggregate returned ${mapped.length} items, total now ${allTracks.length}`);
                }
            } catch (e) {
                console.warn('   Relaxed aggregate-search failed:', e && e.message);
            }
        }
        // Return AT LEAST 15 tracks, but keep all found tracks (no slicing)
        console.log(`═══════════════════════════════════════════════`);
        console.log(`🎵 Final result: ${allTracks.length} quality tracks found (minimum was ${maxResults})`);
        console.log(`═══════════════════════════════════════════════`);

        if (allTracks.length === 0) {
            if (apiQuotaExceeded) {
                console.error('❌ YouTube API Quota Exceeded - All requests returned 403');
                console.error('   The YouTube API key has reached its daily quota limit.');
                console.error('   Music recommendations will be unavailable until the quota resets (usually midnight Pacific Time).');
            } else {
                console.warn('⚠️ WARNING: No tracks found after all strategies! This might indicate:');
                console.warn('   1. Filters are too strict (all results filtered out)');
                console.warn('   2. Network/API connection issue');
                console.warn('   3. Invalid search query');
            }
        }

        return allTracks;
    } catch (error) {
        console.error('❌ YouTube Music search error:', error);
        console.error('   Error details:', error.message);
        return [];
    }
}

/**
 * Clean song title (remove "Official Video", "Official Audio", etc.)
 */
function cleanSongTitle(title) {
    return title
        // Remove official tags
        .replace(/\(Official.*?\)/gi, '')
        .replace(/\[Official.*?\]/gi, '')
        .replace(/- Official.*$/gi, '')
        .replace(/Official Video/gi, '')
        .replace(/Official Audio/gi, '')
        .replace(/Official Lyric Video/gi, '')
        .replace(/Official Music Video/gi, '')
        // Remove lyric tags
        .replace(/\(Lyrics?\)/gi, '')
        .replace(/\[Lyrics?\]/gi, '')
        .replace(/Lyric Video/gi, '')
        .replace(/with Lyrics/gi, '')
        // Remove audio tags
        .replace(/\(Audio\)/gi, '')
        .replace(/\[Audio\]/gi, '')
        .replace(/Full Audio/gi, '')
        // Remove video quality tags
        .replace(/\(HD\)/gi, '')
        .replace(/\[HD\]/gi, '')
        .replace(/\(4K\)/gi, '')
        .replace(/\[4K\]/gi, '')
        // Remove extra info
        .replace(/\(Video\)/gi, '')
        .replace(/\[Video\]/gi, '')
        .replace(/Full Song/gi, '')
        .replace(/Full Video/gi, '')
        // Remove pipes and dashes at the end
        .replace(/\s*[\|\-]\s*$/g, '')
        // Clean up multiple spaces
        .replace(/\s+/g, ' ')
        .trim();
}

/**
 * Clean artist name (remove "VEVO", "Topic", etc.)
 */
function cleanArtistName(name) {
    return name
        .replace(/VEVO$/i, '')
        .replace(/- Topic$/i, '')
        .replace(/Official$/i, '')
        .trim();
}

/**
 * Display YouTube Music cards
 */
function displayYouTubeMusicCards(tracks, container) {
    if (!tracks || tracks.length === 0) {
        container.innerHTML = `
            <div class="no-songs-message" style="grid-column: 1/-1; text-align: center; padding: 40px;">
                <p style="font-size: 2rem; margin-bottom: 10px;">🎵</p>
                <p style="color: var(--text-secondary);">No music found. Try different filters!</p>
            </div>
        `;
        return;
    }
    
    // Store tracks globally for playback
    currentYouTubePlaylist = tracks;
    
    container.innerHTML = tracks.map((track, index) => `
        <div class="song-card" data-song-index="${index}" style="animation-delay: ${index * 0.05}s;">
            <div class="song-cover-container" onclick="playYouTubeSong(${index})">
                <img src="${track.image}" alt="${track.name}" class="song-cover" 
                     onerror="this.src='https://via.placeholder.com/200x200/1DB954/ffffff?text=♪'">
                <div class="song-play-overlay">
                    <svg width="40" height="40" viewBox="0 0 24 24" fill="white">
                        <path d="M8 5v14l11-7z"/>
                    </svg>
                </div>
            </div>
            <div class="song-info">
                <h4 class="song-name" title="${track.name}">${track.name}</h4>
                <p class="song-artist" title="${track.artist}">${track.artist}</p>
                <div class="song-actions">
                    <button class="song-play-btn" onclick="playYouTubeSong(${index})" title="Play full song">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M8 5v14l11-7z"/>
                        </svg>
                        <span>Play Song</span>
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

/**
 * Play YouTube song by index
 */
window.playYouTubeSong = function(index) {
    if (!youtubePlayerReady || !currentYouTubePlaylist || index < 0 || index >= currentYouTubePlaylist.length) {
        showToast('Player not ready. Please wait...', 'warning', 2000);
        return;
    }
    
    const track = currentYouTubePlaylist[index];
    currentYouTubeIndex = index;
    
    console.log('▶️ Playing:', track.name, 'by', track.artist);
    
    // Load and play video
    youtubePlayer.loadVideoById(track.videoId);
    
    // Update player bar UI
    updateYouTubeMusicPlayerUI(track);
    
    // Show player bar
    const playerBar = document.getElementById('musicPlayerBar');
    if (playerBar) {
        playerBar.classList.remove('hidden');
    }
    
    // Show toast
    showToast(`Now playing: ${track.name}`, 'success', 2000);
    
    // Highlight playing card
    updatePlayingCardUI(index);
};

/**
 * Update player bar UI
 */
function updateYouTubeMusicPlayerUI(track) {
    const playerThumbnail = document.getElementById('playerThumbnail');
    const playerSongName = document.getElementById('playerSongName');
    const playerArtistName = document.getElementById('playerArtistName');
    
    if (playerThumbnail) playerThumbnail.src = track.image;
    if (playerSongName) playerSongName.textContent = track.name;
    if (playerArtistName) playerArtistName.textContent = track.artist;
}

/**
 * Update playing card UI
 */
function updatePlayingCardUI(index) {
    // Remove previous playing state
    document.querySelectorAll('.song-card').forEach(card => {
        card.classList.remove('playing');
    });
    
    // Add playing state to current card
    const playingCard = document.querySelector(`[data-song-index="${index}"]`);
    if (playingCard) {
        playingCard.classList.add('playing');
    }
}

/**
 * Play next YouTube song
 */
function playNextYouTubeSong() {
    if (currentYouTubeIndex < currentYouTubePlaylist.length - 1) {
        playYouTubeSong(currentYouTubeIndex + 1);
    } else {
        // Loop back to first song
        playYouTubeSong(0);
    }
}

/**
 * Play previous YouTube song
 */
function playPreviousYouTubeSong() {
    if (currentYouTubeIndex > 0) {
        playYouTubeSong(currentYouTubeIndex - 1);
    } else {
        // Loop to last song
        playYouTubeSong(currentYouTubePlaylist.length - 1);
    }
}

/**
 * Toggle play/pause
 */
function toggleYouTubePlayback() {
    if (!youtubePlayer || !youtubePlayerReady) return;
    
    const state = youtubePlayer.getPlayerState();
    if (state === YT.PlayerState.PLAYING) {
        youtubePlayer.pauseVideo();
    } else {
        youtubePlayer.playVideo();
    }
}

// Progress update interval
let progressInterval = null;

function startProgressUpdates() {
    stopProgressUpdates();
    
    progressInterval = setInterval(() => {
        if (!youtubePlayer || !youtubePlayerReady) return;
        
        try {
            const currentTime = youtubePlayer.getCurrentTime();
            const duration = youtubePlayer.getDuration();
            
            if (duration > 0) {
                updateProgressBar(currentTime, duration);
            }
        } catch (e) {
            console.error('Progress update error:', e);
        }
    }, 500);
}

function stopProgressUpdates() {
    if (progressInterval) {
        clearInterval(progressInterval);
        progressInterval = null;
    }
}

function updateProgressBar(currentTime, duration) {
    const progressFill = document.getElementById('playerProgressFill');
    const currentTimeEl = document.getElementById('playerCurrentTime');
    const durationEl = document.getElementById('playerDuration');
    
    const percentage = (currentTime / duration) * 100;
    
    if (progressFill) progressFill.style.width = `${percentage}%`;
    if (currentTimeEl) currentTimeEl.textContent = formatTime(currentTime);
    if (durationEl) durationEl.textContent = formatTime(duration);
}

// Note: formatTime function is defined later in the file

// Initialize player controls
function initYouTubeMusicPlayerControls() {
    const playPauseBtn = document.getElementById('playerPlayPauseBtn');
    const prevBtn = document.getElementById('playerPrevBtn');
    const nextBtn = document.getElementById('playerNextBtn');
    const volumeSlider = document.getElementById('playerVolumeSlider');
    const progressBar = document.getElementById('playerProgressBar');
    
    // Play/Pause
    if (playPauseBtn) {
        playPauseBtn.addEventListener('click', toggleYouTubePlayback);
    }
    
    // Previous
    if (prevBtn) {
        prevBtn.addEventListener('click', playPreviousYouTubeSong);
    }
    
    // Next
    if (nextBtn) {
        nextBtn.addEventListener('click', playNextYouTubeSong);
    }
    
    // Volume
    if (volumeSlider) {
        volumeSlider.addEventListener('input', (e) => {
            if (youtubePlayer && youtubePlayerReady) {
                youtubePlayer.setVolume(e.target.value);
            }
        });
    }
    
    // Progress bar seek
    if (progressBar) {
        progressBar.addEventListener('click', (e) => {
            if (!youtubePlayer || !youtubePlayerReady) return;
            
            const rect = progressBar.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const percentage = x / rect.width;
            const duration = youtubePlayer.getDuration();
            const seekTime = duration * percentage;
            
            youtubePlayer.seekTo(seekTime);
        });
    }
}

// Initialize YouTube Music Player controls on page load
// Wrapped in try-catch for safety
function initYouTubeMusicControls() {
    try {
        initYouTubeMusicPlayerControls();
        console.log('✅ YouTube Music Player controls initialized');
    } catch (error) {
        console.error('❌ Error initializing YouTube Music controls:', error);
    }
}

if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initYouTubeMusicControls);
} else {
    initYouTubeMusicControls();
}

// ==================== SPOTIFY API INTEGRATION ====================

/**
 * Get Spotify access token using Client Credentials flow
 */
async function getSpotifyAccessToken() {
    // Check if we have a valid token
    if (spotifyAccessToken && spotifyTokenExpiry && Date.now() < spotifyTokenExpiry) {
        return spotifyAccessToken;
    }
    
    // Check if credentials are configured
    if (SPOTIFY_CLIENT_ID === 'YOUR_SPOTIFY_CLIENT_ID_HERE' || 
        SPOTIFY_CLIENT_SECRET === 'YOUR_SPOTIFY_CLIENT_SECRET_HERE') {
        console.warn('Spotify credentials not configured. Using fallback recommendations.');
        return null;
    }
    
    try {
        const response = await fetch('https://accounts.spotify.com/api/token', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/x-www-form-urlencoded',
                'Authorization': 'Basic ' + btoa(SPOTIFY_CLIENT_ID + ':' + SPOTIFY_CLIENT_SECRET)
            },
            body: 'grant_type=client_credentials'
        });
        
        if (!response.ok) {
            throw new Error('Failed to get Spotify access token');
        }
        
        const data = await response.json();
        spotifyAccessToken = data.access_token;
        spotifyTokenExpiry = Date.now() + (data.expires_in * 1000) - 60000; // Refresh 1 min early
        
        return spotifyAccessToken;
    } catch (error) {
        console.error('Spotify auth error:', error);
        return null;
    }
}

/**
 * Search Spotify for tracks based on query
 */
async function searchSpotifyTracks(query, limit = 12) {
    const token = await getSpotifyAccessToken();
    
    if (!token) {
        return null; // Will fallback to curated songs
    }
    
    try {
        const url = `${SPOTIFY_API_BASE}/search?q=${encodeURIComponent(query)}&type=track&limit=${limit}`;
        const response = await fetch(url, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
        
        if (!response.ok) {
            throw new Error('Spotify search failed');
        }
        
        const data = await response.json();
        
        console.log(`Spotify API returned ${data.tracks.items.length} tracks`);
        
        // Transform Spotify tracks to our format and filter for preview availability
        const allTracks = data.tracks.items.map(track => ({
            id: track.id,
            name: track.name,
            artist: track.artists.map(a => a.name).join(', '),
            album: track.album.name,
            year: track.album.release_date ? new Date(track.album.release_date).getFullYear() : 'Unknown',
            image: track.album.images[0]?.url || 'https://via.placeholder.com/300x300/1ed760/ffffff?text=♪',
            previewUrl: track.preview_url,
            spotifyUrl: track.external_urls.spotify,
            duration: Math.floor(track.duration_ms / 1000)
        }));
        
        // Prioritize tracks with preview URLs
        const tracksWithPreview = allTracks.filter(track => track.previewUrl);
        const tracksWithoutPreview = allTracks.filter(track => !track.previewUrl);
        
        console.log(`${tracksWithPreview.length} tracks have previews, ${tracksWithoutPreview.length} tracks don't`);
        
        // Return tracks with previews first, then others
        return [...tracksWithPreview, ...tracksWithoutPreview];
    } catch (error) {
        console.error('Spotify search error:', error);
        return null;
    }
}

/**
 * Search YouTube for a song
 */
async function searchYouTubeVideo(songName, artistName) {
    try {
        // Try multiple search queries for better results
        const queries = [
            `${songName} ${artistName} official video`,
            `${songName} ${artistName} official audio`,
            `${songName} ${artistName} lyrics`,
            `${songName} ${artistName}`
        ];
        
        console.log('🔍 Searching YouTube for:', songName, 'by', artistName);
        
        for (const query of queries) {
            const url = `${YOUTUBE_PROXY_BASE}/search?q=${encodeURIComponent(query)}&maxResults=5`;
            
            try {
                const response = await fetch(url);
                
                if (!response.ok) {
                    console.warn(`YouTube API request failed for query: ${query}`);
                    continue;
                }
                
                const data = await response.json();
                
                if (data.items && data.items.length > 0) {
                    // Find the best match (prefer videos with "official" or "audio" in title)
                    const bestMatch = data.items.find(item => 
                        item.snippet.title.toLowerCase().includes('official') ||
                        item.snippet.title.toLowerCase().includes('audio')
                    ) || data.items[0];
                    
                    console.log('✅ Found YouTube video:', bestMatch.snippet.title);
                    return {
                        videoId: bestMatch.id.videoId,
                        title: bestMatch.snippet.title,
                        thumbnail: bestMatch.snippet.thumbnails.default.url
                    };
                }
            } catch (err) {
                console.warn(`Error with query "${query}":`, err);
                continue;
            }
        }
        
        // No results found
        console.warn('❌ No YouTube results found');
        return null;
    } catch (error) {
        console.error('YouTube search error:', error);
        return null;
    }
}

// ==================== MUSIC RECOMMENDATION FUNCTIONS ====================

/**
 * Load music recommendations based on mood and language
 */
async function loadMusicRecommendations(mood) {
    const vibeMusicSection = document.getElementById('vibeMusicSection');
    const musicTitle = document.getElementById('musicSectionTitle');
    const musicSubtitle = document.getElementById('musicSectionSubtitle');
    const musicLoading = document.getElementById('musicLoading');
    const musicGrid = document.getElementById('musicRecommendationsGrid');
    
    if (!vibeMusicSection || !musicGrid) return;
    
    // Check if this mood supports music recommendations
    if (!MUSIC_ENABLED_MOODS.includes(mood)) {
        console.log(`🎬 "${mood}" is a movie-focused mood - hiding music section`);
        vibeMusicSection.classList.add('hidden');
        return;
    }
    
    console.log(`🎵 "${mood}" supports music - showing music section`);
    
    // Get current filters from currentFilters object (updated by Apply Filters button)
    const currentLanguage = currentFilters.language || '';
    const currentYear = currentFilters.year || '';
    
    console.log('═══════════════════════════════════════════════');
    console.log('� LOADING MUSIC RECOMMENDATIONS');
    console.log('═══════════════════════════════════════════════');
    console.log('📊 Current State:');
    console.log('   Mood:', mood);
    console.log('   Language Filter:', currentLanguage || 'All Languages');
    console.log('   Year Filter:', currentYear || 'All Years');
    console.log('   currentFilters object:', JSON.stringify(currentFilters, null, 2));
    
    // Double-check: Read directly from UI elements if currentFilters is empty
    const languageFilterEl = document.getElementById('languageFilter');
    const yearFilterEl = document.getElementById('yearFilter');
    if (!currentLanguage && languageFilterEl && languageFilterEl.value) {
        currentLanguage = languageFilterEl.value;
        console.log('   ⚠️ Language filter empty in currentFilters, reading from UI:', currentLanguage);
    }
    if (!currentYear && yearFilterEl && yearFilterEl.value) {
        currentYear = yearFilterEl.value;
        console.log('   ⚠️ Year filter empty in currentFilters, reading from UI:', currentYear);
    }
    console.log('═══════════════════════════════════════════════');
    
    // Build search query based on mood and language
    const moodKeywords = MOOD_MUSIC_KEYWORDS[mood];
    if (!moodKeywords) {
        console.error('❌ No mood keywords found for:', mood);
        return;
    }
    
    // Build multiple search strategies for better results
    let searchStrategies = [];
    let displayTitle = '🎵 Vibe Music';
    let displaySubtitle = `${mood} mood • Perfect songs for you`;
    let filterTags = [];
    
    // Base query with mood keywords
    const baseKeywords = moodKeywords.keywords;
    
    // Add language-specific keywords and strategies
    if (currentLanguage && LANGUAGE_MUSIC_KEYWORDS[currentLanguage]) {
        const langKeywords = LANGUAGE_MUSIC_KEYWORDS[currentLanguage];
        const langName = Object.keys(LANGUAGES).find(key => LANGUAGES[key] === currentLanguage);
        displayTitle = `🎵 ${langName} Vibe Music`;
        filterTags.push(langName);
        
        // Multiple strategies for language + mood - focus on INDIVIDUAL songs, not compilations
        searchStrategies = [
            `${baseKeywords} ${langKeywords} official music video`,
            `${baseKeywords} ${langKeywords} official audio song`,
            `${baseKeywords} ${langKeywords} lyric video`,
            `${langKeywords} ${moodKeywords.genre} song official`
        ];
    } else {
        // Multiple strategies for mood only (all languages) - focus on INDIVIDUAL songs
        searchStrategies = [
            `${baseKeywords} official music video`,
            `${baseKeywords} official audio song`,
            `${moodKeywords.genre} song official video`,
            `${baseKeywords} lyric video official`
        ];
    }
    
    // Add year to all strategies if specified
    if (currentYear) {
        if (currentYear.includes('-')) {
            const [startYear, endYear] = currentYear.split('-');
            searchStrategies = searchStrategies.map(s => `${s} ${startYear} ${endYear}`);
            filterTags.push(currentYear);
        } else {
            searchStrategies = searchStrategies.map(s => `${s} ${currentYear}`);
            filterTags.push(currentYear);
        }
    }
    
    // Update subtitle with filters
    displaySubtitle = `${mood} mood${filterTags.length > 0 ? ' • ' + filterTags.join(' • ') : ' • Perfect songs for you'}`;
    
    // Update titles
    if (musicTitle) musicTitle.textContent = displayTitle;
    if (musicSubtitle) musicSubtitle.textContent = displaySubtitle;
    
    // Show section and loading state
    vibeMusicSection.classList.remove('hidden');
    musicLoading.classList.remove('hidden');
    musicGrid.innerHTML = '';
    
    // Initialize YouTube player
    initYouTubePlayer();
    
    // Use aggregate search with multiple strategies for better coverage
    console.log('═══════════════════════════════════════════════');
    console.log('🔍 MUSIC SEARCH STRATEGIES:');
    searchStrategies.forEach((s, i) => console.log(`   ${i + 1}. "${s}"`));
    console.log('═══════════════════════════════════════════════');
    
    try {
        // Use the first strategy as the primary query
        const primaryQuery = searchStrategies[0];
        const strategiesParam = encodeURIComponent(searchStrategies.join(','));
        
        // Call aggregate endpoint with all strategies to get at least 20 tracks
        console.log(`🎵 Requesting aggregated YouTube search with ${searchStrategies.length} strategies (targeting 20+ tracks)`);
        const ytResp = await fetch(`${YOUTUBE_PROXY_BASE}/aggregate-search?q=${encodeURIComponent(primaryQuery)}&limit=25&strategies=${strategiesParam}`);
        
        let youtubeTracks = [];
        if (!ytResp.ok) {
            console.warn('YouTube aggregate search failed:', ytResp.status);
        } else {
            const data = await ytResp.json();
            if (data && Array.isArray(data.items) && data.items.length > 0) {
                // Map items to simplified track objects
                const allTracks = data.items.map(item => {
                    const vid = item.id && (item.id.videoId || item.id);
                    return {
                        id: vid,
                        title: item.snippet?.title || 'Unknown',
                        channel: item.snippet?.channelTitle || 'Unknown',
                        thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url || '',
                        _yt_stats: item._yt_stats || {},
                        description: item.snippet?.description || ''
                    };
                });
                
                // ACCURACY IMPROVEMENT: Enhanced filtering for compilations, jukeboxes, playlists
                const excludePatterns = [
                    /jukebox/i,
                    /playlist/i,
                    /compilation/i,
                    /\bhits?\b/i,
                    /best of/i,
                    /top \d+/i,
                    /greatest/i,
                    /collection/i,
                    /\bmix\b/i,
                    /\bmashup/i,
                    /medley/i,
                    /\d{4}['']?s/i,
                    /throwback/i,
                    /oldies/i,
                    /classics?(?!\s+movie)/i,
                    /non.?stop/i,
                    /\b\d+\s*hour/i,
                    /\b\d+\s*minutes/i,
                    /full album/i,
                    /entire album/i,
                    /\bep\b/i,
                    /\blp\b/i,
                ];
                
                // ACCURACY IMPROVEMENT: Quality checks
                youtubeTracks = allTracks.filter(track => {
                    const title = track.title.toLowerCase();
                    const channel = track.channel.toLowerCase();
                    
                    // 1. Check exclude patterns
                    const isCompilation = excludePatterns.some(pattern => 
                        pattern.test(title) || pattern.test(channel)
                    );
                    
                    if (isCompilation) {
                        console.log(`   🚫 Filtered out (compilation): "${track.title}"`);
                        return false;
                    }
                    
                    // 2. ACCURACY: Must have good engagement (views/likes) - more lenient
                    const views = track._yt_stats?.viewCount || 0;
                    const likes = track._yt_stats?.likeCount || 0;
                    
                    // More lenient threshold for niche/regional content
                    if (views < 5000) {
                        console.log(`   🚫 Filtered out (low views: ${views}): "${track.title}"`);
                        return false;
                    }
                    
                    // 3. ACCURACY: Prefer official channels (VEVO, Topic, Official)
                    const isOfficialChannel = /vevo|topic|official|records|music|entertainment/i.test(channel);
                    const hasOfficialKeyword = /official|audio|video|lyrics?/i.test(title);
                    
                    // Calculate quality score
                    let qualityScore = 0;
                    if (isOfficialChannel) qualityScore += 30;
                    if (hasOfficialKeyword) qualityScore += 20;
                    if (views > 100000) qualityScore += 15; // Lowered from 1M
                    if (likes > 1000) qualityScore += 10; // Lowered from 10K
                    if (views > 1000000) qualityScore += 15;
                    if (views > 10000000) qualityScore += 10;
                    
                    track._qualityScore = qualityScore;
                    
                    // More lenient minimum quality score
                    if (qualityScore < 15) {
                        console.log(`   🚫 Filtered out (low quality score: ${qualityScore}): "${track.title}"`);
                        return false;
                    }
                    
                    return true;
                });
                
                // ACCURACY: Sort by quality score
                youtubeTracks.sort((a, b) => (b._qualityScore || 0) - (a._qualityScore || 0));
                
                console.log(`   ✅ After quality filtering: ${youtubeTracks.length} high-quality songs (removed ${allTracks.length - youtubeTracks.length})`);
                if (youtubeTracks.length > 0) {
                    console.log(`   🏆 Top song: "${youtubeTracks[0].title}" (score: ${youtubeTracks[0]._qualityScore})`);
                }
            }
        }
        
        console.log(`🎵 Aggregate search returned: ${youtubeTracks.length} tracks`);
        
        // If we still don't have enough tracks (less than 15), try a broader fallback
        if (youtubeTracks.length < 15) {
            console.log(`⚠️ Only ${youtubeTracks.length} tracks found, trying broader search...`);
            
            // Create a relaxed query - still focus on individual songs, not compilations
            const relaxedQuery = currentLanguage 
                ? `${baseKeywords} ${LANGUAGE_MUSIC_KEYWORDS[currentLanguage]} official song`
                : `${moodKeywords.genre} official music video`;
            
            const fallbackResp = await fetch(`${YOUTUBE_PROXY_BASE}/aggregate-search?q=${encodeURIComponent(relaxedQuery)}&limit=30`);
            if (fallbackResp.ok) {
                const fallbackData = await fallbackResp.json();
                if (fallbackData && Array.isArray(fallbackData.items)) {
                    const allFallbackTracks = fallbackData.items.map(item => ({
                        id: item.id && (item.id.videoId || item.id),
                        title: item.snippet?.title || 'Unknown',
                        channel: item.snippet?.channelTitle || 'Unknown',
                        thumbnail: item.snippet?.thumbnails?.high?.url || item.snippet?.thumbnails?.default?.url || '',
                        _yt_stats: item._yt_stats || {}
                    }));
                    
                    // Apply same filtering to fallback tracks
                    const excludePatterns = [
                        /jukebox/i, /playlist/i, /compilation/i, /\bhits?\b/i, /best of/i,
                        /top \d+/i, /greatest/i, /collection/i, /mix\b/i, /\bmashup/i,
                        /medley/i, /\d{4}['']?s/i, /throwback/i, /oldies/i,
                        /classics?(?!\s+movie)/i, /non.?stop/i, /hour/i, /minutes/i
                    ];
                    
                    const filteredFallback = allFallbackTracks.filter(track => {
                        const title = track.title.toLowerCase();
                        const channel = track.channel.toLowerCase();
                        return !excludePatterns.some(pattern => pattern.test(title) || pattern.test(channel));
                    });
                    
                    // Merge without duplicates
                    const existingIds = new Set(youtubeTracks.map(t => t.id));
                    const newTracks = filteredFallback.filter(t => !existingIds.has(t.id));
                    youtubeTracks = [...youtubeTracks, ...newTracks];
                    console.log(`   + Added ${newTracks.length} more individual songs from fallback (filtered ${allFallbackTracks.length - filteredFallback.length} compilations)`);
                }
            }
        }
        
        console.log(`✅ Final track count: ${youtubeTracks.length}`);
        
        if (youtubeTracks && youtubeTracks.length > 0) {
            console.log(`✅ Displaying ${youtubeTracks.length} YouTube Music tracks`);
            musicLoading.classList.add('hidden');
            
            // Transform tracks to the format expected by displayYouTubeMusicCards
            const transformedTracks = youtubeTracks.map(track => ({
                videoId: track.id,
                name: track.title || 'Unknown Track',
                artist: track.channel || 'Unknown Artist',
                image: track.thumbnail || 'https://via.placeholder.com/200x200/1DB954/ffffff?text=♪'
            }));
            
            displayYouTubeMusicCards(transformedTracks, musicGrid);
            
            // Initialize music toggle functionality
            initMusicToggle();
            
            // Show a message if we couldn't get many tracks
            if (youtubeTracks.length < 10) {
                const messageDiv = document.createElement('div');
                messageDiv.style.cssText = 'grid-column: 1/-1; text-align: center; padding: 20px; color: var(--text-secondary); font-size: 0.9rem;';
                messageDiv.innerHTML = `<p>📊 Found ${youtubeTracks.length} tracks for this combination. Try different filters for more variety!</p>`;
                musicGrid.appendChild(messageDiv);
            }
        } else {
            // No results found even after fallbacks - show curated playlist message
            console.warn('⚠️ No YouTube tracks available - API quota may be exceeded');
            musicLoading.classList.add('hidden');
            musicGrid.innerHTML = `
                <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">
                    <div style="background: rgba(255, 152, 0, 0.1); border: 2px solid rgba(255, 152, 0, 0.3); border-radius: 12px; padding: 30px; max-width: 600px; margin: 0 auto;">
                        <p style="font-size: 2rem; margin-bottom: 15px;">🎵</p>
                        <h3 style="color: var(--text-primary); margin-bottom: 10px; font-size: 1.2rem;">YouTube API Quota Exceeded</h3>
                        <p style="margin-bottom: 15px; line-height: 1.6;">
                            The YouTube API has reached its daily limit. Music recommendations will be available again tomorrow.
                        </p>
                        <div style="background: rgba(33, 150, 243, 0.1); border-left: 4px solid #2196F3; padding: 15px; border-radius: 8px; text-align: left; margin-top: 20px;">
                            <p style="font-weight: 600; margin-bottom: 12px;">💡 Listen to ${mood} Music Now:</p>
                            <div style="display: flex; gap: 10px; flex-wrap: wrap; margin-bottom: 12px;">
                                <a href="https://www.youtube.com/results?search_query=${encodeURIComponent(mood + ' music playlist')}" 
                                   target="_blank" 
                                   style="flex: 1; min-width: 140px; padding: 12px 16px; background: linear-gradient(135deg, #FF0000 0%, #CC0000 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; transition: transform 0.2s;"
                                   onmouseover="this.style.transform='scale(1.05)'" 
                                   onmouseout="this.style.transform='scale(1)'">
                                    <span style="font-size: 1.2rem;">▶️</span> YouTube
                                </a>
                                <a href="https://open.spotify.com/search/${encodeURIComponent(mood + ' music')}" 
                                   target="_blank" 
                                   style="flex: 1; min-width: 140px; padding: 12px 16px; background: linear-gradient(135deg, #1DB954 0%, #1AA34A 100%); color: white; text-decoration: none; border-radius: 8px; font-weight: 600; display: flex; align-items: center; justify-content: center; gap: 8px; transition: transform 0.2s;"
                                   onmouseover="this.style.transform='scale(1.05)'" 
                                   onmouseout="this.style.transform='scale(1)'">
                                    <span style="font-size: 1.2rem;">🎵</span> Spotify
                                </a>
                            </div>
                            <p style="font-size: 0.85rem; opacity: 0.8; margin: 0;">Or browse our curated movie recommendations below!</p>
                        </div>
                        <div style="margin-top: 20px; padding: 12px; background: rgba(0,0,0,0.2); border-radius: 8px;">
                            <p style="font-size: 0.85rem; opacity: 0.8;">
                                <strong>Developer Note:</strong> Update the API key in <code style="background: rgba(255,255,255,0.1); padding: 2px 6px; border-radius: 4px;">config.js</code> to restore music functionality.
                            </p>
                        </div>
                    </div>
                </div>
            `;
        }
    } catch (error) {
        console.error('❌ Error loading YouTube Music:', error);
        musicLoading.classList.add('hidden');
        musicGrid.innerHTML = `
            <div style="grid-column: 1/-1; text-align: center; padding: 40px; color: var(--text-secondary);">
                <div style="background: rgba(244, 67, 54, 0.1); border: 2px solid rgba(244, 67, 54, 0.3); border-radius: 12px; padding: 30px; max-width: 600px; margin: 0 auto;">
                    <p style="font-size: 2rem; margin-bottom: 15px;">⚠️</p>
                    <h3 style="color: var(--text-primary); margin-bottom: 10px; font-size: 1.2rem;">Music Loading Error</h3>
                    <p style="margin-bottom: 15px;">
                        Unable to load music recommendations. This could be due to:
                    </p>
                    <ul style="list-style: none; padding: 0; text-align: left; max-width: 400px; margin: 0 auto;">
                        <li style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">🔑 Invalid API key</li>
                        <li style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">📊 API quota exceeded</li>
                        <li style="padding: 8px 0; border-bottom: 1px solid rgba(255,255,255,0.1);">🌐 Network connection issue</li>
                        <li style="padding: 8px 0;">⚙️ Configuration error</li>
                    </ul>
                    <div style="margin-top: 20px; padding: 12px; background: rgba(0,0,0,0.2); border-radius: 8px;">
                        <p style="font-size: 0.85rem; opacity: 0.8;">
                            Check the browser console (F12) for detailed error information.
                        </p>
                    </div>
                </div>
            </div>
        `;
    }
}

/**
 * Generate curated song recommendations based on mood and language
 */
function generateCuratedSongs(mood, language, genre) {
    const songs = [];
    const moodConfig = MOOD_MAPPINGS[mood];
    
    // Curated song database (expandable)
    // Note: Most songs will come from Spotify API which includes preview_url
    // These are fallbacks when Spotify API fails
    const songDatabase = {
        'Happy-en': [
            { name: 'Happy', artist: 'Pharrell Williams', year: 2013, image: 'https://i.scdn.co/image/ab67616d0000b273e7a5e64', spotifyUrl: 'https://open.spotify.com/track/60nZcImufyMA1MKQY3dcCH' },
            { name: 'Good Vibrations', artist: 'The Beach Boys', year: 1966, image: 'https://i.scdn.co/image/ab67616d0000b273e8b066', spotifyUrl: 'https://open.spotify.com/track/3FPNjt7P20EkFqfNTeztoS' },
            { name: 'Walking on Sunshine', artist: 'Katrina and the Waves', year: 1983, image: 'https://i.scdn.co/image/ab67616d0000b273d4e1c3', spotifyUrl: 'https://open.spotify.com/track/05wIrZSwuaVWhcv5FfqeH0' },
            { name: 'Uptown Funk', artist: 'Mark Ronson ft. Bruno Mars', year: 2014, image: 'https://i.scdn.co/image/ab67616d0000b273e1e42a', spotifyUrl: 'https://open.spotify.com/track/32OlwWuMpZ6b0aN2RZOeMS' },
        ],
        'Happy-hi': [
            { name: 'Koi Mil Gaya', artist: 'Vishal-Shekhar', year: 2008, image: 'https://i.scdn.co/image/ab67616d0000b273a4e7b0' },
            { name: 'Badtameez Dil', artist: 'Pritam', year: 2013, image: 'https://i.scdn.co/image/ab67616d0000b273b3c9d2' },
            { name: 'Gallan Goodiyan', artist: 'Yash Raj Films', year: 2014, image: 'https://i.scdn.co/image/ab67616d0000b273c5e8f1' },
        ],
        'Sad-en': [
            { name: 'Someone Like You', artist: 'Adele', year: 2011, image: 'https://i.scdn.co/image/ab67616d0000b273f4d2b7' },
            { name: 'Let It Be', artist: 'The Beatles', year: 1970, image: 'https://i.scdn.co/image/ab67616d0000b273e3e9f5' },
            { name: 'Fix You', artist: 'Coldplay', year: 2005, image: 'https://i.scdn.co/image/ab67616d0000b273d1d3a2' },
        ],
        'Romantic-en': [
            { name: 'Perfect', artist: 'Ed Sheeran', year: 2017, image: 'https://i.scdn.co/image/ab67616d0000b273ba5db4' },
            { name: 'Thinking Out Loud', artist: 'Ed Sheeran', year: 2014, image: 'https://i.scdn.co/image/ab67616d0000b273c8b444' },
            { name: 'All of Me', artist: 'John Legend', year: 2013, image: 'https://i.scdn.co/image/ab67616d0000b273e3f1b6' },
        ],
        'Action-en': [
            { name: 'Eye of the Tiger', artist: 'Survivor', year: 1982, image: 'https://i.scdn.co/image/ab67616d0000b273a5e1c4' },
            { name: 'Thunder', artist: 'Imagine Dragons', year: 2017, image: 'https://i.scdn.co/image/ab67616d0000b273b4e7c3' },
            { name: 'Believer', artist: 'Imagine Dragons', year: 2017, image: 'https://i.scdn.co/image/ab67616d0000b273f3d1a2' },
        ],
    };
    
    // Build key for song lookup
    const langKey = language || 'en';
    const lookupKey = `${mood}-${langKey}`;
    
    // Get songs from database or generate generic ones
    if (songDatabase[lookupKey]) {
        songs.push(...songDatabase[lookupKey]);
    } else {
        // Generate generic song recommendations
        const genericSongs = [
            { name: `${mood} Vibes`, artist: 'Mood Playlist', year: 2024, image: 'https://via.placeholder.com/300x300/' + moodConfig.color.replace('#', '') + '/ffffff?text=' + mood },
            { name: `${genre} Mix`, artist: 'Curated Collection', year: 2024, image: 'https://via.placeholder.com/300x300/' + moodConfig.color.replace('#', '') + '/ffffff?text=' + genre },
            { name: `Best of ${mood}`, artist: 'Top Hits', year: 2024, image: 'https://via.placeholder.com/300x300/' + moodConfig.color.replace('#', '') + '/ffffff?text=Best' },
        ];
        songs.push(...genericSongs);
    }
    
    return songs;
}

/**
 * Display song recommendations in the grid
 */
function displaySongRecommendations(songs, container) {
    if (!songs || songs.length === 0) {
        container.innerHTML = `
            <div class="no-songs-message">
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                    <circle cx="5.5" cy="17.5" r="2.5"/>
                    <circle cx="17.5" cy="15.5" r="2.5"/>
                    <path d="M8 17V5l12-2v12"/>
                </svg>
                <p>No songs found for this mood. Try a different selection!</p>
            </div>
        `;
        return;
    }
    
    // Store songs globally for playback
    window.currentSongList = songs;
    
    container.innerHTML = songs.map((song, index) => {
        const previewUrl = song.previewUrl || song.preview_url || null;
        const spotifyUrl = song.spotifyUrl || song.spotify_url || `https://open.spotify.com/search/${encodeURIComponent(song.name + ' ' + song.artist)}`;
        const songId = song.id || index;
        
        return `
        <div class="song-card" data-song-index="${index}" data-song-id="${songId}" data-song-name="${song.name.replace(/"/g, '&quot;')}" data-song-artist="${song.artist.replace(/"/g, '&quot;')}" style="animation-delay: ${index * 0.1}s;">
            <img src="${song.image}" alt="${song.name}" class="song-cover" onerror="this.src='https://via.placeholder.com/80x80/1ed760/ffffff?text=♪'">
            <div class="song-info">
                <h4 class="song-name">${song.name}</h4>
                <p class="song-artist">${song.artist} • ${song.year}</p>
                <div class="song-actions">
                    <button class="song-play-btn" onclick="playSongPreview(${index})" data-song-index="${index}" data-playing="false" title="${previewUrl ? 'Play 30s Spotify preview' : 'Play full song in-app'}">
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="play-icon">
                            <path d="M12 3v10.55c-.59-.34-1.27-.55-2-.55-2.21 0-4 1.79-4 4s1.79 4 4 4 4-1.79 4-4V7h4V3h-6z"/>
                        </svg>
                        <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" class="pause-icon" style="display: none;">
                            <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                        </svg>
                        <span class="play-text">${previewUrl ? 'Preview (30s)' : 'Play Full Song'}</span>
                    </button>
                    <button class="song-spotify-btn" onclick="window.open('${spotifyUrl}', '_blank')" title="Open in Spotify">
                        <svg viewBox="0 0 24 24" fill="currentColor">
                            <path d="M12 0C5.4 0 0 5.4 0 12s5.4 12 12 12 12-5.4 12-12S18.66 0 12 0zm5.521 17.34c-.24.359-.66.48-1.021.24-2.82-1.74-6.36-2.101-10.561-1.141-.418.122-.779-.179-.899-.539-.12-.421.18-.78.54-.9 4.56-1.021 8.52-.6 11.64 1.32.42.18.479.659.301 1.02zm1.44-3.3c-.301.42-.841.6-1.262.3-3.239-1.98-8.159-2.58-11.939-1.38-.479.12-1.02-.12-1.14-.6-.12-.48.12-1.021.6-1.141C9.6 9.9 15 10.561 18.72 12.84c.361.181.54.78.241 1.2zm.12-3.36C15.24 8.4 8.82 8.16 5.16 9.301c-.6.179-1.2-.181-1.38-.721-.18-.601.18-1.2.72-1.381 4.26-1.26 11.28-1.02 15.721 1.621.539.3.719 1.02.419 1.56-.299.421-1.02.599-1.559.3z"/>
                        </svg>
                        Spotify
                    </button>
                </div>
            </div>
        </div>
    `}).join('');
}

// ==================== MUSIC PLAYER BAR ====================

// Audio player state
let currentAudio = null;
let currentPlayingButton = null;
let currentPlaylist = [];
let currentTrackIndex = -1;
let currentTrackData = null;

/**
 * Initialize music player controls
 */
// OLD SPOTIFY PLAYER - No longer used (replaced with YouTube Music Player)
// Kept for reference only - all controls now handled by YouTube player
function initMusicPlayer_OLD_DEPRECATED() {
    // This function is deprecated and no longer used
    // All music player controls are now handled by initYouTubeMusicPlayerControls()
    console.log('⚠️ Old Spotify player deprecated - using YouTube Music Player');
}

/**
 * Play a song in the music player bar
 */
window.playSongPreview = function(songIndex) {
    if (!window.currentSongList || !window.currentSongList[songIndex]) {
        console.error('Song not found');
        return;
    }
    
    const song = window.currentSongList[songIndex];
    const buttonElement = document.querySelector(`button[data-song-index="${songIndex}"]`);
    
    const songData = {
        id: song.id || songIndex,
        name: song.name,
        artist: song.artist,
        image: song.image,
        previewUrl: song.previewUrl || song.preview_url,
        spotifyUrl: song.spotifyUrl || song.spotify_url || `https://open.spotify.com/search/${encodeURIComponent(song.name + ' ' + song.artist)}`,
        index: songIndex
    };
    
    console.log('▶️ Play song clicked:', songData.name, 'Has preview:', !!songData.previewUrl);
    
    // If clicking the same song, toggle play/pause
    if (currentAudio && currentTrackData?.index === songIndex) {
        if (currentAudio.paused) {
            currentAudio.play().catch(err => {
                console.error('Resume playback error:', err);
            });
        } else {
            currentAudio.pause();
        }
        return;
    }
    
    // Stop current audio
    if (currentAudio) {
        currentAudio.pause();
        if (currentPlayingButton) {
            updatePlayButton(currentPlayingButton, false);
        }
    }
    
    // If no preview URL, use YouTube fallback
    if (!songData.previewUrl) {
        console.log('🎵 No Spotify preview - using YouTube for full song:', songData.name);
        showToast(`🎵 Loading full song: ${songData.name}`, 'info', 2000);
        
        // Try YouTube playback
        playYouTubeSong(songIndex);
        return;
    }
    
    // Load new track with Spotify preview
    console.log('🎵 Loading Spotify preview (30s):', songData.name);
    loadTrackInPlayer(songData, buttonElement);
};

// OLD playYouTubeSong function REMOVED - using new YouTube Music Player implementation above

/**
 * Load Spotify embed as fallback when preview is not available
 */
function loadSpotifyEmbed(songData, buttonElement) {
    console.log('Loading Spotify embed for:', songData.name);
    
    currentTrackData = songData;
    currentPlayingButton = buttonElement;
    
    // Update player UI
    const playerThumbnail = document.getElementById('playerThumbnail');
    const playerSongName = document.getElementById('playerSongName');
    const playerArtistName = document.getElementById('playerArtistName');
    
    if (playerThumbnail) playerThumbnail.src = songData.image;
    if (playerSongName) playerSongName.textContent = songData.name;
    if (playerArtistName) playerArtistName.textContent = songData.artist + ' (Spotify Player)';
    
    // Show player bar with Spotify embed
    const playerBar = document.getElementById('musicPlayerBar');
    if (playerBar) {
        playerBar.classList.remove('hidden');
    }
    
    // Create Spotify iframe embed
    const spotifyTrackId = songData.id;
    const embedUrl = `https://open.spotify.com/embed/track/${spotifyTrackId}`;
    
    // Show notification that it's using Spotify embed
    alert(`Playing full song via Spotify embed. You may need to login to Spotify for full playback.`);
    
    // Open Spotify player (since embed requires premium and authentication)
    window.open(songData.spotifyUrl, '_blank');
}

/**
 * Load a track into the player
 */
function loadTrackInPlayer(songData, buttonElement) {
    // Check if preview URL exists
    if (!songData.previewUrl) {
        console.error('No preview URL available for this song');
        loadSpotifyEmbed(songData, buttonElement);
        return;
    }
    
    currentTrackData = songData;
    currentPlayingButton = buttonElement;
    
    // Update player UI
    const playerThumbnail = document.getElementById('playerThumbnail');
    const playerSongName = document.getElementById('playerSongName');
    const playerArtistName = document.getElementById('playerArtistName');
    
    if (playerThumbnail) playerThumbnail.src = songData.image;
    if (playerSongName) playerSongName.textContent = songData.name;
    if (playerArtistName) playerArtistName.textContent = songData.artist;
    
    // Show player bar
    const playerBar = document.getElementById('musicPlayerBar');
    if (playerBar) {
        playerBar.classList.remove('hidden');
        console.log('Player bar shown');
    }
    
    // Create audio element
    try {
        currentAudio = new Audio(songData.previewUrl);
        currentAudio.volume = document.getElementById('playerVolumeSlider')?.value / 100 || 0.7;
        
        console.log('Loading track:', songData.name, 'Preview URL:', songData.previewUrl);
        
        // Update button state
        if (buttonElement) {
            updatePlayButton(buttonElement, true);
        }
        
        // Audio event listeners
        currentAudio.addEventListener('loadedmetadata', () => {
            console.log('Audio metadata loaded, duration:', currentAudio.duration);
            updatePlayerDuration();
        });
        
        currentAudio.addEventListener('timeupdate', () => {
            updatePlayerProgress();
        });
        
        currentAudio.addEventListener('play', () => {
            console.log('Audio playing');
            updatePlayerPlayPauseButton(true);
            if (currentPlayingButton) {
                updatePlayButton(currentPlayingButton, true);
            }
        });
        
        currentAudio.addEventListener('pause', () => {
            console.log('Audio paused');
            updatePlayerPlayPauseButton(false);
            if (currentPlayingButton) {
                updatePlayButton(currentPlayingButton, false);
            }
        });
        
        currentAudio.addEventListener('ended', () => {
            console.log('Audio ended, playing next track');
            playNextTrack();
        });
        
        currentAudio.addEventListener('error', (e) => {
            console.error('Audio loading error:', e);
            alert('Could not play this song preview. It may not be available in your region or the preview link has expired.');
            if (currentPlayingButton) {
                updatePlayButton(currentPlayingButton, false);
            }
            // Hide player bar on error
            if (playerBar) {
                playerBar.classList.add('hidden');
            }
        });
        
        // Play the track
        currentAudio.play()
            .then(() => {
                console.log('Playback started successfully');
                showToast(`Now playing: ${songData.name}`, 'music', 2500);
            })
            .catch(error => {
                console.error('Playback error:', error);
                showToast('Could not start playback. Preview may not be available.', 'error', 3500);
                if (currentPlayingButton) {
                    updatePlayButton(currentPlayingButton, false);
                }
            });
    } catch (error) {
        console.error('Error creating audio element:', error);
        showToast('Failed to create audio player. Please try again.', 'error');
    }
}

/**
 * Update player progress bar
 */
function updatePlayerProgress() {
    if (!currentAudio) return;
    
    const percent = (currentAudio.currentTime / currentAudio.duration) * 100 || 0;
    const fill = document.getElementById('playerProgressFill');
    const thumb = document.getElementById('playerProgressThumb');
    const currentTime = document.getElementById('playerCurrentTime');
    
    if (fill) fill.style.width = `${percent}%`;
    if (thumb) thumb.style.left = `${percent}%`;
    if (currentTime) currentTime.textContent = formatTime(currentAudio.currentTime);
}

/**
 * Update player duration display
 */
function updatePlayerDuration() {
    if (!currentAudio) return;
    
    const duration = document.getElementById('playerDuration');
    if (duration) {
        duration.textContent = formatTime(currentAudio.duration);
    }
}

/**
 * Update player play/pause button
 */
function updatePlayerPlayPauseButton(isPlaying) {
    const btn = document.getElementById('playerPlayPauseBtn');
    if (!btn) return;
    
    const svg = btn.querySelector('svg path');
    if (isPlaying) {
        svg.setAttribute('d', 'M6 4h4v16H6V4zm8 0h4v16h-4V4z');
    } else {
        svg.setAttribute('d', 'M8 5v14l11-7z');
    }
}

/**
 * Play next track
 */
function playNextTrack() {
    if (!window.currentSongList || window.currentSongList.length === 0) return;
    
    const currentIndex = currentTrackData?.index || 0;
    const nextIndex = (currentIndex + 1) % window.currentSongList.length;
    
    // Find next song with preview
    let attempts = 0;
    let indexToPlay = nextIndex;
    
    while (attempts < window.currentSongList.length) {
        const song = window.currentSongList[indexToPlay];
        if (song.previewUrl || song.preview_url) {
            playSongPreview(indexToPlay);
            return;
        }
        indexToPlay = (indexToPlay + 1) % window.currentSongList.length;
        attempts++;
    }
    
    console.log('No more songs with preview available');
}

/**
 * Play previous track
 */
function playPreviousTrack() {
    if (!window.currentSongList || window.currentSongList.length === 0) return;
    
    const currentIndex = currentTrackData?.index || 0;
    const prevIndex = currentIndex <= 0 ? window.currentSongList.length - 1 : currentIndex - 1;
    
    // Find previous song with preview
    let attempts = 0;
    let indexToPlay = prevIndex;
    
    while (attempts < window.currentSongList.length) {
        const song = window.currentSongList[indexToPlay];
        if (song.previewUrl || song.preview_url) {
            playSongPreview(indexToPlay);
            return;
        }
        indexToPlay = indexToPlay <= 0 ? window.currentSongList.length - 1 : indexToPlay - 1;
        attempts++;
    }
    
    console.log('No previous songs with preview available');
}

/**
 * Format time in MM:SS
 */
function formatTime(seconds) {
    if (!seconds || isNaN(seconds)) return '0:00';
    const mins = Math.floor(seconds / 60);
    const secs = Math.floor(seconds % 60);
    return `${mins}:${secs.toString().padStart(2, '0')}`;
}

/**
 * Update play/pause button state in song card
 */
function updatePlayButton(button, isPlaying) {
    if (!button) return;
    
    const playIcon = button.querySelector('.play-icon');
    const pauseIcon = button.querySelector('.pause-icon');
    const playText = button.querySelector('.play-text');
    
    button.dataset.playing = isPlaying;
    
    if (isPlaying) {
        // Show pause icon
        if (playIcon) playIcon.style.display = 'none';
        if (pauseIcon) pauseIcon.style.display = 'block';
        if (playText) playText.textContent = 'Pause';
        button.classList.add('playing');
    } else {
        // Show play icon
        if (playIcon) playIcon.style.display = 'block';
        if (pauseIcon) pauseIcon.style.display = 'none';
        if (playText) playText.textContent = 'Play';
        button.classList.remove('playing');
    }
}

/**
 * Initialize music recommendations toggle functionality
 */
function initMusicToggle() {
    const musicToggleBtn = document.getElementById('musicToggleBtn');
    const musicContainer = document.getElementById('musicRecommendationsContainer');
    const vibeMusicHeader = document.querySelector('.vibe-music-header');
    
    if (!musicToggleBtn || !musicContainer) return;
    
    // Remove existing listeners to prevent duplicates
    const newMusicToggleBtn = musicToggleBtn.cloneNode(true);
    musicToggleBtn.parentNode.replaceChild(newMusicToggleBtn, musicToggleBtn);
    
    const newVibeMusicHeader = vibeMusicHeader.cloneNode(true);
    vibeMusicHeader.parentNode.replaceChild(newVibeMusicHeader, vibeMusicHeader);
    
    // Add click handler to toggle button
    newMusicToggleBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleMusicRecommendations();
    });
    
    // Add click handler to header
    newVibeMusicHeader.addEventListener('click', () => {
        toggleMusicRecommendations();
    });
}

/**
 * Toggle music recommendations visibility
 */
function toggleMusicRecommendations() {
    const musicContainer = document.getElementById('musicRecommendationsContainer');
    const musicToggleBtn = document.getElementById('musicToggleBtn');
    
    if (musicContainer && musicToggleBtn) {
        const isCollapsed = musicContainer.classList.contains('collapsed');
        
        musicContainer.classList.toggle('collapsed');
        musicToggleBtn.classList.toggle('collapsed');
        
        console.log(`🎵 Music section ${isCollapsed ? 'expanded' : 'collapsed'}`);
    } else {
        console.error('❌ Music toggle elements not found:', {
            musicContainer: !!musicContainer,
            musicToggleBtn: !!musicToggleBtn
        });
    }
}

// ==================== STREAMING AVAILABILITY PULSE FUNCTIONS ====================

/**
 * Fetch streaming availability for a movie
 */
async function fetchStreamingAvailability(movieId) {
    if (streamingDataCache[movieId]) {
        return streamingDataCache[movieId];
    }
    
    try {
    const url = `${TMDB_PROXY_BASE}/movie/${movieId}/watch/providers`;
    const response = await fetch(url);
        const data = await response.json();
        
        // Get data for India region (or fallback to first available)
        const providers = data.results?.IN?.flatrate || data.results?.US?.flatrate || [];
        
        streamingDataCache[movieId] = providers;
        return providers;
    } catch (error) {
        console.error('Error fetching streaming data:', error);
        return [];
    }
}

/**
 * Create streaming availability pulse UI
 */
function createStreamingPulseHTML(providers) {
    if (!providers || providers.length === 0) {
        return '<div style="font-size: 0.75rem; color: var(--text-tertiary); padding: 8px;">Not available</div>';
    }
    
    // Sort by priority
    const sortedProviders = providers.sort((a, b) => {
        const priorityA = STREAMING_PLATFORMS[a.provider_id]?.priority || 999;
        const priorityB = STREAMING_PLATFORMS[b.provider_id]?.priority || 999;
        return priorityA - priorityB;
    });
    
    return sortedProviders.map(provider => {
        const platform = STREAMING_PLATFORMS[provider.provider_id];
        if (!platform) return '';
        
        const glowIntensity = Math.min(100, 30 + (providers.length * 15));
        
        return `
            <div class="streaming-icon" 
                 style="--platform-color: ${platform.color}; 
                        box-shadow: 0 0 ${glowIntensity}px ${platform.color};"
                 title="${platform.name}">
                ${platform.icon}
                <div class="streaming-tooltip">${platform.name}</div>
            </div>
        `;
    }).join('');
}

/**
 * Add streaming indicators to movie card (on hover)
 */
function addStreamingIndicators(movieCard, movieId) {
    let streamingContainer = movieCard.querySelector('.streaming-pulse-container');
    
    if (!streamingContainer) {
        streamingContainer = document.createElement('div');
        streamingContainer.className = 'streaming-pulse-container';
        streamingContainer.innerHTML = '<div class="loading-spinner" style="width: 20px; height: 20px;"></div>';
        movieCard.style.position = 'relative';
        movieCard.appendChild(streamingContainer);
    }
    
    // Fetch and update
    fetchStreamingAvailability(movieId).then(providers => {
        streamingContainer.innerHTML = createStreamingPulseHTML(providers);
    });
}

// ==================== INTEGRATION WITH EXISTING DISPLAY ====================

/**
 * Enhanced version of displayMovies that includes streaming indicators
 */
function displayMoviesWithStreaming(movies) {
    resultsCount.textContent = `${movies.length} of ${allMovies.length} movies`;
    
    if (movies.length === 0) {
        moviesGrid.innerHTML = '<p style="text-align: center; color: var(--text-secondary); padding: 60px 20px; font-size: 1.1rem;">No movies found. Try different filters!</p>';
        return;
    }

    moviesGrid.innerHTML = movies.map((movie, index) => createMovieCard(movie, index)).join('');
    attachMovieEventListenersWithStreaming();
}

/**
 * Enhanced event listener attachment with streaming support
 */
function attachMovieEventListenersWithStreaming() {
    // Original listeners
    attachMovieEventListeners();
    
    // Add streaming hover indicators
    document.querySelectorAll('.movie-card').forEach(card => {
        const movieId = card.dataset.movieId;
        
        card.addEventListener('mouseenter', () => {
            addStreamingIndicators(card, movieId);
        });
    });
}

// ==================== UI TOGGLES ====================

/**
 * Toggle to show vibe map
 */
function showVibeMap() {
    vibeMapSection.classList.remove('hidden');
    searchSection.classList.add('hidden');
    resultsSection.classList.add('hidden');
    
    // Only initialize on first open
    if (!vibeMapInitialized) {
        initializeVibeMap();
        vibeMapInitialized = true;
    } else {
        // On subsequent opens, just make sure orbs are visible
        const orbs = document.querySelectorAll('.vibe-orb');
        orbs.forEach(orb => {
            orb.style.opacity = '1';
            orb.style.transform = 'scale(1) translateY(0)';
        });
    }
    
    // Restore previously selected mood if exists
    if (vibeMapSelectedMood) {
        const selectedOrb = document.querySelector(`[data-mood="${vibeMapSelectedMood}"]`);
        if (selectedOrb) {
            selectedOrb.classList.add('selected');
            selectedOrb.style.transform = 'scale(1.15)';
        }
        
        // Restore mood aesthetic
        morphUIToMood(vibeMapSelectedMood);
    }
}

// Initialize app
try {
    console.log('🔧 Starting app initialization...');
    init();
    console.log('✅ App initialization complete');
} catch (error) {
    console.error('❌ App initialization failed:', error);
    console.error('Stack trace:', error.stack);
    
    // ALWAYS remove splash screen even if there's an error
    const splashScreen = document.getElementById('splashScreen');
    if (splashScreen) {
        console.log('🔴 Removing splash screen due to error');
        splashScreen.style.opacity = '0';
        splashScreen.style.display = 'none';
    }
    
    // Show error message to user
    document.body.innerHTML += `
        <div style="position: fixed; top: 50%; left: 50%; transform: translate(-50%, -50%); 
                    background: rgba(239, 68, 68, 0.95); color: white; padding: 30px; 
                    border-radius: 16px; max-width: 500px; text-align: center; z-index: 999999;">
            <h2 style="margin: 0 0 15px 0;">⚠️ Initialization Error</h2>
            <p style="margin: 0 0 10px 0;">The app failed to initialize. Check the console for details.</p>
            <button onclick="location.reload()" style="background: white; color: #ef4444; border: none; 
                    padding: 10px 20px; border-radius: 8px; cursor: pointer; font-weight: bold; margin-top: 10px;">
                Reload Page
            </button>
        </div>
    `;
}