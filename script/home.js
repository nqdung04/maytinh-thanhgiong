// Toggle menu
function toggleMenu() {
    var menu = document.getElementById("menu");
    menu.classList.toggle("open");
}

// ======== DỮ LIỆU TIN TỨC ========
const allNews = [
    {
        title: "MÁY TÍNH THÁNH GIÓNG VINH DỰ ĐỒNG HÀNH CÙNG TÁC PHẨM “TASL” CỦA GIÁO SƯ, TIẾN SĨ ĐINH VĂN HIẾN",
        image: "img/news-img/news1.jpg",
        link: "https://www.thanhgiong.com.vn/may-tinh-thanh-giong-vinh-du-dong-hanh-cung-tac-pham-tasl-cua-giao-su-tien-si-dinh-van-hien-bv7581/"
    },
    {
        title: "Công ty Máy tính Thánh Gióng - Hành trình đổi mới cùng Diễn đàn Tăng trưởng Kinh tế Việt Nam 2025",
        image: "img/news-img/news2.jpg",
        link: "https://www.thanhgiong.com.vn/cong-ty-may-tinh-thanh-giong-doi-moi-cung-dien-dan-kinh-te-bv7580/"
    },
    {
        title: "Máy tính Thánh Gióng tự hào Tham dự Diễn đàn 150 Doanh nghiệp Sản xuất",
        image: "img/news-img/news3.jpg",
        link: "https://www.thanhgiong.com.vn/may-tinh-thanh-giong-tham-du-dien-dan-150-doanh-nghiep-bv7579/"
    },
    {
        title: "THÔNG BÁO HỢP TÁC VỚI HÃNG IPRO – CUNG CẤP MÁY TÍNH CHÍNH THỨC",
        image: "img/news-img/news4.jpg",
        link: "https://www.thanhgiong.com.vn/thong-bao-hop-tac-hang-ipro-bv7578/"
    },
    {
        title: "THÔNG BÁO HỢP TÁC VỚI HÃNG RAPOO – CUNG CẤP MÁY TÍNH CHÍNH THỨC",
        image: "img/news-img/news5.jpg",
        link: "https://www.thanhgiong.com.vn/thong-bao-hop-tac-hang-rapoo-bv7576/"
    },
    {
        title: "Đồng hành cùng Quỹ Tiến bộ TP. Đà Nẵng mang tri thức đến học sinh Yên Bái",
        image: "img/news-img/news6.jpg",
        link: "https://www.thanhgiong.com.vn/thanh-giong-cung-quy-tien-bo-tp-da-nang-bv7573/"
    },
    {
        title: "Đồng Hành Cùng Ngày Hội Bình Dân Học Vụ 2025 Tại Hòa Bình",
        image: "img/news-img/news7.jpg",
        link: "https://www.thanhgiong.com.vn/ngay-hoi-binh-dan-hoc-vu-2025-bv7567/"
    }
];

let newsGroups = [];
let currentGroup = 0;

// ======= TẠO NHÓM THEO KÍCH THƯỚC MÀN HÌNH =======
function detectGroupSize() {
    return window.innerWidth <= 800 ? 1 : 5;
}

function createNewsGroups(groupSize) {
    newsGroups = [];
    for (let i = 0; i < allNews.length; i += groupSize) {
        newsGroups.push(allNews.slice(i, i + groupSize));
    }
}

// ======= HIỂN THỊ DOT ĐIỀU HƯỚNG =======
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

// ======= HIỂN THỊ NHÓM TIN TỨC =======
function showNewsGroup(groupIndex) {
    const container = document.getElementById("newsContainer");
    if (!container) return;

    const group = newsGroups[groupIndex];
    if (!group) return;

    container.innerHTML = "";
    group.forEach(n => {
        container.innerHTML += `
            <a href="${n.link}" class="news-box" target="_blank">
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

// ======= SỰ KIỆN SWIPE + DRAG =======
function setupSwipeEvents() {
    const container = document.getElementById("newsContainer");
    if (!container) return;

    let startX = 0;
    let currentX = 0;
    let isDragging = false;
    let dragMoved = false;

    // === Touch (mobile) ===
    container.addEventListener("touchstart", (e) => {
        startX = e.touches[0].clientX;
        isDragging = true;
        dragMoved = false;
        container.style.transition = "none";
    });

    container.addEventListener("touchmove", (e) => {
        if (!isDragging) return;
        currentX = e.touches[0].clientX;
        const deltaX = currentX - startX;
        if (Math.abs(deltaX) > 5) dragMoved = true;
        container.style.transform = `translateX(${deltaX}px)`;
    });

    container.addEventListener("touchend", (e) => {
        if (!isDragging) return;
        isDragging = false;
        const deltaX = currentX - startX;
        const threshold = container.offsetWidth / 4;
        container.style.transition = "transform 0.3s ease";
        if (deltaX < -threshold) nextGroup();
        else if (deltaX > threshold) prevGroup();
        else container.style.transform = "translateX(0)";
    });

    // === Mouse (PC) ===
    let isMouseDown = false;
    let startMouseX = 0;

    container.addEventListener("mousedown", (e) => {
        isMouseDown = true;
        dragMoved = false;
        startMouseX = e.pageX;
        container.style.transition = "none";
        container.style.cursor = "grabbing";
        e.preventDefault();
    });

    container.addEventListener("mousemove", (e) => {
        if (!isMouseDown) return;
        const deltaX = e.pageX - startMouseX;
        if (Math.abs(deltaX) > 5) dragMoved = true;
        container.style.transform = `translateX(${deltaX}px)`;
    });

    container.addEventListener("mouseup", (e) => {
        if (!isMouseDown) return;
        isMouseDown = false;
        const deltaX = e.pageX - startMouseX;
        const threshold = container.offsetWidth / 4;
        container.style.transition = "transform 0.3s ease";
        if (deltaX < -threshold) nextGroup();
        else if (deltaX > threshold) prevGroup();
        else container.style.transform = "translateX(0)";
        container.style.cursor = "grab";
    });

    container.addEventListener("mouseleave", () => {
        if (isMouseDown) {
            isMouseDown = false;
            container.style.transition = "transform 0.3s ease";
            container.style.transform = "translateX(0)";
            container.style.cursor = "grab";
        }
    });

    // === Ngăn click nếu vừa drag ===
    container.addEventListener("click", (e) => {
        if (dragMoved) {
            e.preventDefault();
            e.stopPropagation();
        }
    }, true); // dùng capture phase để chặn sớm
}

// ======= NÚT BACK TO TOP =======
window.onscroll = function () {
    const btn = document.getElementById("backToTopBtn");
    btn.style.display = (document.documentElement.scrollTop > 200) ? "block" : "none";
};

function scrollToTop() {
    window.scrollTo({ top: 0, behavior: "smooth" });
}

// ======= KHỞI TẠO =======
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
