/**
 * Base Game System Class
 * All game subsystems extend this for consistent lifecycle management
 */

export class GameSystem {
  constructor(scene, config = {}) {
    this.scene = scene;
    this.config = config;
    this.isInitialized = false;
    this.isActive = false;
    this.updateThrottle = config.updateThrottle || 0;
    this.lastUpdate = 0;

    // Event system for inter-system communication
    this.events = scene.events || scene;

    // Performance tracking
    this.performanceMetrics = {
      initTime: 0,
      updateCount: 0,
      averageUpdateTime: 0,
      totalUpdateTime: 0,
    };
  }

  /**
   * Initialize the system - called once when system is created
   * Override this in child classes
   */
  async init() {
    const startTime = performance.now();

    try {
      await this.onInit();
      this.isInitialized = true;
      this.isActive = true;

      this.performanceMetrics.initTime = performance.now() - startTime;
      this.log(
        `System initialized in ${this.performanceMetrics.initTime.toFixed(2)}ms`
      );
    } catch (error) {
      this.error('Failed to initialize system:', error);
      throw error;
    }
  }

  /**
   * Override this method in child classes for initialization logic
   */
  async onInit() {
    // Override in child classes
  }

  /**
   * Update the system - called every frame
   */
  update(time, delta) {
    if (!this.isInitialized || !this.isActive) return;

    // Throttle updates if configured
    if (this.updateThrottle > 0) {
      if (time - this.lastUpdate < this.updateThrottle) return;
      this.lastUpdate = time;
    }

    const startTime = performance.now();

    try {
      this.onUpdate(time, delta);

      // Update performance metrics
      const updateTime = performance.now() - startTime;
      this.performanceMetrics.updateCount++;
      this.performanceMetrics.totalUpdateTime += updateTime;
      this.performanceMetrics.averageUpdateTime =
        this.performanceMetrics.totalUpdateTime /
        this.performanceMetrics.updateCount;
    } catch (error) {
      this.error('Error in system update:', error);
    }
  }

  /**
   * Override this method in child classes for update logic
   */
  onUpdate(time, delta) {
    // Override in child classes
  }

  /**
   * Cleanup the system - called when system is destroyed
   */
  cleanup() {
    try {
      this.onCleanup();
      this.isActive = false;
      this.isInitialized = false;

      this.log('System cleaned up');
    } catch (error) {
      this.error('Error during cleanup:', error);
    }
  }

  /**
   * Override this method in child classes for cleanup logic
   */
  onCleanup() {
    // Override in child classes
  }

  /**
   * Pause the system
   */
  pause() {
    this.isActive = false;
    this.onPause();
    this.log('System paused');
  }

  /**
   * Resume the system
   */
  resume() {
    if (this.isInitialized) {
      this.isActive = true;
      this.onResume();
      this.log('System resumed');
    }
  }

  /**
   * Override for pause logic
   */
  onPause() {
    // Override in child classes
  }

  /**
   * Override for resume logic
   */
  onResume() {
    // Override in child classes
  }

  /**
   * Emit an event to other systems
   */
  emit(eventName, ...args) {
    try {
      this.events.emit(eventName, ...args);
    } catch (error) {
      this.error('Error emitting event:', eventName, error);
    }
  }

  /**
   * Listen for events from other systems
   */
  on(eventName, callback, context = this) {
    try {
      this.events.on(eventName, callback, context);
    } catch (error) {
      this.error('Error setting up event listener:', eventName, error);
    }
  }

  /**
   * Remove event listener
   */
  off(eventName, callback, context = this) {
    try {
      this.events.off(eventName, callback, context);
    } catch (error) {
      this.error('Error removing event listener:', eventName, error);
    }
  }

  /**
   * Get system performance metrics
   */
  getPerformanceMetrics() {
    return {
      ...this.performanceMetrics,
      isInitialized: this.isInitialized,
      isActive: this.isActive,
      systemName: this.constructor.name,
    };
  }

  /**
   * Reset performance metrics
   */
  resetPerformanceMetrics() {
    this.performanceMetrics = {
      initTime: 0,
      updateCount: 0,
      averageUpdateTime: 0,
      totalUpdateTime: 0,
    };
  }

  /**
   * Logging utility
   */
  log(...args) {
    console.log(`[${this.constructor.name}]`, ...args);
  }

  /**
   * Warning utility
   */
  warn(...args) {
    console.warn(`[${this.constructor.name}]`, ...args);
  }

  /**
   * Error utility
   */
  error(...args) {
    console.error(`[${this.constructor.name}]`, ...args);
  }

  /**
   * Debug utility (only logs if debug mode is enabled)
   */
  debug(...args) {
    if (this.config.debug || this.scene.game?.config?.debug) {
      console.debug(`[${this.constructor.name}]`, ...args);
    }
  }

  /**
   * Validate system state
   */
  validate() {
    const issues = [];

    if (!this.scene) {
      issues.push('No scene reference');
    }

    if (!this.isInitialized && this.isActive) {
      issues.push('System is active but not initialized');
    }

    return {
      isValid: issues.length === 0,
      issues,
    };
  }

  /**
   * Get system status for debugging
   */
  getStatus() {
    return {
      name: this.constructor.name,
      initialized: this.isInitialized,
      active: this.isActive,
      updateThrottle: this.updateThrottle,
      performance: this.getPerformanceMetrics(),
      validation: this.validate(),
    };
  }
}
