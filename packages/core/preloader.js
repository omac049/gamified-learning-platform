// Class to preload all the assets for our cyber robot combat educational platform
export class Preloader extends Phaser.Scene {
  constructor() {
    super({ key: 'Preloader' });
    this.loadingParticles = [];
    this.scanLines = [];
    this.energyRings = [];
  }

  preload() {
    console.log('Preloader: Initializing Cyber Combat Systems');

    // Create enhanced cyber loading screen
    this.createCyberLoadingScreen();

    // For now, we'll use simple shapes and text instead of complex assets
    // This keeps the platform lightweight and focused on learning

    // We can add educational assets later:
    // this.load.setPath("assets");
    // this.load.image("robot-hangar", "backgrounds/cyber-hangar.png");
    // this.load.audio("system-boot", "sounds/system-boot.wav");
    // this.load.audio("combat-ready", "sounds/combat-ready.wav");

    // Event to update the loading bar
    this.load.on('progress', progress => {
      this.updateCyberLoadingBar(progress);
    });

    // Preload bitmap fonts for UI
    // Note: fonts located in public/assets/fonts
    this.load.bitmapFont(
      'pixelfont',
      '/assets/fonts/pixelfont.png',
      '/assets/fonts/pixelfont.xml'
    );
    // If custom 'knighthawks' font is desired, ensure assets exist or replace references

    // Error handling
    this.load.on('loaderror', file => {
      console.error('Preloader: System Error - Failed to load:', file);
    });

    this.load.on('complete', () => {
      console.log('Preloader: All combat systems online');
    });
  }

  createCyberLoadingScreen() {
    console.log('Preloader: Booting Cyber Combat Interface');

    // Enhanced cyber background with gradient
    const bg = this.add.graphics();
    bg.fillGradientStyle(0x0a0a1a, 0x0a0a1a, 0x1a0a2e, 0x2d1b69, 1);
    bg.fillRect(0, 0, this.scale.width, this.scale.height);

    // Create animated grid background
    this.createCyberGrid();

    // Main title with enhanced cyber styling
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 - 120,
        '⚔️ CYBER ROBOT COMBAT ACADEMY ⚔️',
        {
          fontSize: '32px',
          fontFamily: 'Courier, monospace',
          fill: '#00ffff',
          stroke: '#ff00ff',
          strokeThickness: 4,
          fontStyle: 'bold',
        }
      )
      .setOrigin(0.5);

