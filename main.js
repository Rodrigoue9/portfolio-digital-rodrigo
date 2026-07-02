/* ==========================================================================
   RODRIGO FLÁVIO - INTERACTIVE & MOTION WEB LOGIC
   ========================================================================== */

document.addEventListener('DOMContentLoaded', () => {
    initCursor();
    initTheme();
    initMobileNav();
    initThreeJSBackground();
    initGSAPAnimations();
    initContactForm();
});

/* ==========================================================================
   CUSTOM GLOWING CURSOR
   ========================================================================== */
function initCursor() {
    const cursor = document.querySelector('.custom-cursor');
    const cursorGlow = document.querySelector('.custom-cursor-glow');
    
    let mouseX = 0, mouseY = 0; // Actual mouse positions
    let cursorX = 0, cursorY = 0; // Lerped cursor positions
    let glowX = 0, glowY = 0; // Lerped glow positions
    
    document.addEventListener('mousemove', (e) => {
        mouseX = e.clientX;
        mouseY = e.clientY;
        
        // Show cursor elements once mouse moves
        if (cursor.style.opacity === '' || cursor.style.opacity === '0') {
            cursor.style.opacity = '1';
            cursorGlow.style.opacity = '1';
        }
    });
    
    // Hide/show cursor when leaving/entering window
    document.addEventListener('mouseleave', () => {
        cursor.style.opacity = '0';
        cursorGlow.style.opacity = '0';
    });
    document.addEventListener('mouseenter', () => {
        cursor.style.opacity = '1';
        cursorGlow.style.opacity = '1';
    });
    
    // Smooth lerp loop
    function animateCursor() {
        // Lerp for inner cursor (fast follow)
        cursorX += (mouseX - cursorX) * 0.25;
        cursorY += (mouseY - cursorY) * 0.25;
        
        // Lerp for outer glow (deliberate lag for premium feel)
        glowX += (mouseX - glowX) * 0.12;
        glowY += (mouseY - glowY) * 0.12;
        
        cursor.style.left = `${cursorX}px`;
        cursor.style.top = `${cursorY}px`;
        
        cursorGlow.style.left = `${glowX}px`;
        cursorGlow.style.top = `${glowY}px`;
        
        requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
    
    // Add hover states to links
    const interactiveElements = document.querySelectorAll('a, button, select, input, textarea, .project-card, .expertise-card');
    interactiveElements.forEach(el => {
        el.addEventListener('mouseenter', () => {
            document.body.classList.add('hovered-link');
        });
        el.addEventListener('mouseleave', () => {
            document.body.classList.remove('hovered-link');
        });
    });
}

/* ==========================================================================
   THEME TOGGLE SYSTEM (DARK / LIGHT)
   ========================================================================== */
let currentTheme = 'dark';
let updateParticlesColors = () => {}; // Will be bound inside ThreeJS

function initTheme() {
    const themeBtn = document.getElementById('theme-btn');
    const icon = themeBtn.querySelector('i');
    
    // Check local storage or defaults
    const savedTheme = localStorage.getItem('portfolio-theme');
    if (savedTheme) {
        currentTheme = savedTheme;
        if (currentTheme === 'light') {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            icon.className = 'fa-solid fa-sun';
        }
    }
    
    themeBtn.addEventListener('click', () => {
        if (currentTheme === 'dark') {
            document.body.classList.remove('dark-theme');
            document.body.classList.add('light-theme');
            icon.className = 'fa-solid fa-sun';
            currentTheme = 'light';
        } else {
            document.body.classList.remove('light-theme');
            document.body.classList.add('dark-theme');
            icon.className = 'fa-solid fa-moon';
            currentTheme = 'dark';
        }
        localStorage.setItem('portfolio-theme', currentTheme);
        // Notify particle background to change color scheme
        updateParticlesColors();
    });
}

/* ==========================================================================
   MOBILE NAVIGATION DRAWER
   ========================================================================== */
function initMobileNav() {
    const menuBtn = document.getElementById('menu-btn');
    const mobileNav = document.getElementById('mobile-nav');
    const links = document.querySelectorAll('.mobile-link');
    
    menuBtn.addEventListener('click', () => {
        menuBtn.classList.toggle('open');
        mobileNav.classList.toggle('open');
        document.body.classList.toggle('no-scroll');
    });
    
    links.forEach(link => {
        link.addEventListener('click', () => {
            menuBtn.classList.remove('open');
            mobileNav.classList.remove('open');
            document.body.classList.remove('no-scroll');
        });
    });
}

/* ==========================================================================
   3D PARTICLES BACKGROUND (THREE.JS)
   ========================================================================== */
function initThreeJSBackground() {
    const canvas = document.getElementById('webgl-canvas');
    if (!canvas) return;
    
    let scene, camera, renderer, particles, particleSystem;
    const particleCount = window.innerWidth < 768 ? 500 : 1200;
    
    let mouseX = 0, mouseY = 0;
    let targetX = 0, targetY = 0;
    
    document.addEventListener('mousemove', (e) => {
        // Center-aligned coordinates between -0.5 and 0.5
        mouseX = (e.clientX / window.innerWidth) - 0.5;
        mouseY = (e.clientY / window.innerHeight) - 0.5;
    });
    
    // Generate soft circular particle texture dynamically (pure canvas, zero assets)
    function createCircleTexture() {
        const pCanvas = document.createElement('canvas');
        pCanvas.width = 16;
        pCanvas.height = 16;
        const ctx = pCanvas.getContext('2d');
        const grad = ctx.createRadialGradient(8, 8, 0, 8, 8, 8);
        grad.addColorStop(0, 'rgba(255, 255, 255, 1)');
        grad.addColorStop(1, 'rgba(255, 255, 255, 0)');
        ctx.fillStyle = grad;
        ctx.fillRect(0, 0, 16, 16);
        return new THREE.CanvasTexture(pCanvas);
    }
    
    function init() {
        scene = new THREE.Scene();
        
        camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 100);
        camera.position.z = 30;
        
        renderer = new THREE.WebGLRenderer({ canvas: canvas, alpha: true, antialias: true });
        renderer.setSize(window.innerWidth, window.innerHeight);
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
        
        // Geometry
        particles = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);
        
        // Setup initial coordinates and colors
        setupParticlesData(positions, colors);
        
        particles.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        particles.setAttribute('color', new THREE.BufferAttribute(colors, 3));
        
        // Material
        const particleMaterial = new THREE.PointsMaterial({
            size: 0.15,
            sizeAttenuation: true,
            vertexColors: true,
            transparent: true,
            opacity: 0.8,
            map: createCircleTexture(),
            blending: THREE.AdditiveBlending,
            depthWrite: false
        });
        
        // System
        particleSystem = new THREE.Points(particles, particleMaterial);
        scene.add(particleSystem);
        
        animate();
    }
    
    function setupParticlesData(positions, colors) {
        const colorCyan = new THREE.Color('#00f2fe');
        const colorPurple = new THREE.Color('#9d4edd');
        const colorMuted = new THREE.Color('#475569');
        
        for (let i = 0; i < particleCount; i++) {
            // Position particles in a spherical/cloud structure
            const i3 = i * 3;
            const distance = Math.random() * 45 + 5;
            const theta = Math.random() * Math.PI * 2;
            const phi = Math.acos((Math.random() * 2) - 1);
            
            positions[i3] = distance * Math.sin(phi) * Math.cos(theta);
            positions[i3+1] = distance * Math.sin(phi) * Math.sin(theta);
            positions[i3+2] = distance * Math.cos(phi) - 10;
            
            // Set particle colors based on current theme
            let selectedColor;
            if (currentTheme === 'dark') {
                selectedColor = Math.random() > 0.5 ? colorCyan : colorPurple;
            } else {
                selectedColor = Math.random() > 0.4 ? colorMuted : colorCyan;
            }
            
            colors[i3] = selectedColor.r;
            colors[i3+1] = selectedColor.g;
            colors[i3+2] = selectedColor.b;
        }
    }
    
    // Bind global function for updates
    updateParticlesColors = () => {
        if (!particles) return;
        const colorsAttr = particles.getAttribute('color');
        const colors = colorsAttr.array;
        
        const colorCyan = new THREE.Color('#00f2fe');
        const colorPurple = new THREE.Color('#9d4edd');
        const colorMuted = new THREE.Color('#475569');
        
        for (let i = 0; i < particleCount; i++) {
            const i3 = i * 3;
            let selectedColor;
            if (currentTheme === 'dark') {
                selectedColor = Math.random() > 0.5 ? colorCyan : colorPurple;
            } else {
                selectedColor = Math.random() > 0.4 ? colorMuted : colorCyan;
            }
            colors[i3] = selectedColor.r;
            colors[i3+1] = selectedColor.g;
            colors[i3+2] = selectedColor.b;
        }
        colorsAttr.needsUpdate = true;
    };
    
    function animate() {
        requestAnimationFrame(animate);
        
        // Slow constant rotations
        particleSystem.rotation.y += 0.0006;
        particleSystem.rotation.x += 0.0003;
        
        // Lerped mouse interaction (parallax)
        targetX += (mouseX - targetX) * 0.05;
        targetY += (mouseY - targetY) * 0.05;
        
        particleSystem.position.x = targetX * 12;
        particleSystem.position.y = -targetY * 12;
        
        renderer.render(scene, camera);
    }
    
    // Window resize handling
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });
    
    init();
}

