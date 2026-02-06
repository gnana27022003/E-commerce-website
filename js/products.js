/* ============================================
   PRODUCTS.JS - Products Page Functionality
   ============================================ */

document.addEventListener('DOMContentLoaded', function() {
    console.log('Products page loaded');
    
    // Initialize products page features
    initFilters();
    initSearch();
    initPagination();
});

/* === FILTER FUNCTIONALITY === */
function initFilters() {
    const applyFiltersBtn = document.querySelector('.btn-apply-filters');
    const clearFiltersBtn = document.querySelector('.btn-clear-filters');
    
    if (applyFiltersBtn) {
        applyFiltersBtn.addEventListener('click', function() {
            applyFilters();
        });
    }
    
    if (clearFiltersBtn) {
        clearFiltersBtn.addEventListener('click', function() {
            clearAllFilters();
        });
    }
    
    // Auto-apply filters when checkboxes change
    const filterCheckboxes = document.querySelectorAll('.category-list input, .brand-list input, .rating-list input');
    filterCheckboxes.forEach(checkbox => {
        checkbox.addEventListener('change', function() {
            // You can auto-apply filters here or wait for Apply button
            console.log('Filter changed:', this.id, this.checked);
        });
    });
}

function applyFilters() {
    // Get selected categories
    const selectedCategories = [];
    document.querySelectorAll('.category-list input:checked').forEach(checkbox => {
        selectedCategories.push(checkbox.value);
    });
    
    // Get selected brands
    const selectedBrands = [];
    document.querySelectorAll('.brand-list input:checked').forEach(checkbox => {
        selectedBrands.push(checkbox.value);
    });
    
    // Get selected ratings
    const selectedRatings = [];
    document.querySelectorAll('.rating-list input:checked').forEach(checkbox => {
        selectedRatings.push(checkbox.value);
    });
    
    // Get price range
    const minPrice = document.getElementById('min-price')?.value || 0;
    const maxPrice = document.getElementById('max-price')?.value || 99999;
    
    console.log('Applying filters:', {
        categories: selectedCategories,
        brands: selectedBrands,
        ratings: selectedRatings,
        priceRange: { min: minPrice, max: maxPrice }
    });
    
    // Show notification
    showNotification('Filters applied successfully!', 'success');
    
    // In a real application, you would:
    // 1. Filter products based on selections
    // 2. Update the products grid
    // 3. Make an API call to get filtered products
}

function clearAllFilters() {
    // Uncheck all category checkboxes
    document.querySelectorAll('.category-list input:checked').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Uncheck all brand checkboxes
    document.querySelectorAll('.brand-list input:checked').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Uncheck all rating checkboxes
    document.querySelectorAll('.rating-list input:checked').forEach(checkbox => {
        checkbox.checked = false;
    });
    
    // Clear price inputs
    const minPrice = document.getElementById('min-price');
    const maxPrice = document.getElementById('max-price');
    if (minPrice) minPrice.value = '';
    if (maxPrice) maxPrice.value = '';
    
    showNotification('All filters cleared!', 'success');
    
    // Reload all products
    console.log('All filters cleared');
}

/* === SEARCH FUNCTIONALITY === */
function initSearch() {
    const searchBox = document.getElementById('search-box');
    const searchBtn = document.querySelector('.btn-search');
    
    if (searchBtn && searchBox) {
        searchBtn.addEventListener('click', function() {
            performSearch(searchBox.value);
        });
        
        // Search on Enter key
        searchBox.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(searchBox.value);
            }
        });
    }
}

function performSearch(query) {
    if (!query || query.trim() === '') {
        showNotification('Please enter a search term', 'error');
        return;
    }
    
    console.log('Searching for:', query);
    showNotification(`Searching for "${query}"...`, 'success');
    
    // In a real application, you would:
    // 1. Make an API call with the search query
    // 2. Filter products based on search
    // 3. Update the products grid with results
}

/* === PAGINATION === */
function initPagination() {
    const paginationButtons = document.querySelectorAll('.pagination button');
    
    paginationButtons.forEach(button => {
        button.addEventListener('click', function() {
            if (this.disabled) return;
            
            // Remove active class from all buttons
            paginationButtons.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button (if it's a number)
            if (!isNaN(this.textContent)) {
                this.classList.add('active');
            }
            
            // Handle Previous/Next
            if (this.textContent === 'Previous') {
                navigatePage('prev');
            } else if (this.textContent === 'Next') {
                navigatePage('next');
            } else {
                navigatePage(parseInt(this.textContent));
            }
        });
    });
}

function navigatePage(page) {
    console.log('Navigating to page:', page);
    
    // Scroll to top
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
    
    // In a real application, you would:
    // 1. Load products for the selected page
    // 2. Update the URL
    // 3. Update pagination buttons state
}

/* === SORT FUNCTIONALITY === */
const sortSelect = document.getElementById('sort-by');
if (sortSelect) {
    sortSelect.addEventListener('change', function() {
        const sortValue = this.value;
        console.log('Sorting by:', sortValue);
        sortProducts(sortValue);
    });
}

function sortProducts(sortType) {
    showNotification(`Sorting products by ${sortType}...`, 'success');
    
    
}

/* === PRODUCT CARD INTERACTIONS === */
const productCards = document.querySelectorAll('.product-card');
productCards.forEach(card => {
    // Add hover effect
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'translateY(0)';
    });
});
