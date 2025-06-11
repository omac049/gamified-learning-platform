import { GameSystem } from './GameSystem.js';

/**
 * Audio System - Handles sound effects and background music
 * Provides audio feedback for game events and creates immersive experience
 */
export class AudioSystem extends GameSystem {
  constructor(scene, config = {}) {
    super(scene, config);

    // Audio state
    this.masterVolume = config.masterVolume || 0.7;
    this.sfxVolume = config.sfxVolume || 0.8;
    this.musicVolume = config.musicVolume || 0.5;
    this.audioEnabled = config.audioEnabled !== false;

    // Audio pools for performance
    this.soundPools = new Map();
    this.activeSounds = new Set();

    // Background music
    this.currentMusic = null;
    this.musicQueue = [];

    // Audio context for web audio
    this.audioContext = null;
    this.audioNodes = new Map();

    // Sound effect definitions
    this.soundEffects = {
      // Math sounds
      mathCorrect: { frequency: 800, duration: 0.2, type: 'success' },
      mathIncorrect: { frequency: 200, duration: 0.3, type: 'error' },
      mathStreak: { frequency: 1000, duration: 0.4, type: 'achievement' },
      mathLevelUp: { frequency: 1200, duration: 0.6, type: 'achievement' },

      // Combat sounds
      playerShoot: { frequency: 400, duration: 0.1, type: 'action' },
      enemyHit: { frequency: 300, duration: 0.15, type: 'impact' },
      enemyDestroyed: { frequency: 150, duration: 0.3, type: 'explosion' },
      playerDamaged: { frequency: 100, duration: 0.4, type: 'damage' },

      // UI sounds
      buttonClick: { frequency: 600, duration: 0.1, type: 'ui' },
      menuSelect: { frequency: 700, duration: 0.15, type: 'ui' },
      notification: { frequency: 900, duration: 0.2, type: 'notification' },

      // Power-up sounds
      abilityActivated: { frequency: 1100, duration: 0.3, type: 'power' },
      weaponSwitch: { frequency: 500, duration: 0.2, type: 'action' },
      shieldRecharge: { frequency: 850, duration: 0.5, type: 'power' },
    };

    // Music tracks
    this.musicTracks = {
      menu: { tempo: 120, key: 'C', mood: 'calm' },
      combat: { tempo: 140, key: 'Am', mood: 'intense' },
      victory: { tempo: 100, key: 'G', mood: 'triumphant' },
      defeat: { tempo: 80, key: 'Dm', mood: 'somber' },
    };
  }

  async onInit() {
    this.log('Initializing Audio System...');

    // Initialize Web Audio API
    await this.initializeAudioContext();

    // Set up event listeners
    this.setupEventListeners();

    // Create sound pools
    this.createSoundPools();

    // Start background music
    this.startBackgroundMusic('menu');

    this.log('Audio System initialized');
  }

  async initializeAudioContext() {
    try {
      // Create audio context
      this.audioContext = new (window.AudioContext ||
        window.webkitAudioContext)();

      // Create master gain node
      this.masterGain = this.audioContext.createGain();
      this.masterGain.gain.value = this.masterVolume;
      this.masterGain.connect(this.audioContext.destination);

      // Create separate gain nodes for different audio types
      this.sfxGain = this.audioContext.createGain();
      this.sfxGain.gain.value = this.sfxVolume;
      this.sfxGain.connect(this.masterGain);

      this.musicGain = this.audioContext.createGain();
      this.musicGain.gain.value = this.musicVolume;
      this.musicGain.connect(this.masterGain);

      // Resume audio context if suspended
      if (this.audioContext.state === 'suspended') {
        await this.audioContext.resume();
      }

      this.log('Audio context initialized successfully');
    } catch (error) {
      this.error('Failed to initialize audio context:', error);
      this.audioEnabled = false;
    }
  }

