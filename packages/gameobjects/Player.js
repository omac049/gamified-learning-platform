import { GameObjects, Physics } from 'phaser';
import { Bullet } from './Bullet';

export class Player extends Physics.Arcade.Image {
  // Player states: waiting, start, can_move
  state = 'waiting';

  propulsion_fire = null;

  scene = null;

  bullets = null;

  constructor({ scene }) {
    super(scene, -190, 100, 'player');
    this.scene = scene;
    this.scene.add.existing(this);
    this.scene.physics.add.existing(this);

    // Create graphics-based propulsion fire instead of missing sprite
    this.propulsion_fire = this.scene.add.graphics();
    this.createPropulsionEffect();

    // Bullets group to create pool
    this.bullets = this.scene.physics.add.group({
      classType: Bullet,
      maxSize: 100,
      runChildUpdate: true,
    });
  }

  createPropulsionEffect() {
    this.propulsion_fire.clear();
    this.propulsion_fire.fillStyle(0xff4500, 0.8);
    this.propulsion_fire.fillEllipse(this.x - 32, this.y, 20, 8);
    this.propulsion_fire.fillStyle(0xffa500, 0.6);
    this.propulsion_fire.fillEllipse(this.x - 28, this.y, 12, 6);
    this.propulsion_fire.fillStyle(0xffff00, 0.4);
    this.propulsion_fire.fillEllipse(this.x - 24, this.y, 8, 4);
  }

  start() {
    this.state = 'start';
    const propulsion_fires_trail = [];

    // Effect to move the player from left to right
    this.scene.tweens.add({
      targets: this,
      x: 200,
      duration: 800,
      delay: 1000,
      ease: 'Power2',
      yoyo: false,
      onUpdate: () => {
        // Just a little trail FX using graphics instead of missing sprite
        const propulsion = this.scene.add.graphics();
        propulsion.fillStyle(0xff4500, 0.6);
        propulsion.fillEllipse(this.x - 32, this.y, 15, 6);
        propulsion_fires_trail.push(propulsion);
      },
      onComplete: () => {
        // Destroy all the trail FX
        propulsion_fires_trail.forEach((propulsion, i) => {
          this.scene.tweens.add({
            targets: propulsion,
            alpha: 0,
            scale: 0.5,
            duration: 200 + i * 2,
            ease: 'Power2',
            onComplete: () => {
              propulsion.destroy();
            },
          });
        });

        this.propulsion_fire.setPosition(this.x - 32, this.y);

        // When all tween are finished, the player can move
        this.state = 'can_move';
      },
    });
  }

  move(direction) {
    if (this.state === 'can_move') {
      if (direction === 'up' && this.y - 10 > 0) {
        this.y -= 5;
        this.updatePropulsionFire();
      } else if (
        direction === 'down' &&
        this.y + 75 < this.scene.scale.height
      ) {
        this.y += 5;
        this.updatePropulsionFire();
      }
    }
  }

  fire(x, y) {
    if (this.state === 'can_move') {
      // Create bullet
      const bullet = this.bullets.get();
      if (bullet) {
        bullet.fire(this.x + 16, this.y + 5, x, y);
      }
    }
  }

  updatePropulsionFire() {
    this.propulsion_fire.setPosition(this.x - 32, this.y);
  }

  update() {
    // Sinusoidal movement up and down up and down 2px
    this.y += Math.sin(this.scene.time.now / 200) * 0.1;
    this.propulsion_fire.y = this.y;
  }
}
