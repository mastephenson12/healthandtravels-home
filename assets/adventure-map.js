(() => {
'use strict';
const $=id=>document.getElementById(id);
const search=$('resource-search'),category=$('resource-category'),grid=$('resource-grid'),status=$('catalog-status'),mapStatus=$('map-status'),load=$('load-map'),canvas=$('google-map');
let catalog,map,markers=[],line,lastRoute,overview,overviewMarkers;
const fallback=$('fallback-map'),fallbackStatus=$('fallback-status'),legend=$('map-legend');
function initOverview(){
 if(!window.L){fallbackStatus.textContent='Map library unavailable. Browse the guides below.';return;}
 fallback.hidden=false;
 overview=L.map(fallback,{scrollWheelZoom:false}).setView([34.3,-111.8],7);
 const tiles=L.tileLayer('https://tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:19,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(overview);
 tiles.on('tileerror',()=>{fallbackStatus.textContent='Some map imagery is unavailable. Destination markers and guides remain usable.';});
 overviewMarkers=L.layerGroup().addTo(overview);
 fallbackStatus.textContent='Overview map · select a colored marker to explore a destination.';
}
function showOverview(items){
 if(!overview)return;
 overviewMarkers.clearLayers();const bounds=[];
 for(const r of items){
  const marker=L.circleMarker([r.lat,r.lng],{radius:9,color:'#fff',weight:2,fillColor:catalog.categories[r.category].color,fillOpacity:1});
  const popup=document.createElement('div'),name=document.createElement('strong');name.textContent=r.name;
  popup.append(name,document.createElement('br'),link('Read guide',r.guide),document.createElement('br'),link('Open in Google Maps','https://www.google.com/maps/search/?'+new URLSearchParams({api:'1',query:r.name+', Arizona'})));
  marker.bindPopup(popup).addTo(overviewMarkers);bounds.push([r.lat,r.lng]);
 }
 if(bounds.length===1)overview.setView(bounds[0],11);else if(bounds.length>1)overview.fitBounds(bounds,{padding:[25,25],maxZoom:10});
}
function buildLegend(){legend.replaceChildren();for(const c of Object.values(catalog.categories)){const span=document.createElement('span'),dot=document.createElement('i');dot.style.background=c.color;span.append(dot,document.createTextNode(c.label));legend.append(span);}}
function link(label,url){const a=document.createElement('a');a.textContent=label;a.href=url;return a;}
function drawRoute(){
 if(!map||!lastRoute)return;
 if(line)line.setMap(null);
 const path=google.maps.geometry.encoding.decodePath(lastRoute);
 if(!path.length)return;
 line=new google.maps.Polyline({map,path,strokeColor:'#2563eb',strokeWeight:5});
 const bounds=new google.maps.LatLngBounds();path.forEach(p=>bounds.extend(p));map.fitBounds(bounds);
}
function render(){
 if(!catalog)return;
 const items=catalog.resources.filter(r=>(!category.value||r.category===category.value)&&r.name.toLowerCase().includes(search.value.trim().toLowerCase()));
 grid.replaceChildren();markers.forEach(m=>m.setMap(null));markers=[];
 const bounds=map?new google.maps.LatLngBounds():null;
 for(const r of items){
  const article=document.createElement('article'),title=document.createElement('h3'),tag=document.createElement('p');
  title.textContent=r.name;tag.textContent=catalog.categories[r.category].label;tag.style.color=catalog.categories[r.category].color;
  article.append(title,tag,link('Read guide',r.guide),document.createTextNode(' · '),link('Google Maps','https://www.google.com/maps/search/?'+new URLSearchParams({api:'1',query:r.name+', Arizona'})));
  grid.append(article);
  if(map){const position={lat:r.lat,lng:r.lng};const marker=new google.maps.Marker({map,position,title:r.name,icon:{path:google.maps.SymbolPath.CIRCLE,scale:8,fillColor:catalog.categories[r.category].color,fillOpacity:1,strokeColor:'#fff',strokeWeight:2}});marker.addListener('click',()=>{article.scrollIntoView({block:'nearest'});article.querySelector('a').focus();});markers.push(marker);bounds.extend(position);}
 }
 if(map&&items.length){if(items.length===1){map.setCenter(bounds.getCenter());map.setZoom(11);}else map.fitBounds(bounds);}
 showOverview(items);
 status.textContent=items.length+' resources · '+catalog.coordinateNote;
}
search.addEventListener('input',render);category.addEventListener('change',render);
initOverview();
fetch('https://sage.healthandtravels.com/adventure-resources.json',{signal:AbortSignal.timeout(10000)}).then(r=>{if(!r.ok)throw Error();return r.json();}).then(data=>{if(data.schemaVersion!==1||!Array.isArray(data.resources))throw Error();catalog=data;buildLegend();for(const [value,c] of Object.entries(data.categories)){const option=document.createElement('option');option.value=value;option.textContent=c.label;category.append(option);}render();}).catch(()=>{status.textContent='Shared catalog temporarily unavailable. Starter guides remain available.';});
window.addEventListener('adventure-route',e=>{lastRoute=e.detail;drawRoute();});
for(const id of ['origin','destination'])$(id).addEventListener('change',()=>{lastRoute=null;if(line){line.setMap(null);line=null;}});
load.addEventListener('click',async()=>{
 load.disabled=true;
 try{
 const response=await fetch('/api/maps-config');if(!response.ok)throw Error();const {key}=await response.json();if(!key)throw Error();
 await new Promise((resolve,reject)=>{const script=document.createElement('script');const cb='initializeAdventureGoogleMap';const timer=setTimeout(()=>{delete window[cb];reject(Error());},15000);window[cb]=()=>{clearTimeout(timer);delete window[cb];resolve();};script.onerror=()=>{clearTimeout(timer);delete window[cb];reject(Error());};script.src='https://maps.googleapis.com/maps/api/js?'+new URLSearchParams({key,callback:cb,libraries:'geometry',loading:'async',v:'quarterly'});document.head.append(script);});
 canvas.hidden=false;map=new google.maps.Map(canvas,{center:{lat:34.3,lng:-111.8},zoom:7,streetViewControl:false,mapTypeControl:false});render();drawRoute();mapStatus.textContent='Map pins are approximate; confirm entrances and trailheads.';load.hidden=true;fallback.hidden=true;fallbackStatus.textContent='Google Maps view active.';
 }catch{canvas.hidden=true;map=null;fallback.hidden=!overview;mapStatus.textContent='Google Maps is not available right now. The overview map and directions links still work.';load.disabled=false;if(overview)overview.invalidateSize();}
});
})();