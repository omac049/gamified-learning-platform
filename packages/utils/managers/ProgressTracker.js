import { SaveManager } from './SaveManager.js';

export class ProgressTracker {
  constructor() {
    this.saveManager = new SaveManager();
    this.progress = this.loadProgress();

    // Character type definitions for bonuses and upgrades
    this.characterTypes = {
      aria: {
        id: 'aria',
        name: 'ARIA',
        icon: '🤖',
        baseColor: 0x3b82f6,
        accentColor: 0x00ffff,
        bonusMultipliers: {
          reading: 1.3,
          analysis: 1.25,
          efficiency: 1.2,
          coins: 1.1,
        },
        specialAbilities: [
          'Neural Override',
          'Cyber Analysis',
          'Data Processing',
        ],
      },
      titan: {
        id: 'titan',
        name: 'TITAN',
        icon: '🤖',
        baseColor: 0xef4444,
        accentColor: 0xffa500,
        bonusMultipliers: {
          math: 1.3,
          defense: 1.35,
          courage: 1.25,
          coins: 1.1,
        },
        specialAbilities: [
          'Berserker Mode',
          'Heavy Assault',
          'Defensive Matrix',
        ],
      },
      nexus: {
        id: 'nexus',
        name: 'NEXUS',
        icon: '🤖',
        baseColor: 0x10b981,
        accentColor: 0xfbbf24,
        bonusMultipliers: {
          science: 1.35,
          technology: 1.3,
          innovation: 1.25,
          coins: 1.1,
        },
        specialAbilities: [
          'Quantum Sync',
          'Tech Innovation',
          'System Analysis',
        ],
      },
    };

    // Enable auto-save
    this.saveManager.enableAutoSave(this, 30000); // Auto-save every 30 seconds
  }

  // Load progress from SaveManager (cookies + localStorage)
  loadProgress() {
    const savedData = this.saveManager.loadData();

    if (savedData) {
      console.log(
        'ProgressTracker: Loaded existing progress for',
        savedData.character?.name || 'Unknown Player'
      );

      // Migrate old save data to include new properties
      this.migrateProgressData(savedData);

      return savedData;
    }

    // Return default progress structure for new players
    console.log('ProgressTracker: Creating new progress data');
    return this.getDefaultProgress();
  }

  // Migrate old save data to include new properties
  migrateProgressData(data) {
    // Ensure characterProgression exists
    if (!data.characterProgression) {
      data.characterProgression = {
        level: 1,
        experience: 0,
        upgradesUnlocked: [],
        specialAbilitiesUsed: 0,
      };
      console.log(
        'ProgressTracker: Migrated save data to include characterProgression'
      );
    }

    // Fix character type field if missing
    if (data.character && !data.character.type) {
      // Try to infer type from character name or default to 'titan'
      const characterName = data.character.name?.toLowerCase() || '';
      if (
        characterName.includes('aria') ||
        data.character.typeName === 'ARIA'
      ) {
        data.character.type = 'aria';
      } else if (
        characterName.includes('nexus') ||
        data.character.typeName === 'NEXUS'
      ) {
        data.character.type = 'nexus';
      } else {
        data.character.type = 'titan'; // Default fallback
      }
      console.log(
        `ProgressTracker: Migrated character type to '${data.character.type}'`
      );
    }

    // Ensure sessionStats exists
    if (!data.sessionStats) {
      data.sessionStats = {
        questionsAnswered: 0,
        correctAnswers: 0,
        timeSpent: 0,
      };
    }

    // Ensure inventory exists
    if (!data.inventory) {
      data.inventory = {
        powerUps: {},
        cosmetics: {},
        tools: {},
        decorations: {},
      };
    }

    // Ensure achievements array exists
    if (!data.achievements) {
      data.achievements = [];
    }

    // Ensure subjectStats exists
    if (!data.subjectStats) {
      data.subjectStats = {
        math: { correct: 0, total: 0 },
        reading: { correct: 0, total: 0 },
        science: { correct: 0, total: 0 },
        history: { correct: 0, total: 0 },
      };
      console.log(
        'ProgressTracker: Migrated save data to include subjectStats'
      );
    }

    // Ensure subjectAccuracies exists
    if (!data.subjectAccuracies) {
      data.subjectAccuracies = {
        math: 0,
        reading: 0,
        science: 0,
        history: 0,
      };
      console.log(
        'ProgressTracker: Migrated save data to include subjectAccuracies'
      );
    }

    // Ensure equippedItems exists
    if (!data.equippedItems) {
      data.equippedItems = {
        cosmetic: null,
        powerUp: null,
        tool: null,
        decoration: null,
      };
    }

    // Ensure dailyRewards exists
    if (!data.dailyRewards) {
      data.dailyRewards = {
        lastClaimed: null,
        streak: 0,
      };
    }

    // Ensure basic properties exist
    if (typeof data.coinBalance !== 'number') {
      data.coinBalance = 100;
    }
    if (typeof data.totalCoinsEarned !== 'number') {
      data.totalCoinsEarned = data.coinBalance;
    }
    if (!Array.isArray(data.weeksCompleted)) {
      data.weeksCompleted = [];
    }
    if (typeof data.badges !== 'number') {
      data.badges = 0;
    }
    if (typeof data.totalScore !== 'number') {
      data.totalScore = 0;
    }
    if (typeof data.experienceMultiplier !== 'number') {
      data.experienceMultiplier = 1.0;
    }
  }

