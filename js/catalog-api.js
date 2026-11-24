const DATA_URL = "data/products.json";

const catalogStatus = document.querySelector("#catalog-status");
const produkGrid = document.querySelector("#produk-dinamis");
const produkRingkasan = document.querySelector("#produk-ringkasan");
const produkUnggulan = document.querySelector("#produk-unggulan");
const tombolFilter = document.querySelectorAll("[data-filter]");

let products = [];
let activeCategory = "Semua";

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
  }
  if (stok <= 5) {
    return { label: `Stok Terbatas (${stok})`, classCss: "stok-terbatas" };
  }
  return { label: "Tersedia", classCss: "stok-tersedia" };
}

function setStatus(state, message) {
  if (!catalogStatus) return;
  catalogStatus.className = "catalog-status";
  if (state) {
    catalogStatus.classList.add(state);
  }
  catalogStatus.textContent = message;
}

function createProductCard(product) {
  const card = document.createElement("div");
  card.className = "card-produk";

  const cardHeader = document.createElement("div");
  cardHeader.className = "card-header";

  const tagKategori = document.createElement("span");
  tagKategori.className = "kategori-tag";
  tagKategori.textContent = product.category;
  cardHeader.append(tagKategori);

  if (product.featured) {
    const badge = document.createElement("span");
    badge.className = "badge-unggulan";
    badge.textContent = "⭐ Unggulan";
    cardHeader.append(badge);
  }

  const title = document.createElement("h3");
  title.textContent = product.name;

  const desc = document.createElement("p");
  desc.className = "deskripsi";
  desc.textContent = product.description;

  const price = document.createElement("p");
  price.className = "harga";
  const priceStrong = document.createElement("strong");
  priceStrong.textContent = formatRupiah(product.price);
  price.append(priceStrong);

  const infoStok = statusStok(product.stock);
  const status = document.createElement("p");
  status.className = `status ${infoStok.classCss}`;
  status.textContent = `Status: ${infoStok.label}`;

  card.append(cardHeader, title, desc, price, status);
  return card;
}

function createEmptyState(category) {
  const emptyDiv = document.createElement("div");
  emptyDiv.className = "empty-state";

  const emptyTitle = document.createElement("h3");
  emptyTitle.textContent = `Produk Kategori "${category}" Belum Tersedia`;

  const emptyDesc = document.createElement("p");
  emptyDesc.textContent = "Silakan pilih kategori menu lain yang tersedia.";

  emptyDiv.append(emptyTitle, emptyDesc);
  return emptyDiv;
}

function renderFeaturedProduct(items) {
  if (!produkUnggulan) return;
  const unggulan = items.find((item) => item.featured === true);

  if (unggulan) {
    produkUnggulan.innerHTML = `<strong>Produk Unggulan Minggu Ini:</strong> ${unggulan.name} - ${formatRupiah(unggulan.price)}`;
  } else {
    produkUnggulan.textContent = "Belum ada produk unggulan minggu ini.";
  }
}

function renderProducts(items) {
  if (!produkGrid || !produkRingkasan) return;

  produkGrid.replaceChildren();

  if (items.length === 0) {
    produkGrid.append(createEmptyState(activeCategory));
    produkRingkasan.textContent = `0 produk ditemukan (Filter: ${activeCategory}).`;
    setStatus("empty", "Request berhasil, tetapi tidak ada produk pada kategori ini.");
    return;
  }

  items.forEach((product) => {
    produkGrid.append(createProductCard(product));
  });

  produkRingkasan.textContent = `Menampilkan ${items.length} dari ${products.length} produk (Filter: ${activeCategory}).`;
  setStatus("success", `${items.length} produk berhasil dimuat.`);
}

function applyFilter(category) {
  activeCategory = category;

  const filtered =
    category.toLowerCase() === "semua"
      ? products
      : products.filter((product) => product.category.toLowerCase() === category.toLowerCase());

  renderProducts(filtered);
}

function initFilter() {
  tombolFilter.forEach((button) => {
    button.addEventListener("click", (event) => {
      tombolFilter.forEach((item) => item.classList.remove("is-active"));
      event.currentTarget.classList.add("is-active");

      const kategori = event.currentTarget.dataset.filter ?? "Semua";
      applyFilter(kategori);
    });
  });
}

async function loadProducts() {
  if (!produkGrid) return;

  try {
    setStatus("loading", "Memuat data produk...");

    const response = await fetch(DATA_URL);

    if (!response.ok) {
      throw new Error(`HTTP status ${response.status}`);
    }

    products = await response.json();

    renderFeaturedProduct(products);
    applyFilter("Semua");
  } catch (error) {
    if (produkGrid) produkGrid.replaceChildren();
    if (produkRingkasan) produkRingkasan.textContent = "Gagal menampilkan ringkasan produk.";
    setStatus("error", `Gagal memuat produk: ${error.message}`);
  }
}

initFilter();
loadProducts();