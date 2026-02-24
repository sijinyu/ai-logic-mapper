# AI Logic Mapper

> AI 기반 비즈니스 로직 시각화 도구 — 텍스트나 문서를 입력하면 플로우차트를 자동 생성합니다.

**Live Demo:** https://ai-logic-mapper.vercel.app

![Vite](https://img.shields.io/badge/Vite_7-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?logo=tailwindcss&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?logo=googlegemini&logoColor=white)

## 주요 기능

- **AI 플로우차트 생성** — 텍스트 입력 또는 PDF/TXT 파일 업로드로 자동 변환 (Google Gemini 2.5 Flash)
- **노드 & 엣지 편집** — 더블클릭으로 노드 이름/설명 수정, 엣지 라벨 편집/삭제, 드래그로 새 연결 생성
- **다양한 내보내기** — 현재 화면 PNG, 전체 캔버스 PNG, Mermaid 코드 복사
- **공유 링크** — URL 하나로 플로우차트 공유 (별도 서버 불필요)
- **사용자 API 키** — 자신의 Gemini API 키 입력 시 개인 할당량 사용, 없으면 기본 키로 이용 (분당 5회)
- **생성 완료 알림** — 백그라운드 탭에서도 데스크톱 네이티브 알림으로 완료 알림
- **온보딩 투어** — 첫 방문 시 자동 가이드, 언제든 재시작 가능
- **다크 모드** — 항상 다크 테마, 전문적인 디자인

## 기술 스택

| 영역 | 기술 |
|------|------|
| Framework | Vite 7 + React 19 |
| Styling | Tailwind CSS v4 + shadcn/ui |
| Flow Engine | React Flow v11 + dagre 자동 레이아웃 |
| AI | Google Gemini 2.5 Flash (Structured JSON Output) |
| Export | html-to-image (PNG), Mermaid (텍스트) |
| Tour | driver.js |
| Deploy | Vercel |

## 시작하기

```bash
# 의존성 설치
pnpm install

# 환경변수 설정
cp .env.example .env
# .env에 VITE_GEMINI_API_KEY=your_key 입력

# 개발 서버
pnpm dev

# 프로덕션 빌드
pnpm build
```

Gemini API 키는 [Google AI Studio](https://aistudio.google.com/apikey)에서 무료 발급 가능합니다.

## 업데이트 내역

### v2.0 (2025-02-24)

**노드 & 엣지 편집**
- 노드 더블클릭으로 이름/설명 직접 수정
- 엣지 선택 시 라벨 편집/삭제 가능
- 핸들 드래그로 새 연결선 직접 생성

**다양한 내보내기**
- PNG 저장: 현재 화면 또는 전체 캔버스 선택 가능
- Mermaid 코드 복사: 클립보드 복사 후 mermaid.live 등에서 바로 활용
- 공유 링크 생성: URL 하나로 플로우차트 공유

**사용자 API 키 지원**
- 자신의 Google Gemini API 키를 입력하면 개인 할당량으로 무제한 사용
- 키 없이도 기본 키로 이용 가능 (분당 5회 제한)
- 키는 브라우저 localStorage에만 저장

**생성 완료 알림**
- 플로우차트 생성 완료 시 데스크톱 네이티브 알림
- 다른 작업 중에도 완료 시점을 놓치지 않음

**성능 최적화**
- 번들 4분할 (react / react-flow / gemini / app)로 초기 로딩 개선
- 클라이언트 사이드 Rate Limiting으로 API 안정성 확보

### v1.0 (2025-02-23)
- 텍스트/파일 입력 → AI 플로우차트 생성
- React Flow 기반 인터랙티브 캔버스
- 히스토리 관리 (localStorage)
- PNG 내보내기
- 온보딩 투어
- Vercel 배포

## 라이선스

MIT
