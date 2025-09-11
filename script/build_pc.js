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
const pagination = document.getElementById("pagination"); 
const closeBtn = document.getElementById("closeBtn");
const priceFilterForm = document.getElementById("priceFilterForm");

let products = [];
let currentCategory = null;
let currentProducts = [];
let filteredProducts = [];
let currentPage = 1;
const itemsPerPage = 10; // 10 sản phẩm / trang

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
  currentCategory = category;
  currentProducts = products.filter(p => p.category === category);
  filteredProducts = [...currentProducts]; // mặc định chưa lọc
  currentPage = 1;
  renderProducts();
  overlay.classList.add("active");
}

function applyPriceFilter() {
  const checkedBoxes = Array.from(priceFilterForm.querySelectorAll("input[name='priceRange']:checked"));
  
  if (checkedBoxes.length === 0) {
    // Không chọn gì -> hiển thị tất cả
    filteredProducts = [...currentProducts];
  } else {
    filteredProducts = currentProducts.filter(p => {
      return checkedBoxes.some(cb => {
        const val = cb.value;
        if (val.includes("+")) {
          const min = parseInt(val.replace("+", ""), 10);
          return p.priceNumber >= min;
        } else {
          const [min, max] = val.split("-").map(v => parseInt(v, 10));
          return p.priceNumber >= min && p.priceNumber <= max;
        }
      });
    });
  }

  currentPage = 1;
  renderProducts();
}

function renderProducts() {
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
  const paginated = filteredProducts.slice(start, end);

  if (paginated.length === 0) {
    productContent.innerHTML = `<p style= "text-align: center;">Không tìm thấy sản phẩm phù hợp</p>`;
  } else {
    productContent.innerHTML = `
      ${paginated.map(p => `
        <div class="product">
          <img src="${p.image}" alt="${p.name}" 
               style="width:80px;height:80px;object-fit:cover;float:left;margin-right:10px;">
          <div>
            <strong>${p.name}</strong><br>
            Mã SP: ${p.code}<br>
            Bảo hành: ${p.baohanh}<br>
            Giá: <span style="color: red;">${Number(p.priceNumber).toLocaleString()} ₫</span>
          </div>
          <button class="add-btn" data-id="${p.id}" data-cat="${p.category}" 
                  style="margin-top:5px;">THÊM VÀO ></button>
          <div style="clear:both"></div>
        </div>
      `).join("")}
    `;

    // Gắn sự kiện cho nút thêm
    document.querySelectorAll(".add-btn").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const cat = btn.dataset.cat;
        const product = products.find(p => p.id == id);

        if (product) {
          const row = document.querySelector(`a.choose-link[data-cat="${cat}"]`);
          if (row) {
            row.innerHTML = `
              <img src="${product.image}" 
                   style="width:40px;vertical-align:middle;margin-right:5px;">
              ${product.name} - ${Number(product.priceNumber).toLocaleString()} ₫
            `;
          }
          overlay.classList.remove("active");
        }
      });
    });
  }

  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(filteredProducts.length / itemsPerPage);
  pagination.innerHTML = "";

  if (totalPages <= 1) return;

  const maxVisible = 5; 
  const currentGroup = Math.floor((currentPage - 1) / maxVisible);
  const start = currentGroup * maxVisible + 1;
  const end = Math.min(start + maxVisible - 1, totalPages);

  const prevBtn = document.createElement("button");
  prevBtn.innerHTML = "«";
  prevBtn.disabled = start === 1;
  prevBtn.addEventListener("click", () => {
    currentPage = start - 1;
    renderProducts();
  });
  pagination.appendChild(prevBtn);

  for (let i = start; i <= end; i++) {
    const btn = document.createElement("button");
    btn.textContent = i;
    if (i === currentPage) btn.classList.add("active");
    btn.addEventListener("click", () => {
      currentPage = i;
      renderProducts();
    });
    pagination.appendChild(btn);
  }

  const nextBtn = document.createElement("button");
  nextBtn.innerHTML = "»";
  nextBtn.disabled = end === totalPages;
  nextBtn.addEventListener("click", () => {
    currentPage = end + 1;
    renderProducts();
  });
  pagination.appendChild(nextBtn);
}

// bắt sự kiện lọc giá
priceFilterForm.addEventListener("change", applyPriceFilter);

closeBtn.addEventListener("click", () => overlay.classList.remove("active"));
overlay.addEventListener("click", e => {
  if (e.target === overlay) overlay.classList.remove("active");
});
