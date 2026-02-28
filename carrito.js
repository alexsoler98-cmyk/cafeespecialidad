let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];

function addToCart(id, name, price) {
    const idx = cart.findIndex(item => item.id === id);
    if (idx > -1) cart[idx].quantity += 1;
    else cart.push({ id, name, price, quantity: 1 });
    saveAndRefresh();
    toggleCart(true);
}

function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) cart.splice(index, 1);
    saveAndRefresh();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveAndRefresh();
}

function saveAndRefresh() {
    localStorage.setItem('coffeeCart', JSON.stringify(cart));
    const countEl = document.getElementById('cart-count');
    const totalQty = cart.reduce((t, i) => t + i.quantity, 0);
    if (countEl) countEl.innerText = totalQty;

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
                        <div style="font-weight:bold;">${item.name}</div>
                        <div style="font-size:12px; color:#888;">${(item.price * item.quantity).toFixed(2)}€</div>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <button onclick="changeQuantity(${i}, -1)" style="width:24px; height:24px; border-radius:50%; border:1px solid #333; background:none; cursor:pointer;">-</button>
                        <span style="font-weight:bold;">${item.quantity}</span>
                        <button onclick="changeQuantity(${i}, 1)" style="width:24px; height:24px; border-radius:50%; border:1px solid #333; background:none; cursor:pointer;">+</button>
                        <button onclick="removeFromCart(${i})" style="color:red; border:none; background:none; cursor:pointer; margin-left:5px;">&times;</button>
                    </div>
                </div>`;
        });
        if (totalEl) totalEl.innerText = totalMoney.toFixed(2);
    }
}

// --- FUNCIÓN DE PAGO ACTUALIZADA ---
function processCheckout() {
    if (cart.length === 0) return alert("Carrito vacío");

    // Calculamos el total de botes
    const totalBotes = cart.reduce((t, i) => t + i.quantity, 0);

    // URL base de tu Stripe
    const stripeUrl = "https://buy.stripe.com/test_6oUcMX0UMaYsgZMaMB5EY00";

    // Creamos la URL final forzando el parámetro quantity
    const finalUrl = stripeUrl + "?quantity=" + totalBotes;

    console.log("Redirigiendo a:", finalUrl); // Para que puedas ver en la consola si va bien

    // Redireccionamos
    window.location.href = finalUrl;
}

function toggleCart(force = null) {
    const p = document.getElementById('cart-panel');
    if (!p) return;
    if (force === true) p.classList.add('open');
    else if (force === false) p.classList.remove('open');
    else p.classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', saveAndRefresh);
