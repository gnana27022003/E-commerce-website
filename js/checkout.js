/* ===========================
   CHECKOUT INITIALIZATION
=========================== */

let selectedAddressId = null;

// addresses coming from EJS
let userAddresses = savedAddresses || [];

document.addEventListener("DOMContentLoaded", initCheckout);

function initCheckout() {

    // LOGIN CHANGE
    const loginChangeBtn = document.getElementById("change-login-btn");
    if (loginChangeBtn) {
        loginChangeBtn.addEventListener("click", () => {
            alert("Login change functionality here");
        });
    }

    // ADDRESS CHANGE
    const addressChangeBtn = document.getElementById("address-change-btn");
    if (addressChangeBtn) {
        addressChangeBtn.addEventListener("click", () => {
            openStep("address");
        });
    }

    // ADD ADDRESS BUTTON
    const addAddressBtn = document.getElementById("add-address-btn");
    if (addAddressBtn) {
        addAddressBtn.addEventListener("click", showAddressForm);
    }

    // CANCEL ADDRESS BUTTON
    const cancelBtn = document.getElementById("cancel-address-btn");
    if (cancelBtn) {
        cancelBtn.addEventListener("click", hideAddressForm);
    }

    // CONTINUE BUTTON
    const continueBtn = document.getElementById("continue-btn");
    if (continueBtn) {
        continueBtn.addEventListener("click", continueToOrder);
    }

    renderSavedAddresses();
}


/* ===========================
   STEP CONTROL
=========================== */

function openStep(step) {

    document.querySelectorAll(".step-content").forEach(el => {
        el.style.display = "none";
    });

    if (step === "address") {
        document.getElementById("address-content").style.display = "block";
    }

    if (step === "order") {
        document.getElementById("order-content").style.display = "block";
    }
}


/* ===========================
   ADDRESS MANAGEMENT
=========================== */

function renderSavedAddresses() {

    const container = document.getElementById("saved-addresses");
    if (!container) return;

    container.innerHTML = "";

    if (!userAddresses.length) {
        container.innerHTML = `<p>No saved addresses found.</p>`;
        return;
    }

    userAddresses.forEach((addr, index) => {

        const addressCard = document.createElement("div");
        addressCard.className = "address-card";

        addressCard.innerHTML = `
            <label class="address-label">
                <input type="radio"
                       name="selectedAddress"
                       data-address-id="${index}"
                       ${index === 0 ? "checked" : ""}>

                <div class="address-details">
                    <strong>${addr.name}</strong> ${addr.phone}<br>
                    ${addr.addressLine}, ${addr.locality},<br>
                    ${addr.city}, ${addr.state} - ${addr.pincode}<br>
                    ${addr.landmark || ""}
                </div>
            </label>
        `;

        container.appendChild(addressCard);
    });

    // default selection
    selectedAddressId = 0;
    showDeliverButton(0);

    document.querySelectorAll("input[name='selectedAddress']")
        .forEach(radio => {
            radio.addEventListener("change", function () {
                const id = this.dataset.addressId;
                selectedAddressId = id;
                showDeliverButton(id);
            });
        });
}



function showAddressForm() {
    document.getElementById("address-form-wrapper").style.display = "block";
}

function hideAddressForm() {
    document.getElementById("address-form-wrapper").style.display = "none";
}


/* ===========================
   ORDER SUMMARY STEP
=========================== */

function continueToOrder() {

    if (selectedAddressId === null) {
        alert("Please select an address");
        return;
    }

    // mark address step completed
    document.getElementById("address-header").classList.remove("active");
    document.getElementById("address-header").classList.add("completed");

    openStep("order");
}


/* ===========================
   OPTIONAL MAP BUTTONS
=========================== */

const mapModal = document.getElementById("map-modal");

const searchOnMapBtn = document.getElementById("search-on-map");
if (searchOnMapBtn) {
    searchOnMapBtn.addEventListener("click", () => {
        if (mapModal) mapModal.style.display = "flex";
    });
}

const closeMapBtn = document.getElementById("close-map");
if (closeMapBtn) {
    closeMapBtn.addEventListener("click", () => {
        if (mapModal) mapModal.style.display = "none";
    });
}

