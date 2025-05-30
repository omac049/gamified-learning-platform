import { GameObjects, Physics } from "phaser";
import { Bullet } from "./Bullet.js";

export class EnhancedPlayer extends Physics.Arcade.Sprite {
    constructor(scene, x, y, texture = 'player') {
        super(scene, x, y, texture);
        
        this.scene = scene;
        this.scene.add.existing(this);
        this.scene.physics.add.existing(this);
        
        // Player states and properties
        this.state = "waiting";
        this.health = 100;
        this.maxHealth = 100;
        this.energy = 100;
        this.maxEnergy = 100;
        this.isInvulnerable = false;
        this.powerUps = new Map();
        
        // Visual effects and components
        this.setupVisualComponents();
        this.setupAnimations();
        this.setupParticleEffects();
        this.setupAudioEffects();
        
        // Bullets group
        this.bullets = this.scene.physics.add.group({
            classType: Bullet,
            maxSize: 50,
            runChildUpdate: true
        });
        
        // Input handling
        this.setupInputHandling();
        
        // Initialize FX pipeline if available
        this.setupFXPipeline();
    }

    setupVisualComponents() {
        // Set initial transform properties
        this.setOrigin(0.5, 0.5);
        this.setScale(1);
        this.setAlpha(1);
        this.setTint(0xffffff);
        this.setBlendMode('NORMAL');
        
        // Set depth for proper layering
        this.setDepth(100);
        
        // Enable interactive features with proper options
        this.setInteractive({ useHandCursor: true });
        
        // Create visual enhancement elements
        this.createAura();
        this.createHealthBar();
        this.createEnergyBar();
        this.createShieldEffect();
    }

