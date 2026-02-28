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
    if (countEl) countEl.innerText = cart.reduce((t, i) => t + i.quantity, 0);

    const itemsEl = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    
    if (itemsEl) {
        itemsEl.innerHTML = '';
        let total = 0;
        cart.forEach((item, i) => {
            total += item.price * item.quantity;
            itemsEl.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; padding:10px; border:1px solid #eee; border-radius:10px;">
                    <div><b>${item.name}</b><br><small>${(item.price*item.quantity).toFixed(2)}€</small></div>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <button onclick="changeQuantity(${i}, -1)" style="width:25px; border-radius:50%; border:1px solid #333; background:none; cursor:pointer;">-</button>
                        <span>${item.quantity}</span>
                        <button onclick="changeQuantity(${i}, 1)" style="width:25px; border-radius:50%; border:1px solid #333; background:none; cursor:pointer;">+</button>
                    </div>
                </div>`;
        });
        if (totalEl) totalEl.innerText = total.toFixed(2);
    }
}

function processCheckout() {
    if (cart.length === 0) return alert("Carrito vacío");
    const btn = document.getElementById('checkout-btn');
    btn.innerText = "PROCESANDO...";
    setTimeout(() => {
        alert("¡Compra realizada con éxito!");
        cart = [];
        saveAndRefresh();
        toggleCart();
        btn.innerText = "FINALIZAR COMPRA";
    }, 1500);
}

function toggleCart(force = null) {
    const p = document.getElementById('cart-panel');
    if (force === true) p.classList.add('open');
    else p.classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', saveAndRefresh);
