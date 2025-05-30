/**
 * PerformanceMonitor - Advanced performance tracking for Phaser 3
 * Monitors FPS, memory usage, render calls, and provides optimization insights
 */
export class PerformanceMonitor {
    constructor(scene, config = {}) {
        this.scene = scene;
        this.config = {
            showFPS: config.showFPS !== false,
            showMemory: config.showMemory !== false,
            showRenderStats: config.showRenderStats !== false,
            updateInterval: config.updateInterval || 1000,
            warningThreshold: config.warningThreshold || 30,
            criticalThreshold: config.criticalThreshold || 20,
            position: config.position || { x: 10, y: 10 },
            ...config
        };
        
        // Performance tracking
        this.fps = 0;
        this.averageFPS = 0;
        this.minFPS = Infinity;
        this.maxFPS = 0;
        this.frameCount = 0;
        this.lastUpdate = 0;
        this.fpsHistory = [];
        this.maxHistoryLength = 60; // 60 seconds of history
        
        // Memory tracking
        this.memoryUsage = {
            used: 0,
            total: 0,
            percentage: 0
        };
        
        // Render statistics
        this.renderStats = {
            drawCalls: 0,
            textureSwaps: 0,
            triangles: 0
        };
        
        // Performance warnings
        this.warnings = [];
        this.lastWarningTime = 0;
        this.warningCooldown = 5000; // 5 seconds between warnings
        
        // UI elements
        this.displayElements = {};
        this.isVisible = true;
        
        this.initialize();
    }

    initialize() {
        // Create performance display UI
        if (this.config.showFPS || this.config.showMemory || this.config.showRenderStats) {
            this.createPerformanceDisplay();
        }
        
        // Start monitoring
        this.startMonitoring();
        
        // Add keyboard toggle (F1 key)
        if (this.scene.input && this.scene.input.keyboard) {
            this.scene.input.keyboard.on('keydown-F1', () => {
                this.toggleDisplay();
            });
        }
        
        console.log('PerformanceMonitor initialized');
    }

    createPerformanceDisplay() {
        const { x, y } = this.config.position;
        
        // Background panel
        this.displayElements.background = this.scene.add.graphics();
        this.displayElements.background.fillStyle(0x000000, 0.7);
        this.displayElements.background.fillRoundedRect(x - 5, y - 5, 200, 120, 5);
        this.displayElements.background.setDepth(1000);
        this.displayElements.background.setScrollFactor(0);
        
        // FPS Display
        if (this.config.showFPS) {
            this.displayElements.fpsText = this.scene.add.text(x, y, 'FPS: --', {
                fontSize: '14px',
                fontFamily: 'Courier, monospace',
                fill: '#00ff00'
            });
            this.displayElements.fpsText.setDepth(1001);
            this.displayElements.fpsText.setScrollFactor(0);
            
            this.displayElements.avgFpsText = this.scene.add.text(x, y + 16, 'Avg: --', {
                fontSize: '12px',
                fontFamily: 'Courier, monospace',
                fill: '#00cccc'
            });
            this.displayElements.avgFpsText.setDepth(1001);
            this.displayElements.avgFpsText.setScrollFactor(0);
        }
        
        // Memory Display
        if (this.config.showMemory) {
            this.displayElements.memoryText = this.scene.add.text(x, y + 35, 'Memory: --', {
                fontSize: '12px',
                fontFamily: 'Courier, monospace',
                fill: '#ffff00'
            });
            this.displayElements.memoryText.setDepth(1001);
            this.displayElements.memoryText.setScrollFactor(0);
        }
        
        // Render Stats Display
        if (this.config.showRenderStats) {
            this.displayElements.renderText = this.scene.add.text(x, y + 50, 'Draws: --', {
                fontSize: '12px',
                fontFamily: 'Courier, monospace',
                fill: '#ff8800'
            });
            this.displayElements.renderText.setDepth(1001);
            this.displayElements.renderText.setScrollFactor(0);
        }
        
        // Performance status indicator
        this.displayElements.statusIndicator = this.scene.add.graphics();
        this.displayElements.statusIndicator.setDepth(1001);
        this.displayElements.statusIndicator.setScrollFactor(0);
        
        // Warning text
        this.displayElements.warningText = this.scene.add.text(x, y + 85, '', {
            fontSize: '11px',
            fontFamily: 'Courier, monospace',
            fill: '#ff0000',
            wordWrap: { width: 190 }
        });
        this.displayElements.warningText.setDepth(1001);
        this.displayElements.warningText.setScrollFactor(0);
    }

