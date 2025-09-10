document.querySelectorAll('.choose-link').forEach(btn => {
  btn.addEventListener('click', () => {
    const key = btn.dataset.key;
    const tpl = document.getElementById(key);
    if (tpl) {
      content.innerHTML = '';
      content.appendChild(tpl.content.cloneNode(true));
      overlay.classList.add('open');
    }
  });
});

const overlay = document.getElementById("overlay");
const productContent = document.getElementById("productContent");
const closeBtn = document.getElementById("closeBtn");

let products = [];

// Load JSON
fetch("../data/build_pc_data.json")
  .then(res => res.json())
  .then(data => {
    products = data;
  });

document.querySelectorAll(".choose-link").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const cat = link.dataset.cat;
    showProducts(cat);
  });
});

function showProducts(category) {
  const filtered = products.filter(p => p.category === category);
  if (filtered.length === 0) {
    productContent.innerHTML = `<p>Chưa có sản phẩm trong danh mục này.</p>`;
  } else {
    productContent.innerHTML = `
      <h3>Chọn linh kiện</h3>
      ${filtered.map(p => `
        <div class="product">
          <img src="${p.image}" alt="${p.name}" style="width:80px;height:80px;object-fit:cover;float:left;margin-right:10px;">
          <div>
            <strong>${p.name}</strong><br>
            Mã SP: ${p.code}<br>
            Bảo hành: ${p.baohanh}<br>
            Giá: ${p.price}
          </div>
          <button class="add-btn" data-id="${p.id}" data-cat="${p.category}" style="margin-top:5px;">Thêm</button>
          <div style="clear:both"></div>
        </div>
      `).join("")}
    `;

    document.querySelectorAll(".add-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const cat = btn.dataset.cat;
        const product = products.find(p => p.id == id);

        if (product) {
          // Tìm dòng trong bảng build_pc.html theo data-cat
          const row = document.querySelector(`a.choose-link[data-cat="${cat}"]`);
          if (row) {
            row.innerHTML = `
              <img src="${product.image}" style="width:40px;vertical-align:middle;margin-right:5px;">
              ${product.name} - ${Number(product.price).toLocaleString()} ₫
            `;
          }
          // Đóng popup
          overlay.classList.remove("active");
        }
      });
    });
  }
  overlay.classList.add("active");
}

closeBtn.addEventListener("click", () => overlay.classList.remove("active"));
overlay.addEventListener("click", e => {
  if (e.target === overlay) overlay.classList.remove("active");
});
