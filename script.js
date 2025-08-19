// Initialize application when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    // Initialize Feather icons
    feather.replace();
    
    // Initialize theme from localStorage
    const savedTheme = localStorage.getItem('mockcraft-theme') || 'light';
    if (document.documentElement) {
        document.documentElement.setAttribute('data-theme', savedTheme);
    }
    updateThemeToggle(savedTheme);
    
    // Initialize landing page functionality
    initializeLandingPage();
    
    // Initialize main app functionality
    initializeMainApp();
});

// Landing page functionality
function initializeLandingPage() {
    const startBtn = document.getElementById('startBtn');
    const backToLanding = document.getElementById('backToLanding');
    const landingPage = document.getElementById('landingPage');
    const mainApp = document.getElementById('mainApp');
    
    if (startBtn) {
        startBtn.addEventListener('click', function() {
            landingPage.classList.add('hidden');
            mainApp.classList.remove('hidden');
            
            // Initialize the mockup generator after showing main app
            setTimeout(() => {
                if (!window.mockupApp) {
                    window.mockupApp = new MockupGenerator();
                }
            }, 100);
        });
    }
    
    if (backToLanding) {
        backToLanding.addEventListener('click', function() {
            mainApp.classList.add('hidden');
            landingPage.classList.remove('hidden');
        });
    }
}

// Main app functionality
function initializeMainApp() {
    // Theme toggle
    const themeToggle = document.getElementById('themeToggle');
    if (themeToggle) {
        themeToggle.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme');
            const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
            
            document.documentElement.setAttribute('data-theme', newTheme);
            localStorage.setItem('mockcraft-theme', newTheme);
            updateThemeToggle(newTheme);
            
            // Update Prism theme
            const prismTheme = document.getElementById('prism-theme');
            if (prismTheme) {
                if (newTheme === 'dark') {
                    prismTheme.href = 'https://cdn.jsdelivr.net/npm/prism-themes@1.9.0/themes/prism-vsc-dark-plus.min.css';
                } else {
                    prismTheme.href = 'https://cdn.jsdelivr.net/npm/prism-themes@1.9.0/themes/prism-vs.min.css';
                }
            }
        });
    }
    
    // Sidebar collapse
    const collapseBtn = document.getElementById('collapseToolbar');
    const sidebar = document.getElementById('sidebar');
    const main = document.querySelector('.main');
    
    if (collapseBtn && sidebar && main) {
        collapseBtn.addEventListener('click', function() {
            sidebar.classList.toggle('collapsed');
            main.classList.toggle('collapsed');
            
            const icon = collapseBtn.querySelector('i');
            const text = collapseBtn.querySelector('span');
            
            if (sidebar.classList.contains('collapsed')) {
                icon.setAttribute('data-feather', 'sidebar');
                text.textContent = 'Expand';
            } else {
                icon.setAttribute('data-feather', 'sidebar');
                text.textContent = 'Collapse';
            }
            
            feather.replace();
        });
    }
}

// Theme management
function updateThemeToggle(theme) {
    const themeToggle = document.getElementById('themeToggle');
    if (!themeToggle) return;
    
    const icon = themeToggle.querySelector('i');
    const text = themeToggle.querySelector('span');
    
    if (icon && text) {
        if (theme === 'dark') {
            icon.setAttribute('data-feather', 'moon');
            text.textContent = 'Dark';
        } else {
            icon.setAttribute('data-feather', 'sun');
            text.textContent = 'Light';
        }
        
        feather.replace();
    }
}

// Utility functions
function showToast(message, type = 'info', duration = 3000) {
    const toastContainer = document.getElementById('toastContainer');
    if (!toastContainer) return;
    
    const toast = document.createElement('div');
    toast.className = `toast ${type}`;
    toast.textContent = message;
    
    toastContainer.appendChild(toast);
    
    setTimeout(() => {
        if (toast.parentNode) {
            toast.remove();
        }
    }, duration);
}

function showLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.remove('hidden');
    }
}

function hideLoading() {
    const loadingOverlay = document.getElementById('loadingOverlay');
    if (loadingOverlay) {
        loadingOverlay.classList.add('hidden');
    }
}

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + E for PNG export
    if ((e.ctrlKey || e.metaKey) && e.key === 'e') {
        e.preventDefault();
        if (window.mockupApp && window.mockupApp.exportManager) {
            window.mockupApp.exportManager.exportPNG();
        }
    }
    
    // Ctrl/Cmd + S for SVG export
    if ((e.ctrlKey || e.metaKey) && e.key === 's') {
        e.preventDefault();
        if (window.mockupApp && window.mockupApp.exportManager) {
            window.mockupApp.exportManager.exportSVG();
        }
    }
    
    // Ctrl/Cmd + D for PDF export
    if ((e.ctrlKey || e.metaKey) && e.key === 'd') {
        e.preventDefault();
        if (window.mockupApp && window.mockupApp.exportManager) {
            window.mockupApp.exportManager.exportPDF();
        }
    }
    
    // Ctrl/Cmd + T for theme toggle
    if ((e.ctrlKey || e.metaKey) && e.key === 't') {
        e.preventDefault();
        const themeToggle = document.getElementById('themeToggle');
        if (themeToggle) {
            themeToggle.click();
        }
    }
    
    // ESC to show/hide sidebar
    if (e.key === 'Escape') {
        const collapseBtn = document.getElementById('collapseToolbar');
        if (collapseBtn) {
            collapseBtn.click();
        }
    }
});

// Auto-save functionality
let autoSaveTimeout;
function autoSave() {
    clearTimeout(autoSaveTimeout);
    autoSaveTimeout = setTimeout(() => {
        if (window.mockupApp && typeof window.mockupApp.saveState === 'function') {
            window.mockupApp.saveState();
        }
    }, 1000);
}

// Add auto-save listeners to inputs
document.addEventListener('input', autoSave);
document.addEventListener('change', autoSave);

// Smooth scrolling for landing page
document.addEventListener('click', function(e) {
    if (e.target.matches('a[href^="#"]')) {
        e.preventDefault();
        const target = document.querySelector(e.target.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
});

// Handle window resize
window.addEventListener('resize', function() {
    if (window.mockupApp && typeof window.mockupApp.handleResize === 'function') {
        window.mockupApp.handleResize();
    }
});

// Initialize Prism.js configuration
if (typeof Prism !== 'undefined') {
    Prism.plugins.autoloader.languages_path = 'https://cdn.jsdelivr.net/npm/prismjs@1.29.0/components/';
}