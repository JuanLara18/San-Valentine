/**
 * InputManager - Scalable input system with per-player key schemes.
 *
 * Usage:
 *   Single player  → InputManager with INPUT_SCHEMES.SINGLE (all keys + mobile)
 *   Multiplayer    → Player 1 gets INPUT_SCHEMES.PLAYER1 (WASD + Space + mobile)
 *                    Player 2 gets INPUT_SCHEMES.PLAYER2 (Arrow keys)
 *
 * Adding a new scheme is as simple as defining a new InputScheme object.
 */

/** Defines which keys map to each action for a given player */
export interface InputScheme {
  left: string[];
  right: string[];
  jump: string[];
  /** Whether this player reads from HTML mobile touch controls */
  useMobileControls: boolean;
}

/** Preset input schemes */
export const INPUT_SCHEMES = {
  /** Single player mode - uses ALL keys + mobile controls */
  SINGLE: {
    left: ['LEFT', 'A'],
    right: ['RIGHT', 'D'],
    jump: ['UP', 'W', 'SPACE'],
    useMobileControls: true,
  } as InputScheme,

  /** Multiplayer: Player 1 (WASD + Space + mobile) */
  PLAYER1: {
    left: ['A'],
    right: ['D'],
    jump: ['W', 'SPACE'],
    useMobileControls: true,
  } as InputScheme,

  /** Multiplayer: Player 2 (Arrow keys, no mobile) */
  PLAYER2: {
    left: ['LEFT'],
    right: ['RIGHT'],
    jump: ['UP'],
    useMobileControls: false,
  } as InputScheme,
};

/** Global mobile input state set by HTML touch controls */
interface MobileInput { left: boolean; right: boolean; jump: boolean }
declare global {
  interface Window { __mobileInput?: MobileInput; }
}

/** Reads input state from a configured scheme */
export class InputManager {
  private keys: Map<string, Phaser.Input.Keyboard.Key> = new Map();
  private scheme: InputScheme;

  constructor(scene: Phaser.Scene, scheme: InputScheme = INPUT_SCHEMES.SINGLE) {
    this.scheme = scheme;

    if (scene.input.keyboard) {
      // Register all unique keys from the scheme
      const allKeys = new Set([
        ...scheme.left,
        ...scheme.right,
        ...scheme.jump,
      ]);

      allKeys.forEach(keyName => {
        const key = scene.input.keyboard!.addKey(keyName);
        this.keys.set(keyName, key);
      });
    }
  }

  /** Whether any "left" key is pressed (keyboard or mobile) */
  get isLeft(): boolean {
    const keyDown = this.scheme.left.some(k => this.keys.get(k)?.isDown);
    const mobileDown = this.scheme.useMobileControls && window.__mobileInput?.left;
    return keyDown || !!mobileDown;
  }

  /** Whether any "right" key is pressed (keyboard or mobile) */
  get isRight(): boolean {
    const keyDown = this.scheme.right.some(k => this.keys.get(k)?.isDown);
    const mobileDown = this.scheme.useMobileControls && window.__mobileInput?.right;
    return keyDown || !!mobileDown;
  }

  /** Whether any "jump" key is pressed (keyboard or mobile) */
  get isJump(): boolean {
    const keyDown = this.scheme.jump.some(k => this.keys.get(k)?.isDown);
    const mobileDown = this.scheme.useMobileControls && window.__mobileInput?.jump;
    return keyDown || !!mobileDown;
  }

  /** Get the current input scheme (useful for UI hints) */
  getScheme(): InputScheme {
    return this.scheme;
  }

  /** Change the input scheme at runtime (e.g., switching to multiplayer) */
  setScheme(scene: Phaser.Scene, scheme: InputScheme): void {
    this.scheme = scheme;

    // Register any new keys
    if (scene.input.keyboard) {
      const allKeys = new Set([
        ...scheme.left,
        ...scheme.right,
        ...scheme.jump,
      ]);

      allKeys.forEach(keyName => {
        if (!this.keys.has(keyName)) {
          const key = scene.input.keyboard!.addKey(keyName);
          this.keys.set(keyName, key);
        }
      });
    }
  }
}
