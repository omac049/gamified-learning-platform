export class PowerUpManager {
  constructor(progressTracker) {
    this.progressTracker = progressTracker;
    this.activePowerUps = new Map();
    this.cooldowns = new Map();

    // Power-up definitions
    this.powerUps = {
      // Universal Power-ups
      timeFreeze: {
        id: 'timeFreeze',
        name: 'Time Freeze',
        icon: '⏰',
        description: 'Stops the timer for 30 seconds',
        duration: 30000,
        cooldown: 120000,
        cost: 50,
        rarity: 'common',
        effect: { type: 'time', value: 'freeze' },
      },
      doubleCoins: {
        id: 'doubleCoins',
        name: 'Double Coins',
        icon: '🪙',
        description: 'Double coin rewards for 60 seconds',
        duration: 60000,
        cooldown: 180000,
        cost: 75,
        rarity: 'common',
        effect: { type: 'coins', multiplier: 2.0 },
      },
      shield: {
        id: 'shield',
        name: 'Protection Shield',
        icon: '🛡️',
        description: 'Protects from next wrong answer',
        duration: -1, // Until used
        cooldown: 90000,
        cost: 40,
        rarity: 'common',
        effect: { type: 'protection', value: 1 },
      },
      hint: {
        id: 'hint',
        name: 'Smart Hint',
        icon: '💡',
        description: 'Reveals a helpful hint for current question',
        duration: 0, // Instant
        cooldown: 60000,
        cost: 25,
        rarity: 'common',
        effect: { type: 'hint', value: true },
      },

      // Scholar Hero Abilities
      studyBoost: {
        id: 'studyBoost',
        name: 'Study Boost',
        icon: '📚',
        description: 'Increases reading comprehension rewards by 50%',
        duration: 120000,
        cooldown: 300000,
        cost: 100,
        rarity: 'rare',
        characterType: 'scholar',
        effect: { type: 'subject_bonus', subject: 'reading', multiplier: 1.5 },
      },
      focusEnhancement: {
        id: 'focusEnhancement',
        name: 'Focus Enhancement',
        icon: '🎯',
        description: 'Reduces question timer pressure and increases accuracy',
        duration: 90000,
        cooldown: 240000,
        cost: 80,
        rarity: 'uncommon',
        characterType: 'scholar',
        effect: { type: 'focus', timeBonus: 1.5, accuracyBonus: 0.1 },
      },

      // Mystic Companion Abilities
      spellWeaving: {
        id: 'spellWeaving',
        name: 'Spell Weaving',
        icon: '🔮',
        description: 'Magical insight reveals answer patterns',
        duration: 45000,
        cooldown: 200000,
        cost: 120,
        rarity: 'rare',
        characterType: 'mystic',
        effect: { type: 'pattern_reveal', value: true },
      },
      elementalMastery: {
        id: 'elementalMastery',
        name: 'Elemental Mastery',
        icon: '⚡',
        description: 'Science questions become easier and more rewarding',
        duration: 180000,
        cooldown: 360000,
        cost: 150,
        rarity: 'epic',
        characterType: 'mystic',
        effect: {
          type: 'subject_mastery',
          subject: 'science',
          difficultyReduction: 1,
          rewardMultiplier: 2.0,
        },
      },

      // Tech Bot Abilities
      dataAnalysis: {
        id: 'dataAnalysis',
        name: 'Data Analysis',
        icon: '🤖',
        description: 'Analyzes question patterns for strategic advantages',
        duration: 60000,
        cooldown: 180000,
        cost: 90,
        rarity: 'uncommon',
        characterType: 'techbot',
        effect: { type: 'analysis', showStats: true, optimizeStrategy: true },
      },
      systemOptimization: {
        id: 'systemOptimization',
        name: 'System Optimization',
        icon: '⚙️',
        description: 'Optimizes all game systems for maximum efficiency',
        duration: 300000,
        cooldown: 600000,
        cost: 200,
        rarity: 'legendary',
        characterType: 'techbot',
        effect: { type: 'optimization', allBonuses: 1.25, efficiency: 1.5 },
      },
    };

    // Rarity colors for UI
    this.rarityColors = {
      common: 0x9ca3af,
      uncommon: 0x10b981,
      rare: 0x3b82f6,
      epic: 0x8b5cf6,
      legendary: 0xf59e0b,
    };
  }

  // Get available power-ups for character
  getAvailablePowerUps() {
    const characterType = this.progressTracker.getCharacterType();
    const available = [];

    Object.values(this.powerUps).forEach(powerUp => {
      // Check if power-up is available for character type
      if (
        !powerUp.characterType ||
        powerUp.characterType === characterType?.id
      ) {
        // Check if not on cooldown
        const lastUsed = this.cooldowns.get(powerUp.id) || 0;
        const canUse = Date.now() - lastUsed >= powerUp.cooldown;

        available.push({
          ...powerUp,
          canUse,
          cooldownRemaining: canUse
            ? 0
            : powerUp.cooldown - (Date.now() - lastUsed),
          owned:
            this.progressTracker.progress.inventory.powerUps[powerUp.id] || 0,
        });
      }
    });

    return available.sort((a, b) => {
      // Sort by rarity, then by availability
      const rarityOrder = {
        common: 1,
        uncommon: 2,
        rare: 3,
        epic: 4,
        legendary: 5,
      };
      if (rarityOrder[a.rarity] !== rarityOrder[b.rarity]) {
        return rarityOrder[a.rarity] - rarityOrder[b.rarity];
      }
      return b.canUse - a.canUse;
    });
  }

  // Activate a power-up
  activatePowerUp(powerUpId) {
    const powerUp = this.powerUps[powerUpId];
    if (!powerUp) return { success: false, message: 'Power-up not found' };

    // Check if player owns this power-up
    const owned =
      this.progressTracker.progress.inventory.powerUps[powerUpId] || 0;
    if (owned <= 0) {
      return { success: false, message: "You don't own this power-up" };
    }

    // Check cooldown
    const lastUsed = this.cooldowns.get(powerUpId) || 0;
    if (Date.now() - lastUsed < powerUp.cooldown) {
      const remaining = Math.ceil(
        (powerUp.cooldown - (Date.now() - lastUsed)) / 1000
      );
      return { success: false, message: `Cooldown: ${remaining}s remaining` };
    }

    // Activate power-up
    const activation = {
      id: powerUpId,
      startTime: Date.now(),
      endTime: powerUp.duration > 0 ? Date.now() + powerUp.duration : -1,
      effect: powerUp.effect,
      powerUp,
    };

    this.activePowerUps.set(powerUpId, activation);
    this.cooldowns.set(powerUpId, Date.now());

    // Consume power-up from inventory
    this.progressTracker.progress.inventory.powerUps[powerUpId]--;

    // Save progress
    this.progressTracker.saveProgress();

    return {
      success: true,
      message: `${powerUp.name} activated!`,
      activation,
    };
  }

  // Check if power-up is active
  isPowerUpActive(powerUpId) {
    const activation = this.activePowerUps.get(powerUpId);
    if (!activation) return false;

    // Check if duration-based power-up has expired
    if (activation.endTime > 0 && Date.now() > activation.endTime) {
      this.activePowerUps.delete(powerUpId);
      return false;
    }

    return true;
  }

  // Get active power-up effects
  getActiveEffects() {
    const effects = {
      timeMultiplier: 1.0,
      coinMultiplier: 1.0,
      experienceMultiplier: 1.0,
      protection: 0,
      hints: false,
      subjectBonuses: {},
      specialEffects: [],
    };

    this.activePowerUps.forEach((activation, powerUpId) => {
      if (this.isPowerUpActive(powerUpId)) {
        const { effect } = activation;

        switch (effect.type) {
          case 'time':
            if (effect.value === 'freeze') {
              effects.timeMultiplier = 0;
            }
            break;
          case 'coins':
            effects.coinMultiplier *= effect.multiplier;
            break;
          case 'protection':
            effects.protection += effect.value;
            break;
          case 'hint':
            effects.hints = true;
            break;
          case 'subject_bonus':
            effects.subjectBonuses[effect.subject] = effect.multiplier;
            break;
          case 'focus':
            effects.timeMultiplier *= effect.timeBonus;
            effects.specialEffects.push('focus');
            break;
          case 'optimization':
            effects.coinMultiplier *= effect.allBonuses;
            effects.experienceMultiplier *= effect.allBonuses;
            effects.specialEffects.push('optimized');
            break;
        }
      }
    });

    return effects;
  }

  // Use protection (called when wrong answer)
  useProtection() {
    // Find active shield power-up
    for (const [powerUpId, activation] of this.activePowerUps) {
      if (
        activation.effect.type === 'protection' &&
        this.isPowerUpActive(powerUpId)
      ) {
        this.activePowerUps.delete(powerUpId);
        return true;
      }
    }
    return false;
  }

  // Calculate enhanced rewards
  calculateEnhancedRewards(baseRewards, subject) {
    const effects = this.getActiveEffects();
    const enhancedRewards = { ...baseRewards };

    // Apply coin multiplier
    enhancedRewards.coins = Math.floor(
      enhancedRewards.coins * effects.coinMultiplier
    );

    // Apply experience multiplier
    enhancedRewards.experience = Math.floor(
      enhancedRewards.experience * effects.experienceMultiplier
    );

    // Apply subject-specific bonuses
    if (effects.subjectBonuses[subject]) {
      enhancedRewards.coins = Math.floor(
        enhancedRewards.coins * effects.subjectBonuses[subject]
      );
      enhancedRewards.experience = Math.floor(
        enhancedRewards.experience * effects.subjectBonuses[subject]
      );
    }

    // Add power-up bonus indicator
    enhancedRewards.powerUpBonus =
      effects.coinMultiplier > 1.0 || effects.experienceMultiplier > 1.0;
    enhancedRewards.activeEffects = effects.specialEffects;

    return enhancedRewards;
  }

  // Get power-up status for UI
  getPowerUpStatus() {
    const active = [];
    const available = this.getAvailablePowerUps().filter(
      p => p.canUse && p.owned > 0
    );

    this.activePowerUps.forEach((activation, powerUpId) => {
      if (this.isPowerUpActive(powerUpId)) {
        const remaining =
          activation.endTime > 0
            ? Math.max(0, activation.endTime - Date.now())
            : -1;

        active.push({
          id: powerUpId,
          name: activation.powerUp.name,
          icon: activation.powerUp.icon,
          timeRemaining: remaining,
          effect: activation.effect,
        });
      }
    });

    return { active, available };
  }

  // Purchase power-up from shop
  purchasePowerUp(powerUpId, quantity = 1) {
    const powerUp = this.powerUps[powerUpId];
    if (!powerUp) return { success: false, message: 'Power-up not found' };

    const totalCost = powerUp.cost * quantity;
    if (this.progressTracker.getCoinBalance() < totalCost) {
      return { success: false, message: 'Insufficient coins' };
    }

    // Check character compatibility
    const characterType = this.progressTracker.getCharacterType();
    if (powerUp.characterType && powerUp.characterType !== characterType?.id) {
      return { success: false, message: 'Not compatible with your character' };
    }

    // Purchase power-up
    this.progressTracker.spendCoins(totalCost);

    if (!this.progressTracker.progress.inventory.powerUps[powerUpId]) {
      this.progressTracker.progress.inventory.powerUps[powerUpId] = 0;
    }
    this.progressTracker.progress.inventory.powerUps[powerUpId] += quantity;

    this.progressTracker.saveProgress();

    return {
      success: true,
      message: `Purchased ${quantity}x ${powerUp.name}`,
      newBalance: this.progressTracker.getCoinBalance(),
    };
  }

  // Get random power-up reward
  getRandomPowerUpReward(rarity = 'common') {
    const availablePowerUps = Object.values(this.powerUps).filter(
      p => p.rarity === rarity
    );
    if (availablePowerUps.length === 0) return null;

    const randomPowerUp =
      availablePowerUps[Math.floor(Math.random() * availablePowerUps.length)];

    // Add to inventory
    if (!this.progressTracker.progress.inventory.powerUps[randomPowerUp.id]) {
      this.progressTracker.progress.inventory.powerUps[randomPowerUp.id] = 0;
    }
    this.progressTracker.progress.inventory.powerUps[randomPowerUp.id]++;

    return randomPowerUp;
  }

  // Clean up expired power-ups
  cleanupExpiredPowerUps() {
    const now = Date.now();
    const toRemove = [];

    this.activePowerUps.forEach((activation, powerUpId) => {
      if (activation.endTime > 0 && now > activation.endTime) {
        toRemove.push(powerUpId);
      }
    });

    toRemove.forEach(powerUpId => {
      this.activePowerUps.delete(powerUpId);
    });
  }

  // Get power-up recommendations based on performance
  getRecommendations(sessionData) {
    const recommendations = [];
    const characterType = this.progressTracker.getCharacterType();

    // Struggling with time
    if (sessionData.averageResponseTime > 20) {
      recommendations.push({
        powerUpId: 'timeFreeze',
        reason: 'You seem to need more time to think',
        priority: 'high',
      });
    }

    // Low accuracy
    if (sessionData.accuracy < 60) {
      recommendations.push({
        powerUpId: 'hint',
        reason: 'Hints could help improve your accuracy',
        priority: 'high',
      });
    }

    // Character-specific recommendations
    if (characterType) {
      const characterPowerUps = Object.values(this.powerUps).filter(
        p => p.characterType === characterType.id
      );

      if (characterPowerUps.length > 0) {
        recommendations.push({
          powerUpId: characterPowerUps[0].id,
          reason: `Perfect for your ${characterType.name} abilities`,
          priority: 'medium',
        });
      }
    }

    return recommendations;
  }
}
