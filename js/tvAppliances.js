const searchInput = document.getElementById("searchInput");
const products = document.querySelectorAll(".product-card");

searchInput.addEventListener("input", function () {
    const value = this.value.toLowerCase();
    products.forEach(product => {
        product.style.display = product.dataset.name.includes(value) ? "block" : "none";
    });
});
