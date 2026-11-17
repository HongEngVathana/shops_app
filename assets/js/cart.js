const cartItems = document.querySelector("#cartItems");
const itemCount = document.querySelector("#itemCount");
const subtotalLabel = document.querySelector("#subtotalLabel");
const subtotalElement = document.querySelector("#subtotal");
const taxElement = document.querySelector("#tax");
const totalElement = document.querySelector("#total");

function renderCart() {
  const cart = getCartProducts();

  const count = cart.reduce(
    (sum, item) => sum + item.quantity, 0
  );

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity, 0
  );

  const tax = subtotal * TAX_RATE;
  const total = subtotal + tax;

  itemCount.textContent = `${count} ${count === 1 ? "item" : "items"} in your cart`;
  subtotalLabel.textContent = `Subtotal (${count} ${count === 1 ? "item" : "items"})`;

  subtotalElement.textContent = formatPrice(subtotal);
  taxElement.textContent = formatPrice(tax);
  totalElement.textContent = formatPrice(total);

  updateCartCount();

  if (cart.length === 0) {
    cartItems.innerHTML = `
      <div class="empty">
        <i class="ri-shopping-cart-line"></i>
        <h3>Your cart is empty</h3>
        <p>Discover something you'll love!</p>
        <a href="../shop/index.html">Continue Shopping</a>
      </div>
    `;
    return;
  }

  cartItems.innerHTML = "";

  cart.forEach(product => {
    const row = document.createElement("div");
    row.className = "product";

    const image = document.createElement("img");
    image.className = "product-image";
    image.src = product.image;
    image.alt = product.name;

    image.onerror = () => {
      image.onerror = null;
      image.src = "https://placehold.co/200x200?text=Sneaker";
    };

    const info = document.createElement("div");
    info.className = "product-info";

    const name = document.createElement("div");
    name.className = "product-name";
    name.textContent = product.name;

    const price = document.createElement("div");
    price.className = "product-price";
    price.textContent = formatPrice(product.price) + " each";

    const quantity = document.createElement("div");
    quantity.className = "quantity";

    const minus = document.createElement("button");
    minus.type = "button";
    minus.innerHTML = '<i class="ri-subtract-line"></i>';

    const number = document.createElement("span");
    number.textContent = product.quantity;

    const plus = document.createElement("button");
    plus.type = "button";
    plus.innerHTML = '<i class="ri-add-line"></i>';

    minus.addEventListener("click", () => {
      changeQuantity(product.id, -1);
    });

    plus.addEventListener("click", () => {
      changeQuantity(product.id, 1);
    });

    quantity.append(minus, number, plus);
    info.append(name, price, quantity);

    const right = document.createElement("div");
    right.className = "product-right";

    const remove = document.createElement("button");
    remove.className = "remove";
    remove.type = "button";
    remove.innerHTML = '<i class="ri-delete-bin-line"></i>';
    remove.setAttribute("aria-label", "Remove " + product.name);

    remove.addEventListener("click", () => {
      removeProduct(product.id);
    });

    const productTotal = document.createElement("div");
    productTotal.className = "product-total";
    productTotal.textContent = formatPrice(
      product.price * product.quantity
    );

    right.append(remove, productTotal);
    row.append(image, info, right);

    cartItems.appendChild(row);
  });
}

function changeQuantity(id, amount) {
  const cart = getCart();
  const item = cart.find(product => product.id === id);

  if (!item) return;

  item.quantity += amount;

  const updatedCart = cart.filter(item => item.quantity > 0);

  saveCart(updatedCart);
  renderCart();
}

function removeProduct(id) {
  const cart = getCart().filter(item => item.id !== id);

  saveCart(cart);
  renderCart();
}

function clearCart() {
  if (!getCart().length) return;

  if (confirm("Are you sure you want to clear your cart?")) {
    saveCart([]);
    renderCart();
  }
}

function checkout() {
  if (!getCart().length) {
    showToast("Your cart is empty!");
    return;
  }
  window.location.href = "../checkout/index.html";
}

function subscribe(event) {
  event.preventDefault();
  showToast("Thank you for subscribing!");
  event.target.reset();
}

document.querySelector("#clearCart").addEventListener(
  "click", clearCart
);

document.querySelector("#checkout").addEventListener(
  "click", checkout
);

document.querySelector("#newsletter").addEventListener(
  "submit", subscribe
);

renderCart();
setupRedirectSearch("#navSearch", "../shop/index.html");