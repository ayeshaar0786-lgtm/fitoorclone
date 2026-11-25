(() => {
  const productBox = document.getElementById("product-detail");
  if (!productBox) return;

  const productId = new URLSearchParams(window.location.search).get("id");
  const CART_KEY = "fitoorCart";
  const DEFAULT_PRICE = 20000;
  const DISCOUNT_RATE = 0.2;

  function escapeHTML(value = "") {
    return String(value).replace(/[&<>"']/g, (character) => ({
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    })[character]);
  }

  function formatPrice(amount) {
    return `PKR ${Number(amount).toLocaleString("en-PK")}`;
  }

  function getCart() {
    try {
      const cart = JSON.parse(localStorage.getItem(CART_KEY) || "[]");
      return Array.isArray(cart) ? cart : [];
    } catch {
      return [];
    }
  }

  function updateCartCount() {
    const count = getCart().reduce(
      (total, item) => total + (Number(item.quantity) || 0),
      0
    );

    document.querySelectorAll("[data-cart-count]").forEach((element) => {
      element.textContent = count;
    });
  }

  function addToCart(product) {
    const id = String(product._id || product.id || "");
    if (!id) throw new Error("This product has no ID.");

    const cart = getCart();
    const originalPrice = Number(product.price) || DEFAULT_PRICE;
    const salePrice = Math.round(originalPrice * (1 - DISCOUNT_RATE));
    const existingItem = cart.find((item) => String(item.id) === id);

    if (existingItem) {
      existingItem.quantity = (Number(existingItem.quantity) || 0) + 1;
    } else {
      cart.push({
        id,
        name: product.name || "Artwork",
        image: product.image || "",
        originalPrice,
        price: salePrice,
        quantity: 1
      });
    }

    localStorage.setItem(CART_KEY, JSON.stringify(cart));
    updateCartCount();

    const message = document.getElementById("cart-message");
    if (message) message.textContent = `${product.name || "Artwork"} added to your cart.`;
  }

  function renderProduct(product) {
    const name = escapeHTML(product.name || "Artwork");
    const category = escapeHTML(product.category || "Artwork");
    const description = escapeHTML(product.description || "");
    const image = escapeHTML(product.image || "/images/logo.png");
    const originalPrice = Number(product.price) || DEFAULT_PRICE;
    const salePrice = Math.round(originalPrice * (1 - DISCOUNT_RATE));

    const specifications = [
      ["Size", product.size],
      ["Weight", product.weight],
      ["Medium", product.medium],
      ["Frame", product.frame],
      ["Orientation", product.orientation],
      ["Dimension", product.dimension]
    ].filter(([, value]) => value);

    const specsHTML = specifications
      .map(([label, value]) =>
        `<li><strong>${escapeHTML(label)}:</strong> ${escapeHTML(value)}</li>`
      )
      .join("");

    const mockupHTML = product.mockup
      ? `<img src="${escapeHTML(product.mockup)}" alt="${name} displayed in a room">`
      : "";

    document.title = `${product.name || "Artwork"} | Fitoor`;

    productBox.innerHTML = `
      <div class="detail-images">
        <img src="${image}" alt="${name}">
        ${mockupHTML}
      </div>

      <div class="detail-info">
        <p class="crumb">${category}</p>
        <h1>${name}</h1>
        <p class="price">
          <span class="old-price">${formatPrice(originalPrice)}</span>
          <span class="new-price">${formatPrice(salePrice)}</span>
          <span class="discount-label">20% OFF</span>
        </p>
        <p>${description}</p>
        ${specsHTML ? `<ul class="specs">${specsHTML}</ul>` : ""}

        <button class="btn" id="add-to-cart" type="button">Add to Cart</button>
        <p id="cart-message" class="cart-message" role="status" aria-live="polite"></p>
      </div>
    `;

    document.getElementById("add-to-cart").addEventListener("click", () => {
      try {
        addToCart(product);
      } catch (error) {
        console.error("Add to Cart error:", error);
        document.getElementById("cart-message").textContent =
          "Could not add this product. Please try again.";
      }
    });

    updateCartCount();
  }

  async function loadProduct() {
    updateCartCount();

    if (!productId) {
      productBox.innerHTML =
        "<p class='empty'>Product ID is missing from the page URL.</p>";
      return;
    }

    try {
      const response = await fetch(
        `/api/products/${encodeURIComponent(productId)}`
      );
      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || `Request failed (${response.status})`);
      }

      renderProduct(data.product || data);
    } catch (error) {
      console.error("Product page error:", error);
      productBox.innerHTML =
        "<p class='empty'>Could not load this product. Check the server and product link.</p>";
    }
  }

  loadProduct();
})();