import { GameSystem } from './GameSystem.js';
import { GameConfig } from '../../shared/index.js';

/**
 * UI Manager System - Handles all UI elements with performance optimizations
 * Only updates UI when underlying state changes
 */
export class UIManager extends GameSystem {
  constructor(scene, config = {}) {
    super(scene, {
      updateThrottle: GameConfig.performance.uiUpdateThrottle,
      ...config,
    });

    // UI Elements
    this.elements = new Map();
    this.containers = new Map();
    this.animations = new Map();

    // State tracking for efficient updates
    this.lastState = {};
    this.dirtyElements = new Set();

    // UI Pools for performance
    this.damageNumberPool = [];
    this.particlePool = [];
    this.tweenPool = [];

    // Math gauge system
    this.mathGauge = {
      value: 0,
      maxValue: GameConfig.math.mathGauge.maxValue,
      element: null,
      background: null,
      fill: null,
      text: null,
    };

    // Combat UI state
    this.combatUI = {
      healthBar: null,
      shieldBar: null,
      energyBar: null,
      weaponDisplay: null,
      waveDisplay: null,
      scoreDisplay: null,
      comboDisplay: null,
      abilityButtons: new Map(),
      mathPowerBar: null,
      streakDisplay: null,
      bonusesDisplay: null,
      mathPerformanceDisplay: null,
      quickChallengeNotification: null,
    };

    // Math quiz UI
    this.mathUI = {
      container: null,
      questionText: null,
      answerButtons: [],
      timerBar: null,
      feedbackText: null,
    };

    // Pause UI
    this.pauseUI = {
      overlay: null,
      container: null,
      title: null,
      resumeButton: null,
      menuButton: null,
      background: null,
    };

    // Game state
    this.isPaused = false;

    // Performance tracking
    this.uiMetrics = {
      elementsCreated: 0,
      elementsDestroyed: 0,
      updatesSkipped: 0,
      animationsActive: 0,
    };
  }

  async onInit() {
    this.log('Initializing UI Manager...');

    // Create UI containers first
    this.createUIContainers();

    // Initialize object pools
    this.initializePools();

    // Create enhanced HUD elements
    this.createEnhancedHUD();

    // Set up event listeners
    this.setupEventListeners();

    // Initialize UI state
    this.initializeUIState();

    this.log('UI Manager initialized with enhanced HUD');
  }

  setupEventListeners() {
    // Enhanced event listeners for the new HUD system
    this.on('playerHealthChanged', this.updateHealthBar);
    this.on('playerShieldChanged', this.updateShieldBar);
    this.on('mathPowerChanged', this.updateMathPowerMeter);
    this.on('weaponChanged', this.updateWeaponDisplay);
    this.on('scoreChanged', this.updateScore);
    this.on('waveChanged', this.updateWave);
    this.on('accuracyChanged', this.updateAccuracy);
    this.on('enemyCountChanged', this.updateEnemyCount);
    this.on('streakChanged', this.updateStreak);
    this.on('abilityActivated', this.updateAbilityDisplay);
    this.on('abilityOnCooldown', this.updateAbilityCooldown);

    // Math integration events
    this.on('mathAnswerCorrect', this.onMathAnswerCorrect);
    this.on('mathAnswerIncorrect', this.onMathAnswerIncorrect);
    this.on('mathQuizStarted', this.showMathQuiz);
    this.on('mathQuizCompleted', this.hideMathQuiz);

    // Pause events
    this.on('gamePause', this.togglePause);
    this.on('gameResume', this.resumeGame);
    this.on('pauseRequested', this.pauseGame);

    // Combat events
    this.on('enemySpawned', this.addEnemyToMiniMap);
    this.on('enemyDefeated', this.removeEnemyFromMiniMap);
    this.on('playerMoved', this.updateMiniMapPlayer);

    this.log('Enhanced event listeners set up');
  }

  initializePools() {
    // Damage number pool
    for (let i = 0; i < GameConfig.performance.poolSizes.damageNumbers; i++) {
      const damageNumber = this.createDamageNumber();
      damageNumber.setVisible(false);
      this.damageNumberPool.push(damageNumber);
    }

    this.log(
      `Initialized pools: ${this.damageNumberPool.length} damage numbers`
    );
  }

  createUIContainers() {
    // Main HUD container
    const hudContainer = this.scene.add.container(0, 0);
    hudContainer.setDepth(1000);
    this.containers.set('hud', hudContainer);

    // Combat UI container
    const combatContainer = this.scene.add.container(0, 0);
    combatContainer.setDepth(1001);
    this.containers.set('combat', combatContainer);

    // Math UI container
    const mathContainer = this.scene.add.container(0, 0);
    mathContainer.setDepth(1002);
    mathContainer.setVisible(false);
    this.containers.set('math', mathContainer);

    // Effects container
    const effectsContainer = this.scene.add.container(0, 0);
    effectsContainer.setDepth(999);
    this.containers.set('effects', effectsContainer);
  }

