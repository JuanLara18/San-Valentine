import Phaser from 'phaser';
import { gameConfig } from '../config/game.config';

/**
 * Generates all pixel art assets programmatically.
 * No external image files needed - everything is drawn via Phaser's Graphics API.
 */
export class AssetGenerator {
  private scene: Phaser.Scene;

  constructor(scene: Phaser.Scene) {
    this.scene = scene;
  }

  generateAll(): void {
    this.generatePlayer();
    this.generateHeart();
    this.generateGoldHeart();
    this.generateEnemy();
    this.generatePlatform();
    this.generateSmallPlatform();
    this.generateMovingPlatform();
    this.generateCloud();
    this.generateStar();
    this.generateParticleHeart();
    this.generateParticleStar();
    this.generateParticleConfetti();
    this.generateEnvelope();
    this.generateButton();
    this.generateArrowButtons();
    this.generateJumpButton();
    this.generateGoalFlag();
  }

  /** Cupid character spritesheet - 4 frames: idle, run1, run2, jump */
  private generatePlayer(): void {
    const size = 32;
    const frames = 4;
    const g = this.scene.make.graphics({ x: 0, y: 0 });

    for (let f = 0; f < frames; f++) {
      const ox = f * size;

      // --- Halo (golden glow above head) ---
      g.fillStyle(0xffd700, 0.5);
      g.fillRect(ox + 12, 1, 8, 1);
      g.fillStyle(0xffd700, 0.8);
      g.fillRect(ox + 13, 0, 6, 1);
      g.fillRect(ox + 11, 1, 2, 1);
      g.fillRect(ox + 19, 1, 2, 1);

      // --- Head (rounder, skin tone) ---
      g.fillStyle(0xffe0bd); // skin
      g.fillRect(ox + 11, 3, 10, 10);
      g.fillRect(ox + 12, 2, 8, 1); // top of head
      g.fillRect(ox + 10, 5, 1, 6); // left cheek
      g.fillRect(ox + 21, 5, 1, 6); // right cheek

      // --- Hair (little curly tuft) ---
      g.fillStyle(0xf4a460); // golden-brown
      g.fillRect(ox + 12, 2, 8, 2);
      g.fillRect(ox + 11, 3, 2, 2);
      g.fillRect(ox + 19, 3, 2, 2);
      g.fillRect(ox + 13, 1, 3, 1); // tuft

      // --- Face ---
      // Eyes (expressive, dark with white highlight)
      g.fillStyle(0x1a0a2e);
      g.fillRect(ox + 13, 6, 2, 3);
      g.fillRect(ox + 18, 6, 2, 3);
      g.fillStyle(0xffffff);
      g.fillRect(ox + 13, 6, 1, 1); // eye highlight
      g.fillRect(ox + 18, 6, 1, 1);

      // Blush (pink cheeks)
      g.fillStyle(0xff9999, 0.6);
      g.fillRect(ox + 11, 8, 2, 2);
      g.fillRect(ox + 19, 8, 2, 2);

      // Smile
      g.fillStyle(0xff6b9d);
      g.fillRect(ox + 14, 10, 4, 1);
      g.fillStyle(0xff4081);
      g.fillRect(ox + 15, 11, 2, 1); // lower lip

      // --- Body (white toga/tunic) ---
      g.fillStyle(0xffffff);
      g.fillRect(ox + 11, 13, 10, 9);
      g.fillRect(ox + 10, 14, 12, 7);
      // Toga folds/shadow
      g.fillStyle(0xe8e0f0);
      g.fillRect(ox + 12, 15, 1, 6);
      g.fillRect(ox + 18, 16, 1, 5);
      // Pink sash/belt
      g.fillStyle(0xff6b9d);
      g.fillRect(ox + 11, 17, 10, 1);

      // --- Wings (detailed, multi-layer) ---
      if (f === 0 || f === 2) {
        // Wings up position
        g.fillStyle(0xffffff, 0.95);
        g.fillRect(ox + 4, 7, 7, 5);
        g.fillRect(ox + 21, 7, 7, 5);
        g.fillStyle(0xffffff, 0.7);
        g.fillRect(ox + 5, 5, 5, 3);
        g.fillRect(ox + 22, 5, 5, 3);
        g.fillRect(ox + 6, 3, 3, 3);
        g.fillRect(ox + 23, 3, 3, 3);
        // Wing detail/feather lines
        g.fillStyle(0xe0d4f5, 0.6);
        g.fillRect(ox + 5, 9, 5, 1);
        g.fillRect(ox + 22, 9, 5, 1);
      } else {
        // Wings down/mid position
        g.fillStyle(0xffffff, 0.95);
        g.fillRect(ox + 4, 11, 7, 5);
        g.fillRect(ox + 21, 11, 7, 5);
        g.fillStyle(0xffffff, 0.7);
        g.fillRect(ox + 5, 14, 5, 3);
        g.fillRect(ox + 22, 14, 5, 3);
        // Wing detail
        g.fillStyle(0xe0d4f5, 0.6);
        g.fillRect(ox + 5, 13, 5, 1);
        g.fillRect(ox + 22, 13, 5, 1);
      }

      // --- Bow (on back, small pixel bow) ---
      g.fillStyle(0xc44dff, 0.7);
      g.fillRect(ox + 9, 14, 1, 6); // bow staff
      g.fillStyle(0xff9800, 0.6);
      g.fillRect(ox + 8, 14, 1, 1); // bow curve top
      g.fillRect(ox + 8, 19, 1, 1); // bow curve bottom

      // --- Legs ---
      g.fillStyle(0xffe0bd); // skin color legs
      if (f === 3) {
        // Jump pose - legs tucked
        g.fillRect(ox + 12, 22, 3, 4);
        g.fillRect(ox + 17, 22, 3, 4);
      } else if (f === 1) {
        // Run frame 1
        g.fillRect(ox + 11, 22, 3, 5);
        g.fillRect(ox + 18, 22, 3, 3);
      } else if (f === 2) {
        // Run frame 2
        g.fillRect(ox + 11, 22, 3, 3);
        g.fillRect(ox + 18, 22, 3, 5);
      } else {
        // Idle standing
        g.fillRect(ox + 12, 22, 3, 5);
        g.fillRect(ox + 17, 22, 3, 5);
      }

      // --- Sandals ---
      g.fillStyle(0xc2935b);
      if (f === 3) {
        g.fillRect(ox + 11, 25, 5, 2);
        g.fillRect(ox + 16, 25, 5, 2);
      } else if (f === 1) {
        g.fillRect(ox + 10, 26, 5, 2);
        g.fillRect(ox + 17, 24, 5, 2);
      } else if (f === 2) {
        g.fillRect(ox + 10, 24, 5, 2);
        g.fillRect(ox + 17, 26, 5, 2);
      } else {
        g.fillRect(ox + 11, 26, 5, 2);
        g.fillRect(ox + 16, 26, 5, 2);
      }
    }

    g.generateTexture('player', size * frames, size);
    g.destroy();
  }

