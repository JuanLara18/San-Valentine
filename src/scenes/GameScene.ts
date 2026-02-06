import Phaser from 'phaser';
import { SCENES, REGISTRY } from '../utils/constants';
import { gameConfig } from '../config/game.config';
import { t } from '../i18n';
import { Player } from '../entities/Player';
import { Heart } from '../entities/Heart';
import { Enemy } from '../entities/Enemy';
import { levels, PlatformData } from '../systems/LevelManager';
import { isMobileDevice } from '../utils/helpers';
import { audioManager } from '../systems/AudioManager';

interface GameData {
  level: number;
}

export class GameScene extends Phaser.Scene {
  private player!: Player;
  private platforms!: Phaser.Physics.Arcade.StaticGroup;
  private movingPlatforms: { sprite: Phaser.Physics.Arcade.Image; data: PlatformData; startX: number }[] = [];
  private hearts: Heart[] = [];
  private enemies: Enemy[] = [];
  private heartsCollected = 0;
  private currentLevel = 1;
  private isLevelComplete = false;
  private hudTexts: { lives: Phaser.GameObjects.Text; hearts: Phaser.GameObjects.Text; level: Phaser.GameObjects.Text } | null = null;
  private backgroundElements: Phaser.GameObjects.GameObject[] = [];

  constructor() {
    super({ key: SCENES.GAME });
  }

  init(data: GameData): void {
    this.currentLevel = data.level || 1;
    this.heartsCollected = 0;
    this.isLevelComplete = false;
    this.movingPlatforms = [];
    this.hearts = [];
    this.enemies = [];
    this.backgroundElements = [];
  }

  create(): void {
    const { width, height } = gameConfig;
    const levelData = levels[this.currentLevel - 1];

    if (!levelData) {
      this.scene.start(SCENES.VICTORY);
      return;
    }

    // Set world bounds to level scroll height
    this.physics.world.setBounds(0, 0, width, levelData.scrollHeight);

    this.cameras.main.fadeIn(500);

    // Create background
    this.createBackground(levelData.bgStyle, levelData.scrollHeight);

    // Create platforms
    this.platforms = this.physics.add.staticGroup();
    this.createPlatforms(levelData);

    // Create hearts
    this.createHearts(levelData);

    // Create enemies
    this.createEnemies(levelData);

    // Create player
    const lives = this.registry.get(REGISTRY.LIVES) || 3;
    this.player = new Player(this, levelData.playerStart.x, levelData.playerStart.y, lives);

    // Camera follow
    this.cameras.main.startFollow(this.player.sprite, true, 0.1, 0.1);
    this.cameras.main.setBounds(0, 0, width, levelData.scrollHeight);
    this.cameras.main.setDeadzone(width * 0.3, height * 0.2);

    // Collisions
    this.physics.add.collider(this.player.sprite, this.platforms);

    // Moving platform collisions
    this.movingPlatforms.forEach(mp => {
      this.physics.add.collider(this.player.sprite, mp.sprite);
    });

    // Heart collection
    this.hearts.forEach(heart => {
      this.physics.add.overlap(this.player.sprite, heart, () => {
        this.collectHeart(heart);
      });
    });

    // Enemy collision
    this.enemies.forEach(enemy => {
      this.physics.add.overlap(this.player.sprite, enemy, () => {
        this.hitEnemy();
      });
    });

    // Create HUD
    this.createHUD();

    // Show level intro
    this.showLevelIntro();

    // Start music based on level theme
    const musicTrack = levelData.bgStyle === 'storm' ? 'storm' as const : 'game' as const;
    audioManager.playTrack(musicTrack);

    // Fall death
    this.player.sprite.setCollideWorldBounds(false);
  }

  update(): void {
    if (this.isLevelComplete) return;

    this.player.update();

    // Update enemies
    this.enemies.forEach(enemy => {
      if (enemy.active) enemy.update();
    });

    // Update moving platforms
    this.updateMovingPlatforms();

    // Update HUD
    this.updateHUD();

    // Check fall death
    const levelData = levels[this.currentLevel - 1];
    if (this.player.sprite.y > levelData.scrollHeight + 50) {
      this.playerDied();
    }

    // Check level completion (reached top area + enough hearts)
    if (
      this.player.sprite.y <= levelData.goalY + 40 &&
      this.heartsCollected >= levelData.requiredHearts &&
      !this.isLevelComplete
    ) {
      this.completeLevel();
    }
  }

