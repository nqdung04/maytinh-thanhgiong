// ================== CHỌN SẢN PHẨM ==================
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

// ================== XÓA HẾT ==================
document.getElementById('refreshBtn').addEventListener('click', function () {
  if (!confirm('Cảnh báo: Thao tác này sẽ xóa tất cả sản phẩm đã chọn')) return;

  // 1️⃣ Xóa dữ liệu đang chọn
  for (const cat in selectedItems) {
    delete selectedItems[cat];
  }

  // 2️⃣ Cập nhật lại tổng giá
  updateTotalCost();

  // 3️⃣ Xóa luôn localStorage
  localStorage.removeItem("savedConfig");

  // 4️⃣ Khôi phục từng dòng về đúng giao diện ban đầu
  Object.entries(originalLinks).forEach(([cat, original]) => {
    const current = document.querySelector(`[data-cat="${cat}"]`);
    if (current) {
      const restored = original.cloneNode(true);
      current.replaceWith(restored);
      attachChooseEvent(restored);
    }
  });
});

const overlay = document.getElementById("overlay");
const productContent = document.getElementById("productContent");
const pagination = document.getElementById("pagination");
const sortSelect = document.getElementById("sortSelect");
const closeBtn = document.getElementById("closeBtn");

// ==== QUẢN LÝ GIỎ HÀNG / TỔNG GIÁ ====
const selectedItems = {};

function updateTotalCost() {
  let sum = 0;
  Object.values(selectedItems).forEach(item => {
    sum += item.product.priceNumber * item.qty;
  });
  document.querySelectorAll('.totalCost').forEach(el => {
    el.textContent = sum.toLocaleString() + '₫';
  });
  saveConfig(); // 🔄 luôn lưu khi tính lại
}

// Lưu vào localStorage
function saveConfig() {
  localStorage.setItem("savedConfig", JSON.stringify(selectedItems));
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

  qtyInput.addEventListener('input', e => {
    let cleaned = e.target.value.replace(/\D/g, '');
    if (cleaned === '') cleaned = '1';
    let val = parseInt(cleaned, 10);
    if (val < 1 || isNaN(val)) val = 1;
    e.target.value = val;
    selectedItems[cat].qty = val;
    totalSpan.textContent = "= " + (unitPrice * val).toLocaleString() + "₫";
    updateTotalCost(); // 🔄 tự động lưu
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

// ================== SẢN PHẨM ==================
let products = [];
let currentCategory = null;
let currentProducts = [];
let currentPage = 1;
const itemsPerPage = 10;
let activeRanges = new Set();
let currentSort = "name";

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
  if (activeRanges.size) {
    list = list.filter(p => {
      return Array.from(activeRanges).some(r => {
        if (r.endsWith("+")) return p.priceNumber >= parseInt(r);
        const [min, max] = r.split("-").map(Number);
        return p.priceNumber >= min && p.priceNumber <= max;
      });
    });
  }
  list.sort((a, b) => {
    if (currentSort === "priceAsc") return a.priceNumber - b.priceNumber || a.name.localeCompare(b.name);
    if (currentSort === "priceDesc") return b.priceNumber - a.priceNumber || a.name.localeCompare(b.name);
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

    document.querySelectorAll(".add-btn:not([disabled])").forEach(btn => {
      btn.addEventListener("click", () => {
        const id = btn.dataset.id;
        const cat = btn.dataset.cat;
        const product = products.find(p => p.id == id);
        if (product) {
          selectedItems[cat] = { product, qty: 1 };
          renderSelectedItem(cat);
          updateTotalCost(); // 🔄 tự động lưu
          overlay.classList.remove("active");
          attachRowEvents(cat);
        }
      });
    });
  }
  renderPagination();
}

// ========== ORIGINAL LINKS ==========
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
  overlay.classList.add("open");
  showProducts(cat);
}

function attachRowEvents(cat) {
  const row = document.querySelector(`a.choose-link[data-cat="${cat}"]`);
  if (!row) return;
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
      attachRowEvents(cat);
    });
  }

  const remove = row.querySelector('.remove-btn');
  if (remove && !remove.dataset.removeBound) {
    remove.dataset.removeBound = '1';
    remove.addEventListener('click', e => {
      e.preventDefault();
      e.stopPropagation();
      if (!confirm('Bạn có chắc muốn xóa sản phẩm này?')) return;
      delete selectedItems[cat];
      updateTotalCost();
      const restored = originalLinks[cat].cloneNode(true);
      row.replaceWith(restored);
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

// ====== LƯU & KHÔI PHỤC CẤU HÌNH ======
const saveBtn = document.getElementById("saveConfigBtn");

// Lưu thủ công khi bấm nút
saveBtn.addEventListener("click", () => {
  saveConfig();
  alert("✅ Cấu hình đã được lưu thành công!");
});

// Tự khôi phục khi load lại trang
window.addEventListener("DOMContentLoaded", () => {
  const saved = localStorage.getItem("savedConfig");
  if (saved) {
    try {
      const parsed = JSON.parse(saved);
      Object.assign(selectedItems, parsed);
      Object.keys(selectedItems).forEach(cat => renderSelectedItem(cat));
      updateTotalCost();
    } catch (e) {
      console.error("Lỗi khi đọc cấu hình đã lưu:", e);
    }
  }
});
