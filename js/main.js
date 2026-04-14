/**
 * Abdulrahman Al-Muqaily - Portfolio JS
 * Main script for all interactions and animations
 */

// ==========================================
// GLOBALS & STATE
// ==========================================
let isArabic = true;
let isDarkMode = true;
let isMobileMenuOpen = false;
let ticking = false;

// ==========================================
// DOM READY
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    initTheme();
    initScrollObserver();
    initNavbar();
    initParticles();
    initCounters();
    initTyping();
    addLoadingScreen();
    addMobileNav();
    addGridDecoration();
    
    // Delay to let assets load
    setTimeout(() => {
        removeLoadingScreen();
    }, 1200);
});

// ==========================================
// LOADING SCREEN
// ==========================================
function addLoadingScreen() {
    const loader = document.createElement('div');
    loader.className = 'loading-screen';
    loader.id = 'loadingScreen';
    loader.innerHTML = `
        <div style="text-align: center;">
            <div class="loading-logo">AM</div>
            <div class="preloader-dots" style="justify-content: center; margin-top: 16px;">
                <div class="preloader-dot"></div>
                <div class="preloader-dot"></div>
                <div class="preloader-dot"></div>
            </div>
        </div>
    `;
    document.body.prepend(loader);
}

function removeLoadingScreen() {
    const loader = document.getElementById('loadingScreen');
    if (loader) {
        loader.classList.add('hidden');
        setTimeout(() => loader.remove(), 600);
    }
}

// ==========================================
// THEME TOGGLE
// ==========================================
function initTheme() {
    const savedTheme = localStorage.getItem('theme') || 'dark';
    isDarkMode = savedTheme === 'dark';
    applyTheme();
}

function toggleTheme() {
    isDarkMode = !isDarkMode;
    localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
    applyTheme();
}

function applyTheme() {
    const body = document.body;
    const icon = document.getElementById('themeIcon');
    
    if (isDarkMode) {
        body.classList.add('dark-mode');
        body.classList.remove('light-mode');
        if (icon) {
            icon.className = 'fas fa-moon';
        }
    } else {
        body.classList.remove('dark-mode');
        body.classList.add('light-mode');
        if (icon) {
            icon.className = 'fas fa-sun';
        }
    }
}

// ==========================================
// LANGUAGE TOGGLE
// ==========================================
function toggleLang() {
    isArabic = !isArabic;
    const body = document.body;
    const langBtn = document.getElementById('langToggle');
    const htmlEl = document.documentElement;
    
    if (isArabic) {
        body.classList.remove('ltr-lang');
        body.setAttribute('dir', 'rtl');
        htmlEl.setAttribute('lang', 'ar');
        htmlEl.setAttribute('dir', 'rtl');
        if (langBtn) langBtn.innerHTML = '<i class="fas fa-globe"></i> EN';
        updateAllText('ar');
    } else {
        body.classList.add('ltr-lang');
        body.setAttribute('dir', 'ltr');
        htmlEl.setAttribute('lang', 'en');
        htmlEl.setAttribute('dir', 'ltr');
        if (langBtn) langBtn.innerHTML = '<i class="fas fa-globe"></i> AR';
        updateAllText('en');
    }
}

function updateAllText(lang) {
    // Update all elements with data-ar / data-en attributes
    document.querySelectorAll('[data-ar][data-en]').forEach(el => {
        const text = el.getAttribute(`data-${lang}`);
        if (text) el.textContent = text;
    });
    
    // Update name display
    const nameAr = document.querySelector('.name-ar');
    const nameEn = document.querySelector('.name-en');
    if (nameAr && nameEn) {
        if (lang === 'ar') {
            nameAr.style.display = '';
            nameEn.style.display = 'none';
        } else {
            nameAr.style.display = 'none';
            nameEn.style.display = '';
        }
    }
    
    // Update form inputs placeholders
    const inputs = document.querySelectorAll('.form-input, .form-textarea');
    const placeholders = {
        ar: ['اسمك', 'بريدك الإلكتروني', 'رسالتك...'],
        en: ['Your name', 'Your email', 'Your message...']
    };
    inputs.forEach((input, i) => {
        if (placeholders[lang][i]) {
            input.setAttribute('placeholder', placeholders[lang][i]);
            input.setAttribute('dir', lang === 'ar' ? 'rtl' : 'ltr');
        }
    });
}

