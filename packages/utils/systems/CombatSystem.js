import { GameSystem } from './GameSystem.js';
import { GameConfig, GameConfigUtils } from '../../shared/index.js';

/**
 * Combat System - Handles enemy spawning, hit resolution, damage/health
 * Implements wave-based progression with math integration
 */
export class CombatSystem extends GameSystem {
  constructor(scene, config = {}, progressTracker) {
    super(scene, {
      updateThrottle: GameConfig.performance.aiUpdateInterval,
      ...config,
    });

    this.progressTracker = progressTracker;

    // Combat state
    this.currentWave = 0;
    this.waveActive = false;
    this.waveStartTime = 0;
    this.enemies = [];
    this.projectiles = [];

    // Wave progression
    this.wavePhase = 'combat'; // 'combat', 'math', 'transition'
    this.mathQuizActive = false;
    this.mathCorrectAnswers = 0;
    this.mathTotalQuestions = 0;

    // Spawn management
    this.spawnTimer = 0;
    this.spawnInterval = 3000; // Base spawn interval
    this.maxEnemiesPerWave = GameConfig.performance.maxEnemies;

    // Combat stats
    this.stats = {
      enemiesSpawned: 0,
      enemiesDefeated: 0,
      totalDamageDealt: 0,
      totalDamageTaken: 0,
      accuracy: 0,
      shotsFired: 0,
      shotsHit: 0,
      combosExecuted: 0,
      abilitiesUsed: 0,
    };

    // Player reference
    this.player = null;

    // Difficulty scaling
    this.currentDifficulty = 1.0;

    // 🤖 REUSABLE COMBAT SYSTEM
    // This system can be integrated into any week scene to provide consistent robot combat mechanics

    this.playerRobot = null;
    this.enemyRobot = null;
    this.enemyHealth = 100;
    this.maxEnemyHealth = 100;
    this.combatActive = false;

    // Character stats
    this.characterStats = null;

    // UI elements
    this.enemyHealthBar = null;
    this.enemyHealthBarBg = null;
    this.combatStatsDisplay = null;

    // Animation groups
    this.damageNumbers = [];
    this.combatEffects = [];
  }

  async onInit() {
    this.log('Initializing Combat System...');

    // Set up event listeners
    this.setupEventListeners();

    // Initialize first wave
    this.currentWave = 1;
    this.currentDifficulty = GameConfigUtils.getWaveDifficulty(
      this.currentWave
    );

    this.log(`Combat System initialized - Starting Wave ${this.currentWave}`);
  }

  setupEventListeners() {
    // Listen for player creation
    this.on('playerCreated', this.onPlayerCreated);

    // Listen for weapon fire
    this.on('weaponFired', this.onWeaponFired);

    // Listen for math quiz events
    this.on('mathQuizStarted', this.onMathQuizStarted);
    this.on('mathQuizCompleted', this.onMathQuizCompleted);
    this.on('mathAnswerCorrect', this.onMathAnswerCorrect);
    this.on('mathAnswerIncorrect', this.onMathAnswerIncorrect);

    // Listen for ability usage
    this.on('abilityUsed', this.onAbilityUsed);
  }

  onUpdate(time, delta) {
    if (this.wavePhase === 'combat' && this.waveActive) {
      this.updateCombat(time, delta);
    }

    this.updateProjectiles(time, delta);
    this.updateEnemies(time, delta);
    this.checkCollisions();
    this.updateWaveProgress(time);
  }

  updateCombat(time, delta) {
    // Spawn enemies based on difficulty and wave progression
    if (time - this.spawnTimer > this.getCurrentSpawnInterval()) {
      if (this.enemies.length < this.maxEnemiesPerWave) {
        this.spawnEnemy();
        this.spawnTimer = time;
      }
    }
  }

  updateProjectiles(time, delta) {
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];

      if (!projectile.active) {
        this.projectiles.splice(i, 1);
        continue;
      }

      // Update projectile position
      projectile.x += (projectile.velocityX * delta) / 1000;
      projectile.y += (projectile.velocityY * delta) / 1000;

