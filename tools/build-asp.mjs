import fs from 'node:fs/promises';
import {existsSync, readFileSync} from 'node:fs';
import path from 'node:path';
import {load} from 'cheerio';

// Builds the package that puts the renewal UI on the existing Classic ASP site (IIS, www.duzon119.co.kr).
// The Vercel preview is left as it is; this writes dist/asp/ from the same sources:
//  site/       files that go to the server root as they are: the static product and company pages
//              (saved under their .asp addresses), the shared CSS/JS, and only the assets a page uses.
//  templates/  pages whose content the ASP code renders (boards, inquiry forms, login, FAQ, home);
//              they show the markup to put around the existing ASP code and are not uploaded as they are.
// In every page: links use the .asp addresses, files are referenced from the site root, canonical and
// Open Graph addresses are the .asp ones, the preview-only form blocking is removed and the site's
// Google tag and Tag Manager snippets are included. Templates get the original form handlers back.
const out = 'dist/asp';
const site = 'https://www.duzon119.co.kr';
const seo = JSON.parse(readFileSync('reference/seo-meta.json', 'utf8'));

// Renewal page -> address on the ASP site.
const addresses = new Map([['index.html', '/'], ['subpages/product/ifrs18.html', '/product/ifrs18.asp']]);
for (const [page, head] of Object.entries(seo)) if (head?.url && !addresses.has(page)) {
  const u = new URL(head.url);
  addresses.set(page, u.pathname.replace(/\/index\.asp$/i, '/') + u.search);
}
const isStatic = page => /^subpages\/(product|company)\//.test(page);
const fileFor = address => address.split('?')[0].replace(/^\//, '');

async function walk(dir) {
  const files = [];
  for (const entry of await fs.readdir(dir, {withFileTypes: true})) {
    const file = path.join(dir, entry.name).replaceAll('\\', '/');
    if (entry.isDirectory()) files.push(...await walk(file)); else files.push(file);
  }
  return files;
}

const used = new Set(), missing = new Set();
// Files without an extension (two seminar posters) are not served by IIS; they get one from their content.
const renamed = new Map();
const servedName = file => {
  if (path.extname(file)) return file;
  if (!renamed.has(file)) {
    const head = readFileSync(file).subarray(0, 4).toString('hex');
    renamed.set(file, file + (head === '89504e47' ? '.png' : head.startsWith('ffd8') ? '.jpg' : head === '47494638' ? '.gif' : '.bin'));
  }
  return renamed.get(file);
};

// One reference (href, src, url(...)) as it should read on the ASP site.
function rewrite(ref, from) {
  if (!ref || /^(https?:|\/\/|data:|mailto:|tel:|javascript:|#|about:)/i.test(ref.trim())) return ref;
  const m = ref.trim().match(/^([^?#]*)(\?[^#]*)?(#.*)?$/);
  const [, p, query = '', hash = ''] = m;
  if (!p) return ref;
  let target = p.startsWith('/') ? p.slice(1) : path.posix.normalize(path.posix.join(path.posix.dirname(from), p));
  try { target = decodeURIComponent(target); } catch {}
  if (addresses.has(target)) {
    const address = addresses.get(target);
    return address + (query ? (address.includes('?') ? '&' + query.slice(1) : query) : '') + hash;
  }
  if (existsSync(target) && !target.endsWith('/')) {
    used.add(target);
    return '/' + servedName(target).split('/').map(encodeURIComponent).join('/') + query + hash;
  }
  missing.add(`${from}: ${ref}`);
  return ref;
}
const rewriteCssUrls = (css, from) => css.replace(/url\(\s*(['"]?)([^'")]+)\1\s*\)/g, (all, q, ref) => `url(${q}${rewrite(ref, from)}${q})`);
const rewriteSrcset = (value, from) => value.split(',').map(part => { const [u, ...d] = part.trim().split(/\s+/); return [rewrite(u, from), ...d].join(' '); }).join(', ');

// The site's Google tag and Tag Manager, exactly as the current ASP pages have them.
const home = readFileSync('reference/home.html', 'utf8');
const snippet = (start, end) => { const i = home.indexOf(start), j = home.indexOf(end, i); return home.slice(i, j + end.length); };
const tagHead = snippet('<!-- 2024-07-08 Google tag (gtag.js) -->', '<!-- End Google Tag Manager 2026-02-12(목) -->');
const tagBody = snippet('<!-- Google Tag Manager (noscript) 2026-02-12(목) -->', '<!-- End Google Tag Manager (noscript) 2026-02-12(목) -->');
if (!tagHead.includes('GTM-WKPK45TW') || !tagBody.includes('GTM-WKPK45TW')) throw new Error('Google Tag Manager snippet not found in reference/home.html');

// Original form handlers and the inline scripts behind them, for the templates.
const originalFile = page => { const a = addresses.get(page); if (!a || a.includes('?')) return null; const f = `reference/pages/${(fileFor(a) || 'index.asp').replaceAll('/', '__')}.html`; return existsSync(f) ? f : null; };
const uiOnly = /multiTab|iOverScript|AOS\.init|\$\.ripple|globalNavigationBar|leftMenuList|langCode|gtag\(|gtm\.start|"@context"|q__btn|fullpage|slick\(|swiper/i;
function restoreHandlers($, page) {
  const file = originalFile(page);
  if (!file) return 0;
  const $o = load(readFileSync(file, 'utf8'));
  let restored = 0;
  $o('form').each((i, f) => {
    const of = $o(f), action = of.attr('action') || '', name = of.attr('name') || of.attr('Name') || '';
    const target = $('form').filter((j, g) => ($(g).attr('action') || '') === action && (!name || ($(g).attr('name') || $(g).attr('id') || '') === name || $(g).attr('id') === of.attr('id'))).first();
    if (!target.length) return;
    for (const attr of ['onsubmit', 'id', 'name', 'target']) { const v = of.attr(attr); if (v && !target.attr(attr)) { target.attr(attr, v); restored++; } }
  });
  // Links that ran a page function (약관 동의, 우편번호 검색 ...), matched by their text.
  $o('a[href^="javascript:"]').each((i, a) => {
    const href = $o(a).attr('href'), text = $o(a).text().trim();
    if (/void\(0\)/.test(href) || !text) return;
    $('a').filter((j, b) => $(b).text().trim() === text && !/^javascript:/.test($(b).attr('href') || '')).first().each((j, b) => { $(b).attr('href', href); restored++; });
  });
  const scripts = [];
  $o('script:not([src])').each((i, s) => { const t = $o(s).html() || ''; if (t.trim() && !uiOnly.test(t) && /\$\(|function\s+\w+\s*\(/.test(t)) scripts.push(t.trim()); });
  if (scripts.length || restored) {
    const libs = ['/common/js/jquery.lastest.js', '/_lib/functions.js', '/_lib/boardcontrol.js', '/_lib/js/plug-in/jquery.cookie/jquery.cookie.js']
      .filter(src => $o(`script[src^="${src}"]`).length || src.includes('jquery.lastest'));
    $('body').append(`\n<!-- 기존 ASP 페이지의 폼·게시판 동작 (원본 그대로) -->\n${libs.map(src => `<script src="${src}"></script>`).join('\n')}\n${scripts.map(t => `<script>\n${t}\n</script>`).join('\n')}\n`);
  }
  return restored + scripts.length;
}

await fs.rm(out, {recursive: true, force: true});
const pages = ['index.html', ...(await walk('subpages')).filter(f => f.endsWith('.html') && f !== 'subpages/index.html')];
const report = {site: [], templates: [], restored: {}};
for (const page of pages) {
  const address = addresses.get(page);
  if (!address) { missing.add(`${page}: no ASP address`); continue; }
  const $ = load(await fs.readFile(page, 'utf8'));
  $('[src]').each((i, e) => $(e).attr('src', rewrite($(e).attr('src'), page)));
  $('[href]').each((i, e) => $(e).attr('href', rewrite($(e).attr('href'), page)));
  $('[poster]').each((i, e) => $(e).attr('poster', rewrite($(e).attr('poster'), page)));
  $('[srcset]').each((i, e) => $(e).attr('srcset', rewriteSrcset($(e).attr('srcset'), page)));
  $('[style]').each((i, e) => $(e).attr('style', rewriteCssUrls($(e).attr('style'), page)));
  $('style').each((i, e) => $(e).text(rewriteCssUrls($(e).html(), page)));
  // Preview-only behaviour: forms that open a notice instead of submitting.
  $('body').removeAttr('data-preview');
  $('[data-preview-form]').removeAttr('data-preview-form');
  $('.sb-preview-dialog').remove();
  $('head').append(`\n${tagHead}\n`);
  $('body').prepend(`\n${tagBody}\n`);
  const template = !isStatic(page);
  if (template) { const n = restoreHandlers($, page); if (n) report.restored[page] = n; }
  // Canonical, Open Graph and JSON-LD addresses of renewal pages -> their .asp addresses.
  let html = $.html().replace(/https:\/\/www\.duzon119\.co\.kr\/(subpages\/[^"'\s<>\\]+?\.html)/g, (all, p) => addresses.has(p) ? site + addresses.get(p) : all);
  const dest = template ? `${out}/templates/${fileFor(address) || 'index.asp'}${address.includes('?') ? '.' + new URLSearchParams(address.split('?')[1]).get('idx') : ''}.html` : `${out}/site/${fileFor(address)}`;
  await fs.mkdir(path.dirname(dest), {recursive: true});
  await fs.writeFile(dest, html);
  (template ? report.templates : report.site).push(`${page} -> ${address}`);
}

// Shared CSS and JS. CSS keeps its relative url()s (the folders keep their layout); JS gets page and asset
// paths that work from any page address.
const jsPage = (text, from) => text.replace(/(['"`])((?:\.\.\/|\/)*(?:subpages\/[^'"`]+?|ifrs18)\.html)(\?[^'"`]*)?\1/g, (all, q, p, query = '') => {
  const key = p.replace(/^(\.\.\/|\/)+/, '');
  const page = addresses.has(key) ? key : key === 'ifrs18.html' ? 'subpages/product/ifrs18.html' : null;
  return page ? q + addresses.get(page) + query + q : all;
}).replace(/(['"`])assets\//g, '$1/assets/');
const shared = ['styles.css', 'app.js', 'intro.js', ...(await walk('renewal')).filter(f => /\.(css|js|html)$/.test(f))];
const cssQueue = [];
for (const file of shared) {
  let text = await fs.readFile(file, 'utf8');
  if (file.endsWith('.js')) text = jsPage(text, file);
  if (file.endsWith('.css')) cssQueue.push(file);
  if (file.endsWith('.html')) { const $ = load(text, null, false); $('[href]').each((i, e) => $(e).attr('href', rewrite($(e).attr('href'), file))); $('[src]').each((i, e) => $(e).attr('src', rewrite($(e).attr('src'), file))); text = $.html(); }
  await fs.mkdir(path.dirname(`${out}/site/${file}`), {recursive: true});
  await fs.writeFile(`${out}/site/${file}`, text);
}
// Assets named in JS (news thumbnails, the IFRS 18 notice banner ...).
for (const file of [...shared.filter(f => f.endsWith('.js')), 'assets/news-data.js']) {
  for (const m of readFileSync(file, 'utf8').matchAll(/['"`](?:\.\.\/|\/)*(assets\/[^'"`?#]+)/g)) if (existsSync(m[1])) used.add(m[1]);
}
used.add('assets/news-data.js'); used.add('assets/swiper-bundle.min.js');
// CSS url()s, including stylesheets inside assets/.
const seen = new Set();
while (cssQueue.length) {
  const file = cssQueue.shift();
  if (seen.has(file)) continue;
  seen.add(file);
  const css = readFileSync(file, 'utf8');
  for (const m of css.matchAll(/url\(\s*['"]?([^'")]+?)['"]?\s*\)/g)) {
    const ref = m[1];
    if (/^(data:|https?:|#)/.test(ref)) continue;
    const target = path.posix.normalize(path.posix.join(path.posix.dirname(file), ref.split(/[?#]/)[0]));
    if (existsSync(target)) used.add(target); else missing.add(`${file}: ${ref}`);
  }
  for (const f of used) if (f.endsWith('.css') && !seen.has(f)) cssQueue.push(f);
}
let bytes = 0;
for (const file of used) {
  if (!file.startsWith('assets/')) continue;
  const dest = `${out}/site/${servedName(file)}`;
  await fs.mkdir(path.dirname(dest), {recursive: true});
  if (file === 'assets/news-data.js') await fs.writeFile(dest, jsPage(readFileSync(file, 'utf8'), file));
  else await fs.copyFile(file, dest);
  bytes += (await fs.stat(dest)).size;
}

// MIME types IIS does not know by default, scoped to the new folders so the site's own web.config is untouched.
const webConfig = `<?xml version="1.0" encoding="utf-8"?>
<configuration>
  <system.webServer>
    <staticContent>
${[['.webp', 'image/webp'], ['.json', 'application/json'], ['.woff2', 'font/woff2'], ['.svg', 'image/svg+xml'], ['.mp4', 'video/mp4'], ['.hwp', 'application/x-hwp'], ['.md', 'text/markdown']]
  .map(([ext, type]) => `      <remove fileExtension="${ext}" />\n      <mimeMap fileExtension="${ext}" mimeType="${type}" />`).join('\n')}
    </staticContent>
  </system.webServer>
</configuration>
`;
for (const dir of ['assets', 'renewal']) await fs.writeFile(`${out}/site/${dir}/web.config`, webConfig);

await fs.copyFile('renewal/ASP-DEPLOY.md', `${out}/README.md`);
await fs.writeFile(`${out}/report.json`, JSON.stringify({...report, renamed: Object.fromEntries(renamed), missing: [...missing], assets: used.size, assetBytes: bytes}, null, 1));
console.log(`ASP package: ${report.site.length} site pages, ${report.templates.length} templates, ${used.size} assets (${(bytes / 1e6).toFixed(0)} MB), ${missing.size} unresolved references`);
