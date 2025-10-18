// Menu Data
const menuItems = [
    {
        id: 1,
        name: "Original",
        description: "Teh manis dengan es",
        price: 2500,
        image: "original.jpg",
        category: "Teh",
        popular: true
    },
    {
        id: 2,
        name: "Thai Tea",
        description: "Jus jeruk segar tanpa tambahan gula",
        price: 5000,
        image: "thai tea.jpg",
        category: "Teh"
    },
    {
        id: 3,
        name: "Lemon Tea",
        description: "Teh hijau Jepang premium dengan susu",
        price: 5000,
        image: "Lemon tea.jpg",
        category: "Teh",
        popular: true
    },
    {
        id: 4,
        name: "Milk Tea",
        description: "Milkshake cokelat dengan whipped cream",
        price: 6000,
        image: "milk tea.jpg",
        category: "Teh"
    },
    {
        id: 5,
        name: "Green Tea",
        description: "Smoothie bowl strawberry dengan topping segar",
        price: 7500,
        image: "green tea.jpg",
        category: "Teh"
    },
    {
        id: 6,
        name: "Choco Milk",
        description: "Espresso dengan karamel dan susu berbusa",
        price: 7500,
        image: "choco milk.jpg",
        category: "Milkshake",
        popular: true
    },
    {
        id: 7,
        name: "Cappucino",
        description: "Milkshake cokelat dengan whipped cream",
        price: 8000,
        image: "cappucino.jpg",
        category: "kopi"
    },
    {
        id: 8,
        name: "Red Velvet",
        description: "Smoothie bowl strawberry dengan topping segar",
        price: 8000,
        image: "red velvet.jpg",
        category: "Smoothie"
    },
    {
        id: 9,
        name: "Hazelnut",
        description: "Espresso dengan karamel dan susu berbusa",
        price: 8000,
        image: "hazelnut.jpg",
        category: "Kopi",
        popular: true
    }
];

// Cart Management
let cart = [];

// Initialize
document.addEventListener('DOMContentLoaded', function() {
    renderMenu();
    loadCart();
    setupEventListeners();
});

// Render Menu Items
function renderMenu() {
    const menuGrid = document.getElementById('menuGrid');
    
    menuItems.forEach(item => {
        const menuCard = `
            <div class="menu-card">
                <div class="menu-image-container">
                    <img src="${item.image}" alt="${item.name}" class="menu-image">
                    ${item.popular ? '<span class="badge">Populer</span>' : ''}
                </div>
                <div class="menu-card-content">
                    <div class="menu-card-header">
                        <div>
                            <h3 class="menu-card-title">${item.name}</h3>
                            <span class="badge-category">${item.category}</span>
                        </div>
                    </div>
                    <p class="menu-description">${item.description}</p>
                    <div class="menu-price">Rp ${formatPrice(item.price)}</div>
                    <button class="btn btn-primary btn-full" onclick="addToCart(${item.id})">
                        ➕ Tambah ke Pesanan
                    </button>
                </div>
            </div>
        `;
        
        menuGrid.innerHTML += menuCard;
    });
}

// Add to Cart
function addToCart(itemId) {
    const item = menuItems.find(m => m.id === itemId);
    const existingItem = cart.find(c => c.id === itemId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({ ...item, quantity: 1 });
    }
    
    saveCart();
    renderCart();
    showToast(`${item.name} telah ditambahkan ke pesanan Anda;`);
}

// Remove from Cart
function removeFromCart(itemId) {
    cart = cart.filter(item => item.id !== itemId);
    saveCart();
    renderCart();
    showToast('Item telah dihapus dari pesanan');
}

// Update Quantity
function updateQuantity(itemId, change) {
    const item = cart.find(c => c.id === itemId);
    if (item) {
        item.quantity = Math.max(1, item.quantity + change);
        saveCart();
        renderCart();
    }
}

// Render Cart
function renderCart() {
    const cartItemsContainer = document.getElementById('cartItems');
    const totalAmountElement = document.getElementById('totalAmount');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p class="empty-cart">Keranjang Anda masih kosong. Silakan pilih minuman dari menu.</p>';
        totalAmountElement.textContent = 'Rp 0';
        return;
    }
    
    let cartHTML = '';
    let total = 0;
    
    cart.forEach(item => {
        const itemTotal = item.price * item.quantity;
        total += itemTotal;
        
        cartHTML += `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-details">
                    <h4 class="cart-item-name">${item.name}</h4>
                    <p class="cart-item-price">Rp ${formatPrice(item.price)}</p>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                        <span class="quantity-value">${item.quantity}</span>
                        <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                    </div>
                </div>
                <div class="cart-item-right">
                    <p class="cart-item-total">Rp ${formatPrice(itemTotal)}</p>
                    <button class="remove-btn" onclick="removeFromCart(${item.id})">🗑</button>
                </div>
            </div>
        `;
    });
    
    cartItemsContainer.innerHTML = cartHTML;
    totalAmountElement.textContent = `Rp ${formatPrice(total)}`;
}

// Save Cart to LocalStorage
function saveCart() {
    localStorage.setItem('drinkHubCart', JSON.stringify(cart));
}

// Load Cart from LocalStorage
function loadCart() {
    const savedCart = localStorage.getItem('drinkHubCart');
    if (savedCart) {
        cart = JSON.parse(savedCart);
        renderCart();
    }
}

// Setup Event Listeners
function setupEventListeners() {
    const orderForm = document.getElementById('orderForm');
    orderForm.addEventListener('submit', handleOrderSubmit);
}

// Handle Order Submit
function handleOrderSubmit(e) {
    e.preventDefault();
    
    if (cart.length === 0) {
        showToast('Keranjang kosong. Silakan tambahkan minuman ke pesanan Anda terlebih dahulu', true);
        return;
    }
    
    const name = document.getElementById('name').value;
    const phone = document.getElementById('phone').value;
    const address = document.getElementById('address').value;
    const notes = document.getElementById('notes').value;
    
    if (!name || !phone || !address) {
        showToast('Mohon lengkapi semua data pengiriman', true);
        return;
    }
    
    // Here you would typically send the order to a backend
    console.log('Order submitted:', {
        customer: { name, phone, address, notes },
        items: cart,
        total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0)
    });
    
    // Show success message
    showToast('Pesanan berhasil! Pesanan Anda sedang diproses. Terima kasih!');
    
    // Clear form and cart
    document.getElementById('orderForm').reset();
    cart = [];
    saveCart();
    renderCart();
}

// Scroll to Section
function scrollToSection(sectionId) {
    const section = document.getElementById(sectionId);
    if (section) {
        section.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
}

// Show Toast Notification
function showToast(message, isError = false) {
    const toast = document.getElementById('toast');
    toast.textContent = message;
    
    if (isError) {
        toast.style.backgroundColor = 'hsl(0, 84%, 60%)';
    } else {
        toast.style.backgroundColor = 'var(--color-foreground)';
    }
    
    toast.classList.add('show');
    
    setTimeout(() => {
        toast.classList.remove('show');
    }, 3000);
}

// Format Price
function formatPrice(price) {
    return price.toLocaleString('id-ID');
}