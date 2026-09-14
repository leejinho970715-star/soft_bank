# Classic ASP 적용

이 패키지는 공개 페이지의 본문을 보존한 정적 디자인 미리보기입니다. `subpages/`의 HTML을 ASP 파일에 통째로 덮어쓰지 마세요. 로그인, 등록, 게시판 검색·페이지 이동, 첨부파일, 서버 검증은 원본 ASP에서 실행해야 합니다.

1. 기존 CSS 뒤에 `/renewal/skin.css`를 로드합니다. body에 `sb-renewal` 클래스를 추가합니다. 기존 클래스와 `data-pgCode`는 유지합니다.
2. 본문 컨테이너를 `sb-content` 클래스로 감싸거나 기존 컨테이너에 추가합니다. 헤더·히어로의 `.sb-header`, `.sb-hero` 구조는 정적 미리보기를 참고해 공통 include에 적용합니다.
3. 기존 ASP 코드, include, jquery, 게시판 스크립트, 폼의 id/name/action/method/target, hidden 필드, onsubmit 핸들러를 보존합니다. 미리보기 빌더는 인라인 이벤트를 제거하므로 생성 HTML의 폼을 원본으로 교체하지 마세요.
4. `/renewal/skin.js`는 UI 보조용입니다. 운영 body에 `data-preview="true"`를 넣지 않습니다. 운영 폼에 `data-preview-form`을 넣지 않습니다.
5. 제품 탭에 `sb-product-tabs` 클래스를 추가하고 표는 `sb-table-scroll` 컨테이너로 감쌉니다. 문의 작성 표는 `.board_write`를 유지하면 모바일에서 필드가 세로로 배치됩니다.
6. FAQ는 기존 `/customer/faq_data.asp`와 원본 렌더링·검색 코드를 유지합니다. 미리보기는 수집 시점의 공개 FAQ 17개를 표시합니다.
7. 회사 소개의 `about__list03.jpg`만 `assets/subpages/consulting-3d.png`로 교체했습니다. 제품 화면·문자가 포함된 자료는 원본을 보존했습니다. 원본 서버가 404를 반환하는 부가서비스 장식 아이콘 3개는 미리보기에서 제외했습니다.

CSS는 `.sb-renewal` 또는 `.sb-*` 이름으로 범위를 제한하며 전역 프레임워크를 추가하지 않습니다. 일부 레거시 페이지에 있는 기존 스타일과의 최종 조합은 실제 ASP 테스트 서버에서 확인해야 합니다.

`content-audit.json`에는 공개 경로, 미리보기 경로, 본문 대조 결과, 폼 필드 연결 정보가 있습니다. 47개 페이지는 메뉴·제품 탭의 공개 페이지와 게시판 첫 화면입니다. 게시글 개별 상세, 로그인 뒤 마이페이지, 등록 결과와 DB 작업은 수집·구현 범위에 포함되지 않습니다. 원본 마이페이지 경로 2개는 404로 확인되었습니다.

로컬 확인: `npm ci` → `node tools/build-subpages.mjs` → `node tools/serve.mjs`. 수집 원문은 `reference/`에 보관되어 있고, 네트워크 수집 없이 재빌드할 수 있습니다.
