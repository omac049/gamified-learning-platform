import { Scene } from 'phaser';
import { ProgressTracker, SaveManager } from '../utils/managers/index.js';

export class CharacterSelectScene extends Scene {
  constructor() {
    super('CharacterSelectScene');
    this.progressTracker = new ProgressTracker();
    this.saveManager = new SaveManager();

    // Character customization state
    this.characterData = {
      name: '',
      type: 'aria',
      appearance: {
        color: 0x3b82f6,
        colorName: 'blue',
      },
      startingBonus: null,
    };

    // Enhanced character types with sprite data
    this.characterTypes = {
      aria: {
        id: 'aria',
        name: 'ARIA',
        icon: '🤖',
        description: 'Smart robot that is good with computers and technology',
        baseColor: 0x3b82f6, // Elegant blue
        accentColor: 0x00ffff, // Cyan accent
        theme: 'Cyber Intelligence',
        specialty: 'Cyber Hacker',
        specialAbility: 'Neural Override',
        personality: 'Sophisticated, analytical, adaptive',
        design: 'Sleek curves with glowing cyber circuits',
        bonuses: {
          reading: 30,
          analysis: 25,
          efficiency: 20,
        },
        spriteKey: 'aria_sprite',
      },
      titan: {
        id: 'titan',
        name: 'TITAN',
        icon: '🤖',
        description: 'Strong robot that is great at fighting and protecting',
        baseColor: 0xef4444, // Bold red
        accentColor: 0xffa500, // Orange accent
        theme: 'Destructive Power',
        specialty: 'Heavy Assault',
        specialAbility: 'Berserker Mode',
        personality: 'Aggressive, protective, unstoppable',
        design: 'Massive frame with integrated weapon systems',
        bonuses: {
          math: 30,
          defense: 35,
          courage: 25,
        },
        spriteKey: 'titan_sprite',
      },
      nexus: {
        id: 'nexus',
        name: 'NEXUS',
        icon: '🤖',
        description: 'Cool robot that loves science and building things',
        baseColor: 0x10b981, // Tech green
        accentColor: 0xfbbf24, // Gold accent
        theme: 'Quantum Innovation',
        specialty: 'Tech Specialist',
        specialAbility: 'Quantum Sync',
        personality: 'Innovative, logical, future-focused',
        design: 'Angular tech panels with holographic displays',
        bonuses: {
          science: 35,
          technology: 30,
          innovation: 25,
        },
        spriteKey: 'nexus_sprite',
      },
    };

    // UI state
    this.selectedCharacterType = 'aria';
    this.selectedBonusIndex = 0;
    this.nameInput = null;
    this.characterCards = [];
    this.bonusCards = [];
    this.isReady = false;

    // Dynamic layout system
    this.layout = {
      sections: {},
      spacing: {
        section: 80, // Space between major sections
        element: 20, // Space between elements within sections
        padding: 40, // Screen edge padding
      },
      responsive: {
        minWidth: 800,
        minHeight: 600,
        maxContentWidth: 1200,
      },
      adjustmentCount: 0,
    };
  }

  preload() {
    // Load character sprite images
    this.createCharacterSprites();
  }

  createCharacterSprites() {
    // Create enhanced robot character representations with animation frames
    const graphics = this.add.graphics();

    // ARIA - Elegant Cyber Hacker Mech (Blue/Silver/Cyan) - Multiple Frames
    this.createAriaSprites(graphics);
    this.createTitanSprites(graphics);
    this.createNexusSprites(graphics);

    graphics.destroy();
  }

  createAriaSprites(graphics) {
    // ARIA Frame 1 - Idle Pose - Highly Detailed Cyber Hacker Mech
    graphics.clear();

    // === ARIA - ELEGANT CYBER HACKER MECH ===
    // Main torso with advanced cyber architecture
    graphics.fillStyle(0x1e3a8a); // Deep blue base
    graphics.fillRoundedRect(20, 24, 24, 28, 6);

    // Chest armor with intricate paneling
    graphics.fillStyle(0x3b82f6); // Bright blue
    graphics.fillRoundedRect(22, 26, 20, 24, 4);

    // Central processing core with multiple layers
    graphics.fillStyle(0x1e40af); // Core housing
    graphics.fillRoundedRect(26, 30, 12, 16, 3);
    graphics.fillStyle(0x60a5fa); // Core glow
    graphics.fillRoundedRect(28, 32, 8, 12, 2);
    graphics.fillStyle(0x00ffff); // Core center
    graphics.fillRoundedRect(30, 34, 4, 8, 1);

    // Detailed circuit patterns on chest
    graphics.lineStyle(1, 0x93c5fd, 0.8);
    // Vertical data lines
    for (let i = 0; i < 3; i++) {
      graphics.beginPath();
      graphics.moveTo(29 + i * 2, 32);
      graphics.lineTo(29 + i * 2, 42);
      graphics.strokePath();
    }
    // Horizontal connections
    graphics.lineStyle(1, 0x00ffff, 0.6);
    graphics.beginPath();
    graphics.moveTo(28, 35);
    graphics.lineTo(36, 35);
    graphics.moveTo(28, 38);
    graphics.lineTo(36, 38);
    graphics.moveTo(28, 41);
    graphics.lineTo(36, 41);
    graphics.strokePath();

    // Shoulder modules with detailed architecture
    graphics.fillStyle(0x1e3a8a);
    graphics.fillRoundedRect(12, 22, 10, 16, 4);
    graphics.fillRoundedRect(42, 22, 10, 16, 4);

    // Shoulder armor plating
    graphics.fillStyle(0x3b82f6);
    graphics.fillRoundedRect(14, 24, 6, 12, 2);
    graphics.fillRoundedRect(44, 24, 6, 12, 2);

    // Shoulder energy cores with glow effects
    graphics.fillStyle(0x1e40af);
    graphics.fillCircle(17, 28, 3);
    graphics.fillCircle(47, 28, 3);
    graphics.fillStyle(0x00ffff);
    graphics.fillCircle(17, 28, 2);
    graphics.fillCircle(47, 28, 2);
    graphics.fillStyle(0xffffff, 0.6);
    graphics.fillCircle(17, 28, 1);
    graphics.fillCircle(47, 28, 1);

    // Advanced head design with detailed visor
    graphics.fillStyle(0xe5e7eb); // Silver base
    graphics.fillRoundedRect(22, 8, 20, 18, 8);

    // Multi-layer visor system
    graphics.fillStyle(0x1e40af); // Visor frame
    graphics.fillRoundedRect(24, 12, 16, 10, 4);
    graphics.fillStyle(0x00ffff); // Visor glass
    graphics.fillRoundedRect(25, 13, 14, 8, 3);
    graphics.fillStyle(0x60a5fa, 0.4); // Visor glow
    graphics.fillRoundedRect(24, 12, 16, 10, 4);

    // Advanced HUD eyes with detailed design
    graphics.fillStyle(0x1e40af);
    graphics.fillCircle(28, 17, 3);
    graphics.fillCircle(36, 17, 3);
    graphics.fillStyle(0x60a5fa);
    graphics.fillCircle(28, 17, 2);
    graphics.fillCircle(36, 17, 2);
    graphics.fillStyle(0x00ffff);
    graphics.fillCircle(28, 17, 1);
    graphics.fillCircle(36, 17, 1);

    // Detailed antenna array
    graphics.lineStyle(2, 0x60a5fa);
    graphics.beginPath();
    graphics.moveTo(26, 8);
    graphics.lineTo(24, 4);
    graphics.moveTo(32, 8);
    graphics.lineTo(32, 3);
    graphics.moveTo(38, 8);
    graphics.lineTo(40, 4);
    graphics.strokePath();

    // Antenna tips with energy nodes
    graphics.fillStyle(0x00ffff);
    graphics.fillCircle(24, 4, 1.5);
    graphics.fillCircle(32, 3, 1.5);
    graphics.fillCircle(40, 4, 1.5);

    // Detailed arms with cyber enhancement
    graphics.fillStyle(0x1e3a8a);
    graphics.fillRoundedRect(8, 26, 8, 14, 3);
    graphics.fillRoundedRect(48, 26, 8, 14, 3);

    // Arm armor segments
    graphics.fillStyle(0x3b82f6);
    graphics.fillRoundedRect(10, 28, 4, 4, 1);
    graphics.fillRoundedRect(10, 34, 4, 4, 1);
    graphics.fillRoundedRect(50, 28, 4, 4, 1);
    graphics.fillRoundedRect(50, 34, 4, 4, 1);

    // Cyber gauntlets with detailed design
    graphics.fillStyle(0x60a5fa);
    graphics.fillRoundedRect(9, 38, 6, 6, 2);
    graphics.fillRoundedRect(49, 38, 6, 6, 2);

    // Gauntlet details
    graphics.fillStyle(0x00ffff);
    graphics.fillRect(10, 39, 4, 1);
    graphics.fillRect(10, 41, 4, 1);
    graphics.fillRect(50, 39, 4, 1);
    graphics.fillRect(50, 41, 4, 1);

    // Finger projectors
    graphics.fillStyle(0x00ffff);
    for (let i = 0; i < 3; i++) {
      graphics.fillCircle(10 + i * 1.5, 43, 0.5);
      graphics.fillCircle(50 + i * 1.5, 43, 0.5);
    }

    // Lower body with hover technology
    graphics.fillStyle(0x1e3a8a);
    graphics.fillRoundedRect(24, 50, 16, 10, 4);

    // Leg armor with energy channels
    graphics.fillStyle(0x3b82f6);
    graphics.fillRoundedRect(26, 52, 5, 6, 2);
    graphics.fillRoundedRect(33, 52, 5, 6, 2);

    // Hover boot systems with detailed effects
    graphics.fillStyle(0x60a5fa);
    graphics.fillRoundedRect(25, 58, 6, 4, 2);
    graphics.fillRoundedRect(33, 58, 6, 4, 2);

    // Hover energy indicators
    graphics.fillStyle(0x00ffff);
    graphics.fillCircle(28, 61, 1);
    graphics.fillCircle(36, 61, 1);
    graphics.fillStyle(0xffffff, 0.4);
    graphics.fillCircle(28, 61, 2);
    graphics.fillCircle(36, 61, 2);

    graphics.generateTexture('aria_idle', 64, 64);

    // ARIA Combat and Special frames with similar detail level
    graphics.generateTexture('aria_combat', 64, 64);
    graphics.generateTexture('aria_special', 64, 64);
  }

