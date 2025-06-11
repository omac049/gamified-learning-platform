import { GameSystem } from './GameSystem.js';
import { GameConfig } from '../../shared/index.js';

/**
 * Math Integration System - Makes math problems the core of the gaming experience
 * Handles dynamic difficulty, math-driven combat bonuses, and educational progression
 */
export class MathIntegrationSystem extends GameSystem {
  constructor(scene, config = {}) {
    super(scene, {
      updateThrottle: 50, // Fast updates for responsive math integration
      ...config,
    });

    // Math state
    this.currentDifficulty = 1;
    this.mathPower = 0;
    this.maxMathPower = 100;
    this.streak = 0;
    this.maxStreak = 0;

    // Question management
    this.currentQuestion = null;
    this.questionStartTime = 0;
    this.questionTimeLimit = 20000; // Increased from 15 to 20 seconds for more thinking time
    this.questionsAnswered = 0;
    this.correctAnswers = 0;

    // Math-driven combat bonuses
    this.activeBonuses = new Map();
    this.bonusTimers = new Map();

    // Adaptive difficulty system
    this.performanceHistory = [];
    this.difficultyAdjustmentThreshold = 5; // questions before adjustment

    // Educational progression
    this.topicProgression = {
      addition: { level: 1, mastery: 0 },
      subtraction: { level: 1, mastery: 0 },
      multiplication: { level: 1, mastery: 0 },
      division: { level: 1, mastery: 0 },
      fractions: { level: 0, mastery: 0 },
      decimals: { level: 0, mastery: 0 },
    };

    // Real-time math challenges
    this.quickChallengeActive = false;
    this.quickChallengeTimer = 0;
    this.quickChallengeInterval = 30000; // 30 seconds

    // Contextual math triggers
    this.mathTriggers = {
      enemyEncounter: {
        enabled: true,
        chance: 0.3,
        cooldown: 5000,
        lastTriggered: 0,
      },
      lowHealth: {
        enabled: true,
        threshold: 0.3,
        cooldown: 10000,
        lastTriggered: 0,
      },
      waveStart: { enabled: true, chance: 0.5, cooldown: 0, lastTriggered: 0 },
      powerUpRequest: {
        enabled: true,
        chance: 1.0,
        cooldown: 2000,
        lastTriggered: 0,
      },
      bossEncounter: {
        enabled: true,
        chance: 0.8,
        cooldown: 0,
        lastTriggered: 0,
      },
    };

    // Math-driven gameplay effects
    this.gameplayEffects = {
      correctAnswerBonuses: {
        healthRestore: 10,
        energyBoost: 15,
        damageMultiplier: 1.5,
        shieldRegeneration: 20,
        mathPowerGain: 25,
      },
      incorrectAnswerPenalties: {
        healthLoss: 5,
        energyDrain: 10,
        vulnerabilityDuration: 3000,
        mathPowerLoss: 10,
      },
      streakBonuses: {
        3: { effect: 'rapidFire', duration: 5000 },
        5: { effect: 'invulnerability', duration: 2000 },
        7: { effect: 'timeSlowdown', duration: 4000 },
        10: { effect: 'superDamage', duration: 8000 },
      },
    };

    // Math power abilities
    this.mathAbilities = {
      energyBoost: { cost: 20, duration: 5000, active: false },
      damageMultiplier: { cost: 30, duration: 8000, active: false },
      shieldRegeneration: { cost: 25, duration: 10000, active: false },
      timeSlowdown: { cost: 40, duration: 3000, active: false },
      autoAim: { cost: 35, duration: 6000, active: false },
    };
  }

  async onInit() {
    this.log('Initializing Math Integration System...');

    // Set up event listeners
    this.setupEventListeners();

    // Initialize question generator
    this.initializeQuestionGenerator();

    // Start quick challenge timer
    this.quickChallengeTimer = Date.now() + this.quickChallengeInterval;

    this.log('Math Integration System initialized');
  }

  setupEventListeners() {
    // Combat events
    this.on('waveStarted', this.onWaveStarted);
    this.on('enemyDefeated', this.onEnemyDefeated);
    this.on('playerDamaged', this.onPlayerDamaged);

    // New contextual triggers
    this.on('enemySpawned', this.onEnemySpawned);
    this.on('playerHealthLow', this.onPlayerHealthLow);
    this.on('bossEncounter', this.onBossEncounter);
    this.on('powerUpRequested', this.onPowerUpRequested);
    this.on('specialAbilityRequested', this.onSpecialAbilityRequested);

    // Math events
    this.on('mathAnswerSelected', this.onMathAnswerSelected);
    this.on('mathQuizRequested', this.startMathQuiz);

    // UI events
    this.on('mathAbilityRequested', this.onMathAbilityRequested);
  }

