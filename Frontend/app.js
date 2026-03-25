const API = window.API_URL || 'http://localhost:5000/api';
let cart = JSON.parse(localStorage.getItem('shopcon_cart') || '[]');
let token = localStorage.getItem('shopcon_token');
let user = JSON.parse(localStorage.getItem('shopcon_user') || 'null');

// ─── Page Navigation ───────────────────────────────────────────────────────
function showPage(page) {
  document.querySelectorAll('.page').forEach(p => p.classList.remove('active'));
  document.getElementById(page + 'Page').classList.add('active');

  if (page === 'products') loadProducts();
  if (page === 'cart') renderCart();
  if (page === 'orders') loadOrders();
}

// ─── Auth UI ───────────────────────────────────────────────────────────────
function updateAuthUI() {
  if (user) {
    document.getElementById('authBtn').style.display = 'none';
    document.getElementById('logoutBtn').style.display = 'inline-block';
    document.getElementById('userName').style.display = 'inline-block';
    document.getElementById('userName').textContent = '👤 ' + user.name;
    document.getElementById('ordersLink').style.display = 'inline';
  } else {
    document.getElementById('authBtn').style.display = 'inline-block';
    document.getElementById('logoutBtn').style.display = 'none';
    document.getElementById('userName').style.display = 'none';
    document.getElementById('ordersLink').style.display = 'none';
  }
  updateCartCount();
}

// ─── Register ──────────────────────────────────────────────────────────────
async function register() {
  const name = document.getElementById('regName').value.trim();
  const email = document.getElementById('regEmail').value.trim();
  const password = document.getElementById('regPassword').value;
  const msg = document.getElementById('regMsg');

  if (!name || !email || !password) {
    msg.textContent = 'Please fill all fields.';
    msg.className = 'msg error';
    return;
  }

  try {
    const res = await fetch(`${API}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, password })
    });
    const data = await res.json();
    if (!res.ok) { msg.textContent = data.message; msg.className = 'msg error'; return; }

    token = data.token;
    user = data.user;
    localStorage.setItem('shopcon_token', token);
    localStorage.setItem('shopcon_user', JSON.stringify(user));
    msg.textContent = '✅ Registered successfully!';
    msg.className = 'msg success';
    setTimeout(() => { updateAuthUI(); showPage('products'); }, 800);
  } catch (e) {
    msg.textContent = 'Server error. Is backend running?';
    msg.className = 'msg error';
  }
}

// ─── Login ─────────────────────────────────────────────────────────────────
async function login() {
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;
  const msg = document.getElementById('loginMsg');

  try {
    const res = await fetch(`${API}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) { msg.textContent = data.message; msg.className = 'msg error'; return; }

    token = data.token;
    user = data.user;
    localStorage.setItem('shopcon_token', token);
    localStorage.setItem('shopcon_user', JSON.stringify(user));
    msg.textContent = '✅ Login successful!';
    msg.className = 'msg success';
    setTimeout(() => { updateAuthUI(); showPage('products'); }, 800);
  } catch (e) {
    msg.textContent = 'Server error. Is backend running?';
    msg.className = 'msg error';
  }
}

// ─── Logout ────────────────────────────────────────────────────────────────
function logout() {
  token = null; user = null;
  localStorage.removeItem('shopcon_token');
  localStorage.removeItem('shopcon_user');
  updateAuthUI();
  showPage('home');
}

// ─── Products ──────────────────────────────────────────────────────────────
async function loadProducts(category = null) {
  if (category) {
    document.getElementById('categoryFilter').value = category;
    showPage('products');
    return;
  }
  const search = document.getElementById('searchInput')?.value || '';
  const cat = document.getElementById('categoryFilter')?.value || 'All';

  let url = `${API}/products?search=${search}&category=${cat}`;
  try {
    const res = await fetch(url);
    let products = await res.json();
    if (!products.length && !search && cat === 'All') {
      // Auto-seed if no products
      await fetch(`${API}/products/seed`, { method: 'POST' });
      const res2 = await fetch(url);
      products = await res2.json();
    }
    renderProducts(products);
  } catch (e) {
    document.getElementById('productsGrid').innerHTML =
      '<p style="color:#ff6b6b">❌ Cannot connect to backend. Make sure server is running!</p>';
  }
}

function renderProducts(products) {
  const grid = document.getElementById('productsGrid');
  if (!products.length) { grid.innerHTML = '<p style="color:var(--muted)">No products found.</p>'; return; }
  grid.innerHTML = products.map(p => `
    <div class="product-card">
      <img src="${p.image}" alt="${p.name}" onerror="this.src='https://via.placeholder.com/300x180/1e1e1e/888?text=No+Image'"/>
      <div class="product-info">
        <h3>${p.name}</h3>
        <div class="product-price">₹${p.price.toLocaleString()}</div>
        <div class="product-rating">${'⭐'.repeat(p.rating)} (${p.rating}.0)</div>
        <p style="color:var(--muted);font-size:0.82rem;margin-bottom:12px">${p.description}</p>
        <button class="add-cart-btn" onclick="addToCart('${p._id}', '${p.name}', ${p.price}, '${p.image}')">
          + Add to Cart
        </button>
      </div>
    </div>
  `).join('');
}

