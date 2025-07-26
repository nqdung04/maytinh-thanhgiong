// Hàm tạo chuỗi gồm chữ và số ngẫu nhiên (5 ký tự)
function generateCaptchaCode(length = 5) {
  const characters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789";
  let result = "";
  for (let i = 0; i < length; i++) {
    const randomIndex = Math.floor(Math.random() * characters.length);
    result += characters[randomIndex];
  }
  return result;
}

// Hiển thị mã captcha
function generateCaptcha() {
  const captcha = generateCaptchaCode();
  document.getElementById("captchaCode").innerText = captcha;
}

// Tạo mã captcha khi tải trang
window.onload = generateCaptcha;

// Xử lý submit
document.getElementById("captchaForm").addEventListener("submit", function (e) {
  e.preventDefault();

  const serial = document.getElementById("serialInput").value.trim();
  const userCaptcha = document.getElementById("captchaInput").value.trim(); // KHÔNG .toUpperCase()
  const generatedCaptcha = document.getElementById("captchaCode").innerText.trim();

  if (userCaptcha !== generatedCaptcha) {
    alert("Sai mã xác nhận. Vui lòng thử lại.");
    generateCaptcha();
    return;
  }

  if (serial === "") {
    alert("Vui lòng nhập Serial.");
    return;
  }

  // Gửi thành công
  alert("Gửi thành công!\nSerial: " + serial);
});

function toggleMenu() {
  var menu = document.getElementById("menu");
  menu.classList.toggle("open");
}

window.onscroll = function () {
    const btn = document.getElementById("backToTopBtn");
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
};

// Khi bấm nút → cuộn lên đầu trang
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: "smooth"
    });
}
