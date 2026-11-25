const DISCOUNT_PERCENT = 20;
const SAMPLE_PRICE = 20000;

function discountedPrice(price) {
  return Math.round(Number(price) * (1 - DISCOUNT_PERCENT / 100));
}

function formatPKR(amount) {
  return "PKR " + Number(amount).toLocaleString("en-PK");
}

function priceHTML(price) {
  const originalPrice = Number(price) || SAMPLE_PRICE;
  const salePrice = discountedPrice(originalPrice);

  return `
    <span class="old-price">${formatPKR(originalPrice)}</span>
    <span class="new-price">${formatPKR(salePrice)}</span>
  `;
}

function productCard(product) {
  const originalPrice = Number(product.price) || SAMPLE_PRICE;

  return `
    <a class="product-card" href="/product.html?id=${product._id}">
      <div class="img-wrap">
        <img src="${product.image || "/images/logo.png"}" alt="${product.name}">
        <span class="badge">-${DISCOUNT_PERCENT}%</span>
      </div>
      <h3>${product.name}</h3>
      <p class="price">${priceHTML(originalPrice)}</p>
    </a>
  `;
}