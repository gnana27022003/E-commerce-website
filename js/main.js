/* ============================================
   MAIN.JS - Common JavaScript for All Pages
   ============================================ */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('E-commerce website loaded successfully!');
    
    // Initialize common functions
    initMobileMenu();
    initScrollToTop();
    smoothScroll();
});

/* === MOBILE MENU TOGGLE === */
function initMobileMenu() {
    // Create mobile menu button if it doesn't exist
    const nav = document.querySelector('nav');
    const navLinks = document.querySelector('.nav-links');
    
    if (nav && navLinks && window.innerWidth <= 768) {
        // Add mobile menu button
        const menuBtn = document.createElement('button');
        menuBtn.innerHTML = '☰';
        menuBtn.className = 'mobile-menu-btn';
        menuBtn.style.cssText = 'background: none; border: none; color: white; font-size: 24px; cursor: pointer; display: block;';
        
        const navContainer = document.querySelector('.nav-container');
        if (navContainer) {
            navContainer.appendChild(menuBtn);
            
            menuBtn.addEventListener('click', function() {
                navLinks.classList.toggle('mobile-active');
                if (navLinks.style.display === 'flex') {
                    navLinks.style.display = 'none';
                } else {
                    navLinks.style.display = 'flex';
                    navLinks.style.flexDirection = 'column';
                    navLinks.style.position = 'absolute';
                    navLinks.style.top = '60px';
                    navLinks.style.left = '0';
                    navLinks.style.width = '100%';
                    navLinks.style.backgroundColor = '#2874f0';
                    navLinks.style.padding = '20px';
                }
            });
        }
    }
}

/* === SCROLL TO TOP === */
function initScrollToTop() {
    // Create scroll to top button
    const scrollBtn = document.createElement('button');
    scrollBtn.innerHTML = '↑';
    scrollBtn.className = 'scroll-to-top';
    scrollBtn.style.cssText = `
        position: fixed;
        bottom: 30px;
        right: 30px;
        width: 50px;
        height: 50px;
        background-color: #2874f0;
        color: white;
        border: none;
        border-radius: 50%;
        font-size: 24px;
        cursor: pointer;
        display: none;
        z-index: 1000;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        transition: all 0.3s;
    `;
    
    document.body.appendChild(scrollBtn);
    
    // Show/hide button based on scroll position
    window.addEventListener('scroll', function() {
        if (window.pageYOffset > 300) {
            scrollBtn.style.display = 'block';
        } else {
            scrollBtn.style.display = 'none';
        }
    });
    
    // Scroll to top when clicked
    scrollBtn.addEventListener('click', function() {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

/* === SMOOTH SCROLL FOR ANCHOR LINKS === */
function smoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            const href = this.getAttribute('href');
            if (href !== '#' && href.length > 1) {
                e.preventDefault();
                const target = document.querySelector(href);
                if (target) {
                    target.scrollIntoView({
                        behavior: 'smooth',
                        block: 'start'
                    });
                }
            }
        });
    });
}

/* === ADD TO CART NOTIFICATION === */
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = `notification notification-${type}`;
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        top: 80px;
        right: 20px;
        background-color: ${type === 'success' ? '#388e3c' : '#e53935'};
        color: white;
        padding: 15px 25px;
        border-radius: 4px;
        box-shadow: 0 2px 10px rgba(0,0,0,0.2);
        z-index: 10000;
        animation: slideIn 0.3s ease-out;
    `;
    
    document.body.appendChild(notification);
    
    // Remove after 3 seconds
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease-out';
        setTimeout(() => {
            notification.remove();
        }, 300);
    }, 3000);
}

/* === FORMAT PRICE === */
function formatPrice(price) {
    return '$' + parseFloat(price).toFixed(2);
}

/* === CART FUNCTIONALITY (Basic) === */
let cart = JSON.parse(localStorage.getItem('cart')) || [];

function updateCartCount() {
    const cartCount = document.querySelector('.cart-count');
    if (cartCount) {
        const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
        cartCount.textContent = totalItems;
    }
}

function addToCart(product) {
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }
    
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Product added to cart!', 'success');
}

function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    showNotification('Product removed from cart', 'success');
}

// Initialize cart count on page load
updateCartCount();

/* === LOADING ANIMATION === */
function showLoading() {
    const loader = document.createElement('div');
    loader.id = 'page-loader';
    loader.style.cssText = `
        position: fixed;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(255, 255, 255, 0.9);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 99999;
    `;
    loader.innerHTML = '<div style="border: 5px solid #f1f3f6; border-top: 5px solid #2874f0; border-radius: 50%; width: 60px; height: 60px; animation: spin 1s linear infinite;"></div>';
    
    document.body.appendChild(loader);
}

function hideLoading() {
    const loader = document.getElementById('page-loader');
    if (loader) {
        loader.remove();
    }
}

/* === ADD CSS ANIMATIONS === */
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
`;
document.head.appendChild(style);
