// Data produk UMKM
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

function formatRupiah(nilai) {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    maximumFractionDigits: 0
  }).format(nilai);
}

function statusStok(stok) {
  if (stok <= 0) {
    return { label: "Habis", classCss: "stok-habis" };
  } else if (stok <= 5) {
    return { label: `Stok Terbatas (${stok})`, classCss: "stok-terbatas" };
  } else {
    return { label: "Tersedia", classCss: "stok-tersedia" };
  }
}

// Bikin elemen kartu produk pakai DOM API
function buatElemenProduk(produk) {
  const card = document.createElement("div");
  card.className = "card-produk";

  const cardHeader = document.createElement("div");
  cardHeader.className = "card-header";

  const tagKategori = document.createElement("span");
  tagKategori.className = "kategori-tag";
  tagKategori.textContent = produk.kategori;
  cardHeader.append(tagKategori);

  if (produk.unggulan) {
    const badge = document.createElement("span");
    badge.className = "badge-unggulan";
    badge.textContent = "⭐ Baru!";
    cardHeader.append(badge);
  }

  const title = document.createElement("h3");
  title.textContent = produk.nama;

  const desc = document.createElement("p");
  desc.className = "deskripsi";
  desc.textContent = produk.deskripsi;

  const price = document.createElement("p");
  price.className = "harga";
  const priceStrong = document.createElement("strong");
  priceStrong.textContent = formatRupiah(produk.harga);
  price.append(priceStrong);

  const infoStok = statusStok(produk.stok);
  const status = document.createElement("p");
  status.className = `status ${infoStok.classCss}`;
  status.textContent = `Status: ${infoStok.label}`;

  card.append(cardHeader, title, desc, price, status);
  return card;
}

// Bikin tampilan kalau kategori kosong
function buatEmptyState(kategori) {
  const emptyDiv = document.createElement("div");
  emptyDiv.className = "empty-state";

  const emptyTitle = document.createElement("h3");
  emptyTitle.textContent = `Produk Kategori "${kategori}" Belum Tersedia`;

  const emptyDesc = document.createElement("p");
  emptyDesc.textContent = "Silakan pilih kategori produk lain yang tersedia.";

  emptyDiv.append(emptyTitle, emptyDesc);
  return emptyDiv;
}

// Render produk ke halaman sesuai filter
function renderProduk(kategoriAktif = "semua") {
  const grid = document.querySelector("#produk-dinamis");
  const ringkasan = document.querySelector("#produk-ringkasan");
  const unggulan = document.querySelector("#produk-unggulan");

  if (!grid || !ringkasan || !unggulan) return;

  const produkTersedia = produkUmkm.filter((produk) => produk.stok > 0);

  const hasilFilter = kategoriAktif === "semua"
    ? produkTersedia
    : produkTersedia.filter((produk) => produk.kategori.toLowerCase() === kategoriAktif.toLowerCase());

  // Bersihkan isi grid lama biar gak numpuk
  grid.replaceChildren();

  if (hasilFilter.length === 0) {
    grid.append(buatEmptyState(kategoriAktif));
  } else {
    hasilFilter.forEach((produk) => {
      grid.append(buatElemenProduk(produk));
    });
  }

  ringkasan.textContent = `Menampilkan ${hasilFilter.length} dari ${produkUmkm.length} produk siap pesan (Filter: ${kategoriAktif}).`;

  const produkUnggulanItem = produkUmkm.find((produk) => produk.unggulan === true);
  if (produkUnggulanItem) {
    unggulan.innerHTML = `<strong>Produk Unggulan Minggu Ini:</strong> ${produkUnggulanItem.nama} - ${formatRupiah(produkUnggulanItem.harga)}`;
  } else {
    unggulan.textContent = "Belum ada produk unggulan minggu ini.";
  }
}

// Pasang event click di semua tombol filter
function inisialisasiFilter() {
  const filterButtons = document.querySelectorAll("[data-filter]");
  if (filterButtons.length === 0) return;

  filterButtons.forEach((btn) => {
    btn.addEventListener("click", (e) => {
      filterButtons.forEach((b) => b.classList.remove("is-active"));
      e.currentTarget.classList.add("is-active");

      const kategori = e.currentTarget.dataset.filter;
      renderProduk(kategori);
    });
  });
}

document.addEventListener("DOMContentLoaded", () => {
  renderProduk("semua");
  inisialisasiFilter();
});