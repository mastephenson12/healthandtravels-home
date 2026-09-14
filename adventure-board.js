(function () {
  'use strict';

  var STORAGE_KEY = 'healthandtravels.adventureBoard.v1';
  var BOARD_URL = '/my-arizona-adventure';
  var PAGE_DESTINATIONS = {
    '/sedona-with-kids-family-trip-guide': {slug:'sedona',name:'Sedona & Oak Creek',region:'Red Rock Country',drive:'About 2 hours from Phoenix',shade:'Limited',bathrooms:'Available at major trailheads',kidFit:'Very good',guide:'/sedona-with-kids-family-trip-guide'},
    '/flagstaff-with-kids-family-weekend-guide': {slug:'flagstaff',name:'Flagstaff & Williams',region:'High Country',drive:'About 2.5 hours from Phoenix',shade:'Good',bathrooms:'Widely available',kidFit:'Very good',guide:'/flagstaff-with-kids-family-weekend-guide'},
    '/payson-mogollon-rim-family-weekend-guide': {slug:'payson',name:'Payson & Mogollon Rim',region:'Rim Country',drive:'About 2 hours from Phoenix',shade:'Good',bathrooms:'Available seasonally',kidFit:'Very good',guide:'/payson-mogollon-rim-family-weekend-guide'},
    '/papago-park-with-kids': {slug:'papago-park',name:'Papago Park',region:'Phoenix',drive:'Local Phoenix drive',shade:'Limited',bathrooms:'Available in developed areas',kidFit:'Very good',guide:'/papago-park-with-kids'},
    '/tonto-natural-bridge-with-kids': {slug:'tonto-natural-bridge',name:'Tonto Natural Bridge',region:'Payson',drive:'About 2 hours from Phoenix',shade:'Some',bathrooms:'Available',kidFit:'Good',guide:'/tonto-natural-bridge-with-kids'},
    '/woods-canyon-lake-with-kids': {slug:'woods-canyon-lake',name:'Woods Canyon Lake',region:'Mogollon Rim',drive:'About 2 hours from Phoenix',shade:'Good',bathrooms:'Available seasonally',kidFit:'Very good',guide:'/woods-canyon-lake-with-kids'},
    '/estrella-mountain-regional-park-family-guide': {slug:'estrella-mountain',name:'Estrella Mountain Regional Park',region:'West Valley',drive:'About 45 minutes from Phoenix',shade:'Limited',bathrooms:'Available',kidFit:'Good',guide:'/estrella-mountain-regional-park-family-guide'},
    '/catalina-state-park-with-kids': {slug:'catalina-state-park',name:'Catalina State Park',region:'Tucson',drive:'About 2 hours from Phoenix',shade:'Limited',bathrooms:'Available',kidFit:'Good',guide:'/catalina-state-park-with-kids'},
    '/one-perfect-family-day-in-yuma': {slug:'yuma',name:'Yuma Family Day',region:'Southwest Arizona',drive:'About 3 hours from Phoenix',shade:'Varies',bathrooms:'Available at planned stops',kidFit:'Good',guide:'/one-perfect-family-day-in-yuma'}
  };

  function read() {
    try {
      var value = JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
      return Array.isArray(value) ? value : [];
    } catch (_) { return []; }
  }

  function write(items) {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
    window.dispatchEvent(new CustomEvent('ht:adventure-board-change', {detail:{items:items}}));
  }

  function normalize(item) {
    return {
      slug: String(item.slug || '').trim(),
      name: String(item.name || '').trim(),
      region: String(item.region || 'Arizona').trim(),
      drive: String(item.drive || 'Check route from your starting point').trim(),
      shade: String(item.shade || 'Varies').trim(),
      bathrooms: String(item.bathrooms || 'Verify before leaving').trim(),
      kidFit: String(item.kidFit || 'Check guide details').trim(),
      guide: String(item.guide || '/arizona').trim(),
      savedAt: new Date().toISOString()
    };
  }

  function saveDestination(item) {
    item = normalize(item);
    if (!item.slug || !item.name) return read();
    var items = read().filter(function (saved) { return saved.slug !== item.slug; });
    items.unshift(item);
    write(items.slice(0, 12));
    return items;
  }

  function removeDestination(slug) {
    var items = read().filter(function (item) { return item.slug !== slug; });
    write(items);
    return items;
  }

  function has(slug) {
    return read().some(function (item) { return item.slug === slug; });
  }

  function updateButtons() {
    var items = read();
    document.querySelectorAll('[data-adventure-save]').forEach(function (button) {
      var saved = items.some(function (item) { return item.slug === button.dataset.slug; });
      button.textContent = saved ? 'Saved to My Adventure ✓' : 'Save to My Adventure';
      button.setAttribute('aria-pressed', saved ? 'true' : 'false');
      button.classList.toggle('is-saved', saved);
    });
    document.querySelectorAll('[data-adventure-count]').forEach(function (node) {
      node.textContent = String(items.length);
    });
  }

  function destinationFromButton(button) {
    return {
      slug: button.dataset.slug,
      name: button.dataset.name,
      region: button.dataset.region,
      drive: button.dataset.drive,
      shade: button.dataset.shade,
      bathrooms: button.dataset.bathrooms,
      kidFit: button.dataset.kidFit,
      guide: button.dataset.guide
    };
  }

  function addFloatingGuideControl() {
    var path = window.location.pathname.replace(/\.html$/, '').replace(/\/$/, '') || '/';
    var item = PAGE_DESTINATIONS[path];
    if (!item || document.querySelector('[data-adventure-save]')) return;
    var wrap = document.createElement('div');
    wrap.className = 'ht-adventure-save';
    wrap.innerHTML = '<button type="button" data-adventure-save>Save this place</button><a href="' + BOARD_URL + '">My Board (<span data-adventure-count>0</span>)</a>';
    var button = wrap.querySelector('button');
    Object.keys(item).forEach(function (key) { button.dataset[key] = item[key]; });
    document.body.appendChild(wrap);
  }

  function addStyles() {
    if (document.getElementById('ht-adventure-board-styles')) return;
    var style = document.createElement('style');
    style.id = 'ht-adventure-board-styles';
    style.textContent = '.ht-adventure-save{position:fixed;right:18px;bottom:18px;z-index:9998;display:flex;align-items:center;gap:8px;padding:8px;background:#fff;border:1px solid #dbe5e2;border-radius:14px;box-shadow:0 12px 35px rgba(15,23,42,.18);font-family:Inter,Arial,sans-serif}.ht-adventure-save button,.ht-adventure-save a,[data-adventure-save]{min-height:42px;padding:10px 14px;border-radius:9px;border:1px solid #0f766e;background:#0f766e;color:#fff;font:800 12px/1 Inter,Arial,sans-serif;text-decoration:none;cursor:pointer}.ht-adventure-save a{background:#fff;color:#0f766e}.ht-adventure-save button.is-saved,[data-adventure-save].is-saved{background:#ecfdf5;color:#065f46}@media(max-width:560px){.ht-adventure-save{left:10px;right:10px;bottom:10px;justify-content:center}.ht-adventure-save button,.ht-adventure-save a{flex:1;text-align:center}}';
    document.head.appendChild(style);
  }

  document.addEventListener('click', function (event) {
    var button = event.target.closest('[data-adventure-save]');
    if (!button) return;
    event.preventDefault();
    saveDestination(destinationFromButton(button));
    updateButtons();
    if (typeof window.gtag === 'function') window.gtag('event', 'adventure_saved', {destination:button.dataset.slug, source_page:window.location.pathname});
  });

  window.addEventListener('storage', updateButtons);
  window.addEventListener('ht:adventure-board-change', updateButtons);
  window.HTAdventureBoard = {read:read, saveDestination:saveDestination, removeDestination:removeDestination, has:has, storageKey:STORAGE_KEY};

  function init() { addStyles(); addFloatingGuideControl(); updateButtons(); }
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', init); else init();
}());
