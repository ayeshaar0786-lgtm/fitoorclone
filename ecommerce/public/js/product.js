cconst box = document.getElementById("product-detail");
const id = new URLSearchParams(window.location.search).get("id");

async function loadProduct() {
  try {
    const res = await fetch("/api/products");
    const data = await res.json();
    const list = Array.isArray(data) ? data : (data.products || []);
    const p = list.find((item) => item._id === id);

    if (!p) {
      box.innerHTML = "<p class='empty'>Product not found.</p>";
      return;
    }

    document.title = p.name + " | Fitoor";

    const specs = [
      ["Size", p.size],
      ["Weight", p.weight],
      ["Medium", p.medium],
      ["Frame", p.frame],
      ["Orientation", p.orientation],
      ["Dimension", p.dimension],
    ].filter(([, value]) => value);

    const price = p.price ? priceHTML(p.price) : "<span>Price on request</span>";
    const mockup = p.mockup ? `<img src="${p.mockup}" alt="${p.name} in a room">` : "";

    box.innerHTML = `
      <div class="detail-images">
        <img src="${p.image}" alt="${p.name}">
        ${mockup}
      </div>
      <div class="detail-info">
        <p class="crumb">${p.category}</p>
        <h1>${p.name}</h1>
        <p class="price">${price}</p>
        <p>${p.description || ""}</p>
        <ul class="specs">
          ${specs.map(([k, v]) => `<li><strong>${k}:</strong> ${v}</li>`).join("")}
        </ul>
        <button class="btn" onclick="alert('Cart feature coming soon')">Add to Cart</button>
      </div>
    `;
  } catch (err) {
    box.innerHTML = "<p class='empty'>Product could not load. Please check the server.</p>";
  }
}

loadProduct();