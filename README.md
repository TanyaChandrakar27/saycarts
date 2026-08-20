# 🛒 SayCarts — Smart Voice & Multi-Cart Shopping Assistant

> **A voice-controlled multi-cart shopping list with AI-powered suggestions, multilingual support, and offline capability.**

[![Live Demo](https://img.shields.io/badge/Live%20Demo-Visit%20App-7c3aed?style=for-the-badge)](https://your-username.github.io/saycarts)
[![PWA](https://img.shields.io/badge/PWA-Installable-06b6d4?style=for-the-badge)](https://your-username.github.io/saycarts)
[![Offline](https://img.shields.io/badge/Works-Offline-10b981?style=for-the-badge)](#)

---

## ✨ What Makes This Different

While most shopping apps have **one list**, real life has many: a weekly grocery run, a Costco trip, party supplies, and an Amazon haul — all at the same time.

**SayCarts solves this with a fully voice-controlled Multiple Cart System.** You can create, switch between, and even merge carts entirely by voice.

---

## 🎤 Voice Commands

| Say this | What it does |
|---|---|
| `"Add 2 bottles of milk"` | Adds item with quantity |
| `"I need eggs"` | Natural language add |
| `"Add milk to my Costco cart"` | Cross-cart add |
| `"Remove apples"` | Remove item |
| `"Check milk"` / `"I got eggs"` | Mark as bought |
| `"Create cart Party Supplies"` | New shopping cart |
| `"Switch to Costco"` | Change active cart |
| `"Merge Party into Weekly"` | Combine two carts |
| `"Clear the cart"` | Remove all items |
| `"Find organic apples"` | Search across all carts |
| `"Undo"` | Undo last action |

**Keyboard shortcuts:** `Space` → toggle mic | `Ctrl+Z` → undo

---

## 🌍 Supported Languages

English · Español · Français · Deutsch · हिंदी · 中文 · Português · العربية

---

## 🚀 Features

### Voice & NLP
- **20+ intent patterns** — handles "Add", "Buy", "I need", "Get me", "I'd like", "Please add", and more
- **Quantity extraction** — "2 bottles of", "a dozen", "a few", "some"
- **Unit normalization** — bottles, cans, bags, kg, lbs, packs, etc.
- **Fuzzy item matching** for remove/check commands
- **Web Speech API** — no API key needed, works in Chrome and Edge

### Multiple Cart System *(unique feature)*
- Create unlimited named carts with custom color & emoji
- Switch carts by voice: `"Switch to Costco"`
- Add to any cart by voice: `"Add milk to party cart"`
- Merge carts: `"Merge party into weekly"`
- Per-cart progress tracking

### Smart Suggestions
- **Frequently bought together** — suggests companions based on current items
- **Seasonal recommendations** — changes by month
- **Product substitutes** — dairy-free, gluten-free, budget alternatives
- **History analysis** — learns from items across all your carts
- **Optional Gemini AI** — drop in a free API key for AI-powered suggestions

### Shopping List Management
- **Auto-categorization** — 500+ items mapped across 15 categories
- **Quantity controls** — +/− buttons per item
- **Check off items** — with progress bar
- **Undo any action** — up to 30 steps
- **Export cart** — plain text for sharing
- **Real-time search** — filters items across all categories

### PWA / Mobile
- **Installable** — add to home screen on iOS/Android
- **Works offline** — Service Worker caches all assets
- **Mobile-first** — optimized for one-handed use

---

## 🛠 Technical Approach

```
/
├── index.html       # Semantic HTML shell with ARIA labels
├── style.css        # Dark glassmorphism design system (CSS custom properties)
├── categories.js    # 500+ item → category mapping engine
├── voice.js         # Web Speech API wrapper + NLP intent parser
├── suggestions.js   # Smart suggestions (Gemini AI + rule-based fallback)
├── app.js           # State management, CRUD, undo/redo, persistence
├── ui.js            # DOM rendering, event handling, modal management
├── sw.js            # Service Worker for offline PWA
└── manifest.json    # PWA manifest
```

**Key decisions:**
- **No build step** — pure HTML/CSS/JS for zero-friction evaluation
- **localStorage persistence** — data survives refreshes without a backend
- **Graceful degradation** — Gemini AI is optional; app works fully without it
- **Web Speech API** — free, built-in, multilingual — no paid speech service needed

---

## ⚡ Getting Started

### Option 1: Open directly
Just open `index.html` in Chrome or Edge. No server needed for basic use.

### Option 2: Local server (recommended for PWA features)
```bash
# Python
python -m http.server 8080

# Node.js
npx serve .

# Then open http://localhost:8080
```

### Option 3: Deploy to GitHub Pages
1. Push to a GitHub repo
2. Go to Settings → Pages → Deploy from `main` branch
3. Your app is live at `https://username.github.io/saycarts`

---

## 🔑 Optional: Gemini AI Key

1. Get a free key at [aistudio.google.com](https://aistudio.google.com)
2. Open the app → ⚙️ Settings → paste your key
3. The suggestions panel now uses AI instead of rule-based logic

**Without a key**, the app still works perfectly with built-in suggestions.

---

## 🧪 Test It Out

Say these commands to explore all features:
1. `"Create cart Costco"` → makes a new cart
2. `"Add 5 bottles of water"` → adds with quantity
3. `"Add eggs to Costco cart"` → cross-cart add
4. `"Switch to Weekly"` → switches back
5. `"I need milk"` → natural language
6. `"Merge Costco into Weekly"` → merges carts
7. `"Check milk"` → marks as bought
8. `"Undo"` → reverses last action

---

## 📝 Approach Write-Up *(~200 words)*

The core insight driving SayCarts is that people don't have **one** shopping list — they have many. A weekly grocery run, a Costco trip, party supplies, a wishlist. Most apps force everything into a single list, creating chaos.

My unique differentiator is a **voice-first Multiple Cart System**: you can create, populate, switch between, and merge completely separate carts entirely by voice — including cross-cart commands like `"Add milk to my Costco cart"`.

The NLP engine uses a priority-ordered regex intent parser handling 20+ natural language patterns, quantity/unit extraction, and fuzzy item matching. It's intentionally built without a paid NLP API — making it zero-cost and zero-setup for evaluators.

Smart suggestions run on a layered engine: first checking what "frequently goes together" with current items (based on a curated database), then pulling seasonal suggestions by current month, then optionally calling the free Gemini API for personalized AI recommendations.

The app is an offline-capable PWA backed by a Service Worker, uses no framework or build step, and stores all data in localStorage — so it just works when you open it. Clean code, real problem, voice-first experience.

---

## 📄 License

MIT License — feel free to use and adapt.
