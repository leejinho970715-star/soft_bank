# 리뉴얼 UI를 기존 ASP 사이트(www.duzon119.co.kr)에 적용하기

`npm run build:asp`를 실행하면 `dist/asp/`에 적용 패키지가 만들어집니다. Vercel 미리보기(`npm run build`)는 그대로 두고, 같은 소스에서 ASP용으로 변환한 결과입니다.

## 패키지 구성

| 폴더 | 내용 | 적용 방법 |
|---|---|---|
| `site/` | 정적 페이지 16개(제품·기업소개, `.asp` 주소로 저장), 공통 CSS·JS, 실제로 쓰는 이미지·문서만 | 서버 루트에 그대로 업로드 |
| `templates/` | 서버가 내용을 만드는 페이지(게시판·문의·로그인·회원·FAQ·메인)의 새 디자인 HTML | 업로드하지 않고, 기존 ASP 코드에 입혀서 사용 |
| `report.json` | 변환 결과(페이지 목록, 복원한 폼 동작, 이름을 바꾼 파일) | 참고용 |

## 변환 내용

- **링크:** 모든 내부 링크를 기존 주소(`/product/amaranth10/brand.asp`, `/customer/notice.asp?mode=view&idx=5502` …)로 바꿨습니다. 새 페이지 IFRS 18은 `/product/ifrs18.asp`입니다.
- **파일 경로:** 이미지·CSS·JS를 사이트 루트 기준(`/assets/…`, `/renewal/…`, `/styles.css`, `/app.js`)으로 바꿨습니다. 기존 서버에 같은 이름의 폴더·파일이 없음을 확인했습니다.
- **SEO:** canonical, og:url, twitter:url, JSON-LD 주소를 `.asp` 주소로 바꿨습니다.
- **통계:** 기존 페이지와 같은 Google 태그(G-SLFWLP9QKE)와 Tag Manager(GTM-WKPK45TW)를 모든 페이지에 넣었습니다.
- **미리보기 장치 제거:** 폼 제출을 막던 미리보기 표시(`data-preview`, `data-preview-form`)와 안내창을 뺐습니다.
- **폼 동작 복원(templates):** 원본의 `onsubmit`, 폼 `id`·`name`·`target`, 약관 동의·우편번호 링크, 폼 검증 스크립트(구매상담 필수항목 검사 등)를 되살리고, 원본처럼 `/common/js/jquery.lastest.js`, `/_lib/functions.js`, `/_lib/boardcontrol.js`를 불러옵니다. 옛 디자인 전용 스크립트(AOS, ripple, multiTab, 메뉴)는 넣지 않았습니다.
- **IIS:** 확장자 없는 이미지 2개에 `.png`를 붙였습니다. `assets/`, `renewal/` 안에만 `web.config`(webp·json·woff2·svg·mp4·hwp MIME)를 두었습니다. 루트 `web.config`는 건드리지 않습니다.
- **용량:** 저장소의 assets 2.0GB 중 페이지가 쓰는 파일(약 450MB)만 담았습니다.

## 적용 순서

1. **테스트 서버나 백업 먼저:** 운영 서버에 올리기 전에 기존 파일을 백업합니다. `site/`의 `.asp` 16개는 같은 이름의 기존 파일을 덮어씁니다.
2. **`site/` 업로드:** 서버 루트에 폴더 구조 그대로 올립니다.
3. **templates 적용:** 각 ASP 파일에서 기존 공통 include(헤더·푸터)와 옛 CSS·JS(publisher.js, menu.js, fullpage.js, slick, AOS 등)를 빼고, 템플릿의 `<head>`·헤더·푸터·스크립트로 바꿉니다. 본문의 게시판 반복 출력, 폼, 페이지 이동은 기존 ASP 코드를 그대로 두고 템플릿의 클래스 구조만 맞춥니다(게시판·폼 클래스명은 원본과 같습니다).
4. **메인(`index.asp`):** 기존 팝업·DB 연동이 있으면 유지하고, 새 디자인 HTML을 입힙니다. 메인 "고객센터 자료" 영역은 `assets/news-data.js`(수집 시점 데이터)를 쓰므로, 최신 글이 보이게 하려면 이 파일을 ASP에서 만들어 주거나 목록을 ASP로 출력합니다.
5. **확인:** 구매상담 등록, 로그인, 아이디/비밀번호 찾기, 게시판 검색·페이지 이동, 첨부파일 내려받기, FAQ 검색을 실제로 해 봅니다.

## 서버에서만 확인할 수 있는 부분

- 회원가입(`member/join.asp`) 화면은 디자인 시안이라 실제 가입 처리 ASP와 연결이 필요합니다.
- FAQ는 기존 `/customer/faq_data.asp`를 그대로 불러옵니다.
- 오시는 길의 카카오맵은 https 사이트에서 정상 동작합니다(미리보기 사이트에서 확인).
