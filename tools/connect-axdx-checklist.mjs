import fs from 'node:fs/promises';
import path from 'node:path';
import {load} from 'cheerio';

const url = 'https://axdx-test.vercel.app/';
const version = '20261012-axdx-footer';
const icon = '<span class="external-link-icon" aria-hidden="true">↗</span>';
const footerLink = `<a class="footer-checklist" href="${url}" target="_blank" rel="noopener noreferrer" aria-label="AX/DX 레벨 체크리스트 (새 창)">AX/DX 레벨 체크리스트 ${icon}</a>`;

async function htmlFiles(directory) {
  const files = [];
  for (const entry of await fs.readdir(directory, {withFileTypes: true})) {
    const file = path.join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await htmlFiles(file));
    else if (entry.name.endsWith('.html')) files.push(file);
  }
  return files;
}

// Keep the diagnostic link in the footer only, without changing page content.
const files = ['index.html', ...await htmlFiles('subpages'), ...await htmlFiles('renewal')];
let updated = 0;
let checked = 0;
for (const file of files) {
  const source = await fs.readFile(file, 'utf8');
  if (!source.includes('<header class="site-header">')) continue;
  let html = source.replace(/<header class="site-header">[\s\S]*?<\/header>/, header =>
    header.replace(/<div class="gnb-item gnb-checklist">[\s\S]*?<\/div>\r?\n?/g, '')
  );
  html = html.replace(/<footer\b[^>]*>[\s\S]*?<\/footer>/, footer => {
    if (footer.includes('footer-checklist')) return footer;
    const changed = footer.replace(/(<nav\b[^>]*>[\s\S]*?)(<\/nav>)/, `$1${footerLink}$2`);
    if (changed === footer) throw new Error(`Footer navigation missing: ${file}`);
    return changed;
  });
  html = html.replace(/(href="(?:\.\.\/)*styles\.css)(?:\?[^"\s]*)?"/g, `$1?v=${version}"`);
  const $ = load(html);
  const headerLinks = $(`.site-header a[href="${url}"]`);
  const footerLinks = $('#soft-bank-renewal > footer .footer-checklist');
  if (headerLinks.length !== 0 || footerLinks.length !== 1) throw new Error(`Checklist must appear in the footer only: ${file}`);
  for (const link of footerLinks) {
    if ($(link).attr('href') !== url || $(link).attr('target') !== '_blank' || $(link).attr('rel') !== 'noopener noreferrer') throw new Error(`Checklist destination incorrect: ${file}`);
  }
  checked++;
  if (html !== source) {
    await fs.writeFile(file, html);
    updated++;
  }
}
console.log(`AX/DX checklist: ${updated} pages updated; ${checked} shared headers and footers verified.`);
