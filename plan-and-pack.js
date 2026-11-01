(() => {
  'use strict';
  const key = 'health-travels-plan-pack-v1';
  const packing = document.querySelector('.packing');
  const panels = [...document.querySelectorAll('.trip-panel')];
  const links = [...document.querySelectorAll('[data-outing]')];
  const inputs = [...document.querySelectorAll('[data-item]')];
  const status = document.getElementById('storage-status');
  const progress = document.getElementById('packing-progress');
  let active = panels[0];
  let saved = {};
  let storageAvailable = true;
  try {
    const parsed = JSON.parse(localStorage.getItem(key) || '{}');
    if (parsed && typeof parsed === 'object' && !Array.isArray(parsed)) saved = parsed;
  } catch { storageAvailable = false; }
  for (const input of inputs) input.checked = saved[input.dataset.item] === true;
  const update = () => {
    const items = [...active.querySelectorAll('[data-item]')];
    const checked = items.filter(input => input.checked).length;
    const name = active.querySelector('h2').textContent;
    progress.textContent = `${name}: ${checked} of ${items.length} checked`;
    status.textContent = storageAvailable
      ? 'Checkmarks saved in this browser on this device. They are not sent to Health & Travels.'
      : 'Checkmarks work for this visit, but this browser could not save them. Print or save a PDF to keep your list.';
  };
  const persist = () => {
    for (const input of inputs) saved[input.dataset.item] = input.checked;
    try { localStorage.setItem(key, JSON.stringify(saved)); storageAvailable = true; }
    catch { storageAvailable = false; }
    update();
  };
  const select = (id, focus = false) => {
    active = panels.find(panel => panel.id === id) || panels[0];
    for (const panel of panels) panel.hidden = panel !== active;
    for (const link of links) {
      if (link.dataset.outing === active.id) link.setAttribute('aria-current', 'true');
      else link.removeAttribute('aria-current');
    }
    update();
    if (focus) active.querySelector('h2').focus({ preventScroll: true });
  };
  for (const link of links) link.addEventListener('click', event => {
    event.preventDefault();
    select(link.dataset.outing, true);
    try { history.replaceState(null, '', `#${active.id}`); } catch { /* Checklist still works without URL updates. */ }
    document.getElementById('checklist-tools').scrollIntoView({ behavior: 'auto', block: 'start' });
  });
  for (const input of inputs) input.addEventListener('change', persist);
  document.getElementById('reset-checklist').addEventListener('click', () => {
    for (const input of active.querySelectorAll('[data-item]')) input.checked = false;
    persist();
  });
  document.getElementById('print-checklist').addEventListener('click', () => window.print());
  window.addEventListener('hashchange', () => {
    const id = location.hash.slice(1);
    if (panels.some(panel => panel.id === id)) select(id);
  });
  packing.dataset.enhanced = 'true';
  document.getElementById('checklist-tools').hidden = false;
  select(location.hash.slice(1));
})();
