import Phaser from 'phaser';
import { SCENES } from '../utils/constants';
import { gameConfig } from '../config/game.config';
import { AssetGenerator } from '../systems/AssetGenerator';
import { audioManager } from '../systems/AudioManager';

export class BootScene extends Phaser.Scene {
  constructor() {
    super({ key: SCENES.BOOT });
  }

  create(): void {
    const { width, height } = gameConfig;
    const cx = width / 2;
    const cy = height / 2;

    // Background gradient
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a0a2e, 0x1a0a2e, 0x2d1b69, 0x2d1b69);
    bg.fillRect(0, 0, width, height);

    // Title text
    const title = this.add.text(cx, cy - 60, 'Love Quest', {
      fontFamily: gameConfig.ui.fontFamily,
      fontSize: '20px',
      color: '#ff6b9d',
    }).setOrigin(0.5);

    // Loading bar background
    const barBg = this.add.graphics();
    barBg.fillStyle(0x2d1b69);
    barBg.fillRoundedRect(cx - 80, cy, 160, 16, 4);

    // Loading bar fill
    const barFill = this.add.graphics();

    // Loading text
    const loadText = this.add.text(cx, cy + 30, 'Loading...', {
      fontFamily: gameConfig.ui.fontFamily,
      fontSize: '8px',
      color: '#c44dff',
    }).setOrigin(0.5);

    // Generate all assets
    const generator = new AssetGenerator(this);
    generator.generateAll();

    // Create spritesheet frames from generated textures
    this.createAnimationFrames();

    // Animate loading bar
    let progress = 0;
    const loadTimer = this.time.addEvent({
      delay: 30,
      repeat: 20,
      callback: () => {
        progress += 1 / 20;
        barFill.clear();
        barFill.fillStyle(0xff6b9d);
        barFill.fillRoundedRect(cx - 78, cy + 2, 156 * Math.min(progress, 1), 12, 3);

        if (progress >= 1) {
          loadText.setText('Ready!');
          this.time.delayedCall(400, () => {
            this.cameras.main.fadeOut(500, 26, 10, 46);
            this.cameras.main.once('camerafadeoutcomplete', () => {
              this.scene.start(SCENES.MENU);
            });
          });
        }
      },
    });

    // Initialize audio on first user interaction
    this.input.once('pointerdown', () => {
      audioManager.init();
      audioManager.resume();
    });

    // Floating hearts animation during loading
    this.time.addEvent({
      delay: 200,
      repeat: 10,
      callback: () => {
        const heart = this.add.text(
          Phaser.Math.Between(50, width - 50),
          height + 10,
          '♥',
          { fontSize: '16px', color: '#ff4081' }
        ).setOrigin(0.5).setAlpha(0.6);

        this.tweens.add({
          targets: heart,
          y: -20,
          alpha: 0,
          duration: 2000,
          ease: 'Sine.easeIn',
          onComplete: () => heart.destroy(),
        });
      },
    });
  }

  private createAnimationFrames(): void {
    // Player spritesheet frames
    const playerTex = this.textures.get('player');
    if (playerTex) {
      const frameWidth = 32;
      const frameHeight = 32;
      for (let i = 0; i < 4; i++) {
        playerTex.add(i, 0, i * frameWidth, 0, frameWidth, frameHeight);
      }
    }

    // Heart frames
    const heartTex = this.textures.get('heart');
    if (heartTex) {
      heartTex.add(0, 0, 0, 0, 16, 16);
      heartTex.add(1, 0, 16, 0, 16, 16);
    }

    // Gold heart frames
    const goldTex = this.textures.get('heart-gold');
    if (goldTex) {
      goldTex.add(0, 0, 0, 0, 24, 24);
      goldTex.add(1, 0, 24, 0, 24, 24);
    }

    // Enemy frames
    const enemyTex = this.textures.get('enemy');
    if (enemyTex) {
      enemyTex.add(0, 0, 0, 0, 20, 20);
      enemyTex.add(1, 0, 20, 0, 20, 20);
    }

    // Confetti frames (6 colors)
    const confettiTex = this.textures.get('particle-confetti');
    if (confettiTex) {
      for (let i = 0; i < 6; i++) {
        confettiTex.add(i, 0, i * 6, 0, 4, 6);
      }
    }
  }
}