    startMonitoring() {
        // Update performance metrics regularly
        this.scene.time.addEvent({
            delay: this.config.updateInterval,
            callback: this.updateMetrics,
            callbackScope: this,
            loop: true
        });
        
        // Update FPS every frame
        this.scene.events.on('postupdate', this.updateFPS, this);
    }

    updateFPS() {
        this.fps = Math.floor(this.scene.game.loop.actualFps);
        this.frameCount++;
        
        // Update min/max FPS
        if (this.fps > 0) {
            this.minFPS = Math.min(this.minFPS, this.fps);
            this.maxFPS = Math.max(this.maxFPS, this.fps);
        }
        
        // Calculate average FPS
        const now = Date.now();
        if (now - this.lastUpdate >= 1000) {
            this.fpsHistory.push(this.fps);
            if (this.fpsHistory.length > this.maxHistoryLength) {
                this.fpsHistory.shift();
            }
            
            this.averageFPS = this.fpsHistory.reduce((a, b) => a + b, 0) / this.fpsHistory.length;
            this.lastUpdate = now;
            
            // Check for performance warnings
            this.checkPerformanceWarnings();
        }
    }

    updateMetrics() {
        // Update memory usage
        this.updateMemoryUsage();
        
        // Update render statistics
        this.updateRenderStats();
        
        // Update display
        this.updateDisplay();
    }

    updateMemoryUsage() {
        if (performance.memory) {
            this.memoryUsage.used = Math.round(performance.memory.usedJSHeapSize / 1024 / 1024);
            this.memoryUsage.total = Math.round(performance.memory.totalJSHeapSize / 1024 / 1024);
            this.memoryUsage.percentage = Math.round((this.memoryUsage.used / this.memoryUsage.total) * 100);
        }
    }

    updateRenderStats() {
        // Get renderer statistics if available
        const renderer = this.scene.game.renderer;
        if (renderer && renderer.gl) {
            // WebGL renderer stats
            this.renderStats.drawCalls = renderer.drawCount || 0;
            this.renderStats.textureSwaps = renderer.textureCount || 0;
        }
    }

    updateDisplay() {
        if (!this.isVisible) return;
        
        // Update FPS display
        if (this.displayElements.fpsText) {
            const fpsColor = this.getFPSColor(this.fps);
            this.displayElements.fpsText.setText(`FPS: ${this.fps}`);
            this.displayElements.fpsText.setFill(fpsColor);
            
            this.displayElements.avgFpsText.setText(
                `Avg: ${Math.round(this.averageFPS)} (${this.minFPS}-${this.maxFPS})`
            );
        }
        
        // Update memory display
        if (this.displayElements.memoryText && this.memoryUsage.used > 0) {
            this.displayElements.memoryText.setText(
                `Memory: ${this.memoryUsage.used}MB (${this.memoryUsage.percentage}%)`
            );
        }
        
        // Update render stats display
        if (this.displayElements.renderText) {
            this.displayElements.renderText.setText(
                `Draws: ${this.renderStats.drawCalls} | Textures: ${this.renderStats.textureSwaps}`
            );
        }
        
        // Update status indicator
        this.updateStatusIndicator();
        
        // Update warnings
        this.updateWarningDisplay();
    }

    getFPSColor(fps) {
        if (fps >= 50) return '#00ff00'; // Green - Good
        if (fps >= this.config.warningThreshold) return '#ffff00'; // Yellow - Warning
        if (fps >= this.config.criticalThreshold) return '#ff8800'; // Orange - Poor
        return '#ff0000'; // Red - Critical
    }

    updateStatusIndicator() {
        if (!this.displayElements.statusIndicator) return;
        
        const { x, y } = this.config.position;
        this.displayElements.statusIndicator.clear();
        
        // Draw performance status circle
        let statusColor = 0x00ff00; // Green
        if (this.fps < this.config.warningThreshold) statusColor = 0xffff00; // Yellow
        if (this.fps < this.config.criticalThreshold) statusColor = 0xff0000; // Red
        
        this.displayElements.statusIndicator.fillStyle(statusColor);
        this.displayElements.statusIndicator.fillCircle(x + 185, y + 8, 5);
    }

