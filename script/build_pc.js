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

const overlay        = document.getElementById("overlay");
const productContent = document.getElementById("productContent");
const pagination     = document.getElementById("pagination");
const sortSelect     = document.getElementById("sortSelect");
const closeBtn       = document.getElementById("closeBtn");

// ==== TÍNH TỔNG GIÁ ====
const selectedItems  = {};   // key = category, value = priceNumber
const totalCostEl    = document.getElementById("totalCost"); // <td id="totalCost">0 ₫</td>
function updateTotalCost() {
  const sum = Object.values(selectedItems).reduce((a,b)=>a+b,0);
  totalCostEl.textContent = sum.toLocaleString() + " ₫";
}
// =======================

let products         = [];
let currentCategory  = null;
let currentProducts  = [];
let currentPage      = 1;
const itemsPerPage   = 10;
let activeRanges     = new Set();
let currentSort      = "name";   // mặc định A-Z

// Load JSON
fetch("../data/build_pc_data.json")
  .then(res => res.json())
  .then(data => { products = data; });

document.querySelectorAll(".choose-link").forEach(link => {
  link.addEventListener("click", e => {
    e.preventDefault();
    const cat = link.dataset.cat;
    showProducts(cat);
  });
});

// ----- Sắp xếp -----
sortSelect.addEventListener("change", () => {
  currentSort = sortSelect.value;
  currentPage = 1;
  renderProducts();
});

function applyFiltersAndSort() {
  let list = products.filter(p => p.category === currentCategory);

  // Lọc theo khoảng giá (nếu có)
  if (activeRanges.size) {
    list = list.filter(p => {
      return Array.from(activeRanges).some(r => {
        if (r.endsWith("+")) return p.priceNumber >= parseInt(r);
        const [min, max] = r.split("-").map(Number);
        return p.priceNumber >= min && p.priceNumber <= max;
      });
    });
  }

  // Sắp xếp
  list.sort((a, b) => {
    if (currentSort === "priceAsc") {
      return a.priceNumber - b.priceNumber || a.name.localeCompare(b.name);
    }
    if (currentSort === "priceDesc") {
      return b.priceNumber - a.priceNumber || a.name.localeCompare(b.name);
    }

    // Mặc định (A-Z) — ƯU TIÊN còn hàng trước
    if (a.status !== b.status) return b.status - a.status;
    return a.name.localeCompare(b.name);
  });

  return list;
}


function showProducts(category) {
  currentCategory = category;
  currentPage = 1;
  currentProducts = applyFiltersAndSort();
  renderProducts();
  overlay.classList.add("active");
}

function renderProducts() {
  currentProducts = applyFiltersAndSort(); // cập nhật mỗi lần render
  const start = (currentPage - 1) * itemsPerPage;
  const end   = start + itemsPerPage;
  const paginated = currentProducts.slice(start, end);

  if (paginated.length === 0) {
    productContent.innerHTML = `<p>Chưa có sản phẩm trong danh mục này.</p>`;
  } else {
    productContent.innerHTML = paginated.map(p => {
      const inStock = p.status === 1;
      return `
        <div class="product">
          <img src="${p.image}" alt="${p.name}"
               style="width:80px;height:80px;object-fit:cover;float:left;margin-right:10px;">
          <div>
            <strong>${p.name}</strong><br>
            Mã SP: ${p.code}<br>
            Bảo hành: ${p.baohanh}<br>
            Tình trạng: <span style="color:${inStock?'green':'black'};">
              ${inStock?'Còn hàng':'Hết hàng'}
            </span><br>
            <span style="color:red; font-weight: bold">${p.price}</span>
          </div>
          <button class="add-btn" data-id="${p.id}" data-cat="${p.category}"
            ${inStock?"":"disabled"}
            style="margin-top:5px;${inStock?"":"background:#ccc;cursor:not-allowed;"}">
            ${inStock?"THÊM VÀO >":"✖ Hết hàng"}
          </button>
          <div style="clear:both"></div>
        </div>`;
    }).join("");

    // nút thêm (chỉ cho hàng còn)
    document.querySelectorAll(".add-btn:not([disabled])").forEach(btn => {
      btn.addEventListener("click", () => {
        const id  = btn.dataset.id;
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
          // --- Cập nhật tổng giá ---
          selectedItems[cat] = Number(product.priceNumber);
          updateTotalCost();
          // -------------------------
          overlay.classList.remove("active");
        }
      });
    });
  }
  renderPagination();
}

function renderPagination() {
  const totalPages = Math.ceil(currentProducts.length / itemsPerPage);
  pagination.innerHTML = "";
  if (totalPages <= 1) return;

  let startPage = Math.max(1, currentPage - 2);
  let endPage   = Math.min(totalPages, startPage + 4);
  if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);

  let html = "";
  if (currentPage > 1) html += `<button data-page="${currentPage-1}">«</button>`;
  for (let i = startPage; i <= endPage; i++) {
    html += `<button data-page="${i}" class="${i===currentPage?"active":""}">${i}</button>`;
  }
  if (currentPage < totalPages) html += `<button data-page="${currentPage+1}">»</button>`;

  pagination.innerHTML = html;
  pagination.querySelectorAll("button").forEach(b=>{
    b.addEventListener("click",()=>{ currentPage = Number(b.dataset.page); renderProducts(); });
  });
}

closeBtn.addEventListener("click",()=>overlay.classList.remove("active"));
overlay.addEventListener("click",e=>{ if(e.target===overlay) overlay.classList.remove("active"); });

// ----- Lọc nhiều mức giá -----
document.getElementById("priceFilterForm")?.addEventListener("change", e=>{
  const cb = e.target;
  if (cb && cb.type === "checkbox") {
    if (cb.checked) activeRanges.add(cb.value);
    else activeRanges.delete(cb.value);
    currentPage = 1;
    renderProducts();
  }
});
