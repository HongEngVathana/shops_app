const productGrid = document.querySelector("#productGrid");
const searchInput = document.querySelector("#searchInput");
const suggestions = document.querySelector("#searchSuggestions");
const clearSearch = document.querySelector("#clearSearch");
const resultCount = document.querySelector("#resultCount");
const emptyState = document.querySelector("#emptyState");
const resetSearch = document.querySelector("#resetSearch");
const sortSelect = document.querySelector("#sortSelect");

function displayProducts(list) {
  productGrid.innerHTML = "";

  resultCount.textContent = `Showing ${list.length} ${list.length === 1 ? "product" : "products"}`;

  emptyState.hidden = list.length !== 0;

  list.forEach(product => {
    const card = document.createElement("article");
    card.className = "product-card";
    const link = `../product/index.html?id=${product.id}`;

    const image = document.createElement("img");
    image.className = "product-image";
    image.src = product.image;
    image.alt = product.name;
    image.loading = "lazy";

    image.onerror = () => {
      image.onerror = null;
      image.src = "https://placehold.co/400x400?text=Sneaker";
    };

    const imageLink = document.createElement("a");
    imageLink.href = link;
    imageLink.appendChild(image);

    const info = document.createElement("div");
    info.className = "product-info";

    const name = document.createElement("h2");
    name.className = "product-name";

    const nameLink = document.createElement("a");
    nameLink.href = link;
    nameLink.textContent = product.name;
    nameLink.style.color = "inherit";
    nameLink.style.textDecoration = "none";
    name.appendChild(nameLink);

    const rating = document.createElement("p");
    rating.className = "product-rating";
    if (product.rating) {
      rating.innerHTML = `<i class="ri-star-fill"></i> ${product.rating.stars} <span>(${product.rating.count})</span>`;
    }

    const price = document.createElement("p");
    price.className = "product-price";
    price.textContent = formatPrice(product.price);

    const button = document.createElement("button");
    button.className = "add-button";
    button.textContent = "+ Add to Cart";

    button.addEventListener("click", () => {
      addToCart(product.id);
      showToast(`${product.name} added to cart`);

      button.textContent = "✓ Added";
      button.classList.add("added");

      setTimeout(() => {
        button.textContent = "+ Add to Cart";
        button.classList.remove("added");
      }, 1000);
    });

    info.append(name, rating, price, button);
    card.append(imageLink, info);
    productGrid.appendChild(card);
  });
}

function sortList(list) {
  const sorted = [...list];
  switch (sortSelect.value) {
    case "price-asc": sorted.sort((a, b) => a.price - b.price); break;
    case "price-desc": sorted.sort((a, b) => b.price - a.price); break;
    case "rating": sorted.sort((a, b) => b.rating.stars - a.rating.stars); break;
    case "name": sorted.sort((a, b) => a.name.localeCompare(b.name)); break;
  }
  return sorted;
}

function searchProducts() {
  const keyword = searchInput.value.trim().toLowerCase();

  const filtered = products.filter(product =>
    product.name.toLowerCase().includes(keyword)
  );

  displayProducts(sortList(filtered));

  clearSearch.classList.toggle("visible", keyword.length > 0);

  showSuggestions(keyword, filtered);
}

function showSuggestions(keyword, matches) {
  suggestions.innerHTML = "";

  if (!keyword) {
    suggestions.classList.remove("open");
    return;
  }

  const results = matches.slice(0, 5);

  if (results.length === 0) {
    const message = document.createElement("div");
    message.className = "no-suggestion";
    message.textContent = "No products found";
    suggestions.appendChild(message);
  } else {
    results.forEach(product => {
      const button = document.createElement("button");
      button.className = "suggestion";
      button.type = "button";
      button.textContent = product.name;

      button.addEventListener("click", () => {
        searchInput.value = product.name;
        searchProducts();
        suggestions.classList.remove("open");
      });

      suggestions.appendChild(button);
    });
  }

  suggestions.classList.add("open");
}

searchInput.addEventListener("input", searchProducts);

sortSelect.addEventListener("change", () => {
  displayProducts(sortList(products.filter(product =>
    product.name.toLowerCase().includes(searchInput.value.trim().toLowerCase())
  )));
});

const newsletterForm = document.querySelector("#newsletter");
if (newsletterForm) {
  newsletterForm.addEventListener("submit", event => {
    event.preventDefault();
    showToast("Thank you for subscribing!");
    event.target.reset();
  });
}

clearSearch.addEventListener("click", () => {
  searchInput.value = "";
  searchProducts();
  searchInput.focus();
});

resetSearch.addEventListener("click", () => {
  searchInput.value = "";
  searchProducts();
});

searchInput.addEventListener("keydown", event => {
  if (event.key === "Escape") {
    suggestions.classList.remove("open");
  }
});

document.addEventListener("click", event => {
  if (!event.target.closest(".search-wrap")) {
    suggestions.classList.remove("open");
  }
});

const urlSearch = new URLSearchParams(window.location.search).get("search");

if (urlSearch) {
  searchInput.value = urlSearch;
  searchProducts();
  suggestions.classList.remove("open");
} else {
  displayProducts(products);
}