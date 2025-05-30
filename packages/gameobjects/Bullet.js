import { GameObjects, Math } from "phaser";

export class Bullet extends GameObjects.Image
{
    speed;
    flame;
    end_direction = new Math.Vector2(0, 0);

    constructor(scene, x, y) {
        // Create a simple graphics-based bullet instead of using missing texture
        super(scene, x, y, null);
        
        // Create bullet visual using graphics
        this.bulletGraphic = scene.add.graphics();
        this.bulletGraphic.fillStyle(0x00ffff, 1);
        this.bulletGraphic.fillCircle(0, 0, 3);
        this.bulletGraphic.lineStyle(1, 0xffffff, 1);
        this.bulletGraphic.strokeCircle(0, 0, 3);
        
        this.speed = Phaser.Math.GetSpeed(450, 1);
        
        // Add glow effect using tween instead of postFX
        scene.tweens.add({
            targets: this.bulletGraphic,
            alpha: 0.7,
            duration: 200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Default bullet (player bullet)
        this.name = "bullet";
    }

    fire (x, y, targetX = 1, targetY = 0, bullet_texture = "bullet")
    {
        // Update bullet graphic position instead of changing texture
        this.bulletGraphic.setPosition(x, y);

        this.setPosition(x, y);
        this.setActive(true);
        this.setVisible(true);

        // Calculate direction towards target
        if (targetX === 1 && targetY === 0) {
            this.end_direction.setTo(1, 0);
        } else {
            this.end_direction.setTo(targetX - x, targetY - y).normalize();            
        }
    }

    destroyBullet ()
    {
        if (this.flame === undefined) {
            // Create graphics-based explosion effect instead of missing particles
            this.flame = this.scene.add.graphics();
            this.flame.setPosition(this.x, this.y);
            this.flame.setDepth(1);
            
            // Create explosion effect
            for (let i = 0; i < 8; i++) {
                const angle = (i / 8) * Math.PI * 2;
                const distance = 20;
                const sparkX = Math.cos(angle) * distance;
                const sparkY = Math.sin(angle) * distance;
                
                this.flame.fillStyle(0xffa500, 0.8);
                this.flame.fillCircle(sparkX, sparkY, 2);
            }
            
            // Animate explosion
            this.scene.tweens.add({
                targets: this.flame,
                alpha: 0,
                scaleX: 2,
                scaleY: 2,
                duration: 250,
                ease: 'Power2',
                onComplete: () => {
                    this.flame.destroy();
                }
            });
        }

        // Destroy bullet graphic
        if (this.bulletGraphic) {
            this.bulletGraphic.destroy();
        }

        // Destroy bullets
        this.setActive(false);
        this.setVisible(false);
        this.destroy();

    }

    // Update bullet position and destroy if it goes off screen
    update (time, delta)
    {
        this.x += this.end_direction.x * this.speed * delta;
        this.y += this.end_direction.y * this.speed * delta;
        
        // Update bullet graphic position
        if (this.bulletGraphic) {
            this.bulletGraphic.setPosition(this.x, this.y);
        }

        // Verifica si la bala ha salido de la pantalla
        if (this.x > this.scene.sys.canvas.width || this.x < 0 || this.y > this.scene.sys.canvas.height || this.y < 0) {
            if (this.bulletGraphic) {
                this.bulletGraphic.destroy();
            }
            this.setActive(false);
            this.setVisible(false);
            this.destroy();
        }
    }
}