    createAura() {
        // Character aura effect using Graphics and Alpha components
        this.aura = this.scene.add.graphics()
            .setDepth(this.depth - 1)
            .setAlpha(0.3)
            .setBlendMode('ADD');
        
        // Animated aura that pulses
        this.auraAnimation = this.scene.tweens.add({
            targets: this.aura,
            alpha: 0.1,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        this.updateAura();
    }

    updateAura() {
        if (!this.aura || !this.aura.active) return;
        
        this.aura.clear();
        
        // Determine aura color based on player state
        let auraColor = 0x4169E1; // Default blue
        
        if (this.isInvulnerable) {
            auraColor = 0x00ffff; // Cyan for invulnerability
        } else if (this.health < 30) {
            auraColor = 0xff0000; // Red for low health
        } else if (this.powerUps.size > 0) {
            auraColor = 0xffd700; // Gold for power-ups
        }
        
        // Draw aura circle
        this.aura.fillStyle(auraColor, 0.3);
        this.aura.fillCircle(this.x, this.y, 40);
        
        // Add outer ring
        this.aura.lineStyle(2, auraColor, 0.6);
        this.aura.strokeCircle(this.x, this.y, 35);
    }

    createHealthBar() {
        // Health bar above player using Rectangle components
        this.healthBarBg = this.scene.add.rectangle(this.x, this.y - 50, 60, 8, 0x8B0000)
            .setDepth(this.depth + 1)
            .setAlpha(0.8);
        
        this.healthBarFill = this.scene.add.rectangle(this.x - 30, this.y - 50, 60, 6, 0x32CD32)
            .setOrigin(0, 0.5)
            .setDepth(this.depth + 2);
        
        // Health bar border
        this.healthBarBorder = this.scene.add.rectangle(this.x, this.y - 50, 62, 10, 0x000000, 0)
            .setStrokeStyle(1, 0xffffff, 0.8)
            .setDepth(this.depth + 3);
    }

    createEnergyBar() {
        // Energy bar below health bar
        this.energyBarBg = this.scene.add.rectangle(this.x, this.y - 40, 60, 6, 0x000080)
            .setDepth(this.depth + 1)
            .setAlpha(0.8);
        
        this.energyBarFill = this.scene.add.rectangle(this.x - 30, this.y - 40, 60, 4, 0x00ffff)
            .setOrigin(0, 0.5)
            .setDepth(this.depth + 2);
        
        this.energyBarBorder = this.scene.add.rectangle(this.x, this.y - 40, 62, 8, 0x000000, 0)
            .setStrokeStyle(1, 0xffffff, 0.6)
            .setDepth(this.depth + 3);
    }

    createShieldEffect() {
        // Shield effect using Circle component with special FX
        this.shieldEffect = this.scene.add.circle(this.x, this.y, 45, 0x00ffff, 0)
            .setStrokeStyle(3, 0x00ffff, 0.8)
            .setDepth(this.depth + 1)
            .setBlendMode('ADD')
            .setVisible(false);
        
        // Shield animation
        this.shieldAnimation = this.scene.tweens.add({
            targets: this.shieldEffect,
            alpha: 0.3,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 800,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut',
            paused: true
        });
    }

    setupAnimations() {
        // Create sprite animations if texture supports it
        if (this.scene.anims.exists('player-idle')) return;
        
        // Idle animation with subtle movement
        this.idleAnimation = this.scene.tweens.add({
            targets: this,
            y: this.y + 2,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Rotation animation for special states
        this.rotationTween = null;
    }

    setupParticleEffects() {
        // Create particle textures if they don't exist
        if (!this.scene.textures.exists('player-particle')) {
            this.scene.add.graphics()
                .fillStyle(0xffffff)
                .fillCircle(2, 2, 2)
                .generateTexture('player-particle', 4, 4)
                .destroy();
        }
        
        // Trail particles for movement
        this.trailParticles = this.scene.add.particles(this.x, this.y, 'player-particle', {
            speed: { min: 10, max: 30 },
            scale: { start: 0.3, end: 0 },
            alpha: { start: 0.8, end: 0 },
            lifespan: 300,
            frequency: 100,
            blendMode: 'ADD',
            follow: this,
            followOffset: { x: 0, y: 10 }
        });
        
        this.trailParticles.stop(); // Start stopped
    }

    setupAudioEffects() {
        // Audio effect properties (sounds would be loaded in preloader)
        this.audioEffects = {
            move: 'player-move',
            shoot: 'player-shoot',
            hit: 'player-hit',
            powerup: 'player-powerup',
            levelup: 'player-levelup'
        };
    }

    setupInputHandling() {
        // Enhanced input handling with visual feedback
        this.on('pointerover', () => {
            this.setTint(0xcccccc);
            this.setScale(1.05);
        });
        
        this.on('pointerout', () => {
            this.setTint(0xffffff);
            this.setScale(1);
        });
        
        this.on('pointerdown', () => {
            this.createClickEffect();
        });
    }

    setupFXPipeline() {
        // Add FX pipeline effects if supported
        try {
            // Glow effect
            this.glowFX = this.preFX?.addGlow(0x00ffff, 0, 0, false, 0.1, 10);
            
            // Shadow effect
            this.shadowFX = this.postFX?.addShadow(2, 2, 0.1, 0.8, 0x000000, 6, 1);
            
            // Barrel distortion for special effects
            this.barrelFX = this.postFX?.addBarrel(0.1);
            if (this.barrelFX) this.barrelFX.active = false;
            
        } catch (error) {
            console.log('FX Pipeline not available in this Phaser version');
        }
    }

    // Enhanced movement with visual effects
    move(direction, speed = 5) {
        if (this.state !== "can_move") return;
        
        const oldX = this.x;
        const oldY = this.y;
        
        // Apply movement with bounds checking
        switch (direction) {
            case "up":
                if (this.y - speed > 50) {
                    this.y -= speed;
                }
                break;
            case "down":
                if (this.y + speed < this.scene.scale.height - 50) {
                    this.y += speed;
                }
                break;
            case "left":
                if (this.x - speed > 50) {
                    this.x -= speed;
                }
                break;
            case "right":
                if (this.x + speed < this.scene.scale.width - 50) {
                    this.x += speed;
                }
                break;
        }
        
        // Visual effects for movement
        if (oldX !== this.x || oldY !== this.y) {
            this.onMove();
            this.playAudioEffect('move');
        }
        
        this.updateVisualElements();
    }

    onMove() {
        // Start trail particles
        if (this.trailParticles && !this.trailParticles.emitting) {
            this.trailParticles.start();
        }
        
        // Slight rotation based on movement
        if (this.rotationTween) {
            this.rotationTween.stop();
        }
        
        this.rotationTween = this.scene.tweens.add({
            targets: this,
            rotation: this.rotation + 0.1,
            duration: 200,
            yoyo: true,
            ease: 'Power2'
        });
        
        // Energy consumption
        this.consumeEnergy(1);
    }

    // Enhanced shooting with visual effects
    fire(targetX, targetY) {
        if (this.state !== "can_move" || this.energy < 10) return false;
        
        // Get bullet from pool
        const bullet = this.bullets.get();
        if (!bullet) return false;
        
        // Fire bullet with enhanced effects
        bullet.fire(this.x, this.y, targetX, targetY);
        
        // Visual effects for shooting
        this.createMuzzleFlash();
        this.consumeEnergy(10);
        this.playAudioEffect('shoot');
        
        // Recoil effect
        this.scene.tweens.add({
            targets: this,
            scaleX: 0.9,
            scaleY: 1.1,
            duration: 100,
            yoyo: true,
            ease: 'Power2'
        });
        
        return true;
    }

    createMuzzleFlash() {
        // Muzzle flash effect
        const flash = this.scene.add.circle(this.x + 20, this.y, 15, 0xffffff, 0.8)
            .setBlendMode('ADD')
            .setDepth(this.depth + 1);
        
        this.scene.tweens.add({
            targets: flash,
            scaleX: 2,
            scaleY: 2,
            alpha: 0,
            duration: 150,
            ease: 'Power2',
            onComplete: () => flash.destroy()
        });
        
        // Muzzle particles
        const muzzleParticles = this.scene.add.particles(this.x + 20, this.y, 'player-particle', {
            speed: { min: 50, max: 100 },
            scale: { start: 0.4, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 200,
            quantity: 8,
            tint: 0xffffff,
            blendMode: 'ADD'
        });
        
        this.scene.time.delayedCall(300, () => {
            muzzleParticles.destroy();
        });
    }

    createClickEffect() {
        // Click effect with particles
        const clickParticles = this.scene.add.particles(this.x, this.y, 'player-particle', {
            speed: { min: 20, max: 60 },
            scale: { start: 0.3, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 400,
            quantity: 12,
            tint: 0x00ffff,
            blendMode: 'ADD'
        });
        
        this.scene.time.delayedCall(500, () => {
            clickParticles.destroy();
        });
    }

    // Health and energy management with visual feedback
    takeDamage(amount) {
        if (this.isInvulnerable) return false;
        
        this.health = Math.max(0, this.health - amount);
        this.updateHealthBar();
        
        // Damage visual effects
        this.createDamageEffect();
        this.playAudioEffect('hit');
        
        // Invulnerability frames
        this.setInvulnerable(1000);
        
        // Check for death
        if (this.health <= 0) {
            this.onDeath();
        }
        
        return true;
    }

    heal(amount) {
        this.health = Math.min(this.maxHealth, this.health + amount);
        this.updateHealthBar();
        
        // Healing visual effect
        this.createHealingEffect();
    }

    consumeEnergy(amount) {
        this.energy = Math.max(0, this.energy - amount);
        this.updateEnergyBar();
    }

    restoreEnergy(amount) {
        this.energy = Math.min(this.maxEnergy, this.energy + amount);
        this.updateEnergyBar();
    }

    setInvulnerable(duration) {
        this.isInvulnerable = true;
        
        // Visual feedback for invulnerability
        this.setAlpha(0.7);
        this.setTint(0x00ffff);
        
        // Flashing effect
        const flashTween = this.scene.tweens.add({
            targets: this,
            alpha: 0.3,
            duration: 100,
            yoyo: true,
            repeat: duration / 200,
            ease: 'Power2'
        });
        
        this.scene.time.delayedCall(duration, () => {
            this.isInvulnerable = false;
            this.setAlpha(1);
            this.setTint(0xffffff);
            flashTween.stop();
        });
        
        this.updateAura();
    }

    createDamageEffect() {
        // Screen shake
        this.scene.cameras.main.shake(200, 0.01);
        
        // Red flash
        const damageFlash = this.scene.add.rectangle(
            this.scene.scale.width / 2,
            this.scene.scale.height / 2,
            this.scene.scale.width,
            this.scene.scale.height,
            0xff0000,
            0.3
        ).setDepth(1000);
        
        this.scene.tweens.add({
            targets: damageFlash,
            alpha: 0,
            duration: 200,
            onComplete: () => damageFlash.destroy()
        });
        
        // Damage particles
        const damageParticles = this.scene.add.particles(this.x, this.y, 'player-particle', {
            speed: { min: 30, max: 80 },
            scale: { start: 0.4, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 500,
            quantity: 15,
            tint: 0xff0000,
            blendMode: 'ADD'
        });
        
        this.scene.time.delayedCall(600, () => {
            damageParticles.destroy();
        });
    }

    createHealingEffect() {
        // Healing particles
        const healParticles = this.scene.add.particles(this.x, this.y - 20, 'player-particle', {
            speed: { min: 10, max: 40 },
            scale: { start: 0.3, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 800,
            quantity: 20,
            tint: 0x00ff00,
            blendMode: 'ADD',
            gravityY: -50
        });
        
        this.scene.time.delayedCall(1000, () => {
            healParticles.destroy();
        });
        
        // Green glow effect
        const healGlow = this.scene.add.circle(this.x, this.y, 50, 0x00ff00, 0.3)
            .setBlendMode('ADD')
            .setDepth(this.depth - 1);
        
        this.scene.tweens.add({
            targets: healGlow,
            scaleX: 1.5,
            scaleY: 1.5,
            alpha: 0,
            duration: 600,
            ease: 'Power2',
            onComplete: () => healGlow.destroy()
        });
    }

    // Power-up system with visual effects
    addPowerUp(powerUpType, duration = 10000) {
        this.powerUps.set(powerUpType, {
            startTime: Date.now(),
            duration: duration
        });
        
        this.applyPowerUpEffects(powerUpType);
        this.createPowerUpEffect(powerUpType);
        this.playAudioEffect('powerup');
        this.updateAura();
    }

    applyPowerUpEffects(powerUpType) {
        switch (powerUpType) {
            case 'speed':
                this.setTint(0x00ff00);
                if (this.glowFX) this.glowFX.color = 0x00ff00;
                break;
            case 'shield':
                this.activateShield();
                break;
            case 'energy':
                this.setTint(0x00ffff);
                if (this.glowFX) this.glowFX.color = 0x00ffff;
                break;
            case 'damage':
                this.setTint(0xff6600);
                if (this.glowFX) this.glowFX.color = 0xff6600;
                break;
        }
    }

    createPowerUpEffect(powerUpType) {
        const colors = {
            speed: 0x00ff00,
            shield: 0x00ffff,
            energy: 0x0066ff,
            damage: 0xff6600
        };
        
        const color = colors[powerUpType] || 0xffffff;
        
        // Power-up aura
        const powerUpAura = this.scene.add.circle(this.x, this.y, 60, color, 0.2)
            .setBlendMode('ADD')
            .setDepth(this.depth - 1);
        
        const auraTween = this.scene.tweens.add({
            targets: powerUpAura,
            scaleX: 1.3,
            scaleY: 1.3,
            alpha: 0.1,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Store for cleanup
        this.powerUps.get(powerUpType).aura = powerUpAura;
        this.powerUps.get(powerUpType).auraTween = auraTween;
    }

    activateShield() {
        this.shieldEffect.setVisible(true);
        this.shieldAnimation.resume();
        this.isShielded = true;
    }

    deactivateShield() {
        this.shieldEffect.setVisible(false);
        this.shieldAnimation.pause();
        this.isShielded = false;
    }

    // Level up with spectacular effects
    levelUp(newLevel) {
        this.playAudioEffect('levelup');
        
        // Level up particles burst
        const levelUpParticles = this.scene.add.particles(this.x, this.y, 'player-particle', {
            speed: { min: 100, max: 200 },
            scale: { start: 0.6, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 1000,
            quantity: 50,
            tint: [0xffd700, 0xff69b4, 0x00ffff],
            blendMode: 'ADD'
        });
        
        // Level up text
        const levelText = this.scene.add.text(this.x, this.y - 80, `LEVEL ${newLevel}!`, {
            fontSize: '32px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffd700',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5)
          .setDepth(this.depth + 10)
          .setAlpha(0);
        
        this.scene.tweens.add({
            targets: levelText,
            alpha: 1,
            y: this.y - 120,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 800,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.scene.tweens.add({
                    targets: levelText,
                    alpha: 0,
                    duration: 1000,
                    delay: 1500,
                    onComplete: () => levelText.destroy()
                });
            }
        });
        
        this.scene.time.delayedCall(1500, () => {
            levelUpParticles.destroy();
        });
        
        // Temporary size increase
        this.scene.tweens.add({
            targets: this,
            scaleX: 1.3,
            scaleY: 1.3,
            duration: 300,
            yoyo: true,
            ease: 'Power2'
        });
    }

    // Update visual elements positions
    updateVisualElements() {
        if (this.aura && this.aura.active) {
            this.updateAura();
        }
        
        if (this.healthBarBg && this.healthBarBg.active) {
            this.healthBarBg.setPosition(this.x, this.y - 50);
            this.healthBarFill.setPosition(this.x - 30, this.y - 50);
            this.healthBarBorder.setPosition(this.x, this.y - 50);
        }
        
        if (this.energyBarBg && this.energyBarBg.active) {
            this.energyBarBg.setPosition(this.x, this.y - 40);
            this.energyBarFill.setPosition(this.x - 30, this.y - 40);
            this.energyBarBorder.setPosition(this.x, this.y - 40);
        }
        
        if (this.shieldEffect && this.shieldEffect.active) {
            this.shieldEffect.setPosition(this.x, this.y);
        }
    }

    updateHealthBar() {
        if (!this.healthBarFill || !this.healthBarFill.active) return;
        
        const healthPercent = this.health / this.maxHealth;
        this.healthBarFill.setScale(healthPercent, 1);
        
        // Color based on health
        if (healthPercent > 0.6) {
            this.healthBarFill.setFillStyle(0x32CD32); // Green
        } else if (healthPercent > 0.3) {
            this.healthBarFill.setFillStyle(0xffd700); // Yellow
        } else {
            this.healthBarFill.setFillStyle(0xff0000); // Red
        }
    }

    updateEnergyBar() {
        if (!this.energyBarFill || !this.energyBarFill.active) return;
        
        const energyPercent = this.energy / this.maxEnergy;
        this.energyBarFill.setScale(energyPercent, 1);
    }

    playAudioEffect(effectName) {
        const soundKey = this.audioEffects[effectName];
        if (soundKey && this.scene.sound.get(soundKey)) {
            this.scene.sound.play(soundKey, { volume: 0.3 });
        }
    }

    onDeath() {
        this.state = "dead";
        
        // Death animation
        this.scene.tweens.add({
            targets: this,
            alpha: 0,
            scaleX: 0.5,
            scaleY: 0.5,
            rotation: Math.PI * 2,
            duration: 1000,
            ease: 'Power2'
        });
        
        // Death particles
        const deathParticles = this.scene.add.particles(this.x, this.y, 'player-particle', {
            speed: { min: 50, max: 150 },
            scale: { start: 0.5, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 1500,
            quantity: 30,
            tint: 0xff0000,
            blendMode: 'ADD'
        });
        
        this.scene.time.delayedCall(2000, () => {
            deathParticles.destroy();
        });
    }

    // Update method called every frame
    update(time, delta) {
        // Update power-ups
        this.updatePowerUps();
        
        // Regenerate energy slowly
        if (this.energy < this.maxEnergy) {
            this.restoreEnergy(0.1);
        }
        
        // Update visual elements
        this.updateVisualElements();
        
        // Subtle idle animation
        if (this.state === "can_move") {
            this.y += Math.sin(time / 1000) * 0.5;
        }
    }

    updatePowerUps() {
        const currentTime = Date.now();
        
        this.powerUps.forEach((powerUp, type) => {
            if (currentTime - powerUp.startTime > powerUp.duration) {
                this.removePowerUp(type);
            }
        });
    }

    removePowerUp(powerUpType) {
        const powerUp = this.powerUps.get(powerUpType);
        if (!powerUp) return;
        
        // Clean up visual effects
        if (powerUp.aura && powerUp.aura.active) {
            powerUp.auraTween.stop();
            powerUp.aura.destroy();
        }
        
        // Remove power-up effects
        switch (powerUpType) {
            case 'shield':
                this.deactivateShield();
                break;
        }
        
        // Reset visual effects
        this.setTint(0xffffff);
        if (this.glowFX) this.glowFX.color = 0x00ffff;
        
        this.powerUps.delete(powerUpType);
        this.updateAura();
    }

    // Start the player (entrance animation)
    start() {
        this.state = "start";
        
        // Entrance effect
        this.setAlpha(0);
        this.setScale(0.5);
        
        this.scene.tweens.add({
            targets: this,
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            duration: 1000,
            ease: 'Back.easeOut',
            onComplete: () => {
                this.state = "can_move";
                this.trailParticles.start();
            }
        });
        
        // Entrance particles
        const entranceParticles = this.scene.add.particles(this.x, this.y, 'player-particle', {
            speed: { min: 50, max: 100 },
            scale: { start: 0.4, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 800,
            quantity: 25,
            tint: 0x00ffff,
            blendMode: 'ADD'
        });
        
        this.scene.time.delayedCall(1000, () => {
            entranceParticles.destroy();
        });
    }

    // Cleanup method
    destroy() {
        // Clean up all visual effects
        if (this.aura && this.aura.active) {
            this.auraAnimation.stop();
            this.aura.destroy();
        }
        
        if (this.trailParticles && this.trailParticles.active) {
            this.trailParticles.destroy();
        }
        
        if (this.healthBarBg && this.healthBarBg.active) {
            this.healthBarBg.destroy();
            this.healthBarFill.destroy();
            this.healthBarBorder.destroy();
        }
        
        if (this.energyBarBg && this.energyBarBg.active) {
            this.energyBarBg.destroy();
            this.energyBarFill.destroy();
            this.energyBarBorder.destroy();
        }
        
        if (this.shieldEffect && this.shieldEffect.active) {
            this.shieldAnimation.stop();
            this.shieldEffect.destroy();
        }
        
        // Clean up power-ups
        this.powerUps.forEach((powerUp, type) => {
            this.removePowerUp(type);
        });
        
        // Clean up bullets
        if (this.bullets) {
            this.bullets.destroy();
        }
        
        super.destroy();
    }
} 