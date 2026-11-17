const products = [
  { id: 1, name: "Air Flex Runner", price: 89, image: "../../assets/img/photo-1.jpg", rating: { stars: 4.8, count: 127 },
    description: "Lightweight running sneakers designed for speed and comfort. Breathable mesh upper and a responsive, durable sole." },
  { id: 2, name: "Urban Street Pro", price: 99, image: "../../assets/img/photo-2.jpg", rating: { stars: 4.6, count: 98 },
    description: "A bold city sneaker with a cushioned midsole and a clean, modern silhouette built for all-day wear." },
  { id: 3, name: "Classic Court 80s", price: 79, image: "../../assets/img/photo-3.jpg", rating: { stars: 4.5, count: 210 },
    description: "Retro court style with a soft leather feel and a grippy rubber outsole. A true everyday classic." },
  { id: 4, name: "Milo Ridge", price: 119, image: "../../assets/img/photo-4.jpg", rating: { stars: 4.7, count: 64 },
    description: "Supportive and stable, the Milo Ridge pairs a structured heel with a flexible forefoot for long walks." },
  { id: 5, name: "Trail Flow", price: 129, image: "../../assets/img/photo-5.jpg", rating: { stars: 4.9, count: 83 },
    description: "Trail-ready traction and a protective toe cap keep you confident on rough, uneven terrain." },
  { id: 6, name: "Cloud Motion", price: 109, image: "../../assets/img/photo-6.jpg", rating: { stars: 4.4, count: 152 },
    description: "Ultra-soft foam cushioning that feels like walking on a cloud, wrapped in a breathable knit upper." },
  { id: 7, name: "Nova Runner", price: 139, image: "../../assets/img/photo-7.jpg", rating: { stars: 4.8, count: 71 },
    description: "Our performance racer: featherweight, energetic, and tuned for your fastest miles." },
  { id: 8, name: "Pulse Knit", price: 95, image: "../../assets/img/photo-8.jpg", rating: { stars: 4.3, count: 119 },
    description: "A sock-like knit fit that adapts to your foot, with a flexible sole for natural movement." },
  { id: 9, name: "Core Street Mode", price: 115, image: "../../assets/img/photo-9.jpg", rating: { stars: 4.5, count: 57 },
    description: "Streetwear-inspired design with durable materials and a stable platform sole." },
  { id: 10, name: "Everyday Lite", price: 75, image: "../../assets/img/photo-10.jpg", rating: { stars: 4.2, count: 189 },
    description: "Simple, light, and comfortable. The easy everyday pair that goes with everything." }
];

const CART_KEY = "bloomshop_cart";
const TAX_RATE = 0.08;

function getCart() {
  try {
    const cart = JSON.parse(localStorage.getItem(CART_KEY));
    return Array.isArray(cart) ? cart : [];
  } catch {
    return [];
  }
}

function saveCart(cart) {
  try {
    localStorage.setItem(CART_KEY, JSON.stringify(cart));
  } catch {}
  updateCartCount();
}

function addToCart(productId, amount = 1) {
  const cart = getCart();
  const existing = cart.find(item => item.id === productId);

  if (existing) {
    existing.quantity += amount;
  } else {
    cart.push({ id: productId, quantity: amount });
  }

  saveCart(cart);
}

function updateCartCount() {
  const count = getCart().reduce((total, item) => total + item.quantity, 0);

  document.querySelectorAll(".cart-count").forEach(element => {
    element.textContent = count;
  });
}

function formatPrice(price) {
  return "$" + Number(price).toFixed(2);
}

function getCartProducts() {
  return getCart()
    .map(item => {
      const product = products.find(p => p.id === item.id);
      return product ? { ...product, quantity: item.quantity } : null;
    })
    .filter(Boolean);
}

function getCartTotals() {
  const items = getCartProducts();
  const count = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);
  const tax = subtotal * TAX_RATE;
  return { items, count, subtotal, tax, total: subtotal + tax };
}

/* Small toast message shown at the bottom of the screen */
function showToast(text) {
  let toast = document.querySelector(".toast");
  if (!toast) {
    toast = document.createElement("div");
    toast.className = "toast";
    toast.setAttribute("role", "status");
    toast.style.cssText =
      "position:fixed;left:50%;bottom:28px;transform:translateX(-50%) translateY(20px);" +
      "background:#1f2328;color:#fff;padding:11px 20px;border-radius:999px;font:500 13px Inter,system-ui,sans-serif;" +
      "opacity:0;transition:.25s;z-index:999;pointer-events:none;box-shadow:0 6px 20px rgba(0,0,0,.25)";
    document.body.appendChild(toast);
  }
  toast.textContent = text;
  requestAnimationFrame(() => {
    toast.style.opacity = "1";
    toast.style.transform = "translateX(-50%) translateY(0)";
  });
  clearTimeout(showToast.timer);
  showToast.timer = setTimeout(() => {
    toast.style.opacity = "0";
    toast.style.transform = "translateX(-50%) translateY(20px)";
  }, 2200);
}

/* Navbar search on pages that have no product grid: go to the shop with ?search= */
function setupRedirectSearch(inputSelector, shopUrl) {
  const input = document.querySelector(inputSelector);
  if (!input) return;
  input.addEventListener("keydown", event => {
    if (event.key !== "Enter") return;
    event.preventDefault();
    const keyword = input.value.trim();
    window.location.href = keyword ? `${shopUrl}?search=${encodeURIComponent(keyword)}` : shopUrl;
  });
}

document.addEventListener("DOMContentLoaded", updateCartCount);