  setupEventListeners() {
    // Math events
    this.on('mathAnswerCorrect', () => this.playSound('mathCorrect'));
    this.on('mathAnswerIncorrect', () => this.playSound('mathIncorrect'));
    this.on('streakChanged', data => {
      if (data.streak > 0 && data.streak % 5 === 0) {
        this.playSound('mathStreak');
      }
    });
    this.on('topicLevelUp', () => this.playSound('mathLevelUp'));

    // Combat events
    this.on('weaponFired', () => this.playSound('playerShoot'));
    this.on('enemyHit', () => this.playSound('enemyHit'));
    this.on('enemyDefeated', () => this.playSound('enemyDestroyed'));
    this.on('playerDamaged', () => this.playSound('playerDamaged'));

    // UI events
    this.on('buttonClicked', () => this.playSound('buttonClick'));
    this.on('menuItemSelected', () => this.playSound('menuSelect'));
    this.on('notification', () => this.playSound('notification'));

    // Power-up events
    this.on('abilityActivated', () => this.playSound('abilityActivated'));
    this.on('weaponChanged', () => this.playSound('weaponSwitch'));
    this.on('shieldRecharge', () => this.playSound('shieldRecharge'));

    // Scene events
    this.on('waveStarted', () => this.startBackgroundMusic('combat'));
    this.on('gameWon', () => this.startBackgroundMusic('victory'));
    this.on('gameOver', () => this.startBackgroundMusic('defeat'));
  }

  createSoundPools() {
    // Create pools for frequently used sounds
    const poolSizes = {
      mathCorrect: 5,
      mathIncorrect: 3,
      playerShoot: 10,
      enemyHit: 8,
      buttonClick: 3,
    };

    Object.entries(poolSizes).forEach(([soundName, poolSize]) => {
      this.soundPools.set(soundName, {
        sounds: [],
        currentIndex: 0,
        maxSize: poolSize,
      });
    });
  }

  playSound(soundName, options = {}) {
    if (!this.audioEnabled || !this.audioContext) return;

    const soundDef = this.soundEffects[soundName];
    if (!soundDef) {
      this.warn(`Sound effect not found: ${soundName}`);
      return;
    }

    // Use pooled sound if available
    const pool = this.soundPools.get(soundName);
    if (pool) {
      return this.playPooledSound(soundName, pool, soundDef, options);
    }

    // Create and play new sound
    return this.createAndPlaySound(soundDef, options);
  }

  playPooledSound(soundName, pool, soundDef, options) {
    // Get or create sound from pool
    if (pool.sounds.length < pool.maxSize) {
      const sound = this.createSoundNode(soundDef, options);
      pool.sounds.push(sound);
    }

    const sound = pool.sounds[pool.currentIndex];
    pool.currentIndex = (pool.currentIndex + 1) % pool.sounds.length;

    // Play the sound
    this.playSoundNode(sound, soundDef, options);

    return sound;
  }

  createAndPlaySound(soundDef, options) {
    const sound = this.createSoundNode(soundDef, options);
    this.playSoundNode(sound, soundDef, options);
    return sound;
  }

  createSoundNode(soundDef, options) {
    const oscillator = this.audioContext.createOscillator();
    const gainNode = this.audioContext.createGain();

    // Configure oscillator
    oscillator.type =
      options.waveType || this.getWaveTypeForSound(soundDef.type);
    oscillator.frequency.setValueAtTime(
      soundDef.frequency * (options.pitch || 1),
      this.audioContext.currentTime
    );

    // Configure gain envelope
    const duration = soundDef.duration * (options.duration || 1);
    const volume =
      (options.volume || 1) * this.getVolumeForSoundType(soundDef.type);

    gainNode.gain.setValueAtTime(0, this.audioContext.currentTime);
    gainNode.gain.linearRampToValueAtTime(
      volume,
      this.audioContext.currentTime + 0.01
    );
    gainNode.gain.exponentialRampToValueAtTime(
      0.001,
      this.audioContext.currentTime + duration
    );

    // Connect nodes
    oscillator.connect(gainNode);
    gainNode.connect(this.sfxGain);

    return { oscillator, gainNode, duration };
  }

  playSoundNode(sound, soundDef, options) {
    const startTime = this.audioContext.currentTime;

    // Start oscillator
    sound.oscillator.start(startTime);
    sound.oscillator.stop(startTime + sound.duration);

    // Clean up after sound finishes
    setTimeout(
      () => {
        try {
          sound.oscillator.disconnect();
          sound.gainNode.disconnect();
        } catch (error) {
          // Ignore cleanup errors
        }
      },
      sound.duration * 1000 + 100
    );
  }

