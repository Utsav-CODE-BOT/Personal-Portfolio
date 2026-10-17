# Interactive AI Portfolio (₹0 / $0 Cost Production Stack)

A modern, fast, dark-themed personal portfolio with streaming conversational AI, character-by-character interactive terminal, live GitHub projects integration, and zero-cost serverless architecture.

Built with **React 18**, **Vite 6**, **Tailwind CSS**, **Framer Motion**, and a zero-database serverless function architecture that runs permanently for **₹0 / $0**.

---

## 🌟 Highlights

- **⚡ Zero Operating Cost**: Runs 100% within free tiers (Vercel Hobby / Cloudflare Pages + Google Gemini Free / Groq Free). No database, no paid vector DB, no credit card required.
- **💬 Streaming AI Assistant**: Conversational agent trained on verified resume and project documentation using BM25 semantic chunk retrieval and streaming Server-Sent Events (SSE).
- **💻 Interactive macOS Terminal**: Types out the About Me story character by character with blinking block cursor and a "Skip Typing" instant accelerator.
- **🐙 Live GitHub Repos**: Automatically pulls non-fork repositories directly via GitHub API with client-side tab session caching.
- **📱 Fully Responsive**: Pixel-faithful dark cyber aesthetic with glassmorphism, glowing gradient cards, and animated mobile navigation.

---

## 🏗️ Repository Layout

```
.
├── README.md                      # Setup and deployment guide
├── THIRD_PARTY_NOTICES.md         # Template author credit and MIT notice
├── vercel.json                    # Zero-config Vercel deployment & SPA routing
├── package.json                   # Root monorepo workspace scripts
├── .github/workflows/ci.yml       # Automated GitHub Actions (Lint, Test, Build, Audit)
├── knowledge/                     # Markdown knowledge base for AI Assistant
│   ├── resume.md
│   └── projects_and_experience.md
├── api/                           # Serverless functions (Vercel / Node)
│   ├── chat.js                    # POST /api/chat with streaming SSE
│   ├── health.js                  # GET /api/health
│   └── lib/                       # Portable core logic
│       ├── chunker.js             # Markdown-aware chunking (~1000 chars, 200 overlap)
│       ├── knowledge.js           # Pre-indexed knowledge & BM25 top-4 retrieval
│       ├── rateLimiter.js         # Per-IP fixed-window rate limiter
│       └── llm.js                 # OpenAI-compatible streaming LLM client
├── functions/api/                 # Cloudflare Pages Functions adapter
│   ├── chat.js
│   └── health.js
└── frontend/                      # React SPA
    ├── index.html                 # SEO meta, OG tags, theme-color
    ├── package.json               # Pinned dependencies
    ├── vite.config.js             # Vite 6 config with local API middleware
    ├── tailwind.config.js         # Tailwind config with tailwind-scrollbar
    ├── public/
    │   ├── config.json            # ALL personal configuration & text
    │   ├── about-me.md            # Terminal story markdown
    │   ├── profile.jpg            # Optimized portrait photo
    │   └── icon.svg               # SVG terminal favicon
    └── src/
        ├── components/            # Layout, NavBar, Home, ChatBox, About, Projects
        ├── config/                # configLoader & ConfigProvider
        ├── hooks/                 # useStreamingChat, useTypingEffect, useGithubRepos
        └── services/              # chatService and github service
```

---

## 🚀 Quick Start (Local Development)

### 1. Clone & Install
```bash
git clone https://github.com/Utsav-CODE-BOT/Personal-Portfolio.git
cd Personal-Portfolio/frontend
npm install
```

