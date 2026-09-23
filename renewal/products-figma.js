document.addEventListener('DOMContentLoaded',()=>{
 const syncWidth=()=>document.documentElement.style.setProperty('--product-viewport',document.documentElement.clientWidth+'px');
 syncWidth();window.addEventListener('resize',syncWidth);
 // Split descriptive headings into two balanced lines, retaining inline emphasis.
 const headings=[...document.querySelectorAll('.sb-content h2,.sb-content h3,.sb-content h5,.sb-content .txt>strong')]
  .filter(el=>!el.closest('.sb-product-heading,.sb-product-tabs')&&!['Amaranth 10','ONE AI','IFRS18','WEHAGO','OmniEsol','PMS'].includes(el.textContent.trim()));
 for(const heading of headings){
  const originalBreaks=[...heading.querySelectorAll('br')];
  let preferredOffset=null;
  if(originalBreaks.length===1){const range=document.createRange();range.selectNodeContents(heading);range.setEndBefore(originalBreaks[0]);preferredOffset=range.toString().length;}
  heading.querySelectorAll('br').forEach(br=>br.replaceWith(document.createTextNode(' ')));
  const walker=document.createTreeWalker(heading,NodeFilter.SHOW_TEXT);
  const nodes=[];let node;while(node=walker.nextNode())nodes.push(node);
  const text=nodes.map(n=>n.textContent).join('');
  const start=text.search(/\S/),end=text.trimEnd().length;
  const mid=(start+end)/2;
  const phrases=[...text.matchAll(/Amaranth\s+10|ONE\s+AI|IFRS\s+18|세\s+가지|두\s+단계|6대\s+도구/gi)].map(m=>[m.index,m.index+m[0].length]);
  const breaks=[...text.matchAll(/\s+/g)].map(m=>m.index).filter(n=>n>start+2&&n<end-2&&!phrases.some(([a,b])=>n>a&&n<b));
  if(!breaks.length)continue;
  const offset=preferredOffset>start&&preferredOffset<end?preferredOffset:breaks.reduce((a,b)=>Math.abs(a-mid)<=Math.abs(b-mid)?a:b);
  let passed=0,splitNode;let localOffset;
  for(const n of nodes){if(passed+n.length>=offset){splitNode=n;localOffset=offset-passed;break;}passed+=n.length;}
  const first=document.createRange();first.selectNodeContents(heading);first.setEnd(splitNode,localOffset);
  const second=document.createRange();second.selectNodeContents(heading);second.setStart(splitNode,localOffset);
  const lines=[first.cloneContents(),second.cloneContents()].map(fragment=>{const line=document.createElement('span');line.className='sb-title-line';line.append(fragment);return line;});
  heading.replaceChildren(...lines);heading.classList.add('sb-two-line-title');
 }
 let fitFrame=0;
 const fitTitles=()=>{
  fitFrame=0;
  for(const heading of headings){
   if(!heading.getClientRects().length||!heading.classList.contains('sb-two-line-title'))continue;
   heading.style.removeProperty('font-size');
   const available=Math.min(...[...heading.children].map(line=>line.clientWidth));
   const base=parseFloat(getComputedStyle(heading).fontSize);
   const longest=Math.max(...[...heading.children].map(line=>line.scrollWidth));
   if(available&&longest>available)heading.style.setProperty('font-size',`${Math.floor(base*available/longest*100)/100}px`,'important');
  }
  window.ScrollTrigger?.refresh();
 };
 const queueFit=()=>{if(!fitFrame)fitFrame=requestAnimationFrame(fitTitles);};
 window.addEventListener('resize',queueFit);
 document.fonts?.ready.then(queueFit);
 const titleObserver=new MutationObserver(queueFit);
 document.querySelectorAll('[role="tabpanel"],[data-panel],[data-np-page]').forEach(panel=>titleObserver.observe(panel,{attributes:true,attributeFilter:['class','hidden','style']}));
 queueFit();
 const tabs=[...document.querySelectorAll('.omniesol-nav [data-tab]')];
 const panels=[...document.querySelectorAll('.omniesol>.panel')];
 if(!tabs.length||!panels.length)return;
 const activate=(id)=>{
  tabs.forEach(t=>{const on=t.dataset.tab===id;t.classList.toggle('active',on);t.setAttribute('aria-selected',String(on));if(on)t.setAttribute('aria-current','page');else t.removeAttribute('aria-current');});
  panels.forEach(p=>{const on=p.id==='panel-'+id;p.classList.toggle('active',on);p.hidden=!on;});
  window.ScrollTrigger?.refresh();
 };
 tabs.forEach((tab,i)=>{
  tab.addEventListener('click',e=>{e.preventDefault();activate(tab.dataset.tab);});
  tab.addEventListener('keydown',e=>{if(!['ArrowLeft','ArrowRight'].includes(e.key))return;e.preventDefault();const next=tabs[(i+(e.key==='ArrowRight'?1:tabs.length-1))%tabs.length];next.focus();activate(next.dataset.tab);});
 });
 activate(tabs.find(t=>t.classList.contains('active'))?.dataset.tab||tabs[0].dataset.tab);
});
