document.getElementById("openOrderBtn").addEventListener("click", function () {
    document.getElementById("orderOverlay").style.display = "flex";
});

function closeOrderForm() {
    document.getElementById("orderOverlay").style.display = "none";
}

const overlay = document.getElementById("imageOverlay");

document.getElementById("mainImage").addEventListener("click", function () {
    overlay.style.display = "flex";
});

// 👇 Đóng khi click vào vùng overlay (trừ ảnh và nút đóng)
overlay.addEventListener("click", function (e) {
    if (e.target === overlay) {
        overlay.style.display = "none";
    }
});