export class AchievementManager {
  constructor(progressTracker) {
    this.progressTracker = progressTracker;

    // Achievement definitions
    this.achievements = {
      // Learning Milestones
      firstSteps: {
        id: 'firstSteps',
        name: 'First Steps',
        description: 'Answer your first question correctly',
        icon: '👶',
        category: 'milestone',
        rarity: 'common',
        points: 10,
        rewards: { coins: 25, experience: 15 },
        condition: { type: 'correct_answers', value: 1 },
      },
      quickLearner: {
        id: 'quickLearner',
        name: 'Quick Learner',
        description: 'Answer 10 questions correctly',
        icon: '🧠',
        category: 'milestone',
        rarity: 'common',
        points: 25,
        rewards: { coins: 50, experience: 30 },
        condition: { type: 'correct_answers', value: 10 },
      },
      scholar: {
        id: 'scholar',
        name: 'Scholar',
        description: 'Answer 50 questions correctly',
        icon: '🎓',
        category: 'milestone',
        rarity: 'uncommon',
        points: 50,
        rewards: { coins: 100, experience: 75, powerUp: 'hint' },
        condition: { type: 'correct_answers', value: 50 },
      },
      mastermind: {
        id: 'mastermind',
        name: 'Mastermind',
        description: 'Answer 200 questions correctly',
        icon: '🧙‍♂️',
        category: 'milestone',
        rarity: 'rare',
        points: 100,
        rewards: { coins: 250, experience: 150, powerUp: 'doubleCoins' },
        condition: { type: 'correct_answers', value: 200 },
      },

      // Accuracy Achievements
      perfectionist: {
        id: 'perfectionist',
        name: 'Perfectionist',
        description: 'Achieve 100% accuracy in a session',
        icon: '💯',
        category: 'accuracy',
        rarity: 'uncommon',
        points: 40,
        rewards: { coins: 75, experience: 50 },
        condition: { type: 'session_accuracy', value: 100 },
      },
      sharpshooter: {
        id: 'sharpshooter',
        name: 'Sharpshooter',
        description: 'Maintain 90% accuracy over 20 questions',
        icon: '🎯',
        category: 'accuracy',
        rarity: 'rare',
        points: 75,
        rewards: { coins: 150, experience: 100, powerUp: 'focusEnhancement' },
        condition: { type: 'sustained_accuracy', value: 90, count: 20 },
      },

      // Speed Achievements
      speedDemon: {
        id: 'speedDemon',
        name: 'Speed Demon',
        description: 'Answer 5 questions in under 30 seconds total',
        icon: '⚡',
        category: 'speed',
        rarity: 'uncommon',
        points: 35,
        rewards: { coins: 60, experience: 40 },
        condition: { type: 'speed_challenge', questions: 5, time: 30000 },
      },
      lightning: {
        id: 'lightning',
        name: 'Lightning',
        description: 'Answer a question in under 3 seconds',
        icon: '⚡⚡',
        category: 'speed',
        rarity: 'rare',
        points: 60,
        rewards: { coins: 100, experience: 75, powerUp: 'timeFreeze' },
        condition: { type: 'single_question_speed', time: 3000 },
      },

      // Streak Achievements
      hotStreak: {
        id: 'hotStreak',
        name: 'Hot Streak',
        description: 'Get 5 questions correct in a row',
        icon: '🔥',
        category: 'streak',
        rarity: 'common',
        points: 30,
        rewards: { coins: 50, experience: 35 },
        condition: { type: 'streak', value: 5 },
      },
      unstoppable: {
        id: 'unstoppable',
        name: 'Unstoppable',
        description: 'Get 10 questions correct in a row',
        icon: '🔥🔥',
        category: 'streak',
        rarity: 'uncommon',
        points: 60,
        rewards: { coins: 100, experience: 70, powerUp: 'shield' },
        condition: { type: 'streak', value: 10 },
      },
      legendary: {
        id: 'legendary',
        name: 'Legendary',
        description: 'Get 20 questions correct in a row',
        icon: '🔥🔥🔥',
        category: 'streak',
        rarity: 'legendary',
        points: 150,
        rewards: { coins: 300, experience: 200, powerUp: 'systemOptimization' },
        condition: { type: 'streak', value: 20 },
      },

      // Subject Mastery
      mathWizard: {
        id: 'mathWizard',
        name: 'Math Wizard',
        description: 'Excel in mathematics with 85% accuracy over 25 questions',
        icon: '🔢',
        category: 'subject',
        rarity: 'rare',
        points: 80,
        rewards: { coins: 150, experience: 100 },
        condition: {
          type: 'subject_mastery',
          subject: 'math',
          accuracy: 85,
          count: 25,
        },
      },
      readingChampion: {
        id: 'readingChampion',
        name: 'Reading Champion',
        description:
          'Master reading comprehension with 85% accuracy over 25 questions',
        icon: '📚',
        category: 'subject',
        rarity: 'rare',
        points: 80,
        rewards: { coins: 150, experience: 100 },
        condition: {
          type: 'subject_mastery',
          subject: 'reading',
          accuracy: 85,
          count: 25,
        },
      },
      scienceExplorer: {
        id: 'scienceExplorer',
        name: 'Science Explorer',
        description:
          'Discover science mastery with 85% accuracy over 25 questions',
        icon: '🔬',
        category: 'subject',
        rarity: 'rare',
        points: 80,
        rewards: { coins: 150, experience: 100 },
        condition: {
          type: 'subject_mastery',
          subject: 'science',
          accuracy: 85,
          count: 25,
        },
      },
      historyBuff: {
        id: 'historyBuff',
        name: 'History Buff',
        description:
          'Become a history expert with 85% accuracy over 25 questions',
        icon: '🏛️',
        category: 'subject',
        rarity: 'rare',
        points: 80,
        rewards: { coins: 150, experience: 100 },
        condition: {
          type: 'subject_mastery',
          subject: 'history',
          accuracy: 85,
          count: 25,
        },
      },

      // Weekly Achievements
      weekWarrior: {
        id: 'weekWarrior',
        name: 'Week Warrior',
        description: 'Complete your first week',
        icon: '🗓️',
        category: 'weekly',
        rarity: 'common',
        points: 50,
        rewards: { coins: 100, experience: 75 },
        condition: { type: 'weeks_completed', value: 1 },
      },
      monthlyMaster: {
        id: 'monthlyMaster',
        name: 'Monthly Master',
        description: 'Complete 4 weeks of learning',
        icon: '📅',
        category: 'weekly',
        rarity: 'rare',
        points: 200,
        rewards: { coins: 400, experience: 300, powerUp: 'elementalMastery' },
        condition: { type: 'weeks_completed', value: 4 },
      },

      // Special Character Achievements
      scholarlyWisdom: {
        id: 'scholarlyWisdom',
        name: 'Scholarly Wisdom',
        description: 'Use Scholar Hero abilities 10 times',
        icon: '📖',
        category: 'character',
        rarity: 'uncommon',
        points: 45,
        rewards: { coins: 80, experience: 60 },
        condition: {
          type: 'character_ability_use',
          character: 'scholar',
          count: 10,
        },
      },
      mysticMastery: {
        id: 'mysticMastery',
        name: 'Mystic Mastery',
        description: 'Channel Mystic Companion powers 10 times',
        icon: '🌟',
        category: 'character',
        rarity: 'uncommon',
        points: 45,
        rewards: { coins: 80, experience: 60 },
        condition: {
          type: 'character_ability_use',
          character: 'mystic',
          count: 10,
        },
      },
      techMaster: {
        id: 'techMaster',
        name: 'Tech Master',
        description: 'Utilize Tech Bot systems 10 times',
        icon: '⚙️',
        category: 'character',
        rarity: 'uncommon',
        points: 45,
        rewards: { coins: 80, experience: 60 },
        condition: {
          type: 'character_ability_use',
          character: 'techbot',
          count: 10,
        },
      },

      // Collection Achievements
      coinCollector: {
        id: 'coinCollector',
        name: 'Coin Collector',
        description: 'Earn 1000 total coins',
        icon: '💰',
        category: 'collection',
        rarity: 'uncommon',
        points: 40,
        rewards: { coins: 100, experience: 50 },
        condition: { type: 'total_coins_earned', value: 1000 },
      },
      treasureHunter: {
        id: 'treasureHunter',
        name: 'Treasure Hunter',
        description: 'Earn 5000 total coins',
        icon: '💎',
        category: 'collection',
        rarity: 'rare',
        points: 100,
        rewards: { coins: 250, experience: 150, powerUp: 'doubleCoins' },
        condition: { type: 'total_coins_earned', value: 5000 },
      },
    };

    // Rarity colors and effects
    this.rarityConfig = {
      common: { color: 0x9ca3af, glow: 0xffffff, particles: 5 },
      uncommon: { color: 0x10b981, glow: 0x34d399, particles: 8 },
      rare: { color: 0x3b82f6, glow: 0x60a5fa, particles: 12 },
      epic: { color: 0x8b5cf6, glow: 0xa78bfa, particles: 15 },
      legendary: { color: 0xf59e0b, glow: 0xfbbf24, particles: 20 },
    };

    // Track session data for achievements
    this.sessionData = {
      questionsAnswered: 0,
      correctAnswers: 0,
      currentStreak: 0,
      sessionStartTime: Date.now(),
      speedChallengeProgress: [],
      subjectProgress: {},
    };
  }

