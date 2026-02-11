/* ============================================
   ORDERS PAGE JS - LOAD ALL ORDERS
============================================ */

let allOrders = [];
let filteredOrders = [];

document.addEventListener("DOMContentLoaded", () => {
    loadAllOrders();
    initSearchFilter();
});

/* ================= LOAD ALL ORDERS ================= */
function loadAllOrders() {
    const ordersHistory = localStorage.getItem("orderHistory");

    if (ordersHistory) {
        try {
            allOrders = JSON.parse(ordersHistory);
        } catch (e) {
            console.error("❌ Failed to parse order history:", e);
            allOrders = [];
        }
    } else {
        allOrders = [];
    }

    // Also check lastOrder (most recent)
    const lastOrder = localStorage.getItem("lastOrder");
    if (lastOrder) {
        try {
            const recentOrder = JSON.parse(lastOrder);
            const exists = allOrders.some(o => o.orderId === recentOrder.orderId);
            if (!exists) {
                recentOrder.status = "processing";
                recentOrder.deliveryDate = getDeliveryDate(3);
                allOrders.unshift(recentOrder);
                saveOrderHistory();
            }
        } catch (e) {
            console.error("❌ Failed to parse lastOrder:", e);
        }
    }

    // Load sample data if no orders
    if (allOrders.length === 0) {
        loadSampleOrders();
    }

    filteredOrders = [...allOrders];
    renderOrders();
    updateOrdersCount();
}

/* ================= SAVE ORDER HISTORY ================= */
function saveOrderHistory() {
    try {
        localStorage.setItem("orderHistory", JSON.stringify(allOrders));
    } catch (e) {
        console.error("❌ Failed to save order history:", e);
    }
}

/* ================= SAMPLE ORDERS ================= */
function loadSampleOrders() {
    allOrders = [
        {
            orderId: "ORD" + Date.now(),
            orderDate: "2/8/2026",
            paymentMethod: "UPI",
            total: "₹69,999",
            transactionId: "TXN" + Date.now(),
            status: "delivered",
            deliveryDate: "2/10/2026",
            address: {
                name: "Sample Customer",
                address: "123 Main Street",
                city: "Bengaluru",
                state: "Karnataka",
                pincode: "560001",
                phone: "+91 9876543210"
            },
            items: [{
                name: "Apple iPhone 15 (Blue, 128 GB)",
                image: "../images/products/iphone.png",
                price: 69999,
                quantity: 1,
                variant: "Blue, 128 GB"
            }]
        },
        {
            orderId: "ORD" + (Date.now() - 86400000),
            orderDate: "2/5/2026",
            paymentMethod: "Credit Card",
            total: "₹58,999",
            transactionId: "TXN" + (Date.now() - 86400000),
            status: "shipped",
            deliveryDate: "2/12/2026",
            address: {
                name: "Sample Customer",
                address: "123 Main Street",
                city: "Bengaluru",
                state: "Karnataka",
                pincode: "560001",
                phone: "+91 9876543210"
            },
            items: [{
                name: "Dell Inspiron Laptop (16 GB RAM)",
                image: "../images/products/laptop.png",
                price: 58999,
                quantity: 1,
                variant: "Silver, 16 GB RAM"
            }]
        },
        {
            orderId: "ORD" + (Date.now() - 172800000),
            orderDate: "1/28/2026",
            paymentMethod: "UPI",
            total: "₹54,999",
            transactionId: "TXN" + (Date.now() - 172800000),
            status: "processing",
            deliveryDate: "2/15/2026",
            address: {
                name: "Sample Customer",
                address: "123 Main Street",
                city: "Bengaluru",
                state: "Karnataka",
                pincode: "560001",
                phone: "+91 9876543210"
            },
            items: [{
                name: "Samsung Galaxy S23 (Green, 256 GB)",
                image: "../images/products/samsung.png",
                price: 54999,
                quantity: 1,
                variant: "Green, 256 GB"
            }]
        }
    ];
    saveOrderHistory();
}

/* ================= RENDER ORDERS ================= */
function renderOrders() {
    const container = document.getElementById("orders-list");
    const emptyState = document.getElementById("empty-orders");

    if (filteredOrders.length === 0) {
        container.style.display = "none";
        emptyState.style.display = "block";
        return;
    }

    container.style.display = "block";
    emptyState.style.display = "none";
    container.innerHTML = "";

    filteredOrders.forEach(order => {
        const orderCard = document.createElement("div");
        orderCard.className = "order-card";

        const statusClass = order.status || "processing";
        const statusText = statusClass.charAt(0).toUpperCase() + statusClass.slice(1);
        const statusIcon = getStatusIcon(order.status);

        let itemsHTML = "";
        order.items.forEach(item => {
            itemsHTML += `
                <div class="order-item">
                    <img src="${item.image}" alt="${item.name}"
                         onerror="this.src='../images/products/samsung.png'">
                    <div class="order-item-info">
                        <h4>${item.name}</h4>
                        ${item.variant ? `<p>${item.variant}</p>` : ""}
                        <p>Seller: Retail Seller</p>
                    </div>
                    <div class="order-item-price">
                        <div class="price">₹${(item.price * item.quantity).toLocaleString()}</div>
                        <div class="qty">Qty: ${item.quantity}</div>
                    </div>
                </div>
            `;
        });

        orderCard.innerHTML = `
            <div class="order-header">
                <div class="order-header-left">
                    <div class="order-id">Order ID: <span>${order.orderId}</span></div>
                    <div class="order-date"><i class="fa-solid fa-calendar"></i> ${order.orderDate}</div>
                </div>
                <div class="order-total">${order.total}</div>
            </div>

            <div class="order-body">
                <div class="order-items-list">${itemsHTML}</div>
                <div style="display:flex;justify-content:space-between;align-items:center;margin-top:16px;">
                    <span class="status-badge ${statusClass}">
                        <i class="${statusIcon}"></i> ${statusText}
                    </span>
                    ${getDeliveryInfo(order)}
                </div>
            </div>

            <div class="order-footer">
                <div class="order-actions">
                    <button class="order-btn btn-view-details" onclick="viewOrderDetails('${order.orderId}')">
                        <i class="fa-solid fa-eye"></i> View Details
                    </button>
                    ${getActionButtons(order)}
                </div>
            </div>
        `;

        container.appendChild(orderCard);
    });
}

