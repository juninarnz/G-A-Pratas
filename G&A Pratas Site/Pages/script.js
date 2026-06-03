let cart = [];

const whatsapp = "+5545991361859"; 

function addToCart(name, price) {
  const item = cart.find(produto => produto.name === name);

  if (item) {
    item.quantity++;
  } else {
    cart.push({
      name: name,
      price: price,
      quantity: 1
    });
  }

  updateCart();
}

function removeFromCart(name) {
  cart = cart.filter(produto => produto.name !== name);
  updateCart();
}

function updateCart() {
  const cartItems = document.getElementById("cartItems");
  const cartTotal = document.getElementById("cartTotal");
  const floatingCartCount = document.getElementById("floatingCartCount");

  let total = 0;
  let quantidadeTotal = 0;

  cart.forEach(item => {
    total += item.price * item.quantity;
    quantidadeTotal += item.quantity;
  });

  if (floatingCartCount) {
    floatingCartCount.textContent = quantidadeTotal;
  }

  if (cart.length === 0) {
    cartItems.innerHTML = "Nenhum item adicionado.";
    cartTotal.innerHTML = "R$ 0,00";
    return;
  }

  cartItems.innerHTML = cart.map(item => {
    return `
      <div class="cart-line">
        <span>${item.quantity}x ${item.name}</span>
        <strong>R$ ${(item.price * item.quantity).toFixed(2).replace(".", ",")}</strong>
        <button onclick="removeFromCart('${item.name}')">X</button>
      </div>
    `;
  }).join("");

  cartTotal.innerHTML = `R$ ${total.toFixed(2).replace(".", ",")}`;
}

function checkout() {
  if (cart.length === 0) {
    alert("Adicione pelo menos uma joia ao pedido.");
    return;
  }

  let message = "Olá! Quero fazer este pedido:%0A%0A";
  let total = 0;

  cart.forEach(item => {
    const subtotal = item.price * item.quantity;
    total += subtotal;

    message += `• ${item.quantity}x ${item.name} - R$ ${subtotal.toFixed(2).replace(".", ",")}%0A`;
  });

  message += `%0ATotal: R$ ${total.toFixed(2).replace(".", ",")}`;
  message += `%0A%0AGostaria de finalizar a compra.`;

  window.open(`https://wa.me/${whatsapp}?text=${message}`, "_blank");
}