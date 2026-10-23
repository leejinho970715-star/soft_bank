// Captures the SEO head tags of the existing duzon119.co.kr pages into reference/seo-meta.json,
// keyed by the renewal page that replaces each one (tools/apply-seo-meta.mjs writes them back).
// The site's firewall turns away plain HTTP clients, so a real browser reads the pages.
import fs from 'node:fs/promises';
import path from 'node:path';
// Needs Playwright (npx playwright or a local install); PLAYWRIGHT may point at its index.mjs.
const {chromium}=await import(process.env.PLAYWRIGHT||'playwright');

const origin='https://www.duzon119.co.kr';
async function walk(dir){const files=[];for(const entry of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())files.push(...await walk(file));else if(file.endsWith('.html'))files.push(file);}return files;}
const pages=new Map([['index.html',[origin+'/']]]);
for(const file of await walk('subpages')){
 const page=file.replaceAll('\\','/'),html=await fs.readFile(file,'utf8');
 const article=page.match(/^subpages\/articles\/(.+)__(\d+)\.html$/);
 if(article){pages.set(page,[`${origin}/${article[1].replaceAll('__','/')}.asp?mode=view&idx=${article[2]}`]);continue;}
 const preview=html.match(/<dialog class="sb-preview-dialog">[\s\S]*?<a href="([^"]+)"/);
 const own=origin+'/'+page.replace(/^subpages\//,'').replace(/\.html$/,'.asp');
 pages.set(page,preview?[...new Set([own,preview[1]])]:[own]);
}
// A preview link that points at another page's own URL is not this page's source (the IFRS 18 page is new).
const owns=new Set([...pages.values()].map(urls=>urls[0]));
for(const [page,urls] of pages)pages.set(page,urls.filter((url,i)=>i===0||!owns.has(url)));
const browser=await chromium.launch({executablePath:process.env.CHROMIUM||'/opt/pw-browsers/chromium',...(process.env.HTTPS_PROXY?{proxy:{server:process.env.HTTPS_PROXY}}:{})});
const context=await browser.newContext({userAgent:'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/130.0 Safari/537.36'});
const result={};
const read=async(page,url)=>{
 const tab=await context.newPage();
 try{
  const response=await tab.goto(url,{waitUntil:'domcontentloaded',timeout:45000});
  if(!response||response.status()>=400)return null;
  const head=await tab.evaluate(()=>({
   title:document.title,
   meta:[...document.head.querySelectorAll('meta[name],meta[property]')].map(m=>[m.getAttribute('name')?'name':'property',m.getAttribute('name')||m.getAttribute('property'),m.getAttribute('content')||'']),
   canonical:document.head.querySelector('link[rel=canonical]')?.getAttribute('href')||'',
   jsonld:[...document.querySelectorAll('script[type="application/ld+json"]')].map(s=>s.textContent.trim()),
   notFound:!document.querySelector('#container,#contents,.board_view,main,#wrap')
  }));
  return head.title?{url,...head}:null;
 }catch{return null;}finally{await tab.close();}
};
const entries=[...pages];
for(let n=0;n<entries.length;n+=4){
 await Promise.all(entries.slice(n,n+4).map(async([page,urls])=>{for(const url of urls){const head=await read(page,url);if(head&&!/WebKnight|404|페이지를 찾을 수/.test(head.title)){result[page]=head;return;}}console.log('no source',page,urls.join(' '));}));
}
await browser.close();
const sorted=Object.fromEntries(Object.keys(result).sort().map(key=>[key,result[key]]));
await fs.writeFile('reference/seo-meta.json',JSON.stringify(sorted,null,1)+'\n');
console.log(`SEO head tags captured for ${Object.keys(result).length} of ${pages.size} pages`);
