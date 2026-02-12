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
