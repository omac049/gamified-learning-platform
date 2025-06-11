import { GameObjects } from 'phaser';

export class EnhancedButton extends GameObjects.Container {
  constructor(scene, x, y, width, height, text, style = {}) {
    super(scene, x, y);

    this.scene = scene;
    this.scene.add.existing(this);

    // Button properties
    this.buttonWidth = width;
    this.buttonHeight = height;
    this.buttonText = text;
    this.isEnabled = true;
    this.isPressed = false;

    // Default style
    this.style = {
      backgroundColor: style.backgroundColor || 0x4169e1,
      hoverColor: style.hoverColor || 0x6495ed,
      pressedColor: style.pressedColor || 0x191970,
      disabledColor: style.disabledColor || 0x696969,
      borderColor: style.borderColor || 0xffffff,
      borderWidth: style.borderWidth || 2,
      textColor: style.textColor || '#ffffff',
      fontSize: style.fontSize || '16px',
      fontFamily: style.fontFamily || 'Arial, sans-serif',
      cornerRadius: style.cornerRadius || 8,
      shadowOffset: style.shadowOffset || { x: 2, y: 2 },
      shadowColor: style.shadowColor || 0x000000,
      shadowAlpha: style.shadowAlpha || 0.5,
      glowColor: style.glowColor || 0x00ffff,
      ...style,
    };

    this.createButton();
    this.setupInteractions();
    this.setupAnimations();
  }

  createButton() {
    // Button shadow
    this.shadow = this.scene.add
      .rectangle(
        this.style.shadowOffset.x,
        this.style.shadowOffset.y,
        this.buttonWidth,
        this.buttonHeight,
        this.style.shadowColor,
        this.style.shadowAlpha
      )
      .setOrigin(0.5);

    // Main button background
    this.background = this.scene.add
      .rectangle(
        0,
        0,
        this.buttonWidth,
        this.buttonHeight,
        this.style.backgroundColor
      )
      .setOrigin(0.5)
      .setStrokeStyle(this.style.borderWidth, this.style.borderColor);

    // Button glow effect (initially hidden)
    this.glow = this.scene.add
      .rectangle(
        0,
        0,
        this.buttonWidth + 10,
        this.buttonHeight + 10,
        this.style.glowColor,
        0
      )
      .setOrigin(0.5)
      .setBlendMode('ADD');

    // Button text
    this.textObject = this.scene.add
      .text(0, 0, this.buttonText, {
        fontSize: this.style.fontSize,
        fontFamily: this.style.fontFamily,
        fill: this.style.textColor,
        stroke: '#000000',
        strokeThickness: 1,
        align: 'center',
      })
      .setOrigin(0.5);

    // Add all elements to container
    this.add([this.shadow, this.glow, this.background, this.textObject]);

    // Set interactive area
    this.setSize(this.buttonWidth, this.buttonHeight);
    this.setInteractive({ useHandCursor: true });
  }

  setupInteractions() {
    this.on('pointerover', this.onHover, this);
    this.on('pointerout', this.onOut, this);
    this.on('pointerdown', this.onDown, this);
    this.on('pointerup', this.onUp, this);
  }

  setupAnimations() {
    // Idle animation - subtle pulse
    this.idleAnimation = this.scene.tweens.add({
      targets: this.glow,
      alpha: 0.2,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
      paused: true,
    });
  }

  onHover() {
    if (!this.isEnabled) return;

    // Change background color
    this.background.setFillStyle(this.style.hoverColor);

    // Scale up slightly
    this.scene.tweens.add({
      targets: this,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 150,
      ease: 'Power2',
    });

    // Glow effect
    this.scene.tweens.add({
      targets: this.glow,
      alpha: 0.4,
      duration: 150,
      ease: 'Power2',
    });

    // Start idle animation
    this.idleAnimation.resume();
  }

  onOut() {
    if (!this.isEnabled) return;

    // Reset background color
    this.background.setFillStyle(this.style.backgroundColor);

    // Scale back to normal
    this.scene.tweens.add({
      targets: this,
      scaleX: 1,
      scaleY: 1,
      duration: 150,
      ease: 'Power2',
    });

    // Remove glow
    this.scene.tweens.add({
      targets: this.glow,
      alpha: 0,
      duration: 150,
      ease: 'Power2',
    });

    // Pause idle animation
    this.idleAnimation.pause();
  }

