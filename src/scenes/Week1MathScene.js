import { Scene } from "phaser";
import { QuestionManager } from "../utils/QuestionManager.js";
import { ProgressTracker } from "../utils/ProgressTracker.js";
import { AdaptiveDifficultyManager } from "../utils/AdaptiveDifficultyManager.js";
import { PowerUpManager } from "../utils/PowerUpManager.js";
import { AchievementManager } from "../utils/AchievementManager.js";
import { EventManager } from "../utils/EventManager.js";
import { FXManager } from "../utils/FXManager.js";
import { EnhancedPlayer } from "../gameobjects/EnhancedPlayer.js";

// Import new optimization systems
import { ObjectPoolManager } from "../utils/ObjectPoolManager.js";
import { PerformanceMonitor } from "../utils/PerformanceMonitor.js";
import { PixelArtGenerator } from "../utils/PixelArtGenerator.js";
import { AdvancedParticleManager } from "../utils/AdvancedParticleManager.js";
import { RealTimeCombatManager } from "../utils/RealTimeCombatManager.js";

export class Week1MathScene extends Scene {
    constructor() {
        super("Week1MathScene");
        
        // Initialize core managers with error handling
        try {
            this.questionManager = new QuestionManager();
            this.progressTracker = new ProgressTracker();
            this.difficultyManager = new AdaptiveDifficultyManager(this.progressTracker);
            this.powerUpManager = new PowerUpManager(this.progressTracker);
            this.achievementManager = new AchievementManager(this.progressTracker);
            this.eventManager = new EventManager(this.progressTracker, this.powerUpManager);
        } catch (error) {
            console.error('Week1MathScene: Error initializing core managers:', error);
            // Initialize with fallback values
            this.questionManager = null;
            this.progressTracker = null;
            this.difficultyManager = null;
            this.powerUpManager = null;
            this.achievementManager = null;
            this.eventManager = null;
        }
        
        // Enhanced Performance Systems - Initialize as null first
        this.objectPoolManager = null;
        this.performanceMonitor = null;
        this.pixelArtGenerator = null;
        this.advancedParticleManager = null;
        this.realTimeCombatManager = null;
        
        // Mech Combat Game State
        this.score = 0;
        this.mechHealth = 100;
        this.mechShield = 0;
        this.mechEnergy = 100;
        this.enemyMechsDefeated = 0;
        this.currentBattle = null;
        this.gameTimer = 180; // 3 minutes
        this.isGameActive = true;
        this.enemyMechs = [];
        this.battleUI = null;
        this.coinsEarned = 0;
        this.equippedArmor = null;
        
        // Enhanced Combat Configuration
        this.combatMode = 'realtime'; // 'realtime' or 'turnbased'
        this.currentWeapon = 'rapidFire';
        this.weaponSwitchCooldown = 0;
        
        // Mech Combat Tracking
        this.currentStreak = 0;
        this.sessionStartTime = Date.now();
        this.battleStartTime = 0;
        this.recentBattles = [];
        this.currentDifficulty = 1.0; // Initialize with default value
        
        // Enhanced Visual Systems - Initialize as null
        this.fxManager = null;
        this.battleArenaElements = [];
        this.combatParticles = null;
        this.mechAnimations = {};
        
        // Player Mech Configuration
        this.playerMech = null;
        this.playerMechType = 'aria'; // Default value
        this.mechWeapons = [];
        this.mechDefenses = [];
        
        // Combat Arena Configuration
        this.arenaWidth = 800;
        this.arenaHeight = 600;
        this.arenaX = 0;
        this.arenaY = 0;
        
        // UI Elements - Initialize as null to prevent undefined errors
        this.healthBar = null;
        this.healthText = null;
        this.energyBar = null;
        this.energyText = null;
        this.comboText = null;
        this.multiplierText = null;
        this.comboTimerBar = null;
        this.scoreText = null;
        this.timerText = null;
        this.weaponButtons = [];
        this.abilityButtons = [];
        this.minimap = null;
        this.gameTimerEvent = null;
        
        // Enhanced Combat Colors
        this.combatColors = {
            playerMech: 0x00aaff,
            enemyMech: 0xff4444,
            laser: 0x00ff88,
            damage: 0xff6600,
            explosion: 0xffaa00,
            energy: 0x00ccff,
            heal: 0x00ff00,
            shield: 0x4444ff,
            warning: 0xff0000,
            combo: 0xffff00,
            critical: 0xff0000
        };
    }

    init() {
        try {
            this.cameras.main.fadeIn(1000, 0, 0, 0);
            
            // Get player's mech configuration with error handling
            if (this.progressTracker && typeof this.progressTracker.getCharacterType === 'function') {
                this.playerMechType = this.progressTracker.getCharacterType() || 'aria';
            } else {
                this.playerMechType = 'aria'; // Default fallback
            }
            
            if (this.progressTracker && typeof this.progressTracker.getArmorBonuses === 'function') {
                this.equippedArmor = this.progressTracker.getArmorBonuses();
            }
            
            // Apply mech upgrades to stats with null checks
            if (this.equippedArmor) {
                this.mechHealth += (this.equippedArmor.health || 0);
                this.mechShield += (this.equippedArmor.shield || 0);
                this.mechEnergy += (this.equippedArmor.energy || 0);
            }
            
            // Calculate arena position (centered) with scale checks
            if (this.scale && this.scale.width && this.scale.height) {
                this.arenaX = (this.scale.width - this.arenaWidth) / 2;
                this.arenaY = (this.scale.height - this.arenaHeight) / 2;
            } else {
                // Fallback values
                this.arenaX = 112; // (1024 - 800) / 2
                this.arenaY = 84;  // (768 - 600) / 2
            }
            
            // Initialize current difficulty with fallback
            if (this.difficultyManager && typeof this.difficultyManager.getCurrentDifficulty === 'function') {
                this.currentDifficulty = this.difficultyManager.getCurrentDifficulty('math') || 1.0;
            } else {
                this.currentDifficulty = 1.0;
            }
            
        } catch (error) {
            console.error('Week1MathScene: Error in init():', error);
            // Set safe fallback values
            this.playerMechType = 'aria';
            this.currentDifficulty = 1.0;
            this.arenaX = 112;
            this.arenaY = 84;
        }
    }

    create() {
        try {
            // Initialize Performance Optimization Systems
            this.initializeOptimizationSystems();
            
            // Initialize Enhanced Visual Systems
            this.initializeVisualSystems();
            
            // Initialize Enhanced Combat Systems
            this.initializeCombatSystems();
            
            // Create enhanced mech combat arena
            this.createEnhancedMechArena();
            
            // Create enhanced player mech with pixel art
            this.createEnhancedPlayerMech();
            
            // Create enhanced mech combat UI
            this.createEnhancedMechCombatUI();
            
            // Start enhanced game systems
            this.startEnhancedGameSystems();
            
            // Setup enhanced input controls
            this.setupEnhancedControls();
            
            // Show enhanced welcome message
            this.showEnhancedWelcomeMessage();
            
            console.log('Enhanced Battle Arena initialized with 10x improvements!');
        } catch (error) {
            console.error('Week1MathScene: Error in create():', error);
            // Create minimal fallback scene
            this.createFallbackScene();
        }
    }

    createFallbackScene() {
        try {
            // Create basic fallback scene if main initialization fails
            const fallbackText = this.add.text(this.scale.width / 2, this.scale.height / 2, 
                'Battle Arena Loading...\nPress SPACE to continue', {
                fontSize: '24px',
                fontFamily: 'Arial',
                fill: '#ffffff',
                align: 'center'
            }).setOrigin(0.5);
            
            // Add basic input handling
            if (this.input && this.input.keyboard) {
                this.input.keyboard.on('keydown-SPACE', () => {
                    this.scene.restart();
                });
            }
        } catch (error) {
            console.error('Week1MathScene: Error creating fallback scene:', error);
        }
    }

    initializeOptimizationSystems() {
        try {
            // Object Pool Manager for performance
            this.objectPoolManager = new ObjectPoolManager(this);
            
            // Performance Monitor with FPS tracking
            this.performanceMonitor = new PerformanceMonitor(this, {
                showFPS: true,
                showMemory: true,
                showRenderStats: true,
                position: { x: 10, y: 10 }
            });
            
            // Pixel Art Generator for detailed characters
            this.pixelArtGenerator = new PixelArtGenerator(this);
            
            console.log('Performance optimization systems initialized');
        } catch (error) {
            console.error('Week1MathScene: Error initializing optimization systems:', error);
            // Set null values to prevent further errors
            this.objectPoolManager = null;
            this.performanceMonitor = null;
            this.pixelArtGenerator = null;
        }
    }

