/**
 * AdvancedParticleManager - High-performance particle system for Phaser 3
 * Provides multiple particle effects with object pooling and optimization
 */
export class AdvancedParticleManager {
    constructor(scene, objectPoolManager) {
        this.scene = scene;
        this.objectPoolManager = objectPoolManager;
        this.activeEmitters = new Map();
        this.particleConfigs = new Map();
        this.maxParticles = 500; // Global particle limit
        this.currentParticleCount = 0;
        
        this.initializeParticleConfigs();
        this.setupParticlePools();
    }

    initializeParticleConfigs() {
        // Explosion effects
        this.particleConfigs.set('explosion', {
            count: 20,
            speed: { min: 100, max: 300 },
            scale: { start: 1, end: 0 },
            alpha: { start: 1, end: 0 },
            lifespan: 800,
            colors: [0xff4444, 0xff8800, 0xffaa00],
            blendMode: 'ADD'
        });

        // Energy burst
        this.particleConfigs.set('energyBurst', {
            count: 15,
            speed: { min: 50, max: 200 },
            scale: { start: 0.5, end: 1.5 },
            alpha: { start: 1, end: 0 },
            lifespan: 1000,
            colors: [0x00ffff, 0x0088ff, 0x4444ff],
            blendMode: 'ADD'
        });

        // Healing effect
        this.particleConfigs.set('heal', {
            count: 10,
            speed: { min: 20, max: 80 },
            scale: { start: 0.3, end: 0.8 },
            alpha: { start: 0.8, end: 0 },
            lifespan: 1500,
            colors: [0x00ff00, 0x44ff44, 0x88ff88],
            blendMode: 'NORMAL',
            gravity: -50
        });

        // Damage sparks
        this.particleConfigs.set('sparks', {
            count: 8,
            speed: { min: 80, max: 150 },
            scale: { start: 0.2, end: 0.1 },
            alpha: { start: 1, end: 0 },
            lifespan: 600,
            colors: [0xffff00, 0xff8800, 0xff4400],
            blendMode: 'ADD'
        });

        // Shield effect
        this.particleConfigs.set('shield', {
            count: 12,
            speed: { min: 30, max: 100 },
            scale: { start: 0.4, end: 0.8 },
            alpha: { start: 0.6, end: 0 },
            lifespan: 1200,
            colors: [0x4444ff, 0x6666ff, 0x8888ff],
            blendMode: 'ADD',
            circular: true
        });

        // Laser trail
        this.particleConfigs.set('laserTrail', {
            count: 5,
            speed: { min: 10, max: 30 },
            scale: { start: 0.8, end: 0.2 },
            alpha: { start: 0.8, end: 0 },
            lifespan: 400,
            colors: [0x00ff88, 0x44ffaa, 0x88ffcc],
            blendMode: 'ADD'
        });

        // Power-up collection
        this.particleConfigs.set('powerUp', {
            count: 15,
            speed: { min: 40, max: 120 },
            scale: { start: 0.6, end: 1.2 },
            alpha: { start: 1, end: 0 },
            lifespan: 1000,
            colors: [0xffff00, 0xff8800, 0xff4400],
            blendMode: 'ADD',
            spiral: true
        });
    }

    setupParticlePools() {
        // Create pools for different particle types
        this.objectPoolManager.createPool('explosionParticles', ParticleSprite, 100);
        this.objectPoolManager.createPool('energyParticles', ParticleSprite, 80);
        this.objectPoolManager.createPool('healParticles', ParticleSprite, 50);
        this.objectPoolManager.createPool('sparkParticles', ParticleSprite, 60);
        this.objectPoolManager.createPool('shieldParticles', ParticleSprite, 70);
        this.objectPoolManager.createPool('trailParticles', ParticleSprite, 40);
        this.objectPoolManager.createPool('powerUpParticles', ParticleSprite, 90);
    }

    /**
     * Create explosion effect
     */
    createExplosion(x, y, intensity = 1) {
        if (this.currentParticleCount >= this.maxParticles) return;
        
        const config = this.particleConfigs.get('explosion');
        const particleCount = Math.min(config.count * intensity, 30);
        
        for (let i = 0; i < particleCount; i++) {
            const particle = this.objectPoolManager.spawn('explosionParticles');
            if (!particle) continue;
            
            const angle = (Math.PI * 2 * i) / particleCount;
            const speed = Phaser.Math.Between(config.speed.min, config.speed.max) * intensity;
            const color = Phaser.Utils.Array.GetRandom(config.colors);
            
            particle.initialize(x, y, {
                velocityX: Math.cos(angle) * speed,
                velocityY: Math.sin(angle) * speed,
                scale: config.scale.start * intensity,
                alpha: config.alpha.start,
                maxLife: config.lifespan,
                color: color,
                blendMode: config.blendMode
            });
            
            this.currentParticleCount++;
        }
        
        // Add screen shake for large explosions
        if (intensity > 1.5) {
            this.scene.cameras.main.shake(200, 0.01 * intensity);
        }
    }