  createCombatUI() {
    const combatContainer = this.containers.get('combat');
    const config = GameConfig.ui;

    // Health bar
    this.combatUI.healthBar = this.createProgressBar(
      20,
      20,
      200,
      20,
      config.colors.danger,
      'Health'
    );
    combatContainer.add(this.combatUI.healthBar.container);

    // Shield bar
    this.combatUI.shieldBar = this.createProgressBar(
      20,
      50,
      200,
      15,
      config.colors.primary,
      'Shield'
    );
    combatContainer.add(this.combatUI.shieldBar.container);

    // Energy bar
    this.combatUI.energyBar = this.createProgressBar(
      20,
      75,
      200,
      15,
      config.colors.warning,
      'Energy'
    );
    combatContainer.add(this.combatUI.energyBar.container);

    // Math Power bar - NEW
    this.combatUI.mathPowerBar = this.createProgressBar(
      20,
      105,
      200,
      20,
      0x9966ff,
      'Math Power'
    );
    combatContainer.add(this.combatUI.mathPowerBar.container);

    // Math Streak display - NEW
    this.combatUI.streakDisplay = this.scene.add
      .text(20, 140, 'Streak: 0', {
        fontSize: config.fonts.sizes.medium,
        fontFamily: config.fonts.primary,
        color: '#ffff00',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0, 0);
    combatContainer.add(this.combatUI.streakDisplay);

    // Active Math Bonuses display - NEW
    this.combatUI.bonusesDisplay = this.scene.add
      .text(20, 165, '', {
        fontSize: config.fonts.sizes.small,
        fontFamily: config.fonts.primary,
        color: '#00ff88',
        stroke: '#000000',
        strokeThickness: 1,
      })
      .setOrigin(0, 0);
    combatContainer.add(this.combatUI.bonusesDisplay);

    // Wave display
    this.combatUI.waveDisplay = this.scene.add
      .text(this.scene.cameras.main.width - 20, 20, 'Wave 1', {
        fontSize: config.fonts.sizes.large,
        fontFamily: config.fonts.primary,
        color: '#ffffff',
      })
      .setOrigin(1, 0);
    combatContainer.add(this.combatUI.waveDisplay);

    // Score display
    this.combatUI.scoreDisplay = this.scene.add
      .text(this.scene.cameras.main.width - 20, 60, 'Score: 0', {
        fontSize: config.fonts.sizes.medium,
        fontFamily: config.fonts.primary,
        color: '#ffffff',
      })
      .setOrigin(1, 0);
    combatContainer.add(this.combatUI.scoreDisplay);

    // Math Performance display - NEW
    this.combatUI.mathPerformanceDisplay = this.scene.add
      .text(this.scene.cameras.main.width - 20, 100, 'Accuracy: 0%', {
        fontSize: config.fonts.sizes.small,
        fontFamily: config.fonts.primary,
        color: '#ffff88',
      })
      .setOrigin(1, 0);
    combatContainer.add(this.combatUI.mathPerformanceDisplay);

    // Combo display
    this.combatUI.comboDisplay = this.scene.add
      .text(this.scene.cameras.main.width / 2, 100, '', {
        fontSize: config.fonts.sizes.xlarge,
        fontFamily: config.fonts.primary,
        color: '#ffff00',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5, 0)
      .setVisible(false);
    combatContainer.add(this.combatUI.comboDisplay);

    // Weapon display
    this.combatUI.weaponDisplay = this.scene.add
      .text(20, this.scene.cameras.main.height - 60, 'Weapon: Rapid Fire', {
        fontSize: config.fonts.sizes.medium,
        fontFamily: config.fonts.primary,
        color: '#ffffff',
      })
      .setOrigin(0, 1);
    combatContainer.add(this.combatUI.weaponDisplay);

    // Ability buttons
    this.createAbilityButtons();

    // Quick Challenge notification area - NEW
    this.combatUI.quickChallengeNotification = this.scene.add
      .text(this.scene.cameras.main.width / 2, 50, '', {
        fontSize: config.fonts.sizes.large,
        fontFamily: config.fonts.primary,
        color: '#ff8800',
        stroke: '#000000',
        strokeThickness: 2,
        align: 'center',
      })
      .setOrigin(0.5, 0)
      .setVisible(false);
    combatContainer.add(this.combatUI.quickChallengeNotification);
  }

  createAbilityButtons() {
    const abilities = Object.keys(GameConfig.abilities);
    const buttonWidth = 60;
    const buttonHeight = 60;
    const spacing = 10;
    const startX =
      this.scene.cameras.main.width -
      abilities.length * (buttonWidth + spacing);
    const startY = this.scene.cameras.main.height - 80;

    abilities.forEach((abilityKey, index) => {
      const ability = GameConfig.abilities[abilityKey];
      const x = startX + index * (buttonWidth + spacing);

      const button = this.createAbilityButton(
        x,
        startY,
        buttonWidth,
        buttonHeight,
        ability,
        abilityKey
      );
      this.combatUI.abilityButtons.set(abilityKey, button);
      this.containers.get('combat').add(button.container);
    });
  }

  createAbilityButton(x, y, width, height, ability, key) {
    const container = this.scene.add.container(x, y);

    // Background
    const background = this.scene.add.rectangle(
      0,
      0,
      width,
      height,
      0x333333,
      0.8
    );
    background.setStrokeStyle(2, ability.color);

    // Icon
    const icon = this.scene.add
      .text(0, -10, ability.icon, {
        fontSize: '24px',
        fontFamily: GameConfig.ui.fonts.primary,
      })
      .setOrigin(0.5);

    // Cooldown overlay
    const cooldownOverlay = this.scene.add.rectangle(
      0,
      0,
      width,
      height,
      0x000000,
      0.7
    );
    cooldownOverlay.setVisible(false);

    // Cooldown text
    const cooldownText = this.scene.add
      .text(0, 10, '', {
        fontSize: '12px',
        fontFamily: GameConfig.ui.fonts.primary,
        color: '#ffffff',
      })
      .setOrigin(0.5);

    container.add([background, icon, cooldownOverlay, cooldownText]);

    // Make interactive
    background.setInteractive();
    background.on('pointerdown', () => {
      this.emit('abilityRequested', { ability: key });
    });

    return {
      container,
      background,
      icon,
      cooldownOverlay,
      cooldownText,
      ability,
      key,
      isOnCooldown: false,
      cooldownEndTime: 0,
    };
  }

  createMathGauge() {
    const x = this.scene.cameras.main.width / 2;
    const y = 150;
    const width = 300;
    const height = 20;

    // Background
    this.mathGauge.background = this.scene.add.rectangle(
      x,
      y,
      width,
      height,
      0x333333,
      0.8
    );
    this.mathGauge.background.setStrokeStyle(2, GameConfig.ui.colors.primary);

    // Fill
    this.mathGauge.fill = this.scene.add.rectangle(
      x - width / 2,
      y,
      0,
      height - 4,
      GameConfig.ui.colors.primary
    );
    this.mathGauge.fill.setOrigin(0, 0.5);

    // Text
    this.mathGauge.text = this.scene.add
      .text(x, y - 30, 'Math Power', {
        fontSize: GameConfig.ui.fonts.sizes.medium,
        fontFamily: GameConfig.ui.fonts.primary,
        color: '#ffffff',
      })
      .setOrigin(0.5);

    // Add to HUD
    const hudContainer = this.containers.get('hud');
    hudContainer.add([
      this.mathGauge.background,
      this.mathGauge.fill,
      this.mathGauge.text,
    ]);

    this.mathGauge.element = {
      background: this.mathGauge.background,
      fill: this.mathGauge.fill,
      text: this.mathGauge.text,
      width: width - 4,
    };
  }

  createProgressBar(x, y, width, height, color, label) {
    const container = this.scene.add.container(x, y);

    // Background
    const background = this.scene.add.rectangle(
      0,
      0,
      width,
      height,
      0x333333,
      0.8
    );
    background.setStrokeStyle(1, 0xffffff);

    // Fill
    const fill = this.scene.add.rectangle(
      -width / 2,
      0,
      width,
      height - 2,
      color
    );
    fill.setOrigin(0, 0.5);

    // Label
    const labelText = this.scene.add
      .text(-width / 2, -height / 2 - 15, label, {
        fontSize: GameConfig.ui.fonts.sizes.small,
        fontFamily: GameConfig.ui.fonts.primary,
        color: '#ffffff',
      })
      .setOrigin(0, 1);

    // Value text
    const valueText = this.scene.add
      .text(width / 2, -height / 2 - 15, '100/100', {
        fontSize: GameConfig.ui.fonts.sizes.small,
        fontFamily: GameConfig.ui.fonts.primary,
        color: '#ffffff',
      })
      .setOrigin(1, 1);

    container.add([background, fill, labelText, valueText]);

    return {
      container,
      background,
      fill,
      labelText,
      valueText,
      width: width - 2,
      maxValue: 100,
      currentValue: 100,
    };
  }

  createMathQuizUI() {
    const mathContainer = this.containers.get('math');
    const centerX = this.scene.cameras.main.width / 2;
    const centerY = this.scene.cameras.main.height / 2;

    // Background panel
    const panel = this.scene.add.rectangle(
      centerX,
      centerY,
      600,
      400,
      0x000000,
      0.9
    );
    panel.setStrokeStyle(3, GameConfig.ui.colors.primary);

    // Question text
    this.mathUI.questionText = this.scene.add
      .text(centerX, centerY - 100, '', {
        fontSize: GameConfig.ui.fonts.sizes.large,
        fontFamily: GameConfig.ui.fonts.primary,
        color: '#ffffff',
        align: 'center',
        wordWrap: { width: 500 },
      })
      .setOrigin(0.5);

    // Answer buttons
    this.mathUI.answerButtons = [];
    const buttonPositions = [
      { x: centerX - 150, y: centerY + 20 },
      { x: centerX + 150, y: centerY + 20 },
      { x: centerX - 150, y: centerY + 80 },
      { x: centerX + 150, y: centerY + 80 },
    ];

    buttonPositions.forEach((pos, index) => {
      const button = this.createAnswerButton(pos.x, pos.y, index);
      this.mathUI.answerButtons.push(button);
      mathContainer.add(button.container);
    });

    // Timer bar
    this.mathUI.timerBar = this.createProgressBar(
      centerX - 200,
      centerY - 150,
      400,
      15,
      GameConfig.ui.colors.warning,
      'Time'
    );

    // Feedback text
    this.mathUI.feedbackText = this.scene.add
      .text(centerX, centerY + 150, '', {
        fontSize: GameConfig.ui.fonts.sizes.large,
        fontFamily: GameConfig.ui.fonts.primary,
        color: '#ffffff',
        align: 'center',
      })
      .setOrigin(0.5);

    mathContainer.add([
      panel,
      this.mathUI.questionText,
      this.mathUI.timerBar.container,
      this.mathUI.feedbackText,
    ]);
  }

  createAnswerButton(x, y, index) {
    const container = this.scene.add.container(x, y);

    const background = this.scene.add.rectangle(0, 0, 120, 40, 0x444444, 0.9);
    background.setStrokeStyle(2, GameConfig.ui.colors.secondary);

    const text = this.scene.add
      .text(0, 0, '', {
        fontSize: GameConfig.ui.fonts.sizes.medium,
        fontFamily: GameConfig.ui.fonts.primary,
        color: '#ffffff',
      })
      .setOrigin(0.5);

    container.add([background, text]);

    // Make interactive
    background.setInteractive();
    background.on('pointerdown', () => {
      this.emit('mathAnswerSelected', { index, answer: text.text });
    });

    background.on('pointerover', () => {
      background.setFillStyle(0x666666, 0.9);
    });

    background.on('pointerout', () => {
      background.setFillStyle(0x444444, 0.9);
    });

    return {
      container,
      background,
      text,
      index,
    };
  }

  onUpdate(time, delta) {
    // Update ability button cooldowns
    this.updateAbilityCooldowns(time);

    // Update active animations
    this.updateAnimations(time, delta);

    // Process dirty elements
    this.processDirtyElements();
  }

  updateAbilityCooldowns(time) {
    this.combatUI.abilityButtons.forEach(button => {
      if (button.isOnCooldown && time >= button.cooldownEndTime) {
        button.isOnCooldown = false;
        button.cooldownOverlay.setVisible(false);
        button.cooldownText.setText('');
      } else if (button.isOnCooldown) {
        const remaining = Math.ceil((button.cooldownEndTime - time) / 1000);
        button.cooldownText.setText(remaining.toString());
      }
    });
  }

  updateAnimations(time, delta) {
    // Update damage number animations
    this.damageNumberPool.forEach(damageNumber => {
      if (damageNumber.visible && damageNumber.animationData) {
        this.updateDamageNumberAnimation(damageNumber, time, delta);
      }
    });
  }

  updateDamageNumberAnimation(damageNumber, time, delta) {
    const data = damageNumber.animationData;
    const elapsed = time - data.startTime;
    const progress = elapsed / data.duration;

    if (progress >= 1) {
      this.returnDamageNumberToPool(damageNumber);
      return;
    }

    // Update position and alpha
    damageNumber.y = data.startY - data.riseDistance * progress;
    damageNumber.setAlpha(1 - progress);
  }

  processDirtyElements() {
    if (this.dirtyElements.size === 0) return;

    this.dirtyElements.forEach(elementKey => {
      this.updateElement(elementKey);
    });

    this.dirtyElements.clear();
  }

  updateElement(elementKey) {
    // Override in specific update methods
    switch (elementKey) {
      case 'healthBar':
        this.updateHealthBar();
        break;
      case 'shieldBar':
        this.updateShieldBar();
        break;
      case 'energyBar':
        this.updateEnergyBar();
        break;
      case 'mathGauge':
        this.updateMathGaugeDisplay();
        break;
      case 'score':
        this.updateScoreDisplay();
        break;
      case 'combo':
        this.updateComboDisplay();
        break;
    }
  }

  // UI Update Methods
  updateProgressBar(progressBar, current, max) {
    if (!progressBar) return;

    const percentage = Math.max(0, Math.min(1, current / max));
    progressBar.fill.setDisplaySize(
      progressBar.width * percentage,
      progressBar.fill.height
    );
    progressBar.valueText.setText(`${Math.floor(current)}/${Math.floor(max)}`);
    progressBar.currentValue = current;
    progressBar.maxValue = max;
  }

  updateHealthBar() {
    if (this.lastState.playerHealth !== undefined) {
      this.updateProgressBar(
        this.combatUI.healthBar,
        this.lastState.playerHealth,
        this.lastState.playerMaxHealth || 100
      );
    }
  }

  updateShieldBar() {
    if (this.lastState.playerShield !== undefined) {
      this.updateProgressBar(
        this.combatUI.shieldBar,
        this.lastState.playerShield,
        this.lastState.playerMaxShield || 100
      );
    }
  }

  updateEnergyBar() {
    if (this.lastState.playerEnergy !== undefined) {
      this.updateProgressBar(
        this.combatUI.energyBar,
        this.lastState.playerEnergy,
        this.lastState.playerMaxEnergy || 100
      );
    }
  }

  updateMathGaugeDisplay() {
    if (this.mathGauge.element && this.mathGauge.value !== undefined) {
      const percentage = this.mathGauge.value / this.mathGauge.maxValue;
      this.mathGauge.fill.setDisplaySize(
        this.mathGauge.element.width * percentage,
        this.mathGauge.fill.height
      );
    }
  }

  updateScoreDisplay() {
    if (this.combatUI.scoreDisplay && this.lastState.score !== undefined) {
      this.combatUI.scoreDisplay.setText(`Score: ${this.lastState.score}`);
    }
  }

  updateComboDisplay() {
    if (this.combatUI.comboDisplay && this.lastState.combo !== undefined) {
      if (this.lastState.combo > 1) {
        this.combatUI.comboDisplay.setText(`${this.lastState.combo}x COMBO!`);
        this.combatUI.comboDisplay.setVisible(true);

        // Animate combo display
        this.scene.tweens.add({
          targets: this.combatUI.comboDisplay,
          scaleX: 1.2,
          scaleY: 1.2,
          duration: 200,
          yoyo: true,
          ease: 'Power2',
        });
      } else {
        this.combatUI.comboDisplay.setVisible(false);
      }
    }
  }

  // Damage Number System
  createDamageNumber() {
    const text = this.scene.add
      .text(0, 0, '', {
        fontSize: GameConfig.effects.damageNumbers.fontSize,
        fontFamily: GameConfig.effects.damageNumbers.fontFamily,
        color: GameConfig.effects.damageNumbers.colors.normal,
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    this.containers.get('effects').add(text);
    this.uiMetrics.elementsCreated++;

    return text;
  }

  showDamageNumber(x, y, damage, type = 'normal') {
    const damageNumber = this.getDamageNumberFromPool();
    if (!damageNumber) return;

    const config = GameConfig.effects.damageNumbers;
    const color = config.colors[type] || config.colors.normal;

    damageNumber.setText(damage.toString());
    damageNumber.setPosition(x, y);
    damageNumber.setStyle({ color });
    damageNumber.setVisible(true);
    damageNumber.setAlpha(1);

    // Set animation data
    damageNumber.animationData = {
      startTime: Date.now(),
      startY: y,
      duration: config.animation.duration,
      riseDistance: config.animation.riseDistance,
    };
  }

  getDamageNumberFromPool() {
    for (const damageNumber of this.damageNumberPool) {
      if (!damageNumber.visible) {
        return damageNumber;
      }
    }

    // Pool exhausted, create new one if under limit
    if (
      this.damageNumberPool.length <
      GameConfig.performance.poolSizes.damageNumbers * 2
    ) {
      const newDamageNumber = this.createDamageNumber();
      this.damageNumberPool.push(newDamageNumber);
      return newDamageNumber;
    }

    return null;
  }

  returnDamageNumberToPool(damageNumber) {
    damageNumber.setVisible(false);
    damageNumber.animationData = null;
  }

  // Event Handlers
  onPlayerDamaged(data) {
    this.showDamageNumber(data.x || 400, data.y || 300, data.damage, 'normal');

    // Screen flash effect
    this.createScreenFlash(0xff0000, 0.3, 200);

    // Camera shake
    this.scene.cameras.main.shake(
      GameConfig.effects.camera.shakeDuration.medium,
      GameConfig.effects.camera.shakeIntensity.medium
    );
  }

  onEnemyHit(data) {
    const type = data.isCritical ? 'critical' : 'normal';
    this.showDamageNumber(data.enemy.x, data.enemy.y - 20, data.damage, type);

    if (data.isCritical) {
      // Camera shake for critical hits
      this.scene.cameras.main.shake(
        GameConfig.effects.camera.shakeDuration.light,
        GameConfig.effects.camera.shakeIntensity.light
      );
    }
  }

  onEnemyDefeated(data) {
    this.showDamageNumber(
      data.enemy.x,
      data.enemy.y - 30,
      `+${data.points}`,
      'heal'
    );
  }

  onWaveStarted(data) {
    this.combatUI.waveDisplay.setText(`Wave ${data.wave}`);

    // Wave start animation
    this.scene.tweens.add({
      targets: this.combatUI.waveDisplay,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 500,
      yoyo: true,
      ease: 'Power2',
    });
  }

  onMathQuizStarted(data) {
    if (!this.mathUI.container) {
      this.createMathQuizUI();
    }

    this.containers.get('math').setVisible(true);
    this.containers.get('combat').setVisible(false);
  }

  onMathQuizCompleted(data) {
    this.containers.get('math').setVisible(false);
    this.containers.get('combat').setVisible(true);
  }

  onMathAnswerCorrect(data) {
    this.mathGauge.value = Math.min(
      this.mathGauge.maxValue,
      this.mathGauge.value + GameConfig.math.mathGauge.correctAnswerValue
    );
    this.dirtyElements.add('mathGauge');

    // Update streak display
    if (data && data.streak !== undefined) {
      this.updateMathStreakDisplay(data.streak);
    }

    // Positive feedback
    this.showFeedback('Correct!', GameConfig.ui.colors.success);

    // Show power gained if available
    if (data && data.powerGained) {
      this.showPowerGainedEffect(data.powerGained);
    }
  }

  onMathAnswerIncorrect(data) {
    this.mathGauge.value = Math.max(
      0,
      this.mathGauge.value + GameConfig.math.mathGauge.incorrectAnswerPenalty
    );
    this.dirtyElements.add('mathGauge');

    // Reset streak display
    this.updateMathStreakDisplay(0);

    // Negative feedback
    this.showFeedback('Incorrect', GameConfig.ui.colors.danger);

    // Show power lost if available
    if (data && data.powerLost) {
      this.showPowerLostEffect(data.powerLost);
    }
  }

  onPlayerHealthChanged(data) {
    this.lastState.playerHealth = data.current;
    this.lastState.playerMaxHealth = data.max;
    this.dirtyElements.add('healthBar');
  }

  onPlayerShieldChanged(data) {
    this.lastState.playerShield = data.current;
    this.lastState.playerMaxShield = data.max;
    this.dirtyElements.add('shieldBar');
  }

  onPlayerEnergyChanged(data) {
    this.lastState.playerEnergy = data.current;
    this.lastState.playerMaxEnergy = data.max;
    this.dirtyElements.add('energyBar');
  }

  onScoreChanged(data) {
    this.lastState.score = data.score;
    this.dirtyElements.add('score');
  }

  onComboChanged(data) {
    this.lastState.combo = data.combo;
    this.dirtyElements.add('combo');
  }

  onAbilityUsed(data) {
    const button = this.combatUI.abilityButtons.get(data.ability);
    if (button) {
      button.isOnCooldown = true;
      button.cooldownEndTime =
        Date.now() + GameConfig.abilities[data.ability].cooldown;
      button.cooldownOverlay.setVisible(true);
    }
  }

  // === ENHANCED MATH EVENT HANDLERS ===
  onMathPowerChanged(data) {
    if (this.combatUI.mathPowerBar) {
      this.updateProgressBar(
        this.combatUI.mathPowerBar,
        data.current,
        data.max
      );
    }

    // Update math power visual effects
    if (data.percentage >= 0.8) {
      this.combatUI.mathPowerBar.fill.setTint(0xffd700); // Gold when high
    } else if (data.percentage >= 0.6) {
      this.combatUI.mathPowerBar.fill.setTint(0x00ff00); // Green when good
    } else {
      this.combatUI.mathPowerBar.fill.clearTint(); // Normal color
    }
  }

  onMathBonusActivated(data) {
    // Update bonuses display
    const bonusText = this.formatActiveBonuses(data);
    if (this.combatUI.bonusesDisplay) {
      this.combatUI.bonusesDisplay.setText(bonusText);
    }

    // Create bonus activation effect
    this.createBonusActivationEffect(data.type);
  }

  onQuickChallengeStarted(data) {
    if (this.combatUI.quickChallengeNotification) {
      this.combatUI.quickChallengeNotification.setText(
        '⚡ QUICK MATH CHALLENGE! ⚡'
      );
      this.combatUI.quickChallengeNotification.setVisible(true);

      // Animate notification
      this.scene.tweens.add({
        targets: this.combatUI.quickChallengeNotification,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 300,
        yoyo: true,
        repeat: 2,
        onComplete: () => {
          this.combatUI.quickChallengeNotification.setVisible(false);
        },
      });
    }

    // Start quick challenge UI
    this.startQuickChallengeUI(data);
  }

  onTopicLevelUp(data) {
    // Show level up notification
    const levelUpText = this.scene.add
      .text(
        this.scene.cameras.main.width / 2,
        this.scene.cameras.main.height / 2 - 100,
        `${data.topic.toUpperCase()} MASTERY LEVEL ${data.level}!`,
        {
          fontSize: '28px',
          fontFamily: GameConfig.ui.fonts.primary,
          color: '#ffd700',
          stroke: '#000000',
          strokeThickness: 3,
        }
      )
      .setOrigin(0.5)
      .setDepth(2000);

    // Animate level up text
    this.scene.tweens.add({
      targets: levelUpText,
      scaleX: 1.5,
      scaleY: 1.5,
      alpha: 0,
      y: levelUpText.y - 50,
      duration: 2000,
      ease: 'Power2',
      onComplete: () => levelUpText.destroy(),
    });
  }

  // Utility Methods
  createScreenFlash(color, alpha, duration) {
    const flash = this.scene.add.rectangle(
      this.scene.cameras.main.centerX,
      this.scene.cameras.main.centerY,
      this.scene.cameras.main.width,
      this.scene.cameras.main.height,
      color,
      alpha
    );
    flash.setDepth(2000);

    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      duration,
      onComplete: () => flash.destroy(),
    });
  }

  showFeedback(text, color) {
    if (this.mathUI.feedbackText) {
      this.mathUI.feedbackText.setText(text);
      this.mathUI.feedbackText.setColor(color);
      this.mathUI.feedbackText.setAlpha(1);

      this.scene.tweens.add({
        targets: this.mathUI.feedbackText,
        alpha: 0,
        duration: 2000,
        delay: 1000,
      });
    }
  }

  // Public API
  setMathGaugeValue(value) {
    this.mathGauge.value = Math.max(
      0,
      Math.min(this.mathGauge.maxValue, value)
    );
    this.dirtyElements.add('mathGauge');
  }

  getMathGaugeValue() {
    return this.mathGauge.value;
  }

  showMathQuestion(question, answers) {
    if (this.mathUI.questionText) {
      this.mathUI.questionText.setText(question);

      this.mathUI.answerButtons.forEach((button, index) => {
        if (index < answers.length) {
          button.text.setText(answers[index]);
          button.container.setVisible(true);
        } else {
          button.container.setVisible(false);
        }
      });
    }
  }

  updateMathTimer(timeRemaining, maxTime) {
    if (this.mathUI.timerBar) {
      this.updateProgressBar(this.mathUI.timerBar, timeRemaining, maxTime);
    }
  }

  getUIMetrics() {
    return {
      ...this.uiMetrics,
      damageNumbersActive: this.damageNumberPool.filter(dn => dn.visible)
        .length,
      dirtyElementsCount: this.dirtyElements.size,
    };
  }

  onCleanup() {
    // Clean up all UI elements
    this.containers.forEach(container => {
      if (container.destroy) {
        container.destroy();
      }
    });

    this.damageNumberPool.forEach(dn => {
      if (dn.destroy) {
        dn.destroy();
      }
    });

    this.uiMetrics.elementsDestroyed += this.uiMetrics.elementsCreated;
  }

  // === MATH INTEGRATION UTILITY METHODS ===
  formatActiveBonuses(bonusData) {
    const bonusNames = {
      energyRestore: 'Energy Boost',
      damageMultiplier: `Damage x${bonusData.data.multiplier?.toFixed(1)}`,
      shieldBoost: `Shield +${bonusData.data.amount}`,
      timeSlowdown: 'Time Slow',
      autoAim: 'Auto Aim',
    };

    return bonusNames[bonusData.type] || 'Active Bonus';
  }

  createBonusActivationEffect(bonusType) {
    const colors = {
      energyRestore: 0x00ff88,
      damageMultiplier: 0xff4444,
      shieldBoost: 0x4444ff,
      timeSlowdown: 0x9966ff,
      autoAim: 0xffff00,
    };

    const color = colors[bonusType] || 0xffffff;
    const centerX = this.scene.cameras.main.width / 2;
    const centerY = this.scene.cameras.main.height / 2;

    // Create bonus activation particles
    for (let i = 0; i < 8; i++) {
      const particle = this.scene.add.circle(centerX, centerY, 4, color);
      const angle = (i / 8) * Math.PI * 2;
      const distance = 80;

      this.scene.tweens.add({
        targets: particle,
        x: centerX + Math.cos(angle) * distance,
        y: centerY + Math.sin(angle) * distance,
        alpha: 0,
        duration: 600,
        ease: 'Power2',
        onComplete: () => particle.destroy(),
      });
    }
  }

  startQuickChallengeUI(data) {
    // Create quick challenge overlay
    const overlay = this.scene.add.container(0, 0);
    overlay.setDepth(1500);

    const centerX = this.scene.cameras.main.width / 2;
    const centerY = this.scene.cameras.main.height / 2;

    // Background
    const bg = this.scene.add.rectangle(
      centerX,
      centerY,
      400,
      200,
      0x000000,
      0.8
    );
    bg.setStrokeStyle(3, 0xff8800);

    // Question text
    const questionText = this.scene.add
      .text(centerX, centerY - 40, data.question, {
        fontSize: '20px',
        fontFamily: GameConfig.ui.fonts.primary,
        color: '#ffffff',
        align: 'center',
      })
      .setOrigin(0.5);

    // Answer buttons
    const buttonWidth = 80;
    const buttonSpacing = 20;
    const startX =
      centerX -
      (data.choices.length * buttonWidth +
        (data.choices.length - 1) * buttonSpacing) /
        2;

    data.choices.forEach((choice, index) => {
      const buttonX =
        startX + index * (buttonWidth + buttonSpacing) + buttonWidth / 2;
      const button = this.createQuickChallengeButton(
        buttonX,
        centerY + 20,
        choice,
        index
      );
      overlay.add(button.container);
    });

    // Timer bar
    const timerBg = this.scene.add.rectangle(
      centerX,
      centerY + 70,
      300,
      10,
      0x333333
    );
    const timerFill = this.scene.add.rectangle(
      centerX - 150,
      centerY + 70,
      300,
      8,
      0xff8800
    );
    timerFill.setOrigin(0, 0.5);

    overlay.add([bg, questionText, timerBg, timerFill]);

    // Animate timer
    this.scene.tweens.add({
      targets: timerFill,
      scaleX: 0,
      duration: data.timeLimit || 20000, // Updated from 15000 to match new default
      ease: 'Linear',
      onComplete: () => {
        // Time's up
        this.endQuickChallenge(overlay);
      },
    });

    // Store reference for cleanup
    this.activeQuickChallenge = overlay;
  }

  createQuickChallengeButton(x, y, text, index) {
    const container = this.scene.add.container(x, y);

    const background = this.scene.add.rectangle(0, 0, 75, 30, 0x444444, 0.9);
    background.setStrokeStyle(2, 0xff8800);

    const buttonText = this.scene.add
      .text(0, 0, text.toString(), {
        fontSize: '16px',
        fontFamily: GameConfig.ui.fonts.primary,
        color: '#ffffff',
      })
      .setOrigin(0.5);

    container.add([background, buttonText]);

    // Make interactive
    background.setInteractive();
    background.on('pointerdown', () => {
      this.emit('mathAnswerSelected', { index, answer: text });
      this.endQuickChallenge(this.activeQuickChallenge);
    });

    background.on('pointerover', () => {
      background.setFillStyle(0x666666, 0.9);
    });

    background.on('pointerout', () => {
      background.setFillStyle(0x444444, 0.9);
    });

    return { container, background, text: buttonText, index };
  }

  endQuickChallenge(overlay) {
    if (overlay) {
      overlay.destroy();
      this.activeQuickChallenge = null;
    }
  }

  updateMathStreakDisplay(streak) {
    if (this.combatUI.streakDisplay) {
      this.combatUI.streakDisplay.setText(`Streak: ${streak}`);

      // Color based on streak
      if (streak >= 5) {
        this.combatUI.streakDisplay.setColor('#ffd700'); // Gold
      } else if (streak >= 3) {
        this.combatUI.streakDisplay.setColor('#ff8800'); // Orange
      } else {
        this.combatUI.streakDisplay.setColor('#ffff00'); // Yellow
      }
    }
  }

  updateMathPerformanceDisplay(stats) {
    if (this.combatUI.mathPerformanceDisplay) {
      const accuracy = Math.round(stats.accuracy * 100);
      this.combatUI.mathPerformanceDisplay.setText(`Accuracy: ${accuracy}%`);

      // Color based on performance
      if (accuracy >= 80) {
        this.combatUI.mathPerformanceDisplay.setColor('#00ff00'); // Green
      } else if (accuracy >= 60) {
        this.combatUI.mathPerformanceDisplay.setColor('#ffff00'); // Yellow
      } else {
        this.combatUI.mathPerformanceDisplay.setColor('#ff8800'); // Orange
      }
    }
  }

  showPowerGainedEffect(powerGained) {
    // Create floating text showing power gained
    const centerX = this.scene.cameras.main.width / 2;
    const centerY = this.scene.cameras.main.height / 2;

    const powerText = this.scene.add
      .text(centerX + 50, centerY, `+${powerGained} Power!`, {
        fontSize: '18px',
        fontFamily: GameConfig.ui.fonts.primary,
        color: '#00ff88',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    this.scene.tweens.add({
      targets: powerText,
      y: centerY - 50,
      alpha: 0,
      duration: 1500,
      ease: 'Power2',
      onComplete: () => powerText.destroy(),
    });
  }

  showPowerLostEffect(powerLost) {
    // Create floating text showing power lost
    const centerX = this.scene.cameras.main.width / 2;
    const centerY = this.scene.cameras.main.height / 2;

    const powerText = this.scene.add
      .text(centerX + 50, centerY, `-${powerLost} Power`, {
        fontSize: '18px',
        fontFamily: GameConfig.ui.fonts.primary,
        color: '#ff4444',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    this.scene.tweens.add({
      targets: powerText,
      y: centerY - 50,
      alpha: 0,
      duration: 1500,
      ease: 'Power2',
      onComplete: () => powerText.destroy(),
    });
  }

  createEnhancedHUD() {
    this.log('Creating enhanced HUD system...');

    // Create HUD container
    this.hudContainer = this.scene.add.container(0, 0);
    this.hudContainer.setDepth(1000);

    // Player health bar
    this.createHealthBar();

    // Math power meter
    this.createMathPowerMeter();

    // Weapon display
    this.createWeaponDisplay();

    // Stats display
    this.createStatsDisplay();

    // Mini-map (placeholder)
    this.createMiniMap();

    // Math streak indicator
    this.createStreakIndicator();

    // Active abilities display
    this.createAbilitiesDisplay();

    this.log('Enhanced HUD created successfully');
  }

  createHealthBar() {
    const x = 20;
    const y = 20;
    const width = 200;
    const height = 20;

    // Health bar background
    this.healthBarBg = this.scene.add
      .rectangle(x, y, width, height, 0x333333)
      .setOrigin(0, 0)
      .setStrokeStyle(2, 0xffffff);

    // Health bar fill
    this.healthBarFill = this.scene.add
      .rectangle(x + 2, y + 2, width - 4, height - 4, 0x00ff00)
      .setOrigin(0, 0);

    // Shield bar
    this.shieldBarFill = this.scene.add
      .rectangle(x + 2, y + 2, width - 4, height - 4, 0x00ffff)
      .setOrigin(0, 0)
      .setAlpha(0.7);

    // Health text
    this.healthText = this.scene.add
      .text(x + width / 2, y + height / 2, '100/100', {
        fontSize: '12px',
        fontFamily: 'Courier, monospace',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 1,
      })
      .setOrigin(0.5);

    // Add to HUD
    this.hudContainer.add([
      this.healthBarBg,
      this.healthBarFill,
      this.shieldBarFill,
      this.healthText,
    ]);

    // Labels
    this.scene.add
      .text(x, y - 15, 'HEALTH', {
        fontSize: '10px',
        fontFamily: 'Courier, monospace',
        color: '#ffffff',
      })
      .setOrigin(0, 0);
  }

  createMathPowerMeter() {
    const x = 20;
    const y = 60;
    const width = 200;
    const height = 15;

    // Math power background
    this.mathPowerBg = this.scene.add
      .rectangle(x, y, width, height, 0x333333)
      .setOrigin(0, 0)
      .setStrokeStyle(2, 0xffff00);

    // Math power fill
    this.mathPowerFill = this.scene.add
      .rectangle(x + 2, y + 2, 0, height - 4, 0xffff00)
      .setOrigin(0, 0);

    // Math power text
    this.mathPowerText = this.scene.add
      .text(x + width / 2, y + height / 2, '0/100', {
        fontSize: '10px',
        fontFamily: 'Courier, monospace',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 1,
      })
      .setOrigin(0.5);

    // Add to HUD
    this.hudContainer.add([
      this.mathPowerBg,
      this.mathPowerFill,
      this.mathPowerText,
    ]);

    // Label
    this.scene.add
      .text(x, y - 12, 'MATH POWER', {
        fontSize: '10px',
        fontFamily: 'Courier, monospace',
        color: '#ffff00',
      })
      .setOrigin(0, 0);
  }

  createWeaponDisplay() {
    const x = this.scene.scale.width - 150;
    const y = 20;

    // Weapon background
    this.weaponBg = this.scene.add
      .rectangle(x, y, 120, 60, 0x333333, 0.8)
      .setOrigin(0, 0)
      .setStrokeStyle(2, 0x00ff00);

    // Weapon name
    this.weaponNameText = this.scene.add
      .text(x + 60, y + 15, 'RAPID FIRE', {
        fontSize: '12px',
        fontFamily: 'Courier, monospace',
        color: '#00ff00',
        stroke: '#000000',
        strokeThickness: 1,
      })
      .setOrigin(0.5);

    // Ammo count
    this.ammoText = this.scene.add
      .text(x + 60, y + 35, 'AMMO: ∞', {
        fontSize: '10px',
        fontFamily: 'Courier, monospace',
        color: '#ffffff',
      })
      .setOrigin(0.5);

    // Weapon hotkeys
    this.weaponHotkeysText = this.scene.add
      .text(x + 60, y + 50, '1-4: WEAPONS', {
        fontSize: '8px',
        fontFamily: 'Courier, monospace',
        color: '#888888',
      })
      .setOrigin(0.5);

    // Add to HUD
    this.hudContainer.add([
      this.weaponBg,
      this.weaponNameText,
      this.ammoText,
      this.weaponHotkeysText,
    ]);
  }

  createStatsDisplay() {
    const x = this.scene.scale.width - 150;
    const y = 100;

    // Stats background
    this.statsBg = this.scene.add
      .rectangle(x, y, 120, 80, 0x333333, 0.8)
      .setOrigin(0, 0)
      .setStrokeStyle(2, 0x00ffff);

    // Wave info
    this.waveText = this.scene.add
      .text(x + 10, y + 10, 'WAVE: 1', {
        fontSize: '12px',
        fontFamily: 'Courier, monospace',
        color: '#00ffff',
      })
      .setOrigin(0, 0);

    // Score
    this.scoreText = this.scene.add
      .text(x + 10, y + 25, 'SCORE: 0', {
        fontSize: '10px',
        fontFamily: 'Courier, monospace',
        color: '#ffffff',
      })
      .setOrigin(0, 0);

    // Accuracy
    this.accuracyText = this.scene.add
      .text(x + 10, y + 40, 'ACCURACY: 0%', {
        fontSize: '10px',
        fontFamily: 'Courier, monospace',
        color: '#ffffff',
      })
      .setOrigin(0, 0);

    // Enemies remaining
    this.enemiesText = this.scene.add
      .text(x + 10, y + 55, 'ENEMIES: 0', {
        fontSize: '10px',
        fontFamily: 'Courier, monospace',
        color: '#ff6666',
      })
      .setOrigin(0, 0);

    // Add to HUD
    this.hudContainer.add([
      this.statsBg,
      this.waveText,
      this.scoreText,
      this.accuracyText,
      this.enemiesText,
    ]);
  }

  createStreakIndicator() {
    const x = this.scene.scale.width / 2;
    const y = 30;

    // Streak background
    this.streakBg = this.scene.add
      .rectangle(x, y, 150, 25, 0x333333, 0.9)
      .setOrigin(0.5, 0)
      .setStrokeStyle(2, 0xff00ff)
      .setVisible(false);

    // Streak text
    this.streakText = this.scene.add
      .text(x, y + 12, 'STREAK: 0', {
        fontSize: '14px',
        fontFamily: 'Courier, monospace',
        color: '#ff00ff',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5)
      .setVisible(false);

    // Add to HUD
    this.hudContainer.add([this.streakBg, this.streakText]);
  }

  createAbilitiesDisplay() {
    const startX = 20;
    const y = this.scene.scale.height - 80;
    const abilitySize = 50;
    const spacing = 60;

    this.abilitySlots = [];

    // Create 5 ability slots
    for (let i = 0; i < 5; i++) {
      const x = startX + i * spacing;

      // Ability background
      const bg = this.scene.add
        .rectangle(x, y, abilitySize, abilitySize, 0x333333, 0.8)
        .setOrigin(0, 0)
        .setStrokeStyle(2, 0x666666);

      // Ability icon (placeholder)
      const icon = this.scene.add
        .text(x + abilitySize / 2, y + abilitySize / 2, '?', {
          fontSize: '24px',
          fontFamily: 'Courier, monospace',
          color: '#666666',
        })
        .setOrigin(0.5);

      // Cooldown overlay
      const cooldown = this.scene.add
        .rectangle(x, y, abilitySize, abilitySize, 0x000000, 0.7)
        .setOrigin(0, 0)
        .setVisible(false);

      // Hotkey label
      const hotkey = this.scene.add
        .text(x + abilitySize / 2, y + abilitySize + 5, `${i + 1}`, {
          fontSize: '10px',
          fontFamily: 'Courier, monospace',
          color: '#888888',
        })
        .setOrigin(0.5, 0);

      this.abilitySlots.push({
        bg,
        icon,
        cooldown,
        hotkey,
        available: false,
        onCooldown: false,
      });

      this.hudContainer.add([bg, icon, cooldown, hotkey]);
    }
  }

  createMiniMap() {
    const size = 100;
    const x = this.scene.scale.width - size - 20;
    const y = this.scene.scale.height - size - 20;

    // Mini-map background
    this.miniMapBg = this.scene.add
      .rectangle(x, y, size, size, 0x000033, 0.8)
      .setOrigin(0, 0)
      .setStrokeStyle(2, 0x00ffff);

    // Mini-map label
    this.miniMapLabel = this.scene.add
      .text(x + size / 2, y - 15, 'RADAR', {
        fontSize: '10px',
        fontFamily: 'Courier, monospace',
        color: '#00ffff',
      })
      .setOrigin(0.5, 0);

    // Player dot
    this.miniMapPlayer = this.scene.add.circle(
      x + size / 2,
      y + size / 2,
      3,
      0x00ff00
    );

    // Add to HUD
    this.hudContainer.add([
      this.miniMapBg,
      this.miniMapLabel,
      this.miniMapPlayer,
    ]);

    // Enemy dots array
    this.miniMapEnemies = [];
  }

  // === HUD UPDATE METHODS ===

  updateHealthBar = data => {
    if (!this.healthBarFill || !this.healthText) return;

    // Clamp health percent to [0,1]
    const healthPercent = Math.min(
      Math.max(data.health / data.maxHealth, 0),
      1
    );
    const width = 196; // 200 - 4 for padding

    this.healthBarFill.setDisplaySize(width * healthPercent, 16);
    this.healthText.setText(`${data.health}/${data.maxHealth}`);

    // Change color based on health level
    if (healthPercent > 0.6) {
      this.healthBarFill.setFillStyle(0x00ff00); // Green
    } else if (healthPercent > 0.3) {
      this.healthBarFill.setFillStyle(0xffff00); // Yellow
    } else {
      this.healthBarFill.setFillStyle(0xff0000); // Red
    }
  };

  updateShieldBar = data => {
    if (!this.shieldBarFill) return;

    // Clamp shield percent to [0,1]
    const shieldPercent = Math.min(
      Math.max(data.shield / data.maxShield, 0),
      1
    );
    const width = 196;

    this.shieldBarFill.setDisplaySize(width * shieldPercent, 16);
    this.shieldBarFill.setVisible(data.shield > 0);
  };

  updateMathPowerMeter = data => {
    if (!this.mathPowerFill || !this.mathPowerText) return;

    // Clamp math power percent to [0,1]
    const powerPercent = Math.min(
      Math.max(data.mathPower / data.maxMathPower, 0),
      1
    );
    const width = 196;

    this.mathPowerFill.setDisplaySize(width * powerPercent, 11);
    this.mathPowerText.setText(`${data.mathPower}/${data.maxMathPower}`);

    // Animate when math power increases
    if (data.mathPower > this.lastMathPower) {
      this.scene.tweens.add({
        targets: this.mathPowerFill,
        scaleY: 1.2,
        duration: 200,
        yoyo: true,
        ease: 'Power2',
      });
    }

    this.lastMathPower = data.mathPower;
  };

  updateWeaponDisplay = data => {
    if (!this.weaponNameText || !this.ammoText) return;

    this.weaponNameText.setText(data.weaponName.toUpperCase());

    if (data.ammo === -1) {
      this.ammoText.setText('AMMO: ∞');
    } else {
      this.ammoText.setText(`AMMO: ${data.ammo}/${data.maxAmmo}`);
    }

    // Flash weapon display when changed
    this.scene.tweens.add({
      targets: [this.weaponNameText, this.weaponBg],
      alpha: 0.5,
      duration: 150,
      yoyo: true,
      ease: 'Power2',
    });
  };

  updateScore = data => {
    if (!this.scoreText) return;

    this.scoreText.setText(`SCORE: ${data.score}`);

    // Animate score increase
    this.scene.tweens.add({
      targets: this.scoreText,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 200,
      yoyo: true,
      ease: 'Back.easeOut',
    });
  };

  updateWave = data => {
    if (!this.waveText) return;

    this.waveText.setText(`WAVE: ${data.wave}`);

    // Flash wave indicator
    this.scene.tweens.add({
      targets: this.waveText,
      alpha: 0,
      duration: 300,
      yoyo: true,
      repeat: 2,
      ease: 'Power2',
    });
  };

  updateAccuracy = data => {
    if (!this.accuracyText) return;

    const accuracy = Math.round(data.accuracy * 100);
    this.accuracyText.setText(`ACCURACY: ${accuracy}%`);

    // Color based on accuracy
    if (accuracy >= 80) {
      this.accuracyText.setColor('#00ff00');
    } else if (accuracy >= 60) {
      this.accuracyText.setColor('#ffff00');
    } else {
      this.accuracyText.setColor('#ff6666');
    }
  };

  updateEnemyCount = data => {
    if (!this.enemiesText) return;

    this.enemiesText.setText(`ENEMIES: ${data.count}`);

    // Color based on threat level
    if (data.count > 10) {
      this.enemiesText.setColor('#ff0000');
    } else if (data.count > 5) {
      this.enemiesText.setColor('#ffff00');
    } else {
      this.enemiesText.setColor('#ff6666');
    }
  };

  updateStreak = data => {
    if (!this.streakText || !this.streakBg) return;

    if (data.streak > 0) {
      this.streakText.setText(`STREAK: ${data.streak}`);
      this.streakText.setVisible(true);
      this.streakBg.setVisible(true);

      // Color based on streak level
      if (data.streak >= 10) {
        this.streakText.setColor('#ff00ff');
        this.streakBg.setStrokeStyle(2, 0xff00ff);
      } else if (data.streak >= 5) {
        this.streakText.setColor('#ffff00');
        this.streakBg.setStrokeStyle(2, 0xffff00);
      } else {
        this.streakText.setColor('#00ff00');
        this.streakBg.setStrokeStyle(2, 0x00ff00);
      }

      // Pulse animation for high streaks
      if (data.streak >= 5) {
        this.scene.tweens.add({
          targets: [this.streakText, this.streakBg],
          scaleX: 1.1,
          scaleY: 1.1,
          duration: 300,
          yoyo: true,
          ease: 'Sine.easeInOut',
        });
      }
    } else {
      this.streakText.setVisible(false);
      this.streakBg.setVisible(false);
    }
  };

  updateAbilityDisplay = data => {
    if (!this.abilitySlots || !this.abilitySlots[data.slot]) return;

    const slot = this.abilitySlots[data.slot];
    slot.icon.setText(data.icon);
    slot.icon.setColor(data.available ? '#00ff00' : '#666666');
    slot.bg.setStrokeStyle(2, data.available ? 0x00ff00 : 0x666666);
    slot.available = data.available;

    // Flash when ability becomes available
    if (data.available && !slot.wasAvailable) {
      this.scene.tweens.add({
        targets: slot.bg,
        alpha: 0.5,
        duration: 200,
        yoyo: true,
        repeat: 2,
        ease: 'Power2',
      });
    }

    slot.wasAvailable = data.available;
  };

  updateAbilityCooldown = data => {
    if (!this.abilitySlots || !this.abilitySlots[data.slot]) return;

    const slot = this.abilitySlots[data.slot];

    if (data.onCooldown) {
      slot.cooldown.setVisible(true);
      slot.onCooldown = true;

      // Animate cooldown
      this.scene.tweens.add({
        targets: slot.cooldown,
        alpha: 0,
        duration: data.cooldownTime,
        ease: 'Linear',
        onComplete: () => {
          slot.cooldown.setVisible(false);
          slot.onCooldown = false;
        },
      });
    }
  };

  // === MINI-MAP METHODS ===

  addEnemyToMiniMap = data => {
    if (!this.miniMapBg) return;

    const mapSize = 100;
    const mapX = this.scene.scale.width - mapSize - 20;
    const mapY = this.scene.scale.height - mapSize - 20;

    // Convert world position to mini-map position
    const relativeX = (data.x / this.scene.scale.width) * mapSize;
    const relativeY = (data.y / this.scene.scale.height) * mapSize;

    const enemyDot = this.scene.add.circle(
      mapX + relativeX,
      mapY + relativeY,
      2,
      0xff0000
    );

    enemyDot.enemyId = data.id;
    this.miniMapEnemies.push(enemyDot);
    this.hudContainer.add(enemyDot);
  };

  removeEnemyFromMiniMap = data => {
    const enemyIndex = this.miniMapEnemies.findIndex(
      enemy => enemy.enemyId === data.id
    );
    if (enemyIndex !== -1) {
      this.miniMapEnemies[enemyIndex].destroy();
      this.miniMapEnemies.splice(enemyIndex, 1);
    }
  };

  updateMiniMapPlayer = data => {
    if (!this.miniMapPlayer || !this.miniMapBg) return;

    const mapSize = 100;
    const mapX = this.scene.scale.width - mapSize - 20;
    const mapY = this.scene.scale.height - mapSize - 20;

    const relativeX = (data.x / this.scene.scale.width) * mapSize;
    const relativeY = (data.y / this.scene.scale.height) * mapSize;

    this.miniMapPlayer.setPosition(mapX + relativeX, mapY + relativeY);
  };

  // === MATH FEEDBACK METHODS ===

  onMathAnswerCorrect = data => {
    // Create floating "+CORRECT!" text
    this.createFloatingText(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2 - 50,
      '+CORRECT!',
      '#00ff00',
      '24px'
    );

    // Screen flash effect
    this.createScreenFlash(0x00ff00, 0.2, 200);
  };

  onMathAnswerIncorrect = data => {
    // Create floating "INCORRECT" text
    this.createFloatingText(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2 - 50,
      'INCORRECT',
      '#ff0000',
      '24px'
    );

    // Screen shake
    this.scene.cameras.main.shake(200, 0.01);

    // Red flash effect
    this.createScreenFlash(0xff0000, 0.3, 300);
  };

  createFloatingText(x, y, text, color, fontSize) {
    const floatingText = this.scene.add
      .text(x, y, text, {
        fontSize,
        fontFamily: 'Courier, monospace',
        color,
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setOrigin(0.5);

    // Animate floating text
    this.scene.tweens.add({
      targets: floatingText,
      y: y - 100,
      alpha: 0,
      scaleX: 1.5,
      scaleY: 1.5,
      duration: 1500,
      ease: 'Power2',
      onComplete: () => floatingText.destroy(),
    });
  }

  createScreenFlash(color, alpha, duration) {
    const flash = this.scene.add.rectangle(
      this.scene.scale.width / 2,
      this.scene.scale.height / 2,
      this.scene.scale.width,
      this.scene.scale.height,
      color,
      alpha
    );

    this.scene.tweens.add({
      targets: flash,
      alpha: 0,
      duration,
      ease: 'Power2',
      onComplete: () => flash.destroy(),
    });
  }

  initializeUIState() {
    // Initialize UI state variables
    this.lastMathPower = 0;
    this.currentStreak = 0;
    this.mathQuizVisible = false;

    // Initialize HUD with default values
    this.updateHealthBar({ health: 100, maxHealth: 100 });
    this.updateShieldBar({ shield: 50, maxShield: 50 });
    this.updateMathPowerMeter({ mathPower: 0, maxMathPower: 100 });
    this.updateScore({ score: 0 });
    this.updateWave({ wave: 1 });
    this.updateAccuracy({ accuracy: 0 });
    this.updateEnemyCount({ count: 0 });
    this.updateStreak({ streak: 0 });

    // Initialize abilities
    for (let i = 0; i < 5; i++) {
      this.updateAbilityDisplay({
        slot: i,
        icon: '?',
        available: false,
      });
    }

    this.log('UI state initialized with default values');
  }

  // === MATH QUIZ DISPLAY ===

  showMathQuiz = data => {
    if (this.mathQuizVisible) return;

    this.mathQuizVisible = true;
    this.createMathQuizOverlay(data);
  };

  hideMathQuiz = data => {
    if (!this.mathQuizVisible) return;

    this.mathQuizVisible = false;
    this.destroyMathQuizOverlay();
  };

  createMathQuizOverlay(data) {
    const centerX = this.scene.scale.width / 2;
    const centerY = this.scene.scale.height / 2;

    // Quiz background
    this.mathQuizBg = this.scene.add
      .rectangle(centerX, centerY, 400, 300, 0x000033, 0.95)
      .setStrokeStyle(3, 0x00ffff);

    // Quiz title
    this.mathQuizTitle = this.scene.add
      .text(centerX, centerY - 120, 'MATH CHALLENGE', {
        fontSize: '24px',
        fontFamily: 'Courier, monospace',
        color: '#00ffff',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Question text
    this.mathQuestionText = this.scene.add
      .text(centerX, centerY - 60, data.question || '2 + 2 = ?', {
        fontSize: '32px',
        fontFamily: 'Courier, monospace',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5);

    // Answer choices
    this.mathChoices = [];
    const choices = data.choices || ['3', '4', '5', '6'];
    const startY = centerY - 10;
    const spacing = 40;

    for (let i = 0; i < choices.length; i++) {
      const choiceY = startY + i * spacing;

      // Choice background
      const choiceBg = this.scene.add
        .rectangle(centerX, choiceY, 300, 35, 0x333333, 0.8)
        .setStrokeStyle(2, 0x666666)
        .setInteractive()
        .on('pointerover', () => {
          choiceBg.setStrokeStyle(2, 0x00ff00);
        })
        .on('pointerout', () => {
          choiceBg.setStrokeStyle(2, 0x666666);
        })
        .on('pointerdown', () => {
          this.selectMathAnswer(i, choices[i]);
        });

      // Choice text
      const choiceText = this.scene.add
        .text(centerX, choiceY, `${i + 1}. ${choices[i]}`, {
          fontSize: '18px',
          fontFamily: 'Courier, monospace',
          color: '#ffffff',
        })
        .setOrigin(0.5);

      this.mathChoices.push({ bg: choiceBg, text: choiceText });
    }

    // Timer bar
    this.mathTimerBg = this.scene.add
      .rectangle(centerX, centerY + 120, 300, 10, 0x333333)
      .setStrokeStyle(1, 0xffffff);

    this.mathTimerFill = this.scene.add
      .rectangle(centerX - 148, centerY + 120, 296, 8, 0x00ff00)
      .setOrigin(0, 0.5);

    // Start timer animation
    this.scene.tweens.add({
      targets: this.mathTimerFill,
      scaleX: 0,
      duration: data.timeLimit || 20000, // Updated from 15000 to match new default
      ease: 'Linear',
      onUpdate: () => {
        const progress = this.mathTimerFill.scaleX;
        if (progress < 0.3) {
          this.mathTimerFill.setFillStyle(0xff0000);
        } else if (progress < 0.6) {
          this.mathTimerFill.setFillStyle(0xffff00);
        }
      },
      onComplete: () => {
        if (this.mathQuizVisible) {
          this.selectMathAnswer(-1, null); // Time out
        }
      },
    });

    // Instructions
    this.mathInstructions = this.scene.add
      .text(centerX, centerY + 140, 'Click an answer or press 1-4', {
        fontSize: '12px',
        fontFamily: 'Courier, monospace',
        color: '#888888',
      })
      .setOrigin(0.5);

    // Add all elements to a container for easy management
    this.mathQuizContainer = this.scene.add.container(0, 0);
    this.mathQuizContainer.add([
      this.mathQuizBg,
      this.mathQuizTitle,
      this.mathQuestionText,
      this.mathTimerBg,
      this.mathTimerFill,
      this.mathInstructions,
    ]);

    this.mathChoices.forEach(choice => {
      this.mathQuizContainer.add([choice.bg, choice.text]);
    });

    this.mathQuizContainer.setDepth(2000);

    // Animate quiz appearance
    this.mathQuizContainer.setAlpha(0);
    this.scene.tweens.add({
      targets: this.mathQuizContainer,
      alpha: 1,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 300,
      ease: 'Back.easeOut',
      onComplete: () => {
        this.mathQuizContainer.setScale(1);
      },
    });
  }

  selectMathAnswer(choiceIndex, answer) {
    if (!this.mathQuizVisible) return;

    // Emit answer selection event
    this.emit('mathAnswerSelected', {
      choiceIndex,
      answer,
      isTimeout: choiceIndex === -1,
    });

    // Hide quiz
    this.hideMathQuiz();
  }

  destroyMathQuizOverlay() {
    if (this.mathUI.container) {
      this.mathUI.container.destroy();
      this.mathUI.container = null;
      this.mathUI.questionText = null;
      this.mathUI.answerButtons = [];
      this.mathUI.timerBar = null;
      this.mathUI.feedbackText = null;
    }
  }

  // === PAUSE SYSTEM ===
  createPauseOverlay() {
    if (this.pauseUI.overlay) {
      return; // Already exists
    }

    const config = GameConfig.ui;
    const centerX = this.scene.cameras.main.width / 2;
    const centerY = this.scene.cameras.main.height / 2;

    // Create pause container
    this.pauseUI.container = this.scene.add.container(0, 0);
    this.pauseUI.container.setDepth(2000); // Above everything else

    // Semi-transparent background
    this.pauseUI.background = this.scene.add.graphics();
    this.pauseUI.background.fillStyle(0x000000, 0.7);
    this.pauseUI.background.fillRect(
      0,
      0,
      this.scene.cameras.main.width,
      this.scene.cameras.main.height
    );
    this.pauseUI.container.add(this.pauseUI.background);

    // Pause panel background
    const panelBg = this.scene.add.graphics();
    panelBg.fillStyle(0x1a1a2e, 0.95);
    panelBg.lineStyle(3, 0x00ffff, 1);
    panelBg.fillRoundedRect(centerX - 200, centerY - 150, 400, 300, 20);
    panelBg.strokeRoundedRect(centerX - 200, centerY - 150, 400, 300, 20);
    this.pauseUI.container.add(panelBg);

    // Pause title
    this.pauseUI.title = this.scene.add
      .text(centerX, centerY - 80, 'GAME PAUSED', {
        fontSize: '32px',
        fontFamily: config.fonts.primary,
        color: '#00ffff',
        stroke: '#000000',
        strokeThickness: 3,
      })
      .setOrigin(0.5);
    this.pauseUI.container.add(this.pauseUI.title);

    // Resume button
    this.pauseUI.resumeButton = this.createPauseButton(
      centerX,
      centerY - 20,
      'RESUME',
      () => {
        this.resumeGame();
      }
    );
    this.pauseUI.container.add(this.pauseUI.resumeButton.container);

    // Main menu button
    this.pauseUI.menuButton = this.createPauseButton(
      centerX,
      centerY + 40,
      'MAIN MENU',
      () => {
        this.goToMainMenu();
      }
    );
    this.pauseUI.container.add(this.pauseUI.menuButton.container);

    // Instructions
    const instructions = this.scene.add
      .text(centerX, centerY + 100, 'Press ESC or P to resume', {
        fontSize: '16px',
        fontFamily: config.fonts.primary,
        color: '#ffffff',
        alpha: 0.8,
      })
      .setOrigin(0.5);
    this.pauseUI.container.add(instructions);

    this.pauseUI.overlay = this.pauseUI.container;
    this.pauseUI.overlay.setVisible(false);
  }

  createPauseButton(x, y, text, callback) {
    const container = this.scene.add.container(x, y);

    // Button background
    const bg = this.scene.add.graphics();
    bg.fillStyle(0x0066cc, 1);
    bg.lineStyle(2, 0x00ffff, 1);
    bg.fillRoundedRect(-80, -20, 160, 40, 10);
    bg.strokeRoundedRect(-80, -20, 160, 40, 10);
    container.add(bg);

    // Button text
    const buttonText = this.scene.add
      .text(0, 0, text, {
        fontSize: '18px',
        fontFamily: GameConfig.ui.fonts.primary,
        color: '#ffffff',
      })
      .setOrigin(0.5);
    container.add(buttonText);

    // Make interactive
    const hitArea = this.scene.add.rectangle(0, 0, 160, 40, 0x000000, 0);
    hitArea.setInteractive();
    container.add(hitArea);

    // Hover effects
    hitArea.on('pointerover', () => {
      bg.clear();
      bg.fillStyle(0x0088ff, 1);
      bg.lineStyle(2, 0x00ffff, 1);
      bg.fillRoundedRect(-80, -20, 160, 40, 10);
      bg.strokeRoundedRect(-80, -20, 160, 40, 10);
    });

    hitArea.on('pointerout', () => {
      bg.clear();
      bg.fillStyle(0x0066cc, 1);
      bg.lineStyle(2, 0x00ffff, 1);
      bg.fillRoundedRect(-80, -20, 160, 40, 10);
      bg.strokeRoundedRect(-80, -20, 160, 40, 10);
    });

    hitArea.on('pointerdown', callback);

    return { container, bg, text: buttonText, hitArea };
  }

  togglePause = () => {
    if (this.isPaused) {
      this.resumeGame();
    } else {
      this.pauseGame();
    }
  };

  pauseGame = () => {
    if (this.isPaused) return;

    this.isPaused = true;

    // Create pause overlay if it doesn't exist
    if (!this.pauseUI.overlay) {
      this.createPauseOverlay();
    }

    // Show pause overlay
    this.pauseUI.overlay.setVisible(true);

    // Emit pause event to other systems
    this.emit('gamePaused', { paused: true });

    // Pause the scene
    this.scene.scene.pause();

    this.log('Game paused');
  };

  resumeGame = () => {
    if (!this.isPaused) return;

    this.isPaused = false;

    // Hide pause overlay
    if (this.pauseUI.overlay) {
      this.pauseUI.overlay.setVisible(false);
    }

    // Emit resume event to other systems
    this.emit('gameResumed', { paused: false });

    // Resume the scene
    this.scene.scene.resume();

    this.log('Game resumed');
  };

  goToMainMenu = () => {
    // Clean up and go to main menu
    this.resumeGame();
    this.scene.scene.start('MainMenu');
  };
}
