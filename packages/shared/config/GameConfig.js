/**
 * Comprehensive Game Configuration
 * All game parameters, difficulty scaling, and data-driven stats
 */

export const GameConfig = {
  // === CORE GAME SETTINGS ===
  arena: {
    width: 800,
    height: 600,
    centerOffset: { x: 112, y: 84 }, // (1024-800)/2, (768-600)/2
  },

  // === TIMING & PHASES ===
  timing: {
    totalGameTime: 180, // 3 minutes in seconds
    waveCount: 6, // 6 waves of 30 seconds each
    waveDuration: 30, // seconds per wave
    mathQuizDuration: 15, // seconds for math quiz between waves
    comboDecayTime: 3000, // milliseconds
    weaponSwitchCooldown: 500, // milliseconds
  },

  // === DIFFICULTY SCALING ===
  difficulty: {
    base: 1.0,
    maxDifficulty: 3.0,
    increasePerWave: 0.2,

    // Scaling formulas (applied as functions)
    scaling: {
      spawnInterval: (baseInterval, difficulty) =>
        baseInterval / difficulty ** 0.8,
      enemyHealth: (baseHealth, difficulty) =>
        Math.floor(baseHealth * difficulty ** 1.2),
      enemySpeed: (baseSpeed, difficulty) =>
        baseSpeed * (1 + (difficulty - 1) * 0.3),
      enemyDamage: (baseDamage, difficulty) =>
        Math.floor(baseDamage * difficulty ** 1.1),
      spawnCount: (baseCount, difficulty) =>
        Math.min(8, Math.floor(baseCount * difficulty)),
    },
  },

  // === ENEMY CONFIGURATIONS ===
  enemies: {
    scout: {
      baseHealth: 50,
      baseDamage: 15,
      baseSpeed: 150,
      attackRange: 100,
      attackCooldown: 2000,
      points: 100,
      spawnWeight: 0.5, // Higher = more common
      aiType: 'hit_and_run',
      size: { width: 30, height: 30 },
      color: 0xff4444,
    },
    warrior: {
      baseHealth: 100,
      baseDamage: 25,
      baseSpeed: 100,
      attackRange: 150,
      attackCooldown: 2500,
      points: 200,
      spawnWeight: 0.3,
      aiType: 'direct_assault',
      size: { width: 35, height: 35 },
      color: 0xff6600,
    },
    destroyer: {
      baseHealth: 150,
      baseDamage: 40,
      baseSpeed: 75,
      attackRange: 300,
      attackCooldown: 4000,
      points: 350,
      spawnWeight: 0.2,
      aiType: 'long_range',
      size: { width: 40, height: 40 },
      color: 0xff0000,
    },
  },

  // === WEAPON CONFIGURATIONS ===
  weapons: {
    rapidFire: {
      damage: 20,
      fireRate: 200, // milliseconds between shots
      range: 400,
      projectileSpeed: 500,
      energyCost: 5,
      accuracy: 0.95,
      icon: '🔫',
      color: 0x00ff88,
    },
    heavyCannon: {
      damage: 60,
      fireRate: 800,
      range: 500,
      projectileSpeed: 300,
      energyCost: 15,
      accuracy: 0.85,
      icon: '💥',
      color: 0xff6600,
      areaOfEffect: 50,
    },
    laser: {
      damage: 35,
      fireRate: 400,
      range: 600,
      projectileSpeed: 800,
      energyCost: 10,
      accuracy: 1.0,
      icon: '⚡',
      color: 0x00ffff,
      piercing: true,
    },
    spreadShot: {
      damage: 15,
      fireRate: 300,
      range: 350,
      projectileSpeed: 400,
      energyCost: 8,
      accuracy: 0.8,
      icon: '🌟',
      color: 0xffff00,
      projectileCount: 3,
      spread: 30, // degrees
    },
  },

  // === SPECIAL ABILITIES ===
  abilities: {
    timeSlow: {
      name: 'Time Dilation',
      duration: 5000,
      cooldown: 15000,
      energyCost: 30,
      effect: { timeScale: 0.3 },
      icon: '⏰',
      color: 0x9966ff,
    },
    shieldBoost: {
      name: 'Energy Shield',
      duration: 8000,
      cooldown: 12000,
      energyCost: 25,
      effect: { shieldAmount: 50 },
      icon: '🛡️',
      color: 0x4444ff,
    },
    damageBoost: {
      name: 'Weapon Overcharge',
      duration: 6000,
      cooldown: 18000,
      energyCost: 20,
      effect: { damageMultiplier: 2.0 },
      icon: '⚔️',
      color: 0xff4444,
    },
    rapidFire: {
      name: 'Rapid Fire Mode',
      duration: 4000,
      cooldown: 10000,
      energyCost: 15,
      effect: { fireRateMultiplier: 3.0 },
      icon: '🔥',
      color: 0xff8800,
    },
    areaAttack: {
      name: 'Plasma Burst',
      duration: 0, // Instant
      cooldown: 20000,
      energyCost: 40,
      effect: { areaRadius: 200, areaDamage: 100 },
      icon: '💫',
      color: 0x00ff00,
    },
  },

  // === PLAYER CONFIGURATION ===
  player: {
    baseHealth: 100,
    baseShield: 0,
    baseEnergy: 100,
    energyRegenRate: 2, // per second
    shieldRegenRate: 1, // per second when not taking damage
    shieldRegenDelay: 3000, // milliseconds after last damage
    size: { width: 40, height: 40 },
    speed: 200,
    color: 0x00aaff,
  },

  // === MATH INTEGRATION ===
  math: {
    // Math gauge that fills with correct answers
    mathGauge: {
      maxValue: 100,
      correctAnswerValue: 20,
      incorrectAnswerPenalty: -10,
      abilityUnlockThreshold: 80,
      comboBoostThreshold: 60,
    },

    // Quiz configuration
    quiz: {
      questionsPerWave: 3,
      timePerQuestion: 15,
      difficultyProgression: true,
      rewardMultipliers: {
        perfect: 2.0,
        good: 1.5,
        average: 1.0,
        poor: 0.5,
      },
    },

    // Rewards for math performance
    rewards: {
      correctAnswer: {
        energyRestore: 20,
        shieldBoost: 10,
        scoreMultiplier: 1.2,
      },
      perfectWave: {
        energyRestore: 50,
        shieldBoost: 25,
        specialAbilityCharge: 50,
        scoreMultiplier: 2.0,
      },
    },
  },

  // === VISUAL EFFECTS ===
  effects: {
    damageNumbers: {
      fontSize: '18px',
      fontFamily: 'Courier, monospace',
      colors: {
        normal: '#ffffff',
        critical: '#ff0000',
        heal: '#00ff00',
        shield: '#4444ff',
      },
      animation: {
        duration: 1500,
        riseDistance: 50,
        fadeDelay: 500,
      },
    },

    camera: {
      shakeIntensity: {
        light: 0.005,
        medium: 0.01,
        heavy: 0.02,
      },
      shakeDuration: {
        light: 100,
        medium: 200,
        heavy: 400,
      },
      flashDuration: 200,
    },

    particles: {
      poolSize: 100,
      maxActiveParticles: 50,
      defaultLifetime: 2000,
    },
  },

  // === PERFORMANCE SETTINGS ===
  performance: {
    maxEnemies: 8,
    maxProjectiles: 20,
    maxParticles: 50,
    uiUpdateThrottle: 100, // milliseconds
    aiUpdateInterval: 100, // milliseconds
    poolSizes: {
      bullets: 50,
      particles: 100,
      damageNumbers: 20,
      enemies: 10,
    },
  },

  // === CHARACTER GENERATION ===
  characterGeneration: {
    preGenerationEnabled: true,
    cacheSize: 20,
    fallbackEnabled: true,
    qualityLevels: {
      high: { resolution: 64, effects: true, animations: true },
      medium: { resolution: 48, effects: true, animations: false },
      low: { resolution: 32, effects: false, animations: false },
    },

    templates: {
      aria: {
        baseModel: 'humanoid',
        colorScheme: 'blue_tech',
        armorStyle: 'light',
        weaponMount: 'dual_arm',
        decals: ['energy_lines', 'tech_symbols'],
      },
      titan: {
        baseModel: 'heavy_mech',
        colorScheme: 'red_military',
        armorStyle: 'heavy',
        weaponMount: 'shoulder_cannon',
        decals: ['armor_plating', 'warning_stripes'],
      },
      nexus: {
        baseModel: 'sleek_android',
        colorScheme: 'green_matrix',
        armorStyle: 'medium',
        weaponMount: 'integrated',
        decals: ['circuit_patterns', 'data_streams'],
      },
    },
  },

  // === UI CONFIGURATION ===
  ui: {
    colors: {
      primary: 0x00ffff,
      secondary: 0xff00ff,
      success: 0x00ff00,
      warning: 0xffff00,
      danger: 0xff0000,
      background: 0x1a0033,
      panel: 0x000000,
    },

    fonts: {
      primary: 'Courier, monospace',
      secondary: 'Arial, sans-serif',
      sizes: {
        small: '12px',
        medium: '16px',
        large: '24px',
        xlarge: '36px',
      },
    },

    animations: {
      fadeIn: { duration: 300, ease: 'Power2.easeOut' },
      fadeOut: { duration: 200, ease: 'Power2.easeIn' },
      scaleUp: { duration: 200, ease: 'Back.easeOut' },
      scaleDown: { duration: 150, ease: 'Power2.easeIn' },
    },
  },

  // === AUDIO CONFIGURATION ===
  audio: {
    enabled: true,
    volumes: {
      master: 0.7,
      sfx: 0.8,
      music: 0.6,
      ui: 0.5,
    },

    sounds: {
      weaponFire: { volume: 0.3, variations: 3 },
      enemyHit: { volume: 0.4, variations: 2 },
      playerHit: { volume: 0.6, variations: 1 },
      abilityActivate: { volume: 0.5, variations: 1 },
      mathCorrect: { volume: 0.4, variations: 2 },
      mathIncorrect: { volume: 0.3, variations: 1 },
      waveComplete: { volume: 0.6, variations: 1 },
    },
  },
};

