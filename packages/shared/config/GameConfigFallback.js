/**
 * GameConfig Fallback System
 * Provides safe default values when main GameConfig fails to load
 */

export const GameConfigFallback = {
  // === CORE GAME SETTINGS ===
  arena: {
    width: 800,
    height: 600,
    centerOffset: { x: 112, y: 84 },
  },

  // === TIMING & PHASES ===
  timing: {
    totalGameTime: 180,
    waveCount: 6,
    waveDuration: 30,
    mathQuizDuration: 15,
    comboDecayTime: 3000,
    weaponSwitchCooldown: 500,
  },

  // === DIFFICULTY SCALING ===
  difficulty: {
    base: 1.0,
    maxDifficulty: 3.0,
    increasePerWave: 0.2,
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

  // === PLAYER CONFIGURATION ===
  player: {
    baseHealth: 100,
    baseShield: 50,
    baseEnergy: 100,
    energyRegenRate: 2,
    shieldRegenRate: 1,
    shieldRegenDelay: 3000,
    size: { width: 40, height: 40 },
    speed: 200,
    color: 0x00aaff,
  },

  // === MATH INTEGRATION ===
  math: {
    mathGauge: {
      maxValue: 100,
      correctAnswerValue: 20,
      incorrectAnswerPenalty: -10,
      abilityUnlockThreshold: 80,
      comboBoostThreshold: 60,
    },
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
    uiUpdateThrottle: 100,
    aiUpdateInterval: 100,
    poolSizes: {
      bullets: 50,
      particles: 100,
      damageNumbers: 20,
      enemies: 10,
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

  // === WEAPONS ===
  weapons: {
    rapidFire: {
      damage: 20,
      fireRate: 200,
      range: 400,
      projectileSpeed: 500,
      energyCost: 5,
      accuracy: 0.95,
      icon: '🔫',
      color: 0x00ff88,
    },
  },

  // === ABILITIES ===
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
      mathCorrect: { volume: 0.4, variations: 2 },
      mathIncorrect: { volume: 0.3, variations: 1 },
    },
  },
};

/**
 * Safely merge GameConfig with fallback values
 */
export function createSafeGameConfig(gameConfig) {
  function deepMerge(target, source) {
    const result = { ...target };

    for (const key in source) {
      if (
        source[key] &&
        typeof source[key] === 'object' &&
        !Array.isArray(source[key])
      ) {
        result[key] = deepMerge(target[key] || {}, source[key]);
      } else if (source[key] !== undefined) {
        result[key] = source[key];
      }
    }

    return result;
  }

  try {
    if (!gameConfig) {
      console.warn('GameConfig is null/undefined, using fallback');
      return GameConfigFallback;
    }

    return deepMerge(GameConfigFallback, gameConfig);
  } catch (error) {
    console.error('Error merging GameConfig, using fallback:', error);
    return GameConfigFallback;
  }
}

/**
 * Fallback utility functions
 */
export const GameConfigUtilsFallback = {
  getEnemyStats(enemyType, difficulty) {
    return {
      health: 50 * difficulty,
      damage: 20 * difficulty,
      speed: 100,
      points: 100,
    };
  },

  getSpawnInterval(baseInterval, difficulty) {
    return baseInterval / difficulty ** 0.8;
  },

  getWaveDifficulty(waveNumber) {
    return Math.min(3.0, 1.0 + waveNumber * 0.2);
  },

  getWeaponStats(weaponType, modifiers = {}) {
    return {
      damage: 20 * (modifiers.damageMultiplier || 1),
      fireRate: 200 / (modifiers.fireRateMultiplier || 1),
      range: 400,
      projectileSpeed: 500,
      color: 0x00ff88,
    };
  },

  calculateMathRewards(correctAnswers, totalQuestions) {
    const accuracy = correctAnswers / totalQuestions;
    return {
      energyRestore: 20 * accuracy,
      shieldBoost: 10 * accuracy,
      scoreMultiplier: 1.0 + accuracy * 0.5,
    };
  },
};
