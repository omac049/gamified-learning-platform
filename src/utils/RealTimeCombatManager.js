/**
 * RealTimeCombatManager - Advanced real-time combat system for Phaser 3
 * Handles combos, special abilities, and dynamic combat mechanics
 */
export class RealTimeCombatManager {
    constructor(scene, objectPoolManager, particleManager) {
        this.scene = scene;
        this.objectPoolManager = objectPoolManager;
        this.particleManager = particleManager;
        
        // Combat state
        this.isInCombat = false;
        this.combatTimer = 0;
        this.maxCombatTime = 30000; // 30 seconds
        
        // Combo system
        this.currentCombo = 0;
        this.maxCombo = 50;
        this.comboTimer = 0;
        this.comboDecayTime = 3000; // 3 seconds
        this.comboMultiplier = 1;
        
        // Special abilities
        this.abilities = new Map();
        this.abilityCooldowns = new Map();
        this.activeAbilities = new Set();
        
        // Combat mechanics
        this.weaponSystems = new Map();
        this.targetingSystem = null;
        this.damageCalculator = null;
        
        // Performance tracking
        this.combatStats = {
            totalDamageDealt: 0,
            totalDamageTaken: 0,
            accuracyRate: 0,
            averageResponseTime: 0,
            combosExecuted: 0,
            abilitiesUsed: 0
        };
        
        this.initializeCombatSystems();
    }

    initializeCombatSystems() {
        this.setupWeaponSystems();
        this.setupSpecialAbilities();
        this.setupTargetingSystem();
        this.setupDamageCalculator();
        
        // Create object pools for combat
        this.objectPoolManager.createPool('bullets', BulletProjectile, 50);
        this.objectPoolManager.createPool('missiles', MissileProjectile, 20);
        this.objectPoolManager.createPool('lasers', LaserBeam, 15);
        this.objectPoolManager.createPool('combatEffects', CombatEffect, 30);
    }

    setupWeaponSystems() {
        // Rapid Fire Weapon
        this.weaponSystems.set('rapidFire', {
            name: 'Rapid Blaster',
            damage: 15,
            fireRate: 200, // ms between shots
            accuracy: 0.85,
            range: 400,
            ammo: -1, // unlimited
            projectileType: 'bullets',
            effects: ['muzzleFlash', 'bulletTrail']
        });

        // Heavy Cannon
        this.weaponSystems.set('heavyCannon', {
            name: 'Plasma Cannon',
            damage: 45,
            fireRate: 800,
            accuracy: 0.95,
            range: 500,
            ammo: -1,
            projectileType: 'missiles',
            effects: ['explosion', 'screenShake']
        });

        // Laser Weapon
        this.weaponSystems.set('laser', {
            name: 'Quantum Laser',
            damage: 25,
            fireRate: 100,
            accuracy: 1.0,
            range: 600,
            ammo: -1,
            projectileType: 'lasers',
            effects: ['laserBeam', 'energyBurst']
        });

        // Spread Shot
        this.weaponSystems.set('spreadShot', {
            name: 'Scatter Blaster',
            damage: 8,
            fireRate: 400,
            accuracy: 0.7,
            range: 300,
            ammo: -1,
            projectileType: 'bullets',
            projectileCount: 5,
            spread: Math.PI / 4,
            effects: ['multiMuzzle']
        });
    }

    setupSpecialAbilities() {
        // Time Slow
        this.abilities.set('timeSlow', {
            name: 'Temporal Distortion',
            cooldown: 15000,
            duration: 3000,
            effect: 'slowTime',
            description: 'Slows down time for 3 seconds'
        });

        // Shield Boost
        this.abilities.set('shieldBoost', {
            name: 'Energy Shield',
            cooldown: 12000,
            duration: 5000,
            effect: 'shield',
            description: 'Absorbs incoming damage'
        });

        // Damage Boost
        this.abilities.set('damageBoost', {
            name: 'Overcharge',
            cooldown: 20000,
            duration: 4000,
            effect: 'doubleDamage',
            description: 'Doubles weapon damage'
        });

        // Rapid Fire
        this.abilities.set('rapidFire', {
            name: 'Burst Mode',
            cooldown: 10000,
            duration: 6000,
            effect: 'rapidFire',
            description: 'Increases fire rate by 300%'
        });

        // Area Attack
        this.abilities.set('areaAttack', {
            name: 'Nova Blast',
            cooldown: 25000,
            duration: 0,
            effect: 'areaExplosion',
            description: 'Massive area damage'
        });
    }

