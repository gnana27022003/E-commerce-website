/* ============================================
   CHECKOUT PAGE JAVASCRIPT
============================================ */

document.addEventListener('DOMContentLoaded', function () {
    initCheckout();

    loadCartFromLocalStorage();   // ✅ FIRST
    console.log("AFTER LOAD:", cartItems);

    loadSampleData();             // uses cartItems
    initFeesToggle();

    // 🔥 FORCE render after everything
    setTimeout(() => {
        renderOrderItems();
        updatePriceDetails();
    }, 0);
});


// Cart items array (will be loaded from localStorage)
let cartItems = [];

// Sample saved addresses (empty initially - user will add new address)
let savedAddresses = [];

let selectedAddressId = null;
let currentStep = 2; // Start at address step (login already completed)

// ========== LOCALSTORAGE FUNCTIONS ==========
function loadCartFromLocalStorage() {
    const savedCart = localStorage.getItem('cart'); // ✅ CORRECT KEY

    if (!savedCart) {
        console.error("❌ No cart found in localStorage");
        cartItems = [];
        return;
    }

    try {
        cartItems = JSON.parse(savedCart);

        if (!Array.isArray(cartItems)) {
            console.error("❌ Cart is not an array", cartItems);
            cartItems = [];
            return;
        }

        console.log("✅ CART LOADED:", cartItems);
    } catch (err) {
        console.error("❌ Cart JSON parse failed", err);
        cartItems = [];
    }
}


function saveCartToLocalStorage() {
    try {
        localStorage.setItem('cart', JSON.stringify(cartItems));
        console.log('Cart saved to localStorage');
    } catch (e) {
        console.error('Error saving cart to localStorage:', e);
    }
}

function loadAddressesFromLocalStorage() {
    const savedAddresses = localStorage.getItem('savedAddresses');
    if (savedAddresses) {
        try {
            return JSON.parse(savedAddresses);
        } catch (e) {
            console.error('Error parsing addresses from localStorage:', e);
            return [];
        }
    }
    return [];
}

function saveAddressesToLocalStorage() {
    try {
        localStorage.setItem('savedAddresses', JSON.stringify(savedAddresses));
        console.log('Addresses saved to localStorage');
    } catch (e) {
        console.error('Error saving addresses to localStorage:', e);
    }
}

function initCheckout() {
    // Add address button
    document.getElementById('add-address-btn').addEventListener('click', showAddressForm);
    document.getElementById('cancel-address-btn').addEventListener('click', hideAddressForm);
    
    // Address form submission
    document.getElementById('address-form').addEventListener('submit', handleAddressSave);
    
    // Continue button
    document.getElementById('continue-btn').addEventListener('click', proceedToPayment);
    
    // Change login button
    document.getElementById('change-login-btn').addEventListener('click', handleChangeLogin);
    
    // Change address button
    const addressChangeBtn = document.getElementById('address-change-btn');
    if (addressChangeBtn) {
        addressChangeBtn.addEventListener('click', handleChangeAddress);
    }
}

function loadSampleData() {
    console.log('Loading sample data...');
    console.log('Cart items:', cartItems.length);
    
    // Load saved addresses from localStorage
    const loadedAddresses = loadAddressesFromLocalStorage();
    if (loadedAddresses.length > 0) {
        savedAddresses = loadedAddresses;
    }
    
    renderSavedAddresses();
    renderOrderItems();
    updatePriceDetails();
    console.log('Sample data loaded successfully');
}

