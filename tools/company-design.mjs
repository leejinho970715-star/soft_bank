export function applyCompanyDesign($, page, root) {
  if (!['/company/about.asp','/company/location.asp','/company/headquarters.asp'].includes(page)) return;
  $('head').append(`<link rel="stylesheet" href="${root}renewal/company-design.css?v=20261022-3">`);
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
    if (page === '/company/location.asp') {
      // Kakao Map "지도 퍼가기" embed for the Guro office, as on the original site; it needs no app key.
      section.children('.mapWrap').replaceWith('<div class="sb-visit-map"><div id="daumRoughmapContainer1715045574181" class="root_daum_roughmap root_daum_roughmap_landing"></div></div>');
      section.find('.top>a').remove();
      $('body').append('<script charset="UTF-8" class="daum_roughmap_loader_script" src="https://ssl.daumcdn.net/dmaps/map_js_init/roughmapLoader.js"></script><script charset="UTF-8">new daum.roughmap.Lander({"timestamp":"1715045574181","key":"2j99b","mapHeight":"440"}).render();</script>');
    } else {
      // Keep the real map link beside the address instead of an empty map-shaped space.
      section.children('.mapWrap').remove();
    }
    section.children('ul').addClass('sb-visit-details');
    section.find('.sb-visit-details .img').remove();
    section.find('.top>a').addClass('sb-map-link');
  });
}
