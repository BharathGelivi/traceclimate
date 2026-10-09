export const MODEL = {name:'Rolling median / MAD',version:'1.0',window:14,threshold:4.5,minHistory:7};
export function parseCSV(text){
 if(typeof text!=='string'||text.length>500000) throw Error('CSV must be smaller than 500 KB.');
 const lines=text.trim().replace(/^\uFEFF/,'').split(/\r?\n/);
 if(lines.shift()?.trim()!=='date,value') throw Error('Use the exact header date,value. Values must be in Celsius.');
 if(lines.length<8||lines.length>2000) throw Error('Provide 8–2,000 daily readings.');
 const seen=new Set();
 const rows=lines.map((line,i)=>{const cells=line.split(',').map(s=>s.trim());const [date,v]=cells;const value=Number(v);
  if(cells.length!==2||!/^\d{4}-\d{2}-\d{2}$/.test(date)||Number.isNaN(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date) throw Error(`Invalid date at row ${i+2}.`);
  if(v===''||!Number.isFinite(value)||value<-100||value>100) throw Error(`Row ${i+2}: temperature must be between −100 and 100 °C.`);
  if(seen.has(date)) throw Error(`Duplicate date: ${date}.`);seen.add(date);return {date,value};
 });return rows.sort((a,b)=>a.date.localeCompare(b.date));
}
export function median(xs){const s=[...xs].sort((a,b)=>a-b);const n=s.length;return n%2?s[(n-1)/2]:(s[n/2-1]+s[n/2])/2;}
export function analyze(rows,model=MODEL){return rows.map((r,i)=>{
 const history=rows.slice(Math.max(0,i-model.window),i).map(x=>x.value);
 if(history.length<model.minHistory)return {...r,status:'warmup',score:null,baseline:null,reason:`Building baseline (${history.length}/${model.minHistory} prior readings).`};
 const baseline=median(history);const mad=median(history.map(v=>Math.abs(v-baseline)));const scale=Math.max(0.5,1.4826*mad);const score=Math.abs(r.value-baseline)/scale;
 return {...r,baseline,score,status:score>model.threshold?'review':'normal',reason:score>model.threshold?`${score.toFixed(1)} deviations from prior median ${baseline.toFixed(1)} °C. Review the source; unusual weather and measurement errors can both cause this.`:'Within the learned historical range.'};
});}
export function demoRows(){return Array.from({length:45},(_,i)=>({date:new Date(Date.UTC(2026,8,i+1)).toISOString().slice(0,10),value:i===28?53.4:Math.round((27+Math.sin(i*0.65)*1.4+Math.cos(i*0.31)*0.6)*10)/10}));}
export function canonical(value){if(value===null||typeof value!=='object')return JSON.stringify(value);if(Array.isArray(value))return '['+value.map(canonical).join(',')+']';return '{'+Object.keys(value).sort().map(k=>JSON.stringify(k)+':'+canonical(value[k])).join(',')+'}';}
export async function hash(value){const bytes=new TextEncoder().encode(canonical(value));const d=await crypto.subtle.digest('SHA-256',bytes);return Array.from(new Uint8Array(d),b=>b.toString(16).padStart(2,'0')).join('');}
export async function seal(rows,source){
 const header={schema:'traceclimate-evidence-v1',createdAt:new Date().toISOString(),source,units:'Celsius',model:MODEL,count:rows.length};
 let previous=await hash(header);const blocks=[];const analysis=analyze(rows);
 for(let i=0;i<rows.length;i++){const payload={index:i,reading:rows[i],analysis:analysis[i],previous};const digest=await hash(payload);blocks.push({...payload,hash:digest});previous=digest;}
 return {header,blocks,root:previous};
}
export async function verify(bundle,trustedRoot){
 if(!/^[a-f0-9]{64}$/.test(trustedRoot||''))throw Error('Paste the separately saved 64-character root fingerprint.');
 if(!bundle||bundle.header?.schema!=='traceclimate-evidence-v1'||!Array.isArray(bundle.blocks)||bundle.blocks.length<8||bundle.blocks.length>2000||bundle.header.count!==bundle.blocks.length)throw Error('Invalid evidence format or record count.');
 if(canonical(bundle.header.model)!==canonical(MODEL)||bundle.header.units!=='Celsius')throw Error('Unsupported model or units.');
 const rows=parseCSV('date,value\n'+bundle.blocks.map(b=>`${b.reading?.date},${b.reading?.value}`).join('\n'));const computed=analyze(rows);let previous=await hash(bundle.header);
 for(let i=0;i<bundle.blocks.length;i++){
  const b=bundle.blocks[i];if(b.index!==i||b.previous!==previous||canonical(b.reading)!==canonical(rows[i])||canonical(b.analysis)!==canonical(computed[i]))return {valid:false,index:i,reason:'A reading, ordering, analysis, or chain link changed.'};
  const {hash:expected,...payload}=b;previous=await hash(payload);if(previous!==expected)return {valid:false,index:i,reason:'Record fingerprint mismatch.'};
 }
 if(previous!==bundle.root||previous!==trustedRoot)return {valid:false,index:bundle.blocks.length-1,reason:'Root differs from the separately saved fingerprint.'};
 return {valid:true,count:bundle.blocks.length,root:previous,reason:'All records match the saved root. This verifies integrity, not measurement truth.'};
}
export async function fetchNASA(lat,lon,start,end,fetcher=fetch){
 if(!Number.isFinite(lat)||!Number.isFinite(lon)||lat<-90||lat>90||lon<-180||lon>180)throw Error('Enter valid latitude and longitude.');
 if(!/^\d{4}-\d{2}-\d{2}$/.test(start)||!/^\d{4}-\d{2}-\d{2}$/.test(end)||!Number.isFinite(Date.parse(start))||!Number.isFinite(Date.parse(end)))throw Error('Enter valid dates.');
 const days=(Date.parse(end)-Date.parse(start))/86400000;if(days<7||days>365)throw Error('Choose a period of 8–366 days.');
 const url=new URL('https://power.larc.nasa.gov/api/temporal/daily/point');url.search=new URLSearchParams({parameters:'T2M',community:'SB',latitude:String(lat),longitude:String(lon),start:start.replaceAll('-',''),end:end.replaceAll('-',''),format:'JSON'});
 const response=await fetcher(url,{signal:AbortSignal.timeout(30000)});if(!response.ok)throw Error(`NASA returned ${response.status}. Try again or import a CSV.`);
 const data=await response.json();const values=data.properties?.parameter?.T2M;if(!values)throw Error('NASA returned no temperature data.');
 const csv='date,value\n'+Object.entries(values).filter(([,v])=>v!==-999&&Number.isFinite(v)).map(([d,v])=>`${d.slice(0,4)}-${d.slice(4,6)}-${d.slice(6,8)},${v}`).join('\n');
 return {rows:parseCSV(csv),source:{kind:'NASA POWER',url:String(url),at:new Date().toISOString(),note:'Gridded daily 2 m air temperature; not a ground sensor or a claim of long-term climate change.'}};
}
