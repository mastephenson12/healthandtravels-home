document.getElementById('partner-form').addEventListener('submit',event=>{
  event.preventDefault();
  const form=event.currentTarget;
  if(!form.reportValidity()) return;
  const data=new FormData(form);
  const draft=['Arizona Local Partner Pilot','',...['name','business','email','area','website','category','experience'].map(key=>`${({name:'Name',business:'Organization',email:'Reply email',area:'Arizona area',website:'Public website',category:'Experience type',experience:'Proposed experience'})[key]}: ${String(data.get(key)||'Not provided').trim()}`),'','I can represent this organization and would like a reply about the pilot.'].join('\n');
  document.getElementById('email-draft').value=draft;
  document.getElementById('email-link').href='mailto:helpme@healthandtravels.com?subject='+encodeURIComponent('Arizona partner pilot introduction')+'&body='+encodeURIComponent(draft);
  document.getElementById('draft-panel').hidden=false;
  document.getElementById('draft-panel').scrollIntoView({behavior:'smooth',block:'start'});
  document.getElementById('email-draft').focus();
});
document.getElementById('copy-draft').addEventListener('click',async()=>{
  const draft=document.getElementById('email-draft');
  try {await navigator.clipboard.writeText(draft.value);document.getElementById('draft-status').textContent='Copied. Paste this into an email to helpme@healthandtravels.com and send it. Nothing has been submitted here.';}
  catch {draft.focus();draft.select();document.getElementById('draft-status').textContent='Select and copy the draft above, then email it to helpme@healthandtravels.com. Nothing has been submitted here.';}
});