  /** Red pulsing heart - 2 frames */
  private generateHeart(): void {
    const size = 16;
    const g = this.scene.make.graphics({ x: 0, y: 0 });

    // Frame 1 - normal
    this.drawHeart(g, 2, 2, 12, 0xff1744);
    // Frame 2 - slightly bigger
    this.drawHeart(g, size + 1, 1, 14, 0xff4081);

    g.generateTexture('heart', size * 2, size);
    g.destroy();
  }

  /** Gold heart for final level */
  private generateGoldHeart(): void {
    const size = 24;
    const g = this.scene.make.graphics({ x: 0, y: 0 });

    // Frame 1
    this.drawHeart(g, 2, 2, 20, 0xffd700);
    // Frame 2
    this.drawHeart(g, size + 1, 1, 22, 0xffeb3b);

    g.generateTexture('heart-gold', size * 2, size);
    g.destroy();
  }

  /** Draw a pixel heart shape */
  private drawHeart(g: Phaser.GameObjects.Graphics, x: number, y: number, s: number, color: number): void {
    g.fillStyle(color);
    const u = Math.floor(s / 6);
    // Top bumps
    g.fillRect(x + u, y, u * 2, u);
    g.fillRect(x + u * 3, y, u * 2, u);
    // Second row
    g.fillRect(x, y + u, u * 6, u);
    // Third row
    g.fillRect(x, y + u * 2, u * 6, u);
    // Fourth row
    g.fillRect(x + u, y + u * 3, u * 4, u);
    // Fifth row
    g.fillRect(x + u * 2, y + u * 4, u * 2, u);
    // Shine
    g.fillStyle(0xffffff, 0.4);
    g.fillRect(x + u, y + u, u, u);
  }

