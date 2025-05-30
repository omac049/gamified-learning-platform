import { Scene } from "phaser";

export class SplashScene extends Scene {

    constructor() {
        super("SplashScene");
    }

    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);   
    }

    create() {
        // Create a text-based logo instead of using missing image texture
        const logo = this.add.text(this.scale.width / 2, this.scale.height / 2, 
            "🤖 CYBER ACADEMY 🤖", {
            fontSize: '48px',
            fontFamily: 'Courier, monospace',
            fill: '#00ffff',
            stroke: '#ff00ff',
            strokeThickness: 4,
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Add glow effect instead of postFX shine
        this.tweens.add({
            targets: logo,
            alpha: 0.7,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                const main_camera = this.cameras.main.fadeOut(1000, 0, 0, 0);
                // Fadeout complete
                main_camera.once("camerafadeoutcomplete", () => {
                    this.scene.start("MainScene");
                });
            }
        });
    }

}