  initializeQuestionGenerator() {
    // Enhanced question templates with progressive difficulty
    this.questionTemplates = {
      addition: {
        level1: () => this.generateBasicAddition(1, 10),
        level2: () => this.generateBasicAddition(10, 50),
        level3: () => this.generateBasicAddition(50, 100),
        level4: () => this.generateMultiDigitAddition(),
        level5: () => this.generateWordProblemAddition(),
      },
      subtraction: {
        level1: () => this.generateBasicSubtraction(1, 10),
        level2: () => this.generateBasicSubtraction(10, 50),
        level3: () => this.generateBasicSubtraction(50, 100),
        level4: () => this.generateMultiDigitSubtraction(),
        level5: () => this.generateWordProblemSubtraction(),
      },
      multiplication: {
        level1: () => this.generateBasicMultiplication(1, 5),
        level2: () => this.generateBasicMultiplication(1, 10),
        level3: () => this.generateBasicMultiplication(1, 12),
        level4: () => this.generateTwoDigitMultiplication(),
        level5: () => this.generateWordProblemMultiplication(),
      },
      division: {
        level1: () => this.generateBasicDivision(1, 25),
        level2: () => this.generateBasicDivision(1, 100),
        level3: () => this.generateDivisionWithRemainder(),
        level4: () => this.generateLongDivision(),
        level5: () => this.generateWordProblemDivision(),
      },
    };
  }

  onUpdate(time, delta) {
    // Update active bonuses
    this.updateMathBonuses(time);

    // Check for quick challenges
    this.checkQuickChallenges(time);

    // Update question timer
    this.updateQuestionTimer(time);

    // Update math power decay
    this.updateMathPowerDecay(time, delta);
  }

  // === QUESTION GENERATION ===
  generateQuestion(topic = null, level = null) {
    // Determine topic based on progression or random selection
    if (!topic) {
      topic = this.selectOptimalTopic();
    }

    // Determine level based on current mastery
    if (!level) {
      level = this.topicProgression[topic].level;
    }

    // Generate question using appropriate template
    const generator = this.questionTemplates[topic][`level${level}`];
    if (!generator) {
      // Fallback to level 1 if level doesn't exist
      return this.questionTemplates[topic].level1();
    }

    const question = generator();
    question.topic = topic;
    question.level = level;
    question.timestamp = Date.now();

    return question;
  }

  generateBasicAddition(min, max) {
    const a = Math.floor(Math.random() * (max - min + 1)) + min;
    const b = Math.floor(Math.random() * (max - min + 1)) + min;
    const answer = a + b;

    return {
      question: `${a} + ${b} = ?`,
      answer,
      choices: this.generateChoices(answer, 4),
      type: 'addition',
      difficulty: this.calculateQuestionDifficulty(a, b, 'addition'),
    };
  }

  generateBasicSubtraction(min, max) {
    const a = Math.floor(Math.random() * (max - min + 1)) + min;
    const b = Math.floor(Math.random() * a) + 1; // Ensure positive result
    const answer = a - b;

    return {
      question: `${a} - ${b} = ?`,
      answer,
      choices: this.generateChoices(answer, 4),
      type: 'subtraction',
      difficulty: this.calculateQuestionDifficulty(a, b, 'subtraction'),
    };
  }

  generateBasicMultiplication(minFactor, maxFactor) {
    const a = Math.floor(Math.random() * maxFactor) + minFactor;
    const b = Math.floor(Math.random() * maxFactor) + minFactor;
    const answer = a * b;

    return {
      question: `${a} × ${b} = ?`,
      answer,
      choices: this.generateChoices(answer, 4),
      type: 'multiplication',
      difficulty: this.calculateQuestionDifficulty(a, b, 'multiplication'),
    };
  }

  generateBasicDivision(min, max) {
    const b = Math.floor(Math.random() * 9) + 2; // Divisor 2-10
    const answer = Math.floor(Math.random() * 10) + 1; // Quotient 1-10
    const a = b * answer; // Ensure clean division

    return {
      question: `${a} ÷ ${b} = ?`,
      answer,
      choices: this.generateChoices(answer, 4),
      type: 'division',
      difficulty: this.calculateQuestionDifficulty(a, b, 'division'),
    };
  }

  generateWordProblemAddition() {
    const scenarios = [
      'Sarah has {a} apples. Her friend gives her {b} more apples. How many apples does Sarah have now?',
      'There are {a} birds in a tree. {b} more birds join them. How many birds are in the tree total?',
      'A store sold {a} books in the morning and {b} books in the afternoon. How many books did they sell in total?',
    ];

    const a = Math.floor(Math.random() * 20) + 5;
    const b = Math.floor(Math.random() * 15) + 3;
    const answer = a + b;
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

    return {
      question: scenario.replace('{a}', a).replace('{b}', b),
      answer,
      choices: this.generateChoices(answer, 4),
      type: 'word_problem_addition',
      difficulty: this.calculateQuestionDifficulty(a, b, 'addition') + 1,
    };
  }

