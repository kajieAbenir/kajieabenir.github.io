// Wait until the DOM tree is fully constructed before touching it.
document.addEventListener("DOMContentLoaded", () => {

    /* --------------------------------------------------------------------
     * 1. LOADING SCREEN / SPLASH FADE-OUT
     * ------------------------------------------------------------------ */
    const loader = document.getElementById('loading');
    
    // Function to hide loader
    const hideLoader = () => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    };

    // Hide loader only after all images finish loading.
    const images = Array.from(document.querySelectorAll('img'));
    const allImagesLoaded = Promise.all(images.map(img => new Promise(resolve => {
        if (img.complete) {
            return resolve();
        }
        img.addEventListener('load', resolve, { once: true });
        img.addEventListener('error', resolve, { once: true });
    })));

    allImagesLoaded.then(hideLoader);

    /* --------------------------------------------------------------------
     * 2. MOBILE NAVIGATION TOGGLER  (hamburger ⇄ close icon)
     * ------------------------------------------------------------------ */
    const navToggle = document.getElementById('nav-toggle'); // button element
    const navbar    = document.getElementById('navbar');     // ul/nav container

    navToggle.setAttribute('aria-expanded', 'false');
    navToggle.setAttribute('aria-controls', 'navbar');

    navToggle.addEventListener('click', () => {
        /* Toggle .open on <nav> for CSS slide-in/out  ------------------- */
        const isOpen = navbar.classList.toggle('open');
        navToggle.setAttribute('aria-expanded', isOpen ? 'true' : 'false');

        /* Swap the Font Awesome icon class for visual feedback ---------- */
        const icon = navToggle.querySelector('i');
        if (isOpen) {
            icon.classList.remove('fa-bars');
            icon.classList.add   ('fa-xmark');  // “X” icon when menu open
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add   ('fa-bars');   // hamburger when menu closed
        }
    });

    /* Close the mobile menu immediately after any internal link is tapped */
    navbar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('open');           // hide menu
            navToggle.setAttribute('aria-expanded', 'false');
            const icon = navToggle.querySelector('i'); // reset icon
            icon.classList.add   ('fa-bars');
            icon.classList.remove('fa-xmark');
        });
    });

    const backToTop = document.getElementById('back-to-top');
    const toggleBackToTop = () => {
        if (window.scrollY > 400) {
            backToTop.classList.add('visible');
        } else {
            backToTop.classList.remove('visible');
        }
    };

    backToTop.addEventListener('click', () => {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', toggleBackToTop);
    toggleBackToTop();

    /* Update active navigation links as sections enter the viewport */
    const sections = document.querySelectorAll('main section[id]');
    const navLinks = document.querySelectorAll('#navbar a');

    const updateActiveNav = (targetId) => {
        navLinks.forEach(link => {
            link.classList.toggle('active', link.getAttribute('href') === `#${targetId}`);
        });
    };

    const sectionObserver = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting && entry.intersectionRatio >= 0.35) {
                updateActiveNav(entry.target.id);
            }
        });
    }, {
        threshold: [0.35],
        rootMargin: '-30% 0px -60% 0px'
    });

    sections.forEach(section => sectionObserver.observe(section));

    /* --------------------------------------------------------------------
     * 3. FULL-SCREEN (LIGHTBOX) IMAGE VIEWER
     * ------------------------------------------------------------------ */
    const modal     = document.getElementById('fullscreen-modal'); // overlay
    const modalImg  = document.getElementById('modal-img');        // <img> tag
    const closeModal= document.querySelector('.close-modal');      // “×” button

    /* Bind click handler to every .zoomable element.
     * Works whether user clicks wrapper <div> or the <img> inside it.
     */
    document.querySelectorAll('.zoomable').forEach(item => {
        item.addEventListener('click', function (e) {
            // Determine the actual <img> that was clicked or is contained
            const targetImg = e.target.tagName === 'IMG' ? e.target
                                                         : this.querySelector('img');

            // Prefer high-res URL in data-full; fall back to current src
            const src = targetImg.getAttribute('data-full') || targetImg.src;

            modalImg.src = src;          // Inject image into modal
            modal.classList.add('active'); // Show modal (CSS display/fade)
        });
    });

    /* Close modal when “×” icon pressed */
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
        modalImg.src = ''; // Reset src so next open doesn’t flash old image
    });

    /* Close modal or mobile navigation when Escape key is pressed */
    window.addEventListener('keydown', (event) => {
        if (event.key === 'Escape') {
            if (modal.classList.contains('active')) {
                modal.classList.remove('active');
                modalImg.src = '';
            }
            if (navbar.classList.contains('open')) {
                navbar.classList.remove('open');
                navToggle.setAttribute('aria-expanded', 'false');
                const icon = navToggle.querySelector('i');
                icon.classList.add('fa-bars');
                icon.classList.remove('fa-xmark');
            }
        }
    });

    /* Also close modal if user clicks the darkened background itself
     * (but not if they click the image).
     */
    modal.addEventListener('click', (e) => {
        if (e.target === modal) { // ensure it’s the backdrop, not descendants
            modal.classList.remove('active');
        }
    });

    /* --------------------------------------------------------------------
     * 4. IMAGE CAROUSELS
     * ------------------------------------------------------------------ */
    document.querySelectorAll('.image-carousel').forEach(carousel => {
        const track = carousel.querySelector('.carousel-track');
        const items = Array.from(carousel.querySelectorAll('.carousel-item'));
        const prevBtn = carousel.querySelector('.carousel-btn-prev');
        const nextBtn = carousel.querySelector('.carousel-btn-next');
        let currentIndex = 0;

        if (!track || !items.length || !prevBtn || !nextBtn) return;

        const getVisibleItems = () => {
            const visible = getComputedStyle(carousel).getPropertyValue('--carousel-visible-items');
            return Number.parseInt(visible, 10) || 1;
        };

        const updateCarousel = () => {
            const maxIndex = Math.max(items.length - getVisibleItems(), 0);
            currentIndex = Math.min(currentIndex, maxIndex);
            track.style.transform = `translateX(-${items[currentIndex].offsetLeft}px)`;
            prevBtn.disabled = currentIndex === 0;
            nextBtn.disabled = maxIndex === 0;
        };

        prevBtn.addEventListener('click', () => {
            currentIndex = Math.max(currentIndex - 1, 0);
            updateCarousel();
        });

        nextBtn.addEventListener('click', () => {
            const maxIndex = Math.max(items.length - getVisibleItems(), 0);
            currentIndex = currentIndex === maxIndex ? 0 : currentIndex + 1;
            updateCarousel();
        });

        window.addEventListener('resize', updateCarousel);
        updateCarousel();
    });

    /* --------------------------------------------------------------------
     * 5. BROKEN IMAGE FALLBACK
     * Replaces any <img> that fails to load with a placeholder.
     * Also disables zooming for that element since the asset is missing.
     * ------------------------------------------------------------------ */
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function () {
            this.src = 'assets/img/wikimedia-noimg-500px.svg'; // fallback
            this.classList.add('img-fallback');                // flag for CSS theming
            this.parentElement.classList.remove('zoomable');   // disable zoom
        });

        // Handle images that already failed before this listener was attached
        if (img.complete && img.naturalWidth === 0 && img.src !== '') {
            img.src = 'assets/img/wikimedia-noimg-500px.svg'; // fallback
            img.classList.add('img-fallback');
            img.parentElement.classList.remove('zoomable');
        }
    });

    /* --------------------------------------------------------------------
     * 6. TAB SWITCHER LOGIC
     * Handles switching active states for buttons and panes, and updates
     * viewport focus seamlessly.
     * ------------------------------------------------------------------ */
    const tabControls = document.querySelectorAll('.tab-control');
    tabControls.forEach(control => {
        const buttons = control.querySelectorAll('.tab-btn');
        buttons.forEach(btn => {
            btn.addEventListener('click', () => {
                const targetSelector = btn.getAttribute('data-tab-target');
                const targetPane = document.querySelector(targetSelector);
                
                if (targetPane) {
                    // Deactivate all buttons in this tab group
                    buttons.forEach(b => b.classList.remove('active'));
                    // Resolve the pane container explicitly to avoid relying on
                    // parentElement, which breaks if wrapper divs are ever added.
                    const paneContainer = targetPane.closest('.tab-content-container');
                    if (paneContainer) {
                        paneContainer.querySelectorAll('.tab-pane')
                            .forEach(pane => pane.classList.remove('active'));
                    }
                    
                    // Activate this button & pane
                    btn.classList.add('active');
                    targetPane.classList.add('active');
                }
            });
        });
    });

    // Auto-switch tabs based on URL Hash for direct navbar links navigation
    const checkHashAndSwitchTabs = () => {
        const hash = window.location.hash;
        if (!hash) return;
        
        // Find if any tab pane matches the hash
        const targetPane = document.querySelector(hash);
        if (targetPane && targetPane.classList.contains('tab-pane')) {
            // Find corresponding tab button
            const targetBtn = document.querySelector(`.tab-btn[data-tab-target="${hash}"]`);
            if (targetBtn) {
                // Click it to trigger the tab switch logic
                targetBtn.click();
                
                // Scroll to the tab-control bar (not the full section) so the
                // active pane content is visible even with a fixed header.
                // Using scrollIntoView on the control row + a manual offset avoids
                // landing the content beneath the sticky nav.
                const tabControl = targetBtn.closest('.tab-control');
                const scrollTarget = tabControl || targetPane.closest('section');
                if (scrollTarget) {
                    scrollTarget.scrollIntoView({ behavior: 'smooth', block: 'start' });
                    // Nudge up by header height (~80px) so the tab bar clears the nav
                    setTimeout(() => window.scrollBy({ top: -80, behavior: 'smooth' }), 400);
                }
            }
        }
    };

    // Run on initial load and when hash changes
    window.addEventListener('hashchange', checkHashAndSwitchTabs);
    // Add a slight delay to allow the loading screen to fade out first
    setTimeout(checkHashAndSwitchTabs, 300);

});