  // Check for new achievements
  checkAchievements(eventData = {}) {
    const newAchievements = [];
    const currentProgress = this.progressTracker.progress;
    const unlockedAchievements = currentProgress.achievements || [];

    Object.values(this.achievements).forEach(achievement => {
      // Skip if already unlocked
      if (unlockedAchievements.includes(achievement.id)) return;

      // Check if achievement condition is met
      if (this.checkAchievementCondition(achievement, eventData)) {
        newAchievements.push(achievement);
        this.unlockAchievement(achievement);
      }
    });

    return newAchievements;
  }

  // Check if achievement condition is met
  checkAchievementCondition(achievement, eventData) {
    const { condition } = achievement;
    const { progress } = this.progressTracker;

    switch (condition.type) {
      case 'correct_answers':
        return progress.sessionStats.correctAnswers >= condition.value;

      case 'session_accuracy':
        if (this.sessionData.questionsAnswered === 0) return false;
        const accuracy =
          (this.sessionData.correctAnswers /
            this.sessionData.questionsAnswered) *
          100;
        return accuracy >= condition.value;

      case 'sustained_accuracy':
        return this.checkSustainedAccuracy(condition.value, condition.count);

      case 'speed_challenge':
        return this.checkSpeedChallenge(condition.questions, condition.time);

      case 'single_question_speed':
        return (
          eventData.responseTime && eventData.responseTime <= condition.time
        );

      case 'streak':
        return this.sessionData.currentStreak >= condition.value;

      case 'subject_mastery':
        return this.checkSubjectMastery(
          condition.subject,
          condition.accuracy,
          condition.count
        );

      case 'weeks_completed':
        return progress.weeksCompleted.length >= condition.value;

      case 'character_ability_use':
        const characterType = this.progressTracker.getCharacterType();
        if (!characterType || characterType.id !== condition.character)
          return false;
        return (
          progress.characterProgression.specialAbilitiesUsed >= condition.count
        );

      case 'total_coins_earned':
        return progress.totalCoinsEarned >= condition.value;

      default:
        return false;
    }
  }

