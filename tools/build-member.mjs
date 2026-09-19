import fs from 'node:fs/promises';
import {load} from 'cheerio';
export async function buildMember(){
 const yak=load(await fs.readFile('subpages/member/yak.html','utf8'));
 yak('.member-agree-all,#member-join-dialog').remove();
 yak('a').filter((i,e)=>yak(e).text().trim()==='회원정보입력').attr('href','join.html').attr('data-member-next','');
 const enhance=$=>{$('link[href*="member.css"],script[src*="member.js"]').remove();$('head').append('<link rel="stylesheet" href="../../renewal/member.css"><script src="../../renewal/member.js" defer></script>');};
 enhance(yak);await fs.writeFile('subpages/member/yak.html',yak.html());
 const source=load(await fs.readFile('reference/member-join.html','utf8'));
 const form=source('form[name="Join"]');
 form.find('*').addBack().each((i,e)=>{for(const name of Object.keys(e.attribs||{}))if(/^on/i.test(name))source(e).removeAttr(name);});
 form.attr('action','#').removeAttr('target enctype').attr('id','renewal-join');
 form.find('input[type="hidden"]').remove();
 form.find('a').remove();form.find('[readonly]').removeAttr('readonly');
 form.find('[name="zip"]').after('<button type="button" class="cta" data-address-search>주소검색</button>');
 form.find('input').each((i,e)=>{const el=source(e);if(!el.attr('id'))el.attr('id','join-field-'+i);el.attr('aria-label',el.attr('title')||el.closest('tr').find('th').text().trim());if(el.attr('type')==='password')el.attr('autocomplete','new-password');});
 form.find('[name="passwd"]').attr('pattern','[A-Za-z](?=.*[0-9])[A-Za-z0-9]{5,14}');
 form.append('<p class="member-status" role="status">회원가입 서비스 준비 중입니다. 현재 입력한 정보는 전송·저장되지 않습니다.</p><div class="member-actions"><a class="cta" href="yak.html">이전 단계</a><button type="submit" class="cta">입력정보 확인</button></div>');
 const join=load(yak.html());join('title').text('회원정보 입력 | 아이원소프트뱅크');join('.sb-hero h1').text('회원정보 입력');join('body').removeClass('sb-page-member-yak').addClass('sb-page-member-join');join('.sb-content').empty().append('<section class="sb-join"><h2>회원정보 입력</h2><p>서비스 이용에 필요한 회원정보를 입력해주세요.</p>'+form.toString()+'</section>');
 await fs.writeFile('subpages/member/join.html',join.html());
 yak('[data-member-next]').attr({'aria-haspopup':'dialog','aria-controls':'member-join-dialog'});
 yak('[data-member-next]').closest('.board_btn').before('<div class="member-agree-all"><label><input type="checkbox" id="agree-all"> <strong>모두 동의합니다</strong></label><p>이용약관 및 개인정보처리방침에 모두 동의합니다.</p></div>');
 const modalForm=form.clone();
 modalForm.find('.member-actions a').replaceWith('<button type="button" class="cta" data-member-close>이전 단계</button>');
 yak('.sb-content').append('<dialog id="member-join-dialog" class="member-join-dialog" aria-labelledby="member-join-title"><div class="member-dialog-header"><h2 id="member-join-title" tabindex="-1">회원정보 입력</h2><button type="button" data-member-close aria-label="회원정보 입력 닫기">×</button></div><section class="sb-join"><p>서비스 이용에 필요한 회원정보를 입력해주세요.</p>'+modalForm.toString()+'</section></dialog>');
 await fs.writeFile('subpages/member/yak.html',yak.html());
 const find=load(await fs.readFile('subpages/member/find.html','utf8'));enhance(find);
 find('.member-tabs').remove();
 find('.find').prepend('<div class="member-tabs" role="tablist" aria-label="계정 찾기"><button type="button" role="tab" id="find-id-tab" aria-controls="find-id" aria-selected="true">아이디 찾기</button><button type="button" role="tab" id="find-password-tab" aria-controls="find-password" aria-selected="false" tabindex="-1">비밀번호 찾기</button></div>');
 find('.find>.inBox').each((i,e)=>{const key=i?'password':'id';find(e).attr({id:'find-'+key,role:'tabpanel','aria-labelledby':'find-'+key+'-tab'});if(i)find(e).attr('hidden','');find(e).find('input').each((n,input)=>{const el=find(input);el.attr('id',`find-${key}-field-${n}`).attr('aria-label',el.attr('placeholder')||el.attr('value')||'입력');});});
 await fs.writeFile('subpages/member/find.html',find.html());
 for(const [page,asset] of [['login','login'],['find','find'],['yak','join'],['join','join']]){
  const path=`subpages/member/${page}.html`;
  const $=load(await fs.readFile(path,'utf8'));
  $('.sb-hero-asset').attr('src',`../../assets/subpages/member/${asset}.png`);
  await fs.writeFile(path,$.html());
 }
}
