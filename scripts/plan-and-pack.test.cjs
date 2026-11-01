const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const path = require('node:path');
const vm = require('node:vm');
const root = path.join(__dirname, '..');
const html = fs.readFileSync(path.join(root, 'plan-and-pack.html'), 'utf8');
const script = fs.readFileSync(path.join(root, 'plan-and-pack.js'), 'utf8');

// A small DOM fixture exercises the browser-only checklist state without a service or database.
function page(initial = '{}', blocked = false, hash = '') {
  const element = (extra = {}) => ({hidden:false,dataset:{},events:{},textContent:'',attrs:{},
    addEventListener(event, fn) { this.events[event] = fn; },
    setAttribute(key, value) { this.attrs[key] = value; },
    removeAttribute(key) { delete this.attrs[key]; },
    focus() {}, scrollIntoView() {}, ...extra});
  const controls = Object.fromEntries(['storage-status','packing-progress','reset-checklist','print-checklist','checklist-tools'].map(id => [id, element()]));
  const panels = [...html.matchAll(/<section class="trip-panel" id="([^"]+)"[^>]*>([\s\S]*?)<\/section>/g)].map(([,id,markup]) => {
    const inputs = [...markup.matchAll(/data-item="([^"]+)"/g)].map(([,item]) => element({dataset:{item},checked:false}));
    const heading = element({textContent: markup.match(/<h2[^>]*>([^<]+)<\/h2>/)[1]});
    return element({id,inputs,querySelectorAll:()=>inputs,querySelector:()=>heading});
  });
  const links = panels.map(panel => element({dataset:{outing:panel.id}}));
  const inputs = panels.flatMap(panel => panel.inputs);
  const packing = element();
  let stored = initial, printed = 0;
  const document = {getElementById:id => controls[id],querySelector:()=>packing,
    querySelectorAll:selector => ({'.trip-panel':panels,'[data-outing]':links,'[data-item]':inputs})[selector]};
  const location = {hash};
  const window = element({print(){printed++;}});
  vm.runInNewContext(script,{document,location,window,history:{replaceState(_a,_b,value){location.hash=value;}},
    localStorage:{getItem(){if(blocked)throw Error('blocked');return stored;},setItem(_key,value){if(blocked)throw Error('blocked');stored=value;}}});
  const choose = id => links.find(link=>link.dataset.outing===id).events.click({preventDefault(){}});
  const check = item => {const input=inputs.find(input=>input.dataset.item===item);input.checked=true;input.events.change();};
  return {panels,controls,choose,check,get stored(){return stored;},get printed(){return printed;}};
}

test('outings save independently, restore after reload, and reset only the current list', () => {
  const first=page();first.check('hike-route');first.choose('camping');first.check('camp-tent');
  const restored=page(first.stored,false,'#camping');
  assert.match(restored.controls['packing-progress'].textContent,/1 of 12/);
  restored.controls['reset-checklist'].events.click();
  assert.match(restored.controls['packing-progress'].textContent,/0 of 12/);
  restored.choose('day-hike');
  assert.match(restored.controls['packing-progress'].textContent,/1 of 13/);
  assert.equal(restored.panels.filter(panel=>!panel.hidden).length,1);
});
test('blocked storage keeps the list usable and reports that progress is not saved', () => {
  const p=page('{}',true);p.check('hike-water');
  assert.match(p.controls['packing-progress'].textContent,/1 of 13/);
  assert.match(p.controls['storage-status'].textContent,/could not save/);
  p.choose('road-trip');assert.match(p.controls['packing-progress'].textContent,/0 of 12/);
});
test('corrupt saved data cannot inject markup and unknown hashes fall back to hiking', () => {
  const p=page('{not json',false,'#unknown');
  assert.match(p.controls['packing-progress'].textContent,/Family day hike: 0 of 13/);
  const dirty=page('{"hike-route":"<img onerror=alert(1)>","camp-tent":true}');
  assert.match(dirty.controls['packing-progress'].textContent,/0 of 13/);
});
test('print uses the browser print dialog and public links resolve to local pages', () => {
  const p=page();p.controls['print-checklist'].events.click();assert.equal(p.printed,1);
  for(const [,href] of html.matchAll(/(?:href|src)="(\/[^"#?]*)/g)){
    const decoded=decodeURIComponent(href);
    const file=path.join(root,decoded==='/'?'index.html':path.extname(decoded)?decoded:`${decoded}.html`);
    assert.ok(fs.existsSync(file),`Missing local destination ${href}`);
  }
  const ids=[...html.matchAll(/data-item="([^"]+)"/g)].map(match=>match[1]);
  assert.equal(ids.length,new Set(ids).size);
  for(const [,json] of html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)) assert.doesNotThrow(()=>JSON.parse(json));
});
