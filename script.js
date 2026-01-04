// ================= DATABASE =================
let database = {};
let selectedSize = "";
let selectedShipping = "";

// ================= LOAD DATABASE TXT =================
fetch("Database.txt")
    .then(response => response.text())
    .then(text => {
        /*
        FORMAT Database.txt:
        product= Agrita Exclusive Women Wear
        price=299000
        whatsapp=628123456789
        XS=5
        S=8
        M=10
        L=7
        XL=4
        XXL=2
        */

        text.split("\n").forEach(line => {
            const [key, value] = line.split("=");
            if (key && value) {
                database[key.trim()] = value.trim();
            }
        });

        // Set initial product data
        document.getElementById("productName").innerText = database.product;
        document.getElementById("productPrice").innerText =
            "Rp " + Number(database.price).toLocaleString("id-ID");
    });

// ================= ELEMENTS =================
const sizeSelect = document.getElementById("sizeSelect");
const stockInfo = document.getElementById("stockInfo");
const shippingRadios = document.querySelectorAll('input[name="shipping"]');
const addressForm = document.getElementById("addressForm");
const waButton = document.getElementById("whatsappButton");

// Summary elements
const summaryProduct = document.getElementById("summaryProduct");
const summaryPrice = document.getElementById("summaryPrice");
const summarySize = document.getElementById("summarySize");
const summaryShipping = document.getElementById("summaryShipping");
const summaryAddress = document.getElementById("summaryAddress");

// ================= SIZE CHANGE =================
sizeSelect.addEventListener("change", () => {
    selectedSize = sizeSelect.value;

    if (!selectedSize || !database[selectedSize]) {
        stockInfo.innerText = "Stok tidak tersedia";
        return;
    }

    stockInfo.innerText = `Stok tersedia: ${database[selectedSize]} pcs`;
    updateSummary();
});

// ================= SHIPPING METHOD =================
shippingRadios.forEach(radio => {
    radio.addEventListener("change", () => {
        selectedShipping = radio.value;

        if (selectedShipping === "Kirim") {
            addressForm.style.display = "block";
        } else {
            addressForm.style.display = "none";
            summaryAddress.innerText = "COD";
        }

        updateSummary();
    });
});

// ================= ADDRESS INPUT =================
const addressInputs = [
    "fullName",
    "phoneNumber",
    "street",
    "district",
    "city",
    "province",
    "postalCode"
];

addressInputs.forEach(id => {
    document.getElementById(id).addEventListener("input", updateSummary);
});

// ================= UPDATE SUMMARY =================
function updateSummary() {
    summaryProduct.innerText = database.product || "-";
    summaryPrice.innerText = database.price
        ? "Rp " + Number(database.price).toLocaleString("id-ID")
        : "-";
    summarySize.innerText = selectedSize || "-";
    summaryShipping.innerText = selectedShipping || "-";

    if (selectedShipping === "Kirim") {
        const address = `
${fullName.value},
${street.value},
${district.value},
${city.value},
${province.value},
${postalCode.value}
        `.replace(/\n/g, " ").trim();

        summaryAddress.innerText = address || "-";
    }
}

// ================= WHATSAPP SEND =================
waButton.addEventListener("click", () => {
    if (!selectedSize) {
        alert("Silakan pilih ukuran terlebih dahulu");
        return;
    }

    if (!selectedShipping) {
        alert("Silakan pilih metode pengiriman");
        return;
    }

    if (selectedShipping === "Kirim" && !phoneNumber.value) {
        alert("Nomor WhatsApp wajib diisi");
        return;
    }

    const message = `
*PESANAN AGRITA ONLINE JASTIP*

Produk : ${database.product}
Harga  : Rp ${Number(database.price).toLocaleString("id-ID")}
Ukuran : ${selectedSize}
Metode : ${selectedShipping}

${selectedShipping === "Kirim" ? 
`Alamat:
${summaryAddress.innerText}` : ""}

Terima kasih 🙏
    `;

    const waURL = `https://wa.me/${database.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(waURL, "_blank");
});
