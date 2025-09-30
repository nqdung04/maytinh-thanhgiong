// Đổ ngày hôm nay
const d = new Date();
const formatted =
  d.getDate().toString().padStart(2, "0") + "/" +
  (d.getMonth() + 1).toString().padStart(2, "0") + "/" +
  d.getFullYear() + ", " +
  d.getHours().toString().padStart(2, "0") + ":" +
  d.getMinutes().toString().padStart(2, "0");

document.getElementById("quote-date").textContent =
  "Ngày báo giá: " + formatted;

// Lấy dữ liệu đã lưu từ localStorage
const saved = localStorage.getItem("savedConfig");
const tbody = document.getElementById("tbody-products");
const grandTotalEl = document.getElementById("grand-total");
let grandTotal = 0;

if (saved) {
  const parsed = JSON.parse(saved);
  let i = 1;
  Object.values(parsed).forEach(item => {
    const { product, qty } = item;
    const unitPrice = product.priceNumber;
    const total = unitPrice * qty;
    grandTotal += total;

    const row = document.createElement("tr");
    row.innerHTML = `
          <td>${i++}</td>
          <td>${product.code}</td>
          <td style="text-align:left">${product.name}</td>
          <td>${product.baohanh}</td>
          <td class="right">${qty}</td>
          <td class="right">${unitPrice.toLocaleString()}₫</td>
          <td class="right">${total.toLocaleString()}₫</td>
        `;
    tbody.appendChild(row);
  });
  grandTotalEl.textContent = grandTotal.toLocaleString() + "₫";
}

document.addEventListener("DOMContentLoaded", () => {
  // Kiểm tra query string
  const urlParams = new URLSearchParams(window.location.search);
  if (urlParams.get("download") === "jpg") {
    const element = document.getElementById("quote-area");
    if (element) {
      // Chờ 1 chút để bảng báo giá render đầy đủ
      setTimeout(() => {
        html2canvas(element, { scale: 2 }).then(canvas => {
          const imgData = canvas.toDataURL("image/jpeg", 1.0);
          const link = document.createElement("a");
          link.href = imgData;
          link.download = "bao-gia.jpg";
          link.click();
        });
      }, 500); // chờ 0.5 giây
    }
  }
});

// Nút In đơn hàng
document.getElementById("print-quote").addEventListener("click", () => {
  window.print();
});