  getWaveTypeForSound(type) {
    const waveTypes = {
      success: 'sine',
      error: 'sawtooth',
      achievement: 'triangle',
      action: 'square',
      impact: 'sawtooth',
      explosion: 'sawtooth',
      damage: 'square',
      ui: 'sine',
      notification: 'triangle',
      power: 'triangle',
    };

    return waveTypes[type] || 'sine';
  }

  getVolumeForSoundType(type) {
    const volumes = {
      success: 0.3,
      error: 0.4,
      achievement: 0.5,
      action: 0.2,
      impact: 0.3,
      explosion: 0.4,
      damage: 0.3,
      ui: 0.2,
      notification: 0.3,
      power: 0.4,
    };

    return volumes[type] || 0.3;
  }

  startBackgroundMusic(trackName) {
    if (!this.audioEnabled || !this.audioContext) return;

    // Stop current music
    this.stopBackgroundMusic();

    const track = this.musicTracks[trackName];
    if (!track) {
      this.warn(`Music track not found: ${trackName}`);
      return;
    }

    // Create simple procedural music
    this.currentMusic = this.createProceduralMusic(track);
    this.log(`Started background music: ${trackName}`);
  }

  createProceduralMusic(track) {
    // Create a simple procedural music generator
    const musicNodes = [];
    const baseFrequency = this.getBaseFrequency(track.key);

    // Create multiple oscillators for harmony
    for (let i = 0; i < 3; i++) {
      const oscillator = this.audioContext.createOscillator();
      const gainNode = this.audioContext.createGain();

      oscillator.type = 'sine';
      oscillator.frequency.setValueAtTime(
        baseFrequency * 2 ** (i * 0.5),
        this.audioContext.currentTime
      );

      gainNode.gain.setValueAtTime(
        0.1 / (i + 1),
        this.audioContext.currentTime
      );

      oscillator.connect(gainNode);
      gainNode.connect(this.musicGain);

      oscillator.start();

      musicNodes.push({ oscillator, gainNode });
    }

    return musicNodes;
  }

  getBaseFrequency(key) {
    const frequencies = {
      C: 261.63,
      Am: 220.0,
      G: 196.0,
      Dm: 146.83,
    };

    return frequencies[key] || frequencies.C;
  }

  stopBackgroundMusic() {
    if (this.currentMusic) {
      this.currentMusic.forEach(node => {
        try {
          node.oscillator.stop();
          node.oscillator.disconnect();
          node.gainNode.disconnect();
        } catch (error) {
          // Ignore cleanup errors
        }
      });
      this.currentMusic = null;
    }
  }

  setMasterVolume(volume) {
    this.masterVolume = Math.max(0, Math.min(1, volume));
    if (this.masterGain) {
      this.masterGain.gain.setValueAtTime(
        this.masterVolume,
        this.audioContext.currentTime
      );
    }
  }

  setSfxVolume(volume) {
    this.sfxVolume = Math.max(0, Math.min(1, volume));
    if (this.sfxGain) {
      this.sfxGain.gain.setValueAtTime(
        this.sfxVolume,
        this.audioContext.currentTime
      );
    }
  }

  setMusicVolume(volume) {
    this.musicVolume = Math.max(0, Math.min(1, volume));
    if (this.musicGain) {
      this.musicGain.gain.setValueAtTime(
        this.musicVolume,
        this.audioContext.currentTime
      );
    }
  }

  toggleAudio() {
    this.audioEnabled = !this.audioEnabled;

    if (!this.audioEnabled) {
      this.stopBackgroundMusic();
      this.setMasterVolume(0);
    } else {
      this.setMasterVolume(this.masterVolume);
    }

    return this.audioEnabled;
  }

  onCleanup() {
    // Stop all audio
    this.stopBackgroundMusic();

    // Clean up audio context
    if (this.audioContext) {
      this.audioContext.close();
    }

    // Clear pools
    this.soundPools.clear();
    this.activeSounds.clear();
  }
}
