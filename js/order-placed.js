/* ============================================
   ORDER PLACED PAGE JS (STANDALONE)
============================================ */

document.addEventListener("DOMContentLoaded", () => {
    console.log("=== ORDER PLACED PAGE LOADED ===");
    loadAndRenderOrder();
    
    // 🎉 Launch confetti animation
    setTimeout(() => {
        launchConfetti();
    }, 500);
});

/* ================= MAIN LOAD FUNCTION ================= */



/* ================= BASIC DETAILS ================= */



/* ================= ADDRESS ================= */


/* ================= ORDER ITEMS ================= */


/* ================= PRICE SUMMARY ================= */




/* ================= HELPER FUNCTIONS ================= */


/* ================= BUTTON ACTIONS ================= */





/* ================= GLOBAL FUNCTIONS ================= */

// Make functions available globally for onclick handlers
window.trackOrder = trackOrder;
window.downloadInvoice = downloadInvoice;

/* ================= CONFETTI ANIMATION ================= */

function launchConfetti() {
    console.log("🎉 Launching confetti...");
    
    const colors = ['#2874f0', '#ff9f00', '#388e3c', '#e74c3c', '#9b59b6', '#f39c12'];
    const confettiCount = 80;
    
    for (let i = 0; i < confettiCount; i++) {
        setTimeout(() => {
            createConfettiPiece(colors);
        }, i * 30);
    }
}

function createConfettiPiece(colors) {
    const confetti = document.createElement('div');
    const color = colors[Math.floor(Math.random() * colors.length)];
    const left = Math.random() * 100;
    const animationDuration = 2 + Math.random() * 2;
    const size = 8 + Math.random() * 4;
    const rotation = Math.random() * 360;
    
    confetti.style.cssText = `
        position: fixed;
        top: -10px;
        left: ${left}%;
        width: ${size}px;
        height: ${size}px;
        background: ${color};
        opacity: 0.9;
        transform: rotate(${rotation}deg);
        z-index: 9999;
        pointer-events: none;
        animation: confettiFall ${animationDuration}s linear forwards;
    `;
    
    document.body.appendChild(confetti);
    
    setTimeout(() => {
        confetti.remove();
    }, animationDuration * 1000);
}

// Add confetti animation CSS
const style = document.createElement('style');
style.textContent = `
    @keyframes confettiFall {
        0% {
            transform: translateY(0) rotate(0deg);
            opacity: 1;
        }
        100% {
            transform: translateY(100vh) rotate(720deg);
            opacity: 0;
        }
    }
`;
document.head.appendChild(style);

console.log("✅ Order placed page script fully loaded");