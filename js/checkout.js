/* ============================================
   CHECKOUT.JS - Checkout Page Functionality
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Checkout page loaded');
    
    // Initialize checkout features
    initAddressForm();
    initCardForm();
    initPaymentMethods();
    initPromoCode();
    loadCartItems();
});

/* === ADDRESS FORM TOGGLE === */
function initAddressForm() {
    const showFormBtn = document.getElementById('show-address-form');
    const addressForm = document.getElementById('new-address-form');
    const cancelBtn = document.getElementById('cancel-address');
    
    if (showFormBtn && addressForm) {
        showFormBtn.addEventListener('click', function() {
            addressForm.style.display = 'block';
            this.style.display = 'none';
            addressForm.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
        });
    }
    
    if (cancelBtn && addressForm && showFormBtn) {
        cancelBtn.addEventListener('click', function() {
            addressForm.style.display = 'none';
            showFormBtn.style.display = 'block';
            addressForm.reset();
        });
    }
    
    // Handle form submission
    if (addressForm) {
        addressForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const formData = {
                fullname: document.getElementById('fullname')?.value,
                phone: document.getElementById('phone')?.value,
                address1: document.getElementById('address1')?.value,
                address2: document.getElementById('address2')?.value,
                city: document.getElementById('city')?.value,
                state: document.getElementById('state')?.value,
                zipcode: document.getElementById('zipcode')?.value
            };
            
            console.log('New address saved:', formData);
            showNotification('Address saved successfully!', 'success');
            
            // Hide form
            this.style.display = 'none';
            showFormBtn.style.display = 'block';
            this.reset();
            
            // In a real application:
            // 1. Validate the address
            // 2. Save to database
            // 3. Add new address card to the saved addresses list
        });
    }
}

/* === CARD FORM TOGGLE === */
function initCardForm() {
    const showCardFormBtn = document.getElementById('show-card-form');
    const cardForm = document.getElementById('new-card-form');
    
    if (showCardFormBtn && cardForm) {
        showCardFormBtn.addEventListener('click', function() {
            if (cardForm.style.display === 'none' || cardForm.style.display === '') {
                cardForm.style.display = 'block';
                this.textContent = '- Hide Form';
            } else {
                cardForm.style.display = 'none';
                this.textContent = '+ Add New Card';
            }
        });
    }
    
    // Handle card form submission
    if (cardForm) {
        cardForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            const cardData = {
                number: document.getElementById('card-number')?.value,
                name: document.getElementById('card-name')?.value,
                expiry: document.getElementById('expiry')?.value,
                cvv: document.getElementById('cvv')?.value
            };
            
            console.log('New card saved:', { ...cardData, cvv: '***' }); // Don't log CVV
            showNotification('Card saved successfully!', 'success');
            
            // Hide form
            this.style.display = 'none';
            showCardFormBtn.textContent = '+ Add New Card';
            this.reset();
            
            // In a real application:
            // 1. Validate card details
            // 2. Tokenize card (never store raw card data)
            // 3. Save token to database
            // 4. Add new card to saved cards list
        });
    }
    
    // Format card number input
    const cardNumberInput = document.getElementById('card-number');
    if (cardNumberInput) {
        cardNumberInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\s/g, '');
            let formattedValue = value.match(/.{1,4}/g)?.join(' ') || value;
            e.target.value = formattedValue;
        });
    }
    
    // Format expiry date
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function(e) {
            let value = e.target.value.replace(/\D/g, '');
            if (value.length >= 2) {
                value = value.substring(0, 2) + '/' + value.substring(2, 4);
            }
            e.target.value = value;
        });
    }
}

