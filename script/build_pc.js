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

document.getElementById('refreshBtn').addEventListener('click', function () {
  if (!confirm('Cảnh báo: Thao tác này sẽ xóa tất cả sản phẩm đã chọn')) return;

  // 1️⃣ Xóa dữ liệu đang chọn
  for (const cat in selectedItems) {
    delete selectedItems[cat];
  }

  // 2️⃣ Cập nhật lại tổng giá
  updateTotalCost();

  // 3️⃣ Khôi phục từng dòng về đúng giao diện ban đầu
  Object.entries(originalLinks).forEach(([cat, original]) => {
    // Tìm phần tử hiện tại của danh mục này (có thể đang là <div> sau khi chọn)
    const current = document.querySelector(`[data-cat="${cat}"]`);
    if (current) {
      const restored = original.cloneNode(true);      // clone bản gốc
      current.replaceWith(restored);                 // thay thế
      attachChooseEvent(restored);                   // gắn lại sự kiện click
    }
  });
});

const overlay = document.getElementById("overlay");
const productContent = document.getElementById("productContent");
const pagination = document.getElementById("pagination");
const sortSelect = document.getElementById("sortSelect");
const closeBtn = document.getElementById("closeBtn");

// ==== QUẢN LÝ GIỎ HÀNG / TỔNG GIÁ ====
/*
  selectedItems[cat] = {
     product: {...},
     qty: number
  }
*/
const selectedItems = {};
// const totalCostEl = document.getElementById("totalCost"); // <td id="totalCost">0 ₫</td>
function updateTotalCost() {
  let sum = 0;
  Object.values(selectedItems).forEach(item => {
    sum += item.product.priceNumber * item.qty;
  });

  // Cập nhật cho tất cả ô tổng giá
  document.querySelectorAll('.totalCost').forEach(el => {
    el.textContent = sum.toLocaleString() + '₫';
  });
}

function renderSelectedItem(cat) {
  const old = document.querySelector(
    `a.choose-link[data-cat="${cat}"], div.choose-link[data-cat="${cat}"]`
  );
  if (!old) return;

  const { product, qty } = selectedItems[cat];
  const unitPrice = product.priceNumber;

  const container = document.createElement('div');
  container.dataset.cat = cat;
  container.className = old.className;
  old.replaceWith(container);

  container.style.cssText =
    "background:#fff;color:#000;display:block;padding:10px;";

  container.innerHTML = `
    <div style="display:flex;gap:12px;">
      <img src="${product.image}" style="width:120px;height:120px;object-fit:cover;border-radius:6px;">
      <div style="flex:1;">
        <strong>${product.name}</strong><br>
        Mã: ${product.code}<br>
        Bảo hành: ${product.baohanh}<br>
        Kho hàng:
          <span style="color:${product.status===1?'green':'black'}">
            ${product.status===1?'Còn hàng':'Hết hàng'}
          </span>
        <div style="margin-top:8px;display:flex;justify-content:space-between;align-items:center;">
          <div>
            ${unitPrice.toLocaleString()} ₫ ×
            <input type="number" min="1" value="${qty}"
                   class="qty-input" style="width:60px;text-align:center;">
            <span class="total-price" style="font-weight:bold;color:red;margin-left:6px;">
              = ${(unitPrice * qty).toLocaleString()} ₫
            </span>
          </div>
          <div style="display:flex;gap:6px;">
            <button class="edit-btn"
                    style="background:none;border:none;cursor:pointer;font-size:20px;color:#06c;">✏️</button>
            <button class="remove-btn"
                    style="background:none;border:none;cursor:pointer;font-size:20px;color:#c00;">🗑️</button>
          </div>
        </div>
      </div>
    </div>
  `;

  const qtyInput  = container.querySelector('.qty-input');
  const totalSpan = container.querySelector('.total-price');

  // Chỉ cho nhập số nguyên dương và auto về 1 ngay khi xóa hết
  qtyInput.addEventListener('input', e => {
    let cleaned = e.target.value.replace(/\D/g, ''); // lọc chỉ số
    if (cleaned === '') {
      // vừa xóa hết => đặt ngay về 1
      cleaned = '1';
    }
    let val = parseInt(cleaned, 10);
    if (val < 1 || isNaN(val)) val = 1;

    e.target.value = val;
    selectedItems[cat].qty = val;
    totalSpan.textContent = "= " + (unitPrice * val).toLocaleString() + "₫";
    updateTotalCost();
  });

  container.querySelector('.edit-btn').addEventListener('click', e => {
    e.preventDefault(); e.stopPropagation();
    openOverlayFor(cat);
  });

  container.querySelector('.remove-btn').addEventListener('click', e => {
    e.preventDefault(); e.stopPropagation();
    if (confirm('Bạn có chắc muốn xóa sản phẩm này?')) {
      delete selectedItems[cat];
      updateTotalCost();
      const restored = originalLinks[cat].cloneNode(true);
      container.replaceWith(restored);
      attachChooseEvent(restored);
    }
  });
}

// ====================================

