import fs from 'node:fs/promises';
const file='app.js';
const source=await fs.readFile(file,'utf8');
const resolved=source.replace(/<<<<<<< HEAD\r?\n[\s\S]*?=======\r?\n([\s\S]*?)>>>>>>> origin\/main\r?\n?/, '$1');
if(resolved===source||/<<<<<<<|>>>>>>>/.test(resolved))throw new Error('Unexpected conflict structure');
await fs.writeFile(file,resolved+`\n// Display the captured original legal documents in full.\nfor (const [key, id] of [['privacy', 'privacy-modal'], ['terms', 'terms-modal']]) {\n  const panel = document.querySelector('#' + id + ' .legal-scroll');\n  if (!panel) continue;\n  panel.textContent = '문서를 불러오는 중입니다.';\n  fetch('renewal/' + key + '.html').then(r => { if (!r.ok) throw new Error('Document unavailable'); return r.text(); }).then(html => { panel.innerHTML = html; }).catch(() => { panel.textContent = '문서를 불러오지 못했습니다. 잠시 후 다시 시도해 주세요.'; });\n}\n`);
