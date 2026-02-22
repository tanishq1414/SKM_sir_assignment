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
        const interactiveElements = document.querySelectorAll('a, button, .project-card, .skill-item, .blog-card, .social-icon, .timeline-item, .tech-tag, .filter-btn, .nav-link, .certification-card, .achievement-card');
        
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

    // Initialize Galaxy Effect
    initGalaxyEffect();

    // Counter Animation for Stats - FIXED VERSION
    const statNumbers = document.querySelectorAll('.stat-number');
    
    function animateStats() {
        statNumbers.forEach(stat => {
            const target = parseInt(stat.getAttribute('data-target'));
            if (isNaN(target)) return; // Skip if no target attribute
            
            let current = 0;
            const increment = target / 50; // Increment over 50 steps
            const duration = 2000; // 2 seconds total
            const stepTime = duration / 50; // Time per step in milliseconds
            
            // Start from 0
            stat.textContent = '0';
            
            function updateCounter() {
                current += increment;
                if (current < target) {
                    stat.textContent = Math.floor(current);
                    setTimeout(updateCounter, stepTime);
                } else {
                    stat.textContent = target;
                    
                    // Add a small animation effect when reaching target
                    stat.style.transform = 'scale(1.2)';
                    setTimeout(() => {
                        stat.style.transform = 'scale(1)';
                    }, 200);
                }
            }
            
            setTimeout(updateCounter, 100); // Small delay before starting
        });
    }

    // Reset stats to 0 initially
    function resetStats() {
        statNumbers.forEach(stat => {
            stat.textContent = '0';
        });
    }

    // Trigger stats animation when about section is visible
    const aboutSection = document.getElementById('about');
    let statsAnimated = false; // Flag to prevent multiple animations
    
    if (aboutSection) {
        const statsObserver = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting && !statsAnimated) {
                    // Reset to 0 first
                    resetStats();
                    // Then animate
                    animateStats();
                    statsAnimated = true;
                }
            });
        }, { threshold: 0.3 });
        
        statsObserver.observe(aboutSection);
    }

    // GSAP Scroll Animations
    if (typeof gsap !== 'undefined' && typeof ScrollTrigger !== 'undefined') {
        gsap.registerPlugin(ScrollTrigger);

        // Animate sections
        gsap.utils.toArray('.glass-card, .certification-card, .achievement-card, .stat-item').forEach((card) => {
            gsap.fromTo(card, 
                { y: 50, opacity: 0 },
                {
                    y: 0,
                    opacity: 1,
                    duration: 0.8,
                    scrollTrigger: {
                        trigger: card,
                        start: 'top 85%',
                        end: 'top 35%',
                        scrub: 0.5
                    }
                }
            );
        });

        // Parallax effect for certification and achievements sections
        gsap.utils.toArray('.parallax-bg').forEach(bg => {
            gsap.to(bg, {
                y: 100,
                ease: 'none',
                scrollTrigger: {
                    trigger: bg.parentElement,
                    start: 'top bottom',
                    end: 'bottom top',
                    scrub: true
                }
            });
        });

        // Animate timeline items
        gsap.utils.toArray('.timeline-item').forEach((item, index) => {
            gsap.fromTo(item,
                { x: -50, opacity: 0 },
                {
                    x: 0,
                    opacity: 1,
                    duration: 0.6,
                    delay: index * 0.2,
                    scrollTrigger: {
                        trigger: item,
                        start: 'top 80%',
                        end: 'top 30%',
                        scrub: 0.5
                    }
                }
            );
        });

        // Animate tech tags
        gsap.utils.toArray('.tech-tag').forEach((tag, index) => {
            gsap.fromTo(tag,
                { scale: 0, opacity: 0 },
                {
                    scale: 1,
                    opacity: 1,
                    duration: 0.4,
                    delay: index * 0.05,
                    scrollTrigger: {
                        trigger: tag.closest('.about-content'),
                        start: 'top 70%',
                        end: 'bottom 30%',
                        toggleActions: 'play none none reverse'
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
                                { scale: 0.8, opacity: 0, y: 20 },
                                { 
                                    scale: 1, 
                                    opacity: 1, 
                                    y: 0,
                                    duration: 0.5,
                                    ease: 'back.out(1.2)'
                                }
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
                effect: 'fade',
                fadeEffect: {
                    crossFade: true
                },
                breakpoints: {
                    768: {
                        slidesPerView: 2,
                        effect: 'slide'
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
            
            // Animate form submission
            gsap.to(formFields, {
                opacity: 0,
                scale: 0.95,
                duration: 0.3,
                onComplete: () => {
                    formFields.style.display = 'none';
                    successMessage.classList.remove('hidden');
                    
                    // Animate success message
                    gsap.fromTo(successMessage,
                        { scale: 0.8, opacity: 0, y: 20 },
                        { scale: 1, opacity: 1, y: 0, duration: 0.5, ease: 'back.out(1.2)' }
                    );
                }
            });
            
            setTimeout(() => {
                gsap.to(successMessage, {
                    opacity: 0,
                    scale: 0.95,
                    duration: 0.3,
                    onComplete: () => {
                        formFields.style.display = 'block';
                        successMessage.classList.add('hidden');
                        contactForm.reset();
                        
                        gsap.fromTo(formFields,
                            { opacity: 0, scale: 0.95, y: 20 },
                            { opacity: 1, scale: 1, y: 0, duration: 0.5, ease: 'back.out(1.2)' }
                        );
                    }
                });
            }, 3000);
        });
    }

    // Live Demo Notification
    document.querySelectorAll('.live-demo').forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            
            // Create custom notification
            const notification = document.createElement('div');
            notification.className = 'custom-notification';
            notification.innerHTML = '🌟 Live demo coming soon! Check back later.';
            notification.style.cssText = `
                position: fixed;
                bottom: 20px;
                left: 50%;
                transform: translateX(-50%);
                background: var(--gradient-1);
                color: white;
                padding: 1rem 2rem;
                border-radius: 50px;
                font-size: 1rem;
                z-index: 10000;
                box-shadow: var(--neon-glow);
                animation: slideUp 0.3s ease;
            `;
            
            document.body.appendChild(notification);
            
            setTimeout(() => {
                notification.style.animation = 'slideDown 0.3s ease';
                setTimeout(() => {
                    notification.remove();
                }, 300);
            }, 3000);
        });
    });

    // Add keyframe animations for notifications
    const style = document.createElement('style');
    style.textContent = `
        @keyframes slideUp {
            from { transform: translateX(-50%) translateY(100px); opacity: 0; }
            to { transform: translateX(-50%) translateY(0); opacity: 1; }
        }
        @keyframes slideDown {
            from { transform: translateX(-50%) translateY(0); opacity: 1; }
            to { transform: translateX(-50%) translateY(100px); opacity: 0; }
        }
    `;
    document.head.appendChild(style);

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

    // Add hover effect for stat items
    document.querySelectorAll('.stat-item').forEach(item => {
        item.addEventListener('mouseenter', () => {
            gsap.to(item, {
                scale: 1.05,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
        
        item.addEventListener('mouseleave', () => {
            gsap.to(item, {
                scale: 1,
                duration: 0.3,
                ease: 'power2.out'
            });
        });
    });

    console.log('✨ Portfolio Initialized with Galaxy Effect - Purple-Magenta-Blue Theme');
});

// Galaxy Effect for Background
function initGalaxyEffect() {
    const container = document.getElementById('galaxy-container');
    if (!container) {
        console.log('Galaxy container not found');
        return;
    }
    
    // Check if Three.js is available
    if (typeof THREE === 'undefined') {
        console.log('Three.js not loaded, using fallback gradient background');
        // Fallback gradient animation
        let hue = 260; // Start with purple
        setInterval(() => {
            hue = (hue + 0.1) % 360;
            container.style.background = `radial-gradient(circle at center, hsl(${hue}, 80%, 20%), hsl(${hue - 20}, 80%, 10%))`;
        }, 50);
        return;
    }

    // Check if WebGL is supported
    const canvas = document.createElement('canvas');
    const gl = canvas.getContext('webgl') || canvas.getContext('experimental-webgl');
    if (!gl) {
        console.log('WebGL not supported, using fallback gradient background');
        // Fallback gradient animation
        let hue = 260;
        setInterval(() => {
            hue = (hue + 0.1) % 360;
            container.style.background = `radial-gradient(circle at center, hsl(${hue}, 80%, 20%), hsl(${hue - 20}, 80%, 10%))`;
        }, 50);
        return;
    }

    // Vertex Shader
    const vertexShader = `
        attribute vec2 uv;
        attribute vec2 position;
        varying vec2 vUv;
        void main() {
            vUv = uv;
            gl_Position = vec4(position, 0, 1);
        }
    `;

    // Fragment Shader (simplified for better performance)
    const fragmentShader = `
        precision highp float;
        
        uniform float uTime;
        uniform vec2 uResolution;
        uniform vec2 uMouse;
        
        varying vec2 vUv;
        
        float random(vec2 st) {
            return fract(sin(dot(st.xy, vec2(12.9898,78.233))) * 43758.5453123);
        }
        
        void main() {
            vec2 uv = vUv;
            
            // Create star field
            float stars = 0.0;
            vec2 grid = uv * 20.0;
            vec2 gv = fract(grid) - 0.5;
            vec2 id = floor(grid);
            
            float r = random(id);
            float brightness = sin(uTime * 2.0 + r * 10.0) * 0.5 + 0.5;
            
            float dist = length(gv);
            float star = 0.02 / dist * brightness;
            stars += star * step(random(id), 0.3);
            
            // Purple-magenta-blue gradient
            vec3 color1 = vec3(0.42, 0.36, 0.91); // #6c5ce7
            vec3 color2 = vec3(0.62, 0.39, 0.96); // #9d4edd
            vec3 color3 = vec3(0.29, 0.56, 0.89); // #4a90e2
            
            vec3 bg = mix(color1, color2, uv.x);
            bg = mix(bg, color3, uv.y);
            
            // Mouse interaction
            float mouseDist = distance(uv, uMouse);
            bg += vec3(0.2, 0.1, 0.3) * (0.1 / (mouseDist + 0.1));
            
            vec3 finalColor = bg + vec3(stars * 2.0);
            
            gl_FragColor = vec4(finalColor, 1.0);
        }
    `;

    try {
        // Setup WebGL
        const renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(container.clientWidth, container.clientHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
        container.appendChild(canvas);

        // Create shader material
        const material = new THREE.ShaderMaterial({
            vertexShader: vertexShader,
            fragmentShader: fragmentShader,
            uniforms: {
                uTime: { value: 0 },
                uResolution: { value: [container.clientWidth, container.clientHeight] },
                uMouse: { value: [0.5, 0.5] }
            },
            transparent: true
        });

        // Create fullscreen quad
        const geometry = new THREE.PlaneGeometry(2, 2);
        const mesh = new THREE.Mesh(geometry, material);
        
        const scene = new THREE.Scene();
        scene.add(mesh);
        
        const camera = new THREE.OrthographicCamera(-1, 1, 1, -1, 0.1, 10);
        camera.position.z = 1;

        // Mouse interaction
        const targetMousePos = { x: 0.5, y: 0.5 };
        const smoothMousePos = { x: 0.5, y: 0.5 };

        container.addEventListener('mousemove', (e) => {
            const rect = container.getBoundingClientRect();
            const x = (e.clientX - rect.left) / rect.width;
            const y = 1.0 - (e.clientY - rect.top) / rect.height;
            targetMousePos.x = x;
            targetMousePos.y = y;
        });

        // Resize handler
        function resize() {
            const width = container.clientWidth;
            const height = container.clientHeight;
            
            renderer.setSize(width, height);
            material.uniforms.uResolution.value = [width, height];
        }
        
        window.addEventListener('resize', resize);

        // Animation loop
        let animationFrame;
        let startTime = performance.now();

        function animate() {
            animationFrame = requestAnimationFrame(animate);
            
            const time = (performance.now() - startTime) * 0.001;
            
            // Smooth mouse movement
            const lerpFactor = 0.05;
            smoothMousePos.x += (targetMousePos.x - smoothMousePos.x) * lerpFactor;
            smoothMousePos.y += (targetMousePos.y - smoothMousePos.y) * lerpFactor;
            
            // Update uniforms
            material.uniforms.uTime.value = time;
            material.uniforms.uMouse.value = [smoothMousePos.x, smoothMousePos.y];
            
            renderer.render(scene, camera);
        }
        
        animate();

        // Cleanup on page unload
        window.addEventListener('beforeunload', () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
            renderer.dispose();
        });
    } catch (error) {
        console.log('WebGL initialization error:', error);
        // Fallback gradient animation
        let hue = 260;
        setInterval(() => {
            hue = (hue + 0.1) % 360;
            container.style.background = `radial-gradient(circle at center, hsl(${hue}, 80%, 20%), hsl(${hue - 20}, 80%, 10%))`;
        }, 50);
    }
}