### 2. Run Local Development Server
```bash
npm run dev
```
Open [http://localhost:5173](http://localhost:5173). The local Vite development server automatically handles `/api/chat` and `/api/health` with simulated streaming responses even without an external API key!

### 3. Run Tests & Linter
```bash
# Run unit & API test suite (142 tests across 27 files)
npm test

# Run strict ESLint verification
npm run lint

# Build production bundle
npm run build
```

---

## 🔑 Free LLM Provider Setup

You can connect any OpenAI-compatible provider with streaming support for free:

### Option A: Google AI Studio (Gemini) — Recommended
- **Cost**: $0 / ₹0 (No credit card needed)
- **Free Quota**: 15 Requests/Min, 1 Million Tokens/Min, 1,500 Requests/Day
- **Get Key**: [aistudio.google.com](https://aistudio.google.com/)
- **Configuration**:
  ```env
  LLM_BASE_URL=https://generativelanguage.googleapis.com/v1beta/openai/
  LLM_API_KEY=your_gemini_api_key_here
  LLM_MODEL=gemini-1.5-flash
  ```

### Option B: Groq Cloud (Ultra-Fast Llama 3)
- **Cost**: $0 / ₹0
- **Free Quota**: 30 Requests/Min, 14,400 Requests/Day
- **Get Key**: [console.groq.com](https://console.groq.com/)
- **Configuration**:
  ```env
  LLM_BASE_URL=https://api.groq.com/openai/v1
  LLM_API_KEY=your_groq_api_key_here
  LLM_MODEL=llama-3.3-70b-versatile
  ```

---

## 🌐 Free Production Deployment

### Option 1: Vercel (Hobby Tier — $0 Forever)
1. Fork or push this repository to GitHub (`Utsav-CODE-BOT/Personal-Portfolio`).
2. Go to [vercel.com](https://vercel.com) and click **"Add New Project"** → Import your repository.
3. The root `vercel.json` automatically configures the build command (`cd frontend && npm install && npm run build`), output directory (`frontend/dist`), SPA rewrites, and Serverless API functions (`/api/chat.js`).
4. Under **Settings → Environment Variables**, add:
   - `LLM_BASE_URL`: `https://generativelanguage.googleapis.com/v1beta/openai/`
   - `LLM_API_KEY`: *(your free API key)*
   - `LLM_MODEL`: `gemini-1.5-flash`
   - `CHAT_RATE_LIMIT`: `10/minute`
   - `GLOBAL_RATE_LIMIT`: `300/hour`
5. Click **Deploy**. Your portfolio will be live at `https://<project-name>.vercel.app`!

### Option 2: Cloudflare Pages ($0 Forever)
1. Connect your repo in [Cloudflare Dashboard](https://dash.cloudflare.com/) → **Workers & Pages** → **Create application** → **Pages**.
2. Build Settings:
   - Framework preset: `Vite`
   - Build command: `cd frontend && npm install && npm run build`
   - Build output directory: `frontend/dist`
3. Environment variables: Add the same `LLM_*` variables in Settings → Environment variables.
4. Deploy! Cloudflare Pages Functions automatically executes `functions/api/chat.js` with Edge streaming.

---

## ✏️ How to Customize Your Portfolio

All personal data is decoupled from component code:

| What to edit | File location |
|---|---|
| **Name, brand, social links, intro cards, paragraphs** | `frontend/public/config.json` |
| **Terminal biography story** | `frontend/public/about-me.md` |
| **Profile picture** | Replace `frontend/public/profile.jpg` |
| **Resume & career knowledge for the AI** | `knowledge/resume.md` |
| **Project details for the AI** | `knowledge/projects_and_experience.md` |

After editing, simply push to `main` on GitHub to trigger an automatic zero-downtime redeployment!

---

## 🛡️ Free Tier Limits & Protection

1. **Rate Limiting**: Built-in in-memory rate limiter caps chat requests to 10/minute per IP and 300/hour globally, preventing quota exhaustion.
2. **Token Caps**: Responses are capped at 600 max tokens with temperature `0` for deterministic, concise answers.
3. **Session Cache**: GitHub repository queries are cached in `sessionStorage` to prevent reaching GitHub API's 60 req/hour unauthenticated limit.
4. **Prompt Injection Defense**: The system prompt enforces strict third-person communication and treats all incoming input as passive data.

---

## 📜 Credits & License

- Original portfolio template design by [Alon Trugman](https://github.com/alonxt).
- Re-architected into a zero-cost serverless model and personalized for **Utsav D** ([@Utsav-CODE-BOT](https://github.com/Utsav-CODE-BOT)).
- Released under the [MIT License](THIRD_PARTY_NOTICES.md).
