import { Physics, Math } from 'phaser';
import { Bullet } from './Bullet';

export class BlueEnemy extends Physics.Arcade.Sprite {
  scene = null;

  animation_is_playing = false;

  damage_life_point = 3;

  scale_damage = 4;

  up_down_tween = null;

  bullets = null;

  constructor(scene) {
    // Create enemy without texture first
    super(scene, scene.scale.width + 150, scene.scale.height - 100, null);
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    // Create enemy visual using graphics
    this.enemyGraphic = scene.add.graphics();
    this.enemyGraphic.fillStyle(0x4444ff, 1);
    this.enemyGraphic.fillRoundedRect(-15, -15, 30, 30, 5);
    this.enemyGraphic.lineStyle(2, 0x0000ff, 1);
    this.enemyGraphic.strokeRoundedRect(-15, -15, 30, 30, 5);

    // Add enemy eyes
    this.enemyGraphic.fillStyle(0xff0000, 1);
    this.enemyGraphic.fillCircle(-8, -5, 3);
    this.enemyGraphic.fillCircle(8, -5, 3);

    this.setScale(4);
    this.body.setSize(15, 15);

    this.up_down_tween = this.scene.tweens.add({
      targets: this,
      y: 85,
      duration: 1000,
      ease: Math.Easing.Sine.InOut,
      yoyo: true,
      repeat: -1,
    });
    this.up_down_tween.pause();

    // Bullets group
    this.bullets = this.scene.physics.add.group({
      classType: Bullet,
      maxSize: 100,
      runChildUpdate: true,
    });
  }

  start() {
    // Enter from right to left
    this.scene.tweens.add({
      targets: this,
      x: this.scene.scale.width - 150,
      duration: 1000,
      delay: 1000,
      ease: 'Power2',
      onComplete: () => {
        this.up_down_tween.resume();
      },
    });
  }

  damage(player_x, player_y) {
    const bullet = this.bullets.get();
    if (bullet) {
      bullet.fire(this.x, this.y, player_x, player_y, 'enemy-bullet');
    }

    // Remove missing animation and add visual feedback
    this.scene.tweens.add({
      targets: this.enemyGraphic,
      tint: 0xff0000,
      duration: 100,
      yoyo: true,
      onComplete: () => {
        this.enemyGraphic.clearTint();
      },
    });

    if (!this.animation_is_playing && this.scale_damage > 1) {
      if (this.damage_life_point === 0) {
        this.animation_is_playing = true;
        this.scene.tweens.add({
          targets: this,
          scale: --this.scale_damage,
          duration: 500,
          ease: 'Elastic.In',
          onComplete: () => {
            this.damage_life_point = 10;
            this.animation_is_playing = false;
          },
        });
      } else {
        this.damage_life_point--;
      }
    }

    // Add more difficulty
    this.up_down_tween.timeScale = 1 + (3 - this.scale_damage) / 2;
    if (this.scale_damage === 1) {
      this.up_down_tween.easing = 'Power2';
      this.up_down_tween.x = 10;
    }
  }

  update() {
    // Update enemy graphic position
    if (this.enemyGraphic) {
      this.enemyGraphic.setPosition(this.x, this.y);
    }
  }
}