  // Get default progress structure
  getDefaultProgress() {
    return {
      character: null, // Will be set during character creation
      playerName: 'Young Scholar',
      totalScore: 0,
      weeksCompleted: [],
      badges: 0,
      coinBalance: 100,
      totalCoinsEarned: 100,
      experienceMultiplier: 1.0,
      subjectAccuracies: {
        math: 0,
        reading: 0,
        science: 0,
        history: 0,
      },
      subjectStats: {
        math: { correct: 0, total: 0 },
        reading: { correct: 0, total: 0 },
        science: { correct: 0, total: 0 },
        history: { correct: 0, total: 0 },
      },
      equippedItems: {
        cosmetic: null,
        powerUp: null,
        tool: null,
        decoration: null,
      },
      inventory: {
        powerUps: {},
        cosmetics: {},
        tools: {},
        decorations: {},
      },
      dailyRewards: {
        lastClaimed: null,
        streak: 0,
      },
      achievements: [],
      sessionStats: {
        questionsAnswered: 0,
        correctAnswers: 0,
        timeSpent: 0,
      },
      characterProgression: {
        level: 1,
        experience: 0,
        upgradesUnlocked: [],
        specialAbilitiesUsed: 0,
      },
    };
  }

  // Save progress using SaveManager
  saveProgress() {
    return this.saveManager.saveData(this.progress);
  }

  // Get all data for saving
  getAllData() {
    return this.progress;
  }

  // Check if player has existing save data
  hasExistingSave() {
    return this.saveManager.hasSaveData();
  }

  // Get save info without loading full data
  getSaveInfo() {
    return this.saveManager.getSaveInfo();
  }

  // Enhanced character management
  setCharacter(characterData) {
    this.progress.character = {
      ...characterData,
      level: 1,
      experience: 0,
      upgradesUnlocked: [],
      createdAt: Date.now(),
    };
    this.progress.playerName = characterData.name;

    // Apply character-specific starting bonuses
    this.applyCharacterStartingBonuses(characterData);

    this.saveProgress();
  }

  applyCharacterStartingBonuses(characterData) {
    const charType = this.characterTypes[characterData.type];
    if (!charType) return;

    // Apply character type bonuses
    if (charType.bonusMultipliers.coins) {
      this.progress.coinBalance = Math.floor(
        this.progress.coinBalance * charType.bonusMultipliers.coins
      );
      this.progress.totalCoinsEarned = this.progress.coinBalance;
    }

    // Set character-specific experience multiplier
    if (charType.bonusMultipliers.experience) {
      this.progress.experienceMultiplier *=
        charType.bonusMultipliers.experience;
    }

    console.log(`ProgressTracker: Applied ${charType.name} starting bonuses`);
  }