    checkPerformanceWarnings() {
        const now = Date.now();
        if (now - this.lastWarningTime < this.warningCooldown) return;
        
        this.warnings = [];
        
        // FPS warnings
        if (this.fps < this.config.criticalThreshold) {
            this.warnings.push(`Critical FPS: ${this.fps}`);
        } else if (this.fps < this.config.warningThreshold) {
            this.warnings.push(`Low FPS: ${this.fps}`);
        }
        
        // Memory warnings
        if (this.memoryUsage.percentage > 90) {
            this.warnings.push(`High memory: ${this.memoryUsage.percentage}%`);
        }
        
        // Frame time warnings
        const frameTime = 1000 / this.fps;
        if (frameTime > 33.33) { // 30 FPS threshold
            this.warnings.push(`Slow frame: ${frameTime.toFixed(1)}ms`);
        }
        
        if (this.warnings.length > 0) {
            this.lastWarningTime = now;
            console.warn('Performance warnings:', this.warnings);
        }
    }

    updateWarningDisplay() {
        if (!this.displayElements.warningText) return;
        
        if (this.warnings.length > 0) {
            this.displayElements.warningText.setText(this.warnings.join('\n'));
        } else {
            this.displayElements.warningText.setText('');
        }
    }

    toggleDisplay() {
        this.isVisible = !this.isVisible;
        
        Object.values(this.displayElements).forEach(element => {
            if (element && element.setVisible) {
                element.setVisible(this.isVisible);
            }
        });
        
        console.log(`Performance monitor ${this.isVisible ? 'shown' : 'hidden'}`);
    }

    getPerformanceReport() {
        return {
            fps: {
                current: this.fps,
                average: Math.round(this.averageFPS),
                min: this.minFPS,
                max: this.maxFPS,
                history: [...this.fpsHistory]
            },
            memory: { ...this.memoryUsage },
            renderStats: { ...this.renderStats },
            warnings: [...this.warnings],
            frameCount: this.frameCount,
            uptime: Date.now() - this.scene.scene.manager.game.loop.time
        };
    }

    logPerformanceReport() {
        const report = this.getPerformanceReport();
        console.log('=== Performance Report ===');
        console.log(`FPS: ${report.fps.current} (avg: ${report.fps.average}, range: ${report.fps.min}-${report.fps.max})`);
        console.log(`Memory: ${report.memory.used}MB / ${report.memory.total}MB (${report.memory.percentage}%)`);
        console.log(`Render: ${report.renderStats.drawCalls} draws, ${report.renderStats.textureSwaps} texture swaps`);
        console.log(`Frames rendered: ${report.frameCount}`);
        
        if (report.warnings.length > 0) {
            console.warn('Active warnings:', report.warnings);
        }
    }

    // Performance optimization suggestions
    getOptimizationSuggestions() {
        const suggestions = [];
        
        if (this.averageFPS < 30) {
            suggestions.push('Consider reducing visual effects or particle count');
            suggestions.push('Enable object pooling for frequently created objects');
            suggestions.push('Try switching from WebGL to Canvas renderer');
        }
        
        if (this.memoryUsage.percentage > 80) {
            suggestions.push('Implement object pooling to reduce garbage collection');
            suggestions.push('Check for memory leaks in event listeners');
            suggestions.push('Consider lazy loading of assets');
        }
        
        if (this.renderStats.drawCalls > 100) {
            suggestions.push('Reduce number of individual sprites');
            suggestions.push('Use sprite sheets and texture atlases');
            suggestions.push('Batch similar rendering operations');
        }
        
        return suggestions;
    }

    destroy() {
        // Clean up event listeners
        this.scene.events.off('postupdate', this.updateFPS, this);
        
        // Destroy UI elements
        Object.values(this.displayElements).forEach(element => {
            if (element && element.destroy) {
                element.destroy();
            }
        });
        
        this.displayElements = {};
        console.log('PerformanceMonitor destroyed');
    }
} 