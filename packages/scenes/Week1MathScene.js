import { Scene } from "phaser";
import { UIManager } from "../utils/systems/UIManager.js";
import { MathIntegrationSystem } from "../utils/systems/MathIntegrationSystem.js";
import { InputController } from "../utils/systems/InputController.js";
import { ProgressTracker } from "../utils/managers/index.js";

export class Week1MathScene extends Scene {
    constructor() {
        super("Week1MathScene");
        
        // Initialize progress tracker
        this.progressTracker = new ProgressTracker();
        
        // Game state
        this.score = 0;
        this.gameTimer = 180; // 3 minutes
        this.isGameActive = false;
        this.isPaused = false;
        this.wave = 1;
        this.maxWaves = 6;
        
        // Math state
        this.mathPower = 0;
        this.maxMathPower = 100;
        this.streak = 0;
        this.questionsAnswered = 0;
        this.correctAnswers = 0;
        this.maxStreak = 0;
        
        // 🤖 COMBAT SYSTEM - Character Stats
        this.characterStats = {
            attackPower: 1.0,    // Score multiplier for correct answers
            defense: 0,          // Damage reduction for wrong answers
            speed: 30,           // Base time per question (seconds)
            accuracy: 0,         // Hint/assistance level
            luck: 0,             // Coin/loot bonus
            energy: 100,         // Special ability power
            intelligence: 0      // Advanced strategy unlocks
        };
        
        // 🤖 COMBAT SYSTEM - Robot Combat
        this.playerRobot = null;
        this.enemyRobot = null;
        this.currentEnemy = null;
        this.combatActive = false;
        this.enemyHealth = 100;
        this.maxEnemyHealth = 100;
        this.combatAnimations = [];
        this.damageNumbers = [];
        
        // 🤖 COMBAT SYSTEM - Equipment Effects
        this.equippedItems = {
            weapon: null,
            shield: null,
            tech: null,
            core: null
        };
        
        // Game objects
        this.player = null;
        this.playerGlow = null;
        this.enemies = [];
        this.bullets = [];
        this.particles = [];
        
        // UI elements
        this.scoreText = null;
        this.timerText = null;
        this.waveText = null;
        this.accuracyText = null;
        this.healthBar = null;
        this.healthBarBg = null;
        this.mathPowerBar = null;
        this.mathPowerBarBg = null;
        this.streakText = null;
        
        // 🤖 COMBAT SYSTEM - Combat UI
        this.enemyHealthBar = null;
        this.enemyHealthBarBg = null;
        this.combatStatsDisplay = null;
        this.damageNumbersGroup = null;
        
        // Math quiz state
        this.currentQuestion = null;
        this.mathQuizActive = false;
        this.mathQuizBg = null;
        this.mathQuizBgGlow = null;
        this.mathQuizQuestion = null;
        this.mathQuizChoices = [];
        this.mathQuizInstructions = null;
        this.mathQuizTimerBar = null;
        this.mathQuizTimerBg = null;
        this.mathQuizTimeLeft = 10000;
        this.mathQuizStartTime = 0;
        
        // Input
        this.cursors = null;
        this.wasd = null;
        this.spaceKey = null;
        this.numberKeys = null;
        
        // Timers
        this.enemySpawnTimer = 0;
        this.mathQuizTimer = 0;
        this.gameTimerCounter = 0;
        
        // Arena bounds
        this.arenaX = 112;
        this.arenaY = 84;
        this.arenaWidth = 800;
        this.arenaHeight = 600;
        
        // Audio system
        this.audioContext = null;
        this.hasAudio = false;
        
        // Player state
        this.playerHealth = 100;
        this.maxPlayerHealth = 100;
        this.playerEnergy = 100;
        this.maxPlayerEnergy = 100;
        this.playerShield = 50;
        this.maxPlayerShield = 50;
        
        // System instances
        this.uiManager = null;
        this.mathSystem = null;
        this.inputController = null;
        
        console.log('Week1MathScene: Initialization complete with Combat System');
    }

    create() {
        console.log('Week1MathScene: Starting scene creation...');
        
        try {
            // Initialize character stats from progress tracker
            this.initializeCharacterStats();
            
            // Initialize audio
            this.initializeAudio();
            
            // Create background and arena
            this.createBackground();
            this.createArena();
            
            // 🤖 COMBAT SYSTEM - Create robots
            this.createPlayerRobot();
            this.createEnemyRobot();
            
            // Create player (keep for compatibility)
            this.createPlayer();
            
            // Create UI
            this.createUI();
            this.createCombatUI();
            
            // Set up input
            this.setupInput();
            
            // Initialize game systems
            this.initializeSystems();
            
            // Set up event listeners
            this.setupEventListeners();
            
            // Start game
            this.startGame();
            
            console.log('Week1MathScene: Scene creation complete with Combat System!');
            
        } catch (error) {
            console.error('Week1MathScene: Error in create():', error);
            this.createErrorScreen(error);
        }
    }

    // 🤖 COMBAT SYSTEM - Initialize character stats from progress tracker
    initializeCharacterStats() {
        console.log('Week1MathScene: Initializing character stats...');
        
        try {
            const character = this.progressTracker.getCharacter();
            const charType = this.progressTracker.getCharacterType();
            const progress = this.progressTracker.getProgressSummary();
            
            if (character && charType) {
                // Base stats from character type
                this.characterStats = {
                    attackPower: 1.0 + (charType.baseStats?.attack || 0) * 0.1,
                    defense: (charType.baseStats?.defense || 0) * 5,
                    speed: 30 + (charType.baseStats?.speed || 0) * 2,
                    accuracy: (charType.baseStats?.accuracy || 0) * 10,
                    luck: (charType.baseStats?.luck || 0) * 5,
                    energy: 100 + (charType.baseStats?.energy || 0) * 10,
                    intelligence: (charType.baseStats?.intelligence || 0) * 5
                };
                
                // Apply equipment bonuses
                this.applyEquipmentBonuses();
                
                console.log('Week1MathScene: Character stats initialized:', this.characterStats);
            } else {
                console.warn('Week1MathScene: No character found, using default stats');
            }
        } catch (error) {
            console.error('Week1MathScene: Error initializing character stats:', error);
        }
    }

    // 🤖 COMBAT SYSTEM - Apply equipment bonuses to stats
    applyEquipmentBonuses() {
        try {
            const progress = this.progressTracker.getProgressSummary();
            const equippedItems = progress.equippedItems || {};
            
            // Apply weapon bonuses
            if (equippedItems.weapon) {
                switch (equippedItems.weapon.id) {
                    case 'plasma_sword':
                        this.characterStats.attackPower += 0.25;
                        break;
                    case 'neural_disruptor':
                        this.characterStats.attackPower += 0.5;
                        break;
                    case 'quantum_cannon':
                        this.characterStats.attackPower += 1.0;
                        break;
                }
            }
            
            // Apply shield bonuses
            if (equippedItems.shield) {
                switch (equippedItems.shield.id) {
                    case 'energy_barrier':
                        this.characterStats.defense += 25;
                        break;
                    case 'adaptive_armor':
                        this.characterStats.defense += 35;
                        break;
                    case 'quantum_shield':
                        this.characterStats.defense += 50;
                        break;
                }
            }
            
            // Apply tech bonuses
            if (equippedItems.tech) {
                switch (equippedItems.tech.id) {
                    case 'hint_scanner':
                        this.characterStats.accuracy += 25;
                        break;
                    case 'time_dilator':
                        this.characterStats.speed += 15;
                        break;
                    case 'answer_analyzer':
                        this.characterStats.accuracy += 35;
                        break;
                }
            }
            
            // Apply core bonuses
            if (equippedItems.core) {
                switch (equippedItems.core.id) {
                    case 'xp_amplifier':
                        this.characterStats.intelligence += 50;
                        break;
                    case 'coin_magnet':
                        this.characterStats.luck += 100;
                        break;
                    case 'streak_keeper':
                        this.characterStats.energy += 50;
                        break;
                }
            }
            
            console.log('Week1MathScene: Equipment bonuses applied:', this.characterStats);
        } catch (error) {
            console.error('Week1MathScene: Error applying equipment bonuses:', error);
        }
    }

