// Smooth scrolling for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Intersection Observer for fade-in animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -100px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('fade-in');
        }
    });
}, observerOptions);

// Observe all sections and cards
document.querySelectorAll('section, .feature-card, .resource-card').forEach(el => {
    el.style.opacity = '0';
    el.style.transform = 'translateY(20px)';
    el.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
    observer.observe(el);
});

// Add fade-in class styles dynamically
const style = document.createElement('style');
style.textContent = '.fade-in { opacity: 1 !important; transform: translateY(0) !important; }';
document.head.appendChild(style);

// Simple animation for transaction blocks
function animateTransactions() {
    // Reset all animations
    const allBlocks = document.querySelectorAll('.tx-block');
    const sequentialProgress = document.querySelector('.sequential-progress');
    const parallelProgress = document.querySelector('.parallel-progress');
    const sequentialTime = document.getElementById('sequential-time');
    const parallelTime = document.getElementById('parallel-time');
    
    // Reset states
    allBlocks.forEach(block => {
        block.classList.remove('processing', 'completed');
    });
    sequentialProgress.style.width = '0%';
    parallelProgress.style.width = '0%';
    sequentialTime.textContent = '0s';
    parallelTime.textContent = '0s';
    
    // Animation timing
    const txDuration = 500; // Each transaction takes 500ms
    const totalTxCount = 8;
    
    // Sequential animation
    const sequentialBlocks = document.querySelectorAll('#sequential-viz .tx-block');
    let sequentialIndex = 0;
    let sequentialStartTime = Date.now();
    
    const sequentialInterval = setInterval(() => {
        if (sequentialIndex < sequentialBlocks.length) {
            // Mark previous as completed
            if (sequentialIndex > 0) {
                sequentialBlocks[sequentialIndex - 1].classList.remove('processing');
                sequentialBlocks[sequentialIndex - 1].classList.add('completed');
            }
            
            // Process current
            sequentialBlocks[sequentialIndex].classList.add('processing');
            
            // Update progress
            const progress = ((sequentialIndex + 1) / totalTxCount) * 100;
            sequentialProgress.style.width = progress + '%';
            
            // Update time
            const elapsed = ((Date.now() - sequentialStartTime) / 1000).toFixed(1);
            sequentialTime.textContent = elapsed + 's';
            
            sequentialIndex++;
        } else {
            // Mark last as completed
            sequentialBlocks[sequentialBlocks.length - 1].classList.remove('processing');
            sequentialBlocks[sequentialBlocks.length - 1].classList.add('completed');
            clearInterval(sequentialInterval);
        }
    }, txDuration);
    
    // Parallel animation - process columns (first column, then second column)
    const parallelBlocks = document.querySelectorAll('#parallel-viz .tx-block');
    let parallelColumn = 0;
    let parallelStartTime = Date.now();
    const coresCount = 4;
    
    const parallelInterval = setInterval(() => {
        if (parallelColumn < 2) {
            // Process blocks in current column (all cores simultaneously)
            for (let core = 0; core < coresCount; core++) {
                const coreBlocks = document.querySelectorAll(`#parallel-viz .tx-block[data-core="${core + 1}"]`);
                if (parallelColumn < coreBlocks.length) {
                    // Mark previous column as completed
                    if (parallelColumn > 0) {
                        coreBlocks[parallelColumn - 1].classList.remove('processing');
                        coreBlocks[parallelColumn - 1].classList.add('completed');
                    }
                    
                    // Process current column
                    coreBlocks[parallelColumn].classList.add('processing');
                }
            }
            
            // Update progress
            const completedCount = Math.min((parallelColumn + 1) * coresCount, totalTxCount);
            const progress = (completedCount / totalTxCount) * 100;
            parallelProgress.style.width = progress + '%';
            
            // Update time
            const elapsed = ((Date.now() - parallelStartTime) / 1000).toFixed(1);
            parallelTime.textContent = elapsed + 's';
            
            parallelColumn++;
        } else {
            // Mark last column as completed
            for (let core = 0; core < coresCount; core++) {
                const coreBlocks = document.querySelectorAll(`#parallel-viz .tx-block[data-core="${core + 1}"]`);
                if (coreBlocks.length > 1) {
                    coreBlocks[1].classList.remove('processing');
                    coreBlocks[1].classList.add('completed');
                }
            }
            clearInterval(parallelInterval);
        }
    }, txDuration);
}

// Animate button click handler
document.getElementById('animate-btn').addEventListener('click', animateTransactions);

// Auto-animate on first view
const vizSection = document.querySelector('.visualization-section');
const vizObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            setTimeout(animateTransactions, 500);
            vizObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

vizObserver.observe(vizSection);

// Add hover effects to transaction blocks
document.querySelectorAll('.tx-block').forEach(block => {
    block.addEventListener('mouseenter', function() {
        this.style.transform = 'translateX(0) scale(1.05)';
    });
    
    block.addEventListener('mouseleave', function() {
        this.style.transform = 'translateX(0) scale(1)';
    });
});

// Parallax effect for hero section
const hero = document.querySelector('.hero');
window.addEventListener('scroll', () => {
    const scrolled = window.pageYOffset;
    const parallax = -scrolled * 0.5;
    hero.style.transform = `translateY(${parallax}px)`;
});

// Add loading animation to resource cards
document.querySelectorAll('.resource-card').forEach(card => {
    card.addEventListener('click', function(e) {
        if (this.getAttribute('href') === '#') {
            e.preventDefault();
            this.style.transform = 'scale(0.95)';
            setTimeout(() => {
                this.style.transform = '';
            }, 200);
        }
    });
});

// Dynamic year in footer
const currentYear = new Date().getFullYear();
const footerText = document.querySelector('.footer p');
if (footerText) {
    footerText.textContent = footerText.textContent.replace('2024', currentYear);
}

// Add interactive hover states for feature cards
document.querySelectorAll('.feature-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        const icon = this.querySelector('.feature-icon');
        icon.style.transform = 'scale(1.2) rotate(5deg)';
        icon.style.transition = 'transform 0.3s ease';
    });
    
    card.addEventListener('mouseleave', function() {
        const icon = this.querySelector('.feature-icon');
        icon.style.transform = 'scale(1) rotate(0deg)';
    });
});

// Create floating particles effect in hero
function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    particle.style.cssText = `
        position: absolute;
        width: 4px;
        height: 4px;
        background: rgba(184, 184, 255, 0.5);
        border-radius: 50%;
        pointer-events: none;
        left: ${Math.random() * 100}%;
        top: ${Math.random() * 100}%;
        animation: float ${5 + Math.random() * 10}s linear infinite;
    `;
    hero.appendChild(particle);
    
    setTimeout(() => particle.remove(), 15000);
}

// Add floating animation
if (!document.querySelector('#float-animation')) {
    const floatStyle = document.createElement('style');
    floatStyle.id = 'float-animation';
    floatStyle.textContent = `
        @keyframes float {
            0% { transform: translateY(0) translateX(0); opacity: 0; }
            10% { opacity: 1; }
            90% { opacity: 1; }
            100% { transform: translateY(-100vh) translateX(${Math.random() * 200 - 100}px); opacity: 0; }
        }
    `;
    document.head.appendChild(floatStyle);
}

// Create particles periodically
setInterval(createParticle, 300);

// Add keyboard navigation
document.addEventListener('keydown', (e) => {
    if (e.key === ' ' && e.target === document.body) {
        e.preventDefault();
        animateTransactions();
    }
});