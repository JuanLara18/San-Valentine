import Phaser from 'phaser';
import { SCENES, REGISTRY } from '../utils/constants';
import { gameConfig } from '../config/game.config';
import { valentineConfig } from '../config/valentine.config';
import { t } from '../i18n';
import { audioManager } from '../systems/AudioManager';

export class VictoryScene extends Phaser.Scene {
  private confettiTimer?: Phaser.Time.TimerEvent;

  constructor() {
    super({ key: SCENES.VICTORY });
  }

  create(): void {
    const { width, height } = gameConfig;
    const cx = width / 2;
    const cy = height / 2;

    this.cameras.main.fadeIn(800);

    // Victory music
    audioManager.playTrack('victory');

    // Dark background with stars
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0d0221, 0x0d0221, 0x1a0a2e, 0x1a0a2e);
    bg.fillRect(0, 0, width, height);

    // Twinkling stars
    for (let i = 0; i < 50; i++) {
      const star = this.add.image(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, height),
        'star'
      ).setAlpha(0).setScale(Phaser.Math.FloatBetween(0.5, 2));

      this.tweens.add({
        targets: star,
        alpha: Phaser.Math.FloatBetween(0.3, 1),
        duration: Phaser.Math.Between(500, 2000),
        delay: Phaser.Math.Between(0, 3000),
        yoyo: true,
        repeat: -1,
      });
    }

    // Phase 1: Hearts falling like confetti (start immediately)
    this.startHeartRain();

    // Phase 2: Narrative reveal - hearts come together to form the message
    this.time.delayedCall(1500, () => this.showNarrativeReveal());
  }

  private startHeartRain(): void {
    const { width } = gameConfig;

    this.confettiTimer = this.time.addEvent({
      delay: 150,
      loop: true,
      callback: () => {
        const x = Phaser.Math.Between(10, width - 10);
        const heart = this.add.image(x, -10, 'particle-heart')
          .setScale(Phaser.Math.FloatBetween(0.8, 2))
          .setAlpha(Phaser.Math.FloatBetween(0.4, 0.9))
          .setAngle(Phaser.Math.Between(-30, 30));

        this.tweens.add({
          targets: heart,
          y: gameConfig.height + 20,
          x: x + Phaser.Math.Between(-40, 40),
          angle: heart.angle + Phaser.Math.Between(-90, 90),
          duration: Phaser.Math.Between(2000, 4000),
          ease: 'Sine.easeIn',
          onComplete: () => heart.destroy(),
        });
      },
    });
  }

  private showNarrativeReveal(): void {
    const { width } = gameConfig;
    const cx = width / 2;

    // "All the hearts come together..."
    const revealText = this.add.text(cx, 180, t('victory.heartsReveal'), {
      fontFamily: gameConfig.ui.fontFamily,
      fontSize: '10px',
      color: '#ff6b9d',
      wordWrap: { width: width - 60 },
      align: 'center',
    }).setOrigin(0.5).setAlpha(0).setDepth(8);

    this.tweens.add({
      targets: revealText,
      alpha: 1,
      duration: 1200,
      ease: 'Quad.easeOut',
    });

    // "The message is complete."
    const completeText = this.add.text(cx, 230, t('victory.messageForming'), {
      fontFamily: gameConfig.ui.fontFamily,
      fontSize: '12px',
      color: '#ffd700',
      wordWrap: { width: width - 60 },
      align: 'center',
    }).setOrigin(0.5).setAlpha(0).setDepth(8);

    this.tweens.add({
      targets: completeText,
      alpha: 1,
      duration: 1000,
      delay: 1800,
    });

    // Fade out narrative and show envelope
    this.time.delayedCall(4000, () => {
      this.tweens.add({
        targets: [revealText, completeText],
        alpha: 0,
        duration: 600,
        onComplete: () => {
          revealText.destroy();
          completeText.destroy();
          this.showEnvelope();
        },
      });
    });
  }

  private showEnvelope(): void {
    const { width, height } = gameConfig;
    const cx = width / 2;
    const cy = height / 2;

    // Envelope slides up from bottom
    const envelope = this.add.image(cx, height + 80, 'envelope')
      .setScale(1.2)
      .setDepth(10);

    this.tweens.add({
      targets: envelope,
      y: cy - 30,
      duration: 1500,
      ease: 'Back.easeOut',
    });

    // "Tap to open" hint appears
    const tapHint = this.add.text(cx, cy + 60, t('victory.tapToOpen'), {
      fontFamily: gameConfig.ui.fontFamily,
      fontSize: '9px',
      color: '#c44dff',
    }).setOrigin(0.5).setAlpha(0).setDepth(11);

    this.tweens.add({
      targets: tapHint,
      alpha: 1,
      duration: 800,
      delay: 1800,
    });

    this.tweens.add({
      targets: tapHint,
      alpha: 0.4,
      duration: 600,
      delay: 2600,
      yoyo: true,
      repeat: -1,
    });

    // Make envelope interactive after it arrives
    this.time.delayedCall(2000, () => {
      envelope.setInteractive({ useHandCursor: true });
      envelope.once('pointerup', () => {
        tapHint.destroy();
        this.openEnvelope(envelope);
      });
    });
  }

  private openEnvelope(envelope: Phaser.GameObjects.Image): void {
    const { width, height } = gameConfig;
    const cx = width / 2;

    // Envelope opens with animation
    this.tweens.add({
      targets: envelope,
      scaleX: 1.5,
      scaleY: 0.1,
      alpha: 0,
      duration: 600,
      ease: 'Quad.easeIn',
      onComplete: () => {
        envelope.destroy();
        this.showLetter();
      },
    });

    // Burst of particles when opening
    for (let i = 0; i < 30; i++) {
      const particle = this.add.image(cx, height / 2 - 30,
        Phaser.Math.Between(0, 1) === 0 ? 'particle-heart' : 'particle-star'
      ).setScale(Phaser.Math.FloatBetween(1, 2.5))
       .setDepth(20);

      this.tweens.add({
        targets: particle,
        x: cx + Phaser.Math.Between(-150, 150),
        y: height / 2 - 30 + Phaser.Math.Between(-150, 150),
        alpha: 0,
        scale: 0,
        angle: Phaser.Math.Between(-180, 180),
        duration: Phaser.Math.Between(600, 1200),
        ease: 'Quad.easeOut',
        onComplete: () => particle.destroy(),
      });
    }
  }

  private showLetter(): void {
    const { width, height } = gameConfig;
    const cx = width / 2;

    // Letter background
    const letterBg = this.add.graphics().setDepth(15);
    letterBg.fillStyle(0xfff8e1, 0.95);
    letterBg.fillRoundedRect(30, 80, width - 60, height - 160, 8);
    letterBg.lineStyle(2, 0xff6b9d);
    letterBg.strokeRoundedRect(30, 80, width - 60, height - 160, 8);
    letterBg.setAlpha(0);

    // Letter decorative corners
    this.tweens.add({
      targets: letterBg,
      alpha: 1,
      duration: 800,
      ease: 'Quad.easeOut',
      onComplete: () => {
        this.typeMessage();
      },
    });
  }

  private typeMessage(): void {
    const { width, height } = gameConfig;
    const cx = width / 2;

    const nickname = this.registry.get(REGISTRY.NICKNAME) || valentineConfig.nickname;
    const letterIntro = t('victory.letterIntro');
    const message = valentineConfig.finalMessage;
    const fullText = `${nickname},\n\n${letterIntro}\n\n${message}`;

    // Create text object
    const messageText = this.add.text(cx, 120, '', {
      fontFamily: gameConfig.ui.fontFamily,
      fontSize: '10px',
      color: '#4a0028',
      wordWrap: { width: width - 90 },
      align: 'center',
      lineSpacing: 10,
    }).setOrigin(0.5, 0).setDepth(20);

    // Typewriter effect
    let charIndex = 0;
    this.time.addEvent({
      delay: 60,
      repeat: fullText.length - 1,
      callback: () => {
        charIndex++;
        messageText.setText(fullText.substring(0, charIndex));

        if (charIndex >= fullText.length) {
          // After message is complete, show the buttons
          this.time.delayedCall(800, () => this.showButtons());
        }
      },
    });

    // Decorative hearts on the letter
    const decorPositions = [
      { x: 50, y: 100 }, { x: width - 50, y: 100 },
      { x: 50, y: height - 100 }, { x: width - 50, y: height - 100 },
    ];

    decorPositions.forEach((pos, i) => {
      const deco = this.add.text(pos.x, pos.y, '♥', {
        fontSize: '10px',
        color: '#ffcdd2',
      }).setOrigin(0.5).setDepth(16).setAlpha(0);

      this.tweens.add({
        targets: deco,
        alpha: 0.6,
        duration: 500,
        delay: 400 + i * 200,
      });
    });
  }

  private showButtons(): void {
    const { width, height } = gameConfig;
    const cx = width / 2;
    const btnY = height - 180;

    // "Si" button
    const yesBtn = this.add.image(cx - 70, btnY, 'button')
      .setScale(0.7)
      .setInteractive({ useHandCursor: true })
      .setDepth(20)
      .setAlpha(0);

    const yesText = this.add.text(cx - 70, btnY - 2, t('victory.yes'), {
      fontFamily: gameConfig.ui.fontFamily,
      fontSize: '10px',
      color: '#ffffff',
    }).setOrigin(0.5).setDepth(21).setAlpha(0);

    // "Obvio que si" button
    const obvBtn = this.add.image(cx + 70, btnY, 'button')
      .setScale(0.7)
      .setInteractive({ useHandCursor: true })
      .setDepth(20)
      .setAlpha(0);

    const obvText = this.add.text(cx + 70, btnY - 2, t('victory.yesObviously'), {
      fontFamily: gameConfig.ui.fontFamily,
      fontSize: '7px',
      color: '#ffffff',
    }).setOrigin(0.5).setDepth(21).setAlpha(0);

    // Fade in buttons
    this.tweens.add({
      targets: [yesBtn, yesText, obvBtn, obvText],
      alpha: 1,
      duration: 600,
      ease: 'Back.easeOut',
    });

    // Button hover effects
    [yesBtn, obvBtn].forEach(btn => {
      btn.on('pointerover', () => btn.setScale(0.75));
      btn.on('pointerout', () => btn.setScale(0.7));
      btn.on('pointerdown', () => btn.setScale(0.65));
    });

    // Both buttons do the same thing - CELEBRATE!
    const celebrate = () => {
      yesBtn.disableInteractive();
      obvBtn.disableInteractive();
      this.tweens.add({
        targets: [yesBtn, yesText, obvBtn, obvText],
        alpha: 0,
        duration: 300,
        onComplete: () => {
          yesBtn.destroy();
          yesText.destroy();
          obvBtn.destroy();
          obvText.destroy();
          this.showCelebration();
        },
      });
    };

    yesBtn.on('pointerup', celebrate);
    obvBtn.on('pointerup', celebrate);
  }

  private showCelebration(): void {
    const { width, height } = gameConfig;
    const cx = width / 2;

    // Stop heart rain, start confetti
    this.confettiTimer?.destroy();

    // Clear the letter
    this.children.list
      .filter(c => (c as any).depth >= 15 && (c as any).depth <= 20)
      .forEach(c => {
        this.tweens.add({
          targets: c,
          alpha: 0,
          duration: 500,
          onComplete: () => c.destroy(),
        });
      });

    // Celebration text
    this.time.delayedCall(600, () => {
      // "I knew you'd say yes!" text
      const celebText = this.add.text(cx, 120, t('victory.celebration'), {
        fontFamily: gameConfig.ui.fontFamily,
        fontSize: '13px',
        color: '#ffd700',
        wordWrap: { width: width - 40 },
        align: 'center',
      }).setOrigin(0.5).setDepth(30).setAlpha(0);

      this.tweens.add({
        targets: celebText,
        alpha: 1,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 800,
        ease: 'Back.easeOut',
      });

      // Date details
      const dateText = this.add.text(cx, 200, `${t('victory.seeYou')}\n${valentineConfig.dateDetails}`, {
        fontFamily: gameConfig.ui.fontFamily,
        fontSize: '10px',
        color: '#ff6b9d',
        wordWrap: { width: width - 40 },
        align: 'center',
        lineSpacing: 8,
      }).setOrigin(0.5).setDepth(30).setAlpha(0);

      this.tweens.add({
        targets: dateText,
        alpha: 1,
        duration: 800,
        delay: 600,
      });

      // Extra message
      const extraText = this.add.text(cx, 280, valentineConfig.extraMessage, {
        fontFamily: gameConfig.ui.fontFamily,
        fontSize: '9px',
        color: '#c44dff',
        wordWrap: { width: width - 60 },
        align: 'center',
      }).setOrigin(0.5).setDepth(30).setAlpha(0);

      this.tweens.add({
        targets: extraText,
        alpha: 1,
        duration: 800,
        delay: 1200,
      });

      // "With all my love" + sender name
      const loveText = this.add.text(cx, 370, `${t('victory.withLove')}\n${valentineConfig.senderName}`, {
        fontFamily: gameConfig.ui.fontFamily,
        fontSize: '10px',
        color: '#ffffff',
        align: 'center',
        lineSpacing: 10,
      }).setOrigin(0.5).setDepth(30).setAlpha(0);

      this.tweens.add({
        targets: loveText,
        alpha: 1,
        duration: 1000,
        delay: 1800,
      });

      // Cupid at the bottom
      const cupid = this.add.image(cx, 460, 'player', 0)
        .setScale(3)
        .setDepth(30)
        .setAlpha(0);

      this.tweens.add({
        targets: cupid,
        alpha: 1,
        duration: 600,
        delay: 2200,
      });

      this.tweens.add({
        targets: cupid,
        y: 450,
        duration: 1200,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
        delay: 2200,
      });
    });

    // Confetti explosion!
    this.startConfetti();

    // Continuous heart floaters
    this.time.addEvent({
      delay: 300,
      loop: true,
      callback: () => {
        const symbols = ['♥', '✦', '♥', '💕', '✨'];
        const colors = ['#ff1744', '#ff4081', '#ffd700', '#c44dff', '#ff6b9d'];
        const idx = Phaser.Math.Between(0, symbols.length - 1);

        const floater = this.add.text(
          Phaser.Math.Between(20, width - 20),
          height + 10,
          symbols[idx],
          { fontSize: `${Phaser.Math.Between(10, 20)}px`, color: colors[idx] }
        ).setOrigin(0.5).setDepth(25);

        this.tweens.add({
          targets: floater,
          y: -30,
          x: floater.x + Phaser.Math.Between(-50, 50),
          alpha: 0,
          duration: Phaser.Math.Between(3000, 5000),
          ease: 'Sine.easeIn',
          onComplete: () => floater.destroy(),
        });
      },
    });

    // Firework bursts every few seconds
    this.time.addEvent({
      delay: 2000,
      loop: true,
      callback: () => this.createFirework(),
    });

    // Initial fireworks
    this.time.delayedCall(800, () => this.createFirework());
    this.time.delayedCall(1400, () => this.createFirework());
  }

  private startConfetti(): void {
    const { width } = gameConfig;

    for (let i = 0; i < 40; i++) {
      this.time.delayedCall(i * 50, () => {
        const colors = [0xff1744, 0xff4081, 0xffd700, 0xc44dff, 0x00e5ff, 0x76ff03, 0xff6b9d];
        const color = Phaser.Utils.Array.GetRandom(colors);

        const confetti = this.add.rectangle(
          Phaser.Math.Between(0, width),
          -10,
          Phaser.Math.Between(4, 8),
          Phaser.Math.Between(4, 8),
          color
        ).setAngle(Phaser.Math.Between(0, 360)).setDepth(28);

        this.tweens.add({
          targets: confetti,
          y: gameConfig.height + 20,
          x: confetti.x + Phaser.Math.Between(-80, 80),
          angle: confetti.angle + Phaser.Math.Between(-360, 360),
          duration: Phaser.Math.Between(2000, 4000),
          ease: 'Sine.easeIn',
          onComplete: () => confetti.destroy(),
        });
      });
    }

    // Continue confetti
    this.time.addEvent({
      delay: 400,
      loop: true,
      callback: () => {
        const colors = [0xff1744, 0xff4081, 0xffd700, 0xc44dff, 0x00e5ff];
        const color = Phaser.Utils.Array.GetRandom(colors);
        const confetti = this.add.rectangle(
          Phaser.Math.Between(0, width),
          -5,
          Phaser.Math.Between(3, 7),
          Phaser.Math.Between(3, 7),
          color
        ).setDepth(28);

        this.tweens.add({
          targets: confetti,
          y: gameConfig.height + 10,
          x: confetti.x + Phaser.Math.Between(-60, 60),
          angle: Phaser.Math.Between(-360, 360),
          duration: Phaser.Math.Between(2500, 4500),
          onComplete: () => confetti.destroy(),
        });
      },
    });
  }

  private createFirework(): void {
    const { width, height } = gameConfig;
    const fx = Phaser.Math.Between(60, width - 60);
    const fy = Phaser.Math.Between(80, height * 0.4);
    const colors = [0xff1744, 0xffd700, 0xc44dff, 0x00e5ff, 0xff4081];
    const color = Phaser.Utils.Array.GetRandom(colors);

    for (let i = 0; i < 16; i++) {
      const angle = (i / 16) * Math.PI * 2;
      const dist = Phaser.Math.Between(30, 70);

      const spark = this.add.rectangle(
        fx, fy, 3, 3, color
      ).setDepth(29);

      this.tweens.add({
        targets: spark,
        x: fx + Math.cos(angle) * dist,
        y: fy + Math.sin(angle) * dist,
        alpha: 0,
        scale: 0.2,
        duration: Phaser.Math.Between(600, 1000),
        ease: 'Quad.easeOut',
        onComplete: () => spark.destroy(),
      });
    }
  }
}
