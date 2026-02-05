import Phaser from 'phaser';
import { SCENES, REGISTRY } from '../utils/constants';
import { gameConfig } from '../config/game.config';
import { valentineConfig } from '../config/valentine.config';
import { t } from '../i18n';

export class NameScene extends Phaser.Scene {
  private inputElement: HTMLInputElement | null = null;

  constructor() {
    super({ key: SCENES.NAME });
  }

  create(): void {
    const { width, height } = gameConfig;
    const cx = width / 2;

    this.cameras.main.fadeIn(500);

    // Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a0a2e, 0x2d1b69, 0x1a0a2e, 0x2d1b69);
    bg.fillRect(0, 0, width, height);

    // Stars
    for (let i = 0; i < 20; i++) {
      const star = this.add.image(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        'star'
      ).setAlpha(Phaser.Math.FloatBetween(0.2, 0.6));

      this.tweens.add({
        targets: star,
        alpha: { from: star.alpha, to: 0.1 },
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1,
      });
    }

    // Cupid asking
    const cupid = this.add.image(cx, 150, 'player', 0).setScale(3);
    this.tweens.add({
      targets: cupid,
      y: 140,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Question text
    const questionText = this.add.text(cx, 220, t('name.askName'), {
      fontFamily: gameConfig.ui.fontFamily,
      fontSize: '12px',
      color: '#ff6b9d',
      wordWrap: { width: width - 60 },
      align: 'center',
    }).setOrigin(0.5);

    // Create HTML input for name entry
    this.createNameInput(cx, 280);

    // Confirm button
    const confirmBtn = this.add.image(cx, 350, 'button').setInteractive({ useHandCursor: true }).setScale(0.8);
    const confirmText = this.add.text(cx, 348, t('name.confirm'), {
      fontFamily: gameConfig.ui.fontFamily,
      fontSize: '12px',
      color: '#ffffff',
    }).setOrigin(0.5);

    confirmBtn.on('pointerover', () => { confirmBtn.setScale(0.85); confirmText.setScale(1.05); });
    confirmBtn.on('pointerout', () => { confirmBtn.setScale(0.8); confirmText.setScale(1); });
    confirmBtn.on('pointerdown', () => { confirmBtn.setScale(0.75); confirmText.setScale(0.95); });
    confirmBtn.on('pointerup', () => {
      const name = this.inputElement?.value?.trim() || 'Player';
      this.registry.set(REGISTRY.PLAYER_NAME, name);
      this.removeInput();
      this.showNicknameQuestion(name);
    });
  }

  private createNameInput(x: number, y: number): void {
    const canvas = this.game.canvas;
    const canvasRect = canvas.getBoundingClientRect();
    const scaleX = canvasRect.width / gameConfig.width;
    const scaleY = canvasRect.height / gameConfig.height;

    this.inputElement = document.createElement('input');
    this.inputElement.type = 'text';
    this.inputElement.placeholder = t('name.placeholder');
    this.inputElement.maxLength = 20;
    this.inputElement.style.cssText = `
      position: absolute;
      left: ${canvasRect.left + (x - 90) * scaleX}px;
      top: ${canvasRect.top + (y - 14) * scaleY}px;
      width: ${180 * scaleX}px;
      height: ${28 * scaleY}px;
      font-family: 'Press Start 2P', monospace;
      font-size: ${10 * Math.min(scaleX, scaleY)}px;
      text-align: center;
      color: #ff6b9d;
      background: rgba(45, 27, 105, 0.8);
      border: 2px solid #ff6b9d;
      border-radius: 4px;
      outline: none;
      padding: 4px;
      z-index: 1000;
    `;
    document.body.appendChild(this.inputElement);

    // Auto-focus
    this.time.delayedCall(300, () => this.inputElement?.focus());

    // Handle enter key
    this.inputElement.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        const name = this.inputElement?.value?.trim() || 'Player';
        this.registry.set(REGISTRY.PLAYER_NAME, name);
        this.removeInput();
        this.showNicknameQuestion(name);
      }
    });
  }

  private removeInput(): void {
    if (this.inputElement && this.inputElement.parentNode) {
      this.inputElement.parentNode.removeChild(this.inputElement);
      this.inputElement = null;
    }
  }

  private showNicknameQuestion(name: string): void {
    const { width, height } = gameConfig;
    const cx = width / 2;

    // Clear previous elements with fade
    this.tweens.add({
      targets: this.children.list.filter(c => c.type === 'Text' || c.type === 'Image'),
      alpha: 0,
      duration: 400,
      onComplete: () => {
        this.children.removeAll(true);
        this.buildNicknameScreen(name);
      },
    });
  }

  private buildNicknameScreen(name: string): void {
    const { width, height } = gameConfig;
    const cx = width / 2;

    // Background
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a0a2e, 0x2d1b69, 0x1a0a2e, 0x2d1b69);
    bg.fillRect(0, 0, width, height);

    // Stars
    for (let i = 0; i < 15; i++) {
      const star = this.add.image(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        'star'
      ).setAlpha(Phaser.Math.FloatBetween(0.2, 0.6));
      this.tweens.add({
        targets: star,
        alpha: 0.1,
        duration: Phaser.Math.Between(1000, 2500),
        yoyo: true,
        repeat: -1,
      });
    }

    // Greeting
    const greeting = this.add.text(cx, 100, `¡Hola, ${name}!`, {
      fontFamily: gameConfig.ui.fontFamily,
      fontSize: '14px',
      color: '#ffffff',
    }).setOrigin(0.5).setAlpha(0);

    // Cupid
    const cupid = this.add.image(cx, 200, 'player', 0).setScale(3).setAlpha(0);
    this.tweens.add({
      targets: cupid,
      y: 190,
      duration: 1200,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Nickname question
    const nickQ = t('name.nicknameAsk').replace('{nickname}', valentineConfig.nickname);
    const question = this.add.text(cx, 280, nickQ, {
      fontFamily: gameConfig.ui.fontFamily,
      fontSize: '11px',
      color: '#ff6b9d',
      wordWrap: { width: width - 40 },
      align: 'center',
    }).setOrigin(0.5).setAlpha(0);

    // Yes button
    const yesBtn = this.add.image(cx - 60, 370, 'button').setScale(0.6).setInteractive({ useHandCursor: true }).setAlpha(0);
    const yesText = this.add.text(cx - 60, 368, t('name.yes'), {
      fontFamily: gameConfig.ui.fontFamily,
      fontSize: '10px',
      color: '#ffffff',
    }).setOrigin(0.5).setAlpha(0);

    // No button
    const noBtn = this.add.image(cx + 60, 370, 'button').setScale(0.6).setInteractive({ useHandCursor: true }).setAlpha(0);
    const noText = this.add.text(cx + 60, 368, t('name.no'), {
      fontFamily: gameConfig.ui.fontFamily,
      fontSize: '10px',
      color: '#ffffff',
    }).setOrigin(0.5).setAlpha(0);

    // Animate entrance
    this.tweens.add({ targets: greeting, alpha: 1, duration: 600, delay: 200 });
    this.tweens.add({ targets: cupid, alpha: 1, duration: 600, delay: 500 });
    this.tweens.add({ targets: question, alpha: 1, duration: 600, delay: 900 });
    this.tweens.add({ targets: [yesBtn, yesText, noBtn, noText], alpha: 1, duration: 600, delay: 1300 });

    // Button handlers
    yesBtn.on('pointerup', () => {
      this.registry.set(REGISTRY.NICKNAME, valentineConfig.nickname);
      this.proceedToStory();
    });

    noBtn.on('pointerup', () => {
      // Fun: "No" doesn't really work - show funny message then proceed
      this.registry.set(REGISTRY.NICKNAME, valentineConfig.nickname);
      const anyway = this.add.text(cx, 430, t('name.nicknameAnyway'), {
        fontFamily: gameConfig.ui.fontFamily,
        fontSize: '8px',
        color: '#c44dff',
        wordWrap: { width: width - 40 },
        align: 'center',
      }).setOrigin(0.5).setAlpha(0);

      this.tweens.add({
        targets: anyway,
        alpha: 1,
        duration: 500,
      });

      // Proceed after showing the message
      this.time.delayedCall(2000, () => this.proceedToStory());
    });

    // Hover effects
    [yesBtn, noBtn].forEach(btn => {
      btn.on('pointerover', () => btn.setScale(0.65));
      btn.on('pointerout', () => btn.setScale(0.6));
      btn.on('pointerdown', () => btn.setScale(0.55));
    });
  }

  private proceedToStory(): void {
    this.removeInput();
    this.cameras.main.fadeOut(600, 26, 10, 46);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start(SCENES.STORY, { storyKey: 'intro', nextScene: SCENES.GAME, level: 1 });
    });
  }

  shutdown(): void {
    this.removeInput();
  }
}