// ========== ADDRESS MANAGEMENT ==========
function renderSavedAddresses() {
    const container = document.getElementById('saved-addresses');
    container.innerHTML = '';
    
    if (savedAddresses.length === 0) {
        // No saved addresses, show add address form button only
        return;
    }
    
    savedAddresses.forEach((addr, index) => {
        const addressCard = document.createElement('div');
        addressCard.className = 'address-card';
        if (index === 0) {
            addressCard.classList.add('selected');
            selectedAddressId = addr.id;
        }
        
        addressCard.innerHTML = `
            <div class="address-radio">
                <input type="radio" name="address" id="addr-${addr.id}" 
                       ${index === 0 ? 'checked' : ''} 
                       data-address-id="${addr.id}">
                <div class="address-details">
                    <span class="address-type-badge">${addr.type.toUpperCase()}</span>
                    <div class="address-name">${addr.name} ${addr.phone}</div>
                    <div class="address-text">
                        ${addr.address}<br>
                        ${addr.city}, ${addr.state} - ${addr.pincode}
                    </div>
                    ${index === 0 || selectedAddressId === addr.id ? '<button class="deliver-here-btn">DELIVER HERE</button>' : ''}
                </div>
            </div>
            <button class="edit-address-btn">EDIT</button>
        `;
        
        container.appendChild(addressCard);
        
        // Add radio change listener
        const radio = addressCard.querySelector('input[type="radio"]');
        radio.addEventListener('change', () => handleAddressSelect(addr.id));
        
        // Add deliver here button listener
        const deliverBtn = addressCard.querySelector('.deliver-here-btn');
        if (deliverBtn) {
            deliverBtn.addEventListener('click', () => confirmAddress(addr.id));
        }
    });
}

function handleAddressSelect(addressId) {
    selectedAddressId = addressId;
    
    // Update UI
    document.querySelectorAll('.address-card').forEach(card => {
        card.classList.remove('selected');
        const existingBtn = card.querySelector('.deliver-here-btn');
        if (existingBtn) existingBtn.remove();
    });
    
    // Add deliver button to selected address
    const selectedCard = document.querySelector(`input[data-address-id="${addressId}"]`).closest('.address-card');
    selectedCard.classList.add('selected');
    
    const deliverBtn = document.createElement('button');
    deliverBtn.className = 'deliver-here-btn';
    deliverBtn.textContent = 'DELIVER HERE';
    deliverBtn.addEventListener('click', () => confirmAddress(addressId));
    
    selectedCard.querySelector('.address-details').appendChild(deliverBtn);
}

function confirmAddress(addressId) {
    // Move to order summary step
    const addressHeader = document.getElementById('address-header');
    const addressContent = document.getElementById('address-content');
    const addressTick = document.getElementById('address-tick');
    const addressChangeBtn = document.getElementById('address-change-btn');
    
    addressHeader.classList.remove('active');
    addressHeader.classList.add('completed');
    addressContent.classList.remove('active');
    addressContent.style.display = 'none';
    
    // Show tick mark and change button
    if (addressTick) addressTick.style.display = 'inline';
    if (addressChangeBtn) addressChangeBtn.style.display = 'inline-block';
    
    document.getElementById('order-header').classList.add('active');
    document.getElementById('order-content').classList.add('active');
    document.getElementById('order-content').style.display = 'block';
    
    currentStep = 3;
    
    // Re-render order items to ensure they're visible
    renderOrderItems();
    updatePriceDetails();
    
    // Update step indicator
    updateStepIndicator();
    
    console.log('Address confirmed, order summary displayed');
}

function showAddressForm() {
    document.getElementById('address-form-wrapper').style.display = 'block';
    document.getElementById('add-address-btn').style.display = 'none';
}

function hideAddressForm() {
    document.getElementById('address-form-wrapper').style.display = 'none';
    document.getElementById('add-address-btn').style.display = 'block';
    document.getElementById('address-form').reset();
}

function handleAddressSave(e) {
    e.preventDefault();
    
    const addressField = document.getElementById('address').value;
    const locality = document.getElementById('locality').value;
    const city = document.getElementById('city').value;
    const state = document.getElementById('state').value;
    const pincode = document.getElementById('pincode').value;
    const landmark = document.getElementById('landmark').value;
    
    // Build full address string
    let fullAddress = addressField;
    if (locality) fullAddress += ', ' + locality;
    if (landmark) fullAddress += ', ' + landmark;
    
    const newAddress = {
        id: savedAddresses.length + 1,
        name: document.getElementById('name').value,
        phone: document.getElementById('phone').value,
        address: fullAddress,
        locality: locality,
        city: city,
        state: state,
        pincode: pincode,
        landmark: landmark,
        altPhone: document.getElementById('alt-phone').value,
        type: document.querySelector('input[name="address-type"]:checked').value
    };
    
    savedAddresses.push(newAddress);
    saveAddressesToLocalStorage(); // Save to localStorage
    
    // Re-render addresses
    renderSavedAddresses();
    
    // Hide form
    hideAddressForm();
    
    // Auto-select the new address
    selectedAddressId = newAddress.id;
    handleAddressSelect(newAddress.id);
}