    initializeVisualSystems() {
        try {
            // Advanced Particle Manager - only if object pool manager exists
            if (this.objectPoolManager) {
                this.advancedParticleManager = new AdvancedParticleManager(this, this.objectPoolManager);
            }
            
            // Enhanced FX Manager
            this.fxManager = new FXManager(this);
            
            console.log('Enhanced visual systems initialized');
        } catch (error) {
            console.error('Week1MathScene: Error initializing visual systems:', error);
            this.advancedParticleManager = null;
            this.fxManager = null;
        }
    }

    initializeCombatSystems() {
        try {
            // Real-time Combat Manager - only if dependencies exist
            if (this.objectPoolManager && this.advancedParticleManager) {
                this.realTimeCombatManager = new RealTimeCombatManager(
                    this, 
                    this.objectPoolManager, 
                    this.advancedParticleManager
                );
                
                // Setup combat event listeners
                this.setupCombatEventListeners();
            } else {
                console.warn('Week1MathScene: Combat system dependencies not available, skipping combat manager initialization');
            }
            
            console.log('Enhanced combat systems initialized');
        } catch (error) {
            console.error('Week1MathScene: Error initializing combat systems:', error);
            this.realTimeCombatManager = null;
        }
    }

    setupCombatEventListeners() {
        try {
            if (!this.events) {
                console.warn('Week1MathScene: Events system not available');
                return;
            }
            
            // Combat events with error handling
            this.events.on('combatStarted', () => {
                try {
                    console.log('Real-time combat started!');
                    this.showCombatStartNotification();
                } catch (error) {
                    console.error('Week1MathScene: Error in combatStarted event:', error);
                }
            });
            
            this.events.on('combatEnded', (stats) => {
                try {
                    console.log('Combat ended with stats:', stats);
                    this.showCombatEndScreen(stats);
                } catch (error) {
                    console.error('Week1MathScene: Error in combatEnded event:', error);
                }
            });
            
            this.events.on('comboUpdated', (combo, multiplier) => {
                try {
                    this.updateComboDisplay(combo, multiplier);
                } catch (error) {
                    console.error('Week1MathScene: Error in comboUpdated event:', error);
                }
            });
            
            this.events.on('comboMilestone', (combo) => {
                try {
                    this.showComboMilestone(combo);
                } catch (error) {
                    console.error('Week1MathScene: Error in comboMilestone event:', error);
                }
            });
            
            this.events.on('abilityActivated', (ability) => {
                try {
                    this.showAbilityActivation(ability);
                } catch (error) {
                    console.error('Week1MathScene: Error in abilityActivated event:', error);
                }
            });
            
            this.events.on('criticalHit', (damage) => {
                try {
                    this.showCriticalHitEffect(damage);
                } catch (error) {
                    console.error('Week1MathScene: Error in criticalHit event:', error);
                }
            });
            
            this.events.on('enemyDefeated', (enemy, points) => {
                try {
                    this.handleEnemyDefeated(enemy, points);
                } catch (error) {
                    console.error('Week1MathScene: Error in enemyDefeated event:', error);
                }
            });
        } catch (error) {
            console.error('Week1MathScene: Error setting up combat event listeners:', error);
        }
    }

    createEnhancedMechArena() {
        // Create enhanced cyber battlefield background
        this.createEnhancedBackground();
        
        // Create main combat arena with enhanced visuals
        this.createEnhancedArena();
        
        // Create enhanced arena decorations
        this.createEnhancedArenaDecorations();
        
        // Create dynamic lighting effects
        this.createDynamicLighting();
        
        // Create enhanced energy barriers
        this.createEnhancedEnergyBarriers();
    }

