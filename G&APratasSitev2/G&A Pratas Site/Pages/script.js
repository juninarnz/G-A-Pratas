const whatsapp = '5545991361859';
let cart = JSON.parse(localStorage.getItem('gaCart') || '[]');

const money = value => Number(value).toLocaleString('pt-BR', {
  style: 'currency',
  currency: 'BRL'
});

function saveCart() {
  localStorage.setItem('gaCart', JSON.stringify(cart));
}

function addToCart(name, price) {
  const numericPrice = Number(price);
  const item = cart.find(i => i.name === name);

  if (item) {
    item.quantity += 1;
  } else {
    cart.push({ name, price: numericPrice, quantity: 1 });
  }

  saveCart();
  updateCart();
  openCart();
}

function changeQuantity(index, delta) {
  const item = cart[index];
  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    cart.splice(index, 1);
  }

  saveCart();
  updateCart();
}

function removeFromCart(index) {
  if (index < 0 || index >= cart.length) return;
  cart.splice(index, 1);
  saveCart();
  updateCart();
}

function updateCart() {
  const box = document.getElementById('cartItems');
  const totalEl = document.getElementById('cartTotal');
  const count = document.getElementById('floatingCartCount');

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const quantity = cart.reduce((sum, item) => sum + item.quantity, 0);

  if (count) count.textContent = quantity;
  if (!box || !totalEl) return;

  if (!cart.length) {
    box.innerHTML = '<p class="empty-cart">Seu carrinho está vazio.</p>';
    totalEl.textContent = money(0);
    return;
  }

  box.innerHTML = cart.map((item, index) => `
    <div class="cart-line">
      <div class="cart-product-info">
        <strong>${escapeHtml(item.name)}</strong>
        <small>${money(item.price)} cada</small>
      </div>

      <div class="qty" aria-label="Quantidade de ${escapeHtml(item.name)}">
        <button type="button" class="qty-btn" data-cart-action="minus" data-cart-index="${index}" aria-label="Diminuir quantidade">−</button>
        <span>${item.quantity}</span>
        <button type="button" class="qty-btn" data-cart-action="plus" data-cart-index="${index}" aria-label="Aumentar quantidade">+</button>
      </div>

      <strong class="cart-line-total">${money(item.price * item.quantity)}</strong>

      <button type="button" class="remove" data-cart-action="remove" data-cart-index="${index}" aria-label="Remover ${escapeHtml(item.name)}">×</button>
    </div>
  `).join('');

  totalEl.textContent = money(total);
}

function escapeHtml(value) {
  return String(value)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#039;');
}

function openCart() {
  document.getElementById('cartDrawer')?.classList.add('open');
  document.body.classList.add('no-scroll');
}

function closeCart() {
  document.getElementById('cartDrawer')?.classList.remove('open');
  document.body.classList.remove('no-scroll');
}

function checkout() {
  if (!cart.length) {
    alert('Adicione pelo menos uma joia ao pedido.');
    return;
  }

  let msg = 'Olá! Quero fazer este pedido:\n\n';
  cart.forEach(item => {
    msg += `• ${item.quantity}x ${item.name} — ${money(item.price * item.quantity)}\n`;
  });

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
  msg += `\nTotal: ${money(total)}\n\nGostaria de finalizar a compra.`;

  window.open(`https://wa.me/${whatsapp}?text=${encodeURIComponent(msg)}`, '_blank');
}

function filterProducts() {
  const q = (document.getElementById('productSearch')?.value || '').toLowerCase().trim();
  const cat = document.getElementById('categoryFilter')?.value || 'all';

  document.querySelectorAll('.product').forEach(product => {
    const text = product.innerText.toLowerCase();
    const category = product.dataset.category || 'all';
    const matchText = !q || text.includes(q);
    const matchCategory = cat === 'all' || category === cat;
    product.style.display = matchText && matchCategory ? '' : 'none';
  });
}

function sortProducts() {
  const mode = document.getElementById('sortProducts')?.value;
  const grid = document.getElementById('products');
  if (!mode || !grid) return;

  const products = [...grid.querySelectorAll('.product')];

  products.sort((a, b) => {
    const pa = Number(a.dataset.price || 0);
    const pb = Number(b.dataset.price || 0);

    if (mode === 'asc') return pa - pb;
    if (mode === 'desc') return pb - pa;
    return 0;
  });

  products.forEach(product => grid.appendChild(product));
  filterProducts();
}

document.addEventListener('DOMContentLoaded', () => {
  updateCart();

  document.getElementById('productSearch')?.addEventListener('input', filterProducts);
  document.getElementById('categoryFilter')?.addEventListener('change', filterProducts);
  document.getElementById('sortProducts')?.addEventListener('change', sortProducts);

  // Carrinho: usa delegação de eventos para os botões criados dinamicamente.
  document.getElementById('cartItems')?.addEventListener('click', event => {
    const button = event.target.closest('[data-cart-action]');
    if (!button) return;

    const index = Number(button.dataset.cartIndex);
    const action = button.dataset.cartAction;

    if (action === 'minus') changeQuantity(index, -1);
    if (action === 'plus') changeQuantity(index, 1);
    if (action === 'remove') removeFromCart(index);
  });

  document.querySelector('.menu-btn')?.addEventListener('click', () => {
    document.querySelector('.nav')?.classList.toggle('active');
  });
});