    setupTargetingSystem() {
        this.targetingSystem = {
            currentTarget: null,
            autoTarget: true,
            targetLockTime: 500,
            maxTargetDistance: 600,
            
            findNearestTarget: (x, y, enemies) => {
                let nearest = null;
                let minDistance = this.targetingSystem.maxTargetDistance;
                
                enemies.forEach(enemy => {
                    if (!enemy.active) return;
                    
                    const distance = Phaser.Math.Distance.Between(x, y, enemy.x, enemy.y);
                    if (distance < minDistance) {
                        minDistance = distance;
                        nearest = enemy;
                    }
                });
                
                return nearest;
            },
            
            predictTargetPosition: (target, projectileSpeed) => {
                if (!target.body) return { x: target.x, y: target.y };
                
                const targetVelocity = target.body.velocity;
                const distance = Phaser.Math.Distance.Between(
                    this.scene.playerMech.x, this.scene.playerMech.y,
                    target.x, target.y
                );
                
                const timeToTarget = distance / projectileSpeed;
                
                return {
                    x: target.x + targetVelocity.x * timeToTarget,
                    y: target.y + targetVelocity.y * timeToTarget
                };
            }
        };
    }

    setupDamageCalculator() {
        this.damageCalculator = {
            calculateDamage: (baseDamage, attacker, target, weaponType) => {
                let damage = baseDamage;
                
                // Apply combo multiplier
                damage *= this.comboMultiplier;
                
                // Apply ability modifiers
                if (this.activeAbilities.has('damageBoost')) {
                    damage *= 2;
                }
                
                // Apply weapon type effectiveness
                if (weaponType === 'laser' && target.type === 'shielded') {
                    damage *= 1.5; // Lasers are effective against shields
                }
                
                // Apply random variance
                damage *= (0.9 + Math.random() * 0.2); // ±10% variance
                
                return Math.round(damage);
            },
            
            calculateCritical: (damage, critChance = 0.1) => {
                if (Math.random() < critChance) {
                    return {
                        damage: damage * 2,
                        isCritical: true
                    };
                }
                return {
                    damage: damage,
                    isCritical: false
                };
            }
        };
    }

    startCombat(enemies) {
        this.isInCombat = true;
        this.combatTimer = 0;
        this.currentCombo = 0;
        this.comboTimer = 0;
        
        // Reset combat stats
        this.combatStats = {
            totalDamageDealt: 0,
            totalDamageTaken: 0,
            accuracyRate: 0,
            averageResponseTime: 0,
            combosExecuted: 0,
            abilitiesUsed: 0,
            shotsHit: 0,
            shotsFired: 0
        };
        
        console.log('Real-time combat started!');
        this.scene.events.emit('combatStarted');
    }

    endCombat() {
        this.isInCombat = false;
        this.currentCombo = 0;
        this.activeAbilities.clear();
        
        // Calculate final stats
        this.combatStats.accuracyRate = this.combatStats.shotsFired > 0 
            ? (this.combatStats.shotsHit / this.combatStats.shotsFired) * 100 
            : 0;
        
        console.log('Combat ended. Stats:', this.combatStats);
        this.scene.events.emit('combatEnded', this.combatStats);
    }

    update(time, delta) {
        if (!this.isInCombat) return;
        
        this.combatTimer += delta;
        this.comboTimer += delta;
        
        // Update combo decay
        if (this.comboTimer >= this.comboDecayTime && this.currentCombo > 0) {
            this.decreaseCombo();
            this.comboTimer = 0;
        }
        
        // Update ability cooldowns
        this.updateAbilityCooldowns(delta);
        
        // Update active abilities
        this.updateActiveAbilities(time, delta);
        
        // Check combat timeout
        if (this.combatTimer >= this.maxCombatTime) {
            this.endCombat();
        }
    }

