(() => {
  try {
    const burgers = Array.from(document.querySelectorAll('.navbar-burger'));
    burgers.forEach((el) =>
      el.addEventListener('click', (e) => {
        const target = document.getElementById(el.dataset.target);
        el.classList.toggle('is-active');
        target.classList.toggle('is-active');
      })
    );
    const toggleTheme = document.getElementById('toggle-dark-mode');
    const isDarkTheme = localStorage.getItem('theme') === 'dark';

    if (toggleTheme) {
      toggleTheme.checked = isDarkTheme;
      toggleTheme.addEventListener('change', (e) => {
        const theme = e.target.checked ? 'dark' : 'light';
        localStorage.setItem('theme', theme);
        document.body.parentElement.dataset.theme = theme;
      });
    }
    setTimeout(() => toggleTheme.classList.add('animate'), 1000);
  } catch (e) {}
})();
