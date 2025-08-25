/**
 * Game Effects and Animations for MST Algorithm Quest
 * Indie game-style visual effects and interactions
 */

class GameEffects {
    constructor() {
        this.particles = [];
        this.isInitialized = false;
        this.canvas = null;
        this.ctx = null;
        this.init();
    }

    init() {
        this.createParticleCanvas();
        this.initMouseEffects();
        this.initKeyboardEffects();
        this.initTabEffects();
        this.startParticleSystem();
        this.isInitialized = true;
    }

    createParticleCanvas() {
        // Create a canvas for particle effects
        this.canvas = document.createElement('canvas');
        this.canvas.id = 'particle-canvas';
        this.canvas.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            width: 100vw;
            height: 100vh;
            pointer-events: none;
            z-index: 1;
            opacity: 0.7;
        `;
        document.body.appendChild(this.canvas);
        this.ctx = this.canvas.getContext('2d');
        this.resizeCanvas();

        window.addEventListener('resize', () => this.resizeCanvas());
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    // Particle system for background ambiance
    startParticleSystem() {
        // Create floating particles
        for (let i = 0; i < 15; i++) {
            this.createParticle();
        }
        this.animateParticles();
    }

    createParticle() {
        const particle = {
            x: Math.random() * this.canvas.width,
            y: Math.random() * this.canvas.height,
            size: Math.random() * 3 + 1,
            speedX: (Math.random() - 0.5) * 0.5,
            speedY: (Math.random() - 0.5) * 0.5,
            color: this.getRandomNeonColor(),
            opacity: Math.random() * 0.5 + 0.2,
            pulse: Math.random() * Math.PI * 2
        };
        this.particles.push(particle);
    }

    getRandomNeonColor() {
        const colors = ['#00ffff', '#ff1493', '#9d4edd', '#39ff14', '#ff6b35', '#4cc9f0'];
        return colors[Math.floor(Math.random() * colors.length)];
    }

    animateParticles() {
        if (!this.ctx) return;

        this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);

        this.particles.forEach((particle, index) => {
            // Update position
            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.pulse += 0.02;

            // Wrap around screen
            if (particle.x < 0) particle.x = this.canvas.width;
            if (particle.x > this.canvas.width) particle.x = 0;
            if (particle.y < 0) particle.y = this.canvas.height;
            if (particle.y > this.canvas.height) particle.y = 0;

            // Draw particle with glow effect
            const pulseOpacity = particle.opacity * (0.5 + 0.5 * Math.sin(particle.pulse));
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color + Math.floor(pulseOpacity * 255).toString(16).padStart(2, '0');
            this.ctx.fill();

            // Add glow effect
            this.ctx.shadowColor = particle.color;
            this.ctx.shadowBlur = particle.size * 3;
            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size * 0.5, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color;
            this.ctx.fill();
            this.ctx.shadowBlur = 0;
        });

        requestAnimationFrame(() => this.animateParticles());
    }

    // Mouse interaction effects
    initMouseEffects() {
        let mouseX = 0, mouseY = 0;
        let cursorTrail = [];

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Add to cursor trail
            cursorTrail.push({ x: mouseX, y: mouseY, time: Date.now() });
            if (cursorTrail.length > 20) cursorTrail.shift();

            // Create particle on mouse move (occasionally)
            if (Math.random() < 0.1) {
                this.createMouseParticle(mouseX, mouseY);
            }
        });

        // Card hover effects
        document.querySelectorAll('.card').forEach(card => {
            card.addEventListener('mouseenter', () => {
                this.addCardGlowEffect(card);
                this.playHoverSound();
            });

            card.addEventListener('mouseleave', () => {
                this.removeCardGlowEffect(card);
            });
        });
    }

    createMouseParticle(x, y) {
        const particle = {
            x: x + (Math.random() - 0.5) * 20,
            y: y + (Math.random() - 0.5) * 20,
            size: Math.random() * 2 + 1,
            speedX: (Math.random() - 0.5) * 2,
            speedY: (Math.random() - 0.5) * 2,
            color: this.getRandomNeonColor(),
            opacity: 0.8,
            life: 30,
            maxLife: 30
        };

        // Animate this special particle
        const animate = () => {
            if (particle.life <= 0) return;

            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.life--;
            particle.opacity = (particle.life / particle.maxLife) * 0.8;

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
            this.ctx.fill();

            requestAnimationFrame(animate);
        };
        animate();
    }

    addCardGlowEffect(card) {
        card.style.transition = 'all 0.3s ease';
        card.style.boxShadow = '0 12px 40px rgba(0, 255, 255, 0.3), 0 0 20px rgba(0, 255, 255, 0.2)';
        card.style.transform = 'translateY(-5px) scale(1.02)';
    }

    removeCardGlowEffect(card) {
        card.style.boxShadow = '';
        card.style.transform = '';
    }

    // Keyboard effects
    initKeyboardEffects() {
        document.addEventListener('keydown', (e) => {
            if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT') return;

            this.createKeyboardEffect(e.key);
            this.playKeySound();
        });
    }

    createKeyboardEffect(key) {
        // Create a floating key indicator
        const indicator = document.createElement('div');
        indicator.textContent = key.length === 1 ? key.toUpperCase() : key;
        indicator.className = 'keyboard-indicator';
        indicator.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: linear-gradient(135deg, var(--neon-cyan), var(--neon-purple));
            color: var(--dark-bg);
            padding: 8px 12px;
            border-radius: 8px;
            font-family: 'Press Start 2P', cursive;
            font-size: 12px;
            z-index: 1000;
            animation: keyboardPop 0.8s ease-out forwards;
            pointer-events: none;
        `;

        document.body.appendChild(indicator);

        // Remove after animation
        setTimeout(() => indicator.remove(), 800);
    }

