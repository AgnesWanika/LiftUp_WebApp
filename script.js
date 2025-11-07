/* ====== LiftUp Website Script ====== */

// Welcome alert when the website loads
window.addEventListener('load', function() {
    alert('👋 Welcome to LiftUp Community! Let’s uplift lives together.');
});

// Highlight the active page link (if clicked)
const navLinks = document.querySelectorAll('nav a');

navLinks.forEach(link => {
    link.addEventListener('click', function() {
        navLinks.forEach(l => l.classList.remove('active'));
        this.classList.add('active');
    });
});

// Time-based greeting (optional feature)
const hours = new Date().getHours();
let greeting;

if (hours < 12) {
    greeting = "Good Morning 🌞";
} else if (hours < 18) {
    greeting = "Good Afternoon ☀️";
} else {
    greeting = "Good Evening 🌙";
}

console.log(`${greeting}, welcome to LiftUp!`);

// Optional small animation for cards
const cards = document.querySelectorAll('.card');

cards.forEach(card => {
    card.addEventListener('mouseenter', () => {
        card.style.transform = 'scale(1.03)';
    });
    card.addEventListener('mouseleave', () => {
        card.style.transform = 'scale(1)';
    });
});