  generateChoices(correctAnswer, count = 4) {
    const choices = [correctAnswer];
    const range = Math.max(5, Math.floor(correctAnswer * 0.3));

    while (choices.length < count) {
      const offset = Math.floor(Math.random() * range * 2) - range;
      const choice = correctAnswer + offset;

      if (choice > 0 && choice !== correctAnswer && !choices.includes(choice)) {
        choices.push(choice);
      }
    }

    // Shuffle choices
    for (let i = choices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [choices[i], choices[j]] = [choices[j], choices[i]];
    }

    return choices;
  }

  calculateQuestionDifficulty(a, b, operation) {
    switch (operation) {
      case 'addition':
      case 'subtraction':
        return Math.floor((a + b) / 20) + 1;
      case 'multiplication':
        return Math.floor((a * b) / 50) + 1;
      case 'division':
        return Math.floor(a / 20) + 1;
      default:
        return 1;
    }
  }

  // === MATH QUIZ SYSTEM ===
  startMathQuiz(data = {}) {
    const question = this.generateQuestion(data.topic, data.level);
    this.currentQuestion = question;
    this.questionStartTime = Date.now();

    // Emit to UI system
    this.emit('mathQuizStarted', {
      question: question.question,
      choices: question.choices,
      timeLimit: this.questionTimeLimit,
      mathPower: this.mathPower,
      streak: this.streak,
    });

    this.log(`Math quiz started: ${question.question}`);
  }

  onMathAnswerSelected(data) {
    if (!this.currentQuestion) return;

    const isCorrect = data.answer === this.currentQuestion.answer;
    const responseTime = Date.now() - this.questionStartTime;
    const timeBonus = Math.max(0, 1 - responseTime / this.questionTimeLimit);

    this.questionsAnswered++;

    if (isCorrect) {
      this.handleCorrectAnswer(timeBonus);
    } else {
      this.handleIncorrectAnswer();
    }

    // Update performance history
    this.updatePerformanceHistory(isCorrect, responseTime);

    // Update topic mastery
    this.updateTopicMastery(this.currentQuestion.topic, isCorrect);

    // Emit completion event
    this.emit('mathQuizCompleted', {
      correct: isCorrect,
      answer: this.currentQuestion.answer,
      selectedAnswer: data.answer,
      responseTime,
      timeBonus,
      mathPower: this.mathPower,
      streak: this.streak,
      bonusesEarned: this.calculateBonusesEarned(isCorrect, timeBonus),
    });

    this.currentQuestion = null;
  }

  handleCorrectAnswer(timeBonus) {
    this.streak++;
    this.correctAnswers++;
    this.maxStreak = Math.max(this.maxStreak, this.streak);

    // Calculate math power gain with time bonus
    const basePowerGain = 15;
    const timeBonusPower = Math.floor(timeBonus * 10);
    const totalPowerGain = basePowerGain + timeBonusPower;

    this.addMathPower(totalPowerGain);

    // Apply immediate gameplay effects based on context
    if (this.currentQuestion?.triggerType) {
      this.applyContextualCorrectEffects(
        this.currentQuestion.triggerType,
        this.currentQuestion.contextData
      );
    }

    // Apply standard correct answer bonuses
    this.applyCorrectAnswerBonuses();

    // Check for streak bonuses
    this.checkStreakBonuses();

    // Activate math bonuses
    this.activateMathBonuses(timeBonus);

    // Update performance tracking
    this.updatePerformanceHistory(true, Date.now() - this.questionStartTime);

    // Emit success event with enhanced data
    this.emit('mathAnswerCorrect', {
      streak: this.streak,
      mathPower: this.mathPower,
      powerGained: totalPowerGain,
      timeBonus,
      triggerType: this.currentQuestion?.triggerType,
      effects: this.getActiveEffects(),
    });

    this.log(
      `Correct answer! Streak: ${this.streak}, Math Power: ${this.mathPower}`
    );
  }

  handleIncorrectAnswer() {
    this.streak = 0;

    // Apply immediate gameplay penalties based on context
    if (this.currentQuestion?.triggerType) {
      this.applyContextualIncorrectEffects(
        this.currentQuestion.triggerType,
        this.currentQuestion.contextData
      );
    }

    // Apply standard incorrect answer penalties
    this.applyIncorrectAnswerPenalties();

    // Reduce math power
    this.addMathPower(-10);

    // Update performance tracking
    this.updatePerformanceHistory(false, Date.now() - this.questionStartTime);

    // Emit failure event with enhanced data
    this.emit('mathAnswerIncorrect', {
      streak: this.streak,
      mathPower: this.mathPower,
      powerLost: 10,
      triggerType: this.currentQuestion?.triggerType,
      penalties: this.getActivePenalties(),
    });

    this.log(`Incorrect answer. Streak reset. Math Power: ${this.mathPower}`);
  }

