var ROOT_URL = "/";
/*
if (langCode == "kor"){
	var ROOT_URL = "../ko/";
}else if (langCode == "eng"){
	var ROOT_URL = "../en/";
}else{
	var ROOT_URL = "../ja/";
}
console.log(langCode, ROOT_URL)
*/

/* Main */
	function link0000(h){var urls = ROOT_URL+"index.asp"; linkType(urls, h)}

/* 기본 게시판 */
	function link0101(h){var urls = ROOT_URL+"product/amaranth10/brand.asp"; linkType(urls, h)}//공지사항
	function link0102(h){var urls = ROOT_URL+"product/wehago/smart_A10.asp"; linkType(urls, h)}//공지사항
	function link0104(h){var urls = ROOT_URL+"product/omniesol.asp"; linkType(urls, h)}//OmniEsol
	function link0107(h){var urls = ROOT_URL+"product/oneai.asp"; linkType(urls, h)}//ONE AI
	function link0108(h){var urls = ROOT_URL+"product/nonprofit/intro.asp"; linkType(urls, h)}//Amaranth 10(비영리)
	function link0103(h){var urls = ROOT_URL+"product/pms.asp"; linkType(urls, h)}//공지사항

/* 포토 게시판 */
	function link0201(h){var urls = ROOT_URL+"government/notice.asp"; linkType(urls, h)}	//기본
	function link0202(h){var urls = ROOT_URL+"government/promotion.asp"; linkType(urls, h)}	//더존프로모션
	function link0408(h){window.open("https://www.youtube.com/channel/UCFXFG1O3huf_ZE6RFD2Lg9g", "_blank");}	//WEHAGO 교육영상 유튜브


/* 소식마당 */
	function link0301(h){var urls = ROOT_URL+"purchase/inquiry.asp"; linkType(urls, h)}	//공지사항
	function link0302(h){var urls = ROOT_URL+"purchase/seminar.asp"; linkType(urls, h)}	//입찰공고
	function link0303(h){var urls = ROOT_URL+"purchase/service.asp"; linkType(urls, h)}	//행사일정
	function link0305(h){var urls = ROOT_URL+"purchase/bsnss_inquiry.asp"; linkType(urls, h)}	//행사일정


/* 정보마당 */
	function link0401(h){var urls = ROOT_URL+"amaranth10/inquiry.asp"; linkType(urls, h)}	//육우 관측자료
	function link0402(h){var urls = ROOT_URL+"icube/inquiry.asp"; linkType(urls, h)}	//육우 요리교실
	function link0403(h){var urls = ROOT_URL+"bizbox/inquiry.asp"; linkType(urls, h)}	//육우 레시피북
	function link0404(h){var urls = "http://1.244.116.142/"; linkType(urls, h)}	//육우 레시피북
	function link0406(h){var urls = ROOT_URL+"pms/inquiry.asp"; linkType(urls, h)}	//PMS AS 문의
	function link0407(h){var urls = ROOT_URL+"omniesol/inquiry.asp"; linkType(urls, h)}	//OmniEsol AS 문의
	//function link0406(h){var urls = ROOT_URL+"customer/customer_etc.asp"; linkType(urls, h)}	//육우 레시피북

/* 참여마당 */
	function link0501(h){var urls = ROOT_URL+"company/about.asp"; linkType(urls, h)}	//이벤트
	function link0502(h){var urls = ROOT_URL+"company/privacy.asp"; linkType(urls, h)}	//1:1 문의
	function link0503(h){var urls = ROOT_URL+"company/location.asp"; linkType(urls, h)}	//1:1 문의(모음)
	function link0504(h){var urls = ROOT_URL+"company/headquarters.asp"; linkType(urls, h)}	//FAQ

/* 커뮤니티 */
	function link0601(h){var urls = ROOT_URL+"community/conmment.asp"; linkType(urls, h)}	//이벤트
	function link0602(h){var urls = ROOT_URL+"community/recruit.asp"; linkType(urls, h)}	//이벤트


/* Member */
	function link1001(h){var urls = ROOT_URL+"member/login.asp"; linkType(urls, h)}	//로그인
	function link1002(h){var urls = ROOT_URL+"member/find.asp"; linkType(urls, h)}	//아이디/비밀번호찾기
	function link1003(h){var urls = ROOT_URL+"member/yak.asp"; linkType(urls, h)}	//회원가입

/* Mypage*/
	function link1101(h){var urls = ROOT_URL+"mypage/info.asp"; linkType(urls, h)}//정보수정
	function link1102(h){var urls = ROOT_URL+"mypage/out.asp"; linkType(urls, h)}//회원탈퇴

/* Etc*/
	function link1201(h){var urls = ROOT_URL+"/company/clause.asp"; linkType(urls, h)}//개인정보처리방침

/* Language*/
	function link2001(h){var urls = "/"; linkType(urls, h)}//한국어
	function link2002(h){var urls = "/en/"; linkType(urls, h)}//영어


function link_shopping(){window.open('http://www.yookwoo.com/')}//블로그
function link_blog(){window.open('https://blog.naver.com/yookwoo_official')}//블로그
function link_instagram(){window.open('https://www.instagram.com/yookwoo_official/')}//인스타그램
function link_facebook(){window.open('https://www.facebook.com/yookwoo')}//페이스북
function link_youtube(){window.open('https://www.youtube.com/channel/UCAEgv0w_DYCYb8QWKfPDieQ')}//유튜브


function linkType(url, type){
	if(type == "h") window.open(url)
	else location.href= url
}