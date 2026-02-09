/* ============================================
   CART PAGE JAVASCRIPT (LOCALSTORAGE BASED)
   ============================================ */

// Initialize cart with default items if empty
let cart = [
    {
        id: "iphone15",
        name: "Apple iPhone 15 (Blue, 128 GB)",
        image: "../images/products/iphone.png",
        price: 69999,
        originalPrice: 79999,
        quantity: 1,
        color: "Blue, 128 GB",
        seller: "Apple Store",
        delivery: "Tomorrow"
    },
    {
        id: "delllaptop",
        name: "Dell Inspiron Laptop (16 GB RAM)",
        image: "../images/products/laptop.png",
        price: 58999,
        originalPrice: 64999,
        quantity: 1,
        color: "Silver, 16 GB RAM",
        seller: "Dell Official",
        delivery: "Tomorrow"
    },
    {
        id: "samsung",
        name: "Samsung Galaxy S23 (Green, 256 GB)",
        image: "../images/products/samsung.png",
        price: 54999,
        originalPrice: 59999,
        quantity: 1,
        color: "Green, 256 GB",
        seller: "Samsung Store",
        delivery: "Tomorrow"
    }
];

// Save to localStorage
localStorage.setItem("cart", JSON.stringify(cart));

let cartItems = JSON.parse(localStorage.getItem("cart")) || [];

document.addEventListener("DOMContentLoaded", () => {
    if (cartItems.length === 0) {
        showEmptyCart();
        updatePriceDetails();
        return;
    }

    renderCartItems();
    updatePriceDetails();
    initializeEventListeners();
});

/* ================= RENDER CART ================= */

function renderCartItems() {
    const container = document.getElementById("cartItemsList");
    if (!container) return;

    container.innerHTML = "";

    cartItems.forEach((item, index) => {
        const card = document.createElement("div");
        card.className = "cart-item-card";

        const originalPrice = item.originalPrice || Math.round(item.price * 1.25);
        const discount = Math.round(
            ((originalPrice - item.price) / originalPrice) * 100
        );

        card.innerHTML = `
            <div class="cart-item">
                <div class="item-image">
                    <img src="${item.image}" alt="${item.name}">
                </div>

                <div class="item-info">
                    <h4>${item.name}</h4>
                    <p class="item-color">${item.color || "Default"}</p>
                    <p class="item-seller">
                        Seller: ${item.seller || "E-Commerce Retail"} 
                        <span class="assured-badge">✓ Assured</span>
                    </p>

                    <div class="item-pricing">
                        <span class="item-price">₹${item.price.toLocaleString()}</span>
                        <span class="item-original-price">₹${originalPrice.toLocaleString()}</span>
                        <span class="item-discount">${discount}% Off</span>
                    </div>

                    <p class="delivery-date">
                        Delivery by <strong>${item.delivery || "Within 3–5 days"}</strong>
                    </p>
                </div>
            </div>

            <div class="item-actions">
                <div class="quantity-selector">
                    <button class="qty-btn" onclick="decreaseQty(${index})">−</button>
                    <input class="qty-value" value="${item.quantity}" readonly />
                    <button class="qty-btn" onclick="increaseQty(${index})">+</button>
                </div>

                <button class="btn-save">SAVE FOR LATER</button>
                <button class="btn-remove" onclick="removeItem(${index})">REMOVE</button>
            </div>
        `;

        container.appendChild(card);
    });
}

/* ================= PRICE DETAILS ================= */

function updatePriceDetails() {
    let totalItems = 0;
    let totalPrice = 0;
    let totalOriginalPrice = 0;

    cartItems.forEach(item => {
        totalItems += item.quantity;
        totalPrice += item.price * item.quantity;
        totalOriginalPrice += (item.originalPrice || item.price) * item.quantity;
    });

    const platformFee = cartItems.length > 0 ? 7 : 0;
    const discount = totalOriginalPrice - totalPrice;

    document.getElementById("itemCount").textContent = totalItems;
    document.getElementById("itemPlural").style.display =
        totalItems === 1 ? "none" : "inline";

    document.getElementById("totalPrice").textContent =
        `₹${totalOriginalPrice.toLocaleString()}`;

    document.getElementById("totalDiscount").textContent =
        `−₹${discount.toLocaleString()}`;

    document.getElementById("platformFee").textContent =
        `₹${platformFee}`;

    document.getElementById("totalAmount").textContent =
        `₹${(totalPrice + platformFee).toLocaleString()}`;

    document.getElementById("savingsMessage").textContent =
        discount > 0 ? `You will save ₹${discount.toLocaleString()} on this order` : "Enjoy your shopping!";
}

/* ================= QUANTITY ================= */

function increaseQty(index) {
    cartItems[index].quantity++;
    syncCart();
}

function decreaseQty(index) {
    if (cartItems[index].quantity > 1) {
        cartItems[index].quantity--;
        syncCart();
    }
}

/* ================= REMOVE ================= */

function removeItem(index) {
    cartItems.splice(index, 1);
    syncCart();

    if (cartItems.length === 0) {
        showEmptyCart();
    }
}

/* ================= HELPERS ================= */

function syncCart() {
    localStorage.setItem("cart", JSON.stringify(cartItems));
    renderCartItems();
    updatePriceDetails();
}

function showEmptyCart() {
    document.getElementById("cartItemsList").innerHTML = `
        <div style="
            background:#fff;
            padding:40px;
            border-radius:6px;
            text-align:center;
            color:#878787;
        ">
            <h3>Your cart is empty</h3>
            <button 
                onclick="window.location.href='home.html'"
                style="
                    margin-top:16px;
                    padding:12px 24px;
                    background:#2874f0;
                    color:#fff;
                    border:none;
                    border-radius:4px;
                    cursor:pointer;
                    font-weight:600;
                ">
                Continue Shopping
            </button>
        </div>
    `;
}

function initializeEventListeners() {
    const pincodeBtn = document.querySelector(".btn-link");
    if (pincodeBtn) {
        pincodeBtn.onclick = () => {
            const pin = prompt("Enter delivery pincode");
            if (pin && pin.length === 6) {
                alert(`Delivery available for ${pin}`);
            }
        };
    }
}