  applyContextualCorrectEffects(triggerType, contextData) {
    const effects = this.gameplayEffects.correctAnswerBonuses;

    switch (triggerType) {
      case 'lowHealth':
        // Restore health immediately
        this.emit('playerHealthRestore', { amount: effects.healthRestore * 2 });
        this.emit('showFloatingText', {
          text: `+${effects.healthRestore * 2} Health!`,
          color: '#00ff00',
          x: contextData.healthData?.x || 100,
          y: contextData.healthData?.y || 100,
        });
        break;

      case 'enemyEncounter':
        // Apply damage multiplier for next few attacks
        this.activateBonus('damageMultiplier', 5000, {
          multiplier: effects.damageMultiplier,
        });
        this.emit('showFloatingText', {
          text: 'Damage Boost!',
          color: '#ff6600',
          x: contextData.enemyData?.x || 200,
          y: contextData.enemyData?.y || 200,
        });
        break;

      case 'powerUpRequest':
        // Grant the requested power immediately
        this.emit('powerUpGranted', {
          powerType: contextData.powerData?.powerType,
          enhanced: true,
        });
        break;

      case 'bossEncounter':
        // Grant special boss-fighting abilities
        this.activateBonus('superDamage', 10000, { multiplier: 2.0 });
        this.activateBonus('invulnerability', 3000, {});
        this.emit('showFloatingText', {
          text: 'BOSS BUSTER MODE!',
          color: '#ffff00',
          x: 400,
          y: 300,
        });
        break;
    }
  }

  applyContextualIncorrectEffects(triggerType, contextData) {
    const penalties = this.gameplayEffects.incorrectAnswerPenalties;

    switch (triggerType) {
      case 'lowHealth':
        // Additional health loss in emergency
        this.emit('playerDamage', { amount: penalties.healthLoss * 1.5 });
        break;

      case 'enemyEncounter':
        // Make player vulnerable to next attack
        this.activateBonus(
          'vulnerability',
          penalties.vulnerabilityDuration,
          {}
        );
        break;

      case 'powerUpRequest':
        // Deny the power-up and add cooldown
        this.emit('powerUpDenied', {
          powerType: contextData.powerData?.powerType,
          cooldownPenalty: 5000,
        });
        break;

      case 'bossEncounter':
        // Significant penalties for boss fight failure
        this.emit('playerDamage', { amount: penalties.healthLoss * 2 });
        this.addMathPower(-penalties.mathPowerLoss * 2);
        break;
    }
  }

  applyCorrectAnswerBonuses() {
    const bonuses = this.gameplayEffects.correctAnswerBonuses;

    // Energy boost
    this.emit('playerEnergyRestore', { amount: bonuses.energyBoost });

    // Shield regeneration
    this.emit('playerShieldRegenerate', { amount: bonuses.shieldRegeneration });
  }

  applyIncorrectAnswerPenalties() {
    const penalties = this.gameplayEffects.incorrectAnswerPenalties;

    // Energy drain
    this.emit('playerEnergyDrain', { amount: penalties.energyDrain });

    // Small health loss
    this.emit('playerDamage', { amount: penalties.healthLoss });
  }

  checkStreakBonuses() {
    const streakBonus = this.gameplayEffects.streakBonuses[this.streak];

    if (streakBonus) {
      this.activateBonus(streakBonus.effect, streakBonus.duration, {
        streak: this.streak,
      });

      this.emit('streakBonusActivated', {
        streak: this.streak,
        effect: streakBonus.effect,
        duration: streakBonus.duration,
      });

      this.emit('showFloatingText', {
        text: `${this.streak} STREAK! ${streakBonus.effect.toUpperCase()}!`,
        color: '#ff00ff',
        x: 400,
        y: 200,
        fontSize: '24px',
      });
    }
  }

  getActiveEffects() {
    const effects = [];
    for (const [type, bonus] of this.activeBonuses) {
      if (bonus.active) {
        effects.push({
          type,
          timeRemaining: bonus.endTime - Date.now(),
          data: bonus.data,
        });
      }
    }
    return effects;
  }

  getActivePenalties() {
    // Return any active penalties/debuffs
    return [];
  }

  // === MATH POWER SYSTEM ===
  addMathPower(amount) {
    this.mathPower = Math.max(
      0,
      Math.min(this.maxMathPower, this.mathPower + amount)
    );

    this.emit('mathPowerChanged', {
      current: this.mathPower,
      max: this.maxMathPower,
      percentage: this.mathPower / this.maxMathPower,
    });
  }

