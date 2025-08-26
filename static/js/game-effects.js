/**
 * Modern Visual Effects for MST Algorithm Lab
 * Scientific and minimalist visual enhancements
 */

class ModernEffects {
    constructor() {
        this.isInitialized = false;
        this.observers = [];
        this.init();
    }

    init() {
        this.initModernEffects();
        this.initIntersectionObserver();
        this.initButtonEffects();
        this.initCardAnimations();
        this.isInitialized = true;
        console.log('✨ Modern effects initialized');
    }

    createParticleCanvas() {
        // Disabled for student demo
        return;
    }

    resizeCanvas() {
        this.canvas.width = window.innerWidth;
        this.canvas.height = window.innerHeight;
    }

    // Particle system disabled for student demo
    startParticleSystem() {
        return;
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

    // Modern interaction effects
    initModernEffects() {
        // Smooth transitions for all interactive elements
        document.body.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
        
        // Add modern hover effects to buttons
        this.initButtonHoverEffects();
        
        // Add card elevation effects
        this.initCardHoverEffects();
        
        // Add focus management
        this.initFocusEffects();
    }
    
    initButtonHoverEffects() {
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.modern-btn')) {
                const btn = e.target.closest('.modern-btn');
                btn.style.transform = 'translateY(-2px) scale(1.02)';
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('.modern-btn')) {
                const btn = e.target.closest('.modern-btn');
                btn.style.transform = '';
            }
        });
    }
    
    initCardHoverEffects() {
        document.addEventListener('mouseover', (e) => {
            if (e.target.closest('.modern-card')) {
                const card = e.target.closest('.modern-card');
                card.style.transform = 'translateY(-4px)';
                card.style.boxShadow = 'var(--shadow-xl)';
            }
        });
        
        document.addEventListener('mouseout', (e) => {
            if (e.target.closest('.modern-card')) {
                const card = e.target.closest('.modern-card');
                card.style.transform = '';
                card.style.boxShadow = '';
            }
        });
    }

    // Mouse interaction effects - DISABLED
    initMouseEffects() {
        let mouseX = 0, mouseY = 0;
        let cursorTrail = [];

        document.addEventListener('mousemove', (e) => {
            mouseX = e.clientX;
            mouseY = e.clientY;

            // Add to cursor trail
            cursorTrail.push({ x: mouseX, y: mouseY, time: Date.now() });
            if (cursorTrail.length > 20) cursorTrail.shift();

            // Particle creation disabled for performance
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
        // Simplified for demo
        card.style.transition = 'all 0.2s ease';
        card.style.transform = 'translateY(-2px)';
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

    // Intersection Observer for fade-in animations
    initIntersectionObserver() {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '20px'
        });
        
        // Observe cards and panels
        document.querySelectorAll('.modern-card, .panel-section').forEach(el => {
            observer.observe(el);
        });
        
        this.observers.push(observer);
    }
    
    // Modern button click effects
    initButtonEffects() {
        document.addEventListener('click', (e) => {
            if (e.target.closest('.modern-btn, .control-btn')) {
                this.createRippleEffect(e.target.closest('.modern-btn, .control-btn'), e);
            }
        });
    }
    
    createRippleEffect(element, event) {
        const ripple = document.createElement('span');
        const rect = element.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = event.clientX - rect.left - size / 2;
        const y = event.clientY - rect.top - size / 2;
        
        ripple.style.cssText = `
            position: absolute;
            width: ${size}px;
            height: ${size}px;
            left: ${x}px;
            top: ${y}px;
            background: rgba(255, 255, 255, 0.3);
            border-radius: 50%;
            transform: scale(0);
            animation: rippleEffect 0.6s ease-out;
            pointer-events: none;
            z-index: 100;
        `;
        
        element.style.position = 'relative';
        element.style.overflow = 'hidden';
        element.appendChild(ripple);
        
        setTimeout(() => ripple.remove(), 600);
    }
    
    // Modern card animations
    initCardAnimations() {
        // Staggered animation for cards
        const cards = document.querySelectorAll('.modern-card');
        cards.forEach((card, index) => {
            card.style.opacity = '0';
            card.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                card.style.transition = 'all 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                card.style.opacity = '1';
                card.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // Focus management for accessibility
    initFocusEffects() {
        // Enhanced focus indicators
        document.addEventListener('focusin', (e) => {
            if (e.target.matches('button, input, select, [tabindex]')) {
                e.target.style.outline = '2px solid var(--accent-blue)';
                e.target.style.outlineOffset = '2px';
                e.target.style.boxShadow = '0 0 20px rgba(0, 212, 255, 0.3)';
            }
        });
        
        document.addEventListener('focusout', (e) => {
            if (e.target.matches('button, input, select, [tabindex]')) {
                e.target.style.outline = '';
                e.target.style.outlineOffset = '';
                e.target.style.boxShadow = '';
            }
        });
    }
    
    // Algorithm visualization effects
    highlightAlgorithmStep(element) {
        if (!element) return;
        
        element.style.transition = 'all 0.3s ease-out';
        element.style.transform = 'scale(1.02)';
        element.style.background = 'linear-gradient(135deg, rgba(0, 212, 255, 0.1), rgba(0, 255, 148, 0.1))';
        element.style.borderColor = 'var(--accent-blue)';
        
        // Add pulse effect
        element.style.animation = 'modernPulse 1s ease-in-out';
        
        setTimeout(() => {
            element.style.transform = '';
            element.style.animation = '';
        }, 1000);
    }
    
    // Graph edge animation
    animateGraphEdge(edge) {
        if (!edge) return;
        
        // Create flowing energy effect
        edge.style.strokeDasharray = '10,5';
        edge.style.strokeDashoffset = '15';
        edge.style.animation = 'flowingEdge 1s linear infinite';
        
        setTimeout(() => {
            edge.style.strokeDasharray = '';
            edge.style.strokeDashoffset = '';
            edge.style.animation = '';
        }, 2000);
    }
    
    // Success notification effect
    showSuccessEffect() {
        const effect = document.createElement('div');
        effect.style.cssText = `
            position: fixed;
            top: 50%;
            left: 50%;
            transform: translate(-50%, -50%) scale(0);
            width: 200px;
            height: 200px;
            background: radial-gradient(circle, var(--accent-green) 0%, transparent 70%);
            border-radius: 50%;
            pointer-events: none;
            z-index: 9999;
            animation: successBurst 0.8s ease-out;
        `;
        
        document.body.appendChild(effect);
        setTimeout(() => effect.remove(), 800);
    }
    
    // Cleanup
    destroy() {
        this.observers.forEach(observer => observer.disconnect());
        this.observers = [];
        this.isInitialized = false;
    }
}

// Modern CSS animations
const modernAnimationCSS = `
@keyframes rippleEffect {
    to {
        transform: scale(4);
        opacity: 0;
    }
}

@keyframes modernPulse {
    0%, 100% {
        transform: scale(1);
        box-shadow: 0 0 0 0 rgba(0, 212, 255, 0.7);
    }
    50% {
        transform: scale(1.02);
        box-shadow: 0 0 0 10px rgba(0, 212, 255, 0);
    }
}

@keyframes flowingEdge {
    0% {
        stroke-dashoffset: 15;
    }
    100% {
        stroke-dashoffset: 0;
    }
}

@keyframes successBurst {
    0% {
        transform: translate(-50%, -50%) scale(0);
        opacity: 1;
    }
    70% {
        transform: translate(-50%, -50%) scale(1.2);
        opacity: 0.8;
    }
    100% {
        transform: translate(-50%, -50%) scale(2);
        opacity: 0;
    }
}

@keyframes fadeIn {
    from {
        opacity: 0;
        transform: translateY(20px);
    }
    to {
        opacity: 1;
        transform: translateY(0);
    }
}

.fade-in {
    animation: fadeIn 0.6s ease-out;
}

/* Modern button effects */
.modern-btn:active {
    transform: translateY(-1px) scale(0.98) !important;
}

.control-btn:active {
    transform: scale(0.95) !important;
}

/* Smooth transitions */
* {
    transition-property: transform, box-shadow, background-color, border-color;
    transition-duration: 0.2s;
    transition-timing-function: cubic-bezier(0.4, 0, 0.2, 1);
}

/* Loading shimmer effect */
.loading-shimmer {
    background: linear-gradient(90deg, 
        rgba(255, 255, 255, 0.1) 0%, 
        rgba(255, 255, 255, 0.3) 50%, 
        rgba(255, 255, 255, 0.1) 100%
    );
    background-size: 200% 100%;
    animation: shimmer 1.5s infinite;
}

@keyframes shimmer {
    0% {
        background-position: -200% 0;
    }
    100% {
        background-position: 200% 0;
    }
}
`;

// Inject modern CSS
const modernStyleSheet = document.createElement('style');
modernStyleSheet.textContent = modernAnimationCSS;
document.head.appendChild(modernStyleSheet);

// Initialize modern effects when DOM is ready
document.addEventListener('DOMContentLoaded', () => {
    window.modernEffects = new ModernEffects();
});

// Export for global use
window.ModernEffects = ModernEffects;