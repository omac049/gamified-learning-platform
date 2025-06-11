import { Scene } from 'phaser';
import { QuestionManager, ProgressTracker } from '../utils/managers/index.js';
import { CombatSystem } from '../utils/systems/CombatSystem.js';

export class Week2ReadingScene extends Scene {
  constructor() {
    super('Week2ReadingScene');
    this.questionManager = new QuestionManager();
    this.progressTracker = new ProgressTracker();

    // 🤖 COMBAT SYSTEM INTEGRATION
    this.combatSystem = null;

    // Game state
    this.score = 0;
    this.lives = 3;
    this.wordsCollected = 0;
    this.currentLevel = 1;
    this.totalLevels = 5;
    this.isGameActive = true;
    this.player = null;
    this.platforms = null;
    this.wordCoins = null;
    this.enemies = null;
    this.currentStory = null;
    this.storyProgress = 0;
    this.coinsEarned = 0;
    this.equippedEffects = null;

    // 🤖 COMBAT SYSTEM - Reading Combat State
    this.readingCombatActive = false;
    this.currentReadingChallenge = null;
    this.streak = 0;
    this.questionsAnswered = 0;
    this.correctAnswers = 0;
    this.maxStreak = 0;

    // Character stats for combat
    this.characterStats = null;
  }

  init() {
    this.cameras.main.fadeIn(1000, 0, 0, 0);

    // Get equipped item effects
    this.equippedEffects = this.progressTracker.getEquippedEffects();

    // 🤖 COMBAT SYSTEM - Initialize character stats
    this.characterStats = this.progressTracker.getCharacterStats();
    console.log(
      'Week2ReadingScene: Character stats loaded:',
      this.characterStats
    );
  }

  create() {
    console.log('Week2ReadingScene: Creating enhanced reading combat scene...');

    // 🤖 COMBAT SYSTEM - Initialize combat system
    this.combatSystem = new CombatSystem(this, {}, this.progressTracker);
    this.combatSystem.init();

    // Create the enhanced reading combat world
    this.createWorld();

    // Create player character
    this.createPlayer();

    // Create platforms and level geometry
    this.createPlatforms();

    // Create collectible word coins
    this.createWordCoins();

    // Create enemies (reading obstacles)
    this.createEnemies();

    // Create UI
    this.createUI();

    // Set up physics and collisions
    this.setupPhysics();

    // Create controls
    this.createControls();

    // Show welcome message
    this.showWelcomeMessage();

    // Start current story
    this.startStoryLevel();

    // 🤖 COMBAT SYSTEM - Set up combat event listeners
    this.setupCombatEventListeners();

    console.log('Week2ReadingScene: Enhanced reading combat scene created!');
  }

  // 🤖 COMBAT SYSTEM - Set up combat event listeners
  setupCombatEventListeners() {
    // Connect reading answers to combat system
    this.events.on('readingAnswerCorrect', data => {
      this.onReadingAnswerCorrect(data);
    });

    this.events.on('readingAnswerIncorrect', data => {
      this.onReadingAnswerIncorrect(data);
    });

    console.log('Week2ReadingScene: Combat event listeners set up');
  }

  // 🤖 COMBAT SYSTEM - Handle correct reading answer
  onReadingAnswerCorrect(data) {
    console.log(
      'Week2ReadingScene: Correct reading answer with combat integration!',
      data
    );

    // Update reading stats
    this.correctAnswers++;
    this.questionsAnswered++;
    this.streak++;
    this.maxStreak = Math.max(this.maxStreak, this.streak);

    // Calculate score bonus with character stats
    const baseScore = 100;
    const scoreBonus =
      Math.floor(baseScore * this.characterStats.attackPower) +
      this.streak * 20;
    this.score += scoreBonus;

    // Combat system handles robot attack
    const damage = this.combatSystem.onCorrectAnswer({
      subject: 'reading',
      difficulty: data.difficulty || 'medium',
      timeSpent: data.timeSpent || 5,
    });

    // Award XP and coins with character bonuses
    const xpGain = this.progressTracker.addExperience(15);
    const coinGain = this.progressTracker.addCoins(10, 'Reading Mastery');

    // Create floating score text
    this.combatSystem.createFloatingText(
      this.combatSystem.playerRobot.x,
      this.combatSystem.playerRobot.y - 30,
      `+${scoreBonus}`,
      '#00ff00',
      '18px'
    );

    // Record the answer
    this.progressTracker.recordAnswer(
      'reading',
      true,
      data.timeSpent || 5,
      data.difficulty || 'medium'
    );

    console.log(
      `Reading Combat: ${damage} damage dealt, ${scoreBonus} score, ${xpGain} XP, ${coinGain} coins`
    );
  }

