/* ============================================
   PAYMENT PAGE JS (FINAL CLEAN VERSION)
============================================ */

document.addEventListener('DOMContentLoaded', () => {

    loadCartFromStorage();
    calculatePaymentTotals();

    initPaymentPage();
    initToggles();
    initCardFormatting();

});

/* ================= LOAD CART ================= */

let cartItems = [];

function loadCartFromStorage() {

    const savedCart = localStorage.getItem("cart");

    console.log("PAYMENT CART RAW:", savedCart);

    if (savedCart) {
        cartItems = JSON.parse(savedCart);
    }

    if (!cartItems.length) {
        console.warn("Cart empty on payment page");
    }

}

/* ================= CALCULATE TOTAL ================= */

function calculatePaymentTotals() {

    let totalMRP = 0;
    let totalPrice = 0;
    let protectFee = 0;
    let totalItems = 0;

    cartItems.forEach(item => {

        /* ==== SAFE NORMALIZATION ==== */

        item.quantity ??= 1;
        item.originalPrice ??= item.price;
        item.protectFee ??= 0;

        totalMRP += item.originalPrice * item.quantity;
        totalPrice += item.price * item.quantity;
        protectFee += item.protectFee;
        totalItems += item.quantity;

    });

    const discount = totalMRP - totalPrice;
    const finalAmount = totalPrice + protectFee;

    console.log("MRP:", totalMRP);
    console.log("Final:", finalAmount);

    /* ===== UPDATE SIDEBAR ===== */

    const mrpEl = document.getElementById("mrp-total");
    const totalAmountEl = document.getElementById("total-amount");
    const protectEl = document.getElementById("protect-fee");
    const discountEl = document.getElementById("discount-total");

    if (mrpEl)
        mrpEl.textContent = `₹${totalMRP.toLocaleString()}`;

    if (protectEl)
        protectEl.textContent = `₹${protectFee.toLocaleString()}`;

    if (discountEl)
        discountEl.textContent = `-₹${discount.toLocaleString()}`;

    if (totalAmountEl)
        totalAmountEl.textContent = `₹${finalAmount.toLocaleString()}`;

    /* ===== UPDATE PAY BUTTONS ===== */

    document.querySelectorAll(".pay-btn").forEach(btn => {
        btn.textContent = `Pay ₹${finalAmount.toLocaleString()}`;
    });

}

/* ================= PAYMENT METHOD SELECT ================= */

function selectPaymentMethod(method) {

    document.querySelectorAll('.method-content')
        .forEach(c => c.style.display = 'none');

    document.querySelectorAll('.payment-method-card')
        .forEach(c => c.classList.remove('active'));

    const content = document.getElementById(`${method}-content`);
    const card = document.getElementById(`${method}-card`);

    if (content) content.style.display = 'block';
    if (card) card.classList.add('active');

}

/* ================= TOGGLES ================= */

function initToggles() {

    ['fees','discounts'].forEach(type => {

        const toggle = document.getElementById(`${type}-toggle`);
        const breakdown = document.getElementById(`${type}-breakdown`);

        if(toggle && breakdown){

            toggle.addEventListener('click', () => {
                toggle.classList.toggle('collapsed');
                breakdown.classList.toggle('hidden');
            });

        }

    });

}

/* ================= CARD FORMATTING ================= */

function initCardFormatting() {

    const cardNum = document.getElementById('card-number');
    const expiry = document.getElementById('card-expiry');
    const cvv = document.getElementById('card-cvv');

    if (cardNum) {
        cardNum.addEventListener('input', e => {

            let val = e.target.value.replace(/\s/g, '');
            e.target.value = val.match(/.{1,4}/g)?.join(' ') || val;

        });
    }

    if (expiry) {
        expiry.addEventListener('input', e => {

            let val = e.target.value.replace(/\D/g, '');

            if (val.length >= 2)
                val = val.slice(0,2) + '/' + val.slice(2,4);

            e.target.value = val;

        });
    }

    if (cvv) {
        cvv.addEventListener('input', e => {
            e.target.value = e.target.value.replace(/\D/g,'');
        });
    }

}

/* ================= VERIFY UPI ================= */

function verifyUPI() {

    const input = document.getElementById('upi-id');
    const verifyBtn = document.querySelector('.verify-btn');
    const payBtn = document.getElementById('upi-pay-btn');

    if (!input.value) return alert("Enter UPI ID");

    verifyBtn.textContent = "Verifying...";
    verifyBtn.disabled = true;

    setTimeout(() => {

        verifyBtn.textContent = "Verified ✓";
        verifyBtn.style.background = "#388e3c";

        payBtn.disabled = false;
        payBtn.style.background = "#ff9f00";

    },1500);

}

/* ================= PROCESS PAYMENT ================= */

function processPayment(method) {

    const totalAmount =
        document.getElementById("total-amount").textContent;

    // ✅ Create Order Object
    const orderData = {
        orderId: "ORD" + Date.now(),
        paymentMethod: method.toUpperCase(),
        total: totalAmount,
        items: cartItems,
        orderDate: new Date().toLocaleString()
    };

    // ✅ Save order in localStorage
    localStorage.setItem("lastOrder", JSON.stringify(orderData));

    // ✅ Clear cart
    localStorage.removeItem("cart");

    // ✅ Redirect to Order Success Page
    window.location.href = "order-placed.html";
}


/* ================= INIT PAYMENT PAGE ================= */

function initPaymentPage() {

    selectPaymentMethod("upi");

    document.querySelectorAll(".pay-btn").forEach(btn => {

        btn.addEventListener("click", e => {

            e.preventDefault();

            const method =
                btn.closest(".payment-method-card")
                .id.replace("-card","");

            processPayment(method);

        });

    });

    const verifyBtn = document.querySelector(".verify-btn");

    if (verifyBtn)
        verifyBtn.addEventListener("click", e => {
            e.preventDefault();
            verifyUPI();
        });

    const upiPayBtn = document.getElementById("upi-pay-btn");

    if (upiPayBtn) {
        upiPayBtn.disabled = true;
        upiPayBtn.style.background = "#c2c2c2";
    }

}

window.selectPaymentMethod = selectPaymentMethod;
