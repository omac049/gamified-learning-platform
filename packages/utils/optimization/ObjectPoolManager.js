/**
 * ObjectPoolManager - Advanced object pooling system for Phaser 3
 * Eliminates garbage collection pauses by reusing objects
 * Based on optimization techniques from Phaser 3 performance guides
 */
export class ObjectPoolManager {
  constructor(scene) {
    this.scene = scene;
    this.pools = new Map();
    this.activeObjects = new Map();
    this.poolStats = new Map();

    // Performance tracking
    this.totalObjectsCreated = 0;
    this.totalObjectsReused = 0;
    this.poolHitRate = 0;
  }

  /**
   * Create a new object pool for a specific type
   */
  createPool(poolName, classType, maxSize = 100, runChildUpdate = true) {
    if (this.pools.has(poolName)) {
      console.warn(`Pool ${poolName} already exists`);
      return this.pools.get(poolName);
    }

    const pool = this.scene.add.group({
      classType,
      runChildUpdate,
      maxSize,
    });

    this.pools.set(poolName, pool);
    this.activeObjects.set(poolName, new Set());
    this.poolStats.set(poolName, {
      created: 0,
      reused: 0,
      maxSize,
      currentActive: 0,
    });

    console.log(`Created object pool: ${poolName} (max: ${maxSize})`);
    return pool;
  }

  /**
   * Get an object from the pool or create a new one
   */
  spawn(poolName, ...args) {
    const pool = this.pools.get(poolName);
    if (!pool) {
      console.error(`Pool ${poolName} does not exist`);
      return null;
    }

    const stats = this.poolStats.get(poolName);
    const object = pool.getFirstDead(false);

    if (object) {
      // Object was reused from pool
      object.setVisible(true);
      object.setActive(true);
      stats.reused++;
      this.totalObjectsReused++;

      // Remove automatic initialize call - let calling code handle initialization
    } else {
      // Pool is empty, create new object
      stats.created++;
      this.totalObjectsCreated++;
      console.warn(`Pool ${poolName} exhausted, creating new object`);
    }

    if (object) {
      this.activeObjects.get(poolName).add(object);
      stats.currentActive = this.activeObjects.get(poolName).size;
      this.updatePoolHitRate();
    }

    return object;
  }

  /**
   * Return an object to the pool
   */
  release(poolName, object) {
    if (!object || !object.active) return;

    const pool = this.pools.get(poolName);
    if (!pool) {
      console.error(`Pool ${poolName} does not exist`);
      return;
    }

    // Clean up object state
    object.setVisible(false);
    object.setActive(false);

    // Call custom cleanup if available
    if (object.cleanup && typeof object.cleanup === 'function') {
      object.cleanup();
    }

    // Remove from active tracking
    const activeSet = this.activeObjects.get(poolName);
    if (activeSet) {
      activeSet.delete(object);
      const stats = this.poolStats.get(poolName);
      stats.currentActive = activeSet.size;
    }

    // Return to pool
    pool.killAndHide(object);
  }

  /**
   * Release all objects from a specific pool
   */
  releaseAll(poolName) {
    const activeSet = this.activeObjects.get(poolName);
    if (!activeSet) return;

    const objectsToRelease = Array.from(activeSet);
    objectsToRelease.forEach(object => {
      this.release(poolName, object);
    });
  }

  /**
   * Get pool statistics
   */
  getPoolStats(poolName) {
    return this.poolStats.get(poolName);
  }

  /**
   * Get all pool statistics
   */
  getAllStats() {
    const stats = {};
    this.poolStats.forEach((stat, poolName) => {
      stats[poolName] = { ...stat };
    });

    stats.global = {
      totalCreated: this.totalObjectsCreated,
      totalReused: this.totalObjectsReused,
      hitRate: this.poolHitRate,
    };

    return stats;
  }

  /**
   * Update pool hit rate calculation
   */
  updatePoolHitRate() {
    const total = this.totalObjectsCreated + this.totalObjectsReused;
    this.poolHitRate = total > 0 ? (this.totalObjectsReused / total) * 100 : 0;
  }

  /**
   * Clean up all pools
   */
  destroy() {
    this.pools.forEach((pool, poolName) => {
      this.releaseAll(poolName);
      pool.destroy();
    });

    this.pools.clear();
    this.activeObjects.clear();
    this.poolStats.clear();
  }

