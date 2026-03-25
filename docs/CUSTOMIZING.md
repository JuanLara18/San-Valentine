# Customization Guide

Everything you need to personalize Love Quest for your special someone — no prior coding knowledge required.

---

## The only file you need: `valentine.config.ts`

Located at `src/config/valentine.config.ts`. Every field is explained below.

```typescript
export const valentineConfig = {
  senderName: 'Your Name',
  nickname: 'Honey',
  nicknameQuestion: 'Can I call you {nickname}?',
  finalMessage: 'Will you be my Valentine?',
  dateDetails: 'February 14th 💕',
  extraMessage: 'Get ready for a special day!',
  defaultLanguage: 'en',
  theme: 'retro-pink',
};
```

### Field reference

| Field | What it does | Example |
|---|---|---|
| `senderName` | Your name, shown in the final love letter signature | `'Alex'` |
| `nickname` | The nickname you use for your partner | `'Sunshine'` |
| `nicknameQuestion` | Asked after they type their name. `{nickname}` is replaced automatically | `'Can I call you {nickname}?'` |
| `finalMessage` | The main question revealed at the end of the game | `'Will you be my Valentine?'` |
| `dateDetails` | Date or plan shown below the main message | `'February 14th, 8pm 💕'` |
| `extraMessage` | A second line for extra details or a sweet note | `'I have dinner planned already 🍷'` |
| `defaultLanguage` | Starting language — `'en'` or `'es'`. Players can switch in the menu | `'en'` |
| `theme` | Visual theme (currently `'retro-pink'` — more coming soon) | `'retro-pink'` |

---

## Adding a new language

The game uses [i18next](https://www.i18next.com). All UI strings live in `src/i18n/`.

**Step 1.** Duplicate `src/i18n/en.json` and rename it to your language code (e.g. `fr.json`).

**Step 2.** Translate all values (keep the keys unchanged):

```json
{
  "menu": {
    "title": "Love Quest",
    "subtitle": "Une aventure amoureuse",
    "play": "Jouer"
  },
  ...
}
```

**Step 3.** Register the language in `src/i18n/index.ts`:

```typescript
import fr from './fr.json';

i18next.init({
  resources: {
    en: { translation: en },
    es: { translation: es },
    fr: { translation: fr },   // add this line
  },
  ...
});
```

**Step 4.** Set `defaultLanguage: 'fr'` in `valentine.config.ts`.

---

## Story text

The between-level story text (`story.intro`, `story.level1Complete`, `story.level2Complete`) lives in the i18n files — not in the config. Edit those strings directly in `src/i18n/en.json` or `src/i18n/es.json` to change the narrative.

The `{nickname}` placeholder works in story strings too.

---

## Deploying to GitHub Pages

1. **Fork** the repository on GitHub
2. Edit `src/config/valentine.config.ts`
3. Go to your fork's **Settings → Pages**
4. Set **Source** to **GitHub Actions**
5. Push your changes to `main`
6. Wait ~2 minutes for the build to finish
7. Your game is live at `https://[your-username].github.io/love-quest/`

Every future push to `main` triggers an automatic redeploy.

---

## Running locally

```bash
npm install
npm run dev
```

Open `http://localhost:5173` in your browser. Changes to the config hot-reload instantly.

---

## Troubleshooting

**The game shows my old details after editing the config.**
Make sure you saved the file and pushed to `main`. GitHub Pages can take 1–2 minutes to update.

**The deploy badge shows a failure.**
Go to your fork's **Actions** tab and read the error. Most common cause: GitHub Pages wasn't enabled in Settings before the first push.

**The nickname question uses my name, not theirs.**
`nickname` is the name you call *them*, not yourself. `senderName` is your name.

**I want to change the between-level story text.**
Edit `story.intro`, `story.level1Complete`, and `story.level2Complete` in `src/i18n/en.json` (or `es.json`). The config file only controls the final letter.
