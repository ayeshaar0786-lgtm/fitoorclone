const grid = document.getElementById("product-grid");
const title = document.getElementById("shop-title");
const category = new URLSearchParams(window.location.search).get("category");

async function loadProducts() {
  try {
    const res = await fetch("/api/products");
    const data = await res.json();
    const list = Array.isArray(data) ? data : (data.products || []);
    const items = category ? list.filter((p) => p.category === category) : list;

    title.textContent = category || "Shop";
    grid.innerHTML = items.length
      ? items.map(productCard).join("")
      : "<p class='empty'>No products in this category yet.</p>";
  } catch (err) {
    grid.innerHTML = "<p class='empty'>Products could not load. Please check the server.</p>";
  }
}

loadProducts();