  /** Broken heart enemy - 2 frames */
  private generateEnemy(): void {
    const size = 20;
    const g = this.scene.make.graphics({ x: 0, y: 0 });

    for (let f = 0; f < 2; f++) {
      const ox = f * size;
      // Draw a broken heart (two halves with a gap)
      g.fillStyle(0x8b0000);
      const u = 3;
      // Left half
      g.fillRect(ox + u, 2, u * 2, u);
      g.fillRect(ox, 2 + u, u * 3, u);
      g.fillRect(ox, 2 + u * 2, u * 3, u);
      g.fillRect(ox + u, 2 + u * 3, u * 2, u);
      // Right half (offset for broken effect)
      const shift = f === 0 ? 0 : 1;
      g.fillRect(ox + u * 3 + 2, 2 + shift, u * 2, u);
      g.fillRect(ox + u * 3 + 2, 2 + u + shift, u * 3, u);
      g.fillRect(ox + u * 3 + 2, 2 + u * 2 + shift, u * 3, u);
      g.fillRect(ox + u * 3 + 2, 2 + u * 3 + shift, u * 2, u);
      g.fillRect(ox + u * 4 + 2, 2 + u * 4 + shift, u, u);
      // Angry eyes
      g.fillStyle(0xffff00);
      g.fillRect(ox + 4, 7, 2, 2);
      g.fillRect(ox + 13, 7 + shift, 2, 2);
    }

    g.generateTexture('enemy', size * 2, size);
    g.destroy();
  }

  /** Platform tile */
  private generatePlatform(): void {
    const g = this.scene.make.graphics({ x: 0, y: 0 });
    // Cloud-like platform
    g.fillStyle(0xfce4ec);
    g.fillRoundedRect(0, 4, 64, 20, 6);
    g.fillStyle(0xf8bbd0);
    g.fillRoundedRect(2, 8, 60, 14, 4);
    // Highlights
    g.fillStyle(0xffffff, 0.5);
    g.fillRoundedRect(4, 6, 20, 4, 2);

    g.generateTexture('platform', 64, 24);
    g.destroy();
  }

  /** Small platform */
  private generateSmallPlatform(): void {
    const g = this.scene.make.graphics({ x: 0, y: 0 });
    g.fillStyle(0xfce4ec);
    g.fillRoundedRect(0, 4, 40, 16, 5);
    g.fillStyle(0xf8bbd0);
    g.fillRoundedRect(2, 7, 36, 11, 3);
    g.fillStyle(0xffffff, 0.5);
    g.fillRoundedRect(4, 6, 12, 3, 2);

    g.generateTexture('platform-small', 40, 20);
    g.destroy();
  }

  /** Moving platform (purple tint) */
  private generateMovingPlatform(): void {
    const g = this.scene.make.graphics({ x: 0, y: 0 });
    g.fillStyle(0xce93d8);
    g.fillRoundedRect(0, 4, 56, 18, 5);
    g.fillStyle(0xba68c8);
    g.fillRoundedRect(2, 7, 52, 13, 3);
    g.fillStyle(0xffffff, 0.3);
    g.fillRoundedRect(4, 6, 16, 3, 2);
    // Glow dots
    g.fillStyle(0xe1bee7);
    g.fillRect(8, 12, 2, 2);
    g.fillRect(24, 12, 2, 2);
    g.fillRect(40, 12, 2, 2);

    g.generateTexture('platform-moving', 56, 22);
    g.destroy();
  }

  /** Cloud for background */
  private generateCloud(): void {
    const g = this.scene.make.graphics({ x: 0, y: 0 });
    g.fillStyle(0xffffff, 0.3);
    g.fillRoundedRect(10, 10, 40, 16, 8);
    g.fillRoundedRect(0, 14, 60, 12, 6);
    g.fillRoundedRect(20, 6, 20, 10, 6);

    g.generateTexture('cloud', 60, 30);
    g.destroy();
  }

  /** Star for backgrounds */
  private generateStar(): void {
    const g = this.scene.make.graphics({ x: 0, y: 0 });
    g.fillStyle(0xffffff);
    g.fillRect(1, 0, 2, 4);
    g.fillRect(0, 1, 4, 2);

    g.generateTexture('star', 4, 4);
    g.destroy();
  }

  /** Tiny heart for particles */
  private generateParticleHeart(): void {
    const g = this.scene.make.graphics({ x: 0, y: 0 });
    g.fillStyle(0xff1744);
    g.fillRect(1, 0, 2, 1);
    g.fillRect(5, 0, 2, 1);
    g.fillRect(0, 1, 8, 1);
    g.fillRect(0, 2, 8, 1);
    g.fillRect(1, 3, 6, 1);
    g.fillRect(2, 4, 4, 1);
    g.fillRect(3, 5, 2, 1);

    g.generateTexture('particle-heart', 8, 6);
    g.destroy();
  }

  /** Star particle */
  private generateParticleStar(): void {
    const g = this.scene.make.graphics({ x: 0, y: 0 });
    g.fillStyle(0xffd700);
    g.fillRect(2, 0, 2, 6);
    g.fillRect(0, 2, 6, 2);
    g.fillRect(1, 1, 1, 1);
    g.fillRect(4, 1, 1, 1);
    g.fillRect(1, 4, 1, 1);
    g.fillRect(4, 4, 1, 1);

    g.generateTexture('particle-star', 6, 6);
    g.destroy();
  }

