let cartItems = [], selectedAddressId = null, currentStep = 2;
document.addEventListener('DOMContentLoaded', () => {
    initCheckout();
    loadCartFromLocalStorage();
    loadSampleData();
    initFeesToggle();
    setTimeout(() => { renderOrderItems(); updatePriceDetails(); }, 0);
});
// LocalStorage







// Init
function initCheckout() {
    document.getElementById('add-address-btn').addEventListener('click', showAddressForm);
    document.getElementById('cancel-address-btn').addEventListener('click', hideAddressForm);
    document.getElementById('address-form').addEventListener('submit', handleAddressSave);
    document.getElementById('continue-btn').addEventListener('click', proceedToPayment);
    document.getElementById('change-login-btn').addEventListener('click', handleChangeLogin);
    const addressChangeBtn = document.getElementById('address-change-btn');
    if (addressChangeBtn) addressChangeBtn.addEventListener('click', handleChangeAddress);
}

function loadSampleData() {
    const loaded = loadAddressesFromLocalStorage();
    if (loaded.length > 0) savedAddresses = loaded;
    renderSavedAddresses();
    renderOrderItems();
    updatePriceDetails();
}


function handleAddressSelect(addressId) {
    selectedAddressId = addressId;
    document.querySelectorAll('.address-card').forEach(c => {
        c.classList.remove('selected');
        const btn = c.querySelector('.deliver-here-btn');
        if (btn) btn.remove();
    });
    const card = document.querySelector(`input[data-address-id="${addressId}"]`).closest('.address-card');
    card.classList.add('selected');
    const btn = document.createElement('button');
    btn.className = 'deliver-here-btn';
    btn.textContent = 'DELIVER HERE';
    btn.addEventListener('click', () => confirmAddress(addressId));
    card.querySelector('.address-details').appendChild(btn);
}

function confirmAddress(addressId) {
    const elements = {
        header: document.getElementById('address-header'),
        content: document.getElementById('address-content'),
        tick: document.getElementById('address-tick'),
        changeBtn: document.getElementById('address-change-btn')
    };
    
    elements.header.classList.remove('active');
    elements.header.classList.add('completed');
    elements.content.classList.remove('active');
    elements.content.style.display = 'none';
    if (elements.tick) elements.tick.style.display = 'inline';
    if (elements.changeBtn) elements.changeBtn.style.display = 'inline-block';
    
    document.getElementById('order-header').classList.add('active');
    const orderContent = document.getElementById('order-content');
    orderContent.classList.add('active');
    orderContent.style.display = 'block';
    
    currentStep = 3;
    renderOrderItems();
    updatePriceDetails();
    updateStepIndicator();
    
    // ✅ SAVE SELECTED ADDRESS FOR PAYMENT & ORDER PAGE
    const selectedAddress = savedAddresses.find(a => a.id === addressId);
    if (selectedAddress) {
        localStorage.setItem("selectedAddress", JSON.stringify(selectedAddress));
    }

}

function showAddressForm() {
    document.getElementById('address-form-wrapper').style.display = 'block';
    document.getElementById('add-address-btn').style.display = 'none';

    document.getElementById('location-box').style.display = 'block';
}


function hideAddressForm() {
    document.getElementById('address-form-wrapper').style.display = 'none';
    document.getElementById('add-address-btn').style.display = 'block';
    document.getElementById('location-box').style.display = 'none';
    document.getElementById('address-form').reset();
}


