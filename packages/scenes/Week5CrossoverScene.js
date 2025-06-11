import { Scene } from 'phaser';
import { QuestionManager, ProgressTracker } from '../utils/managers/index.js';
import { CombatSystem } from '../utils/systems/CombatSystem.js';

export class Week5CrossoverScene extends Scene {
  constructor() {
    super('Week5CrossoverScene');
    this.questionManager = new QuestionManager();
    this.progressTracker = new ProgressTracker();

    // Combat System Integration
    this.combatSystem = null;
    this.characterStats = null;
    this.playerRobot = null;
    this.enemyRobot = null;
    this.combatUI = null;
    this.enemyHealth = 150; // Higher health for crossover scene
    this.maxEnemyHealth = 150;

    // Game state
    this.score = 0;
    this.crownPiecesCollected = 0;
    this.currentRealm = 'central';
    this.isGameActive = true;
    this.player = null;
    this.realms = {};
    this.crownPieces = null;
    this.guardians = null;
    this.coinsEarned = 0;
    this.equippedEffects = null;
    this.questsCompleted = {
      math: false,
      reading: false,
      science: false,
      history: false,
    };
    this.finalBossUnlocked = false;
    this.totalCrownPieces = 4;
    this.playerLevel = 1;
    this.experience = 0;
  }

  init() {
    this.cameras.main.fadeIn(1000, 0, 0, 0);

    // Get equipped item effects
    this.equippedEffects = this.progressTracker.getEquippedEffects();

    // Initialize character stats for combat
    this.characterStats = this.progressTracker.getCharacterStats();
    console.log(
      'Week5CrossoverScene: Character stats loaded:',
      this.characterStats
    );
  }

  async create() {
    // Initialize combat system first
    await this.initializeCombatSystem();

    // Create the fantasy world
    this.createFantasyWorld();

    // Create player character (hero/wizard)
    this.createPlayer();

    // Create combat robots
    this.createCombatRobots();

    // Create magical realms
    this.createRealms();

    // Create crown pieces
    this.createCrownPieces();

    // Create realm guardians
    this.createGuardians();

    // Create UI (including combat UI)
    this.createUI();

    // Set up physics and interactions
    this.setupPhysics();

    // Create controls
    this.createControls();

    // Set up combat event listeners
    this.setupCombatEventListeners();

    // Show welcome message
    this.showWelcomeMessage();
  }

  async initializeCombatSystem() {
    try {
      console.log('Week5CrossoverScene: Initializing combat system...');
      this.combatSystem = new CombatSystem(this, {}, this.progressTracker);
      await this.combatSystem.init();
      console.log(
        'Week5CrossoverScene: Combat system initialized successfully'
      );
    } catch (error) {
      console.error(
        'Week5CrossoverScene: Failed to initialize combat system:',
        error
      );
      // Continue without combat system
    }
  }

  setupCombatEventListeners() {
    // Connect crossover challenge events to combat system
    this.events.on('crossoverAnswerCorrect', data => {
      if (this.combatSystem) {
        const damage = this.combatSystem.onCorrectAnswer(data);
        this.onCrossoverAnswerCorrect(data);
      }
    });

    this.events.on('crossoverAnswerIncorrect', data => {
      if (this.combatSystem) {
        const penalty = this.combatSystem.onIncorrectAnswer(data);
        this.onCrossoverAnswerIncorrect(data);
      }
    });
  }

  onCrossoverAnswerCorrect(data) {
    // Calculate damage based on character stats (higher for crossover)
    const baseDamage = 40;
    const damage = Math.floor(baseDamage * this.characterStats.attackPower);

    // Perform robot attack animation
    this.performPlayerAttack(damage);

    // Apply crossover-specific bonuses
    const crossoverBonus = Math.floor(this.score * 0.2);
    this.score += 20 + crossoverBonus;

    // Award experience with intelligence bonus (higher for crossover)
    const baseXP = 25;
    const xpGained = Math.floor(
      baseXP * (1 + this.characterStats.intelligence / 100)
    );
    this.progressTracker.addExperience(xpGained);

    // Award coins with luck bonus (higher for crossover)
    const baseCoins = 12;
    const coinsGained = Math.floor(
      baseCoins * (1 + this.characterStats.luck / 100)
    );
    this.progressTracker.addCoins(coinsGained, 'Crossover Challenge Success');

    this.createFloatingText(
      this.scale.width / 2,
      200,
      `+${xpGained} XP, +${coinsGained} Coins!`,
      '#00ff00'
    );
  }

  onCrossoverAnswerIncorrect(data) {
    // Calculate penalty reduced by defense (higher for crossover)
    const basePenalty = 25;
    const penalty = Math.max(8, basePenalty - this.characterStats.defense);

    // Perform enemy attack animation
    this.performEnemyAttack(penalty);

    // Apply penalty to score
    this.score = Math.max(0, this.score - penalty);

    this.createFloatingText(
      this.scale.width / 2,
      200,
      `-${penalty} Score`,
      '#ff0000'
    );
  }

