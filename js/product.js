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

    if (addToCartBtn) {
        addToCartBtn.addEventListener('click', async function(e) {
            e.preventDefault();

            const productId = addToCartBtn.dataset.id; // productId from button
            const quantity = parseInt(document.getElementById('quantity')?.value) || 1;

            try {
                const response = await fetch('/cart', {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    body: JSON.stringify({ productId, quantity })
                });

                const result = await response.json();

                if (result.success) {
                    alert('Product added to cart!');
                } else {
                    alert('Failed to add to cart: ' + (result.message || 'Try again'));
                }
            } catch (err) {
                console.error(err);
                alert('Error adding to cart');
            }
        });
    }
}


/* === WRITE REVIEW === */
const writeReviewBtn = document.querySelector('.btn-write-review');
if (writeReviewBtn) {
    writeReviewBtn.addEventListener('click', function() {
        
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
