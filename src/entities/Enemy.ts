import Phaser from 'phaser';

interface EnemyConfig {
  patrolDistance: number;
  speed: number;
  direction: 'horizontal' | 'vertical';
}

export class Enemy extends Phaser.Physics.Arcade.Sprite {
  private startX: number;
  private startY: number;
  private config: EnemyConfig;
  private movingForward = true;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    config: Partial<EnemyConfig> = {}
  ) {
    super(scene, x, y, 'enemy', 0);

    this.startX = x;
    this.startY = y;
    this.config = {
      patrolDistance: config.patrolDistance ?? 80,
      speed: config.speed ?? 60,
      direction: config.direction ?? 'horizontal',
    };

    scene.add.existing(this);
    scene.physics.add.existing(this);

    const body = this.body as Phaser.Physics.Arcade.Body;
    body.setAllowGravity(false);
    body.setImmovable(true);
    body.setSize(16, 16);
    body.setOffset(2, 2);

    // Frame animation
    scene.time.addEvent({
      delay: 300,
      loop: true,
      callback: () => {
        if (this.active) {
          this.setFrame(this.frame.name === '0' ? 1 : 0);
        }
      },
    });
  }

  update(): void {
    const { patrolDistance, speed, direction } = this.config;

    if (direction === 'horizontal') {
      if (this.movingForward) {
        this.setVelocityX(speed);
        if (this.x >= this.startX + patrolDistance) {
          this.movingForward = false;
          this.setFlipX(true);
        }
      } else {
        this.setVelocityX(-speed);
        if (this.x <= this.startX - patrolDistance) {
          this.movingForward = true;
          this.setFlipX(false);
        }
      }
    } else {
      if (this.movingForward) {
        this.setVelocityY(speed);
        if (this.y >= this.startY + patrolDistance) {
          this.movingForward = false;
        }
      } else {
        this.setVelocityY(-speed);
        if (this.y <= this.startY - patrolDistance) {
          this.movingForward = true;
        }
      }
    }
  }
}