    // Tab switching effects
    initTabEffects() {
        const tabs = document.querySelectorAll('.nav-link[data-bs-toggle="tab"]');
        tabs.forEach(tab => {
            tab.addEventListener('click', (e) => {
                this.createTabSwitchEffect(e.target);
                this.playTabSound();
            });
        });
    }

    createTabSwitchEffect(tab) {
        // Create explosion effect at tab position
        const rect = tab.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;

        for (let i = 0; i < 12; i++) {
            this.createExplosionParticle(centerX, centerY);
        }
    }

    createExplosionParticle(x, y) {
        const angle = (Math.PI * 2 * Math.random());
        const speed = Math.random() * 5 + 3;
        const particle = {
            x: x,
            y: y,
            speedX: Math.cos(angle) * speed,
            speedY: Math.sin(angle) * speed,
            size: Math.random() * 3 + 1,
            color: this.getRandomNeonColor(),
            opacity: 1,
            life: 20,
            maxLife: 20
        };

        const animate = () => {
            if (particle.life <= 0) return;

            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.speedX *= 0.95;
            particle.speedY *= 0.95;
            particle.life--;
            particle.opacity = particle.life / particle.maxLife;

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
            this.ctx.fill();

            requestAnimationFrame(animate);
        };
        animate();
    }

    // Graph visualization effects
    enhanceGraphElements() {
        // Add pulsing effect to nodes
        const nodes = document.querySelectorAll('.node circle');
        nodes.forEach((node, index) => {
            setTimeout(() => {
                node.style.animation = `nodePulse 2s ease-in-out infinite`;
                node.style.animationDelay = `${index * 0.1}s`;
            }, index * 100);
        });

        // Add energy flow effect to edges
        const edges = document.querySelectorAll('.link line');
        edges.forEach(edge => {
            edge.addEventListener('mouseenter', () => {
                edge.style.filter = 'drop-shadow(0 0 8px var(--neon-cyan))';
                edge.style.strokeWidth = '4px';
            });

            edge.addEventListener('mouseleave', () => {
                edge.style.filter = '';
                edge.style.strokeWidth = '2px';
            });
        });
    }

    // Algorithm animation enhancements
    highlightAlgorithmStep(stepElement) {
        // Create pulse effect around the step
        stepElement.style.animation = 'stepHighlight 1s ease-in-out';
        
        // Create particle burst at step
        const rect = stepElement.getBoundingClientRect();
        for (let i = 0; i < 6; i++) {
            this.createStepParticle(rect.left + rect.width / 2, rect.top + rect.height / 2);
        }
    }

    createStepParticle(x, y) {
        const particle = {
            x: x + (Math.random() - 0.5) * 40,
            y: y + (Math.random() - 0.5) * 40,
            size: Math.random() * 2 + 1,
            speedY: -Math.random() * 2 - 1,
            color: '#39ff14',
            opacity: 1,
            life: 25,
            maxLife: 25
        };

        const animate = () => {
            if (particle.life <= 0) return;

            particle.y += particle.speedY;
            particle.life--;
            particle.opacity = particle.life / particle.maxLife;

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
            this.ctx.fill();

            requestAnimationFrame(animate);
        };
        animate();
    }