  getCharacter() {
    return this.progress.character;
  }

  getCharacterType() {
    if (!this.progress.character?.type) return null;
    return this.characterTypes[this.progress.character.type];
  }

  // Get the raw character type string (aria, titan, nexus)
  getCharacterTypeId() {
    return this.progress.character?.type || null;
  }

  getPlayerName() {
    return (
      this.progress.character?.name ||
      this.progress.playerName ||
      'Young Scholar'
    );
  }

  // Enhanced coin management with character bonuses
  getCoinBalance() {
    return this.progress.coinBalance || 0;
  }

  awardCoins(amount, reason = 'Achievement') {
    // Apply experience multiplier and character bonuses
    let multiplier = this.progress.experienceMultiplier || 1.0;

    // Apply character-specific coin bonuses
    const charType = this.getCharacterType();
    if (charType?.bonusMultipliers?.coins) {
      multiplier *= charType.bonusMultipliers.coins;
    }

    const finalAmount = Math.floor(amount * multiplier);

    this.progress.coinBalance += finalAmount;
    this.progress.totalCoinsEarned += finalAmount;

    // Award character experience for earning coins
    this.awardCharacterExperience(Math.floor(finalAmount / 10));

    console.log(
      `ProgressTracker: Awarded ${finalAmount} coins for ${reason} (${multiplier.toFixed(2)}x multiplier)`
    );
    this.saveProgress();
    return finalAmount;
  }

  spendCoins(amount) {
    if (this.progress.coinBalance >= amount) {
      this.progress.coinBalance -= amount;
      this.saveProgress();
      return true;
    }
    return false;
  }

  // Character progression system
  awardCharacterExperience(amount) {
    if (!this.progress.character) return;

    // Ensure characterProgression exists
    if (!this.progress.characterProgression) {
      this.progress.characterProgression = {
        level: 1,
        experience: 0,
        upgradesUnlocked: [],
        specialAbilitiesUsed: 0,
      };
    }

    const charType = this.getCharacterType();
    let expMultiplier = 1.0;

    if (charType?.bonusMultipliers?.experience) {
      expMultiplier = charType.bonusMultipliers.experience;
    }

    const finalExp = Math.floor(amount * expMultiplier);
    this.progress.characterProgression.experience += finalExp;

    // Check for level up
    this.checkCharacterLevelUp();

    console.log(`ProgressTracker: Awarded ${finalExp} character experience`);
  }

  checkCharacterLevelUp() {
    // Ensure characterProgression exists
    if (!this.progress.characterProgression) {
      this.progress.characterProgression = {
        level: 1,
        experience: 0,
        upgradesUnlocked: [],
        specialAbilitiesUsed: 0,
      };
    }

    const currentLevel = this.progress.characterProgression.level;
    const currentExp = this.progress.characterProgression.experience;
    const expNeeded = this.getExpNeededForLevel(currentLevel + 1);

    if (currentExp >= expNeeded) {
      this.progress.characterProgression.level++;
      this.progress.characterProgression.experience -= expNeeded;

      // Award level up bonus (prevent infinite recursion by calling spendCoins directly)
      this.progress.coinBalance +=
        50 * this.progress.characterProgression.level;
      this.progress.totalCoinsEarned +=
        50 * this.progress.characterProgression.level;

      console.log(
        `ProgressTracker: Character leveled up to ${this.progress.characterProgression.level}!`
      );
      return true;
    }
    return false;
  }

  getExpNeededForLevel(level) {
    return Math.floor(100 * 1.5 ** (level - 1));
  }

  getCharacterLevel() {
    return this.progress.characterProgression?.level || 1;
  }

  getCharacterExperience() {
    return this.progress.characterProgression?.experience || 0;
  }

