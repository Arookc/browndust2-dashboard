// BD2 Hub - Brown Dust 2 Dashboard JavaScript

document.addEventListener('DOMContentLoaded', function() {
    // Initialize all functionality
    initTabSwitching();
    initTierListToggle();
    initSearch();
    initCopyLink();
    initShareFeatures();
    initBannerCountdown();
    updateCurrentDate();
    initLastUpdated();
    initKeyboardShortcuts();
    
    console.log('BD2 Hub - Brown Dust 2 Dashboard initialized successfully');
});

// Tab Switching Functionality
function initTabSwitching() {
    const navTabs = document.querySelectorAll('.nav-tab');
    const tabContents = document.querySelectorAll('.tab-content');

    navTabs.forEach(tab => {
        tab.addEventListener('click', function() {
            const targetTab = this.getAttribute('data-tab');
            
            // Remove active class from all tabs and contents
            navTabs.forEach(t => t.classList.remove('active'));
            tabContents.forEach(content => content.classList.remove('active'));
            
            // Add active class to clicked tab and corresponding content
            this.classList.add('active');
            document.getElementById(targetTab).classList.add('active');
            
            // Track tab change
            trackEvent('bd2_tab_change', { tab: targetTab });
        });
    });
}

// Tier List Toggle Functionality
function initTierListToggle() {
    const tierToggles = document.querySelectorAll('.tier-toggle');
    
    tierToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            const tierName = this.getAttribute('data-tier');
            const tierContent = document.getElementById(tierName + '-tier');
            
            if (tierContent) {
                // Toggle the active class
                tierContent.classList.toggle('active');
                
                // Update button appearance
                if (tierContent.classList.contains('active')) {
                    this.style.background = 'var(--color-secondary)';
                    this.style.transform = 'scale(1.02)';
                } else {
                    this.style.background = 'var(--gradient-secondary)';
                    this.style.transform = 'scale(1)';
                }
                
                // Track tier expansion
                trackEvent('bd2_tier_toggle', { 
                    tier: tierName, 
                    expanded: tierContent.classList.contains('active') 
                });
            }
        });
    });
}

// Enhanced Share Features
function initShareFeatures() {
    const shareBtn = document.getElementById('shareBtn');
    const shareBtns = document.querySelectorAll('.share-btn');
    
    // Main share button
    if (shareBtn) {
        shareBtn.addEventListener('click', function() {
            showShareOptions();
        });
    }
    
    // Share method buttons
    shareBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const method = this.getAttribute('data-method');
            handleShare(method);
        });
    });
}

function showShareOptions() {
    // Scroll to share section
    const shareSection = document.querySelector('.quick-share-section');
    if (shareSection) {
        shareSection.scrollIntoView({ behavior: 'smooth', block: 'center' });
        
        // Add temporary highlight effect
        shareSection.style.border = '2px solid var(--color-bd2-gold)';
        shareSection.style.boxShadow = '0 0 20px rgba(251, 191, 36, 0.3)';
        
        setTimeout(() => {
            shareSection.style.border = '1px solid var(--color-card-border)';
            shareSection.style.boxShadow = '0 4px 20px rgba(0, 0, 0, 0.2)';
        }, 2000);
    }
}

function handleShare(method) {
    const currentUrl = window.location.href;
    const shareText = 'Check out BD2 Hub - the permanent Brown Dust 2 resource center with all characters, guides, and banners!';
    const title = 'BD2 Hub - Brown Dust 2 Resource Center';
    
    switch (method) {
        case 'copy':
            copyToClipboard(currentUrl, 'BD2 Hub link copied! Share it with your friends.');
            break;
            
        case 'discord':
            const discordText = `🛡️ **${title}**\n${shareText}\n\n🔗 ${currentUrl}\n\n✓ Permanent link - bookmark it!\n🎯 All BD2 resources in one place`;
            copyToClipboard(discordText, 'Discord message copied! Paste it in your BD2 server.');
            break;
            
        case 'reddit':
            const redditTitle = encodeURIComponent('BD2 Hub - Comprehensive Brown Dust 2 Resource Center');
            const redditUrl = `https://reddit.com/submit?title=${redditTitle}&url=${encodeURIComponent(currentUrl)}&text=${encodeURIComponent(shareText)}`;
            window.open(redditUrl, '_blank');
            showShareNotification('Opening Reddit share dialog...');
            break;
            
        case 'native':
            if (navigator.share) {
                navigator.share({
                    title: title,
                    text: shareText,
                    url: currentUrl
                }).then(() => {
                    showShareNotification('BD2 Hub shared successfully!');
                }).catch(() => {
                    copyToClipboard(currentUrl, 'BD2 Hub link copied to clipboard!');
                });
            } else {
                copyToClipboard(currentUrl, 'BD2 Hub link copied to clipboard!');
            }
            break;
    }
    
    trackEvent('bd2_share', { method: method });
}

