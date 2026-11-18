document.addEventListener("DOMContentLoaded", () => {
  const form = document.querySelector("#contact-form");
  if (!form) return;

  const STORAGE_KEY = "preferensi-kontak-koopa";

  const namaInput = document.querySelector("#nama");
  const emailInput = document.querySelector("#email");
  const whatsappInput = document.querySelector("#whatsapp");
  const paketSelect = document.querySelector("#paket");
  const pesanTextarea = document.querySelector("#pesan");
  const setujuCheckbox = document.querySelector("#setuju");

  const topikInputs = document.querySelectorAll('input[name="topik"]');
  const waktuInputs = document.querySelectorAll('input[name="waktu"]');
  const fieldsetTopik = document.querySelector("#fieldset-topik");
  const fieldsetWaktu = document.querySelector("#fieldset-waktu");

  const formFeedback = document.querySelector("#form-feedback");
  const previewBox = document.querySelector("#preview-box");

  // Elemen panel preferensi localStorage
  const preferensiPanel = document.querySelector("#preferensi-panel");
  const preferensiTeks = document.querySelector("#preferensi-teks");
  const btnTerapkanPref = document.querySelector("#btn-terapkan-pref");
  const btnHapusPref = document.querySelector("#btn-hapus-pref");

  const fields = [
    namaInput,
    emailInput,
    whatsappInput,
    paketSelect,
    pesanTextarea,
    setujuCheckbox
  ];

  console.log("Target fields form kontak:", fields);

  // Ambil pesan error sesuai validity property
  function getFieldError(field) {
    const validity = field.validity;

    if (validity.valueMissing) {
      if (field.type === "checkbox") {
        return "Anda wajib menyetujui konfirmasi preview data.";
      }
      if (field.tagName === "SELECT") {
        return "Silakan pilih paket yang diminati terlebih dahulu.";
      }
      return "Bagian ini wajib diisi.";
    }

    if (validity.typeMismatch && field.type === "email") {
      return "Masukkan alamat email yang valid (contoh: nama@email.com).";
    }

    if (validity.tooShort) {
      return `Isi minimal ${field.minLength} karakter (saat ini ${field.value.length} karakter).`;
    }

    if (validity.patternMismatch && field.id === "whatsapp") {
      return "Format nomor WhatsApp harus diawali 08 dan terdiri dari 10–13 digit angka.";
    }

    return "";
  }

  // Validasi per field + set atribut aria-invalid
  function validasiField(field) {
    field.setCustomValidity("");

    const errorEl = document.querySelector(`#${field.id}-error`);
    const pesan = getFieldError(field);

    if (pesan) {
      field.setCustomValidity(pesan);
    }

    field.setAttribute("aria-invalid", pesan ? "true" : "false");

    if (errorEl) {
      errorEl.textContent = pesan;
    }

    return !pesan;
  }

  // Validasi khusus radio group (topik & waktu)
  function validasiRadioGroup(inputs, fieldset, errorId, pesanWajib) {
    const adaYangDipilih = Array.from(inputs).some((input) => input.checked);
    const errorEl = document.querySelector(`#${errorId}`);

    if (fieldset) {
      fieldset.setAttribute("aria-invalid", adaYangDipilih ? "false" : "true");
    }

    if (errorEl) {
      errorEl.textContent = adaYangDipilih ? "" : pesanWajib;
    }

    return adaYangDipilih;
  }

  // Pasang validasi real-time saat user memperbaiki input
  fields.forEach((field) => {
    const eventName = field.tagName === "SELECT" || field.type === "checkbox" ? "change" : "input";
    field.addEventListener(eventName, () => {
      validasiField(field);
    });
  });

  topikInputs.forEach((radio) => {
    radio.addEventListener("change", () => {
      validasiRadioGroup(topikInputs, fieldsetTopik, "topik-error", "Pilih salah satu topik pertanyaan.");
    });
  });

  waktuInputs.forEach((radio) => {
    radio.addEventListener("change", () => {
      validasiRadioGroup(waktuInputs, fieldsetWaktu, "waktu-error", "Pilih waktu yang nyaman untuk dihubungi.");
    });
  });

  // Simpan preferensi non-sensitif ke localStorage
  function simpanPreferensi(dataForm) {
    const preferensi = {
      paket: dataForm.get("paket"),
      topik: dataForm.get("topik"),
      waktu: dataForm.get("waktu")
    };

    localStorage.setItem(STORAGE_KEY, JSON.stringify(preferensi));
    tampilkanPanelPreferensi(preferensi);
  }

  // Tampilkan info preferensi di panel atas form
  function tampilkanPanelPreferensi(preferensi) {
    if (!preferensiPanel || !preferensiTeks) return;

    preferensiTeks.textContent = `${preferensi.paket} | Topik: ${preferensi.topik} | Waktu: ${preferensi.waktu}`;
    preferensiPanel.classList.remove("hidden");
  }

  // Muat preferensi dari localStorage saat halaman dibuka
  function muatPreferensi() {
    try {
      const tersimpan = localStorage.getItem(STORAGE_KEY);
      if (!tersimpan) return;

      const preferensi = JSON.parse(tersimpan);
      if (!preferensi || typeof preferensi !== "object") return;

      if (preferensi.paket) paketSelect.value = preferensi.paket;

      if (preferensi.topik) {
        topikInputs.forEach((radio) => {
          radio.checked = radio.value === preferensi.topik;
        });
      }

      if (preferensi.waktu) {
        waktuInputs.forEach((radio) => {
          radio.checked = radio.value === preferensi.waktu;
        });
      }

      tampilkanPanelPreferensi(preferensi);
    } catch (error) {
      console.warn("Data preferensi di localStorage rusak, menghapus key.", error);
      localStorage.removeItem(STORAGE_KEY);
    }
  }

  // Tombol terapkan ulang preferensi
  if (btnTerapkanPref) {
    btnTerapkanPref.addEventListener("click", () => {
      muatPreferensi();
      formFeedback.textContent = "Preferensi tersimpan berhasil diterapkan ke formulir.";
      formFeedback.classList.add("success");
    });
  }

  // Tombol hapus preferensi dari localStorage
  if (btnHapusPref) {
    btnHapusPref.addEventListener("click", () => {
      localStorage.removeItem(STORAGE_KEY);
      if (preferensiPanel) preferensiPanel.classList.add("hidden");

      paketSelect.value = "";
      topikInputs.forEach((r) => (r.checked = false));
      waktuInputs.forEach((r) => (r.checked = false));

      formFeedback.textContent = "Preferensi tersimpan telah dihapus.";
      formFeedback.classList.remove("success");
    });
  }

  // Tampilkan preview data valid
  function tampilkanPreview(data) {
    document.querySelector("#prev-nama").textContent = data.get("nama");
    document.querySelector("#prev-email").textContent = data.get("email");
    document.querySelector("#prev-whatsapp").textContent = data.get("whatsapp");
    document.querySelector("#prev-paket").textContent = data.get("paket");
    document.querySelector("#prev-topik").textContent = data.get("topik");
    document.querySelector("#prev-waktu").textContent = data.get("waktu");
    document.querySelector("#prev-pesan").textContent = data.get("pesan");

    previewBox.classList.remove("hidden");
    previewBox.scrollIntoView({ behavior: "smooth" });
  }

  // Handler submit form
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    formFeedback.classList.remove("success");

    const fieldsValid = fields.map((field) => validasiField(field)).every(Boolean);
    const topikValid = validasiRadioGroup(topikInputs, fieldsetTopik, "topik-error", "Pilih salah satu topik pertanyaan.");
    const waktuValid = validasiRadioGroup(waktuInputs, fieldsetWaktu, "waktu-error", "Pilih waktu yang nyaman untuk dihubungi.");

    if (!fieldsValid || !topikValid || !waktuValid || !form.checkValidity()) {
      formFeedback.textContent = "Periksa kembali bagian yang ditandai merah.";
      form.querySelector(":invalid")?.focus();
      return;
    }

    const dataForm = new FormData(form);
    tampilkanPreview(dataForm);
    simpanPreferensi(dataForm);

    formFeedback.textContent = "Formulir valid. Data preview ditampilkan dan preferensi disimpan.";
    formFeedback.classList.add("success");
  });

  // Jalankan pembacaan localStorage saat halaman dimuat
  muatPreferensi();
});