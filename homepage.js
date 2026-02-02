/* ============================================
HOMEPAGE JAVASCRIPT (FINAL)
============================================ */

document.addEventListener('DOMContentLoaded', function () {
    initSlider();
    initCategoryScroll();
    initProductCarousels();
});

/* ========== HERO SLIDER (FLIPKART STYLE) ========== */
let currentSlide = 0;
let slides = [];
let track;
let slideInterval;

function initSlider() {
    track = document.querySelector('.slider-track');
    slides = document.querySelectorAll('.slide');
    if (!slides.length || !track) return;

    startAutoSlide();

    const sliderContainer = document.querySelector('.slider-container');
    if (sliderContainer) {
        sliderContainer.addEventListener('mouseenter', stopAutoSlide);
        sliderContainer.addEventListener('mouseleave', startAutoSlide);
    }
}

function moveSlider() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
}

function startAutoSlide() {
    slideInterval = setInterval(() => {
        currentSlide = (currentSlide + 1) % slides.length;
        moveSlider();
    }, 2000); // ✅ 2 sec like Flipkart
}

function stopAutoSlide() {
    clearInterval(slideInterval);
}

function changeSlide(dir) {
    currentSlide = (currentSlide + dir + slides.length) % slides.length;
    moveSlider();
}

window.changeSlide = changeSlide;

/* ========== CATEGORY SCROLL ========== */
function initCategoryScroll() {
    const categoryContainer = document.querySelector('.category-container');
    if (!categoryContainer) return;

    categoryContainer.addEventListener('wheel', (e) => {
        if (e.deltaY !== 0) {
            e.preventDefault();
            categoryContainer.scrollLeft += e.deltaY;
        }
    });
}

/* ========== PRODUCT CAROUSELS ========== */
function initProductCarousels() {
    const carousels = document.querySelectorAll('.products-carousel');

    carousels.forEach((carousel) => {
        const container = carousel.closest('.products-section');
        if (!container) return;

        const hasOverflow = carousel.scrollWidth > carousel.clientWidth;

        if (hasOverflow) {
            const leftBtn = document.createElement('button');
            leftBtn.className = 'carousel-nav-btn left-btn';
            leftBtn.innerHTML = '❮';
            leftBtn.onclick = () => scrollCarousel(carousel, -1);

            const rightBtn = document.createElement('button');
            rightBtn.className = 'carousel-nav-btn right-btn';
            rightBtn.innerHTML = '❯';
            rightBtn.onclick = () => scrollCarousel(carousel, 1);

            container.style.position = 'relative';
            container.appendChild(leftBtn);
            container.appendChild(rightBtn);

            carousel.addEventListener('scroll', () => {
                updateCarouselButtons(carousel, leftBtn, rightBtn);
            });

            updateCarouselButtons(carousel, leftBtn, rightBtn);
        }

        carousel.addEventListener('wheel', (e) => {
            if (e.deltaY !== 0) {
                e.preventDefault();
                carousel.scrollLeft += e.deltaY;
            }
        });
    });
}

function scrollCarousel(carousel, direction) {
    carousel.scrollBy({
        left: direction * 200,
        behavior: 'smooth'
    });
}

function updateCarouselButtons(carousel, leftBtn, rightBtn) {
    leftBtn.style.display = carousel.scrollLeft <= 0 ? 'none' : 'flex';
    const maxScroll = carousel.scrollWidth - carousel.clientWidth;
    rightBtn.style.display = carousel.scrollLeft >= maxScroll - 1 ? 'none' : 'flex';
}

/* ========== PRODUCT ITEM CLICK ========== */
document.querySelectorAll('.product-item').forEach(item => {
    item.addEventListener('click', function () {
        window.location.href = 'product.html';
    });
});

/* ========== CAROUSEL BUTTON STYLES (JS INJECTED) ========== */
const style = document.createElement('style');
style.textContent = `
.carousel-nav-btn {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    width: 47px;
    height: 104px;
    background-color: #fff;
    border: none;
    box-shadow: 0 1px 3px rgba(0,0,0,.12);
    cursor: pointer;
    font-size: 24px;
    color: #212121;
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: center;
}
.carousel-nav-btn:hover { background-color: #f0f0f0; }
.carousel-nav-btn.left-btn { left: 0; }
.carousel-nav-btn.right-btn { right: 0; }
@media (max-width: 768px) {
    .carousel-nav-btn {
        width: 30px;
        height: 60px;
        font-size: 18px;
    }
}
`;
document.head.appendChild(style);

console.log("Homepage JS loaded successfully ✅");

/* ========= HERO BANNER CLICK REDIRECT ========= */
document.querySelectorAll('.slide').forEach(slide => {
    slide.addEventListener('click', () => {
        const link = slide.getAttribute('data-link');
        if (link) {
            window.location.href = link;
        }
    });
});
