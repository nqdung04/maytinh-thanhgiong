document.addEventListener("DOMContentLoaded", function () {
  // Tự động xác định bạn đang ở home.html hay trang con
  const currentPath = window.location.pathname;
  const isHomePage = currentPath.endsWith("/home.html") || currentPath === "/" || currentPath.endsWith("index.html");

  const imgPrefix = isHomePage ? "img/" : "../img/";
  const linkPrefix = isHomePage ? "product_list/" : "../product_list/";

  products = [
    {
      id: "nc300",
      name: "Máy Tính Model NC300",
      img: imgPrefix + "product-img/nc300.png",
      category: "nc300",
      link: linkPrefix + "product_nc300.html",
    },
    {
      id: "nc300i",
      name: "Máy Tính Model NC300i",
      img: imgPrefix + "product-img/nc300i.png",
      category: "nc300",
      link: linkPrefix + "product_nc300i.html",
    },
    // ... Các sản phẩm còn lại cũng dùng imgPrefix & linkPrefix tương tự
    {
      id: "nc500",
      name: "Máy Tính Model NC500",
      img: imgPrefix + "product-img/nc500.png",
      category: "nc500",
      link: linkPrefix + "product_nc500.html",
    },
    {
      id: "nc500i",
      name: "Máy Tính Model NC500i",
      img: imgPrefix + "product-img/nc500i.png",
      category: "nc500",
      link: linkPrefix + "product_nc500i.html",
    },
    {
      id: "nc800",
      name: "Máy Tính Model NC800",
      img: imgPrefix + "product-img/nc800.png",
      category: "nc800",
      link: linkPrefix + "product_nc800.html",
    },
    {
      id: "nc800i",
      name: "Máy Tính Model NC800i",
      img: imgPrefix + "product-img/nc800i.png",
      category: "nc800",
      link: linkPrefix + "product_nc800i.html",
    },
    {
      id: "nc900",
      name: "Máy Tính Model NC900",
      img: imgPrefix + "product-img/nc900.png",
      category: "nc900",
      link: linkPrefix + "product_nc900.html",
    },
    {
      id: "nc900i",
      name: "Máy Tính Model NC900i",
      img: imgPrefix + "product-img/nc900i.png",
      category: "nc900",
      link: linkPrefix + "product_nc900i.html",
    },
    // thêm nhiều sản phẩm ở đây
  ];

  function createProductCard(product) {
    return `
    <div class="product-link">
      <div class="product">
        <a href="${product.link}">
          <img src="${product.img}" alt="${product.name}" />
        </a>
        <a class="call-button" href="tel:0993888000">
          <strong>Gọi mua hàng: 0993 888 000</strong>
        </a>
      </div>
    </div>
  `;
  }

  function renderAllProducts() {
    const containers = {
      nc300: document.getElementById("nc300-container"),
      nc500: document.getElementById("nc500-container"),
      nc800: document.getElementById("nc800-container"),
      nc900: document.getElementById("nc900-container"),
    };

    products.forEach((product) => {
      const card = createProductCard(product);
      if (containers[product.category]) {
        containers[product.category].insertAdjacentHTML("beforeend", card);
      }
    });
  }

  renderAllProducts();
});
