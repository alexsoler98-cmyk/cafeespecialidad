// 1. Cargar el carrito guardado o empezar uno vacío [cite: 1]
let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];

// 2. Función para añadir productos (Ver Producto -> Añadir) [cite: 1]
function addToCart(id, name, price) {
    const itemIndex = cart.findIndex(item => item.id === id);

    if (itemIndex > -1) {
        cart[itemIndex].quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }

    saveAndRefresh();
    
    // Abrir el panel automáticamente [cite: 1]
    const panel = document.getElementById('cart-panel');
    if (panel) panel.classList.add('open');
}

// 3. NUEVA FUNCIÓN: Cambiar cantidad (+1 o -1) [cite: 1]
function changeQuantity(index, delta) {
    cart[index].quantity += delta;

    // Si la cantidad llega a 0, eliminamos el producto [cite: 1]
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveAndRefresh();
}

// 4. Función para eliminar un producto por completo [cite: 1]
function removeFromCart(index) {
    cart.splice(index, 1);
    saveAndRefresh();
}

// 5. Guardar cambios y actualizar la interfaz [cite: 1]
function saveAndRefresh() {
    localStorage.setItem('coffeeCart', JSON.stringify(cart));
    
    // Actualizar el contador del icono [cite: 1]
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.innerText = cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Dibujar la lista de productos con botones de + y - [cite: 1]
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cartItems) {
        cartItems.innerHTML = '';
        let totalSum = 0;

        cart.forEach((item, index) => {
            totalSum += item.price * item.quantity;
            cartItems.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; background:#f9f9f9; padding:12px; border-radius:12px; color:#3d2b1f; border: 1px solid #eee;">
                    <div style="flex: 1;">
                        <div style="font-weight:bold; font-size:14px;">${item.name}</div>
                        <div style="font-size:12px; color:#888;">${item.price.toFixed(2)}€ / ud</div>
                    </div>
                    
                    <div style="display:flex; align-items:center; gap:10px; margin-right: 15px;">
                        <button onclick="changeQuantity(${index}, -1)" style="width:25px; height:25px; border-radius:50%; border:1px solid #3d2b1f; background:white; cursor:pointer; font-weight:bold;">-</button>
                        <span style="font-weight:bold; min-width:20px; text-align:center;">${item.quantity}</span>
                        <button onclick="changeQuantity(${index}, 1)" style="width:25px; height:25px; border-radius:50%; border:1px solid #3d2b1f; background:white; cursor:pointer; font-weight:bold;">+</button>
                    </div>

                    <button onclick="removeFromCart(${index})" style="color:#e63946; border:none; background:none; cursor:pointer; font-size:18px; font-weight:bold;">&times;</button>
                </div>
            `;
        });

        if (cartTotal) cartTotal.innerText = totalSum.toFixed(2);
    }
}

// 6. Función para abrir/cerrar el panel [cite: 1]
function toggleCart() {
    const panel = document.getElementById('cart-panel');
    if (panel) panel.classList.toggle('open');
}

// 7. Al cargar la página, refrescar datos [cite: 1]
document.addEventListener('DOMContentLoaded', saveAndRefresh);
