const ORDERS_KEY = "bloomshop_orders";

const checkoutView = document.querySelector("#checkoutView");
const successView = document.querySelector("#successView");
const emptyView = document.querySelector("#emptyView");
const form = document.querySelector("#checkoutForm");
const formError = document.querySelector("#formError");

function renderSummary() {
  const { items, count, subtotal, tax, total } = getCartTotals();

  document.querySelector("#subtotalLabel").textContent =
    `Subtotal (${count} ${count === 1 ? "item" : "items"})`;
  document.querySelector("#subtotal").textContent = formatPrice(subtotal);
  document.querySelector("#tax").textContent = formatPrice(tax);
  document.querySelector("#total").textContent = formatPrice(total);

  const list = document.querySelector("#orderItems");
  list.innerHTML = "";

  items.forEach(item => {
    const row = document.createElement("div");
    row.className = "order-line";

    const img = document.createElement("img");
    img.src = item.image;
    img.alt = item.name;
    img.onerror = () => { img.onerror = null; img.src = "https://placehold.co/100x100?text=Shoe"; };

    const info = document.createElement("div");
    info.className = "grow";
    const name = document.createElement("div");
    name.textContent = item.name;
    const qty = document.createElement("small");
    qty.textContent = `Qty ${item.quantity}`;
    info.append(name, qty);

    const price = document.createElement("strong");
    price.textContent = formatPrice(item.price * item.quantity);

    row.append(img, info, price);
    list.appendChild(row);
  });

  return count;
}

function luhnValid(number) {
  let sum = 0, alt = false;
  for (let i = number.length - 1; i >= 0; i--) {
    let n = Number(number[i]);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function validate() {
  const value = id => document.querySelector("#" + id).value.trim();
  const bad = [];

  if (value("fullName").length < 2) bad.push("fullName");
  if (!/^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(value("email"))) bad.push("email");
  if (value("address").length < 4) bad.push("address");
  if (value("city").length < 2) bad.push("city");
  if (value("zip").length < 3) bad.push("zip");
  if (value("cardName").length < 2) bad.push("cardName");

  const card = value("cardNumber").replace(/\s+/g, "");
  if (!/^\d{13,19}$/.test(card) || !luhnValid(card)) bad.push("cardNumber");

  const exp = value("expiry").match(/^(\d{2})\s*\/\s*(\d{2})$/);
  let expOk = false;
  if (exp) {
    const month = Number(exp[1]);
    const year = 2000 + Number(exp[2]);
    const endOfMonth = new Date(year, month, 1);
    expOk = month >= 1 && month <= 12 && endOfMonth > new Date();
  }
  if (!expOk) bad.push("expiry");

  if (!/^\d{3,4}$/.test(value("cvc"))) bad.push("cvc");

  form.querySelectorAll("input").forEach(input =>
    input.classList.toggle("invalid", bad.includes(input.id)));

  return bad;
}

form.addEventListener("submit", event => {
  event.preventDefault();

  const bad = validate();
  if (bad.length) {
    formError.textContent = "Please check the highlighted fields.";
    document.querySelector("#" + bad[0]).focus();
    return;
  }
  formError.textContent = "";

  const totals = getCartTotals();
  const orderNumber = "BS-" + Date.now().toString(36).toUpperCase();
  const email = document.querySelector("#email").value.trim();

  try {
    const orders = JSON.parse(localStorage.getItem(ORDERS_KEY)) || [];
    orders.push({
      orderNumber,
      date: new Date().toISOString(),
      items: totals.items.map(i => ({ id: i.id, name: i.name, price: i.price, quantity: i.quantity })),
      total: totals.total
    });
    localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
  } catch {}

  saveCart([]);

  document.querySelector("#orderNumber").textContent = orderNumber;
  document.querySelector("#orderEmail").textContent = email;
  checkoutView.hidden = true;
  successView.hidden = false;
  window.scrollTo({ top: 0, behavior: "smooth" });
});

document.querySelector("#cardNumber").addEventListener("input", event => {
  const digits = event.target.value.replace(/\D/g, "").slice(0, 19);
  event.target.value = digits.replace(/(.{4})/g, "$1 ").trim();
});

document.querySelector("#expiry").addEventListener("input", event => {
  let v = event.target.value.replace(/\D/g, "").slice(0, 4);
  if (v.length > 2) v = v.slice(0, 2) + "/" + v.slice(2);
  event.target.value = v;
});

document.querySelector("#newsletter").addEventListener("submit", event => {
  event.preventDefault();
  showToast("Thank you for subscribing!");
  event.target.reset();
});

setupRedirectSearch(".search-wrap input", "../shop/index.html");

if (renderSummary() === 0) {
  checkoutView.hidden = true;
  emptyView.hidden = false;
}
