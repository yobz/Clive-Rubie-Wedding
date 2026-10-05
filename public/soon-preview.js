document.getElementById('replay').addEventListener('click', () => {
  document.querySelectorAll('svg path').forEach(path => {
    path.style.animation = 'none';
    void path.getBoundingClientRect();
    path.style.animation = '';
  });
});
