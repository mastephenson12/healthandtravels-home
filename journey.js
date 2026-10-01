(() => {
  'use strict';
  // Native GET submission keeps the cross-site handoff usable without JavaScript.
  document.getElementById('adventure-finder').addEventListener('submit', () => {
    if (typeof window.gtag === 'function') window.gtag('event', 'adventure_finder_submit', {
      origin: document.getElementById('origin').value,
      group: document.getElementById('group').value,
      trip_length: document.getElementById('length').value,
      interest: document.getElementById('interest').value,
      source_page: 'unified_homepage'
    });
  });
  try {
    const saved = JSON.parse(localStorage.getItem('healthTravelsShortlist') || 'null');
    if (saved && Array.isArray(saved.destinations) && saved.destinations.length) {
      document.getElementById('legacy-shortlist').hidden = false;
    }
  } catch (_) { /* Planning works even when browser storage is unavailable. */ }
})();