  // Enhanced progress tracking with character bonuses
  recordAnswer(subject, isCorrect, timeSpent = 0, difficulty = 'medium') {
    if (!this.progress.subjectStats[subject]) {
      this.progress.subjectStats[subject] = { correct: 0, total: 0 };
    }

    this.progress.subjectStats[subject].total++;
    this.progress.sessionStats.questionsAnswered++;

    if (isCorrect) {
      this.progress.subjectStats[subject].correct++;
      this.progress.sessionStats.correctAnswers++;

      // Calculate coin reward with character bonuses
      const coinReward = this.calculateCoinReward(
        subject,
        difficulty,
        timeSpent
      );
      this.awardCoins(coinReward, `Correct ${subject} answer`);

      // Award character experience
      this.awardCharacterExperience(
        this.calculateExperienceReward(subject, difficulty)
      );
    }

    // Update accuracy
    this.updateAccuracies();
    this.saveProgress();
  }

  calculateCoinReward(subject, difficulty, timeSpent) {
    let baseReward = 5;

    switch (difficulty) {
      case 'easy':
        baseReward = 3;
        break;
      case 'medium':
        baseReward = 5;
        break;
      case 'hard':
        baseReward = 8;
        break;
    }

    // Time bonus (faster answers get slight bonus)
    if (timeSpent > 0 && timeSpent < 10000) {
      // Less than 10 seconds
      baseReward += 2;
    }

    // Apply character-specific subject bonuses
    const charType = this.getCharacterType();
    if (charType?.bonusMultipliers?.[subject]) {
      baseReward = Math.floor(baseReward * charType.bonusMultipliers[subject]);
    }

    return baseReward;
  }

  calculateExperienceReward(subject, difficulty) {
    let baseExp = 10;

    switch (difficulty) {
      case 'easy':
        baseExp = 8;
        break;
      case 'medium':
        baseExp = 10;
        break;
      case 'hard':
        baseExp = 15;
        break;
    }

    return baseExp;
  }

  updateAccuracies() {
    // Ensure both subjectStats and subjectAccuracies exist
    if (
      !this.progress.subjectStats ||
      typeof this.progress.subjectStats !== 'object'
    ) {
      return;
    }
    if (
      !this.progress.subjectAccuracies ||
      typeof this.progress.subjectAccuracies !== 'object'
    ) {
      this.progress.subjectAccuracies = {
        math: 0,
        reading: 0,
        science: 0,
        history: 0,
      };
    }

    Object.keys(this.progress.subjectStats).forEach(subject => {
      const stats = this.progress.subjectStats[subject];
      if (stats && typeof stats === 'object' && stats.total > 0) {
        this.progress.subjectAccuracies[subject] = Math.round(
          (stats.correct / stats.total) * 100
        );
      }
    });
  }

  getAccuracy(subject) {
    if (
      !this.progress.subjectAccuracies ||
      typeof this.progress.subjectAccuracies !== 'object'
    ) {
      return 0;
    }
    return this.progress.subjectAccuracies[subject] || 0;
  }

  getOverallAccuracy() {
    // Ensure subjectStats exists
    if (
      !this.progress.subjectStats ||
      typeof this.progress.subjectStats !== 'object'
    ) {
      return 0;
    }

    const subjects = Object.keys(this.progress.subjectStats);
    let totalCorrect = 0;
    let totalQuestions = 0;

    subjects.forEach(subject => {
      const stats = this.progress.subjectStats[subject];
      if (stats && typeof stats === 'object') {
        totalCorrect += stats.correct || 0;
        totalQuestions += stats.total || 0;
      }
    });

    return totalQuestions > 0
      ? Math.round((totalCorrect / totalQuestions) * 100)
      : 0;
  }

  // Enhanced week completion with character progression
  completeWeek(weekNumber) {
    if (!this.progress.weeksCompleted.includes(weekNumber)) {
      this.progress.weeksCompleted.push(weekNumber);
      this.progress.badges++;

      // Enhanced bonus coins for week completion
      const bonusCoins = 50 + weekNumber * 15; // Increasing bonus per week
      this.awardCoins(bonusCoins, `Week ${weekNumber} completion`);

      // Award significant character experience
      this.awardCharacterExperience(100 + weekNumber * 25);

      console.log(
        `ProgressTracker: Week ${weekNumber} completed! Awarded ${bonusCoins} bonus coins.`
      );
    }
    this.saveProgress();
  }