/* === PAYMENT METHOD SELECTION === */
function initPaymentMethods() {
    const paymentRadios = document.querySelectorAll('input[name="payment"]');
    
    paymentRadios.forEach(radio => {
        radio.addEventListener('change', function() {
            // Hide all payment details
            const cardDetails = document.getElementById('card-details');
            const upiDetails = document.getElementById('upi-details');
            const netbankingDetails = document.getElementById('netbanking-details');
            
            if (cardDetails) cardDetails.style.display = 'none';
            if (upiDetails) upiDetails.style.display = 'none';
            if (netbankingDetails) netbankingDetails.style.display = 'none';
            
            // Show selected payment method details
            if (this.id === 'card-payment' && cardDetails) {
                cardDetails.style.display = 'block';
            } else if (this.id === 'upi-payment' && upiDetails) {
                upiDetails.style.display = 'block';
            } else if (this.id === 'netbanking' && netbankingDetails) {
                netbankingDetails.style.display = 'block';
            }
            
            console.log('Payment method selected:', this.id);
        });
    });
    
    // Initialize - show card details by default
    const cardDetails = document.getElementById('card-details');
    if (cardDetails) {
        cardDetails.style.display = 'block';
    }
}

/* === PROMO CODE === */
function initPromoCode() {
    const promoInput = document.getElementById('promo-input');
    const applyBtn = document.querySelector('.btn-apply');
    
    if (applyBtn && promoInput) {
        applyBtn.addEventListener('click', function() {
            const promoCode = promoInput.value.trim().toUpperCase();
            
            if (!promoCode) {
                showNotification('Please enter a promo code', 'error');
                return;
            }
            
            applyPromoCode(promoCode);
        });
        
        // Apply on Enter
        promoInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                const promoCode = this.value.trim().toUpperCase();
                if (promoCode) {
                    applyPromoCode(promoCode);
                }
            }
        });
    }
}

function applyPromoCode(code) {
    // Sample promo codes
    const promoCodes = {
        'SAVE10': { discount: 10, type: 'percentage' },
        'SAVE50': { discount: 50, type: 'fixed' },
        'WELCOME': { discount: 15, type: 'percentage' },
        'FIRST20': { discount: 20, type: 'percentage' }
    };
    
    if (promoCodes[code]) {
        const promo = promoCodes[code];
        console.log('Promo code applied:', code, promo);
        
        if (promo.type === 'percentage') {
            showNotification(`Promo code applied! ${promo.discount}% off`, 'success');
        } else {
            showNotification(`Promo code applied! $${promo.discount} off`, 'success');
        }
        
        // In a real application:
        // 1. Validate promo code with backend
        // 2. Calculate new total
        // 3. Update price breakdown
        // 4. Disable promo input
    } else {
        showNotification('Invalid promo code', 'error');
    }
}

/* === LOAD CART ITEMS === */
function loadCartItems() {
    // Load cart from localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    
    console.log('Cart items:', cart);
    
    // In a real application:
    // 1. Display all cart items in the order summary
    // 2. Calculate subtotal, tax, shipping
    // 3. Update total price
    
    if (cart.length === 0) {
        console.log('Cart is empty');
        // You might want to redirect to products page or show empty cart message
    }
}

/* === CONTINUE TO PAYMENT === */
const continueBtn = document.querySelector('.btn-continue');
if (continueBtn) {
    continueBtn.addEventListener('click', function(e) {
        // Validate address selection
        const selectedAddress = document.querySelector('input[name="address"]:checked');
        const selectedPayment = document.querySelector('input[name="payment"]:checked');
        
        if (!selectedAddress) {
            e.preventDefault();
            showNotification('Please select a delivery address', 'error');
            return;
        }
        
        if (!selectedPayment) {
            e.preventDefault();
            showNotification('Please select a payment method', 'error');
            return;
        }
        
        console.log('Proceeding to payment...');
        showNotification('Proceeding to payment...', 'success');
        
        // Save selections to localStorage for payment page
        localStorage.setItem('selectedAddress', selectedAddress.id);
        localStorage.setItem('selectedPayment', selectedPayment.id);
        
        // Link will navigate to payment.html
    });
}
