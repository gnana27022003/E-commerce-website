/* ============================================
   ORDER PLACED PAGE JS (CONNECTED VERSION)
============================================ */

let orderData = null;

document.addEventListener("DOMContentLoaded", () => {
    loadOrderData();
    renderOrderDetails();
    initAnimations();
    initEventListeners();
    initConfetti();

    setTimeout(() => {
        showNotification("Order confirmation email sent!", "success");
    }, 1000);
});

/* ================= LOAD ORDER ================= */

function loadOrderData() {
    const savedOrder = localStorage.getItem("lastOrder");

    if (!savedOrder) {
        alert("No order found. Redirecting to home.");
        window.location.href = "home.html";
        return;
    }

    try {
        orderData = JSON.parse(savedOrder);
    } catch (e) {
        console.error("Failed to parse order:", e);
        window.location.href = "home.html";
    }
}

/* ================= RENDER ORDER ================= */

function renderOrderDetails() {
    /* ===== BASIC DETAILS ===== */
    setText("order-id", orderData.orderId);
    setText("order-date", orderData.orderDate);
    setText("payment-method", orderData.paymentMethod);
    setText("order-total", orderData.total);

    /* ===== ADDRESS ===== */
    if (orderData.address) {
        setText("cust-name", orderData.address.name || "");
        setText(
            "cust-address",
            `${orderData.address.address || ""}, ${orderData.address.city || ""}, ${orderData.address.state || ""} - ${orderData.address.pincode || ""}`
        );
        setText("cust-phone", orderData.address.phone || "");
    }

    /* ===== ITEMS ===== */
    const itemsContainer = document.getElementById("ordered-items");
    if (!itemsContainer) return;

    itemsContainer.innerHTML = "";

    orderData.items.forEach(item => {
        const div = document.createElement("div");
        div.className = "ordered-item";

        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}">
            <div class="item-info">
                <h4>${item.name}</h4>
                <p>Qty: ${item.quantity}</p>
                <p class="price">₹${(item.price * item.quantity).toLocaleString()}</p>
            </div>
        `;

        itemsContainer.appendChild(div);
    });
}

/* ================= HELPERS ================= */

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) el.textContent = value;
}

/* ================= ANIMATIONS ================= */

function initAnimations() {
    const sections = document.querySelectorAll(".fade-section");
    sections.forEach((el, i) => {
        el.style.opacity = "0";
        el.style.transform = "translateY(20px)";
        setTimeout(() => {
            el.style.transition = "all 0.5s ease";
            el.style.opacity = "1";
            el.style.transform = "translateY(0)";
        }, i * 120);
    });
}

/* ================= EVENTS ================= */

function initEventListeners() {
    const trackBtn = document.getElementById("track-order-btn");
    if (trackBtn) {
        trackBtn.addEventListener("click", () => {
            alert(`Tracking will be available once shipped.\nOrder ID: ${orderData.orderId}`);
        });
    }

    const invoiceBtn = document.getElementById("invoice-btn");
    if (invoiceBtn) {
        invoiceBtn.addEventListener("click", downloadInvoice);
    }

    const homeBtn = document.getElementById("continue-shopping-btn");
    if (homeBtn) {
        homeBtn.addEventListener("click", () => {
            window.location.href = "home.html";
        });
    }
}

/* ================= INVOICE ================= */

function downloadInvoice() {
    alert(`Invoice for ${orderData.orderId} downloaded`);
    showNotification("Invoice downloaded", "success");
}

/* ================= NOTIFICATION ================= */

function showNotification(message, type = "info") {
    const n = document.createElement("div");
    n.style.cssText = `
        position: fixed;
        top: 90px;
        right: 20px;
        background: ${type === "success" ? "#388e3c" : "#2874f0"};
        color: #fff;
        padding: 14px 20px;
        border-radius: 4px;
        z-index: 9999;
        font-size: 14px;
    `;
    n.textContent = message;
    document.body.appendChild(n);

    setTimeout(() => n.remove(), 3000);
}

/* ================= CONFETTI ================= */

function initConfetti() {
    const colors = ["#2874f0", "#ff9f00", "#388e3c"];

    for (let i = 0; i < 40; i++) {
        setTimeout(() => {
            const c = document.createElement("div");
            c.style.cssText = `
                position: fixed;
                top: -10px;
                left: ${Math.random() * 100}%;
                width: 8px;
                height: 8px;
                background: ${colors[Math.floor(Math.random() * colors.length)]};
                animation: fall 3s linear;
                z-index: 9999;
            `;
            document.body.appendChild(c);
            setTimeout(() => c.remove(), 3000);
        }, i * 60);
    }
}

/* ================= STYLES ================= */

const style = document.createElement("style");
style.textContent = `
@keyframes fall {
    to {
        transform: translateY(100vh) rotate(720deg);
        opacity: 0;
    }
}
`;
document.head.appendChild(style);

console.log("✅ Order placed page loaded");
console.log("ORDER DATA:", orderData);
