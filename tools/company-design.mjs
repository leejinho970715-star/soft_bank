export function applyCompanyDesign($, page, root) {
  if (!['/company/about.asp','/company/location.asp','/company/headquarters.asp'].includes(page)) return;
  $('head').append(`<link rel="stylesheet" href="${root}renewal/company-design.css?v=20261022-5">`);
  // Company pages keep the sub visual background and text only.
  $('.sb-hero .sb-hero-asset').remove();
  const asset = name => `${root}assets/subpages/features/company/${name}.png`;
  const picture = (name, alt) => `<img class="sb-company-art" src="${asset(name)}" alt="${alt}" width="512" height="512" loading="lazy">`;
  if (page === '/company/about.asp') {
    // Simple greeting box on a brightened headquarters photo, followed by photo-led introductions.
    $('.about .bgBox').addClass('sb-about-greeting').empty()
      .append('<b>ABOUT US</b><h3>안녕하십니까<br>더존을 항상 성원해 주시고 아껴주시는<br>고객님들께 항상 진심으로 감사드립니다.</h3>');
    $('.about__list').addClass('sb-about-list');
    $('.about__list>li').each((i,e) => {
      const names=['solutions','customers','consulting'];
      const labels=['통합 ERP 솔루션을 함께 검토하는 업무 현장','고객사와 신뢰를 쌓아 온 비즈니스 미팅','기업 성장을 돕는 전문 컨설팅'];
      $(e).find('.img').first().empty().append(`<img class="sb-about-photo" src="${root}assets/subpages/company/about-${names[i]}.jpg" alt="${labels[i]}" width="1448" height="1086" loading="lazy">`);
    });
  }
  if (page === '/company/headquarters.asp') {
    $('.headquarters>ul').addClass('sb-company-values');
    // The four value cards are text only.
    $('.headquarters>ul>li>.img').remove();
  }
  $('.location').each((i,e) => {
    const section=$(e);
    section.addClass('sb-visit');
    const intro=$('<div class="sb-visit-intro"></div>');
    intro.append(section.children('.top'));
    intro.append(picture('visit','사무실 방문과 위치 안내'));
    section.prepend(intro);
    // Kakao Map "지도 퍼가기" embeds the original site used for each address (Guro office, Gangchon campus); they need no app key.
    const map = {'/company/location.asp': ['1715045574181','2j99b'], '/company/headquarters.asp': ['1715144057497','2j9rx']}[page];
    if (map) {
      const [timestamp, key] = map;
      section.children('.mapWrap').replaceWith(`<div class="sb-visit-map"><div id="daumRoughmapContainer${timestamp}" class="root_daum_roughmap root_daum_roughmap_landing"></div></div>`);
      section.find('.top>a').remove();
      $('body').append(`<script charset="UTF-8" class="daum_roughmap_loader_script" src="https://ssl.daumcdn.net/dmaps/map_js_init/roughmapLoader.js"></script><script charset="UTF-8">new daum.roughmap.Lander({"timestamp":"${timestamp}","key":"${key}","mapHeight":"440"}).render();</script>`);
    } else {
      section.children('.mapWrap').remove();
    }
    section.children('ul').addClass('sb-visit-details');
    section.find('.sb-visit-details .img').remove();
    section.find('.top>a').addClass('sb-map-link');
  });
}