  /**
   * Debug information
   */
  logPoolStatus() {
    console.log('=== Object Pool Status ===');
    console.log(`Global Hit Rate: ${this.poolHitRate.toFixed(2)}%`);

    this.poolStats.forEach((stats, poolName) => {
      const hitRate =
        stats.reused + stats.created > 0
          ? (stats.reused / (stats.reused + stats.created)) * 100
          : 0;

      console.log(
        `${poolName}: Active: ${stats.currentActive}/${stats.maxSize}, ` +
          `Created: ${stats.created}, Reused: ${stats.reused}, ` +
          `Hit Rate: ${hitRate.toFixed(2)}%`
      );
    });
  }
}

/**
 * Poolable Bullet Class
 */
export class PoolableBullet extends Phaser.GameObjects.Graphics {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.scene = scene;
    this.speed = 0;
    this.direction = { x: 0, y: 0 };
    this.damage = 0;
    this.lifespan = 0;
    this.maxLifespan = 3000; // 3 seconds

    // Create bullet visual
    this.clear();
    this.fillStyle(0x00ff88);
    this.fillCircle(0, 0, 3);
    this.setDepth(10);
  }

  initialize(x, y, targetX, targetY, speed = 300, damage = 10) {
    this.setPosition(x, y);
    this.speed = speed;
    this.damage = damage;
    this.lifespan = 0;

    // Calculate direction
    const distance = Phaser.Math.Distance.Between(x, y, targetX, targetY);
    this.direction.x = (targetX - x) / distance;
    this.direction.y = (targetY - y) / distance;

    // Set physics body if available
    if (this.body) {
      this.body.setVelocity(
        this.direction.x * this.speed,
        this.direction.y * this.speed
      );
    }
  }

  update(time, delta) {
    if (!this.active) return;

    this.lifespan += delta;

    // Move bullet if no physics body
    if (!this.body) {
      this.x += this.direction.x * this.speed * (delta / 1000);
      this.y += this.direction.y * this.speed * (delta / 1000);
    }

    // Check if bullet should be destroyed
    if (this.lifespan >= this.maxLifespan || this.isOutOfBounds()) {
      this.scene.objectPoolManager.release('bullets', this);
    }
  }

  isOutOfBounds() {
    return (
      this.x < -50 ||
      this.x > this.scene.scale.width + 50 ||
      this.y < -50 ||
      this.y > this.scene.scale.height + 50
    );
  }

  cleanup() {
    this.lifespan = 0;
    if (this.body) {
      this.body.setVelocity(0, 0);
    }
  }
}

/**
 * Poolable Particle Class
 */
export class PoolableParticle extends Phaser.GameObjects.Graphics {
  constructor(scene, x, y) {
    super(scene, x, y);
    this.scene = scene;
    this.velocity = { x: 0, y: 0 };
    this.life = 0;
    this.maxLife = 1000;
    this.startAlpha = 1;
    this.startScale = 1;
    this.color = 0xffffff;
  }

  initialize(x, y, config = {}) {
    this.setPosition(x, y);
    this.velocity.x = config.velocityX || (Math.random() - 0.5) * 200;
    this.velocity.y = config.velocityY || (Math.random() - 0.5) * 200;
    this.life = 0;
    this.maxLife = config.maxLife || 1000;
    this.startAlpha = config.alpha || 1;
    this.startScale = config.scale || 1;
    this.color = config.color || 0xffffff;

    this.setAlpha(this.startAlpha);
    this.setScale(this.startScale);

    // Create particle visual
    this.clear();
    this.fillStyle(this.color);
    this.fillCircle(0, 0, config.size || 2);
  }

  update(time, delta) {
    if (!this.active) return;

    this.life += delta;
    const lifePercent = this.life / this.maxLife;

    // Update position
    this.x += this.velocity.x * (delta / 1000);
    this.y += this.velocity.y * (delta / 1000);

    // Update alpha and scale based on life
    this.setAlpha(this.startAlpha * (1 - lifePercent));
    this.setScale(this.startScale * (1 - lifePercent * 0.5));

    // Check if particle should be destroyed
    if (this.life >= this.maxLife) {
      this.scene.objectPoolManager.release('particles', this);
    }
  }

  cleanup() {
    this.life = 0;
    this.velocity.x = 0;
    this.velocity.y = 0;
  }
}
