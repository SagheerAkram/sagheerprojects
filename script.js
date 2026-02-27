// Magnetic Interaction Utility
const magneticElements = document.querySelectorAll('.bento-item, .btn, a');

magneticElements.forEach((el) => {
    el.addEventListener('mousemove', function (e) {
        const rect = this.getBoundingClientRect();
        const x = e.clientX - rect.left - rect.width / 2;
        const y = e.clientY - rect.top - rect.height / 2;

        this.style.transform = `translate(${x * 0.2}px, ${y * 0.2}px) scale(1.02)`;
    });

    el.addEventListener('mouseleave', function () {
        this.style.transform = '';
    });
});

// Intersection Observer for Reveal Animations
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('visible');
            // Once visible, stop observing to keep it there
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

// Page Load Smoothness
window.addEventListener('load', () => {
    document.body.style.opacity = '1';
});

// Custom Cursor (Optional Premium Touch)
const cursor = document.createElement('div');
cursor.className = 'custom-cursor';
document.body.appendChild(cursor);

document.addEventListener('mousemove', (e) => {
    cursor.style.left = e.clientX + 'px';
    cursor.style.top = e.clientY + 'px';
});

document.addEventListener('mousedown', () => cursor.style.transform = 'translate(-50%, -50%) scale(0.8)');
document.addEventListener('mouseup', () => cursor.style.transform = 'translate(-50%, -50%) scale(1)');