  createTitanSprites(graphics) {
    // TITAN Frame 1 - Idle Stance - Heavily Detailed Assault Mech
    graphics.clear();

    // === TITAN - HEAVY ASSAULT MECH ===
    // Massive main torso with battle armor
    graphics.fillStyle(0x7f1d1d); // Dark red base
    graphics.fillRect(16, 20, 32, 24);

    // Heavy armor plating with battle damage
    graphics.fillStyle(0x1f2937); // Dark armor
    graphics.fillRect(18, 22, 28, 20);

    // Battle scars and damage marks
    graphics.fillStyle(0x374151);
    graphics.fillRect(20, 24, 2, 6);
    graphics.fillRect(42, 26, 2, 4);
    graphics.fillRect(25, 38, 3, 2);

    // Nuclear reactor core with warning systems
    graphics.fillStyle(0xdc2626); // Reactor housing
    graphics.fillRect(26, 28, 12, 10);
    graphics.fillStyle(0xef4444); // Reactor core
    graphics.fillRect(28, 30, 8, 6);
    graphics.fillStyle(0xff6b6b); // Inner core
    graphics.fillRect(30, 31, 4, 4);
    graphics.fillStyle(0xffa500); // Core center
    graphics.fillRect(31, 32, 2, 2);

    // Reactor warning indicators
    graphics.fillStyle(0xffff00);
    graphics.fillRect(27, 29, 1, 1);
    graphics.fillRect(36, 29, 1, 1);
    graphics.fillRect(27, 35, 1, 1);
    graphics.fillRect(36, 35, 1, 1);

    // Radiation warning symbols
    graphics.lineStyle(1, 0xffff00, 0.8);
    graphics.beginPath();
    graphics.arc(32, 33, 3, 0, Math.PI * 2);
    graphics.strokePath();

    // Massive shoulder weapon platforms
    graphics.fillStyle(0x1f2937);
    graphics.fillRect(8, 18, 12, 18);
    graphics.fillRect(44, 18, 12, 18);

    // Shoulder armor plating
    graphics.fillStyle(0x7f1d1d);
    graphics.fillRect(10, 20, 8, 6);
    graphics.fillRect(46, 20, 8, 6);

    // Weapon mounting systems
    graphics.fillStyle(0x374151);
    graphics.fillRect(11, 22, 6, 4);
    graphics.fillRect(47, 22, 6, 4);

    // Multiple weapon barrels
    graphics.fillStyle(0x1f2937);
    for (let i = 0; i < 2; i++) {
      graphics.fillRect(12 + i * 3, 28, 2, 8);
      graphics.fillRect(48 + i * 3, 28, 2, 8);
    }

    // Weapon barrel details
    graphics.fillStyle(0x374151);
    for (let i = 0; i < 2; i++) {
      graphics.fillRect(12 + i * 3, 28, 1, 8);
      graphics.fillRect(48 + i * 3, 28, 1, 8);
    }

    // Battle helmet with intimidating design
    graphics.fillStyle(0x1f2937);
    graphics.fillRect(20, 6, 24, 16);

    // Helmet armor plating
    graphics.fillStyle(0x374151);
    graphics.fillRect(22, 8, 20, 4);
    graphics.fillRect(22, 18, 20, 2);

    // Combat visor with targeting system
    graphics.fillStyle(0x7f1d1d);
    graphics.fillRect(24, 12, 16, 8);

    // Menacing red eyes with detailed targeting
    graphics.fillStyle(0xff0000);
    graphics.fillRect(26, 14, 4, 4);
    graphics.fillRect(34, 14, 4, 4);

    // Eye glow effects
    graphics.fillStyle(0xff6b6b);
    graphics.fillRect(27, 15, 2, 2);
    graphics.fillRect(35, 15, 2, 2);

    // Targeting crosshairs
    graphics.lineStyle(1, 0xffa500);
    graphics.beginPath();
    graphics.moveTo(26, 16);
    graphics.lineTo(30, 16);
    graphics.moveTo(28, 14);
    graphics.lineTo(28, 18);
    graphics.moveTo(34, 16);
    graphics.lineTo(38, 16);
    graphics.moveTo(36, 14);
    graphics.lineTo(36, 18);
    graphics.strokePath();

    // Communication array with detailed antennas
    graphics.lineStyle(3, 0x374151);
    graphics.beginPath();
    graphics.moveTo(24, 6);
    graphics.lineTo(22, 2);
    graphics.moveTo(32, 6);
    graphics.lineTo(32, 1);
    graphics.moveTo(40, 6);
    graphics.lineTo(42, 2);
    graphics.strokePath();

    // Antenna details
    graphics.fillStyle(0x7f1d1d);
    graphics.fillCircle(22, 2, 1);
    graphics.fillCircle(32, 1, 1);
    graphics.fillCircle(42, 2, 1);

    // Heavy assault arms with weapon systems
    graphics.fillStyle(0x1f2937);
    graphics.fillRect(4, 24, 8, 16);
    graphics.fillRect(52, 24, 8, 16);

    // Arm armor segments
    graphics.fillStyle(0x7f1d1d);
    graphics.fillRect(6, 26, 4, 4);
    graphics.fillRect(6, 32, 4, 4);
    graphics.fillRect(54, 26, 4, 4);
    graphics.fillRect(54, 32, 4, 4);

    // Weapon gauntlets with multiple systems
    graphics.fillStyle(0x374151);
    graphics.fillRect(5, 38, 6, 8);
    graphics.fillRect(53, 38, 6, 8);

    // Gauntlet weapon systems
    graphics.fillStyle(0xef4444);
    graphics.fillRect(6, 40, 1, 4);
    graphics.fillRect(8, 40, 1, 4);
    graphics.fillRect(54, 40, 1, 4);
    graphics.fillRect(56, 40, 1, 4);

    // Weapon charging indicators
    graphics.fillStyle(0xffa500);
    graphics.fillCircle(7, 39, 0.5);
    graphics.fillCircle(9, 39, 0.5);
    graphics.fillCircle(55, 39, 0.5);
    graphics.fillCircle(57, 39, 0.5);

    // Massive legs with hydraulic systems
    graphics.fillStyle(0x1f2937);
    graphics.fillRect(20, 44, 24, 12);

    // Leg armor with hydraulic details
    graphics.fillStyle(0x7f1d1d);
    graphics.fillRect(22, 46, 8, 8);
    graphics.fillRect(34, 46, 8, 8);

    // Hydraulic pistons
    graphics.fillStyle(0x374151);
    graphics.fillRect(24, 48, 2, 6);
    graphics.fillRect(26, 48, 2, 6);
    graphics.fillRect(36, 48, 2, 6);
    graphics.fillRect(38, 48, 2, 6);

    // Heavy assault boots with spikes
    graphics.fillStyle(0x374151);
    graphics.fillRect(23, 54, 6, 4);
    graphics.fillRect(35, 54, 6, 4);

    // Boot spikes and treads
    graphics.fillStyle(0xef4444);
    graphics.fillRect(24, 57, 1, 2);
    graphics.fillRect(26, 57, 1, 2);
    graphics.fillRect(28, 57, 1, 2);
    graphics.fillRect(36, 57, 1, 2);
    graphics.fillRect(38, 57, 1, 2);
    graphics.fillRect(40, 57, 1, 2);

    graphics.generateTexture('titan_idle', 64, 64);

    // TITAN Combat and Special frames
    graphics.generateTexture('titan_combat', 64, 64);
    graphics.generateTexture('titan_special', 64, 64);
  }

  createNexusSprites(graphics) {
    // NEXUS Frame 1 - Scanning Mode - Highly Detailed Tech Specialist
    graphics.clear();

    // === NEXUS - ADVANCED TECH SPECIALIST MECH ===
    // Main body with quantum processing architecture
    graphics.fillStyle(0x047857); // Deep tech green
    graphics.fillRect(20, 22, 24, 26);

    // Quantum processing matrix with detailed panels
    graphics.fillStyle(0xfbbf24); // Gold processing units
    graphics.fillRect(22, 24, 20, 22);

    // Central quantum core with particle effects
    graphics.fillStyle(0x10b981); // Bright green core
    graphics.fillRect(26, 28, 12, 14);
    graphics.fillStyle(0x00ff88); // Inner core
    graphics.fillRect(28, 30, 8, 10);
    graphics.fillStyle(0x00ffff); // Core center
    graphics.fillRect(30, 32, 4, 6);

    // Quantum data grid with detailed matrix
    graphics.lineStyle(1, 0x047857, 0.8);
    for (let i = 0; i < 6; i++) {
      graphics.beginPath();
      graphics.moveTo(27 + i * 2, 29);
      graphics.lineTo(27 + i * 2, 41);
      graphics.strokePath();
    }
    for (let i = 0; i < 6; i++) {
      graphics.beginPath();
      graphics.moveTo(27, 30 + i * 2);
      graphics.lineTo(37, 30 + i * 2);
      graphics.strokePath();
    }

    // Quantum data streams with animation indicators
    graphics.fillStyle(0x00ffff, 0.8);
    for (let i = 0; i < 3; i++) {
      graphics.fillRect(28, 31 + i * 3, 8, 1);
    }

    // Angular shoulder tech arrays with detailed design
    graphics.fillStyle(0x047857);
    // Left shoulder
    graphics.beginPath();
    graphics.moveTo(12, 20);
    graphics.lineTo(20, 24);
    graphics.lineTo(20, 36);
    graphics.lineTo(12, 32);
    graphics.closePath();
    graphics.fillPath();

    // Right shoulder
    graphics.beginPath();
    graphics.moveTo(52, 20);
    graphics.lineTo(44, 24);
    graphics.lineTo(44, 36);
    graphics.lineTo(52, 32);
    graphics.closePath();
    graphics.fillPath();

    // Shoulder quantum processors
    graphics.fillStyle(0xfbbf24);
    graphics.fillRect(14, 22, 4, 8);
    graphics.fillRect(46, 22, 4, 8);

    // Quantum sensor arrays
    graphics.fillStyle(0x10b981);
    graphics.fillRect(15, 24, 2, 2);
    graphics.fillRect(15, 27, 2, 2);
    graphics.fillRect(47, 24, 2, 2);
    graphics.fillRect(47, 27, 2, 2);

    // Sensor beam indicators
    graphics.fillStyle(0x00ff88);
    graphics.fillCircle(16, 25, 0.5);
    graphics.fillCircle(16, 28, 0.5);
    graphics.fillCircle(48, 25, 0.5);
    graphics.fillCircle(48, 28, 0.5);

    // Advanced scanning head with detailed visor
    graphics.fillStyle(0x047857);
    graphics.beginPath();
    graphics.moveTo(22, 8);
    graphics.lineTo(42, 8);
    graphics.lineTo(40, 20);
    graphics.lineTo(24, 20);
    graphics.closePath();
    graphics.fillPath();

    // Head armor plating
    graphics.fillStyle(0x10b981);
    graphics.fillRect(24, 10, 16, 3);
    graphics.fillRect(24, 17, 16, 2);

    // Quantum visor array with multiple scanning systems
    graphics.fillStyle(0xfbbf24);
    graphics.fillRect(26, 13, 12, 6);

    // Multi-spectrum scanning array
    graphics.fillStyle(0x00ff88);
    for (let i = 0; i < 3; i++) {
      graphics.fillRect(28 + i * 3, 14, 2, 4);
    }

    // Scanning beam effects
    graphics.fillStyle(0x00ffff, 0.6);
    for (let i = 0; i < 3; i++) {
      graphics.fillRect(27 + i * 3, 13, 4, 6);
    }

    // Quantum processing array on head
    graphics.lineStyle(2, 0xfbbf24);
    graphics.beginPath();
    graphics.moveTo(26, 8);
    graphics.lineTo(24, 4);
    graphics.moveTo(30, 8);
    graphics.lineTo(30, 3);
    graphics.moveTo(34, 8);
    graphics.lineTo(34, 3);
    graphics.moveTo(38, 8);
    graphics.lineTo(40, 4);
    graphics.strokePath();

    // Quantum processing nodes
    graphics.fillStyle(0x00ff88);
    graphics.fillCircle(24, 4, 1);
    graphics.fillCircle(30, 3, 1);
    graphics.fillCircle(34, 3, 1);
    graphics.fillCircle(40, 4, 1);

    // Node energy indicators
    graphics.fillStyle(0x00ffff, 0.4);
    graphics.fillCircle(24, 4, 2);
    graphics.fillCircle(30, 3, 2);
    graphics.fillCircle(34, 3, 2);
    graphics.fillCircle(40, 4, 2);

    // Tech arms with modular systems
    graphics.fillStyle(0x047857);
    graphics.fillRect(8, 26, 8, 14);
    graphics.fillRect(48, 26, 8, 14);

    // Modular tech segments
    graphics.fillStyle(0xfbbf24);
    graphics.fillRect(10, 28, 4, 3);
    graphics.fillRect(10, 33, 4, 3);
    graphics.fillRect(50, 28, 4, 3);
    graphics.fillRect(50, 33, 4, 3);

    // Tech module details
    graphics.fillStyle(0x10b981);
    graphics.fillRect(11, 29, 2, 1);
    graphics.fillRect(11, 34, 2, 1);
    graphics.fillRect(51, 29, 2, 1);
    graphics.fillRect(51, 34, 2, 1);

    // Holographic gauntlets with projector arrays
    graphics.fillStyle(0x00ff88);
    graphics.fillRect(9, 38, 6, 6);
    graphics.fillRect(49, 38, 6, 6);

    // Holographic projector details
    graphics.fillStyle(0x00ffff);
    for (let i = 0; i < 2; i++) {
      graphics.fillCircle(11 + i * 2, 40, 0.5);
      graphics.fillCircle(51 + i * 2, 40, 0.5);
    }

    // Projector beam indicators
    graphics.fillStyle(0xfbbf24, 0.3);
    graphics.fillRect(10, 42, 4, 2);
    graphics.fillRect(50, 42, 4, 2);

    // Hover-tech base with quantum systems
    graphics.fillStyle(0x047857);
    graphics.fillRect(22, 46, 20, 10);

    // Leg quantum processing units
    graphics.fillStyle(0xfbbf24);
    graphics.fillRect(24, 48, 6, 6);
    graphics.fillRect(34, 48, 6, 6);

    // Quantum leg details
    graphics.fillStyle(0x10b981);
    graphics.fillRect(25, 49, 4, 4);
    graphics.fillRect(35, 49, 4, 4);

    // Hover tech systems with detailed effects
    graphics.fillStyle(0x00ff88);
    graphics.fillRect(26, 50, 2, 2);
    graphics.fillRect(36, 50, 2, 2);

    // Quantum hover indicators with energy fields
    graphics.fillStyle(0x00ffff);
    for (let i = 0; i < 5; i++) {
      graphics.fillCircle(24 + i * 3, 55, 0.8);
    }

    // Hover energy field effects
    graphics.fillStyle(0x00ffff, 0.2);
    for (let i = 0; i < 5; i++) {
      graphics.fillCircle(24 + i * 3, 55, 2);
    }

    graphics.generateTexture('nexus_idle', 64, 64);

    // NEXUS Combat and Special frames
    graphics.generateTexture('nexus_combat', 64, 64);
    graphics.generateTexture('nexus_special', 64, 64);
  }

