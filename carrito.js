// 1. Cargar el carrito guardado o empezar uno vacío
let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];

// 2. Función para añadir productos (la que llaman tus botones con onclick)
function addToCart(id, name, price) {
    const itemIndex = cart.findIndex(item => item.id === id);

    if (itemIndex > -1) {
        cart[itemIndex].quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }

    saveAndRefresh();
    
    // Abrir el panel automáticamente al añadir
    const panel = document.getElementById('cart-panel');
    if (panel) panel.classList.add('open');
}

// 3. Función para eliminar un producto
function removeFromCart(index) {
    cart.splice(index, 1);
    saveAndRefresh();
}

// 4. Guardar cambios y actualizar lo que ve el usuario
function saveAndRefresh() {
    localStorage.setItem('coffeeCart', JSON.stringify(cart));
    
    // Actualizar el contador del icono (el numerito)
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.innerText = cart.reduce((total, item) => total + item.quantity, 0);
    }

    // Dibujar la lista de productos dentro del panel
    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cartItems) {
        cartItems.innerHTML = '';
        let totalSum = 0;

        cart.forEach((item, index) => {
            totalSum += item.price * item.quantity;
            cartItems.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; background:#f9f9f9; padding:12px; border-radius:12px; color:#3d2b1f; border: 1px solid #eee;">
                    <div>
                        <div style="font-weight:bold; font-size:14px;">${item.name}</div>
                        <div style="font-size:12px; color:#888;">${item.quantity} x ${item.price.toFixed(2)}€</div>
                    </div>
                    <button onclick="removeFromCart(${index})" style="color:#e63946; border:none; background:none; cursor:pointer; font-size:18px; font-weight:bold;">&times;</button>
                </div>
            `;
        });

        if (cartTotal) cartTotal.innerText = totalSum.toFixed(2);
    }
}

// 5. Función para abrir/cerrar el panel manualmente
function toggleCart() {
    const panel = document.getElementById('cart-panel');
    if (panel) panel.classList.toggle('open');
}

// 6. Al cargar cualquier página, actualizar los datos
document.addEventListener('DOMContentLoaded', saveAndRefresh);
