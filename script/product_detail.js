document.getElementById("openOrderBtn").addEventListener("click", function () {
    document.getElementById("orderOverlay").style.display = "flex";
});

document.getElementById("phone").addEventListener("input", function () {
    this.value = this.value.replace(/\D/g, ""); // Loại bỏ mọi ký tự không phải số
});

function closeOrderForm() {
    document.getElementById("orderOverlay").style.display = "none";
}

const overlay = document.getElementById("imageOverlay");
const zoomed = document.getElementById("zoomedImage");

document.getElementById("mainImage").addEventListener("click", function () {
    zoomed.src = this.src;
    overlay.style.display = "flex";
});

// 👇 Đóng khi click vào vùng overlay (trừ ảnh và nút đóng)
overlay.addEventListener("click", function (e) {
    if (e.target === overlay) {
        overlay.style.display = "none";
    }
});

function closeImage() {
    overlay.style.display = "none";
}

// chuyển ảnh
document.addEventListener("DOMContentLoaded", function () {
  const thumbnails = document.querySelectorAll(".thumbnail");
  const mainImage = document.getElementById("mainImage");

  thumbnails.forEach(thumbnail => {
    thumbnail.addEventListener("click", function () {
      const newSrc = this.getAttribute("src");
      mainImage.setAttribute("src", newSrc);
    });
  });
});