  // Check sustained accuracy
  checkSustainedAccuracy(targetAccuracy, questionCount) {
    const recentAnswers = this.getRecentAnswers(questionCount);
    if (recentAnswers.length < questionCount) return false;

    const correct = recentAnswers.filter(answer => answer.correct).length;
    const accuracy = (correct / recentAnswers.length) * 100;
    return accuracy >= targetAccuracy;
  }

  // Check speed challenge
  checkSpeedChallenge(questionCount, timeLimit) {
    if (this.sessionData.speedChallengeProgress.length < questionCount)
      return false;

    const recentTimes =
      this.sessionData.speedChallengeProgress.slice(-questionCount);
    const totalTime = recentTimes.reduce((sum, time) => sum + time, 0);
    return totalTime <= timeLimit;
  }

  // Check subject mastery
  checkSubjectMastery(subject, targetAccuracy, questionCount) {
    const subjectStats = this.progressTracker.progress.subjectStats[subject];
    if (!subjectStats || subjectStats.total < questionCount) return false;

    const accuracy = (subjectStats.correct / subjectStats.total) * 100;
    return accuracy >= targetAccuracy;
  }

  // Get recent answers for analysis
  getRecentAnswers(count) {
    // This would need to be implemented with actual answer tracking
    // For now, return mock data based on session stats
    const answers = [];
    const totalAnswers = this.sessionData.questionsAnswered;
    const { correctAnswers } = this.sessionData;

    for (let i = 0; i < Math.min(count, totalAnswers); i++) {
      answers.push({
        correct: i < correctAnswers,
        timestamp: Date.now() - i * 10000,
      });
    }

    return answers.reverse();
  }

