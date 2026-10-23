import fs from 'node:fs/promises';
import {load} from 'cheerio';

// Carries the SEO head tags of the existing duzon119.co.kr pages (captured by tools/fetch-seo-meta.mjs)
// over to the renewal pages that replace them: title, description, keywords, robots, search console
// verification, Open Graph, Twitter cards and the schema.org JSON-LD blocks.
// Address fields (canonical, og:url, twitter:url and the URLs inside JSON-LD) point at the renewal
// page on the same domain, and images at copies kept in assets/seo/, so nothing refers to .asp
// pages that the renewal no longer serves. The viewport tag stays the renewal's own.
const site='https://www.duzon119.co.kr';
const captured=JSON.parse(await fs.readFile('reference/seo-meta.json','utf8'));
const newUrl=page=>page==='index.html'?site+'/':`${site}/${page}`;
const assetUrl=file=>`${site}/assets/seo/${file}`;

// Old address -> renewal address, for the links inside JSON-LD.
const oldKey=url=>{try{const u=new URL(url);if(!/(^|\.)duzon119\.co\.kr$/.test(u.hostname))return null;const idx=u.searchParams.get('idx');return u.pathname.toLowerCase().replace(/\/index\.asp$/,'/')+(idx&&u.searchParams.get('mode')==='view'?`?idx=${idx}`:'');}catch{return null;}};
const addresses=new Map();
for(const [page,head] of Object.entries(captured)){const key=oldKey(head.url);if(key&&!addresses.has(key))addresses.set(key,newUrl(page));}
const images={'/images/og_images.jpg':assetUrl('og_images.jpg'),'/images/logo_2026_on.png':assetUrl('logo_2026_on.png')};
const rewrite=value=>{
 if(Array.isArray(value))return value.map(rewrite);
 if(value&&typeof value==='object'){
  const out={};
  for(const [key,item] of Object.entries(value)){
   // The renewal has no site search page, so the search box action is dropped.
   if(key==='potentialAction'&&item?.['@type']==='SearchAction')continue;
   if(key==='item'&&typeof item==='string'&&!addresses.has(oldKey(item))&&oldKey(item)!=='/')continue;
   out[key]=rewrite(item);
  }
  return out;
 }
 if(typeof value==='string'&&/^https?:\/\/(www\.)?duzon119\.co\.kr/i.test(value)){
  const u=new URL(value),image=images[u.pathname];
  if(image)return image;
  const key=oldKey(value);
  return key==='/'?site+'/':addresses.get(key)||value;
 }
 return value;
};
const metaValue=(head,kind,name)=>head.meta.find(([k,n])=>k===kind&&n===name)?.[2];
const common=captured['index.html'];
const siteNames=['HandheldFriendly','format-detection','naver-site-verification','google-site-verification','theme-color','apple-mobile-web-app-capable','apple-mobile-web-app-status-bar-style','apple-mobile-web-app-title','referrer','robots'];

async function walk(dir){const files=[];for(const entry of await fs.readdir(dir,{withFileTypes:true})){const file=`${dir}/${entry.name}`;if(entry.isDirectory())files.push(...await walk(file));else if(file.endsWith('.html'))files.push(file);}return files;}

let changed=0;
for(const page of ['index.html',...await walk('subpages')]){
 if(page==='subpages/index.html')continue;
 const source=await fs.readFile(page,'utf8');
 const $=load(source),head=captured[page];
 const url=newUrl(page);
 let tags;
 if(head){
  tags={title:head.title,meta:head.meta.filter(([kind,name])=>name!=='viewport').map(([kind,name,content])=>[kind,name,
   /^(og|twitter):url$/.test(name)?url:/^(og|twitter):image$/.test(name)?rewrite(content):content]),
   jsonld:head.jsonld.map(text=>{try{return JSON.stringify(rewrite(JSON.parse(text)));}catch{return null;}}).filter(Boolean)};
 }else{
  // Pages new to the renewal (IFRS 18) keep their own title and description, with the site-wide tags around them.
  const title=$('title').text(),description=$('meta[name=description]').attr('content')||metaValue(common,'name','description');
  tags={title,meta:[
   ...siteNames.map(name=>['name',name,metaValue(common,'name',name)]).filter(([,,content])=>content!=null),
   ['name','keywords',metaValue(common,'name','keywords')],['name','description',description],
   ['property','og:type','website'],['property','og:title',title],['property','og:site_name',metaValue(common,'property','og:site_name')],['property','og:locale','ko_KR'],['property','og:url',url],
   ['property','og:image',assetUrl('og_images.jpg')],['property','og:image:width','1200'],['property','og:image:height','630'],['property','og:description',description],
   ['name','twitter:card','summary_large_image'],['name','twitter:title',title],['name','twitter:url',url],['name','twitter:image',assetUrl('og_images.jpg')],['name','twitter:description',description]
  ],jsonld:common.jsonld.slice(0,2).map(text=>JSON.stringify(rewrite(JSON.parse(text))))};
 }
 $('head meta[name]:not([name=viewport]),head meta[property],head link[rel=canonical],head link[rel=manifest],head script[type="application/ld+json"]').remove();
 const anchor=$('head meta[name=viewport]').first();
 const block=[];
 for(const [kind,name,content] of tags.meta)block.push($('<meta>').attr(kind,name).attr('content',content));
 block.push($('<link rel="canonical">').attr('href',url));
 for(const json of tags.jsonld)block.push($(`<script type="application/ld+json">${json.replace(/</g,'\\u003c')}</script>`));
 if(anchor.length)anchor.after(block);else $('head').prepend(block);
 $('head title').first().text(tags.title);
 const html=$.html();
 if(html!==source){await fs.writeFile(page,html);changed++;}
}
console.log(`SEO head tags applied to ${changed} pages`);