/* ================= HELPERS ================= */
function getStatusIcon(status) {
    const icons = {
        processing: "fa-solid fa-gear",
        shipped: "fa-solid fa-truck",
        delivered: "fa-solid fa-circle-check",
        cancelled: "fa-solid fa-circle-xmark"
    };
    return icons[status] || "fa-solid fa-gear";
}

function getDeliveryInfo(order) {
    if (order.status === "delivered") {
        return `<div class="delivery-info delivered"><i class="fa-solid fa-circle-check"></i> Delivered on ${order.deliveryDate}</div>`;
    } else if (order.status === "shipped") {
        return `<div class="delivery-info"><i class="fa-solid fa-truck"></i> Expected by ${order.deliveryDate}</div>`;
    } else if (order.status === "processing") {
        return `<div class="delivery-info"><i class="fa-solid fa-clock"></i> Expected by ${order.deliveryDate}</div>`;
    }
    return `<div class="delivery-info"><i class="fa-solid fa-circle-xmark"></i> Cancelled</div>`;
}

function getActionButtons(order) {
    if (order.status === "processing") {
        return `
            <button class="order-btn btn-track" onclick="trackOrder('${order.orderId}')">
                <i class="fa-solid fa-location-dot"></i> Track Order
            </button>
            <button class="order-btn btn-cancel" onclick="cancelOrder('${order.orderId}')">
                <i class="fa-solid fa-xmark"></i> Cancel
            </button>
        `;
    } else if (order.status === "shipped") {
        return `
            <button class="order-btn btn-track" onclick="trackOrder('${order.orderId}')">
                <i class="fa-solid fa-location-dot"></i> Track Order
            </button>
        `;
    } else if (order.status === "delivered") {
        return `
            <button class="order-btn btn-download" onclick="downloadInvoice('${order.orderId}')">
                <i class="fa-solid fa-download"></i> Invoice
            </button>
        `;
    }
    return "";
}

function getDeliveryDate(days) {
    const date = new Date();
    date.setDate(date.getDate() + days);
    return date.toLocaleDateString();
}

/* ================= COUNT ================= */
function updateOrdersCount() {
    const countEl = document.getElementById("orders-count");
    const count = filteredOrders.length;
    if (countEl) countEl.textContent = `${count} order${count !== 1 ? "s" : ""} found`;
}

/* ================= FILTER ================= */
function filterOrders() {
    const statusFilter = document.querySelector('input[name="status"]:checked').value;
    const timeFilter = parseInt(document.querySelector('input[name="time"]:checked').value);

    filteredOrders = allOrders.filter(order => {
        if (statusFilter !== "all" && order.status !== statusFilter) return false;
        const orderDate = new Date(order.orderDate);
        const daysDiff = Math.floor((new Date() - orderDate) / (1000 * 60 * 60 * 24));
        return daysDiff <= timeFilter;
    });

    renderOrders();
    updateOrdersCount();
}

/* ================= SEARCH ================= */
function initSearchFilter() {
    const searchInput = document.getElementById("search-orders");
    if (!searchInput) return;

    searchInput.addEventListener("input", e => {
        const query = e.target.value.toLowerCase();
        filteredOrders = query === ""
            ? [...allOrders]
            : allOrders.filter(order =>
                order.orderId.toLowerCase().includes(query) ||
                order.items.some(item => item.name.toLowerCase().includes(query)) ||
                order.total.toLowerCase().includes(query)
            );
        renderOrders();
        updateOrdersCount();
    });
}

/* ================= CLEAR FILTERS ================= */
function clearFilters() {
    document.querySelector('input[name="status"][value="all"]').checked = true;
    document.querySelector('input[name="time"][value="30"]').checked = true;
    document.getElementById("search-orders").value = "";
    filteredOrders = [...allOrders];
    renderOrders();
    updateOrdersCount();
}

/* ================= ACTIONS ================= */
function viewOrderDetails(orderId) {
    const order = allOrders.find(o => o.orderId === orderId);
    if (order) {
        localStorage.setItem("lastOrder", JSON.stringify(order));
        window.location.href = "order-placed.html";
    }
}

function trackOrder(orderId) {
    alert(`Tracking info for order ${orderId}\n\nYour order is on the way!`);
}

function downloadInvoice(orderId) {
    alert(`Downloading invoice for order ${orderId}`);
}

function cancelOrder(orderId) {
    if (confirm(`Cancel order ${orderId}?`)) {
        const order = allOrders.find(o => o.orderId === orderId);
        if (order) {
            order.status = "cancelled";
            saveOrderHistory();
            filterOrders();
            alert("Order cancelled successfully!");
        }
    }
}

/* ================= GLOBALS ================= */
window.filterOrders = filterOrders;
window.clearFilters = clearFilters;
window.viewOrderDetails = viewOrderDetails;
window.trackOrder = trackOrder;
window.downloadInvoice = downloadInvoice;
window.cancelOrder = cancelOrder;

console.log("✅ Orders page loaded");