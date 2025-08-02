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

// Morphing animation for the new visualization
function animateMorphingChart() {
    const chart = document.getElementById('morph-chart');
    const timePeriod = document.querySelector('.time-period');
    
    // Function to run the animation cycle
    function runAnimation() {
        // Start in sequential state
        chart.classList.remove('parallel');
        timePeriod.textContent = 'Today';
        timePeriod.style.color = 'var(--primary-color)';
        
        // After 3 seconds, morph to parallel
        setTimeout(() => {
            chart.classList.add('parallel');
            timePeriod.textContent = 'Tomorrow';
            timePeriod.style.color = '#4ECDC4';
        }, 3000);
        
        // After 6 seconds total, restart the cycle
        setTimeout(() => {
            runAnimation();
        }, 6000);
    }
    
    // Start the animation cycle
    runAnimation();
}



// Auto-animate on first view
const vizSection = document.querySelector('.visualization-section');
const vizObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            // Start morphing animation immediately
            animateMorphingChart();
            vizObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

if (vizSection) {
    vizObserver.observe(vizSection);
}

// Add hover effects to old transaction blocks (not morph ones)
document.querySelectorAll('.tx-block:not(.morph-tx)').forEach(block => {
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