// ==========================================
// MOBILE NAVIGATION
// ==========================================
function addMobileNav() {
    const overlay = document.createElement('div');
    overlay.className = 'mobile-nav-overlay';
    overlay.id = 'mobileNav';
    
    const navItems = [
        { href: '#home', ar: 'الرئيسية', en: 'Home' },
        { href: '#certifications', ar: 'الشهادات', en: 'Certifications' },
        { href: '#projects', ar: 'المشاريع', en: 'Projects' },
        { href: '#techstack', ar: 'التقنيات', en: 'Tech' },
        { href: '#contact', ar: 'التواصل', en: 'Contact' },
    ];
    
    overlay.innerHTML = navItems.map(item => `
        <a href="${item.href}" class="mobile-nav-link" data-ar="${item.ar}" data-en="${item.en}" onclick="closeMobileMenu()">${item.ar}</a>
    `).join('');
    
    document.body.appendChild(overlay);
}

function toggleMobileMenu() {
    isMobileMenuOpen = !isMobileMenuOpen;
    const nav = document.getElementById('mobileNav');
    const btn = document.getElementById('mobileMenuBtn');
    
    if (nav) {
        nav.classList.toggle('open', isMobileMenuOpen);
    }
    if (btn) {
        btn.innerHTML = isMobileMenuOpen 
            ? '<i class="fas fa-times"></i>' 
            : '<i class="fas fa-bars"></i>';
    }
}

function closeMobileMenu() {
    isMobileMenuOpen = false;
    const nav = document.getElementById('mobileNav');
    const btn = document.getElementById('mobileMenuBtn');
    if (nav) nav.classList.remove('open');
    if (btn) btn.innerHTML = '<i class="fas fa-bars"></i>';
}

// ==========================================
// NAVBAR SCROLL EFFECT
// ==========================================
function initNavbar() {
    window.addEventListener('scroll', () => {
        if (!ticking) {
            requestAnimationFrame(() => {
                updateNavbar();
                updateScrollTopBtn();
                updateActiveNavLink();
                ticking = false;
            });
            ticking = true;
        }
    });
}

function updateNavbar() {
    const navbar = document.getElementById('navbar');
    if (navbar) {
        navbar.classList.toggle('scrolled', window.scrollY > 60);
    }
}

function updateScrollTopBtn() {
    const btn = document.getElementById('scrollTopBtn');
    if (btn) {
        btn.classList.toggle('visible', window.scrollY > 300);
    }
}

function updateActiveNavLink() {
    const sections = document.querySelectorAll('section[id]');
    let current = '';
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop - 100;
        if (window.scrollY >= sectionTop) {
            current = section.id;
        }
    });
}

// ==========================================
// SCROLL TO TOP
// ==========================================
function scrollToTop() {
    window.scrollTo({ top: 0, behavior: 'smooth' });
}

// ==========================================
// SCROLL OBSERVER (Animate on scroll)
// ==========================================
function initScrollObserver() {
    const options = {
        root: null,
        rootMargin: '0px 0px -80px 0px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                // Stagger delay for grid items
                const siblings = entry.target.parentElement?.children;
                let itemIndex = 0;
                if (siblings) {
                    itemIndex = Array.from(siblings).indexOf(entry.target);
                }
                
                setTimeout(() => {
                    entry.target.classList.add('visible');
                }, itemIndex * 80);
                
                observer.unobserve(entry.target);
            }
        });
    }, options);
    
    document.querySelectorAll('.animate-on-scroll').forEach(el => {
        observer.observe(el);
    });
}

// ==========================================
// PARTICLES BACKGROUND
// ==========================================
function initParticles() {
    const heroSection = document.querySelector('.hero-section');
    if (!heroSection) return;
    
    // Add cursor glow
    const cursorGlow = document.createElement('div');
    cursorGlow.className = 'cursor-glow';
    cursorGlow.id = 'cursorGlow';
    document.body.appendChild(cursorGlow);
    
    document.addEventListener('mousemove', (e) => {
        const glow = document.getElementById('cursorGlow');
        if (glow) {
            glow.style.left = e.clientX + 'px';
            glow.style.top = e.clientY + 'px';
        }
    });
}

// ==========================================
// COUNTER ANIMATION
// ==========================================
function initCounters() {
    const statsSection = document.querySelector('.hero-stats');
    if (!statsSection) return;

    // Check if hero-stats is already visible on load
    const rect = statsSection.getBoundingClientRect();
    if (rect.top < window.innerHeight && rect.bottom > 0) {
        // Already visible, run animation after a short delay
        setTimeout(() => animateCounters(), 800);
    } else {
        // Not visible yet, use IntersectionObserver
        const counterObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounters();
                    counterObserver.disconnect();
                }
            });
        });
        counterObserver.observe(statsSection);
    }
}

