# BloomShop

Static sneaker shop built with HTML, CSS and vanilla JavaScript. No build step.

## Run it
Open `index.html`, or serve the folder:

    python3 -m http.server 8000      # then visit http://localhost:8000

## Page routes

| Route                              | Page            | Notes                                   |
|------------------------------------|-----------------|-----------------------------------------|
| `/index.html`                      | Redirect        | Sends you to the shop                   |
| `/pages/shop/index.html`           | Shop (home)     | `?search=keyword` pre-fills the search  |
| `/pages/product/index.html?id=N`   | Product detail  | `N` is 1–10                             |
| `/pages/cart/index.html`           | Cart            |                                         |
| `/pages/checkout/index.html`       | Checkout        | Needs items in the cart                 |
| `/pages/contact/index.html`        | Contact         |                                         |
| `/404.html`                        | Not found       | Used by the web server for missing URLs |

## Structure

    bloom-shop/
    ├── index.html
    ├── 404.html
    ├── README.md
    ├── pages/
    │   ├── shop/index.html
    │   ├── product/index.html
    │   ├── cart/index.html
    │   ├── checkout/index.html
    │   └── contact/index.html
    └── assets/
        ├── css/   shop.css  product.css  cart.css  checkout.css  contact.css
        ├── js/    products.js (shared data + cart helpers)
        │          shop.js  product.js  cart.js  checkout.js  contact.js
        └── img/   photo-1.jpg … photo-10.jpg

## Local storage keys
- `bloomshop_cart` – cart items
- `bloomshop_wishlist` – saved products
- `bloomshop_orders` – placed orders