function renderOrderItems() {
    const container = document.getElementById('order-items');
    if (!container) return console.error('Order container not found');
    
    container.innerHTML = '';
    if (cartItems.length === 0) {
        container.innerHTML = '<p style="text-align:center;padding:40px;color:#878787;">Your cart is empty</p>';
        return;
    }
    
    cartItems.forEach(item => {
        item.quantity ??= 1; item.originalPrice ??= item.price; item.discount ??= '';
        item.seller ??= 'Retail Seller'; item.coins ??= 0; item.delivery ??= 'Tomorrow';
        item.variant ??= item.color || ''; item.protectFee ??= 0;

        const div = document.createElement('div');
        div.className = 'order-item';
        div.innerHTML = `
            <img src="${item.image}" alt="${item.name}" class="item-image">
            <div class="item-details">
                <div class="item-name">${item.name}</div>
                ${item.variant ? `<div class="item-variant">${item.variant}</div>` : ''}
                <div class="item-seller">Seller: ${item.seller} <span class="seller-badge"><i class="fa-solid fa-shield-halved"></i> Assured</span></div>
                <div class="item-price">
                    <span class="current-price">₹${item.price.toLocaleString()}</span>
                    <span class="original-price">₹${item.originalPrice.toLocaleString()}</span>
                    ${item.discount ? `<span class="discount">${item.discount}</span>` : ''}
                    ${item.coins ? `<span class="coins-badge"><i class="fa-solid fa-coins"></i> ${item.coins}</span>` : ''}
                </div>
                ${item.protectFee ? `<div class="item-protect-fee">+ ₹${item.protectFee} Protect Promise Fee <i class="fa-solid fa-circle-info"></i></div>` : ''}
                <div class="item-emi">Or Pay ₹${Math.ceil(item.price / 6).toLocaleString()}</div>
                <div class="delivery-options"><div class="delivery-option"><input type="radio" checked><label>Delivery by ${item.delivery}</label></div></div>
                <div class="delivery-highlight"><i class="fa-solid fa-box-open"></i><div class="delivery-highlight-text"><strong>Open Box Delivery</strong> is eligible. <a href="#">Know More</a></div></div>
                <div class="item-quantity">
                    <div class="quantity-controls">
                        <button class="qty-btn" onclick="updateQuantity('${item.id}', -1)">−</button>
                        <span class="qty-value" id="qty-${item.id}">${item.quantity}</span>
                        <button class="qty-btn" onclick="updateQuantity('${item.id}', 1)">+</button>
                    </div>
                    <button class="remove-btn" onclick="removeItem('${item.id}')">REMOVE</button>
                </div>
            </div>
        `;
        container.appendChild(div);
    });
}

function updateQuantity(itemId, change) {
    const el = document.getElementById(`qty-${itemId}`);
    let qty = parseInt(el.textContent) + change;
    if (qty >= 1 && qty <= 10) {
        el.textContent = qty;
        const item = cartItems.find(i => i.id === itemId);
        if (item) { item.quantity = qty; saveCartToLocalStorage(); }
        updatePriceDetails();
    }
}

function removeItem(itemId) {
    if (!confirm('Remove this item?')) return;
    const idx = cartItems.findIndex(i => i.id === itemId);
    if (idx > -1) {
        cartItems.splice(idx, 1);
        saveCartToLocalStorage();
        renderOrderItems();
        updatePriceDetails();
        if (cartItems.length === 0) alert('Your cart is empty');
    }
}
window.updateQuantity = updateQuantity;
window.removeItem = removeItem;

// Price Details
function updatePriceDetails() {
    let total = 0, origTotal = 0, fee = 0, items = 0;
    cartItems.forEach(i => {
        const q = i.quantity || 1;
        total += i.price * q; origTotal += i.originalPrice * q; items += q;
        if (i.protectFee) fee += i.protectFee;
    });
    
    const savings = origTotal - total, payable = total + fee;
    const set = (id, val) => { const el = document.getElementById(id); if (el) el.textContent = val; };
    
    set('item-count', items);
    set('price-total', `₹${origTotal.toLocaleString()}`);
    set('promise-fee', `₹${fee}`);
    set('total-payable', `₹${payable.toLocaleString()}`);
    set('total-savings', `₹${savings.toLocaleString()}`);
}
function initFeesToggle() {
    const toggle = document.getElementById('fees-toggle');
    const breakdown = document.getElementById('fees-breakdown');
    toggle.addEventListener('click', () => {
        toggle.classList.toggle('collapsed');
        breakdown.classList.toggle('hidden');
    });
}

// Navigation
function updateStepIndicator() {
    document.querySelectorAll('.checkout-steps-indicator .step-item').forEach((s, i) => {
        s.classList.toggle('active', i <= currentStep - 1);
    });
}
function handleChangeLogin() { alert('Login change functionality'); }
function handleChangeAddress() {
    const set = (id, cls, disp) => {
        const el = document.getElementById(id);
        el.className = `step-${id.includes('header') ? 'header' : 'content'} ${cls}`;
        if (disp !== undefined) el.style.display = disp;
    }; 
    set('address-header', 'active', undefined);
    set('address-content', 'active', 'block');
    set('order-header', '', undefined);
    set('order-content', '', 'none');
    
    const tick = document.getElementById('address-tick');
    const btn = document.getElementById('address-change-btn');
    if (tick) tick.style.display = 'none';
    if (btn) btn.style.display = 'none';
    
    currentStep = 2;
    updateStepIndicator();
}