function animateCounters() {
    document.querySelectorAll('.stat-number').forEach(counter => {
        const text = counter.textContent.trim();
        const match = text.match(/(\d+)/);
        if (!match) return;

        const target = parseInt(match[1]);
        const suffix = text.replace(/\d+/, '');
        let current = 0;
        const increment = Math.max(1, Math.floor(target / 30));
        const delay = 50;

        const timer = setInterval(() => {
            current += increment;
            if (current >= target) {
                current = target;
                clearInterval(timer);
            }
            counter.textContent = current + suffix;
        }, delay);
    });
}

// ==========================================
// TYPING EFFECT (Optional for hero)
// ==========================================
function initTyping() {
    // Typing effect can be added if needed
    // Currently the hero uses static text
}

// ==========================================
// CONTACT FORM — sends via FormSubmit (free, no setup needed)
// ==========================================
function handleEmailJSSubmit(event) {
    event.preventDefault();
    const form = event.target;
    const btn = form.querySelector('button[type="submit"]');
    const origHTML = btn.innerHTML;

    btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>...Sending</span>';
    btn.disabled = true;

    // Use FormSubmit (free, no API key needed)
    fetch('https://formsubmit.co/ajax/abdulrahman.mhm1@gmail.com', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json'
        },
        body: JSON.stringify({
            name: form.user_name.value,
            email: form.user_email.value,
            message: form.message.value
        })
    })
    .then(response => response.json())
    .then(data => {
        btn.innerHTML = '<i class="fas fa-check"></i> <span>Sent!</span>';
        btn.style.background = '#22c55e';

        showToast(
            isArabic
                ? 'تم إرسال رسالتك بنجاح! سأتواصل معك قريباً 🤍'
                : 'Message sent successfully! I\'ll get back to you soon 🤍'
        );

        setTimeout(() => {
            form.reset();
            btn.innerHTML = origHTML;
            btn.disabled = false;
            btn.style.background = '';
        }, 3000);
    })
    .catch(error => {
        btn.innerHTML = '<i class="fas fa-exclamation-triangle"></i> <span>Error</span>';
        btn.style.background = '#e63946';

        showToast(
            isArabic
                ? 'فشل الإرسال. يرجى المحاولة مرة أخرى.'
                : 'Failed to send. Please try again.'
        );

        setTimeout(() => {
            btn.innerHTML = origHTML;
            btn.disabled = false;
            btn.style.background = '';
        }, 3000);
    });
}

// ==========================================
// CERTIFICATE MODAL / LIGHTBOX
// ==========================================
function openCertModal(imgSrc, name, issuer, date) {
    const overlay = document.getElementById('certModal');
    const img = document.getElementById('certModalImg');
    const nameEl = document.getElementById('certModalName');
    const issuerEl = document.getElementById('certModalIssuer');
    const dateEl = document.getElementById('certModalDate');

    if (!overlay) return;
    img.src = imgSrc;
    img.alt = name;
    if (nameEl) nameEl.textContent = name;
    if (issuerEl) issuerEl.textContent = issuer;
    if (dateEl) dateEl.textContent = date;

    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
}

function closeCertModal() {
    const overlay = document.getElementById('certModal');
    if (overlay) overlay.classList.remove('open');
    document.body.style.overflow = '';
}

// ==========================================
// TOAST NOTIFICATION
// ==========================================
function showToast(message, type = 'success') {
    const toast = document.getElementById('toast');
    const toastMsg = document.getElementById('toastMessage');
    
    if (!toast || !toastMsg) return;
    
    toastMsg.textContent = message;
    toast.style.background = type === 'success' ? '#22c55e' : '#e63946';
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 4000);
}

// ==========================================
// GRID DECORATION
// ==========================================
function addGridDecoration() {
    const hero = document.querySelector('.hero-section');
    if (hero) {
        const grid = document.createElement('div');
        grid.className = 'grid-pattern';
        grid.style.position = 'absolute';
        grid.style.inset = '0';
        grid.style.pointerEvents = 'none';
        grid.style.zIndex = '0';
        grid.style.opacity = '0.3';
        hero.appendChild(grid);
    }
}