  isWeekUnlocked(weekNumber) {
    if (weekNumber === 1) return true;
    return this.progress.weeksCompleted.includes(weekNumber - 1);
  }

  // Enhanced equipment system with character-specific items
  getEquippedEffects() {
    const effects = {
      speedMultiplier: 1,
      jumpMultiplier: 1,
      scoreMultiplier: 1,
      extraTime: 0,
      shield: false,
      autoHint: false,
      coinMagnet: false,
    };

    const equipped = this.progress.equippedItems;
    const charType = this.getCharacterType();

    // Apply character-specific base bonuses
    if (charType) {
      if (charType.bonusMultipliers.efficiency) {
        effects.speedMultiplier *= charType.bonusMultipliers.efficiency;
      }
      if (charType.bonusMultipliers.analysis) {
        effects.scoreMultiplier *= charType.bonusMultipliers.analysis;
      }
    }

    // Apply tool effects
    switch (equipped.tool) {
      case 'speedBoost':
        effects.speedMultiplier *= 1.5;
        break;
      case 'jumpBoost':
        effects.jumpMultiplier *= 1.3;
        break;
      case 'scoreMultiplier':
        effects.scoreMultiplier *= 1.5;
        break;
      case 'coinMagnet':
        effects.coinMagnet = true;
        break;
      case 'autoHint':
        effects.autoHint = true;
        break;
    }

    // Apply power-up effects
    switch (equipped.powerUp) {
      case 'extraTime':
        effects.extraTime = 30;
        break;
      case 'shield':
        effects.shield = true;
        break;
      case 'slowMotion':
        effects.extraTime = 15;
        break;
    }

    return effects;
  }

  // Enhanced daily rewards with character bonuses
  claimDailyReward() {
    const now = new Date();
    const today = now.toDateString();
    const { lastClaimed } = this.progress.dailyRewards;

    if (lastClaimed === today) {
      return null; // Already claimed today
    }

    // Check if streak continues
    const yesterday = new Date(now);
    yesterday.setDate(yesterday.getDate() - 1);
    const wasYesterday = lastClaimed === yesterday.toDateString();

    if (wasYesterday) {
      this.progress.dailyRewards.streak++;
    } else if (lastClaimed !== null) {
      this.progress.dailyRewards.streak = 1; // Reset streak
    } else {
      this.progress.dailyRewards.streak = 1; // First time
    }

    this.progress.dailyRewards.lastClaimed = today;

    // Calculate reward based on streak and character bonuses
    const baseReward = 15;
    const streakBonus = Math.min(this.progress.dailyRewards.streak * 3, 30);
    const totalCoins = baseReward + streakBonus;

    this.awardCoins(totalCoins, 'Daily reward');

    // Award character experience for daily login
    this.awardCharacterExperience(20 + this.progress.dailyRewards.streak * 5);

    const reward = {
      coins: totalCoins,
      streak: this.progress.dailyRewards.streak,
      isNewRecord:
        this.progress.dailyRewards.streak >
        (this.progress.dailyRewards.maxStreak || 0),
    };

    if (reward.isNewRecord) {
      this.progress.dailyRewards.maxStreak = this.progress.dailyRewards.streak;
    }

    this.saveProgress();
    return reward;
  }

