# Love Quest 💕

A retro pixel-art platformer game to ask someone to be your Valentine in the most creative way possible. Built with Phaser 3, TypeScript, and Vite.

**Send the link. They play. They discover your invitation. Magic happens.**

## How It Works

1. Your special someone receives a link to the game
2. They enter their name, and the game playfully suggests the nickname you use for them
3. They play through 3 themed levels as a little Cupid character, collecting hearts
4. After beating the game, a cinematic animation reveals your Valentine's invitation
5. They can only say "Yes!" or "Obviously yes!" 💕

## Levels

- **Level 1 - The First Heartbeat**: Learn to play. Gentle clouds, sunset sky
- **Level 2 - Through the Storms**: Moving platforms, enemies. Stormy weather
- **Level 3 - The Grand Gesture**: Disappearing platforms, all mechanics combined. Night sky with auroras

## Quick Start

```bash
# Install dependencies
npm install

# Start dev server
npm run dev

# Build for production
npm run build
```

## Personalize It (Fork & Customize)

The magic of this project is that **anyone can fork it and make it their own**. You only need to edit ONE file:

**`src/config/valentine.config.ts`**

```typescript
export const valentineConfig = {
  senderName: 'Your Name',          // Your name
  nickname: 'Honey',                // The nickname you use
  nicknameQuestion: 'Can I call you {nickname}?',
  finalMessage: 'Will you be my Valentine?',
  dateDetails: 'February 14th 💕',
  extraMessage: 'Get ready for a special day!',
  defaultLanguage: 'en',            // 'es' for Spanish, 'en' for English
  theme: 'retro-pink',
};
```

## Deploy to GitHub Pages

1. Fork this repository
2. Edit `valentine.config.ts` with your details
3. Go to your repo Settings > Pages > Source: GitHub Actions
4. Push to `main` branch
5. Your game will be live at `https://yourusername.github.io/love-quest/`

The included GitHub Actions workflow handles everything automatically.

## Tech Stack

- **[Phaser 3](https://phaser.io/)** - HTML5 game engine
- **TypeScript** - Type safety and maintainability
- **Vite** - Lightning-fast build tool
- **i18next** - Internationalization (ES/EN included)
- **GitHub Actions** - Automated deployment

## Languages

Currently supports:
- Spanish (es)
- English (en)

Add a new language by creating a JSON file in `src/i18n/` following the existing format.

## Controls

**Desktop**: Arrow keys or WASD to move, Up/W to jump

**Mobile**: On-screen touch buttons (left, right, jump)

## Project Structure

```
src/
├── config/           # Game & Valentine configuration
├── scenes/           # Game scenes (Boot, Menu, Name, Story, Game, Victory)
├── entities/         # Game entities (Player, Heart, Enemy)
├── systems/          # Game systems (LevelManager, AssetGenerator)
├── i18n/             # Translations
└── utils/            # Helpers and constants
```

## Scalability

This project is designed to grow:

- **Add levels**: Define new level data in `LevelManager.ts`
- **Add enemies**: Extend the `Enemy` class
- **Add themes**: Expand the visual theme system
- **Add languages**: Create new i18n JSON files
- **Add power-ups**: Extend the entity system

## License

MIT - Use it, fork it, spread the love!

---

*Made with love for that special someone* ♥
