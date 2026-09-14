import fs from 'node:fs/promises';
const origin='https://www.duzon119.co.kr/';
await fs.mkdir('reference',{recursive:true});
const response=await fetch(origin);
const html=await response.text();
await fs.writeFile('reference/home.html',html);
console.log('Home captured');
for(const name of ['menu','link']){
 const t=await (await fetch(origin+'common/js/'+name+'.js')).text();
 await fs.writeFile('reference/'+name+'.js',t);
 console.log(name,'captured');
}
const links=await fs.readFile('reference/link.js','utf8');
const menu=await fs.readFile('reference/menu.js','utf8');
const paths=new Set([...links.matchAll(/ROOT_URL\s*\+\s*"\/?([^"\s]+\.asp)"/g)].map(m=>'/'+m[1]));
for(const m of menu.matchAll(/"(\/[^"\s]+\.asp)"/g))paths.add(m[1]);
paths.delete('/index.asp');
await fs.mkdir('reference/pages',{recursive:true});
const results=[];
for(const path of paths){
 try{
 const res=await fetch(new URL(path,origin));const text=await res.text();
 const file=path.slice(1).replaceAll('/','__')+'.html';
 await fs.writeFile('reference/pages/'+file,text);
 results.push({path,file,status:res.status,url:res.url,bytes:text.length});
 console.log(res.status,path,text.length);
 }catch(e){results.push({path,error:e.message});}
}
await fs.writeFile('reference/inventory.json',JSON.stringify(results,null,2));
