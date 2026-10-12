const icons={
 'omniesol':'assets/subpages/logos/omniesol-3d.png',
 'amaranth10/brand':'assets/subpages/logos/amaranth10-3d.png',
 'wehago/smart_A10':'assets/subpages/logos/wehago-3d.png',
 'oneai':'assets/subpages/logos/one-ai-3d.png',
 'nonprofit/intro':'assets/subpages/logos/amaranth10-3d.png',
 'ifrs18':'assets/subpages/ifrs18/hero.png'
};

export function applyProductHeroTabs($,root){
 $('.sb-hero-products a').each((i,e)=>{
  const link=$(e),key=(link.attr('href')||'').match(/\/product\/(.+)\.html(?:[?#]|$)/)?.[1];
  if(!icons[key])return;
  const label=link.text().trim();
  link.empty().append($('<img class="sb-product-tab-icon" alt="" aria-hidden="true" width="28" height="28" draggable="false" decoding="async">').attr('src',root+icons[key]));
  link.append($('<span></span>').text(label));
 });
}
