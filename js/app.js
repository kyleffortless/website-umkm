// Array of Objects Data Produk
const produkUmkm = [
  {
    nama: "Kopi Baeek",
    kategori: "Kopi",
    harga: 22000,
    stok: 12,
    unggulan: false,
    deskripsi: "Perpaduan arabica, creamer, dan karamel yang lembut dan manis."
  },
  {
    nama: "Koopa Signature",
    kategori: "Kopi",
    harga: 18000,
    stok: 5,
    unggulan: false,
    deskripsi: "Kopi khas Koopa dengan cita rasa kopi yang kuat dan nikmat."
  },
  {
    nama: "Kopi Susu Koopa",
    kategori: "Kopi",
    harga: 20000,
    stok: 0,
    unggulan: false,
    deskripsi: "Kopi dan susu creamy dengan rasa manis yang pas."
  },
  {
    nama: "Koopa Caramel",
    kategori: "Kopi",
    harga: 24000,
    stok: 8,
    unggulan: true,
    deskripsi: "Espresso mantap dengan sirup karamel manis legit dan susu gurih."
  }
];

// Function Contract: Format Rupiah
function formatRupiah(nilai) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(nilai);
}

// Function Contract: Status Stok
function statusStok(stok) {
  if (stok <= 0) {
    return { label: "Habis", classCss: "stok-habis" };
  } else if (stok <= 5) {
    return { label: `Stok Terbatas (${stok})`, classCss: "stok-terbatas" };
  } else {
    return { label: "Tersedia", classCss: "stok-tersedia" };
  }
}

// Function Contract: Buat HTML Kartu Produk
function buatKartuProduk(produk) {
  const infoStok = statusStok(produk.stok);
  const badgeUnggulan = produk.unggulan 
    ? `<span class="badge-unggulan">⭐ Baru!</span>` 
    : "";

  return `
    <div class="card-produk">
      <div class="card-header">
        <span class="kategori-tag">${produk.kategori}</span>
        ${badgeUnggulan}
      </div>
      <h3>${produk.nama}</h3>
      <p class="deskripsi">${produk.deskripsi}</p>
      <p class="harga"><strong>${formatRupiah(produk.harga)}</strong></p>
      <p class="status ${infoStok.classCss}">Status: ${infoStok.label}</p>
    </div>
  `;
}

// Function Utama: Render Produk ke DOM
function renderProduk() {
  const grid = document.querySelector("#produk-dinamis");
  const ringkasan = document.querySelector("#produk-ringkasan");
  const unggulan = document.querySelector("#produk-unggulan");

  // Guard Clause: Pastikan semua target DOM tersedia di halaman ini
  if (!grid || !ringkasan || !unggulan) {
    console.warn("Target render produk belum lengkap di halaman ini.");
    return;
  }

  // Array Method: filter() buat pilih produk yang stoknya > 0
  const produkTersedia = produkUmkm.filter((produk) => produk.stok > 0);

  // Array Method: map() & join() buat ubah array object menjadi markup HTML
  const markupProduk = produkTersedia.map(buatKartuProduk).join("");
  grid.innerHTML = markupProduk;

  // Array Method: find() -> nyari produk unggulan pertama
  const produkUnggulanItem = produkUmkm.find((produk) => produk.unggulan === true);

  // Render teks ringkasan dan produk unggulan
  ringkasan.textContent = `Menampilkan ${produkTersedia.length} dari ${produkUmkm.length} produk siap pesan.`;

  if (produkUnggulanItem) {
    unggulan.innerHTML = `<strong>Produk Unggulan Minggu Ini:</strong> ${produkUnggulanItem.nama} - ${formatRupiah(produkUnggulanItem.harga)}`;
  } else {
    unggulan.textContent = "Belum ada produk unggulan minggu ini.";
  }

  // Array Method: forEach() & console.table() -> Debugging Console
  console.log("=== DATA KATALOG PRODUK KOOPA KOPI (P10) ===");
  console.table(produkUmkm);

  console.log("Daftar produk terdaftar:");
  produkUmkm.forEach((p) => console.log(`- ${p.nama} (Stok: ${p.stok})`));
}

// Jalankan saat DOM siap
document.addEventListener("DOMContentLoaded", renderProduk);