    createEnhancedBackground() {
        // Animated cyber grid background
        const gridGraphics = this.add.graphics();
        gridGraphics.setDepth(-100);
        
        // Create animated grid pattern
        const gridSize = 50;
        const gridColor = 0x004488;
        const gridAlpha = 0.3;
        
        for (let x = 0; x < this.scale.width; x += gridSize) {
            gridGraphics.lineStyle(1, gridColor, gridAlpha);
            gridGraphics.lineBetween(x, 0, x, this.scale.height);
        }
        
        for (let y = 0; y < this.scale.height; y += gridSize) {
            gridGraphics.lineStyle(1, gridColor, gridAlpha);
            gridGraphics.lineBetween(0, y, this.scale.width, y);
        }
        
        // Animate grid pulsing
        this.tweens.add({
            targets: gridGraphics,
            alpha: 0.1,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createEnhancedArena() {
        // Main arena with enhanced visuals
        const arena = this.add.graphics();
        arena.fillStyle(0x0a0a0a, 0.9);
        arena.fillRoundedRect(this.arenaX, this.arenaY, this.arenaWidth, this.arenaHeight, 20);
        
        // Enhanced border with glow effect
        arena.lineStyle(6, this.combatColors.energy, 1);
        arena.strokeRoundedRect(this.arenaX, this.arenaY, this.arenaWidth, this.arenaHeight, 20);
        arena.setDepth(-50);
        
        // Add glow effect
        arena.postFX?.addGlow(this.combatColors.energy, 2, 0, false, 0.1, 32);
        
        // Enhanced arena title with effects
        const arenaTitle = this.add.text(this.scale.width / 2, 30, "⚔️ ENHANCED MECH COMBAT ARENA ⚔️", {
            fontSize: '36px',
            fontFamily: 'Courier, monospace',
            fill: '#00ffff',
            stroke: '#000000',
            strokeThickness: 4,
            fontStyle: 'bold',
            shadow: {
                offsetX: 3,
                offsetY: 3,
                color: '#ff00ff',
                blur: 12,
                fill: true
            }
        }).setOrigin(0.5).setDepth(10);
        
        // Enhanced title animation
        this.tweens.add({
            targets: arenaTitle,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createEnhancedPlayerMech() {
        try {
            if (!this.pixelArtGenerator) {
                console.warn('Week1MathScene: PixelArtGenerator not available, using fallback');
                // Create basic fallback sprite
                this.playerMech = this.add.rectangle(
                    this.arenaX + this.arenaWidth / 4,
                    this.arenaY + this.arenaHeight / 2,
                    40, 40, this.combatColors.playerMech
                );
            } else {
                // Generate detailed pixel art character
                const characterTexture = this.pixelArtGenerator.generateCharacterSprite(
                    this.playerMechType || 'aria',
                    { enhanced: true, combatMode: true }
                );
                
                // Create enhanced player mech sprite
                this.playerMech = this.add.sprite(
                    this.arenaX + this.arenaWidth / 4,
                    this.arenaY + this.arenaHeight / 2,
                    characterTexture
                );
                
                this.playerMech.setScale(3); // Larger, more detailed sprite
                
                // Create character animations
                const animKey = this.pixelArtGenerator.createCharacterAnimations(
                    characterTexture,
                    this.playerMechType || 'aria'
                );
                
                // Play idle animation
                if (animKey && this.playerMech.play) {
                    this.playerMech.play(animKey);
                }
            }
            
            this.playerMech.setDepth(10);
            
            // Add enhanced visual effects
            this.addPlayerMechEffects();
            
            // Add physics body for collision detection
            if (this.physics && this.physics.add) {
                this.physics.add.existing(this.playerMech);
                if (this.playerMech.body) {
                    this.playerMech.body.setCollideWorldBounds(true);
                }
            }
            
            // Enhanced mech properties
            this.playerMech.maxHealth = this.mechHealth;
            this.playerMech.currentHealth = this.mechHealth;
            this.playerMech.maxShield = this.mechShield;
            this.playerMech.currentShield = this.mechShield;
            this.playerMech.maxEnergy = this.mechEnergy;
            this.playerMech.currentEnergy = this.mechEnergy;
            this.playerMech.shieldActive = false;
        } catch (error) {
            console.error('Week1MathScene: Error creating enhanced player mech:', error);
            // Create minimal fallback
            this.playerMech = this.add.rectangle(
                this.arenaX + this.arenaWidth / 4,
                this.arenaY + this.arenaHeight / 2,
                40, 40, 0x00aaff
            );
            this.playerMech.setDepth(10);
        }
    }

    addPlayerMechEffects() {
        // Energy aura around player mech
        const aura = this.add.graphics();
        aura.lineStyle(2, this.combatColors.energy, 0.5);
        aura.strokeCircle(0, 0, 40);
        aura.setDepth(9);
        
        // Attach aura to player mech
        this.playerMech.aura = aura;
        
        // Animate aura
        this.tweens.add({
            targets: aura,
            scaleX: 1.2,
            scaleY: 1.2,
            alpha: 0.3,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Update aura position
        this.events.on('postupdate', () => {
            if (this.playerMech && aura) {
                aura.x = this.playerMech.x;
                aura.y = this.playerMech.y;
            }
        });
    }

    createEnhancedMechCombatUI() {
        // Enhanced health display with animations
        this.createEnhancedHealthDisplay();
        
        // Enhanced energy display
        this.createEnhancedEnergyDisplay();
        
        // Enhanced combo display
        this.createEnhancedComboDisplay();
        
        // Enhanced weapon selection UI
        this.createEnhancedWeaponUI();
        
        // Enhanced ability UI
        this.createEnhancedAbilityUI();
        
        // Enhanced minimap
        this.createEnhancedMinimap();
    }

    createEnhancedHealthDisplay() {
        const uiX = 20;
        const uiY = 80;
        
        // Health bar background
        const healthBg = this.add.graphics();
        healthBg.fillStyle(0x000000, 0.7);
        healthBg.fillRoundedRect(uiX - 5, uiY - 5, 210, 35, 5);
        healthBg.setDepth(100);
        healthBg.setScrollFactor(0);
        
        // Health bar
        this.healthBar = this.add.graphics();
        this.healthBar.setDepth(101);
        this.healthBar.setScrollFactor(0);
        
        // Health text
        this.healthText = this.add.text(uiX, uiY, 'Health: 100/100', {
            fontSize: '16px',
            fontFamily: 'Courier, monospace',
            fill: '#00ff00'
        });
        this.healthText.setDepth(102);
        this.healthText.setScrollFactor(0);
        
        this.updateEnhancedHealthDisplay();
    }

    updateEnhancedHealthDisplay() {
        if (!this.healthBar || !this.playerMech) return;
        
        const healthPercent = this.playerMech.currentHealth / this.playerMech.maxHealth;
        const barWidth = 200;
        const barHeight = 20;
        const uiX = 20;
        const uiY = 85;
        
        this.healthBar.clear();
        
        // Health bar background
        this.healthBar.fillStyle(0x330000);
        this.healthBar.fillRoundedRect(uiX, uiY, barWidth, barHeight, 3);
        
        // Health bar fill with color based on health
        let healthColor = 0x00ff00; // Green
        if (healthPercent < 0.5) healthColor = 0xffff00; // Yellow
        if (healthPercent < 0.25) healthColor = 0xff0000; // Red
        
        this.healthBar.fillStyle(healthColor);
        this.healthBar.fillRoundedRect(uiX, uiY, barWidth * healthPercent, barHeight, 3);
        
        // Shield bar if active
        if (this.playerMech.currentShield > 0) {
            const shieldPercent = this.playerMech.currentShield / this.playerMech.maxShield;
            this.healthBar.fillStyle(this.combatColors.shield, 0.7);
            this.healthBar.fillRoundedRect(uiX, uiY - 5, barWidth * shieldPercent, 3, 1);
        }
        
        // Update text
        this.healthText.setText(`Health: ${this.playerMech.currentHealth}/${this.playerMech.maxHealth}`);
        this.healthText.setFill(healthPercent > 0.25 ? '#00ff00' : '#ff0000');
    }

    createEnhancedComboDisplay() {
        const uiX = this.scale.width - 220;
        const uiY = 80;
        
        // Combo background
        const comboBg = this.add.graphics();
        comboBg.fillStyle(0x000000, 0.7);
        comboBg.fillRoundedRect(uiX - 5, uiY - 5, 210, 60, 5);
        comboBg.setDepth(100);
        comboBg.setScrollFactor(0);
        
        // Combo text
        this.comboText = this.add.text(uiX, uiY, 'Combo: 0x', {
            fontSize: '18px',
            fontFamily: 'Courier, monospace',
            fill: '#ffff00'
        });
        this.comboText.setDepth(102);
        this.comboText.setScrollFactor(0);
        
        // Multiplier text
        this.multiplierText = this.add.text(uiX, uiY + 20, 'Multiplier: 1.0x', {
            fontSize: '14px',
            fontFamily: 'Courier, monospace',
            fill: '#00ffff'
        });
        this.multiplierText.setDepth(102);
        this.multiplierText.setScrollFactor(0);
        
        // Combo timer bar
        this.comboTimerBar = this.add.graphics();
        this.comboTimerBar.setDepth(101);
        this.comboTimerBar.setScrollFactor(0);
    }

    updateComboDisplay(combo, multiplier) {
        if (!this.comboText) return;
        
        this.comboText.setText(`Combo: ${combo}x`);
        this.multiplierText.setText(`Multiplier: ${multiplier.toFixed(1)}x`);
        
        // Update combo timer bar
        if (this.realTimeCombatManager) {
            const comboInfo = this.realTimeCombatManager.getComboInfo();
            const timerPercent = comboInfo.timeRemaining / 3000; // 3 second decay time
            
            this.comboTimerBar.clear();
            this.comboTimerBar.fillStyle(this.combatColors.combo);
            this.comboTimerBar.fillRect(
                this.scale.width - 220,
                140,
                200 * timerPercent,
                3
            );
        }
        
        // Animate combo text on increase
        if (combo > 0) {
            this.tweens.add({
                targets: this.comboText,
                scaleX: 1.2,
                scaleY: 1.2,
                duration: 200,
                yoyo: true,
                ease: 'Back.easeOut'
            });
        }
    }

    createEnhancedWeaponUI() {
        const weapons = ['rapidFire', 'heavyCannon', 'laser', 'spreadShot'];
        const uiY = this.scale.height - 80;
        const spacing = 60;
        const startX = (this.scale.width - (weapons.length * spacing)) / 2;
        
        this.weaponButtons = [];
        
        weapons.forEach((weapon, index) => {
            const x = startX + (index * spacing);
            
            // Weapon button background
            const buttonBg = this.add.graphics();
            buttonBg.fillStyle(0x000000, 0.7);
            buttonBg.fillRoundedRect(x - 25, uiY - 25, 50, 50, 5);
            buttonBg.setDepth(100);
            buttonBg.setScrollFactor(0);
            
            // Weapon icon (simplified)
            const icon = this.add.text(x, uiY, this.getWeaponIcon(weapon), {
                fontSize: '24px',
                fill: weapon === this.currentWeapon ? '#ffff00' : '#ffffff'
            });
            icon.setOrigin(0.5);
            icon.setDepth(101);
            icon.setScrollFactor(0);
            
            // Weapon key binding
            const keyText = this.add.text(x, uiY + 20, `${index + 1}`, {
                fontSize: '12px',
                fill: '#888888'
            });
            keyText.setOrigin(0.5);
            keyText.setDepth(101);
            keyText.setScrollFactor(0);
            
            this.weaponButtons.push({
                weapon,
                background: buttonBg,
                icon,
                keyText
            });
        });
    }

    getWeaponIcon(weapon) {
        const icons = {
            rapidFire: '🔫',
            heavyCannon: '💥',
            laser: '⚡',
            spreadShot: '🌟'
        };
        return icons[weapon] || '⚔️';
    }

    createEnhancedAbilityUI() {
        const abilities = ['timeSlow', 'shieldBoost', 'damageBoost', 'rapidFire', 'areaAttack'];
        const uiX = 20;
        const uiY = 150;
        const spacing = 45;
        
        this.abilityButtons = [];
        
        abilities.forEach((ability, index) => {
            const y = uiY + (index * spacing);
            
            // Ability button
            const button = this.add.graphics();
            button.fillStyle(0x000000, 0.7);
            button.fillRoundedRect(uiX - 5, y - 15, 160, 30, 5);
            button.setDepth(100);
            button.setScrollFactor(0);
            
            // Ability text
            const abilityStatus = this.realTimeCombatManager.getAbilityStatus(ability);
            const text = this.add.text(uiX, y, abilityStatus?.name || ability, {
                fontSize: '12px',
                fontFamily: 'Courier, monospace',
                fill: '#ffffff'
            });
            text.setDepth(101);
            text.setScrollFactor(0);
            
            // Cooldown overlay
            const cooldownOverlay = this.add.graphics();
            cooldownOverlay.setDepth(102);
            cooldownOverlay.setScrollFactor(0);
            
            this.abilityButtons.push({
                ability,
                button,
                text,
                cooldownOverlay,
                y
            });
        });
    }

    startEnhancedGameSystems() {
        try {
            // Start performance monitoring
            if (this.performanceMonitor && typeof this.performanceMonitor.logPerformanceReport === 'function') {
                this.performanceMonitor.logPerformanceReport();
            }
            
            // Initialize combat systems
            if (this.difficultyManager && typeof this.difficultyManager.getCurrentDifficulty === 'function') {
                this.currentDifficulty = this.difficultyManager.getCurrentDifficulty('math');
            }
            
            if (this.achievementManager && typeof this.achievementManager.resetSession === 'function') {
                this.achievementManager.resetSession();
            }
            
            if (this.eventManager && typeof this.eventManager.cleanupExpiredEvents === 'function') {
                this.eventManager.cleanupExpiredEvents();
            }
            
            // Start game timer
            this.startGameTimer();
            
            // Spawn first enhanced enemy
            this.spawnEnhancedEnemyMech();
            
            // Start ambient effects
            this.startEnhancedArenaAmbientEffects();
            
            // Start real-time combat
            if (this.realTimeCombatManager && typeof this.realTimeCombatManager.startCombat === 'function') {
                this.realTimeCombatManager.startCombat(this.enemyMechs);
            }
        } catch (error) {
            console.error('Week1MathScene: Error starting enhanced game systems:', error);
        }
    }

    setupEnhancedControls() {
        try {
            if (!this.input || !this.input.keyboard) {
                console.warn('Week1MathScene: Input system not available');
                return;
            }
            
            // Weapon switching (1-4 keys) with error handling
            this.input.keyboard.on('keydown-ONE', () => {
                try {
                    this.switchWeapon('rapidFire');
                } catch (error) {
                    console.error('Week1MathScene: Error switching to rapidFire weapon:', error);
                }
            });
            
            this.input.keyboard.on('keydown-TWO', () => {
                try {
                    this.switchWeapon('heavyCannon');
                } catch (error) {
                    console.error('Week1MathScene: Error switching to heavyCannon weapon:', error);
                }
            });
            
            this.input.keyboard.on('keydown-THREE', () => {
                try {
                    this.switchWeapon('laser');
                } catch (error) {
                    console.error('Week1MathScene: Error switching to laser weapon:', error);
                }
            });
            
            this.input.keyboard.on('keydown-FOUR', () => {
                try {
                    this.switchWeapon('spreadShot');
                } catch (error) {
                    console.error('Week1MathScene: Error switching to spreadShot weapon:', error);
                }
            });
            
            // Ability activation (Q, W, E, R, T keys) with error handling
            this.input.keyboard.on('keydown-Q', () => {
                try {
                    this.activateAbility('timeSlow');
                } catch (error) {
                    console.error('Week1MathScene: Error activating timeSlow ability:', error);
                }
            });
            
            this.input.keyboard.on('keydown-W', () => {
                try {
                    this.activateAbility('shieldBoost');
                } catch (error) {
                    console.error('Week1MathScene: Error activating shieldBoost ability:', error);
                }
            });
            
            this.input.keyboard.on('keydown-E', () => {
                try {
                    this.activateAbility('damageBoost');
                } catch (error) {
                    console.error('Week1MathScene: Error activating damageBoost ability:', error);
                }
            });
            
            this.input.keyboard.on('keydown-R', () => {
                try {
                    this.activateAbility('rapidFire');
                } catch (error) {
                    console.error('Week1MathScene: Error activating rapidFire ability:', error);
                }
            });
            
            this.input.keyboard.on('keydown-T', () => {
                try {
                    this.activateAbility('areaAttack');
                } catch (error) {
                    console.error('Week1MathScene: Error activating areaAttack ability:', error);
                }
            });
            
            // Mouse controls for targeting and firing
            this.input.on('pointerdown', (pointer) => {
                try {
                    if (this.realTimeCombatManager && this.realTimeCombatManager.isInCombat) {
                        this.realTimeCombatManager.fireWeapon(this.currentWeapon, pointer.x, pointer.y);
                    }
                } catch (error) {
                    console.error('Week1MathScene: Error firing weapon:', error);
                }
            });
            
            // Performance monitor toggle (F1)
            this.input.keyboard.on('keydown-F1', () => {
                try {
                    if (this.performanceMonitor && typeof this.performanceMonitor.toggleDisplay === 'function') {
                        this.performanceMonitor.toggleDisplay();
                    }
                } catch (error) {
                    console.error('Week1MathScene: Error toggling performance monitor:', error);
                }
            });
        } catch (error) {
            console.error('Week1MathScene: Error setting up enhanced controls:', error);
        }
    }

    switchWeapon(weaponType) {
        try {
            if (this.weaponSwitchCooldown > 0) return;
            
            this.currentWeapon = weaponType;
            this.weaponSwitchCooldown = 500; // 0.5 second cooldown
            
            // Update weapon UI
            this.updateWeaponUI();
            
            // Show weapon switch effect
            if (this.advancedParticleManager && typeof this.advancedParticleManager.createEnergyBurst === 'function' && this.playerMech) {
                this.advancedParticleManager.createEnergyBurst(
                    this.playerMech.x,
                    this.playerMech.y,
                    0x00ffff
                );
            }
            
            console.log(`Switched to weapon: ${weaponType}`);
        } catch (error) {
            console.error('Week1MathScene: Error switching weapon:', error);
        }
    }

    activateAbility(abilityType) {
        try {
            if (this.realTimeCombatManager && typeof this.realTimeCombatManager.activateAbility === 'function') {
                const success = this.realTimeCombatManager.activateAbility(abilityType);
                if (success) {
                    this.updateAbilityUI();
                }
            }
        } catch (error) {
            console.error('Week1MathScene: Error activating ability:', error);
        }
    }

    updateWeaponUI() {
        this.weaponButtons?.forEach(button => {
            const isSelected = button.weapon === this.currentWeapon;
            button.icon.setFill(isSelected ? '#ffff00' : '#ffffff');
            
            if (isSelected) {
                // Highlight selected weapon
                button.background.clear();
                button.background.fillStyle(0x444400, 0.7);
                button.background.fillRoundedRect(
                    button.icon.x - 25,
                    button.icon.y - 25,
                    50, 50, 5
                );
            } else {
                button.background.clear();
                button.background.fillStyle(0x000000, 0.7);
                button.background.fillRoundedRect(
                    button.icon.x - 25,
                    button.icon.y - 25,
                    50, 50, 5
                );
            }
        });
    }

    updateAbilityUI() {
        try {
            if (!Array.isArray(this.abilityButtons) || !this.realTimeCombatManager) {
                return;
            }
            
            this.abilityButtons.forEach(button => {
                try {
                    const status = this.realTimeCombatManager.getAbilityStatus(button.ability);
                    if (!status) return;
                    
                    // Update text color based on status
                    if (button.text && button.text.setFill) {
                        if (status.isActive) {
                            button.text.setFill('#00ff00'); // Green when active
                        } else if (status.isReady) {
                            button.text.setFill('#ffffff'); // White when ready
                        } else {
                            button.text.setFill('#888888'); // Gray when on cooldown
                        }
                    }
                    
                    // Update cooldown overlay
                    if (button.cooldownOverlay && button.cooldownOverlay.clear) {
                        button.cooldownOverlay.clear();
                        if (status.cooldownRemaining > 0) {
                            const cooldownPercent = status.cooldownRemaining / 15000; // Assuming max 15s cooldown
                            button.cooldownOverlay.fillStyle(0x000000, 0.5);
                            button.cooldownOverlay.fillRect(15, button.y - 15, 160 * cooldownPercent, 30);
                        }
                    }
                } catch (error) {
                    console.error('Week1MathScene: Error updating individual ability button:', error);
                }
            });
        } catch (error) {
            console.error('Week1MathScene: Error in updateAbilityUI:', error);
        }
    }

    spawnEnhancedEnemyMech() {
        try {
            const enemyTypes = ['scout', 'warrior', 'destroyer'];
            const enemyType = Phaser.Utils.Array.GetRandom(enemyTypes);
            
            let enemyTexture;
            if (this.pixelArtGenerator && typeof this.pixelArtGenerator.generateEnemySprite === 'function') {
                // Generate enhanced enemy sprite
                enemyTexture = this.pixelArtGenerator.generateEnemySprite(enemyType, this.currentDifficulty);
            }
            
            // Create enemy mech
            const enemyX = this.arenaX + this.arenaWidth * 0.75;
            const enemyY = this.arenaY + this.arenaHeight * 0.5 + (Math.random() - 0.5) * 200;
            
            let enemyMech;
            if (enemyTexture && this.add && this.add.sprite) {
                enemyMech = this.add.sprite(enemyX, enemyY, enemyTexture);
                enemyMech.setScale(2.5);
            } else {
                // Fallback to basic rectangle
                enemyMech = this.add.rectangle(enemyX, enemyY, 30, 30, this.combatColors.enemyMech);
            }
            
            enemyMech.setDepth(10);
            
            // Add physics
            if (this.physics && this.physics.add) {
                this.physics.add.existing(enemyMech);
            }
            
            // Enhanced enemy properties
            enemyMech.enemyType = enemyType;
            enemyMech.maxHealth = this.getEnemyHealth(enemyType);
            enemyMech.health = enemyMech.maxHealth;
            enemyMech.damage = this.getEnemyDamage(enemyType);
            enemyMech.speed = this.getEnemySpeed(enemyType);
            
            // Add to enemy list
            this.enemyMechs.push(enemyMech);
            
            // Create enemy AI behavior
            this.createEnhancedEnemyAI(enemyMech);
            
            // Add enemy effects
            this.addEnemyEffects(enemyMech);
            
            console.log(`Spawned enhanced ${enemyType} enemy mech`);
        } catch (error) {
            console.error('Week1MathScene: Error spawning enhanced enemy mech:', error);
        }
    }

    getEnemyHealth(type) {
        const healthMap = { scout: 50, warrior: 100, destroyer: 150 };
        return healthMap[type] || 50;
    }

    getEnemyDamage(type) {
        const damageMap = { scout: 15, warrior: 25, destroyer: 40 };
        return damageMap[type] || 15;
    }

    getEnemySpeed(type) {
        const speedMap = { scout: 150, warrior: 100, destroyer: 75 };
        return speedMap[type] || 100;
    }

    createEnhancedEnemyAI(enemy) {
        // Enhanced AI with different behaviors per enemy type
        const aiUpdate = () => {
            if (!enemy.active || !this.playerMech) return;
            
            const distance = Phaser.Math.Distance.Between(
                enemy.x, enemy.y,
                this.playerMech.x, this.playerMech.y
            );
            
            switch (enemy.enemyType) {
                case 'scout':
                    this.scoutAI(enemy, distance);
                    break;
                case 'warrior':
                    this.warriorAI(enemy, distance);
                    break;
                case 'destroyer':
                    this.destroyerAI(enemy, distance);
                    break;
            }
        };
        
        // Update AI every 100ms
        enemy.aiTimer = this.time.addEvent({
            delay: 100,
            callback: aiUpdate,
            loop: true
        });
    }

    scoutAI(enemy, distance) {
        // Scout: Fast, hit-and-run tactics
        if (distance > 200) {
            // Move towards player
            this.physics.moveToObject(enemy, this.playerMech, enemy.speed);
        } else if (distance < 100) {
            // Move away from player
            this.physics.moveToObject(enemy, this.playerMech, -enemy.speed * 0.5);
        } else {
            // Circle around player
            const angle = Phaser.Math.Angle.Between(enemy.x, enemy.y, this.playerMech.x, this.playerMech.y);
            enemy.body.setVelocity(
                Math.cos(angle + Math.PI / 2) * enemy.speed * 0.7,
                Math.sin(angle + Math.PI / 2) * enemy.speed * 0.7
            );
        }
    }

    warriorAI(enemy, distance) {
        // Warrior: Direct assault
        if (distance > 150) {
            this.physics.moveToObject(enemy, this.playerMech, enemy.speed);
        } else {
            // Stop and attack
            enemy.body.setVelocity(0, 0);
            this.enemyAttack(enemy);
        }
    }

    destroyerAI(enemy, distance) {
        // Destroyer: Slow but powerful, long-range attacks
        if (distance > 300) {
            this.physics.moveToObject(enemy, this.playerMech, enemy.speed);
        } else {
            // Stop and use heavy weapons
            enemy.body.setVelocity(0, 0);
            this.enemyHeavyAttack(enemy);
        }
    }

    enemyAttack(enemy) {
        // Basic enemy attack
        if (!enemy.lastAttack || Date.now() - enemy.lastAttack > 2000) {
            enemy.lastAttack = Date.now();
            
            // Create attack effect
            this.advancedParticleManager.createDamageSparks(
                enemy.x, enemy.y,
                Phaser.Math.Angle.Between(enemy.x, enemy.y, this.playerMech.x, this.playerMech.y)
            );
            
            // Deal damage to player if in range
            const distance = Phaser.Math.Distance.Between(
                enemy.x, enemy.y,
                this.playerMech.x, this.playerMech.y
            );
            
            if (distance < 150) {
                this.damagePlayer(enemy.damage);
            }
        }
    }

    enemyHeavyAttack(enemy) {
        // Heavy enemy attack
        if (!enemy.lastHeavyAttack || Date.now() - enemy.lastHeavyAttack > 4000) {
            enemy.lastHeavyAttack = Date.now();
            
            // Create heavy attack effect
            this.advancedParticleManager.createExplosion(enemy.x, enemy.y, 1.5);
            
            // Deal heavy damage
            const distance = Phaser.Math.Distance.Between(
                enemy.x, enemy.y,
                this.playerMech.x, this.playerMech.y
            );
            
            if (distance < 250) {
                this.damagePlayer(enemy.damage * 1.5);
            }
        }
    }

    damagePlayer(damage) {
        if (this.playerMech.shieldActive && this.playerMech.currentShield > 0) {
            // Shield absorbs damage
            this.playerMech.currentShield = Math.max(0, this.playerMech.currentShield - damage);
            this.advancedParticleManager.createShieldEffect(this.playerMech.x, this.playerMech.y);
        } else {
            // Direct health damage
            this.playerMech.currentHealth = Math.max(0, this.playerMech.currentHealth - damage);
            this.advancedParticleManager.createDamageSparks(this.playerMech.x, this.playerMech.y);
            
            // Screen flash on damage
            this.cameras.main.flash(200, 255, 0, 0, false);
        }
        
        this.updateEnhancedHealthDisplay();
        
        // Check for game over
        if (this.playerMech.currentHealth <= 0) {
            this.gameOver();
        }
    }

    addEnemyEffects(enemy) {
        // Add visual effects to enemy
        const enemyAura = this.add.graphics();
        enemyAura.lineStyle(1, this.combatColors.enemyMech, 0.3);
        enemyAura.strokeCircle(0, 0, 30);
        enemyAura.setDepth(9);
        
        enemy.aura = enemyAura;
        
        // Animate enemy aura
        this.tweens.add({
            targets: enemyAura,
            scaleX: 1.3,
            scaleY: 1.3,
            alpha: 0.1,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    startEnhancedArenaAmbientEffects() {
        // Enhanced ambient particle effects
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                // Random ambient energy bursts
                const x = this.arenaX + Math.random() * this.arenaWidth;
                const y = this.arenaY + Math.random() * this.arenaHeight;
                this.advancedParticleManager.createEnergyBurst(x, y, 0x004488);
            },
            loop: true
        });
        
        // Enhanced lighting effects
        this.createDynamicLighting();
    }

    createDynamicLighting() {
        // Dynamic lighting effects (if supported)
        if (this.lights) {
            this.lights.enable();
            this.lights.setAmbientColor(0x404040);
            
            // Player light
            const playerLight = this.lights.addLight(
                this.playerMech.x, this.playerMech.y, 200, 0x00aaff, 1
            );
            
            // Update player light position
            this.events.on('postupdate', () => {
                if (playerLight && this.playerMech) {
                    playerLight.x = this.playerMech.x;
                    playerLight.y = this.playerMech.y;
                }
            });
        }
    }

    update(time, delta) {
        try {
            // Update performance systems with null checks
            if (this.performanceMonitor && typeof this.performanceMonitor.update === 'function') {
                this.performanceMonitor.update(time, delta);
            }
            
            if (this.advancedParticleManager && typeof this.advancedParticleManager.update === 'function') {
                this.advancedParticleManager.update(time, delta);
            }
            
            if (this.realTimeCombatManager && typeof this.realTimeCombatManager.update === 'function') {
                this.realTimeCombatManager.update(time, delta);
            }
            
            // Update weapon switch cooldown
            if (this.weaponSwitchCooldown > 0) {
                this.weaponSwitchCooldown = Math.max(0, this.weaponSwitchCooldown - delta);
            }
            
            // Update enemy aura positions with null checks
            if (Array.isArray(this.enemyMechs)) {
                this.enemyMechs.forEach(enemy => {
                    if (enemy && enemy.aura && enemy.active) {
                        enemy.aura.x = enemy.x;
                        enemy.aura.y = enemy.y;
                    }
                });
            }
            
            // Update UI with error handling
            try {
                this.updateAbilityUI();
            } catch (error) {
                console.error('Week1MathScene: Error updating ability UI:', error);
            }
            
            try {
                this.updateMinimap();
            } catch (error) {
                console.error('Week1MathScene: Error updating minimap:', error);
            }
            
            // Spawn new enemies periodically with null checks
            if (Array.isArray(this.enemyMechs) && this.isGameActive) {
                const activeEnemies = this.enemyMechs.filter(e => e && e.active);
                if (activeEnemies.length < 3) {
                    try {
                        this.spawnEnhancedEnemyMech();
                    } catch (error) {
                        console.error('Week1MathScene: Error spawning enemy mech:', error);
                    }
                }
            }
        } catch (error) {
            console.error('Week1MathScene: Error in update method:', error);
        }
    }

    startGameTimer() {
        try {
            if (!this.time) {
                console.warn('Week1MathScene: Time system not available for game timer');
                return;
            }
            
            this.gameTimerEvent = this.time.addEvent({
                delay: 1000,
                callback: () => {
                    try {
                        this.gameTimer--;
                        this.updateTimerDisplay();
                        
                        if (this.gameTimer <= 0) {
                            this.timeUp();
                        }
                        
                        // Increase difficulty over time
                        if (this.gameTimer % 30 === 0) {
                            this.increaseDifficulty();
                        }
                    } catch (error) {
                        console.error('Week1MathScene: Error in game timer callback:', error);
                    }
                },
                loop: true
            });
        } catch (error) {
            console.error('Week1MathScene: Error starting game timer:', error);
        }
    }

    updateTimerDisplay() {
        try {
            if (!this.timerText) {
                if (!this.add || !this.scale) {
                    console.warn('Week1MathScene: Scene systems not available for timer display');
                    return;
                }
                
                this.timerText = this.add.text(this.scale.width / 2, 70, '', {
                    fontSize: '24px',
                    fontFamily: 'Courier, monospace',
                    fill: '#ffffff',
                    stroke: '#000000',
                    strokeThickness: 2
                }).setOrigin(0.5).setDepth(100).setScrollFactor(0);
            }
            
            const minutes = Math.floor(this.gameTimer / 60);
            const seconds = this.gameTimer % 60;
            const timeString = `${minutes}:${seconds.toString().padStart(2, '0')}`;
            
            this.timerText.setText(`⏱️ ${timeString}`);
            
            // Change color when time is running low
            if (this.gameTimer <= 30) {
                this.timerText.setFill('#ff0000');
                
                // Flash effect when very low
                if (this.gameTimer <= 10 && this.tweens) {
                    this.tweens.add({
                        targets: this.timerText,
                        alpha: 0.3,
                        duration: 500,
                        yoyo: true,
                        ease: 'Power2'
                    });
                }
            } else if (this.gameTimer <= 60) {
                this.timerText.setFill('#ffff00');
            }
        } catch (error) {
            console.error('Week1MathScene: Error updating timer display:', error);
        }
    }

    increaseDifficulty() {
        try {
            this.currentDifficulty = Math.min(this.currentDifficulty + 0.1, 3.0);
            
            // Show difficulty increase notification
            this.showNotification('⚡ DIFFICULTY INCREASED! ⚡', '#ff8800');
            
            // Spawn additional enemy
            if (Array.isArray(this.enemyMechs)) {
                const activeEnemies = this.enemyMechs.filter(e => e && e.active);
                if (activeEnemies.length < 5) {
                    this.spawnEnhancedEnemyMech();
                }
            }
        } catch (error) {
            console.error('Week1MathScene: Error increasing difficulty:', error);
        }
    }

    showEnhancedWelcomeMessage() {
        try {
            if (!this.add || !this.scale) {
                console.warn('Week1MathScene: Scene systems not available for welcome message');
                return;
            }
            
            const welcomeText = this.add.text(this.scale.width / 2, this.scale.height / 2, 
                '🚀 ENHANCED MECH COMBAT ARENA 🚀\n\n' +
                '⚔️ Real-time Combat System\n' +
                '🎯 Advanced Targeting & Combos\n' +
                '💥 Spectacular Particle Effects\n' +
                '🔧 Multiple Weapon Systems\n' +
                '⚡ Special Abilities & Power-ups\n\n' +
                'Controls:\n' +
                '🖱️ Mouse: Aim & Fire\n' +
                '1-4: Switch Weapons\n' +
                'Q,W,E,R,T: Special Abilities\n' +
                'F1: Performance Monitor\n\n' +
                'Click anywhere to begin!', {
                fontSize: '20px',
                fontFamily: 'Courier, monospace',
                fill: '#00ffff',
                stroke: '#000000',
                strokeThickness: 3,
                align: 'center',
                shadow: {
                    offsetX: 2,
                    offsetY: 2,
                    color: '#ff00ff',
                    blur: 8,
                    fill: true
                }
            }).setOrigin(0.5).setDepth(200);

            // Animated entrance
            welcomeText.setScale(0);
            if (this.tweens) {
                this.tweens.add({
                    targets: welcomeText,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 1000,
                    ease: 'Back.easeOut'
                });
            }

            // Click to dismiss
            if (this.input) {
                this.input.once('pointerdown', () => {
                    if (this.tweens) {
                        this.tweens.add({
                            targets: welcomeText,
                            alpha: 0,
                            scaleX: 0,
                            scaleY: 0,
                            duration: 500,
                            ease: 'Power2.easeIn',
                            onComplete: () => {
                                if (welcomeText && welcomeText.destroy) {
                                    welcomeText.destroy();
                                }
                            }
                        });
                    } else {
                        welcomeText.destroy();
                    }
                });
            }
        } catch (error) {
            console.error('Week1MathScene: Error showing welcome message:', error);
        }
    }

    showCombatStartNotification() {
        try {
            this.showNotification('⚔️ COMBAT INITIATED! ⚔️', '#ff0000', 2000);
            
            // Combat start effects
            if (this.advancedParticleManager && typeof this.advancedParticleManager.createExplosion === 'function') {
                this.advancedParticleManager.createExplosion(
                    this.scale.width / 2, 
                    this.scale.height / 2, 
                    2
                );
            }
            
            if (this.cameras && this.cameras.main && typeof this.cameras.main.shake === 'function') {
                this.cameras.main.shake(300, 0.01);
            }
        } catch (error) {
            console.error('Week1MathScene: Error showing combat start notification:', error);
        }
    }

    showComboMilestone(combo) {
        try {
            this.showNotification(`🔥 ${combo}x COMBO! 🔥`, '#ffff00', 1500);
            
            // Combo milestone effects
            if (this.advancedParticleManager && typeof this.advancedParticleManager.createPowerUpEffect === 'function' && this.playerMech) {
                this.advancedParticleManager.createPowerUpEffect(
                    this.playerMech.x,
                    this.playerMech.y
                );
            }
            
            // Screen flash
            if (this.cameras && this.cameras.main && typeof this.cameras.main.flash === 'function') {
                this.cameras.main.flash(300, 255, 255, 0, false);
            }
        } catch (error) {
            console.error('Week1MathScene: Error showing combo milestone:', error);
        }
    }

    showAbilityActivation(ability) {
        try {
            if (ability && ability.name) {
                this.showNotification(`⚡ ${ability.name.toUpperCase()} ACTIVATED! ⚡`, '#00ff00', 1000);
            }
        } catch (error) {
            console.error('Week1MathScene: Error showing ability activation:', error);
        }
    }

    showCriticalHitEffect(damage) {
        try {
            this.showNotification(`💥 CRITICAL HIT! ${damage} DMG 💥`, '#ff0000', 1000);
            
            // Enhanced critical hit effects
            if (this.cameras && this.cameras.main) {
                if (typeof this.cameras.main.shake === 'function') {
                    this.cameras.main.shake(200, 0.015);
                }
                if (typeof this.cameras.main.flash === 'function') {
                    this.cameras.main.flash(150, 255, 0, 0, false);
                }
            }
        } catch (error) {
            console.error('Week1MathScene: Error showing critical hit effect:', error);
        }
    }

    showNotification(text, color = '#ffffff', duration = 2000) {
        try {
            if (!this.add || !this.scale) {
                console.warn('Week1MathScene: Scene systems not available for notification');
                return;
            }
            
            const notification = this.add.text(this.scale.width / 2, 200, text, {
                fontSize: '28px',
                fontFamily: 'Courier, monospace',
                fill: color,
                stroke: '#000000',
                strokeThickness: 4,
                fontStyle: 'bold'
            }).setOrigin(0.5).setDepth(300).setScrollFactor(0);

            // Animated entrance
            notification.setScale(0);
            if (this.tweens) {
                this.tweens.add({
                    targets: notification,
                    scaleX: 1.2,
                    scaleY: 1.2,
                    duration: 300,
                    ease: 'Back.easeOut',
                    onComplete: () => {
                        this.tweens.add({
                            targets: notification,
                            scaleX: 1,
                            scaleY: 1,
                            duration: 200,
                            ease: 'Power2.easeOut'
                        });
                    }
                });
            }

            // Auto-remove after duration
            if (this.time) {
                this.time.delayedCall(duration, () => {
                    if (this.tweens && notification && notification.active) {
                        this.tweens.add({
                            targets: notification,
                            alpha: 0,
                            y: notification.y - 50,
                            duration: 500,
                            ease: 'Power2.easeIn',
                            onComplete: () => {
                                if (notification && notification.destroy) {
                                    notification.destroy();
                                }
                            }
                        });
                    } else if (notification && notification.destroy) {
                        notification.destroy();
                    }
                });
            }
        } catch (error) {
            console.error('Week1MathScene: Error showing notification:', error);
        }
    }

    handleEnemyDefeated(enemy, points) {
        this.score += points;
        this.enemyMechsDefeated++;
        this.coinsEarned += Math.floor(points / 10);
        
        // Remove enemy from list
        const index = this.enemyMechs.indexOf(enemy);
        if (index > -1) {
            this.enemyMechs.splice(index, 1);
        }
        
        // Clean up enemy
        if (enemy.aura) enemy.aura.destroy();
        if (enemy.aiTimer) enemy.aiTimer.destroy();
        enemy.destroy();
        
        // Update UI
        this.updateScoreDisplay();
        
        // Achievement check
        this.checkAchievements();
        
        // Spawn new enemy after delay
        this.time.delayedCall(2000, () => {
            if (this.isGameActive) {
                this.spawnEnhancedEnemyMech();
            }
        });
    }

    updateScoreDisplay() {
        if (!this.scoreText) {
            this.scoreText = this.add.text(20, 40, '', {
                fontSize: '18px',
                fontFamily: 'Courier, monospace',
                fill: '#ffff00'
            }).setDepth(100).setScrollFactor(0);
        }
        
        this.scoreText.setText(`Score: ${this.score} | Defeated: ${this.enemyMechsDefeated} | Coins: ${this.coinsEarned}`);
    }

    checkAchievements() {
        // Check for various achievements
        if (this.enemyMechsDefeated >= 10) {
            this.unlockAchievement('Mech Destroyer', 'Defeat 10 enemy mechs');
        }
        
        if (this.score >= 5000) {
            this.unlockAchievement('High Scorer', 'Reach 5000 points');
        }
        
        const comboInfo = this.realTimeCombatManager.getComboInfo();
        if (comboInfo.current >= 25) {
            this.unlockAchievement('Combo Master', 'Achieve 25x combo');
        }
    }

    unlockAchievement(name, description) {
        this.showNotification(`🏆 ACHIEVEMENT UNLOCKED!\n${name}\n${description}`, '#ffd700', 3000);
        
        // Achievement effects
        this.advancedParticleManager.createPowerUpEffect(
            this.scale.width / 2,
            this.scale.height / 2
        );
    }

    createEnhancedArenaDecorations() {
        // Enhanced arena decorations with animated elements
        const decorations = [];
        
        // Corner energy nodes
        const corners = [
            { x: this.arenaX + 50, y: this.arenaY + 50 },
            { x: this.arenaX + this.arenaWidth - 50, y: this.arenaY + 50 },
            { x: this.arenaX + 50, y: this.arenaY + this.arenaHeight - 50 },
            { x: this.arenaX + this.arenaWidth - 50, y: this.arenaY + this.arenaHeight - 50 }
        ];
        
        corners.forEach((corner, index) => {
            const node = this.add.graphics();
            node.fillStyle(this.combatColors.energy, 0.8);
            node.fillCircle(corner.x, corner.y, 8);
            node.lineStyle(2, this.combatColors.energy, 1);
            node.strokeCircle(corner.x, corner.y, 15);
            node.setDepth(-40);
            
            // Animate nodes
            this.tweens.add({
                targets: node,
                scaleX: 1.3,
                scaleY: 1.3,
                duration: 1000 + (index * 250),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            decorations.push(node);
        });
        
        // Central energy core
        const core = this.add.graphics();
        core.fillStyle(this.combatColors.energy, 0.6);
        core.fillCircle(this.arenaX + this.arenaWidth / 2, this.arenaY + this.arenaHeight / 2, 20);
        core.setDepth(-45);
        
        this.tweens.add({
            targets: core,
            alpha: 0.3,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        decorations.push(core);
        this.battleArenaElements = decorations;
    }

    createEnhancedEnergyBarriers() {
        // Energy barriers around arena perimeter
        const barriers = [];
        const barrierCount = 20;
        const perimeter = (this.arenaWidth + this.arenaHeight) * 2;
        const spacing = perimeter / barrierCount;
        
        for (let i = 0; i < barrierCount; i++) {
            const progress = i / barrierCount;
            let x, y;
            
            if (progress < 0.25) {
                // Top edge
                x = this.arenaX + (progress * 4) * this.arenaWidth;
                y = this.arenaY;
            } else if (progress < 0.5) {
                // Right edge
                x = this.arenaX + this.arenaWidth;
                y = this.arenaY + ((progress - 0.25) * 4) * this.arenaHeight;
            } else if (progress < 0.75) {
                // Bottom edge
                x = this.arenaX + this.arenaWidth - ((progress - 0.5) * 4) * this.arenaWidth;
                y = this.arenaY + this.arenaHeight;
            } else {
                // Left edge
                x = this.arenaX;
                y = this.arenaY + this.arenaHeight - ((progress - 0.75) * 4) * this.arenaHeight;
            }
            
            const barrier = this.add.graphics();
            barrier.fillStyle(this.combatColors.energy, 0.4);
            barrier.fillRect(x - 2, y - 2, 4, 4);
            barrier.setDepth(-30);
            
            // Animate barriers
            this.tweens.add({
                targets: barrier,
                alpha: 0.1,
                duration: 1500 + (i * 100),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            barriers.push(barrier);
        }
        
        this.energyBarriers = barriers;
    }

    createEnhancedEnergyDisplay() {
        const uiX = 20;
        const uiY = 120;
        
        // Energy bar background
        const energyBg = this.add.graphics();
        energyBg.fillStyle(0x000000, 0.7);
        energyBg.fillRoundedRect(uiX - 5, uiY - 5, 210, 25, 5);
        energyBg.setDepth(100);
        energyBg.setScrollFactor(0);
        
        // Energy bar
        this.energyBar = this.add.graphics();
        this.energyBar.setDepth(101);
        this.energyBar.setScrollFactor(0);
        
        // Energy text
        this.energyText = this.add.text(uiX, uiY, 'Energy: 100/100', {
            fontSize: '14px',
            fontFamily: 'Courier, monospace',
            fill: '#00ffff'
        });
        this.energyText.setDepth(102);
        this.energyText.setScrollFactor(0);
        
        this.updateEnergyDisplay();
    }

    updateEnergyDisplay() {
        if (!this.energyBar || !this.playerMech) return;
        
        const energyPercent = this.playerMech.currentEnergy / this.playerMech.maxEnergy;
        const barWidth = 200;
        const barHeight = 15;
        const uiX = 20;
        const uiY = 125;
        
        this.energyBar.clear();
        
        // Energy bar background
        this.energyBar.fillStyle(0x000033);
        this.energyBar.fillRoundedRect(uiX, uiY, barWidth, barHeight, 3);
        
        // Energy bar fill
        this.energyBar.fillStyle(this.combatColors.energy);
        this.energyBar.fillRoundedRect(uiX, uiY, barWidth * energyPercent, barHeight, 3);
        
        // Update text
        this.energyText.setText(`Energy: ${this.playerMech.currentEnergy}/${this.playerMech.maxEnergy}`);
    }

    createEnhancedMinimap() {
        const minimapSize = 120;
        const minimapX = this.scale.width - minimapSize - 20;
        const minimapY = this.scale.height - minimapSize - 20;
        
        // Minimap background
        const minimapBg = this.add.graphics();
        minimapBg.fillStyle(0x000000, 0.8);
        minimapBg.fillRoundedRect(minimapX - 5, minimapY - 5, minimapSize + 10, minimapSize + 10, 5);
        minimapBg.lineStyle(2, this.combatColors.energy, 1);
        minimapBg.strokeRoundedRect(minimapX - 5, minimapY - 5, minimapSize + 10, minimapSize + 10, 5);
        minimapBg.setDepth(100);
        minimapBg.setScrollFactor(0);
        
        // Minimap arena
        const minimapArena = this.add.graphics();
        minimapArena.lineStyle(1, 0x444444, 1);
        minimapArena.strokeRect(minimapX, minimapY, minimapSize, minimapSize);
        minimapArena.setDepth(101);
        minimapArena.setScrollFactor(0);
        
        this.minimap = {
            x: minimapX,
            y: minimapY,
            size: minimapSize,
            arena: minimapArena,
            playerDot: null,
            enemyDots: []
        };
        
        this.updateMinimap();
    }

    updateMinimap() {
        try {
            if (!this.minimap) return;
            
            const scaleX = this.minimap.size / this.arenaWidth;
            const scaleY = this.minimap.size / this.arenaHeight;
            
            // Clear previous dots
            if (this.minimap.playerDot && this.minimap.playerDot.destroy) {
                this.minimap.playerDot.destroy();
            }
            if (Array.isArray(this.minimap.enemyDots)) {
                this.minimap.enemyDots.forEach(dot => {
                    if (dot && dot.destroy) {
                        dot.destroy();
                    }
                });
                this.minimap.enemyDots = [];
            }
            
            // Player dot
            if (this.playerMech && this.add) {
                const playerX = this.minimap.x + (this.playerMech.x - this.arenaX) * scaleX;
                const playerY = this.minimap.y + (this.playerMech.y - this.arenaY) * scaleY;
                
                this.minimap.playerDot = this.add.graphics();
                this.minimap.playerDot.fillStyle(this.combatColors.playerMech);
                this.minimap.playerDot.fillCircle(playerX, playerY, 3);
                this.minimap.playerDot.setDepth(102);
                this.minimap.playerDot.setScrollFactor(0);
            }
            
            // Enemy dots
            if (Array.isArray(this.enemyMechs)) {
                this.enemyMechs.forEach(enemy => {
                    try {
                        if (!enemy || !enemy.active || !this.add) return;
                        
                        const enemyX = this.minimap.x + (enemy.x - this.arenaX) * scaleX;
                        const enemyY = this.minimap.y + (enemy.y - this.arenaY) * scaleY;
                        
                        const enemyDot = this.add.graphics();
                        enemyDot.fillStyle(this.combatColors.enemyMech);
                        enemyDot.fillCircle(enemyX, enemyY, 2);
                        enemyDot.setDepth(102);
                        enemyDot.setScrollFactor(0);
                        
                        this.minimap.enemyDots.push(enemyDot);
                    } catch (error) {
                        console.error('Week1MathScene: Error updating enemy dot on minimap:', error);
                    }
                });
            }
        } catch (error) {
            console.error('Week1MathScene: Error updating minimap:', error);
        }
    }

    showCombatEndScreen(stats) {
        this.isGameActive = false;
        
        // Create end screen overlay
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.8);
        overlay.fillRect(0, 0, this.scale.width, this.scale.height);
        overlay.setDepth(500);
        overlay.setScrollFactor(0);
        
        // End screen content
        const endText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 100,
            '🏆 COMBAT COMPLETE! 🏆\n\n' +
            `Final Score: ${this.score}\n` +
            `Enemies Defeated: ${this.enemyMechsDefeated}\n` +
            `Accuracy: ${stats.accuracyRate.toFixed(1)}%\n` +
            `Total Damage Dealt: ${stats.totalDamageDealt}\n` +
            `Combos Executed: ${stats.combosExecuted}\n` +
            `Abilities Used: ${stats.abilitiesUsed}\n` +
            `Coins Earned: ${this.coinsEarned}\n\n` +
            'Press SPACE to continue or ESC to return to menu', {
            fontSize: '24px',
            fontFamily: 'Courier, monospace',
            fill: '#00ffff',
            stroke: '#000000',
            strokeThickness: 2,
            align: 'center'
        }).setOrigin(0.5).setDepth(501).setScrollFactor(0);
        
        // Save progress
        this.saveProgress(stats);
        
        // Input handling
        this.input.keyboard.once('keydown-SPACE', () => {
            this.scene.restart();
        });
        
        this.input.keyboard.once('keydown-ESC', () => {
            this.scene.start('MainMenuScene');
        });
    }

    gameOver() {
        this.isGameActive = false;
        this.realTimeCombatManager.endCombat();
        
        // Game over effects
        this.advancedParticleManager.createExplosion(this.playerMech.x, this.playerMech.y, 3);
        this.cameras.main.shake(1000, 0.02);
        this.cameras.main.fade(2000, 255, 0, 0);
        
        // Show game over screen after effects
        this.time.delayedCall(2000, () => {
            this.showGameOverScreen();
        });
    }

    showGameOverScreen() {
        const overlay = this.add.graphics();
        overlay.fillStyle(0x000000, 0.9);
        overlay.fillRect(0, 0, this.scale.width, this.scale.height);
        overlay.setDepth(500);
        overlay.setScrollFactor(0);
        
        const gameOverText = this.add.text(this.scale.width / 2, this.scale.height / 2,
            '💀 MECH DESTROYED 💀\n\n' +
            `Final Score: ${this.score}\n` +
            `Enemies Defeated: ${this.enemyMechsDefeated}\n` +
            `Survival Time: ${Math.floor((Date.now() - this.sessionStartTime) / 1000)}s\n` +
            `Coins Earned: ${this.coinsEarned}\n\n` +
            'Press R to retry or ESC to return to menu', {
            fontSize: '28px',
            fontFamily: 'Courier, monospace',
            fill: '#ff0000',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center'
        }).setOrigin(0.5).setDepth(501).setScrollFactor(0);
        
        // Input handling
        this.input.keyboard.once('keydown-R', () => {
            this.scene.restart();
        });
        
        this.input.keyboard.once('keydown-ESC', () => {
            this.scene.start('MainMenuScene');
        });
    }

    timeUp() {
        this.isGameActive = false;
        const stats = this.realTimeCombatManager.getCombatStats();
        this.realTimeCombatManager.endCombat();
        
        this.showNotification('⏰ TIME UP! ⏰', '#ff8800', 2000);
        
        this.time.delayedCall(2000, () => {
            this.showCombatEndScreen(stats);
        });
    }

    saveProgress(stats) {
        // Save game progress and statistics
        this.progressTracker.updateMathProgress({
            score: this.score,
            enemiesDefeated: this.enemyMechsDefeated,
            coinsEarned: this.coinsEarned,
            accuracy: stats.accuracyRate,
            combosExecuted: stats.combosExecuted,
            sessionTime: Date.now() - this.sessionStartTime
        });
        
        // Update player coins
        this.progressTracker.addCoins(this.coinsEarned);
        
        console.log('Progress saved successfully');
    }

    destroy() {
        // Clean up all systems
        this.objectPoolManager?.destroy();
        this.performanceMonitor?.destroy();
        this.pixelArtGenerator?.clearCache();
        this.advancedParticleManager?.clearAllParticles();
        
        // Clean up timers
        if (this.gameTimerEvent) this.gameTimerEvent.destroy();
        
        // Clean up enemy AI timers
        this.enemyMechs.forEach(enemy => {
            if (enemy.aiTimer) enemy.aiTimer.destroy();
        });
        
        // Clean up arena elements
        this.battleArenaElements?.forEach(element => element.destroy());
        this.energyBarriers?.forEach(barrier => barrier.destroy());
        
        super.destroy();
    }
} 