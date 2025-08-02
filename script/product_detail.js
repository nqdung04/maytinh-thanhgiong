document.getElementById("openOrderBtn").addEventListener("click", function () {
    document.getElementById("orderOverlay").style.display = "flex";
});

function closeOrderForm() {
    document.getElementById("orderOverlay").style.display = "none";
}

const orderOverlay = document.getElementById("orderOverlay");
orderOverlay.addEventListener("click", function (e) {
    if (e.target === orderOverlay) {
        closeOrderForm();
    }
});

const overlay = document.getElementById("imageOverlay");

document.getElementById("mainImage").addEventListener("click", function () {
    overlay.style.display = "flex";
});

overlay.addEventListener("click", function (e) {
    if (e.target === overlay) {
        overlay.style.display = "none";
    }
});