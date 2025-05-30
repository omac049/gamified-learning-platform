/**
 * Enhanced System Loader
 * Handles robust initialization of game systems with fallbacks and progress tracking
 */

export class SystemLoader {
    constructor(scene, options = {}) {
        this.scene = scene;
        this.options = {
            timeout: 10000, // 10 second timeout per system
            retryAttempts: 2,
            showProgress: true,
            fallbackMode: true,
            ...options
        };
        
        this.loadingProgress = 0;
        this.totalSystems = 0;
        this.loadedSystems = 0;
        this.failedSystems = [];
        this.loadingText = null;
        this.progressBar = null;
        
        this.systemDefinitions = new Map();
        this.loadedSystemInstances = new Map();
    }
    
    /**
     * Register a system for loading
     */
    registerSystem(name, SystemClass, config = {}, dependencies = []) {
        this.systemDefinitions.set(name, {
            name,
            SystemClass,
            config,
            dependencies,
            priority: config.priority || 0,
            required: config.required !== false,
            retryCount: 0
        });
        this.totalSystems++;
    }
    
    /**
     * Load all registered systems
     */
    async loadAllSystems() {
        console.log('SystemLoader: Starting system loading...');
        
        if (this.options.showProgress) {
            this.showLoadingUI();
        }
        
        try {
            // Sort systems by priority and dependencies
            const sortedSystems = this.sortSystemsByDependencies();
            
            // Load systems in order
            for (const systemDef of sortedSystems) {
                await this.loadSystem(systemDef);
                this.updateProgress();
            }
            
            console.log(`SystemLoader: Loading complete. ${this.loadedSystems}/${this.totalSystems} systems loaded successfully`);
            
            if (this.failedSystems.length > 0) {
                console.warn('SystemLoader: Some systems failed to load:', this.failedSystems);
            }
            
            if (this.options.showProgress) {
                this.hideLoadingUI();
            }
            
            return {
                success: true,
                loadedSystems: this.loadedSystemInstances,
                failedSystems: this.failedSystems,
                loadedCount: this.loadedSystems,
                totalCount: this.totalSystems
            };
            
        } catch (error) {
            console.error('SystemLoader: Critical error during system loading:', error);
            
            if (this.options.fallbackMode) {
                return this.createFallbackResult();
            } else {
                throw error;
            }
        }
    }
    
    /**
     * Load a single system with retry logic
     */
    async loadSystem(systemDef) {
        const { name, SystemClass, config, required } = systemDef;
        
        console.log(`SystemLoader: Loading ${name}...`);
        
        for (let attempt = 0; attempt <= this.options.retryAttempts; attempt++) {
            try {
                // Check if dependencies are loaded
                if (!this.checkDependencies(systemDef)) {
                    throw new Error(`Dependencies not met for ${name}`);
                }
                
                // Create system instance with timeout
                const systemInstance = await this.createSystemWithTimeout(SystemClass, config);
                
                // Initialize system
                await this.initializeSystemWithTimeout(systemInstance);
                
                // Store successful system
                this.loadedSystemInstances.set(name, systemInstance);
                this.loadedSystems++;
                
                console.log(`SystemLoader: ${name} loaded successfully`);
                return systemInstance;
                
            } catch (error) {
                console.warn(`SystemLoader: ${name} failed to load (attempt ${attempt + 1}):`, error);
                systemDef.retryCount++;
                
                if (attempt === this.options.retryAttempts) {
                    // Final attempt failed
                    this.failedSystems.push({
                        name,
                        error: error.message,
                        required,
                        attempts: attempt + 1
                    });
                    
                    if (required && !this.options.fallbackMode) {
                        throw new Error(`Required system ${name} failed to load: ${error.message}`);
                    }
                    
                    console.error(`SystemLoader: ${name} failed to load after ${attempt + 1} attempts`);
                    break;
                }
                
                // Wait before retry
                await this.delay(1000 * (attempt + 1));
            }
        }
        
        return null;
    }
    
