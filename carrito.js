let cart = JSON.parse(localStorage.getItem('coffeeCart')) || [];

function addToCart(id, name, price) {
    const itemIndex = cart.findIndex(item => item.id === id);
    if (itemIndex > -1) {
        cart[itemIndex].quantity += 1;
    } else {
        cart.push({ id, name, price, quantity: 1 });
    }
    saveAndRefresh();
    toggleCart(true);
}

// ESTA ES LA FUNCIÓN QUE HACEN LOS BOTONES + y -
function changeQuantity(index, delta) {
    cart[index].quantity += delta;
    if (cart[index].quantity <= 0) {
        cart.splice(index, 1);
    }
    saveAndRefresh();
}

function removeFromCart(index) {
    cart.splice(index, 1);
    saveAndRefresh();
}

function saveAndRefresh() {
    localStorage.setItem('coffeeCart', JSON.stringify(cart));
    
    const cartCount = document.getElementById('cart-count');
    if (cartCount) cartCount.innerText = cart.reduce((t, i) => t + i.quantity, 0);

    const cartItems = document.getElementById('cart-items');
    const cartTotal = document.getElementById('cart-total');
    
    if (cartItems) {
        cartItems.innerHTML = '';
        let totalSum = 0;

        cart.forEach((item, index) => {
            totalSum += item.price * item.quantity;
            
            // Creamos el HTML de la tarjeta del carrito
            cartItems.innerHTML += `
                <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:15px; background:#fff; padding:15px; border-radius:15px; border: 1px solid #eee;">
                    <div style="flex:1">
                        <div style="font-weight:bold; color:#3d2b1f;">${item.name}</div>
                        <div style="font-size:12px; color:#888;">${(item.price * item.quantity).toFixed(2)}€</div>
                    </div>
                    
                    <div style="display:flex; align-items:center; gap:8px; margin: 0 10px;">
                        <button onclick="changeQuantity(${index}, -1)" style="width:28px; height:28px; border-radius:50%; border:1px solid #3d2b1f; background:none; cursor:pointer; font-weight:bold;">-</button>
                        <span style="font-weight:bold; width:15px; text-align:center;">${item.quantity}</span>
                        <button onclick="changeQuantity(${index}, 1)" style="width:28px; height:28px; border-radius:50%; border:1px solid #3d2b1f; background:none; cursor:pointer; font-weight:bold;">+</button>
                    </div>

                    <button onclick="removeFromCart(${index})" style="color:red; border:none; background:none; cursor:pointer; font-weight:bold; font-size:20px;">&times;</button>
                </div>
            `;
        });

        if (cartTotal) cartTotal.innerText = totalSum.toFixed(2);
    }
}

function toggleCart(force = null) {
    const panel = document.getElementById('cart-panel');
    if (force === true) panel.classList.add('open');
    else panel.classList.toggle('open');
}

document.addEventListener('DOMContentLoaded', saveAndRefresh);
