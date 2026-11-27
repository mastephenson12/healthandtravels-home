const test = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const {model, planText} = require('../saturday-plan.js');
const html = fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const source = fs.readFileSync(require('node:path').join(__dirname,'../saturday-plan.js'),'utf8');
const finder = [...html.matchAll(/<script\b[^>]*>([\s\S]*?)<\/script\s*>/gi)].find(m=>m[1].includes('const adventures ='))[1];
const context = vm.createContext({URLSearchParams, Date});
vm.runInContext(finder.split("document.getElementById('finderForm').addEventListener")[0],context);
const api = vm.runInContext('({adventures,rankAdventures,driveMinutes,sageUrl,matchDetails,originLabels,destinationGuides})',context);
const prefs = {origin:'phoenix',group:'elementary',time:'half',drive:'90',activity:'hiking',dietary:'Gluten-free',shade:true,bathrooms:true,easyWalking:true,stroller:false};
const a = api.adventures[0];
const inputs = {date:'2026-12-05',depart:'08:00',hours:'5',budget:'75',fees:'',food:'20',fuel:'10',meal:'Packed lunch',backup:'Head home'};
test('a five-hour Phoenix outing includes return travel and a usable schedule',()=>{
 const result = model(a,prefs,inputs,api);
 assert.equal(result.warning,''); assert.match(result.schedule[0],/^08:00/); assert.match(result.schedule.at(-1),/^13:00/);
 assert.match(result.schedule[1],/^08:30/); assert.match(result.schedule[4],/^12:30/);
 assert.match(result.costText,/Some costs are unknown/); assert.match(result.costText,/Budget fit is not confirmed/);
});
test('a mountain outing cannot squeeze a four-hour drive into three hours',()=>{
 const lake = api.adventures.find(a=>a.name==='Woods Canyon Lake');
 const result = model(lake,{...prefs,drive:'120'}, {...inputs,hours:'3'},api);
 assert.ok(result.warning); assert.equal(result.schedule.length,0);
 assert.throws(()=>model(lake,{...prefs,origin:'tucson'},inputs,api),/No route estimate/);
});
test('budget distinguishes free, unknown, and over-budget totals',()=>{
 assert.match(model(a,prefs,{...inputs,fees:'0'},api).costText,/estimated total: \$30.00/);
 assert.match(model(a,prefs,{...inputs,fees:'60'},api).costText,/exceed the limit by \$15.00/);
 assert.throws(()=>model(a,prefs,{...inputs,depart:'25:00'},api),/valid departure/);
 assert.match(model(a,prefs,{...inputs,depart:'23:00'},api).schedule.at(-1),/04:00 \(next day\)/);
});
test('shared text contains the whole plan, preferences, packing and usable public links',()=>{
 const result = model(a,prefs,inputs,api);
 const text = planText(a,prefs,inputs,result,[{value:'Water',checked:true}],api);
 for(const value of ['2026-12-05','Elementary-age kids','Gluten-free','Packed lunch','Head home','[x] Water','13:00','https://healthandtravels.com/papago-park-with-kids','google.com/maps/dir/'])assert.ok(text.includes(value),value);
 assert.match(text,/not verified prices/);
});
function runtime(saved, blocked=false, navigator={}) {
 class Element {
  constructor(id=''){this.id=id;this.value='';this.checked=false;this.hidden=true;this.children=[];this.listeners={};}
  addEventListener(type,fn){this.listeners[type]=fn;}
  appendChild(child){this.children.push(child);return child;}
  replaceChildren(){this.children=[];}
  querySelectorAll(){return pack;}
  reportValidity(){return true;}
  focus(){} scrollIntoView(){} select(){} remove(){}
  click(){return this.listeners.click?.({preventDefault(){}});}
 }
 const nodes = new Map(), pack = ['Forecast','Water','Directions','Bathrooms'].map(value=>Object.assign(new Element(),{value}));
 const get = id => {if(!nodes.has(id))nodes.set(id,new Element(id));return nodes.get(id);};
 const storage = new Map(saved ? [['healthTravelsDayPlan.v1',JSON.stringify(saved)]] : []);
 const document = {getElementById:get,createElement:()=>new Element(),body:new Element()};
 const ctx = vm.createContext({window:{HTDayPlanner:{...api,validPreferences:p=>p?.origin==='phoenix'},matchMedia:()=>({matches:true}),print(){}},document,currentShortlist:{preferences:prefs},localStorage:{getItem:k=>{if(blocked)throw Error();return storage.get(k)||null;},setItem:(k,v)=>{if(blocked)throw Error();storage.set(k,v);},removeItem:k=>storage.delete(k)},navigator,URL,URLSearchParams,Blob,setTimeout:()=>{}});
 vm.runInContext(source,ctx);
 function build(){get('resultGrid').listeners.click({target:{closest:()=>({dataset:{dayPlan:'0'}})}});}
 return {get,pack,storage,build};
}
test('choose, edit, save and reload restores schedule, food, costs and packing',()=>{
 const r=runtime();r.build();assert.equal(r.get('saturday-plan').hidden,false);
 Object.entries(inputs).forEach(([key,value])=>r.get('day-'+key).value=value);
 r.pack[0].checked=true;r.get('day-save').click();
 const saved=JSON.parse(r.storage.get('healthTravelsDayPlan.v1'));
 const restored=runtime(saved);
 assert.equal(restored.get('saturday-plan').hidden,false);
 assert.equal(restored.get('day-meal').value,'Packed lunch');assert.equal(restored.pack[0].checked,true);
 assert.match(restored.get('day-status').textContent,/saved day plan is back/);
 assert.equal(new URL(restored.get('day-sage').href).searchParams.get('season'),'winter');
});
test('blocked storage and copying fail visibly without losing the plan',async()=>{
 const r=runtime(null,true);r.build();r.get('day-save').click();assert.match(r.get('day-status').textContent,/blocked saving/);
 await r.get('day-copy').click();assert.equal(r.get('day-copy-fallback').hidden,false);
 assert.match(r.get('day-copy-text').value,/YOUR ARIZONA DAY PLAN/);
});
test('invalid saved data cannot reopen a plan and canceled sharing is quiet',async()=>{
 const bad=runtime({version:1,prefs,inputs:{...inputs,hours:'bad'},name:a.name,checked:[false,false,false,false]});assert.equal(bad.get('saturday-plan').hidden,true);
 const r=runtime(null,false,{share:async()=>{const e=Error();e.name='AbortError';throw e;}});r.build();const before=r.get('day-status').textContent;await r.get('day-share').click();assert.equal(r.get('day-status').textContent,before);
});
