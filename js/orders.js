/* ============================================
   ORDERS PAGE JS - CLEAN VERSION
============================================ */

let allOrders = [];
let filteredOrders = [];

document.addEventListener("DOMContentLoaded", () => {
    loadAllOrders();
    initSearchFilter();
});

/* ================= LOAD ALL ORDERS ================= */
function loadAllOrders() {
    // Load order history
    try {
        const h = localStorage.getItem("orderHistory");
        allOrders = h ? JSON.parse(h) : [];
    } catch(e) { allOrders = []; }

    // Merge lastOrder if not already in history
    try {
        const last = localStorage.getItem("lastOrder");
        if (last) {
            const o = JSON.parse(last);
            if (!allOrders.some(x => x.orderId === o.orderId)) {
                o.status = o.status || "processing";
                o.deliveryDate = o.deliveryDate || getDate(5);
                allOrders.unshift(o);
                saveHistory();
            }
        }
    } catch(e) {}

    // Use sample data if still empty
    if (allOrders.length === 0) {
        allOrders = getSampleOrders();
        saveHistory();
    }

    filteredOrders = [...allOrders];
    renderOrders();
    updateCount();
}

/* ================= SAMPLE ORDERS ================= */
function getSampleOrders() {
    const today = new Date();
    const fmt = d => `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;
    const d1 = new Date(today); d1.setDate(today.getDate() - 2);
    const d2 = new Date(today); d2.setDate(today.getDate() - 7);
    const d3 = new Date(today); d3.setDate(today.getDate() - 14);

    return [
        {
            orderId: "ORD" + Date.now(),
            orderDate: fmt(d1),
            paymentMethod: "UPI",
            total: "₹69,999",
            status: "delivered",
            deliveryDate: fmt(today),
            address: { name: "Sample Customer", address: "123 Main St", city: "Bengaluru", state: "Karnataka", pincode: "560001", phone: "+91 9876543210" },
            items: [{ name: "Apple iPhone 15 (Blue, 128 GB)", image: "../images/products/Iphone15.png", price: 69999, quantity: 1, variant: "Blue, 128 GB" }]
        },
        {
            orderId: "ORD" + (Date.now() - 1),
            orderDate: fmt(d2),
            paymentMethod: "Credit Card",
            total: "₹58,999",
            status: "shipped",
            deliveryDate: getDate(3),
            address: { name: "Sample Customer", address: "123 Main St", city: "Bengaluru", state: "Karnataka", pincode: "560001", phone: "+91 9876543210" },
            items: [{ name: "Dell Inspiron Laptop (16 GB RAM)", image: "../images/products/laptop.png", price: 58999, quantity: 1, variant: "Silver, 16 GB" }]
        },
        {
            orderId: "ORD" + (Date.now() - 2),
            orderDate: fmt(d3),
            paymentMethod: "UPI",
            total: "₹54,999",
            status: "processing",
            deliveryDate: getDate(5),
            address: { name: "Sample Customer", address: "123 Main St", city: "Bengaluru", state: "Karnataka", pincode: "560001", phone: "+91 9876543210" },
            items: [{ name: "Samsung Galaxy S23 (Green, 256 GB)", image: "../images/products/samsung.png", price: 54999, quantity: 1, variant: "Green, 256 GB" }]
        }
    ];
}

/* ================= RENDER ORDERS ================= */
function renderOrders() {
    const list = document.getElementById("orders-list");
    const empty = document.getElementById("empty-orders");

    if (filteredOrders.length === 0) {
        list.innerHTML = "";
        empty.style.display = "block";
        return;
    }
    empty.style.display = "none";
    list.innerHTML = "";

    filteredOrders.forEach(order => {
        const card = document.createElement("div");
        card.className = "order-card";

        const statusIcon = { processing:"fa-gear", shipped:"fa-truck", delivered:"fa-circle-check", cancelled:"fa-circle-xmark" };
        const icon = statusIcon[order.status] || "fa-gear";
        const label = order.status ? order.status[0].toUpperCase() + order.status.slice(1) : "Processing";

        const itemsHTML = order.items.map(item => `
            <div class="order-item">
                <img src="${item.image}" alt="${item.name}" onerror="this.src='../images/products/samsung.png'">
                <div class="order-item-info">
                    <h4>${item.name}</h4>
                    ${item.variant ? `<p>${item.variant}</p>` : ""}
                    <p>Qty: ${item.quantity}</p>
                </div>
                <div class="order-item-price">
                    <div class="price">₹${(item.price * item.quantity).toLocaleString()}</div>
                </div>
            </div>
        `).join("");

        const deliveryHTML = order.status === "delivered"
            ? `<div class="delivery-info delivered"><i class="fa-solid fa-circle-check"></i> Delivered on ${order.deliveryDate}</div>`
            : order.status === "shipped"
            ? `<div class="delivery-info"><i class="fa-solid fa-truck"></i> Expected by ${order.deliveryDate}</div>`
            : order.status === "processing"
            ? `<div class="delivery-info"><i class="fa-solid fa-clock"></i> Expected by ${order.deliveryDate}</div>`
            : `<div class="delivery-info"><i class="fa-solid fa-circle-xmark"></i> Cancelled</div>`;

        const actionHTML = order.status === "delivered"
            ? `<button class="order-btn btn-invoice" onclick="downloadInvoice('${order.orderId}')"><i class="fa-solid fa-file-invoice"></i> Invoice</button>`
            : order.status === "shipped"
            ? `<button class="order-btn btn-track" onclick="trackOrder('${order.orderId}')"><i class="fa-solid fa-location-dot"></i> Track</button>`
            : order.status === "processing"
            ? `<button class="order-btn btn-track" onclick="trackOrder('${order.orderId}')"><i class="fa-solid fa-location-dot"></i> Track</button>
               <button class="order-btn btn-cancel" onclick="cancelOrder('${order.orderId}')"><i class="fa-solid fa-xmark"></i> Cancel</button>`
            : "";

        card.innerHTML = `
            <div class="order-header">
                <div class="order-header-left">
                    <div class="order-id">Order: <span>${order.orderId}</span></div>
                    <div class="order-date"><i class="fa-solid fa-calendar-days"></i> ${order.orderDate}</div>
                    <span class="status-badge ${order.status || 'processing'}">
                        <i class="fa-solid ${icon}"></i> ${label}
                    </span>
                </div>
                <div class="order-total">${order.total}</div>
            </div>
            <div class="order-body">
                <div class="order-items-list">${itemsHTML}</div>
                <div class="order-meta">${deliveryHTML}</div>
            </div>
            <div class="order-footer">
                <button class="order-btn btn-view" onclick="viewOrder('${order.orderId}')">
                    <i class="fa-solid fa-eye"></i> View Details
                </button>
                ${actionHTML}
            </div>
        `;
        list.appendChild(card);
    });
}

/* ================= FILTERS ================= */
function applyFilters() {
    const status = document.querySelector('input[name="status"]:checked').value;
    const days = parseInt(document.querySelector('input[name="time"]:checked').value);

    filteredOrders = allOrders.filter(order => {
        if (status !== "all" && order.status !== status) return false;
        const diff = Math.floor((new Date() - new Date(order.orderDate)) / 86400000);
        return diff <= days;
    });
    renderOrders();
    updateCount();
}

function clearFilters() {
    document.querySelector('input[name="status"][value="all"]').checked = true;
    document.querySelector('input[name="time"][value="3650"]').checked = true;
    document.getElementById("search-orders").value = "";
    filteredOrders = [...allOrders];
    renderOrders();
    updateCount();
}

/* ================= SEARCH ================= */
function initSearchFilter() {
    const searchInput = document.getElementById("search-orders");
    if (!searchInput) return;

    searchInput.addEventListener("input", e => {
        const q = e.target.value.toLowerCase();
        filteredOrders = q === "" ? [...allOrders] : allOrders.filter(o =>
            o.orderId.toLowerCase().includes(q) ||
            o.items.some(i => i.name.toLowerCase().includes(q))
        );
        renderOrders();
        updateCount();
    });
}

/* ================= HELPERS ================= */
function updateCount() {
    const el = document.getElementById("orders-count");
    const n = filteredOrders.length;
    if (el) el.textContent = `${n} order${n !== 1 ? "s" : ""} found`;
}

function saveHistory() {
    try { localStorage.setItem("orderHistory", JSON.stringify(allOrders)); } catch(e) {}
}

function getDate(daysAhead) {
    const d = new Date();
    d.setDate(d.getDate() + daysAhead);
    return `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;
}

/* ================= ACTIONS ================= */
function viewOrder(orderId) {
    const order = allOrders.find(o => o.orderId === orderId);
    if (order) {
        localStorage.setItem("lastOrder", JSON.stringify(order));
        window.location.href = "order-placed.html";
    }
}

function trackOrder(orderId) {
    alert(`Tracking info for ${orderId}\n\nYour order is on the way!`);
}

function downloadInvoice(orderId) {
    alert(`Downloading invoice for ${orderId}`);
}

function cancelOrder(orderId) {
    if (confirm(`Cancel order ${orderId}?`)) {
        const o = allOrders.find(x => x.orderId === orderId);
        if (o) {
            o.status = "cancelled";
            saveHistory();
            applyFilters();
        }
    }
}

console.log("✅ Orders page loaded");
