import fs from 'node:fs';

const assets = JSON.parse(fs.readFileSync('assets/subpages/amaranth-corrected/manifest.json', 'utf8'));

// Feature-scoped overrides: shared meeting/banking assets must remain unchanged.
export function applyAmaranthImageCorrections($, page, root) {
  const targets = page === '/product/amaranth10/brand.asp'
    ? [['.brand06', 'board'], ['.brand11', 'fax']]
    : page === '/product/amaranth10/hr.asp'
      ? [['.hr05', 'hrTax']]
      : page === '/product/nonprofit/intro.asp'
        ? [['[data-np-page="groupware"] .brand06', 'board'], ['[data-np-page="groupware"] .brand11', 'fax'], ['[data-np-page="hr"] .hr05', 'hrTax']]
        : [];

  for (const [selector, key] of targets) {
    const section = $(selector);
    if (section.length !== 1) throw new Error(`Missing unique Amaranth correction target: ${page} ${selector}`);
    const visual = section.children('.img');
    if (visual.length !== 1) throw new Error(`Missing Amaranth correction image: ${selector}`);
    const asset = assets[key];
    const figure = $('<figure class="sb-faithful-reference"></figure>')
      .attr('style', `--sb-screen-ratio:${(asset.width / asset.height).toFixed(6)}`);
    const link = $('<a class="sb-screen-zoom"></a>')
      .attr({href: root + asset.file, 'aria-label': asset.alt + ' 크게 보기'});
    const picture = $('<picture class="sb-frontal-picture"></picture>');
    picture.append($('<img class="sb-frontal-screen" loading="lazy">')
      .attr({src: root + asset.file, alt: asset.alt, width: asset.width, height: asset.height}));
    figure.append(link.append(picture));
    // The PNG already includes its black bezel and stand; never add a second frame.
    visual.empty().append(figure).addClass('sb-feature-visual');
    section.addClass('sb-zigzag-feature');
    if (!section.attr('data-screen-layout')) section.attr('data-screen-layout', section.attr('data-layout') || 'visual-right');
    section.children('.cont_txt').addClass('sb-feature-copy');
  }
  return targets.length;
}