  // Unlock achievement
  unlockAchievement(achievement) {
    // Handle both string IDs and achievement objects
    let achievementObj;
    if (typeof achievement === 'string') {
      // Look up achievement by ID
      achievementObj = this.achievements[achievement];
      if (!achievementObj) {
        console.warn(`Achievement not found: ${achievement}`);
        return;
      }
    } else {
      achievementObj = achievement;
    }

    const { progress } = this.progressTracker;

    // Check if already unlocked
    if (!progress.achievements) progress.achievements = [];
    if (progress.achievements.includes(achievementObj.id)) {
      return; // Already unlocked
    }

    // Add to unlocked achievements
    progress.achievements.push(achievementObj.id);

    // Award rewards
    if (achievementObj.rewards && achievementObj.rewards.coins) {
      this.progressTracker.awardCoins(
        achievementObj.rewards.coins,
        `Achievement: ${achievementObj.name}`
      );
    }

    if (achievementObj.rewards && achievementObj.rewards.experience) {
      this.progressTracker.awardCharacterExperience(
        achievementObj.rewards.experience
      );
    }

    if (achievementObj.rewards && achievementObj.rewards.powerUp) {
      if (!progress.inventory.powerUps[achievementObj.rewards.powerUp]) {
        progress.inventory.powerUps[achievementObj.rewards.powerUp] = 0;
      }
      progress.inventory.powerUps[achievementObj.rewards.powerUp]++;
    }

    // Update badge count
    progress.badges = progress.achievements.length;

    // Save progress
    this.progressTracker.saveProgress();

    console.log(`Achievement unlocked: ${achievementObj.name}`);
  }

  // Record answer for achievement tracking
  recordAnswer(subject, isCorrect, responseTime) {
    this.sessionData.questionsAnswered++;

    if (isCorrect) {
      this.sessionData.correctAnswers++;
      this.sessionData.currentStreak++;
    } else {
      this.sessionData.currentStreak = 0;
    }

    // Track speed challenge progress
    this.sessionData.speedChallengeProgress.push(responseTime);
    if (this.sessionData.speedChallengeProgress.length > 10) {
      this.sessionData.speedChallengeProgress.shift();
    }

    // Track subject progress
    if (!this.sessionData.subjectProgress[subject]) {
      this.sessionData.subjectProgress[subject] = { correct: 0, total: 0 };
    }
    this.sessionData.subjectProgress[subject].total++;
    if (isCorrect) {
      this.sessionData.subjectProgress[subject].correct++;
    }

    // Check for achievements
    return this.checkAchievements({ responseTime, subject, isCorrect });
  }

