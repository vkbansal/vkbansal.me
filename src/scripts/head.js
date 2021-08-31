(() => {
  try {
    const mql = window.matchMedia('(prefers-color-scheme: dark)');
    const theme = localStorage.getItem('theme');
    document.body.parentElement.dataset.theme = theme ? theme : mql.matches ? 'dark' : 'light';
  } catch (e) {}
})();
