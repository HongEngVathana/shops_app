const productImage = document.getElementById("productImage");
const productName = document.getElementById("productName");

const productPrice = document.getElementById("productPrice");
const productRating = document.getElementById("productRating");
const productDescription = document.getElementById("productDescription");

const quantityOutput = document.getElementById("quantity");
const message = document.getElementById("message");
const relatedProducts = document.getElementById("relatedProducts");
const wishlistButton = document.getElementById("wishlist");

const productList = typeof products !== "undefined" ? products : [];
const params = new URLSearchParams(window.location.search);
const productId = params.get("id");

const currentProduct =
  productList.find(product => String(product.id) === productId) ||
  productList[0];



let messageTimer;

function showMessage(text) {
  message.textContent = text;
  clearTimeout(messageTimer);
  messageTimer = setTimeout(() => (message.textContent = ""), 2500);
}

function placeholder(text) {
  return `https://placehold.co/400x400?text=${text}`;
}

function imgPath(path) {
  return path;
}



function displayProduct(product) {
  if (!product) {
    productName.textContent = "Product not found";
    showMessage("Please return to the shop.");
    return;
  }

  productImage.src = imgPath(product.image);
  productImage.alt = product.name;
  productImage.onerror = () => {
    productImage.onerror = null;
    productImage.src = placeholder("Sneaker");
  };

  productName.textContent = product.name;
  productPrice.textContent = formatPrice(product.price);

  productDescription.textContent =
    product.description ||
    "Lightweight running sneakers designed for speed and comfort. Breathable mesh and durable sole.";

  if (product.rating) {
    productRating.textContent =
      `(${product.rating.stars}) • ${product.rating.count} reviews`;
  }

  const filled = Math.round(product.rating ? product.rating.stars : 5);
  document.querySelector(".pd-stars").innerHTML =
    Array.from({ length: 5 }, (_, i) =>
      `<i class="${i < filled ? "ri-star-fill" : "ri-star-line"}"></i>`).join("");

  document.title = `BloomShop | ${product.name}`;
}


let imageIndex = 0;

function getImages(product) {
  return product.images && product.images.length? product.images: [product.image];
}

function showImage(index) {
  const images = getImages(currentProduct);
  imageIndex = (index + images.length) % images.length; 
  productImage.onerror = () => {
    productImage.onerror = null;
    productImage.src = placeholder("Sneaker");
  };
  productImage.src = imgPath(images[imageIndex]);
}

productImage.style.cursor = "pointer";
productImage.title = "Click to see next photo";

productImage.addEventListener("click", () => {
  if (!currentProduct) return;
  if (getImages(currentProduct).length < 2) return; 
  showImage(imageIndex + 1);
});



let quantity = 1;

document.getElementById("increase").addEventListener("click", () => {
  quantity++;
  quantityOutput.textContent = quantity;
});

document.getElementById("decrease").addEventListener("click", () => {
  if (quantity > 1) {
    quantity--;
    quantityOutput.textContent = quantity;
  }
});



document.getElementById("addToCart").addEventListener("click", () => {
  if (!currentProduct) return;

  addToCart(currentProduct.id, quantity);
  showMessage(`${quantity} x ${currentProduct.name} added to your cart!`);

  quantity = 1;
  quantityOutput.textContent = quantity;
});

document.getElementById("buyNow").addEventListener("click", () => {
  if (!currentProduct) return;

  addToCart(currentProduct.id, quantity);
  window.location.href = "../cart/index.html";
});



const WISHLIST_KEY = "bloomshop_wishlist";

function getWishlist() {
  try {
    return JSON.parse(localStorage.getItem(WISHLIST_KEY)) || [];
  } catch {
    return [];
  }
}

function isSaved() {
  return getWishlist().some(id => String(id) === String(currentProduct.id));
}

function updateWishlistButton() {
  if (!currentProduct) return;

  wishlistButton.innerHTML = isSaved()
    ? '<i class="ri-heart-fill"></i> Added to Wishlist'
    : '<i class="ri-heart-line"></i> Add to Wishlist';
}

wishlistButton.addEventListener("click", () => {
  if (!currentProduct) return;

  let wishlist = getWishlist();

  if (isSaved()) {
    wishlist = wishlist.filter(id => String(id) !== String(currentProduct.id));
    showMessage("Removed from your wishlist.");
  } else {
    wishlist.push(currentProduct.id);
    showMessage("Product saved to your wishlist!");
  }

  localStorage.setItem(WISHLIST_KEY, JSON.stringify(wishlist));
  updateWishlistButton();
});



document.getElementById("share").addEventListener("click", async () => {
  if (!currentProduct) return;

  try {
    if (navigator.share) {
      await navigator.share({
        title: `BloomShop | ${currentProduct.name}`,
        text: `Check out ${currentProduct.name} at BloomShop!`,
        url: window.location.href
      });
    } else {
      await navigator.clipboard.writeText(window.location.href);
      showMessage("Product link copied!");
    }
  } catch (error) {
    if (error.name !== "AbortError") {
      showMessage("Unable to share right now.");
    }
  }
});



function displayRelatedProducts() {
  relatedProducts.innerHTML = "";

  const related = productList
    .filter(product => String(product.id) !== String(currentProduct?.id))
    .slice(0, 4);

  related.forEach(product => {
    const card = document.createElement("a");
    card.className = "related-card";
    card.href = `index.html?id=${encodeURIComponent(product.id)}`;

    const imageWrap = document.createElement("div");
    imageWrap.className = "related-image-wrap";

    const image = document.createElement("img");
    image.className = "related-image";
    image.src = imgPath(product.image);
    image.alt = product.name;
    image.loading = "lazy";
    image.onerror = () => {
      image.onerror = null;
      image.src = placeholder("Sneaker");
    };

    const info = document.createElement("div");
    info.className = "related-info";

    const name = document.createElement("h3");
    name.className = "related-name";
    name.textContent = product.name;

    const price = document.createElement("p");
    price.className = "related-price";
    price.textContent = formatPrice(product.price);

    imageWrap.appendChild(image);
    info.append(name, price);
    card.append(imageWrap, info);
    relatedProducts.appendChild(card);
  });
}



document.getElementById("searchForm").addEventListener("submit", event => {
  event.preventDefault();

  const keyword = document.getElementById("searchInput").value.trim();
  if (!keyword) return;

  window.location.href =
    `../shop/index.html?search=${encodeURIComponent(keyword)}`;
});

document.getElementById("newsletter").addEventListener("submit", event => {
  event.preventDefault();
  showToast("Thank you for subscribing to BloomShop!");
  event.currentTarget.reset();
});



displayProduct(currentProduct);

if (currentProduct) {
  displayRelatedProducts();
  updateWishlistButton();
}

updateCartCount();