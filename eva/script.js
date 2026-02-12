const flamingo = document.getElementById('flamingo');
const pathBg1 = document.getElementById('pathBg1');
const pathBg2 = document.getElementById('pathBg2');
const pathBg3 = document.getElementById('pathBg3');
const btnYes = document.getElementById('btnYes');
const btnNo = document.getElementById('btnNo');
const modal = document.getElementById('celebrationModal');
const btnClose = document.getElementById('btnClose');

// Memory data
const memories = [
    { text: "Our first I love you 💕" },
    { text: "The most special trip to Hungary" },
    { text: "Music festivals becoming a tradition 💗" },
    { text: "Every moment is fun with you 💑" },
    { text: "You're my favorite person 💞" },
    { text: "I'm so grateful to have you 💜" }
];

// Path points for each screen (flamingo climbs bottom to top, halfway up screen)
// x = viewport %, y = viewport vh
const screenPaths = [
    // Screen 1: matches SVG "M 50 95 L 15 75 L 85 55 L 50 50"
    [
        { x: 50, y: 85 },
        { x: 15, y: 70 },
        { x: 85, y: 60 },
        { x: 50, y: 50 }
    ],
    // Screen 2: matches SVG "M 50 95 L 85 75 L 15 55 L 50 50"
    [
        { x: 50, y: 85 },
        { x: 85, y: 70 },
        { x: 15, y: 60 },
        { x: 50, y: 50 }
    ],
    // Screen 3 (peak): flamingo walks up but stops before the sign
    [
        { x: 50, y: 85 },
        { x: 45, y: 73 },
        { x: 50, y: 65 }
    ]
];

// When each memory appears within its screen (3 per screen)
const memorySchedule = [
    { id: 'memory-1', screen: 0, showAt: 0.10, hideAt: 0.35 },
    { id: 'memory-2', screen: 0, showAt: 0.38, hideAt: 0.63 },
    { id: 'memory-3', screen: 0, showAt: 0.66, hideAt: 0.91 },
    { id: 'memory-4', screen: 1, showAt: 0.10, hideAt: 0.35 },
    { id: 'memory-5', screen: 1, showAt: 0.38, hideAt: 0.63 },
    { id: 'memory-6', screen: 1, showAt: 0.66, hideAt: 0.91 },
];

// Scroll phases based on total scroll progress (adjusted for half-page paths)
const SCREEN1_END = 0.25;
const SCREEN2_END = 0.50;
const SCREEN3_END = 1.0;

// Initialize memory text
function initializeMemories() {
    memories.forEach((memory, index) => {
        const overlay = document.getElementById(`memory-${index + 1}`);
        if (overlay) {
            overlay.querySelector('.memory-text').textContent = memory.text;
        }
    });
}

// Interpolate flamingo position along a path
function getFlamingoPosition(pathPoints, progress) {
    const scaled = progress * (pathPoints.length - 1);
    const i = Math.min(Math.floor(scaled), pathPoints.length - 2);
    const t = scaled - i;

    const cur = pathPoints[i];
    const nxt = pathPoints[i + 1];

    return {
        x: cur.x + (nxt.x - cur.x) * t,
        y: cur.y + (nxt.y - cur.y) * t,
        movingLeft: nxt.x < cur.x
    };
}

// Main scroll handler
window.addEventListener('scroll', () => {
    // Hide scroll prompt when user scrolls
    const scrollPrompt = document.getElementById('scrollPrompt');
    if (window.scrollY > 0 && scrollPrompt && !scrollPrompt.classList.contains('hidden')) {
        scrollPrompt.classList.add('hidden');
    }

    const scrollTop = window.scrollY;
    const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
    const total = Math.min(scrollTop / maxScroll, 1);

    let screenIndex, screenProgress;

    if (total < SCREEN1_END) {
        screenIndex = 0;
        screenProgress = total / SCREEN1_END;
    } else if (total < SCREEN2_END) {
        screenIndex = 1;
        screenProgress = (total - SCREEN1_END) / (SCREEN2_END - SCREEN1_END);
    } else {
        screenIndex = 2;
        screenProgress = (total - SCREEN2_END) / (SCREEN3_END - SCREEN2_END);
    }

    // Swap path backgrounds
    pathBg1.classList.toggle('active', screenIndex === 0);
    pathBg2.classList.toggle('active', screenIndex === 1);
    pathBg3.classList.toggle('active', screenIndex === 2);

    // Position flamingo
    const pos = getFlamingoPosition(screenPaths[screenIndex], screenProgress);
    flamingo.style.left = pos.x + '%';
    flamingo.style.top = pos.y + 'vh';
    flamingo.style.transform = pos.movingLeft ? 'scaleX(-1)' : '';
    flamingo.style.opacity = '1';

    // Show/hide memory overlays
    memorySchedule.forEach(mem => {
        const overlay = document.getElementById(mem.id);
        if (screenIndex === mem.screen && screenProgress >= mem.showAt && screenProgress < mem.hideAt) {
            overlay.classList.add('visible');
        } else {
            overlay.classList.remove('visible');
        }
    });
});

