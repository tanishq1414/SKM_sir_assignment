// Initialize everything when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    // Loader Animation
    const loader = document.getElementById('loader');
    const loaderProgress = document.getElementById('loader-progress-bar');
    let progress = 0;
    
    const progressInterval = setInterval(() => {
        progress += Math.random() * 30;
        if (progress >= 100) {
            progress = 100;
            clearInterval(progressInterval);
            
            setTimeout(() => {
                loader.classList.add('hidden');
            }, 500);
        }
        loaderProgress.style.width = progress + '%';
    }, 200);

    // Custom Cursor
    const cursor = document.getElementById('cursor');
    const cursorFollower = document.getElementById('cursor-follower');

    if (cursor && cursorFollower) {
        document.addEventListener('mousemove', (e) => {
            gsap.to(cursor, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.1
            });
            
            gsap.to(cursorFollower, {
                x: e.clientX,
                y: e.clientY,
                duration: 0.3
            });
        });

        // Hover effect on interactive elements
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-item, .blog-card, .social-icon, .timeline-item, .tech-tag, .filter-btn, .nav-link');
        
        interactiveElements.forEach(el => {
            el.addEventListener('mouseenter', () => {
                gsap.to(cursor, {
                    scale: 1.5,
                    backgroundColor: 'rgba(108, 92, 231, 0.5)',
                    duration: 0.3
                });
                gsap.to(cursorFollower, {
                    scale: 2,
                    duration: 0.3
                });
            });
            
            el.addEventListener('mouseleave', () => {
                gsap.to(cursor, {
                    scale: 1,
                    backgroundColor: 'transparent',
                    duration: 0.3
                });
                gsap.to(cursorFollower, {
                    scale: 1,
                    duration: 0.3
                });
            });
        });
    }

    // Scroll Progress
    const scrollProgress = document.getElementById('scroll-progress');
    
    if (scrollProgress) {
        window.addEventListener('scroll', () => {
            const scrollTop = document.documentElement.scrollTop;
            const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
            const progress = scrollTop / scrollHeight;
            scrollProgress.style.transform = `scaleX(${progress})`;
        });
    }

    // Navbar Visibility
    const navbar = document.getElementById('navbar');
    
    if (navbar) {
        window.addEventListener('scroll', () => {
            if (window.scrollY > 100) {
                navbar.classList.add('visible');
            } else {
                navbar.classList.remove('visible');
            }
        });
    }

    // Mobile Menu
    const hamburger = document.getElementById('hamburger');
    const navLinks = document.getElementById('navLinks');

    if (hamburger && navLinks) {
        hamburger.addEventListener('click', () => {
            navLinks.classList.toggle('active');
            
            // Change icon based on menu state
            const icon = hamburger.querySelector('i');
            if (navLinks.classList.contains('active')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Smooth Scroll for Navigation
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const target = document.querySelector(targetId);
            if (target) {
                target.scrollIntoView({ behavior: 'smooth' });
                
                // Close mobile menu if open
                if (navLinks && navLinks.classList.contains('active')) {
                    navLinks.classList.remove('active');
                    const icon = hamburger?.querySelector('i');
                    if (icon) {
                        icon.classList.remove('fa-times');
                        icon.classList.add('fa-bars');
                    }
                }
            }
        });
    });

    // Intersection Observer for Section Reveal
    const sections = document.querySelectorAll('section');
    
    if (sections.length > 0) {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('visible');
                    
                    // Update active nav link
                    const id = entry.target.getAttribute('id');
                    document.querySelectorAll('.nav-link').forEach(link => {
                        link.classList.remove('active');
                        if (link.getAttribute('href') === `#${id}`) {
                            link.classList.add('active');
                        }
                    });
                }
            });
        }, { threshold: 0.1, rootMargin: '0px' });

        sections.forEach(section => observer.observe(section));
    }

    // Particles Background with Three.js
    const canvas = document.getElementById('particles-canvas');
    if (canvas && typeof THREE !== 'undefined') {
        try {
            const scene = new THREE.Scene();
            const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
            const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true });
            
            renderer.setSize(window.innerWidth, window.innerHeight);
            renderer.setPixelRatio(window.devicePixelRatio);

            // Create particles
            const particlesGeometry = new THREE.BufferGeometry();
            const particlesCount = 2000;
            const posArray = new Float32Array(particlesCount * 3);
            
            for (let i = 0; i < particlesCount * 3; i += 3) {
                posArray[i] = (Math.random() - 0.5) * 100;
                posArray[i + 1] = (Math.random() - 0.5) * 100;
                posArray[i + 2] = (Math.random() - 0.5) * 100;
            }
            
            particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
            
            // Purple-Magenta-Blue colors
            const colors = [0x6c5ce7, 0xa463f5, 0x9d4edd, 0x4a90e2, 0x00b4d8];
            const colorArray = new Float32Array(particlesCount * 3);
            
            for (let i = 0; i < particlesCount; i++) {
                const color = new THREE.Color(colors[Math.floor(Math.random() * colors.length)]);
                colorArray[i * 3] = color.r;
                colorArray[i * 3 + 1] = color.g;
                colorArray[i * 3 + 2] = color.b;
            }
            
            particlesGeometry.setAttribute('color', new THREE.BufferAttribute(colorArray, 3));
            
            const particlesMaterial = new THREE.PointsMaterial({
                size: 0.02,
                vertexColors: true,
                transparent: true,
                blending: THREE.AdditiveBlending
            });
            
            const particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
            scene.add(particlesMesh);

            camera.position.z = 30;

            // Animation
            function animateParticles() {
                requestAnimationFrame(animateParticles);
                
                particlesMesh.rotation.y += 0.0002;
                particlesMesh.rotation.x += 0.0001;
                
                renderer.render(scene, camera);
            }
            
            animateParticles();

            // Resize handler
            window.addEventListener('resize', () => {
                camera.aspect = window.innerWidth / window.innerHeight;
                camera.updateProjectionMatrix();
                renderer.setSize(window.innerWidth, window.innerHeight);
            });
        } catch (error) {
            console.log('Three.js initialization error:', error);
        }
    }

    // GSAP Scroll Animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Animate sections
        gsap.utils.toArray('.glass-card').forEach((card) => {
            gsap.fromTo(card, 
                { y: 100, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 1,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 80%',
                        end: 'top 30%',
                        scrub: 1
                    }
                }
            );
        });
    }

    // Project Filter
    const filterBtns = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    if (filterBtns.length > 0 && projectCards.length > 0) {
        filterBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                filterBtns.forEach(b => b.classList.remove('active'));
                btn.classList.add('active');
                
                const filter = btn.dataset.filter;
                
                projectCards.forEach(card => {
                    if (filter === 'all' || card.dataset.category === filter) {
                        card.classList.remove('hidden');
                        if (typeof gsap !== 'undefined') {
                            gsap.fromTo(card, 
                                { scale: 0.8, opacity: 0 },
                                { scale: 1, opacity: 1, duration: 0.5 }
                            );
                        }
                    } else {
                        card.classList.add('hidden');
                    }
                });
            });
        });
    }

    // Testimonials Carousel
    if (typeof Swiper !== 'undefined') {
        try {
            const swiper = new Swiper('.testimonials-carousel', {
                slidesPerView: 1,
                spaceBetween: 30,
                loop: true,
                autoplay: {
                    delay: 5000,
                    disableOnInteraction: false,
                },
                pagination: {
                    el: '.swiper-pagination',
                    clickable: true,
                },
                breakpoints: {
                    768: {
                        slidesPerView: 2,
                    },
                },
            });
        } catch (error) {
            console.log('Swiper initialization error:', error);
        }
    }

    // Form Submission
    const contactForm = document.getElementById('contactForm');
    const formFields = document.getElementById('formFields');
    const successMessage = document.getElementById('successMessage');

    if (contactForm && formFields && successMessage) {
        contactForm.addEventListener('submit', (e) => {
            e.preventDefault();
            
            formFields.style.display = 'none';
            successMessage.classList.remove('hidden');
            
            setTimeout(() => {
                formFields.style.display = 'block';
                successMessage.classList.add('hidden');
                contactForm.reset();
            }, 3000);
        });
    }

    // Live Demo Notification
    document.querySelectorAll('.live-demo').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            alert('🌟 Live demo coming soon! Check back later.');
        });
    });

    // 404 Page Handling
    const errorPage = document.getElementById('errorPage');
    const mainContainer = document.querySelector('.main-container');
    
    if (errorPage && mainContainer) {
        // Check if current path is 404 (for demo purposes)
        if (window.location.pathname.includes('404') || window.location.pathname.includes('error')) {
            mainContainer.style.display = 'none';
            errorPage.style.display = 'flex';
        }
    }

    // Image error handling with fallback
    function handleImageError(img) {
        if (!img.hasAttribute('data-fallback-attempted')) {
            img.setAttribute('data-fallback-attempted', 'true');
            
            if (img.alt.includes('Tanishq')) {
                img.src = 'https://via.placeholder.com/400x400/6c5ce7/ffffff?text=TK';
            } else if (img.alt === 'Garv' || img.alt === 'Gaurav') {
                img.src = 'https://via.placeholder.com/100x100/6c5ce7/ffffff?text=' + img.alt.charAt(0);
            } else if (img.alt === 'Client') {
                img.src = 'https://via.placeholder.com/100x100/6c5ce7/ffffff?text=U';
            } else if (img.classList.contains('profile-img') || img.classList.contains('about-img')) {
                img.src = 'https://via.placeholder.com/600x400/6c5ce7/ffffff?text=Tanishq+Kumar';
            } else {
                img.src = 'https://via.placeholder.com/300x200/6c5ce7/ffffff?text=Image+Not+Found';
            }
        }
    }

    // Add error handlers to all images
    document.querySelectorAll('img').forEach(img => {
        img.addEventListener('error', function() {
            handleImageError(this);
        });
        
        // Check if image is already loaded with error
        if (img.complete && img.naturalHeight === 0) {
            handleImageError(img);
        }
    });

    // Active nav link on scroll
    window.addEventListener('scroll', () => {
        const scrollPosition = window.scrollY + 100;
        
        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionBottom = sectionTop + section.offsetHeight;
            const sectionId = section.getAttribute('id');
            
            if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
                document.querySelectorAll('.nav-link').forEach(link => {
                    link.classList.remove('active');
                    if (link.getAttribute('href') === `#${sectionId}`) {
                        link.classList.add('active');
                    }
                });
            }
        });
    });

    console.log('✨ Portfolio Initialized - Purple-Magenta-Blue Theme');
});