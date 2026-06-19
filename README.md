# AI Workplace Productivity Assistant

**Work Smarter. Automate Faster. Achieve More with AI.**

A modern AI-powered web application that helps professionals streamline workplace activities, improve efficiency, and enhance decision-making through intelligent automation.

## Features

- 📊 **Dashboard** — Unified view of productivity KPIs and quick actions
- ✉️ **Smart Email Generator** — Draft professional emails in seconds
- 📝 **Meeting Notes Summarizer** — Turn transcripts into clear summaries and action items
- ✅ **AI Task Planner** — Break goals into prioritized, actionable plans
- 🔍 **AI Research Assistant** — Get structured research briefs on any topic
- 💬 **AI Chatbot** — Multi-turn conversational assistant with context retention

## Tech Stack

- **Framework:** [TanStack Start](https://tanstack.com/start) (React 19 + Vite 7)
- **Styling:** Tailwind CSS v4 + shadcn/ui
- **AI:** Lovable AI Gateway (Google Gemini)
- **Language:** TypeScript
- **Package Manager:** Bun

## Getting Started

### Prerequisites

- [Bun](https://bun.sh) installed

### Installation

```bash
bun install
```

### Development

```bash
bun dev
```

The app will be available at `http://localhost:8080`.

### Build

```bash
bun run build
```

## Project Structure

```text
src/
├── components/      # Shared UI components (AppShell, ToolPage, ToolOutput)
│   └── ui/          # shadcn/ui primitives
├── lib/             # Server functions and AI gateway
│   ├── ai.functions.ts        # Email, summarizer, planner, research
│   └── ai-gateway.server.ts   # Lovable AI client
├── routes/          # File-based routes
│   ├── index.tsx    # Dashboard
│   ├── chat.tsx     # AI Chatbot
│   ├── email.tsx    # Smart Email Generator
│   ├── summarizer.tsx
│   ├── planner.tsx
│   ├── research.tsx
│   └── api/chat.ts  # Streaming chat endpoint
└── styles.css       # Global styles + Tailwind config
```

## Responsible AI

All AI-generated outputs include a disclaimer. Always review content before sharing or acting on it. Do not submit confidential or personally identifiable information into prompts.

## License

MIT

---

Built with [Lovable](https://lovable.dev).