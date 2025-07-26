const newsPerPage = 10;
let currentPage = 1;

// Dữ liệu mẫu
const newsData = Array.from({ length: 75 }, (_, i) => ({
  title: `Máy tính Thánh Gióng - Tin số ${i + 1}`,
  date: `2025-07-${(i % 30 + 1).toString().padStart(2, '0')}`,
  description: `Đây là đoạn mô tả ngắn cho bản tin số ${i + 1}.`,
  image: `../img/news-img/news${(i % 7) + 1}.jpg`
}));

// ✅ Chuyển vào trong DOMContentLoaded
document.addEventListener('DOMContentLoaded', () => {
  const newsList = document.getElementById('news-list');
  const paginationContainer = document.getElementById('pagination');
  const totalPages = Math.ceil(newsData.length / newsPerPage);

  function renderNewsPage(page) {
    const start = (page - 1) * newsPerPage;
    const end = start + newsPerPage;
    const pageItems = newsData.slice(start, end);

    newsList.innerHTML = '';

    pageItems.forEach((item, index) => {
      const newsItem = document.createElement('div');
      newsItem.className = 'news-item';

      const newsId = start + index;

      newsItem.innerHTML = `
        <a href="news-detail.html?id=${newsId}" class="news-image-link">
          <img src="${item.image}" alt="Ảnh tin tức">
        </a>
        <div class="news-content">
          <a href="news-detail.html?id=${newsId}" class="news-title-link">
            <div class="news-title">${item.title}</div>
          </a>
          <div class="news-date">Cập nhật: ${item.date}</div>
          <div class="news-description">${item.description}</div>
        </div>
      `;

      newsList.appendChild(newsItem);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderPagination();
  }

  function renderPagination() {
    paginationContainer.innerHTML = '';

    const firstBtn = document.createElement('button');
    firstBtn.textContent = '<<';
    firstBtn.disabled = currentPage === 1;
    firstBtn.onclick = () => {
      currentPage = 1;
      renderNewsPage(currentPage);
    };
    paginationContainer.appendChild(firstBtn);

    let startPage, endPage;

    if (currentPage <= 4) {
      startPage = 1;
      endPage = Math.min(5, totalPages);
    } else {
      startPage = currentPage;
      endPage = Math.min(currentPage + 4, totalPages);
    }

    if (endPage - startPage + 1 < 5 && startPage > 1) {
      startPage = Math.max(1, endPage - 4);
    }

    for (let i = startPage; i <= endPage; i++) {
      const pageBtn = document.createElement('button');
      pageBtn.textContent = i;
      if (i === currentPage) {
        pageBtn.classList.add('active');
      }
      pageBtn.onclick = () => {
        currentPage = i;
        renderNewsPage(currentPage);
      };
      paginationContainer.appendChild(pageBtn);
    }

    const lastBtn = document.createElement('button');
    lastBtn.textContent = '>>';
    lastBtn.disabled = currentPage === totalPages;
    lastBtn.onclick = () => {
      currentPage = totalPages;
      renderNewsPage(currentPage);
    };
    paginationContainer.appendChild(lastBtn);
  }

  renderNewsPage(currentPage);
});
