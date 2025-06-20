import { Scene } from 'phaser';
import { QuestionManager, ProgressTracker } from '../utils/managers/index.js';
import { CombatSystem } from '../utils/systems/CombatSystem.js';

export class Week3ScienceScene extends Scene {
  constructor() {
    super('Week3ScienceScene');
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
    this.experimentsCompleted = 0;
    this.blocksCollected = 0;
    this.currentExperiment = null;
    this.isGameActive = true;
    this.player = null;
    this.blocks = null;
    this.experimentStations = null;
    this.coinsEarned = 0;
    this.equippedEffects = null;
    this.inventory = {
      dirt: 0,
      stone: 0,
      water: 0,
      fire: 0,
      plant: 0,
      crystal: 0,
    };
  }

  init() {
    this.cameras.main.fadeIn(1000, 0, 0, 0);

    // Get equipped item effects
    this.equippedEffects = this.progressTracker.getEquippedEffects();

    // Initialize character stats for combat
    this.characterStats = this.progressTracker.getCharacterStats();
    console.log(
      'Week3ScienceScene: Character stats loaded:',
      this.characterStats
    );
  }

  async create() {
    // Initialize combat system first
    await this.initializeCombatSystem();

    // Create the Minecraft-style science world
    this.createWorld();

    // Create player character
    this.createPlayer();

    // Create combat robots
    this.createCombatRobots();

    // Create collectible blocks
    this.createBlocks();

    // Create experiment stations
    this.createExperimentStations();

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
      console.log('Week3ScienceScene: Initializing combat system...');
      this.combatSystem = new CombatSystem(this, {}, this.progressTracker);
      await this.combatSystem.init();
      console.log('Week3ScienceScene: Combat system initialized successfully');
    } catch (error) {
      console.error(
        'Week3ScienceScene: Failed to initialize combat system:',
        error
      );
      // Continue without combat system
    }
  }

  setupCombatEventListeners() {
    // Connect science experiment events to combat system
    this.events.on('scienceAnswerCorrect', data => {
      if (this.combatSystem) {
        const damage = this.combatSystem.onCorrectAnswer(data);
        this.onScienceAnswerCorrect(data);
      }
    });

    this.events.on('scienceAnswerIncorrect', data => {
      if (this.combatSystem) {
        const penalty = this.combatSystem.onIncorrectAnswer(data);
        this.onScienceAnswerIncorrect(data);
      }
    });
  }

  onScienceAnswerCorrect(data) {
    // Calculate damage based on character stats
    const baseDamage = 25;
    const damage = Math.floor(baseDamage * this.characterStats.attackPower);

    // Perform robot attack animation
    this.performPlayerAttack(damage);

    // Apply science-specific bonuses
    const scienceBonus = Math.floor(this.score * 0.1);
    this.score += 10 + scienceBonus;

    // Award experience with intelligence bonus
    const baseXP = 15;
    const xpGained = Math.floor(
      baseXP * (1 + this.characterStats.intelligence / 100)
    );
    this.progressTracker.addExperience(xpGained);

    // Award coins with luck bonus
    const baseCoins = 5;
    const coinsGained = Math.floor(
      baseCoins * (1 + this.characterStats.luck / 100)
    );
    this.progressTracker.addCoins(coinsGained, 'Science Experiment Success');

    this.createFloatingText(
      this.scale.width / 2,
      200,
      `+${xpGained} XP, +${coinsGained} Coins!`,
      '#00ff00'
    );
  }

  onScienceAnswerIncorrect(data) {
    // Calculate penalty reduced by defense
    const basePenalty = 15;
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
      // Create player robot (positioned in lab area)
      this.playerRobot = this.combatSystem.createPlayerRobot();
      if (this.playerRobot) {
        this.playerRobot.setPosition(150, this.scale.height - 300);
        this.playerRobot.setScale(0.6); // Smaller for science lab
      }

      // Create enemy robot (positioned in greenhouse area)
      this.enemyRobot = this.combatSystem.createEnemyRobot();
      if (this.enemyRobot) {
        this.enemyRobot.setPosition(700, this.scale.height - 300);
        this.enemyRobot.setScale(0.6); // Smaller for science lab
      }

      // Create combat UI
      this.combatUI = this.combatSystem.createCombatUI();

      console.log('Week3ScienceScene: Combat robots created successfully');
    } catch (error) {
      console.error('Week3ScienceScene: Error creating combat robots:', error);
    }
  }

  performPlayerAttack(damage) {
    if (!this.playerRobot || !this.enemyRobot) return;

    // Player robot attack animation
    this.tweens.add({
      targets: this.playerRobot,
      scaleX: 0.7,
      scaleY: 0.7,
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
      scaleX: 0.7,
      scaleY: 0.7,
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
      30,
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
        fontSize: '20px',
        fontFamily: 'Arial, sans-serif',
        fill: color,
        stroke: '#000000',
        strokeThickness: 2,
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.tweens.add({
      targets: damageText,
      y: y - 50,
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
    const bonusXP = 50;
    const bonusCoins = 25;

    this.progressTracker.addExperience(bonusXP);
    this.progressTracker.addCoins(bonusCoins, 'Science Combat Victory');

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

  createWorld() {
    // Sky background with gradient
    this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x87ceeb)
      .setOrigin(0, 0);

    // Add clouds
    for (let i = 0; i < 6; i++) {
      const x = Phaser.Math.Between(0, this.scale.width);
      const y = Phaser.Math.Between(50, 150);
      this.createCloud(x, y);
    }

    // Ground layer (grass blocks)
    for (let x = 0; x < this.scale.width; x += 40) {
      this.add
        .rectangle(x + 20, this.scale.height - 20, 40, 40, 0x228b22)
        .setStrokeStyle(2, 0x000000);
    }

    // Underground layer (dirt blocks)
    for (let x = 0; x < this.scale.width; x += 40) {
      this.add
        .rectangle(x + 20, this.scale.height - 60, 40, 40, 0x8b4513)
        .setStrokeStyle(2, 0x000000);
    }

    // Title
    this.add
      .text(this.scale.width / 2, 50, '⛏️ SCIENCE QUEST & CRAFT ⛏️', {
        fontSize: '28px',
        fontFamily: 'Arial, sans-serif',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4,
      })
      .setOrigin(0.5);

    // Create decorative structures
    this.createStructures();
  }

  createCloud(x, y) {
    const cloud = this.add.ellipse(x, y, 60, 30, 0xffffff, 0.8);

    // Floating animation
    this.tweens.add({
      targets: cloud,
      x: x + 100,
      duration: Phaser.Math.Between(15000, 25000),
      repeat: -1,
      yoyo: true,
      ease: 'Sine.easeInOut',
    });
  }

  createStructures() {
    // Laboratory building
    const labX = 150;
    const labY = this.scale.height - 200;

    // Lab walls
    for (let i = 0; i < 4; i++) {
      for (let j = 0; j < 3; j++) {
        this.add
          .rectangle(labX + i * 40, labY + j * 40, 40, 40, 0x696969)
          .setStrokeStyle(2, 0x000000);
      }
    }

    // Lab sign
    this.add
      .text(labX + 60, labY - 20, '🔬 LAB', {
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Greenhouse
    const greenhouseX = 700;
    const greenhouseY = this.scale.height - 180;

    // Greenhouse structure
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 2; j++) {
        this.add
          .rectangle(
            greenhouseX + i * 40,
            greenhouseY + j * 40,
            40,
            40,
            0x90ee90,
            0.7
          )
          .setStrokeStyle(2, 0x228b22);
      }
    }

    // Greenhouse sign
    this.add
      .text(greenhouseX + 40, greenhouseY - 20, '🌱 GREENHOUSE', {
        fontSize: '14px',
        fontFamily: 'Arial, sans-serif',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5);
  }

  createPlayer() {
    // Get character color from cosmetics
    let playerColor = 0x4169e1; // Default blue
    const equippedCosmetic =
      this.progressTracker.progress.equippedItems.cosmetic;

    switch (equippedCosmetic) {
      case 'redCharacter':
        playerColor = 0xef4444;
        break;
      case 'blueCharacter':
        playerColor = 0x3b82f6;
        break;
      case 'greenCharacter':
        playerColor = 0x10b981;
        break;
    }

    // Minecraft-style character (blocky)
    this.player = this.add.rectangle(
      100,
      this.scale.height - 120,
      25,
      35,
      playerColor
    );
    this.player.setStrokeStyle(2, 0x000000);

    // Add physics body
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);
    this.player.body.setBounce(0.2);

    // Player properties with equipped effects
    this.player.speed = 150 * (this.equippedEffects.speedMultiplier || 1);

    // Player label
    this.add
      .text(this.player.x, this.player.y - 25, 'SCIENTIST', {
        fontSize: '10px',
        fontFamily: 'Arial, sans-serif',
        fill: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
  }

  createBlocks() {
    this.blocks = this.physics.add.group();

    // Define block types and their properties
    const blockTypes = [
      { type: 'dirt', color: 0x8b4513, icon: '🟫', x: 300, y: 300 },
      { type: 'stone', color: 0x696969, icon: '🪨', x: 450, y: 250 },
      { type: 'water', color: 0x0000ff, icon: '💧', x: 600, y: 350 },
      { type: 'fire', color: 0xff4500, icon: '🔥', x: 200, y: 200 },
      { type: 'plant', color: 0x228b22, icon: '🌿', x: 750, y: 280 },
      { type: 'crystal', color: 0x9370db, icon: '💎', x: 500, y: 180 },
    ];

    blockTypes.forEach(blockData => {
      // Create physics body using a graphics object instead of null sprite
      const block = this.physics.add.existing(
        this.add.rectangle(blockData.x, blockData.y, 30, 30, blockData.color)
      );
      block.setStrokeStyle(2, 0x000000);
      block.body.setSize(30, 30);

      // Add block icon
      const blockIcon = this.add
        .text(blockData.x, blockData.y, blockData.icon, {
          fontSize: '16px',
        })
        .setOrigin(0.5);

      // Store references
      block.icon = blockIcon;
      block.blockType = blockData.type;

      // Add floating animation
      this.tweens.add({
        targets: [block, blockIcon],
        y: blockData.y - 10,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      this.blocks.add(block);
    });
  }

  createExperimentStations() {
    this.experimentStations = this.physics.add.group();

    // Define experiment stations
    const stations = [
      {
        x: 150,
        y: this.scale.height - 160,
        type: 'chemistry',
        icon: '⚗️',
        color: 0x9370db,
        title: 'Chemistry Lab',
      },
      {
        x: 700,
        y: this.scale.height - 140,
        type: 'biology',
        icon: '🔬',
        color: 0x228b22,
        title: 'Biology Station',
      },
      {
        x: 400,
        y: this.scale.height - 180,
        type: 'physics',
        icon: '⚡',
        color: 0xffd700,
        title: 'Physics Lab',
      },
      {
        x: 550,
        y: this.scale.height - 160,
        type: 'astronomy',
        icon: '🌟',
        color: 0x4169e1,
        title: 'Observatory',
      },
    ];

    stations.forEach(stationData => {
      // Create physics body using a graphics object instead of null sprite
      const station = this.physics.add.existing(
        this.add.circle(stationData.x, stationData.y, 25, stationData.color)
      );
      station.setStrokeStyle(3, 0xffffff);
      station.body.setCircle(25);

      // Add station icon
      const stationIcon = this.add
        .text(stationData.x, stationData.y, stationData.icon, {
          fontSize: '20px',
        })
        .setOrigin(0.5);

      // Add station label
      const stationLabel = this.add
        .text(stationData.x, stationData.y + 40, stationData.title, {
          fontSize: '12px',
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

      // Add pulsing animation
      this.tweens.add({
        targets: [station, stationIcon],
        scaleX: 1.1,
        scaleY: 1.1,
        duration: 1500,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      this.experimentStations.add(station);
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

    // Experiments completed
    this.experimentsText = this.add.text(
      20,
      80,
      `Experiments: ${this.experimentsCompleted}/4`,
      {
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
      }
    );

    // Blocks collected
    this.blocksText = this.add.text(
      20,
      110,
      `Blocks: ${this.blocksCollected}/6`,
      {
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        fill: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
      }
    );

    // Inventory display
    this.inventoryText = this.add.text(20, 140, this.getInventoryDisplay(), {
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

    // Instructions
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height - 20,
        'Arrow Keys: Move | Collect blocks and visit experiment stations to learn science! Earn coins for discoveries!',
        {
          fontSize: '12px',
          fontFamily: 'Arial, sans-serif',
          fill: '#ffffff',
          stroke: '#000000',
          strokeThickness: 1,
          align: 'center',
        }
      )
      .setOrigin(0.5);
  }

  getInventoryDisplay() {
    let display = 'Inventory: ';
    Object.entries(this.inventory).forEach(([type, count]) => {
      if (count > 0) {
        const icons = {
          dirt: '🟫',
          stone: '🪨',
          water: '💧',
          fire: '🔥',
          plant: '🌿',
          crystal: '💎',
        };
        display += `${icons[type]}${count} `;
      }
    });
    return display;
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
    // Player collects blocks
    this.physics.add.overlap(
      this.player,
      this.blocks,
      this.collectBlock,
      null,
      this
    );

    // Player interacts with experiment stations
    this.physics.add.overlap(
      this.player,
      this.experimentStations,
      this.startExperiment,
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
      if (pointer.x < this.scale.width / 2) {
        // Left side - move left
        this.player.body.setVelocityX(-this.player.speed);
      } else {
        // Right side - move right
        this.player.body.setVelocityX(this.player.speed);
      }
    });
  }

  update() {
    if (!this.isGameActive) return;

    // Player movement
    if (this.cursors.left.isDown || this.wasd.A.isDown) {
      this.player.body.setVelocityX(-this.player.speed);
    } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
      this.player.body.setVelocityX(this.player.speed);
    } else {
      this.player.body.setVelocityX(0);
    }

    if (this.cursors.up.isDown || this.wasd.W.isDown) {
      this.player.body.setVelocityY(-this.player.speed);
    } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
      this.player.body.setVelocityY(this.player.speed);
    } else {
      this.player.body.setVelocityY(0);
    }
  }

  collectBlock(player, block) {
    // Add to inventory
    this.inventory[block.blockType]++;
    this.blocksCollected++;

    // Calculate coin reward
    const coinsEarned = this.progressTracker.calculateCoinReward('easy', 0);
    this.progressTracker.awardCoins(coinsEarned, 'Block Collection');
    this.coinsEarned += coinsEarned;

    // Update score and UI
    this.score += 25;
    this.coinBalanceText.setText(`🪙 ${this.progressTracker.getCoinBalance()}`);
    this.sessionCoinsText.setText(`Session: +${this.coinsEarned} 🪙`);
    this.scoreText.setText(`Score: ${this.score}`);
    this.blocksText.setText(`Blocks: ${this.blocksCollected}/6`);
    this.inventoryText.setText(this.getInventoryDisplay());

    // Show feedback
    const blockIcons = {
      dirt: '🟫',
      stone: '🪨',
      water: '💧',
      fire: '🔥',
      plant: '🌿',
      crystal: '💎',
    };
    this.showFeedback(
      `Collected ${blockIcons[block.blockType]} ${block.blockType}! (+${coinsEarned} coins)`,
      0x10b981,
      player.x,
      player.y - 30
    );
    this.showCoinCollection(coinsEarned, player.x, player.y - 50);

    // Remove block
    block.graphic.destroy();
    block.icon.destroy();
    block.destroy();

    // Check if all blocks collected
    if (this.blocksCollected >= 6) {
      this.showFeedback(
        'All blocks collected! Visit experiment stations to learn!',
        0xffd700,
        player.x,
        player.y - 60
      );
    }
  }

  startExperiment(player, station) {
    if (!this.isGameActive) return;

    // Check if player has required materials (at least 2 different block types)
    const materialCount = Object.values(this.inventory).filter(
      count => count > 0
    ).length;
    if (materialCount < 2) {
      this.showFeedback(
        'Collect more blocks to start experiments!',
        0xef4444,
        player.x,
        player.y - 30
      );
      return;
    }

    this.currentStation = station;
    this.showExperimentQuestion(station);
  }

  showExperimentQuestion(station) {
    this.isGameActive = false;

    // Get science question matching station type
    let question = this.questionManager.getRandomScienceQuestion();

    // Try to get a question matching the station type
    const { scienceQuestions } = this.questionManager;
    const matchingQuestions = scienceQuestions.filter(
      q => q.type === station.stationType
    );
    if (matchingQuestions.length > 0) {
      question =
        matchingQuestions[Math.floor(Math.random() * matchingQuestions.length)];
    }

    this.currentQuestion = question;

    // Create experiment overlay
    const overlay = this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.8)
      .setOrigin(0, 0)
      .setInteractive({ useHandCursor: false });

    // Experiment panel
    const panel = this.add
      .rectangle(
        this.scale.width / 2,
        this.scale.height / 2,
        700,
        400,
        0x1e3a8a
      )
      .setStrokeStyle(4, 0xffffff);

    // Station title
    let yPos = this.scale.height / 2 - 150;

    this.add
      .text(
        this.scale.width / 2,
        yPos,
        `🔬 ${station.title.toUpperCase()} 🔬`,
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
      .text(this.scale.width / 2, yPos, 'Science Experiment Challenge!', {
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
        this.checkExperimentAnswer(choice, overlay, panel);
      });
    });
  }

  checkExperimentAnswer(selectedAnswer, overlay, panel) {
    const isCorrect = this.questionManager.checkAnswer(
      selectedAnswer,
      this.currentQuestion.answer
    );

    if (isCorrect) {
      // Trigger combat system event for correct answer
      this.events.emit('scienceAnswerCorrect', {
        question: this.currentQuestion,
        selectedAnswer,
        isCorrect: true,
        subject: 'science',
        difficulty: 'medium',
      });

      // Award coins for correct science answer
      const coinsEarned = this.progressTracker.calculateCoinReward('medium', 0);
      this.progressTracker.recordAnswer('science', true, 0, 'medium');
      this.coinsEarned += coinsEarned;

      this.experimentsCompleted++;
      // Score is now handled by combat system, but add base score
      this.score += 50; // Reduced since combat system adds more

      // Update UI
      this.coinBalanceText.setText(
        `🪙 ${this.progressTracker.getCoinBalance()}`
      );
      this.sessionCoinsText.setText(`Session: +${this.coinsEarned} 🪙`);
      this.scoreText.setText(`Score: ${this.score}`);
      this.experimentsText.setText(
        `Experiments: ${this.experimentsCompleted}/4`
      );

      this.showFeedback(
        `🧪 Experiment Success! Robot Attack Activated!`,
        0x10b981
      );
      this.showCoinCollection(
        coinsEarned,
        this.scale.width / 2,
        this.scale.height / 2 + 100
      );

      // Check if all experiments completed
      if (this.experimentsCompleted >= 4) {
        this.progressTracker.completeWeek(3);
        this.endGame(true);
      }
    } else {
      // Trigger combat system event for incorrect answer
      this.events.emit('scienceAnswerIncorrect', {
        question: this.currentQuestion,
        selectedAnswer,
        correctAnswer: this.currentQuestion.answer,
        isCorrect: false,
        subject: 'science',
        difficulty: 'medium',
      });

      this.progressTracker.recordAnswer('science', false);
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
        '⛏️ SCIENCE QUEST & CRAFT! ⛏️\n\nExplore the science realm and conduct experiments!\nCollect blocks and visit experiment stations!\n\nUse arrow keys or WASD to move around!\n\nGood luck, Young Scientist!',
        {
          fontSize: '18px',
          fontFamily: 'Arial, sans-serif',
          fill: '#ffffff',
          stroke: '#000000',
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
      .setStrokeStyle(4, 0xffffff);

    let yPos = this.scale.height / 2 - 150;

    if (victory) {
      this.add
        .text(this.scale.width / 2, yPos, '🏆 SCIENCE MASTER! 🏆', {
          fontSize: '28px',
          fontFamily: 'Arial, sans-serif',
          fill: '#ffd700',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);
    } else {
      this.add
        .text(this.scale.width / 2, yPos, '🔬 Keep Exploring! 🔬', {
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
        `Experiments Completed: ${this.experimentsCompleted}/4`,
        {
          fontSize: '18px',
          fontFamily: 'Arial, sans-serif',
          fill: '#ffffff',
        }
      )
      .setOrigin(0.5);

    yPos += 30;
    const accuracy = this.progressTracker.getAccuracy('science');
    this.add
      .text(this.scale.width / 2, yPos, `Science Accuracy: ${accuracy}%`, {
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
