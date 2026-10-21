import fs from 'node:fs/promises';

// Keep the native product pixels intact; only the surrounding device frames are vector artwork.
const out='assets/home-device-mockups';
await fs.mkdir(out,{recursive:true});
const data=async name=>'data:image/png;base64,'+(await fs.readFile('assets/proposal-native-20261020/'+name+'.png')).toString('base64');
const defs=`<defs>
 <linearGradient id="metal"><stop stop-color="#a6adb7"/><stop offset=".45" stop-color="#f5f7fa"/><stop offset="1" stop-color="#7c8592"/></linearGradient>
 <linearGradient id="bezel" x2="0" y2="1"><stop stop-color="#313842"/><stop offset="1" stop-color="#11151b"/></linearGradient>
 <linearGradient id="stand"><stop stop-color="#8f99a5"/><stop offset=".48" stop-color="#e8ecf0"/><stop offset="1" stop-color="#8d97a3"/></linearGradient>
 </defs>`;
function phone(src,x,y,w,h){return `<rect x="${x-5}" y="${y-5}" width="${w+10}" height="${h+62}" rx="40" fill="url(#metal)"/>
 <rect x="${x}" y="${y}" width="${w}" height="${h+52}" rx="35" fill="#11151b"/>
 <rect x="${x+w*.35}" y="${y+9}" width="${w*.3}" height="5" rx="2.5" fill="#424951"/>
 <svg x="${x+10}" y="${y+24}" width="${w-20}" height="${h}" viewBox="0 0 ${w-20} ${h}"><image href="${src}" width="${w-20}" height="${h}" preserveAspectRatio="xMidYMid meet"/></svg>
 <rect x="${x+w*.34}" y="${y+h+36}" width="${w*.32}" height="4" rx="2" fill="#e3e7ed"/>`;}
const amaranth=await data('amaranth-portal'),amobile=await data('amaranth-mobile');
const a=`<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="1180" viewBox="0 0 1800 1180" role="img" aria-label="아마란스 10 PC 모니터와 모바일 목업">${defs}
 <path d="M625 958h190l34 135H591z" fill="url(#stand)"/>
 <rect x="456" y="1090" width="574" height="26" rx="13" fill="url(#metal)"/>
 <rect x="43" y="37" width="1340" height="938" rx="32" fill="url(#metal)"/>
 <rect x="48" y="42" width="1330" height="928" rx="28" fill="url(#bezel)"/>
 <circle cx="713" cy="58" r="4" fill="#657282"/>
 <image href="${amaranth}" x="73" y="78" width="1280" height="840" preserveAspectRatio="xMidYMid meet"/>
 <path d="M48 934h1330v8q0 28-28 28H76q-28 0-28-28z" fill="url(#metal)"/>
 ${phone(amobile,1440,228,310,Math.round(290*764/353))}</svg>`;
const wehago=await data('wehago-portal'),wmobile=await data('wehago-mobile');
// Use more of the composition for the laptop screen, with both complete devices still separate.
const w=`<svg xmlns="http://www.w3.org/2000/svg" width="1800" height="830" viewBox="0 0 1800 830" role="img" aria-label="위하고 노트북과 전체 모바일 프레임 목업">${defs}
 <image href="${wehago}" x="10" y="28" width="1460" height="769" preserveAspectRatio="xMidYMid meet"/>
 ${phone(wmobile,1480,80,280,Math.round(260*2296/1138))}</svg>`;
await fs.writeFile(out+'/amaranth-pc-mobile.svg',a);
await fs.writeFile(out+'/wehago-pc-mobile.svg',w);
console.log('Built two lossless device mockups with complete device frames.');
