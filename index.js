document.addEventListener("DOMContentLoaded", () => {
    
    // 1. Loading Screen Logic
    const loader = document.getElementById('loading');
    setTimeout(() => {
        loader.style.opacity = '0';
        setTimeout(() => loader.style.display = 'none', 500);
    }, 1000); // Slight delay to smooth transition

    // 2. Mobile Navigation Toggle
    const navToggle = document.getElementById('nav-toggle');
    const navbar = document.getElementById('navbar');
    
    navToggle.addEventListener('click', () => {
        navbar.classList.toggle('open');
        // Toggle icon between bars and times (X)
        const icon = navToggle.querySelector('i');
        if (navbar.classList.contains('open')) {
            icon.classList.remove('fa-bars');
            icon.classList.add('fa-xmark');
        } else {
            icon.classList.remove('fa-xmark');
            icon.classList.add('fa-bars');
        }
    });

    // Close menu when a link is clicked
    navbar.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', () => {
            navbar.classList.remove('open');
            navToggle.querySelector('i').classList.add('fa-bars');
            navToggle.querySelector('i').classList.remove('fa-xmark');
        });
    });

    // 3. Fullscreen Image Logic
    const modal = document.getElementById('fullscreen-modal');
    const modalImg = document.getElementById('modal-img');
    const closeModal = document.querySelector('.close-modal');

    // Attach click event to all elements with class 'zoomable'
    // This allows us to handle both the wrapper div or specific images
    document.querySelectorAll('.zoomable').forEach(item => {
        item.addEventListener('click', function(e) {
            // Check if the clicked element is the img or the wrapper
            const targetImg = e.target.tagName === 'IMG' ? e.target : this.querySelector('img');
            
            // Get the high-res source from data-full attribute, fallback to src
            const src = targetImg.getAttribute('data-full') || targetImg.src;
            
            modalImg.src = src;
            modal.classList.add('active');
        });
    });

    // Close Modal Logic
    closeModal.addEventListener('click', () => {
        modal.classList.remove('active');
        modalImg.src = ''; // Clear src to prevent ghosting
    });

    // Close on background click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.classList.remove('active');
        }
    });

    // 4. Broken Image Handling
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            this.src = 'assets/img/wikimedia-noimg-500px.svg'; // Ensure this file exists
            this.style.border = '2px dashed red'; // Visual indicator for debug
            this.parentElement.classList.remove('zoomable'); // Disable zoom for broken images
        });
    });

    // 5. Disable Context Menu (Right Click) - Optional
    document.addEventListener('contextmenu', event => event.preventDefault());
});