    fireWeapon(weaponType, targetX, targetY) {
        if (!this.isInCombat) return false;
        
        const weapon = this.weaponSystems.get(weaponType);
        if (!weapon) return false;
        
        // Check fire rate
        const now = Date.now();
        if (weapon.lastFired && now - weapon.lastFired < weapon.fireRate) {
            return false;
        }
        
        weapon.lastFired = now;
        this.combatStats.shotsFired++;
        
        // Calculate accuracy
        const accuracy = weapon.accuracy * (this.activeAbilities.has('rapidFire') ? 0.9 : 1);
        const hit = Math.random() < accuracy;
        
        if (hit) {
            this.combatStats.shotsHit++;
            this.increaseCombo();
        }
        
        // Fire projectile(s)
        const projectileCount = weapon.projectileCount || 1;
        const spread = weapon.spread || 0;
        
        for (let i = 0; i < projectileCount; i++) {
            let angle = Math.atan2(targetY - this.scene.playerMech.y, targetX - this.scene.playerMech.x);
            
            if (projectileCount > 1) {
                const spreadOffset = (i - (projectileCount - 1) / 2) * (spread / projectileCount);
                angle += spreadOffset;
            }
            
            this.createProjectile(weapon, angle, hit);
        }
        
        // Create weapon effects
        this.createWeaponEffects(weapon, targetX, targetY);
        
        return true;
    }

    createProjectile(weapon, angle, willHit) {
        const projectile = this.objectPoolManager.spawn(weapon.projectileType);
        if (!projectile) return;
        
        const startX = this.scene.playerMech.x;
        const startY = this.scene.playerMech.y;
        const speed = 400; // Base projectile speed
        
        projectile.initialize(startX, startY, {
            angle: angle,
            speed: speed,
            damage: weapon.damage,
            range: weapon.range,
            willHit: willHit,
            weaponType: weapon.name
        });
        
        // Create projectile trail
        if (weapon.effects.includes('bulletTrail')) {
            this.particleManager.createLaserTrail(
                startX, startY,
                startX + Math.cos(angle) * 100,
                startY + Math.sin(angle) * 100
            );
        }
    }

    createWeaponEffects(weapon, targetX, targetY) {
        const mechX = this.scene.playerMech.x;
        const mechY = this.scene.playerMech.y;
        
        // Muzzle flash
        if (weapon.effects.includes('muzzleFlash')) {
            this.particleManager.createEnergyBurst(mechX, mechY, 0xffaa00);
        }
        
        // Screen shake for heavy weapons
        if (weapon.effects.includes('screenShake')) {
            this.scene.cameras.main.shake(100, 0.005);
        }
        
        // Laser beam effect
        if (weapon.effects.includes('laserBeam')) {
            this.createLaserBeamEffect(mechX, mechY, targetX, targetY);
        }
    }

    createLaserBeamEffect(startX, startY, endX, endY) {
        const beam = this.objectPoolManager.spawn('lasers');
        if (!beam) return;
        
        beam.initialize(startX, startY, endX, endY, {
            duration: 200,
            color: 0x00ff88,
            width: 4
        });
    }

    activateAbility(abilityType) {
        if (!this.isInCombat) return false;
        
        const ability = this.abilities.get(abilityType);
        if (!ability) return false;
        
        // Check cooldown
        const cooldownRemaining = this.abilityCooldowns.get(abilityType) || 0;
        if (cooldownRemaining > 0) return false;
        
        // Set cooldown
        this.abilityCooldowns.set(abilityType, ability.cooldown);
        this.combatStats.abilitiesUsed++;
        
        // Apply ability effect
        this.applyAbilityEffect(ability);
        
        // Add to active abilities if it has duration
        if (ability.duration > 0) {
            this.activeAbilities.add(abilityType);
            
            // Schedule ability end
            this.scene.time.delayedCall(ability.duration, () => {
                this.endAbilityEffect(ability);
                this.activeAbilities.delete(abilityType);
            });
        }
        
        console.log(`Activated ability: ${ability.name}`);
        this.scene.events.emit('abilityActivated', ability);
        
        return true;
    }

    applyAbilityEffect(ability) {
        switch (ability.effect) {
            case 'slowTime':
                this.scene.physics.world.timeScale = 0.3;
                this.particleManager.createEnergyBurst(
                    this.scene.playerMech.x, 
                    this.scene.playerMech.y, 
                    0x00ffff
                );
                break;
                
            case 'shield':
                this.scene.playerMech.shieldActive = true;
                this.particleManager.createShieldEffect(
                    this.scene.playerMech.x, 
                    this.scene.playerMech.y, 
                    60
                );
                break;
                
            case 'doubleDamage':
                this.particleManager.createEnergyBurst(
                    this.scene.playerMech.x, 
                    this.scene.playerMech.y, 
                    0xff4444
                );
                break;
                
            case 'rapidFire':
                // Fire rate increase handled in fireWeapon method
                this.particleManager.createEnergyBurst(
                    this.scene.playerMech.x, 
                    this.scene.playerMech.y, 
                    0xffff00
                );
                break;
                
            case 'areaExplosion':
                this.createAreaExplosion();
                break;
        }
    }

