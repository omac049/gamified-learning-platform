import { Scene } from "phaser";
import { Player, BlueEnemy } from "../gameobjects/index.js";

export class MainScene extends Scene {
    player = null;
    enemy_blue = null;
    cursors = null;

    points = 0;
    game_over_timeout = 20;

    constructor() {
        super("MainScene");
    }

    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.scene.launch("MenuScene");

        // Reset points
        this.points = 0;
        this.game_over_timeout = 20;
    }

    create() {
        // Create graphics-based backgrounds instead of missing images
        const background = this.add.graphics();
        background.fillGradientStyle(0x1a0033, 0x1a0033, 0x2d1b69, 0x4c1d95, 1);
        background.fillRect(0, 0, this.scale.width, this.scale.height);
        
        const floor = this.add.graphics();
        floor.fillStyle(0x374151);
        floor.fillRect(0, this.scale.height - 50, this.scale.width, 50);

        // Player
        this.player = new Player({ scene: this });

        // Enemy
        this.enemy_blue = new BlueEnemy(this);

        // Cursor keys 
        this.cursors = this.input.keyboard.createCursorKeys();
        this.cursors.space.on("down", () => {
            this.player.fire();
        });
        this.input.on("pointerdown", (pointer) => {
            this.player.fire(pointer.x, pointer.y);
        });

        // Overlap enemy with bullets
        this.physics.add.overlap(this.player.bullets, this.enemy_blue, (enemy, bullet) => {
            bullet.destroyBullet();
            this.enemy_blue.damage(this.player.x, this.player.y);
            this.points += 10;
            this.scene.get("HudScene")
                .update_points(this.points);
        });

        // Overlap player with enemy bullets
        this.physics.add.overlap(this.enemy_blue.bullets, this.player, (player, bullet) => {
            bullet.destroyBullet();
            this.cameras.main.shake(100, 0.01);
            // Flash the color white for 300ms
            this.safeFlash(300, 255, 10, 10, false);
            this.points -= 10;
            this.scene.get("HudScene")
                .update_points(this.points);
        });

        // This event comes from MenuScene
        this.game.events.on("start-game", () => {
            this.scene.stop("MenuScene");
            this.scene.launch("HudScene", { remaining_time: this.game_over_timeout });
            this.player.start();
            this.enemy_blue.start();

            // Game Over timeout
            this.time.addEvent({
                delay: 1000,
                loop: true,
                callback: () => {
                    if (this.game_over_timeout === 0) {
                        // You need remove the event listener to avoid duplicate events.
                        this.game.events.removeListener("start-game");
                        // It is necessary to stop the scenes launched in parallel.
                        this.scene.stop("HudScene");
                        this.scene.start("GameOverScene", { points: this.points });
                    } else {
                        this.game_over_timeout--;
                        this.scene.get("HudScene").update_timeout(this.game_over_timeout);
                    }
                }
            });
        });
    }

    // Safe flash method to prevent callback errors
    safeFlash(duration = 300, red = 255, green = 255, blue = 255, force = false, callback = null) {
        try {
            if (this.cameras && this.cameras.main) {
                this.cameras.main.flash(duration, red, green, blue, force, callback);
            }
        } catch (error) {
            console.warn('Flash effect error:', error);
            // Fallback: create a simple flash overlay
            const flashOverlay = this.add.rectangle(
                this.scale.width / 2,
                this.scale.height / 2,
                this.scale.width,
                this.scale.height,
                Phaser.Display.Color.GetColor(red, green, blue),
                0.5
            ).setDepth(10000);
            
            this.tweens.add({
                targets: flashOverlay,
                alpha: 0,
                duration: duration,
                onComplete: () => {
                    flashOverlay.destroy();
                    if (callback) callback();
                }
            });
        }
    }

    update() {
        this.player.update();
        this.enemy_blue.update();

        // Player movement entries
        if (this.cursors.up.isDown) {
            this.player.move("up");
        }
        if (this.cursors.down.isDown) {
            this.player.move("down");
        }

    }
}