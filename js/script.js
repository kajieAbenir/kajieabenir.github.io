/* ---------------------------------------------------------------------------
 * MAIN CLIENT-SIDE SCRIPT
 * The whole file runs once the DOM is fully parsed (DOMContentLoaded).
 * Each numbered section below groups a distinct piece of UI/UX behavior.
 * ------------------------------------------------------------------------ */

// Wait until the DOM tree is fully constructed before touching it.
document.addEventListener("DOMContentLoaded", () => {

    /* --------------------------------------------------------------------
     * 1. LOADING SCREEN / SPLASH FADE-OUT
     * ------------------------------------------------------------------ */
    const loader = document.getElementById('loading');      // Overlay element
    /* We create a two-step fade:
     *   1) Lower opacity after 1 s            (smooth transition)
     *   2) Remove from the layout after 0.5 s (so it’s not clickable)
     */
    setTimeout(() => {
        loader.style.opacity = '0';                         // start fade
        setTimeout(() => loader.style.display = 'none', 500); // remove node
    }, 2000); // 2 second delay to give browsers time to render initial visuals

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
            this.style.border = '2px dashed red';              // visual debug
            this.parentElement.classList.remove('zoomable');   // disable zoom
        });
    });

    /* --------------------------------------------------------------------
     * 5. (OPTIONAL) DISABLE RIGHT-CLICK CONTEXT MENU
     *
     * Uncomment the line below if you wish to reduce casual image saving.
     * Keep in mind this is UX-unfriendly and trivial to bypass.
     * ------------------------------------------------------------------ */
    // document.addEventListener('contextmenu', event => event.preventDefault());

});

// // Save scroll position before leaving
// window.addEventListener('beforeunload', () => {
//   sessionStorage.setItem('scrollPos', window.scrollY);
// });

// // Restore scroll position when returning
// window.addEventListener('load', () => {
//   const scrollPos = sessionStorage.getItem('scrollPos');
//   if (scrollPos) {
//     window.scrollTo(0, parseInt(scrollPos));
//   }
// });