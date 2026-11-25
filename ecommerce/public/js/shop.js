(() => {
  const grid = document.getElementById("product-grid");
  const filterBar = document.getElementById("filter-bar");
  const title = document.getElementById("shop-title");

  if (!grid) {
    console.error('Shop page is missing an element with id="product-grid".');
    return;
  }

  const CART_KEY = "fitoorCart";
  const DISCOUNT_RATE = 0.2;
  const categoryFromUrl = new URLSearchParams(location.search).get("category");
  let allProducts = [];

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
    return `PKR ${Number(amount || 0).toLocaleString("en-PK")}`;
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
    if (!id) {
      console.error("Cannot add product without an ID:", product);
      return;
    }

    const cart = getCart();
    const originalPrice = Number(product.price) || 20000;
    const salePrice = Math.round(originalPrice * (1 - DISCOUNT_RATE));
    const existing = cart.find((item) => String(item.id) === id);

    if (existing) {
      existing.quantity = (Number(existing.quantity) || 0) + 1;
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
  }

  function renderCard(product) {
    const id = String(product._id || product.id || "");
    const name = escapeHTML(product.name || "Artwork");
    const category = escapeHTML(product.category || "");
    const image = escapeHTML(product.image || "/images/logo.png");
    const originalPrice = Number(product.price) || 20000;
    const salePrice = Math.round(originalPrice * (1 - DISCOUNT_RATE));

    return `
      <article class="product-card">
        <a href="/product.html?id=${encodeURIComponent(id)}">
          <div class="img-wrap">
            <img src="${image}" alt="${name}" loading="lazy">
            <span class="badge">20% OFF</span>
          </div>
          <h3>${name}</h3>
          ${category ? `<p class="meta">${category}</p>` : ""}
        </a>

        <p class="price">
          <span class="old-price">${formatPrice(originalPrice)}</span>
          <span class="new-price">${formatPrice(salePrice)}</span>
        </p>

        <button
          class="btn add-to-cart"
          type="button"
          data-id="${escapeHTML(id)}"
          ${id ? "" : "disabled"}
        >
          Add to Cart
        </button>
        <p class="cart-message" role="status" aria-live="polite"></p>
      </article>
    `;
  }

  function renderProducts(products) {
    if (!products.length) {
      grid.innerHTML = "<p class='empty'>No products found in this category.</p>";
      return;
    }

    grid.innerHTML = products.map(renderCard).join("");

    grid.querySelectorAll(".add-to-cart").forEach((button) => {
      button.addEventListener("click", () => {
        const product = products.find(
          (item) => String(item._id || item.id) === button.dataset.id
        );

        if (!product) return;

        addToCart(product);
        const message = button
          .closest(".product-card")
          .querySelector(".cart-message");

        if (message) {
          message.textContent = `${product.name || "Artwork"} added to your cart.`;
        }
      });
    });
  }

  function renderFilters(products) {
    if (!filterBar) return;

    const categories = [...new Set(
      products.map((product) => product.category).filter(Boolean)
    )];

    filterBar.innerHTML = [
      `<button class="filter-btn" type="button" data-category="all">All</button>`,
      ...categories.map((category) =>
        `<button class="filter-btn" type="button" data-category="${escapeHTML(category)}">${escapeHTML(category)}</button>`
      )
    ].join("");

    filterBar.addEventListener("click", (event) => {
      const button = event.target.closest(".filter-btn");
      if (!button) return;

      filterBar.querySelectorAll(".filter-btn").forEach((item) => {
        item.classList.toggle("active", item === button);
      });

      const selected = button.dataset.category;
      const filtered = selected === "all"
        ? allProducts
        : allProducts.filter((product) => product.category === selected);

      if (title) title.textContent = selected === "all" ? "Shop" : selected;
      renderProducts(filtered);
    });

    const initialButton = [...filterBar.querySelectorAll(".filter-btn")]
      .find((button) => button.dataset.category === (categoryFromUrl || "all"));

    if (initialButton) initialButton.classList.add("active");
  }

  async function loadProducts() {
    updateCartCount();

    grid.innerHTML = "<p class='empty'>Loading products…</p>";
    if (title) title.textContent = categoryFromUrl || "Shop";

    try {
      const response = await fetch("/api/products");
      if (!response.ok) {
        throw new Error(`Products request failed (${response.status})`);
      }

      const data = await response.json();
      allProducts = Array.isArray(data) ? data : data.products || [];

      renderFilters(allProducts);

      const filtered = categoryFromUrl
        ? allProducts.filter(
            (product) => product.category === categoryFromUrl
          )
        : allProducts;

      renderProducts(filtered);
    } catch (error) {
      console.error("Shop page error:", error);
      grid.innerHTML =
        "<p class='empty'>Products could not load. Check that the server is running and /api/products is available.</p>";
    }
  }

  loadProducts();
})();