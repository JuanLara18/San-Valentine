import Phaser from 'phaser';

export class Heart extends Phaser.Physics.Arcade.Sprite {
  public isGold: boolean;
  private floatTween: Phaser.Tweens.Tween | null = null;

  constructor(scene: Phaser.Scene, x: number, y: number, isGold: boolean = false) {
    super(scene, x, y, isGold ? 'heart-gold' : 'heart', 0);
    this.isGold = isGold;

    scene.add.existing(this);
    scene.physics.add.existing(this);

    // Configure physics
    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);

    if (isGold) {
      this.setScale(1.2);
      body.setSize(20, 20);
    } else {
      body.setSize(12, 12);
    }

    // Floating animation
    this.floatTween = scene.tweens.add({
      targets: this,
      y: y - 8,
      duration: 1000 + Math.random() * 500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Frame pulse animation
    scene.time.addEvent({
      delay: 400,
      loop: true,
      callback: () => {
        if (this.active) {
          this.setFrame(this.frame.name === '0' ? 1 : 0);
        }
      },
    });

    // Gold heart extra glow
    if (isGold) {
      scene.tweens.add({
        targets: this,
        scaleX: 1.4,
        scaleY: 1.4,
        duration: 800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  collect(scene: Phaser.Scene): void {
    // Particle burst
    for (let i = 0; i < (this.isGold ? 12 : 6); i++) {
      const p = scene.add.image(this.x, this.y, 'particle-heart')
        .setScale(this.isGold ? 1.5 : 1)
        .setAlpha(1);

      scene.tweens.add({
        targets: p,
        x: this.x + Phaser.Math.Between(-40, 40),
        y: this.y + Phaser.Math.Between(-40, 40),
        alpha: 0,
        scale: 0,
        duration: 500,
        ease: 'Quad.easeOut',
        onComplete: () => p.destroy(),
      });
    }

    // Score text popup
    const scoreText = scene.add.text(this.x, this.y - 10, this.isGold ? '+50' : '+10', {
      fontFamily: '"Press Start 2P"',
      fontSize: this.isGold ? '12px' : '8px',
      color: this.isGold ? '#ffd700' : '#ff6b9d',
    }).setOrigin(0.5);

    scene.tweens.add({
      targets: scoreText,
      y: this.y - 40,
      alpha: 0,
      duration: 800,
      ease: 'Quad.easeOut',
      onComplete: () => scoreText.destroy(),
    });

    this.floatTween?.destroy();
    this.destroy();
  }
}