  /** Confetti particle */
  private generateParticleConfetti(): void {
    const g = this.scene.make.graphics({ x: 0, y: 0 });
    const colors = [0xff1744, 0xff4081, 0xffd700, 0xc44dff, 0x00e5ff, 0x76ff03];
    colors.forEach((color, i) => {
      g.fillStyle(color);
      g.fillRect(i * 6, 0, 4, 6);
    });

    g.generateTexture('particle-confetti', colors.length * 6, 6);
    g.destroy();
  }

  /** Envelope for victory scene */
  private generateEnvelope(): void {
    const g = this.scene.make.graphics({ x: 0, y: 0 });
    const w = 180, h = 120;
    // Envelope body
    g.fillStyle(0xfce4ec);
    g.fillRoundedRect(0, 0, w, h, 4);
    // Flap (triangle)
    g.fillStyle(0xf8bbd0);
    g.fillTriangle(0, 0, w / 2, h * 0.45, w, 0);
    // Border
    g.lineStyle(2, 0xff6b9d);
    g.strokeRoundedRect(0, 0, w, h, 4);
    // Heart seal
    g.fillStyle(0xff1744);
    const cx = w / 2, cy = h * 0.35;
    g.fillRect(cx - 6, cy, 4, 3);
    g.fillRect(cx + 2, cy, 4, 3);
    g.fillRect(cx - 7, cy + 3, 14, 3);
    g.fillRect(cx - 5, cy + 6, 10, 3);
    g.fillRect(cx - 3, cy + 9, 6, 2);
    g.fillRect(cx - 1, cy + 11, 2, 2);

    g.generateTexture('envelope', w, h);
    g.destroy();
  }

  /** Reusable button texture */
  private generateButton(): void {
    const g = this.scene.make.graphics({ x: 0, y: 0 });
    const w = 160, h = 40;
    // Shadow
    g.fillStyle(0x4a0028);
    g.fillRoundedRect(2, 4, w, h, 6);
    // Body
    g.fillStyle(0xff4081);
    g.fillRoundedRect(0, 0, w, h, 6);
    // Highlight
    g.fillStyle(0xff6b9d, 0.5);
    g.fillRoundedRect(4, 2, w - 8, h / 3, 3);

    g.generateTexture('button', w + 2, h + 4);
    g.destroy();
  }

  /** Arrow buttons for mobile controls */
  private generateArrowButtons(): void {
    const size = 48;
    const g = this.scene.make.graphics({ x: 0, y: 0 });

    // Left arrow
    g.fillStyle(0xffffff, 0.2);
    g.fillCircle(size / 2, size / 2, size / 2 - 2);
    g.fillStyle(0xffffff, 0.7);
    g.fillTriangle(size * 0.3, size / 2, size * 0.65, size * 0.3, size * 0.65, size * 0.7);
    g.generateTexture('arrow-left', size, size);

    g.clear();

    // Right arrow
    g.fillStyle(0xffffff, 0.2);
    g.fillCircle(size / 2, size / 2, size / 2 - 2);
    g.fillStyle(0xffffff, 0.7);
    g.fillTriangle(size * 0.7, size / 2, size * 0.35, size * 0.3, size * 0.35, size * 0.7);
    g.generateTexture('arrow-right', size, size);

    g.destroy();
  }

  /** Jump button for mobile */
  private generateJumpButton(): void {
    const size = 56;
    const g = this.scene.make.graphics({ x: 0, y: 0 });

    g.fillStyle(0xff4081, 0.3);
    g.fillCircle(size / 2, size / 2, size / 2 - 2);
    g.fillStyle(0xffffff, 0.7);
    g.fillTriangle(size / 2, size * 0.25, size * 0.3, size * 0.65, size * 0.7, size * 0.65);

    g.generateTexture('jump-button', size, size);
    g.destroy();
  }

  /** Goal flag for level completion */
  private generateGoalFlag(): void {
    const g = this.scene.make.graphics({ x: 0, y: 0 });
    const w = 24;
    const h = 32;

    // Pole
    g.fillStyle(0xffffff);
    g.fillRect(3, 0, 2, h);

    // Flag (pink triangle/rectangle)
    g.fillStyle(0xff4081);
    g.fillRect(5, 2, 14, 10);

    // Heart on flag
    g.fillStyle(0xffffff);
    g.fillRect(9, 4, 2, 2);
    g.fillRect(13, 4, 2, 2);
    g.fillRect(8, 6, 8, 2);
    g.fillRect(9, 8, 6, 2);
    g.fillRect(10, 10, 4, 1);

    // Base
    g.fillStyle(0xffd700);
    g.fillRect(1, h - 4, 6, 4);

    g.generateTexture('goal-flag', w, h);
    g.destroy();
  }
}
