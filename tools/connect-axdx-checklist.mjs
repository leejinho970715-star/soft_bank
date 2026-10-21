import fs from 'node:fs/promises';
import path from 'node:path';
import {load} from 'cheerio';

const url = 'https://axdx-test.vercel.app/';
async function writePage(file,html){for(let attempt=0;;attempt++){try{return await fs.writeFile(file,html);}catch(error){if(attempt>=8||!['UNKNOWN','EBUSY','EPERM'].includes(error.code))throw error;await new Promise(resolve=>setTimeout(resolve,250*(attempt+1)));}}}

async function htmlFiles(directory) {
  const files = [];
  for (const entry of await fs.readdir(directory, {withFileTypes: true})) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(file));
    else if (entry.name.endsWith('.html')) files.push(file);
  }
  return files;
}

// Remove both shortcuts, including after shared pages are regenerated during a build.
const files = ['index.html', ...await htmlFiles('subpages'), ...await htmlFiles('renewal')];
let updated = 0;
let checked = 0;
for (const file of files) {
  const source = await fs.readFile(file, 'utf8');
  if (!source.includes('<header class="site-header">')) continue;
  let html = source.replace(/<header class="site-header">[\s\S]*?<\/header>/, header => {
    const clean = header.replace(/<div class="gnb-item gnb-checklist">[\s\S]*?<\/div>\r?\n?/g, '');
    if (!clean.includes('class="gnb"')) throw new Error(`Header navigation missing: ${file}`);
    return clean;
  });
  html = html.replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/, footer => {
    return footer.replace(/<a\b[^>]*class="[^"]*footer-checklist[^"]*"[^>]*>[\s\S]*?<\/a>/g, '');
  });
  const $ = load(html);
  const headerLinks = $(`.site-header a[href="${url}"]`);
  const footerLinks = $('#soft-bank-renewal > footer .footer-checklist');
  if (headerLinks.length !== 0 || footerLinks.length !== 0 || $(`footer a[href="${url}"]`).length) throw new Error(`Checklist must be absent from both header and footer: ${file}`);
  checked++;
  if (html !== source) {
    await writePage(file, html);
    updated++;
  }
}
console.log(`AX/DX checklist: ${updated} pages updated; ${checked} shared headers and footers verified.`);
