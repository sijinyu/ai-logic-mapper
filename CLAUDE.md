# AI Logic Mapper

## Project Overview
AI-powered logic visualization SPA that converts natural language business logic into interactive flowcharts using Google Gemini API and React Flow.

## Tech Stack
- **Framework**: Vite 7 + React 19
- **Styling**: Tailwind CSS v4 + shadcn/ui (dark mode, Slate/Zinc tone)
- **Flow Engine**: React Flow v11 (reactflow)
- **AI**: Google Gemini API (`@google/generative-ai`) via `VITE_GEMINI_API_KEY`
- **Icons**: Lucide React
- **Export**: html-to-image (PNG export)
- **Package Manager**: pnpm
- **Deployment**: Vercel

## Project Structure
```
src/
├── components/
│   ├── ui/           # shadcn/ui components (button, card, textarea, etc.)
│   ├── canvas/       # React Flow canvas, custom nodes, toolbar
│   └── sidebar/      # Input panel, history list
├── lib/
│   ├── utils.js      # cn() utility
│   ├── gemini.js     # Gemini API service
│   └── storage.js    # LocalStorage helpers
├── App.jsx
├── main.jsx
└── index.css         # Tailwind + shadcn theme variables
```

## Key Conventions
- Dark mode always-on (class="dark" on html)
- Import alias: `@/` → `./src/`
- State: React useState/useEffect only (no external state library)
- Immutable data patterns (spread, no mutation)
- shadcn/ui components for all UI elements

## Design System
- Background: `bg-background` (oklch dark vars)
- Cards/Nodes: `bg-card` with `border-border`
- Accent: Blue-500/Violet-500 for interactive elements
- Font: Inter (sans), JetBrains Mono (mono)
- Custom scrollbars, smooth transitions (200ms)

## Commands
- `pnpm dev` - Start dev server
- `pnpm build` - Production build
- `pnpm preview` - Preview production build
- `pnpm lint` - ESLint check

## Environment Variables
- `VITE_GEMINI_API_KEY` - Google Gemini API key (required)

## Deployment
- Target: Vercel
- Build command: `pnpm build`
- Output directory: `dist`
- Framework: Vite

## Critical Rules (MUST FOLLOW)
- **MEMORY.md 수시 업데이트 (세션 끊김 대비)** — `~/.claude/projects/-Users-nhn-Documents-p-project-ai-logic-mapper/memory/MEMORY.md`에 기록. 자동 저장 안 됨. **매 작업(Step/Phase) 완료 시 즉시 업데이트**할 것. 세션이 갑자기 끊길 수 있으므로 "나중에 한꺼번에" 쓰지 말고 작업 끝날 때마다 바로 기록. **기록 대상: 코드 변경, 진행 상태, 다음 할 일, 기술 결정사항만.** 일반 대화/설명/질의응답은 기록하지 않음.
- **.env 절대 커밋 금지** — 이전에 API 키 노출 사고 발생. `.gitignore`에 이미 등록됨. `git add` 시 반드시 확인.
- **오버엔지니어링 금지** — 필수 기능만 효율적으로. 불필요한 추상화, 미래 대비 설계 하지 말 것.
- **플랜 파일 참조** — `~/.claude/plans/precious-crafting-riddle.md`에 Phase 2 플랜 있음. 새 세션 시작 시 읽고 이어서 진행.
