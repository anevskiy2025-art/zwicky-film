document.addEventListener('DOMContentLoaded', () => {

    /* ==========================================================================
       1. Global Helper Functions
       ========================================================================== */
    
    // Smooth scroll helper
    const scrollToTop = () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    };

    /* ==========================================================================
       2. Sticky Header Scroll Effect
       ========================================================================== */
    const header = document.getElementById('siteHeader');
    window.addEventListener('scroll', () => {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    /* ==========================================================================
       3. Mobile Navigation Menu Toggle
       ========================================================================== */
    const menuToggle = document.getElementById('menuToggle');
    const navMenuMobile = document.getElementById('navMenuMobile');

    if (menuToggle && navMenuMobile) {
        menuToggle.addEventListener('click', (e) => {
            e.stopPropagation();
            header.classList.toggle('menu-open');
        });

        // Close mobile menu when clicking outside
        document.addEventListener('click', (e) => {
            if (header.classList.contains('menu-open') && !header.contains(e.target)) {
                header.classList.remove('menu-open');
            }
        });
    }

    /* ==========================================================================
       4. Single-Page App (SPA) Dynamic Routing
       ========================================================================== */
    const pages = {
        'home': document.getElementById('homePage'),
        'portfolio': document.getElementById('homePage'), // Portfolio resides inside home section
        'project-detail': document.getElementById('projectDetailPage'),
        'about': document.getElementById('aboutPage'),
        'contact': document.getElementById('contactPage')
    };

    const navItems = document.querySelectorAll('.nav-item, .nav-logo a, .nav-menu-mobile li, .btn-back-portfolio, .portfolio-cta a, .cta-banner-row a, .footer-nav li, .hero-content a, .footer-logo a');

    function navigateToPage(targetId) {
        // Handle mobile menu cleanup
        header.classList.remove('menu-open');

        // Hide all page sections
        Object.values(pages).forEach(page => {
            if (page) {
                page.classList.remove('active');
                page.style.display = 'none';
            }
        });

        // Display targeted page section
        const targetPage = pages[targetId];
        if (targetPage) {
            targetPage.style.display = 'block';
            // Trigger browser reflow for CSS transition
            void targetPage.offsetWidth;
            targetPage.classList.add('active');
        }

        // Synchronize Active Header Links
        document.querySelectorAll('.nav-item').forEach(item => {
            item.classList.remove('active');
            if (item.getAttribute('data-target') === targetId) {
                item.classList.add('active');
            }
        });

        // Special case: navigation item for portfolio is technically part of the home page section
        if (targetId === 'portfolio') {
            document.querySelectorAll('.nav-item').forEach(item => {
                if (item.getAttribute('data-target') === 'portfolio') {
                    item.classList.add('active');
                }
            });
            
            // Scroll down to portfolio section
            setTimeout(() => {
                const portfolioSec = document.getElementById('portfolioSection');
                if (portfolioSec) {
                    portfolioSec.scrollIntoView({ behavior: 'smooth' });
                }
            }, 100);
        } else {
            // Scroll back to top for new pages
            scrollToTop();
        }

        // Update URL hash without breaking history back-button logic
        if (window.location.hash !== `#${targetId}`) {
            history.pushState(null, null, `#${targetId}`);
        }
    }

    // Attach click events to nav links/buttons
    navItems.forEach(item => {
        item.addEventListener('click', (e) => {
            const targetId = item.getAttribute('data-target') || item.parentElement.getAttribute('data-target');
            if (targetId && pages[targetId]) {
                e.preventDefault();
                navigateToPage(targetId);
            }
        });
    });

    // Handle browser back/forward and initial page loads
    const handleInitialRoute = () => {
        const hash = window.location.hash.replace('#', '');
        if (hash && pages[hash]) {
            navigateToPage(hash);
        } else {
            navigateToPage('home');
        }
    };

    window.addEventListener('popstate', handleInitialRoute);
    handleInitialRoute(); // Check hash state on boot

    /* ==========================================================================
       5. Interactive Portfolio Category Filter
       ========================================================================== */
    const filterButtons = document.querySelectorAll('.filter-btn');
    const portfolioCards = document.querySelectorAll('.portfolio-card');

    filterButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            // Set active class on active button
            filterButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const filterValue = btn.getAttribute('data-filter');

            portfolioCards.forEach(card => {
                const category = card.getAttribute('data-category');
                
                // Reset card scale and fade states
                card.style.opacity = '0';
                card.style.transform = 'scale(0.95) translateY(10px)';
                
                setTimeout(() => {
                    if (filterValue === 'all' || category === filterValue) {
                        card.style.display = 'block';
                        void card.offsetWidth; // Reflow
                        card.style.opacity = '1';
                        card.style.transform = 'scale(1) translateY(0)';
                    } else {
                        card.style.display = 'none';
                    }
                }, 300);
            });
        });
    });

    /* ==========================================================================
       6. Interactive FAQ Accordion
       ========================================================================== */
    const faqItems = document.querySelectorAll('.faq-item');

    faqItems.forEach(item => {
        const button = item.querySelector('.faq-question-btn');
        const answer = item.querySelector('.faq-answer');

        button.addEventListener('click', () => {
            const isOpen = item.classList.contains('active');

            // Close other items
            faqItems.forEach(otherItem => {
                otherItem.classList.remove('active');
                otherItem.querySelector('.faq-answer').style.maxHeight = null;
            });

            // Toggle target item
            if (!isOpen) {
                item.classList.add('active');
                answer.style.maxHeight = answer.scrollHeight + 'px';
            } else {
                item.classList.remove('active');
                answer.style.maxHeight = null;
            }
        });
    });

    /* ==========================================================================
       7. Cinematic Video Player Modal
       ========================================================================== */
    const videoModal = document.getElementById('videoModal');
    const videoModalClose = document.getElementById('videoModalClose');
    const iframeContainer = document.getElementById('videoIframeContainer');
    const playButtons = document.querySelectorAll('[data-video], .play-video-btn');

    const openVideoModal = (vimeoId) => {
        if (!vimeoId) return;
        
        // Build responsive Vimeo embedded link
        const embedUrl = `https://player.vimeo.com/video/${vimeoId}?autoplay=1&color=c1aa87&title=0&byline=0&portrait=0`;
        
        iframeContainer.innerHTML = `
            <iframe 
                src="${embedUrl}" 
                width="100%" 
                height="100%" 
                frameborder="0" 
                allow="autoplay; fullscreen; picture-in-picture" 
                allowfullscreen>
            </iframe>
        `;
        
        videoModal.classList.add('active');
        document.body.style.overflow = 'hidden'; // Lock background scrolling
    };

    const closeVideoModal = () => {
        videoModal.classList.remove('active');
        document.body.style.overflow = ''; // Unlock background scrolling
        // Destroy iframe to stop video playback audio instantly
        setTimeout(() => {
            iframeContainer.innerHTML = '';
        }, 300);
    };

    playButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.stopPropagation();
            const vimeoId = btn.getAttribute('data-video');
            openVideoModal(vimeoId);
        });
    });

    if (videoModalClose) videoModalClose.addEventListener('click', closeVideoModal);
    if (videoModal) {
        videoModal.addEventListener('click', (e) => {
            if (e.target === videoModal) {
                closeVideoModal();
            }
        });
    }

    // Capture ESC key to close player modal
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && videoModal.classList.contains('active')) {
            closeVideoModal();
        }
    });

    /* ==========================================================================
       8. Scroll Reveal Animations (Intersection Observer)
       ========================================================================== */
    const revealElements = document.querySelectorAll('.reveal');

    if ('IntersectionObserver' in window) {
        const revealObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('revealed');
                    observer.unobserve(entry.target); // Unwatch once animated
                }
            });
        }, {
            threshold: 0.12,
            rootMargin: '0px 0px -50px 0px'
        });

        revealElements.forEach(el => revealObserver.observe(el));
    } else {
        // Observer Fallback
        revealElements.forEach(el => el.classList.add('revealed'));
    }

    /* ==========================================================================
       9. Form Validation & Success Toast Notification
       ========================================================================== */
    const bookingForm = document.getElementById('bookingForm');
    const toastContainer = document.getElementById('toastContainer');
    const dateNotSetCheckbox = document.getElementById('dateNotSet');
    const weddingDateInput = document.getElementById('weddingDate');

    // Handle date validation toggle if "Date not set" checked
    if (dateNotSetCheckbox && weddingDateInput) {
        dateNotSetCheckbox.addEventListener('change', () => {
            if (dateNotSetCheckbox.checked) {
                weddingDateInput.disabled = true;
                weddingDateInput.value = '';
                weddingDateInput.removeAttribute('required');
                weddingDateInput.style.opacity = '0.5';
            } else {
                weddingDateInput.disabled = false;
                weddingDateInput.setAttribute('required', 'required');
                weddingDateInput.style.opacity = '1';
            }
        });
    }

    // Display visually premium toast message
    const showToast = (title, message) => {
        const toast = document.createElement('div');
        toast.className = 'toast';
        
        toast.innerHTML = `
            <div class="toast-success-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="20 6 9 17 4 12"></polyline></svg>
            </div>
            <div class="toast-text">
                <h4>${title}</h4>
                <p>${message}</p>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        // Trigger transitions
        void toast.offsetWidth;
        toast.classList.add('show');

        // Automatic dismissal
        setTimeout(() => {
            toast.classList.remove('show');
            setTimeout(() => {
                toast.remove();
            }, 400);
        }, 4000);
    };

    // Client Form submission
    if (bookingForm) {
        bookingForm.addEventListener('submit', (e) => {
            e.preventDefault();

            const name = document.getElementById('fullName').value.trim();
            const email = document.getElementById('emailAddress').value.trim();
            const date = weddingDateInput.value;
            const notSet = dateNotSetCheckbox ? dateNotSetCheckbox.checked : false;

            // Simple validations
            if (!name) {
                alert('Please enter your full name.');
                return;
            }
            if (!email || !email.includes('@')) {
                alert('Please enter a valid email address.');
                return;
            }
            if (!notSet && !date) {
                alert('Please select a wedding date or check the date is not set.');
                return;
            }

            // Simulate server delivery logic
            const submitBtn = bookingForm.querySelector('button[type="submit"]');
            const originalText = submitBtn.textContent;
            submitBtn.textContent = 'Sending...';
            submitBtn.disabled = true;

            setTimeout(() => {
                // Restore button
                submitBtn.textContent = originalText;
                submitBtn.disabled = false;

                // Fire premium success toast
                showToast(
                    'Inquiry Sent Successfully!',
                    `Thank you, ${name}. Denis will respond within 24 hours.`
                );

                // Reset Form state
                bookingForm.reset();
                if (dateNotSetCheckbox && weddingDateInput) {
                    weddingDateInput.disabled = false;
                    weddingDateInput.setAttribute('required', 'required');
                    weddingDateInput.style.opacity = '1';
                }
            }, 1200);
        });
    }

});
