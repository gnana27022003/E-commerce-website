/* ============================================
   PRODUCT.JS - Product Detail Page Only
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Product detail page loaded');
    
    // Initialize product page features
    initImageGallery();
    initQuantityControls();
    initOptionButtons();
    initAddToCart();
    initImageZoom();
});

/* === IMAGE GALLERY === */
function initImageGallery() {
    const mainImage = document.getElementById('main-image');
    const thumbnails = document.querySelectorAll('.thumbnail');
    
    if (thumbnails.length > 0 && mainImage) {
        thumbnails.forEach((thumbnail, index) => {
            thumbnail.addEventListener('click', function() {
                // Remove active class from all thumbnails
                thumbnails.forEach(thumb => thumb.classList.remove('active'));
                
                // Add active class to clicked thumbnail
                this.classList.add('active');
                
                // Update main image
                mainImage.src = this.src;
                
                // Add fade effect
                mainImage.style.opacity = '0';
                setTimeout(() => {
                    mainImage.style.opacity = '1';
                }, 100);
            });
        });
        
        // Set first thumbnail as active
        if (thumbnails[0]) {
            thumbnails[0].classList.add('active');
        }
    }
}

/* === QUANTITY CONTROLS === */
function initQuantityControls() {
    const decreaseBtn = document.getElementById('decrease');
    const increaseBtn = document.getElementById('increase');
    const quantityInput = document.getElementById('quantity');
    
    if (decreaseBtn && increaseBtn && quantityInput) {
        // Decrease quantity
        decreaseBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value) || 1;
            if (currentValue > 1) {
                quantityInput.value = currentValue - 1;
                updatePriceDisplay();
            }
        });
        
        // Increase quantity
        increaseBtn.addEventListener('click', function() {
            let currentValue = parseInt(quantityInput.value) || 1;
            if (currentValue < 10) { // Maximum 10 items
                quantityInput.value = currentValue + 1;
                updatePriceDisplay();
            } else {
                alert('Maximum 10 items allowed per order');
            }
        });
        
        // Prevent manual input
        quantityInput.addEventListener('input', function() {
            let value = parseInt(this.value);
            if (isNaN(value) || value < 1) {
                this.value = 1;
            } else if (value > 10) {
                this.value = 10;
                alert('Maximum 10 items allowed per order');
            }
            updatePriceDisplay();
        });
    }
}

function updatePriceDisplay() {
    // In a real application, update total price based on quantity
    console.log('Price updated for quantity:', document.getElementById('quantity')?.value);
}

/* === OPTION BUTTONS (Color, Size, etc.) === */
function initOptionButtons() {
    const optionGroups = document.querySelectorAll('.option-group');
    
    optionGroups.forEach(group => {
        const buttons = group.querySelectorAll('.option-btn');
        
        buttons.forEach(button => {
            button.addEventListener('click', function() {
                // Remove active class from all buttons in this group
                buttons.forEach(btn => btn.classList.remove('active'));
                
                // Add active class to clicked button
                this.classList.add('active');
                
                // Get the option type and value
                const optionType = group.querySelector('label')?.textContent || 'option';
                const optionValue = this.textContent;
                
                console.log(`Selected ${optionType}: ${optionValue}`);
            });
        });
    });
}

/* === ADD TO CART FUNCTIONALITY === */
function initAddToCart() {
    const addToCartBtn = document.querySelector('.btn-cart');
    const buyNowBtn = document.querySelector('.btn-buy');
    
    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Get selected options
            const selectedColor = document.querySelector('.option-group:nth-child(1) .option-btn.active')?.textContent || 'Not selected';
            const selectedStorage = document.querySelector('.option-group:nth-child(2) .option-btn.active')?.textContent || 'Not selected';
            const quantity = document.getElementById('quantity')?.value || 1;
            
            console.log('Adding to cart:', {
                color: selectedColor,
                storage: selectedStorage,
                quantity: quantity
            });
            
            alert('Product added to cart!');
            
            // Navigate to checkout after showing alert
            setTimeout(() => {
                window.location.href = 'checkout.html';
            }, 500);
        });
    }
    
    if (buyNowBtn) {
        buyNowBtn.addEventListener('click', function(e) {
            e.preventDefault();
            
            const selectedColor = document.querySelector('.option-group:nth-child(1) .option-btn.active')?.textContent || 'Not selected';
            const selectedStorage = document.querySelector('.option-group:nth-child(2) .option-btn.active')?.textContent || 'Not selected';
            const quantity = document.getElementById('quantity')?.value || 1;
            
            console.log('Buy now:', {
                color: selectedColor,
                storage: selectedStorage,
                quantity: quantity
            });
            
            alert('Proceeding to checkout...');
            
            setTimeout(() => {
                window.location.href = 'checkout.html';
            }, 500);
        });
    }
}

/* === WRITE REVIEW === */
const writeReviewBtn = document.querySelector('.btn-write-review');
if (writeReviewBtn) {
    writeReviewBtn.addEventListener('click', function() {
        const reviewText = prompt('Write your review:');
        if (reviewText) {
            alert('Thank you for your review!');
        }
    });
}

/* === IMAGE ZOOM === */
function initImageZoom() {
    const mainImage = document.getElementById('main-image');
    
    if (mainImage) {
        mainImage.addEventListener('click', function() {
            // Create zoom overlay
            const overlay = document.createElement('div');
            overlay.style.cssText = `
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background-color: rgba(0, 0, 0, 0.9);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 99999;
                cursor: zoom-out;
            `;
            
            const zoomedImg = document.createElement('img');
            zoomedImg.src = this.src;
            zoomedImg.style.cssText = 'max-width: 90%; max-height: 90%; object-fit: contain;';
            
            overlay.appendChild(zoomedImg);
            document.body.appendChild(overlay);
            
            // Close on click
            overlay.addEventListener('click', function() {
                this.remove();
            });
        });
        
        mainImage.style.cursor = 'zoom-in';
    }
}