// ==========================================
// IMAGE FALLBACKS
// ==========================================
document.addEventListener('DOMContentLoaded', () => {
    // Handle all cert logo images with fallback
    document.querySelectorAll('.cert-logo').forEach(img => {
        img.addEventListener('error', function() {
            const parent = this.closest('.cert-logo-container');
            if (parent) {
                const fallback = document.createElement('div');
                fallback.className = 'cert-logo-fallback';
                fallback.textContent = this.getAttribute('alt') || '?';
                parent.innerHTML = '';
                parent.appendChild(fallback);
            }
        });
    });
    
    // Handle timeline logos
    document.querySelectorAll('.tc-logo').forEach(img => {
        img.addEventListener('error', function() {
            const parent = this.closest('.tc-logo-wrap');
            if (parent) {
                parent.innerHTML = '<i class="fas fa-building" style="color:var(--accent);font-size:1.3rem;"></i>';
            }
        });
    });
    
    // Handle company logos
    document.querySelectorAll('.company-logo').forEach(img => {
        img.addEventListener('error', function() {
            const parent = this.closest('.company-card');
            if (parent) {
                const fallback = document.createElement('div');
                fallback.className = 'company-name-fallback';
                fallback.textContent = this.getAttribute('alt') || 'Company';
                this.replaceWith(fallback);
            }
        });
    });
});

// ==========================================
// SMOOTH SCROLL FOR ANCHOR LINKS
// ==========================================
document.addEventListener('click', (e) => {
    const anchor = e.target.closest('a[href^="#"]');
    if (anchor) {
        e.preventDefault();
        const target = document.querySelector(anchor.getAttribute('href'));
        if (target) {
            const navbarHeight = parseInt(getComputedStyle(document.documentElement)
                .getPropertyValue('--navbar-height')) || 70;
            const targetTop = target.getBoundingClientRect().top + window.scrollY - navbarHeight;
            window.scrollTo({ top: targetTop, behavior: 'smooth' });
        }
    }
});

// ==========================================
// KEYBOARD NAVIGATION
// ==========================================
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        if (isMobileMenuOpen) closeMobileMenu();
        closeCertModal();
    }
});

// ==========================================
// PERFORMANCE: Lazy load images
// ==========================================
function initLazyLoading() {
    if ('IntersectionObserver' in window) {
        const imgObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                        imgObserver.unobserve(img);
                    }
                }
            });
        });
        
        document.querySelectorAll('img[data-src]').forEach(img => {
            imgObserver.observe(img);
        });
    }
}

// ==========================================
// MISC UTILITIES
// ==========================================

// Add shimmer effect to cards while loading
function addShimmer() {
    document.querySelectorAll('.cert-card, .project-card, .timeline-card').forEach(card => {
        card.style.opacity = '0.7';
    });
}

// Debounce utility
function debounce(fn, delay) {
    let timer;
    return function(...args) {
        clearTimeout(timer);
        timer = setTimeout(() => fn.apply(this, args), delay);
    };
}

// Throttle utility
function throttle(fn, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            fn.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ==========================================
// WINDOW RESIZE HANDLER
// ==========================================
window.addEventListener('resize', debounce(() => {
    if (window.innerWidth > 768 && isMobileMenuOpen) {
        closeMobileMenu();
    }
}, 200));

// ==========================================
// PRINT CV BUTTON (optional)
// ==========================================
function downloadCV() {
    showToast(isArabic ? 'جاري تحميل السيرة الذاتية...' : 'Downloading CV...');
    // In a real site, this would trigger a PDF download
    window.print();
}

// ==========================================
// PARALLAX EFFECT (subtle)
// ==========================================
window.addEventListener('scroll', throttle(() => {
    const scrolled = window.scrollY;
    const hero = document.querySelector('.hero-section');
    if (hero && scrolled < window.innerHeight) {
        const parallaxValue = scrolled * 0.3;
        const heroContent = hero.querySelector('.hero-content');
        if (heroContent) {
            heroContent.style.transform = `translateY(${parallaxValue * 0.3}px)`;
            heroContent.style.opacity = 1 - (scrolled / window.innerHeight) * 0.8;
        }
    }
}, 16));

// ==========================================
// INITIALIZE EVERYTHING
// ==========================================
window.addEventListener('load', () => {
    initLazyLoading();
    initMarquee();
    
    // Add additional scroll animations after page load
    setTimeout(() => {
        document.querySelectorAll('.animate-on-scroll').forEach(el => {
            const rect = el.getBoundingClientRect();
            if (rect.top < window.innerHeight) {
                el.classList.add('visible');
            }
        });
    }, 100);
});

// ==========================================
// CONSOLE EASTER EGG
// ==========================================
console.log(`
%c👋 مرحباً بك في موقع عبدالرحمن المعيقلي!
%c🚀 Data & AI Engineer | am1hm
%c📧 GitHub: https://github.com/am1hm
`, 
'color: #e63946; font-size: 16px; font-weight: bold;',
'color: #a0aec0; font-size: 12px;',
'color: #a0aec0; font-size: 12px;'
);
