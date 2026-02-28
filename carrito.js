// 1. Cargar el carrito desde el almacenamiento del navegador
let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];

// 2. Función para añadir productos al carrito
function addToCart(id, name, price) {
    const idx = cart.findIndex(item => item.id === id);
    if (idx > -1) {
        cart[idx].quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    saveAndRefresh();
    toggleCart(true); // Abre el carrito automáticamente al añadir
}

// 3. Cambiar cantidad de un producto específico (+1 o -1)
function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1); // Si llega a 0, se elimina
    }
    saveAndRefresh();
}

// 4. Eliminar un producto por completo
function removeFromCart(index) {
    cart.splice(index, 1);
    saveAndRefresh();
}

// 5. Guardar en memoria y actualizar la interfaz visual
function saveAndRefresh() {
    localStorage.setItem('coffeeCart', JSON.stringify(cart));
    
    // Actualizar el contador de la burbuja del carrito
    const countEl = document.getElementById('cart-count');
    if (countEl) countEl.innerText = cart.reduce((t, i) => t + i.quantity, 0);

    // Dibujar los productos en el panel lateral
    const itemsEl = document.getElementById('cart-items');
    const totalEl = document.getElementById('cart-total');
    
    if (itemsEl) {
        itemsEl.innerHTML = '';
        let totalAcumulado = 0;

        cart.forEach((item, i) => {
            totalAcumulado += item.price * item.quantity;
            itemsEl.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; background:#fff; padding:15px; border-radius:15px; border: 1px solid #eee; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
                    <div style="flex:1">
                        <div style="font-weight:900; color:#3d2b1f; font-size:14px;">${item.name}</div>
                        <div style="font-size:12px; color:#888;">${(item.price * item.quantity).toFixed(2)}€</div>
                    </div>
                    
                    <div style="display:flex; align-items:center; gap:10px; margin: 0 15px;">
                        <button onclick="changeQuantity(${i}, -1)" style="width:25px; height:25px; border-radius:50%; border:1px solid #3d2b1f; background:none; cursor:pointer; font-weight:bold;">-</button>
                        <span style="font-weight:900; width:15px; text-align:center;">${item.quantity}</span>
                        <button onclick="changeQuantity(${i}, 1)" style="width:25px; height:25px; border-radius:50%; border:1px solid #3d2b1f; background:none; cursor:pointer; font-weight:bold;">+</button>
                    </div>

                    <button onclick="removeFromCart(${i})" style="color:#e63946; border:none; background:none; cursor:pointer; font-weight:bold; font-size:22px;">&times;</button>
                </div>
            `;
        });

        if (totalEl) totalEl.innerText = totalAcumulado.toFixed(2);
    }
}

// 6. FUNCIÓN DE PAGO (LA QUE CONECTA CON STRIPE)
function processCheckout() {
    if (cart.length === 0) {
        alert("Tu carrito está vacío.");
        return;
    }

    // Calculamos el número TOTAL de productos (bolsas de café)
    const totalUnidades = cart.reduce((t, i) => t + i.quantity, 0);

    // Tu enlace de Stripe
    const stripeBaseUrl = "https://buy.stripe.com/test_6oUcMX0UMaYsgZMaMB5EY00";

    // CREAMOS EL LINK DINÁMICO: Esto le dice a Stripe cuántas unidades cobrar
    const urlFinal = `${stripeBaseUrl}?quantity=${totalUnidades}`;

    // Efecto visual en el botón
    const btn = document.getElementById('checkout-btn');
    if (btn) {
        btn.innerText = "REDIRECCIONANDO A PAGO...";
        btn.style.background = "#E85D04";
        btn.disabled = true;
    }

    // Redirigir a Stripe
    window.location.href = urlFinal;
}

// 7. Abrir y Cerrar el panel del carrito
function toggleCart(force = null) {
    const panel = document.getElementById('cart-panel');
    if (!panel) return;

    if (force === true) panel.classList.add('open');
    else if (force === false) panel.classList.remove('open');
    else panel.classList.toggle('open');
}

// Iniciar la carga al abrir la página
document.addEventListener('DOMContentLoaded', saveAndRefresh);
