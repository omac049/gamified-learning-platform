export class FXManager {
    constructor(scene) {
        this.scene = scene;
        this.particleSystems = new Map();
        this.activeEffects = new Map();
        this.tweenGroups = new Map();
        
        // Initialize particle textures if not already created
        this.createParticleTextures();
    }

    createParticleTextures() {
        // Create various particle textures for different effects
        if (!this.scene.textures.exists('spark')) {
            this.scene.add.graphics()
                .fillStyle(0xffffff)
                .fillCircle(4, 4, 4)
                .generateTexture('spark', 8, 8)
                .destroy();
        }

        if (!this.scene.textures.exists('star')) {
            const graphics = this.scene.add.graphics();
            graphics.fillStyle(0xffd700);
            graphics.beginPath();
            graphics.moveTo(4, 0);
            graphics.lineTo(5, 3);
            graphics.lineTo(8, 3);
            graphics.lineTo(6, 5);
            graphics.lineTo(7, 8);
            graphics.lineTo(4, 6);
            graphics.lineTo(1, 8);
            graphics.lineTo(2, 5);
            graphics.lineTo(0, 3);
            graphics.lineTo(3, 3);
            graphics.closePath();
            graphics.fillPath();
            graphics.generateTexture('star', 8, 8);
            graphics.destroy();
        }

        if (!this.scene.textures.exists('coin-particle')) {
            const graphics = this.scene.add.graphics();
            graphics.fillStyle(0xffd700);
            graphics.fillCircle(3, 3, 3);
            graphics.lineStyle(1, 0xffaa00);
            graphics.strokeCircle(3, 3, 3);
            graphics.generateTexture('coin-particle', 6, 6);
            graphics.destroy();
        }
    }

    // Enhanced visual feedback with Game Object Components
    createSuccessEffect(x, y, scale = 1) {
        const effectId = `success_${Date.now()}`;
        
        // Main success burst with particles
        const particles = this.scene.add.particles(x, y, 'star', {
            speed: { min: 50, max: 150 },
            scale: { start: 0.3 * scale, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 800,
            quantity: 15,
            blendMode: 'ADD',
            tint: [0xffd700, 0x00ff00, 0x00ffff]
        });

        // Expanding ring effect using Transform Component
        const ring = this.scene.add.circle(x, y, 5, 0x00ff00, 0)
            .setStrokeStyle(3, 0x00ff00, 1)
            .setBlendMode('ADD');

        // Ring expansion animation with alpha fade
        this.scene.tweens.add({
            targets: ring,
            scaleX: 4 * scale,
            scaleY: 4 * scale,
            alpha: 0,
            duration: 600,
            ease: 'Power2',
            onComplete: () => ring.destroy()
        });

        // Floating "+CORRECT!" text with enhanced styling
        const text = this.scene.add.text(x, y - 30, '+CORRECT!', {
            fontSize: `${24 * scale}px`,
            fontFamily: 'Arial, sans-serif',
            fill: '#00ff00',
            stroke: '#ffffff',
            strokeThickness: 2,
            shadow: {
                offsetX: 2,
                offsetY: 2,
                color: '#000000',
                blur: 4,
                fill: true
            }
        }).setOrigin(0.5)
          .setAlpha(0)
          .setScale(0.5);

        // Text animation with bounce and fade
        this.scene.tweens.add({
            targets: text,
            alpha: 1,
            scaleX: 1.2,
            scaleY: 1.2,
            y: y - 60,
            duration: 300,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: text,
                    alpha: 0,
                    y: y - 80,
                    duration: 500,
                    delay: 1000,
                    onComplete: () => text.destroy()
                });
            }
        });

        // Store effect for cleanup
        this.activeEffects.set(effectId, {
            particles,
            ring,
            text,
            cleanup: () => {
                particles.destroy();
                if (ring.active) ring.destroy();
                if (text.active) text.destroy();
            }
        });

        // Auto cleanup after 3 seconds
        this.scene.time.delayedCall(3000, () => {
            this.cleanupEffect(effectId);
        });

        return effectId;
    }

    // Enhanced error effect with screen shake and visual feedback
    createErrorEffect(x, y, scale = 1) {
        const effectId = `error_${Date.now()}`;

        // Screen shake using camera effects
        this.scene.cameras.main.shake(200, 0.01);

        // Error particles
        const particles = this.scene.add.particles(x, y, 'spark', {
            speed: { min: 30, max: 100 },
            scale: { start: 0.4 * scale, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 600,
            quantity: 10,
            tint: 0xff0000,
            blendMode: 'ADD'
        });

        // X mark effect
        const xMark1 = this.scene.add.rectangle(x, y, 30 * scale, 4 * scale, 0xff0000)
            .setRotation(Math.PI / 4)
            .setAlpha(0)
            .setBlendMode('ADD');
        
        const xMark2 = this.scene.add.rectangle(x, y, 30 * scale, 4 * scale, 0xff0000)
            .setRotation(-Math.PI / 4)
            .setAlpha(0)
            .setBlendMode('ADD');

        // X mark animation
        this.scene.tweens.add({
            targets: [xMark1, xMark2],
            alpha: 1,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 200,
            yoyo: true,
            repeat: 1,
            onComplete: () => {
                xMark1.destroy();
                xMark2.destroy();
            }
        });

        // Error text with shake effect
        const text = this.scene.add.text(x, y - 30, 'INCORRECT', {
            fontSize: `${20 * scale}px`,
            fontFamily: 'Arial, sans-serif',
            fill: '#ff0000',
            stroke: '#ffffff',
            strokeThickness: 2
        }).setOrigin(0.5)
          .setAlpha(0);

        // Text shake and fade animation
        this.scene.tweens.add({
            targets: text,
            alpha: 1,
            duration: 100,
            onComplete: () => {
                // Shake effect
                this.scene.tweens.add({
                    targets: text,
                    x: x + 5,
                    duration: 50,
                    yoyo: true,
                    repeat: 5,
                    onComplete: () => {
                        this.scene.tweens.add({
                            targets: text,
                            alpha: 0,
                            duration: 500,
                            delay: 500,
                            onComplete: () => text.destroy()
                        });
                    }
                });
            }
        });

        this.activeEffects.set(effectId, {
            particles,
            xMark1,
            xMark2,
            text,
            cleanup: () => {
                particles.destroy();
                if (xMark1.active) xMark1.destroy();
                if (xMark2.active) xMark2.destroy();
                if (text.active) text.destroy();
            }
        });

        this.scene.time.delayedCall(2000, () => {
            this.cleanupEffect(effectId);
        });

        return effectId;
    }

    // Coin collection effect with magnetic attraction
    createCoinCollectionEffect(startX, startY, targetX, targetY, amount, callback) {
        const effectId = `coin_${Date.now()}`;
        const coins = [];

        // Create multiple coin particles
        for (let i = 0; i < Math.min(amount, 10); i++) {
            const coin = this.scene.add.circle(
                startX + Phaser.Math.Between(-20, 20),
                startY + Phaser.Math.Between(-20, 20),
                8,
                0xffd700
            ).setStrokeStyle(2, 0xffaa00)
             .setBlendMode('ADD')
             .setAlpha(0.8);

            // Magnetic attraction to target
            this.scene.tweens.add({
                targets: coin,
                x: targetX + Phaser.Math.Between(-10, 10),
                y: targetY + Phaser.Math.Between(-10, 10),
                scaleX: 0.3,
                scaleY: 0.3,
                alpha: 1,
                duration: 800 + (i * 50),
                ease: 'Power2',
                delay: i * 100,
                onComplete: () => {
                    // Flash effect on collection
                    this.scene.tweens.add({
                        targets: coin,
                        alpha: 0,
                        scaleX: 2,
                        scaleY: 2,
                        duration: 200,
                        onComplete: () => coin.destroy()
                    });
                    
                    if (i === Math.min(amount, 10) - 1 && callback) {
                        callback();
                    }
                }
            });

            coins.push(coin);
        }

        // Coin amount text
        const text = this.scene.add.text(startX, startY - 40, `+${amount} 🪙`, {
            fontSize: '20px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffd700',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5)
          .setAlpha(0);

        this.scene.tweens.add({
            targets: text,
            alpha: 1,
            y: startY - 80,
            duration: 1500,
            ease: 'Power2',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: text,
                    alpha: 0,
                    duration: 500,
                    onComplete: () => text.destroy()
                });
            }
        });

        this.activeEffects.set(effectId, {
            coins,
            text,
            cleanup: () => {
                coins.forEach(coin => {
                    if (coin.active) coin.destroy();
                });
                if (text.active) text.destroy();
            }
        });

        return effectId;
    }

    // Level up effect with spectacular visuals
    createLevelUpEffect(x, y, level) {
        const effectId = `levelup_${Date.now()}`;

        // Burst of stars
        const starBurst = this.scene.add.particles(x, y, 'star', {
            speed: { min: 100, max: 300 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 1500,
            quantity: 30,
            blendMode: 'ADD',
            tint: [0xffd700, 0xff69b4, 0x00ffff, 0x98fb98]
        });

        // Expanding golden ring
        const ring = this.scene.add.circle(x, y, 10, 0xffd700, 0)
            .setStrokeStyle(5, 0xffd700, 1)
            .setBlendMode('ADD');

        this.scene.tweens.add({
            targets: ring,
            scaleX: 8,
            scaleY: 8,
            alpha: 0,
            duration: 1200,
            ease: 'Power2',
            onComplete: () => ring.destroy()
        });

        // Level up text with glow effect
        const text = this.scene.add.text(x, y, `LEVEL ${level}!`, {
            fontSize: '36px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffd700',
            stroke: '#ffffff',
            strokeThickness: 3,
            shadow: {
                offsetX: 0,
                offsetY: 0,
                color: '#ffd700',
                blur: 10,
                fill: true
            }
        }).setOrigin(0.5)
          .setAlpha(0)
          .setScale(0.5);

        // Text animation with bounce
        this.scene.tweens.add({
            targets: text,
            alpha: 1,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 400,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: text,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 200,
                    onComplete: () => {
                        this.scene.tweens.add({
                            targets: text,
                            alpha: 0,
                            y: y - 50,
                            duration: 1000,
                            delay: 1500,
                            onComplete: () => text.destroy()
                        });
                    }
                });
            }
        });

        this.activeEffects.set(effectId, {
            starBurst,
            ring,
            text,
            cleanup: () => {
                starBurst.destroy();
                if (ring.active) ring.destroy();
                if (text.active) text.destroy();
            }
        });

        return effectId;
    }

    // Power-up activation effect
    createPowerUpEffect(x, y, powerUpType) {
        const effectId = `powerup_${Date.now()}`;
        
        const colors = {
            speed: 0x00ff00,
            shield: 0x00ffff,
            time: 0xffd700,
            score: 0xff69b4
        };

        const color = colors[powerUpType] || 0xffffff;

        // Spiral particles
        const particles = this.scene.add.particles(x, y, 'spark', {
            speed: { min: 50, max: 150 },
            scale: { start: 0.4, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 1000,
            quantity: 20,
            tint: color,
            blendMode: 'ADD',
            emitZone: {
                type: 'edge',
                source: new Phaser.Geom.Circle(0, 0, 30),
                quantity: 20
            }
        });

        // Pulsing aura
        const aura = this.scene.add.circle(x, y, 40, color, 0.3)
            .setBlendMode('ADD');

        this.scene.tweens.add({
            targets: aura,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0,
            duration: 800,
            ease: 'Power2',
            onComplete: () => aura.destroy()
        });

        this.activeEffects.set(effectId, {
            particles,
            aura,
            cleanup: () => {
                particles.destroy();
                if (aura.active) aura.destroy();
            }
        });

        this.scene.time.delayedCall(1500, () => {
            this.cleanupEffect(effectId);
        });

        return effectId;
    }

    // Enhanced UI button with hover and click effects
    createEnhancedButton(x, y, width, height, text, style = {}) {
        const defaultStyle = {
            backgroundColor: 0x4169E1,
            borderColor: 0xffffff,
            textColor: '#ffffff',
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif'
        };

        const finalStyle = { ...defaultStyle, ...style };

        // Button background with rounded corners effect
        const bg = this.scene.add.rectangle(x, y, width, height, finalStyle.backgroundColor)
            .setStrokeStyle(2, finalStyle.borderColor)
            .setOrigin(0.5);
        
        // Use safe interactive setup for button
        bg.setInteractive({ useHandCursor: true });

        // Button text
        const buttonText = this.scene.add.text(x, y, text, {
            fontSize: finalStyle.fontSize,
            fontFamily: finalStyle.fontFamily,
            fill: finalStyle.textColor,
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);

        // Hover effects using Alpha and Scale components
        bg.on('pointerover', () => {
            this.scene.tweens.add({
                targets: [bg, buttonText],
                scaleX: 1.05,
                scaleY: 1.05,
                alpha: 0.9,
                duration: 150,
                ease: 'Power2'
            });
        });

        bg.on('pointerout', () => {
            this.scene.tweens.add({
                targets: [bg, buttonText],
                scaleX: 1,
                scaleY: 1,
                alpha: 1,
                duration: 150,
                ease: 'Power2'
            });
        });

        // Click effect
        bg.on('pointerdown', () => {
            this.scene.tweens.add({
                targets: [bg, buttonText],
                scaleX: 0.95,
                scaleY: 0.95,
                duration: 100,
                yoyo: true,
                ease: 'Power2'
            });

            // Click particles
            const clickParticles = this.scene.add.particles(x, y, 'spark', {
                speed: { min: 20, max: 80 },
                scale: { start: 0.2, end: 0 },
                alpha: { start: 1, end: 0 },
                lifespan: 300,
                quantity: 8,
                tint: finalStyle.borderColor,
                blendMode: 'ADD'
            });

            this.scene.time.delayedCall(500, () => {
                clickParticles.destroy();
            });
        });

        return {
            background: bg,
            text: buttonText,
            destroy: () => {
                bg.destroy();
                buttonText.destroy();
            }
        };
    }

    // Floating damage/score numbers
    createFloatingNumber(x, y, value, color = '#ffffff', prefix = '') {
        const text = this.scene.add.text(x, y, `${prefix}${value}`, {
            fontSize: '24px',
            fontFamily: 'Arial, sans-serif',
            fill: color,
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5)
          .setAlpha(0);

        this.scene.tweens.add({
            targets: text,
            alpha: 1,
            y: y - 50,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 300,
            ease: 'Power2',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: text,
                    alpha: 0,
                    y: y - 80,
                    scaleX: 0.8,
                    scaleY: 0.8,
                    duration: 700,
                    onComplete: () => text.destroy()
                });
            }
        });

        return text;
    }

    // Screen transition effects
    createTransitionEffect(type = 'fade', duration = 1000, color = 0x000000) {
        const overlay = this.scene.add.rectangle(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2,
            this.scene.scale.width,
            this.scene.scale.height,
            color
        ).setDepth(1000);

        switch (type) {
            case 'fade':
                overlay.setAlpha(0);
                this.scene.tweens.add({
                    targets: overlay,
                    alpha: 1,
                    duration: duration / 2,
                    onComplete: () => {
                        this.scene.tweens.add({
                            targets: overlay,
                            alpha: 0,
                            duration: duration / 2,
                            onComplete: () => overlay.destroy()
                        });
                    }
                });
                break;

            case 'wipe':
                overlay.setScale(0, 1);
                this.scene.tweens.add({
                    targets: overlay,
                    scaleX: 1,
                    duration: duration / 2,
                    ease: 'Power2',
                    onComplete: () => {
                        this.scene.tweens.add({
                            targets: overlay,
                            scaleX: 0,
                            duration: duration / 2,
                            ease: 'Power2',
                            onComplete: () => overlay.destroy()
                        });
                    }
                });
                break;

            case 'circle':
                overlay.setScale(0);
                this.scene.tweens.add({
                    targets: overlay,
                    scaleX: 3,
                    scaleY: 3,
                    duration: duration / 2,
                    ease: 'Power2',
                    onComplete: () => {
                        this.scene.tweens.add({
                            targets: overlay,
                            scaleX: 0,
                            scaleY: 0,
                            duration: duration / 2,
                            ease: 'Power2',
                            onComplete: () => overlay.destroy()
                        });
                    }
                });
                break;
        }

        return overlay;
    }

    // Cleanup methods
    cleanupEffect(effectId) {
        const effect = this.activeEffects.get(effectId);
        if (effect && effect.cleanup) {
            effect.cleanup();
            this.activeEffects.delete(effectId);
        }
    }

    cleanupAllEffects() {
        this.activeEffects.forEach((effect, id) => {
            this.cleanupEffect(id);
        });
        this.particleSystems.forEach(system => {
            system.destroy();
        });
        this.particleSystems.clear();
    }

    destroy() {
        this.cleanupAllEffects();
    }
} 