      // Check bounds
      if (this.isProjectileOutOfBounds(projectile)) {
        projectile.setActive(false);
        this.projectiles.splice(i, 1);
      }
    }
  }

  updateEnemies(time, delta) {
    for (let i = this.enemies.length - 1; i >= 0; i--) {
      const enemy = this.enemies[i];

      if (!enemy.active || enemy.health <= 0) {
        this.onEnemyDefeated(enemy);
        this.enemies.splice(i, 1);
        continue;
      }

      // Update enemy AI
      this.updateEnemyAI(enemy, time, delta);
    }
  }

  updateEnemyAI(enemy, time, delta) {
    if (!this.player || !enemy.active) return;

    const distance = Phaser.Math.Distance.Between(
      enemy.x,
      enemy.y,
      this.player.x,
      this.player.y
    );

    // Execute AI behavior based on enemy type
    switch (enemy.aiType) {
      case 'hit_and_run':
        this.executeHitAndRunAI(enemy, distance, time);
        break;
      case 'direct_assault':
        this.executeDirectAssaultAI(enemy, distance, time);
        break;
      case 'long_range':
        this.executeLongRangeAI(enemy, distance, time);
        break;
      case 'fortress':
        this.executeFortressAI(enemy, distance, time);
        break;
      case 'adaptive':
        this.executeAdaptiveAI(enemy, distance, time);
        break;
    }
  }

  executeHitAndRunAI(enemy, distance, time) {
    if (distance > 200) {
      // Move towards player quickly
      this.moveEnemyTowardsPlayer(enemy, enemy.speed * 1.2);
    } else if (distance < 100) {
      // Move away from player (kiting behavior)
      this.moveEnemyAwayFromPlayer(enemy, enemy.speed * 0.8);
    } else {
      // Circle around player
      this.circleAroundPlayer(enemy, enemy.speed);
    }

    // Attack if in range and cooldown is ready
    if (distance < enemy.attackRange && this.canEnemyAttack(enemy, time)) {
      this.enemyAttack(enemy);

      // Dash ability - quick retreat after attack
      if (enemy.abilities.includes('dash') && Math.random() < 0.3) {
        this.executeDashAbility(enemy);
      }
    }
  }

  executeDirectAssaultAI(enemy, distance, time) {
    if (distance > enemy.attackRange) {
      // Charge towards player
      this.moveEnemyTowardsPlayer(enemy, enemy.speed);

      // Charge ability - speed boost when far from player
      if (
        enemy.abilities.includes('charge') &&
        distance > 150 &&
        Math.random() < 0.1
      ) {
        this.executeChargeAbility(enemy);
      }
    } else {
      // Stop and attack
      if (enemy.body) {
        enemy.body.setVelocity(0, 0);
      }

      if (this.canEnemyAttack(enemy, time)) {
        this.enemyAttack(enemy);
      }
    }
  }

  executeLongRangeAI(enemy, distance, time) {
    const optimalRange = enemy.attackRange * 0.8;

    if (distance > optimalRange + 50) {
      // Move closer to optimal range
      this.moveEnemyTowardsPlayer(enemy, enemy.speed * 0.7);
    } else if (distance < optimalRange - 50) {
      // Move away to maintain range
      this.moveEnemyAwayFromPlayer(enemy, enemy.speed * 0.5);
    } else {
      // Strafe around player at optimal range
      this.strafeAroundPlayer(enemy, enemy.speed * 0.6);
    }

    // Attack if in range
    if (distance <= enemy.attackRange && this.canEnemyAttack(enemy, time)) {
      this.enemyAttack(enemy);

      // Missile barrage ability
      if (enemy.abilities.includes('missile_barrage') && Math.random() < 0.2) {
        this.executeMissileBarrageAbility(enemy);
      }
    }
  }

  executeFortressAI(enemy, distance, time) {
    // Tank enemies move slowly but are very aggressive
    if (distance > enemy.attackRange) {
      this.moveEnemyTowardsPlayer(enemy, enemy.speed * 0.8);
    } else {
      // Stop and become a fortress
      if (enemy.body) {
        enemy.body.setVelocity(0, 0);
      }

      if (this.canEnemyAttack(enemy, time)) {
        this.enemyAttack(enemy);

        // Area damage ability
        if (enemy.abilities.includes('area_damage') && Math.random() < 0.3) {
          this.executeAreaDamageAbility(enemy);
        }
      }

      // Shield wall ability - damage reduction
      if (enemy.abilities.includes('shield_wall') && !enemy.shieldActive) {
        this.executeShieldWallAbility(enemy);
      }
    }
  }

  executeAdaptiveAI(enemy, distance, time) {
    // Elite enemies adapt their behavior based on player actions
    if (!enemy.adaptiveState) {
      enemy.adaptiveState = 'aggressive';
      enemy.adaptiveTimer = 0;
    }

    enemy.adaptiveTimer += time - (enemy.lastAdaptiveUpdate || time);
    enemy.lastAdaptiveUpdate = time;

    // Change behavior every 3 seconds
    if (enemy.adaptiveTimer > 3000) {
      const behaviors = ['aggressive', 'defensive', 'hit_and_run'];
      enemy.adaptiveState =
        behaviors[Math.floor(Math.random() * behaviors.length)];
      enemy.adaptiveTimer = 0;
    }

    // Execute behavior based on current state
    switch (enemy.adaptiveState) {
      case 'aggressive':
        this.executeDirectAssaultAI(enemy, distance, time);
        break;
      case 'defensive':
        this.executeLongRangeAI(enemy, distance, time);
        break;
      case 'hit_and_run':
        this.executeHitAndRunAI(enemy, distance, time);
        break;
    }

    // Special abilities
    if (this.canEnemyAttack(enemy, time)) {
      if (enemy.abilities.includes('teleport') && Math.random() < 0.15) {
        this.executeTeleportAbility(enemy);
      }

      if (enemy.abilities.includes('energy_drain') && Math.random() < 0.1) {
        this.executeEnergyDrainAbility(enemy);
      }
    }

    // Shield regeneration
    if (
      enemy.abilities.includes('shield_regeneration') &&
      enemy.health < enemy.maxHealth * 0.5
    ) {
      this.executeShieldRegenerationAbility(enemy);
    }
  }

  moveEnemyTowardsPlayer(enemy, speed) {
    if (!this.player || !enemy.body) return;

    const angle = Phaser.Math.Angle.Between(
      enemy.x,
      enemy.y,
      this.player.x,
      this.player.y
    );

    const velocityX = Math.cos(angle) * speed;
    const velocityY = Math.sin(angle) * speed;

    enemy.body.setVelocity(velocityX, velocityY);
  }

  moveEnemyAwayFromPlayer(enemy, speed) {
    if (!this.player || !enemy.body) return;

    const angle = Phaser.Math.Angle.Between(
      this.player.x,
      this.player.y,
      enemy.x,
      enemy.y
    );

    const velocityX = Math.cos(angle) * speed;
    const velocityY = Math.sin(angle) * speed;

    enemy.body.setVelocity(velocityX, velocityY);
  }

  circleAroundPlayer(enemy, speed) {
    if (!this.player || !enemy.body) return;

    const angle = Phaser.Math.Angle.Between(
      enemy.x,
      enemy.y,
      this.player.x,
      this.player.y
    );

    // Add 90 degrees to circle around
    const circleAngle = angle + Math.PI / 2;

    const velocityX = Math.cos(circleAngle) * speed;
    const velocityY = Math.sin(circleAngle) * speed;

    enemy.body.setVelocity(velocityX, velocityY);
  }

  strafeAroundPlayer(enemy, speed) {
    if (!this.player || !enemy.body) return;

    // Strafe perpendicular to player direction
    const angle = Phaser.Math.Angle.Between(
      enemy.x,
      enemy.y,
      this.player.x,
      this.player.y
    );

    // Randomly choose left or right strafe
    const strafeDirection =
      enemy.strafeDirection || (Math.random() < 0.5 ? 1 : -1);
    enemy.strafeDirection = strafeDirection;

    const strafeAngle = angle + (Math.PI / 2) * strafeDirection;

    const velocityX = Math.cos(strafeAngle) * speed;
    const velocityY = Math.sin(strafeAngle) * speed;

    enemy.body.setVelocity(velocityX, velocityY);

    // Change strafe direction occasionally
    if (Math.random() < 0.02) {
      enemy.strafeDirection *= -1;
    }
  }

  canEnemyAttack(enemy, time) {
    return time - enemy.lastAttackTime > enemy.attackCooldown;
  }

  enemyAttack(enemy) {
    enemy.lastAttackTime = Date.now();

    // Create projectile towards player
    const angle = Phaser.Math.Angle.Between(
      enemy.x,
      enemy.y,
      this.player.x,
      this.player.y
    );

    this.createEnemyProjectile(enemy, angle, 'basic');

    // Emit attack event
    this.emit('enemyAttacked', {
      enemy,
      damage: enemy.damage,
      type: 'basic',
    });
  }

  createEnemyProjectile(enemy, angle, type = 'basic') {
    const projectileConfig = {
      basic: { speed: 200, size: 4, color: 0xff6666, damage: enemy.damage },
      missile: {
        speed: 150,
        size: 6,
        color: 0xff0000,
        damage: enemy.damage * 1.2,
      },
    };

    const config = projectileConfig[type] || projectileConfig.basic;

    const projectile = this.scene.add.circle(
      enemy.x,
      enemy.y,
      config.size,
      config.color
    );

    // Add physics if available
    if (this.scene.physics) {
      this.scene.physics.add.existing(projectile);
    }

    // Set projectile properties
    projectile.velocityX = Math.cos(angle) * config.speed;
    projectile.velocityY = Math.sin(angle) * config.speed;
    projectile.damage = config.damage;
    projectile.isEnemyProjectile = true;
    projectile.type = type;

    this.projectiles.push(projectile);
  }

  checkCollisions() {
    // Check projectile vs enemy collisions
    for (let i = this.projectiles.length - 1; i >= 0; i--) {
      const projectile = this.projectiles[i];
      if (!projectile.active) continue;

      for (let j = this.enemies.length - 1; j >= 0; j--) {
        const enemy = this.enemies[j];
        if (!enemy.active) continue;

        if (this.checkProjectileEnemyCollision(projectile, enemy)) {
          this.onProjectileHitEnemy(projectile, enemy);
          break; // Projectile is destroyed, no need to check more enemies
        }
      }
    }
  }

  checkProjectileEnemyCollision(projectile, enemy) {
    const distance = Phaser.Math.Distance.Between(
      projectile.x,
      projectile.y,
      enemy.x,
      enemy.y
    );

    return distance < (enemy.size?.width || 30) / 2 + 5; // 5px projectile radius
  }

  onProjectileHitEnemy(projectile, enemy) {
    // Calculate damage
    const damage = projectile.damage || 20;
    const isCritical = Math.random() < 0.1; // 10% critical chance
    const finalDamage = isCritical ? damage * 2 : damage;

    // Apply damage
    enemy.health -= finalDamage;
    this.stats.totalDamageDealt += finalDamage;
    this.stats.shotsHit++;

    // Remove projectile
    projectile.setActive(false);
    this.projectiles.splice(this.projectiles.indexOf(projectile), 1);

    // Emit hit event
    this.emit('enemyHit', {
      enemy,
      damage: finalDamage,
      isCritical,
      projectile,
    });

    // Check if enemy is defeated
    if (enemy.health <= 0) {
      this.onEnemyDefeated(enemy);
    }
  }

  spawnEnemy() {
    const spawnX = this.getRandomSpawnX();
    const spawnY = this.getRandomSpawnY();

    // Determine enemy type based on wave and difficulty
    const enemyType = this.selectEnemyType();
    const enemyConfig = this.getEnemyConfig(enemyType);

    // Create enemy sprite
    const enemy = this.scene.add.rectangle(
      spawnX,
      spawnY,
      enemyConfig.size.width,
      enemyConfig.size.height,
      enemyConfig.color
    );

    // Add physics if available
    if (this.scene.physics) {
      this.scene.physics.add.existing(enemy);
      enemy.body.setCollideWorldBounds(true);
    }

    // Set enemy properties
    enemy.enemyType = enemyType;
    enemy.health = enemyConfig.health * this.currentDifficulty;
    enemy.maxHealth = enemy.health;
    enemy.damage = enemyConfig.damage * this.currentDifficulty;
    enemy.speed = enemyConfig.speed;
    enemy.aiType = enemyConfig.aiType;
    enemy.attackRange = enemyConfig.attackRange;
    enemy.attackCooldown = enemyConfig.attackCooldown;
    enemy.lastAttackTime = 0;
    enemy.points = enemyConfig.points;
    enemy.id = Date.now() + Math.random(); // Unique ID

    // Special abilities based on type
    enemy.abilities = enemyConfig.abilities || [];

    // Add to enemies array
    this.enemies.push(enemy);
    this.stats.enemiesSpawned++;

    // Notify UI about new enemy
    this.emit('enemySpawned', {
      id: enemy.id,
      type: enemyType,
      x: spawnX,
      y: spawnY,
      health: enemy.health,
    });

    // Update enemy count
    this.emit('enemyCountChanged', { count: this.enemies.length });

    this.log(`Spawned ${enemyType} enemy at (${spawnX}, ${spawnY})`);
  }

  selectEnemyType() {
    // Enemy type selection based on wave progression
    const waveTypes = {
      1: ['scout'],
      2: ['scout', 'warrior'],
      3: ['scout', 'warrior', 'destroyer'],
      4: ['scout', 'warrior', 'destroyer', 'tank'],
      5: ['warrior', 'destroyer', 'tank', 'elite'],
    };

    const availableTypes =
      waveTypes[Math.min(this.currentWave, 5)] || waveTypes[5];
    return availableTypes[Math.floor(Math.random() * availableTypes.length)];
  }

  getEnemyConfig(enemyType) {
    const configs = {
      scout: {
        size: { width: 20, height: 20 },
        color: 0xff6666,
        health: 30,
        damage: 15,
        speed: 120,
        aiType: 'hit_and_run',
        attackRange: 80,
        attackCooldown: 1500,
        points: 10,
        abilities: ['dash'],
      },
      warrior: {
        size: { width: 25, height: 25 },
        color: 0xff3333,
        health: 60,
        damage: 25,
        speed: 80,
        aiType: 'direct_assault',
        attackRange: 60,
        attackCooldown: 2000,
        points: 20,
        abilities: ['charge'],
      },
      destroyer: {
        size: { width: 30, height: 30 },
        color: 0xff0000,
        health: 100,
        damage: 40,
        speed: 60,
        aiType: 'long_range',
        attackRange: 150,
        attackCooldown: 2500,
        points: 35,
        abilities: ['missile_barrage'],
      },
      tank: {
        size: { width: 40, height: 40 },
        color: 0x990000,
        health: 200,
        damage: 50,
        speed: 40,
        aiType: 'fortress',
        attackRange: 100,
        attackCooldown: 3000,
        points: 50,
        abilities: ['shield_wall', 'area_damage'],
      },
      elite: {
        size: { width: 35, height: 35 },
        color: 0x6600ff,
        health: 150,
        damage: 60,
        speed: 100,
        aiType: 'adaptive',
        attackRange: 120,
        attackCooldown: 1800,
        points: 75,
        abilities: ['teleport', 'energy_drain', 'shield_regeneration'],
      },
    };

    return configs[enemyType] || configs.scout;
  }

  getRandomSpawnX() {
    const arenaX = this.scene.arenaX || 100;
    const arenaWidth = this.scene.arenaWidth || 800;

    // Spawn at edges for more interesting gameplay
    return Math.random() < 0.5
      ? arenaX + Math.random() * 50
      : arenaX + arenaWidth - 50 + Math.random() * 50;
  }

  getRandomSpawnY() {
    const arenaY = this.scene.arenaY || 100;
    const arenaHeight = this.scene.arenaHeight || 600;

    return Math.random() < 0.5
      ? arenaY + Math.random() * 50
      : arenaY + arenaHeight - 50 + Math.random() * 50;
  }

  getCurrentSpawnInterval() {
    // Decrease spawn interval as difficulty increases
    const baseInterval = this.spawnInterval;
    const difficultyMultiplier = Math.max(
      0.3,
      1 - (this.currentDifficulty - 1) * 0.1
    );
    return baseInterval * difficultyMultiplier;
  }

  onEnemyDefeated(enemy) {
    // Award points
    this.emit('enemyDefeated', {
      id: enemy.id,
      type: enemy.enemyType,
      points: enemy.points,
      position: { x: enemy.x, y: enemy.y },
    });

    // Update stats
    this.stats.enemiesDefeated++;

    // Create death effect
    this.createEnemyDeathEffect(enemy);

    // Remove from scene
    enemy.destroy();

    // Update enemy count
    this.emit('enemyCountChanged', { count: this.enemies.length });
  }

  damagePlayer(damage, type = 'normal') {
    this.stats.totalDamageTaken += damage;

    this.emit('playerDamaged', {
      damage,
      type,
      totalDamageTaken: this.stats.totalDamageTaken,
    });
  }

  fireWeapon(weaponType, targetX, targetY) {
    if (!this.player) return;

    const weaponStats = GameConfigUtils.getWeaponStats(weaponType);
    if (!weaponStats) return;

    // Calculate projectile trajectory
    const angle = Phaser.Math.Angle.Between(
      this.player.x,
      this.player.y,
      targetX,
      targetY
    );
    const velocityX = Math.cos(angle) * weaponStats.projectileSpeed;
    const velocityY = Math.sin(angle) * weaponStats.projectileSpeed;

    // Create projectile
    const projectile = this.scene.add.circle(
      this.player.x,
      this.player.y,
      3,
      weaponStats.color
    );
    projectile.velocityX = velocityX;
    projectile.velocityY = velocityY;
    projectile.damage = weaponStats.damage;
    projectile.range = weaponStats.range;
    projectile.weaponType = weaponType;

    this.projectiles.push(projectile);
    this.stats.shotsFired++;

    this.emit('projectileCreated', { projectile, weaponType, weaponStats });
  }

  isProjectileOutOfBounds(projectile) {
    const margin = 50;
    return (
      projectile.x < -margin ||
      projectile.x > this.scene.scale.width + margin ||
      projectile.y < -margin ||
      projectile.y > this.scene.scale.height + margin
    );
  }

  updateWaveProgress(time) {
    if (!this.waveActive) return;

    const waveElapsed = (time - this.waveStartTime) / 1000;
    const { waveDuration } = GameConfig.timing;

    if (waveElapsed >= waveDuration && this.wavePhase === 'combat') {
      this.endWave();
    }
  }

  startWave() {
    this.waveActive = true;
    this.waveStartTime = Date.now();
    this.wavePhase = 'combat';
    this.mathCorrectAnswers = 0;
    this.mathTotalQuestions = 0;

    this.emit('waveStarted', {
      wave: this.currentWave,
      difficulty: this.currentDifficulty,
    });

    this.log(
      `Wave ${this.currentWave} started (Difficulty: ${this.currentDifficulty.toFixed(1)})`
    );
  }

  endWave() {
    this.waveActive = false;
    this.wavePhase = 'transition';

    // Clear remaining enemies
    this.clearEnemies();

    this.emit('waveEnded', {
      wave: this.currentWave,
      stats: this.getWaveStats(),
    });

    // Start math quiz if not final wave
    if (this.currentWave < GameConfig.timing.waveCount) {
      this.startMathQuiz();
    } else {
      this.endCombat();
    }
  }

  startMathQuiz() {
    this.wavePhase = 'math';
    this.mathQuizActive = true;

    this.emit('mathQuizStarted', {
      wave: this.currentWave,
      questionsCount: GameConfig.math.quiz.questionsPerWave,
    });
  }

  clearEnemies() {
    this.enemies.forEach(enemy => {
      if (enemy.destroy) {
        enemy.destroy();
      }
    });
    this.enemies = [];
  }

  getWaveStats() {
    return {
      enemiesSpawned: this.stats.enemiesSpawned,
      enemiesDefeated: this.stats.enemiesDefeated,
      accuracy:
        this.stats.shotsFired > 0
          ? this.stats.shotsHit / this.stats.shotsFired
          : 0,
      damageDealt: this.stats.totalDamageDealt,
      damageTaken: this.stats.totalDamageTaken,
    };
  }

  // Event handlers
  onPlayerCreated(player) {
    this.player = player;
    this.log('Player reference set');
  }

  onWeaponFired(data) {
    this.fireWeapon(data.weaponType, data.targetX, data.targetY);
  }

  onMathQuizStarted() {
    this.log('Math quiz started');
  }

  onMathQuizCompleted(data) {
    this.mathQuizActive = false;
    this.wavePhase = 'transition';

    // Calculate rewards based on math performance
    const rewards = GameConfigUtils.calculateMathRewards(
      this.mathCorrectAnswers,
      this.mathTotalQuestions
    );

    this.emit('mathRewardsCalculated', rewards);

    // Advance to next wave
    this.currentWave++;
    this.currentDifficulty = GameConfigUtils.getWaveDifficulty(
      this.currentWave
    );

    // Start next wave after delay
    setTimeout(() => {
      this.startWave();
    }, 2000);
  }

  onMathAnswerCorrect() {
    this.mathCorrectAnswers++;
    this.mathTotalQuestions++;
  }

  onMathAnswerIncorrect() {
    this.mathTotalQuestions++;
  }

  onAbilityUsed(data) {
    this.stats.abilitiesUsed++;
  }

  endCombat() {
    this.waveActive = false;
    this.wavePhase = 'complete';

    const finalStats = {
      ...this.stats,
      accuracy:
        this.stats.shotsFired > 0
          ? this.stats.shotsHit / this.stats.shotsFired
          : 0,
      wavesCompleted: this.currentWave,
    };

    this.emit('combatEnded', finalStats);

    this.log('Combat completed!', finalStats);
  }

  onCleanup() {
    this.clearEnemies();
    this.projectiles.forEach(projectile => {
      if (projectile.destroy) {
        projectile.destroy();
      }
    });
    this.projectiles = [];
  }

  // Public API
  getCombatStats() {
    return {
      ...this.stats,
      accuracy:
        this.stats.shotsFired > 0
          ? this.stats.shotsHit / this.stats.shotsFired
          : 0,
      currentWave: this.currentWave,
      currentDifficulty: this.currentDifficulty,
      wavePhase: this.wavePhase,
      enemiesActive: this.enemies.length,
      projectilesActive: this.projectiles.length,
    };
  }

  getCurrentWave() {
    return this.currentWave;
  }

  getCurrentDifficulty() {
    return this.currentDifficulty;
  }

  isInCombat() {
    return this.waveActive && this.wavePhase === 'combat';
  }

  isMathQuizActive() {
    return this.mathQuizActive;
  }

  // === ENEMY ABILITIES ===

  executeDashAbility(enemy) {
    // Quick dash away from player
    const angle = Phaser.Math.Angle.Between(
      this.player.x,
      this.player.y,
      enemy.x,
      enemy.y
    );

    const dashDistance = 100;
    const targetX = enemy.x + Math.cos(angle) * dashDistance;
    const targetY = enemy.y + Math.sin(angle) * dashDistance;

    // Animate dash
    this.scene.tweens.add({
      targets: enemy,
      x: targetX,
      y: targetY,
      duration: 200,
      ease: 'Power2',
    });

    // Visual effect
    this.createDashEffect(enemy);
  }

  executeChargeAbility(enemy) {
    // Speed boost towards player
    enemy.chargeActive = true;
    enemy.originalSpeed = enemy.speed;
    enemy.speed *= 2;

    // Visual effect
    enemy.setTint(0xffff00);

    // Remove charge after 2 seconds
    setTimeout(() => {
      if (enemy.active) {
        enemy.chargeActive = false;
        enemy.speed = enemy.originalSpeed;
        enemy.clearTint();
      }
    }, 2000);
  }

  executeMissileBarrageAbility(enemy) {
    // Fire multiple projectiles
    const projectileCount = 5;
    const spreadAngle = Math.PI / 3; // 60 degrees

    for (let i = 0; i < projectileCount; i++) {
      const baseAngle = Phaser.Math.Angle.Between(
        enemy.x,
        enemy.y,
        this.player.x,
        this.player.y
      );

      const angle = baseAngle + (i - 2) * (spreadAngle / 4);

      setTimeout(() => {
        if (enemy.active) {
          this.createEnemyProjectile(enemy, angle, 'missile');
        }
      }, i * 100);
    }
  }

  executeAreaDamageAbility(enemy) {
    // Create area damage around enemy
    const damageRadius = 80;
    const distance = Phaser.Math.Distance.Between(
      enemy.x,
      enemy.y,
      this.player.x,
      this.player.y
    );

    if (distance <= damageRadius) {
      // Damage player
      this.emit('playerDamaged', {
        damage: enemy.damage * 1.5,
        source: 'area_attack',
        enemy,
      });
    }

    // Visual effect
    this.createAreaDamageEffect(enemy, damageRadius);
  }

  executeShieldWallAbility(enemy) {
    enemy.shieldActive = true;
    enemy.damageReduction = 0.5; // 50% damage reduction
    enemy.setTint(0x00ffff);

    // Shield lasts 5 seconds
    setTimeout(() => {
      if (enemy.active) {
        enemy.shieldActive = false;
        enemy.damageReduction = 0;
        enemy.clearTint();
      }
    }, 5000);
  }

  executeTeleportAbility(enemy) {
    // Teleport to random position near player
    const teleportRange = 150;
    const angle = Math.random() * Math.PI * 2;
    const distance = 80 + Math.random() * 70;

    const newX = this.player.x + Math.cos(angle) * distance;
    const newY = this.player.y + Math.sin(angle) * distance;

    // Teleport effect
    enemy.setAlpha(0.3);

    this.scene.tweens.add({
      targets: enemy,
      x: newX,
      y: newY,
      alpha: 1,
      duration: 300,
      ease: 'Power2',
    });

    this.createTeleportEffect(enemy.x, enemy.y);
    this.createTeleportEffect(newX, newY);
  }

  executeEnergyDrainAbility(enemy) {
    // Drain player energy and heal enemy
    const drainAmount = 20;

    this.emit('playerEnergyDrained', {
      amount: drainAmount,
      source: enemy,
    });

    // Heal enemy
    enemy.health = Math.min(enemy.maxHealth, enemy.health + drainAmount);

    // Visual effect
    this.createEnergyDrainEffect(enemy);
  }

  executeShieldRegenerationAbility(enemy) {
    if (enemy.regenerating) return;

    enemy.regenerating = true;
    enemy.setTint(0x00ff00);

    // Regenerate health over time
    const regenInterval = setInterval(() => {
      if (enemy.active && enemy.health < enemy.maxHealth) {
        enemy.health += 5;
        if (enemy.health >= enemy.maxHealth) {
          enemy.health = enemy.maxHealth;
          clearInterval(regenInterval);
          enemy.regenerating = false;
          enemy.clearTint();
        }
      } else {
        clearInterval(regenInterval);
        enemy.regenerating = false;
        if (enemy.active) enemy.clearTint();
      }
    }, 500);

    // Stop regeneration after 10 seconds
    setTimeout(() => {
      clearInterval(regenInterval);
      enemy.regenerating = false;
      if (enemy.active) enemy.clearTint();
    }, 10000);
  }

  // === VISUAL EFFECTS ===

  createDashEffect(enemy) {
    // Create dash trail effect
    for (let i = 0; i < 5; i++) {
      const trail = this.scene.add.circle(
        enemy.x,
        enemy.y,
        enemy.width / 2,
        enemy.fillColor,
        0.3 - i * 0.05
      );

      this.scene.tweens.add({
        targets: trail,
        alpha: 0,
        duration: 300 + i * 50,
        onComplete: () => trail.destroy(),
      });
    }
  }

  createAreaDamageEffect(enemy, radius) {
    // Create expanding circle effect
    const effect = this.scene.add.circle(enemy.x, enemy.y, 0, 0xff6600, 0.5);

    this.scene.tweens.add({
      targets: effect,
      radius,
      alpha: 0,
      duration: 500,
      ease: 'Power2',
      onComplete: () => effect.destroy(),
    });
  }

  createTeleportEffect(x, y) {
    // Create teleport particles
    for (let i = 0; i < 10; i++) {
      const particle = this.scene.add.circle(
        x + (Math.random() - 0.5) * 40,
        y + (Math.random() - 0.5) * 40,
        2,
        0x6600ff
      );

      this.scene.tweens.add({
        targets: particle,
        y: y - 50,
        alpha: 0,
        duration: 800,
        delay: i * 50,
        onComplete: () => particle.destroy(),
      });
    }
  }

  createEnergyDrainEffect(enemy) {
    // Create energy beam effect
    const beam = this.scene.add.line(
      0,
      0,
      enemy.x,
      enemy.y,
      this.player.x,
      this.player.y,
      0x00ffff,
      0.8
    );
    beam.setLineWidth(3);

    this.scene.tweens.add({
      targets: beam,
      alpha: 0,
      duration: 1000,
      onComplete: () => beam.destroy(),
    });
  }

  createEnemyDeathEffect(enemy) {
    // Create explosion particles
    for (let i = 0; i < 8; i++) {
      const particle = this.scene.add.circle(
        enemy.x,
        enemy.y,
        3,
        enemy.fillColor
      );

      const angle = (i / 8) * Math.PI * 2;
      const speed = 100 + Math.random() * 50;

      this.scene.tweens.add({
        targets: particle,
        x: enemy.x + Math.cos(angle) * speed,
        y: enemy.y + Math.sin(angle) * speed,
        alpha: 0,
        duration: 800,
        ease: 'Power2',
        onComplete: () => particle.destroy(),
      });
    }
  }

  // Initialize the combat system
  init() {
    this.loadCharacterStats();
    this.createCombatUI();
    this.createRobots();

    console.log(
      'CombatSystem: Combat system ready with stats:',
      this.characterStats
    );
  }

  // Load character stats from progress tracker
  loadCharacterStats() {
    this.characterStats = this.progressTracker.getCharacterStats();
    console.log('CombatSystem: Loaded character stats:', this.characterStats);
  }

  // Create player and enemy robots
  createRobots() {
    this.createPlayerRobot();
    this.createEnemyRobot();
  }

  // Create player robot based on character type
  createPlayerRobot() {
    const charType = this.progressTracker.getCharacterType();

    // Position based on scene layout (can be customized per scene)
    const x = this.scene.scale.width * 0.2;
    const y = this.scene.scale.height * 0.6;

    this.playerRobot = this.scene.add.container(x, y);

    // Create robot graphic
    const robotGraphic = this.createRobotGraphic(
      0,
      0,
      charType || {
        id: 'default',
        baseColor: 0x00ffff,
        accentColor: 0xff00ff,
      }
    );

    this.playerRobot.add(robotGraphic);

    // Add idle animation
    this.scene.tweens.add({
      targets: this.playerRobot,
      y: y - 5,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    console.log('CombatSystem: Player robot created');
  }

  // Create enemy robot
  createEnemyRobot() {
    const x = this.scene.scale.width * 0.8;
    const y = this.scene.scale.height * 0.6;

    this.enemyRobot = this.scene.add.container(x, y);

    // Create enemy robot graphic
    const enemyGraphic = this.createEnemyRobotGraphic(0, 0);
    this.enemyRobot.add(enemyGraphic);

    // Add menacing idle animation
    this.scene.tweens.add({
      targets: this.enemyRobot,
      y: y - 5,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Initialize enemy health
    this.enemyHealth = this.maxEnemyHealth;
    this.updateEnemyHealthBar();

    console.log('CombatSystem: Enemy robot created');
  }

  // Create robot graphic based on character type
  createRobotGraphic(x, y, charType) {
    const robotContainer = this.scene.add.container(x, y);

    // Robot specifications
    const specs = this.getRobotSpecifications(charType);

    // Create robot components
    this.createRobotBase(robotContainer, specs);
    this.createRobotTorso(robotContainer, specs);
    this.createRobotHead(robotContainer, specs);
    this.createRobotWeapons(robotContainer, specs);

    return robotContainer;
  }

  // Get robot specifications based on character type
  getRobotSpecifications(charType) {
    const baseSpecs = {
      scale: 0.8,
      primaryColor: charType.baseColor || 0x00ffff,
      accentColor: charType.accentColor || 0xff00ff,
      glowColor: charType.accentColor || 0xff00ff,
      size: { width: 50, height: 70 },
    };

    switch (charType.id) {
      case 'aria':
        return {
          ...baseSpecs,
          type: 'stealth',
          primaryColor: 0x3b82f6,
          accentColor: 0x00ffff,
          features: { sleek: true, angular: true },
        };

      case 'titan':
        return {
          ...baseSpecs,
          type: 'heavy',
          primaryColor: 0xef4444,
          accentColor: 0xffa500,
          features: { bulky: true, armored: true },
        };

      case 'nexus':
        return {
          ...baseSpecs,
          type: 'tech',
          primaryColor: 0x10b981,
          accentColor: 0xfbbf24,
          features: { modular: true, crystalline: true },
        };

      default:
        return baseSpecs;
    }
  }

  // Create robot components
  createRobotBase(container, specs) {
    const base = this.scene.add.graphics();
    base.fillStyle(specs.primaryColor, 0.8);
    base.fillRoundedRect(-15, 20, 30, 15, 5);
    container.add(base);
  }

  createRobotTorso(container, specs) {
    const torso = this.scene.add.graphics();
    torso.fillStyle(specs.primaryColor, 0.9);
    torso.fillRoundedRect(-12, -5, 24, 25, 6);

    // Add accent details
    torso.fillStyle(specs.accentColor, 0.8);
    torso.fillRoundedRect(-10, -3, 20, 5, 3);
    torso.fillCircle(0, 5, 4);

    container.add(torso);
  }

  createRobotHead(container, specs) {
    const head = this.scene.add.graphics();
    head.fillStyle(specs.primaryColor, 0.95);
    head.fillRoundedRect(-8, -25, 16, 15, 4);

    // Add visor
    head.fillStyle(specs.glowColor, 0.9);
    head.fillRoundedRect(-6, -22, 12, 4, 2);

    container.add(head);
  }

  createRobotWeapons(container, specs) {
    // Simple weapon representation
    const weapon = this.scene.add.graphics();
    weapon.fillStyle(specs.accentColor, 0.9);
    weapon.fillRoundedRect(15, -5, 8, 15, 2);
    container.add(weapon);
  }

  // Create enemy robot graphic
  createEnemyRobotGraphic(x, y) {
    const robotContainer = this.scene.add.container(x, y);

    // Enemy robot - menacing red design
    const specs = {
      primaryColor: 0xff0000,
      accentColor: 0xff6600,
      glowColor: 0xff0000,
    };

    // Enemy base
    const base = this.scene.add.graphics();
    base.fillStyle(specs.primaryColor, 0.8);
    base.fillRoundedRect(-18, 20, 36, 18, 6);
    robotContainer.add(base);

    // Enemy torso
    const torso = this.scene.add.graphics();
    torso.fillStyle(specs.primaryColor, 0.9);
    torso.fillRoundedRect(-15, -8, 30, 28, 8);
    torso.fillStyle(specs.accentColor, 0.8);
    torso.fillRoundedRect(-12, -5, 24, 6, 3);
    torso.fillCircle(0, 8, 5);
    robotContainer.add(torso);

    // Enemy head
    const head = this.scene.add.graphics();
    head.fillStyle(specs.primaryColor, 0.95);
    head.fillRoundedRect(-10, -30, 20, 18, 5);
    head.fillStyle(specs.glowColor, 1.0);
    head.fillRoundedRect(-8, -27, 16, 5, 2);
    robotContainer.add(head);

    // Enemy weapons
    const leftWeapon = this.scene.add.graphics();
    leftWeapon.fillStyle(specs.accentColor, 0.9);
    leftWeapon.fillRoundedRect(-25, -5, 10, 18, 3);
    robotContainer.add(leftWeapon);

    const rightWeapon = this.scene.add.graphics();
    rightWeapon.fillStyle(specs.accentColor, 0.9);
    rightWeapon.fillRoundedRect(15, -5, 10, 18, 3);
    robotContainer.add(rightWeapon);

    return robotContainer;
  }

  // Create combat UI
  createCombatUI() {
    const uiX = this.scene.scale.width - 250;
    const uiY = 50;

    // Enemy health bar background
    this.enemyHealthBarBg = this.scene.add.graphics();
    this.enemyHealthBarBg.fillStyle(0x333333, 0.8);
    this.enemyHealthBarBg.fillRoundedRect(uiX, uiY, 200, 20, 10);
    this.enemyHealthBarBg.lineStyle(2, 0xff0000, 0.8);
    this.enemyHealthBarBg.strokeRoundedRect(uiX, uiY, 200, 20, 10);

    // Enemy health bar
    this.enemyHealthBar = this.scene.add.graphics();

    // Enemy health text
    this.enemyHealthText = this.scene.add
      .text(uiX + 100, uiY + 10, 'ENEMY: 100/100', {
        fontSize: '12px',
        fontFamily: 'Courier, monospace',
        fill: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    // Combat stats display
    this.combatStatsDisplay = this.scene.add.text(50, 150, '', {
      fontSize: '14px',
      fontFamily: 'Courier, monospace',
      fill: '#00ffff',
      fontStyle: 'bold',
    });

    this.updateCombatStatsDisplay();
    this.updateEnemyHealthBar();

    console.log('CombatSystem: Combat UI created');
  }

  // Update enemy health bar
  updateEnemyHealthBar() {
    if (this.enemyHealthBar) {
      this.enemyHealthBar.clear();
      const healthPercent = this.enemyHealth / this.maxEnemyHealth;
      const barWidth = 200 * healthPercent;
      const uiX = this.scene.scale.width - 250;
      const uiY = 50;

      // Health bar color based on health level
      let healthColor = 0x00ff00; // Green
      if (healthPercent < 0.6) healthColor = 0xffff00; // Yellow
      if (healthPercent < 0.3) healthColor = 0xff0000; // Red

      this.enemyHealthBar.fillStyle(healthColor, 0.8);
      this.enemyHealthBar.fillRoundedRect(uiX, uiY, barWidth, 20, 10);
    }

    if (this.enemyHealthText) {
      this.enemyHealthText.setText(
        `ENEMY: ${Math.max(0, Math.floor(this.enemyHealth))}/${this.maxEnemyHealth}`
      );
    }
  }

  // Update combat stats display
  updateCombatStatsDisplay() {
    if (this.combatStatsDisplay) {
      const stats = this.characterStats;
      const displayText = [
        `⚔️ ATK: ${(stats.attackPower * 100).toFixed(0)}%`,
        `🛡️ DEF: ${stats.defense}`,
        `⚡ SPD: ${stats.speed}s`,
        `🎯 ACC: ${stats.accuracy}%`,
      ].join('  ');

      this.combatStatsDisplay.setText(displayText);
    }
  }

  // Handle correct answer - player robot attacks
  onCorrectAnswer(data = {}) {
    console.log('CombatSystem: Correct answer - player robot attacks!');

    // Calculate damage based on character stats
    const baseDamage = 25;
    const damage = Math.floor(baseDamage * this.characterStats.attackPower);

    // Apply damage to enemy
    this.enemyHealth = Math.max(0, this.enemyHealth - damage);
    this.updateEnemyHealthBar();

    // Perform attack animation
    this.performPlayerAttack(damage);

    // Create floating damage number
    this.createFloatingDamageNumber(
      this.enemyRobot.x,
      this.enemyRobot.y - 50,
      damage,
      '#ff6600'
    );

    // Check if enemy is defeated
    if (this.enemyHealth <= 0) {
      this.onEnemyDefeated();
    }

    return damage;
  }

  // Handle incorrect answer - enemy robot attacks
  onIncorrectAnswer(data = {}) {
    console.log('CombatSystem: Incorrect answer - enemy robot attacks!');

    // Calculate penalty with defense reduction
    const basePenalty = 50;
    const actualPenalty = Math.max(
      10,
      basePenalty - this.characterStats.defense
    );

    // Perform enemy attack animation
    this.performEnemyAttack(actualPenalty);

    // Create floating penalty number
    this.createFloatingDamageNumber(
      this.playerRobot.x,
      this.playerRobot.y - 50,
      actualPenalty,
      '#ff0000'
    );

    return actualPenalty;
  }

  // Player robot attack animation
  performPlayerAttack(damage) {
    this.scene.tweens.add({
      targets: this.playerRobot,
      x: this.playerRobot.x + 100,
      duration: 200,
      ease: 'Power2.easeOut',
      yoyo: true,
      onComplete: () => {
        // Create attack effect
        this.createAttackEffect(
          this.enemyRobot.x - 30,
          this.enemyRobot.y,
          '#00ffff'
        );

        // Enemy hit reaction
        this.scene.tweens.add({
          targets: this.enemyRobot,
          x: this.enemyRobot.x + 20,
          duration: 100,
          yoyo: true,
          ease: 'Power2.easeOut',
        });

        // Screen shake for impact
        this.scene.cameras.main.shake(200, 0.01);
      },
    });
  }

  // Enemy robot attack animation
  performEnemyAttack(penalty) {
    this.scene.tweens.add({
      targets: this.enemyRobot,
      x: this.enemyRobot.x - 100,
      duration: 200,
      ease: 'Power2.easeOut',
      yoyo: true,
      onComplete: () => {
        // Create attack effect
        this.createAttackEffect(
          this.playerRobot.x + 30,
          this.playerRobot.y,
          '#ff0000'
        );

        // Player hit reaction
        this.scene.tweens.add({
          targets: this.playerRobot,
          x: this.playerRobot.x - 20,
          duration: 100,
          yoyo: true,
          ease: 'Power2.easeOut',
        });

        // Screen shake for impact
        this.scene.cameras.main.shake(150, 0.008);
      },
    });
  }

  // Create attack effect
  createAttackEffect(x, y, color) {
    const effect = this.scene.add.graphics();
    effect.fillStyle(Phaser.Display.Color.HexStringToColor(color).color, 0.8);
    effect.fillCircle(x, y, 20);

    // Expand and fade effect
    this.scene.tweens.add({
      targets: effect,
      scaleX: 3,
      scaleY: 3,
      alpha: 0,
      duration: 300,
      ease: 'Power2.easeOut',
      onComplete: () => effect.destroy(),
    });

    // Add particles
    for (let i = 0; i < 8; i++) {
      const particle = this.scene.add.circle(
        x,
        y,
        3,
        Phaser.Display.Color.HexStringToColor(color).color
      );
      const angle = (i / 8) * Math.PI * 2;
      const distance = 50;

      this.scene.tweens.add({
        targets: particle,
        x: x + Math.cos(angle) * distance,
        y: y + Math.sin(angle) * distance,
        alpha: 0,
        duration: 400,
        ease: 'Power2.easeOut',
        onComplete: () => particle.destroy(),
      });
    }
  }

  // Create floating damage number
  createFloatingDamageNumber(x, y, damage, color) {
    const damageText = this.scene.add
      .text(x, y, `-${damage}`, {
        fontSize: '20px',
        fontFamily: 'Courier, monospace',
        fill: color,
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    this.scene.tweens.add({
      targets: damageText,
      y: y - 50,
      alpha: 0,
      duration: 1000,
      ease: 'Power2.easeOut',
      onComplete: () => damageText.destroy(),
    });
  }

  // Handle enemy defeat
  onEnemyDefeated() {
    console.log('CombatSystem: Enemy robot defeated!');

    // Victory animation
    this.scene.tweens.add({
      targets: this.enemyRobot,
      alpha: 0.3,
      scaleX: 0.8,
      scaleY: 0.8,
      duration: 500,
      ease: 'Power2.easeOut',
    });

    // Victory text
    this.createFloatingText(
      this.enemyRobot.x,
      this.enemyRobot.y - 80,
      'DEFEATED!',
      '#ff6600',
      '24px'
    );

    // Award bonus XP and coins using character stats
    const bonusXP = this.progressTracker.addExperience(50);
    const bonusCoins = this.progressTracker.addCoins(25);

    // Show rewards
    this.createFloatingText(
      this.scene.scale.width / 2,
      200,
      `+${bonusXP} XP  +${bonusCoins} Coins`,
      '#ffd700',
      '18px'
    );

    // Spawn new enemy after delay
    this.scene.time.delayedCall(2000, () => {
      this.spawnNewEnemy();
    });
  }

  // Spawn new enemy
  spawnNewEnemy() {
    console.log('CombatSystem: Spawning new enemy robot...');

    // Reset enemy health
    this.enemyHealth = this.maxEnemyHealth;
    this.updateEnemyHealthBar();

    // Reset enemy appearance
    this.enemyRobot.setAlpha(1);
    this.enemyRobot.setScale(1);

    // Entrance animation
    const originalX = this.scene.scale.width * 0.8;
    this.enemyRobot.setX(this.scene.scale.width + 100);
    this.scene.tweens.add({
      targets: this.enemyRobot,
      x: originalX,
      duration: 500,
      ease: 'Power2.easeOut',
    });

    // Announcement
    this.createFloatingText(
      this.scene.scale.width / 2,
      150,
      'NEW CHALLENGER!',
      '#ff0000',
      '20px'
    );
  }

  // Create floating text
  createFloatingText(x, y, text, color = '#ffffff', fontSize = '16px') {
    const floatingText = this.scene.add
      .text(x, y, text, {
        fontSize,
        fontFamily: 'Courier, monospace',
        fill: color,
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Animate the floating text
    this.scene.tweens.add({
      targets: floatingText,
      y: y - 50,
      alpha: 0,
      duration: 1500,
      ease: 'Power2.easeOut',
      onComplete: () => {
        floatingText.destroy();
      },
    });
  }

  // Cleanup method
  destroy() {
    // Clean up any remaining animations or objects
    this.damageNumbers.forEach(number => {
      if (number && number.destroy) number.destroy();
    });
    this.combatEffects.forEach(effect => {
      if (effect && effect.destroy) effect.destroy();
    });

    console.log('CombatSystem: Destroyed');
  }
}
