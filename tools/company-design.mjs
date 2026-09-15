export function applyCompanyDesign($, page, root) {
  if (!['/company/about.asp','/company/location.asp','/company/headquarters.asp'].includes(page)) return;
  $('head').append(`<link rel="stylesheet" href="${root}renewal/company-design.css">`);
  const asset = name => `${root}assets/subpages/features/company/${name}.png`;
  const picture = (name, alt) => `<img class="sb-company-art" src="${asset(name)}" alt="${alt}" width="512" height="512" loading="lazy">`;
  if (page === '/company/about.asp') {
    $('.about__list>li').each((i,e) => {
      const names=['platform','network','consulting'];
      const labels=['통합 ERP 솔루션과 디지털 서비스','고객사와 연결되는 비즈니스 네트워크','기업 성장을 돕는 전문 컨설팅'];
      $(e).find('.img').first().empty().append(picture(names[i],labels[i]));
    });
  }
  if (page === '/company/headquarters.asp') {
    $('.headquarters>.top_txt').prepend(picture('network','글로벌 ICT 비즈니스 네트워크'));
    $('.headquarters>ul').addClass('sb-company-values');
    $('.headquarters>ul>li').each((i,e) => {
      $(e).find('.img').first().empty().append(picture(['platform','consulting','platform','network'][i],['기업 정보화 솔루션','신뢰와 전문성','통합 경영 플랫폼','글로벌 네트워크'][i]));
    });
  }
  $('.location').each((i,e) => {
    const section=$(e);
    section.addClass('sb-visit');
    const intro=$('<div class="sb-visit-intro"></div>');
    intro.append(section.children('.top'));
    intro.append(picture('visit','사무실 방문과 위치 안내'));
    section.prepend(intro);
    // The original map container has no map runtime. Keep the real map link
    // beside the address instead of leaving an empty map-shaped space.
    section.children('.mapWrap').remove();
    section.children('ul').addClass('sb-visit-details');
    section.find('.sb-visit-details .img').remove();
    section.find('.top>a').addClass('sb-map-link');
  });
}
