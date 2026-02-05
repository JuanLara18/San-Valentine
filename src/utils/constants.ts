/** Scene keys */
export const SCENES = {
  BOOT: 'BootScene',
  MENU: 'MenuScene',
  NAME: 'NameScene',
  STORY: 'StoryScene',
  GAME: 'GameScene',
  VICTORY: 'VictoryScene',
} as const;

/** Asset keys */
export const ASSETS = {
  // Spritesheets
  PLAYER: 'player',
  HEART: 'heart',
  HEART_GOLD: 'heart-gold',
  ENEMY: 'enemy',

  // Images
  PLATFORM: 'platform',
  PLATFORM_SMALL: 'platform-small',
  CLOUD: 'cloud',
  STAR: 'star',
  ENVELOPE: 'envelope',
  LETTER: 'letter',

  // Particles
  PARTICLE_HEART: 'particle-heart',
  PARTICLE_STAR: 'particle-star',
  PARTICLE_CONFETTI: 'particle-confetti',

  // Audio
  MUSIC_MENU: 'music-menu',
  MUSIC_GAME: 'music-game',
  MUSIC_VICTORY: 'music-victory',
  SFX_JUMP: 'sfx-jump',
  SFX_COLLECT: 'sfx-collect',
  SFX_HIT: 'sfx-hit',
  SFX_WIN: 'sfx-win',
  SFX_CLICK: 'sfx-click',
} as const;

/** Events */
export const EVENTS = {
  HEART_COLLECTED: 'heart-collected',
  PLAYER_HIT: 'player-hit',
  LEVEL_COMPLETE: 'level-complete',
  GAME_OVER: 'game-over',
} as const;

/** Registry keys for shared data */
export const REGISTRY = {
  PLAYER_NAME: 'playerName',
  NICKNAME: 'nickname',
  CURRENT_LEVEL: 'currentLevel',
  LIVES: 'lives',
  HEARTS_COLLECTED: 'heartsCollected',
  LANGUAGE: 'language',
} as const;
