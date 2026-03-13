# 🐧 PickMyDistro

**Find your perfect Linux distribution in 3–5 adaptive questions.**

With 600+ Linux distributions out there, choosing the right one is overwhelming. PickMyDistro uses a decision-tree engine that adapts its questions based on your answers, so you only see what's relevant to your situation.

🔗 **Live:** [pickmydistro.net](https://pickmydistro.net)

## How It Works

The quiz is a decision tree, not a fixed questionnaire. Early answers prune irrelevant branches entirely — picking "Server" means you'll never be asked about desktop familiarity or GPU brand. Beginners see 4–5 questions, power users may only need 3.

```
Experience → Purpose ─┬─ Desktop  → Priority → Hardware? → Migration? → [3 distros]
                      ├─ Gaming   → GPU → Priority → [3 distros]
                      ├─ Dev      → Priority → [3 distros]
                      ├─ Server   → Priority → Hardware? → [3 distros]
                      └─ Security → [3 distros based on experience]
```

A display scoring layer generates match percentages for the UI — the tree picks *what* to recommend, scoring determines the *numbers*.

## Features

- **57 distributions** with verified data — from Ubuntu to Qubes OS, CachyOS to Tails
- **Adaptive quiz** — 3–5 questions depending on your path
- **5 use-case branches** — Desktop, Development, Gaming, Server, Security/Pentesting
- **Browse mode** — sort all 57 distros by 10 trait dimensions
- **Detailed cards** — description, package manager, desktop environments, difficulty, pros/cons, direct links
- **Head-to-head comparison** — visual trait chart of your top 3
- **Answer editing** — change any answer from results and get re-scored
- **Accessible** — keyboard navigation, ARIA labels, skip-to-content, reduced motion support
- **No tracking, no cookies, no API calls** — fully static, runs entirely in the browser

## Distro Coverage

| Category | Examples |
|----------|---------|
| Beginner | Ubuntu, Linux Mint, Zorin OS, elementary OS, Pop!_OS |
| Gaming | CachyOS, Bazzite, Nobara, Garuda, SteamOS |
| Developer | Fedora, NixOS, Arch, openSUSE, Gentoo |
| Server | Debian, Rocky Linux, AlmaLinux, Alpine, RHEL |
| Privacy | Tails, Qubes OS, Whonix, Parrot OS |
| Lightweight | MX Linux, antiX, Void Linux, Puppy, Tiny Core |
| Immutable | Bazzite, Fedora Silverblue, openSUSE Aeon, Vanilla OS |

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Build | Vite 6 |
| Styling | CSS-in-JS (inline styles + scoped classes) |
| Fonts | Instrument Serif, DM Sans, JetBrains Mono |
| Data | Static JSON, inlined at build time |

No backend. No database. No API keys.

## Getting Started

```bash
git clone https://github.com/01E0E1/pickmydistro.git
cd pickmydistro
npm install
npm run dev
```

Opens at `http://localhost:5173` with hot reload.

Build for production:

```bash
npm run build
```

Outputs to `dist/`.

## Contributing

**Adding a distribution:** add an entry to `distros.json` following `schema.json`, then add it to the appropriate tree branch in `src/App.jsx` if it should appear in quiz results.

**Updating data:** distro info goes stale fast. PRs updating `distros.json` and `src/App.jsx` with new releases, changed desktops, or project status changes are welcome.

## License

MIT
