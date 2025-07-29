const newsPerPage = 10;
let currentPage = 1;

document.addEventListener('DOMContentLoaded', () => {
  const newsList = document.getElementById('news-list');
  const paginationContainer = document.getElementById('pagination');
  let newsData = [];

  // Load dữ liệu từ file JSON
  fetch('../data/news_data.json')
    .then(response => response.json())
    .then(data => {
      newsData = data;
      renderNewsPage(currentPage);
    })
    .catch(error => {
      console.error("Lỗi tải dữ liệu tin tức:", error);
      newsList.innerHTML = "<p>Không thể tải dữ liệu tin tức.</p>";
    });

  function renderNewsPage(page) {
    const start = (page - 1) * newsPerPage;
    const end = start + newsPerPage;
    const pageItems = newsData.slice(start, end);

    newsList.innerHTML = '';

    pageItems.forEach((item) => {
      const newsItem = document.createElement('div');
      newsItem.className = 'news-item';

      // Xác định href và target
      let href = '';
      let target = '';

      if (item.link && item.link.startsWith('http')) {
        // Link ngoài
        href = item.link;
        target = ' target="_blank"';
      } else {
        // Link nội bộ
        href = `news-detail.html?id=${item.id}`;
        target = '';
      }

      newsItem.innerHTML = `
      <a href="${href}" class="news-image-link"${target}>
        <img src="${item.image}" alt="Ảnh tin tức">
      </a>
      <div class="news-content">
        <a href="${href}" class="news-title-link"${target}>
          <div class="news-title">${item.title}</div>
        </a>
        <div class="news-date">Cập nhật: ${item.date}</div>
      </div>
    `;

      newsList.appendChild(newsItem);
    });

    window.scrollTo({ top: 0, behavior: 'smooth' });
    renderPagination(newsData.length);
  }


  function renderPagination(totalItems) {
    const totalPages = Math.ceil(totalItems / newsPerPage);
    paginationContainer.innerHTML = '';

    const firstBtn = document.createElement('button');
    firstBtn.textContent = '<<';
    firstBtn.disabled = currentPage === 1;
    firstBtn.onclick = () => {
      currentPage = 1;
      renderNewsPage(currentPage);
    };
    paginationContainer.appendChild(firstBtn);

    let startPage = Math.max(1, currentPage - 2);
    let endPage = Math.min(totalPages, startPage + 4);

    if (endPage - startPage < 4) {
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
});