  onDown() {
    if (!this.isEnabled) return;

    this.isPressed = true;

    // Change to pressed color
    this.background.setFillStyle(this.style.pressedColor);

    // Scale down
    this.scene.tweens.add({
      targets: this,
      scaleX: 0.95,
      scaleY: 0.95,
      duration: 100,
      ease: 'Power2',
    });

    // Bright glow
    this.scene.tweens.add({
      targets: this.glow,
      alpha: 0.8,
      duration: 100,
      ease: 'Power2',
    });
  }

  onUp() {
    if (!this.isEnabled || !this.isPressed) return;

    this.isPressed = false;

    // Reset to hover state
    this.background.setFillStyle(this.style.hoverColor);

    // Scale back up
    this.scene.tweens.add({
      targets: this,
      scaleX: 1.05,
      scaleY: 1.05,
      duration: 100,
      ease: 'Power2',
    });

    // Medium glow
    this.scene.tweens.add({
      targets: this.glow,
      alpha: 0.4,
      duration: 100,
      ease: 'Power2',
    });

    // Emit click event
    this.emit('clicked');
  }

  setEnabled(enabled) {
    this.isEnabled = enabled;

    if (enabled) {
      this.background.setFillStyle(this.style.backgroundColor);
      this.setAlpha(1);
      this.setInteractive({ useHandCursor: true });
    } else {
      this.background.setFillStyle(this.style.disabledColor);
      this.setAlpha(0.6);
      this.disableInteractive();
    }
  }

  setText(newText) {
    this.buttonText = newText;
    this.textObject.setText(newText);
  }

  setStyle(newStyle) {
    this.style = { ...this.style, ...newStyle };
    this.background.setFillStyle(this.style.backgroundColor);
    this.background.setStrokeStyle(
      this.style.borderWidth,
      this.style.borderColor
    );
    this.textObject.setStyle({
      fontSize: this.style.fontSize,
      fontFamily: this.style.fontFamily,
      fill: this.style.textColor,
    });
  }

  playClickAnimation() {
    // Special click animation with particles
    const particles = this.scene.add.particles(this.x, this.y, 'spark', {
      speed: { min: 50, max: 100 },
      scale: { start: 0.3, end: 0 },
      alpha: { start: 1, end: 0 },
      lifespan: 300,
      quantity: 8,
      tint: this.style.glowColor,
      blendMode: 'ADD',
    });

    this.scene.time.delayedCall(400, () => {
      particles.destroy();
    });
  }
}

export class EnhancedProgressBar extends GameObjects.Container {
  constructor(scene, x, y, width, height, options = {}) {
    super(scene, x, y);

    this.scene = scene;
    this.scene.add.existing(this);

    // Progress bar properties
    this.barWidth = width;
    this.barHeight = height;
    this.currentValue = options.value || 0;
    this.maxValue = options.maxValue || 100;
    this.minValue = options.minValue || 0;

    // Style options
    this.style = {
      backgroundColor: options.backgroundColor || 0x333333,
      fillColor: options.fillColor || 0x00ff00,
      borderColor: options.borderColor || 0xffffff,
      borderWidth: options.borderWidth || 2,
      cornerRadius: options.cornerRadius || 4,
      showText: options.showText !== false,
      textColor: options.textColor || '#ffffff',
      fontSize: options.fontSize || '14px',
      animationDuration: options.animationDuration || 500,
      glowEffect: options.glowEffect !== false,
      ...options,
    };

    this.createProgressBar();
    this.setupAnimations();
  }

