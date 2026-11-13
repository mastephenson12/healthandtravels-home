const { test } = require('node:test');
const assert = require('node:assert/strict');
const fs = require('node:fs');
const vm = require('node:vm');
const path = require('node:path');
const source = fs.readFileSync(path.resolve(__dirname, '../ai-referral-tracking.js'), 'utf8');
function run({site='midsizeai',url='https://www.midsizeai.com/guides/test/?secret=private',referrer='',existing=true,gpc=false}={}) {
 const calls=[],listeners={},loads=[];
 const window={}; if(existing)window.gtag=(...args)=>calls.push(args);
 const document={referrer,currentScript:{getAttribute:n=>n==='data-ga-id'?'G-TEST123':site},head:{appendChild:x=>loads.push(x)},createElement:()=>({}),addEventListener:(name,fn)=>listeners[name]=fn};
 const context={window,document,navigator:{globalPrivacyControl:gpc},location:new URL(url),URL,URLSearchParams,Date};
 vm.runInNewContext(source,context);
 return {calls,listeners,loads,window,again:()=>vm.runInNewContext(source,context)};
}
test('recognizes exact AI hosts and strips sensitive URL material',()=>{
 const r=run({referrer:'https://www.perplexity.ai/search/private-question?email=private'});
 assert.equal(r.calls[0][1],'ai_referral_visit');assert.equal(r.calls[0][2].ai_platform,'perplexity');
 assert.equal(r.calls[0][2].attribution_evidence,'referrer');assert.equal(r.calls[0][2].page_location,'https://www.midsizeai.com/guides/test/');
 assert(!JSON.stringify(r.calls).includes('private'));r.again();assert.equal(r.calls.length,1);
});
test('allowlisted UTM and referrer evidence remain distinct; no broad host matches',()=>{
 const r=run({url:'https://www.midsizeai.com/?utm_source=chatgpt.com&email=private'});assert.equal(r.calls[0][2].attribution_evidence,'utm_source');
 for(const referrer of ['https://chatgpt.com.evil.test/','https://www.google.com/search','https://www.bing.com/search',''])assert.equal(run({referrer}).calls.length,0);
});
test('existing tag is reused; missing tag is initialized once; privacy optout skips',()=>{
 assert.equal(run().loads.length,0);const r=run({existing:false});assert.equal(r.loads.length,1);assert.equal(r.window.dataLayer[1][0],'config');r.again();assert.equal(r.loads.length,1);
 const off=run({gpc:true,existing:false});assert.equal(off.loads.length,0);assert.equal(Object.keys(off.listeners).length,0);
});
test('click events capture fixed intent only, not form or URL contents',()=>{
 const r=run();r.listeners.click({target:{closest:()=>({href:'https://apply.midsizeai.com/application?email=private'})}});
 assert.equal(r.calls[0][2].action_name,'contractor_audit_handoff');assert(!JSON.stringify(r.calls).includes('private'));
 r.listeners.click({target:{closest:()=>({href:'https://evil.test/downloads/file'})}});assert.equal(r.calls.length,1);
 const h=run({site:'healthandtravels',url:'https://healthandtravels.com/'});h.listeners.click({target:{closest:()=>({href:'https://newsletter.healthandtravels.com/subscribe?email=private'})}});assert.equal(h.calls[0][2].action_name,'newsletter_handoff');
});
test('completion events whitelist actual fixed event labels and never forward details',()=>{
 const r=run();r.listeners['site:measurement']({detail:{action:'estimate_review_completed',estimate:'private'}});assert.equal(r.calls[0][1],'estimate_review_completed');assert(!JSON.stringify(r.calls).includes('private'));
 r.listeners['site:measurement']({detail:{action:'fake_lead'}});assert.equal(r.calls.length,1);
 r.listeners['site:measurement']({detail:{action:'estimate_sample_completed'}});assert.equal(r.calls[1][1],'estimate_sample_completed');
});
