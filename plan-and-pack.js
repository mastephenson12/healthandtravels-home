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
  const checklistSnapshot = () => {
    const title = active.querySelector('h2').textContent;
    const lines = ['Health & Travels — ' + title, '', active.querySelector('.panel-heading > p:last-child').textContent, ''];
    for (const group of active.querySelectorAll('fieldset')) {
      lines.push(group.querySelector('legend').textContent);
      for (const input of group.querySelectorAll('[data-item]')) {
        lines.push(`${input.checked ? '[x]' : '[ ]'} ${input.closest('label').textContent.trim()}`);
      }
      lines.push('');
    }
    lines.push(active.querySelector('.notice').textContent.trim(), '',
      'Adapt this starter list for your family and conditions. Check current official alerts before leaving.',
      'This is a snapshot; later checkmarks do not update this file.',
      `https://healthandtravels.com/plan-and-pack#${active.id}`);
    return { title, text: lines.join('\n') + '\n' };
  };
  const share = document.getElementById('share-checklist');
  if (typeof navigator !== 'undefined' && typeof navigator.share === 'function') {
    share.hidden = false;
    share.addEventListener('click', async () => {
      const message = document.getElementById('download-status');
      share.disabled = true;
      try {
        await navigator.share(checklistSnapshot());
        message.textContent = 'Checklist shared. This copy includes your current checkmarks; later changes will not update it.';
      } catch (error) {
        if (error && error.name === 'AbortError') message.textContent = 'Sharing canceled. Your checklist is unchanged.';
        else message.textContent = 'This browser could not share the checklist. Use Download checklist or Print / save PDF instead.';
      } finally {
        share.disabled = false;
      }
    });
  }
  document.getElementById('download-checklist').addEventListener('click', () => {
    const message = document.getElementById('download-status');
    let url;
    let link;
    try {
      const { text } = checklistSnapshot();
      url = URL.createObjectURL(new Blob([text], { type: 'text/plain;charset=utf-8' }));
      link = document.createElement('a');
      link.href = url;
      link.download = `health-and-travels-${active.id}-checklist.txt`;
      document.body.appendChild(link);
      link.click();
      message.textContent = 'Your checklist download was requested. Check Downloads or save the opened text in your Files app. Open it once before leaving to confirm it is available offline.';
    } catch {
      message.textContent = 'This browser could not download the checklist. Use Print / save PDF to keep a copy instead.';
    } finally {
      if (link) link.remove();
      if (url) window.setTimeout(() => URL.revokeObjectURL(url), 60000);
    }
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