  activateMathBonuses(timeBonus) {
    // Energy restoration
    if (this.mathPower >= 20) {
      this.activateBonus('energyRestore', 3000, {
        amount: 15 + Math.floor(timeBonus * 10),
      });
    }

    // Damage multiplier for streak
    if (this.streak >= 3) {
      const multiplier = 1 + this.streak * 0.1;
      this.activateBonus('damageMultiplier', 5000, { multiplier });
    }

    // Shield boost for high math power
    if (this.mathPower >= 60) {
      this.activateBonus('shieldBoost', 8000, { amount: 25 });
    }

    // Special abilities unlock
    if (this.mathPower >= 80) {
      this.emit('specialAbilityUnlocked', { type: 'mathMaster' });
    }
  }

  activateBonus(type, duration, data) {
    this.activeBonuses.set(type, data);
    this.bonusTimers.set(type, Date.now() + duration);

    this.emit('mathBonusActivated', {
      type,
      duration,
      data,
    });
  }

  updateMathBonuses(time) {
    for (const [type, endTime] of this.bonusTimers.entries()) {
      if (time >= endTime) {
        this.activeBonuses.delete(type);
        this.bonusTimers.delete(type);

        this.emit('mathBonusExpired', { type });
      }
    }
  }

  // === ADAPTIVE DIFFICULTY ===
  updatePerformanceHistory(isCorrect, responseTime) {
    this.performanceHistory.push({
      correct: isCorrect,
      responseTime,
      timestamp: Date.now(),
    });

    // Keep only recent history
    if (this.performanceHistory.length > 20) {
      this.performanceHistory.shift();
    }

    // Adjust difficulty if enough data
    if (this.performanceHistory.length >= this.difficultyAdjustmentThreshold) {
      this.adjustDifficulty();
    }
  }

  adjustDifficulty() {
    const recentPerformance = this.performanceHistory.slice(
      -this.difficultyAdjustmentThreshold
    );
    const accuracy =
      recentPerformance.filter(p => p.correct).length /
      recentPerformance.length;
    const avgResponseTime =
      recentPerformance.reduce((sum, p) => sum + p.responseTime, 0) /
      recentPerformance.length;

    // Adjust based on performance - made more forgiving
    if (accuracy >= 0.85 && avgResponseTime < this.questionTimeLimit * 0.5) {
      // Player is doing very well, increase difficulty
      this.increaseDifficulty();
    } else if (
      accuracy <= 0.3 ||
      avgResponseTime > this.questionTimeLimit * 0.95
    ) {
      // Player is struggling significantly, decrease difficulty
      this.decreaseDifficulty();
    }
  }

  increaseDifficulty() {
    // Advance topic levels
    for (const topic in this.topicProgression) {
      if (this.topicProgression[topic].mastery >= 0.8) {
        this.topicProgression[topic].level = Math.min(
          5,
          this.topicProgression[topic].level + 1
        );
      }
    }

    this.log('Difficulty increased based on performance');
  }

  decreaseDifficulty() {
    // Reduce topic levels slightly
    for (const topic in this.topicProgression) {
      if (this.topicProgression[topic].mastery <= 0.4) {
        this.topicProgression[topic].level = Math.max(
          1,
          this.topicProgression[topic].level - 1
        );
      }
    }

    this.log('Difficulty decreased to help player');
  }

  // === EDUCATIONAL PROGRESSION ===
  updateTopicMastery(topic, isCorrect) {
    if (!this.topicProgression[topic]) return;

    const current = this.topicProgression[topic].mastery;
    const adjustment = isCorrect ? 0.1 : -0.05;

    this.topicProgression[topic].mastery = Math.max(
      0,
      Math.min(1, current + adjustment)
    );

    // Check for level advancement
    if (
      this.topicProgression[topic].mastery >= 0.9 &&
      this.topicProgression[topic].level < 5
    ) {
      this.topicProgression[topic].level++;
      this.emit('topicLevelUp', {
        topic,
        level: this.topicProgression[topic].level,
      });
    }
  }

  selectOptimalTopic() {
    // Select topic that needs the most work
    let lowestMastery = 1;
    let selectedTopic = 'addition';

    for (const [topic, data] of Object.entries(this.topicProgression)) {
      if (data.level > 0 && data.mastery < lowestMastery) {
        lowestMastery = data.mastery;
        selectedTopic = topic;
      }
    }

    return selectedTopic;
  }

  // === QUICK CHALLENGES ===
  checkQuickChallenges(time) {
    if (!this.quickChallengeActive && time >= this.quickChallengeTimer) {
      this.startQuickChallenge();
    }
  }

  startQuickChallenge() {
    this.quickChallengeActive = true;
    const question = this.generateQuestion();

    this.emit('quickChallengeStarted', {
      question: question.question,
      choices: question.choices,
      timeLimit: 12000, // Increased from 8000ms to 12 seconds for quick challenge
      reward: 'Combat bonus for 10 seconds',
    });

    this.currentQuestion = question;
    this.questionStartTime = Date.now();

    // Set next challenge timer
    this.quickChallengeTimer = Date.now() + this.quickChallengeInterval;
  }

  // === PUBLIC API ===
  getMathPower() {
    return this.mathPower;
  }