  createProgressBar() {
    // Background
    this.background = this.scene.add
      .rectangle(
        0,
        0,
        this.barWidth,
        this.barHeight,
        this.style.backgroundColor
      )
      .setOrigin(0, 0.5)
      .setStrokeStyle(this.style.borderWidth, this.style.borderColor);

    // Fill bar
    this.fillBar = this.scene.add
      .rectangle(0, 0, 0, this.barHeight - 4, this.style.fillColor)
      .setOrigin(0, 0.5);

    // Glow effect
    if (this.style.glowEffect) {
      this.glow = this.scene.add
        .rectangle(0, 0, 0, this.barHeight + 4, this.style.fillColor, 0.3)
        .setOrigin(0, 0.5)
        .setBlendMode('ADD');
    }

    // Progress text
    if (this.style.showText) {
      this.progressText = this.scene.add
        .text(this.barWidth / 2, 0, this.getProgressText(), {
          fontSize: this.style.fontSize,
          fontFamily: 'Arial, sans-serif',
          fill: this.style.textColor,
          stroke: '#000000',
          strokeThickness: 1,
        })
        .setOrigin(0.5);
    }

    // Add elements to container
    const elements = [this.background, this.fillBar];
    if (this.glow) elements.push(this.glow);
    if (this.progressText) elements.push(this.progressText);

    this.add(elements);

    // Set initial value
    this.updateBar();
  }