// Search Functionality
function initSearch() {
    const searchInput = document.getElementById('searchInput');
    
    searchInput.addEventListener('input', function() {
        const searchTerm = this.value.toLowerCase().trim();
        debouncedSearch(searchTerm);
    });
    
    // Clear search when escape is pressed
    searchInput.addEventListener('keyup', function(e) {
        if (e.key === 'Escape') {
            this.value = '';
            performSearch('');
        }
    });
}

function performSearch(searchTerm) {
    // Clear previous highlights
    clearHighlights();
    
    // Search in character items
    const characterItems = document.querySelectorAll('.character-item');
    characterItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(searchTerm) || searchTerm === '') {
            item.style.display = 'block';
            if (searchTerm) highlightText(item, searchTerm);
        } else {
            item.style.display = 'none';
        }
    });
    
    // Search in guide cards
    const guideCards = document.querySelectorAll('.guide-card');
    guideCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(searchTerm) || searchTerm === '') {
            card.style.display = 'block';
            if (searchTerm) highlightText(card, searchTerm);
        } else {
            card.style.display = 'none';
        }
    });
    
    // Search in banner cards
    const bannerCards = document.querySelectorAll('.banner-card, .banner-detail-card');
    bannerCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(searchTerm) || searchTerm === '') {
            card.style.display = 'block';
            if (searchTerm) highlightText(card, searchTerm);
        } else {
            card.style.display = 'none';
        }
    });
    
    // Search in link cards
    const linkCards = document.querySelectorAll('.link-card');
    linkCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(searchTerm) || searchTerm === '') {
            card.style.display = 'block';
            if (searchTerm) highlightText(card, searchTerm);
        } else {
            card.style.display = 'none';
        }
    });
    
    // Search in resource cards
    const resourceCards = document.querySelectorAll('.resource-card');
    resourceCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        if (text.includes(searchTerm) || searchTerm === '') {
            card.style.display = 'block';
            if (searchTerm) highlightText(card, searchTerm);
        } else {
            card.style.display = 'none';
        }
    });
    
    // Search in tips
    const tipItems = document.querySelectorAll('.tip-item');
    tipItems.forEach(item => {
        const text = item.textContent.toLowerCase();
        if (text.includes(searchTerm) || searchTerm === '') {
            item.style.display = 'block';
            if (searchTerm) highlightText(item, searchTerm);
        } else {
            item.style.display = 'none';
        }
    });
    
    // Auto-expand tier sections if characters are found
    if (searchTerm !== '') {
        const tierContents = document.querySelectorAll('.tier-content');
        tierContents.forEach(content => {
            const visibleCharacters = content.querySelectorAll('.character-item');
            let hasVisibleCharacters = false;
            
            visibleCharacters.forEach(char => {
                if (char.style.display !== 'none') {
                    hasVisibleCharacters = true;
                }
            });
            
            if (hasVisibleCharacters) {
                content.classList.add('active');
                const toggle = content.previousElementSibling;
                if (toggle && toggle.classList.contains('tier-toggle')) {
                    toggle.style.background = 'var(--color-secondary)';
                    toggle.style.transform = 'scale(1.02)';
                }
            }
        });
        
        // Track search
        if (searchTerm.length > 2) {
            trackEvent('bd2_search', { query: searchTerm });
        }
    } else {
        // Reset tier sections when search is cleared
        const tierContents = document.querySelectorAll('.tier-content');
        tierContents.forEach(content => {
            content.classList.remove('active');
            const toggle = content.previousElementSibling;
            if (toggle && toggle.classList.contains('tier-toggle')) {
                toggle.style.background = 'var(--gradient-secondary)';
                toggle.style.transform = 'scale(1)';
            }
        });
    }
}

