function toggleMenu() {
    var menu = document.getElementById("menu");
    menu.classList.toggle("open");
}

// ======== NEWS PHÂN NHÓM TỰ ĐỘNG THEO KÍCH THƯỚC MÀN HÌNH ========
const allNews = [
    {
        title: "MÁY TÍNH THÁNH GIÓNG VINH DỰ ĐỒNG HÀNH CÙNG TÁC PHẨM “TASL” CỦA GIÁO SƯ, TIẾN SĨ ĐINH VĂN HIẾN",
        image: "img/news-img/news1.jpg",
        link: "news_detail1.html"
    },
    {
        title: "Công ty Máy tính Thánh Gióng - Hành trình đổi mới cùng Diễn đàn Tăng trưởng Kinh tế Việt Nam 2025",
        image: "img/news-img/news2.jpg",
        link: "news_detail2.html"
    },
    {
        title: "Máy tính Thánh Gióng tự hào Tham dự Diễn đàn 150 Doanh nghiệp Sản xuất",
        image: "img/news-img/news3.jpg",
        link: "news_detail3.html"
    },
    {
        title: "THÔNG BÁO VỀ VIỆC HỢP TÁC VỚI HÃNG IPRO – ĐỐI TÁC CUNG CẤP MÁY VI TÍNH CHÍNH THỨC",
        image: "img/news-img/news4.jpg",
        link: "news_detail4.html"
    },
    {
        title: "THÔNG BÁO VỀ VIỆC HỢP TÁC VỚI HÃNG RAPOO – ĐỐI TÁC CUNG CẤP MÁY VI TÍNH CHÍNH THỨC",
        image: "img/news-img/news5.jpg",
        link: "news_detail5.html"
    },
    {
        title: "Công ty Máy tính Thánh Gióng đồng hành cùng Quỹ Tiến bộ TP. Đà Nẵng mang tri thức đến với học sinh Văn Yên, Yên Bái",
        image: "img/news-img/news6.jpg",
        link: "news_detail5.html"
    },
    {
        title: "Máy Tính Thánh Gióng Tự Hào Đồng Hành Cùng Ngày Hội Bình Dân Học Vụ Số 2025 Tại Hòa Bình",
        image: "img/news-img/news7.jpg",
        link: "news_detail5.html"
    }
];

let newsGroups = [];
let currentGroup = 0;

function detectGroupSize() {
    return window.innerWidth <= 800 ? 1 : 5;
}

function createNewsGroups(groupSize) {
    newsGroups = [];
    for (let i = 0; i < allNews.length; i += groupSize) {
        newsGroups.push(allNews.slice(i, i + groupSize));
    }
}

function buildDotNav() {
    const dotNav = document.querySelector(".dot-nav");
    if (!dotNav) return;
    dotNav.innerHTML = "";
    newsGroups.forEach((_, i) => {
        const dot = document.createElement("span");
        dot.classList.add("dot");
        if (i === 0) dot.classList.add("active");
        dot.onclick = () => showNewsGroup(i);
        dotNav.appendChild(dot);
    });
}

function showNewsGroup(groupIndex) {
    const container = document.getElementById("newsContainer");
    if (!container) return;

    const group = newsGroups[groupIndex];
    if (!group) return;

    container.innerHTML = "";
    group.forEach(n => {
        container.innerHTML += `
            <a href="${n.link}" class="news-box">
                <img src="${n.image}" alt="${n.title}">
                <div class="news-content">
                    <h3>${n.title}</h3>
                    <span class="news-button">Xem chi tiết</span>
                </div>
            </a>
        `;
    });

    container.style.transition = "none";
    container.style.transform = "translateX(0)";

    // Update dot active
    document.querySelectorAll(".dot").forEach((d, i) => {
        d.classList.toggle("active", i === groupIndex);
    });

    currentGroup = groupIndex;
}

function nextGroup() {
    const newIndex = (currentGroup + 1) % newsGroups.length;
    showNewsGroup(newIndex);
}

function prevGroup() {
    const newIndex = (currentGroup - 1 + newsGroups.length) % newsGroups.length;
    showNewsGroup(newIndex);
}

function initializeNews() {
    const groupSize = detectGroupSize();
    createNewsGroups(groupSize);
    buildDotNav();
    showNewsGroup(0);
}

// Khởi động
window.addEventListener("DOMContentLoaded", () => {
    initializeNews();
    setupSwipeEvents();
});

window.addEventListener("resize", () => {
    const newSize = detectGroupSize();
    if (newsGroups[0].length !== newSize) {
        initializeNews();
    }
});

// ======= Swipe trực tiếp (di chuyển theo tay) =======
function setupSwipeEvents() {
    const container = document.getElementById("newsContainer");
    if (!container) return;

    let startX = 0;
    let currentX = 0;
    let isDragging = false;

    container.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        currentX = startX;
        isDragging = true;
        container.style.transition = "none";
    });

    container.addEventListener("touchmove", (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const deltaX = currentX - startX;
        container.style.transform = `translateX(${deltaX}px)`;
    });

    container.addEventListener("touchend", () => {
        if (!isDragging) return;
        isDragging = false;
        const deltaX = currentX - startX;
        const threshold = container.offsetWidth / 4;

        container.style.transition = "transform 0.3s ease";

        if (deltaX < -threshold) {
            nextGroup();
        } else if (deltaX > threshold) {
            prevGroup();
        } else {
            container.style.transform = "translateX(0)";
        }
    });
}

// ======= NÚT BACK TO TOP =======
window.onscroll = function () {
    const btn = document.getElementById("backToTopBtn");
    if (document.body.scrollTop > 200 || document.documentElement.scrollTop > 200) {
        btn.style.display = "block";
    } else {
        btn.style.display = "none";
    }
};

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}