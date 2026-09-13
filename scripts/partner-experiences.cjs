// Public, reviewed records only. Applicant contact details stay in the inbox.
const fs=require('node:fs');
function approvedExperiences(data,now=new Date()) {
  if(data.version!==1||!Array.isArray(data.experiences)) throw new Error('Invalid partner registry');
  const ids=new Set();
  return data.experiences.filter(record=>{
    if(!record.id||ids.has(record.id)) throw new Error('Missing or duplicate experience ID');
    ids.add(record.id);
    if(record.status!=='approved') return false;
    for(const key of ['name','partnerName','area','description','duration','cost','familyFit','accessibility','bathrooms','seasonality','bookingUrl','reviewedBy','reviewedAt','reviewDue','disclosure']) {
      if(typeof record[key]!=='string'||!record[key].trim()) throw new Error(`${record.id}: missing ${key}`);
    }
    if(!Array.isArray(record.sources)||!record.sources.length) throw new Error(`${record.id}: sources required`);
    for(const value of [record.bookingUrl,...record.sources]) {if(new URL(value).protocol!=='https:') throw new Error('HTTPS links required');}
    const reviewed=Date.parse(record.reviewedAt),due=Date.parse(record.reviewDue);
    if(!Number.isFinite(reviewed)||!Number.isFinite(due)||due<=reviewed||reviewed>now.getTime()) throw new Error('Invalid review dates');
    return due>now.getTime();
  });
}
module.exports={approvedExperiences};
if(require.main===module){const data=JSON.parse(fs.readFileSync(process.argv[2]||'data/partner-experiences.json','utf8'));process.stdout.write(JSON.stringify({version:1,experiences:approvedExperiences(data)},null,2)+'\n');}
