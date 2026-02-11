/* ============================================
   ORDERS PAGE JS - ULTRA CONCISE
============================================ */

let all = [], filt = [];

document.addEventListener("DOMContentLoaded", () => {
    load();
    initSearch();
});

/* LOAD */
function load() {
    try {
        const h = localStorage.getItem("orderHistory");
        all = h ? JSON.parse(h) : [];
    } catch(e) { all = []; }

    try {
        const l = localStorage.getItem("lastOrder");
        if (l) {
            const o = JSON.parse(l);
            if (!all.some(x => x.orderId === o.orderId)) {
                o.status = o.status || "processing";
                o.deliveryDate = o.deliveryDate || getDate(5);
                all.unshift(o);
                save();
            }
        }
    } catch(e) {}

    if (all.length === 0) {
        all = sample();
        save();
    }

    filt = [...all];
    render();
    updateCount();
}

/* SAMPLE */
function sample() {
    const t = new Date();
    const fmt = d => `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;
    const d1 = new Date(t); d1.setDate(t.getDate() - 2);
    const d2 = new Date(t); d2.setDate(t.getDate() - 7);
    const d3 = new Date(t); d3.setDate(t.getDate() - 14);

    return [
        {orderId:"ORD"+Date.now(), orderDate:fmt(d1), paymentMethod:"UPI", total:"₹69,999", status:"delivered", deliveryDate:fmt(t), address:{name:"Sample Customer",address:"123 Main St",city:"Bengaluru",state:"Karnataka",pincode:"560001",phone:"+91 9876543210"}, items:[{name:"Apple iPhone 15 (Blue, 128 GB)",image:"../images/products/Iphone15.png",price:69999,quantity:1,variant:"Blue, 128 GB"}]},
        {orderId:"ORD"+(Date.now()-1), orderDate:fmt(d2), paymentMethod:"Credit Card", total:"₹58,999", status:"shipped", deliveryDate:getDate(3), address:{name:"Sample Customer",address:"123 Main St",city:"Bengaluru",state:"Karnataka",pincode:"560001",phone:"+91 9876543210"}, items:[{name:"Dell Inspiron Laptop (16 GB RAM)",image:"../images/products/laptop.png",price:58999,quantity:1,variant:"Silver, 16 GB"}]},
        {orderId:"ORD"+(Date.now()-2), orderDate:fmt(d3), paymentMethod:"UPI", total:"₹54,999", status:"processing", deliveryDate:getDate(5), address:{name:"Sample Customer",address:"123 Main St",city:"Bengaluru",state:"Karnataka",pincode:"560001",phone:"+91 9876543210"}, items:[{name:"Samsung Galaxy S23 (Green, 256 GB)",image:"../images/products/samsung.png",price:54999,quantity:1,variant:"Green, 256 GB"}]}
    ];
}

/* RENDER */
function render() {
    const list = document.getElementById("orders-list");
    const empty = document.getElementById("empty-orders");

    if (filt.length === 0) {
        list.innerHTML = "";
        empty.style.display = "block";
        return;
    }
    empty.style.display = "none";
    list.innerHTML = "";

    filt.forEach(o => {
        const icons = {processing:"fa-gear", shipped:"fa-truck", delivered:"fa-circle-check", cancelled:"fa-circle-xmark"};
        const icon = icons[o.status] || "fa-gear";
        const label = o.status ? o.status[0].toUpperCase() + o.status.slice(1) : "Processing";

        const items = o.items.map(i => `
            <div class="order-item">
                <img src="${i.image}" alt="${i.name}" onerror="this.src='../images/products/samsung.png'">
                <div class="order-item-info">
                    <h4>${i.name}</h4>
                    ${i.variant ? `<p>${i.variant}</p>` : ""}
                    <p>Qty: ${i.quantity}</p>
                </div>
                <div class="order-item-price">
                    <div class="price">₹${(i.price * i.quantity).toLocaleString()}</div>
                </div>
            </div>
        `).join("");

        const delivery = o.status === "delivered"
            ? `<div class="delivery-info delivered"><i class="fa-solid fa-circle-check"></i> Delivered on ${o.deliveryDate}</div>`
            : o.status === "shipped"
            ? `<div class="delivery-info"><i class="fa-solid fa-truck"></i> Expected by ${o.deliveryDate}</div>`
            : o.status === "processing"
            ? `<div class="delivery-info"><i class="fa-solid fa-clock"></i> Expected by ${o.deliveryDate}</div>`
            : `<div class="delivery-info"><i class="fa-solid fa-circle-xmark"></i> Cancelled</div>`;

        const actions = o.status === "delivered"
            ? `<button class="order-btn btn-invoice" onclick="downloadInvoice('${o.orderId}')"><i class="fa-solid fa-file-invoice"></i> Invoice</button>`
            : o.status === "shipped"
            ? `<button class="order-btn btn-track" onclick="trackOrder('${o.orderId}')"><i class="fa-solid fa-location-dot"></i> Track</button>`
            : o.status === "processing"
            ? `<button class="order-btn btn-track" onclick="trackOrder('${o.orderId}')"><i class="fa-solid fa-location-dot"></i> Track</button><button class="order-btn btn-cancel" onclick="cancelOrder('${o.orderId}')"><i class="fa-solid fa-xmark"></i> Cancel</button>`
            : "";

        const card = document.createElement("div");
        card.className = "order-card";
        card.innerHTML = `
            <div class="order-header">
                <div class="order-header-left">
                    <div class="order-id">Order: <span>${o.orderId}</span></div>
                    <div class="order-date"><i class="fa-solid fa-calendar-days"></i> ${o.orderDate}</div>
                    <span class="status-badge ${o.status || 'processing'}">
                        <i class="fa-solid ${icon}"></i> ${label}
                    </span>
                </div>
                <div class="order-total">${o.total}</div>
            </div>
            <div class="order-body">
                <div class="order-items-list">${items}</div>
                <div class="order-meta">${delivery}</div>
            </div>
            <div class="order-footer">
                <button class="order-btn btn-view" onclick="viewOrder('${o.orderId}')"><i class="fa-solid fa-eye"></i> View Details</button>
                ${actions}
            </div>
        `;
        list.appendChild(card);
    });
}

/* FILTERS */
function applyFilters() {
    const s = document.querySelector('input[name="status"]:checked').value;
    const d = parseInt(document.querySelector('input[name="time"]:checked').value);

    filt = all.filter(o => {
        if (s !== "all" && o.status !== s) return false;
        const diff = Math.floor((new Date() - new Date(o.orderDate)) / 86400000);
        return diff <= d;
    });
    render();
    updateCount();
}

function clearFilters() {
    document.querySelector('input[name="status"][value="all"]').checked = true;
    document.querySelector('input[name="time"][value="3650"]').checked = true;
    document.getElementById("search-orders").value = "";
    filt = [...all];
    render();
    updateCount();
}

/* SEARCH */
function initSearch() {
    const input = document.getElementById("search-orders");
    if (!input) return;

    input.addEventListener("input", e => {
        const q = e.target.value.toLowerCase();
        filt = q === "" ? [...all] : all.filter(o =>
            o.orderId.toLowerCase().includes(q) ||
            o.items.some(i => i.name.toLowerCase().includes(q))
        );
        render();
        updateCount();
    });
}

/* HELPERS */
function updateCount() {
    const el = document.getElementById("orders-count");
    const n = filt.length;
    if (el) el.textContent = `${n} order${n !== 1 ? "s" : ""} found`;
}

function save() {
    try { localStorage.setItem("orderHistory", JSON.stringify(all)); } catch(e) {}
}

function getDate(days) {
    const d = new Date();
    d.setDate(d.getDate() + days);
    return `${d.getMonth()+1}/${d.getDate()}/${d.getFullYear()}`;
}

/* ACTIONS */
function viewOrder(id) {
    const o = all.find(x => x.orderId === id);
    if (o) {
        localStorage.setItem("lastOrder", JSON.stringify(o));
        window.location.href = "order-placed.html";
    }
}

function trackOrder(id) {
    alert(`Tracking info for ${id}\n\nYour order is on the way!`);
}

function downloadInvoice(id) {
    alert(`Downloading invoice for ${id}`);
}

function cancelOrder(id) {
    if (confirm(`Cancel order ${id}?`)) {
        const o = all.find(x => x.orderId === id);
        if (o) {
            o.status = "cancelled";
            save();
            applyFilters();
        }
    }
}

console.log("✅ Orders page loaded");
