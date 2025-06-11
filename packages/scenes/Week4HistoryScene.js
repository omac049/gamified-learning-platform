import { Scene } from 'phaser';
import { QuestionManager, ProgressTracker } from '../utils/managers/index.js';
import { CombatSystem } from '../utils/systems/CombatSystem.js';

export class Week4HistoryScene extends Scene {
  constructor() {
    super('Week4HistoryScene');
    this.questionManager = new QuestionManager();
    this.progressTracker = new ProgressTracker();

    // Combat System Integration
    this.combatSystem = null;
    this.characterStats = null;
    this.playerRobot = null;
    this.enemyRobot = null;
    this.combatUI = null;
    this.enemyHealth = 100;
    this.maxEnemyHealth = 100;

    // Game state
    this.score = 0;
    this.tasksCompleted = 0;
    this.impostorFactsFound = 0;
    this.currentRoom = 'cafeteria';
    this.isGameActive = true;
    this.player = null;
    this.rooms = {};
    this.taskStations = null;
    this.impostorFacts = null;
    this.coinsEarned = 0;
    this.equippedEffects = null;
    this.emergencyMeetingCalled = false;
    this.totalTasks = 6;
    this.totalImpostorFacts = 4;
  }

  init() {
    this.cameras.main.fadeIn(1000, 0, 0, 0);

    // Get equipped item effects
    this.equippedEffects = this.progressTracker.getEquippedEffects();

    // Initialize character stats for combat
    this.characterStats = this.progressTracker.getCharacterStats();
    console.log(
      'Week4HistoryScene: Character stats loaded:',
      this.characterStats
    );
  }

