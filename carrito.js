let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];

// Añadir al carrito
function addToCart(id, name, price) {
    const idx = cart.findIndex(item => item.id === id);
    if (idx > -1) cart[idx].quantity += 1;
    else cart.push({ id, name, price, quantity: 1 });
    saveAndRefresh();
    toggleCart(true);
}

// Cambiar cantidad (+ o -)
function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    saveAndRefresh();
}

// Eliminar producto
function removeFromCart(index) {
    cart.splice(index, 1);
    saveAndRefresh();
}

// Guardar y dibujar carrito
function saveAndRefresh() {
    localStorage.setItem('coffeeCart', JSON.stringify(cart));
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.innerText = cart.reduce((t, i) => t + i.quantity, 0);

    const itemsEl = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    
    if (itemsEl) {
        itemsEl.innerHTML = '';
        let total = 0;
        cart.forEach((item, i) => {
            total += item.price * item.quantity;
            itemsEl.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; background:#fff; padding:15px; border-radius:15px; border: 1px solid #eee;">
                    <div style="flex:1">
                        <div style="font-weight:900; color:#3d2b1f; font-size:14px;">${item.name}</div>
                        <div style="font-size:12px; color:#888;">${(item.price * item.quantity).toFixed(2)}€</div>
                    </div>
                    <div style="display:flex; align-items:center; gap:10px; margin: 0 15px;">
                        <button onclick="changeQuantity(${i}, -1)" style="width:28px; height:28px; border-radius:50%; border:1px solid #3d2b1f; background:none; cursor:pointer; font-weight:bold;">-</button>
                        <span style="font-weight:900; width:15px; text-align:center;">${item.quantity}</span>
                        <button onclick="changeQuantity(${i}, 1)" style="width:28px; height:28px; border-radius:50%; border:1px solid #3d2b1f; background:none; cursor:pointer; font-weight:bold;">+</button>
                    </div>
                    <button onclick="removeFromCart(${i})" style="color:#e63946; border:none; background:none; cursor:pointer; font-weight:bold; font-size:22px;">&times;</button>
                </div>
            `;
        });
        if (totalEl) totalEl.innerText = total.toFixed(2);
    }
}

// BOTÓN DE PAGO (Usando tu link para todo)
function processCheckout() {
    if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    const checkoutBtn = document.getElementById('checkout-btn');
    checkoutBtn.innerText = "REDIRECCIONANDO...";
    checkoutBtn.disabled = true;

    // Redirigimos siempre a tu link de Stripe
    window.location.href = "https://buy.stripe.com/test_6oUcMX0UMaYsgZMaMB5EY00";
}

function toggleCart(force = null) {
    const p = document.getElementById('cart-panel');
    if (force === true) p.classList.add('open');
    else p.classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', saveAndRefresh);
