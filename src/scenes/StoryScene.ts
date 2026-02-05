import Phaser from 'phaser';
import { SCENES } from '../utils/constants';
import { gameConfig } from '../config/game.config';
import { tArray, t } from '../i18n';

interface StoryData {
  storyKey: string;
  nextScene: string;
  level?: number;
}

export class StoryScene extends Phaser.Scene {
  private lines: string[] = [];
  private currentLine = 0;
  private storyData!: StoryData;
  private isAnimating = false;
  private textObjects: Phaser.GameObjects.Text[] = [];

  constructor() {
    super({ key: SCENES.STORY });
  }

  init(data: StoryData): void {
    this.storyData = data;
    this.currentLine = 0;
    this.textObjects = [];
    this.isAnimating = false;
  }

  create(): void {
    const { width, height } = gameConfig;
    const cx = width / 2;

    this.cameras.main.fadeIn(500);

    // Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a0a2e, 0x1a0a2e, 0x2d1b69, 0x2d1b69);
    bg.fillRect(0, 0, width, height);

    // Stars
    for (let i = 0; i < 25; i++) {
      const star = this.add.image(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height * 0.6),
        'star'
      ).setAlpha(Phaser.Math.FloatBetween(0.2, 0.7));

      this.tweens.add({
        targets: star,
        alpha: Phaser.Math.FloatBetween(0.1, 0.3),
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1,
      });
    }

    // Show level name if applicable
    if (this.storyData.level) {
      const levelNameKey = `game.level${this.storyData.level}Name`;
      const levelName = t(levelNameKey);
      const levelLabel = this.add.text(cx, 60, `${t('game.level')} ${this.storyData.level}`, {
        fontFamily: gameConfig.ui.fontFamily,
        fontSize: '10px',
        color: '#c44dff',
      }).setOrigin(0.5);

      const levelTitle = this.add.text(cx, 85, levelName, {
        fontFamily: gameConfig.ui.fontFamily,
        fontSize: '13px',
        color: '#ff6b9d',
        wordWrap: { width: width - 40 },
        align: 'center',
      }).setOrigin(0.5);
    }

    // Get story lines
    this.lines = tArray(`story.${this.storyData.storyKey}`);

    // Cupid in the center
    const cupid = this.add.image(cx, 180, 'player', 0).setScale(2.5);
    this.tweens.add({
      targets: cupid,
      y: 172,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Dialog box area
    const dialogBg = this.add.graphics();
    dialogBg.fillStyle(0x2d1b69, 0.7);
    dialogBg.fillRoundedRect(20, 260, width - 40, 200, 8);
    dialogBg.lineStyle(2, 0xff6b9d, 0.8);
    dialogBg.strokeRoundedRect(20, 260, width - 40, 200, 8);

    // Start showing lines
    this.showNextLine();

    // Tap anywhere to advance
    this.input.on('pointerup', () => {
      if (this.isAnimating) return;
      this.showNextLine();
    });

    // Also keyboard
    this.input.keyboard?.on('keydown-SPACE', () => {
      if (this.isAnimating) return;
      this.showNextLine();
    });

    // "Tap to continue" hint
    const hint = this.add.text(cx, 500, '▼ Tap to continue ▼', {
      fontFamily: gameConfig.ui.fontFamily,
      fontSize: '7px',
      color: '#9c27b0',
    }).setOrigin(0.5);

    this.tweens.add({
      targets: hint,
      alpha: 0.3,
      duration: 800,
      yoyo: true,
      repeat: -1,
    });
  }

  private showNextLine(): void {
    if (this.currentLine >= this.lines.length) {
      this.proceed();
      return;
    }

    const { width } = gameConfig;
    const cx = width / 2;
    const line = this.lines[this.currentLine];
    const yPos = 285 + this.currentLine * 30;

    this.isAnimating = true;

    const text = this.add.text(cx, yPos, '', {
      fontFamily: gameConfig.ui.fontFamily,
      fontSize: '9px',
      color: '#ffffff',
      wordWrap: { width: width - 80 },
      align: 'center',
    }).setOrigin(0.5, 0);

    this.textObjects.push(text);

    // Typewriter effect
    let charIndex = 0;
    const typeTimer = this.time.addEvent({
      delay: 40,
      repeat: line.length - 1,
      callback: () => {
        charIndex++;
        text.setText(line.substring(0, charIndex));
        if (charIndex >= line.length) {
          this.isAnimating = false;
          this.currentLine++;
        }
      },
    });
  }

  private proceed(): void {
    this.cameras.main.fadeOut(600, 26, 10, 46);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      if (this.storyData.nextScene === SCENES.GAME && this.storyData.level) {
        this.scene.start(SCENES.GAME, { level: this.storyData.level });
      } else {
        this.scene.start(this.storyData.nextScene);
      }
    });
  }
}
