import { Scene } from "phaser";

export class GameOverScene extends Scene {
    end_points = 0;
    constructor() {
        super("GameOverScene");
    }

    init(data) {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        this.end_points = data.points || 0;
    }

    create() {
        // Create graphics-based backgrounds instead of missing images
        const background = this.add.graphics();
        background.fillGradientStyle(0x1a0033, 0x1a0033, 0x2d1b69, 0x4c1d95, 1);
        background.fillRect(0, 0, this.scale.width, this.scale.height);
        
        const floor = this.add.graphics();
        floor.fillStyle(0x374151);
        floor.fillRect(0, this.scale.height - 50, this.scale.width, 50);

        // Rectangles to show the text
        // Background rectangles
        this.add.rectangle(
            0,
            this.scale.height / 2,
            this.scale.width,
            120,
            0xffffff
        ).setAlpha(.8).setOrigin(0, 0.5);
        this.add.rectangle(
            0,
            this.scale.height / 2 + 105,
            this.scale.width,
            90,
            0x000000
        ).setAlpha(.8).setOrigin(0, 0.5);

        // Use regular text instead of bitmap text that might not be loaded
        const gameover_text = this.add.text(
            this.scale.width / 2,
            this.scale.height / 2,
            "GAME\nOVER",
            {
                fontSize: '62px',
                fontFamily: 'Courier, monospace',
                fill: '#000000',
                fontStyle: 'bold',
                align: 'center'
            }
        ).setOrigin(0.5, 0.5);

        this.add.text(
            this.scale.width / 2,
            this.scale.height / 2 + 85,
            `YOUR POINTS: ${this.end_points}`,
            {
                fontSize: '24px',
                fontFamily: 'Courier, monospace',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5, 0.5);

        this.add.text(
            this.scale.width / 2,
            this.scale.height / 2 + 130,
            "CLICK TO RESTART",
            {
                fontSize: '24px',
                fontFamily: 'Courier, monospace',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5, 0.5);

        // Click to restart
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.input.on("pointerdown", () => {
                    this.scene.start("MainScene");
                });
            }
        
        })
    }
}