  createCombatRobots() {
    if (!this.combatSystem) return;

    try {
      // Create player robot (positioned in central nexus)
      this.playerRobot = this.combatSystem.createPlayerRobot();
      if (this.playerRobot) {
        this.playerRobot.setPosition(200, this.scale.height / 2);
        this.playerRobot.setScale(0.7); // Slightly larger for epic crossover
      }

      // Create enemy robot (positioned in opposite realm)
      this.enemyRobot = this.combatSystem.createEnemyRobot();
      if (this.enemyRobot) {
        this.enemyRobot.setPosition(
          this.scale.width - 200,
          this.scale.height / 2
        );
        this.enemyRobot.setScale(0.7); // Slightly larger for epic crossover
      }

      // Create combat UI
      this.combatUI = this.combatSystem.createCombatUI();

      console.log('Week5CrossoverScene: Combat robots created successfully');
    } catch (error) {
      console.error(
        'Week5CrossoverScene: Error creating combat robots:',
        error
      );
    }
  }

  performPlayerAttack(damage) {
    if (!this.playerRobot || !this.enemyRobot) return;

    // Player robot attack animation
    this.tweens.add({
      targets: this.playerRobot,
      scaleX: 0.8,
      scaleY: 0.8,
      duration: 150,
      yoyo: true,
      ease: 'Power2.easeOut',
    });

    // Damage enemy
    this.enemyHealth = Math.max(0, this.enemyHealth - damage);

    // Create attack effect
    this.createAttackEffect(this.enemyRobot.x, this.enemyRobot.y, '#00ff00');

    // Create floating damage number
    this.createFloatingDamageNumber(
      this.enemyRobot.x,
      this.enemyRobot.y - 30,
      damage,
      '#ffff00'
    );

    // Update enemy health bar
    this.updateEnemyHealthBar();

    // Check if enemy is defeated
    if (this.enemyHealth <= 0) {
      this.onEnemyDefeated();
    }
  }

  performEnemyAttack(penalty) {
    if (!this.enemyRobot || !this.playerRobot) return;

    // Enemy robot attack animation
    this.tweens.add({
      targets: this.enemyRobot,
      scaleX: 0.8,
      scaleY: 0.8,
      duration: 150,
      yoyo: true,
      ease: 'Power2.easeOut',
    });

    // Create attack effect on player
    this.createAttackEffect(this.playerRobot.x, this.playerRobot.y, '#ff0000');

    // Screen shake for impact
    this.cameras.main.shake(200, 0.01);
  }

  createAttackEffect(x, y, color) {
    const effect = this.add.circle(
      x,
      y,
      35,
      Phaser.Display.Color.HexStringToColor(color).color,
      0.7
    );

    this.tweens.add({
      targets: effect,
      scaleX: 2.5,
      scaleY: 2.5,
      alpha: 0,
      duration: 400,
      ease: 'Power2.easeOut',
      onComplete: () => effect.destroy(),
    });
  }

  createFloatingDamageNumber(x, y, damage, color) {
    const damageText = this.add
      .text(x, y, damage.toString(), {
        fontSize: '22px',
        fontFamily: 'Arial, sans-serif',
        fill: color,
        stroke: '#000000',
        strokeThickness: 3,
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: damageText,
      y: y - 50,
      alpha: 0,
      duration: 1200,
      ease: 'Power2.easeOut',
      onComplete: () => damageText.destroy(),
    });
  }

  onEnemyDefeated() {
    // Victory effects
    this.createAttackEffect(this.enemyRobot.x, this.enemyRobot.y, '#ffff00');

    // Bonus rewards for defeating enemy (higher for crossover)
    const bonusXP = 80;
    const bonusCoins = 40;

    this.progressTracker.addExperience(bonusXP);
    this.progressTracker.addCoins(bonusCoins, 'Crossover Combat Victory');

    this.createFloatingText(
      this.enemyRobot.x,
      this.enemyRobot.y - 50,
      `ENEMY DEFEATED! +${bonusXP} XP, +${bonusCoins} Coins!`,
      '#ffff00'
    );

    // Spawn new enemy after delay
    this.time.delayedCall(3000, () => {
      this.spawnNewEnemy();
    });
  }

  spawnNewEnemy() {
    // Reset enemy health
    this.enemyHealth = this.maxEnemyHealth;
    this.updateEnemyHealthBar();

    // Enemy spawn effect
    if (this.enemyRobot) {
      this.enemyRobot.setAlpha(0);
      this.tweens.add({
        targets: this.enemyRobot,
        alpha: 1,
        duration: 500,
        ease: 'Power2.easeOut',
      });
    }

    this.createFloatingText(
      this.enemyRobot.x,
      this.enemyRobot.y - 30,
      'NEW CHALLENGER!',
      '#ff00ff'
    );
  }

  updateEnemyHealthBar() {
    if (this.combatSystem && this.combatSystem.updateEnemyHealthBar) {
      this.combatSystem.updateEnemyHealthBar();
    }
  }

  createFloatingText(x, y, text, color = '#ffffff', fontSize = '16px') {
    const floatingText = this.add
      .text(x, y, text, {
        fontSize,
        fontFamily: 'Arial, sans-serif',
        fill: color,
        stroke: '#000000',
        strokeThickness: 2,
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: floatingText,
      y: y - 60,
      alpha: 0,
      duration: 2000,
      ease: 'Power2.easeOut',
      onComplete: () => floatingText.destroy(),
    });
  }

