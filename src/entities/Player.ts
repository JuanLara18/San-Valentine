import Phaser from 'phaser';
import { gameConfig } from '../config/game.config';
import { audioManager } from '../systems/AudioManager';
import { InputManager, InputScheme, INPUT_SCHEMES } from '../systems/InputManager';

export class Player {
  public sprite: Phaser.Physics.Arcade.Sprite;
  public lives: number;
  public isInvincible = false;
  public readonly input: InputManager;

  private scene: Phaser.Scene;

  // --- Advanced platformer feel ---
  /** Timestamp of last time the player was on solid ground */
  private lastGroundedTime = 0;
  /** Coyote time: ms after leaving a platform where jump is still allowed */
  private readonly COYOTE_TIME = 120;
  /** Whether jump was consumed (prevents multi-jump from holding the key) */
  private jumpConsumed = false;
  /** Jump buffer: if jump is pressed this many ms before landing, it triggers on land */
  private jumpBufferTime = 0;
  private readonly JUMP_BUFFER = 150;
  /** Wall jump kick velocity (horizontal push away from wall) */
  private readonly WALL_JUMP_KICK = 180;

  constructor(
    scene: Phaser.Scene,
    x: number,
    y: number,
    lives: number = 3,
    inputScheme: InputScheme = INPUT_SCHEMES.SINGLE,
  ) {
    this.scene = scene;
    this.lives = lives;

    // Create sprite
    this.sprite = scene.physics.add.sprite(x, y, 'player', 0);
    this.sprite.setCollideWorldBounds(true);
    this.sprite.setBounce(gameConfig.physics.bounceRate);
    this.sprite.setSize(16, 24);
    this.sprite.setOffset(8, 6);

    // Input manager with configurable scheme
    this.input = new InputManager(scene, inputScheme);
  }

  update(): void {
    const speed = gameConfig.physics.playerSpeed;
    const jumpForce = gameConfig.physics.playerJump;
    const body = this.sprite.body as Phaser.Physics.Arcade.Body;
    const now = this.scene.time.now;

    // Read from InputManager (handles keyboard + mobile based on scheme)
    const isLeft = this.input.isLeft;
    const isRight = this.input.isRight;
    const isJump = this.input.isJump;

    // --- Grounded state tracking ---
    const isOnGround = body.blocked.down || body.touching.down;
    const isTouchingWall = body.blocked.left || body.blocked.right;

    if (isOnGround) {
      this.lastGroundedTime = now;
      this.jumpConsumed = false;
    }

    const withinCoyoteTime = (now - this.lastGroundedTime) < this.COYOTE_TIME;

    // --- Horizontal movement ---
    if (isLeft) {
      this.sprite.setVelocityX(-speed);
      this.sprite.setFlipX(true);
    } else if (isRight) {
      this.sprite.setVelocityX(speed);
      this.sprite.setFlipX(false);
    } else {
      this.sprite.setVelocityX(0);
    }

    // --- Jump buffer: remember jump press ---
    if (isJump) {
      this.jumpBufferTime = now;
    }
    const jumpBuffered = (now - this.jumpBufferTime) < this.JUMP_BUFFER;

    // --- Jump logic ---
    if (isJump && !this.jumpConsumed) {
      if (isOnGround || withinCoyoteTime) {
        // Normal jump or coyote jump
        this.sprite.setVelocityY(jumpForce);
        this.jumpConsumed = true;
        this.lastGroundedTime = 0; // Prevent double coyote
        audioManager.playJump();
      } else if (isTouchingWall) {
        // Wall jump: jump + kick away from wall
        this.sprite.setVelocityY(jumpForce * 0.9);
        this.sprite.setVelocityX(body.blocked.left ? this.WALL_JUMP_KICK : -this.WALL_JUMP_KICK);
        this.sprite.setFlipX(body.blocked.left ? false : true);
        this.jumpConsumed = true;
        audioManager.playJump();
      }
    }

    // --- Jump buffer: execute buffered jump on landing ---
    if (isOnGround && jumpBuffered && !this.jumpConsumed) {
      this.sprite.setVelocityY(jumpForce);
      this.jumpConsumed = true;
      this.jumpBufferTime = 0;
    }

    // --- Reset jump consumed when key is released ---
    if (!isJump) {
      this.jumpConsumed = false;
    }

    // --- Animation frames ---
    if (!isOnGround) {
      if (isTouchingWall && body.velocity.y > 0) {
        // Wall slide - use idle frame but slower fall
        this.sprite.setFrame(0);
        // Slow down fall when sliding on wall (wall friction)
        if (body.velocity.y > 100) {
          this.sprite.setVelocityY(100);
        }
      } else {
        this.sprite.setFrame(3); // Jump/fall frame
      }
    } else if (Math.abs(body.velocity.x) > 10) {
      // Running - alternate frames 1 and 2
      const frame = Math.floor(now / 150) % 2 === 0 ? 1 : 2;
      this.sprite.setFrame(frame);
    } else {
      this.sprite.setFrame(0); // Idle
    }

    // --- Invincibility flash ---
    if (this.isInvincible) {
      this.sprite.setAlpha(Math.sin(now / 50) > 0 ? 1 : 0.3);
    }
  }

  hit(): boolean {
    if (this.isInvincible) return false;

    this.lives--;
    this.isInvincible = true;

    // Flash effect
    this.scene.time.delayedCall(gameConfig.player.invincibilityDuration, () => {
      this.isInvincible = false;
      this.sprite.setAlpha(1);
    });

    // Knockback
    this.sprite.setVelocityY(-200);

    return this.lives <= 0;
  }

  destroy(): void {
    this.sprite.destroy();
  }
}
