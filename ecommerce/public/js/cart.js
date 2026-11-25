const CART_KEY = "fitoorCart";
const cartItems = document.getElementById("cart-items");
const cartSummary = document.getElementById("cart-summary");

function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  localStorage.setItem(CART_KEY, JSON.stringify(cart));
}

function formatPKR(amount) {
  return "PKR " + Number(amount).toLocaleString("en-PK");
}

function renderCart() {
  const cart = getCart();
  const count = cart.reduce((total, item) => total + item.quantity, 0);

  document.querySelectorAll("[data-cart-count]").forEach((element) => {
    element.textContent = count;
  });

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <p class="empty">Your cart is empty.</p>
      <p class="center"><a class="btn" href="/shop.html">Continue Shopping</a></p>
    `;
    cartSummary.innerHTML = "";
    return;
  }

  cartItems.innerHTML = cart.map((item) => `
    <article class="cart-item">
      <img src="${item.image || "/images/logo.png"}" alt="${item.name}">
      <div>
        <h2>${item.name}</h2>
        <p>Price: ${formatPKR(item.price)} each</p>
        <p>Original price: <s>${formatPKR(item.originalPrice)}</s></p>
        <label>
          Quantity
          <input
            class="cart-quantity"
            type="number"
            min="1"
            value="${item.quantity}"
            data-id="${item.id}"
          >
        </label>
        <button class="cart-remove" type="button" data-id="${item.id}">
          Remove
        </button>
      </div>
      <strong>${formatPKR(item.price * item.quantity)}</strong>
    </article>
  `).join("");

  const total = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  cartSummary.innerHTML = `
    <h2>Total: ${formatPKR(total)}</h2>
    <p>Shipping and payment can be added as the next checkout step.</p>
    <button class="btn" id="clear-cart" type="button">Clear Cart</button>
  `;

  cartItems.querySelectorAll(".cart-quantity").forEach((input) => {
    input.addEventListener("change", () => {
      const updatedCart = getCart();
      const item = updatedCart.find((entry) => entry.id === input.dataset.id);

      if (item) item.quantity = Math.max(1, Number(input.value) || 1);

      saveCart(updatedCart);
      renderCart();
    });
  });

  cartItems.querySelectorAll(".cart-remove").forEach((button) => {
    button.addEventListener("click", () => {
      const updatedCart = getCart().filter((item) => item.id !== button.dataset.id);
      saveCart(updatedCart);
      renderCart();
    });
  });

  document.getElementById("clear-cart").addEventListener("click", () => {
    saveCart([]);
    renderCart();
  });
}

renderCart();