  getMathPowerPercentage() {
    return this.mathPower / this.maxMathPower;
  }

  getActiveBonus(type) {
    return this.activeBonuses.get(type);
  }

  getTopicProgression() {
    return { ...this.topicProgression };
  }

  getPerformanceStats() {
    return {
      questionsAnswered: this.questionsAnswered,
      correctAnswers: this.correctAnswers,
      accuracy:
        this.questionsAnswered > 0
          ? this.correctAnswers / this.questionsAnswered
          : 0,
      currentStreak: this.streak,
      maxStreak: this.maxStreak,
      mathPower: this.mathPower,
    };
  }

  // === MATH ABILITIES ===
  onMathAbilityRequested(data) {
    const ability = this.mathAbilities[data.ability];
    if (!ability || ability.active || this.mathPower < ability.cost) {
      return;
    }

    // Consume math power
    this.addMathPower(-ability.cost);

    // Activate ability
    ability.active = true;
    setTimeout(() => {
      ability.active = false;
      this.emit('mathAbilityExpired', { ability: data.ability });
    }, ability.duration);

    this.emit('mathAbilityActivated', {
      ability: data.ability,
      duration: ability.duration,
      cost: ability.cost,
    });
  }

  onCleanup() {
    // Clear all timers and bonuses
    this.activeBonuses.clear();
    this.bonusTimers.clear();
    this.currentQuestion = null;
  }

  // === ADVANCED QUESTION GENERATORS ===
  generateMultiDigitAddition() {
    const a = Math.floor(Math.random() * 900) + 100; // 100-999
    const b = Math.floor(Math.random() * 900) + 100;
    const answer = a + b;

    return {
      question: `${a} + ${b} = ?`,
      answer,
      choices: this.generateChoices(answer, 4),
      type: 'multi_digit_addition',
      difficulty: 4,
    };
  }

  generateMultiDigitSubtraction() {
    const a = Math.floor(Math.random() * 900) + 200; // 200-1099
    const b = Math.floor(Math.random() * (a - 100)) + 50; // Ensure positive result
    const answer = a - b;

    return {
      question: `${a} - ${b} = ?`,
      answer,
      choices: this.generateChoices(answer, 4),
      type: 'multi_digit_subtraction',
      difficulty: 4,
    };
  }

  generateTwoDigitMultiplication() {
    const a = Math.floor(Math.random() * 90) + 10; // 10-99
    const b = Math.floor(Math.random() * 9) + 2; // 2-10
    const answer = a * b;

    return {
      question: `${a} × ${b} = ?`,
      answer,
      choices: this.generateChoices(answer, 4),
      type: 'two_digit_multiplication',
      difficulty: 4,
    };
  }

  generateDivisionWithRemainder() {
    const divisor = Math.floor(Math.random() * 8) + 3; // 3-10
    const quotient = Math.floor(Math.random() * 15) + 5; // 5-19
    const remainder = Math.floor(Math.random() * (divisor - 1)) + 1; // 1 to divisor-1
    const dividend = divisor * quotient + remainder;

    return {
      question: `${dividend} ÷ ${divisor} = ? remainder ?`,
      answer: `${quotient} R${remainder}`,
      choices: [
        `${quotient} R${remainder}`,
        `${quotient + 1} R${remainder - 1}`,
        `${quotient - 1} R${remainder + 1}`,
        `${quotient} R${remainder + 1}`,
      ],
      type: 'division_with_remainder',
      difficulty: 3,
    };
  }

  generateLongDivision() {
    const divisor = Math.floor(Math.random() * 90) + 10; // 10-99
    const quotient = Math.floor(Math.random() * 90) + 10; // 10-99
    const dividend = divisor * quotient;

    return {
      question: `${dividend} ÷ ${divisor} = ?`,
      answer: quotient,
      choices: this.generateChoices(quotient, 4),
      type: 'long_division',
      difficulty: 4,
    };
  }

  generateWordProblemSubtraction() {
    const scenarios = [
      'A library had {a} books. They lent out {b} books. How many books are left?',
      'Tom had {a} stickers. He gave {b} stickers to his friend. How many stickers does Tom have now?',
      'A parking lot had {a} cars. {b} cars left. How many cars are still in the parking lot?',
    ];

    const a = Math.floor(Math.random() * 50) + 20;
    const b = Math.floor(Math.random() * (a - 5)) + 5;
    const answer = a - b;
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

    return {
      question: scenario.replace('{a}', a).replace('{b}', b),
      answer,
      choices: this.generateChoices(answer, 4),
      type: 'word_problem_subtraction',
      difficulty: this.calculateQuestionDifficulty(a, b, 'subtraction') + 1,
    };
  }