    // Sound effects (Web Audio API placeholders)
    playHoverSound() {
        // Placeholder for hover sound effect
        // Can implement with Web Audio API
    }

    playKeySound() {
        // Placeholder for key press sound
    }

    playTabSound() {
        // Placeholder for tab switch sound
    }

    playSuccessSound() {
        // Placeholder for success/completion sound
    }

    // Button click enhancement
    enhanceButtonClick(button) {
        const rect = button.getBoundingClientRect();
        const x = rect.left + rect.width / 2;
        const y = rect.top + rect.height / 2;

        // Create button click explosion
        for (let i = 0; i < 8; i++) {
            this.createClickParticle(x, y);
        }

        // Add screen shake effect
        this.screenShake(2, 100);
    }

    createClickParticle(x, y) {
        const angle = (Math.PI * 2 * Math.random());
        const speed = Math.random() * 4 + 2;
        const particle = {
            x: x,
            y: y,
            speedX: Math.cos(angle) * speed,
            speedY: Math.sin(angle) * speed,
            size: Math.random() * 2 + 1,
            color: '#ff1493',
            opacity: 1,
            life: 15,
            maxLife: 15
        };

        const animate = () => {
            if (particle.life <= 0) return;

            particle.x += particle.speedX;
            particle.y += particle.speedY;
            particle.life--;
            particle.opacity = particle.life / particle.maxLife;

            this.ctx.beginPath();
            this.ctx.arc(particle.x, particle.y, particle.size, 0, Math.PI * 2);
            this.ctx.fillStyle = particle.color + Math.floor(particle.opacity * 255).toString(16).padStart(2, '0');
            this.ctx.fill();

            requestAnimationFrame(animate);
        };
        animate();
    }

    screenShake(intensity, duration) {
        const originalTransform = document.body.style.transform;
        let startTime = Date.now();

        const shake = () => {
            const elapsed = Date.now() - startTime;
            if (elapsed >= duration) {
                document.body.style.transform = originalTransform;
                return;
            }

            const x = (Math.random() - 0.5) * intensity;
            const y = (Math.random() - 0.5) * intensity;
            document.body.style.transform = `translate(${x}px, ${y}px)`;

            requestAnimationFrame(shake);
        };
        shake();
    }

    // Clean up
    destroy() {
        if (this.canvas && this.canvas.parentNode) {
            this.canvas.parentNode.removeChild(this.canvas);
        }
        this.particles = [];
        this.isInitialized = false;
    }
}

// Add CSS animations
const gameAnimationCSS = `
@keyframes keyboardPop {
    0% {
        transform: scale(0) rotate(0deg);
        opacity: 0;
    }
    50% {
        transform: scale(1.2) rotate(10deg);
        opacity: 1;
    }
    100% {
        transform: scale(0.8) rotate(0deg);
        opacity: 0;
    }
}

@keyframes nodePulse {
    0%, 100% {
        r: 20;
        opacity: 0.8;
    }
    50% {
        r: 25;
        opacity: 1;
    }
}

@keyframes stepHighlight {
    0%, 100% {
        background-color: rgba(0, 255, 255, 0.2);
        transform: scale(1);
    }
    50% {
        background-color: rgba(0, 255, 255, 0.4);
        transform: scale(1.05);
    }
}

.btn:active {
    transform: translateY(-2px) scale(0.98) !important;
}

.card-header::after {
    animation-duration: 4s !important;
}

/* Matrix-style text effect */
.matrix-text {
    font-family: 'Fira Code', monospace;
    color: var(--neon-green);
    text-shadow: 0 0 10px var(--neon-green);
    animation: matrixFlicker 0.1s infinite alternate;
}

@keyframes matrixFlicker {
    0% { opacity: 1; }
    100% { opacity: 0.95; }
}
`;

// Inject CSS
const styleSheet = document.createElement('style');
styleSheet.textContent = gameAnimationCSS;
document.head.appendChild(styleSheet);

// Initialize game effects when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.gameEffects = new GameEffects();
    
    // Enhance button clicks
    document.addEventListener('click', (e) => {
        if (e.target.classList.contains('btn')) {
            window.gameEffects.enhanceButtonClick(e.target);
        }
    });
    
    // Auto-enhance graph elements when they're loaded
    const observer = new MutationObserver(() => {
        if (document.querySelector('.node')) {
            window.gameEffects.enhanceGraphElements();
            observer.disconnect();
        }
    });
    observer.observe(document.body, { childList: true, subtree: true });
});