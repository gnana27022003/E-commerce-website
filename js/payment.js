/* ============================================
   PAYMENT PAGE JS (FINAL CONNECTED VERSION)
============================================ */

let cartItems = [];

document.addEventListener("DOMContentLoaded", () => {
    loadCartFromStorage();
    calculatePaymentTotals();
    initPaymentPage();
    initToggles();
    initCardFormatting();
});

/* ================= LOAD CART ================= */

function loadCartFromStorage() {
    const savedCart = localStorage.getItem("cart");

    if (!savedCart) {
        console.warn("❌ Cart is empty on payment page");
        cartItems = [];
        return;
    }

    try {
        cartItems = JSON.parse(savedCart);
        if (!Array.isArray(cartItems)) throw new Error("Invalid cart format");
    } catch (err) {
        console.error("❌ Failed to parse cart:", err);
        cartItems = [];
    }
}

/* ================= CALCULATE TOTAL ================= */

function calculatePaymentTotals() {
    let totalMRP = 0;
    let totalPrice = 0;
    let protectFee = 0;

    cartItems.forEach(item => {
        item.quantity ??= 1;
        item.originalPrice ??= item.price;
        item.protectFee ??= 0;

        totalMRP += item.originalPrice * item.quantity;
        totalPrice += item.price * item.quantity;
        protectFee += item.protectFee;
    });

    const discount = totalMRP - totalPrice;
    const finalAmount = totalPrice + protectFee;

    /* ===== UPDATE PRICE SIDEBAR ===== */

    const mrpEl = document.getElementById("mrp-total");
    const discountEl = document.getElementById("discount-total");
    const protectEl = document.getElementById("protect-fee");
    const totalEl = document.getElementById("total-amount");

    if (mrpEl) mrpEl.textContent = `₹${totalMRP.toLocaleString()}`;
    if (discountEl) discountEl.textContent = `-₹${discount.toLocaleString()}`;
    if (protectEl) protectEl.textContent = `₹${protectFee.toLocaleString()}`;
    if (totalEl) totalEl.textContent = `₹${finalAmount.toLocaleString()}`;

    /* ===== UPDATE ALL PAY BUTTONS ===== */

    document.querySelectorAll(".pay-btn").forEach(btn => {
        btn.textContent = `Pay ₹${finalAmount.toLocaleString()}`;
    });
}

/* ================= PAYMENT METHOD SELECT ================= */

function selectPaymentMethod(method) {
    document.querySelectorAll(".method-content")
        .forEach(c => c.style.display = "none");

    document.querySelectorAll(".payment-method-card")
        .forEach(c => c.classList.remove("active"));

    const content = document.getElementById(`${method}-content`);
    const card = document.getElementById(`${method}-card`);

    if (content) content.style.display = "block";
    if (card) card.classList.add("active");
}

/* ================= TOGGLES ================= */

function initToggles() {
    ["fees", "discounts"].forEach(type => {
        const toggle = document.getElementById(`${type}-toggle`);
        const breakdown = document.getElementById(`${type}-breakdown`);

        if (toggle && breakdown) {
            toggle.addEventListener("click", () => {
                toggle.classList.toggle("collapsed");
                breakdown.classList.toggle("hidden");
            });
        }
    });
}

/* ================= CARD INPUT FORMATTING ================= */

function initCardFormatting() {
    const cardNum = document.getElementById("card-number");
    const expiry = document.getElementById("card-expiry");
    const cvv = document.getElementById("card-cvv");

    if (cardNum) {
        cardNum.addEventListener("input", e => {
            let val = e.target.value.replace(/\s/g, "");
            e.target.value = val.match(/.{1,4}/g)?.join(" ") || val;
        });
    }

    if (expiry) {
        expiry.addEventListener("input", e => {
            let val = e.target.value.replace(/\D/g, "");
            if (val.length >= 2) val = val.slice(0, 2) + "/" + val.slice(2, 4);
            e.target.value = val;
        });
    }

    if (cvv) {
        cvv.addEventListener("input", e => {
            e.target.value = e.target.value.replace(/\D/g, "");
        });
    }
}

/* ================= VERIFY UPI ================= */

function verifyUPI() {
    const input = document.getElementById("upi-id");
    const verifyBtn = document.querySelector(".verify-btn");
    const payBtn = document.getElementById("upi-pay-btn");

    if (!input.value.trim()) {
        alert("Enter a valid UPI ID");
        return;
    }

    verifyBtn.textContent = "Verifying...";
    verifyBtn.disabled = true;

    setTimeout(() => {
        verifyBtn.textContent = "Verified ✓";
        verifyBtn.style.background = "#388e3c";
        payBtn.disabled = false;
        payBtn.style.background = "#ff9f00";
        payBtn.style.cursor = "pointer";
    }, 1500);
}

/* ================= PROCESS PAYMENT ================= */

function processPayment(method) {
    const totalAmount = document.getElementById("total-amount")?.textContent || "₹0";
    
    // Get saved addresses from localStorage
    const savedAddresses = JSON.parse(localStorage.getItem("savedAddresses") || "[]");
    const selectedAddress = savedAddresses[0] || {
        name: "Customer",
        address: "Address not provided",
        city: "",
        state: "",
        pincode: "",
        phone: ""
    };

    // Create comprehensive order data
    const orderData = {
        orderId: "ORD" + Date.now(),
        orderDate: new Date().toLocaleDateString(),
        paymentMethod: method.toUpperCase(),
        total: totalAmount,
        transactionId: "TXN" + Date.now(),
        address: selectedAddress,
        items: cartItems.map(item => ({
            name: item.name,
            image: item.image,
            price: item.price,
            quantity: item.quantity || 1,
            variant: item.color || item.variant || ""
        }))
    };

    // Save order to localStorage
    localStorage.setItem("lastOrder", JSON.stringify(orderData));
    localStorage.setItem("paymentMethod", orderData.paymentMethod);
    
    // Show processing message
    alert(`Processing ${method.toUpperCase()} payment of ${totalAmount}...`);
    
    // Clear cart after successful payment
    localStorage.removeItem("cart");

    // Redirect to order placed page
    setTimeout(() => {
        window.location.href = "order-placed.html";
    }, 1000);
}

/* ================= INIT PAYMENT PAGE ================= */

function initPaymentPage() {
    selectPaymentMethod("upi");

    document.querySelectorAll(".pay-btn").forEach(btn => {
        btn.addEventListener("click", e => {
            e.preventDefault();
            const method = btn.closest(".payment-method-card").id.replace("-card", "");
            processPayment(method);
        });
    });

    const verifyBtn = document.querySelector(".verify-btn");
    if (verifyBtn) verifyBtn.addEventListener("click", e => {
        e.preventDefault();
        verifyUPI();
    });

    const upiPayBtn = document.getElementById("upi-pay-btn");
    if (upiPayBtn) {
        upiPayBtn.disabled = true;
        upiPayBtn.style.background = "#c2c2c2";
        upiPayBtn.style.cursor = "not-allowed";
    }
}

window.selectPaymentMethod = selectPaymentMethod;

console.log("✅ Payment page loaded successfully");