  // 🤖 COMBAT SYSTEM - Handle incorrect reading answer
  onReadingAnswerIncorrect(data) {
    console.log(
      'Week2ReadingScene: Incorrect reading answer with combat integration!',
      data
    );

    // Update reading stats
    this.questionsAnswered++;
    this.streak = 0; // Reset streak unless player has streak keeper

    // Check for streak keeper equipment
    const equippedItems = this.progressTracker.getEquippedItems();
    if (equippedItems.core === 'streak_keeper') {
      this.streak = Math.max(1, this.streak);
      this.combatSystem.createFloatingText(
        this.combatSystem.playerRobot.x,
        this.combatSystem.playerRobot.y - 30,
        'STREAK SAVED!',
        '#ffd700',
        '14px'
      );
    }

    // Combat system handles enemy attack
    const penalty = this.combatSystem.onIncorrectAnswer({
      subject: 'reading',
      difficulty: data.difficulty || 'medium',
      timeSpent: data.timeSpent || 5,
    });

    // Apply score penalty
    this.score = Math.max(0, this.score - penalty);

    // Record the answer
    this.progressTracker.recordAnswer(
      'reading',
      false,
      data.timeSpent || 5,
      data.difficulty || 'medium'
    );

    console.log(
      `Reading Combat: ${penalty} penalty applied (reduced by ${this.characterStats.defense} defense)`
    );
  }

  createWorld() {
    // Enhanced background with combat theme
    this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x1a0033)
      .setOrigin(0, 0);

