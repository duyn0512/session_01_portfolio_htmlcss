// ===== PRODUCT DATA =====
const products = [
    { id: 1,  name: 'MacBook Pro 14"',     price: 42990000, image: '💻', category: 'laptop',    desc: 'M3 Pro, 18GB RAM' },
    { id: 2,  name: 'iPhone 15 Pro Max',    price: 34990000, image: '📱', category: 'phone',     desc: '256GB, Titan tự nhiên' },
    { id: 3,  name: 'AirPods Pro 2',        price: 6490000,  image: '🎧', category: 'accessory', desc: 'USB-C, Chống ồn chủ động' },
    { id: 4,  name: 'iPad Air M2',          price: 16990000, image: '📱', category: 'tablet',    desc: '11 inch, 128GB' },
    { id: 5,  name: 'Samsung Galaxy S24 Ultra', price: 31990000, image: '📱', category: 'phone', desc: 'S Pen, 256GB' },
    { id: 6,  name: 'Sony WH-1000XM5',     price: 8490000,  image: '🎧', category: 'accessory', desc: 'Chống ồn 30h' },
    { id: 7,  name: 'Dell XPS 15',          price: 35990000, image: '💻', category: 'laptop',    desc: 'i7, 16GB, OLED' },
    { id: 8,  name: 'Apple Watch Ultra 2',  price: 21990000, image: '⌚', category: 'accessory', desc: 'Titanium, GPS' },
    { id: 9,  name: 'Logitech MX Master 3S', price: 2490000, image: '🖱️', category: 'accessory', desc: 'Ergonomic, Bluetooth' },
    { id: 10, name: 'ASUS ROG Zephyrus',    price: 45990000, image: '💻', category: 'laptop',    desc: 'RTX 4070, 165Hz' },
];

// ===== STATE =====
let cart = JSON.parse(localStorage.getItem('cart')) || [];
let searchQuery = '';

// ===== DOM ELEMENTS =====
const productGrid = document.getElementById('product-grid');
const cartToggle = document.getElementById('cart-toggle');
const cartSidebar = document.getElementById('cart-sidebar');
const cartOverlay = document.getElementById('cart-overlay');
const cartClose = document.getElementById('cart-close');
const cartItems = document.getElementById('cart-items');
const cartEmpty = document.getElementById('cart-empty');
const cartSummary = document.getElementById('cart-summary');
const cartBadge = document.getElementById('cart-badge');
const cartCount = document.getElementById('cart-count');
const subtotalEl = document.getElementById('subtotal');
const vatEl = document.getElementById('vat');
const totalEl = document.getElementById('total');
const searchInput = document.getElementById('search-input');
const toastContainer = document.getElementById('toast-container');


function formatPrice(price) {
    return new Intl.NumberFormat('vi-VN', {
        style: 'currency',
        currency: 'VND'
    }).format(price);
}


function renderProducts() {
    const filtered = products.filter(p =>
        p.name.toLowerCase().includes(searchQuery.toLowerCase())
    );

    if (filtered.length === 0) {
        productGrid.innerHTML = '<p style="text-align:center;grid-column:1/-1;color:#94a3b8;">Không tìm thấy sản phẩm</p>';
        return;
    }

    productGrid.innerHTML = filtered.map(product => `
        <div class="product-card" data-id="${product.id}">
            <div class="product-image">${product.image}</div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-desc">${product.desc}</p>
                <div class="product-bottom">
                    <span class="product-price">${formatPrice(product.price)}</span>
                    <button class="add-to-cart-btn" data-id="${product.id}">Thêm vào giỏ</button>
                </div>
            </div>
        </div>
    `).join('');
}


// ===== ADD TO CART =====
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    const existingItem = cart.find(item => item.id === productId);

    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: product.id,
            name: product.name,
            price: product.price,
            image: product.image,
            quantity: 1
        });
    }

    saveCart();
    renderCart();
    showToast(`Đã thêm "${product.name}" vào giỏ hàng`, 'success');
}

// ===== UPDATE QUANTITY =====
function updateQuantity(productId, change) {
    const item = cart.find(item => item.id === productId);
    if (!item) return;

    item.quantity += change;

    if (item.quantity <= 0) {
        removeFromCart(productId);
        return;
    }

    saveCart();
    renderCart();
}