/* ==========================================================================
   GSAP & SCROLLTRIGGER ANIMATIONS
   ========================================================================== */
function initGSAPAnimations() {
    // Check if libraries loaded correctly
    if (typeof gsap === 'undefined' || typeof ScrollTrigger === 'undefined') {
        // Fallback: use basic CSS transitions
        document.querySelectorAll('.scroll-reveal').forEach(el => {
            el.classList.add('active');
        });
        return;
    }
    
    // Register scrolltrigger plugin
    gsap.registerPlugin(ScrollTrigger);
    
    // Scroll header styling
    ScrollTrigger.create({
        start: 'top -50',
        onToggle: self => {
            const header = document.querySelector('.main-header');
            if (self.isActive) {
                header.classList.add('scrolled');
            } else {
                header.classList.remove('scrolled');
            }
        }
    });
    
    // Reveal Hero elements with animations
    gsap.from('#hero-tag-text', { opacity: 0, y: -20, duration: 0.8, delay: 0.2, ease: 'power3.out' });
    gsap.from('#hero-main-title', { opacity: 0, y: 30, duration: 1, delay: 0.4, ease: 'power3.out' });
    gsap.from('#hero-desc-text', { opacity: 0, y: 20, duration: 0.8, delay: 0.6, ease: 'power3.out' });
    gsap.from('#hero-btn-container', { opacity: 0, y: 20, duration: 0.8, delay: 0.8, ease: 'power3.out' });
    gsap.from('#hero-card-3d', { opacity: 0, scale: 0.9, rotationX: 10, rotationY: -15, duration: 1.2, delay: 0.6, ease: 'power3.out' });
    
    // Parallax on code card
    const card3D = document.getElementById('hero-card-3d');
    if (card3D) {
        document.addEventListener('mousemove', (e) => {
            const x = (window.innerWidth / 2 - e.clientX) / 20;
            const y = (window.innerHeight / 2 - e.clientY) / 20;
            card3D.style.transform = `rotateY(${x}deg) rotateX(${-y}deg)`;
        });
    }
    
    // Profile card 3D tilt
    const profileCard = document.getElementById('profile-card');
    if (profileCard) {
        profileCard.addEventListener('mousemove', (e) => {
            const rect = profileCard.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            const xc = rect.width / 2;
            const yc = rect.height / 2;
            const angleX = (yc - y) / 10;
            const angleY = (x - xc) / 10;
            profileCard.style.transform = `perspective(1000px) rotateX(${angleX}deg) rotateY(${angleY}deg)`;
        });
        profileCard.addEventListener('mouseleave', () => {
            profileCard.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg)';
        });
    }
    
    // Scroll reveal sections
    const reveals = document.querySelectorAll('.scroll-reveal');
    reveals.forEach(el => {
        gsap.to(el, {
            scrollTrigger: {
                trigger: el,
                start: 'top 85%',
                onEnter: () => el.classList.add('active'),
                once: true
            }
        });
    });
    
    // Timeline central progress bar growth
    gsap.from('.timeline-progress-line', {
        scaleY: 0,
        transformOrigin: 'top center',
        scrollTrigger: {
            trigger: '.timeline-section',
            start: 'top 30%',
            end: 'bottom 80%',
            scrub: true
        }
    });
    
    // Skill bars animation on entry
    gsap.utils.toArray('.skill-bar-fill').forEach(fill => {
        const targetWidth = fill.parentElement.previousElementSibling.querySelector('.skill-percentage').innerText;
        gsap.to(fill, {
            width: targetWidth,
            scrollTrigger: {
                trigger: fill,
                start: 'top 90%',
                once: true
            }
        });
    });
    
    // Numbers count up animation
    const stats = document.querySelectorAll('.stat-num');
    stats.forEach(stat => {
        const targetVal = parseInt(stat.getAttribute('data-val'), 10);
        const obj = { value: 0 };
        gsap.to(obj, {
            value: targetVal,
            duration: 2,
            ease: 'power2.out',
            scrollTrigger: {
                trigger: '.about-section',
                start: 'top 70%',
                once: true
            },
            onUpdate: () => {
                stat.innerText = Math.floor(obj.value);
            }
        });
    });
    
    // Track active nav-links relative to section scroll
    const sections = document.querySelectorAll('section');
    sections.forEach(sec => {
        const id = sec.getAttribute('id');
        const link = document.getElementById(`link-${id}`);
        if (!link) return;
        
        ScrollTrigger.create({
            trigger: sec,
            start: 'top 40%',
            end: 'bottom 40%',
            onToggle: self => {
                if (self.isActive) {
                    document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
                    link.classList.add('active');
                }
            }
        });
    });
}