  createFantasyWorld() {
    // Epic fantasy gradient background
    const gradient = this.add.graphics();
    gradient.fillGradientStyle(0x4b0082, 0x4b0082, 0x1a0033, 0x1a0033, 1);
    gradient.fillRect(0, 0, this.scale.width, this.scale.height);

    // Add magical particles
    for (let i = 0; i < 60; i++) {
      const x = Phaser.Math.Between(0, this.scale.width);
      const y = Phaser.Math.Between(0, this.scale.height);
      const particle = this.add.circle(
        x,
        y,
        Phaser.Math.Between(1, 3),
        0xffd700,
        0.8
      );

      // Magical floating animation
      this.tweens.add({
        targets: particle,
        alpha: 0.2,
        y: y - Phaser.Math.Between(50, 100),
        duration: Phaser.Math.Between(3000, 6000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    // Add mystical trees/pillars
    this.createMysticalStructures();

    // Title
    this.add
      .text(this.scale.width / 2, 50, '👑 QUEST FOR KNOWLEDGE 👑', {
        fontSize: '28px',
        fontFamily: 'Arial, sans-serif',
        fill: '#ffd700',
        stroke: '#4B0082',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Current realm indicator
    this.realmIndicator = this.add
      .text(this.scale.width / 2, 80, `🌟 CENTRAL NEXUS`, {
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5);
  }

  createMysticalStructures() {
    // Central magical nexus
    const nexusX = this.scale.width / 2;
    const nexusY = this.scale.height / 2;

    // Central nexus
    const nexus = this.add.circle(
      this.scale.width / 2,
      this.scale.height / 2,
      80,
      0x4c1d95
    );
    nexus.setStrokeStyle(3, 0xffd700);

    // Pulsing animation for nexus
    this.tweens.add({
      targets: nexus,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Add mystical runes around nexus
    const runes = ['✦', '✧', '✩', '✪', '✫', '✬'];
    for (let i = 0; i < 6; i++) {
      const angle = (i * 60 * Math.PI) / 180;
      const runeX = nexusX + Math.cos(angle) * 60;
      const runeY = nexusY + Math.sin(angle) * 60;

      const rune = this.add
        .text(runeX, runeY, runes[i], {
          fontSize: '20px',
          fill: '#ffd700',
        })
        .setOrigin(0.5);

      this.tweens.add({
        targets: rune,
        rotation: Math.PI * 2,
        duration: 8000,
        repeat: -1,
        ease: 'Linear',
      });
    }
  }

  createPlayer() {
    // Get character color from cosmetics
    let playerColor = 0x9370db; // Default purple (wizard)
    const equippedCosmetic =
      this.progressTracker.progress.equippedItems.cosmetic;

    switch (equippedCosmetic) {
      case 'redCharacter':
        playerColor = 0xff4444;
        break;
      case 'blueCharacter':
        playerColor = 0x4444ff;
        break;
      case 'greenCharacter':
        playerColor = 0x44ff44;
        break;
    }

    // Fantasy hero character
    this.player = this.add.circle(150, this.scale.height / 2, 18, playerColor);
    this.player.setStrokeStyle(2, 0x000000);

    // Add wizard hat or crown
    this.playerHat = this.add.polygon(
      150,
      this.scale.height / 2 - 25,
      [0, -15, -8, 0, 8, 0],
      0x4b0082
    );
    this.playerHat.setStrokeStyle(1, 0xffd700);

    // Add magical staff
    this.playerStaff = this.add.rectangle(
      150 + 15,
      this.scale.height / 2,
      3,
      25,
      0x8b4513
    );
    const staffOrb = this.add.circle(
      150 + 15,
      this.scale.height / 2 - 15,
      4,
      0xffd700
    );

    // Add physics body
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);
    this.player.body.setSize(36, 36);

    // Player properties with equipped effects
    this.player.speed = 140 * (this.equippedEffects.speedMultiplier || 1);

    // Player label
    this.add
      .text(this.player.x, this.player.y - 45, 'HERO', {
        fontSize: '10px',
        fontFamily: 'Arial, sans-serif',
        fill: '#ffd700',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // Store staff references for movement
    this.playerStaff = staffOrb;
  }

  createRealms() {
    // Define magical realms for each subject
    this.realms = {
      math: {
        x: 200,
        y: 200,
        width: 120,
        height: 100,
        color: 0xff6b6b,
        name: 'Forest of Numbers',
        icon: '🧮',
        description: 'Solve math riddles',
      },
      reading: {
        x: 700,
        y: 180,
        width: 140,
        height: 120,
        color: 0x4ecdc4,
        name: 'Library of Words',
        icon: '📖',
        description: 'Reading comprehension',
      },
      science: {
        x: 180,
        y: 400,
        width: 130,
        height: 110,
        color: 0x45b7d1,
        name: "Wizard's Laboratory",
        icon: '🔬',
        description: 'Scientific experiments',
      },
      history: {
        x: 720,
        y: 420,
        width: 125,
        height: 105,
        color: 0xf39c12,
        name: 'Ancient Temple',
        icon: '🏛️',
        description: 'Historical mysteries',
      },
    };

    // Create realm visuals
    Object.entries(this.realms).forEach(([realmName, realm]) => {
      // Realm portal
      const portal = this.add.ellipse(
        realm.x,
        realm.y,
        realm.width,
        realm.height,
        realm.color,
        0.6
      );
      portal.setStrokeStyle(3, 0xffd700);

      // Realm icon
      this.add
        .text(realm.x, realm.y - 20, realm.icon, {
          fontSize: '24px',
        })
        .setOrigin(0.5);

      // Realm name
      this.add
        .text(realm.x, realm.y + 20, realm.name, {
          fontSize: '12px',
          fontFamily: 'Arial, sans-serif',
          fill: '#ffffff',
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 1,
        })
        .setOrigin(0.5);

      // Magical portal animation
      this.tweens.add({
        targets: portal,
        alpha: 0.3,
        scaleX: 1.05,
        scaleY: 1.05,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      realm.portal = portal;
    });
  }

  createCrownPieces() {
    this.crownPieces = this.physics.add.group();

    // Crown pieces in each realm
    const crownData = [
      {
        x: 200,
        y: 200,
        subject: 'math',
        color: 0xff6b6b,
        name: 'Ruby Crown Piece',
      },
      {
        x: 700,
        y: 180,
        subject: 'reading',
        color: 0x4ecdc4,
        name: 'Emerald Crown Piece',
      },
      {
        x: 180,
        y: 400,
        subject: 'science',
        color: 0x45b7d1,
        name: 'Sapphire Crown Piece',
      },
      {
        x: 720,
        y: 420,
        subject: 'history',
        color: 0xf39c12,
        name: 'Golden Crown Piece',
      },
    ];

    crownData.forEach(crownInfo => {
      // Create physics body using a graphics object instead of null sprite
      const crownPiece = this.physics.add.existing(
        this.add.polygon(
          crownInfo.x,
          crownInfo.y,
          [0, -12, -8, -5, -10, 5, 0, 8, 10, 5, 8, -5],
          crownInfo.color
        )
      );
      crownPiece.setStrokeStyle(2, 0xffd700);
      crownPiece.body.setSize(20, 20);

      // Add sparkle effect
      const sparkle = this.add
        .text(crownInfo.x, crownInfo.y, '✨', {
          fontSize: '16px',
        })
        .setOrigin(0.5);

      // Store references
      crownPiece.sparkle = sparkle;
      crownPiece.subject = crownInfo.subject;
      crownPiece.name = crownInfo.name;
      crownPiece.collected = false;

      // Floating animation
      this.tweens.add({
        targets: [crownPiece, sparkle],
        y: crownInfo.y - 10,
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      this.crownPieces.add(crownPiece);
    });
  }

  createGuardians() {
    this.guardians = this.physics.add.group();

    // Guardian for each realm
    const guardianData = [
      { x: 200, y: 160, subject: 'math', icon: '🐉', name: 'Math Dragon' },
      { x: 700, y: 140, subject: 'reading', icon: '🦉', name: 'Wisdom Owl' },
      {
        x: 180,
        y: 360,
        subject: 'science',
        icon: '🧙',
        name: 'Science Wizard',
      },
      {
        x: 720,
        y: 380,
        subject: 'history',
        icon: '⚔️',
        name: 'Ancient Guardian',
      },
    ];

    guardianData.forEach(guardianInfo => {
      // Create physics body using a graphics object instead of null sprite
      const guardian = this.physics.add.existing(
        this.add.circle(guardianInfo.x, guardianInfo.y, 20, 0x4b0082)
      );
      guardian.setStrokeStyle(2, 0xffd700);
      guardian.body.setCircle(20);

      // Guardian visual
      const guardianIcon = this.add
        .text(guardianInfo.x, guardianInfo.y, guardianInfo.icon, {
          fontSize: '20px',
        })
        .setOrigin(0.5);

      // Guardian name
      const guardianLabel = this.add
        .text(guardianInfo.x, guardianInfo.y + 25, guardianInfo.name, {
          fontSize: '10px',
          fontFamily: 'Arial, sans-serif',
          fill: '#ffd700',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);

      // Store references
      guardian.icon = guardianIcon;
      guardian.label = guardianLabel;
      guardian.subject = guardianInfo.subject;
      guardian.name = guardianInfo.name;
      guardian.defeated = false;

      // Guardian animation
      this.tweens.add({
        targets: guardianIcon,
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 1800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      this.guardians.add(guardian);
    });
  }

  createUI() {
    // Coin balance (top right)
    this.coinBalanceText = this.add
      .text(
        this.scale.width - 20,
        20,
        `🪙 ${this.progressTracker.getCoinBalance()}`,
        {
          fontSize: '18px',
          fontFamily: 'Arial, sans-serif',
          fill: '#ffd700',
          stroke: '#000000',
          strokeThickness: 2,
        }
      )
      .setOrigin(1, 0);

    // Score display (below coins)
    this.scoreText = this.add
      .text(this.scale.width - 20, 50, `Score: ${this.score}`, {
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(1, 0);

    // Session coins earned
    this.sessionCoinsText = this.add
      .text(this.scale.width - 20, 75, `Session: +${this.coinsEarned} 🪙`, {
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        fill: '#10b981',
        stroke: '#000000',
        strokeThickness: 1,
      })
      .setOrigin(1, 0);

    // Crown pieces collected
    this.crownText = this.add.text(
      20,
      110,
      `Crown Pieces: ${this.crownPiecesCollected}/${this.totalCrownPieces}`,
      {
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        fill: '#ffd700',
        stroke: '#000000',
        strokeThickness: 2,
      }
    );

    // Player level and experience
    this.levelText = this.add.text(
      20,
      140,
      `Level: ${this.playerLevel} | XP: ${this.experience}`,
      {
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
      }
    );

    // Quest progress
    this.questText = this.add.text(20, 170, this.getQuestProgress(), {
      fontSize: '12px',
      fontFamily: 'Arial, sans-serif',
      fill: '#fbbf24',
      stroke: '#000000',
      strokeThickness: 1,
    });

    // Active power-up indicator
    this.powerUpText = this.add.text(20, 200, '', {
      fontSize: '12px',
      fontFamily: 'Arial, sans-serif',
      fill: '#fbbf24',
      stroke: '#000000',
      strokeThickness: 1,
    });

    this.updatePowerUpDisplay();

    // Final boss button (initially hidden)
    this.finalBossBtn = this.add
      .rectangle(
        this.scale.width / 2,
        this.scale.height - 40,
        200,
        30,
        0x8b0000
      )
      .setStrokeStyle(2, 0xffd700)
      .setInteractive({ useHandCursor: true })
      .setVisible(false);

    this.finalBossText = this.add
      .text(
        this.scale.width / 2,
        this.scale.height - 40,
        '⚔️ FACE THE FINAL BOSS',
        {
          fontSize: '14px',
          fontFamily: 'Arial, sans-serif',
          fill: '#ffd700',
          fontStyle: 'bold',
        }
      )
      .setOrigin(0.5)
      .setVisible(false);

    this.finalBossBtn.on('pointerdown', () => {
      if (this.finalBossUnlocked) {
        this.startFinalBoss();
      }
    });

    // Instructions
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height - 10,
        'Arrow Keys: Move | Visit realms to challenge guardians and collect crown pieces!',
        {
          fontSize: '11px',
          fontFamily: 'Arial, sans-serif',
          fill: '#ffffff',
          stroke: '#000000',
          strokeThickness: 1,
          align: 'center',
        }
      )
      .setOrigin(0.5);
  }

  getQuestProgress() {
    const completed = Object.values(this.questsCompleted).filter(q => q).length;
    return `Quests: ${completed}/4 | Math:${this.questsCompleted.math ? '✅' : '❌'} Reading:${this.questsCompleted.reading ? '✅' : '❌'} Science:${this.questsCompleted.science ? '✅' : '❌'} History:${this.questsCompleted.history ? '✅' : '❌'}`;
  }

  updatePowerUpDisplay() {
    const activePowerUp = this.progressTracker.progress.equippedItems.powerUp;
    if (activePowerUp) {
      let powerUpText = '';
      switch (activePowerUp) {
        case 'extraTime':
          powerUpText = '⏰ Extra Time Active';
          break;
        case 'shield':
          powerUpText = '🛡️ Shield Active';
          break;
        case 'doubleCoins':
          powerUpText = '💰 Double Coins Active';
          break;
        case 'slowMotion':
          powerUpText = '🐌 Slow Motion Active';
          break;
      }
      this.powerUpText.setText(powerUpText);
    }
  }

  setupPhysics() {
    // Player interacts with guardians
    this.physics.add.overlap(
      this.player,
      this.guardians,
      this.challengeGuardian,
      null,
      this
    );

    // Player collects crown pieces
    this.physics.add.overlap(
      this.player,
      this.crownPieces,
      this.collectCrownPiece,
      null,
      this
    );
  }

  createControls() {
    // Keyboard controls
    this.cursors = this.input.keyboard.createCursorKeys();

    // WASD controls
    this.wasd = this.input.keyboard.addKeys('W,S,A,D');

    // Touch/mouse controls for mobile
    this.input.on('pointerdown', pointer => {
      const deltaX = pointer.x - this.player.x;
      const deltaY = pointer.y - this.player.y;

      if (Math.abs(deltaX) > Math.abs(deltaY)) {
        this.player.body.setVelocityX(
          deltaX > 0 ? this.player.speed : -this.player.speed
        );
        this.player.body.setVelocityY(0);
      } else {
        this.player.body.setVelocityY(
          deltaY > 0 ? this.player.speed : -this.player.speed
        );
        this.player.body.setVelocityX(0);
      }
    });
  }

  update() {
    if (!this.isGameActive) return;

    // Player movement
    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      this.player.body.setVelocityX(-this.player.speed);
      this.player.body.setVelocityY(0);
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      this.player.body.setVelocityX(this.player.speed);
      this.player.body.setVelocityY(0);
    } else if (this.cursors.up.isDown || this.wasd.W.isDown) {
      this.player.body.setVelocityY(-this.player.speed);
      this.player.body.setVelocityX(0);
    } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
      this.player.body.setVelocityY(this.player.speed);
      this.player.body.setVelocityX(0);
    } else {
      this.player.body.setVelocity(0, 0);
    }

    // Update accessories position
    this.playerHat.x = this.player.x;
    this.playerHat.y = this.player.y - 25;
    this.playerStaff.x = this.player.x + 15;
    this.playerStaff.y = this.player.y - 15;

    // Update current realm
    this.updateCurrentRealm();
  }

  updateCurrentRealm() {
    let inRealm = 'central';

    Object.entries(this.realms).forEach(([realmName, realm]) => {
      const distance = Phaser.Math.Distance.Between(
        this.player.x,
        this.player.y,
        realm.x,
        realm.y
      );
      if (distance < 60) {
        inRealm = realmName;
      }
    });

    if (this.currentRealm !== inRealm) {
      this.currentRealm = inRealm;
      const realmNames = {
        central: 'CENTRAL NEXUS',
        math: 'FOREST OF NUMBERS',
        reading: 'LIBRARY OF WORDS',
        science: "WIZARD'S LABORATORY",
        history: 'ANCIENT TEMPLE',
      };
      this.realmIndicator.setText(`🌟 ${realmNames[inRealm]}`);
    }
  }

  challengeGuardian(player, guardian) {
    if (!this.isGameActive || guardian.defeated) return;

    this.currentGuardian = guardian;
    this.showGuardianChallenge(guardian);
  }

  showGuardianChallenge(guardian) {
    this.isGameActive = false;

    // Get appropriate question for the subject
    let question;
    switch (guardian.subject) {
      case 'math':
        question = this.questionManager.getRandomMathQuestion();
        break;
      case 'reading':
        question = this.questionManager.getRandomReadingQuestion();
        break;
      case 'science':
        question = this.questionManager.getRandomScienceQuestion();
        break;
      case 'history':
        question = this.questionManager.getRandomHistoryQuestion();
        break;
      default:
        question = this.questionManager.getRandomMixedQuestion();
    }

    this.currentQuestion = question;

    // Create challenge overlay
    const overlay = this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.8)
      .setOrigin(0, 0)
      .setInteractive({ useHandCursor: false });

    // Challenge panel
    const panel = this.add
      .rectangle(
        this.scale.width / 2,
        this.scale.height / 2,
        700,
        450,
        0x4b0082
      )
      .setStrokeStyle(4, 0xffd700);

    // Guardian title
    let yPos = this.scale.height / 2 - 180;

    this.add
      .text(this.scale.width / 2, yPos, `⚔️ GUARDIAN CHALLENGE ⚔️`, {
        fontSize: '24px',
        fontFamily: 'Arial, sans-serif',
        fill: '#ffd700',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    yPos += 40;
    this.add
      .text(
        this.scale.width / 2,
        yPos,
        `${guardian.icon} ${guardian.name} ${guardian.icon}`,
        {
          fontSize: '20px',
          fontFamily: 'Arial, sans-serif',
          fill: '#ffffff',
        }
      )
      .setOrigin(0.5);

    yPos += 50;

    // Handle reading questions differently (with passage)
    if (guardian.subject === 'reading' && question.passage) {
      this.add
        .text(this.scale.width / 2, yPos, question.passage, {
          fontSize: '14px',
          fontFamily: 'Arial, sans-serif',
          fill: '#ffffff',
          wordWrap: { width: 600 },
          align: 'center',
        })
        .setOrigin(0.5);
      yPos += 80;
    }

    this.add
      .text(this.scale.width / 2, yPos, question.question, {
        fontSize: '18px',
        fontFamily: 'Arial, sans-serif',
        fill: '#ffffff',
        fontStyle: 'bold',
        wordWrap: { width: 600 },
        align: 'center',
      })
      .setOrigin(0.5);

    // Answer choices
    yPos += 80;
    const { choices } = question;
    const buttonWidth = 150;
    const buttonHeight = 40;
    const spacing = 160;
    const startX = this.scale.width / 2 - spacing * 1.5;

    choices.forEach((choice, index) => {
      const x = startX + index * spacing;

      const button = this.add
        .rectangle(x, yPos, buttonWidth, buttonHeight, 0x8b0000)
        .setStrokeStyle(2, 0xffd700)
        .setInteractive({ useHandCursor: true });

      this.add
        .text(x, yPos, choice, {
          fontSize: '14px',
          fontFamily: 'Arial, sans-serif',
          fill: '#ffffff',
          fontStyle: 'bold',
          wordWrap: { width: buttonWidth - 10 },
          align: 'center',
        })
        .setOrigin(0.5);

      button.on('pointerover', () => button.setFillStyle(0x660000));
      button.on('pointerout', () => button.setFillStyle(0x8b0000));
      button.on('pointerdown', () => {
        this.checkGuardianAnswer(choice, overlay, panel);
      });
    });
  }

  checkGuardianAnswer(selectedAnswer, overlay, panel) {
    const isCorrect = this.questionManager.checkAnswer(
      selectedAnswer,
      this.currentQuestion.answer
    );

    if (isCorrect) {
      // Trigger combat system event for correct answer
      this.events.emit('crossoverAnswerCorrect', {
        question: this.currentQuestion,
        selectedAnswer,
        isCorrect: true,
        subject: this.currentGuardian.subject,
        difficulty: 'hard',
      });

      // Award coins and experience
      const coinsEarned = this.progressTracker.calculateCoinReward('hard', 0);
      this.progressTracker.recordAnswer(
        this.currentGuardian.subject,
        true,
        0,
        'hard'
      );
      this.coinsEarned += coinsEarned;

      // Level up system
      this.experience += 25;
      if (this.experience >= this.playerLevel * 50) {
        this.playerLevel++;
        this.experience = 0;
        this.showFeedback(
          `🎉 LEVEL UP! Now Level ${this.playerLevel}!`,
          0xffd700
        );
      }

      // Score is now handled by combat system, but add base score
      this.score += 75; // Reduced since combat system adds more
      this.currentGuardian.defeated = true;
      this.questsCompleted[this.currentGuardian.subject] = true;

      // Mark guardian as defeated
      this.currentGuardian.icon.setTint(0x666666);
      this.currentGuardian.label.setText('DEFEATED');

      // Update UI
      this.coinBalanceText.setText(
        `🪙 ${this.progressTracker.getCoinBalance()}`
      );
      this.sessionCoinsText.setText(`Session: +${this.coinsEarned} 🪙`);
      this.scoreText.setText(`Score: ${this.score}`);
      this.levelText.setText(
        `Level: ${this.playerLevel} | XP: ${this.experience}`
      );
      this.questText.setText(this.getQuestProgress());

      this.showFeedback(
        `🤖 Guardian Challenge! Robot Attack Activated!`,
        0x10b981
      );
      this.showCoinCollection(
        coinsEarned,
        this.scale.width / 2,
        this.scale.height / 2 + 100
      );

      // Check if all guardians defeated
      if (Object.values(this.questsCompleted).every(q => q)) {
        this.unlockFinalBoss();
      }
    } else {
      // Trigger combat system event for incorrect answer
      this.events.emit('crossoverAnswerIncorrect', {
        question: this.currentQuestion,
        selectedAnswer,
        correctAnswer: this.currentQuestion.answer,
        isCorrect: false,
        subject: this.currentGuardian.subject,
        difficulty: 'hard',
      });

      this.progressTracker.recordAnswer(this.currentGuardian.subject, false);
      this.showFeedback(
        `❌ Enemy Counter-Attack! Correct answer: ${this.currentQuestion.answer}`,
        0xef4444
      );
    }

    // Close overlay
    overlay.destroy();
    panel.destroy();
    this.isGameActive = true;
  }

  collectCrownPiece(player, crownPiece) {
    if (crownPiece.collected || !this.questsCompleted[crownPiece.subject]) {
      if (!this.questsCompleted[crownPiece.subject]) {
        this.showFeedback(
          `Defeat the ${crownPiece.subject} guardian first!`,
          0xef4444
        );
      }
      return;
    }

    // Collect crown piece
    crownPiece.collected = true;
    this.crownPiecesCollected++;

    // Calculate coin reward
    const coinsEarned = this.progressTracker.calculateCoinReward('medium', 0);
    this.progressTracker.awardCoins(coinsEarned, 'Crown Piece Collected');
    this.coinsEarned += coinsEarned;

    // Update score and UI
    this.score += 200;
    this.experience += 50;

    this.coinBalanceText.setText(`🪙 ${this.progressTracker.getCoinBalance()}`);
    this.sessionCoinsText.setText(`Session: +${this.coinsEarned} 🪙`);
    this.scoreText.setText(`Score: ${this.score}`);
    this.crownText.setText(
      `Crown Pieces: ${this.crownPiecesCollected}/${this.totalCrownPieces}`
    );
    this.levelText.setText(
      `Level: ${this.playerLevel} | XP: ${this.experience}`
    );

    // Show feedback
    this.showFeedback(
      `👑 ${crownPiece.name} Collected! +200 points, +${coinsEarned} coins`,
      0xffd700
    );
    this.showCoinCollection(coinsEarned, player.x, player.y - 50);

    // Remove crown piece visually
    crownPiece.graphic.destroy();
    crownPiece.sparkle.destroy();
    crownPiece.destroy();

    // Check if all crown pieces collected
    if (this.crownPiecesCollected >= this.totalCrownPieces) {
      this.progressTracker.completeWeek(5);
      this.endGame(true);
    }
  }

  unlockFinalBoss() {
    this.finalBossUnlocked = true;
    this.finalBossBtn.setVisible(true);
    this.finalBossText.setVisible(true);

    this.showFeedback(
      '🏆 All Guardians Defeated! Final Boss Unlocked!',
      0xffd700
    );
  }

  startFinalBoss() {
    this.isGameActive = false;

    // Create final boss overlay
    const overlay = this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x8b0000, 0.9)
      .setOrigin(0, 0);

    // Final boss panel
    const panel = this.add
      .rectangle(
        this.scale.width / 2,
        this.scale.height / 2,
        600,
        400,
        0x000000
      )
      .setStrokeStyle(4, 0xffd700);

    let yPos = this.scale.height / 2 - 150;

    this.add
      .text(this.scale.width / 2, yPos, '🐲 FINAL BOSS BATTLE! 🐲', {
        fontSize: '28px',
        fontFamily: 'Arial, sans-serif',
        fill: '#ff0000',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    yPos += 60;
    this.add
      .text(
        this.scale.width / 2,
        yPos,
        `🏆 ULTIMATE KNOWLEDGE CHALLENGE! 🏆\n\n` +
          `Hero Level: ${this.playerLevel}\n` +
          `Crown Pieces: ${this.crownPiecesCollected}/${this.totalCrownPieces}\n` +
          `Quests Completed: ${Object.values(this.questsCompleted).filter(q => q).length}/4\n\n` +
          `You have proven your mastery!\nThe realm of knowledge is yours!`,
        {
          fontSize: '16px',
          fontFamily: 'Arial, sans-serif',
          fill: '#ffffff',
          align: 'center',
        }
      )
      .setOrigin(0.5);

    // Auto-complete after showing victory
    this.time.delayedCall(4000, () => {
      this.endGame(true);
    });
  }

  showCoinCollection(amount, x, y) {
    // Create floating coin animation
    const coinIcon = this.add
      .text(x, y, `+${amount} 🪙`, {
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        fill: '#ffd700',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Animate coin floating up and fading
    this.tweens.add({
      targets: coinIcon,
      y: y - 50,
      alpha: 0,
      scale: 1.2,
      duration: 1000,
      ease: 'Power2',
      onComplete: () => coinIcon.destroy(),
    });
  }

  showFeedback(text, color, x = null, y = null) {
    const feedbackX = x || this.scale.width / 2;
    const feedbackY = y || this.scale.height / 2 + 150;

    const feedback = this.add
      .text(feedbackX, feedbackY, text, {
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        fill: color,
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: feedback,
      alpha: 0,
      y: feedbackY - 50,
      duration: 2000,
      onComplete: () => feedback.destroy(),
    });
  }

  showWelcomeMessage() {
    const welcome = this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2,
        '👑 QUEST FOR KNOWLEDGE! 👑\n\nThe ultimate learning adventure!\nDefeat guardians in each realm!\nCollect all 4 crown pieces!\n\nUse arrow keys or WASD to move!\nMaster all subjects to win!\n\nGood luck, Hero!',
        {
          fontSize: '16px',
          fontFamily: 'Arial, sans-serif',
          fill: '#ffffff',
          stroke: '#4B0082',
          strokeThickness: 3,
          align: 'center',
          backgroundColor: '#1e3a8a',
          padding: { x: 20, y: 15 },
        }
      )
      .setOrigin(0.5);

    this.tweens.add({
      targets: welcome,
      alpha: 0,
      duration: 6000,
      delay: 2000,
      onComplete: () => welcome.destroy(),
    });
  }

  endGame(victory) {
    this.isGameActive = false;

    // Show end game screen
    const overlay = this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.8)
      .setOrigin(0, 0);

    const panel = this.add
      .rectangle(
        this.scale.width / 2,
        this.scale.height / 2,
        500,
        450,
        0x4b0082
      )
      .setStrokeStyle(4, 0xffd700);

    let yPos = this.scale.height / 2 - 180;

    if (victory) {
      this.add
        .text(this.scale.width / 2, yPos, '🏆 KNOWLEDGE MASTER! 🏆', {
          fontSize: '28px',
          fontFamily: 'Arial, sans-serif',
          fill: '#ffd700',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);
    } else {
      this.add
        .text(this.scale.width / 2, yPos, '👑 Continue Your Quest! 👑', {
          fontSize: '28px',
          fontFamily: 'Arial, sans-serif',
          fill: '#ef4444',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);
    }

    yPos += 60;
    this.add
      .text(this.scale.width / 2, yPos, `Final Score: ${this.score}`, {
        fontSize: '20px',
        fontFamily: 'Arial, sans-serif',
        fill: '#ffffff',
      })
      .setOrigin(0.5);

    yPos += 30;
    this.add
      .text(this.scale.width / 2, yPos, `Hero Level: ${this.playerLevel}`, {
        fontSize: '18px',
        fontFamily: 'Arial, sans-serif',
        fill: '#ffffff',
      })
      .setOrigin(0.5);

    yPos += 30;
    this.add
      .text(
        this.scale.width / 2,
        yPos,
        `Crown Pieces: ${this.crownPiecesCollected}/${this.totalCrownPieces}`,
        {
          fontSize: '18px',
          fontFamily: 'Arial, sans-serif',
          fill: '#ffd700',
        }
      )
      .setOrigin(0.5);

    yPos += 30;
    const completedQuests = Object.values(this.questsCompleted).filter(
      q => q
    ).length;
    this.add
      .text(
        this.scale.width / 2,
        yPos,
        `Quests Completed: ${completedQuests}/4`,
        {
          fontSize: '18px',
          fontFamily: 'Arial, sans-serif',
          fill: '#ffffff',
        }
      )
      .setOrigin(0.5);

    // Buttons
    yPos += 80;

    if (!victory) {
      const tryAgainBtn = this.add
        .rectangle(this.scale.width / 2 - 80, yPos, 140, 40, 0x10b981)
        .setStrokeStyle(2, 0xffffff)
        .setInteractive({ useHandCursor: true });

      this.add
        .text(this.scale.width / 2 - 80, yPos, 'Try Again', {
          fontSize: '16px',
          fontFamily: 'Arial, sans-serif',
          fill: '#ffffff',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);

      tryAgainBtn.on('pointerdown', () => {
        this.scene.restart();
      });
    }

    const menuBtn = this.add
      .rectangle(
        victory ? this.scale.width / 2 : this.scale.width / 2 + 80,
        yPos,
        140,
        40,
        0x6366f1
      )
      .setStrokeStyle(2, 0xffffff)
      .setInteractive({ useHandCursor: true });

    this.add
      .text(
        victory ? this.scale.width / 2 : this.scale.width / 2 + 80,
        yPos,
        'Main Menu',
        {
          fontSize: '16px',
          fontFamily: 'Arial, sans-serif',
          fill: '#ffffff',
          fontStyle: 'bold',
        }
      )
      .setOrigin(0.5);

    menuBtn.on('pointerdown', () => {
      this.cameras.main.fadeOut(500, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('EducationalMenuScene');
      });
    });
  }
}