  // Enhanced progress summary with character info
  getProgressSummary() {
    const character = this.getCharacter();
    const charType = this.getCharacterType();

    // Add null checks to prevent errors
    const progress = this.progress || {};
    const characterProgression = progress.characterProgression || {};
    const dailyRewards = progress.dailyRewards || {};
    const subjectAccuracies = progress.subjectAccuracies || {};
    const equippedItems = progress.equippedItems || {};

    return {
      playerName: this.getPlayerName(),
      character,
      characterType: charType,
      characterLevel: this.getCharacterLevel(),
      characterExperience: this.getCharacterExperience(),
      expNeededForNextLevel: this.getExpNeededForLevel(
        this.getCharacterLevel() + 1
      ),
      totalScore: progress.totalScore || 0,
      weeksCompleted: progress.weeksCompleted || [],
      badges: progress.badges || 0,
      coinBalance: this.getCoinBalance(),
      totalCoinsEarned: progress.totalCoinsEarned || 0,
      overallAccuracy: this.getOverallAccuracy(),
      subjectAccuracies,
      currentStreak: dailyRewards.streak || 0,
      experienceMultiplier: progress.experienceMultiplier || 1.0,
      lastPlayed: this.saveManager.getSaveInfo()?.lastPlayed || 'Today',
      specialAbilitiesUsed: characterProgression.specialAbilitiesUsed || 0,
      equippedItems,
    };
  }

  // Enhanced shop integration with character-specific items
  purchaseItem(itemId, itemType, cost) {
    if (this.spendCoins(cost)) {
      // Handle armor upgrades separately
      if (itemType === 'armor') {
        return this.purchaseArmorUpgrade(itemId, cost);
      }

      if (!this.progress.inventory[`${itemType}s`]) {
        this.progress.inventory[`${itemType}s`] = {};
      }

      // Handle consumable items (power-ups) with quantities
      if (itemType === 'powerUp') {
        if (
          typeof this.progress.inventory[`${itemType}s`][itemId] === 'number'
        ) {
          this.progress.inventory[`${itemType}s`][itemId]++;
        } else {
          this.progress.inventory[`${itemType}s`][itemId] = 1;
        }
      } else {
        // Handle permanent items (cosmetics, tools, decorations)
        this.progress.inventory[`${itemType}s`][itemId] = true;

        // Auto-equip cosmetics and decorations
        if (itemType === 'cosmetic' || itemType === 'decoration') {
          this.progress.equippedItems[itemType] = itemId;
        }
      }

      // Award character experience for purchases
      this.awardCharacterExperience(Math.floor(cost / 10));

      this.saveProgress();
      return true;
    }
    return false;
  }

  // Armor upgrade system
  purchaseArmorUpgrade(armorId, cost) {
    if (!this.progress.armorUpgrades) {
      this.progress.armorUpgrades = {};
    }

    // Add armor to upgrades
    this.progress.armorUpgrades[armorId] = true;

    // Award character experience for armor purchases
    this.awardCharacterExperience(Math.floor(cost / 5)); // More XP for armor

    this.saveProgress();
    return true;
  }

  hasArmorUpgrade(armorId) {
    return !!(
      this.progress.armorUpgrades && this.progress.armorUpgrades[armorId]
    );
  }

  getArmorBonuses() {
    if (!this.progress.armorUpgrades) {
      return {};
    }

    const bonuses = {};

    // This would need to be populated with actual armor data
    // For now, return empty bonuses - this will be calculated in the shop scene
    return bonuses;
  }

  getEquippedArmorLevel(mechType, armorType) {
    if (!this.progress.armorUpgrades) {
      return 0;
    }

    let maxLevel = 0;
    Object.keys(this.progress.armorUpgrades).forEach(armorId => {
      if (
        this.progress.armorUpgrades[armorId] &&
        armorId.startsWith(`${mechType}_${armorType}_`)
      ) {
        const level = parseInt(armorId.split('_').pop()) || 1;
        maxLevel = Math.max(maxLevel, level);
      }
    });

    return maxLevel;
  }

  hasItem(itemId, itemType) {
    // Handle armor items separately
    if (itemType === 'armor') {
      return this.hasArmorUpgrade(itemId);
    }

    // Check if player owns a specific item
    if (!this.progress.inventory[`${itemType}s`]) {
      return false;
    }
    return !!this.progress.inventory[`${itemType}s`][itemId];
  }