  // Get achievement progress
  getAchievementProgress() {
    const { progress } = this.progressTracker;
    const unlockedAchievements = progress.achievements || [];
    const achievementProgress = [];

    Object.values(this.achievements).forEach(achievement => {
      const isUnlocked = unlockedAchievements.includes(achievement.id);
      let progressValue = 0;
      let maxValue = 1;

      if (!isUnlocked) {
        const { condition } = achievement;

        switch (condition.type) {
          case 'correct_answers':
            progressValue = progress.sessionStats.correctAnswers;
            maxValue = condition.value;
            break;
          case 'streak':
            progressValue = this.sessionData.currentStreak;
            maxValue = condition.value;
            break;
          case 'weeks_completed':
            progressValue = progress.weeksCompleted.length;
            maxValue = condition.value;
            break;
          case 'total_coins_earned':
            progressValue = progress.totalCoinsEarned;
            maxValue = condition.value;
            break;
          case 'subject_mastery':
            const subjectStats = progress.subjectStats[condition.subject];
            if (subjectStats && subjectStats.total > 0) {
              progressValue = Math.min(subjectStats.total, condition.count);
              maxValue = condition.count;
            }
            break;
        }
      }

      achievementProgress.push({
        ...achievement,
        isUnlocked,
        progress: Math.min(progressValue, maxValue),
        maxProgress: maxValue,
        progressPercent: Math.round((progressValue / maxValue) * 100),
      });
    });

    return achievementProgress.sort((a, b) => {
      if (a.isUnlocked !== b.isUnlocked) return a.isUnlocked ? 1 : -1;
      return b.progressPercent - a.progressPercent;
    });
  }

  // Get achievements by category
  getAchievementsByCategory() {
    const achievements = this.getAchievementProgress();
    const categories = {};

    achievements.forEach(achievement => {
      if (!categories[achievement.category]) {
        categories[achievement.category] = [];
      }
      categories[achievement.category].push(achievement);
    });

    return categories;
  }

  // Get recent achievements
  getRecentAchievements(limit = 5) {
    const { progress } = this.progressTracker;
    const unlockedAchievements = progress.achievements || [];

    return unlockedAchievements
      .slice(-limit)
      .map(id => this.achievements[id])
      .filter(achievement => achievement)
      .reverse();
  }

  // Get achievement statistics
  getAchievementStats() {
    const { progress } = this.progressTracker;
    const unlockedAchievements = progress.achievements || [];
    const totalAchievements = Object.keys(this.achievements).length;

    const categoryStats = {};
    Object.values(this.achievements).forEach(achievement => {
      if (!categoryStats[achievement.category]) {
        categoryStats[achievement.category] = { total: 0, unlocked: 0 };
      }
      categoryStats[achievement.category].total++;
      if (unlockedAchievements.includes(achievement.id)) {
        categoryStats[achievement.category].unlocked++;
      }
    });

    const totalPoints = unlockedAchievements.reduce((sum, id) => {
      const achievement = this.achievements[id];
      return sum + (achievement ? achievement.points : 0);
    }, 0);

    return {
      totalUnlocked: unlockedAchievements.length,
      totalAchievements,
      completionPercent: Math.round(
        (unlockedAchievements.length / totalAchievements) * 100
      ),
      totalPoints,
      categoryStats,
    };
  }

  // Reset session data
  resetSession() {
    this.sessionData = {
      questionsAnswered: 0,
      correctAnswers: 0,
      currentStreak: 0,
      sessionStartTime: Date.now(),
      speedChallengeProgress: [],
      subjectProgress: {},
    };
  }

  // Get next achievement suggestions
  getNextAchievements(limit = 3) {
    const achievementProgress = this.getAchievementProgress();

    return achievementProgress
      .filter(
        achievement =>
          !achievement.isUnlocked && achievement.progressPercent > 0
      )
      .sort((a, b) => b.progressPercent - a.progressPercent)
      .slice(0, limit);
  }
}
