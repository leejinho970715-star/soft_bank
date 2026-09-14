# Soft Bank

아이원소프트뱅크 메인 웹사이트입니다. Figma 디자인을 기반으로 반응형 레이아웃, GSAP 스크롤 모션, 인터랙티브 퀵메뉴와 질문 선택형 챗봇을 구현했습니다.

파비콘과 Open Graph 공유 이미지를 포함하며, 공유 이미지는 `assets/og-image.jpg`에서 관리합니다.

## 배포

- GitHub Pages: https://leejinho970715-star.github.io/soft_bank/
- 배포 소스: `main` 브랜치의 루트 디렉터리
- `main`에 푸시하면 GitHub Pages가 자동으로 배포합니다.

## 로컬 확인

브라우저에서 `index.html`을 열어 기본 페이지를 확인할 수 있습니다.

서브페이지 리뉴얼 미리보기는 `subpages/index.html`입니다. `npm run dev`로 로컬 서버를 실행한 뒤 `http://127.0.0.1:4173/subpages/`에서 확인합니다.

공개 메뉴와 제품 하위 탭 47개, 공개 FAQ 17개를 수집했습니다. 제품 화면과 텍스트는 원본을 보존하며 회사 소개의 상담 이미지는 3D 에셋으로 교체했습니다. 본문 대조 결과와 폼 메타데이터는 `renewal/content-audit.json`, 실제 ASP 연결 지침은 `renewal/ASP-INTEGRATION.md`에 있습니다.

360·768·1440px 화면에서 47개 페이지의 본문 경계 검사를 완료했습니다. 운영 서버의 ASP 등록·인증·DB 동작은 원본 소스 연결 후 별도 검증이 필요합니다.