  usePowerUp(itemId) {
    // Use a consumable power-up item
    if (
      !this.progress.inventory.powerUps ||
      !this.progress.inventory.powerUps[itemId]
    ) {
      return false;
    }

    // For consumable items, we need to track quantity
    if (typeof this.progress.inventory.powerUps[itemId] === 'number') {
      if (this.progress.inventory.powerUps[itemId] > 0) {
        this.progress.inventory.powerUps[itemId]--;
        // Equip the power-up for use
        this.progress.equippedItems.powerUp = itemId;
        this.saveProgress();
        return true;
      }
    } else if (this.progress.inventory.powerUps[itemId] === true) {
      // For non-consumable power-ups, just equip them
      this.progress.equippedItems.powerUp = itemId;
      this.saveProgress();
      return true;
    }

    return false;
  }

  getInventorySummary() {
    // Return a summary of all items in inventory
    const summary = {
      powerUps: {},
      cosmetics: [],
      tools: [],
      decorations: [],
    };

    // Power-ups (with quantities)
    if (this.progress.inventory.powerUps) {
      Object.entries(this.progress.inventory.powerUps).forEach(
        ([itemId, value]) => {
          if (typeof value === 'number' && value > 0) {
            summary.powerUps[itemId] = value;
          } else if (value === true) {
            summary.powerUps[itemId] = 1;
          }
        }
      );
    }

    // Other items (just list of owned items)
    ['cosmetics', 'tools', 'decorations'].forEach(category => {
      if (this.progress.inventory[category]) {
        Object.entries(this.progress.inventory[category]).forEach(
          ([itemId, owned]) => {
            if (owned) {
              summary[category].push(itemId);
            }
          }
        );
      }
    });

    return summary;
  }

  equipItem(itemId, itemType) {
    if (
      this.progress.inventory[`${itemType}s`] &&
      this.progress.inventory[`${itemType}s`][itemId]
    ) {
      this.progress.equippedItems[itemType] = itemId;
      this.saveProgress();
      return true;
    }
    return false;
  }

  // Character-specific upgrade system
  unlockCharacterUpgrade(upgradeId) {
    if (
      !this.progress.characterProgression.upgradesUnlocked.includes(upgradeId)
    ) {
      this.progress.characterProgression.upgradesUnlocked.push(upgradeId);
      this.saveProgress();
      return true;
    }
    return false;
  }

  isCharacterUpgradeUnlocked(upgradeId) {
    return this.progress.characterProgression.upgradesUnlocked.includes(
      upgradeId
    );
  }

  useSpecialAbility() {
    this.progress.characterProgression.specialAbilitiesUsed++;
    this.awardCharacterExperience(5);
    this.saveProgress();
  }

  // Data management
  exportProgress() {
    return this.saveManager.exportSaveData();
  }

  importProgress(jsonString) {
    const success = this.saveManager.importSaveData(jsonString);
    if (success) {
      this.progress = this.loadProgress();
    }
    return success;
  }

  resetProgress() {
    this.saveManager.clearSaveData();
    this.progress = this.getDefaultProgress();
    console.log('ProgressTracker: Progress reset to default');
  }

  // Cleanup
  destroy() {
    this.saveManager.disableAutoSave();
  }

  // 🤖 COMBAT SYSTEM - Character Stats Integration
  getCharacterStats() {
    const charType = this.getCharacterType();
    const level = this.getCharacterLevel();

    if (!charType) {
      // Default stats for no character
      return {
        attackPower: 1.0,
        defense: 0,
        speed: 30,
        accuracy: 0,
        luck: 0,
        energy: 100,
        intelligence: 0,
      };
    }

    // Base stats from character type with level scaling
    const baseStats = {
      attackPower: 1.0 + (level - 1) * 0.05, // +5% per level
      defense: (level - 1) * 2, // +2 defense per level
      speed: 30 + (level - 1) * 1, // +1 second per level
      accuracy: (level - 1) * 3, // +3% accuracy per level
      luck: (level - 1) * 2, // +2% luck per level
      energy: 100 + (level - 1) * 5, // +5 energy per level
      intelligence: (level - 1) * 3, // +3% intelligence per level
    };

    // Apply character type bonuses
    switch (charType.id) {
      case 'aria':
        baseStats.attackPower += 0.1;
        baseStats.accuracy += 15;
        baseStats.speed += 5;
        break;
      case 'titan':
        baseStats.attackPower += 0.2;
        baseStats.defense += 10;
        baseStats.energy += 20;
        break;
      case 'nexus':
        baseStats.intelligence += 20;
        baseStats.accuracy += 10;
        baseStats.luck += 10;
        break;
    }

    // Apply equipment bonuses
    this.applyEquipmentStatsBonus(baseStats);

    return baseStats;
  }