    /**
     * Create energy burst effect
     */
    createEnergyBurst(x, y, color = 0x00ffff) {
        if (this.currentParticleCount >= this.maxParticles) return;
        
        const config = this.particleConfigs.get('energyBurst');
        
        for (let i = 0; i < config.count; i++) {
            const particle = this.objectPoolManager.spawn('energyParticles');
            if (!particle) continue;
            
            const angle = Math.random() * Math.PI * 2;
            const speed = Phaser.Math.Between(config.speed.min, config.speed.max);
            
            particle.initialize(x, y, {
                velocityX: Math.cos(angle) * speed,
                velocityY: Math.sin(angle) * speed,
                scale: config.scale.start,
                alpha: config.alpha.start,
                maxLife: config.lifespan,
                color: color,
                blendMode: config.blendMode,
                pulsate: true
            });
            
            this.currentParticleCount++;
        }
    }

    /**
     * Create healing effect
     */
    createHealEffect(x, y) {
        if (this.currentParticleCount >= this.maxParticles) return;
        
        const config = this.particleConfigs.get('heal');
        
        for (let i = 0; i < config.count; i++) {
            const particle = this.objectPoolManager.spawn('healParticles');
            if (!particle) continue;
            
            const offsetX = (Math.random() - 0.5) * 40;
            const offsetY = (Math.random() - 0.5) * 40;
            const color = Phaser.Utils.Array.GetRandom(config.colors);
            
            particle.initialize(x + offsetX, y + offsetY, {
                velocityX: (Math.random() - 0.5) * 60,
                velocityY: -Math.random() * 80 - 20,
                scale: config.scale.start,
                alpha: config.alpha.start,
                maxLife: config.lifespan,
                color: color,
                blendMode: config.blendMode,
                gravity: config.gravity || 0,
                float: true
            });
            
            this.currentParticleCount++;
        }
    }

    /**
     * Create damage sparks
     */
    createDamageSparks(x, y, direction = 0) {
        if (this.currentParticleCount >= this.maxParticles) return;
        
        const config = this.particleConfigs.get('sparks');
        
        for (let i = 0; i < config.count; i++) {
            const particle = this.objectPoolManager.spawn('sparkParticles');
            if (!particle) continue;
            
            const spread = Math.PI / 3; // 60 degree spread
            const angle = direction + (Math.random() - 0.5) * spread;
            const speed = Phaser.Math.Between(config.speed.min, config.speed.max);
            const color = Phaser.Utils.Array.GetRandom(config.colors);
            
            particle.initialize(x, y, {
                velocityX: Math.cos(angle) * speed,
                velocityY: Math.sin(angle) * speed,
                scale: config.scale.start,
                alpha: config.alpha.start,
                maxLife: config.lifespan,
                color: color,
                blendMode: config.blendMode,
                gravity: 200
            });
            
            this.currentParticleCount++;
        }
    }

    /**
     * Create shield effect
     */
    createShieldEffect(x, y, radius = 50) {
        if (this.currentParticleCount >= this.maxParticles) return;
        
        const config = this.particleConfigs.get('shield');
        
        for (let i = 0; i < config.count; i++) {
            const particle = this.objectPoolManager.spawn('shieldParticles');
            if (!particle) continue;
            
            const angle = (Math.PI * 2 * i) / config.count;
            const startRadius = radius * 0.8;
            const endRadius = radius * 1.2;
            const color = Phaser.Utils.Array.GetRandom(config.colors);
            
            particle.initialize(
                x + Math.cos(angle) * startRadius,
                y + Math.sin(angle) * startRadius,
                {
                    velocityX: Math.cos(angle) * 20,
                    velocityY: Math.sin(angle) * 20,
                    scale: config.scale.start,
                    alpha: config.alpha.start,
                    maxLife: config.lifespan,
                    color: color,
                    blendMode: config.blendMode,
                    orbital: { centerX: x, centerY: y, radius: startRadius, speed: 0.02 }
                }
            );
            
            this.currentParticleCount++;
        }
    }

