/**
 * Game Engine Configuration
 * Controls the Phaser game settings, physics, and rendering.
 */
export const gameConfig = {
  /** Game canvas width (logical pixels) */
  width: 400,

  /** Game canvas height (logical pixels) */
  height: 600,

  /** Background color */
  backgroundColor: '#1a0a2e',

  /** Physics settings */
  physics: {
    gravity: 800,
    playerSpeed: 160,
    playerJump: -420,
    bounceRate: 0.05,
  },

  /** Player settings */
  player: {
    lives: 3,
    spriteSize: 32,
    invincibilityDuration: 1500,
  },

  /** Level settings */
  levels: {
    tileSize: 32,
    totalLevels: 3,
  },

  /** UI settings */
  ui: {
    fontFamily: '"Press Start 2P"',
    fontSize: {
      xs: '8px',
      sm: '10px',
      md: '14px',
      lg: '20px',
      xl: '28px',
    },
    colors: {
      primary: '#ff6b9d',
      secondary: '#c44dff',
      accent: '#ff4081',
      text: '#ffffff',
      textShadow: '#4a0028',
      background: '#1a0a2e',
      backgroundLight: '#2d1b69',
      heart: '#ff1744',
      gold: '#ffd700',
      danger: '#ff4444',
    },
  },
};
