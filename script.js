// script.js (UPDATED – REAL SWIPE SLIDER)
const slider = document.getElementById("imageSlider");
let index = 0;
let startX = 0;
let isDragging = false;

const images = slider.children;
const total = images.length;

function updateSlide() {
    slider.style.transform = `translateX(-${index * 100}%)`;
}

slider.addEventListener("touchstart", e => {
    startX = e.touches[0].clientX;
    isDragging = true;
});

slider.addEventListener("touchend", e => {
    if (!isDragging) return;
    const endX = e.changedTouches[0].clientX;
    const diff = startX - endX;

    if (diff > 50 && index < total - 1) index++;
    if (diff < -50 && index > 0) index--;

    updateSlide();
    isDragging = false;
});

/* DATABASE RELOAD */
fetch("Database.txt?reload=" + Date.now())
.then(r=>r.text())
.then(t=>{
    const db={}
    t.split("\n").forEach(l=>{
        const [k,v]=l.split("=")
        if(k&&v) db[k.trim()]=v.trim()
    })
    productName.innerText=db.product
    productPrice.innerText="Rp "+Number(db.price).toLocaleString("id-ID")
})

/* SUMMARY + WA */
buyerName.oninput=()=>summaryBuyer.innerText=buyerName.value
sizeSelect.onchange=()=>summarySize.innerText=sizeSelect.value

document.querySelectorAll("input[name=shipping]").forEach(r=>{
    r.onchange=()=>{
        summaryShipping.innerText=r.value
        addressForm.style.display=r.value==="Kirim"?"block":"none"
    }
})

whatsappButton.onclick=()=>{
    const msg=`Pesanan AGRITA
Nama: ${buyerName.value}
Ukuran: ${sizeSelect.value}`
    window.open("https://wa.me/628123456789?text="+encodeURIComponent(msg))
}