    /**
     * Create laser trail effect
     */
    createLaserTrail(startX, startY, endX, endY) {
        if (this.currentParticleCount >= this.maxParticles) return;
        
        const config = this.particleConfigs.get('laserTrail');
        const distance = Phaser.Math.Distance.Between(startX, startY, endX, endY);
        const steps = Math.min(config.count, Math.floor(distance / 10));
        
        for (let i = 0; i < steps; i++) {
            const particle = this.objectPoolManager.spawn('trailParticles');
            if (!particle) continue;
            
            const t = i / steps;
            const x = startX + (endX - startX) * t;
            const y = startY + (endY - startY) * t;
            const color = Phaser.Utils.Array.GetRandom(config.colors);
            
            particle.initialize(x, y, {
                velocityX: (Math.random() - 0.5) * 40,
                velocityY: (Math.random() - 0.5) * 40,
                scale: config.scale.start,
                alpha: config.alpha.start,
                maxLife: config.lifespan,
                color: color,
                blendMode: config.blendMode,
                delay: i * 50
            });
            
            this.currentParticleCount++;
        }
    }

    /**
     * Create power-up collection effect
     */
    createPowerUpEffect(x, y, powerType = 'generic') {
        if (this.currentParticleCount >= this.maxParticles) return;
        
        const config = this.particleConfigs.get('powerUp');
        
        for (let i = 0; i < config.count; i++) {
            const particle = this.objectPoolManager.spawn('powerUpParticles');
            if (!particle) continue;
            
            const angle = (Math.PI * 2 * i) / config.count;
            const radius = 30 + Math.sin(i * 0.5) * 20;
            const color = Phaser.Utils.Array.GetRandom(config.colors);
            
            particle.initialize(x, y, {
                velocityX: Math.cos(angle) * 60,
                velocityY: Math.sin(angle) * 60,
                scale: config.scale.start,
                alpha: config.alpha.start,
                maxLife: config.lifespan,
                color: color,
                blendMode: config.blendMode,
                spiral: { centerX: x, centerY: y, radius: radius, speed: 0.05 }
            });
            
            this.currentParticleCount++;
        }
    }

    /**
     * Create continuous emitter for ongoing effects
     */
    createContinuousEmitter(x, y, effectType, duration = 2000) {
        const emitterId = `${effectType}_${Date.now()}`;
        
        const emitter = {
            x, y, effectType, duration,
            startTime: Date.now(),
            interval: 100,
            lastEmit: 0
        };
        
        this.activeEmitters.set(emitterId, emitter);
        
        // Auto-cleanup after duration
        this.scene.time.delayedCall(duration, () => {
            this.stopEmitter(emitterId);
        });
        
        return emitterId;
    }

    /**
     * Stop continuous emitter
     */
    stopEmitter(emitterId) {
        this.activeEmitters.delete(emitterId);
    }

    /**
     * Update continuous emitters
     */
    update(time, delta) {
        this.activeEmitters.forEach((emitter, id) => {
            if (time - emitter.lastEmit >= emitter.interval) {
                this.emitFromContinuous(emitter);
                emitter.lastEmit = time;
            }
        });
        
        // Update particle count
        this.updateParticleCount();
    }

    /**
     * Emit particles from continuous emitter
     */
    emitFromContinuous(emitter) {
        switch (emitter.effectType) {
            case 'engine':
                this.createEngineTrail(emitter.x, emitter.y);
                break;
            case 'energy':
                this.createEnergyBurst(emitter.x, emitter.y);
                break;
            case 'damage':
                this.createDamageSparks(emitter.x, emitter.y);
                break;
        }
    }

    /**
     * Create engine trail effect
     */
    createEngineTrail(x, y) {
        if (this.currentParticleCount >= this.maxParticles) return;
        
        for (let i = 0; i < 3; i++) {
            const particle = this.objectPoolManager.spawn('trailParticles');
            if (!particle) continue;
            
            particle.initialize(x, y, {
                velocityX: (Math.random() - 0.5) * 20,
                velocityY: Math.random() * 50 + 30,
                scale: 0.3,
                alpha: 0.6,
                maxLife: 800,
                color: 0x4488ff,
                blendMode: 'ADD'
            });
            
            this.currentParticleCount++;
        }
    }

    /**
     * Update particle count
     */
    updateParticleCount() {
        let count = 0;
        ['explosionParticles', 'energyParticles', 'healParticles', 'sparkParticles', 
         'shieldParticles', 'trailParticles', 'powerUpParticles'].forEach(poolName => {
            const stats = this.objectPoolManager.getPoolStats(poolName);
            if (stats) count += stats.currentActive;
        });
        
        this.currentParticleCount = count;
    }

