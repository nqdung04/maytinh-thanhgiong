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
