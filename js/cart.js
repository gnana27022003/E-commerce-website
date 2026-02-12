/* ============================================
   CART PAGE JAVASCRIPT (LOCALSTORAGE BASED)
   ============================================ */


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





async function loadCart() {

    const res = await fetch("/cart-data");
    const data = await res.json();

    const container = document.getElementById("cartItemsList");
    container.innerHTML = "";

    let totalPrice = 0;

    data.items.forEach(item => {

        totalPrice += item.price * item.quantity;

        container.innerHTML += `
        <div class="cart-item">
            <img src="/uploads/products/${item.image}" width="80">
            <div>
                <h4>${item.name}</h4>
                <p>₹${item.price}</p>
                <p>Qty: ${item.quantity}</p>
            </div>
        </div>
        `;
    });

    document.getElementById("itemCount").innerText = data.items.length;
    document.getElementById("totalPrice").innerText = "₹" + totalPrice;
    document.getElementById("totalAmount").innerText = "₹" + (totalPrice + 7);
}

loadCart();
