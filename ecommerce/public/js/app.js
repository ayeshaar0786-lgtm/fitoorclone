const grid = document.getElementById("product-grid");
const filterBar = document.getElementById("filter-bar");

let allProducts = [];

// Agar image file na mile to ye placeholder dikhega
const placeholder = (label) =>
  "data:image/svg+xml;charset=utf-8," +
  encodeURIComponent(
    `<svg xmlns="http://www.w3.org/2000/svg" width="400" height="500">
      <rect width="100%" height="100%" fill="#e9e3da"/>
      <text x="50%" y="50%" text-anchor="middle" fill="#8b5e3c" font-family="Georgia" font-size="22">${label}</text>
    </svg>`
  );

const formatPrice = (n) => `Rs ${n.toLocaleString("en-PK")}`;

// Image ko setup karta hai: fallback, aur mouse le jane par hover image
function setupImage(img, mainSrc, hoverSrc) {
  img.src = mainSrc;
  img.onerror = () => {
    img.onerror = null;
    img.src = placeholder(img.alt);
  };

  if (hoverSrc) {
    img.addEventListener("mouseenter", () => {
      img.src = hoverSrc;
    });
    img.addEventListener("mouseleave", () => {
      img.src = mainSrc;
    });
  }
}

function renderProducts(list) {
  if (list.length === 0) {
    grid.innerHTML = "<p>Is category mein abhi koi product nahi hai.</p>";
    return;
  }

  grid.innerHTML = list
    .map(
      (p) => `
      <a class="card" href="product.html?id=${p._id}">
        <div class="card-img">
          <img alt="${p.name}">
        </div>
        <div class="card-info">
          <h3>${p.name}</h3>
          <p class="meta">${p.category}</p>
          <p class="price">${formatPrice(p.price)}</p>
        </div>
      </a>`
    )
    .join("");

  // HTML render hone ke baad images ko set karein
  grid.querySelectorAll(".card").forEach((card, index) => {
    const p = list[index];
    setupImage(card.querySelector("img"), p.image, p.hoverImage);
  });
}

function buildFilters(products) {
  const categories = [...new Set(products.map((p) => p.category))];
  filterBar.innerHTML =
    `<button class="filter-btn active" data-category="all">All</button>` +
    categories
      .map((c) => `<button class="filter-btn" data-category="${c}">${c}</button>`)
      .join("");
}

filterBar.addEventListener("click", (e) => {
  const btn = e.target.closest(".filter-btn");
  if (!btn) return;

  filterBar.querySelectorAll(".filter-btn").forEach((b) => b.classList.remove("active"));
  btn.classList.add("active");

  const category = btn.dataset.category;
  const filtered =
    category === "all" ? allProducts : allProducts.filter((p) => p.category === category);
  renderProducts(filtered);
});

fetch("/api/products")
  .then((res) => res.json())
  .then((data) => {
    allProducts = data;
    buildFilters(data);
    renderProducts(data);
  })
  .catch(() => {
    grid.innerHTML = "<p>Products load nahi ho sake. Server check karein.</p>";
  });