// Yes button
btnYes.addEventListener('click', () => {
    modal.classList.remove('hidden');
    createConfetti();
});

// No button - runs away (harder to catch)
let lastNoButtonMove = 0;

btnNo.addEventListener('mouseover', () => {
    const randomX = (Math.random() - 0.5) * 500;
    const randomY = (Math.random() - 0.5) * 400;
    btnNo.style.position = 'relative';
    btnNo.style.left = randomX + 'px';
    btnNo.style.top = randomY + 'px';
    btnNo.style.transition = 'all 0.2s ease';
    lastNoButtonMove = Date.now();
});

btnNo.addEventListener('mousemove', () => {
    const now = Date.now();
    // Only move if at least 300ms has passed since last move
    if (now - lastNoButtonMove > 300) {
        const randomX = (Math.random() - 0.5) * 600;
        const randomY = (Math.random() - 0.5) * 500;
        btnNo.style.position = 'relative';
        btnNo.style.left = randomX + 'px';
        btnNo.style.top = randomY + 'px';
        btnNo.style.transition = 'all 0.15s ease';
        lastNoButtonMove = now;
    }
});

btnNo.addEventListener('click', (e) => {
    e.preventDefault();
    const randomX = (Math.random() - 0.5) * 400;
    const randomY = (Math.random() - 0.5) * 300;
    btnNo.style.left = randomX + 'px';
    btnNo.style.top = randomY + 'px';
});

// Close modal
btnClose.addEventListener('click', () => {
    modal.classList.add('hidden');
});

modal.addEventListener('click', (e) => {
    if (e.target === modal) {
        modal.classList.add('hidden');
    }
});

// Confetti effect
function createConfetti() {
    const colors = ['#FF6B9D', '#FFD700', '#FF1493', '#FF69B4', '#FFB6C1'];

    for (let i = 0; i < 50; i++) {
        const confetti = document.createElement('div');
        confetti.style.position = 'fixed';
        confetti.style.width = Math.random() * 10 + 5 + 'px';
        confetti.style.height = confetti.style.width;
        confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
        confetti.style.left = Math.random() * 100 + '%';
        confetti.style.top = '-10px';
        confetti.style.zIndex = '999';
        confetti.style.borderRadius = '50%';
        confetti.style.pointerEvents = 'none';

        document.body.appendChild(confetti);

        const duration = Math.random() * 2 + 2;
        const xOffset = (Math.random() - 0.5) * 400;
        let startTime = null;

        function animateConfetti(timestamp) {
            if (!startTime) startTime = timestamp;
            const progress = (timestamp - startTime) / (duration * 1000);

            if (progress < 1) {
                confetti.style.top = (progress * 100) + 'vh';
                confetti.style.left = (parseFloat(confetti.style.left) + xOffset * progress) + 'px';
                confetti.style.opacity = 1 - progress;
                requestAnimationFrame(animateConfetti);
            } else {
                confetti.remove();
            }
        }

        requestAnimationFrame(animateConfetti);
    }
}

// Initialize
window.addEventListener('load', () => {
    initializeMemories();
    // Position flamingo at start of first path
    const startPos = getFlamingoPosition(screenPaths[0], 0);
    flamingo.style.left = startPos.x + '%';
    flamingo.style.top = startPos.y + 'vh';
    flamingo.style.opacity = '1';
});
