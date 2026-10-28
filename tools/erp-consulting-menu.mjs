import fs from 'node:fs/promises';
import path from 'node:path';
import {load} from 'cheerio';

// 'ERP 가상 컨설팅 진단' sits at the end of the header menu, in the point blue, and in the footer menu.
// It opens the separate diagnosis app in a new tab.
const url='https://erptest-jet.vercel.app/';
const label='ERP 가상 컨설팅 진단';
async function walk(dir){const files=[];for(const entry of await fs.readdir(dir,{withFileTypes:true})){const file=path.join(dir,entry.name);if(entry.isDirectory())files.push(...await walk(file));else if(file.endsWith('.html'))files.push(file);}return files;}

let changed=0;
for(const file of ['index.html',...await walk('subpages')]){
 const source=await fs.readFile(file,'utf8');
 if(!source.includes('class="site-header'))continue;
 const $=load(source);
 const link=cls=>$('<a>').attr({class:cls,href:url,target:'_blank',rel:'noopener noreferrer'}).text(label);
 $('.site-header .gnb .gnb-erp, footer>nav .footer-erp').remove();
 $('.site-header .gnb').append($('<div class="gnb-item gnb-erp"></div>').append(link('gnb-link')));
 $('footer>nav').append(link('footer-erp'));
 const html=$.html();
 if(html!==source){await fs.writeFile(file,html);changed++;}
}
console.log(`ERP consulting menu added to ${changed} pages`);