  generateWordProblemMultiplication() {
    const scenarios = [
      'Each box contains {a} pencils. If there are {b} boxes, how many pencils are there in total?',
      'A garden has {a} rows of flowers with {b} flowers in each row. How many flowers are there?',
      'If one pizza has {a} slices and you order {b} pizzas, how many slices do you have?',
    ];

    const a = Math.floor(Math.random() * 8) + 3;
    const b = Math.floor(Math.random() * 8) + 3;
    const answer = a * b;
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

    return {
      question: scenario.replace('{a}', a).replace('{b}', b),
      answer,
      choices: this.generateChoices(answer, 4),
      type: 'word_problem_multiplication',
      difficulty: this.calculateQuestionDifficulty(a, b, 'multiplication') + 1,
    };
  }

  generateWordProblemDivision() {
    const scenarios = [
      'There are {a} cookies to be shared equally among {b} children. How many cookies does each child get?',
      'A teacher has {a} stickers to give equally to {b} students. How many stickers per student?',
      'If {a} apples are packed into bags of {b} apples each, how many bags are needed?',
    ];

    const b = Math.floor(Math.random() * 8) + 2; // divisor
    const answer = Math.floor(Math.random() * 10) + 2; // quotient
    const a = b * answer; // dividend
    const scenario = scenarios[Math.floor(Math.random() * scenarios.length)];

    return {
      question: scenario.replace('{a}', a).replace('{b}', b),
      answer,
      choices: this.generateChoices(answer, 4),
      type: 'word_problem_division',
      difficulty: this.calculateQuestionDifficulty(a, b, 'division') + 1,
    };
  }

  // === UTILITY METHODS ===
  updateQuestionTimer(time) {
    if (this.currentQuestion && this.questionStartTime) {
      const elapsed = time - this.questionStartTime;
      if (elapsed > this.questionTimeLimit) {
        // Time's up - treat as incorrect answer
        this.handleIncorrectAnswer();
        this.emit('mathQuizTimeout', {
          question: this.currentQuestion.question,
          correctAnswer: this.currentQuestion.answer,
        });
        this.currentQuestion = null;
      }
    }
  }

  updateMathPowerDecay(time, delta) {
    // Slowly decay math power over time to encourage continuous engagement
    if (this.mathPower > 0) {
      const decayRate = 0.5; // points per second
      const decay = (decayRate * delta) / 1000;
      this.addMathPower(-decay);
    }
  }

  calculateBonusesEarned(isCorrect, timeBonus) {
    const bonuses = [];

    if (isCorrect) {
      bonuses.push('Math Power');

      if (timeBonus > 0.7) {
        bonuses.push('Speed Bonus');
      }

      if (this.streak >= 3) {
        bonuses.push('Streak Bonus');
      }

      if (this.mathPower >= 60) {
        bonuses.push('Shield Boost');
      }
    }

    return bonuses;
  }

  // === EVENT HANDLERS ===
  onWaveStarted(data) {
    // Trigger math quiz at wave start
    setTimeout(() => {
      this.startMathQuiz({
        topic: this.selectOptimalTopic(),
        level: Math.min(data.wave, 5),
      });
    }, 500); // Reduced from 2000ms to 500ms for faster question appearance
  }

  onEnemyDefeated(data) {
    // Small math power bonus for defeating enemies
    this.addMathPower(2);
  }

  onPlayerDamaged(data) {
    // Lose some math power when taking damage
    this.addMathPower(-5);
  }

  onEnemySpawned(data) {
    // Trigger math question on enemy encounter with chance and cooldown
    const trigger = this.mathTriggers.enemyEncounter;
    const now = Date.now();

    if (
      trigger.enabled &&
      Math.random() < trigger.chance &&
      now - trigger.lastTriggered > trigger.cooldown
    ) {
      trigger.lastTriggered = now;
      this.startContextualMathQuiz('enemyEncounter', {
        context: 'An enemy approaches! Solve this to gain combat advantage:',
        urgency: 'medium',
        enemyData: data,
      });
    }
  }

  onPlayerHealthLow(data) {
    // Trigger emergency math question when health is low
    const trigger = this.mathTriggers.lowHealth;
    const now = Date.now();

    if (
      trigger.enabled &&
      data.healthPercentage <= trigger.threshold &&
      now - trigger.lastTriggered > trigger.cooldown
    ) {
      trigger.lastTriggered = now;
      this.startContextualMathQuiz('lowHealth', {
        context: 'Emergency! Solve this math problem to restore health:',
        urgency: 'high',
        healthData: data,
      });
    }
  }

  onBossEncounter(data) {
    // Trigger math question for boss encounters
    const trigger = this.mathTriggers.bossEncounter;
    const now = Date.now();

    if (
      trigger.enabled &&
      Math.random() < trigger.chance &&
      now - trigger.lastTriggered > trigger.cooldown
    ) {
      trigger.lastTriggered = now;
      this.startContextualMathQuiz('bossEncounter', {
        context: 'Boss battle! Master this math to unlock special powers:',
        urgency: 'high',
        bossData: data,
      });
    }
  }

