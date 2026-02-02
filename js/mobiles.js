document.addEventListener("DOMContentLoaded", () => {

    const products = document.querySelectorAll(".product-card");
    const searchInput = document.getElementById("searchInput");

    const brandFilters = document.querySelectorAll(".brand-filter");
    const priceFilters = document.querySelectorAll(".price-filter");
    const ramFilters = document.querySelectorAll(".ram-filter");
    const screenFilters = document.querySelectorAll(".screen-filter");

    function applyFilters() {
        const brands = getValues(brandFilters);
        const prices = getValues(priceFilters);
        const rams = getValues(ramFilters);
        const screens = getValues(screenFilters);
        const search = searchInput.value.toLowerCase();

        products.forEach(p => {
            const brand = p.dataset.brand;
            const price = +p.dataset.price;
            const ram = p.dataset.ram;
            const screen = +p.dataset.screen;
            const name = p.dataset.name;

            let show =
                (brands.length === 0 || brands.includes(brand)) &&
                (prices.length === 0 || matchPrice(price, prices)) &&
                (rams.length === 0 || rams.includes(ram)) &&
                (screens.length === 0 || matchScreen(screen, screens)) &&
                name.includes(search);

            p.style.display = show ? "block" : "none";
        });
    }

    function getValues(nodes) {
        return [...nodes].filter(n => n.checked).map(n => n.value);
    }

    function matchPrice(price, ranges) {
        return ranges.some(r => {
            if (r === "under10k") return price < 10000;
            if (r === "10to20k") return price >= 10000 && price <= 20000;
            if (r === "above20k") return price > 20000;
        });
    }

    function matchScreen(size, ranges) {
        return ranges.some(r => {
            if (r === "small") return size < 6;
            if (r === "medium") return size >= 6 && size <= 6.5;
            if (r === "large") return size > 6.5;
        });
    }

    [...brandFilters, ...priceFilters, ...ramFilters, ...screenFilters]
        .forEach(cb => cb.addEventListener("change", applyFilters));

    searchInput.addEventListener("keyup", applyFilters);
});