    // 🤖 COMBAT SYSTEM - Create player robot
    createPlayerRobot() {
        console.log('Week1MathScene: Creating player robot...');
        
        try {
            const charType = this.progressTracker.getCharacterType();
            
            // Create robot container
            this.playerRobot = this.add.container(200, 400);
            
            // Create robot graphic based on character type
            const robotGraphic = this.createRobotGraphic(0, 0, charType || { 
                id: 'default', 
                baseColor: 0x00ffff, 
                accentColor: 0xff00ff,
                features: { sleek: true }
            });
            
            this.playerRobot.add(robotGraphic);
            
            // Add idle animation
            this.tweens.add({
                targets: this.playerRobot,
                y: 395,
                duration: 2000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            console.log('Week1MathScene: Player robot created successfully');
        } catch (error) {
            console.error('Week1MathScene: Error creating player robot:', error);
            // Fallback: create simple robot
            this.playerRobot = this.add.container(200, 400);
            const fallbackRobot = this.add.rectangle(0, 0, 40, 60, 0x00ffff);
            this.playerRobot.add(fallbackRobot);
        }
    }

    // 🤖 COMBAT SYSTEM - Create enemy robot
    createEnemyRobot() {
        console.log('Week1MathScene: Creating enemy robot...');
        
        try {
            // Create enemy robot container
            this.enemyRobot = this.add.container(700, 400);
            
            // Create enemy robot graphic
            const enemyGraphic = this.createEnemyRobotGraphic(0, 0);
            this.enemyRobot.add(enemyGraphic);
            
            // Add menacing idle animation
            this.tweens.add({
                targets: this.enemyRobot,
                y: 395,
                duration: 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            // Initialize enemy health
            this.enemyHealth = this.maxEnemyHealth;
            
            console.log('Week1MathScene: Enemy robot created successfully');
        } catch (error) {
            console.error('Week1MathScene: Error creating enemy robot:', error);
            // Fallback: create simple enemy
            this.enemyRobot = this.add.container(700, 400);
            const fallbackEnemy = this.add.rectangle(0, 0, 40, 60, 0xff0000);
            this.enemyRobot.add(fallbackEnemy);
        }
    }

    // 🤖 COMBAT SYSTEM - Create robot graphic (reuse from EducationalMenuScene)
    createRobotGraphic(x, y, charType) {
        console.log(`Creating robot graphic for ${charType.id || 'default'} at (${x}, ${y})`);
        
        // Create main container for the robot
        const robotContainer = this.add.container(x, y);
        
        // Robot specifications based on character type
        const robotSpecs = this.getRobotSpecifications(charType);
        
        // Create robot components
        this.createRobotBase(robotContainer, robotSpecs);
        this.createRobotTorso(robotContainer, robotSpecs);
        this.createRobotHead(robotContainer, robotSpecs);
        this.createRobotWeapons(robotContainer, robotSpecs);
        
        return robotContainer;
    }

    // 🤖 COMBAT SYSTEM - Get robot specifications
    getRobotSpecifications(charType) {
        const baseSpecs = {
            scale: 0.8,
            primaryColor: charType.baseColor || 0x00ffff,
            accentColor: charType.accentColor || 0xff00ff,
            glowColor: charType.accentColor || 0xff00ff,
            size: { width: 50, height: 70 }
        };

        switch (charType.id) {
            case 'aria':
                return {
                    ...baseSpecs,
                    type: 'stealth',
                    primaryColor: 0x3b82f6,
                    accentColor: 0x00ffff,
                    features: { sleek: true, angular: true }
                };
                
            case 'titan':
                return {
                    ...baseSpecs,
                    type: 'heavy',
                    primaryColor: 0xef4444,
                    accentColor: 0xffa500,
                    features: { bulky: true, armored: true }
                };
                
            case 'nexus':
                return {
                    ...baseSpecs,
                    type: 'tech',
                    primaryColor: 0x10b981,
                    accentColor: 0xfbbf24,
                    features: { modular: true, crystalline: true }
                };
                
            default:
                return baseSpecs;
        }
    }

    // 🤖 COMBAT SYSTEM - Create robot base
    createRobotBase(container, specs) {
        const base = this.add.graphics();
        base.fillStyle(specs.primaryColor, 0.8);
        base.fillRoundedRect(-15, 20, 30, 15, 5);
        container.add(base);
    }

    // 🤖 COMBAT SYSTEM - Create robot torso
    createRobotTorso(container, specs) {
        const torso = this.add.graphics();
        torso.fillStyle(specs.primaryColor, 0.9);
        torso.fillRoundedRect(-12, -5, 24, 25, 6);
        
        // Add accent details
        torso.fillStyle(specs.accentColor, 0.8);
        torso.fillRoundedRect(-10, -3, 20, 5, 3);
        torso.fillCircle(0, 5, 4);
        
        container.add(torso);
    }

    // 🤖 COMBAT SYSTEM - Create robot head
    createRobotHead(container, specs) {
        const head = this.add.graphics();
        head.fillStyle(specs.primaryColor, 0.95);
        head.fillRoundedRect(-8, -25, 16, 15, 4);
        
        // Add visor
        head.fillStyle(specs.glowColor, 0.9);
        head.fillRoundedRect(-6, -22, 12, 4, 2);
        
        container.add(head);
    }

    // 🤖 COMBAT SYSTEM - Create robot weapons
    createRobotWeapons(container, specs) {
        // Simple weapon representation
        const weapon = this.add.graphics();
        weapon.fillStyle(specs.accentColor, 0.9);
        weapon.fillRoundedRect(15, -5, 8, 15, 2);
        container.add(weapon);
    }

    // 🤖 COMBAT SYSTEM - Create enemy robot graphic
    createEnemyRobotGraphic(x, y) {
        const robotContainer = this.add.container(x, y);
        
        // Enemy robot - menacing red design
        const specs = {
            primaryColor: 0xff0000,
            accentColor: 0xff6600,
            glowColor: 0xff0000
        };
        
        // Enemy base
        const base = this.add.graphics();
        base.fillStyle(specs.primaryColor, 0.8);
        base.fillRoundedRect(-18, 20, 36, 18, 6);
        robotContainer.add(base);
        
        // Enemy torso
        const torso = this.add.graphics();
        torso.fillStyle(specs.primaryColor, 0.9);
        torso.fillRoundedRect(-15, -8, 30, 28, 8);
        torso.fillStyle(specs.accentColor, 0.8);
        torso.fillRoundedRect(-12, -5, 24, 6, 3);
        torso.fillCircle(0, 8, 5);
        robotContainer.add(torso);
        
        // Enemy head
        const head = this.add.graphics();
        head.fillStyle(specs.primaryColor, 0.95);
        head.fillRoundedRect(-10, -30, 20, 18, 5);
        head.fillStyle(specs.glowColor, 1.0);
        head.fillRoundedRect(-8, -27, 16, 5, 2);
        robotContainer.add(head);
        
        // Enemy weapons
        const leftWeapon = this.add.graphics();
        leftWeapon.fillStyle(specs.accentColor, 0.9);
        leftWeapon.fillRoundedRect(-25, -5, 10, 18, 3);
        robotContainer.add(leftWeapon);
        
        const rightWeapon = this.add.graphics();
        rightWeapon.fillStyle(specs.accentColor, 0.9);
        rightWeapon.fillRoundedRect(15, -5, 10, 18, 3);
        robotContainer.add(rightWeapon);
        
        return robotContainer;
    }

    initializeAudio() {
        try {
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();
            this.hasAudio = true;
            console.log('Week1MathScene: Audio system initialized');
        } catch (error) {
            console.warn('Week1MathScene: Audio system failed to initialize:', error.message);
            this.hasAudio = false;
        }
    }

    playSound(soundType) {
        if (!this.hasAudio || !this.audioContext) return;
        
        try {
            const oscillator = this.audioContext.createOscillator();
            const gainNode = this.audioContext.createGain();
            
            oscillator.connect(gainNode);
            gainNode.connect(this.audioContext.destination);
            
            // Different frequencies for different sounds
            switch (soundType) {
                case 'correct':
                    oscillator.frequency.setValueAtTime(800, this.audioContext.currentTime);
                    break;
                case 'incorrect':
                    oscillator.frequency.setValueAtTime(200, this.audioContext.currentTime);
                    break;
                case 'shoot':
                    oscillator.frequency.setValueAtTime(400, this.audioContext.currentTime);
                    break;
                case 'hit':
                    oscillator.frequency.setValueAtTime(300, this.audioContext.currentTime);
                    break;
                default:
                    oscillator.frequency.setValueAtTime(440, this.audioContext.currentTime);
            }
            
            gainNode.gain.setValueAtTime(0.1, this.audioContext.currentTime);
            gainNode.gain.exponentialRampToValueAtTime(0.01, this.audioContext.currentTime + 0.1);
            
            oscillator.start(this.audioContext.currentTime);
            oscillator.stop(this.audioContext.currentTime + 0.1);
        } catch (audioError) {
            console.warn('Week1MathScene: Audio playback error:', audioError.message);
        }
    }

    createBackground() {
        // Enhanced background with gradient effect
        const bg = this.add.graphics();
        bg.fillGradientStyle(0x1a0033, 0x1a0033, 0x0d001a, 0x0d001a, 1);
        bg.fillRect(0, 0, this.scale.width, this.scale.height);
        
        // Add some stars for visual appeal
        for (let i = 0; i < 50; i++) {
            const star = this.add.circle(
                Math.random() * this.scale.width,
                Math.random() * this.scale.height,
                Math.random() * 2 + 1,
                0xffffff,
                Math.random() * 0.5 + 0.3
            );
            
            // Twinkling effect
            this.tweens.add({
                targets: star,
                alpha: Math.random() * 0.5 + 0.3,
                duration: Math.random() * 2000 + 1000,
                yoyo: true,
                repeat: -1
            });
        }
    }

    createPlayer() {
        // Create player (keep for compatibility with existing systems)
        this.player = this.add.circle(300, 400, 15, 0x00ff00);
        this.player.setStrokeStyle(2, 0x00ff00);
        
        // Player glow effect
        this.playerGlow = this.add.circle(300, 400, 20, 0x00ff00, 0.3);
        
        // Pulsing animation
        this.tweens.add({
            targets: this.playerGlow,
            scaleX: 1.2,
            scaleY: 1.2,
            alpha: 0.1,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createUI() {
        // Enhanced UI with better styling
        const uiStyle = {
            fontSize: '18px',
            fontFamily: 'Courier, monospace',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        };
        
        // Score with icon
        this.add.text(15, 15, '⭐', { fontSize: '24px', color: '#ffff00' });
        this.scoreText = this.add.text(45, 20, 'Score: 0', uiStyle);
        
        // Timer with icon
        this.add.text(15, 45, '⏱️', { fontSize: '20px' });
        this.timerText = this.add.text(45, 50, 'Time: 3:00', uiStyle);
        
        // Wave with icon
        this.add.text(15, 75, '🌊', { fontSize: '20px' });
        this.waveText = this.add.text(45, 80, 'Wave: 1/6', uiStyle);
        
        // Accuracy
        this.add.text(15, 105, '🎯', { fontSize: '20px' });
        this.accuracyText = this.add.text(45, 110, 'Accuracy: 0%', uiStyle);
        
        // Health bar with enhanced styling
        const healthX = this.scale.width - 120;
        this.add.text(healthX - 100, 15, '❤️ Health', { ...uiStyle, fontSize: '16px' });
        this.healthBarBg = this.add.rectangle(healthX, 35, 200, 20, 0x333333);
        this.healthBarBg.setStrokeStyle(2, 0x666666);
        this.healthBar = this.add.rectangle(healthX, 35, 200, 16, 0x00ff00);
        
        // Math power bar
        this.add.text(healthX - 100, 55, '⚡ Math Power', { ...uiStyle, fontSize: '16px' });
        this.mathPowerBarBg = this.add.rectangle(healthX, 75, 200, 20, 0x333333);
        this.mathPowerBarBg.setStrokeStyle(2, 0x666666);
        this.mathPowerBar = this.add.rectangle(healthX, 75, 0, 16, 0xffff00);
        
        // Streak counter with enhanced styling
        this.add.text(healthX - 100, 95, '🔥', { fontSize: '20px' });
        this.streakText = this.add.text(healthX - 70, 100, 'Streak: 0', { ...uiStyle, fontSize: '16px' });
        
        console.log('Week1MathScene: UI created');
    }

    setupInput() {
        this.cursors = this.input.keyboard.createCursorKeys();
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        this.numberKeys = this.input.keyboard.addKeys('ONE,TWO,THREE,FOUR');
    }

    async initializeSystems() {
        try {
            console.log('Week1MathScene: Initializing game systems...');
            
            // Initialize Input Controller
            this.inputController = new InputController(this);
            await this.inputController.init();
            console.log('Week1MathScene: Input Controller initialized');
            
            // Initialize UI Manager
            this.uiManager = new UIManager(this);
            await this.uiManager.init();
            console.log('Week1MathScene: UI Manager initialized');
            
            // Initialize Math Integration System
            this.mathSystem = new MathIntegrationSystem(this);
            await this.mathSystem.init();
            console.log('Week1MathScene: Math Integration System initialized');
            
            // Connect systems to scene events
            this.connectSystemEvents();
            
            console.log('Week1MathScene: All systems initialized successfully');
            
        } catch (error) {
            console.error('Week1MathScene: Error initializing systems:', error);
            // Fallback to basic functionality if systems fail
            this.initializeBasicSystems();
        }
    }
    
    connectSystemEvents() {
        // Connect UI Manager events
        if (this.uiManager) {
            this.events.on('gamePause', () => this.uiManager.pauseGame());
            this.events.on('gameResume', () => this.uiManager.resumeGame());
            this.events.on('playerHealthChanged', (data) => this.uiManager.emit('playerHealthChanged', data));
            this.events.on('mathPowerChanged', (data) => this.uiManager.emit('mathPowerChanged', data));
            this.events.on('streakChanged', (data) => this.uiManager.emit('streakChanged', data));
        }
        
        // Connect Math System events
        if (this.mathSystem) {
            this.events.on('enemySpawned', (data) => this.mathSystem.emit('enemySpawned', data));
            this.events.on('playerHealthLow', (data) => this.mathSystem.emit('playerHealthLow', data));
            this.events.on('bossEncounter', (data) => this.mathSystem.emit('bossEncounter', data));
            this.events.on('powerUpRequested', (data) => this.mathSystem.emit('powerUpRequested', data));
        }
        
        // Connect Input Controller events
        if (this.inputController) {
            this.inputController.on('gamePause', () => this.togglePause());
        }
    }
    
    initializeBasicSystems() {
        console.log('Week1MathScene: Initializing basic fallback systems');
        // Basic pause functionality without advanced systems
        this.basicPauseEnabled = true;
    }

    setupEventListeners() {
        // Pause/Resume events
        this.input.keyboard.on('keydown-ESC', this.togglePause, this);
        this.input.keyboard.on('keydown-P', this.togglePause, this);
        
        // Math system events
        this.events.on('mathAnswerCorrect', this.onMathAnswerCorrect, this);
        this.events.on('mathAnswerIncorrect', this.onMathAnswerIncorrect, this);
        this.events.on('playerHealthRestore', this.onPlayerHealthRestore, this);
        this.events.on('playerEnergyRestore', this.onPlayerEnergyRestore, this);
        this.events.on('playerDamage', this.onPlayerDamage, this);
        this.events.on('showFloatingText', this.onShowFloatingText, this);
        
        console.log('Week1MathScene: Event listeners set up');
    }

    togglePause() {
        if (this.isPaused) {
            this.resumeGame();
        } else {
            this.pauseGame();
        }
    }

    pauseGame() {
        if (this.isPaused || !this.isGameActive) return;
        
        this.isPaused = true;
        this.physics.pause();
        
        // Emit pause event to UI Manager
        this.events.emit('gamePause');
        
        console.log('Week1MathScene: Game paused');
    }

    resumeGame() {
        if (!this.isPaused) return;
        
        this.isPaused = false;
        this.physics.resume();
        
        // Emit resume event to UI Manager
        this.events.emit('gameResume');
        
        console.log('Week1MathScene: Game resumed');
    }

    // 🤖 COMBAT SYSTEM - Enhanced math answer handling
    onMathAnswerCorrect(data) {
        console.log('Week1MathScene: Correct answer with combat integration!', data);
        
        try {
            // Calculate damage based on character stats
            const baseDamage = 25;
            const damage = Math.floor(baseDamage * this.characterStats.attackPower);
            const bonusScore = Math.floor(50 * this.characterStats.attackPower) + (this.streak * 10);
            
            // Apply damage to enemy
            this.enemyHealth = Math.max(0, this.enemyHealth - damage);
            this.updateEnemyHealthBar();
            
            // Update game stats
            this.correctAnswers++;
            this.questionsAnswered++;
            this.streak++;
            this.maxStreak = Math.max(this.maxStreak, this.streak);
            this.score += bonusScore;
            
            // 🤖 COMBAT ANIMATION - Player robot attacks
            this.performPlayerAttack(damage);
            
            // Create floating damage number
            this.createFloatingDamageNumber(this.enemyRobot.x, this.enemyRobot.y - 50, damage, '#ff6600');
            
            // Create floating score text
            this.createFloatingText(this.playerRobot.x, this.playerRobot.y - 50, `+${bonusScore}`, '#00ff00', '18px');
            
            // Award XP with intelligence bonus
            const xpGain = Math.floor(10 * (1 + this.characterStats.intelligence / 100));
            this.progressTracker.recordAnswer('math', true, data.timeSpent || 5, data.difficulty || 'medium');
            
            // Play success sound
            this.playSound('correct');
            
            // Check if enemy is defeated
            if (this.enemyHealth <= 0) {
                this.onEnemyDefeated();
            }
            
            // Update UI
            this.updateUI();
            
            console.log(`Combat result: ${damage} damage dealt, ${bonusScore} score gained, ${xpGain} XP`);
            
        } catch (error) {
            console.error('Week1MathScene: Error in onMathAnswerCorrect:', error);
        }
    }

    onMathAnswerIncorrect(data) {
        console.log('Week1MathScene: Incorrect answer with combat integration!', data);
        
        try {
            // Calculate penalty with defense reduction
            const basePenalty = 50;
            const actualPenalty = Math.max(10, basePenalty - this.characterStats.defense);
            
            // Apply penalty
            this.score = Math.max(0, this.score - actualPenalty);
            this.questionsAnswered++;
            this.streak = 0; // Reset streak unless player has streak keeper
            
            // Check for streak keeper equipment
            const progress = this.progressTracker.getProgressSummary();
            const equippedItems = progress.equippedItems || {};
            if (equippedItems.core?.id === 'streak_keeper') {
                this.streak = Math.max(1, this.streak); // Maintain at least 1 streak
                this.createFloatingText(this.playerRobot.x, this.playerRobot.y - 30, 'STREAK SAVED!', '#ffd700', '14px');
            }
            
            // 🤖 COMBAT ANIMATION - Enemy robot attacks player
            this.performEnemyAttack(actualPenalty);
            
            // Create floating penalty number
            this.createFloatingDamageNumber(this.playerRobot.x, this.playerRobot.y - 50, actualPenalty, '#ff0000');
            
            // Record the attempt
            this.progressTracker.recordAnswer('math', false, data.timeSpent || 5, data.difficulty || 'medium');
            
            // Play failure sound
            this.playSound('incorrect');
            
            // Update UI
            this.updateUI();
            
            console.log(`Combat result: ${actualPenalty} penalty applied (reduced from ${basePenalty} by ${this.characterStats.defense} defense)`);
            
        } catch (error) {
            console.error('Week1MathScene: Error in onMathAnswerIncorrect:', error);
        }
    }

    // 🤖 COMBAT SYSTEM - Player robot attack animation
    performPlayerAttack(damage) {
        console.log(`Player robot attacking for ${damage} damage!`);
        
        // Attack animation
        this.tweens.add({
            targets: this.playerRobot,
            x: this.playerRobot.x + 100,
            duration: 200,
            ease: 'Power2.easeOut',
            yoyo: true,
            onComplete: () => {
                // Create attack effect
                this.createAttackEffect(this.enemyRobot.x - 30, this.enemyRobot.y, '#00ffff');
                
                // Enemy hit reaction
                this.tweens.add({
                    targets: this.enemyRobot,
                    x: this.enemyRobot.x + 20,
                    duration: 100,
                    yoyo: true,
                    ease: 'Power2.easeOut'
                });
                
                // Screen shake for impact
                this.cameras.main.shake(200, 0.01);
            }
        });
    }

    // 🤖 COMBAT SYSTEM - Enemy robot attack animation
    performEnemyAttack(penalty) {
        console.log(`Enemy robot attacking for ${penalty} penalty!`);
        
        // Enemy attack animation
        this.tweens.add({
            targets: this.enemyRobot,
            x: this.enemyRobot.x - 100,
            duration: 200,
            ease: 'Power2.easeOut',
            yoyo: true,
            onComplete: () => {
                // Create attack effect
                this.createAttackEffect(this.playerRobot.x + 30, this.playerRobot.y, '#ff0000');
                
                // Player hit reaction
                this.tweens.add({
                    targets: this.playerRobot,
                    x: this.playerRobot.x - 20,
                    duration: 100,
                    yoyo: true,
                    ease: 'Power2.easeOut'
                });
                
                // Screen shake for impact
                this.cameras.main.shake(150, 0.008);
            }
        });
    }

    // 🤖 COMBAT SYSTEM - Create attack effect
    createAttackEffect(x, y, color) {
        const effect = this.add.graphics();
        effect.fillStyle(Phaser.Display.Color.HexStringToColor(color).color, 0.8);
        effect.fillCircle(x, y, 20);
        
        // Expand and fade effect
        this.tweens.add({
            targets: effect,
            scaleX: 3,
            scaleY: 3,
            alpha: 0,
            duration: 300,
            ease: 'Power2.easeOut',
            onComplete: () => effect.destroy()
        });
        
        // Add particles
        for (let i = 0; i < 8; i++) {
            const particle = this.add.circle(x, y, 3, Phaser.Display.Color.HexStringToColor(color).color);
            const angle = (i / 8) * Math.PI * 2;
            const distance = 50;
            
            this.tweens.add({
                targets: particle,
                x: x + Math.cos(angle) * distance,
                y: y + Math.sin(angle) * distance,
                alpha: 0,
                duration: 400,
                ease: 'Power2.easeOut',
                onComplete: () => particle.destroy()
            });
        }
    }

    // 🤖 COMBAT SYSTEM - Create floating damage number
    createFloatingDamageNumber(x, y, damage, color) {
        const damageText = this.add.text(x, y, `-${damage}`, {
            fontSize: '20px',
            fontFamily: 'Courier, monospace',
            fill: color,
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: damageText,
            y: y - 50,
            alpha: 0,
            duration: 1000,
            ease: 'Power2.easeOut',
            onComplete: () => damageText.destroy()
        });
    }

    // 🤖 COMBAT SYSTEM - Handle enemy defeat
    onEnemyDefeated() {
        console.log('Enemy robot defeated! Victory!');
        
        // Victory animation
        this.tweens.add({
            targets: this.enemyRobot,
            alpha: 0.3,
            scaleX: 0.8,
            scaleY: 0.8,
            duration: 500,
            ease: 'Power2.easeOut'
        });
        
        // Victory text
        this.createFloatingText(this.enemyRobot.x, this.enemyRobot.y - 80, 'DEFEATED!', '#ff6600', '24px');
        
        // Award bonus XP and coins
        const bonusXP = Math.floor(50 * (1 + this.characterStats.intelligence / 100));
        const bonusCoins = Math.floor(25 * (1 + this.characterStats.luck / 100));
        
        this.progressTracker.addExperience(bonusXP);
        this.progressTracker.addCoins(bonusCoins);
        
        // Show rewards
        this.createFloatingText(this.scale.width / 2, 200, `+${bonusXP} XP  +${bonusCoins} Coins`, '#ffd700', '18px');
        
        // Spawn new enemy after delay
        this.time.delayedCall(2000, () => {
            this.spawnNewEnemy();
        });
    }

    // 🤖 COMBAT SYSTEM - Spawn new enemy
    spawnNewEnemy() {
        console.log('Spawning new enemy robot...');
        
        // Reset enemy health
        this.enemyHealth = this.maxEnemyHealth;
        this.updateEnemyHealthBar();
        
        // Reset enemy appearance
        this.enemyRobot.setAlpha(1);
        this.enemyRobot.setScale(1);
        
        // Entrance animation
        this.enemyRobot.setX(900);
        this.tweens.add({
            targets: this.enemyRobot,
            x: 700,
            duration: 500,
            ease: 'Power2.easeOut'
        });
        
        // Announcement
        this.createFloatingText(this.scale.width / 2, 150, 'NEW CHALLENGER!', '#ff0000', '20px');
    }

    // Helper method for floating text
    createFloatingText(x, y, text, color = '#ffffff', fontSize = '16px') {
        const floatingText = this.add.text(x, y, text, {
            fontSize: fontSize,
            fontFamily: 'Courier, monospace',
            fill: color,
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Animate the floating text
        this.tweens.add({
            targets: floatingText,
            y: y - 50,
            alpha: 0,
            duration: 1500,
            ease: 'Power2.easeOut',
            onComplete: () => {
                floatingText.destroy();
            }
        });
    }

    update(time, delta) {
        if (!this.isGameActive || this.isPaused) return;
        
        try {
            // Update game timer
            this.updateGameTimer(delta);
            
            // Update player
            this.updatePlayer(time, delta);
            
            // Update enemies
            this.updateEnemies(time, delta);
            
            // Update bullets
            this.updateBullets(time, delta);
            
            // Update particles
            this.updateParticles(time, delta);
            
            // Update UI
            this.updateUI();
            
            // Check for enemy spawning
            this.checkEnemySpawning(time);
            
            // Check for math quiz
            this.checkMathQuiz(time);
            
            // Check collisions
            this.checkCollisions();
            
        } catch (error) {
            console.error('Week1MathScene: Error in update():', error);
        }
    }

    updateGameTimer(delta) {
        this.gameTimerCounter += delta;
        this.gameTimer = Math.max(0, 180 - (this.gameTimerCounter / 1000));
        
        if (this.gameTimer <= 0) {
            this.endGame();
        }
    }

    updatePlayer(time, delta) {
        if (!this.player) return;
        
        const speed = this.player.speed * (delta / 1000);
        
        // Movement
        if (this.cursors.left.isDown || this.wasd.A.isDown) {
            this.player.x = Math.max(this.arenaX + 20, this.player.x - speed);
        }
        if (this.cursors.right.isDown || this.wasd.D.isDown) {
            this.player.x = Math.min(this.arenaX + this.arenaWidth - 20, this.player.x + speed);
        }
        if (this.cursors.up.isDown || this.wasd.W.isDown) {
            this.player.y = Math.max(this.arenaY + 20, this.player.y - speed);
        }
        if (this.cursors.down.isDown || this.wasd.S.isDown) {
            this.player.y = Math.min(this.arenaY + this.arenaHeight - 20, this.player.y + speed);
        }
        
        // Update player glow position
        if (this.playerGlow) {
            this.playerGlow.x = this.player.x;
            this.playerGlow.y = this.player.y;
        }
        
        // Shooting
        if (this.spaceKey.isDown && time - this.player.lastShot > this.player.fireRate) {
            this.shootBullet();
            this.player.lastShot = time;
            this.playSound('shoot');
        }
    }

    shootBullet() {
        // Enhanced bullet with math power effects
        const bullet = this.add.circle(this.player.x, this.player.y - 20, 4, 0x00ff88);
        bullet.speed = 500;
        bullet.damage = 20;
        
        // Math power boost
        if (this.mathPower > 50) {
            bullet.setFillStyle(0x00ffff);
            bullet.damage = 30;
            bullet.setScale(1.5);
        }
        
        // Add bullet glow
        const bulletGlow = this.add.circle(this.player.x, this.player.y - 20, 8, 0x00ff88, 0.3);
        bullet.glow = bulletGlow;
        
        this.bullets.push(bullet);
    }

    updateBullets(time, delta) {
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            bullet.y -= bullet.speed * (delta / 1000);
            
            // Update bullet glow
            if (bullet.glow) {
                bullet.glow.x = bullet.x;
                bullet.glow.y = bullet.y;
            }
            
            // Remove bullets that are off screen
            if (bullet.y < this.arenaY - 50) {
                if (bullet.glow) bullet.glow.destroy();
                bullet.destroy();
                this.bullets.splice(i, 1);
            }
        }
    }

    spawnEnemy() {
        if (!this.isGameActive) return;
        
        const enemyX = this.arenaX + Math.random() * this.arenaWidth;
        const enemyY = this.arenaY - 20;
        
        // Enhanced enemy with different types
        const enemyTypes = [
            { color: 0xff4444, health: 40, speed: 50, points: 100 },
            { color: 0xff8844, health: 60, speed: 40, points: 150 },
            { color: 0xff44ff, health: 80, speed: 30, points: 200 }
        ];
        
        const enemyType = enemyTypes[Math.floor(Math.random() * enemyTypes.length)];
        const enemy = this.add.rectangle(enemyX, enemyY, 30, 30, enemyType.color);
        
        enemy.health = enemyType.health;
        enemy.maxHealth = enemyType.health;
        enemy.speed = enemyType.speed + Math.random() * 30;
        enemy.points = enemyType.points;
        enemy.setStrokeStyle(2, 0xffffff);
        
        // Add enemy glow
        const enemyGlow = this.add.circle(enemyX, enemyY, 20, enemyType.color, 0.3);
        enemy.glow = enemyGlow;
        
        this.enemies.push(enemy);
        
        // Emit enemy spawned event for math system
        this.events.emit('enemySpawned', {
            x: enemyX,
            y: enemyY,
            type: enemyType,
            id: enemy.id || Date.now()
        });
        
        // Schedule next enemy spawn
        const spawnDelay = Math.max(800, 2500 - (this.wave * 200));
        this.time.delayedCall(spawnDelay, () => {
            this.spawnEnemy();
        });
    }

    updateEnemies(time, delta) {
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            enemy.y += enemy.speed * (delta / 1000);
            
            // Update enemy glow
            if (enemy.glow) {
                enemy.glow.x = enemy.x;
                enemy.glow.y = enemy.y;
            }
            
            // Remove enemies that are off screen
            if (enemy.y > this.arenaY + this.arenaHeight + 50) {
                if (enemy.glow) enemy.glow.destroy();
                enemy.destroy();
                this.enemies.splice(i, 1);
            }
        }
    }

    updateParticles(time, delta) {
        for (let i = this.particles.length - 1; i >= 0; i--) {
            const particle = this.particles[i];
            particle.life -= delta;
            
            if (particle.life <= 0) {
                particle.object.destroy();
                this.particles.splice(i, 1);
            } else {
                // Update particle position
                particle.object.x += particle.vx * (delta / 1000);
                particle.object.y += particle.vy * (delta / 1000);
                particle.object.alpha = particle.life / particle.maxLife;
            }
        }
    }

    checkCollisions() {
        // Bullet vs Enemy collisions
        for (let i = this.bullets.length - 1; i >= 0; i--) {
            const bullet = this.bullets[i];
            
            for (let j = this.enemies.length - 1; j >= 0; j--) {
                const enemy = this.enemies[j];
                
                const distance = Phaser.Math.Distance.Between(
                    bullet.x, bullet.y, enemy.x, enemy.y
                );
                
                if (distance < 25) {
                    // Hit!
                    enemy.health -= bullet.damage;
                    
                    // Create hit effect
                    this.createHitEffect(enemy.x, enemy.y);
                    this.playSound('hit');
                    
                    // Remove bullet
                    if (bullet.glow) bullet.glow.destroy();
                    bullet.destroy();
                    this.bullets.splice(i, 1);
                    
                    // Check if enemy is destroyed
                    if (enemy.health <= 0) {
                        this.score += enemy.points;
                        this.createExplosionEffect(enemy.x, enemy.y);
                        if (enemy.glow) enemy.glow.destroy();
                        enemy.destroy();
                        this.enemies.splice(j, 1);
                    }
                    
                    break;
                }
            }
        }
        
        // Enemy vs Player collisions
        for (let i = this.enemies.length - 1; i >= 0; i--) {
            const enemy = this.enemies[i];
            
            const distance = Phaser.Math.Distance.Between(
                this.player.x, this.player.y, enemy.x, enemy.y
            );
            
            if (distance < 35) {
                // Player hit!
                this.playerHealth -= 15;
                this.createDamageEffect();
                
                // Remove enemy
                if (enemy.glow) enemy.glow.destroy();
                enemy.destroy();
                this.enemies.splice(i, 1);
                
                // Check if player is dead
                if (this.playerHealth <= 0) {
                    this.endGame();
                }
            }
        }
    }

    checkEnemySpawning(time) {
        // Enemies spawn automatically via delayed calls
    }

    checkMathQuiz(time) {
        // Start math quiz every 45 seconds (increased for better pacing)
        // Also ensure player has had some time to play before first quiz
        const quizInterval = 45000;
        const firstQuizDelay = 10000; // Wait 10 seconds before first quiz
        
        if (!this.mathQuizActive && 
            time - this.mathQuizTimer > quizInterval && 
            time > firstQuizDelay) {
            this.startMathQuiz();
            this.mathQuizTimer = time;
        }
    }

    startMathQuiz() {
        if (this.mathQuizActive) return;
        
        this.mathQuizActive = true;
        this.timeoutHandled = false;
        this.timerPulseActive = false;
        this.currentQuestion = this.generateMathQuestion();
        this.showMathQuizUI();
        
        console.log('Math Quiz:', this.currentQuestion.question);
    }

    generateMathQuestion() {
        const operations = ['+', '-', '*'];
        const operation = operations[Math.floor(Math.random() * operations.length)];
        
        let a, b, answer, question;
        
        switch (operation) {
            case '+':
                a = Math.floor(Math.random() * 50) + 1;
                b = Math.floor(Math.random() * 50) + 1;
                answer = a + b;
                question = `${a} + ${b} = ?`;
                break;
            case '-':
                a = Math.floor(Math.random() * 50) + 25;
                b = Math.floor(Math.random() * 25) + 1;
                answer = a - b;
                question = `${a} - ${b} = ?`;
                break;
            case '*':
                a = Math.floor(Math.random() * 12) + 1;
                b = Math.floor(Math.random() * 12) + 1;
                answer = a * b;
                question = `${a} × ${b} = ?`;
                break;
        }
        
        // Generate wrong answers
        const choices = [answer];
        while (choices.length < 4) {
            const wrong = answer + Math.floor(Math.random() * 20) - 10;
            if (wrong > 0 && !choices.includes(wrong)) {
                choices.push(wrong);
            }
        }
        
        // Shuffle choices
        for (let i = choices.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [choices[i], choices[j]] = [choices[j], choices[i]];
        }
        
        return {
            question,
            answer,
            choices,
            correctIndex: choices.indexOf(answer)
        };
    }

    showMathQuizUI() {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;
        
        // Background - start invisible for animation
        this.mathQuizBg = this.add.rectangle(centerX, centerY, 450, 350, 0x000000, 0.9);
        this.mathQuizBg.setStrokeStyle(4, 0x00ffff, 0.8);
        this.mathQuizBg.setAlpha(0);
        this.mathQuizBg.setScale(0.8);
        
        // Background glow - start invisible
        this.mathQuizBgGlow = this.add.rectangle(centerX, centerY, 460, 360, 0x00ffff, 0.1);
        this.mathQuizBgGlow.setAlpha(0);
        this.mathQuizBgGlow.setScale(0.8);
        
        // Question - start invisible and scaled down
        this.mathQuizQuestion = this.add.text(centerX, centerY - 100, this.currentQuestion.question, {
            fontSize: '36px',
            fontFamily: 'Courier, monospace',
            color: '#ffffff',
            stroke: '#00ffff',
            strokeThickness: 2
        }).setOrigin(0.5);
        this.mathQuizQuestion.setAlpha(0);
        this.mathQuizQuestion.setScale(0.5);
        
        // Choices - start invisible and offset
        this.mathQuizChoices = [];
        for (let i = 0; i < 4; i++) {
            const choiceY = centerY - 30 + (i * 45);
            
            // Choice background
            const choiceBg = this.add.rectangle(centerX, choiceY, 300, 35, 0x333333, 0.8);
            choiceBg.setStrokeStyle(2, 0xffff00);
            choiceBg.setAlpha(0);
            choiceBg.setX(centerX - 100); // Start offset to the left
            
            const choice = this.add.text(centerX, choiceY, `${i + 1}. ${this.currentQuestion.choices[i]}`, {
                fontSize: '22px',
                fontFamily: 'Courier, monospace',
                color: '#ffff00',
                stroke: '#000000',
                strokeThickness: 2
            }).setOrigin(0.5);
            choice.setAlpha(0);
            choice.setX(centerX - 100); // Start offset to the left
            
            this.mathQuizChoices.push({ text: choice, bg: choiceBg });
        }
        
        // Instructions - start invisible
        this.mathQuizInstructions = this.add.text(centerX, centerY + 120, 'Press 1, 2, 3, or 4 to answer quickly!', {
            fontSize: '18px',
            fontFamily: 'Courier, monospace',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        this.mathQuizInstructions.setAlpha(0);
        this.mathQuizInstructions.setY(centerY + 150); // Start lower
        
        // Timer bar - start invisible
        this.mathQuizTimerBg = this.add.rectangle(centerX, centerY + 150, 400, 10, 0x333333);
        this.mathQuizTimerBar = this.add.rectangle(centerX, centerY + 150, 400, 10, 0x00ff00);
        this.mathQuizTimerBg.setAlpha(0);
        this.mathQuizTimerBar.setAlpha(0);
        
        // Smooth entrance animation sequence
        this.createQuizEntranceAnimation();
        
        // Set up input handlers
        this.setupMathQuizInput();
        
        // Start timer countdown
        this.mathQuizTimeLeft = 15000; // Increased to 15 seconds for better UX
        this.mathQuizStartTime = this.time.now;
    }

    createQuizEntranceAnimation() {
        // Animate background first
        this.tweens.add({
            targets: [this.mathQuizBg, this.mathQuizBgGlow],
            alpha: 1,
            scale: 1,
            duration: 400,
            ease: 'Back.easeOut',
            onComplete: () => {
                // Then animate question
                this.tweens.add({
                    targets: this.mathQuizQuestion,
                    alpha: 1,
                    scale: 1,
                    duration: 300,
                    ease: 'Back.easeOut',
                    onComplete: () => {
                        // Start pulsing effect for question
                        this.tweens.add({
                            targets: this.mathQuizQuestion,
                            scaleX: 1.05,
                            scaleY: 1.05,
                            duration: 1000,
                            yoyo: true,
                            repeat: -1,
                            ease: 'Sine.easeInOut'
                        });
                        
                        // Animate choices with stagger
                        this.mathQuizChoices.forEach((choice, index) => {
                            this.tweens.add({
                                targets: [choice.bg, choice.text],
                                alpha: 1,
                                x: this.scale.width / 2,
                                duration: 250,
                                delay: index * 100,
                                ease: 'Power2.easeOut'
                            });
                        });
                        
                        // Finally animate instructions and timer
                        this.tweens.add({
                            targets: this.mathQuizInstructions,
                            alpha: 1,
                            y: this.scale.height / 2 + 120,
                            duration: 300,
                            delay: 400,
                            ease: 'Power2.easeOut'
                        });
                        
                        this.tweens.add({
                            targets: [this.mathQuizTimerBg, this.mathQuizTimerBar],
                            alpha: 1,
                            duration: 300,
                            delay: 500,
                            ease: 'Power2.easeOut'
                        });
                    }
                });
            }
        });
    }

    setupMathQuizInput() {
        const handleAnswer = (selectedIndex) => {
            if (!this.mathQuizActive) return;
            
            const isCorrect = selectedIndex === this.currentQuestion.correctIndex;
            const timeSpent = this.time.now - this.mathQuizStartTime;
            
            // Show immediate visual feedback before hiding UI
            this.showAnswerFeedback(selectedIndex, isCorrect);
            
            // Use the proper event handlers for consistent tracking
            if (isCorrect) {
                this.onMathAnswerCorrect({
                    timeSpent: timeSpent,
                    difficulty: 'medium',
                    powerGained: 25
                });
            } else {
                this.onMathAnswerIncorrect({
                    timeSpent: timeSpent,
                    difficulty: 'medium',
                    powerLost: 15
                });
            }
            
            // Delay hiding UI to show feedback
            this.time.delayedCall(1500, () => {
                this.hideMathQuizUI();
            });
        };
        
        // Number key handlers
        this.numberKeys.ONE.on('down', () => handleAnswer(0));
        this.numberKeys.TWO.on('down', () => handleAnswer(1));
        this.numberKeys.THREE.on('down', () => handleAnswer(2));
        this.numberKeys.FOUR.on('down', () => handleAnswer(3));
    }

    showAnswerFeedback(selectedIndex, isCorrect) {
        // Highlight the selected answer
        const selectedChoice = this.mathQuizChoices[selectedIndex];
        if (selectedChoice) {
            const feedbackColor = isCorrect ? 0x00ff00 : 0xff0000;
            selectedChoice.bg.setFillStyle(feedbackColor, 0.8);
            selectedChoice.bg.setStrokeStyle(3, feedbackColor);
            
            // Pulse animation for selected choice
            this.tweens.add({
                targets: [selectedChoice.bg, selectedChoice.text],
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 200,
                yoyo: true,
                repeat: 2,
                ease: 'Power2.easeOut'
            });
        }
        
        // Show correct answer if wrong
        if (!isCorrect) {
            const correctChoice = this.mathQuizChoices[this.currentQuestion.correctIndex];
            if (correctChoice) {
                correctChoice.bg.setFillStyle(0x00ff00, 0.6);
                correctChoice.bg.setStrokeStyle(2, 0x00ff00);
            }
        }
        
        // Show feedback text
        const feedbackText = isCorrect ? 
            "🎯 CORRECT! Robot Attack Activated!" : 
            "❌ INCORRECT! Enemy Counter-Attack!";
        const feedbackColor = isCorrect ? '#00ff00' : '#ff0000';
        
        const feedback = this.add.text(this.scale.width / 2, this.scale.height / 2 + 180, feedbackText, {
            fontSize: '20px',
            fontFamily: 'Courier, monospace',
            color: feedbackColor,
            stroke: '#000000',
            strokeThickness: 2,
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Animate feedback text
        feedback.setAlpha(0);
        feedback.setScale(0.5);
        this.tweens.add({
            targets: feedback,
            alpha: 1,
            scale: 1,
            duration: 300,
            ease: 'Back.easeOut'
        });
        
        // Store feedback for cleanup
        this.mathQuizFeedback = feedback;
    }

    showTimeoutFeedback() {
        // Show correct answer
        const correctChoice = this.mathQuizChoices[this.currentQuestion.correctIndex];
        if (correctChoice) {
            correctChoice.bg.setFillStyle(0x00ff00, 0.6);
            correctChoice.bg.setStrokeStyle(3, 0x00ff00);
            
            // Pulse animation for correct answer
            this.tweens.add({
                targets: [correctChoice.bg, correctChoice.text],
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 300,
                yoyo: true,
                repeat: 3,
                ease: 'Power2.easeOut'
            });
        }
        
        // Show timeout feedback text
        const timeoutText = "⏰ TIME'S UP! The correct answer was highlighted.";
        
        const feedback = this.add.text(this.scale.width / 2, this.scale.height / 2 + 180, timeoutText, {
            fontSize: '18px',
            fontFamily: 'Courier, monospace',
            color: '#ffaa00',
            stroke: '#000000',
            strokeThickness: 2,
            fontStyle: 'bold',
            align: 'center'
        }).setOrigin(0.5);
        
        // Animate feedback text
        feedback.setAlpha(0);
        feedback.setScale(0.5);
        this.tweens.add({
            targets: feedback,
            alpha: 1,
            scale: 1,
            duration: 400,
            ease: 'Back.easeOut'
        });
        
        // Store feedback for cleanup
        this.mathQuizFeedback = feedback;
    }

    hideMathQuizUI() {
        this.mathQuizActive = false;
        
        // Smooth exit animation
        const elementsToHide = [
            this.mathQuizBg, 
            this.mathQuizBgGlow, 
            this.mathQuizQuestion,
            this.mathQuizInstructions,
            this.mathQuizTimerBar,
            this.mathQuizTimerBg,
            this.mathQuizFeedback
        ];
        
        // Add choice elements
        if (this.mathQuizChoices) {
            this.mathQuizChoices.forEach(choice => {
                elementsToHide.push(choice.text, choice.bg);
            });
        }
        
        // Filter out null/undefined elements
        const validElements = elementsToHide.filter(element => element);
        
        if (validElements.length > 0) {
            this.tweens.add({
                targets: validElements,
                alpha: 0,
                scale: 0.8,
                duration: 400,
                ease: 'Power2.easeIn',
                onComplete: () => {
                    // Clean up elements
                    validElements.forEach(element => {
                        if (element && element.destroy) {
                            element.destroy();
                        }
                    });
                    
                    // Reset references
                    this.mathQuizBg = null;
                    this.mathQuizBgGlow = null;
                    this.mathQuizQuestion = null;
                    this.mathQuizChoices = [];
                    this.mathQuizInstructions = null;
                    this.mathQuizTimerBar = null;
                    this.mathQuizTimerBg = null;
                    this.mathQuizFeedback = null;
                }
            });
        }
    }

    // Visual effects
    createHitEffect(x, y) {
        for (let i = 0; i < 8; i++) {
            const particle = this.add.circle(x, y, 3, 0xffff00);
            const angle = Math.random() * Math.PI * 2;
            const speed = 80 + Math.random() * 120;
            
            this.particles.push({
                object: particle,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 600,
                maxLife: 600
            });
        }
    }

    createExplosionEffect(x, y) {
        for (let i = 0; i < 15; i++) {
            const particle = this.add.circle(x, y, 4, 0xff4444);
            const angle = Math.random() * Math.PI * 2;
            const speed = 120 + Math.random() * 180;
            
            this.particles.push({
                object: particle,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1000,
                maxLife: 1000
            });
        }
        
        // Screen shake
        this.cameras.main.shake(150, 0.008);
    }

    createDamageEffect() {
        // Screen flash
        const flash = this.add.rectangle(
            this.scale.width / 2, 
            this.scale.height / 2, 
            this.scale.width, 
            this.scale.height, 
            0xff0000, 
            0.4
        );
        
        this.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 250,
            onComplete: () => flash.destroy()
        });
        
        // Camera shake
        this.cameras.main.shake(200, 0.015);
        
        // Player glow flash
        if (this.playerGlow) {
            this.tweens.add({
                targets: this.playerGlow,
                alpha: 1,
                duration: 100,
                yoyo: true,
                repeat: 2
            });
        }
    }

    createMathSuccessEffect() {
        // Green particles
        for (let i = 0; i < 20; i++) {
            const particle = this.add.circle(
                this.scale.width / 2, 
                this.scale.height / 2, 
                5, 
                0x00ff00
            );
            const angle = (i / 20) * Math.PI * 2;
            const speed = 250;
            
            this.particles.push({
                object: particle,
                vx: Math.cos(angle) * speed,
                vy: Math.sin(angle) * speed,
                life: 1200,
                maxLife: 1200
            });
        }
        
        // Screen flash
        const flash = this.add.rectangle(
            this.scale.width / 2, 
            this.scale.height / 2, 
            this.scale.width, 
            this.scale.height, 
            0x00ff00, 
            0.25
        );
        
        this.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 400,
            onComplete: () => flash.destroy()
        });
        
        // Player glow boost
        if (this.playerGlow) {
            this.tweens.add({
                targets: this.playerGlow,
                scaleX: 1.5,
                scaleY: 1.5,
                alpha: 0.8,
                duration: 300,
                yoyo: true
            });
        }
    }

    createMathFailureEffect() {
        // Red screen shake
        this.cameras.main.shake(300, 0.02);
        
        // Red flash
        const flash = this.add.rectangle(
            this.scale.width / 2, 
            this.scale.height / 2, 
            this.scale.width, 
            this.scale.height, 
            0xff0000, 
            0.4
        );
        
        this.tweens.add({
            targets: flash,
            alpha: 0,
            duration: 500,
            onComplete: () => flash.destroy()
        });
    }

    updateUI() {
        // Update score
        this.scoreText.setText(`Score: ${this.score}`);
        
        // Update timer
        const minutes = Math.floor(this.gameTimer / 60);
        const seconds = Math.floor(this.gameTimer % 60);
        this.timerText.setText(`Time: ${minutes}:${seconds.toString().padStart(2, '0')}`);
        
        // Update wave
        this.waveText.setText(`Wave: ${this.wave}/${this.maxWaves}`);
        
        // Update accuracy
        const accuracy = this.questionsAnswered > 0 ? 
            (this.correctAnswers / this.questionsAnswered) * 100 : 0;
        this.accuracyText.setText(`Accuracy: ${accuracy.toFixed(1)}%`);
        
        // Update health bar
        const healthPercent = this.playerHealth / this.maxPlayerHealth;
        this.healthBar.setDisplaySize(200 * healthPercent, 16);
        
        if (healthPercent > 0.6) {
            this.healthBar.setFillStyle(0x00ff00);
        } else if (healthPercent > 0.3) {
            this.healthBar.setFillStyle(0xffff00);
        } else {
            this.healthBar.setFillStyle(0xff0000);
        }
        
        // Update math power bar
        const mathPercent = this.mathPower / this.maxMathPower;
        this.mathPowerBar.setDisplaySize(200 * mathPercent, 16);
        
        if (mathPercent > 0.8) {
            this.mathPowerBar.setFillStyle(0x00ffff);
        } else if (mathPercent > 0.5) {
            this.mathPowerBar.setFillStyle(0xffff00);
        } else {
            this.mathPowerBar.setFillStyle(0xff8800);
        }
        
        // Update streak
        this.streakText.setText(`Streak: ${this.streak}`);
        
        if (this.streak >= 5) {
            this.streakText.setColor('#00ff00');
        } else if (this.streak >= 3) {
            this.streakText.setColor('#ffff00');
        } else {
            this.streakText.setColor('#ffffff');
        }
        
        // Update math quiz timer if active
        if (this.mathQuizActive && this.mathQuizTimerBar) {
            const elapsed = this.time.now - this.mathQuizStartTime;
            const remaining = Math.max(0, this.mathQuizTimeLeft - elapsed);
            const timerPercent = remaining / this.mathQuizTimeLeft;
            
            this.mathQuizTimerBar.setDisplaySize(400 * timerPercent, 10);
            
            // Timer color changes with smooth transitions
            if (timerPercent > 0.6) {
                this.mathQuizTimerBar.setFillStyle(0x00ff00);
            } else if (timerPercent > 0.3) {
                this.mathQuizTimerBar.setFillStyle(0xffff00);
            } else if (timerPercent > 0.1) {
                this.mathQuizTimerBar.setFillStyle(0xff8800);
            } else {
                this.mathQuizTimerBar.setFillStyle(0xff0000);
                // Add pulsing effect when time is very low
                if (!this.timerPulseActive) {
                    this.timerPulseActive = true;
                    this.tweens.add({
                        targets: this.mathQuizTimerBar,
                        scaleY: 1.5,
                        duration: 200,
                        yoyo: true,
                        repeat: -1,
                        ease: 'Power2.easeInOut'
                    });
                }
            }
            
            // Auto-timeout with grace period and smooth feedback
            if (remaining <= 0 && !this.timeoutHandled) {
                this.timeoutHandled = true;
                this.timerPulseActive = false;
                
                // Show timeout feedback
                this.showTimeoutFeedback();
                
                // Handle as incorrect answer
                this.onMathAnswerIncorrect({
                    timeSpent: this.mathQuizTimeLeft,
                    difficulty: 'medium',
                    powerLost: 10, // Reduced penalty for timeout
                    reason: 'timeout'
                });
                
                // Delay hiding UI to show timeout feedback
                this.time.delayedCall(2000, () => {
                    this.hideMathQuizUI();
                });
            }
        }
    }

    endGame() {
        this.isGameActive = false;
        
        // Calculate final stats
        const accuracy = this.questionsAnswered > 0 ? 
            (this.correctAnswers / this.questionsAnswered) * 100 : 0;
        
        // Record final score and complete week if performance is good enough
        if (this.score > 0) {
            // Add score to total progress
            this.progressTracker.progress.totalScore += this.score;
            
            // Complete week 1 if accuracy is above 60% or if they answered at least 5 questions
            if (accuracy >= 60 || this.questionsAnswered >= 5) {
                this.progressTracker.completeWeek(1);
                console.log('Week1MathScene: Week 1 completed! Accuracy:', accuracy.toFixed(1) + '%');
            }
            
            // Save progress
            this.progressTracker.saveProgress();
        }
        
        this.showGameOverScreen(accuracy);
    }

    showGameOverScreen(accuracy) {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;
        
        // Game over background
        const gameOverBg = this.add.rectangle(centerX, centerY, this.scale.width, this.scale.height, 0x000000, 0.9);
        
        // Game over text with glow
        const gameOverGlow = this.add.text(centerX, centerY - 150, 'GAME COMPLETE!', {
            fontSize: '54px',
            fontFamily: 'Courier, monospace',
            color: '#00ffff',
            stroke: '#000000',
            strokeThickness: 6
        }).setOrigin(0.5);
        
        const gameOverText = this.add.text(centerX, centerY - 150, 'GAME COMPLETE!', {
            fontSize: '48px',
            fontFamily: 'Courier, monospace',
            color: '#ffffff',
            stroke: '#00ffff',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // Stats
        const statsText = this.add.text(centerX, centerY - 50, 
            `🎯 Math Performance:\n` +
            `Questions Answered: ${this.questionsAnswered}\n` +
            `Accuracy: ${accuracy.toFixed(1)}%\n` +
            `Best Streak: ${this.maxStreak}\n` +
            `Final Math Power: ${this.mathPower}`, {
            fontSize: '20px',
            fontFamily: 'Courier, monospace',
            color: '#ffff00',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Final score
        const scoreText = this.add.text(centerX, centerY + 80, `⭐ Final Score: ${this.score}`, {
            fontSize: '28px',
            fontFamily: 'Courier, monospace',
            color: '#00ff00',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // Create interactive buttons instead of just text
        const buttonStyle = {
            fontSize: '20px',
            fontFamily: 'Courier, monospace',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        };
        
        // Play Again button
        const playAgainBg = this.add.rectangle(centerX - 120, centerY + 130, 200, 40, 0x00aa00, 0.8);
        playAgainBg.setStrokeStyle(2, 0x00ff00);
        const playAgainText = this.add.text(centerX - 120, centerY + 130, '🔄 PLAY AGAIN', buttonStyle).setOrigin(0.5);
        
        // Menu button
        const menuBg = this.add.rectangle(centerX + 120, centerY + 130, 200, 40, 0x0066aa, 0.8);
        menuBg.setStrokeStyle(2, 0x00aaff);
        const menuText = this.add.text(centerX + 120, centerY + 130, '🏠 MAIN MENU', buttonStyle).setOrigin(0.5);
        
        // Pulsing effect for game over text
        this.tweens.add({
            targets: [gameOverGlow, gameOverText],
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 1000,
            yoyo: true,
            repeat: -1
        });
        
        // Button hover effects
        const addButtonHover = (bg, text, hoverColor, normalColor) => {
            bg.setInteractive();
            
            bg.on('pointerover', () => {
                bg.setFillStyle(hoverColor);
                text.setScale(1.1);
                this.playSound('correct');
            });
            
            bg.on('pointerout', () => {
                bg.setFillStyle(normalColor);
                text.setScale(1.0);
            });
        };
        
        addButtonHover(playAgainBg, playAgainText, 0x00ff00, 0x00aa00);
        addButtonHover(menuBg, menuText, 0x00aaff, 0x0066aa);
        
        // Play Again functionality
        playAgainBg.on('pointerdown', () => {
            console.log('Week1MathScene: Play Again clicked');
            this.playSound('correct');
            
            // Add visual feedback
            this.tweens.add({
                targets: [playAgainBg, playAgainText],
                scaleX: 0.9,
                scaleY: 0.9,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    try {
                        // Restart the current scene
                        this.scene.restart();
                    } catch (error) {
                        console.error('Week1MathScene: Error restarting scene:', error);
                        // Fallback: reload the page
                        window.location.reload();
                    }
                }
            });
        });
        
        // Menu functionality with multiple fallback options
        menuBg.on('pointerdown', () => {
            console.log('Week1MathScene: Main Menu clicked');
            this.playSound('correct');
            
            // Add visual feedback
            this.tweens.add({
                targets: [menuBg, menuText],
                scaleX: 0.9,
                scaleY: 0.9,
                duration: 100,
                yoyo: true,
                onComplete: () => {
                    this.goToMainMenu();
                }
            });
        });
        
        // Also make the background clickable for play again (fallback)
        gameOverBg.setInteractive();
        gameOverBg.on('pointerdown', (pointer) => {
            // Only trigger if clicking in empty space (not on buttons)
            const clickX = pointer.x;
            const clickY = pointer.y;
            
            // Check if click is not on buttons
            const playAgainBounds = playAgainBg.getBounds();
            const menuBounds = menuBg.getBounds();
            
            if (!Phaser.Geom.Rectangle.Contains(playAgainBounds, clickX, clickY) &&
                !Phaser.Geom.Rectangle.Contains(menuBounds, clickX, clickY)) {
                
                console.log('Week1MathScene: Background clicked - restarting game');
                this.playSound('correct');
                
                try {
                    this.scene.restart();
                } catch (error) {
                    console.error('Week1MathScene: Error restarting via background click:', error);
                    window.location.reload();
                }
            }
        });
        
        // Keyboard shortcuts
        this.input.keyboard.once('keydown-SPACE', () => {
            console.log('Week1MathScene: Space pressed - restarting game');
            this.scene.restart();
        });
        
        this.input.keyboard.once('keydown-ESC', () => {
            console.log('Week1MathScene: Escape pressed - going to menu');
            this.goToMainMenu();
        });
        
        // Instructions for keyboard shortcuts
        const instructionsText = this.add.text(centerX, centerY + 180, 
            'SPACE: Play Again | ESC: Main Menu | Click buttons above', {
            fontSize: '14px',
            fontFamily: 'Courier, monospace',
            color: '#888888',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);
        
        // Blinking effect for instructions
        this.tweens.add({
            targets: instructionsText,
            alpha: 0.5,
            duration: 1500,
            yoyo: true,
            repeat: -1
        });
    }
    
    goToMainMenu() {
        console.log('Week1MathScene: Attempting to go to main menu...');
        
        // Try multiple scene options in order of preference
        const sceneOptions = [
            'EducationalMenuScene',
            'IntroScene',
            'CharacterSelectScene',
            'MenuScene'
        ];
        
        for (const sceneName of sceneOptions) {
            try {
                // Check if scene exists
                if (this.scene.manager.getScene(sceneName)) {
                    console.log(`Week1MathScene: Found scene ${sceneName}, switching...`);
                    this.scene.start(sceneName);
                    return;
                }
            } catch (error) {
                console.warn(`Week1MathScene: Failed to switch to ${sceneName}:`, error.message);
            }
        }
        
        // If no scenes work, try to reload the page
        console.warn('Week1MathScene: No valid scenes found, reloading page...');
        try {
            window.location.reload();
        } catch (error) {
            console.error('Week1MathScene: Failed to reload page:', error);
            // Last resort: show error message
            this.showNavigationError();
        }
    }
    
    showNavigationError() {
        console.error('Week1MathScene: Showing navigation error screen');
        
        // Clear the screen
        this.children.removeAll();
        
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;
        
        // Error background
        this.add.rectangle(centerX, centerY, this.scale.width, this.scale.height, 0x330000);
        
        // Error message
        const errorText = this.add.text(centerX, centerY, 
            'NAVIGATION ERROR\n\n' +
            'Unable to return to menu.\n' +
            'Please refresh the page manually.\n\n' +
            'Press F5 or Ctrl+R to reload', {
            fontSize: '24px',
            fontFamily: 'Courier, monospace',
            color: '#ff4444',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Make it clickable to try reload again
        errorText.setInteractive();
        errorText.on('pointerdown', () => {
            window.location.reload();
        });
    }

    createErrorScreen(error) {
        console.error('Week1MathScene: Creating error screen for:', error);
        
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;
        
        // Background
        this.add.rectangle(centerX, centerY, this.scale.width, this.scale.height, 0x330000);
        
        // Error message
        const errorText = this.add.text(centerX, centerY, 
            'ERROR\n\nSomething went wrong.\nClick to return to menu.', {
            fontSize: '24px',
            fontFamily: 'Courier, monospace',
            color: '#ff4444',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setInteractive().on('pointerdown', () => {
            try {
                this.scene.start('MenuScene');
            } catch (error) {
                window.location.reload();
            }
        });
    }

    // 🤖 COMBAT SYSTEM - Create combat UI
    createCombatUI() {
        console.log('Week1MathScene: Creating combat UI...');
        
        try {
            // Enemy health bar background
            this.enemyHealthBarBg = this.add.graphics();
            this.enemyHealthBarBg.fillStyle(0x333333, 0.8);
            this.enemyHealthBarBg.fillRoundedRect(500, 50, 200, 20, 10);
            this.enemyHealthBarBg.lineStyle(2, 0xff0000, 0.8);
            this.enemyHealthBarBg.strokeRoundedRect(500, 50, 200, 20, 10);
            
            // Enemy health bar
            this.enemyHealthBar = this.add.graphics();
            this.updateEnemyHealthBar();
            
            // Enemy health text
            this.enemyHealthText = this.add.text(600, 60, 'ENEMY: 100/100', {
                fontSize: '12px',
                fontFamily: 'Courier, monospace',
                fill: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            
            // Combat stats display
            this.combatStatsDisplay = this.add.text(50, 50, '', {
                fontSize: '14px',
                fontFamily: 'Courier, monospace',
                fill: '#00ffff',
                fontStyle: 'bold'
            });
            this.updateCombatStatsDisplay();
            
            // Damage numbers group
            this.damageNumbersGroup = this.add.group();
            
            console.log('Week1MathScene: Combat UI created successfully');
        } catch (error) {
            console.error('Week1MathScene: Error creating combat UI:', error);
        }
    }

    // 🤖 COMBAT SYSTEM - Update enemy health bar
    updateEnemyHealthBar() {
        if (this.enemyHealthBar) {
            this.enemyHealthBar.clear();
            const healthPercent = this.enemyHealth / this.maxEnemyHealth;
            const barWidth = 200 * healthPercent;
            
            // Health bar color based on health level
            let healthColor = 0x00ff00; // Green
            if (healthPercent < 0.6) healthColor = 0xffff00; // Yellow
            if (healthPercent < 0.3) healthColor = 0xff0000; // Red
            
            this.enemyHealthBar.fillStyle(healthColor, 0.8);
            this.enemyHealthBar.fillRoundedRect(500, 50, barWidth, 20, 10);
        }
        
        if (this.enemyHealthText) {
            this.enemyHealthText.setText(`ENEMY: ${Math.max(0, Math.floor(this.enemyHealth))}/${this.maxEnemyHealth}`);
        }
    }

    // 🤖 COMBAT SYSTEM - Update combat stats display
    updateCombatStatsDisplay() {
        if (this.combatStatsDisplay) {
            const stats = this.characterStats;
            const displayText = [
                `⚔️ ATK: ${(stats.attackPower * 100).toFixed(0)}%`,
                `🛡️ DEF: ${stats.defense}`,
                `⚡ SPD: ${stats.speed}s`,
                `🎯 ACC: ${stats.accuracy}%`
            ].join('  ');
            
            this.combatStatsDisplay.setText(displayText);
        }
    }

    createArena() {
        // Enhanced arena with glowing effect - now a battle arena!
        const arena = this.add.graphics();
        
        // Main border with combat theme
        arena.lineStyle(4, 0x00ffff, 0.8);
        arena.strokeRect(this.arenaX, this.arenaY, this.arenaWidth, this.arenaHeight);
        
        // Glow effect
        arena.lineStyle(8, 0x00ffff, 0.3);
        arena.strokeRect(this.arenaX - 2, this.arenaY - 2, this.arenaWidth + 4, this.arenaHeight + 4);
        
        // Grid lines for battle arena feel
        arena.lineStyle(1, 0x00ffff, 0.2);
        const gridSize = 50;
        
        for (let x = this.arenaX; x <= this.arenaX + this.arenaWidth; x += gridSize) {
            arena.lineBetween(x, this.arenaY, x, this.arenaY + this.arenaHeight);
        }
        
        for (let y = this.arenaY; y <= this.arenaY + this.arenaHeight; y += gridSize) {
            arena.lineBetween(this.arenaX, y, this.arenaX + this.arenaWidth, y);
        }
        
        // Add battle arena title
        this.add.text(this.scale.width / 2, 30, '⚔️ MATH COMBAT ARENA ⚔️', {
            fontSize: '24px',
            fontFamily: 'Courier, monospace',
            fill: '#00ffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
    }

    // Restore essential methods
    onPlayerHealthRestore(data) {
        this.playerHealth = Math.min(this.maxPlayerHealth, this.playerHealth + data.amount);
        this.updateUI();
        
        // Visual feedback
        this.createHealingEffect(this.player.x, this.player.y);
    }

    onPlayerEnergyRestore(data) {
        this.playerEnergy = Math.min(this.maxPlayerEnergy, this.playerEnergy + data.amount);
        this.updateUI();
    }

    onPlayerDamage(data) {
        this.playerHealth = Math.max(0, this.playerHealth - data.amount);
        this.updateUI();
        
        // Check for low health trigger
        const healthPercentage = this.playerHealth / this.maxPlayerHealth;
        if (healthPercentage <= 0.3) {
            this.events.emit('playerHealthLow', { 
                healthPercentage: healthPercentage,
                x: this.player.x,
                y: this.player.y
            });
        }
        
        // Visual feedback
        this.createDamageEffect();
    }

    onShowFloatingText(data) {
        this.createFloatingText(data.x, data.y, data.text, data.color, data.fontSize);
    }

    createHealingEffect(x, y) {
        // Create green healing particles
        for (let i = 0; i < 10; i++) {
            const particle = this.add.circle(
                x + (Math.random() - 0.5) * 40,
                y + (Math.random() - 0.5) * 40,
                Math.random() * 3 + 2,
                0x00ff00,
                0.8
            );
            
            this.tweens.add({
                targets: particle,
                y: y - 30,
                alpha: 0,
                duration: 1000,
                ease: 'Power2.easeOut',
                onComplete: () => particle.destroy()
            });
        }
    }

    startGame() {
        this.isGameActive = true;
        this.gameTimerCounter = 0;
        this.enemySpawnTimer = 0;
        this.mathQuizTimer = 0;
        
        // Show welcome message
        this.showWelcomeMessage();
        
        // Start first math quiz after 3 seconds
        this.time.delayedCall(3000, () => {
            this.startMathQuiz();
        });
        
        console.log('Week1MathScene: Combat game started');
    }

    showWelcomeMessage() {
        const centerX = this.scale.width / 2;
        const centerY = this.scale.height / 2;
        
        // Main title with glow effect
        const titleText = this.add.text(centerX, centerY - 50, '🤖 MATH COMBAT ARENA 🤖', {
            fontSize: '36px',
            fontFamily: 'Courier, monospace',
            fill: '#00ffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 3
        }).setOrigin(0.5);
        
        // Subtitle with enhanced styling
        const instructionText = this.add.text(centerX, centerY, 
            'Your robot battles enemies with math!\n' +
            'Correct answers = Robot attacks\n' +
            'Wrong answers = Enemy attacks\n' +
            'Equipment boosts your combat stats!', {
            fontSize: '16px',
            fontFamily: 'Courier, monospace',
            fill: '#ffff00',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Character stats display
        const statsText = this.add.text(centerX, centerY + 80, 
            `⚔️ Attack: ${(this.characterStats.attackPower * 100).toFixed(0)}%  ` +
            `🛡️ Defense: ${this.characterStats.defense}  ` +
            `⚡ Speed: ${this.characterStats.speed}s  ` +
            `🎯 Accuracy: ${this.characterStats.accuracy}%`, {
            fontSize: '14px',
            fontFamily: 'Courier, monospace',
            fill: '#00ff00',
            align: 'center',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);
        
        // Pulsing effect for title
        this.tweens.add({
            targets: titleText,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 1000,
            yoyo: true,
            repeat: 1
        });
        
        // Fade out after 4 seconds
        this.tweens.add({
            targets: [titleText, instructionText, statsText],
            alpha: 0,
            duration: 1500,
            delay: 2500,
            onComplete: () => {
                titleText.destroy();
                instructionText.destroy();
                statsText.destroy();
            }
        });
    }
} 