function showDeliverButton(addressId) {

    // remove old buttons
    document.querySelectorAll(".deliver-here-btn")
        .forEach(btn => btn.remove());

    document.querySelectorAll(".address-card")
        .forEach(card => card.classList.remove("selected"));

    const selectedInput =
        document.querySelector(`input[data-address-id="${addressId}"]`);

    if (!selectedInput) return;

    const card = selectedInput.closest(".address-card");
    card.classList.add("selected");

    const btn = document.createElement("button");
    btn.className = "deliver-here-btn";
    btn.textContent = "DELIVER HERE";

    btn.onclick = () => confirmAddress(addressId);

    card.querySelector(".address-details").appendChild(btn);
}


function confirmAddress(addressId) {

    // set selected address id
    document.getElementById("deliver-address-id").value = addressId;

    // submit form
    document.getElementById("deliver-form").submit();
}


/* ===========================
   CURRENT LOCATION (BASIC)
=========================== */

const useLocationBtn = document.getElementById("use-current-location");

if (useLocationBtn) {
    useLocationBtn.addEventListener("click", () => {

        if (!navigator.geolocation) {
            alert("Geolocation not supported");
            return;
        }

        navigator.geolocation.getCurrentPosition(
            () => alert("Location captured successfully"),
            () => alert("Unable to get location")
        );
    });
}

// ================= SHOW ADDRESS FORM =================
document.getElementById("add-address-btn").onclick = () => {
  document.getElementById("address-form-wrapper").style.display = "block";
};

// ================= CURRENT LOCATION =================
document.getElementById("use-current-location").onclick = () => {
  if (!navigator.geolocation) {
    alert("Geolocation not supported");
    return;
  }

  navigator.geolocation.getCurrentPosition(
    pos => {
      reverseGeocode(pos.coords.latitude, pos.coords.longitude);
    },
    () => alert("Location permission denied"),
    { enableHighAccuracy: true }
  );
};

// ================= MAP SEARCH =================
let map, marker, selectedLatLng;

document.getElementById("search-on-map").onclick = () => {
  document.getElementById("map-modal").style.display = "flex";
  initMap();
};

document.getElementById("close-map").onclick = () => {
  document.getElementById("map-modal").style.display = "none";
};

function initMap() {
  map = new google.maps.Map(document.getElementById("map"), {
    center: { lat: 20.5937, lng: 78.9629 },
    zoom: 5
  });

  marker = new google.maps.Marker({ map });

  const input = document.getElementById("map-search");
  const autocomplete = new google.maps.places.Autocomplete(input);

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry) return;

    map.setCenter(place.geometry.location);
    map.setZoom(15);
    marker.setPosition(place.geometry.location);
    selectedLatLng = place.geometry.location;
  });

  map.addListener("click", e => {
    marker.setPosition(e.latLng);
    selectedLatLng = e.latLng;
  });
}

// ================= CONFIRM LOCATION =================
document.getElementById("confirm-location").onclick = () => {
  const input = document.getElementById("map-search").value.trim();

  if (selectedLatLng) {
    reverseGeocode(selectedLatLng.lat(), selectedLatLng.lng());
    document.getElementById("map-modal").style.display = "none";
    return;
  }

  if (!input) {
    alert("Please select a location on map");
    return;
  }

  // 🔥 FALLBACK: Geocode typed text
  const geocoder = new google.maps.Geocoder();
  geocoder.geocode({ address: input }, (results, status) => {
    if (status !== "OK" || !results[0]) {
      alert("Unable to fetch address");
      return;
    }

    const loc = results[0].geometry.location;
    reverseGeocode(loc.lat(), loc.lng());
    document.getElementById("map-modal").style.display = "none";
  });
};


// ================= REVERSE GEOCODE =================
function reverseGeocode(lat, lng) {
  // 🔥 FORCE SHOW FORM FIRST
  document.getElementById("address-form-wrapper").style.display = "block";
  document.getElementById("add-address-btn").style.display = "none";

  const geocoder = new google.maps.Geocoder();

  geocoder.geocode({ location: { lat, lng } }, (results, status) => {
    if (status !== "OK" || !results[0]) {
      alert("Unable to fetch address");
      return;
    }

    let city = "", state = "", pincode = "", locality = "";

    results[0].address_components.forEach(c => {
      if (c.types.includes("locality")) city = c.long_name;
      if (c.types.includes("administrative_area_level_1")) state = c.long_name;
      if (c.types.includes("postal_code")) pincode = c.long_name;
      if (c.types.includes("sublocality") || c.types.includes("sublocality_level_1")) {
        locality = c.long_name;
      }
    });

    document.getElementById("address").value = results[0].formatted_address;
    document.getElementById("city").value = city;
    document.getElementById("state").value = state;
    document.getElementById("pincode").value = pincode;
    document.getElementById("locality").value = locality;
  });
}