    endAbilityEffect(ability) {
        switch (ability.effect) {
            case 'slowTime':
                this.scene.physics.world.timeScale = 1.0;
                break;
                
            case 'shield':
                this.scene.playerMech.shieldActive = false;
                break;
        }
    }

    createAreaExplosion() {
        const mechX = this.scene.playerMech.x;
        const mechY = this.scene.playerMech.y;
        const radius = 200;
        
        // Create massive explosion effect
        this.particleManager.createExplosion(mechX, mechY, 3);
        
        // Damage all enemies in range
        this.scene.enemyMechs.forEach(enemy => {
            if (!enemy.active) return;
            
            const distance = Phaser.Math.Distance.Between(mechX, mechY, enemy.x, enemy.y);
            if (distance <= radius) {
                const damage = this.damageCalculator.calculateDamage(100, null, enemy, 'explosion');
                this.dealDamageToEnemy(enemy, damage);
            }
        });
        
        // Screen shake
        this.scene.cameras.main.shake(500, 0.02);
    }

    increaseCombo() {
        this.currentCombo = Math.min(this.currentCombo + 1, this.maxCombo);
        this.comboTimer = 0;
        
        // Calculate combo multiplier
        this.comboMultiplier = 1 + (this.currentCombo * 0.05); // 5% per combo
        
        // Combo milestone effects
        if (this.currentCombo % 10 === 0 && this.currentCombo > 0) {
            this.combatStats.combosExecuted++;
            this.particleManager.createPowerUpEffect(
                this.scene.playerMech.x, 
                this.scene.playerMech.y
            );
            
            this.scene.events.emit('comboMilestone', this.currentCombo);
        }
        
        this.scene.events.emit('comboUpdated', this.currentCombo, this.comboMultiplier);
    }

    decreaseCombo() {
        this.currentCombo = Math.max(this.currentCombo - 2, 0);
        this.comboMultiplier = 1 + (this.currentCombo * 0.05);
        
        this.scene.events.emit('comboUpdated', this.currentCombo, this.comboMultiplier);
    }

    dealDamageToEnemy(enemy, damage) {
        const result = this.damageCalculator.calculateCritical(damage);
        
        enemy.health -= result.damage;
        this.combatStats.totalDamageDealt += result.damage;
        
        // Create damage effects
        this.particleManager.createDamageSparks(enemy.x, enemy.y);
        
        if (result.isCritical) {
            this.particleManager.createExplosion(enemy.x, enemy.y, 1.5);
            this.scene.events.emit('criticalHit', result.damage);
        }
        
        // Show damage number
        this.showDamageNumber(enemy.x, enemy.y, result.damage, result.isCritical);
        
        // Check if enemy is defeated
        if (enemy.health <= 0) {
            this.defeatEnemy(enemy);
        }
    }

    defeatEnemy(enemy) {
        this.particleManager.createExplosion(enemy.x, enemy.y, 2);
        this.increaseCombo();
        
        // Award points based on combo
        const points = 100 * this.comboMultiplier;
        this.scene.score += points;
        
        this.scene.events.emit('enemyDefeated', enemy, points);
    }

    showDamageNumber(x, y, damage, isCritical) {
        const color = isCritical ? '#ff0000' : '#ffff00';
        const text = this.scene.add.text(x, y, damage.toString(), {
            fontSize: isCritical ? '24px' : '18px',
            fill: color,
            stroke: '#000000',
            strokeThickness: 2
        });
        
        text.setOrigin(0.5);
        
        this.scene.tweens.add({
            targets: text,
            y: y - 50,
            alpha: 0,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => text.destroy()
        });
    }

    updateAbilityCooldowns(delta) {
        this.abilityCooldowns.forEach((cooldown, abilityType) => {
            const newCooldown = Math.max(0, cooldown - delta);
            this.abilityCooldowns.set(abilityType, newCooldown);
            
            if (newCooldown === 0 && cooldown > 0) {
                this.scene.events.emit('abilityCooldownComplete', abilityType);
            }
        });
    }

    updateActiveAbilities(time, delta) {
        // Update any time-based ability effects here
        if (this.activeAbilities.has('rapidFire')) {
            // Reduce fire rate for all weapons
            this.weaponSystems.forEach(weapon => {
                weapon.fireRate = weapon.baseFireRate * 0.25; // 4x faster
            });
        }
    }

    getCombatStats() {
        return { ...this.combatStats };
    }

