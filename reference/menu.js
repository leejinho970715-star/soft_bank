var depth_01 = 0 ,depth_02 = 0 ,depth_03 = 0 ,depth_04 = 0 ;
var tit_1="",tit_2="", tit_3="", tit_4="";
var menuFull = [
	["01","제품/서비스", "javascript:link0101();", "Product & Service", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", ""]
		,["0104","OmniEsol", "javascript:link0104();", "", "", "ERP·그룹웨어·AI가 하나로 융합된 더존 차세대 통합 비즈니스 플랫폼", "", ""]
		,["0101","Amaranth 10", "javascript:link0101();", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
		,["0102","WEHAGO", "javascript:link0102();", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
		,["0107","ONE AI", "javascript:link0107();", "", "", "내가 願(ONE)하면 AI가 答(답)합니다. 더존의 핵심 업무 솔루션에 내재화된 AI 브랜드", "", ""]
		,["0108","Amaranth 10(비영리)", "javascript:link0108();", "", "", "회계·인사·예산 + 그룹웨어 + 문서유통(웹한글기안기) 비영리 통합관리 에디션", "", ""]
		// ,["0103","PMS 서비스 소개", "javascript:link0103();", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
	,["02","공지사항", "javascript:link0201();", "notice", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", ""]
		,["0201","정부지원사업", "javascript:link0201();", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
		,["0202","더존프로모션", "javascript:link0202();", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
		// ,["0202","스마트공장", "javascript:link0202();", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
		// ,["0203","비대면 서비스 바우처", "javascript:link0203();", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
		// ,["0204","기타 지원사업", "javascript:link0204();", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
	,["03","구입문의 ", "javascript:link0301();", "Purchase inquiry", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", ""]
		,["0301","제품/서비스 구매상담", "javascript:link0301();", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
		,["0305","비즈니스 제휴문의", "javascript:link0305();", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
		,["0302","세미나 안내/소개 영상", "javascript:link0302();", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
		,["0304","Amaranth10 소개영상", "/purchase/amavideo.asp", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
		,["0303","제품/서비스 제안서", "javascript:link0303();", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
	,["04","고객센터", "javascript:link0401();", "Customer Center", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", ""]
		,["0405","공지사항", "/customer/notice.asp", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
		,["0409","자주 묻는 질문(FAQ)", "/customer/faq.asp", "", "", "Amaranth10·WEHAGO 등 자주 묻는 질문을 빠르게 확인하세요.", "", ""]
		,["0401","Amaranth10", "javascript:link0401();", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
		,["0403","Bizbox Alpha", "javascript:link0403();", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
			// ,["040601","지역별 판매점", "javascript:link040601();", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
			// ,["040602","온라인 판매점", "javascript:link040602();", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
		,["0402","iCUBE / iCUBE G20", "javascript:link0402();", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
		// ,["0406","PMS", "javascript:link0406();", "", "", "PMS 고객 AS 접수 및 처리 문의 게시판", "", ""]
		,["0407","OmniEsol", "javascript:link0407();", "", "", "OmniEsol 고객 AS 접수 및 처리 문의 게시판", "", ""]
		,["0408","WEHAGO:교육영상", "javascript:link0408();", "", "", "WEHAGO 교육영상 유튜브 채널", "", ""]
		,["0404","원격지원", "javascript:link0404('h');", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
	,["05","기업소개", "javascript:link0501();", "About Us", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", ""]
		,["0501","기업소개", "javascript:link0501();", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
		,["0502","개인정보취급방침", "javascript:link0502();", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
		,["0503","오시는 길", "javascript:link0503();", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
		,["0504","본사 협력사 소개", "javascript:link0504();", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]

    , ["06", "커뮤니티", "javascript:link0601();", "Community", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
        , ["0601", "자유게시판", "javascript:link0601();", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
        , ["0602", "구인/구직", "javascript:link0602();", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]

	,["10","Member", "javascript:link1001();", "Member", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
		,["1001","로그인", "javascript:link1001();", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
		,["1002","아이디/비번찾기", "javascript:link1002()", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
		,["1003","회원가입", "javascript:link1003()", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]

	,["11","Mypage", "javascript:link1101();", "Mypage", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
		,["1101","정보수정", "javascript:link1101();", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
		//,["1102","회원탈퇴", "javascript:link1102();", "", "", "진행도", "", ""]

	,["12","기업소개", "javascript:link1201();", "이용약관", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
		,["1201","이용약관", "javascript:link1201();", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
		// ,["1202","이용약관", "javascript:link1202();", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]

	,["20","통합검색", "javascript:link2001();", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
		,["2001","검색결과", "javascript:link2001();", "", "", "기업을 위한 모든 ICT Solution과 Service를 제공하는 대한민국 대표 ICT 기업 더존", "", ""]
];
function replaceAll(str, searchStr, replaceStr) {
	return str.split(searchStr).join(replaceStr);
}
//@Page Navi셋팅
function findMenuName(cd){
	var menuName = '';
	for(var i=0; i < menuFull.length; i++){
		if(menuFull[i][0]==cd){
			menuName = replaceAll(menuFull[i][1],"<br />","");
			break;
		}
	}
	return menuName;
}
function globalNavigation(pcd){
	if(!pcd)return;
	var navi = '';
	var lastNaviNum = parseInt(pcd.length / 2,10);
	for(var y=1; y <= lastNaviNum; y++){
		mcd = pcd.substr(0,y*2);
		if(findMenuName(mcd)){
			if(y!=lastNaviNum){
				navi +='<span>'+findMenuName(mcd)+'</span>';
			}else{
				navi +='<span class="last">'+findMenuName(mcd)+'</span>';
			}
		}
	}

	$("#pageTop>.pageNavi").html('<span class="home">Home</span>'+navi);
}
// GNB
function globalNavigationBar(){
	var tmp = "";
	var tmp2 = "";
	var tmp3 = "";
	var tmp4 = "";
	var result = "";
	for(var i=0; i < menuFull.length; i++){
		if(menuFull[i][0].length==2){
			if(menuFull[i][0] < "09"){
				if(i != 0 && tmp != menuFull[i][0]){
					result += '</ul></li>';
				}

				result += '<li class="'+menuFull[i][4]+'"><a href="'+menuFull[i][2]+'"><span>' + menuFull[i][1] +'</span><i></i></a>';
				tmp = menuFull[i][0];
			}
		}else if(menuFull[i][0].length==4){
			if(menuFull[i][0] < "09"){
				if(tmp2 == "" || (tmp2.substring(0,2) != menuFull[i][0].substring(0,2))){
					result += '<ul class="gnbSub d2">';
				}

				result += '<li><a href="'+menuFull[i][2]+'"><span>' + menuFull[i][1] +'</span></a>';
				tmp2 = menuFull[i][0];
				if(tmp2.substring(0,2) != menuFull[i][0].substring(0,2)){
					result += '</ul>';
				}
			}
		}
	}
	document.write(result);
}
//@ 메뉴 리스트
var pcd;
function leftMenuList(pcd){
	/*
	if(dn1 < 10 && dn1){if(dn1 != 0){dn1 = "0"+dn1;}else{dn1 = ""}}
	if(dn2 < 10 && dn2){if(dn2 != 0){dn2 = "0"+dn2;}else{dn2 = ""}}
	if(dn3 < 10 && dn3){if(dn3 != 0){dn3 = "0"+dn3;}else{dn3 = ""}}
	if(dn4 < 10 && dn4){if(dn4 != 0){dn4 = "0"+dn4;}else{dn4 = ""}}

	pcd = dn1+dn2+dn3+dn4;

	//alert(dn1+"__"+dn2+"__"+dn3+"__"+dn4+"__"+pcd)
	//alert(depth_01+"__"+depth_02+"__"+depth_03+"__"+depth_04+"__"+pcd)
	*/

	$("ul#nav").prepend('<li class="home"><a href="javascript:link0000();"><img src="/images/icon_home.png" alt="home" /></a></li>');

	if(!pcd)return;
	var strMainOn = '';
	var strMainOff = '';
	var strSubOn = '';
	var strSubOff = '';
	var str3dpthOn = '';
	var str3dpthOff = '';
	var str4dpthOn = '';
	var str4dpthOff = '';
	for(var i=0; i < menuFull.length; i++){
		// 원뎁스
		if(menuFull[i][0].length==2){
			mCss="";
			if(menuFull[i][0] == pcd.substr(0,menuFull[i][0].length)) mCss='_on';
			var opens = (mCss) ? "active" : ""; //@ Left 현재 메뉴 고정

			if(menuFull[i][0] == pcd.substr(0,menuFull[i][0].length)){
				strMainOn = '<li class="sMenu sDepth01"><a href="javascript:void(0);"><span>' + menuFull[i][1] + '</span><i></i></a><div class="lnbSub">';
			}

			if(menuFull[i][0] < "09"){
				strMainOff += '<a href="'+menuFull[i][2]+'" class="'+opens+'"><span>' + menuFull[i][1] + '</span></a>';
			}
		}

		// 투뎁스
		if(menuFull[i][0].length==4 && menuFull[i][0].substr(0,2) == pcd.substr(0,2)){
			if(menuFull[i][0].length==4){
				mCss="";
				if(menuFull[i][0] == pcd.substr(0,menuFull[i][0].length)) mCss='_on';
				var opens = (mCss) ? "active" : ""; //@ Left 현재 메뉴 고정

				if(menuFull[i][0] == pcd.substr(0,menuFull[i][0].length)){
					strSubOn = '<li class="sMenu sDepth02"><a href="javascript:void(0);"><span>' + menuFull[i][1] + '</span><i></i></a><div class="lnbSub">';
				}
				strSubOff += '<a href="'+menuFull[i][2]+'" class="'+opens+'"><span>' + menuFull[i][1] + '</span></a>';
			}
		}

		// 쓰리뎁스
		if(menuFull[i][0].length==6 && menuFull[i][0].substr(0,2) == pcd.substr(0,2) && menuFull[i][0].substr(0,4) == pcd.substr(0,4)){
			if(menuFull[i][0].length==6){
				mCss="";
				if(menuFull[i][0] == pcd.substr(0,menuFull[i][0].length)) mCss='_on';
				var opens = (mCss) ? "active" : ""; //@ Left 현재 메뉴 고정

				if(menuFull[i][0] == pcd.substr(0,menuFull[i][0].length)){
					str3dpthOn = '<li class="sMenu sDepth03"><a href="javascript:void(0);"><span>' + menuFull[i][1] + '</span><i></i></a><div class="lnbSub">';
				}
				str3dpthOff += '<a href="'+menuFull[i][2]+'" class="'+opens+'"><span>' + menuFull[i][1] + '</span></a>';
			}
		}

		// 포뎁스
		if(menuFull[i][0].length==8 && menuFull[i][0].substr(0,2) == pcd.substr(0,2) && menuFull[i][0].substr(0,6) == pcd.substr(0,6)){
			if(menuFull[i][0].length==8){
				mCss="";
				if(menuFull[i][0] == pcd.substr(0,menuFull[i][0].length)) mCss='_on';
				var opens = (mCss) ? "active" : ""; //@ Left 현재 메뉴 고정

				if(menuFull[i][0] == pcd.substr(0,menuFull[i][0].length)){
					str4dpthOn = '<li class="sMenu sDepth04"><a href="javascript:void(0);"><span>' + menuFull[i][1] + '</span><i></i></a><div class="lnbSub">';
				}
				str4dpthOff += '<a href="'+menuFull[i][2]+'" class="'+opens+'"><span>' + menuFull[i][1] + '</span></a>';
			}
		}
	}
	document.write(strMainOn+strMainOff+'</li>');
	document.write(strSubOn+strSubOff+'</li>');
	document.write(str3dpthOn+str3dpthOff+'</li>');
	document.write(str4dpthOn+str4dpthOff+'</li>');

	setTimeout(function(){
		depth(pcd);
		//globalNavigation(pcd)
	}, 0);
}



var h2_title = "";
var h3_title = "";
function depth(pcd){
	depth_01 = $("#snb #nav .sDepth01 .lnbSub a.active").index();
	depth_02 = $("#snb #nav .sDepth02 .lnbSub a.active").index();
	depth_03 = $("#snb #nav .sDepth03 .lnbSub a.active").index();
	depth_04 = $("#snb #nav .sDepth04 .lnbSub a.active").index();

	if(pcd.length > 2 || pcd.length == 2){
		var tcd_01 = pcd.substr(0,2);
		for(var i=0; i < menuFull.length; i++){
			if(menuFull[i][0].length==2 && menuFull[i][0] == tcd_01){
				break;
			}
		}
		tit_1 = menuFull[i][1];

		h2_title = menuFull[i][1];

		$("#sVisual").addClass("bg_"+tcd_01);
		$("#sVisual .s-cate").html(menuFull[i][1]);
		$("#sVisual h2").html(menuFull[i][3]);
	}


	//////////////////////////////////////////////////////////////
	if(pcd.length > 2 || pcd.length == 4){
		var tcd_02 = pcd.substr(0,4);
		for(var i=0; i < menuFull.length; i++){
			if(menuFull[i][0].length==4 && menuFull[i][0] == tcd_02){
				break;
			}
		}
		tit_1 = tit_1+" &gt; ";
		tit_2 = menuFull[i][1];

		h3_title = menuFull[i][1];

		$("#sVisual .s-txt").html(menuFull[i][5]);
	}
	//////////////////////////////////////////////////////////////
	if(pcd.length > 4 || pcd.length == 6){
		var tcd_03 = pcd.substr(0,6);
		for(var i=0; i < menuFull.length; i++){
			if(menuFull[i][0].length==6 && menuFull[i][0] == tcd_03){
				break;
			}
		}
		tit_2 = tit_2+" &gt; ";
		//tit_3 = menuFull[i][1];

		//h3_title = menuFull[i][1];
	}
	//////////////////////////////////////////////////////////////
	/*
	var datapgTitle = $("body").attr("data-pgTitle");
	if(datapgTitle != "" && datapgTitle != undefined){
		$("#pageTop").html("<h3>"+datapgTitle+"</h3>");
	}else{
		$("#pageTop").html("<h3>"+pgt+"</h3>");
	}
	*/

	var newMenu = $("#snb .sDepth03 .lnbSub").html();
	if(newMenu){
		setTimeout(function(){
			$("#container").prepend('<div class="depth-three">'+newMenu+'</div>')
		}, 200);
	}

	//alert(tit_1 +"__"+ tit_2 +"__"+ tit_3 )
	$("head title").html(tit_1 + tit_2 + tit_3 +" | 아이원소프트뱅크(주)");
	setTimeout(function(){
		$("#pageTop>h3").html(h3_title);
	}, 200);


	if(depth_01 != -1){
		$("#pcMenu #list>li:eq("+depth_01+")").addClass("oPage");
		if(depth_02 != -1){
			$("#pcMenu #list>li:eq("+depth_01+") .gnbSub.d2>li:eq("+depth_02+")").addClass("oPage");
			if(depth_03 != -1){
				$("#pcMenu #list>li:eq("+depth_01+") .gnbSub.d2>li:eq("+depth_02+") .gnbSub.d3>li:eq("+depth_03+")").addClass("oPage");
			}
		}

		$("#menu>li:eq("+depth_01+")").addClass("oPage");
		if(depth_02 != -1){
			$("#menu>li:eq("+depth_01+") .gnbSub.d2>li:eq("+depth_02+")").addClass("oPage");
			if(depth_03 != -1){
				$("#menu>li:eq("+depth_01+") .gnbSub.d2>li:eq("+depth_02+") .gnbSub.d3>li:eq("+depth_03+")").addClass("oPage");
			}
		}
	}
}