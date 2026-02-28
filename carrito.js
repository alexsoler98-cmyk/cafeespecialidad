// 1. Cargar el carrito guardado o empezar uno vacío
let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];

// 2. Función para añadir productos
function addToCart(id, name, price) {
    const itemIndex = cart.findIndex(item => item.id === id);

    if (itemIndex > -1) {
        cart[itemIndex].quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }

    saveAndRefresh();
    
    // Abrir el panel automáticamente
    const panel = document.getElementById('cart-panel');
    if (panel) panel.classList.add('open');
}

// 3. Función para cambiar cantidad (+1 o -1) DESDE EL CARRITO
function changeQuantity(index, delta) {
    cart[index].quantity += delta;

    // Si la cantidad llega a 0, eliminamos el producto automáticamente
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }

    saveAndRefresh();
}

// 4. Función para eliminar un producto por completo (botón X)
function removeFromCart(index) {
    cart.splice(index, 1);
    saveAndRefresh();
}

// 5. Guardar cambios y actualizar la interfaz (Dibuja los botones + y -)
function saveAndRefresh() {
    localStorage.setItem('coffeeCart', JSON.stringify(cart));
    
    // Actualizar el contador del icono del menú
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.innerText = cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Dibujar la lista de productos dentro del panel lateral
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cartItems) {
        cartItems.innerHTML = '';
        let totalSum = 0;

        cart.forEach((item, index) => {
            totalSum += item.price * item.quantity;
            cartItems.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; background:#fdfbf9; padding:15px; border-radius:15px; color:#3d2b1f; border: 1px solid #eee; box-shadow: 0 2px 5px rgba(0,0,0,0.02);">
                    <div style="flex: 1;">
                        <div style="font-weight:bold; font-size:14px; margin-bottom:4px;">${item.name}</div>
                        <div style="font-size:12px; color:#888;">${(item.price * item.quantity).toFixed(2)}€</div>
                    </div>
                    
                    <div style="display:flex; align-items:center; gap:12px; margin-right: 15px; background: white; padding: 5px 10px; border-radius: 50px; border: 1px solid #eee;">
                        <button onclick="changeQuantity(${index}, -1)" style="width:24px; height:24px; border-radius:50%; border:1px solid #3d2b1f; background:none; cursor:pointer; font-weight:bold; display:flex; align-items:center; justify-content:center;">-</button>
                        <span style="font-weight:bold; font-size:14px; min-width:15px; text-align:center;">${item.quantity}</span>
                        <button onclick="changeQuantity(${index}, 1)" style="width:24px; height:24px; border-radius:50%; border:1px solid #3d2b1f; background:none; cursor:pointer; font-weight:bold; display:flex; align-items:center; justify-content:center;">+</button>
                    </div>

                    <button onclick="removeFromCart(${index})" style="color:#e63946; border:none; background:none; cursor:pointer; font-size:20px; font-weight:bold; padding-left:5px;">&times;</button>
                </div>
            `;
        });

        if (cartTotal) cartTotal.innerText = totalSum.toFixed(2);
    }
}

// 6. Función para abrir/cerrar el panel
function toggleCart() {
    const panel = document.getElementById('cart-panel');
    if (panel) panel.classList.toggle('open');
}

// 7. Al cargar la página, refrescar datos
document.addEventListener('DOMContentLoaded', saveAndRefresh);