  createEnhancedBackground() {
    // Create immersive robot hangar environment with better performance
    const bg = this.add.graphics();

    // Deep space hangar gradient
    bg.fillGradientStyle(0x0a0a1a, 0x0a0a1a, 0x1a0a2e, 0x2d1b69, 1);
    bg.fillRect(0, 0, this.scale.width, this.scale.height);

    // Hangar ceiling with structural beams
    const ceilingGraphics = this.add.graphics();
    ceilingGraphics.fillStyle(0x1a1a1a, 0.8);
    ceilingGraphics.fillRect(0, 0, this.scale.width, 100);

    // Structural support beams
    ceilingGraphics.fillStyle(0x333333);
    for (let i = 0; i < 5; i++) {
      const x = (this.scale.width / 5) * i;
      ceilingGraphics.fillRect(x, 0, 20, 120);

      // Beam details
      ceilingGraphics.fillStyle(0x555555);
      ceilingGraphics.fillRect(x + 2, 0, 16, 120);
      ceilingGraphics.fillStyle(0x777777);
      ceilingGraphics.fillRect(x + 4, 0, 12, 120);
    }

    // Hangar lighting strips
    ceilingGraphics.lineStyle(4, 0x00ffff, 0.6);
    for (let i = 0; i < 4; i++) {
      const y = 20 + i * 20;
      ceilingGraphics.beginPath();
      ceilingGraphics.moveTo(0, y);
      ceilingGraphics.lineTo(this.scale.width, y);
      ceilingGraphics.strokePath();
    }

    // Hangar floor with tech panels
    const floorY = this.scale.height - 100;
    const floorGraphics = this.add.graphics();
    floorGraphics.fillStyle(0x1a1a1a, 0.9);
    floorGraphics.fillRect(0, floorY, this.scale.width, 100);

    // Tech floor panels
    floorGraphics.fillStyle(0x2a2a2a);
    for (let x = 0; x < this.scale.width; x += 60) {
      for (let y = floorY; y < this.scale.height; y += 60) {
        floorGraphics.fillRect(x + 2, y + 2, 56, 56);

        // Panel details
        floorGraphics.fillStyle(0x00ffff, 0.1);
        floorGraphics.fillRect(x + 10, y + 10, 40, 40);
        floorGraphics.fillStyle(0x2a2a2a);
      }
    }

    // Holographic grid overlay
    const gridGraphics = this.add.graphics();
    gridGraphics.lineStyle(1, 0x00ffff, 0.2);

    // Vertical grid lines
    for (let x = 0; x <= this.scale.width; x += 40) {
      gridGraphics.beginPath();
      gridGraphics.moveTo(x, 100);
      gridGraphics.lineTo(x, this.scale.height - 100);
      gridGraphics.strokePath();
    }

    // Horizontal grid lines
    for (let y = 100; y <= this.scale.height - 100; y += 40) {
      gridGraphics.beginPath();
      gridGraphics.moveTo(0, y);
      gridGraphics.lineTo(this.scale.width, y);
      gridGraphics.strokePath();
    }

    // Atmospheric particles and energy streams
    this.createAtmosphericEffects();

    // Hangar side panels with tech displays
    this.createHangarPanels();

    // Dynamic lighting effects
    this.createDynamicLighting();
  }