// === UTILITY FUNCTIONS ===
export const GameConfigUtils = {
  /**
   * Get scaled enemy stats based on difficulty
   */
  getEnemyStats(enemyType, difficulty) {
    const baseStats = GameConfig.enemies[enemyType];
    if (!baseStats) return null;

    return {
      ...baseStats,
      health: GameConfig.difficulty.scaling.enemyHealth(
        baseStats.baseHealth,
        difficulty
      ),
      damage: GameConfig.difficulty.scaling.enemyDamage(
        baseStats.baseDamage,
        difficulty
      ),
      speed: GameConfig.difficulty.scaling.enemySpeed(
        baseStats.baseSpeed,
        difficulty
      ),
    };
  },

  /**
   * Get spawn interval based on difficulty
   */
  getSpawnInterval(baseInterval, difficulty) {
    return GameConfig.difficulty.scaling.spawnInterval(
      baseInterval,
      difficulty
    );
  },

  /**
   * Get current wave difficulty
   */
  getWaveDifficulty(waveNumber) {
    return Math.min(
      GameConfig.difficulty.maxDifficulty,
      GameConfig.difficulty.base +
        waveNumber * GameConfig.difficulty.increasePerWave
    );
  },

  /**
   * Get weapon stats with any active modifiers
   */
  getWeaponStats(weaponType, modifiers = {}) {
    const baseStats = GameConfig.weapons[weaponType];
    if (!baseStats) return null;

    return {
      ...baseStats,
      damage: baseStats.damage * (modifiers.damageMultiplier || 1),
      fireRate: baseStats.fireRate / (modifiers.fireRateMultiplier || 1),
    };
  },

  /**
   * Calculate math performance rewards
   */
  calculateMathRewards(correctAnswers, totalQuestions) {
    const accuracy = correctAnswers / totalQuestions;
    const config = GameConfig.math.rewards;

    if (accuracy === 1.0) {
      return config.perfectWave;
    }
    if (accuracy >= 0.8) {
      return config.correctAnswer;
    }
    return {
      energyRestore: config.correctAnswer.energyRestore * accuracy,
      shieldBoost: config.correctAnswer.shieldBoost * accuracy,
      scoreMultiplier: 1.0 + accuracy * 0.5,
    };
  },
};
