let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];

// 1. Necesitamos los IDs de precio de Stripe para que funcione
// Búscalos en tu panel de Stripe (empiezan por price_...)
const stripePriceIds = {
    'etiopia': 'TU_ID_PRECIO_ETIOPIA', 
    'colombia': 'TU_ID_PRECIO_COLOMBIA',
    'peru': 'TU_ID_PRECIO_PERU'
};

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
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; background:#fff; padding:10px; border-radius:12px; border: 1px solid #eee;">
                    <div style="flex:1">
                        <div style="font-weight:bold;">${item.name}</div>
                        <div style="font-size:12px; color:#888;">${(item.price * item.quantity).toFixed(2)}€</div>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <button onclick="changeQuantity(${i}, -1)" style="width:24px; height:24px; border-radius:50%; border:1px solid #333; background:none; cursor:pointer;">-</button>
                        <span style="font-weight:bold;">${item.quantity}</span>
                        <button onclick="changeQuantity(${i}, 1)" style="width:24px; height:24px; border-radius:50%; border:1px solid #333; background:none; cursor:pointer;">+</button>
                    </div>
                </div>`;
        });
        if (totalEl) totalEl.innerText = total.toFixed(2);
    }
}

// 2. FUNCIÓN DE PAGO: Genera el enlace con todos los productos
function processCheckout() {
    if (cart.length === 0) return alert("Carrito vacío");

    const stripeBaseUrl = "https://buy.stripe.com/test_28E8wH5b2aYs9xk6wl5EY01";
    
    // Construimos la URL con las cantidades para CADA producto
    // Nota: Para que esto sea 100% exacto, Stripe requiere que el link tenga 
    // habilitada la edición de cantidad para todos los productos.
    
    let queryParams = "";
    cart.forEach((item, index) => {
        // Stripe identifica la posición del producto en el link (0, 1, 2...)
        queryParams += (index === 0 ? "?" : "&") + `quantity=${item.quantity}`;
    });

    window.location.href = stripeBaseUrl + queryParams;
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
