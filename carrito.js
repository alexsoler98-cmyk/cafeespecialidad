let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];

// Añadir al carrito
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

// Cambiar cantidad (+ o -)
function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveAndRefresh();
}

// Eliminar producto
function removeFromCart(index) {
    cart.splice(index, 1);
    saveAndRefresh();
}

// Guardar y renderizar
function saveAndRefresh() {
    localStorage.setItem('coffeeCart', JSON.stringify(cart));
    
    // Actualizar burbuja del icono
    const countEl = document.getElementById('cart-count');
    const totalCantidad = cart.reduce((t, i) => t + i.quantity, 0);
    if (countEl) countEl.innerText = totalCantidad;

    const itemsEl = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    
    if (itemsEl) {
        itemsEl.innerHTML = '';
        let sumaDinero = 0;

        cart.forEach((item, i) => {
            sumaDinero += item.price * item.quantity;
            itemsEl.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:10px; background:#fff; padding:12px; border-radius:12px; border: 1px solid #eee;">
                    <div style="flex:1">
                        <div style="font-weight:bold; color:#3d2b1f; font-size:14px;">${item.name}</div>
                        <div style="font-size:12px; color:#888;">${(item.price * item.quantity).toFixed(2)}€</div>
                    </div>
                    <div style="display:flex; align-items:center; gap:8px;">
                        <button onclick="changeQuantity(${i}, -1)" style="width:24px; height:24px; border-radius:50%; border:1px solid #3d2b1f; background:none; cursor:pointer;">-</button>
                        <span style="font-weight:bold; width:15px; text-align:center;">${item.quantity}</span>
                        <button onclick="changeQuantity(${i}, 1)" style="width:24px; height:24px; border-radius:50%; border:1px solid #3d2b1f; background:none; cursor:pointer;">+</button>
                        <button onclick="removeFromCart(${i})" style="color:#ff4d4d; border:none; background:none; font-size:18px; cursor:pointer; margin-left:5px;">&times;</button>
                    </div>
                </div>`;
        });
        if (totalEl) totalEl.innerText = sumaDinero.toFixed(2);
    }
}

// LA FUNCIÓN DE PAGO DINÁMICA
function processCheckout() {
    if (cart.length === 0) {
        alert("El carrito está vacío.");
        return;
    }

    // Calculamos el total de unidades (ej: 2 Etiopía + 1 Perú = 3)
    const totalUnidades = cart.reduce((t, i) => t + i.quantity, 0);

    // Tu enlace de Stripe
    const stripeLink = "https://buy.stripe.com/test_6oUcMX0UMaYsgZMaMB5EY00";

    // Enviamos el parámetro ?quantity= a la URL
    const urlFinal = `${stripeLink}?quantity=${totalUnidades}`;

    const btn = document.getElementById('checkout-btn');
    if (btn) {
        btn.innerText = "REDIRECCIONANDO...";
        btn.disabled = true;
    }

    // Redirección directa
    window.location.href = urlFinal;
}

function toggleCart(force = null) {
    const p = document.getElementById('cart-panel');
    if (!p) return;
    if (force === true) p.classList.add('open');
    else if (force === false) p.classList.remove('open');
    else p.classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', saveAndRefresh);
