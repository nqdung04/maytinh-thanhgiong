document.querySelectorAll("tr").forEach(function(row) {
    const tdText = row.querySelector("td:first-child")?.innerText || "";
    const link = row.querySelector(".choose-link");
    if (link && tdText) {
      // Tách phần tên sản phẩm sau số thứ tự
      const name = tdText.replace(/^\d+\.\s*/, "").trim();
      link.textContent = `+Chọn ${name}`;
    }
  });
