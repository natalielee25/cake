let currentPage = null;

export function navigateTo(pageId) {
  const next = document.getElementById(pageId);
  if (!next) return;

  if (currentPage) {
    currentPage.classList.remove('page-active');
    currentPage.classList.add('page-exit');
    setTimeout(() => {
      currentPage.classList.remove('page-exit');
      currentPage.style.display = 'none';
      showPage(next);
    }, 400);
  } else {
    showPage(next);
  }
}

function showPage(el) {
  el.style.display = 'flex';
  requestAnimationFrame(() => {
    requestAnimationFrame(() => {
      el.classList.add('page-active');
      currentPage = el;
    });
  });
  window.scrollTo({ top: 0, behavior: 'smooth' });
}

export function initNavigation(startPageId) {
  document.querySelectorAll('.page').forEach((p) => {
    p.style.display = 'none';
  });
  const start = document.getElementById(startPageId);
  if (start) {
    start.style.display = 'flex';
    requestAnimationFrame(() => {
      start.classList.add('page-active');
      currentPage = start;
    });
  }
}
