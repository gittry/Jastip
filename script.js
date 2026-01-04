/* ================= FORCE DATABASE RELOAD ================= */
const DB_URL = "Database.txt?reload=" + new Date().getTime();

let database = {};
let selectedSize = "";
let selectedShipping = "";

/* ================= LOAD DATABASE ================= */
fetch(DB_URL)
    .then(response => response.text())
    .then(text => {
        text.split("\n").forEach(line => {
            const parts = line.split("=");
            if (parts.length === 2) {
                database[parts[0].trim()] = parts[1].trim();
            }
        });

        document.getElementById("productName").innerText =
            database.product || "Nama Produk";

        document.getElementById("productPrice").innerText =
            database.price
                ? "Rp " + Number(database.price).toLocaleString("id-ID")
                : "Rp 0";

        updateSummary();
    })
    .catch(() => {
        alert("Gagal memuat database");
    });

/* ================= ELEMENTS ================= */
const buyerName = document.getElementById("buyerName");
const sizeSelect = document.getElementById("sizeSelect");
const stockInfo = document.getElementById("stockInfo");
const shippingRadios = document.querySelectorAll('input[name="shipping"]');
const addressForm = document.getElementById("addressForm");
const waButton = document.getElementById("whatsappButton");

/* Summary */
const summaryBuyer = document.getElementById("summaryBuyer");
const summaryProduct = document.getElementById("summaryProduct");
const summaryPrice = document.getElementById("summaryPrice");
const summarySize = document.getElementById("summarySize");
const summaryShipping = document.getElementById("summaryShipping");
const summaryAddress = document.getElementById("summaryAddress");

/* Address inputs */
const fullName = document.getElementById("fullName");
const phoneNumber = document.getElementById("phoneNumber");
const street = document.getElementById("street");
const district = document.getElementById("district");
const city = document.getElementById("city");
const province = document.getElementById("province");
const postalCode = document.getElementById("postalCode");

/* ================= BUYER NAME ================= */
buyerName.addEventListener("input", updateSummary);

/* ================= SIZE ================= */
sizeSelect.addEventListener("change", () => {
    selectedSize = sizeSelect.value;

    if (database[selectedSize]) {
        stockInfo.innerText = `Stok tersedia: ${database[selectedSize]} pcs`;
    } else {
        stockInfo.innerText = "Stok tidak tersedia";
    }

    updateSummary();
});

/* ================= SHIPPING ================= */
shippingRadios.forEach(radio => {
    radio.addEventListener("change", () => {
        selectedShipping = radio.value;
        addressForm.style.display =
            selectedShipping === "Kirim" ? "block" : "none";
        updateSummary();
    });
});

/* ================= ADDRESS INPUT ================= */
[
    fullName,
    street,
    district,
    city,
    province,
    postalCode
].forEach(input => {
    input.addEventListener("input", updateSummary);
});

/* ================= UPDATE SUMMARY ================= */
function updateSummary() {
    summaryBuyer.innerText = buyerName.value || "-";
    summaryProduct.innerText = database.product || "-";
    summaryPrice.innerText = database.price
        ? "Rp " + Number(database.price).toLocaleString("id-ID")
        : "-";
    summarySize.innerText = selectedSize || "-";
    summaryShipping.innerText = selectedShipping || "-";

    if (selectedShipping === "Kirim") {
        const addressText = `
${street.value}, ${district.value},
${city.value}, ${province.value},
${postalCode.value}
        `.replace(/\n/g, " ").trim();

        summaryAddress.innerText = addressText || "-";
    } else {
        summaryAddress.innerText = "COD";
    }
}

/* ================= WHATSAPP SEND ================= */
waButton.addEventListener("click", () => {
    if (!buyerName.value) {
        alert("Masukkan nama terlebih dahulu");
        return;
    }

    if (!selectedSize) {
        alert("Pilih ukuran terlebih dahulu");
        return;
    }

    if (!selectedShipping) {
        alert("Pilih metode pengiriman");
        return;
    }

    if (selectedShipping === "Kirim" && !phoneNumber.value) {
        alert("Nomor WhatsApp wajib diisi");
        return;
    }

    const message = `
*PESANAN AGRITA ONLINE JASTIP*
Nama    : ${buyerName.value}
Produk  : ${database.product}
Harga   : Rp ${Number(database.price).toLocaleString("id-ID")}
Ukuran  : ${selectedSize}
Metode  : ${selectedShipping}
Alamat  : ${summaryAddress.innerText}

Terima kasih 🙏
    `;

    const waLink = `https://wa.me/${database.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(waLink, "_blank");
});

/* ================= SLIDER ================= */
const slider = document.getElementById("imageSlider");
const slideLeft = document.getElementById("slideLeft");
const slideRight = document.getElementById("slideRight");

slideLeft.addEventListener("click", () => {
    slider.scrollBy({ left: -300, behavior: "smooth" });
});

slideRight.addEventListener("click", () => {
    slider.scrollBy({ left: 300, behavior: "smooth" });
});