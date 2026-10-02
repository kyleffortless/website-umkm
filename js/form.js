
document.addEventListener("DOMContentLoaded", function () {
  const form = document.getElementById("contact-form");
  const previewBox = document.getElementById("preview-box");

  if (form) {
    form.addEventListener("submit", function (event) {
      // 1. TAHAN RELOAD HALAMAN / MENCEGAH METHOD GET VIA URL
      event.preventDefault();
      event.stopPropagation();

      // 2. CEK VALIDASI FORMULIR
      if (!form.checkValidity()) {
        form.reportValidity();
        return false;
      }

      // 3. AMBIL DATA FORM
      const nama = document.getElementById("nama").value;
      const email = document.getElementById("email").value;
      const whatsapp = document.getElementById("whatsapp").value;
      const paket = document.getElementById("paket").value;

      const topikSelected = document.querySelector('input[name="topik"]:checked');
      const topik = topikSelected ? topikSelected.value : "-";

      const waktuSelected = document.querySelector('input[name="waktu"]:checked');
      const waktu = waktuSelected ? waktuSelected.value : "-";

      const pesan = document.getElementById("pesan").value;

      // 4. MASUKKAN DATA KE PREVIEW
      document.getElementById("prev-nama").textContent = nama;
      document.getElementById("prev-email").textContent = email;
      document.getElementById("prev-whatsapp").textContent = whatsapp;
      document.getElementById("prev-paket").textContent = paket;
      document.getElementById("prev-topik").textContent = topik;
      document.getElementById("prev-waktu").textContent = waktu;
      document.getElementById("prev-pesan").textContent = pesan;

      // 5. TAMPILKAN BOX PREVIEW TANPA RELOAD
      previewBox.classList.remove("hidden");
      previewBox.scrollIntoView({ behavior: "smooth" });

      return false;
    });
  }
});