    // Add stars for space combat feel
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
        repeat: -1,
      });
    }

    // Add some clouds for atmosphere
    for (let i = 0; i < 8; i++) {
      const x = Phaser.Math.Between(0, this.scale.width);
      const y = Phaser.Math.Between(50, 200);
      const cloud = this.add.ellipse(x, y, 80, 40, 0xffffff, 0.3);

      // Floating cloud animation
      this.tweens.add({
        targets: cloud,
        x: x + 50,
        duration: Phaser.Math.Between(8000, 12000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    // Ground with cyber grid
    const ground = this.add.graphics();
    ground.fillStyle(0x0066aa, 0.3);
    ground.fillRect(0, this.scale.height - 60, this.scale.width, 60);

    // Grid lines
    ground.lineStyle(1, 0x00ffff, 0.5);
    for (let x = 0; x < this.scale.width; x += 50) {
      ground.lineBetween(x, this.scale.height - 60, x, this.scale.height);
    }

    // Enhanced title with combat theme
    this.add
      .text(
        this.scale.width / 2,
        30,
        `⚔️ READING COMBAT ARENA - LEVEL ${this.currentLevel} ⚔️`,
        {
          fontSize: '24px',
          fontFamily: 'Courier, monospace',
          fill: '#00ffff',
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 2,
        }
      )
      .setOrigin(0.5);
  }

  createPlayer() {
    // Get character color from cosmetics
    let playerColor = 0xff6b6b; // Default red
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

    // Simple player representation (Mario-style)
    this.player = this.add.circle(
      100,
      this.scale.height - 150,
      15,
      playerColor
    );
    this.player.setStrokeStyle(2, 0x000000);

    // Add physics body
    this.physics.add.existing(this.player);
    this.player.body.setCollideWorldBounds(true);
    this.player.body.setBounce(0.2);

    // Player properties with equipped effects
    this.player.isJumping = false;
    this.player.speed = 200 * (this.equippedEffects.speedMultiplier || 1);
    this.player.jumpPower = 400 * (this.equippedEffects.jumpMultiplier || 1);

    // Player label
    this.add
      .text(this.player.x, this.player.y - 30, 'READER', {
        fontSize: '12px',
        fontFamily: 'Arial, sans-serif',
        fill: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);
  }

  createPlatforms() {
    this.platforms = this.physics.add.staticGroup();

    // Ground platform
    const ground = this.add.rectangle(
      0,
      this.scale.height - 30,
      this.scale.width,
      60,
      0x8b4513
    );
    ground.setOrigin(0, 0);
    this.platforms.add(ground);

    // Floating platforms (Mario-style)
    const platformData = [
      { x: 200, y: 400, width: 120, height: 20 },
      { x: 400, y: 320, width: 120, height: 20 },
      { x: 600, y: 240, width: 120, height: 20 },
      { x: 800, y: 360, width: 120, height: 20 },
      { x: 300, y: 180, width: 100, height: 20 },
    ];

    platformData.forEach(data => {
      const platform = this.add.rectangle(
        data.x,
        data.y,
        data.width,
        data.height,
        0x8b4513
      );
      platform.setStrokeStyle(2, 0x654321);
      this.platforms.add(platform);
    });
  }

  createWordCoins() {
    this.wordCoins = this.physics.add.group();

    // Get reading question for this level
    const question = this.questionManager.getRandomReadingQuestion();
    this.currentStory = question;

    // Create word coins based on the story
    const words = question.passage.split(' ');
    const importantWords = words.filter(word => word.length > 3); // Focus on longer words

    // Place word coins around the level
    const coinPositions = [
      { x: 250, y: 350 },
      { x: 450, y: 270 },
      { x: 650, y: 190 },
      { x: 850, y: 310 },
      { x: 350, y: 130 },
      { x: 150, y: 200 },
      { x: 750, y: 150 },
    ];

    importantWords.slice(0, 7).forEach((word, index) => {
      if (coinPositions[index]) {
        const pos = coinPositions[index];

        // Create physics body using a graphics object instead of null sprite
        const coin = this.physics.add.existing(
          this.add.circle(pos.x, pos.y, 8, 0xffd700)
        );
        coin.setStrokeStyle(2, 0xffa500);
        coin.body.setCircle(8);

        // Add word text
        const wordText = this.add
          .text(pos.x, pos.y, word, {
            fontSize: '10px',
            fontFamily: 'Arial, sans-serif',
            fill: '#000000',
            fontStyle: 'bold',
          })
          .setOrigin(0.5);

        // Store references
        coin.wordText = wordText;
        coin.word = word;

        // Add floating animation
        this.tweens.add({
          targets: [coin, wordText],
          y: pos.y - 10,
          duration: 1500,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });

        this.wordCoins.add(coin);
      }
    });
  }

  createEnemies() {
    this.enemies = this.physics.add.group();

    // Create simple enemies (reading obstacles)
    const enemyPositions = [
      { x: 500, y: this.scale.height - 100 },
      { x: 700, y: this.scale.height - 100 },
    ];

    enemyPositions.forEach(pos => {
      // Create physics body using a graphics object instead of null sprite
      const enemy = this.physics.add.existing(
        this.add.circle(pos.x, pos.y, 12, 0xff4444)
      );
      enemy.setStrokeStyle(2, 0x000000);
      enemy.body.setCircle(12);

      // Add spikes or danger indicator
      const dangerIcon = this.add
        .text(pos.x, pos.y, '⚠️', {
          fontSize: '16px',
        })
        .setOrigin(0.5);

      enemy.dangerIcon = dangerIcon;
      enemy.body.setVelocityX(Phaser.Math.Between(-50, 50));
      enemy.body.setBounce(1);
      enemy.body.setCollideWorldBounds(true);

      this.enemies.add(enemy);
    });
  }

  createUI() {
    // Lives display
    this.livesText = this.add.text(20, 70, `❤️ Lives: ${this.lives}`, {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    });

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

    // Words collected
    this.wordsText = this.add.text(20, 100, `Words: ${this.wordsCollected}/7`, {
      fontSize: '16px',
      fontFamily: 'Arial, sans-serif',
      fill: '#ffffff',
      stroke: '#000000',
      strokeThickness: 2,
    });

    // Level progress
    this.levelText = this.add
      .text(
        this.scale.width / 2,
        20,
        `Level ${this.currentLevel}/${this.totalLevels}`,
        {
          fontSize: '18px',
          fontFamily: 'Arial, sans-serif',
          fill: '#ffffff',
          stroke: '#000000',
          strokeThickness: 2,
        }
      )
      .setOrigin(0.5, 0);

    // Active power-up indicator
    this.powerUpText = this.add.text(20, 125, '', {
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
        'Arrow Keys: Move | Spacebar: Jump | Collect words to unlock story questions and earn coins!',
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
    // Player collides with platforms
    this.physics.add.collider(this.player, this.platforms);

    // Player collects word coins
    this.physics.add.overlap(
      this.player,
      this.wordCoins,
      this.collectWord,
      null,
      this
    );

    // Player hits enemies
    this.physics.add.overlap(
      this.player,
      this.enemies,
      this.hitEnemy,
      null,
      this
    );

    // Enemies collide with platforms
    this.physics.add.collider(this.enemies, this.platforms);
  }

  createControls() {
    // Keyboard controls
    this.cursors = this.input.keyboard.createCursorKeys();
    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    // Touch/mouse controls for mobile
    this.input.on('pointerdown', pointer => {
      if (pointer.x < this.scale.width / 3) {
        // Left side - move left
        this.player.body.setVelocityX(-this.player.speed);
      } else if (pointer.x > (this.scale.width * 2) / 3) {
        // Right side - move right
        this.player.body.setVelocityX(this.player.speed);
      } else {
        // Middle - jump
        this.jump();
      }
    });
  }

  update() {
    if (!this.isGameActive) return;

    // Player movement
    if (this.cursors.left.isDown) {
      this.player.body.setVelocityX(-this.player.speed);
    } else if (this.cursors.right.isDown) {
      this.player.body.setVelocityX(this.player.speed);
    } else {
      this.player.body.setVelocityX(0);
    }

    // Jumping
    if (Phaser.Input.Keyboard.JustDown(this.spaceKey)) {
      this.jump();
    }

    // Update enemy graphics positions
    this.enemies.children.entries.forEach(enemy => {
      if (enemy.dangerIcon) {
        enemy.dangerIcon.x = enemy.x;
        enemy.dangerIcon.y = enemy.y;
      }
    });

    // Check if player fell off the world
    if (this.player.y > this.scale.height) {
      this.loseLife();
    }
  }

  jump() {
    if (this.player.body.touching.down) {
      this.player.body.setVelocityY(-this.player.jumpPower);
    }
  }

  collectWord(player, wordCoin) {
    // Remove the word coin
    wordCoin.graphic.destroy();
    wordCoin.wordText.destroy();
    wordCoin.destroy();

    // Calculate coin reward
    const coinsEarned = this.progressTracker.calculateCoinReward('easy', 0);
    this.progressTracker.awardCoins(coinsEarned, 'Word Collection');
    this.coinsEarned += coinsEarned;

    // Update score and progress
    this.wordsCollected++;
    this.score += 20;

    // Update UI
    this.coinBalanceText.setText(`🪙 ${this.progressTracker.getCoinBalance()}`);
    this.sessionCoinsText.setText(`Session: +${this.coinsEarned} 🪙`);
    this.scoreText.setText(`Score: ${this.score}`);
    this.wordsText.setText(`Words: ${this.wordsCollected}/7`);

    // Show feedback with coin animation
    this.showFeedback(
      `+20 Word: "${wordCoin.word}" (+${coinsEarned} coins)`,
      0x10b981,
      player.x,
      player.y - 30
    );
    this.showCoinCollection(coinsEarned, player.x, player.y - 50);

    // Check if all words collected
    if (this.wordsCollected >= 7) {
      this.showStoryQuestion();
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

  hitEnemy(player, enemy) {
    this.loseLife();
  }

  loseLife() {
    this.lives--;
    this.livesText.setText(`❤️ Lives: ${this.lives}`);

    // Reset player position
    this.player.x = 100;
    this.player.y = this.scale.height - 120;
    this.player.body.setVelocity(0, 0);

    // Show feedback
    this.showFeedback(
      'Ouch! -1 Life',
      0xef4444,
      this.player.x,
      this.player.y - 30
    );

    // Flash effect
    this.safeFlash(300, 255, 0, 0);

    if (this.lives <= 0) {
      this.endGame(false);
    }
  }

  showStoryQuestion() {
    if (!this.currentStory) return;

    console.log('Week2ReadingScene: Showing reading combat challenge...');

    // 🤖 COMBAT SYSTEM - Pause combat during question
    this.readingCombatActive = true;

    // Create enhanced question overlay with combat theme
    const overlay = this.add.rectangle(
      0,
      0,
      this.scale.width,
      this.scale.height,
      0x000000,
      0.9
    );
    overlay.setOrigin(0, 0);
    overlay.setInteractive();

    // Create question panel with cyber styling
    const panelWidth = Math.min(700, this.scale.width - 40);
    const panelHeight = Math.min(500, this.scale.height - 40);
    const panelX = this.scale.width / 2;
    const panelY = this.scale.height / 2;

    const panel = this.add.graphics();
    panel.fillStyle(0x1a0033, 0.95);
    panel.fillRoundedRect(
      panelX - panelWidth / 2,
      panelY - panelHeight / 2,
      panelWidth,
      panelHeight,
      15
    );
    panel.lineStyle(4, 0x00ffff, 0.8);
    panel.strokeRoundedRect(
      panelX - panelWidth / 2,
      panelY - panelHeight / 2,
      panelWidth,
      panelHeight,
      15
    );

    // Add glow effect
    const glow = this.add.graphics();
    glow.fillStyle(0x00ffff, 0.1);
    glow.fillRoundedRect(
      panelX - panelWidth / 2 - 5,
      panelY - panelHeight / 2 - 5,
      panelWidth + 10,
      panelHeight + 10,
      20
    );

    // 🤖 COMBAT SYSTEM - Show character stats during question
    const statsText = this.add
      .text(
        panelX,
        panelY - panelHeight / 2 + 30,
        `⚔️ ATK: ${(this.characterStats.attackPower * 100).toFixed(0)}%  ` +
          `🛡️ DEF: ${this.characterStats.defense}  ` +
          `🎯 ACC: ${this.characterStats.accuracy}%  ` +
          `🔥 STREAK: ${this.streak}`,
        {
          fontSize: '14px',
          fontFamily: 'Courier, monospace',
          fill: '#00ffff',
          fontStyle: 'bold',
          align: 'center',
        }
      )
      .setOrigin(0.5);

    // Enhanced title with combat theme
    const title = this.add
      .text(
        panelX,
        panelY - panelHeight / 2 + 70,
        '⚔️ READING COMBAT CHALLENGE ⚔️',
        {
          fontSize: '24px',
          fontFamily: 'Courier, monospace',
          fill: '#ffff00',
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 2,
        }
      )
      .setOrigin(0.5);

    // Pulsing effect for title
    this.tweens.add({
      targets: title,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 1000,
      yoyo: true,
      repeat: -1,
    });

    // Story passage with better formatting
    const passageText = this.add
      .text(panelX, panelY - 80, this.currentStory.passage, {
        fontSize: '16px',
        fontFamily: 'Arial, sans-serif',
        fill: '#ffffff',
        align: 'center',
        wordWrap: { width: panelWidth - 60 },
        lineSpacing: 8,
      })
      .setOrigin(0.5);

    // Question with enhanced styling
    const questionText = this.add
      .text(panelX, panelY + 20, this.currentStory.question, {
        fontSize: '18px',
        fontFamily: 'Courier, monospace',
        fill: '#00ff00',
        fontStyle: 'bold',
        align: 'center',
        wordWrap: { width: panelWidth - 60 },
        stroke: '#000000',
        strokeThickness: 1,
      })
      .setOrigin(0.5);

    // Enhanced answer choices with combat styling
    const { choices } = this.currentStory;
    const choiceTexts = [];
    const choiceBackgrounds = [];

    choices.forEach((choice, index) => {
      const choiceY = panelY + 80 + index * 45;

      // Choice background with hover effect
      const choiceBg = this.add.graphics();
      choiceBg.fillStyle(0x333333, 0.8);
      choiceBg.fillRoundedRect(panelX - 250, choiceY - 15, 500, 30, 8);
      choiceBg.lineStyle(2, 0x666666, 0.8);
      choiceBg.strokeRoundedRect(panelX - 250, choiceY - 15, 500, 30, 8);
      choiceBackgrounds.push(choiceBg);

      const choiceText = this.add
        .text(
          panelX,
          choiceY,
          `${String.fromCharCode(65 + index)}. ${choice}`,
          {
            fontSize: '16px',
            fontFamily: 'Courier, monospace',
            fill: '#ffffff',
            fontStyle: 'bold',
          }
        )
        .setOrigin(0.5);

      choiceTexts.push(choiceText);

      // Make choice interactive with enhanced feedback
      choiceBg.setInteractive();
      choiceText.setInteractive();

      const addHoverEffect = target => {
        target.on('pointerover', () => {
          choiceBg.clear();
          choiceBg.fillStyle(0x00ffff, 0.3);
          choiceBg.fillRoundedRect(panelX - 250, choiceY - 15, 500, 30, 8);
          choiceBg.lineStyle(2, 0x00ffff, 1.0);
          choiceBg.strokeRoundedRect(panelX - 250, choiceY - 15, 500, 30, 8);
          choiceText.setColor('#00ffff');
          choiceText.setScale(1.05);
        });

        target.on('pointerout', () => {
          choiceBg.clear();
          choiceBg.fillStyle(0x333333, 0.8);
          choiceBg.fillRoundedRect(panelX - 250, choiceY - 15, 500, 30, 8);
          choiceBg.lineStyle(2, 0x666666, 0.8);
          choiceBg.strokeRoundedRect(panelX - 250, choiceY - 15, 500, 30, 8);
          choiceText.setColor('#ffffff');
          choiceText.setScale(1.0);
        });

        target.on('pointerdown', () => {
          this.checkStoryAnswer(
            index,
            overlay,
            panel,
            glow,
            title,
            passageText,
            questionText,
            choiceTexts,
            choiceBackgrounds,
            statsText
          );
        });
      };

      addHoverEffect(choiceBg);
      addHoverEffect(choiceText);
    });

    // Instructions with combat theme
    const instructions = this.add
      .text(
        panelX,
        panelY + panelHeight / 2 - 30,
        "🎯 Choose wisely! Your robot's combat effectiveness depends on your reading skills!",
        {
          fontSize: '14px',
          fontFamily: 'Courier, monospace',
          fill: '#ffff00',
          align: 'center',
          fontStyle: 'italic',
        }
      )
      .setOrigin(0.5);

    // Blinking effect for instructions
    this.tweens.add({
      targets: instructions,
      alpha: 0.5,
      duration: 1500,
      yoyo: true,
      repeat: -1,
    });

    // 🤖 COMBAT SYSTEM - Show accuracy bonus info
    if (this.characterStats.accuracy > 0) {
      const accuracyBonus = this.add
        .text(
          panelX,
          panelY + panelHeight / 2 - 10,
          `💡 Accuracy Bonus: +${this.characterStats.accuracy}% hint assistance available!`,
          {
            fontSize: '12px',
            fontFamily: 'Courier, monospace',
            fill: '#00ff00',
            align: 'center',
          }
        )
        .setOrigin(0.5);
    }
  }

  checkStoryAnswer(
    selectedAnswer,
    overlay,
    panel,
    glow,
    title,
    passageText,
    questionText,
    choiceTexts,
    choiceBackgrounds,
    statsText
  ) {
    console.log('Week2ReadingScene: Checking reading combat answer...');

    const isCorrect = selectedAnswer === this.currentStory.correctAnswer;
    const startTime = Date.now();

    // 🤖 COMBAT SYSTEM - Trigger appropriate combat response
    if (isCorrect) {
      // Correct answer - trigger combat system
      this.events.emit('readingAnswerCorrect', {
        difficulty: 'medium',
        timeSpent: Date.now() - startTime,
        subject: 'reading',
      });

      // Visual success feedback
      this.showAnswerFeedback(
        true,
        selectedAnswer,
        choiceTexts,
        choiceBackgrounds
      );
    } else {
      // Incorrect answer - trigger combat system
      this.events.emit('readingAnswerIncorrect', {
        difficulty: 'medium',
        timeSpent: Date.now() - startTime,
        subject: 'reading',
      });

      // Visual failure feedback
      this.showAnswerFeedback(
        false,
        selectedAnswer,
        choiceTexts,
        choiceBackgrounds
      );
    }

    // Clean up UI after delay
    this.time.delayedCall(2000, () => {
      overlay.destroy();
      panel.destroy();
      glow.destroy();
      title.destroy();
      passageText.destroy();
      questionText.destroy();
      statsText.destroy();
      choiceTexts.forEach(text => text.destroy());
      choiceBackgrounds.forEach(bg => bg.destroy());

      // 🤖 COMBAT SYSTEM - Resume combat
      this.readingCombatActive = false;

      // Continue with level progression
      if (isCorrect) {
        this.completeLevel();
      } else {
        this.loseLife();
      }
    });
  }

  // 🤖 COMBAT SYSTEM - Enhanced answer feedback
  showAnswerFeedback(
    isCorrect,
    selectedAnswer,
    choiceTexts,
    choiceBackgrounds
  ) {
    if (isCorrect) {
      // Highlight correct answer in green
      choiceBackgrounds[selectedAnswer].clear();
      choiceBackgrounds[selectedAnswer].fillStyle(0x00ff00, 0.8);
      choiceBackgrounds[selectedAnswer].fillRoundedRect(
        choiceTexts[selectedAnswer].x - 250,
        choiceTexts[selectedAnswer].y - 15,
        500,
        30,
        8
      );
      choiceTexts[selectedAnswer].setColor('#ffffff');
      choiceTexts[selectedAnswer].setFontStyle('bold');

      // Success effect
      this.combatSystem.createFloatingText(
        this.scale.width / 2,
        this.scale.height / 2 - 100,
        '✅ CORRECT! ROBOT ATTACK!',
        '#00ff00',
        '24px'
      );
    } else {
      // Highlight wrong answer in red
      choiceBackgrounds[selectedAnswer].clear();
      choiceBackgrounds[selectedAnswer].fillStyle(0xff0000, 0.8);
      choiceBackgrounds[selectedAnswer].fillRoundedRect(
        choiceTexts[selectedAnswer].x - 250,
        choiceTexts[selectedAnswer].y - 15,
        500,
        30,
        8
      );
      choiceTexts[selectedAnswer].setColor('#ffffff');

      // Show correct answer in green
      const correctIndex = this.currentStory.correctAnswer;
      choiceBackgrounds[correctIndex].clear();
      choiceBackgrounds[correctIndex].fillStyle(0x00ff00, 0.5);
      choiceBackgrounds[correctIndex].fillRoundedRect(
        choiceTexts[correctIndex].x - 250,
        choiceTexts[correctIndex].y - 15,
        500,
        30,
        8
      );

      // Failure effect
      this.combatSystem.createFloatingText(
        this.scale.width / 2,
        this.scale.height / 2 - 100,
        '❌ WRONG! ENEMY ATTACK!',
        '#ff0000',
        '24px'
      );
    }
  }

  completeLevel() {
    this.currentLevel++;

    if (this.currentLevel > this.totalLevels) {
      // Week completed!
      this.progressTracker.completeWeek(2);
      this.endGame(true);
    } else {
      // Next level
      this.showLevelComplete();
    }
  }

  showLevelComplete() {
    const message = this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2,
        `🎉 LEVEL ${this.currentLevel - 1} COMPLETE! 🎉\n\nGet ready for Level ${this.currentLevel}...`,
        {
          fontSize: '24px',
          fontFamily: 'Arial, sans-serif',
          fill: '#ffd700',
          stroke: '#000000',
          strokeThickness: 3,
          align: 'center',
          backgroundColor: '#1e3a8a',
          padding: { x: 20, y: 15 },
        }
      )
      .setOrigin(0.5);

    this.time.delayedCall(3000, () => {
      message.destroy();
      this.resetLevel();
    });
  }

  resetLevel() {
    // Reset for next level
    this.wordsCollected = 0;
    this.wordsText.setText(`Words: ${this.wordsCollected}/7`);
    this.levelText.setText(`Level ${this.currentLevel}/${this.totalLevels}`);

    // Clear existing word coins
    this.wordCoins.clear(true, true);

    // Create new word coins
    this.createWordCoins();

    // Reset player position
    this.player.x = 100;
    this.player.y = this.scale.height - 120;
    this.player.body.setVelocity(0, 0);
  }

  startStoryLevel() {
    // This could be expanded to show different story introductions per level
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
        '🍄 LANGUAGE ARTS ADVENTURE! 🍄\n\nCollect all the words to unlock story questions!\nUse arrow keys to move and spacebar to jump!\n\nAvoid the red obstacles!\n\nGood luck, Word Explorer!',
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
        .text(this.scale.width / 2, yPos, '🏆 READING CHAMPION! 🏆', {
          fontSize: '28px',
          fontFamily: 'Arial, sans-serif',
          fill: '#ffd700',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);
    } else {
      this.add
        .text(this.scale.width / 2, yPos, '📚 Keep Reading! 📚', {
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
        `Levels Completed: ${this.currentLevel - 1}/${this.totalLevels}`,
        {
          fontSize: '18px',
          fontFamily: 'Arial, sans-serif',
          fill: '#ffffff',
        }
      )
      .setOrigin(0.5);

    yPos += 30;
    const accuracy = this.progressTracker.getAccuracy('reading');
    this.add
      .text(this.scale.width / 2, yPos, `Reading Accuracy: ${accuracy}%`, {
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

  // Safe flash method to prevent callback errors
  safeFlash(
    duration = 300,
    red = 255,
    green = 255,
    blue = 255,
    force = false,
    callback = null
  ) {
    try {
      if (this.cameras && this.cameras.main) {
        this.cameras.main.flash(duration, red, green, blue, force, callback);
      }
    } catch (error) {
      console.warn('Flash effect error:', error);
      // Fallback: create a simple flash overlay
      const flashOverlay = this.add
        .rectangle(
          this.scale.width / 2,
          this.scale.height / 2,
          this.scale.width,
          this.scale.height,
          Phaser.Display.Color.GetColor(red, green, blue),
          0.5
        )
        .setDepth(10000);

      this.tweens.add({
        targets: flashOverlay,
        alpha: 0,
        duration,
        onComplete: () => {
          flashOverlay.destroy();
          if (callback) callback();
        },
      });
    }
  }
}