  // 🤖 COMBAT SYSTEM - Apply equipment bonuses to character stats
  applyEquipmentStatsBonus(stats) {
    const equippedItems = this.progress.equippedItems || {};

    // Apply weapon bonuses
    if (equippedItems.weapon) {
      switch (equippedItems.weapon) {
        case 'plasma_sword':
          stats.attackPower += 0.25;
          break;
        case 'neural_disruptor':
          stats.attackPower += 0.5;
          break;
        case 'quantum_cannon':
          stats.attackPower += 1.0;
          break;
      }
    }

    // Apply shield bonuses
    if (equippedItems.shield) {
      switch (equippedItems.shield) {
        case 'energy_barrier':
          stats.defense += 25;
          break;
        case 'adaptive_armor':
          stats.defense += 35;
          break;
        case 'quantum_shield':
          stats.defense += 50;
          break;
      }
    }

    // Apply tech bonuses
    if (equippedItems.tech) {
      switch (equippedItems.tech) {
        case 'hint_scanner':
          stats.accuracy += 25;
          break;
        case 'time_dilator':
          stats.speed += 15;
          break;
        case 'answer_analyzer':
          stats.accuracy += 35;
          break;
      }
    }

    // Apply core bonuses
    if (equippedItems.core) {
      switch (equippedItems.core) {
        case 'xp_amplifier':
          stats.intelligence += 50;
          break;
        case 'coin_magnet':
          stats.luck += 100;
          break;
        case 'streak_keeper':
          stats.energy += 50;
          break;
      }
    }

    return stats;
  }

  // 🤖 COMBAT SYSTEM - Add experience with intelligence bonus
  addExperience(baseAmount) {
    const stats = this.getCharacterStats();
    const multiplier = 1 + stats.intelligence / 100;
    const finalAmount = Math.floor(baseAmount * multiplier);

    this.awardCharacterExperience(finalAmount);
    console.log(
      `ProgressTracker: Added ${finalAmount} XP (${baseAmount} base × ${multiplier.toFixed(2)} intelligence bonus)`
    );
    return finalAmount;
  }

  // 🤖 COMBAT SYSTEM - Add coins with luck bonus
  addCoins(baseAmount, reason = 'Combat Victory') {
    const stats = this.getCharacterStats();
    const multiplier = 1 + stats.luck / 100;
    const finalAmount = Math.floor(baseAmount * multiplier);

    this.awardCoins(finalAmount, reason);
    console.log(
      `ProgressTracker: Added ${finalAmount} coins (${baseAmount} base × ${multiplier.toFixed(2)} luck bonus)`
    );
    return finalAmount;
  }

  // 🤖 COMBAT SYSTEM - Get equipment items for display
  getEquippedItems() {
    return (
      this.progress.equippedItems || {
        weapon: null,
        shield: null,
        tech: null,
        core: null,
        cosmetic: null,
        powerUp: null,
        tool: null,
        decoration: null,
      }
    );
  }

  // 🤖 COMBAT SYSTEM - Check if player has specific equipment
  hasEquipment(equipmentId) {
    const equipped = this.getEquippedItems();
    return Object.values(equipped).includes(equipmentId);
  }

  // 🤖 COMBAT SYSTEM - Get combat performance multipliers
  getCombatMultipliers() {
    const stats = this.getCharacterStats();

    return {
      damageMultiplier: stats.attackPower,
      defenseReduction: stats.defense,
      timeBonus: stats.speed,
      accuracyBonus: stats.accuracy,
      coinBonus: 1 + stats.luck / 100,
      xpBonus: 1 + stats.intelligence / 100,
      energyCapacity: stats.energy,
    };
  }
}
