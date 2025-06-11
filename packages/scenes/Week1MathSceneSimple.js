import { Scene } from 'phaser';

export class Week1MathSceneSimple extends Scene {
  constructor() {
    super('Week1MathSceneSimple');

    // Simple game state
    this.score = 0;
    this.gameTimer = 180; // 3 minutes
    this.isGameActive = false;
    this.wave = 1;
    this.maxWaves = 6;

    // Math state
    this.mathPower = 0;
    this.maxMathPower = 100;
    this.streak = 0;
    this.questionsAnswered = 0;
    this.correctAnswers = 0;

    // Game objects
    this.player = null;
    this.enemies = [];
    this.bullets = [];
    this.particles = [];

    // UI elements
    this.scoreText = null;
    this.timerText = null;
    this.healthBar = null;
    this.mathPowerBar = null;
    this.streakText = null;

    // Math quiz state
    this.currentQuestion = null;
    this.mathQuizActive = false;
    this.mathQuizUI = null;

    // Input
    this.cursors = null;
    this.wasd = null;
    this.spaceKey = null;

    // Timers
    this.enemySpawnTimer = 0;
    this.mathQuizTimer = 0;
    this.gameTimerCounter = 0;

    // Arena bounds
    this.arenaX = 112;
    this.arenaY = 84;
    this.arenaWidth = 800;
    this.arenaHeight = 600;

    console.log('Week1MathSceneSimple: Simple initialization complete');
  }

  create() {
    console.log('Week1MathSceneSimple: Starting simple scene creation...');

    try {
      // Create background
      this.createBackground();

      // Create arena
      this.createArena();

      // Create player
      this.createPlayer();

      // Create UI
      this.createUI();

      // Set up input
      this.setupInput();

      // Start game
      this.startGame();

      console.log('Week1MathSceneSimple: Scene creation complete!');
    } catch (error) {
      console.error('Week1MathSceneSimple: Error in create():', error);
      this.createErrorScreen(error);
    }
  }