function filterCategory(cat) {
  showPage('products');
  setTimeout(() => {
    document.getElementById('categoryFilter').value = cat;
    loadProducts();
  }, 50);
}

function searchProducts() { loadProducts(); }

// ─── Cart ──────────────────────────────────────────────────────────────────
function addToCart(id, name, price, image) {
  const existing = cart.find(i => i.id === id);
  if (existing) {
    existing.qty += 1;
  } else {
    cart.push({ id, name, price, image, qty: 1 });
  }
  saveCart();
  updateCartCount();
  showFlash(`✅ "${name}" added to cart!`);
}

function saveCart() {
  localStorage.setItem('shopcon_cart', JSON.stringify(cart));
}

function updateCartCount() {
  const total = cart.reduce((s, i) => s + i.qty, 0);
  document.getElementById('cartCount').textContent = total;
}

function renderCart() {
  const el = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  const checkoutBtn = document.getElementById('checkoutBtn');

  if (!cart.length) {
    el.innerHTML = '<p style="color:var(--muted);text-align:center;padding:40px">Your cart is empty. <a href="#" onclick="showPage(\'products\')" style="color:var(--accent)">Shop now →</a></p>';
    totalEl.innerHTML = '';
    checkoutBtn.style.display = 'none';
    return;
  }

  el.innerHTML = cart.map((item, idx) => `
    <div class="cart-item">
      <div style="display:flex;align-items:center;gap:14px">
        <img src="${item.image}" style="width:60px;height:60px;object-fit:cover;border-radius:10px" onerror="this.style.display='none'"/>
        <div class="cart-item-info">
          <h4>${item.name}</h4>
          <p>₹${item.price.toLocaleString()} each</p>
        </div>
      </div>
      <div class="cart-item-controls">
        <button class="qty-btn" onclick="changeQty(${idx}, -1)">−</button>
        <span style="font-weight:600;min-width:20px;text-align:center">${item.qty}</span>
        <button class="qty-btn" onclick="changeQty(${idx}, 1)">+</button>
        <span style="color:var(--accent);font-weight:700;min-width:70px;text-align:right">₹${(item.price * item.qty).toLocaleString()}</span>
        <button class="remove-btn" onclick="removeItem(${idx})">Remove</button>
      </div>
    </div>
  `).join('');

  const total = cart.reduce((s, i) => s + i.price * i.qty, 0);
  totalEl.innerHTML = `Total: <span>₹${total.toLocaleString()}</span>`;
  checkoutBtn.style.display = 'block';
}

function changeQty(idx, delta) {
  cart[idx].qty += delta;
  if (cart[idx].qty <= 0) cart.splice(idx, 1);
  saveCart(); updateCartCount(); renderCart();
}

function removeItem(idx) {
  cart.splice(idx, 1);
  saveCart(); updateCartCount(); renderCart();
}

// ─── Checkout ──────────────────────────────────────────────────────────────
async function checkout() {
  if (!token) {
    alert('Please login to place an order!');
    showPage('login');
    return;
  }
  const totalAmount = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const items = cart.map(i => ({ name: i.name, price: i.price, quantity: i.qty }));

  try {
    const res = await fetch(`${API}/orders`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Authorization': 'Bearer ' + token },
      body: JSON.stringify({ items, totalAmount })
    });
    const data = await res.json();
    if (!res.ok) { alert(data.message); return; }

    cart = [];
    saveCart(); updateCartCount();
    alert('🎉 Order placed successfully!');
    showPage('orders');
  } catch (e) {
    alert('Server error. Is backend running?');
  }
}

