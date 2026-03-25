<div align="center">

# 💕 Love Quest

**A retro pixel-art platformer that ends with your personalized love letter.**
Fork → edit one file → share the link. They play. Magic happens.

[![License: MIT](https://img.shields.io/badge/License-MIT-ff6b9d.svg)](LICENSE)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.4-3178C6?logo=typescript&logoColor=white)](https://typescriptlang.org)
[![Phaser 3](https://img.shields.io/badge/Phaser-3.80-ff6b9d)](https://phaser.io)
[![Vite](https://img.shields.io/badge/Vite-5.4-646CFF?logo=vite&logoColor=white)](https://vitejs.dev)
[![Deploy](https://img.shields.io/badge/Auto%20Deploy-GitHub%20Pages-222?logo=github)](https://pages.github.com)

[🎮 **Play Demo**](#) &nbsp;·&nbsp; [📖 **Customization Guide**](docs/CUSTOMIZING.md) &nbsp;·&nbsp; [🏗️ **Architecture**](docs/ARCHITECTURE.md)

<!-- Record a GIF of the full flow (menu → gameplay → victory letter) and replace this -->
![Love Quest gameplay — coming soon](https://placehold.co/600x400/0d0221/ff6b9d?text=Add+your+gameplay+GIF+here)

</div>

---

## The idea

Instead of sending a card, you send a game.

Your special someone receives a link. They enter their name, play through 3 themed levels as a tiny Cupid, collecting hearts along the way. When they win — your personalized love letter appears on screen, typewriter effect and all, with exactly two buttons: **"Yes!"** and **"Obviously yes!"**

No install. No app. Just a URL and a lot of heart.

---

## Make it yours — edit ONE file

**`src/config/valentine.config.ts`** is the only file you need to touch:

```typescript
export const valentineConfig = {
  senderName: 'Your Name',                    // shown in the final love letter
  nickname: 'Honey',                          // their nickname
  nicknameQuestion: 'Can I call you {nickname}?',
  finalMessage: 'Will you be my Valentine?',
  dateDetails: 'February 14th 💕',
  extraMessage: 'Get ready for a special day!',
  defaultLanguage: 'en',                      // 'en' | 'es'
};
```

> Full field reference, language setup, and tips → [Customization Guide](docs/CUSTOMIZING.md)

---

## Go live in 5 steps

1. **Fork** this repository
2. Edit `src/config/valentine.config.ts` with your details
3. Go to **Settings → Pages → Source: GitHub Actions**
4. Push to `main`
5. Share `https://[your-username].github.io/love-quest/` 💌

The included CI/CD workflow builds and deploys automatically on every push. Zero config needed.

---

## The journey

| # | Level | New mechanics | Hearts needed | Mood |
|---|---|---|---|---|
| 1 | The First Heartbeat | Basic platforms, movement | 5 | Gentle sunset |
| 2 | Through the Storms | Moving platforms + enemies | 7 | Stormy sky |
| 3 | The Grand Gesture | Disappearing platforms + all mechanics | 8 + a gold one | Night aurora |

After the third level: heart-rain cinematic → envelope reveal → typewriter love letter → full celebration.

---

## Controls

| Platform | Input |
|---|---|
| Desktop | Arrow keys or WASD — Up / W to jump |
| Mobile | On-screen directional pad + jump button |

---

## Built with

| Tool | Role |
|---|---|
| [Phaser 3](https://phaser.io) | Game engine — physics, rendering, scenes |
| [TypeScript](https://typescriptlang.org) | Type safety across the entire codebase |
| [Vite](https://vitejs.dev) | Dev server + production bundler |
| [i18next](https://www.i18next.com) | EN / ES internationalization |
| [GitHub Actions](https://github.com/features/actions) | Auto-deploy to GitHub Pages |

All pixel art is **generated programmatically** at runtime — no image files, no assets folder.

---

## Local development

```bash
npm install
npm run dev      # dev server at localhost:5173
npm run build    # production build → dist/
```

---

## Want to go deeper?

- [**Customization Guide**](docs/CUSTOMIZING.md) — all config fields explained, how to add a language, troubleshooting
- [**Architecture**](docs/ARCHITECTURE.md) — scene graph, procedural assets, how to add levels or enemies

---

## License

MIT — use it, fork it, send it. Spread the love. 💕

---

<div align="center">
<sub>Made with love, for someone special.</sub>
</div>