function clearHighlights() {
    const highlights = document.querySelectorAll('.highlight');
    highlights.forEach(highlight => {
        const parent = highlight.parentNode;
        parent.replaceChild(document.createTextNode(highlight.textContent), highlight);
        parent.normalize();
    });
}

function highlightText(element, searchTerm) {
    if (!searchTerm) return;
    
    const regex = new RegExp(`(${escapeRegExp(searchTerm)})`, 'gi');
    const walker = document.createTreeWalker(
        element,
        NodeFilter.SHOW_TEXT,
        null,
        false
    );
    
    const textNodes = [];
    let node;
    
    while (node = walker.nextNode()) {
        textNodes.push(node);
    }
    
    textNodes.forEach(textNode => {
        const text = textNode.textContent;
        if (regex.test(text)) {
            const highlightedText = text.replace(regex, '<span class="highlight">$1</span>');
            const tempDiv = document.createElement('div');
            tempDiv.innerHTML = highlightedText;
            
            const fragment = document.createDocumentFragment();
            while (tempDiv.firstChild) {
                fragment.appendChild(tempDiv.firstChild);
            }
            
            textNode.parentNode.replaceChild(fragment, textNode);
        }
    });
}

function escapeRegExp(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
}

// Copy Link Functionality
function initCopyLink() {
    const copyBtn = document.getElementById('copyLinkBtn');
    
    copyBtn.addEventListener('click', function() {
        const currentUrl = window.location.href;
        copyToClipboard(currentUrl, '🛡️ BD2 Hub permanent link copied! This link never expires.');
    });
}

function copyToClipboard(text, message = 'Copied to clipboard!') {
    if (navigator.clipboard) {
        navigator.clipboard.writeText(text).then(() => {
            showCopyNotification(message);
        }).catch(() => {
            fallbackCopyToClipboard(text, message);
        });
    } else {
        fallbackCopyToClipboard(text, message);
    }
}

function fallbackCopyToClipboard(text, message) {
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.left = '-999999px';
    textArea.style.top = '-999999px';
    document.body.appendChild(textArea);
    textArea.focus();
    textArea.select();
    
    try {
        document.execCommand('copy');
        showCopyNotification(message);
    } catch (err) {
        showCopyNotification('Failed to copy. Please copy manually: ' + text.substring(0, 50) + '...');
    }
    
    document.body.removeChild(textArea);
}

function showCopyNotification(message) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.copy-notification, .share-notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'copy-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 4 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 4000);
}

