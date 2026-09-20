document.addEventListener("DOMContentLoaded", function () {
  // 1. Toggle Promo Box
  const btnPromo = document.getElementById("btn-promo");
  const promoBox = document.getElementById("promo-box");

  if (btnPromo && promoBox) {
    btnPromo.addEventListener("click", function () {
      promoBox.classList.toggle("hidden");
    });
  }

  // 2. Smooth Scroll untuk Link Kontak Navigasi
  const navKontakLinks = document.querySelectorAll(".nav-kontak");

  navKontakLinks.forEach((link) => {
    link.addEventListener("click", function (event) {
      const targetElement = document.getElementById("kontak");

      if (targetElement) {
        event.preventDefault();
        targetElement.scrollIntoView({
          behavior: "smooth"
        });
      }
    });
  });
});