  createBackground() {
    // Simple dark background
    this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x1a0033
    );
  }

  createArena() {
    // Arena boundaries
    const arena = this.add.graphics();
    arena.lineStyle(4, 0x00ffff, 0.8);
    arena.strokeRect(
      this.arenaX,
      this.arenaY,
      this.arenaWidth,
      this.arenaHeight
    );

    // Grid lines for visual appeal
    arena.lineStyle(1, 0x00ffff, 0.2);
    const gridSize = 50;

    // Vertical lines
    for (
      let x = this.arenaX;
      x <= this.arenaX + this.arenaWidth;
      x += gridSize
    ) {
      arena.lineBetween(x, this.arenaY, x, this.arenaY + this.arenaHeight);
    }

    // Horizontal lines
    for (
      let y = this.arenaY;
      y <= this.arenaY + this.arenaHeight;
      y += gridSize
    ) {
      arena.lineBetween(this.arenaX, y, this.arenaX + this.arenaWidth, y);
    }
  }

  createPlayer() {
    // Create player in center of arena
    const playerX = this.arenaX + this.arenaWidth / 2;
    const playerY = this.arenaY + this.arenaHeight / 2;

    this.player = this.add.rectangle(playerX, playerY, 40, 40, 0x00aaff);

    // Player stats
    this.player.health = 100;
    this.player.maxHealth = 100;
    this.player.speed = 200;
    this.player.lastShot = 0;
    this.player.fireRate = 200; // milliseconds between shots

    console.log('Week1MathSceneSimple: Player created');
  }

  createUI() {
    // Score
    this.scoreText = this.add.text(20, 20, 'Score: 0', {
      fontSize: '20px',
      fontFamily: 'Courier, monospace',
      color: '#ffffff',
    });

    // Timer
    this.timerText = this.add.text(20, 50, 'Time: 3:00', {
      fontSize: '20px',
      fontFamily: 'Courier, monospace',
      color: '#ffffff',
    });

    // Wave
    this.waveText = this.add.text(20, 80, 'Wave: 1/6', {
      fontSize: '20px',
      fontFamily: 'Courier, monospace',
      color: '#ffffff',
    });

    // Health bar
    this.healthBarBg = this.add.rectangle(
      this.scale.width - 120,
      30,
      200,
      20,
      0x333333
    );
    this.healthBar = this.add.rectangle(
      this.scale.width - 120,
      30,
      200,
      16,
      0x00ff00
    );
    this.add.text(this.scale.width - 220, 20, 'Health', {
      fontSize: '16px',
      fontFamily: 'Courier, monospace',
      color: '#ffffff',
    });

    // Math power bar
    this.mathPowerBarBg = this.add.rectangle(
      this.scale.width - 120,
      70,
      200,
      20,
      0x333333
    );
    this.mathPowerBar = this.add.rectangle(
      this.scale.width - 120,
      70,
      0,
      16,
      0xffff00
    );
    this.add.text(this.scale.width - 220, 60, 'Math Power', {
      fontSize: '16px',
      fontFamily: 'Courier, monospace',
      color: '#ffffff',
    });

    // Streak counter
    this.streakText = this.add.text(this.scale.width - 220, 100, 'Streak: 0', {
      fontSize: '16px',
      fontFamily: 'Courier, monospace',
      color: '#ffff00',
    });

    console.log('Week1MathSceneSimple: UI created');
  }

  setupInput() {
    // Arrow keys
    this.cursors = this.input.keyboard.createCursorKeys();

    // WASD keys
    this.wasd = this.input.keyboard.addKeys('W,S,A,D');

    // Space for shooting
    this.spaceKey = this.input.keyboard.addKey(
      Phaser.Input.Keyboard.KeyCodes.SPACE
    );

    // Number keys for math answers
    this.numberKeys = this.input.keyboard.addKeys('ONE,TWO,THREE,FOUR');

    console.log('Week1MathSceneSimple: Input setup complete');
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

    // Start spawning enemies after 5 seconds
    this.time.delayedCall(5000, () => {
      this.spawnEnemy();
    });

    console.log('Week1MathSceneSimple: Game started');
  }

  showWelcomeMessage() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    const welcomeText = this.add
      .text(centerX, centerY - 50, 'MATH COMBAT ARENA', {
        fontSize: '36px',
        fontFamily: 'Courier, monospace',
        color: '#00ffff',
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    const instructionText = this.add
      .text(
        centerX,
        centerY,
        'Solve math problems to power up!\nUse WASD to move, SPACE to shoot',
        {
          fontSize: '18px',
          fontFamily: 'Courier, monospace',
          color: '#ffffff',
          align: 'center',
        }
      )
      .setOrigin(0.5);

    // Fade out after 3 seconds
    this.tweens.add({
      targets: [welcomeText, instructionText],
      alpha: 0,
      duration: 1000,
      delay: 2000,
      onComplete: () => {
        welcomeText.destroy();
        instructionText.destroy();
      },
    });
  }

  update(time, delta) {
    if (!this.isGameActive) return;

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
      console.error('Week1MathSceneSimple: Error in update():', error);
    }
  }

  updateGameTimer(delta) {
    this.gameTimerCounter += delta;
    this.gameTimer = Math.max(0, 180 - this.gameTimerCounter / 1000);

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
      this.player.x = Math.min(
        this.arenaX + this.arenaWidth - 20,
        this.player.x + speed
      );
    }
    if (this.cursors.up.isDown || this.wasd.W.isDown) {
      this.player.y = Math.max(this.arenaY + 20, this.player.y - speed);
    }
    if (this.cursors.down.isDown || this.wasd.S.isDown) {
      this.player.y = Math.min(
        this.arenaY + this.arenaHeight - 20,
        this.player.y + speed
      );
    }

    // Shooting
    if (
      this.spaceKey.isDown &&
      time - this.player.lastShot > this.player.fireRate
    ) {
      this.shootBullet();
      this.player.lastShot = time;
    }
  }

  shootBullet() {
    const bullet = this.add.circle(
      this.player.x,
      this.player.y - 20,
      3,
      0x00ff88
    );
    bullet.speed = 500;
    bullet.damage = 20;
    this.bullets.push(bullet);
  }

  updateBullets(time, delta) {
    for (let i = this.bullets.length - 1; i >= 0; i--) {
      const bullet = this.bullets[i];
      bullet.y -= bullet.speed * (delta / 1000);

      // Remove bullets that are off screen
      if (bullet.y < this.arenaY - 50) {
        bullet.destroy();
        this.bullets.splice(i, 1);
      }
    }
  }

  spawnEnemy() {
    if (!this.isGameActive) return;

    const enemyX = this.arenaX + Math.random() * this.arenaWidth;
    const enemyY = this.arenaY - 20;

    const enemy = this.add.rectangle(enemyX, enemyY, 30, 30, 0xff4444);
    enemy.health = 40;
    enemy.maxHealth = 40;
    enemy.speed = 50 + Math.random() * 50;
    enemy.points = 100;

    this.enemies.push(enemy);

    // Schedule next enemy spawn
    const spawnDelay = Math.max(1000, 3000 - this.wave * 300);
    this.time.delayedCall(spawnDelay, () => {
      this.spawnEnemy();
    });
  }

  updateEnemies(time, delta) {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];
      enemy.y += enemy.speed * (delta / 1000);

      // Remove enemies that are off screen
      if (enemy.y > this.arenaY + this.arenaHeight + 50) {
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
          bullet.x,
          bullet.y,
          enemy.x,
          enemy.y
        );

        if (distance < 20) {
          // Hit!
          enemy.health -= bullet.damage;

          // Create hit effect
          this.createHitEffect(enemy.x, enemy.y);

          // Remove bullet
          bullet.destroy();
          this.bullets.splice(i, 1);

          // Check if enemy is destroyed
          if (enemy.health <= 0) {
            this.score += enemy.points;
            this.createExplosionEffect(enemy.x, enemy.y);
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
        this.player.x,
        this.player.y,
        enemy.x,
        enemy.y
      );

      if (distance < 35) {
        // Player hit!
        this.player.health -= 10;
        this.createDamageEffect();

        // Remove enemy
        enemy.destroy();
        this.enemies.splice(i, 1);

        // Check if player is dead
        if (this.player.health <= 0) {
          this.endGame();
        }
      }
    }
  }

  createHitEffect(x, y) {
    for (let i = 0; i < 5; i++) {
      const particle = this.add.circle(x, y, 2, 0xffff00);
      const angle = Math.random() * Math.PI * 2;
      const speed = 50 + Math.random() * 100;

      this.particles.push({
        object: particle,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 500,
        maxLife: 500,
      });
    }
  }

  createExplosionEffect(x, y) {
    for (let i = 0; i < 10; i++) {
      const particle = this.add.circle(x, y, 3, 0xff4444);
      const angle = Math.random() * Math.PI * 2;
      const speed = 100 + Math.random() * 150;

      this.particles.push({
        object: particle,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 800,
        maxLife: 800,
      });
    }
  }

  createDamageEffect() {
    // Screen flash
    const flash = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0xff0000,
      0.3
    );

    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 200,
      onComplete: () => flash.destroy(),
    });

    // Camera shake
    this.cameras.main.shake(100, 0.01);
  }

  checkEnemySpawning(time) {
    // Enemies spawn automatically via delayed calls
  }

  checkMathQuiz(time) {
    // Start math quiz every 30 seconds
    if (!this.mathQuizActive && time - this.mathQuizTimer > 30000) {
      this.startMathQuiz();
      this.mathQuizTimer = time;
    }
  }

  startMathQuiz() {
    if (this.mathQuizActive) return;

    this.mathQuizActive = true;
    this.currentQuestion = this.generateMathQuestion();
    this.showMathQuizUI();

    console.log('Math Quiz:', this.currentQuestion.question);
  }

  generateMathQuestion() {
    const operations = ['+', '-', '*'];
    const operation = operations[Math.floor(Math.random() * operations.length)];

    let a;
    let b;
    let answer;
    let question;

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
      correctIndex: choices.indexOf(answer),
    };
  }

  showMathQuizUI() {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // Background
    this.mathQuizBg = this.add.rectangle(
      centerX,
      centerY,
      400,
      300,
      0x000000,
      0.8
    );
    this.mathQuizBg.setStrokeStyle(3, 0x00ffff);

    // Question
    this.mathQuizQuestion = this.add
      .text(centerX, centerY - 80, this.currentQuestion.question, {
        fontSize: '32px',
        fontFamily: 'Courier, monospace',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    // Choices
    this.mathQuizChoices = [];
    for (let i = 0; i < 4; i++) {
      const choiceY = centerY - 20 + i * 40;
      const choice = this.add
        .text(
          centerX,
          choiceY,
          `${i + 1}. ${this.currentQuestion.choices[i]}`,
          {
            fontSize: '20px',
            fontFamily: 'Courier, monospace',
            color: '#ffff00',
          }
        )
        .setOrigin(0.5);

      this.mathQuizChoices.push(choice);
    }

    // Instructions
    this.mathQuizInstructions = this.add
      .text(centerX, centerY + 100, 'Press 1, 2, 3, or 4 to answer', {
        fontSize: '16px',
        fontFamily: 'Courier, monospace',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    // Set up input handlers
    this.setupMathQuizInput();
  }

  setupMathQuizInput() {
    const handleAnswer = selectedIndex => {
      if (!this.mathQuizActive) return;

      this.questionsAnswered++;

      if (selectedIndex === this.currentQuestion.correctIndex) {
        // Correct answer
        this.correctAnswers++;
        this.streak++;
        this.mathPower = Math.min(this.maxMathPower, this.mathPower + 20);
        this.createMathSuccessEffect();
      } else {
        // Wrong answer
        this.streak = 0;
        this.mathPower = Math.max(0, this.mathPower - 10);
        this.createMathFailureEffect();
      }

      this.hideMathQuizUI();
    };

    // Number key handlers
    this.numberKeys.ONE.on('down', () => handleAnswer(0));
    this.numberKeys.TWO.on('down', () => handleAnswer(1));
    this.numberKeys.THREE.on('down', () => handleAnswer(2));
    this.numberKeys.FOUR.on('down', () => handleAnswer(3));
  }

  hideMathQuizUI() {
    this.mathQuizActive = false;

    if (this.mathQuizBg) this.mathQuizBg.destroy();
    if (this.mathQuizQuestion) this.mathQuizQuestion.destroy();
    if (this.mathQuizChoices) {
      this.mathQuizChoices.forEach(choice => choice.destroy());
    }
    if (this.mathQuizInstructions) this.mathQuizInstructions.destroy();
  }

  createMathSuccessEffect() {
    // Green particles
    for (let i = 0; i < 15; i++) {
      const particle = this.add.circle(
        this.scale.width / 2,
        this.scale.height / 2,
        4,
        0x00ff00
      );
      const angle = (i / 15) * Math.PI * 2;
      const speed = 200;

      this.particles.push({
        object: particle,
        vx: Math.cos(angle) * speed,
        vy: Math.sin(angle) * speed,
        life: 1000,
        maxLife: 1000,
      });
    }

    // Screen flash
    const flash = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0x00ff00,
      0.2
    );

    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 300,
      onComplete: () => flash.destroy(),
    });
  }

  createMathFailureEffect() {
    // Red screen shake
    this.cameras.main.shake(200, 0.01);

    // Red flash
    const flash = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2,
      this.scale.width,
      this.scale.height,
      0xff0000,
      0.3
    );

    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 400,
      onComplete: () => flash.destroy(),
    });
  }

  updateUI() {
    // Update score
    this.scoreText.setText(`Score: ${this.score}`);

    // Update timer
    const minutes = Math.floor(this.gameTimer / 60);
    const seconds = Math.floor(this.gameTimer % 60);
    this.timerText.setText(
      `Time: ${minutes}:${seconds.toString().padStart(2, '0')}`
    );

    // Update wave
    this.waveText.setText(`Wave: ${this.wave}/${this.maxWaves}`);

    // Update health bar
    const healthPercent = this.player.health / this.player.maxHealth;
    this.healthBar.setDisplaySize(200 * healthPercent, 16);

    // Change health bar color based on health
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

    // Update streak
    this.streakText.setText(`Streak: ${this.streak}`);

    // Change streak color based on value
    if (this.streak >= 5) {
      this.streakText.setColor('#00ff00');
    } else if (this.streak >= 3) {
      this.streakText.setColor('#ffff00');
    } else {
      this.streakText.setColor('#ffffff');
    }
  }

  endGame() {
    this.isGameActive = false;

    // Calculate final stats
    const accuracy =
      this.questionsAnswered > 0
        ? (this.correctAnswers / this.questionsAnswered) * 100
        : 0;

    this.showGameOverScreen(accuracy);
  }

  showGameOverScreen(accuracy) {
    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // Background
    const gameOverBg = this.add.rectangle(
      centerX,
      centerY,
      this.scale.width,
      this.scale.height,
      0x000000,
      0.8
    );

    // Game over text
    const gameOverText = this.add
      .text(centerX, centerY - 150, 'GAME COMPLETE!', {
        fontSize: '48px',
        fontFamily: 'Courier, monospace',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    // Stats
    const statsText = this.add
      .text(
        centerX,
        centerY - 50,
        `Final Score: ${this.score}\n` +
          `Questions Answered: ${this.questionsAnswered}\n` +
          `Accuracy: ${accuracy.toFixed(1)}%\n` +
          `Best Streak: ${this.streak}`,
        {
          fontSize: '20px',
          fontFamily: 'Courier, monospace',
          color: '#ffff00',
          align: 'center',
        }
      )
      .setOrigin(0.5);

    // Continue button
    const continueText = this.add
      .text(centerX, centerY + 100, 'Click to continue...', {
        fontSize: '16px',
        fontFamily: 'Courier, monospace',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    // Make screen clickable
    gameOverBg.setInteractive();
    gameOverBg.on('pointerdown', () => {
      try {
        this.scene.start('MenuScene');
      } catch (error) {
        console.error('Week1MathSceneSimple: Error returning to menu:', error);
        window.location.reload();
      }
    });
  }

  createErrorScreen(error) {
    console.error('Week1MathSceneSimple: Creating error screen for:', error);

    const centerX = this.scale.width / 2;
    const centerY = this.scale.height / 2;

    // Background
    this.add.rectangle(
      centerX,
      centerY,
      this.scale.width,
      this.scale.height,
      0x330000
    );

    // Error message
    const errorText = this.add
      .text(
        centerX,
        centerY,
        'ERROR\n\nSomething went wrong.\nClick to return to menu.',
        {
          fontSize: '24px',
          fontFamily: 'Courier, monospace',
          color: '#ff4444',
          align: 'center',
          stroke: '#000000',
          strokeThickness: 2,
        }
      )
      .setOrigin(0.5)
      .setInteractive()
      .on('pointerdown', () => {
        try {
          this.scene.start('MenuScene');
        } catch (error) {
          window.location.reload();
        }
      });
  }
}
