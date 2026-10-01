import fs from 'node:fs/promises';
import {load} from 'cheerio';
// Read-only audit; never submits a form. --cached reuses the last public snapshots.
const cache='reference/live-forms';
const cached=process.argv.includes('--cached');
await fs.mkdir(cache,{recursive:true});
const inventory=JSON.parse(await fs.readFile('reference/inventory.json','utf8'));
const report=[];
async function original(path,file){
 if(cached)return fs.readFile(`${cache}/${file}`,'utf8');
 const response=await fetch(`https://www.duzon119.co.kr${path}`,{signal:AbortSignal.timeout(25000)});
 if(!response.ok)throw new Error(`HTTP ${response.status}: ${path}`);
 const html=await response.text();await fs.writeFile(`${cache}/${file}`,html);return html;
}
function fields($,form){
 return $(form).find('input:not([type=hidden]):not([type=submit]),select,textarea').toArray().map(el=>({
  tag:el.tagName,name:$(el).attr('name')||'',maxlength:$(el).attr('maxlength')||'',
  choice:$(el).is('[type=checkbox],[type=radio]')?$(el).attr('value')||'':null,
  options:$(el).find('option').map((i,o)=>[$(o).attr('value'),$(o).text().trim()].join(':')).get()
 }));
}
function compare(path,live,local){
 const a=load(live),b=load(local);const forms=[];
 for(const form of a('form').toArray()){
  const name=a(form).attr('name'),id=a(form).attr('id');
  const target=b('form').toArray().find(f=>id&&b(f).attr('id')===id||name&&b(f).attr('name')===name);
  const expected=fields(a,form),actual=target?fields(b,target):null;
  forms.push({name:name||id||'',matches:JSON.stringify(expected)===JSON.stringify(actual),expected,actual});
 }
 report.push({path,forms});
}
for(const item of inventory){
 const destination='subpages'+item.path.replace(/\.asp$/,'.html');
 let local;try{local=await fs.readFile(destination,'utf8')}catch{continue}
 if(!load(local)('form').length)continue;
 compare(item.path,await original(item.path,item.file),local);
}
const home=load(await original('/','home.html'));
const app=await fs.readFile('app.js','utf8');
const card=load(app.match(/cardDialog\.innerHTML = `([\s\S]+?)`;/)[1]);
card('form').attr('id','cardnewsForm');
compare('/ (cardnews)',home('#cardnewsForm').toString(),card.html());
const join=load(await fs.readFile('subpages/member/join.html','utf8'));
join('form').attr('name','Join');
const source=load(await fs.readFile('reference/member-join.html','utf8'));
compare('/member/join.asp (saved reference)',source('form[name=Join]').toString(),join.html());
await fs.writeFile(`${cache}/comparison.json`,JSON.stringify(report,null,2));
const forms=report.flatMap(page=>page.forms.map(form=>({...form,path:page.path})));
const differences=forms.filter(form=>!form.matches);
console.log(`${forms.length} forms in ${report.length} sources; ${differences.length} field differences`);
for(const form of differences)console.log(form.path,form.name,JSON.stringify({expected:form.expected,actual:form.actual}));
if(differences.length)process.exitCode=1;
