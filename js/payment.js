document.addEventListener("DOMContentLoaded", function () {

    const radios = document.querySelectorAll("input[name='paymentMethod']");
    const payBtn = document.getElementById("payBtn");

    // Enable button when any payment method is selected
    radios.forEach(radio => {
        radio.addEventListener("change", function () {
            payBtn.disabled = false;
        });
    });

    // Prevent submission if nothing selected (extra safety)
    document.getElementById("paymentForm").addEventListener("submit", function (e) {
        const selected = document.querySelector("input[name='paymentMethod']:checked");
        if (!selected) {
            e.preventDefault();
            alert("Please select a payment method");
        }
    });

});
