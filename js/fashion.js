const searchInput = document.getElementById("searchInput");
const products = document.querySelectorAll(".product-card");

searchInput.addEventListener("input", function () {
    const value = this.value.toLowerCase();

    products.forEach(product => {
        const name = product.dataset.name.toLowerCase();
        product.style.display = name.includes(value) ? "block" : "none";
    });
});
