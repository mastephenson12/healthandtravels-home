(function () {
  'use strict';
  const KEY = 'healthTravelsDayPlan.v1';
  const costKeys = ['fees', 'food', 'fuel'];
  function money(value) { return value === '' || value == null ? null : Number.isFinite(Number(value)) && Number(value) >= 0 && Number(value) <= 100000 ? Number(value) : null; }
  function clock(minutes) { const day = Math.floor(minutes / 1440); const h = Math.floor(minutes % 1440 / 60); return String(h).padStart(2, '0') + ':' + String(minutes % 60).padStart(2, '0') + (day ? ' (next day)' : ''); }
  function model(a, prefs, inputs, api) {
    const drive = api.driveMinutes(a, prefs.origin);
    if (drive == null) throw new Error('No route estimate for this starting area.');
    const hours = Number(inputs.hours);
    if (!Number.isFinite(hours) || hours < 1 || hours > 16 || !/^([01]\d|2[0-3]):[0-5]\d$/.test(inputs.depart)) throw new Error('Choose a valid departure time and 1–16 hours for the day.');
    const [h, m] = inputs.depart.split(':').map(Number), start = h * 60 + m, total = Math.round(hours * 60);
    const onSite = total - drive * 2 - 30; // Allow time to park and get the group settled.
    const warning = onSite < 60 ? 'The round-trip drive and 30-minute arrival buffer leave less than an hour on site. Increase your time or choose a closer outing. This schedule is not ready to use.' : '';
    const costs = costKeys.map(key => money(inputs[key])), known = costs.filter(v => v !== null).reduce((a, b) => a + b, 0), budget = money(inputs.budget);
    const costText = (costs.every(v => v !== null) ? 'Your estimated total: $' : 'Known estimates so far: $') + known.toFixed(2) + '. ' + (costs.some(v => v === null) ? 'Some costs are unknown. ' : '') + (budget === null ? 'No spending limit entered.' : 'Family limit: $' + budget.toFixed(2) + '. ' + (known > budget ? 'Your entered costs exceed the limit by $' + (known - budget).toFixed(2) + '.' : costs.every(v => v !== null) ? '$' + (budget - known).toFixed(2) + ' remains in your estimate.' : 'Budget fit is not confirmed until all costs are entered.'));
    const meal = inputs.meal || 'Pack familiar food and water; confirm any restaurant before leaving.';
    const backup = inputs.backup || 'If access, weather or energy is unsuitable, shorten the outing or head home. Pick and check any indoor alternative before leaving.';
    const schedule = warning ? [] : [
      clock(start) + ' — Leave home. Allow about ' + drive + ' minutes one way; use live directions for your actual starting point.',
      clock(start + drive) + ' — Arrive, park, check facilities and conditions. Allow 30 minutes to get settled.',
      clock(start + drive + 30) + ' — Explore at your family’s pace. Choose the route and turnaround before setting off.',
      clock(start + drive + 30 + Math.floor(onSite / 2)) + ' — Food and energy check. ' + meal,
      clock(start + total - drive) + ' — Leave the destination. Adjust earlier if the group needs it.',
      clock(start + total) + ' — Estimated home arrival, before unexpected traffic or delays.'
    ];
    const details = api.matchDetails(a, prefs);
    const groupLabels = {toddlers:'Toddlers / preschoolers',elementary:'Elementary-age kids',teens:'Tweens / teens',mixed:'Mixed ages',adults:'Adults only'};
    const needs = [prefs.shade && 'Prioritize shade',prefs.bathrooms && 'Bathrooms matter',prefs.easyWalking && 'Prefer easy walking',prefs.stroller && 'Step-free access matters',prefs.dietary && 'Food needs: ' + prefs.dietary].filter(Boolean);
    return {warning, costText, schedule, meal, backup, needs, group:groupLabels[prefs.group], tradeoffs:details.tradeoffs.concat(a.season), directions:'https://www.google.com/maps/dir/?api=1&destination=' + encodeURIComponent(a.name + ', ' + a.area + ', Arizona'), guide:api.destinationGuides[a.name] || '/arizona'};
  }
  function planText(a, prefs, inputs, result, checks, api) {
    return ['YOUR ARIZONA DAY PLAN',a.name + ' — ' + a.area,'Date: ' + (inputs.date || 'Not chosen'),'Starting area: ' + api.originLabels[prefs.origin],'Group: ' + result.group,result.needs.join(' · '),'Planning draft: confirm route, access, hours, fees and conditions before leaving.',result.warning,'',...result.schedule,'','FOOD: ' + result.meal,'BUDGET: ' + result.costText,'Costs are your estimates, not verified prices.','BACKUP: ' + result.backup,'','BEFORE YOU CHOOSE',...result.tradeoffs,'','PACK / CHECK',...checks.map(x => (x.checked ? '[x] ' : '[ ] ') + x.value),'','Directions (confirm the correct entrance): ' + result.directions,'Guide: https://healthandtravels.com' + result.guide,'Full packing list: https://healthandtravels.com/plan-and-pack#day-hike','Safety: https://healthandtravels.com/arizona-family-hiking-safety-guide','Backup ideas: https://healthandtravels.com/arizona-family-backup-plans'].filter(x => x !== false && x != null).join('\n');
  }
  if (typeof module === 'object' && module.exports) { module.exports = {model, planText, money, clock}; return; }
  const api = window.HTDayPlanner;
  if (!api) return;
  const el = id => document.getElementById(id), panel = el('saturday-plan'), status = el('day-status');
  const fields = ['date','depart','hours','budget','fees','food','fuel','meal','backup'];
  let selected = null, prefs = null;
  const track = action => { if (typeof window.gtag === 'function') window.gtag('event', 'day_plan_' + action, {destination:selected?.name}); };
  const checks = () => [...el('day-pack').querySelectorAll('input')];
  const values = () => Object.fromEntries(fields.map(key => [key, el('day-' + key).value]));
  function node(tag, text, parent) { const n = document.createElement(tag); n.textContent = text; parent.appendChild(n); return n; }
  function current() { return model(selected, prefs, values(), api); }
  function render() {
    if (!selected || !el('day-plan-form').reportValidity()) return false;
    const result = current(), preview = el('day-plan-preview');
    preview.replaceChildren();
    el('day-plan-intro').textContent = selected.name + ' · ' + api.originLabels[prefs.origin] + ' · ' + result.group;
    node('p', 'Outing date: ' + (values().date || 'Not chosen') + ' · ' + values().hours + ' hours door to door', preview);
    if (result.needs.length) node('p', result.needs.join(' · '), preview);
    if (result.warning) node('p', result.warning, preview).className = 'day-warning';
    node('h3', 'Your flexible schedule', preview);
    const list = node('ol', '', preview); result.schedule.forEach(text => node('li', text, list));
    node('h3', 'Food and spending', preview); node('p', result.meal, preview);
    if (prefs.dietary) node('p', 'Food needs: ' + prefs.dietary + '. Confirm ingredients and preparation directly with the food provider; this plan does not verify dietary suitability.', preview);
    node('p', result.costText, preview); node('p', 'Costs are your estimates, not verified prices. The finder does not filter destinations by price.', preview);
    node('h3', 'If the day changes', preview); node('p', result.backup, preview);
    node('h3', 'Before you choose', preview); const tradeoffs = node('ul', '', preview); result.tradeoffs.forEach(text => node('li', text, tradeoffs));
    const links = node('div', '', preview); links.className = 'day-links';
    [['Directions: confirm entrance',result.directions],['Read destination guide',result.guide],['Check Arizona road conditions','https://www.az511.gov/']].forEach(([label,url]) => { node('a',label,links).href = url; });
    if (selected.conditionsUrl) node('a','Check current park alert',links).href = selected.conditionsUrl;
    const sage = new URL(api.sageUrl(selected,prefs));
    if (/^\d{4}-\d{2}-\d{2}$/.test(values().date)) { const month = Number(values().date.slice(5,7)); sage.searchParams.set('season',month >= 3 && month <= 5 ? 'spring' : month >= 6 && month <= 9 ? 'summer' : month >= 10 && month <= 11 ? 'fall' : 'winter'); }
    el('day-sage').href = sage.href;
    return true;
  }
  function text() { return planText(selected,prefs,values(),current(),checks(),api); }
  function fallback(message) { el('day-copy-fallback').hidden = false; el('day-copy-text').value = text(); el('day-copy-text').focus(); el('day-copy-text').select(); status.textContent = message + ' Your complete plan is shown below; select and copy it manually.'; }
  el('resultGrid').addEventListener('click', event => {
    const button = event.target.closest('[data-day-plan]'); if (!button) return;
    const item = api.adventures[Number(button.dataset.dayPlan)]; if (!item || !currentShortlist) return;
    if (!api.rankAdventures(currentShortlist.preferences).includes(item)) return;
    selected = item; prefs = {...currentShortlist.preferences};
    fields.forEach(key => { el('day-' + key).value = ''; });
    el('day-depart').value = '08:00'; el('day-hours').value = {short:'3',half:'5',full:'8',weekend:'8'}[prefs.time];
    checks().forEach(x => { x.checked = false; });
    panel.hidden = false; render(); status.textContent = 'Draft ready. Adjust the date, timing, food and costs, then save it.';
    el('day-copy-fallback').hidden = true; el('day-plan-title').focus({preventScroll:true}); panel.scrollIntoView({behavior:window.matchMedia('(prefers-reduced-motion: reduce)').matches?'auto':'smooth'}); track('built');
  });
  el('day-plan-form').addEventListener('submit', event => { event.preventDefault(); if (render()) { status.textContent = 'Day plan updated. Save again to keep these changes on this device.'; track('updated'); } });
  el('day-plan-form').addEventListener('input', () => { status.textContent = 'You have changes. Update or save your plan before leaving.'; });
  el('day-save').addEventListener('click', () => {
    if (!render()) return;
    try { localStorage.setItem(KEY,JSON.stringify({version:1,name:selected.name,prefs,inputs:values(),checked:checks().map(x => x.checked)})); status.textContent = 'Saved in this browser. Return to this homepage to reopen your day plan. Save again after edits.'; track('saved'); }
    catch (_) { status.textContent = 'This browser blocked saving. Download or copy your plan to keep it.'; }
  });
  el('day-copy').addEventListener('click', async () => { if (!render()) return; try { await navigator.clipboard.writeText(text()); status.textContent = 'Complete plan copied. Paste it into a message or note.'; track('copied'); } catch (_) { fallback('Automatic copying is unavailable.'); } });
  el('day-share').addEventListener('click', async () => { if (!render()) return; try { if (!navigator.share) { el('day-copy').click(); return; } await navigator.share({title:'Our Arizona day plan',text:text()}); status.textContent = 'Plan shared.'; track('shared'); } catch (error) { if (error.name !== 'AbortError') fallback('Sharing is unavailable.'); } });
  el('day-download').addEventListener('click', () => { if (!render()) return; try { const url = URL.createObjectURL(new Blob([text()],{type:'text/plain;charset=utf-8'})); const a = document.createElement('a'); a.href = url; a.download = 'arizona-day-plan.txt'; document.body.appendChild(a); a.click(); a.remove(); setTimeout(() => URL.revokeObjectURL(url),60000); status.textContent = 'Text download requested. Check Downloads; if it did not appear, use Copy Day Plan or Print / Save PDF.'; track('download_requested'); } catch (_) { fallback('The download could not start.'); } });
  el('day-print').addEventListener('click', () => { if (render()) { window.print(); track('print_requested'); } });
  el('day-sage').addEventListener('click', event => { if (!render()) event.preventDefault(); else track('sage_opened'); });
  checks().forEach(x => x.addEventListener('change', () => { status.textContent = 'Packing checks changed. Save again to keep them.'; }));
  el('day-clear').addEventListener('click', () => { try { localStorage.removeItem(KEY); status.textContent = 'Saved day plan removed from this browser. Your current draft is still open.'; } catch (_) { status.textContent = 'The browser could not remove the saved plan. Use browser site-data controls.'; } });
  el('finderForm').addEventListener('submit', () => { panel.hidden = true; selected = null; });
  el('clearShortlist').addEventListener('click', () => { panel.hidden = true; selected = null; });
  try {
    const saved = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (saved?.version === 1 && api.validPreferences(saved.prefs) && saved.inputs && fields.every(key => typeof saved.inputs[key] === 'string' && saved.inputs[key].length <= 300) && Array.isArray(saved.checked) && saved.checked.length === checks().length && saved.checked.every(x => typeof x === 'boolean')) {
      const item = api.adventures.find(a => a.name === saved.name);
      if (item && api.rankAdventures(saved.prefs).includes(item)) {
        model(item,saved.prefs,saved.inputs,api); selected = item; prefs = saved.prefs;
        fields.forEach(key => { el('day-' + key).value = saved.inputs[key]; }); checks().forEach((x,i) => { x.checked = saved.checked[i]; }); panel.hidden = false; render(); status.textContent = 'Your saved day plan is back. Recheck current access, prices and conditions before leaving.';
      }
    }
  } catch (_) { /* A blocked store or invalid save must not interrupt the finder. */ }
}());