    /**
     * Create system instance with timeout
     */
    async createSystemWithTimeout(SystemClass, config) {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('System creation timeout'));
            }, this.options.timeout);
            
            try {
                const instance = new SystemClass(this.scene, config);
                clearTimeout(timeout);
                resolve(instance);
            } catch (error) {
                clearTimeout(timeout);
                reject(error);
            }
        });
    }
    
    /**
     * Initialize system with timeout
     */
    async initializeSystemWithTimeout(systemInstance) {
        return new Promise((resolve, reject) => {
            const timeout = setTimeout(() => {
                reject(new Error('System initialization timeout'));
            }, this.options.timeout);
            
            Promise.resolve(systemInstance.init())
                .then(() => {
                    clearTimeout(timeout);
                    resolve();
                })
                .catch((error) => {
                    clearTimeout(timeout);
                    reject(error);
                });
        });
    }
    
    /**
     * Check if system dependencies are loaded
     */
    checkDependencies(systemDef) {
        for (const depName of systemDef.dependencies) {
            if (!this.loadedSystemInstances.has(depName)) {
                return false;
            }
        }
        return true;
    }
    
    /**
     * Sort systems by dependencies and priority
     */
    sortSystemsByDependencies() {
        const systems = Array.from(this.systemDefinitions.values());
        const sorted = [];
        const visited = new Set();
        const visiting = new Set();
        
        const visit = (systemDef) => {
            if (visiting.has(systemDef.name)) {
                throw new Error(`Circular dependency detected involving ${systemDef.name}`);
            }
            
            if (visited.has(systemDef.name)) {
                return;
            }
            
            visiting.add(systemDef.name);
            
            // Visit dependencies first
            for (const depName of systemDef.dependencies) {
                const depSystem = this.systemDefinitions.get(depName);
                if (depSystem) {
                    visit(depSystem);
                }
            }
            
            visiting.delete(systemDef.name);
            visited.add(systemDef.name);
            sorted.push(systemDef);
        };
        
        // Sort by priority first, then resolve dependencies
        systems.sort((a, b) => b.priority - a.priority);
        
        for (const systemDef of systems) {
            visit(systemDef);
        }
        
        return sorted;
    }
    
    /**
     * Show loading UI
     */
    showLoadingUI() {
        const centerX = this.scene.scale.width / 2;
        const centerY = this.scene.scale.height / 2;
        
        // Loading background
        this.loadingBg = this.scene.add.rectangle(
            centerX, centerY,
            this.scene.scale.width, this.scene.scale.height,
            0x000000, 0.8
        ).setDepth(10000);
        
        // Loading title
        this.loadingText = this.scene.add.text(
            centerX, centerY - 50,
            'Initializing Game Systems...',
            {
                fontSize: '24px',
                fontFamily: 'Courier, monospace',
                color: '#00ffff',
                align: 'center'
            }
        ).setOrigin(0.5).setDepth(10001);
        
        // Progress bar background
        this.progressBarBg = this.scene.add.rectangle(
            centerX, centerY,
            300, 20,
            0x333333
        ).setStrokeStyle(2, 0x00ffff).setDepth(10001);
        
        // Progress bar fill
        this.progressBar = this.scene.add.rectangle(
            centerX - 148, centerY,
            0, 16,
            0x00ffff
        ).setOrigin(0, 0.5).setDepth(10002);
        
        // Progress text
        this.progressText = this.scene.add.text(
            centerX, centerY + 30,
            '0%',
            {
                fontSize: '16px',
                fontFamily: 'Courier, monospace',
                color: '#ffffff'
            }
        ).setOrigin(0.5).setDepth(10001);
        
        // System status text
        this.statusText = this.scene.add.text(
            centerX, centerY + 60,
            'Preparing...',
            {
                fontSize: '14px',
                fontFamily: 'Courier, monospace',
                color: '#ffff00'
            }
        ).setOrigin(0.5).setDepth(10001);
    }
    
    /**
     * Update loading progress
     */
    updateProgress() {
        if (!this.options.showProgress) return;
        
        this.loadingProgress = (this.loadedSystems / this.totalSystems) * 100;
        
        if (this.progressBar) {
            this.progressBar.setDisplaySize(296 * (this.loadingProgress / 100), 16);
        }
        
        if (this.progressText) {
            this.progressText.setText(`${Math.round(this.loadingProgress)}%`);
        }
        
        if (this.statusText) {
            this.statusText.setText(`${this.loadedSystems}/${this.totalSystems} systems loaded`);
        }
    }
    
    /**
     * Hide loading UI
     */
    hideLoadingUI() {
        if (this.loadingBg) this.loadingBg.destroy();
        if (this.loadingText) this.loadingText.destroy();
        if (this.progressBarBg) this.progressBarBg.destroy();
        if (this.progressBar) this.progressBar.destroy();
        if (this.progressText) this.progressText.destroy();
        if (this.statusText) this.statusText.destroy();
    }
    
    /**
     * Create fallback result when critical systems fail
     */
    createFallbackResult() {
        console.warn('SystemLoader: Creating fallback result due to system failures');
        
        return {
            success: false,
            fallbackMode: true,
            loadedSystems: this.loadedSystemInstances,
            failedSystems: this.failedSystems,
            loadedCount: this.loadedSystems,
            totalCount: this.totalSystems,
            message: 'Some systems failed to load, running in fallback mode'
        };
    }
    
    /**
     * Get loaded system by name
     */
    getSystem(name) {
        return this.loadedSystemInstances.get(name);
    }
    
    /**
     * Check if system is loaded
     */
    isSystemLoaded(name) {
        return this.loadedSystemInstances.has(name);
    }
    
    /**
     * Get loading statistics
     */
    getLoadingStats() {
        return {
            totalSystems: this.totalSystems,
            loadedSystems: this.loadedSystems,
            failedSystems: this.failedSystems.length,
            successRate: (this.loadedSystems / this.totalSystems) * 100,
            failedSystemNames: this.failedSystems.map(f => f.name)
        };
    }
    
    /**
     * Utility delay function
     */
    delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }
    
    /**
     * Cleanup loader resources
     */
    cleanup() {
        this.hideLoadingUI();
        this.systemDefinitions.clear();
        this.loadedSystemInstances.clear();
        this.failedSystems = [];
    }
} 