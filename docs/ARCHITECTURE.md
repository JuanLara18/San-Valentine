# Architecture

A technical overview for developers who want to understand, extend, or contribute to Love Quest.

---

## Tech stack

| Layer | Tool | Why |
|---|---|---|
| Game engine | Phaser 3.80 | 2D physics, scene management, input, rendering |
| Language | TypeScript 5.4 | Type safety; catches level design bugs at compile time |
| Bundler | Vite 5.4 | Sub-second HMR, clean ESM output |
| i18n | i18next | Simple key-based translations with interpolation |
| Deploy | GitHub Actions → GitHub Pages | Zero-friction, free hosting on push |

**No image assets.** All sprites, backgrounds, particles, and UI elements are drawn at runtime using Phaser's Graphics API in `AssetGenerator.ts`. This keeps the repo lightweight and makes theming straightforward.

---

## Scene graph

Scenes run sequentially. Phaser starts `BootScene` and each scene calls `this.scene.start('NextScene')` when it's done.

```
BootScene
  └─ MenuScene          (language selector, play button)
       └─ NameScene     (player types their name, nickname prompt)
            └─ StoryScene   (between-level narrative — runs after each level)
                 └─ GameScene    (the platformer — runs once per level)
                      └─ VictoryScene  (cinematic + love letter — after level 3)
```

`StoryScene` and `GameScene` loop: after level 1 completes → StoryScene → GameScene (level 2) → StoryScene → GameScene (level 3) → VictoryScene.

Level progression state is tracked via Phaser's `registry` (a global key-value store shared across scenes).

---

## File structure

```
src/
├── config/
│   ├── valentine.config.ts   # The one file users edit
│   └── game.config.ts        # Phaser game config (canvas size, physics, scenes list)
│
├── scenes/
│   ├── BootScene.ts          # Preloads fonts, initializes i18n and audio
│   ├── MenuScene.ts          # Title screen + language toggle
│   ├── NameScene.ts          # Name input + nickname confirmation flow
│   ├── StoryScene.ts         # Narrative panels between levels
│   ├── GameScene.ts          # Core platformer logic (player, platforms, hearts, enemies)
│   └── VictoryScene.ts       # Cinematic sequence + love letter reveal
│
├── entities/
│   ├── Player.ts             # Cupid sprite, physics body, animation states
│   ├── Heart.ts              # Collectible hearts (normal + gold variant)
│   └── Enemy.ts              # Patrol enemies with configurable speed and distance
│
├── systems/
│   ├── LevelManager.ts       # Level data definitions (platforms, hearts, enemies, config)
│   ├── AssetGenerator.ts     # Procedural pixel art — generates all textures at boot
│   ├── AudioManager.ts       # Scene-aware music with crossfade transitions
│   └── InputManager.ts       # Unified keyboard + touch input abstraction
│
├── i18n/
│   ├── en.json               # English strings
│   ├── es.json               # Spanish strings
│   └── index.ts              # i18next initialization
│
└── utils/
    ├── constants.ts          # Shared numeric constants (gravity, jump velocity, canvas size)
    └── helpers.ts            # Utility functions
```

---

## How to add a level

All level data lives in `src/systems/LevelManager.ts` as an array of `LevelData` objects. Adding a level means pushing a new object to that array.

### LevelData schema

```typescript
interface LevelData {
  name: string;                        // unique identifier
  bgStyle: 'sunset' | 'storm' | 'night'; // background visual
  scrollHeight: number;                // total level height in px (canvas is 400×600)
  playerStart: { x: number; y: number };
  goalY: number;                       // y position of the finish trigger
  requiredHearts: number;              // hearts needed to clear the level
  platforms: PlatformData[];
  hearts: HeartData[];
  enemies: EnemyData[];
}
```

### Platform types

```typescript
interface PlatformData {
  x: number;
  y: number;
  type: 'normal' | 'small' | 'moving';
  moveX?: number;        // horizontal travel distance for moving platforms
  moveY?: number;        // vertical travel distance
  moveSpeed?: number;    // tween duration in ms (lower = faster)
  disappearing?: boolean; // platform fades after the player lands on it
}
```

### Level design constraints

These are derived from the physics config (`constants.ts`):

| Parameter | Value | Notes |
|---|---|---|
| Jump velocity | -420 | |
| Gravity | 800 | |
| Max jump height | ~110 px | Safe vertical gap: 60–85 px |
| Max horizontal reach | ~140 px | At equal height |
| Canvas width | 400 px | |
| Normal platform width | 64 px | |
| Small platform width | 40 px | |
| Player width | 32 px | |

### Adding story text for the new level

After your new level is cleared, `StoryScene` is shown. Add a new entry to the `story` key in both `src/i18n/en.json` and `src/i18n/es.json`:

```json
"level3Complete": [
  "Line one of your story",
  "Line two",
  "{nickname} can appear anywhere"
]
```

Then update `StoryScene.ts` to read this key based on the current level index.

---

## How procedural assets work

`AssetGenerator.ts` runs once in `BootScene` before any other scene loads. It uses `scene.add.graphics()` to draw shapes, then calls `graphics.generateTexture('key', width, height)` to bake them into Phaser's texture cache.

Every subsequent scene references sprites by key (e.g., `'player'`, `'heart'`, `'platform-normal'`) without loading any files.

This approach means:
- Zero asset pipeline
- Themes can be implemented by changing color constants and regenerating textures
- The entire game ships as a single JS bundle

---

## Audio system

`AudioManager` wraps Phaser's Web Audio API with two additions:

1. **First-interaction gate** — audio is initialized on the first user click/tap to comply with browser autoplay policies
2. **Crossfade transitions** — when switching tracks between scenes, the current track fades out while the new one fades in over ~500 ms

Each scene calls `AudioManager.playSceneMusic('boot' | 'menu' | 'story' | 'game' | 'victory')`.

Audio is generated via the Web Audio API oscillators (no audio files), keeping the bundle self-contained.

---

## Input system

`InputManager` provides a single interface for both keyboard and touch:

```typescript
inputManager.isLeft()   // true if left arrow, A, or left touch button is held
inputManager.isRight()
inputManager.isJump()   // true if up arrow, W, space, or jump touch button just pressed
```

`GameScene` queries these methods in its `update()` loop. Adding a new input method (gamepad, for example) means extending `InputManager` without touching `GameScene`.

---

## Adding a new enemy type

Extend the `Enemy` class in `src/entities/Enemy.ts`:

```typescript
export class FlyingEnemy extends Enemy {
  constructor(scene: GameScene, x: number, y: number) {
    super(scene, x, y);
    // override patrol logic, apply vertical movement, change sprite color, etc.
  }
}
```

Then add `direction: 'vertical'` to enemy entries in `LevelManager.ts` and handle it in `GameScene` when spawning enemies.

---

## Contributing

The project intentionally stays simple. Before adding features, consider whether the change makes the forking experience better for someone who just wants to send a Valentine's game in 5 minutes. That's the north star.

PRs that improve the customization flow, fix bugs, add languages, or improve mobile experience are most welcome.
