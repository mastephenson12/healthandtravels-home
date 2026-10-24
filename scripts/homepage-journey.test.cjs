const test=require('node:test');
const assert=require('node:assert/strict');
const fs=require('node:fs');
const vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const script=[...html.matchAll(/<script(?: [^>]*)?>([\s\S]*?)<\/script>/g)].find(m=>m[1].includes('const adventures ='))[1];
const context=vm.createContext({URLSearchParams,Date});
vm.runInContext(script.split("document.getElementById('finderForm').addEventListener")[0],context);
const api=vm.runInContext('({adventures,rankAdventures,driveMinutes,sageUrl,card})',context);
const prefs={origin:'phoenix',group:'toddlers',time:'half',drive:'90',activity:'hiking',dietary:'Gluten-free',shade:true,bathrooms:false,stroller:true};

test('every outing preserves the chosen place, origin, ages and independent needs without auto-building',()=>{
 for(const a of api.adventures){
  const url=new URL(api.sageUrl(a,prefs));
  assert.equal(url.hostname,'sage.healthandtravels.com');
  assert.equal(url.pathname,'/trip-builder');
  assert.equal(url.searchParams.get('origin'),'phoenix');
  assert.equal(url.searchParams.get('ages'),'toddlers');
  assert.equal(url.searchParams.get('shade'),'true');
  assert.equal(url.searchParams.get('bathrooms'),'false');
  assert.equal(url.searchParams.get('stroller'),'true');
  assert.equal(url.searchParams.get('needs'),'Gluten-free');
  assert.equal(url.searchParams.has('plan'),false);
  assert.equal(url.searchParams.get('utm_source'),'healthandtravels');
 }
 const riparian=api.adventures.find(a=>a.name.startsWith('Riparian'));
 assert.equal(new URL(api.sageUrl(riparian,prefs)).searchParams.get('location'),'riparian-preserve-at-water-ranch');
});

test('all origins and drive ranges honor limits and never borrow unknown Phoenix routes',()=>{
 for(const origin of ['phoenix','tucson','flagstaff','sedona','prescott'])for(const drive of ['30','60','90','120']){
  const results=api.rankAdventures({...prefs,origin,drive});
  assert.ok(results.length<=3);
  for(const a of results){const minutes=api.driveMinutes(a,origin);assert.notEqual(minutes,null);assert.ok(minutes<=Number(drive));}
 }
 assert.equal(api.rankAdventures({...prefs,origin:'flagstaff',drive:'30'}).length,0);
 assert.equal(api.rankAdventures({...prefs,origin:'tucson',drive:'90'})[0].name,'Boyce Thompson Arboretum');
 assert.equal(api.driveMinutes(api.adventures.find(a=>a.name==='Woods Canyon Lake'),'tucson'),null);
});

test('adults and teen families retain their selected group',()=>{
 const a=api.adventures[0];
 const adults=new URL(api.sageUrl(a,{...prefs,group:'adults',origin:'prescott'}));
 assert.equal(adults.searchParams.get('kids'),'no');
 assert.equal(adults.searchParams.get('origin'),'prescott');
 const teens=new URL(api.sageUrl(a,{...prefs,group:'teens'}));
 assert.equal(teens.searchParams.get('ages'),'teens');
});

test('shorter outings and unverified step-free access have visible tradeoffs',()=>{
 const papago=api.adventures.find(a=>a.name==='Papago Park');
 const card=api.card(papago,{...prefs,time:'full'},0);
 assert.match(card,/Shorter stop/);
 assert.match(card,/Step-free access is not verified/);
});

test('Estrella no longer promises regular bathrooms or a full-day outing',()=>{
 const a=api.adventures.find(a=>a.name==='Estrella Mountain Regional Park');
 assert.equal(a.bathrooms,'Confirm current facilities');
 assert.equal(a.times.includes('full'),false);
 assert.match(api.card(a,prefs,0),/Current park alert/);
 assert.match(a.why,/October 24, 2026/);
});
