import fs from 'node:fs/promises';
import path from 'node:path';
import {load} from 'cheerio';
const origin='https://www.duzon119.co.kr';
const articles=JSON.parse(await fs.readFile('reference/board-details/index.json','utf8'));
const map=new Map(articles.map(p=>[p.path+'?idx='+p.idx,'/subpages/articles/'+p.key+'.html']));
await fs.mkdir('subpages/articles',{recursive:true});
for(const p of articles){
 const source=load(await fs.readFile('reference/board-details/'+p.key+'.html','utf8'));
 const $=load(await fs.readFile('subpages/'+p.path.slice(1).replace('.asp','.html'),'utf8'));
 const article=source('.board_view').first().clone();
 article.find('script,style,form,object,embed').remove();
 article.find('*').each((i,e)=>{for(const a of Object.keys(e.attribs||{}))if(/^on/i.test(a))source(e).removeAttr(a);});
 article.find('[src],[href]').each((i,e)=>{const a=source(e);for(const attr of ['src','href']){const val=a.attr(attr);if(!val)continue;try{const u=new URL(val,p.url);if(!['https:','http:','mailto:','tel:'].includes(u.protocol)){a.removeAttr(attr);continue}if(u.protocol==='http:')u.protocol='https:';a.attr(attr,u.href);}catch{a.removeAttr(attr)}}});
 // The original groupware image returns HTTP 401 even on the source site.
 // Keep the complete article and its public attachment instead of a broken image.
 article.find('img[src*="1ed928f1-5489-4a88-b245-47621870acef"]').replaceWith('<p class="sb-source-notice">원본 안내 이미지는 그룹웨어 인증이 필요합니다. 업데이트 안내는 아래 본문과 첨부파일에서 확인해 주세요.</p>');
 article.find('iframe[src*="youtube"]').each((i,e)=>{const id=source(e).attr('src').match(/\/embed\/([\w-]+)/)?.[1];if(id)source(e).after(`<p><a href="https://www.youtube.com/watch?v=${id}" target="_blank" rel="noopener">YouTube에서 영상 보기 ↗</a></p>`);});
 const title=source('.view_title').text().trim();
 $('title').text(title+' | 아이원소프트뱅크');
 $('.sb-content').empty().addClass('sb-article-content').append(article.toString()).append(`<p class="sb-article-back"><a class="cta" href="${p.path.replace('.asp','.html').replace(/^\//,'/subpages/')}">목록으로 돌아가기</a></p>`);
 $('.sb-preview-dialog').remove();
 await fs.writeFile('subpages/articles/'+p.key+'.html',$.html());
}
const files=[];async function walk(dir){for(const e of await fs.readdir(dir,{withFileTypes:true})){const f=path.join(dir,e.name);if(e.isDirectory())await walk(f);else if(f.endsWith('.html'))files.push(f)}}await walk('subpages');
for(const f of files){const $=load(await fs.readFile(f,'utf8'));$('a[href]').each((i,e)=>{const a=$(e),href=a.attr('href');try{const u=new URL(href,'https://local/'+f.replaceAll('\\','/'));const oldPath=u.pathname.replace(/^\/subpages\//,'/').replace(/\.html$/,'.asp');const key=oldPath+'?idx='+u.searchParams.get('idx');if(map.has(key))a.attr('href',map.get(key));else if(u.hostname==='local'&&(u.searchParams.has('mode')||Number(u.searchParams.get('page'))>1))a.attr('href',origin+oldPath+u.search);if(a.closest('.sb-preview-dialog').length||a.is('.inqSubmitBtn')||/^(주소검색|회원정보입력)$/.test(a.text().trim()))a.attr('href',origin+oldPath);}catch{}});
 const servicePath='/'+f.replaceAll('\\','/').replace(/^subpages\//,'').replace('.html','.asp');
 if(!f.includes('articles')&&$('form[data-preview-form]').length&&/\/(member|purchase)\//.test(servicePath))$('main').prepend(`<p class="sb-service-notice">접수·로그인은 기존 서비스에서 진행됩니다. <a href="${origin+servicePath}">실제 서비스로 이동 →</a></p>`);
 $('img[src^="http:"]').each((i,e)=>$(e).attr('src',$(e).attr('src').replace('http:','https:')));await fs.writeFile(f,$.html());}
console.log('Built',articles.length,'public article pages and repaired board links.');