  async create() {
    // Initialize combat system first
    await this.initializeCombatSystem();

    // Create the spaceship environment
    this.createSpaceship();

    // Create player character
    this.createPlayer();

    // Create combat robots
    this.createCombatRobots();

    // Create rooms and navigation
    this.createRooms();

    // Create task stations
    this.createTaskStations();

    // Create impostor facts to find
    this.createImpostorFacts();

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
      console.log('Week4HistoryScene: Initializing combat system...');
      this.combatSystem = new CombatSystem(this, {}, this.progressTracker);
      await this.combatSystem.init();
      console.log('Week4HistoryScene: Combat system initialized successfully');
    } catch (error) {
      console.error(
        'Week4HistoryScene: Failed to initialize combat system:',
        error
      );
      // Continue without combat system
    }
  }

  setupCombatEventListeners() {
    // Connect history task events to combat system
    this.events.on('historyAnswerCorrect', data => {
      if (this.combatSystem) {
        const damage = this.combatSystem.onCorrectAnswer(data);
        this.onHistoryAnswerCorrect(data);
      }
    });

    this.events.on('historyAnswerIncorrect', data => {
      if (this.combatSystem) {
        const penalty = this.combatSystem.onIncorrectAnswer(data);
        this.onHistoryAnswerIncorrect(data);
      }
    });
  }

  onHistoryAnswerCorrect(data) {
    // Calculate damage based on character stats
    const baseDamage = 30;
    const damage = Math.floor(baseDamage * this.characterStats.attackPower);

    // Perform robot attack animation
    this.performPlayerAttack(damage);

    // Apply history-specific bonuses
    const historyBonus = Math.floor(this.score * 0.15);
    this.score += 15 + historyBonus;

    // Award experience with intelligence bonus
    const baseXP = 20;
    const xpGained = Math.floor(
      baseXP * (1 + this.characterStats.intelligence / 100)
    );
    this.progressTracker.addExperience(xpGained);

    // Award coins with luck bonus
    const baseCoins = 8;
    const coinsGained = Math.floor(
      baseCoins * (1 + this.characterStats.luck / 100)
    );
    this.progressTracker.addCoins(coinsGained, 'History Investigation Success');

    this.createFloatingText(
      this.scale.width / 2,
      200,
      `+${xpGained} XP, +${coinsGained} Coins!`,
      '#00ff00'
    );
  }

  onHistoryAnswerIncorrect(data) {
    // Calculate penalty reduced by defense
    const basePenalty = 20;
    const penalty = Math.max(5, basePenalty - this.characterStats.defense);

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
      // Create player robot (positioned in navigation area)
      this.playerRobot = this.combatSystem.createPlayerRobot();
      if (this.playerRobot) {
        this.playerRobot.setPosition(120, 200);
        this.playerRobot.setScale(0.5); // Smaller for spaceship
      }

      // Create enemy robot (positioned in weapons area)
      this.enemyRobot = this.combatSystem.createEnemyRobot();
      if (this.enemyRobot) {
        this.enemyRobot.setPosition(620, 500);
        this.enemyRobot.setScale(0.5); // Smaller for spaceship
      }

      // Create combat UI
      this.combatUI = this.combatSystem.createCombatUI();

      console.log('Week4HistoryScene: Combat robots created successfully');
    } catch (error) {
      console.error('Week4HistoryScene: Error creating combat robots:', error);
    }
  }

  performPlayerAttack(damage) {
    if (!this.playerRobot || !this.enemyRobot) return;

    // Player robot attack animation
    this.tweens.add({
      targets: this.playerRobot,
      scaleX: 0.6,
      scaleY: 0.6,
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
      scaleX: 0.6,
      scaleY: 0.6,
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
      25,
      Phaser.Display.Color.HexStringToColor(color).color,
      0.7
    );

    this.tweens.add({
      targets: effect,
      scaleX: 2,
      scaleY: 2,
      alpha: 0,
      duration: 300,
      ease: 'Power2.easeOut',
      onComplete: () => effect.destroy(),
    });
  }

  createFloatingDamageNumber(x, y, damage, color) {
    const damageText = this.add
      .text(x, y, damage.toString(), {
        fontSize: '18px',
        fontFamily: 'Arial, sans-serif',
        fill: color,
        stroke: '#000000',
        strokeThickness: 2,
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: damageText,
      y: y - 40,
      alpha: 0,
      duration: 1000,
      ease: 'Power2.easeOut',
      onComplete: () => damageText.destroy(),
    });
  }

  onEnemyDefeated() {
    // Victory effects
    this.createAttackEffect(this.enemyRobot.x, this.enemyRobot.y, '#ffff00');

    // Bonus rewards for defeating enemy
    const bonusXP = 60;
    const bonusCoins = 30;

    this.progressTracker.addExperience(bonusXP);
    this.progressTracker.addCoins(bonusCoins, 'History Combat Victory');

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

  createSpaceship() {
    // Space background
    this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x000000)
      .setOrigin(0, 0);

    // Add stars
    for (let i = 0; i < 80; i++) {
      const x = Phaser.Math.Between(0, this.scale.width);
      const y = Phaser.Math.Between(0, this.scale.height);
      const star = this.add.circle(
        x,
        y,
        Phaser.Math.Between(1, 2),
        0xffffff,
        0.8
      );

      // Twinkling animation
      this.tweens.add({
        targets: star,
        alpha: 0.3,
        duration: Phaser.Math.Between(2000, 4000),
        yoyo: true,
        repeat: -1,
      });
    }

    // Title
    this.add
      .text(this.scale.width / 2, 50, '🕵️ HISTORY MYSTERY 🕵️', {
        fontSize: '28px',
        fontFamily: 'Arial, sans-serif',
        fill: '#ffffff',
        stroke: '#ff0000',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Current room indicator
    this.roomIndicator = this.add
      .text(this.scale.width / 2, 80, `📍 CAFETERIA`, {
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        fill: '#fbbf24',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5);
  }

  createPlayer() {
    // Get character color from cosmetics
    let playerColor = 0xff0000; // Default red
    const equippedCosmetic =
      this.progressTracker.progress.equippedItems.cosmetic;

    switch (equippedCosmetic) {
      case 'redCharacter':
        playerColor = 0xff0000;
        break;
      case 'blueCharacter':
        playerColor = 0x0000ff;
        break;
      case 'greenCharacter':
        playerColor = 0x00ff00;
        break;
    }

    // Among Us style character
    this.player = this.add.ellipse(
      this.scale.width / 2,
      this.scale.height / 2,
      35,
      45,
      playerColor
    );
    this.player.setStrokeStyle(2, 0x000000);

    // Add visor
    this.playerVisor = this.add.ellipse(
      this.scale.width / 2,
      this.scale.height / 2 - 8,
      20,
      15,
      0x87ceeb
    );
    this.playerVisor.setStrokeStyle(1, 0x000000);

    // Add physics body
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);
    this.player.body.setSize(35, 45);

    // Player properties with equipped effects
    this.player.speed = 120 * (this.equippedEffects.speedMultiplier || 1);

    // Player label
    this.add
      .text(this.player.x, this.player.y - 35, 'DETECTIVE', {
        fontSize: '10px',
        fontFamily: 'Arial, sans-serif',
        fill: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
  }

  createRooms() {
    // Define room areas and their boundaries
    this.rooms = {
      cafeteria: { x: 200, y: 300, width: 200, height: 150, color: 0x4a5568 },
      medbay: { x: 500, y: 200, width: 150, height: 120, color: 0x2d3748 },
      electrical: { x: 700, y: 350, width: 180, height: 140, color: 0x1a202c },
      navigation: { x: 100, y: 150, width: 160, height: 100, color: 0x2b6cb0 },
      weapons: { x: 600, y: 450, width: 140, height: 100, color: 0x742a2a },
      shields: { x: 300, y: 450, width: 120, height: 80, color: 0x276749 },
    };

    // Create room visuals
    Object.entries(this.rooms).forEach(([roomName, room]) => {
      const roomRect = this.add.rectangle(
        room.x,
        room.y,
        room.width,
        room.height,
        room.color
      );
      roomRect.setStrokeStyle(2, 0xffffff);
      roomRect.setAlpha(0.7);

      // Room label
      this.add
        .text(room.x, room.y - room.height / 2 - 15, roomName.toUpperCase(), {
          fontSize: '12px',
          fontFamily: 'Arial, sans-serif',
          fill: '#ffffff',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);

      room.rect = roomRect;
    });
  }

  createTaskStations() {
    this.taskStations = this.physics.add.group();

    // Define task stations with historical themes
    const stations = [
      {
        x: 180,
        y: 280,
        room: 'cafeteria',
        type: 'presidents',
        icon: '🏛️',
        title: 'Presidential Hall',
        color: 0xffd700,
      },
      {
        x: 520,
        y: 180,
        room: 'medbay',
        type: 'exploration',
        icon: '🗺️',
        title: "Explorer's Map",
        color: 0x8b5cf6,
      },
      {
        x: 720,
        y: 330,
        room: 'electrical',
        type: 'founding_fathers',
        icon: '📜',
        title: 'Constitution Corner',
        color: 0x10b981,
      },
      {
        x: 120,
        y: 130,
        room: 'navigation',
        type: 'wars',
        icon: '⚔️',
        title: 'Battle Records',
        color: 0xef4444,
      },
      {
        x: 620,
        y: 430,
        room: 'weapons',
        type: 'holidays',
        icon: '🎆',
        title: 'Holiday Archive',
        color: 0xf59e0b,
      },
      {
        x: 320,
        y: 430,
        room: 'shields',
        type: 'documents',
        icon: '📋',
        title: 'Document Vault',
        color: 0x3b82f6,
      },
    ];

    stations.forEach(stationData => {
      // Create physics body using a graphics object instead of null sprite
      const station = this.physics.add.existing(
        this.add.rectangle(
          stationData.x,
          stationData.y,
          40,
          30,
          stationData.color
        )
      );
      station.setStrokeStyle(2, 0xffffff);
      station.body.setSize(40, 30);

      // Add station icon
      const stationIcon = this.add
        .text(stationData.x, stationData.y, stationData.icon, {
          fontSize: '16px',
        })
        .setOrigin(0.5);

      // Add station label
      const stationLabel = this.add
        .text(stationData.x, stationData.y + 25, stationData.title, {
          fontSize: '10px',
          fontFamily: 'Arial, sans-serif',
          fill: '#ffffff',
          stroke: '#000000',
          strokeThickness: 1,
        })
        .setOrigin(0.5);

      // Store references
      station.icon = stationIcon;
      station.label = stationLabel;
      station.stationType = stationData.type;
      station.title = stationData.title;
      station.room = stationData.room;
      station.completed = false;

      // Add pulsing animation
      this.tweens.add({
        targets: [station, stationIcon],
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 1800,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      this.taskStations.add(station);
    });
  }

  createImpostorFacts() {
    this.impostorFacts = this.physics.add.group();

    // Define impostor facts (incorrect historical statements)
    const impostorData = [
      {
        x: 250,
        y: 320,
        room: 'cafeteria',
        fact: 'George Washington was the 3rd President',
        truth: 'George Washington was the 1st President',
        icon: '❌',
        color: 0xff4444,
      },
      {
        x: 480,
        y: 220,
        room: 'medbay',
        fact: 'Columbus discovered America in 1500',
        truth: 'Columbus reached America in 1492',
        icon: '❌',
        color: 0xff4444,
      },
      {
        x: 680,
        y: 370,
        room: 'electrical',
        fact: 'The Declaration was signed in 1800',
        truth: 'The Declaration was signed in 1776',
        icon: '❌',
        color: 0xff4444,
      },
      {
        x: 140,
        y: 170,
        room: 'navigation',
        fact: 'The Civil War ended in 1870',
        truth: 'The Civil War ended in 1865',
        icon: '❌',
        color: 0xff4444,
      },
    ];

    impostorData.forEach(impostorInfo => {
      // Create physics body using a graphics object instead of null sprite
      const impostor = this.physics.add.existing(
        this.add.circle(impostorInfo.x, impostorInfo.y, 15, impostorInfo.color)
      );
      impostor.setStrokeStyle(2, 0x000000);
      impostor.body.setCircle(15);

      // Add warning icon
      const impostorIcon = this.add
        .text(impostorInfo.x, impostorInfo.y, impostorInfo.icon, {
          fontSize: '12px',
        })
        .setOrigin(0.5);

      // Store references
      impostor.icon = impostorIcon;
      impostor.fact = impostorInfo.fact;
      impostor.truth = impostorInfo.truth;
      impostor.room = impostorInfo.room;

      // Add suspicious pulsing animation
      this.tweens.add({
        targets: [impostor, impostorIcon],
        alpha: 0.5,
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      this.impostorFacts.add(impostor);
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

    // Tasks completed
    this.tasksText = this.add.text(
      20,
      110,
      `Tasks: ${this.tasksCompleted}/${this.totalTasks}`,
      {
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
      }
    );

    // Impostor facts found
    this.impostorText = this.add.text(
      20,
      140,
      `Impostor Facts: ${this.impostorFactsFound}/${this.totalImpostorFacts}`,
      {
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        fill: '#ff4444',
        stroke: '#000000',
        strokeThickness: 2,
      }
    );

    // Active power-up indicator
    this.powerUpText = this.add.text(20, 170, '', {
      fontSize: '12px',
      fontFamily: 'Arial, sans-serif',
      fill: '#fbbf24',
      stroke: '#000000',
      strokeThickness: 1,
    });

    this.updatePowerUpDisplay();

    // Emergency meeting button
    this.emergencyBtn = this.add
      .rectangle(
        this.scale.width / 2,
        this.scale.height - 40,
        200,
        30,
        0xff0000
      )
      .setStrokeStyle(2, 0xffffff)
      .setInteractive({ useHandCursor: true });

    this.add
      .text(
        this.scale.width / 2,
        this.scale.height - 40,
        '🚨 EMERGENCY MEETING',
        {
          fontSize: '14px',
          fontFamily: 'Arial, sans-serif',
          fill: '#ffffff',
          fontStyle: 'bold',
        }
      )
      .setOrigin(0.5);

    this.emergencyBtn.on('pointerdown', () => {
      if (this.impostorFactsFound >= this.totalImpostorFacts) {
        this.callEmergencyMeeting();
      } else {
        this.showFeedback('Find all impostor facts first!', 0xff4444);
      }
    });

    // Instructions
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height - 10,
        'Arrow Keys: Move | Complete tasks and find impostor facts! Call emergency meeting when ready!',
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
    // Player interacts with task stations
    this.physics.add.overlap(
      this.player,
      this.taskStations,
      this.startTask,
      null,
      this
    );

    // Player finds impostor facts
    this.physics.add.overlap(
      this.player,
      this.impostorFacts,
      this.findImpostorFact,
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

    // Update visor position
    this.playerVisor.x = this.player.x;
    this.playerVisor.y = this.player.y - 8;

    // Update current room
    this.updateCurrentRoom();
  }

  updateCurrentRoom() {
    Object.entries(this.rooms).forEach(([roomName, room]) => {
      const bounds = room.rect.getBounds();
      if (bounds.contains(this.player.x, this.player.y)) {
        if (this.currentRoom !== roomName) {
          this.currentRoom = roomName;
          this.roomIndicator.setText(`📍 ${roomName.toUpperCase()}`);
        }
      }
    });
  }

  startTask(player, station) {
    if (!this.isGameActive || station.completed) return;

    this.currentStation = station;
    this.showTaskQuestion(station);
  }

  showTaskQuestion(station) {
    this.isGameActive = false;

    // Get history question matching station type
    let question = this.questionManager.getRandomHistoryQuestion();

    // Try to get a question matching the station type
    const { historyQuestions } = this.questionManager;
    const matchingQuestions = historyQuestions.filter(
      q => q.type === station.stationType
    );
    if (matchingQuestions.length > 0) {
      question =
        matchingQuestions[Math.floor(Math.random() * matchingQuestions.length)];
    }

    this.currentQuestion = question;

    // Create task overlay
    const overlay = this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.8)
      .setOrigin(0, 0)
      .setInteractive({ useHandCursor: false });

    // Task panel
    const panel = this.add
      .rectangle(
        this.scale.width / 2,
        this.scale.height / 2,
        700,
        400,
        0x1e3a8a
      )
      .setStrokeStyle(4, 0xff0000);

    // Station title
    let yPos = this.scale.height / 2 - 150;

    this.add
      .text(
        this.scale.width / 2,
        yPos,
        `🕵️ ${station.title.toUpperCase()} 🕵️`,
        {
          fontSize: '24px',
          fontFamily: 'Arial, sans-serif',
          fill: '#fbbf24',
          fontStyle: 'bold',
        }
      )
      .setOrigin(0.5);

    yPos += 40;
    this.add
      .text(this.scale.width / 2, yPos, 'Historical Investigation Task!', {
        fontSize: '18px',
        fontFamily: 'Arial, sans-serif',
        fill: '#ffffff',
      })
      .setOrigin(0.5);

    yPos += 50;
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
        .rectangle(x, yPos, buttonWidth, buttonHeight, 0x10b981)
        .setStrokeStyle(2, 0xffffff)
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

      button.on('pointerover', () => button.setFillStyle(0x059669));
      button.on('pointerout', () => button.setFillStyle(0x10b981));
      button.on('pointerdown', () => {
        this.checkTaskAnswer(choice, overlay, panel);
      });
    });
  }

  checkTaskAnswer(selectedAnswer, overlay, panel) {
    const isCorrect = this.questionManager.checkAnswer(
      selectedAnswer,
      this.currentQuestion.answer
    );

    if (isCorrect) {
      // Trigger combat system event for correct answer
      this.events.emit('historyAnswerCorrect', {
        question: this.currentQuestion,
        selectedAnswer,
        isCorrect: true,
        subject: 'history',
        difficulty: 'medium',
      });

      // Award coins for correct history answer
      const coinsEarned = this.progressTracker.calculateCoinReward('medium', 0);
      this.progressTracker.recordAnswer('history', true, 0, 'medium');
      this.coinsEarned += coinsEarned;

      this.tasksCompleted++;
      // Score is now handled by combat system, but add base score
      this.score += 50; // Reduced since combat system adds more
      this.currentStation.completed = true;

      // Mark station as completed
      this.currentStation.graphic.setFillStyle(0x10b981);

      // Update UI
      this.coinBalanceText.setText(
        `🪙 ${this.progressTracker.getCoinBalance()}`
      );
      this.sessionCoinsText.setText(`Session: +${this.coinsEarned} 🪙`);
      this.scoreText.setText(`Score: ${this.score}`);
      this.tasksText.setText(
        `Tasks: ${this.tasksCompleted}/${this.totalTasks}`
      );

      this.showFeedback(
        `🤖 Investigation Success! Robot Attack Activated!`,
        0x10b981
      );
      this.showCoinCollection(
        coinsEarned,
        this.scale.width / 2,
        this.scale.height / 2 + 100
      );
    } else {
      // Trigger combat system event for incorrect answer
      this.events.emit('historyAnswerIncorrect', {
        question: this.currentQuestion,
        selectedAnswer,
        correctAnswer: this.currentQuestion.answer,
        isCorrect: false,
        subject: 'history',
        difficulty: 'medium',
      });

      this.progressTracker.recordAnswer('history', false);
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

  findImpostorFact(player, impostor) {
    // Show impostor fact verification
    this.showImpostorVerification(impostor);

    // Remove impostor fact
    impostor.graphic.destroy();
    impostor.icon.destroy();
    impostor.destroy();

    this.impostorFactsFound++;
    this.score += 50;

    // Calculate coin reward
    const coinsEarned = this.progressTracker.calculateCoinReward('easy', 0);
    this.progressTracker.awardCoins(coinsEarned, 'Impostor Fact Found');
    this.coinsEarned += coinsEarned;

    // Update UI
    this.coinBalanceText.setText(`🪙 ${this.progressTracker.getCoinBalance()}`);
    this.sessionCoinsText.setText(`Session: +${this.coinsEarned} 🪙`);
    this.scoreText.setText(`Score: ${this.score}`);
    this.impostorText.setText(
      `Impostor Facts: ${this.impostorFactsFound}/${this.totalImpostorFacts}`
    );

    this.showFeedback(
      `🕵️ Impostor Fact Found! +50 points, +${coinsEarned} coins`,
      0xff4444
    );
    this.showCoinCollection(coinsEarned, player.x, player.y - 50);
  }

  showImpostorVerification(impostor) {
    const verification = this.add
      .text(
        this.scale.width / 2,
        200,
        `❌ IMPOSTOR FACT DETECTED!\n\nFalse: "${impostor.fact}"\n\n✅ Truth: "${impostor.truth}"`,
        {
          fontSize: '16px',
          fontFamily: 'Arial, sans-serif',
          fill: '#ffffff',
          stroke: '#ff0000',
          strokeThickness: 2,
          align: 'center',
          backgroundColor: '#1e3a8a',
          padding: { x: 20, y: 15 },
        }
      )
      .setOrigin(0.5);

    this.tweens.add({
      targets: verification,
      alpha: 0,
      duration: 4000,
      delay: 2000,
      onComplete: () => verification.destroy(),
    });
  }

  callEmergencyMeeting() {
    if (this.emergencyMeetingCalled) return;

    this.emergencyMeetingCalled = true;
    this.isGameActive = false;

    // Create emergency meeting overlay
    const overlay = this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0xff0000, 0.9)
      .setOrigin(0, 0);

    // Emergency meeting panel
    const panel = this.add
      .rectangle(
        this.scale.width / 2,
        this.scale.height / 2,
        600,
        400,
        0x000000
      )
      .setStrokeStyle(4, 0xff0000);

    let yPos = this.scale.height / 2 - 150;

    this.add
      .text(this.scale.width / 2, yPos, '🚨 EMERGENCY MEETING! 🚨', {
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
        `Detective Report:\n\n` +
          `✅ Tasks Completed: ${this.tasksCompleted}/${this.totalTasks}\n` +
          `🕵️ Impostor Facts Found: ${this.impostorFactsFound}/${this.totalImpostorFacts}\n` +
          `🏆 Final Score: ${this.score}\n\n` +
          `The historical timeline has been secured!`,
        {
          fontSize: '16px',
          fontFamily: 'Arial, sans-serif',
          fill: '#ffffff',
          align: 'center',
        }
      )
      .setOrigin(0.5);

    // Check if week completed
    if (
      this.tasksCompleted >= this.totalTasks &&
      this.impostorFactsFound >= this.totalImpostorFacts
    ) {
      this.progressTracker.completeWeek(4);
      this.time.delayedCall(3000, () => {
        this.endGame(true);
      });
    } else {
      this.time.delayedCall(3000, () => {
        overlay.destroy();
        panel.destroy();
        this.isGameActive = true;
        this.emergencyMeetingCalled = false;
      });
    }
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
    const feedbackY = y || this.scale.height / 2 + 100;

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
        '🕵️ HISTORY MYSTERY! 🕵️\n\nInvestigate the spaceship and find impostor facts!\nComplete tasks and gather evidence!\n\nUse arrow keys or WASD to move around!\nCall emergency meeting when ready!\n\nGood luck, Detective!',
        {
          fontSize: '16px',
          fontFamily: 'Arial, sans-serif',
          fill: '#ffffff',
          stroke: '#ff0000',
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
      duration: 5000,
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
        400,
        0x1e3a8a
      )
      .setStrokeStyle(4, 0xff0000);

    let yPos = this.scale.height / 2 - 150;

    if (victory) {
      this.add
        .text(this.scale.width / 2, yPos, '🏆 MYSTERY SOLVED! 🏆', {
          fontSize: '28px',
          fontFamily: 'Arial, sans-serif',
          fill: '#ffd700',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);
    } else {
      this.add
        .text(this.scale.width / 2, yPos, '🕵️ Keep Investigating! 🕵️', {
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
      .text(
        this.scale.width / 2,
        yPos,
        `Tasks Completed: ${this.tasksCompleted}/${this.totalTasks}`,
        {
          fontSize: '18px',
          fontFamily: 'Arial, sans-serif',
          fill: '#ffffff',
        }
      )
      .setOrigin(0.5);

    yPos += 30;
    const accuracy = this.progressTracker.getAccuracy('history');
    this.add
      .text(this.scale.width / 2, yPos, `History Accuracy: ${accuracy}%`, {
        fontSize: '18px',
        fontFamily: 'Arial, sans-serif',
        fill: '#ffffff',
      })
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