    /**
     * Clear all particles
     */
    clearAllParticles() {
        ['explosionParticles', 'energyParticles', 'healParticles', 'sparkParticles', 
         'shieldParticles', 'trailParticles', 'powerUpParticles'].forEach(poolName => {
            this.objectPoolManager.releaseAll(poolName);
        });
        
        this.activeEmitters.clear();
        this.currentParticleCount = 0;
    }

    /**
     * Get particle system statistics
     */
    getStats() {
        return {
            activeParticles: this.currentParticleCount,
            maxParticles: this.maxParticles,
            activeEmitters: this.activeEmitters.size,
            utilizationPercent: (this.currentParticleCount / this.maxParticles) * 100
        };
    }
}

/**
 * Enhanced Particle Sprite Class
 */
class ParticleSprite extends Phaser.GameObjects.Graphics {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.scene = scene;
        this.velocity = { x: 0, y: 0 };
        this.life = 0;
        this.maxLife = 1000;
        this.startAlpha = 1;
        this.startScale = 1;
        this.color = 0xffffff;
        this.gravity = 0;
        this.delay = 0;
        this.effects = {};
    }

    initialize(x, y, config = {}) {
        this.setPosition(x, y);
        this.velocity.x = config.velocityX || 0;
        this.velocity.y = config.velocityY || 0;
        this.life = 0;
        this.maxLife = config.maxLife || 1000;
        this.startAlpha = config.alpha || 1;
        this.startScale = config.scale || 1;
        this.color = config.color || 0xffffff;
        this.gravity = config.gravity || 0;
        this.delay = config.delay || 0;
        
        // Special effects
        this.effects = {
            pulsate: config.pulsate || false,
            float: config.float || false,
            orbital: config.orbital || null,
            spiral: config.spiral || null
        };
        
        this.setAlpha(this.startAlpha);
        this.setScale(this.startScale);
        this.setBlendMode(config.blendMode || 'NORMAL');
        
        // Create particle visual
        this.clear();
        this.fillStyle(this.color);
        this.fillCircle(0, 0, config.size || 2);
    }

    update(time, delta) {
        if (!this.active) return;
        
        // Handle delay
        if (this.delay > 0) {
            this.delay -= delta;
            return;
        }
        
        this.life += delta;
        const lifePercent = this.life / this.maxLife;
        
        // Apply special effects
        this.applyEffects(time, delta, lifePercent);
        
        // Update position
        this.x += this.velocity.x * (delta / 1000);
        this.y += this.velocity.y * (delta / 1000);
        
        // Apply gravity
        if (this.gravity !== 0) {
            this.velocity.y += this.gravity * (delta / 1000);
        }
        
        // Update visual properties
        this.setAlpha(this.startAlpha * (1 - lifePercent));
        
        if (this.effects.pulsate) {
            const pulse = Math.sin(time * 0.01) * 0.2 + 0.8;
            this.setScale(this.startScale * (1 - lifePercent * 0.5) * pulse);
        } else {
            this.setScale(this.startScale * (1 - lifePercent * 0.5));
        }
        
        // Check if particle should be destroyed
        if (this.life >= this.maxLife) {
            this.scene.particleManager.currentParticleCount--;
            this.scene.objectPoolManager.release('particles', this);
        }
    }

    applyEffects(time, delta, lifePercent) {
        // Floating effect
        if (this.effects.float) {
            this.velocity.y += Math.sin(time * 0.005) * 10 * (delta / 1000);
        }
        
        // Orbital effect
        if (this.effects.orbital) {
            const orbital = this.effects.orbital;
            orbital.radius += orbital.speed * delta;
            const angle = time * orbital.speed;
            this.x = orbital.centerX + Math.cos(angle) * orbital.radius;
            this.y = orbital.centerY + Math.sin(angle) * orbital.radius;
        }
        
        // Spiral effect
        if (this.effects.spiral) {
            const spiral = this.effects.spiral;
            const angle = time * spiral.speed;
            const radius = spiral.radius * (1 - lifePercent);
            this.x = spiral.centerX + Math.cos(angle) * radius;
            this.y = spiral.centerY + Math.sin(angle) * radius;
        }
    }

    cleanup() {
        this.life = 0;
        this.velocity.x = 0;
        this.velocity.y = 0;
        this.gravity = 0;
        this.delay = 0;
        this.effects = {};
    }
} 