let products = [];
let currentCategory = null;
let currentProducts = [];
let currentPage = 1;
const itemsPerPage = 10;
let activeRanges = new Set();
let currentSort = "name";   // mặc định A-Z

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

  // Lọc theo khoảng giá
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
  currentProducts = applyFiltersAndSort();
  const start = (currentPage - 1) * itemsPerPage;
  const end = start + itemsPerPage;
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
            Kho hàng: <span style="color:${inStock ? 'green' : 'black'};">
              ${inStock ? 'Còn hàng' : 'Hết hàng'}
            </span><br>
            <span style="color:red; font-weight: bold">${p.price}</span>
          </div>
          <button class="add-btn" data-id="${p.id}" data-cat="${p.category}"
            ${inStock ? "" : "disabled"}
            style="margin-top:5px;${inStock ? "" : "background:#ccc;cursor:not-allowed;"}">
            ${inStock ? "THÊM VÀO >" : "✖ Hết hàng"}
          </button>
          <div style="clear:both"></div>
        </div>`;
    }).join("");

    // Gắn sự kiện cho nút thêm
    document.querySelectorAll(".add-btn:not([disabled])").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const cat = btn.dataset.cat;
        const product = products.find(p => p.id == id);
        if (product) {
          selectedItems[cat] = { product, qty: 1 };
          renderSelectedItem(cat);
          updateTotalCost();
          overlay.classList.remove("active");
          attachRowEvents(cat);
        }
      });
    });
  }
  renderPagination();
}

// Lưu HTML gốc của từng nút khi load
// Lưu bản clone gốc
const originalLinks = {};
document.querySelectorAll("a.choose-link").forEach(a => {
  originalLinks[a.dataset.cat] = a.cloneNode(true);
  attachChooseEvent(a);
});

function attachChooseEvent(link) {
  if (!link || link.dataset.chooseBound) return;
  link.dataset.chooseBound = '1';
  link.addEventListener('click', e => {
    e.preventDefault();
    const cat = e.currentTarget.dataset.cat;
    openOverlayFor(cat);
  });
}

function openOverlayFor(cat) {
  // ví dụ mở overlay và load danh sách sản phẩm theo cat
  const overlay = document.getElementById("overlay");
  overlay.classList.add("open");
  showProducts(cat); // nếu có hàm hiển thị sản phẩm
}

function attachRowEvents(cat) {
  const row = document.querySelector(`a.choose-link[data-cat="${cat}"]`);
  if (!row) return;
  // tránh bind nhiều lần cho cùng 1 node
  if (row.dataset.rowBound) return;
  row.dataset.rowBound = '1';

  const qty = row.querySelector('.qty-input');
  if (qty && !qty.dataset.qtyBound) {
    qty.dataset.qtyBound = '1';
    qty.addEventListener('input', e => {
      let val = parseInt(e.target.value, 10) || 1;
      if (val < 1) val = 1;
      selectedItems[cat].qty = val;
      updateTotalCost();
      renderSelectedItem(cat);
      // renderSelectedItem có thể thay DOM -> re-attach
      attachRowEvents(cat);
    });
  }

  const remove = row.querySelector('.remove-btn');
  if (remove && !remove.dataset.removeBound) {
    remove.dataset.removeBound = '1';
    remove.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();   // 🔑 chặn sự kiện click nổi lên thẻ <a>

      if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;

      delete selectedItems[cat];
      updateTotalCost();

      // Khôi phục link gốc
      const restored = originalLinks[cat].cloneNode(true);
      row.replaceWith(restored);

      // Gắn lại sự kiện chọn cho link gốc
      attachChooseEvent(restored);
    });
  }
}

function renderPagination() {
  const totalPages = Math.ceil(currentProducts.length / itemsPerPage);
  pagination.innerHTML = "";
  if (totalPages <= 1) return;

  let startPage = Math.max(1, currentPage - 2);
  let endPage = Math.min(totalPages, startPage + 4);
  if (endPage - startPage < 4) startPage = Math.max(1, endPage - 4);

  let html = "";
  if (currentPage > 1) html += `<button data-page="${currentPage - 1}">«</button>`;
  for (let i = startPage; i <= endPage; i++) {
    html += `<button data-page="${i}" class="${i === currentPage ? "active" : ""}">${i}</button>`;
  }
  if (currentPage < totalPages) html += `<button data-page="${currentPage + 1}">»</button>`;

  pagination.innerHTML = html;
  pagination.querySelectorAll("button").forEach(b => {
    b.addEventListener("click", () => { currentPage = Number(b.dataset.page); renderProducts(); });
  });
}

closeBtn.addEventListener("click", () => overlay.classList.remove("active"));
overlay.addEventListener("click", e => { if (e.target === overlay) overlay.classList.remove("active"); });

// ----- Lọc nhiều mức giá -----
document.getElementById("priceFilterForm")?.addEventListener("change", e => {
  const cb = e.target;
  if (cb && cb.type === "checkbox") {
    if (cb.checked) activeRanges.add(cb.value);
    else activeRanges.delete(cb.value);
    currentPage = 1;
    renderProducts();
  }
});
