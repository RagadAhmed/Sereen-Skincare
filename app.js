const products = [
  {
    id: "glow-serum",
    name: "Glow Serum",
    category: "Hydrating Facial Serum",
    description: "A radiant daily serum for supple hydration and a polished glow.",
    price: 48,
    image: "assets/images/serum-product.jpg"
  },
  {
    id: "velvet-cleanser",
    name: "Velvet Cleanser",
    category: "Gentle Cleanser",
    description: "A soft cleansing ritual that refreshes without stripping comfort.",
    price: 34,
    image: "assets/images/serum-lifestyle.jpg"
  },
  {
    id: "restore-cream",
    name: "Restore Cream",
    category: "Barrier Support Cream",
    description: "A plush moisturizer to support softness and a healthy-looking barrier.",
    price: 56,
    image: "assets/images/brand-gradient.jpg"
  },
  {
    id: "dew-mist",
    name: "Dew Mist",
    category: "Hydrating Mist",
    description: "A fine mist for mid-day radiance and a fresh, dewy finish.",
    price: 30,
    image: "assets/images/serum-editorial.jpg"
  },
  {
    id: "silk-balm",
    name: "Silk Barrier Balm",
    category: "Nourishing Balm",
    description: "A silky final layer for dry areas, glow points, and overnight comfort.",
    price: 42,
    image: "assets/images/brand-gradient.jpg"
  }
];

const currency = new Intl.NumberFormat("en-US", {
  style: "currency",
  currency: "USD",
  maximumFractionDigits: 0
});

const state = {
  cart: JSON.parse(localStorage.getItem("sereen-cart") || "{}")
};

const productGrid = document.querySelector("[data-products]");
const productTemplate = document.querySelector("#product-card-template");
const cartDrawer = document.querySelector("[data-cart-drawer]");
const cartItems = document.querySelector("[data-cart-items]");
const cartEmpty = document.querySelector("[data-cart-empty]");
const cartCount = document.querySelector("[data-cart-count]");
const cartSubtotal = document.querySelector("[data-cart-subtotal]");
const header = document.querySelector("[data-header]");

function saveCart() {
  localStorage.setItem("sereen-cart", JSON.stringify(state.cart));
}

function getCartEntries() {
  return Object.entries(state.cart)
    .map(([id, quantity]) => {
      const product = products.find((item) => item.id === id);
      return product ? { ...product, quantity } : null;
    })
    .filter(Boolean);
}

function renderProducts() {
  products.forEach((product) => {
    const card = productTemplate.content.cloneNode(true);
    const img = card.querySelector("img");
    img.src = product.image;
    img.alt = product.name;
    card.querySelector(".product-category").textContent = product.category;
    card.querySelector("h3").textContent = product.name;
    card.querySelector(".product-description").textContent = product.description;
    card.querySelector(".product-price").textContent = currency.format(product.price);
    card.querySelector(".add-button").addEventListener("click", () => addToCart(product.id));
    productGrid.append(card);
  });
}

function addToCart(productId) {
  state.cart[productId] = (state.cart[productId] || 0) + 1;
  saveCart();
  renderCart();
  openCart();
}

function updateQuantity(productId, amount) {
  const nextQuantity = (state.cart[productId] || 0) + amount;
  if (nextQuantity <= 0) {
    delete state.cart[productId];
  } else {
    state.cart[productId] = nextQuantity;
  }
  saveCart();
  renderCart();
}

function renderCart() {
  const entries = getCartEntries();
  cartItems.innerHTML = "";

  entries.forEach((item) => {
    const row = document.createElement("article");
    row.className = "cart-item";
    row.innerHTML = `
      <img src="${item.image}" alt="${item.name}">
      <div>
        <h3>${item.name}</h3>
        <p>${currency.format(item.price)} each</p>
      </div>
      <div class="quantity-controls" aria-label="Quantity for ${item.name}">
        <button type="button" aria-label="Remove one ${item.name}" data-minus>-</button>
        <span>${item.quantity}</span>
        <button type="button" aria-label="Add one ${item.name}" data-plus>+</button>
      </div>
    `;
    row.querySelector("[data-minus]").addEventListener("click", () => updateQuantity(item.id, -1));
    row.querySelector("[data-plus]").addEventListener("click", () => updateQuantity(item.id, 1));
    cartItems.append(row);
  });

  const count = entries.reduce((sum, item) => sum + item.quantity, 0);
  const subtotal = entries.reduce((sum, item) => sum + item.quantity * item.price, 0);
  cartCount.textContent = count;
  cartSubtotal.textContent = currency.format(subtotal);
  cartEmpty.classList.toggle("is-visible", entries.length === 0);
}

function openCart() {
  cartDrawer.classList.add("is-open");
  cartDrawer.setAttribute("aria-hidden", "false");
  document.body.style.overflow = "hidden";
}

function closeCart() {
  cartDrawer.classList.remove("is-open");
  cartDrawer.setAttribute("aria-hidden", "true");
  document.body.style.overflow = "";
}

function handleHeader() {
  header.classList.toggle("is-scrolled", window.scrollY > 28);
}

document.querySelector("[data-cart-open]").addEventListener("click", openCart);
document.querySelector("[data-cart-close]").addEventListener("click", closeCart);
document.querySelector("[data-checkout]").addEventListener("click", () => {
  closeCart();
  document.querySelector("#contact").scrollIntoView({ behavior: "smooth" });
});

cartDrawer.addEventListener("click", (event) => {
  if (event.target === cartDrawer) closeCart();
});

document.addEventListener("keydown", (event) => {
  if (event.key === "Escape") closeCart();
});

window.addEventListener("scroll", handleHeader, { passive: true });

renderProducts();
renderCart();
handleHeader();
