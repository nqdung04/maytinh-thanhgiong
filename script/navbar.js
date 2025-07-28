window.addEventListener("DOMContentLoaded", () => {
  const searchToggle  = document.getElementById("searchToggle");
  const searchBox     = document.getElementById("searchBox");
  const searchInput   = document.getElementById("searchInput");
  const suggestionsBox= document.getElementById("suggestions");

  // --- MỞ / ĐÓNG HỘP TÌM ---
  function openSearch() {
    searchBox.classList.add("open");
    // Đợi animation width chạy -> focus
    setTimeout(() => searchInput.focus(), 50);
  }
  function closeSearch() {
    searchBox.classList.remove("open");
    suggestionsBox.style.display = "none";
    searchInput.value = "";
  }

  // Toggle khi click chữ TÌM KIẾM
  searchToggle.addEventListener("click", (e) => {
    e.preventDefault();
    if (searchBox.classList.contains("open")) {
      closeSearch();
    } else {
      openSearch();
    }
  });

  // Đóng khi nhấn ESC
  searchInput.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      closeSearch();
      searchInput.blur();
    }
  });

  // Đóng khi click ra ngoài
  document.addEventListener("click", (e) => {
    if (!searchToggle.contains(e.target) && !searchBox.contains(e.target)) {
      closeSearch();
    }
  });

  // --- GỢI Ý SẢN PHẨM ---
  searchInput.addEventListener("input", function () {
    const keyword = this.value.trim().toLowerCase();
    suggestionsBox.innerHTML = "";

    if (!keyword) {
      suggestionsBox.style.display = "none";
      return;
    }

    // products: phải được load từ product.js -> gán global (window.products)
    const list = (window.products || []).filter(p =>
      p.name.toLowerCase().includes(keyword)
    ).slice(0, 6);

    if (list.length === 0) {
      suggestionsBox.style.display = "none";
      return;
    }

    list.forEach(product => {
      const item = document.createElement("div");
      item.className = "suggestion-item";
      item.innerHTML = `
        <span>${product.name}</span>
      `;
      item.addEventListener("click", () => {
        window.location.href = product.link;
      });
      suggestionsBox.appendChild(item);
    });

    suggestionsBox.style.display = "block";
  });
});

document.addEventListener("DOMContentLoaded", () => {
  const menu = document.getElementById("menu");
  const toggleBtn = document.querySelector(".menu-toggle");
  const closeBtn = document.querySelector(".close-btn");

  toggleBtn.addEventListener("click", (e) => {
    e.preventDefault();
    menu.classList.toggle("show");
  });

  closeBtn.addEventListener("click", () => {
    menu.classList.remove("show");
  });
});