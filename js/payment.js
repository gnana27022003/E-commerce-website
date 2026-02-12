


document.addEventListener("DOMContentLoaded", () => {

  const radios = document.querySelectorAll("input[name='paymentMethod']");
  const payBtn = document.getElementById("payBtn");
  const hiddenInput = document.getElementById("paymentMethodInput");

  radios.forEach(radio => {
    radio.addEventListener("change", () => {
      hiddenInput.value = radio.value;
      payBtn.disabled = false;

      
    });
  });

});