  onPowerUpRequested(data) {
    // Always trigger math question for power-up requests
    const trigger = this.mathTriggers.powerUpRequest;
    const now = Date.now();

    if (trigger.enabled && now - trigger.lastTriggered > trigger.cooldown) {
      trigger.lastTriggered = now;
      this.startContextualMathQuiz('powerUpRequest', {
        context: `Solve this to activate ${data.powerType}:`,
        urgency: 'medium',
        powerData: data,
      });
    }
  }

  onSpecialAbilityRequested(data) {
    // Trigger math question for special abilities
    this.startContextualMathQuiz('specialAbility', {
      context: `Calculate correctly to use ${data.abilityName}:`,
      urgency: 'high',
      abilityData: data,
    });
  }

  startContextualMathQuiz(triggerType, contextData) {
    // Generate question based on context
    const question = this.generateContextualQuestion(triggerType, contextData);

    // Add context information to the question
    question.triggerType = triggerType;
    question.contextData = contextData;
    question.timeLimit = this.getContextualTimeLimit(triggerType);

    // Start the quiz
    this.startMathQuiz({ question, contextual: true });

    this.log(`Started contextual math quiz: ${triggerType}`);
  }

  generateContextualQuestion(triggerType, contextData) {
    // Generate questions that match the context
    let question;

    switch (triggerType) {
      case 'enemyEncounter':
        // Generate combat-themed questions
        question = this.generateCombatMathQuestion();
        break;
      case 'lowHealth':
        // Generate simpler questions for emergency situations
        question = this.generateEmergencyMathQuestion();
        break;
      case 'bossEncounter':
        // Generate harder questions for boss fights
        question = this.generateBossMathQuestion();
        break;
      case 'powerUpRequest':
        // Generate questions related to the power type
        question = this.generatePowerMathQuestion(contextData.powerData);
        break;
      default:
        question = this.generateQuestion();
    }

    return question;
  }

  generateCombatMathQuestion() {
    // Combat-themed math questions
    const templates = [
      () => {
        const damage = Math.floor(Math.random() * 20) + 10;
        const enemies = Math.floor(Math.random() * 4) + 2;
        const answer = damage * enemies;
        return {
          question: `You deal ${damage} damage to each of ${enemies} enemies. Total damage?`,
          answer,
          choices: this.generateChoices(answer, 4),
          type: 'multiplication',
          theme: 'combat',
        };
      },
      () => {
        const health = Math.floor(Math.random() * 50) + 50;
        const damage = Math.floor(Math.random() * 30) + 10;
        const answer = health - damage;
        return {
          question: `Enemy has ${health} HP. You deal ${damage} damage. Remaining HP?`,
          answer,
          choices: this.generateChoices(answer, 4),
          type: 'subtraction',
          theme: 'combat',
        };
      },
    ];

    return templates[Math.floor(Math.random() * templates.length)]();
  }

  generateEmergencyMathQuestion() {
    // Simpler questions for emergency situations
    const a = Math.floor(Math.random() * 10) + 1;
    const b = Math.floor(Math.random() * 10) + 1;
    const answer = a + b;

    return {
      question: `Quick! ${a} + ${b} = ?`,
      answer,
      choices: this.generateChoices(answer, 4),
      type: 'addition',
      theme: 'emergency',
      difficulty: 1,
    };
  }

  generateBossMathQuestion() {
    // Harder questions for boss encounters
    const a = Math.floor(Math.random() * 15) + 10;
    const b = Math.floor(Math.random() * 12) + 2;
    const answer = a * b;

    return {
      question: `Boss Challenge: ${a} × ${b} = ?`,
      answer,
      choices: this.generateChoices(answer, 4),
      type: 'multiplication',
      theme: 'boss',
      difficulty: 4,
    };
  }

  generatePowerMathQuestion(powerData) {
    // Questions themed around the requested power
    const powerType = powerData?.powerType || 'energy';

    if (powerType === 'shield') {
      const base = Math.floor(Math.random() * 20) + 10;
      const multiplier = Math.floor(Math.random() * 3) + 2;
      const answer = base * multiplier;
      return {
        question: `Shield power: ${base} × ${multiplier} = ?`,
        answer,
        choices: this.generateChoices(answer, 4),
        type: 'multiplication',
        theme: 'shield',
      };
    }
    return this.generateQuestion();
  }

  getContextualTimeLimit(triggerType) {
    // Different time limits based on context - all increased for better user experience
    switch (triggerType) {
      case 'lowHealth':
        return 12000; // Increased from 8000ms to 12 seconds for emergency situations
      case 'bossEncounter':
        return 25000; // Increased from 20000ms to 25 seconds for boss questions
      case 'enemyEncounter':
        return 18000; // Increased from 12000ms to 18 seconds for combat
      default:
        return this.questionTimeLimit;
    }
  }
}
