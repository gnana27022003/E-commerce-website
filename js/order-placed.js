/* ============================================
   ORDER PLACED PAGE JS (STANDALONE)
============================================ */

document.addEventListener("DOMContentLoaded", () => {
    console.log("=== ORDER PLACED PAGE LOADED ===");
    loadAndRenderOrder();
});

/* ================= MAIN LOAD FUNCTION ================= */

function loadAndRenderOrder() {
    const rawOrder = localStorage.getItem("lastOrder");
    console.log("Raw order from localStorage:", rawOrder);

    if (!rawOrder) {
        console.error("❌ No order found in localStorage");
        alert("No order found. Redirecting to home.");
        window.location.href = "home.html";
        return;
    }

    try {
        const orderData = JSON.parse(rawOrder);
        console.log("✅ ORDER DATA:", orderData);
        console.log("Order ID:", orderData.orderId);
        console.log("Items count:", orderData.items?.length);

        renderBasicDetails(orderData);
        renderAddress(orderData);
        renderOrderItems(orderData);
        renderPriceSummary(orderData);
        renderEmail();
    } catch (e) {
        console.error("❌ Failed to parse order:", e);
        alert("Error loading order. Redirecting to home.");
        window.location.href = "home.html";
    }
}

/* ================= BASIC DETAILS ================= */

function renderBasicDetails(order) {
    console.log("--- Rendering basic details ---");
    setText("order-id", order.orderId);
    setText("payment-method", order.paymentMethod);
    setText("order-total", order.total);
    setText("transaction-id", order.transactionId);
    setText("payment-date", order.orderDate);
    setText("order-date-timeline", order.orderDate);
    console.log("✅ Basic details rendered");
}

/* ================= ADDRESS ================= */

function renderAddress(order) {
    console.log("--- Rendering address ---");
    
    if (!order.address) {
        console.warn("⚠️ No address in order data");
        return;
    }

    setText("cust-name", order.address.name);
    setText("cust-address", 
        `${order.address.address}, ${order.address.city}, ${order.address.state} - ${order.address.pincode}`
    );
    setText("cust-phone", order.address.phone);
    console.log("✅ Address rendered");
}

/* ================= ORDER ITEMS ================= */

function renderOrderItems(order) {
    console.log("--- Rendering order items ---");
    const container = document.getElementById("order-items");

    if (!container) {
        console.error("❌ #order-items container NOT FOUND in HTML");
        console.log("Available IDs:", Array.from(document.querySelectorAll('[id]')).map(el => el.id));
        return;
    }

    console.log("✅ Container found:", container);

    if (!order.items || order.items.length === 0) {
        console.warn("⚠️ No items in order");
        container.innerHTML = `<p style="color:#878787;padding:16px;">No items found</p>`;
        return;
    }

    console.log(`📦 Rendering ${order.items.length} items...`);
    container.innerHTML = "";

    order.items.forEach((item, index) => {
        console.log(`Item ${index + 1}:`, item);

        const div = document.createElement("div");
        div.className = "order-item";

        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}"
                 onerror="this.src='../images/products/samsung.png'">
            <div class="item-info">
                <h3>${item.name}</h3>
                ${item.variant ? `<p>${item.variant}</p>` : ""}
                <p>Quantity: ${item.quantity}</p>
            </div>
            <div class="item-price">
                <strong>₹${(item.price * item.quantity).toLocaleString()}</strong>
            </div>
        `;

        container.appendChild(div);
        console.log(`✅ Item ${index + 1} added to DOM`);
    });

    console.log("🎉 ALL ITEMS RENDERED SUCCESSFULLY!");
}

/* ================= PRICE SUMMARY ================= */

function renderPriceSummary(order) {
    console.log("--- Rendering price summary ---");
    
    if (!order.items || order.items.length === 0) return;

    let subtotal = 0;
    let itemCount = 0;

    order.items.forEach(item => {
        const qty = item.quantity || 1;
        subtotal += item.price * qty;
        itemCount += qty;
    });

    setText("subtotal-items", itemCount);
    setText("subtotal-price", `₹${subtotal.toLocaleString()}`);
    setText("total-paid", `₹${subtotal.toLocaleString()}`);
    
    console.log("✅ Price summary rendered");
}

/* ================= EMAIL ================= */

function renderEmail() {
    console.log("--- Rendering email ---");
    
    // Try to get email from order data first
    const orderData = JSON.parse(localStorage.getItem("lastOrder"));
    let email = orderData?.email;
    
    // If not in order data, try localStorage
    if (!email) {
        email = localStorage.getItem("checkoutEmail") || 
                localStorage.getItem("userEmail") || 
                "customer@email.com";
    }
    
    setText("customer-email", email);
    console.log("✅ Email set to:", email);
}

/* ================= HELPER FUNCTIONS ================= */

function setText(id, value) {
    const el = document.getElementById(id);
    if (el) {
        el.textContent = value || "—";
        console.log(`Set #${id} = ${value}`);
    } else {
        console.warn(`⚠️ Element #${id} not found`);
    }
}

/* ================= BUTTON ACTIONS ================= */

function trackOrder() {
    const orderId = document.getElementById("order-id").textContent;
    alert(`Tracking will be available once shipped.\nOrder ID: ${orderId}`);
}

function downloadInvoice() {
    const orderId = document.getElementById("order-id").textContent;
    alert(`Invoice for order ${orderId} will be downloaded`);
    console.log("📄 Invoice download requested for:", orderId);
}

/* ================= GLOBAL FUNCTIONS ================= */

// Make functions available globally for onclick handlers
window.trackOrder = trackOrder;
window.downloadInvoice = downloadInvoice;

console.log("✅ Order placed page script fully loaded");