// ===== REMOVE FROM CART =====
function removeFromCart(productId) {
    const item = cart.find(i => i.id === productId);
    if (!item) return;

    const confirmed = confirm(`Xóa "${item.name}" khỏi giỏ hàng?`);
    if (!confirmed) return;

    cart = cart.filter(i => i.id !== productId);
    saveCart();
    renderCart();
    showToast(`Đã xóa "${item.name}" khỏi giỏ hàng`, 'info');
}

// ===== CLEAR CART =====
function clearCart() {
    if (cart.length === 0) return;
    const confirmed = confirm('Xóa tất cả sản phẩm trong giỏ hàng?');
    if (!confirmed) return;

    cart = [];
    saveCart();
    renderCart();
    showToast('Đã xóa toàn bộ giỏ hàng', 'info');
}


function renderCart() {
    // Update badge
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    cartCount.textContent = totalItems;

    if (totalItems > 0) {
        cartBadge.hidden = false;
        cartBadge.textContent = totalItems;
    } else {
        cartBadge.hidden = true;
    }

    // Empty state
    if (cart.length === 0) {
        cartEmpty.hidden = false;
        cartItems.hidden = true;
        cartSummary.hidden = true;
        return;
    }

    cartEmpty.hidden = true;
    cartItems.hidden = false;
    cartSummary.hidden = false;

    // Render items
    cartItems.innerHTML = cart.map(item => `
        <div class="cart-item" data-id="${item.id}">
            <span class="cart-item-image">${item.image}</span>
            <div class="cart-item-details">
                <h4>${item.name}</h4>
                <span class="cart-item-price">${formatPrice(item.price)}</span>
            </div>
            <div class="quantity-controls">
                <button class="qty-btn" data-id="${item.id}" data-change="-1">−</button>
                <span class="qty-value">${item.quantity}</span>
                <button class="qty-btn" data-id="${item.id}" data-change="1">+</button>
            </div>
            <span class="cart-item-total">${formatPrice(item.price * item.quantity)}</span>
            <button class="remove-btn" data-id="${item.id}" title="Xóa">✕</button>
        </div>
    `).join('');

    // Update totals
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const vat = subtotal * 0.1;
    const total = subtotal + vat;

    subtotalEl.textContent = formatPrice(subtotal);
    vatEl.textContent = formatPrice(vat);
    totalEl.textContent = formatPrice(total);
}


function openCart() {
    cartSidebar.classList.add('open');
    cartOverlay.hidden = false;
    document.body.style.overflow = 'hidden';
}

function closeCart() {
    cartSidebar.classList.remove('open');
    cartOverlay.hidden = true;
    document.body.style.overflow = '';
}


function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <span>${type === 'success' ? '✅' : 'ℹ️'} ${message}</span>
    `;

    toastContainer.appendChild(toast);

    // Auto remove after 3s
    setTimeout(() => {
        toast.classList.add('toast-fade-out');
        setTimeout(() => toast.remove(), 300);
    }, 3000);
}


function saveCart() {
    localStorage.setItem('cart', JSON.stringify(cart));
}


// ===== EVENT DELEGATION: Product Grid =====
productGrid.addEventListener('click', (e) => {
    const btn = e.target.closest('.add-to-cart-btn');
    if (btn) {
        const productId = parseInt(btn.dataset.id);
        addToCart(productId);
    }
});

// ===== EVENT DELEGATION: Cart Items =====
cartItems.addEventListener('click', (e) => {
    // Quantity buttons
    const qtyBtn = e.target.closest('.qty-btn');
    if (qtyBtn) {
        const id = parseInt(qtyBtn.dataset.id);
        const change = parseInt(qtyBtn.dataset.change);
        updateQuantity(id, change);
        return;
    }

    // Remove button
    const removeBtn = e.target.closest('.remove-btn');
    if (removeBtn) {
        const id = parseInt(removeBtn.dataset.id);
        removeFromCart(id);
        return;
    }
});

// Cart sidebar
cartToggle.addEventListener('click', openCart);
cartClose.addEventListener('click', closeCart);
cartOverlay.addEventListener('click', closeCart);

// Checkout
document.getElementById('checkout-btn').addEventListener('click', () => {
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const vat = total * 0.1;
    alert(`Cảm ơn bạn đã mua hàng!\nTổng: ${formatPrice(total + vat)}\n\n(Đây là demo — chưa tích hợp thanh toán thực)`);
    cart = [];
    saveCart();
    renderCart();
    closeCart();
});

// Search
searchInput.addEventListener('input', (e) => {
    searchQuery = e.target.value;
    renderProducts();
});

// Keyboard: Escape to close cart
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeCart();
});

// ===== INIT =====
renderProducts();
renderCart();