import Phaser from 'phaser';
import { SCENES, REGISTRY } from '../utils/constants';
import { gameConfig } from '../config/game.config';
import { t, changeLanguage, getCurrentLanguage } from '../i18n';

export class MenuScene extends Phaser.Scene {
  private stars: Phaser.GameObjects.Image[] = [];

  constructor() {
    super({ key: SCENES.MENU });
  }

  create(): void {
    const { width, height } = gameConfig;
    const cx = width / 2;

    this.cameras.main.fadeIn(500);

    // Background gradient
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x1a0a2e, 0x1a0a2e, 0x2d1b69, 0x4a148c);
    bg.fillRect(0, 0, width, height);

    // Animated stars
    for (let i = 0; i < 30; i++) {
      const star = this.add.image(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        'star'
      ).setAlpha(Phaser.Math.FloatBetween(0.2, 0.8))
       .setScale(Phaser.Math.FloatBetween(0.5, 1.5));
      this.stars.push(star);

      this.tweens.add({
        targets: star,
        alpha: { from: star.alpha, to: Phaser.Math.FloatBetween(0.1, 0.4) },
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1,
      });
    }

    // Floating clouds
    for (let i = 0; i < 4; i++) {
      const cloud = this.add.image(
        Phaser.Math.Between(-30, width + 30),
        Phaser.Math.Between(80, height - 150),
        'cloud'
      ).setAlpha(0.15).setScale(Phaser.Math.FloatBetween(0.8, 1.5));

      this.tweens.add({
        targets: cloud,
        x: cloud.x + Phaser.Math.Between(30, 80),
        duration: Phaser.Math.Between(4000, 8000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    // Title with glow effect
    const titleShadow = this.add.text(cx + 2, 122, t('menu.title'), {
      fontFamily: gameConfig.ui.fontFamily,
      fontSize: '28px',
      color: '#4a0028',
    }).setOrigin(0.5);

    const title = this.add.text(cx, 120, t('menu.title'), {
      fontFamily: gameConfig.ui.fontFamily,
      fontSize: '28px',
      color: '#ff6b9d',
    }).setOrigin(0.5);

    // Title pulse
    this.tweens.add({
      targets: [title, titleShadow],
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Subtitle
    this.add.text(cx, 165, t('menu.subtitle'), {
      fontFamily: gameConfig.ui.fontFamily,
      fontSize: '9px',
      color: '#c44dff',
    }).setOrigin(0.5);

    // Floating hearts around title
    const heartPositions = [
      { x: cx - 100, y: 100 }, { x: cx + 100, y: 100 },
      { x: cx - 80, y: 150 }, { x: cx + 80, y: 150 },
    ];
    heartPositions.forEach((pos, i) => {
      const heart = this.add.text(pos.x, pos.y, '♥', {
        fontSize: '14px',
        color: i % 2 === 0 ? '#ff4081' : '#ff1744',
      }).setOrigin(0.5);

      this.tweens.add({
        targets: heart,
        y: pos.y - 10,
        duration: 1200 + i * 300,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    });

    // Cupid character preview
    const cupid = this.add.image(cx, 260, 'player', 0).setScale(3);
    this.tweens.add({
      targets: cupid,
      y: 250,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Play button
    const playBtn = this.add.image(cx, 370, 'button').setInteractive({ useHandCursor: true });
    const playText = this.add.text(cx, 368, t('menu.play'), {
      fontFamily: gameConfig.ui.fontFamily,
      fontSize: '14px',
      color: '#ffffff',
    }).setOrigin(0.5);

    playBtn.on('pointerover', () => {
      playBtn.setScale(1.05);
      playText.setScale(1.05);
    });
    playBtn.on('pointerout', () => {
      playBtn.setScale(1);
      playText.setScale(1);
    });
    playBtn.on('pointerdown', () => {
      playBtn.setScale(0.95);
      playText.setScale(0.95);
    });
    playBtn.on('pointerup', () => {
      this.cameras.main.fadeOut(500, 26, 10, 46);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start(SCENES.NAME);
      });
    });

    // Language toggle
    const langY = 460;
    const currentLang = getCurrentLanguage();
    const langLabel = this.add.text(cx, langY, t('menu.language'), {
      fontFamily: gameConfig.ui.fontFamily,
      fontSize: '8px',
      color: '#9c27b0',
    }).setOrigin(0.5);

    const esBtn = this.add.text(cx - 30, langY + 25, 'ES', {
      fontFamily: gameConfig.ui.fontFamily,
      fontSize: '10px',
      color: currentLang === 'es' ? '#ff6b9d' : '#666666',
      backgroundColor: currentLang === 'es' ? '#2d1b69' : undefined,
      padding: { x: 6, y: 4 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    const enBtn = this.add.text(cx + 30, langY + 25, 'EN', {
      fontFamily: gameConfig.ui.fontFamily,
      fontSize: '10px',
      color: currentLang === 'en' ? '#ff6b9d' : '#666666',
      backgroundColor: currentLang === 'en' ? '#2d1b69' : undefined,
      padding: { x: 6, y: 4 },
    }).setOrigin(0.5).setInteractive({ useHandCursor: true });

    esBtn.on('pointerup', () => {
      changeLanguage('es');
      this.registry.set(REGISTRY.LANGUAGE, 'es');
      this.scene.restart();
    });

    enBtn.on('pointerup', () => {
      changeLanguage('en');
      this.registry.set(REGISTRY.LANGUAGE, 'en');
      this.scene.restart();
    });

    // Bottom floating hearts
    this.time.addEvent({
      delay: 1500,
      loop: true,
      callback: () => {
        const heart = this.add.text(
          Phaser.Math.Between(30, width - 30),
          height + 10,
          '♥',
          { fontSize: `${Phaser.Math.Between(8, 16)}px`, color: '#ff4081' }
        ).setOrigin(0.5).setAlpha(0.3);

        this.tweens.add({
          targets: heart,
          y: -20,
          alpha: 0,
          x: heart.x + Phaser.Math.Between(-30, 30),
          duration: Phaser.Math.Between(3000, 5000),
          ease: 'Sine.easeIn',
          onComplete: () => heart.destroy(),
        });
      },
    });
  }
}