// ========== ORDER SUMMARY ==========
function renderOrderItems() {
    const container = document.getElementById('order-items');
    if (!container) {
        console.error('Order items container not found');
        return;
    }
    
    container.innerHTML = '';
    
    if (cartItems.length === 0) {
        container.innerHTML = '<p style="text-align: center; padding: 40px; color: #878787; font-size: 16px;">Your cart is empty</p>';
        return;
    }
    
    cartItems.forEach(item => {

    // 🔒 NORMALIZE CART ITEM (VERY IMPORTANT)
    item.quantity ??= 1;
    item.originalPrice ??= item.price;
    item.discount ??= '';
    item.seller ??= 'Retail Seller';
    item.coins ??= 0;
    item.delivery ??= 'Tomorrow';
    item.variant ??= item.color || '';
    item.protectFee ??= 0;

    const itemDiv = document.createElement('div');
    itemDiv.className = 'order-item';

    itemDiv.innerHTML = `
        <img src="${item.image}" alt="${item.name}" class="item-image">

        <div class="item-details">
            <div class="item-name">${item.name}</div>

            ${item.variant ? `<div class="item-variant">${item.variant}</div>` : ''}

            <div class="item-seller">
                Seller: ${item.seller}
                <span class="seller-badge">
                    <i class="fa-solid fa-shield-halved"></i> Assured
                </span>
            </div>

            <div class="item-price">
                <span class="current-price">₹${item.price.toLocaleString()}</span>
                <span class="original-price">₹${item.originalPrice.toLocaleString()}</span>
                ${item.discount ? `<span class="discount">${item.discount}</span>` : ''}
                ${item.coins ? `
                    <span class="coins-badge">
                        <i class="fa-solid fa-coins"></i> ${item.coins}
                    </span>
                ` : ''}
            </div>

            ${item.protectFee ? `
                <div class="item-protect-fee">
                    + ₹${item.protectFee} Protect Promise Fee
                    <i class="fa-solid fa-circle-info"></i>
                </div>
            ` : ''}

            <div class="item-emi">
                Or Pay ₹${Math.ceil(item.price / 6).toLocaleString()}
            </div>

            <div class="delivery-options">
                <div class="delivery-option">
                    <input type="radio" checked>
                    <label>Delivery by ${item.delivery}</label>
                </div>
            </div>

            <div class="delivery-highlight">
                <i class="fa-solid fa-box-open"></i>
                <div class="delivery-highlight-text">
                    <strong>Open Box Delivery</strong> is eligible for this item.
                    <a href="#">Know More</a>
                </div>
            </div>

            <div class="item-quantity">
                <div class="quantity-controls">
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">−</button>
                    <span class="qty-value" id="qty-${item.id}">${item.quantity}</span>
                    <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                </div>
                <button class="remove-btn" onclick="removeItem('${item.id}')">REMOVE</button>
            </div>
        </div>
    `;

    container.appendChild(itemDiv);
});

    
    console.log(`Rendered ${cartItems.length} items in order summary`);
}

function updateQuantity(itemId, change) {
    const qtyElement = document.getElementById(`qty-${itemId}`);
    let currentQty = parseInt(qtyElement.textContent);
    let newQty = currentQty + change;
    
    if (newQty >= 1 && newQty <= 10) {
        qtyElement.textContent = newQty;
        
        // Update quantity in cartItems array
        const item = cartItems.find(item => item.id === itemId);
        if (item) {
            item.quantity = newQty;
            saveCartToLocalStorage(); // Save to localStorage
        }
        
        updatePriceDetails();
    }
}

function removeItem(itemId) {
    if (confirm('Are you sure you want to remove this item?')) {
        const index = cartItems.findIndex(item => item.id === itemId);
        if (index > -1) {
            cartItems.splice(index, 1);
            saveCartToLocalStorage(); // Save to localStorage
            renderOrderItems();
            updatePriceDetails();
            
            // If cart is empty, show message
            if (cartItems.length === 0) {
                alert('Your cart is empty. Redirecting to homepage...');
                // Optionally redirect to homepage or products page
                // window.location.href = 'homepage.html';
            }
        }
    }
}

