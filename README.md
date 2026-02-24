# AI Logic Mapper

> AI 기반 비즈니스 로직 시각화 도구 — 텍스트나 문서를 입력하면 플로우차트를 자동 생성합니다.

**Live Demo:** https://ai-logic-mapper.vercel.app

![Vite](https://img.shields.io/badge/Vite_7-646CFF?logo=vite&logoColor=white)
![React](https://img.shields.io/badge/React_19-61DAFB?logo=react&logoColor=black)
![Tailwind](https://img.shields.io/badge/Tailwind_CSS_v4-06B6D4?logo=tailwindcss&logoColor=white)
![Gemini](https://img.shields.io/badge/Google_Gemini-8E75B2?logo=googlegemini&logoColor=white)

## 주요 기능

| 기능 | 설명 |
|------|------|
| AI 플로우차트 생성 | 텍스트 입력 또는 PDF/TXT 업로드 → Google Gemini가 자동 변환 |
| Refine Mode | 생성된 플로우차트를 프롬프트로 수정 — 기존 컨텍스트 유지하며 후속 지시 |
| 사이드바 접기 | 토글 버튼으로 사이드바 축소/확장, 캔버스 공간 최대화 |
| 히스토리 활성 표시 | 현재 작업 중인 기록 하이라이트, Refine 시 해당 기록 덮어쓰기 |
| 노드 편집 | 더블클릭으로 이름/설명 수정 |
| 엣지 편집 | 라벨 수정, 삭제, 끝점 드래그로 연결 변경, 핸들 드래그로 새 연결 생성 |
| PNG 내보내기 | 현재 화면 / 전체 캔버스 선택 |
| Mermaid 내보내기 | 클립보드 복사 → mermaid.live 등에서 바로 활용 |
| 공유 링크 | URL 하나로 플로우차트 공유 (서버 불필요) |
| API 키 전환 | 자신의 Gemini 키 입력 시 무제한, 기본 키는 분당 5회 |
| 생성 완료 알림 | 백그라운드 탭에서 데스크톱 네이티브 알림 |
| 온보딩 투어 | 첫 방문 자동 가이드, ? 버튼으로 재시작 |
| 다크 모드 | 항상 다크 테마 |

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
pnpm install

# .env에 VITE_GEMINI_API_KEY=your_key 입력
cp .env.example .env

pnpm dev       # 개발 서버
pnpm build     # 프로덕션 빌드
```

Gemini API 키는 [Google AI Studio](https://aistudio.google.com/apikey)에서 무료 발급 가능합니다.

## 라이선스

MIT