    // Subtitle with mission briefing style
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 - 80,
        'EDUCATIONAL COMBAT TRAINING PROTOCOL',
        {
          fontSize: '16px',
          fontFamily: 'Courier, monospace',
          fill: '#ffff00',
          fontStyle: 'bold',
        }
      )
      .setOrigin(0.5);

    // System status display
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 - 50,
        '>>> INITIALIZING COMBAT SYSTEMS <<<',
        {
          fontSize: '14px',
          fontFamily: 'Courier, monospace',
          fill: '#00ff00',
          fontStyle: 'bold',
        }
      )
      .setOrigin(0.5);

    // Loading status text
    this.loadingText = this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2,
        'BOOTING NEURAL NETWORKS...',
        {
          fontSize: '18px',
          fontFamily: 'Courier, monospace',
          fill: '#fbbf24',
          fontStyle: 'bold',
        }
      )
      .setOrigin(0.5);

    // Enhanced loading bar with cyber styling
    this.createCyberLoadingBar();

    // System readout
    this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 + 120,
        '🤖 ARIA • TITAN • NEXUS MECHS STANDING BY 🤖',
        {
          fontSize: '14px',
          fontFamily: 'Courier, monospace',
          fill: '#9ca3af',
        }
      )
      .setOrigin(0.5);

    // Create animated elements
    this.createLoadingParticles();
    this.createScanLines();
    this.createEnergyRings();

    // Start animations
    this.startLoadingAnimations();
  }

  createCyberGrid() {
    const gridGraphics = this.add.graphics();
    gridGraphics.lineStyle(1, 0x00ffff, 0.2);

    // Vertical grid lines
    for (let x = 0; x <= this.scale.width; x += 40) {
      gridGraphics.beginPath();
      gridGraphics.moveTo(x, 0);
      gridGraphics.lineTo(x, this.scale.height);
      gridGraphics.strokePath();
    }

    // Horizontal grid lines
    for (let y = 0; y <= this.scale.height; y += 40) {
      gridGraphics.beginPath();
      gridGraphics.moveTo(0, y);
      gridGraphics.lineTo(this.scale.width, y);
      gridGraphics.strokePath();
    }

    // Animate grid opacity
    this.tweens.add({
      targets: gridGraphics,
      alpha: 0.1,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  createCyberLoadingBar() {
    // Loading bar container with cyber frame
    const barContainer = this.add.graphics();
    barContainer.lineStyle(3, 0x00ffff, 0.8);
    barContainer.strokeRoundedRect(
      this.scale.width / 2 - 220,
      this.scale.height / 2 + 40,
      440,
      30,
      8
    );

    // Inner frame
    barContainer.lineStyle(2, 0xff00ff, 0.6);
    barContainer.strokeRoundedRect(
      this.scale.width / 2 - 215,
      this.scale.height / 2 + 45,
      430,
      20,
      6
    );

    // Loading bar background
    this.loadingBarBg = this.add.rectangle(
      this.scale.width / 2,
      this.scale.height / 2 + 55,
      420,
      12,
      0x1a1a1a
    );

    // Loading bar with gradient effect
    this.loadingBar = this.add
      .rectangle(
        this.scale.width / 2 - 210,
        this.scale.height / 2 + 55,
        0,
        12,
        0x00ffff
      )
      .setOrigin(0, 0.5);

    // Loading bar glow effect
    this.loadingBarGlow = this.add
      .rectangle(
        this.scale.width / 2 - 210,
        this.scale.height / 2 + 55,
        0,
        20,
        0x00ffff,
        0.3
      )
      .setOrigin(0, 0.5);

    // Progress indicators
    for (let i = 0; i < 10; i++) {
      const x = this.scale.width / 2 - 200 + i * 42;
      const indicator = this.add.graphics();
      indicator.fillStyle(0x00ffff, 0.3);
      indicator.fillRect(x, this.scale.height / 2 + 50, 2, 10);

      this.progressIndicators = this.progressIndicators || [];
      this.progressIndicators.push(indicator);
    }
  }

  createLoadingParticles() {
    // Create floating cyber particles
    for (let i = 0; i < 20; i++) {
      const x = Phaser.Math.Between(0, this.scale.width);
      const y = Phaser.Math.Between(0, this.scale.height);
      const colors = [0x00ffff, 0xff00ff, 0xffff00, 0x00ff00];
      const color = Phaser.Math.RND.pick(colors);

      const particle = this.add.graphics();
      particle.fillStyle(color, 0.6);
      particle.fillCircle(0, 0, Phaser.Math.Between(1, 3));
      particle.setPosition(x, y);

      this.loadingParticles.push(particle);
    }
  }

  createScanLines() {
    // Create scanning effect lines
    for (let i = 0; i < 3; i++) {
      const scanLine = this.add.graphics();
      scanLine.lineStyle(2, 0x00ffff, 0.6);
      scanLine.beginPath();
      scanLine.moveTo(0, 0);
      scanLine.lineTo(this.scale.width, 0);
      scanLine.strokePath();
      scanLine.setPosition(0, Phaser.Math.Between(0, this.scale.height));

      this.scanLines.push(scanLine);
    }
  }

  createEnergyRings() {
    // Create energy rings around the center
    for (let i = 0; i < 3; i++) {
      const ring = this.add.graphics();
      ring.lineStyle(2, 0x00ffff, 0.4);
      ring.strokeCircle(
        this.scale.width / 2,
        this.scale.height / 2,
        100 + i * 30
      );

      this.energyRings.push(ring);
    }
  }

  startLoadingAnimations() {
    // Animate particles
    this.loadingParticles.forEach((particle, index) => {
      this.tweens.add({
        targets: particle,
        y: particle.y - 100,
        alpha: 0.2,
        duration: Phaser.Math.Between(3000, 6000),
        repeat: -1,
        delay: index * 200,
        ease: 'Sine.easeInOut',
      });
    });

    // Animate scan lines
    this.scanLines.forEach((scanLine, index) => {
      this.tweens.add({
        targets: scanLine,
        y: this.scale.height + 50,
        duration: 4000,
        repeat: -1,
        delay: index * 1500,
        ease: 'Linear',
        onComplete: () => {
          scanLine.setY(-50);
        },
      });
    });

    // Animate energy rings
    this.energyRings.forEach((ring, index) => {
      this.tweens.add({
        targets: ring,
        rotation: Math.PI * 2,
        duration: 8000 + index * 1000,
        repeat: -1,
        ease: 'Linear',
      });

      this.tweens.add({
        targets: ring,
        alpha: 0.2,
        duration: 2000,
        yoyo: true,
        repeat: -1,
        delay: index * 500,
        ease: 'Sine.easeInOut',
      });
    });

    // Animate loading text
    this.tweens.add({
      targets: this.loadingText,
      alpha: 0.5,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  updateCyberLoadingBar(progress) {
    // Update loading bar with enhanced effects
    const barWidth = 420 * progress;
    this.loadingBar.width = barWidth;
    this.loadingBarGlow.width = barWidth;

    // Update progress indicators
    if (this.progressIndicators) {
      const activeIndicators = Math.floor(progress * 10);
      this.progressIndicators.forEach((indicator, index) => {
        if (index < activeIndicators) {
          indicator.clear();
          indicator.fillStyle(0x00ff00, 0.8);
          indicator.fillRect(
            this.scale.width / 2 - 200 + index * 42,
            this.scale.height / 2 + 50,
            2,
            10
          );
        }
      });
    }

    // Update loading text with cyber messages
    const percentage = Math.round(progress * 100);
    const messages = [
      'INITIALIZING NEURAL NETWORKS...',
      'LOADING COMBAT PROTOCOLS...',
      'CALIBRATING WEAPON SYSTEMS...',
      'SYNCING MECH INTERFACES...',
      'ESTABLISHING QUANTUM LINKS...',
      'ACTIVATING DEFENSE MATRICES...',
      'PREPARING BATTLE SCENARIOS...',
      'FINALIZING SYSTEM CHECKS...',
      'COMBAT SYSTEMS ONLINE...',
      'READY FOR DEPLOYMENT!',
    ];

    const messageIndex = Math.min(
      Math.floor(progress * 10),
      messages.length - 1
    );
    this.loadingText.setText(`${messages[messageIndex]} ${percentage}%`);

    // Change loading bar color based on progress
    if (progress < 0.3) {
      this.loadingBar.setFillStyle(0xff6600); // Orange
      this.loadingBarGlow.setFillStyle(0xff6600);
    } else if (progress < 0.7) {
      this.loadingBar.setFillStyle(0xffff00); // Yellow
      this.loadingBarGlow.setFillStyle(0xffff00);
    } else {
      this.loadingBar.setFillStyle(0x00ff00); // Green
      this.loadingBarGlow.setFillStyle(0x00ff00);
    }

    console.log('Preloader: Combat System Loading:', `${percentage}%`);
  }

  create() {
    console.log('Preloader: Combat Systems Fully Operational');

    // Enhanced completion effect
    this.createCompletionEffect();

    // Delay to show the completion effect
    this.time.delayedCall(2000, () => {
      console.log('Preloader: Deploying to Combat Zone');
      try {
        // When ready, start our intro scene
        this.scene.start('IntroScene');
      } catch (error) {
        console.error('Preloader: Error deploying to combat zone:', error);
        // Fallback to menu if intro fails
        this.scene.start('EducationalMenuScene');
      }
    });
  }

  createCompletionEffect() {
    // System ready message
    const readyText = this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 + 90,
        '🚀 ALL SYSTEMS OPERATIONAL 🚀',
        {
          fontSize: '20px',
          fontFamily: 'Courier, monospace',
          fill: '#00ff00',
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 2,
        }
      )
      .setOrigin(0.5);

    // Pulse animation for ready text
    this.tweens.add({
      targets: readyText,
      scaleX: 1.1,
      scaleY: 1.1,
      duration: 500,
      yoyo: true,
      repeat: 3,
      ease: 'Power2.easeInOut',
    });

    // Screen flash effect
    const flash = this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x00ff00, 0.3)
      .setOrigin(0, 0);

    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 800,
      ease: 'Power2.easeOut',
    });

    // Enhanced particle burst
    for (let i = 0; i < 30; i++) {
      const burst = this.add.graphics();
      burst.fillStyle(0x00ff00, 0.8);
      burst.fillCircle(0, 0, Phaser.Math.Between(2, 5));
      burst.setPosition(this.scale.width / 2, this.scale.height / 2);

      const angle = (i / 30) * Math.PI * 2;
      this.tweens.add({
        targets: burst,
        x: burst.x + Math.cos(angle) * Phaser.Math.Between(100, 200),
        y: burst.y + Math.sin(angle) * Phaser.Math.Between(100, 200),
        alpha: 0,
        scale: 0.1,
        duration: 1500,
        ease: 'Power2.easeOut',
      });
    }
  }
}