function showShareNotification(message) {
    // Remove existing notifications
    const existingNotifications = document.querySelectorAll('.copy-notification, .share-notification');
    existingNotifications.forEach(notif => notif.remove());
    
    // Create new notification
    const notification = document.createElement('div');
    notification.className = 'share-notification';
    notification.textContent = message;
    document.body.appendChild(notification);
    
    // Show notification
    setTimeout(() => {
        notification.classList.add('show');
    }, 100);
    
    // Hide notification after 3 seconds
    setTimeout(() => {
        notification.classList.remove('show');
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

// Banner Countdown Functionality
function initBannerCountdown() {
    const bannerCards = document.querySelectorAll('.banner-card[data-end-date], .banner-detail-card[data-end-date]');
    
    bannerCards.forEach(card => {
        const endDateStr = card.getAttribute('data-end-date');
        const endDate = new Date(endDateStr);
        const remainingElement = card.querySelector('.banner-remaining');
        
        if (remainingElement) {
            updateBannerCountdown(endDate, remainingElement);
        }
    });
    
    // Update countdowns every minute
    setInterval(() => {
        bannerCards.forEach(card => {
            const endDateStr = card.getAttribute('data-end-date');
            const endDate = new Date(endDateStr);
            const remainingElement = card.querySelector('.banner-remaining');
            
            if (remainingElement) {
                updateBannerCountdown(endDate, remainingElement);
            }
        });
    }, 60000);
}

function updateBannerCountdown(endDate, element) {
    const now = new Date();
    const timeRemaining = endDate - now;
    
    if (timeRemaining <= 0) {
        element.textContent = 'Banner ended';
        element.style.color = 'var(--color-error)';
        return;
    }
    
    const days = Math.floor(timeRemaining / (1000 * 60 * 60 * 24));
    const hours = Math.floor((timeRemaining % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
    
    if (days > 0) {
        element.textContent = `${days} day${days > 1 ? 's' : ''} remaining`;
    } else {
        element.textContent = `${hours} hour${hours > 1 ? 's' : ''} remaining`;
    }
    
    if (days <= 1) {
        element.style.color = 'var(--color-error)';
    } else if (days <= 3) {
        element.style.color = 'var(--color-warning)';
    } else {
        element.style.color = 'var(--color-success)';
    }
}

// Update Current Date
function updateCurrentDate() {
    const currentDateElement = document.getElementById('currentDate');
    if (currentDateElement) {
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        };
        const formattedDate = new Date().toLocaleDateString('en-US', options);
        currentDateElement.textContent = formattedDate;
    }
}

// Initialize last updated timestamp
function initLastUpdated() {
    const lastUpdatedElement = document.querySelector('.last-updated');
    if (lastUpdatedElement) {
        const now = new Date();
        const options = { 
            year: 'numeric', 
            month: 'long', 
            day: 'numeric'
        };
        const formattedDate = now.toLocaleDateString('en-US', options);
        lastUpdatedElement.innerHTML = `Last Updated: <span id="currentDate">${formattedDate}</span>`;
    }
}

// Keyboard Shortcuts
function initKeyboardShortcuts() {
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + K to focus search
        if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
            e.preventDefault();
            const searchInput = document.getElementById('searchInput');
            searchInput.focus();
            searchInput.select();
        }
        
        // Ctrl/Cmd + Shift + C to copy link
        if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key === 'C') {
            e.preventDefault();
            const currentUrl = window.location.href;
            copyToClipboard(currentUrl, '🛡️ BD2 Hub link copied via keyboard shortcut!');
        }
        
        // Tab navigation with number keys
        if (e.key >= '1' && e.key <= '5') {
            const tabIndex = parseInt(e.key) - 1;
            const tabs = document.querySelectorAll('.nav-tab');
            if (tabs[tabIndex]) {
                tabs[tabIndex].click();
            }
        }
        
        // Escape to clear search
        if (e.key === 'Escape') {
            const searchInput = document.getElementById('searchInput');
            if (document.activeElement === searchInput) {
                searchInput.blur();
            }
        }
    });
}

// Utility Functions
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Debounced search for better performance
const debouncedSearch = debounce(performSearch, 300);

// Analytics tracking (placeholder for BD2 specific events)
function trackEvent(eventName, eventData) {
    console.log(`BD2 Hub Event: ${eventName}`, eventData);
    
    // Could integrate with analytics service here
    if (typeof gtag !== 'undefined') {
        gtag('event', eventName, eventData);
    }
}

// Responsive utilities
function isMobileDevice() {
    return window.innerWidth <= 768;
}

function isTabletDevice() {
    return window.innerWidth > 768 && window.innerWidth <= 1024;
}

// Handle window resize
window.addEventListener('resize', debounce(function() {
    console.log('BD2 Hub: Window resized to:', window.innerWidth);
}, 250));

// Auto-refresh functionality
function startAutoRefresh() {
    // Update timestamps every 5 minutes
    setInterval(() => {
        initLastUpdated();
        updateCurrentDate();
    }, 300000); // 5 minutes
}

// Initialize auto-refresh
startAutoRefresh();

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
        }
    });
}, observerOptions);

// Observe elements for fade-in animation
document.addEventListener('DOMContentLoaded', function() {
    const elements = document.querySelectorAll('.link-card, .banner-card, .guide-card, .resource-card, .tip-item');
    elements.forEach((el, index) => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(20px)';
        el.style.transition = `opacity 0.6s ease-out ${index * 0.1}s, transform 0.6s ease-out ${index * 0.1}s`;
        observer.observe(el);
    });
});