/* ==========================================================================
   CONTACT FORM SUBMISSION WITH STATUS HANDLING
   ========================================================================== */
function initContactForm() {
    const form = document.getElementById('contact-form-element');
    const statusMsg = document.getElementById('form-status');
    const submitBtn = document.getElementById('btn-submit-message');
    const submitText = submitBtn.querySelector('.btn-text');
    const submitIcon = submitBtn.querySelector('.btn-icon i');
    
    if (!form) return;
    
    form.addEventListener('submit', (e) => {
        e.preventDefault();
        
        // Show sending state
        submitBtn.disabled = true;
        submitText.innerText = 'Enviando...';
        submitIcon.className = 'fa-solid fa-circle-notch fa-spin';
        
        // Simulate web request delays
        setTimeout(() => {
            form.reset();
            
            submitBtn.disabled = false;
            submitText.innerText = 'Enviar Mensagem';
            submitIcon.className = 'fa-solid fa-paper-plane';
            
            statusMsg.className = 'form-status-msg success';
            statusMsg.innerText = 'Mensagem enviada com sucesso! Rodrigo entrará em contato em breve.';
            
            // Auto hide message after 5 seconds
            setTimeout(() => {
                statusMsg.style.display = 'none';
            }, 6000);
            
        }, 1500);
    });
}
