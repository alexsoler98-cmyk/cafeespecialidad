let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];

// 1. Añadir productos al carrito de la web
function addToCart(id, name, price) {
    const idx = cart.findIndex(item => item.id === id);
    if (idx > -1) {
        cart[idx].quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    saveAndRefresh();
    toggleCart(true);
}

// 2. Control de cantidades en la web
function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    saveAndRefresh();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveAndRefresh();
}

// 3. Guardar y mostrar en el panel lateral
function saveAndRefresh() {
    localStorage.setItem('coffeeCart', JSON.stringify(cart));
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.innerText = cart.reduce((t, i) => t + i.quantity, 0);

    const itemsEl = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    
    if (itemsEl) {
        itemsEl.innerHTML = '';
        let totalMoney = 0;
        cart.forEach((item, i) => {
            totalMoney += item.price * item.quantity;
            itemsEl.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; background:#fff; padding:10px; border-radius:12px; border: 1px solid #eee;">
                    <div style="flex:1">
                        <div style="font-weight:bold; color:#3d2b1f;">${item.name}</div>
                        <div style="font-size:12px; color:#888;">${(item.price * item.quantity).toFixed(2)}€</div>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <button onclick="changeQuantity(${i}, -1)" style="width:24px; height:24px; border-radius:50%; border:1px solid #333; background:none; cursor:pointer;">-</button>
                        <span style="font-weight:bold;">${item.quantity}</span>
                        <button onclick="changeQuantity(${i}, 1)" style="width:24px; height:24px; border-radius:50%; border:1px solid #333; background:none; cursor:pointer;">+</button>
                    </div>
                </div>`;
        });
        if (totalEl) totalEl.innerText = totalMoney.toFixed(2);
    }
}

// 4. FUNCIÓN DE PAGO: Redirección al link multibebida
function processCheckout() {
    if (cart.length === 0) {
        alert("Añade algún café antes de finalizar la compra.");
        return;
    }

    // Como tu nuevo link de Stripe ya tiene los 3 productos configurados,
    // el cliente simplemente confirma las cantidades allí.
    const stripeMultiproductLink = "https://buy.stripe.com/test_28E8wH5b2aYs9xk6wl5EY01";

    const btn = document.getElementById('checkout-btn');
    if (btn) {
        btn.innerText = "ABRIENDO CAJA SEGURA...";
        btn.disabled = true;
    }

    window.location.href = stripeMultiproductLink;
}

function toggleCart(force = null) {
    const p = document.getElementById('cart-panel');
    if (p) {
        if (force === true) p.classList.add('open');
        else if (force === false) p.classList.remove('open');
        else p.classList.toggle('open');
    }
}

document.addEventListener('DOMContentLoaded', saveAndRefresh);
