import fs from 'node:fs';

const assets = Object.values(JSON.parse(fs.readFileSync('assets/subpages/regenerated/manifest.json', 'utf8')));
const diagrams = new Set(assets.filter(asset => asset.kind === 'diagram').map(asset => asset.file));

export function applyProductMockupRatios($) {
  $('.sb-frontal-monitor,.sb-faithful-reference,.sb-laptop-mockup').each((_, element) => {
    const frame = $(element);
    const image = frame.find('img').first();
    const width = Number(image.attr('width'));
    const height = Number(image.attr('height'));
    if (!(width > 0 && height > 0)) return;
    const style = (frame.attr('style') || '').replace(/--sb-screen-ratio\s*:[^;]+;?/g, '').trim();
    frame.attr('style', `${style}${style && !style.endsWith(';') ? ';' : ''}--sb-screen-ratio:${(width / height).toFixed(6)}`);
  });
}

// Only screen mockups receive alternating rows; diagrams and icon groups stay centered.
export function applyProductScreenLayout($) {
  if ($('body').is('.sb-page-product-oneai,.sb-page-product-ifrs18')) return;
  const counts = new Map();
  $('.sb-feature,.sb-design-row,.omniesol .section').each((_, element) => {
    const row = $(element);
    const copy = row.children('.cont_txt,.txt,.sec-text');
    const visual = row.children('.img,.sec-visual,.cont_img,.sb-generated-panel');
    if (copy.length !== 1 || visual.length !== 1) return;
    const screens = visual.find('.sb-frontal-monitor,.sb-faithful-reference,.sb-laptop-mockup,.sb-device-scene');
    if (!screens.length) return;
    const images = screens.find('img').toArray();
    if (!images.length || images.some(image => diagrams.has(($(image).attr('src') || '').replace(/^(?:\.\.\/)+/, '')))) return;
    const group = row.closest('.contWrap.amaranth10,.wehago_01,.wehago_03,.revers_wrap,.omniesol>.panel,[data-np-page],.sb-content')[0];
    const index = counts.get(group) || 0;
    counts.set(group, index + 1);
    row.addClass('sb-zigzag-feature').attr('data-screen-layout', index % 2 ? 'visual-left' : 'visual-right');
    copy.addClass('sb-feature-copy');
    visual.addClass('sb-feature-visual');
  });
}
