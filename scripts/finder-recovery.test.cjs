const test=require('node:test'),assert=require('node:assert/strict'),fs=require('node:fs'),vm=require('node:vm');
const html=fs.readFileSync(require('node:path').join(__dirname,'../index.html'),'utf8');
const marker=html.indexOf('const adventures ='),start=html.lastIndexOf('<script>',marker),end=html.indexOf('</script>',marker);
assert.ok(start>=0&&end>marker);
const context=vm.createContext({Date,URLSearchParams});
vm.runInContext(html.slice(start+8,end).split("document.getElementById('finderForm').addEventListener")[0],context);
const api=vm.runInContext('({recoveryOptions,rankAdventures,driveMinutes,timeOrder,minimumTime,sageUrl})',context);
const base={origin:'phoenix',group:'toddlers',time:'short',drive:'30',activity:'water',shade:true,bathrooms:true,stroller:true,dietary:'Vegetarian'};
test('offers a useful single change and preserves every other preference',()=>{
 const before=JSON.stringify(base),options=api.recoveryOptions(base);
 assert.ok(options.length>0&&options.length<=3);
 for(const option of options){
  const changed={...base,[option.field]:option.value};
  assert.ok(['activity','drive','time'].includes(option.field));
  const matches=api.rankAdventures(changed);assert.equal(matches.length,option.count);assert.ok(matches.length>0);
  const q=new URL(api.sageUrl(matches[0],changed)).searchParams;
  assert.equal(q.get('origin'),base.origin);assert.equal(q.get('ages'),base.group);
  assert.equal(q.get('shade'),'true');assert.equal(q.get('bathrooms'),'true');assert.equal(q.get('stroller'),'true');assert.equal(q.get('needs'),base.dietary);
 }
 assert.equal(JSON.stringify(base),before);
});
test('only suggests the smallest useful drive or time increase',()=>{
 const prefs={...base,activity:'hiking',origin:'flagstaff',drive:'30',time:'half'};
 const drive=api.recoveryOptions(prefs).find(o=>o.field==='drive');
 assert.equal(drive.value,'60');assert.equal(drive.count,1);
 const time=api.recoveryOptions({...base,activity:'water',drive:'120'}).find(o=>o.field==='time');
 assert.equal(time.value,'full');
});
test('never offers unknown routes, over-limit drives or too-long outings as matches',()=>{
 for(const origin of ['phoenix','tucson','flagstaff','sedona','prescott'])for(const time of ['short','half','full','weekend'])for(const activity of ['water','hiking','scenic','wildlife','town','cooler']){
  const prefs={...base,origin,time,activity};
  for(const option of api.recoveryOptions(prefs)){
   const changed={...prefs,[option.field]:option.value};
   for(const a of api.rankAdventures(changed)){
    assert.notEqual(api.driveMinutes(a,origin),null);assert.ok(api.driveMinutes(a,origin)<=Number(changed.drive));
    assert.ok(api.minimumTime(a)<=api.timeOrder[changed.time]);assert.ok(a.activities.includes(changed.activity));
   }
  }
 }
});
test('successful searches need no recovery; impossible single-change searches stay honest',()=>{
 assert.equal(api.recoveryOptions({...base,activity:'hiking'}).length,0);
 assert.equal(api.recoveryOptions({...base,origin:'tucson',activity:'water'}).length,0);
});