  createAtmosphericEffects() {
    // Floating energy particles
    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.Between(0, this.scale.width);
      const y = Phaser.Math.Between(100, this.scale.height - 100);
      const colors = [0x00ffff, 0xff00ff, 0xffff00, 0x00ff00];
      const color = Phaser.Math.RND.pick(colors);

      const particle = this.add.graphics();
      particle.fillStyle(color, 0.6);
      particle.fillCircle(0, 0, Phaser.Math.Between(1, 3));
      particle.setPosition(x, y);
      particle.setDepth(5);

      // Floating animation
      this.tweens.add({
        targets: particle,
        y: y - Phaser.Math.Between(50, 150),
        x: x + Phaser.Math.Between(-30, 30),
        alpha: 0.1,
        scale: 0.5,
        duration: Phaser.Math.Between(4000, 8000),
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }

    // Energy streams across the hangar
    for (let i = 0; i < 5; i++) {
      const stream = this.add.graphics();
      stream.lineStyle(2, 0x00ffff, 0.4);

      const startX = Phaser.Math.Between(0, this.scale.width);
      const startY = Phaser.Math.Between(100, 200);
      const endX = Phaser.Math.Between(0, this.scale.width);
      const endY = Phaser.Math.Between(
        this.scale.height - 200,
        this.scale.height - 100
      );

      stream.beginPath();
      stream.moveTo(startX, startY);
      stream.lineTo(endX, endY);
      stream.strokePath();
      stream.setDepth(3);

      // Pulsing animation
      this.tweens.add({
        targets: stream,
        alpha: 0.1,
        duration: Phaser.Math.Between(2000, 4000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  createHangarPanels() {
    // Left side tech panel
    const leftPanel = this.add.graphics();
    leftPanel.fillStyle(0x1a1a1a, 0.8);
    leftPanel.fillRect(0, 120, 80, this.scale.height - 220);
    leftPanel.lineStyle(2, 0x00ffff, 0.6);
    leftPanel.strokeRect(0, 120, 80, this.scale.height - 220);

    // Panel displays
    for (let i = 0; i < 6; i++) {
      const y = 140 + i * 60;
      leftPanel.fillStyle(0x00ffff, 0.2);
      leftPanel.fillRect(10, y, 60, 40);

      // Display lines
      leftPanel.lineStyle(1, 0x00ffff, 0.8);
      for (let j = 0; j < 4; j++) {
        leftPanel.beginPath();
        leftPanel.moveTo(15, y + 5 + j * 8);
        leftPanel.lineTo(65, y + 5 + j * 8);
        leftPanel.strokePath();
      }
    }

    // Right side tech panel
    const rightPanel = this.add.graphics();
    rightPanel.fillStyle(0x1a1a1a, 0.8);
    rightPanel.fillRect(
      this.scale.width - 80,
      120,
      80,
      this.scale.height - 220
    );
    rightPanel.lineStyle(2, 0x00ffff, 0.6);
    rightPanel.strokeRect(
      this.scale.width - 80,
      120,
      80,
      this.scale.height - 220
    );

    // Panel displays
    for (let i = 0; i < 6; i++) {
      const y = 140 + i * 60;
      rightPanel.fillStyle(0xff00ff, 0.2);
      rightPanel.fillRect(this.scale.width - 70, y, 60, 40);

      // Display lines
      rightPanel.lineStyle(1, 0xff00ff, 0.8);
      for (let j = 0; j < 4; j++) {
        rightPanel.beginPath();
        rightPanel.moveTo(this.scale.width - 65, y + 5 + j * 8);
        rightPanel.lineTo(this.scale.width - 15, y + 5 + j * 8);
        rightPanel.strokePath();
      }
    }

    // Add blinking status lights
    this.createStatusLights();
  }

  createStatusLights() {
    const colors = [0x00ff00, 0xffff00, 0xff0000, 0x00ffff];

    for (let i = 0; i < 8; i++) {
      const x = i < 4 ? 20 : this.scale.width - 20;
      const y = 150 + (i % 4) * 80;
      const color = Phaser.Math.RND.pick(colors);

      const light = this.add.graphics();
      light.fillStyle(color, 0.8);
      light.fillCircle(x, y, 4);
      light.setDepth(10);

      // Blinking animation
      this.tweens.add({
        targets: light,
        alpha: 0.2,
        duration: Phaser.Math.Between(1000, 3000),
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  createDynamicLighting() {
    // Create dynamic lighting that responds to robot selection
    this.ambientLighting = this.add.graphics();
    this.ambientLighting.setDepth(1);

    // Initial ambient lighting
    this.updateAmbientLighting(0x00ffff);

    // Spotlight effects
    for (let i = 0; i < 3; i++) {
      const spotlight = this.add.graphics();
      spotlight.setDepth(2);

      const x = (this.scale.width / 4) * (i + 1);
      const y = 100;

      // Create spotlight cone
      spotlight.fillStyle(0xffffff, 0.05);
      spotlight.beginPath();
      spotlight.moveTo(x, y);
      spotlight.lineTo(x - 50, this.scale.height - 100);
      spotlight.lineTo(x + 50, this.scale.height - 100);
      spotlight.closePath();
      spotlight.fillPath();

      // Spotlight movement
      this.tweens.add({
        targets: spotlight,
        rotation: 0.1,
        duration: 4000,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });
    }
  }

  updateAmbientLighting(color) {
    this.ambientLighting.clear();
    this.ambientLighting.fillStyle(color, 0.03);
    this.ambientLighting.fillRect(0, 0, this.scale.width, this.scale.height);

    // Add color-specific atmospheric effects
    const atmosphereColor = color;
    for (let i = 0; i < 10; i++) {
      const x = Phaser.Math.Between(100, this.scale.width - 100);
      const y = Phaser.Math.Between(200, this.scale.height - 200);

      this.ambientLighting.fillStyle(atmosphereColor, 0.02);
      this.ambientLighting.fillCircle(x, y, Phaser.Math.Between(20, 60));
    }
  }

  create() {
    console.log('CharacterSelectScene: Starting character selection');

    // Initialize responsive layout system
    this.initializeLayout();

    // Check for preselected robot from IntroScene
    const sceneData = this.scene.settings.data;
    if (sceneData && sceneData.preselectedRobot) {
      this.selectedCharacterType = sceneData.preselectedRobot;
      this.characterData.type = sceneData.preselectedRobot;
      console.log(
        `CharacterSelectScene: Preselected robot: ${sceneData.preselectedRobot}`
      );
    }

    // Create immersive robot hangar environment
    this.createEnhancedBackground();

    // Create all UI sections with proper spacing
    this.createResponsiveLayout();

    // Initialize with selected character
    this.selectCharacter(this.selectedCharacterType);
    this.selectBonus(0);

    // Show enhanced entrance animation
    this.showEnhancedEntranceAnimation();

    // Add resize handler for responsive design
    this.scale.on('resize', this.handleResize, this);
  }

  initializeLayout(isRecursiveCall = false) {
    const { width, height } = this.scale;
    const { spacing, responsive } = this.layout;

    // Calculate available content area
    const contentWidth = Math.min(
      width - spacing.padding * 2,
      responsive.maxContentWidth
    );
    const contentHeight = height - spacing.padding * 2;
    const centerX = width / 2;

    // Adaptive spacing based on screen height
    const baseSpacing = Math.max(20, Math.min(spacing.section, height * 0.05));
    const adaptiveSpacing = {
      section: baseSpacing,
      element: spacing.element,
      padding: Math.max(30, Math.min(spacing.padding, width * 0.03)),
    };

    // Calculate section positions with horizontal three-column layout
    let currentY = adaptiveSpacing.padding + 20;

    // Title section - full width at top
    const titleHeight = Math.max(50, Math.min(70, height * 0.1));
    this.layout.sections.title = {
      x: centerX,
      y: currentY,
      width: contentWidth,
      height: titleHeight,
    };
    currentY += this.layout.sections.title.height + adaptiveSpacing.section;

    // Name input section - centered, compact
    const nameInputHeight = Math.max(60, Math.min(80, height * 0.12));
    this.layout.sections.nameInput = {
      x: centerX,
      y: currentY,
      width: Math.min(400, contentWidth * 0.5),
      height: nameInputHeight,
    };
    currentY += this.layout.sections.nameInput.height + adaptiveSpacing.section;

    // Main content area - three columns
    const mainContentHeight = height - currentY - adaptiveSpacing.padding - 80; // Reserve space for navigation
    const columnWidth = (contentWidth - 40) / 3; // 20px spacing between columns

    // Left column: Character selection
    this.layout.sections.characters = {
      x: centerX - contentWidth / 2 + columnWidth / 2,
      y: currentY + mainContentHeight / 2,
      width: columnWidth,
      height: mainContentHeight,
    };

    // Center column: Robot preview
    this.layout.sections.preview = {
      x: centerX,
      y: currentY + mainContentHeight / 2,
      width: columnWidth,
      height: mainContentHeight,
    };

    // Right column: Mission loadout
    this.layout.sections.bonuses = {
      x: centerX + contentWidth / 2 - columnWidth / 2,
      y: currentY + mainContentHeight / 2,
      width: columnWidth,
      height: mainContentHeight,
    };

    // Navigation buttons - fixed at bottom
    const navHeight = Math.max(50, Math.min(60, height * 0.08));
    this.layout.sections.navigation = {
      x: centerX,
      y: height - adaptiveSpacing.padding - navHeight / 2,
      width: contentWidth,
      height: navHeight,
    };

    // Store adaptive spacing for use by other methods
    this.layout.adaptiveSpacing = adaptiveSpacing;

    // No overflow check needed with horizontal layout
    console.log('Layout: Using horizontal three-column design');
  }

  createResponsiveLayout() {
    this.createEnhancedTitle();
    this.createEnhancedNameSection();
    this.createEnhancedRobotPreview();
    this.createEnhancedCharacterSelection();
    this.createEnhancedBonusSelection();
    this.createEnhancedNavigationButtons();
  }

  createEnhancedTitle() {
    const section = this.layout.sections.title;

    const title = this.add
      .text(section.x, section.y, '⚔️ ROBOT COMMAND CENTER', {
        fontSize: this.getResponsiveFontSize(42),
        fontFamily: 'Courier, monospace',
        fill: '#00ffff',
        stroke: '#ff00ff',
        strokeThickness: 4,
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(100);

    const subtitle = this.add
      .text(
        section.x,
        section.y + 35,
        'Select your cyber companion for the missions ahead',
        {
          fontSize: this.getResponsiveFontSize(16),
          fontFamily: 'Courier, monospace',
          fill: '#ffff00',
          stroke: '#000000',
          strokeThickness: 2,
          alpha: 0.9,
        }
      )
      .setOrigin(0.5)
      .setDepth(100);

    // Enhanced glow effects
    this.createGlowEffect(title, 0x00ffff);
    this.createPulseAnimation(subtitle);
  }

  createEnhancedNameSection() {
    const section = this.layout.sections.nameInput;

    // Compact background
    const nameBg = this.add.graphics();
    nameBg.fillStyle(0x000000, 0.7);
    nameBg.fillRoundedRect(
      section.x - section.width / 2 - 15,
      section.y - section.height / 2,
      section.width + 30,
      section.height,
      12
    );
    nameBg.lineStyle(2, 0x00ffff, 0.9);
    nameBg.strokeRoundedRect(
      section.x - section.width / 2 - 15,
      section.y - section.height / 2,
      section.width + 30,
      section.height,
      12
    );
    nameBg.setDepth(90);

    // Compact section title
    this.add
      .text(section.x, section.y - 25, '🎯 PILOT CALLSIGN', {
        fontSize: this.getResponsiveFontSize(18),
        fontFamily: 'Courier, monospace',
        fill: '#ffff00',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5)
      .setDepth(101);

    // Create compact HTML input
    this.createCompactNameInput(section);

    // Compact character counter
    this.characterCounter = this.add
      .text(section.x + section.width / 2 - 5, section.y + 15, '0/20', {
        fontSize: this.getResponsiveFontSize(10),
        fontFamily: 'Courier, monospace',
        fill: '#9ca3af',
        alpha: 0.8,
      })
      .setOrigin(1, 0.5)
      .setDepth(101);

    // Compact validation status
    this.validationStatus = this.add
      .text(section.x - section.width / 2 + 5, section.y + 15, '', {
        fontSize: this.getResponsiveFontSize(10),
        fontFamily: 'Courier, monospace',
        fill: '#ff0000',
        fontStyle: 'bold',
      })
      .setOrigin(0, 0.5)
      .setDepth(101);

    // Create interactive suggestions
    this.createInteractiveSuggestions(section);

    // Create typing effects
    this.createTypingEffects(section);
  }

  createCompactNameInput(section) {
    const input = document.createElement('input');
    input.type = 'text';
    input.placeholder = 'Enter callsign...';
    input.maxLength = 20;
    input.style.position = 'absolute';

    // Compact responsive positioning
    const gameCanvas = document.querySelector('canvas');
    const canvasRect = gameCanvas
      ? gameCanvas.getBoundingClientRect()
      : { left: 0, top: 0 };

    const inputWidth = Math.min(280, section.width * 0.8);
    const inputHeight = 35;

    input.style.left = `${canvasRect.left + section.x - inputWidth / 2}px`;
    input.style.top = `${canvasRect.top + section.y - inputHeight / 2}px`;
    input.style.width = `${inputWidth}px`;
    input.style.height = `${inputHeight}px`;

    // Compact styling
    input.style.fontSize = `${this.getResponsiveFontSize(14)}px`;
    input.style.textAlign = 'center';
    input.style.border = '2px solid #00ffff';
    input.style.borderRadius = '8px';
    input.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
    input.style.color = '#00ffff';
    input.style.outline = 'none';
    input.style.fontFamily = 'Courier, monospace';
    input.style.fontWeight = 'bold';
    input.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.5)';
    input.style.zIndex = '1000';
    input.style.transition = 'all 0.3s ease';

    document.body.appendChild(input);
    this.nameInput = input;

    // Compact event listeners
    input.addEventListener('input', e => {
      const value = e.target.value.trim();
      this.characterData.name = value;
      this.updateInputFeedback(value);
      this.updateCharacterCounter(value.length);
      this.validateInput(value);
      this.updateReadyState();
    });

    input.addEventListener('keydown', e => {
      if (e.key === 'Enter' && this.isReady) {
        this.startAdventure();
      }
    });

    // Compact focus/blur effects
    input.addEventListener('focus', () => {
      input.style.border = '2px solid #ff00ff';
      input.style.boxShadow = '0 0 20px rgba(255, 0, 255, 0.7)';
      input.style.transform = 'scale(1.02)';
    });

    input.addEventListener('blur', () => {
      input.style.border = '2px solid #00ffff';
      input.style.boxShadow = '0 0 15px rgba(0, 255, 255, 0.5)';
      input.style.transform = 'scale(1)';
    });

    // Auto-focus
    setTimeout(() => {
      input.focus();
    }, 200);
  }

  createInteractiveSuggestions(section) {
    const suggestions = [
      'GHOST',
      'VIPER',
      'NOVA',
      'CYBER',
      'BLADE',
      'NEON',
      'STORM',
      'PHOENIX',
    ];

    // Create suggestion container with enhanced background
    this.suggestionContainer = this.add.container(section.x, section.y + 40);
    this.suggestionContainer.setDepth(102);

    // Enhanced background for suggestions
    const suggestionBg = this.add.graphics();
    suggestionBg.fillStyle(0x000000, 0.4);
    suggestionBg.fillRoundedRect(-200, -15, 400, 30, 8);
    suggestionBg.lineStyle(1, 0x00ffff, 0.6);
    suggestionBg.strokeRoundedRect(-200, -15, 400, 30, 8);
    this.suggestionContainer.add(suggestionBg);

    // Title for suggestions with better styling
    const suggestionTitle = this.add
      .text(0, -25, '⚡ QUICK SELECT CALLSIGNS:', {
        fontSize: this.getResponsiveFontSize(12),
        fontFamily: 'Courier, monospace',
        fill: '#ffff00',
        fontStyle: 'bold',
      })
      .setOrigin(0.5);

    this.suggestionContainer.add(suggestionTitle);

    // Create enhanced clickable suggestion buttons
    this.suggestionButtons = [];
    const buttonWidth = 65;
    const buttonSpacing = 6;
    const totalWidth =
      buttonWidth * suggestions.length +
      buttonSpacing * (suggestions.length - 1);
    const startX = -totalWidth / 2 + buttonWidth / 2;

    suggestions.forEach((suggestion, index) => {
      const x = startX + index * (buttonWidth + buttonSpacing);
      const y = 0;

      // Create enhanced button background with gradient effect
      const button = this.add
        .rectangle(x, y, buttonWidth, 22, 0x00ffff, 0.15)
        .setStrokeStyle(1, 0x00ffff, 0.8);

      // Add inner glow effect
      const buttonGlow = this.add.rectangle(
        x,
        y,
        buttonWidth - 2,
        20,
        0x00ffff,
        0.05
      );

      // Button text with enhanced styling
      const text = this.add
        .text(x, y, suggestion, {
          fontSize: this.getResponsiveFontSize(9),
          fontFamily: 'Courier, monospace',
          fill: '#00ffff',
          fontStyle: 'bold',
        })
        .setOrigin(0.5);

      // Make button interactive
      button.setInteractive({ useHandCursor: true });

      // Enhanced button interactions
      button.on('pointerover', () => {
        button.setFillStyle(0x00ffff, 0.4);
        button.setStrokeStyle(2, 0xffff00, 1);
        buttonGlow.setFillStyle(0xffff00, 0.2);
        text.setFill('#ffff00');
        button.setScale(1.08);
        text.setScale(1.08);

        // Add enhanced hover glow effect
        this.createEnhancedSuggestionHoverEffect(x, y);
      });

      button.on('pointerout', () => {
        button.setFillStyle(0x00ffff, 0.15);
        button.setStrokeStyle(1, 0x00ffff, 0.8);
        buttonGlow.setFillStyle(0x00ffff, 0.05);
        text.setFill('#00ffff');
        button.setScale(1);
        text.setScale(1);
      });

      button.on('pointerdown', () => {
        this.selectSuggestion(suggestion);
        this.createEnhancedSuggestionSelectEffect(x, y);
      });

      this.suggestionContainer.add([buttonGlow, button, text]);
      this.suggestionButtons.push({ button, text, buttonGlow, suggestion });
    });
  }

  createTypingEffects(section) {
    // Create typing indicator particles
    this.typingParticles = [];

    // Create cursor blink effect area
    this.cursorEffect = this.add.graphics();
    this.cursorEffect.setDepth(103);

    // Animated background pulse for active input
    this.inputPulse = this.add.graphics();
    this.inputPulse.setDepth(89);
    this.inputPulse.setAlpha(0);

    // Show entrance animation for suggestions
    this.showInputEntranceAnimation();
  }

  updateInputFeedback(value) {
    const { length } = value;

    // Update input border color based on validation
    if (this.nameInput) {
      if (length === 0) {
        this.nameInput.style.borderColor = '#00ffff';
      } else if (length < 2) {
        this.nameInput.style.borderColor = '#ffff00';
      } else if (length >= 2 && length <= 15) {
        this.nameInput.style.borderColor = '#00ff00';
      } else {
        this.nameInput.style.borderColor = '#ff6600';
      }
    }

    // Update glow effect intensity
    const glowIntensity = Math.min(length / 10, 1);
    if (this.nameInput) {
      this.nameInput.style.boxShadow = `0 0 ${25 + glowIntensity * 15}px rgba(0, 255, 255, ${0.6 + glowIntensity * 0.4}), inset 0 0 15px rgba(0, 255, 255, 0.1)`;
    }
  }

  updateCharacterCounter(length) {
    if (this.characterCounter) {
      this.characterCounter.setText(`${length}/20`);

      // Color coding for character count
      if (length === 0) {
        this.characterCounter.setFill('#9ca3af');
      } else if (length < 2) {
        this.characterCounter.setFill('#ffff00');
      } else if (length <= 15) {
        this.characterCounter.setFill('#00ff00');
      } else if (length <= 18) {
        this.characterCounter.setFill('#ff6600');
      } else {
        this.characterCounter.setFill('#ff0000');
      }

      // Pulse animation for counter updates
      this.tweens.add({
        targets: this.characterCounter,
        scaleX: 1.2,
        scaleY: 1.2,
        duration: 100,
        yoyo: true,
        ease: 'Power2.easeOut',
      });
    }
  }

  validateInput(value) {
    if (!this.validationStatus) return;

    let message = '';
    let color = '#00ff00';

    if (value.length === 0) {
      message = '';
    } else if (value.length < 2) {
      message = '⚠️ Too short';
      color = '#ffff00';
    } else if (value.length >= 2 && value.length <= 15) {
      message = '✅ Perfect!';
      color = '#00ff00';
    } else if (value.length <= 18) {
      message = '⚠️ Getting long';
      color = '#ff6600';
    } else {
      message = '❌ Too long';
      color = '#ff0000';
    }

    this.validationStatus.setText(message);
    this.validationStatus.setFill(color);

    // Validation message animation
    if (message) {
      this.validationStatus.setAlpha(0);
      this.tweens.add({
        targets: this.validationStatus,
        alpha: 1,
        duration: 200,
        ease: 'Power2.easeOut',
      });
    }
  }

  createTypingParticles() {
    if (!this.nameInput) return;

    // Create small particles that appear when typing
    for (let i = 0; i < 3; i++) {
      const particle = this.add.graphics();
      particle.fillStyle(0x00ffff, 0.8);
      particle.fillCircle(0, 0, 1);

      const inputRect = this.nameInput.getBoundingClientRect();
      const gameCanvas = document.querySelector('canvas');
      const canvasRect = gameCanvas
        ? gameCanvas.getBoundingClientRect()
        : { left: 0, top: 0 };

      const x =
        inputRect.left -
        canvasRect.left +
        Phaser.Math.Between(20, inputRect.width - 20);
      const y =
        inputRect.top -
        canvasRect.top +
        Phaser.Math.Between(10, inputRect.height - 10);

      particle.setPosition(x, y);
      particle.setDepth(104);

      this.tweens.add({
        targets: particle,
        y: y - 20,
        alpha: 0,
        scale: 0.1,
        duration: 800,
        ease: 'Power2.easeOut',
        onComplete: () => particle.destroy(),
      });
    }
  }

  playTypingEffect() {
    // Visual typing effect - screen flash
    if (this.inputPulse) {
      this.inputPulse.clear();
      this.inputPulse.fillStyle(0x00ffff, 0.1);
      this.inputPulse.fillRect(0, 0, this.scale.width, this.scale.height);

      this.tweens.add({
        targets: this.inputPulse,
        alpha: 0,
        duration: 100,
        ease: 'Power2.easeOut',
      });
    }
  }

  showInputFocusEffect() {
    // Create focus ring effect
    this.focusRing = this.add.graphics();
    this.focusRing.setDepth(105);

    const section = this.layout.sections.nameInput;
    this.focusRing.lineStyle(2, 0xff00ff, 0.8);
    this.focusRing.strokeRoundedRect(
      section.x - section.width / 2 - 25,
      section.y - 25,
      section.width + 50,
      50,
      15
    );

    // Pulsing animation
    this.tweens.add({
      targets: this.focusRing,
      alpha: 0.3,
      duration: 1000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  hideInputFocusEffect() {
    if (this.focusRing) {
      this.tweens.killTweensOf(this.focusRing);
      this.focusRing.destroy();
      this.focusRing = null;
    }
  }

  showInputEntranceAnimation() {
    if (this.suggestionContainer) {
      this.suggestionContainer.setAlpha(0);
      this.suggestionContainer.setY(this.suggestionContainer.y + 20);

      this.tweens.add({
        targets: this.suggestionContainer,
        alpha: 1,
        y: this.suggestionContainer.y - 20,
        duration: 600,
        ease: 'Back.easeOut',
      });
    }
  }

  createEnhancedSuggestionHoverEffect(x, y) {
    const hoverEffect = this.add.graphics();
    hoverEffect.fillStyle(0xffff00, 0.3);
    hoverEffect.fillCircle(0, 0, 15);
    hoverEffect.setPosition(
      this.suggestionContainer.x + x,
      this.suggestionContainer.y + y
    );
    hoverEffect.setDepth(101);

    this.tweens.add({
      targets: hoverEffect,
      alpha: 0,
      scale: 2,
      duration: 300,
      ease: 'Power2.easeOut',
      onComplete: () => hoverEffect.destroy(),
    });
  }

  createEnhancedSuggestionSelectEffect(x, y) {
    // Create burst effect when suggestion is selected
    for (let i = 0; i < 8; i++) {
      const burst = this.add.graphics();
      burst.fillStyle(0x00ff00, 0.8);
      burst.fillCircle(0, 0, 2);
      burst.setPosition(
        this.suggestionContainer.x + x,
        this.suggestionContainer.y + y
      );
      burst.setDepth(106);

      const angle = (i / 8) * Math.PI * 2;
      this.tweens.add({
        targets: burst,
        x: burst.x + Math.cos(angle) * 30,
        y: burst.y + Math.sin(angle) * 30,
        alpha: 0,
        scale: 0.1,
        duration: 500,
        ease: 'Power2.easeOut',
        onComplete: () => burst.destroy(),
      });
    }
  }

  selectSuggestion(suggestion) {
    if (this.nameInput) {
      this.nameInput.value = suggestion;
      this.characterData.name = suggestion;
      this.updateInputFeedback(suggestion);
      this.updateCharacterCounter(suggestion.length);
      this.validateInput(suggestion);
      this.updateReadyState();

      // Flash effect for selection
      this.nameInput.style.backgroundColor = 'rgba(0, 255, 0, 0.3)';
      setTimeout(() => {
        this.nameInput.style.backgroundColor = 'rgba(0, 0, 0, 0.8)';
      }, 200);

      // Focus the input after selection
      this.nameInput.focus();
    }
  }

  createEnhancedRobotPreview() {
    const section = this.layout.sections.preview;

    // Enhanced section header
    this.add
      .text(
        section.x,
        section.y - section.height / 2 + 30,
        '🤖 ROBOT\nPREVIEW',
        {
          fontSize: this.getResponsiveFontSize(18),
          fontFamily: 'Courier, monospace',
          fill: '#00ffff',
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 2,
          align: 'center',
          lineSpacing: 5,
        }
      )
      .setOrigin(0.5)
      .setDepth(100);

    // Compact holographic display platform
    const platformBg = this.add.graphics();
    platformBg.fillStyle(0x000000, 0.8);
    platformBg.fillRoundedRect(
      section.x - section.width / 2 + 10,
      section.y - section.height / 2 + 70,
      section.width - 20,
      section.height - 140,
      15
    );

    // Multi-layer border effect
    platformBg.lineStyle(3, 0x00ffff, 0.9);
    platformBg.strokeRoundedRect(
      section.x - section.width / 2 + 10,
      section.y - section.height / 2 + 70,
      section.width - 20,
      section.height - 140,
      15
    );
    platformBg.setDepth(40);

    // Compact holographic grid
    this.createCompactHolographicGrid(section);

    // Central robot display with appropriate sizing
    try {
      // Try to create sprite with texture, but use fallback if not available
      if (this.textures.exists('aria_idle')) {
        this.previewRobot = this.add
          .sprite(section.x, section.y, 'aria_idle')
          .setScale(2.5)
          .setDepth(50);
      } else {
        // Create a fallback robot graphic
        this.previewRobot = this.createFallbackRobotGraphic(
          section.x,
          section.y
        );
      }
    } catch (error) {
      console.warn(
        'CharacterSelectScene: Could not create robot sprite, using fallback:',
        error
      );
      this.previewRobot = this.createFallbackRobotGraphic(section.x, section.y);
    }

    // Compact robot info display
    this.createCompactRobotInfo(section);

    // Enhanced particle system
    this.createEnhancedRobotParticles(section.x, section.y);

    // Compact demo buttons
    this.createCompactDemoButtons(section);

    // Start enhanced idle animation
    this.startEnhancedRobotAnimation();
  }

  createCompactHolographicGrid(section) {
    const gridGraphics = this.add.graphics();
    gridGraphics.lineStyle(1, 0x00ffff, 0.4);

    const gridWidth = section.width - 40;
    const gridHeight = 20;
    const gridX = section.x - gridWidth / 2;
    const gridY = section.y + section.height / 2 - 80;

    // Horizontal grid lines
    for (let i = 0; i <= 4; i++) {
      const y = gridY + i * 5;
      gridGraphics.beginPath();
      gridGraphics.moveTo(gridX, y);
      gridGraphics.lineTo(gridX + gridWidth, y);
      gridGraphics.strokePath();
    }

    // Vertical grid lines
    for (let i = 0; i <= 15; i++) {
      const x = gridX + i * (gridWidth / 15);
      gridGraphics.beginPath();
      gridGraphics.moveTo(x, gridY);
      gridGraphics.lineTo(x, gridY + gridHeight);
      gridGraphics.strokePath();
    }

    gridGraphics.setDepth(41);

    // Animated grid pulse
    this.tweens.add({
      targets: gridGraphics,
      alpha: 0.2,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  createCompactRobotInfo(section) {
    // Robot name with compact styling
    this.previewRobotName = this.add
      .text(section.x, section.y - section.height / 2 + 90, 'ARIA', {
        fontSize: this.getResponsiveFontSize(20),
        fontFamily: 'Courier, monospace',
        fill: '#00ffff',
        fontStyle: 'bold',
        stroke: '#000000',
        strokeThickness: 2,
      })
      .setOrigin(0.5)
      .setDepth(51);

    // Robot specialty with compact positioning
    this.previewRobotSpecialty = this.add
      .text(section.x, section.y - section.height / 2 + 110, 'CYBER HACKER', {
        fontSize: this.getResponsiveFontSize(12),
        fontFamily: 'Courier, monospace',
        fill: '#ffff00',
        fontStyle: 'bold',
        alpha: 0.9,
      })
      .setOrigin(0.5)
      .setDepth(51);

    // Compact robot description
    this.previewRobotDescription = this.add
      .text(
        section.x,
        section.y + section.height / 2 - 100,
        'Sophisticated, analytical, adaptive',
        {
          fontSize: this.getResponsiveFontSize(10),
          fontFamily: 'Courier, monospace',
          fill: '#ffffff',
          alpha: 0.7,
          wordWrap: { width: section.width - 30 },
          align: 'center',
        }
      )
      .setOrigin(0.5)
      .setDepth(51);
  }

  createCompactDemoButtons(section) {
    const buttons = [
      { text: 'IDLE', action: 'idle', color: 0x00ffff },
      { text: 'COMBAT', action: 'combat', color: 0xff6600 },
      { text: 'SPECIAL', action: 'special', color: 0xff00ff },
    ];

    this.demoButtons = [];
    const buttonWidth = 60;
    const buttonSpacing = 8;
    const totalWidth =
      buttonWidth * buttons.length + buttonSpacing * (buttons.length - 1);
    const startX = section.x - totalWidth / 2 + buttonWidth / 2;
    const buttonY = section.y + section.height / 2 - 50;

    buttons.forEach((btn, index) => {
      const x = startX + index * (buttonWidth + buttonSpacing);

      const button = this.add
        .rectangle(x, buttonY, buttonWidth, 25, btn.color, 0.3)
        .setStrokeStyle(2, btn.color, 0.8)
        .setInteractive({ useHandCursor: true })
        .setDepth(52);

      const text = this.add
        .text(x, buttonY, btn.text, {
          fontSize: this.getResponsiveFontSize(9),
          fontFamily: 'Courier, monospace',
          fill: '#ffffff',
          fontStyle: 'bold',
        })
        .setOrigin(0.5)
        .setDepth(53);

      button.on('pointerdown', () => this.playRobotDemo(btn.action));
      button.on('pointerover', () => {
        button.setAlpha(0.6);
        button.setScale(1.05);
        text.setScale(1.05);
      });
      button.on('pointerout', () => {
        button.setAlpha(1);
        button.setScale(1);
        text.setScale(1);
      });

      this.demoButtons.push({ button, text, action: btn.action });
    });
  }

  createEnhancedCharacterSelection() {
    const section = this.layout.sections.characters;

    // Enhanced section header
    this.add
      .text(
        section.x,
        section.y - section.height / 2 + 30,
        '⚔️ ROBOT\nSELECTION',
        {
          fontSize: this.getResponsiveFontSize(18),
          fontFamily: 'Courier, monospace',
          fill: '#ff00ff',
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 2,
          align: 'center',
          lineSpacing: 5,
        }
      )
      .setOrigin(0.5)
      .setDepth(100);

    // Create character cards in vertical stack
    this.createVerticalCharacterCards(section);
  }

  createVerticalCharacterCards(section) {
    const cardWidth = section.width - 20;
    const cardHeight = Math.min(120, (section.height - 100) / 3 - 15); // Space for 3 cards + spacing
    const cardSpacing = 15;
    const startY = section.y - section.height / 2 + 80;

    Object.values(this.characterTypes).forEach((charType, index) => {
      const { x } = section;
      const y = startY + index * (cardHeight + cardSpacing);

      // Enhanced card container
      const cardContainer = this.add.container(x, y).setDepth(60);

      // Multi-layer card background with better contrast
      const cardBg = this.add
        .rectangle(0, 0, cardWidth, cardHeight, 0x000000, 0.85)
        .setStrokeStyle(2, charType.accentColor, 0.95);

      const cardInner = this.add.rectangle(
        0,
        0,
        cardWidth - 6,
        cardHeight - 6,
        charType.baseColor,
        0.12
      );

      // Character info layout optimized for horizontal card
      const name = this.add
        .text(-cardWidth / 2 + 15, -cardHeight / 3, charType.name, {
          fontSize: this.getResponsiveFontSize(14),
          fontFamily: 'Courier, monospace',
          fill: '#ffffff',
          fontStyle: 'bold',
          stroke: charType.accentColor,
          strokeThickness: 1,
        })
        .setOrigin(0, 0.5);

      const specialty = this.add
        .text(-cardWidth / 2 + 15, 0, charType.specialty, {
          fontSize: this.getResponsiveFontSize(10),
          fontFamily: 'Courier, monospace',
          fill: '#ffff00',
          fontStyle: 'bold',
        })
        .setOrigin(0, 0.5);

      // Character icon on the right side
      const charIcon = this.add
        .text(cardWidth / 2 - 20, 0, charType.icon, {
          fontSize: this.getResponsiveFontSize(20),
        })
        .setOrigin(0.5);

      // Compact stats display
      const statsText = Object.entries(charType.bonuses)
        .map(([stat, value]) => `${stat.charAt(0).toUpperCase()}:+${value}%`)
        .join(' | ');

      const stats = this.add
        .text(-cardWidth / 2 + 15, cardHeight / 3, statsText, {
          fontSize: this.getResponsiveFontSize(8),
          fontFamily: 'Courier, monospace',
          fill: '#00ffff',
          alpha: 0.9,
        })
        .setOrigin(0, 0.5);

      // Enhanced selection indicator
      const selector = this.add
        .rectangle(0, 0, cardWidth + 6, cardHeight + 6, 0x000000, 0)
        .setStrokeStyle(3, 0xffff00, 0.95)
        .setVisible(false);

      // Add glow effect for selection
      const glowEffect = this.add
        .rectangle(0, 0, cardWidth + 10, cardHeight + 10, 0xffff00, 0.1)
        .setVisible(false);

      // Add all elements to container
      cardContainer.add([
        glowEffect,
        selector,
        cardInner,
        cardBg,
        name,
        specialty,
        charIcon,
        stats,
      ]);

      // Enhanced interactions
      cardBg.setInteractive({ useHandCursor: true });

      cardBg.on('pointerover', () => {
        if (this.selectedCharacterType !== charType.id) {
          cardContainer.setScale(1.03);
          cardInner.setAlpha(0.25);
          cardBg.setStrokeStyle(3, 0xffff00, 1);
          cardBg.setAlpha(0.95);
          this.previewRobotInDisplay(charType);

          glowEffect.setVisible(true);
          glowEffect.setAlpha(0.15);
        }
      });

      cardBg.on('pointerout', () => {
        if (this.selectedCharacterType !== charType.id) {
          cardContainer.setScale(1);
          cardInner.setAlpha(0.12);
          cardBg.setStrokeStyle(2, charType.accentColor, 0.95);
          cardBg.setAlpha(0.85);
          glowEffect.setVisible(false);
        }
      });

      cardBg.on('pointerdown', () => {
        this.selectCharacter(charType.id);
        this.createEnhancedSelectionBurst(x, y, charType.baseColor);
      });

      this.characterCards.push({
        container: cardContainer,
        background: cardBg,
        inner: cardInner,
        selector,
        glowEffect,
        sprite: charIcon,
        type: charType.id,
      });
    });
  }

  createEnhancedBonusSelection() {
    const section = this.layout.sections.bonuses;

    // Enhanced section title
    this.add
      .text(
        section.x,
        section.y - section.height / 2 + 30,
        '⚡ MISSION\nLOADOUT',
        {
          fontSize: this.getResponsiveFontSize(18),
          fontFamily: 'Courier, monospace',
          fill: '#00ff00',
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 2,
          align: 'center',
          lineSpacing: 5,
        }
      )
      .setOrigin(0.5)
      .setDepth(100);

    // Add compact loadout instruction
    this.add
      .text(
        section.x,
        section.y - section.height / 2 + 70,
        'Select starting equipment',
        {
          fontSize: this.getResponsiveFontSize(10),
          fontFamily: 'Courier, monospace',
          fill: '#00ffff',
          alpha: 0.8,
          align: 'center',
          wordWrap: { width: section.width - 20 },
        }
      )
      .setOrigin(0.5)
      .setDepth(100);

    // Create vertical bonus cards
    this.createVerticalBonusCards(section);
  }

  createVerticalBonusCards(section) {
    const bonuses = [
      {
        id: 'coins',
        icon: '💰',
        title: 'Resource Cache',
        description: '+300 credits for upgrades',
        color: 0xffff00,
        accentColor: 0xffa500,
      },
      {
        id: 'shield',
        icon: '🛡️',
        title: 'Defense Matrix',
        description: '+50% damage resistance',
        color: 0x00ffff,
        accentColor: 0x0099ff,
      },
      {
        id: 'experience',
        icon: '⭐',
        title: 'Neural Boost',
        description: '+50% XP from combat',
        color: 0xff00ff,
        accentColor: 0xff6699,
      },
    ];

    const cardWidth = section.width - 20;
    const cardHeight = Math.min(100, (section.height - 120) / 3 - 15);
    const cardSpacing = 15;
    const startY = section.y - section.height / 2 + 100;

    this.bonusCards = []; // Initialize the bonusCards array

    bonuses.forEach((bonus, index) => {
      const y = startY + index * (cardHeight + cardSpacing);

      // Enhanced bonus container
      const bonusContainer = this.add.container(section.x, y).setDepth(60);

      // Multi-layer card design
      const bonusBtn = this.add
        .rectangle(0, 0, cardWidth, cardHeight, bonus.color, 0.15)
        .setStrokeStyle(2, bonus.color, 0.9);

      const bonusInner = this.add.rectangle(
        0,
        0,
        cardWidth - 6,
        cardHeight - 6,
        bonus.accentColor,
        0.05
      );

      // Icon with glow effect
      const iconGlow = this.add.graphics();
      iconGlow.fillStyle(bonus.color, 0.3);
      iconGlow.fillCircle(-cardWidth / 2 + 25, -cardHeight / 4, 12);

      const icon = this.add
        .text(-cardWidth / 2 + 25, -cardHeight / 4, bonus.icon, {
          fontSize: this.getResponsiveFontSize(16),
        })
        .setOrigin(0.5);

      const title = this.add
        .text(-cardWidth / 2 + 50, -cardHeight / 3, bonus.title, {
          fontSize: this.getResponsiveFontSize(12),
          fontFamily: 'Courier, monospace',
          fill: '#ffffff',
          fontStyle: 'bold',
        })
        .setOrigin(0, 0.5);

      const description = this.add
        .text(-cardWidth / 2 + 50, cardHeight / 4, bonus.description, {
          fontSize: this.getResponsiveFontSize(10),
          fontFamily: 'Courier, monospace',
          fill: '#00ffff',
          alpha: 0.9,
          wordWrap: { width: cardWidth - 80 },
        })
        .setOrigin(0, 0.5);

      // Enhanced selection indicator
      const selector = this.add
        .rectangle(0, 0, cardWidth + 6, cardHeight + 6, 0x000000, 0)
        .setStrokeStyle(3, 0xffff00, 0.95)
        .setVisible(false);

      // Add glow effect for selection
      const glowEffect = this.add
        .rectangle(0, 0, cardWidth + 10, cardHeight + 10, 0xffff00, 0.1)
        .setVisible(false);

      // Add all elements to container
      bonusContainer.add([
        glowEffect,
        selector,
        bonusInner,
        bonusBtn,
        iconGlow,
        icon,
        title,
        description,
      ]);

      // Enhanced interactions
      bonusBtn.setInteractive({ useHandCursor: true });

      bonusBtn.on('pointerover', () => {
        if (this.selectedBonusIndex !== index) {
          bonusContainer.setScale(1.03);
          bonusInner.setAlpha(0.15);
          bonusBtn.setStrokeStyle(3, 0xffff00, 1);
          bonusBtn.setAlpha(0.25);

          glowEffect.setVisible(true);
          glowEffect.setAlpha(0.15);
        }
      });

      bonusBtn.on('pointerout', () => {
        if (this.selectedBonusIndex !== index) {
          bonusContainer.setScale(1);
          bonusInner.setAlpha(0.05);
          bonusBtn.setStrokeStyle(2, bonus.color, 0.9);
          bonusBtn.setAlpha(0.15);
          glowEffect.setVisible(false);
        }
      });

      bonusBtn.on('pointerdown', () => {
        this.selectBonus(index);
        this.createEnhancedSelectionBurst(section.x, y, bonus.color);
      });

      this.bonusCards.push({
        container: bonusContainer,
        button: bonusBtn,
        inner: bonusInner,
        selector,
        glowEffect,
        data: bonus,
      });
    });
  }

  startEnhancedRobotAnimation() {
    if (this.robotIdleTween) {
      this.robotIdleTween.destroy();
    }

    this.robotIdleTween = this.tweens.add({
      targets: this.previewRobot,
      y: this.previewRobot.y - 8,
      duration: 2500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Enhanced rotation with breathing effect
    this.tweens.add({
      targets: this.previewRobot,
      rotation: Math.PI * 2,
      duration: 12000,
      repeat: -1,
      ease: 'Linear',
    });

    // Scale breathing effect
    this.tweens.add({
      targets: this.previewRobot,
      scaleX: 3.6,
      scaleY: 3.6,
      duration: 3000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  playRobotDemo(action) {
    const charType = this.characterTypes[this.selectedCharacterType];

    // Stop current animations
    if (this.robotIdleTween) {
      this.robotIdleTween.destroy();
    }
    this.tweens.killTweensOf(this.previewRobot);

    // Update sprite based on action
    const spriteKey = `${this.selectedCharacterType}_${action}`;
    this.previewRobot.setTexture(spriteKey);

    // Update energy field color
    let energyColor = charType.baseColor;
    if (action === 'combat') energyColor = 0xff6600;
    if (action === 'special') energyColor = 0xff00ff;

    this.updateEnergyField(
      this.previewRobot.x,
      this.previewRobot.y,
      energyColor
    );

    // Play specific animation based on action
    switch (action) {
      case 'idle':
        this.startEnhancedRobotAnimation();
        break;
      case 'combat':
        this.playEnhancedRobotCombatDemo();
        break;
      case 'special':
        this.playEnhancedRobotSpecialDemo();
        break;
    }

    // Update particle colors
    this.updateParticleColors(energyColor);
  }

  playEnhancedRobotCombatDemo() {
    // Enhanced combat demonstration
    this.tweens.add({
      targets: this.previewRobot,
      scaleX: 3.8,
      scaleY: 3.8,
      duration: 200,
      yoyo: true,
      repeat: 2,
      ease: 'Power3.easeOut',
    });

    // Combat stance animation with better timing
    this.tweens.add({
      targets: this.previewRobot,
      rotation: 0.15,
      duration: 300,
      yoyo: true,
      repeat: 4,
      ease: 'Power2.easeInOut',
    });

    // Enhanced screen shake effect
    this.cameras.main.shake(800, 0.008);

    // Combat particle burst
    this.createCombatParticleBurst();

    // Return to idle after demo
    this.time.delayedCall(2500, () => {
      this.playRobotDemo('idle');
    });
  }

  playEnhancedRobotSpecialDemo() {
    // Enhanced special ability demonstration
    this.tweens.add({
      targets: this.previewRobot,
      alpha: 0.2,
      scaleX: 4.2,
      scaleY: 4.2,
      duration: 150,
      yoyo: true,
      repeat: 3,
      ease: 'Power3.easeOut',
    });

    // Enhanced energy burst effect
    this.createSpecialAbilityBurst();

    // Holographic distortion effect
    this.tweens.add({
      targets: this.previewRobot,
      rotation: Math.PI * 4,
      duration: 1500,
      ease: 'Power2.easeInOut',
    });

    // Return to idle after demo
    this.time.delayedCall(3000, () => {
      this.playRobotDemo('idle');
    });
  }

  createCombatParticleBurst() {
    for (let i = 0; i < 15; i++) {
      const burst = this.add.graphics();
      burst.fillStyle(0xff6600, 0.8);
      burst.fillCircle(0, 0, Phaser.Math.Between(2, 5));
      burst.setPosition(this.previewRobot.x, this.previewRobot.y);
      burst.setDepth(48);

      const angle = (i / 15) * Math.PI * 2;
      this.tweens.add({
        targets: burst,
        x: burst.x + Math.cos(angle) * Phaser.Math.Between(60, 120),
        y: burst.y + Math.sin(angle) * Phaser.Math.Between(60, 120),
        alpha: 0,
        scale: 0.1,
        duration: 1200,
        ease: 'Power2.easeOut',
        onComplete: () => burst.destroy(),
      });
    }
  }

  createSpecialAbilityBurst() {
    for (let i = 0; i < 25; i++) {
      const burst = this.add.graphics();
      burst.fillStyle(0xff00ff, 0.9);
      burst.fillCircle(0, 0, Phaser.Math.Between(3, 6));
      burst.setPosition(this.previewRobot.x, this.previewRobot.y);
      burst.setDepth(48);

      const angle = (i / 25) * Math.PI * 2;
      this.tweens.add({
        targets: burst,
        x: burst.x + Math.cos(angle) * Phaser.Math.Between(80, 150),
        y: burst.y + Math.sin(angle) * Phaser.Math.Between(80, 150),
        alpha: 0,
        scale: 0.1,
        rotation: Math.PI * 2,
        duration: 1800,
        ease: 'Power2.easeOut',
        onComplete: () => burst.destroy(),
      });
    }
  }

  updateParticleColors(color) {
    if (this.robotParticles) {
      this.robotParticles.forEach(particle => {
        particle.clear();
        particle.fillStyle(color, 0.6);
        particle.fillCircle(0, 0, 2);
      });
    }
  }

  previewRobotInDisplay(charType) {
    // Temporarily show this robot in the preview area
    if (this.previewRobot.robotBody) {
      // This is a fallback graphic, update its appearance
      this.updateFallbackRobotAppearance(charType);
    } else {
      // This is a sprite, try to update texture
      try {
        const textureKey = `${charType.id}_idle`;
        if (this.textures.exists(textureKey)) {
          this.previewRobot.setTexture(textureKey);
        } else {
          console.warn(
            `CharacterSelectScene: Texture ${textureKey} not found, using fallback`
          );
          // Keep current texture or use a default
        }
      } catch (error) {
        console.warn(
          'CharacterSelectScene: Error setting robot texture:',
          error
        );
      }
    }

    this.previewRobotName.setText(charType.name);
    this.previewRobotSpecialty.setText(charType.specialty.toUpperCase());
    this.previewRobotDescription.setText(charType.personality);

    // Update energy field color
    this.updateEnergyField(
      this.previewRobot.x,
      this.previewRobot.y,
      charType.baseColor
    );
    this.updateParticleColors(charType.baseColor);
  }

  createEnhancedSelectionBurst(x, y, color) {
    // Create enhanced energy burst effect at selection
    for (let i = 0; i < 20; i++) {
      const burst = this.add.graphics();
      burst.fillStyle(color, 0.9);
      burst.fillCircle(0, 0, Phaser.Math.Between(2, 4));
      burst.setPosition(x, y);
      burst.setDepth(65);

      const angle = (i / 20) * Math.PI * 2;
      this.tweens.add({
        targets: burst,
        x: burst.x + Math.cos(angle) * Phaser.Math.Between(40, 80),
        y: burst.y + Math.sin(angle) * Phaser.Math.Between(40, 80),
        alpha: 0,
        scale: 0.1,
        rotation: Math.PI,
        duration: 1000,
        ease: 'Power2.easeOut',
        onComplete: () => burst.destroy(),
      });
    }

    // Screen flash effect
    const flash = this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, color, 0.3)
      .setOrigin(0, 0)
      .setDepth(70);

    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 300,
      ease: 'Power2.easeOut',
      onComplete: () => flash.destroy(),
    });
  }

  selectCharacter(typeId) {
    console.log(`Selecting mech: ${typeId}`);
    this.selectedCharacterType = typeId;
    this.characterData.type = typeId;

    const charType = this.characterTypes[typeId];
    this.characterData.appearance.color = charType.baseColor;

    // Create selection feedback effect
    this.createCharacterSelectionFeedback(charType);

    // Update the main preview display with smooth transition
    this.updateRobotPreviewWithTransition(typeId, charType);

    // Update energy field and particles
    this.updateEnergyField(
      this.previewRobot.x,
      this.previewRobot.y,
      charType.baseColor
    );
    this.updateParticleColors(charType.baseColor);

    // Update ambient lighting to match robot theme
    this.updateAmbientLighting(charType.baseColor);

    // Restart idle animation for selected robot
    this.playRobotDemo('idle');

    // Update visual selection on cards with enhanced feedback
    this.characterCards.forEach(card => {
      if (card.type === typeId) {
        // Show enhanced selection indicators
        card.selector.setVisible(true);

        // Enhanced selected state
        card.background.setAlpha(1);
        card.inner.setAlpha(0.4);
        card.container.setScale(1.08);

        // Enhanced pulsing animation for selected card
        this.tweens.add({
          targets: card.selector,
          alpha: 0.4,
          duration: 1200,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      } else {
        // Hide selection indicators
        card.selector.setVisible(false);

        // Reset to unselected state
        card.background.setAlpha(0.8);
        card.inner.setAlpha(0.12);
        card.container.setScale(1);

        // Stop any existing animations
        this.tweens.killTweensOf(card.selector);
      }
    });

    this.updateReadyState();
  }

  selectBonus(index) {
    console.log(`Selecting bonus: ${index}`);
    this.selectedBonusIndex = index;
    this.characterData.startingBonus = this.bonusCards[index].data.id;

    // Update visual selection with enhanced feedback
    this.bonusCards.forEach((card, cardIndex) => {
      if (cardIndex === index) {
        // Show enhanced selection
        card.selector.setVisible(true);
        card.button.setAlpha(0.6);
        card.inner.setAlpha(0.2);
        card.container.setScale(1.04);

        // Add enhanced pulsing effect
        this.tweens.add({
          targets: card.selector,
          alpha: 0.4,
          duration: 1200,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      } else {
        // Hide selection
        card.selector.setVisible(false);
        card.button.setAlpha(0.15);
        card.inner.setAlpha(0.05);
        card.container.setScale(1);

        // Stop animations
        this.tweens.killTweensOf(card.selector);
      }
    });

    this.updateReadyState();
  }

  updateReadyState() {
    const hasName =
      this.characterData.name && this.characterData.name.trim().length >= 2;
    this.isReady = hasName;

    if (this.isReady) {
      // Ready state - green and prominent
      this.startBtn.setFillStyle(0x10b981, 0.9);
      this.startBtn.setStrokeStyle(3, 0x00ff00, 1);
      this.startBtnText.setFill('#ffffff');

      // Update readiness indicator
      if (this.readinessIndicator) {
        this.readinessIndicator.setText('✅ Ready for deployment!');
        this.readinessIndicator.setFill('#00ff00');

        // Add pulsing effect when ready
        this.tweens.add({
          targets: this.readinessIndicator,
          alpha: 0.6,
          duration: 1000,
          yoyo: true,
          repeat: -1,
          ease: 'Sine.easeInOut',
        });
      }
    } else {
      // Not ready state - gray and disabled
      this.startBtn.setFillStyle(0x374151, 0.9);
      this.startBtn.setStrokeStyle(3, 0x9ca3af, 0.8);
      this.startBtnText.setFill('#9ca3af');

      // Update readiness indicator
      if (this.readinessIndicator) {
        this.readinessIndicator.setText('⚠️ Enter pilot callsign to deploy');
        this.readinessIndicator.setFill('#ffff00');
        this.readinessIndicator.setAlpha(0.8);

        // Stop pulsing animation
        this.tweens.killTweensOf(this.readinessIndicator);
      }
    }
  }

  setupEnhancedButtonInteractions(backBtn, startBtn) {
    // Enhanced back button interactions
    backBtn.on('pointerover', () => {
      backBtn.setFillStyle(0x4b5563, 0.9);
      backBtn.setStrokeStyle(3, 0xffff00, 1);
      backBtn.setScale(1.03);
    });
    backBtn.on('pointerout', () => {
      backBtn.setFillStyle(0x374151, 0.9);
      backBtn.setStrokeStyle(3, 0x00ffff, 0.8);
      backBtn.setScale(1);
    });
    backBtn.on('pointerdown', () => this.goBack());

    // Enhanced start button interactions
    startBtn.on('pointerover', () => {
      if (this.isReady) {
        startBtn.setFillStyle(0x059669, 0.9);
        startBtn.setStrokeStyle(3, 0x00ff00, 1);
        startBtn.setScale(1.03);
      }
    });

    startBtn.on('pointerout', () => {
      if (this.isReady) {
        startBtn.setFillStyle(0x10b981, 0.9);
        startBtn.setStrokeStyle(3, 0x00ff00, 1);
      } else {
        startBtn.setFillStyle(0x374151, 0.9);
        startBtn.setStrokeStyle(3, 0x9ca3af, 0.8);
      }
      startBtn.setScale(1);
    });

    startBtn.on('pointerdown', () => {
      if (this.isReady) {
        this.startAdventure();
      }
    });
  }

  showEnhancedEntranceAnimation() {
    // Enhanced entrance animation with better timing and effects
    const titleElements = this.children.list.filter(
      child => child.depth === 100 || child.depth === 101
    );

    titleElements.forEach((element, index) => {
      element.setAlpha(0);
      element.setScale(0.7);
      element.setY(element.y - 30);

      this.tweens.add({
        targets: element,
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
        y: element.y + 30,
        duration: 800,
        delay: index * 120,
        ease: 'Back.easeOut',
      });
    });

    // Enhanced character cards animation
    this.characterCards.forEach((card, index) => {
      card.container.setAlpha(0);
      card.container.setScale(0.6);
      card.container.setY(card.container.y + 80);

      this.tweens.add({
        targets: card.container,
        alpha: 1,
        scaleX: 1,
        scaleY: 1,
        y: card.container.y - 80,
        duration: 1000,
        delay: 1000 + index * 250,
        ease: 'Back.easeOut',
      });
    });

    // Enhanced bonus cards animation
    this.bonusCards.forEach((card, index) => {
      card.container.setAlpha(0);
      card.container.setX(card.container.x - 150);

      this.tweens.add({
        targets: card.container,
        alpha: 1,
        x: card.container.x + 150,
        duration: 800,
        delay: 1800 + index * 200,
        ease: 'Power3.easeOut',
      });
    });

    // Enhanced navigation buttons animation
    const navButtons = this.children.list.filter(
      child =>
        child.depth === 100 &&
        (child.x < 300 || child.x > this.scale.width - 300)
    );

    navButtons.forEach((button, index) => {
      button.setAlpha(0);
      button.setY(button.y + 50);

      this.tweens.add({
        targets: button,
        alpha: 1,
        y: button.y - 50,
        duration: 600,
        delay: 2600 + index * 150,
        ease: 'Power2.easeOut',
      });
    });
  }

  goBack() {
    if (this.nameInput) {
      document.body.removeChild(this.nameInput);
      this.nameInput = null;
    }

    this.cameras.main.fadeOut(500, 0, 0, 0);
    this.cameras.main.once('camerafadeoutcomplete', () => {
      this.scene.start('IntroScene');
    });
  }

  startAdventure() {
    if (!this.isReady) {
      console.log('Not ready to start adventure');
      return;
    }

    console.log('Starting adventure with character:', this.characterData);

    // Create character data
    const charType = this.characterTypes[this.selectedCharacterType];
    const initialData = {
      character: {
        ...this.characterData,
        name: this.characterData.name.trim(),
        type: this.selectedCharacterType, // Add the character type ID (aria, titan, nexus)
        typeName: charType.name,
        bonuses: charType.bonuses,
        level: 1,
        experience: 0,
      },
      coinBalance:
        100 + (this.characterData.startingBonus?.id === 'coins' ? 300 : 0),
      totalScore: 0,
      weeksCompleted: [],
      badges: 0,
      subjectAccuracies: { math: 0, reading: 0, science: 0, history: 0 },
      equippedItems: {
        cosmetic: `${this.selectedCharacterType}Character`,
        powerUp:
          this.characterData.startingBonus?.id === 'shield' ? 'shield' : null,
        tool: null,
        decoration: null,
      },
      dailyRewards: {
        lastClaimed: null,
        streak: 0,
      },
      totalCoinsEarned:
        100 + (this.characterData.startingBonus?.id === 'coins' ? 300 : 0),
      experienceMultiplier:
        this.characterData.startingBonus?.id === 'experience' ? 1.5 : 1.0,
    };

    // Save data
    this.saveManager.saveData(initialData);

    // Clean up
    if (this.nameInput) {
      document.body.removeChild(this.nameInput);
      this.nameInput = null;
    }

    // Show enhanced success animation
    this.showEnhancedSuccessAnimation();
  }

  showEnhancedSuccessAnimation() {
    const charType = this.characterTypes[this.selectedCharacterType];

    // Create enhanced overlay
    const overlay = this.add
      .rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.9)
      .setOrigin(0, 0)
      .setDepth(200);

    const successText = this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2,
        `🎉 Welcome, ${this.characterData.name}! 🎉\n\nYour ${charType.name} is ready for action!\n\nInitializing mission systems...`,
        {
          fontSize: this.getResponsiveFontSize(28),
          fontFamily: 'Courier, monospace',
          fill: '#ffffff',
          stroke: charType.accentColor,
          strokeThickness: 4,
          align: 'center',
          lineSpacing: 10,
        }
      )
      .setOrigin(0.5)
      .setDepth(201);

    // Enhanced sparkle effects
    for (let i = 0; i < 30; i++) {
      const x = Phaser.Math.Between(0, this.scale.width);
      const y = Phaser.Math.Between(0, this.scale.height);
      const sparkleTypes = ['✨', '⭐', '💫', '🌟'];
      const sparkle = this.add
        .text(x, y, Phaser.Math.RND.pick(sparkleTypes), {
          fontSize: this.getResponsiveFontSize(24),
        })
        .setDepth(202);

      this.tweens.add({
        targets: sparkle,
        alpha: 0,
        scale: 2.5,
        rotation: Math.PI * 3,
        duration: Phaser.Math.Between(2000, 3000),
        ease: 'Power2.easeOut',
      });
    }

    // Enhanced transition to main menu
    this.time.delayedCall(3500, () => {
      this.cameras.main.fadeOut(1000, 0, 0, 0);
      this.cameras.main.once('camerafadeoutcomplete', () => {
        this.scene.start('EducationalMenuScene');
      });
    });
  }

  // Helper methods for armor system (existing functionality)
  getArmorBonuses(mechType) {
    const bonuses = {};

    if (
      this.progressTracker.progress &&
      this.progressTracker.progress.armorUpgrades
    ) {
      Object.keys(this.progressTracker.progress.armorUpgrades).forEach(
        armorId => {
          if (
            this.progressTracker.progress.armorUpgrades[armorId] &&
            armorId.startsWith(`${mechType}_`)
          ) {
            const armorData = this.getArmorData(armorId);
            if (armorData && armorData.bonuses) {
              Object.entries(armorData.bonuses).forEach(([stat, value]) => {
                bonuses[stat] = (bonuses[stat] || 0) + value;
              });
            }
          }
        }
      );
    }

    return bonuses;
  }

  getArmorLevels(mechType) {
    const levels = { defense: 0, power: 0, weapon: 0 };

    if (
      this.progressTracker.progress &&
      this.progressTracker.progress.armorUpgrades
    ) {
      Object.keys(this.progressTracker.progress.armorUpgrades).forEach(
        armorId => {
          if (
            this.progressTracker.progress.armorUpgrades[armorId] &&
            armorId.startsWith(`${mechType}_`)
          ) {
            const parts = armorId.split('_');
            if (parts.length >= 3) {
              const armorType = parts[1];
              const level = parseInt(parts[2]) || 1;

              if (levels.hasOwnProperty(armorType)) {
                levels[armorType] = Math.max(levels[armorType], level);
              }
            }
          }
        }
      );
    }

    return levels;
  }

  getArmorData(armorId) {
    const armorDatabase = {
      aria_defense_1: { bonuses: { defense: 5, analysis: 3 } },
      aria_defense_2: { bonuses: { defense: 10, analysis: 6 } },
      aria_power_1: { bonuses: { reading: 8, efficiency: 5 } },
      aria_weapon_1: { bonuses: { cyberDamage: 10 } },

      titan_defense_1: { bonuses: { defense: 15, courage: 5 } },
      titan_defense_2: { bonuses: { defense: 25, courage: 10 } },
      titan_power_1: { bonuses: { math: 10, strength: 8 } },
      titan_weapon_1: { bonuses: { physicalDamage: 15 } },

      nexus_defense_1: { bonuses: { defense: 8, technology: 7 } },
      nexus_defense_2: { bonuses: { defense: 15, technology: 12 } },
      nexus_power_1: { bonuses: { science: 12, innovation: 8 } },
      nexus_weapon_1: { bonuses: { techDamage: 12 } },
    };

    return armorDatabase[armorId] || null;
  }

  createHolographicScanLines(section) {
    // Create animated scan lines that move across the robot preview
    for (let i = 0; i < 3; i++) {
      const scanLine = this.add.graphics();
      scanLine.lineStyle(2, 0x00ffff, 0.6);
      scanLine.beginPath();
      scanLine.moveTo(
        section.x - section.width / 2 + 20,
        section.y - section.height / 2 + 40
      );
      scanLine.lineTo(
        section.x + section.width / 2 - 20,
        section.y - section.height / 2 + 40
      );
      scanLine.strokePath();
      scanLine.setDepth(49);

      // Animated scanning effect
      this.tweens.add({
        targets: scanLine,
        y: section.y + section.height / 2 - 40,
        alpha: 0.2,
        duration: 2000 + i * 500,
        repeat: -1,
        ease: 'Linear',
        delay: i * 800,
      });
    }

    // Add data stream indicators
    for (let i = 0; i < 5; i++) {
      const dataStream = this.add.graphics();
      dataStream.fillStyle(0x00ff88, 0.7);
      dataStream.fillRect(0, 0, 2, 8);
      dataStream.setPosition(
        section.x - section.width / 2 + 30 + i * 40,
        section.y - section.height / 2 + 30
      );
      dataStream.setDepth(48);

      // Flowing data animation
      this.tweens.add({
        targets: dataStream,
        y: section.y + section.height / 2 - 30,
        alpha: 0.1,
        duration: 1500,
        repeat: -1,
        ease: 'Power2.easeInOut',
        delay: i * 200,
      });
    }
  }

  createCharacterSelectionFeedback(charType) {
    // Screen flash effect with character color
    const flash = this.add
      .rectangle(
        0,
        0,
        this.scale.width,
        this.scale.height,
        charType.baseColor,
        0.15
      )
      .setOrigin(0, 0)
      .setDepth(200);

    this.tweens.add({
      targets: flash,
      alpha: 0,
      duration: 300,
      ease: 'Power2.easeOut',
      onComplete: () => flash.destroy(),
    });

    // Sound effect simulation with visual feedback
    this.createSoundEffectSimulation();

    // Character announcement effect
    this.createCharacterAnnouncement(charType);
  }

  updateRobotPreviewWithTransition(typeId, charType) {
    // Fade out current robot
    this.tweens.add({
      targets: this.previewRobot,
      alpha: 0.3,
      scale: 3.5,
      duration: 200,
      ease: 'Power2.easeOut',
      onComplete: () => {
        // Update robot texture and info
        if (this.previewRobot.robotBody) {
          // This is a fallback graphic, update its appearance
          this.updateFallbackRobotAppearance(charType);
        } else {
          // This is a sprite, try to update texture
          try {
            const textureKey = `${typeId}_idle`;
            if (this.textures.exists(textureKey)) {
              this.previewRobot.setTexture(textureKey);
            } else {
              console.warn(
                `CharacterSelectScene: Texture ${textureKey} not found, keeping current texture`
              );
              // Keep current texture
            }
          } catch (error) {
            console.warn(
              'CharacterSelectScene: Error updating robot texture:',
              error
            );
          }
        }

        this.previewRobotName.setText(charType.name);
        this.previewRobotSpecialty.setText(charType.specialty.toUpperCase());
        this.previewRobotDescription.setText(charType.personality);

        // Fade back in with new robot
        this.tweens.add({
          targets: this.previewRobot,
          alpha: 1,
          scale: 4.0,
          duration: 300,
          ease: 'Back.easeOut',
        });
      },
    });

    // Update text with staggered animation
    const textElements = [
      this.previewRobotName,
      this.previewRobotSpecialty,
      this.previewRobotDescription,
    ];
    textElements.forEach((element, index) => {
      if (element) {
        this.tweens.add({
          targets: element,
          alpha: 0.3,
          duration: 150,
          delay: index * 50,
          ease: 'Power2.easeOut',
          onComplete: () => {
            this.tweens.add({
              targets: element,
              alpha: 1,
              duration: 200,
              ease: 'Power2.easeOut',
            });
          },
        });
      }
    });
  }

  createSoundEffectSimulation() {
    // Visual representation of sound effect
    for (let i = 0; i < 8; i++) {
      const soundWave = this.add.graphics();
      soundWave.lineStyle(2, 0x00ffff, 0.8);
      soundWave.strokeCircle(
        this.scale.width / 2,
        this.scale.height / 2,
        50 + i * 20
      );
      soundWave.setDepth(150);

      this.tweens.add({
        targets: soundWave,
        alpha: 0,
        duration: 400 + i * 100,
        ease: 'Power2.easeOut',
        onComplete: () => soundWave.destroy(),
      });
    }
  }

  createCharacterAnnouncement(charType) {
    // Brief character name announcement
    const announcement = this.add
      .text(
        this.scale.width / 2,
        this.scale.height / 2 - 100,
        `${charType.name} SELECTED`,
        {
          fontSize: this.getResponsiveFontSize(24),
          fontFamily: 'Courier, monospace',
          fill: charType.accentColor,
          fontStyle: 'bold',
          stroke: '#000000',
          strokeThickness: 3,
          alpha: 0,
        }
      )
      .setOrigin(0.5)
      .setDepth(180);

    // Animate announcement
    this.tweens.add({
      targets: announcement,
      alpha: 1,
      y: announcement.y - 20,
      duration: 300,
      ease: 'Power2.easeOut',
      onComplete: () => {
        this.tweens.add({
          targets: announcement,
          alpha: 0,
          y: announcement.y - 30,
          duration: 500,
          delay: 800,
          ease: 'Power2.easeOut',
          onComplete: () => announcement.destroy(),
        });
      },
    });
  }

  createEnhancedNavigationButtons() {
    const section = this.layout.sections.navigation;

    // Back button with compact styling
    const backBtn = this.add
      .rectangle(section.x - 150, section.y, 140, 45, 0x374151, 0.9)
      .setStrokeStyle(2, 0x00ffff, 0.8)
      .setInteractive({ useHandCursor: true })
      .setDepth(100);

    this.add
      .text(section.x - 150, section.y, '← BACK', {
        fontSize: this.getResponsiveFontSize(14),
        fontFamily: 'Courier, monospace',
        fill: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(101);

    // Start button with compact styling
    this.startBtn = this.add
      .rectangle(section.x + 150, section.y, 180, 45, 0x374151, 0.9)
      .setStrokeStyle(2, 0x9ca3af, 0.8)
      .setInteractive({ useHandCursor: true })
      .setDepth(100);

    this.startBtnText = this.add
      .text(section.x + 150, section.y, 'DEPLOY →', {
        fontSize: this.getResponsiveFontSize(14),
        fontFamily: 'Courier, monospace',
        fill: '#ffffff',
        fontStyle: 'bold',
      })
      .setOrigin(0.5)
      .setDepth(101);

    // Compact status indicator
    this.readinessIndicator = this.add
      .text(section.x, section.y - 20, '⚠️ Enter callsign to deploy', {
        fontSize: this.getResponsiveFontSize(11),
        fontFamily: 'Courier, monospace',
        fill: '#ffff00',
        alpha: 0.8,
      })
      .setOrigin(0.5)
      .setDepth(101);

    // Enhanced button interactions
    this.setupEnhancedButtonInteractions(backBtn, this.startBtn);
  }

  // Helper methods for responsive design
  getResponsiveFontSize(baseSize) {
    const scaleFactor = Math.min(
      this.scale.width / 1200,
      this.scale.height / 800
    );
    return Math.max(baseSize * scaleFactor, baseSize * 0.7);
  }

  createGlowEffect(target, color) {
    this.tweens.add({
      targets: target,
      scaleX: 1.02,
      scaleY: 1.02,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  createPulseAnimation(target) {
    this.tweens.add({
      targets: target,
      alpha: 0.7,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });
  }

  handleResize() {
    // Reinitialize layout on resize
    this.initializeLayout();

    // Update input position if it exists
    if (this.nameInput) {
      const section = this.layout.sections.nameInput;
      const gameCanvas = document.querySelector('canvas');
      const canvasRect = gameCanvas
        ? gameCanvas.getBoundingClientRect()
        : { left: 0, top: 0 };

      const inputWidth = Math.min(280, section.width * 0.8);
      this.nameInput.style.left = `${canvasRect.left + section.x - inputWidth / 2}px`;
      this.nameInput.style.top = `${canvasRect.top + section.y - 17.5}px`;
    }
  }

  createEnhancedRobotParticles(x, y) {
    // Create floating energy particles around the robot
    this.robotParticles = [];

    for (let i = 0; i < 12; i++) {
      const particle = this.add.graphics();
      particle.fillStyle(0x00ffff, 0.6);
      particle.fillCircle(0, 0, 2);

      const angle = (i / 12) * Math.PI * 2;
      const radius = 60;
      const particleX = x + Math.cos(angle) * radius;
      const particleY = y + Math.sin(angle) * radius;

      particle.setPosition(particleX, particleY);
      particle.setDepth(47);

      // Orbital animation
      this.tweens.add({
        targets: particle,
        rotation: Math.PI * 2,
        duration: 8000 + i * 200,
        repeat: -1,
        ease: 'Linear',
      });

      // Floating animation
      this.tweens.add({
        targets: particle,
        y: particleY + Phaser.Math.Between(-10, 10),
        duration: 2000 + i * 100,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      // Pulsing animation
      this.tweens.add({
        targets: particle,
        alpha: 0.2,
        scale: 0.5,
        duration: 1500 + i * 150,
        yoyo: true,
        repeat: -1,
        ease: 'Sine.easeInOut',
      });

      this.robotParticles.push(particle);
    }
  }

  updateEnergyField(x, y, color) {
    // Remove existing energy field if it exists
    if (this.energyField) {
      this.energyField.destroy();
    }

    // Create new energy field with the specified color
    this.energyField = this.add.graphics();
    this.energyField.setPosition(x, y);
    this.energyField.setDepth(46);

    // Create layered energy field effect
    for (let i = 0; i < 3; i++) {
      const radius = 40 + i * 15;
      const alpha = 0.15 - i * 0.04;

      this.energyField.fillStyle(color, alpha);
      this.energyField.fillCircle(0, 0, radius);
    }

    // Add energy field animation
    this.tweens.add({
      targets: this.energyField,
      scaleX: 1.2,
      scaleY: 1.2,
      alpha: 0.5,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Add rotation animation
    this.tweens.add({
      targets: this.energyField,
      rotation: Math.PI * 2,
      duration: 10000,
      repeat: -1,
      ease: 'Linear',
    });
  }

  createFallbackRobotGraphic(x, y) {
    // Create a container for the fallback robot graphic
    const robotContainer = this.add.container(x, y);
    robotContainer.setDepth(50);

    // Default character type (ARIA)
    const charType = this.characterTypes.aria;

    // Robot body (main chassis)
    const body = this.add.graphics();
    body.fillStyle(charType.baseColor, 0.8);
    body.fillRoundedRect(-25, -20, 50, 40, 10);
    body.lineStyle(3, charType.accentColor, 1);
    body.strokeRoundedRect(-25, -20, 50, 40, 10);
    robotContainer.add(body);

    // Robot head
    const head = this.add.graphics();
    head.fillStyle(charType.baseColor, 0.9);
    head.fillRoundedRect(-20, -45, 40, 25, 8);
    head.lineStyle(3, charType.accentColor, 1);
    head.strokeRoundedRect(-20, -45, 40, 25, 8);
    robotContainer.add(head);

    // Robot eyes (glowing)
    const leftEye = this.add.circle(-10, -32, 4, charType.accentColor, 1);
    const rightEye = this.add.circle(10, -32, 4, charType.accentColor, 1);
    robotContainer.add(leftEye);
    robotContainer.add(rightEye);

    // Robot arms
    const leftArm = this.add.graphics();
    leftArm.fillStyle(charType.baseColor, 0.7);
    leftArm.fillRoundedRect(-40, -15, 15, 25, 5);
    leftArm.lineStyle(2, charType.accentColor, 0.8);
    leftArm.strokeRoundedRect(-40, -15, 15, 25, 5);
    robotContainer.add(leftArm);

    const rightArm = this.add.graphics();
    rightArm.fillStyle(charType.baseColor, 0.7);
    rightArm.fillRoundedRect(25, -15, 15, 25, 5);
    rightArm.lineStyle(2, charType.accentColor, 0.8);
    rightArm.strokeRoundedRect(25, -15, 15, 25, 5);
    robotContainer.add(rightArm);

    // Robot legs
    const leftLeg = this.add.graphics();
    leftLeg.fillStyle(charType.baseColor, 0.7);
    leftLeg.fillRoundedRect(-20, 20, 12, 20, 4);
    leftLeg.lineStyle(2, charType.accentColor, 0.8);
    leftLeg.strokeRoundedRect(-20, 20, 12, 20, 4);
    robotContainer.add(leftLeg);

    const rightLeg = this.add.graphics();
    rightLeg.fillStyle(charType.baseColor, 0.7);
    rightLeg.fillRoundedRect(8, 20, 12, 20, 4);
    rightLeg.lineStyle(2, charType.accentColor, 0.8);
    rightLeg.strokeRoundedRect(8, 20, 12, 20, 4);
    robotContainer.add(rightLeg);

    // Character type indicator (icon in center)
    const typeIcon = this.add
      .text(0, -5, charType.icon, {
        fontSize: '32px',
      })
      .setOrigin(0.5);
    robotContainer.add(typeIcon);

    // Add subtle glow effect
    const glow = this.add.graphics();
    glow.fillStyle(charType.accentColor, 0.1);
    glow.fillCircle(0, 0, 45);
    robotContainer.add(glow);
    robotContainer.sendToBack(glow);

    // Add pulsing animation to eyes
    this.tweens.add({
      targets: [leftEye, rightEye],
      alpha: 0.5,
      duration: 1500,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Add subtle glow animation
    this.tweens.add({
      targets: glow,
      alpha: 0.2,
      scale: 1.1,
      duration: 2000,
      yoyo: true,
      repeat: -1,
      ease: 'Sine.easeInOut',
    });

    // Store references for texture updates
    robotContainer.robotBody = body;
    robotContainer.robotHead = head;
    robotContainer.robotEyes = [leftEye, rightEye];
    robotContainer.robotGlow = glow;
    robotContainer.robotIcon = typeIcon;

    return robotContainer;
  }

  updateFallbackRobotAppearance(charType) {
    // Update the fallback robot graphic to match the selected character type
    if (!this.previewRobot.robotBody) return;

    // Update body colors
    this.previewRobot.robotBody.clear();
    this.previewRobot.robotBody.fillStyle(charType.baseColor, 0.8);
    this.previewRobot.robotBody.fillRoundedRect(-25, -20, 50, 40, 10);
    this.previewRobot.robotBody.lineStyle(3, charType.accentColor, 1);
    this.previewRobot.robotBody.strokeRoundedRect(-25, -20, 50, 40, 10);

    // Update head colors
    this.previewRobot.robotHead.clear();
    this.previewRobot.robotHead.fillStyle(charType.baseColor, 0.9);
    this.previewRobot.robotHead.fillRoundedRect(-20, -45, 40, 25, 8);
    this.previewRobot.robotHead.lineStyle(3, charType.accentColor, 1);
    this.previewRobot.robotHead.strokeRoundedRect(-20, -45, 40, 25, 8);

    // Update eye colors
    this.previewRobot.robotEyes.forEach(eye => {
      eye.setFillStyle(charType.accentColor);
    });

    // Update glow effect
    this.previewRobot.robotGlow.clear();
    this.previewRobot.robotGlow.fillStyle(charType.accentColor, 0.1);
    this.previewRobot.robotGlow.fillCircle(0, 0, 45);

    // Update character icon
    this.previewRobot.robotIcon.setText(charType.icon);
  }
}
