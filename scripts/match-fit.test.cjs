const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const script=[...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)].find(m=>m[1].includes('const adventures ='))[1];
const initial={origin:'phoenix',group:'toddlers',time:'half',drive:'90',activity:'hiking',dietary:'',shade:true,bathrooms:true,stroller:true};
function browser(storage={}){
 const options={origin:['','phoenix','tucson','flagstaff','sedona','prescott'],group:['','toddlers','elementary','teens','mixed','adults'],time:['short','half','full','weekend'],drive:['30','60','90','120'],activity:['hiking','scenic','water','wildlife','town','cooler'],dietary:['','Vegetarian','Gluten-free']};
 const elements=new Map();
 const get=id=>{if(!elements.has(id))elements.set(id,{value:initial[id],checked:initial[id],options:(options[id]||[]).map(value=>({value})),hidden:false,textContent:'',innerHTML:'',handlers:{},addEventListener(event,fn){this.handlers[event]=fn},classList:{add(){},remove(){}},focus(){},scrollIntoView(){},reset(){}});return elements.get(id)};
 const store=key=>({getItem(){if(storage[key] instanceof Error)throw storage[key];return storage[key]||null},setItem(_,value){if(storage[key] instanceof Error)throw storage[key];storage[key]=value},removeItem(){if(storage[key] instanceof Error)throw storage[key];delete storage[key]}});
 const localStorage=store('local'),sessionStorage=store('session');
 const document={getElementById:get,querySelector:get,querySelectorAll:()=>[]};
 const window={localStorage,sessionStorage,matchMedia:()=>({matches:true})};
 const ctx=vm.createContext({document,window,localStorage,sessionStorage,URLSearchParams,Date});
 vm.runInContext(script,ctx);
 return {get,storage,api:vm.runInContext('({rankAdventures,matchDetails,shadeAlternative,card,shortlistText,validSavedChoices})',ctx),submit(){get('finderForm').handlers.submit({preventDefault(){}})}};
}
test('shade and bathroom preferences affect ranking with candid reasons, no access guarantee',()=>{
 const {api}=browser();const ranked=api.rankAdventures(initial);
 assert.equal(ranked[0].name,'Boyce Thompson Arboretum');
 const papago=ranked.find(a=>a.name==='Papago Park');
 const card=api.card(papago,initial,1,ranked);
 assert.match(card,/Why it made your shortlist/);assert.match(card,/30 min estimated one way/);
 assert.match(card,/Shade is limited/);assert.match(card,/Step-free access is not verified/);
 assert.match(card,/Want more shade\? Compare Boyce Thompson/);
 assert.match(card,/Continuous shade is not verified/);
 assert.doesNotMatch(card,/98%|perfect match/i);
 assert.match(api.shortlistText(ranked,initial),/Before choosing:.*shade/i);
});
test('alternatives never exceed selected origin, time, activity or drive limits',()=>{
 const {api}=browser();
 for(const origin of ['phoenix','tucson','sedona','flagstaff','prescott'])for(const drive of ['30','60','90','120']){
  const prefs={...initial,origin,drive};const ranked=api.rankAdventures(prefs);
  for(const a of ranked){const other=api.shadeAlternative(a,prefs,ranked);if(other)assert.ok(ranked.includes(other));}
 }
 const prefs={...initial,drive:'30'};const ranked=api.rankAdventures(prefs);
 assert.match(api.card(ranked[0],prefs,0,ranked),/No more-shaded option is in this shortlist/);
});
test('submitted choices return without an explicit save, and the explicit save remains separate',()=>{
 const storage={};const first=browser(storage);first.submit();
 assert.ok(storage.session);assert.equal(storage.local,undefined);
 const back=browser(storage);assert.equal(back.get('origin').value,'phoenix');
 assert.match(back.get('resultsSummary').textContent,/Welcome back/);
 assert.match(back.get('resultGrid').innerHTML,/Before you choose/);
 back.get('saveShortlist').handlers.click();assert.ok(storage.local);
 back.get('clearShortlist').handlers.click();assert.equal(storage.local,undefined);assert.equal(storage.session,undefined);
});
test('corrupt or blocked storage falls back and never renders stored markup or links',()=>{
 const saved=browser();saved.submit();saved.get('saveShortlist').handlers.click();
 const storage={local:saved.storage.local,session:'bad json'};const restored=browser(storage);
 assert.match(restored.get('resultsSummary').textContent,/Welcome back/);
 const malicious=JSON.parse(storage.local);malicious.preferences.origin='<img onerror=alert(1)>';
 const invalid=browser({session:JSON.stringify(malicious)});assert.equal(invalid.get('resultGrid').innerHTML,'');
 const blocked=browser({session:new Error('blocked'),local:new Error('blocked')});
 assert.doesNotThrow(()=>blocked.submit());assert.match(blocked.get('returnNotice').textContent,/could not remember/);
});
test('zero-match preferences restore with a reachable clear control',()=>{
 const storage={};const first=browser(storage);first.get('origin').value='flagstaff';first.get('drive').value='30';first.submit();
 const back=browser(storage);assert.match(back.get('resultsSummary').textContent,/No outings/);
 assert.equal(back.get('clearShortlist').hidden,false);assert.equal(back.get('.save-plan').hidden,true);
 assert.ok(html.indexOf('id="clearShortlist"')<html.indexOf('<details class="save-plan">'));
});
