const contactForm = document.querySelector("#contactForm");
const formStatus = document.querySelector("#formStatus");
const newsletterForm = document.querySelector("#newsletterForm");
const newsletterStatus = document.querySelector("#newsletterStatus");

if (contactForm) {
  contactForm.addEventListener("submit", event => {
    event.preventDefault();

    const name = document.querySelector("#name").value.trim();
    formStatus.className = "mt-3 text-success";
    formStatus.textContent = `Thanks ${name}! Your message has been sent. We'll reply within 24 hours.`;
    contactForm.reset();
  });
}

if (newsletterForm) {
  newsletterForm.addEventListener("submit", event => {
    event.preventDefault();
    newsletterStatus.textContent = "Thank you for subscribing!";
    newsletterForm.reset();
  });
}

const searchForm = document.querySelector(".search-form");
if (searchForm) {
  searchForm.addEventListener("submit", event => {
    event.preventDefault();
    const keyword = searchForm.querySelector("input").value.trim();
    window.location.href = keyword
      ? `../shop/index.html?search=${encodeURIComponent(keyword)}`
      : "../shop/index.html";
  });
}
