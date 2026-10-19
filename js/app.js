// Array of Objects Data Produk
const daftarProduk = [
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

// Helper Format Rupiah
const formatRupiah = (angka) => {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(angka);
};

// Conditional Status Stok
function getStatusStok(stok) {
  if (stok === 0) {
    return { teks: "Habis", kelas: "stok-habis" };
  } else if (stok <= 5) {
    return { teks: `Stok Terbatas (${stok})`, kelas: "stok-terbatas" };
  } else {
    return { teks: "Tersedia", kelas: "stok-tersedia" };
  }
}

// Fungsi Render Produk ke DOM
function renderProdukDinamis() {
  // Guard Clause untuk mengecek keberadaan target DOM
  const targetContainer = document.querySelector("#produk-dinamis");
  if (!targetContainer) return;

  // Tampilkan data di Console DevTools untuk bukti debugging
  console.log("=== DATA KATALOG PRODUK KOOPA KOPI ===");
  console.table(daftarProduk);

  let htmlContent = "";

  daftarProduk.forEach((produk) => {
    const status = getStatusStok(produk.stok);
    
    // Conditional Badge produk unggulan
    const badgeUnggulan = produk.unggulan 
      ? `<span class="badge-unggulan">⭐ Baru!</span>` 
      : "";

    htmlContent += `
      <div class="card-produk">
        <div class="card-header">
          <span class="kategori-tag">${produk.kategori}</span>
          ${badgeUnggulan}
        </div>
        <h3>${produk.nama}</h3>
        <p class="deskripsi">${produk.deskripsi}</p>
        <p class="harga"><strong>${formatRupiah(produk.harga)}</strong></p>
        <p class="status ${status.kelas}">Status: ${status.teks}</p>
      </div>
    `;
  });

  targetContainer.innerHTML = htmlContent;
}

// Jalankan fungsi render saat DOM selesai dimuat
document.addEventListener("DOMContentLoaded", renderProdukDinamis);