  private createBackground(style: string, scrollH: number): void {
    const { width } = gameConfig;

    // Background gradient fill
    const bg = this.add.graphics();
    bg.setScrollFactor(0);

    switch (style) {
      case 'sunset':
        bg.fillGradientStyle(0x4a148c, 0x4a148c, 0xff6f00, 0xff8f00);
        bg.fillRect(0, 0, width, 600);
        break;
      case 'storm':
        bg.fillGradientStyle(0x1a0a2e, 0x1a0a2e, 0x37474f, 0x455a64);
        bg.fillRect(0, 0, width, 600);
        break;
      case 'night':
        bg.fillGradientStyle(0x0d0221, 0x0d0221, 0x1a0a2e, 0x2d1b69);
        bg.fillRect(0, 0, width, 600);
        break;
    }

    // Stars (parallax)
    for (let i = 0; i < 40; i++) {
      const star = this.add.image(
        Phaser.Math.Between(0, width),
        Phaser.Math.Between(0, 600),
        'star'
      ).setScrollFactor(0.05)
       .setAlpha(Phaser.Math.FloatBetween(0.3, 0.9))
       .setScale(Phaser.Math.FloatBetween(0.5, 1.5));

      this.tweens.add({
        targets: star,
        alpha: Phaser.Math.FloatBetween(0.1, 0.4),
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1,
      });
    }

    // Clouds (parallax)
    for (let i = 0; i < 6; i++) {
      const cloud = this.add.image(
        Phaser.Math.Between(-20, width + 20),
        Phaser.Math.Between(50, 500),
        'cloud'
      ).setScrollFactor(0.1 + i * 0.03)
       .setAlpha(style === 'storm' ? 0.3 : 0.15)
       .setScale(Phaser.Math.FloatBetween(0.8, 2));

      this.tweens.add({
        targets: cloud,
        x: cloud.x + Phaser.Math.Between(20, 60),
        duration: Phaser.Math.Between(5000, 10000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    // Rain effect for storm level
    if (style === 'storm') {
      this.time.addEvent({
        delay: 50,
        loop: true,
        callback: () => {
          const rain = this.add.rectangle(
            Phaser.Math.Between(0, width),
            this.cameras.main.scrollY - 10,
            1, Phaser.Math.Between(6, 14),
            0x90caf9, 0.3
          ).setScrollFactor(1);

          this.tweens.add({
            targets: rain,
            y: rain.y + 620,
            duration: Phaser.Math.Between(400, 800),
            onComplete: () => rain.destroy(),
          });
        },
      });
    }

    // Aurora for night level
    if (style === 'night') {
      for (let i = 0; i < 3; i++) {
        const aurora = this.add.rectangle(
          width / 2,
          100 + i * 30,
          width,
          8,
          [0x00e5ff, 0x76ff03, 0xc44dff][i],
          0.08
        ).setScrollFactor(0.02);

        this.tweens.add({
          targets: aurora,
          scaleX: 0.7,
          alpha: 0.03,
          duration: 3000 + i * 1000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      }
    }
  }

  private createPlatforms(levelData: typeof levels[0]): void {
    levelData.platforms.forEach(p => {
      if (p.type === 'moving') {
        this.createMovingPlatform(p);
      } else {
        const textureKey = p.type === 'small' ? 'platform-small' : 'platform';
        const plat = this.platforms.create(p.x, p.y, textureKey) as Phaser.Physics.Arcade.Sprite;
        plat.refreshBody();

        // Disappearing platforms
        if (p.disappearing) {
          plat.setAlpha(0.7);
          plat.setTint(0xffa726);

          // Make platform disappear when player stands on it
          this.time.addEvent({
            delay: 100,
            loop: true,
            callback: () => {
              if (!this.player?.sprite?.active) return;
              const playerBody = this.player.sprite.body as Phaser.Physics.Arcade.Body;
              if (
                playerBody.blocked.down &&
                Math.abs(this.player.sprite.x - plat.x) < 30 &&
                Math.abs(this.player.sprite.y - plat.y) < 30
              ) {
                // Start disappearing
                this.tweens.add({
                  targets: plat,
                  alpha: 0,
                  duration: 800,
                  delay: 400,
                  onComplete: () => {
                    plat.disableBody(true, true);
                    // Reappear after delay
                    this.time.delayedCall(2000, () => {
                      plat.enableBody(true, p.x, p.y, true, true);
                      plat.setAlpha(0);
                      this.tweens.add({
                        targets: plat,
                        alpha: 0.7,
                        duration: 500,
                      });
                    });
                  },
                });
              }
            },
          });
        }
      }
    });
  }

  private createMovingPlatform(p: PlatformData): void {
    const plat = this.physics.add.image(p.x, p.y, 'platform-moving');
    plat.setImmovable(true);
    (plat.body as Phaser.Physics.Arcade.Body).setAllowGravity(false);
    plat.setFriction(1, 1);

    const startX = p.x;
    const moveX = p.moveX || 0;
    const moveSpeed = p.moveSpeed || 2000;

    this.tweens.add({
      targets: plat,
      x: startX + moveX,
      duration: moveSpeed,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    this.movingPlatforms.push({ sprite: plat, data: p, startX });
  }

  private updateMovingPlatforms(): void {
    // Moving platform player carry-along is handled by Phaser's arcade physics
  }

  private createHearts(levelData: typeof levels[0]): void {
    levelData.hearts.forEach(h => {
      const heart = new Heart(this, h.x, h.y, h.isGold);
      this.hearts.push(heart);
    });
  }

  private createEnemies(levelData: typeof levels[0]): void {
    levelData.enemies.forEach(e => {
      const enemy = new Enemy(this, e.x, e.y, {
        patrolDistance: e.patrolDistance,
        speed: e.speed,
        direction: e.direction,
      });
      this.enemies.push(enemy);
    });
  }

  private collectHeart(heart: Heart): void {
    if (!heart.active) return;
    this.heartsCollected++;
    heart.collect(this);
    this.hearts = this.hearts.filter(h => h !== heart);
    audioManager.playCollect();
  }

  private hitEnemy(): void {
    if (this.player.isInvincible || this.isLevelComplete) return;

    const isDead = this.player.hit();
    this.registry.set(REGISTRY.LIVES, this.player.lives);
    audioManager.playHit();

    // Screen shake
    this.cameras.main.shake(200, 0.01);

    // Red flash
    this.cameras.main.flash(200, 255, 0, 0, false, (_cam: any, progress: number) => {
      // flash callback
    });

    if (isDead) {
      this.playerDied();
    }
  }

  private playerDied(): void {
    this.isLevelComplete = true;
    this.player.sprite.setVelocity(0, 0);

    const { width } = gameConfig;
    const cx = width / 2;
    const camY = this.cameras.main.scrollY + 300;

    // Game over overlay
    const overlay = this.add.rectangle(cx, camY, width, 600, 0x000000, 0)
      .setScrollFactor(0)
      .setDepth(50);

    this.tweens.add({
      targets: overlay,
      fillAlpha: 0.7,
      duration: 500,
    });

    const gameOverText = this.add.text(200, 250, t('game.gameOver'), {
      fontFamily: gameConfig.ui.fontFamily,
      fontSize: '20px',
      color: '#ff4444',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(51).setAlpha(0);

    const retryBtn = this.add.image(200, 340, 'button')
      .setScrollFactor(0).setDepth(51).setAlpha(0)
      .setInteractive({ useHandCursor: true });

    const retryText = this.add.text(200, 338, t('game.tryAgain'), {
      fontFamily: gameConfig.ui.fontFamily,
      fontSize: '10px',
      color: '#ffffff',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(52).setAlpha(0);

    this.tweens.add({ targets: gameOverText, alpha: 1, duration: 500, delay: 300 });
    this.tweens.add({ targets: [retryBtn, retryText], alpha: 1, duration: 500, delay: 600 });

    retryBtn.on('pointerup', () => {
      // Reset lives and retry
      this.registry.set(REGISTRY.LIVES, 3);
      this.cameras.main.fadeOut(400, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.restart({ level: this.currentLevel });
      });
    });

    retryBtn.on('pointerover', () => retryBtn.setScale(1.05));
    retryBtn.on('pointerout', () => retryBtn.setScale(1));
  }

  private completeLevel(): void {
    this.isLevelComplete = true;
    audioManager.playWin();

    const { width } = gameConfig;
    const cx = width / 2;

    // Celebration particles
    for (let i = 0; i < 20; i++) {
      const p = this.add.image(
        this.player.sprite.x + Phaser.Math.Between(-20, 20),
        this.player.sprite.y + Phaser.Math.Between(-20, 20),
        'particle-heart'
      ).setScale(1.5).setDepth(40);

      this.tweens.add({
        targets: p,
        x: p.x + Phaser.Math.Between(-60, 60),
        y: p.y + Phaser.Math.Between(-80, -20),
        alpha: 0,
        scale: 0,
        duration: 1000,
        delay: i * 50,
        onComplete: () => p.destroy(),
      });
    }

    // Level complete text
    const completeText = this.add.text(200, 250, t('game.levelComplete'), {
      fontFamily: gameConfig.ui.fontFamily,
      fontSize: '16px',
      color: '#ffd700',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(50).setAlpha(0);

    this.tweens.add({
      targets: completeText,
      alpha: 1,
      scaleX: 1.2,
      scaleY: 1.2,
      duration: 800,
      ease: 'Back.easeOut',
    });

    // Proceed after delay
    this.time.delayedCall(2000, () => {
      this.cameras.main.fadeOut(600, 26, 10, 46);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        if (this.currentLevel >= gameConfig.levels.totalLevels) {
          // Game won!
          this.scene.start(SCENES.VICTORY);
        } else {
          // Next level story - always show the completion story for current level
          const storyKeys: Record<number, string> = {
            1: 'level1Complete',
            2: 'level2Complete',
          };
          const nextLevel = this.currentLevel + 1;
          const storyKey = storyKeys[this.currentLevel] || 'level1Complete';

          this.scene.start(SCENES.STORY, {
            storyKey,
            nextScene: SCENES.GAME,
            level: nextLevel,
          });
        }
      });
    });
  }

  private createHUD(): void {
    const ui = gameConfig.ui;

    const livesText = this.add.text(10, 10, '', {
      fontFamily: ui.fontFamily,
      fontSize: '8px',
      color: '#ff4081',
    }).setScrollFactor(0).setDepth(100);

    const heartsText = this.add.text(10, 28, '', {
      fontFamily: ui.fontFamily,
      fontSize: '8px',
      color: '#ff1744',
    }).setScrollFactor(0).setDepth(100);

    const levelText = this.add.text(gameConfig.width - 10, 10, '', {
      fontFamily: ui.fontFamily,
      fontSize: '8px',
      color: '#c44dff',
    }).setOrigin(1, 0).setScrollFactor(0).setDepth(100);

    this.hudTexts = { lives: livesText, hearts: heartsText, level: levelText };
  }

  private updateHUD(): void {
    if (!this.hudTexts) return;
    const levelData = levels[this.currentLevel - 1];
    this.hudTexts.lives.setText(`♥ x${this.player.lives}`);
    this.hudTexts.hearts.setText(`${t('game.hearts')}: ${this.heartsCollected}/${levelData.requiredHearts}`);
    this.hudTexts.level.setText(`${t('game.level')} ${this.currentLevel}`);
  }

  private showLevelIntro(): void {
    const { width } = gameConfig;
    const cx = width / 2;

    const levelName = t(`game.level${this.currentLevel}Name`);

    const overlay = this.add.rectangle(cx, 300, width, 600, 0x000000, 0.6)
      .setScrollFactor(0).setDepth(200);

    const readyText = this.add.text(cx, 260, `${t('game.level')} ${this.currentLevel}`, {
      fontFamily: gameConfig.ui.fontFamily,
      fontSize: '14px',
      color: '#c44dff',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(201);

    const nameText = this.add.text(cx, 290, levelName, {
      fontFamily: gameConfig.ui.fontFamily,
      fontSize: '12px',
      color: '#ff6b9d',
      wordWrap: { width: width - 40 },
      align: 'center',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(201);

    const goText = this.add.text(cx, 330, t('game.go'), {
      fontFamily: gameConfig.ui.fontFamily,
      fontSize: '18px',
      color: '#ffd700',
    }).setOrigin(0.5).setScrollFactor(0).setDepth(201).setAlpha(0);

    // Disable player input during intro
    this.player.sprite.setVelocity(0, 0);
    const body = this.player.sprite.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);

    this.time.delayedCall(1200, () => {
      this.tweens.add({
        targets: goText,
        alpha: 1,
        scaleX: 1.5,
        scaleY: 1.5,
        duration: 400,
        ease: 'Back.easeOut',
      });
    });

    this.time.delayedCall(2200, () => {
      this.tweens.add({
        targets: [overlay, readyText, nameText, goText],
        alpha: 0,
        duration: 400,
        onComplete: () => {
          overlay.destroy();
          readyText.destroy();
          nameText.destroy();
          goText.destroy();
          body.setAllowGravity(true);
        },
      });
    });
  }

  shutdown(): void {
    this.player?.destroy();
    this.enemies = [];
    this.hearts = [];
    this.movingPlatforms = [];
  }
}