  setupAnimations() {
    // Pulse animation for glow
    if (this.glow) {
      this.glowAnimation = this.scene.tweens.add({
        targets: this.glow,
        alpha: 0.1,
        duration: 1000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  setValue(value, animate = true) {
    const oldValue = this.currentValue;
    this.currentValue = Phaser.Math.Clamp(value, this.minValue, this.maxValue);

    if (animate) {
      this.animateToValue(oldValue, this.currentValue);
    } else {
      this.updateBar();
    }
  }

  animateToValue(fromValue, toValue) {
    const tempValue = { value: fromValue };

    this.scene.tweens.add({
      targets: tempValue,
      value: toValue,
      duration: this.style.animationDuration,
      ease: 'Power2.easeOut',
      onUpdate: () => {
        this.currentValue = tempValue.value;
        this.updateBar();
      },
      onComplete: () => {
        // Flash effect when reaching certain thresholds
        const percentage = this.getPercentage();
        if (percentage === 100) {
          this.playCompletionEffect();
        } else if (percentage <= 20 && toValue < fromValue) {
          this.playWarningEffect();
        }
      },
    });
  }

  updateBar() {
    const percentage = this.getPercentage();
    const fillWidth = (this.barWidth - 4) * (percentage / 100);

    // Update fill bar
    this.fillBar.setSize(fillWidth, this.barHeight - 4);

    // Update glow
    if (this.glow) {
      this.glow.setSize(fillWidth, this.barHeight + 4);
    }

    // Update color based on percentage
    this.updateColor(percentage);

    // Update text
    if (this.progressText) {
      this.progressText.setText(this.getProgressText());
    }
  }

  updateColor(percentage) {
    let color = this.style.fillColor;

    if (percentage <= 20) {
      color = 0xff0000; // Red for low values
    } else if (percentage <= 50) {
      color = 0xffa500; // Orange for medium-low values
    } else if (percentage <= 75) {
      color = 0xffff00; // Yellow for medium values
    } else {
      color = 0x00ff00; // Green for high values
    }

    this.fillBar.setFillStyle(color);
    if (this.glow) {
      this.glow.setFillStyle(color, 0.3);
    }
  }

  getPercentage() {
    return (
      ((this.currentValue - this.minValue) / (this.maxValue - this.minValue)) *
      100
    );
  }

  getProgressText() {
    return `${Math.round(this.currentValue)}/${this.maxValue}`;
  }

  playCompletionEffect() {
    // Flash effect
    this.scene.tweens.add({
      targets: this.fillBar,
      alpha: 0.5,
      duration: 100,
      yoyo: true,
      repeat: 3,
      ease: 'Power2',
    });

    // Particle burst
    const particles = this.scene.add.particles(
      this.x + this.barWidth,
      this.y,
      'star',
      {
        speed: { min: 50, max: 150 },
        scale: { start: 0.4, end: 0 },
        alpha: { start: 1, end: 0 },
        lifespan: 800,
        quantity: 15,
        tint: 0xffd700,
        blendMode: 'ADD',
      }
    );

    this.scene.time.delayedCall(1000, () => {
      particles.destroy();
    });
  }

  playWarningEffect() {
    // Red flash
    this.scene.tweens.add({
      targets: this,
      alpha: 0.7,
      duration: 150,
      yoyo: true,
      repeat: 2,
      ease: 'Power2',
    });
  }
}

export class EnhancedPanel extends GameObjects.Container {
  constructor(scene, x, y, width, height, options = {}) {
    super(scene, x, y);

    this.scene = scene;
    this.scene.add.existing(this);

    // Panel properties
    this.panelWidth = width;
    this.panelHeight = height;

    // Style options
    this.style = {
      backgroundColor: options.backgroundColor || 0x1a1a1a,
      borderColor: options.borderColor || 0xffffff,
      borderWidth: options.borderWidth || 2,
      cornerRadius: options.cornerRadius || 8,
      alpha: options.alpha || 0.9,
      shadowOffset: options.shadowOffset || { x: 4, y: 4 },
      shadowColor: options.shadowColor || 0x000000,
      shadowAlpha: options.shadowAlpha || 0.5,
      glowColor: options.glowColor || 0x4169e1,
      title: options.title || '',
      titleColor: options.titleColor || '#ffffff',
      titleSize: options.titleSize || '18px',
      ...options,
    };

    this.createPanel();
    this.setupAnimations();
  }

  createPanel() {
    // Panel shadow
    this.shadow = this.scene.add
      .rectangle(
        this.style.shadowOffset.x,
        this.style.shadowOffset.y,
        this.panelWidth,
        this.panelHeight,
        this.style.shadowColor,
        this.style.shadowAlpha
      )
      .setOrigin(0.5);

    // Panel glow
    this.glow = this.scene.add
      .rectangle(
        0,
        0,
        this.panelWidth + 8,
        this.panelHeight + 8,
        this.style.glowColor,
        0.1
      )
      .setOrigin(0.5)
      .setBlendMode('ADD');

    // Main panel background
    this.background = this.scene.add
      .rectangle(
        0,
        0,
        this.panelWidth,
        this.panelHeight,
        this.style.backgroundColor,
        this.style.alpha
      )
      .setOrigin(0.5)
      .setStrokeStyle(this.style.borderWidth, this.style.borderColor);

    // Title bar if title is provided
    if (this.style.title) {
      this.titleBar = this.scene.add
        .rectangle(
          0,
          -this.panelHeight / 2 + 15,
          this.panelWidth - 4,
          30,
          this.style.glowColor,
          0.8
        )
        .setOrigin(0.5);

      this.titleText = this.scene.add
        .text(0, -this.panelHeight / 2 + 15, this.style.title, {
          fontSize: this.style.titleSize,
          fontFamily: 'Arial, sans-serif',
          fill: this.style.titleColor,
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 1,
        })
        .setOrigin(0.5);
    }

    // Add elements to container
    const elements = [this.shadow, this.glow, this.background];
    if (this.titleBar) elements.push(this.titleBar);
    if (this.titleText) elements.push(this.titleText);

    this.add(elements);
  }

  setupAnimations() {
    // Subtle glow animation
    this.glowAnimation = this.scene.tweens.add({
      targets: this.glow,
      alpha: 0.05,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  show(animate = true) {
    this.setVisible(true);

    if (animate) {
      this.setAlpha(0);
      this.setScale(0.8);

      this.scene.tweens.add({
        targets: this,
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
        duration: 400,
        ease: 'Back.easeOut',
      });
    }
  }

  hide(animate = true) {
    if (animate) {
      this.scene.tweens.add({
        targets: this,
        alpha: 0,
        scaleX: 0.8,
        scaleY: 0.8,
        duration: 300,
        ease: 'Power2.easeIn',
        onComplete: () => {
          this.setVisible(false);
        },
      });
    } else {
      this.setVisible(false);
    }
  }

  addContent(gameObject, x = 0, y = 0) {
    gameObject.setPosition(x, y);
    this.add(gameObject);
    return gameObject;
  }

  setTitle(newTitle) {
    if (this.titleText) {
      this.titleText.setText(newTitle);
    }
  }

  playHighlightEffect() {
    // Bright glow pulse
    this.scene.tweens.add({
      targets: this.glow,
      alpha: 0.4,
      duration: 300,
      yoyo: true,
      ease: 'Power2',
    });

    // Scale pulse
    this.scene.tweens.add({
      targets: this,
      scaleX: 1.02,
      scaleY: 1.02,
      duration: 300,
      yoyo: true,
      ease: 'Power2',
    });
  }
}

export class EnhancedSlider extends GameObjects.Container {
  constructor(scene, x, y, width, options = {}) {
    super(scene, x, y);

    this.scene = scene;
    this.scene.add.existing(this);

    // Slider properties
    this.sliderWidth = width;
    this.currentValue = options.value || 0;
    this.minValue = options.minValue || 0;
    this.maxValue = options.maxValue || 100;
    this.step = options.step || 1;

    // Style options
    this.style = {
      trackColor: options.trackColor || 0x666666,
      fillColor: options.fillColor || 0x4169e1,
      handleColor: options.handleColor || 0xffffff,
      handleSize: options.handleSize || 20,
      trackHeight: options.trackHeight || 8,
      showValue: options.showValue !== false,
      ...options,
    };

    this.createSlider();
    this.setupInteractions();
  }

  createSlider() {
    // Track background
    this.track = this.scene.add
      .rectangle(
        0,
        0,
        this.sliderWidth,
        this.style.trackHeight,
        this.style.trackColor
      )
      .setOrigin(0, 0.5);

    // Fill track
    this.fill = this.scene.add
      .rectangle(
        -this.sliderWidth / 2,
        0,
        0,
        this.style.trackHeight,
        this.style.fillColor
      )
      .setOrigin(0, 0.5);

    // Handle
    this.handle = this.scene.add
      .circle(0, 0, this.style.handleSize / 2, this.style.handleColor)
      .setStrokeStyle(2, 0x000000)
      .setInteractive({ useHandCursor: true, draggable: true });

    // Handle glow
    this.handleGlow = this.scene.add
      .circle(0, 0, this.style.handleSize / 2 + 3, this.style.fillColor, 0)
      .setBlendMode('ADD');

    // Value text
    if (this.style.showValue) {
      this.valueText = this.scene.add
        .text(0, -30, this.currentValue.toString(), {
          fontSize: '14px',
          fontFamily: 'Arial, sans-serif',
          fill: '#ffffff',
          stroke: '#000000',
          strokeThickness: 1,
        })
        .setOrigin(0.5);
    }

    // Add elements to container
    const elements = [this.track, this.fill, this.handleGlow, this.handle];
    if (this.valueText) elements.push(this.valueText);

    this.add(elements);

    // Set initial position
    this.updateSlider();
  }

  setupInteractions() {
    this.handle.on('dragstart', () => {
      this.scene.tweens.add({
        targets: this.handleGlow,
        alpha: 0.5,
        duration: 150,
        ease: 'Power2',
      });
    });

    this.handle.on('drag', (pointer, dragX) => {
      // Constrain to track bounds
      const minX = -this.sliderWidth / 2;
      const maxX = this.sliderWidth / 2;
      const clampedX = Phaser.Math.Clamp(dragX, minX, maxX);

      // Calculate value from position
      const percentage = (clampedX - minX) / (maxX - minX);
      const newValue =
        this.minValue + percentage * (this.maxValue - this.minValue);
      const steppedValue = Math.round(newValue / this.step) * this.step;

      this.setValue(steppedValue, false);
      this.emit('valueChanged', this.currentValue);
    });

    this.handle.on('dragend', () => {
      this.scene.tweens.add({
        targets: this.handleGlow,
        alpha: 0,
        duration: 150,
        ease: 'Power2',
      });
    });

    // Click on track to set value
    this.track.setInteractive({ useHandCursor: true });
    this.track.on('pointerdown', pointer => {
      const localX = pointer.x - this.x;
      const minX = -this.sliderWidth / 2;
      const maxX = this.sliderWidth / 2;
      const clampedX = Phaser.Math.Clamp(localX, minX, maxX);

      const percentage = (clampedX - minX) / (maxX - minX);
      const newValue =
        this.minValue + percentage * (this.maxValue - this.minValue);
      const steppedValue = Math.round(newValue / this.step) * this.step;

      this.setValue(steppedValue, true);
      this.emit('valueChanged', this.currentValue);
    });
  }

  setValue(value, animate = false) {
    this.currentValue = Phaser.Math.Clamp(value, this.minValue, this.maxValue);

    if (animate) {
      this.scene.tweens.add({
        targets: this.handle,
        x: this.getHandlePosition(),
        duration: 200,
        ease: 'Power2',
        onUpdate: () => {
          this.updateFill();
        },
      });
    } else {
      this.updateSlider();
    }
  }

  updateSlider() {
    this.handle.setPosition(this.getHandlePosition(), 0);
    this.updateFill();

    if (this.valueText) {
      this.valueText.setText(this.currentValue.toString());
    }
  }

  updateFill() {
    const percentage =
      (this.currentValue - this.minValue) / (this.maxValue - this.minValue);
    const fillWidth = this.sliderWidth * percentage;
    this.fill.setSize(fillWidth, this.style.trackHeight);
  }

  getHandlePosition() {
    const percentage =
      (this.currentValue - this.minValue) / (this.maxValue - this.minValue);
    return -this.sliderWidth / 2 + this.sliderWidth * percentage;
  }

  getValue() {
    return this.currentValue;
  }
}

export class EnhancedTooltip extends GameObjects.Container {
  constructor(scene, text, options = {}) {
    super(scene, 0, 0);

    this.scene = scene;
    this.scene.add.existing(this);

    // Tooltip properties
    this.tooltipText = text;
    this.isVisible = false;

    // Style options
    this.style = {
      backgroundColor: options.backgroundColor || 0x000000,
      borderColor: options.borderColor || 0xffffff,
      textColor: options.textColor || '#ffffff',
      fontSize: options.fontSize || '12px',
      padding: options.padding || { x: 8, y: 4 },
      alpha: options.alpha || 0.9,
      maxWidth: options.maxWidth || 200,
      ...options,
    };

    this.createTooltip();
    this.setDepth(10000); // Always on top
    this.setVisible(false);
  }

  createTooltip() {
    // Text object
    this.textObject = this.scene.add
      .text(0, 0, this.tooltipText, {
        fontSize: this.style.fontSize,
        fontFamily: 'Arial, sans-serif',
        fill: this.style.textColor,
        wordWrap: { width: this.style.maxWidth },
      })
      .setOrigin(0.5);

    // Background
    const textBounds = this.textObject.getBounds();
    this.background = this.scene.add
      .rectangle(
        0,
        0,
        textBounds.width + this.style.padding.x * 2,
        textBounds.height + this.style.padding.y * 2,
        this.style.backgroundColor,
        this.style.alpha
      )
      .setOrigin(0.5)
      .setStrokeStyle(1, this.style.borderColor);

    // Add elements
    this.add([this.background, this.textObject]);
  }

  show(x, y) {
    this.setPosition(x, y);
    this.setVisible(true);
    this.isVisible = true;

    // Fade in animation
    this.setAlpha(0);
    this.scene.tweens.add({
      targets: this,
      alpha: 1,
      duration: 200,
      ease: 'Power2',
    });
  }

  hide() {
    if (!this.isVisible) return;

    this.isVisible = false;

    // Fade out animation
    this.scene.tweens.add({
      targets: this,
      alpha: 0,
      duration: 150,
      ease: 'Power2',
      onComplete: () => {
        this.setVisible(false);
      },
    });
  }

  setText(newText) {
    this.tooltipText = newText;
    this.textObject.setText(newText);

    // Update background size
    const textBounds = this.textObject.getBounds();
    this.background.setSize(
      textBounds.width + this.style.padding.x * 2,
      textBounds.height + this.style.padding.y * 2
    );
  }
}

// Utility function to add tooltip to any game object
export function addTooltip(gameObject, text, options = {}) {
  const tooltip = new EnhancedTooltip(gameObject.scene, text, options);

  gameObject.setInteractive({ useHandCursor: true });

  gameObject.on('pointerover', pointer => {
    tooltip.show(pointer.x, pointer.y - 30);
  });

  gameObject.on('pointermove', pointer => {
    if (tooltip.isVisible) {
      tooltip.setPosition(pointer.x, pointer.y - 30);
    }
  });

  gameObject.on('pointerout', () => {
    tooltip.hide();
  });

  return tooltip;
}