function proceedToPayment() {
    const input = document.getElementById('order-email');
    const email = input ? input.value.trim() : '';
    if (!email || !email.includes('@')) {
        alert('Please enter a valid email');
        if (input) input.focus();
        return;
    }
    localStorage.setItem('checkoutEmail', email);
    localStorage.setItem('checkoutStep', 'payment');
    window.location.href = 'payment.html';

}

let mapInitialized = false;
let map, marker, geocoder, selectedLatLng, autocomplete;

const mapModal = document.getElementById("mapModal");
const popupMapDiv = document.getElementById("popupMap");



/* ---------- CLOSE MODAL ---------- */
document.getElementById("closeMapModal").addEventListener("click", () => {
  mapModal.style.display = "none";
});

/* ---------- INIT MAP ---------- */
function initMapPopup() {
  geocoder = new google.maps.Geocoder();

  map = new google.maps.Map(popupMapDiv, {
    center: { lat: 20.5937, lng: 78.9629 },
    zoom: 15,
    clickableIcons: false
  });

  marker = new google.maps.Marker({
    map,
    draggable: true
  });

  // 🔥 THIS IS WHAT YOU WERE MISSING
  map.addListener("click", (e) => {
    setMarker(e.latLng);
  });

  marker.addListener("dragend", () => {
    selectedLatLng = marker.getPosition();
  });

  // Places search
  const input = document.getElementById("placeSearch");
  autocomplete = new google.maps.places.Autocomplete(input, {
    componentRestrictions: { country: "in" }
  });

  autocomplete.addListener("place_changed", () => {
    const place = autocomplete.getPlace();
    if (!place.geometry) return;

    map.panTo(place.geometry.location);
    map.setZoom(17);
    setMarker(place.geometry.location);
  });
}

/* ---------- SET MARKER ---------- */
function setMarker(latLng) {
  marker.setPosition(latLng);
  selectedLatLng = latLng;
}
document.addEventListener('DOMContentLoaded', () => {

  // Map button
  document.getElementById("mapLocationBtn").addEventListener("click", () => {
    mapModal.style.display = "flex";

    if (!mapInitialized) {
      setTimeout(initMapPopup, 200);
      mapInitialized = true;
    }
  });

  // Current location
 document.getElementById("currentLocationBtn").addEventListener("click", () => {
  navigator.geolocation.getCurrentPosition(
    (pos) => {
      const latLng = {
        lat: pos.coords.latitude,
        lng: pos.coords.longitude
      };

      if (!geocoder) geocoder = new google.maps.Geocoder();

      geocoder.geocode({ location: latLng }, (results, status) => {
        if (status !== "OK" || !results[0]) {
          alert("Unable to fetch address");
          return;
        }

        const c = results[0].address_components;
        const get = t => c.find(x => x.types.includes(t))?.long_name || "";

        document.getElementById("address").value = results[0].formatted_address;
        document.getElementById("city").value = get("locality");
        document.getElementById("state").value = get("administrative_area_level_1");
        document.getElementById("pincode").value = get("postal_code");
        document.getElementById("locality").value =
          get("sublocality") || get("sublocality_level_1");
      });
    },
    () => alert("Location permission denied")
  );
});


  // Confirm location
  document.getElementById("confirmLocationBtn").addEventListener("click", () => {
    if (!selectedLatLng) {
      alert("Please select a location");
      return;
    }

    geocoder.geocode({ location: selectedLatLng }, (results, status) => {
      if (status !== "OK") return alert("Address fetch failed");

      const c = results[0].address_components;
      const get = t => c.find(x => x.types.includes(t))?.long_name || "";

      document.getElementById("address").value = results[0].formatted_address;
      document.getElementById("city").value = get("locality");
      document.getElementById("state").value = get("administrative_area_level_1");
      document.getElementById("pincode").value = get("postal_code");
      document.getElementById("locality").value =
        get("sublocality") || get("sublocality_level_1");

      mapModal.style.display = "none";
    });
  });

});

