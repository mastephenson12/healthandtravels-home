(() => {
  const choice = document.getElementById('hunt-choice');
  const panels = [...document.querySelectorAll('.trip-panel')];
  const progress = document.getElementById('hunt-progress');
  function show() {
    panels.forEach(panel => { panel.hidden = panel.id !== choice.value; });
    const boxes = [...document.getElementById(choice.value).querySelectorAll('input')];
    progress.textContent = `${boxes.filter(box => box.checked).length} of ${boxes.length} discoveries noticed. Any number counts.`;
  }
  function fromHash() {
    const id = location.hash.slice(1);
    if (panels.some(panel => panel.id === id)) choice.value = id;
    show();
  }
  document.getElementById('hunt-tools').hidden = false;
  choice.addEventListener('change', show);
  document.querySelectorAll('.outing-card').forEach(link => link.addEventListener('click', () => {
    choice.value = link.hash.slice(1);
    show();
  }));
  panels.forEach(panel => panel.addEventListener('change', show));
  window.addEventListener('hashchange', fromHash);
  document.getElementById('hunt-reset').addEventListener('click', () => {
    document.getElementById(choice.value).querySelectorAll('input').forEach(box => { box.checked = false; });
    show();
  });
  document.getElementById('hunt-print').addEventListener('click', () => window.print());
  fromHash();
})();
