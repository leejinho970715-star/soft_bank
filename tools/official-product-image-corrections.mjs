import fs from 'node:fs';

const manifest = JSON.parse(fs.readFileSync('assets/subpages/official-corrected/manifest.json', 'utf8'));
const clean = text => String(text || '').replace(/\s+/g, ' ').trim();

// Scope corrections to a feature, since shared files can serve unrelated sections.
// Use black transparent mockups composed from the correct original UI pixels.
export function applyOfficialProductImageCorrections($, page, root) {
  const entries = manifest.filter(entry => entry.page === page);
  for (const entry of entries) {
    const corrected = $(`[data-official-correction="${entry.id}"]`);
    if (corrected.length === 1 && (corrected.find('img').attr('src') || '').endsWith(entry.file)) continue;
    const images = corrected.length === 1 ? corrected.find('img') : $('main img').filter((i, el) => {
      const img = $(el);
      if (!(img.attr('src') || '').endsWith(entry.previous)) return false;
      const region = img.closest('.sb-zigzag-feature,.swiper-slide,.sb-feature,.inner,.section');
      const copy = region.find('.sb-feature-copy,.txt,.cont_txt,.sec-text').first();
      return clean(copy.text() || region.text()).includes(entry.label);
    });
    if (images.length !== 1) throw new Error(`Expected one image for ${page}: ${entry.label}; found ${images.length}`);
    const image = images.first();
    const figure = image.closest('figure');
    if (figure.length !== 1) throw new Error(`Missing image figure: ${entry.label}`);
    const src = root + entry.file;
    const link = $('<a class="sb-screen-zoom"></a>').attr({href: src, 'aria-label': entry.alt + ' 크게 보기'});
    const picture = $('<picture class="sb-frontal-picture"></picture>');
    picture.append($('<img class="sb-frontal-screen" loading="lazy">').attr({src, alt: entry.alt, width: entry.width, height: entry.height}));
    // Final PNGs include their black device; avoid applying a second bezel.
    figure.attr('class', 'sb-faithful-reference').attr('data-official-correction', entry.id)
      .attr('style', `--sb-screen-ratio:${(entry.width / entry.height).toFixed(6)}`)
      .empty().append(link.append(picture));
  }
  return entries.length;
}