// Make functions globally available
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;

// ========== PRICE DETAILS ==========
function updatePriceDetails() {
    let totalPrice = 0;
    let totalOriginalPrice = 0;
    let totalProtectFee = 0;
    let totalItems = 0;
    
    cartItems.forEach(item => {
        const qty = item.quantity || 1;
        totalPrice += item.price * qty;
        totalOriginalPrice += item.originalPrice * qty;
        totalItems += qty;
        if (item.protectFee) {
            totalProtectFee += item.protectFee;
        }
    });
    
    const totalSavings = totalOriginalPrice - totalPrice;
    const totalPayable = totalPrice + totalProtectFee;
    
    // Update price details
    const itemCountEl = document.getElementById('item-count');
    const priceTotalEl = document.getElementById('price-total');
    const promiseFeeEl = document.getElementById('promise-fee');
    const totalPayableEl = document.getElementById('total-payable');
    const totalSavingsEl = document.getElementById('total-savings');
    
    if (itemCountEl) itemCountEl.textContent = totalItems;
    if (priceTotalEl) priceTotalEl.textContent = `₹${totalOriginalPrice.toLocaleString()}`;
    if (promiseFeeEl) promiseFeeEl.textContent = `₹${totalProtectFee}`;
    if (totalPayableEl) totalPayableEl.textContent = `₹${totalPayable.toLocaleString()}`;
    if (totalSavingsEl) totalSavingsEl.textContent = `₹${totalSavings.toLocaleString()}`;
}

function initFeesToggle() {
    const toggle = document.getElementById('fees-toggle');
    const breakdown = document.getElementById('fees-breakdown');
    
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('collapsed');
        breakdown.classList.toggle('hidden');
    });
}

// ========== NAVIGATION ==========
function updateStepIndicator() {
    const headerSteps = document.querySelectorAll('.checkout-steps-indicator .step-item');
    headerSteps.forEach((step, index) => {
        if (index < currentStep - 1) {
            step.classList.add('active');
        } else if (index === currentStep - 1) {
            step.classList.add('active');
        } else {
            step.classList.remove('active');
        }
    });
}

function handleChangeLogin() {
    // In real app, this would trigger login modal
    alert('Login change functionality - redirect to login page');
}

function handleChangeAddress() {
    // Re-open the address step
    const addressHeader = document.getElementById('address-header');
    const addressContent = document.getElementById('address-content');
    const addressTick = document.getElementById('address-tick');
    const addressChangeBtn = document.getElementById('address-change-btn');
    const orderHeader = document.getElementById('order-header');
    const orderContent = document.getElementById('order-content');
    
    // Reset address step to active
    addressHeader.classList.add('active');
    addressHeader.classList.remove('completed');
    addressContent.classList.add('active');
    addressContent.style.display = 'block';
    
    // Hide tick and change button
    if (addressTick) addressTick.style.display = 'none';
    if (addressChangeBtn) addressChangeBtn.style.display = 'none';
    
    // Hide order summary step
    orderHeader.classList.remove('active');
    orderContent.classList.remove('active');
    orderContent.style.display = 'none';
    
    currentStep = 2;
    updateStepIndicator();
    
    console.log('Address change requested');
}

function proceedToPayment() {
    const emailInput = document.getElementById('order-email');
    const email = emailInput ? emailInput.value.trim() : '';

    if (!email || !email.includes('@')) {
        alert('Please enter a valid email address');
        emailInput.focus();
        return;
    }

    // ✅ Save checkout info (optional but useful)
    localStorage.setItem('checkoutEmail', email);
    localStorage.setItem('checkoutStep', 'payment');

    console.log('Redirecting to payment page...');
    
    // ✅ REDIRECT TO PAYMENT PAGE
    window.location.href = 'payment.html';
}
document.getElementById('continue-btn')
    .addEventListener('click', proceedToPayment);


console.log('Checkout page loaded successfully ✅');