// ─── Orders ────────────────────────────────────────────────────────────────
async function loadOrders() {
  if (!token) {
    document.getElementById('ordersList').innerHTML =
      '<p style="color:var(--muted);text-align:center;padding:40px">Please <a href="#" onclick="showPage(\'login\')" style="color:var(--accent)">login</a> to view orders.</p>';
    return;
  }
  try {
    const res = await fetch(`${API}/orders/myorders`, {
      headers: { 'Authorization': 'Bearer ' + token }
    });
    const orders = await res.json();
    const el = document.getElementById('ordersList');
    if (!orders.length) { el.innerHTML = '<p style="color:var(--muted);text-align:center;padding:40px">No orders yet.</p>'; return; }
    el.innerHTML = orders.map(o => `
      <div class="order-card">
        <h4>Order #${o._id.slice(-6).toUpperCase()}</h4>
        <p style="color:var(--muted);margin-bottom:8px">📅 ${new Date(o.createdAt).toLocaleDateString('en-IN', { day:'numeric', month:'short', year:'numeric' })}</p>
        <p style="margin-bottom:8px">${o.items.map(i => `${i.name} × ${i.quantity}`).join(', ')}</p>
        <p style="color:var(--accent);font-weight:700;margin-bottom:8px">₹${o.totalAmount.toLocaleString()}</p>
        <span class="order-status">${o.status}</span>
      </div>
    `).join('');
  } catch (e) {
    document.getElementById('ordersList').innerHTML = '<p style="color:#ff6b6b">Server error.</p>';
  }
}

// ─── Flash Message ─────────────────────────────────────────────────────────
function showFlash(msg) {
  const el = document.createElement('div');
  el.textContent = msg;
  el.style.cssText = `
    position:fixed; bottom:24px; right:24px;
    background:#22c55e; color:#fff;
    padding:12px 24px; border-radius:50px;
    font-weight:600; font-size:0.9rem;
    z-index:9999; animation: fadeIn 0.3s ease;
    box-shadow: 0 4px 20px rgba(34,197,94,0.3);
  `;
  document.body.appendChild(el);
  setTimeout(() => el.remove(), 2500);
}

// ─── Modals ────────────────────────────────────────────────────────────────
function openModal(id) { document.getElementById(id).classList.add('active'); }
function closeModal(id) { document.getElementById(id).classList.remove('active'); }

// ─── Camera ────────────────────────────────────────────────────────────────
async function openCamera() {
  openModal('cameraModal');
  const video = document.getElementById('video');
  try {
    const stream = await navigator.mediaDevices.getUserMedia({ video: true });
    video.srcObject = stream;
  } catch (e) {
    alert('Camera access denied or not available.');
    closeModal('cameraModal');
  }
}

function captureImage() {
  const video = document.getElementById('video');
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');
  canvas.width = video.videoWidth;
  canvas.height = video.videoHeight;
  ctx.drawImage(video, 0, 0);
  canvas.toBlob(async (blob) => {
    const formData = new FormData();
    formData.append('image', blob, 'capture.jpg');
    try {
      const res = await fetch(`${API}/products/search-image`, { method: 'POST', body: formData });
      const data = await res.json();
      if (!res.ok) { alert(data.message); return; }
      alert(`AI Description: ${data.description}`);
      renderProducts(data.products);
      showPage('products');
    } catch (e) {
      alert('Image search failed.');
    }
    closeModal('cameraModal');
    video.srcObject.getTracks().forEach(track => track.stop());
  });
}

// ─── Chat ───────────────────────────────────────────────────────────────────
function openChat() {
  openModal('chatModal');
  document.getElementById('chatMessages').innerHTML = '<p>Hi! How can I help you with shopping?</p>';
}

async function sendMessage() {
  const input = document.getElementById('chatInput');
  const msg = input.value.trim();
  if (!msg) return;
  const messages = document.getElementById('chatMessages');
  messages.innerHTML += `<p><strong>You:</strong> ${msg}</p>`;
  input.value = '';
  try {
    const res = await fetch(`${API}/ai/chat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ message: msg })
    });
    const data = await res.json();
    if (!res.ok) {
      messages.innerHTML += `<p><strong>AI:</strong> ${data.message || 'Error'}</p>`;
      return;
    }
    messages.innerHTML += `<p><strong>AI:</strong> ${data.reply}</p>`;
    messages.scrollTop = messages.scrollHeight;
  } catch (e) {
    messages.innerHTML += `<p><strong>AI:</strong> Sorry, I'm having trouble connecting.</p>`;
  }
}

// ─── Add Product ────────────────────────────────────────────────────────────
function openAddProduct() {
  openModal('addProductModal');
}

async function addProduct() {
  const name = document.getElementById('prodName').value.trim();
  const description = document.getElementById('prodDesc').value.trim();
  const price = parseFloat(document.getElementById('prodPrice').value);
  const category = document.getElementById('prodCategory').value;
  const image = document.getElementById('prodImage').value.trim();

  if (!name || !description || !price || !category || !image) {
    alert('Please fill all fields.');
    return;
  }

  try {
    const res = await fetch(`${API}/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, description, price, category, image })
    });
    const data = await res.json();
    if (!res.ok) { alert(data.message); return; }
    alert('Product added!');
    closeModal('addProductModal');
    loadProducts(); // Refresh
  } catch (e) {
    alert('Failed to add product.');
  }
}

// ─── Init ──────────────────────────────────────────────────────────────────
updateAuthUI();
showPage('home');
