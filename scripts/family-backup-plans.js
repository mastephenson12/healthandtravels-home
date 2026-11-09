'use strict';
const form = document.getElementById('backup-filters');
const city = document.getElementById('city');
const reason = document.getElementById('reason');
const options = [...document.querySelectorAll('.option')];
const guidance = {
  all: 'Pick one stop, confirm today’s details, and keep the rest of the day flexible.',
  heat: 'Choose indoor time or rest. A shorter exposed hike can still be too hot. Check the forecast and venue hours before traveling.',
  rain: 'Thunder or a weather warning? Reach a safe enclosed building or hard-topped vehicle and follow official instructions first. Do not drive through floodwater. Compare these indoor options only when travel is safe.',
  closed: 'Respect closure signs and designated parking. Check the land manager’s notice; a different trail may share the same closure. These alternatives let you change the type of outing.',
  tired: 'Start with rest, food and a restroom, then decide whether to continue. A quiet stop or heading home can be the whole backup plan.',
  late: 'Choose one short stop and check its closing time before paying or driving. Leave enough time for parking, food and the trip back.'
};
function updateOptions() {
  let count = 0;
  for (const option of options) {
    const matches = (city.value === 'all' || option.dataset.city === city.value) && (reason.value === 'all' || option.dataset.reasons.split(' ').includes(reason.value));
    option.hidden = !matches;
    if (matches) count++;
  }
  document.getElementById('result-count').textContent = `${count} backup ${count === 1 ? 'option' : 'options'}`;
  document.getElementById('empty-state').hidden = count > 0;
  document.getElementById('reason-guidance').textContent = guidance[reason.value];
  document.getElementById('share-status').textContent = '';
  const url = new URL(window.location.href);
  for (const input of [city, reason]) input.value === 'all' ? url.searchParams.delete(input.name) : url.searchParams.set(input.name, input.value);
  window.history.replaceState(null, '', url);
}
const query = new URLSearchParams(window.location.search);
for (const input of [city, reason]) {
  const value = query.get(input.name);
  if ([...input.options].some(option => option.value === value)) input.value = value;
}
form.addEventListener('change', updateOptions);
form.addEventListener('submit', event => event.preventDefault());
form.addEventListener('reset', () => { city.value = 'all'; reason.value = 'all'; updateOptions(); });
document.getElementById('print-plan').addEventListener('click', () => window.print());
document.getElementById('share-plan').addEventListener('click', async () => {
  const status = document.getElementById('share-status');
  try { await navigator.clipboard.writeText(window.location.href); status.textContent = 'Link copied.'; }
  catch { status.textContent = 'Copy this page’s address from your browser to share these choices.'; }
});
updateOptions();