// URL sharing detection
function detectReferrer() {
    const referrer = document.referrer;
    if (referrer) {
        if (referrer.includes('reddit.com')) {
            trackEvent('bd2_visit_from_reddit', { referrer });
        } else if (referrer.includes('discord.com')) {
            trackEvent('bd2_visit_from_discord', { referrer });
        } else if (referrer.includes('google.com')) {
            trackEvent('bd2_visit_from_search', { referrer });
        }
    }
}

// Initialize referrer tracking
detectReferrer();

// Smooth scrolling for better UX
function smoothScrollTo(element) {
    element.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
    });
}

// Focus management for accessibility
document.addEventListener('DOMContentLoaded', function() {
    const searchInput = document.getElementById('searchInput');
    if (searchInput && !isMobileDevice()) {
        // Auto-focus search on desktop after a brief delay
        setTimeout(() => {
            searchInput.focus();
        }, 500);
    }
});

// Error handling
window.addEventListener('error', function(e) {
    console.error('BD2 Hub error:', e.error);
    trackEvent('bd2_error', { error: e.error.message });
});

// Performance monitoring
if (typeof PerformanceObserver !== 'undefined') {
    const perfObserver = new PerformanceObserver((list) => {
        const entries = list.getEntries();
        entries.forEach(entry => {
            if (entry.entryType === 'navigation') {
                console.log('BD2 Hub page load time:', entry.duration);
                trackEvent('bd2_performance', { loadTime: entry.duration });
            }
        });
    });
    
    try {
        perfObserver.observe({ entryTypes: ['navigation'] });
    } catch (e) {
        console.warn('Performance observer not supported');
    }
}

// Theme detection and handling
function detectTheme() {
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    console.log('User prefers dark theme:', prefersDark);
    trackEvent('bd2_theme_preference', { prefersDark });
    return prefersDark;
}

// Listen for theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', function(e) {
    console.log('Theme changed to:', e.matches ? 'dark' : 'light');
    trackEvent('bd2_theme_change', { isDark: e.matches });
});

// Initialize theme detection
detectTheme();

// Handle online/offline status
window.addEventListener('online', function() {
    console.log('BD2 Hub is online');
    showCopyNotification('✅ BD2 Hub is back online!');
});

window.addEventListener('offline', function() {
    console.log('BD2 Hub is offline');
    showCopyNotification('⚠️ BD2 Hub is offline - bookmarked content still available');
});

// Page visibility API for tracking
document.addEventListener('visibilitychange', function() {
    if (document.visibilityState === 'visible') {
        trackEvent('bd2_tab_visible', { timestamp: Date.now() });
    } else {
        trackEvent('bd2_tab_hidden', { timestamp: Date.now() });
    }
});

// Initialize everything
document.addEventListener('DOMContentLoaded', function() {
    // Set initial focus and state
    const dashboardTab = document.querySelector('.nav-tab[data-tab="dashboard"]');
    if (dashboardTab) {
        dashboardTab.classList.add('active');
    }
    
    const dashboardContent = document.getElementById('dashboard');
    if (dashboardContent) {
        dashboardContent.classList.add('active');
    }
    
    // Add welcome message for first-time visitors
    if (!localStorage.getItem('bd2_hub_visited')) {
        setTimeout(() => {
            showCopyNotification('🛡️ Welcome to BD2 Hub! Bookmark this permanent link for easy access.');
            localStorage.setItem('bd2_hub_visited', 'true');
            trackEvent('bd2_first_visit', { timestamp: Date.now() });
        }, 2000);
    } else {
        trackEvent('bd2_return_visit', { timestamp: Date.now() });
    }
    
    console.log('🛡️ BD2 Hub - Brown Dust 2 Dashboard fully loaded and ready');
});

// Service Worker registration for offline support (if available)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Note: Service worker would need to be implemented separately
        console.log('BD2 Hub: Service worker support detected');
    });
}

// Export functions for testing (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        performSearch,
        updateBannerCountdown,
        trackEvent,
        debounce,
        handleShare,
        copyToClipboard
    };
}