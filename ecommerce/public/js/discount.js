const DISCOUNT_PERCENT = 20;

function discountedPrice(price) {
  return Math.round(price * (1 - DISCOUNT_PERCENT / 100));
}

function formatPKR(amount) {
  return "PKR " + Number(amount).toLocaleString("en-PK");
}

function priceHTML(price) {
  return `<span class="old-price">${formatPKR(price)}</span>
          <span class="new-price">${formatPKR(discountedPrice(price))}</span>`;
}

function productCard(p) {
  const price = p.price ? priceHTML(p.price) : "<span>Price on request</span>";
  const badge = p.price ? `<span class="badge">-${DISCOUNT_PERCENT}%</span>` : "";
  return `
    <a class="product-card" href="/product.html?id=${p._id}">
      <div class="img-wrap">
        <img src="${p.image}" alt="${p.name}">
        ${badge}
      </div>
      <h3>${p.name}</h3>
      <p class="price">${price}</p>
    </a>
  `;
}