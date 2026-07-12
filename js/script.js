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

    // Hide loader after 2s max, or immediately if window is already loaded
    window.addEventListener('load', hideLoader);
    setTimeout(hideLoader, 2000); // Fallback timeout

    /* --------------------------------------------------------------------
     * 2. MOBILE NAVIGATION TOGGLER  (hamburger ⇄ close icon)
     * ------------------------------------------------------------------ */
    const navToggle = document.getElementById('nav-toggle'); // button element
    const navbar    = document.getElementById('navbar');     // ul/nav container

    navToggle.addEventListener('click', () => {
        /* Toggle .open on <nav> for CSS slide-in/out  ------------------- */
        navbar.classList.toggle('open');

        /* Swap the Font Awesome icon class for visual feedback ---------- */
        const icon = navToggle.querySelector('i');
        if (navbar.classList.contains('open')) {
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
            const icon = navToggle.querySelector('i'); // reset icon
            icon.classList.add   ('fa-bars');
            icon.classList.remove('fa-xmark');
        });
    });

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

    /* Also close modal if user clicks the darkened background itself
     * (but not if they click the image).
     */
    modal.addEventListener('click', (e) => {
        if (e.target === modal) { // ensure it’s the backdrop, not descendants
            modal.classList.remove('active');
        }
    });

    /* --------------------------------------------------------------------
     * 4. BROKEN IMAGE FALLBACK
     * Replaces any <img> that fails to load with a placeholder.
     * Also disables zooming for that element since the asset is missing.
     * ------------------------------------------------------------------ */
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function () {
            this.src = 'assets/img/wikimedia-noimg-500px.svg'; // fallback
            this.style.border = '1px solid white';              // visual debug
            this.parentElement.classList.remove('zoomable');   // disable zoom
        });

        // Handle images that already failed before this listener was attached
        if (img.complete && img.naturalWidth === 0 && img.src !== '') {
            img.src = 'assets/img/wikimedia-noimg-500px.svg'; // fallback
            img.style.border = '1px solid white';
            img.parentElement.classList.remove('zoomable');
        }
    });

    /* --------------------------------------------------------------------
     * 5. TAB SWITCHER LOGIC
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
                    // Deactivate all panes in the related container
                    const parentContainer = targetPane.parentElement;
                    const panes = parentContainer.querySelectorAll('.tab-pane');
                    panes.forEach(pane => pane.classList.remove('active'));
                    
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
                
                // Scroll to the parent section wrapper so user sees the section title
                const parentSection = targetPane.closest('section');
                if (parentSection) {
                    parentSection.scrollIntoView({ behavior: 'smooth' });
                }
            }
        }
    };

    // Run on initial load and when hash changes
    window.addEventListener('hashchange', checkHashAndSwitchTabs);
    // Add a slight delay to allow the loading screen to fade out first
    setTimeout(checkHashAndSwitchTabs, 300);

});