    getComboInfo() {
        return {
            current: this.currentCombo,
            max: this.maxCombo,
            multiplier: this.comboMultiplier,
            timeRemaining: Math.max(0, this.comboDecayTime - this.comboTimer)
        };
    }

    getAbilityStatus(abilityType) {
        const ability = this.abilities.get(abilityType);
        if (!ability) return null;
        
        return {
            name: ability.name,
            description: ability.description,
            cooldownRemaining: this.abilityCooldowns.get(abilityType) || 0,
            isActive: this.activeAbilities.has(abilityType),
            isReady: (this.abilityCooldowns.get(abilityType) || 0) === 0
        };
    }
}

/**
 * Projectile classes for different weapon types
 */
class BulletProjectile extends Phaser.GameObjects.Graphics {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.scene = scene;
        this.velocity = { x: 0, y: 0 };
        this.damage = 0;
        this.range = 0;
        this.distanceTraveled = 0;
        this.willHit = false;
        
        this.clear();
        this.fillStyle(0x00ff88);
        this.fillCircle(0, 0, 2);
    }

    initialize(x, y, config) {
        this.setPosition(x, y);
        this.velocity.x = Math.cos(config.angle) * config.speed;
        this.velocity.y = Math.sin(config.angle) * config.speed;
        this.damage = config.damage;
        this.range = config.range;
        this.distanceTraveled = 0;
        this.willHit = config.willHit;
    }

    update(time, delta) {
        if (!this.active) return;
        
        const deltaSeconds = delta / 1000;
        this.x += this.velocity.x * deltaSeconds;
        this.y += this.velocity.y * deltaSeconds;
        this.distanceTraveled += Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y) * deltaSeconds;
        
        if (this.distanceTraveled >= this.range || this.isOutOfBounds()) {
            this.scene.objectPoolManager.release('bullets', this);
        }
    }

    isOutOfBounds() {
        return this.x < -50 || this.x > this.scene.scale.width + 50 ||
               this.y < -50 || this.y > this.scene.scale.height + 50;
    }

    cleanup() {
        this.distanceTraveled = 0;
        this.velocity.x = 0;
        this.velocity.y = 0;
    }
}

class MissileProjectile extends BulletProjectile {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.clear();
        this.fillStyle(0xff4444);
        this.fillRect(-4, -2, 8, 4);
    }
}

class LaserBeam extends Phaser.GameObjects.Graphics {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.scene = scene;
        this.duration = 0;
        this.maxDuration = 200;
    }

    initialize(startX, startY, endX, endY, config) {
        this.clear();
        this.lineStyle(config.width || 2, config.color || 0x00ff88, 1);
        this.lineBetween(startX, startY, endX, endY);
        this.duration = 0;
        this.maxDuration = config.duration || 200;
    }

    update(time, delta) {
        if (!this.active) return;
        
        this.duration += delta;
        const alpha = 1 - (this.duration / this.maxDuration);
        this.setAlpha(alpha);
        
        if (this.duration >= this.maxDuration) {
            this.scene.objectPoolManager.release('lasers', this);
        }
    }

    cleanup() {
        this.duration = 0;
        this.clear();
    }
}

class CombatEffect extends Phaser.GameObjects.Graphics {
    constructor(scene, x, y) {
        super(scene, x, y);
        this.scene = scene;
        this.effectType = '';
        this.duration = 0;
        this.maxDuration = 1000;
    }

    initialize(x, y, config) {
        this.setPosition(x, y);
        this.effectType = config.type || 'generic';
        this.duration = 0;
        this.maxDuration = config.duration || 1000;
        this.createEffect(config);
    }

    createEffect(config) {
        this.clear();
        
        switch (this.effectType) {
            case 'explosion':
                this.fillStyle(0xff4444);
                this.fillCircle(0, 0, config.radius || 20);
                break;
            case 'energy':
                this.fillStyle(0x00ffff);
                this.fillCircle(0, 0, config.radius || 15);
                break;
            default:
                this.fillStyle(0xffffff);
                this.fillCircle(0, 0, 10);
        }
    }

    update(time, delta) {
        if (!this.active) return;
        
        this.duration += delta;
        const progress = this.duration / this.maxDuration;
        
        this.setAlpha(1 - progress);
        this.setScale(1 + progress * 2);
        
        if (this.duration >= this.maxDuration) {
            this.scene.objectPoolManager.release('combatEffects', this);
        }
    }

    cleanup() {
        this.duration = 0;
        this.effectType = '';
        this.clear();
    }
} 