import { Scene } from "phaser";
import { ProgressTracker } from "../utils/managers/index.js";

export class EducationalMenuScene extends Scene {
    constructor() {
        super("EducationalMenuScene");
        this.progressTracker = new ProgressTracker();
        
        // Enhanced color palette with modern UI colors
        this.uiColors = {
            // Primary colors
            primary: 0x00ffff,
            primaryDark: 0x0891b2,
            secondary: 0xff00ff,
            accent: 0xffd700,
            
            // Background colors
            bgPrimary: 0x0f172a,
            bgSecondary: 0x1e293b,
            bgCard: 0x334155,
            bgGlass: 0x475569,
            
            // Text colors
            textPrimary: 0xffffff,
            textSecondary: 0xe2e8f0,
            textMuted: 0x94a3b8,
            
            // Status colors
            success: 0x10b981,
            warning: 0xf59e0b,
            error: 0xef4444,
            info: 0x3b82f6,
            
            // Neon effects
            neonBlue: 0x00ffff,
            neonPink: 0xff00ff,
            neonGreen: 0x00ff00,
            neonYellow: 0xffff00,
            neonPurple: 0x8b5cf6
        };
        
        // Layout constants for responsive design
        this.layout = {
            padding: 20,
            cardSpacing: 16,
            headerHeight: 120,
            sidebarWidth: 280,
            contentWidth: 0, // Will be calculated
            maxContentWidth: 1200
        };
    }

    init(data) {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        
        // Calculate responsive layout
        this.calculateLayout();
        
        // Initialize transition flag
        this.isTransitioning = false;
        
        // Check if returning from shop
        if (data && data.fromShop) {
            console.log('EducationalMenuScene: Returning from shop');
            // Delay the update to ensure scene is fully loaded
            this.time.delayedCall(500, () => {
                this.onReturnFromShop();
            });
        }
        
        // Check if returning from a game
        if (data && data.fromGame) {
            console.log('EducationalMenuScene: Returning from game');
            // Show completion message or update progress
            this.time.delayedCall(500, () => {
                this.updateCharacterCard();
            });
        }
    }

    calculateLayout() {
        const screenWidth = this.scale.width;
        const screenHeight = this.scale.height;
        
        // Responsive sidebar
        if (screenWidth < 1024) {
            this.layout.sidebarWidth = 0; // Hide sidebar on smaller screens
            this.layout.contentWidth = screenWidth - (this.layout.padding * 2);
        } else {
            this.layout.contentWidth = screenWidth - this.layout.sidebarWidth - (this.layout.padding * 3);
        }
        
        // Limit max content width for better readability
        if (this.layout.contentWidth > this.layout.maxContentWidth) {
            this.layout.contentWidth = this.layout.maxContentWidth;
        }
    }

    create() {
        console.log("EducationalMenuScene: Creating modern cyber UI");
        
        // Proactive cleanup of any corrupted interactive objects
        if (window.cleanupCorruptedInteractives) {
            const cleanedCount = window.cleanupCorruptedInteractives();
            if (cleanedCount > 0) {
                console.log(`EducationalMenuScene: Cleaned up ${cleanedCount} corrupted objects before scene creation`);
            }
        }
        
        // Create layered background system
        this.createModernBackground();
        
        // Create main layout containers
        this.createLayoutContainers();
        
        // Create header section
        this.createModernHeader();
        
        // Create sidebar (if space allows)
        if (this.layout.sidebarWidth > 0) {
            this.createModernSidebar();
        }
        
        // Create main content area
        this.createMainContent();
        
        // Create floating action buttons
        this.createFloatingActions();
        
        // Add subtle animations and effects
        this.addAmbientEffects();
    }

    createModernBackground() {
        // Multi-layer background system
        
        // Base gradient
        const bgGradient = this.add.graphics();
        bgGradient.fillGradientStyle(
            this.uiColors.bgPrimary, this.uiColors.bgPrimary,
            this.uiColors.bgSecondary, this.uiColors.bgSecondary,
            1
        );
        bgGradient.fillRect(0, 0, this.scale.width, this.scale.height);
        bgGradient.setDepth(-100);
        
        // Animated geometric patterns
        this.createGeometricPatterns();
        
        // Subtle particle system
        this.createAmbientParticles();
        
        // Cyber grid overlay
        this.createCyberGrid();
    }

    createGeometricPatterns() {
        // Create animated hexagonal patterns
        const patternGraphics = this.add.graphics();
        patternGraphics.setDepth(-90);
        
        const hexSize = 40;
        const rows = Math.ceil(this.scale.height / (hexSize * 1.5)) + 2;
        const cols = Math.ceil(this.scale.width / (hexSize * Math.sqrt(3))) + 2;
        
        for (let row = 0; row < rows; row++) {
            for (let col = 0; col < cols; col++) {
                const x = col * hexSize * Math.sqrt(3) + (row % 2) * hexSize * Math.sqrt(3) / 2;
                const y = row * hexSize * 1.5;
                
                // Random chance for pattern visibility
                if (Math.random() < 0.1) {
                    patternGraphics.lineStyle(1, this.uiColors.neonBlue, 0.1);
                    this.drawHexagon(patternGraphics, x, y, hexSize * 0.8);
                }
            }
        }
        
        // Animate pattern opacity
        this.tweens.add({
            targets: patternGraphics,
            alpha: 0.3,
            duration: 4000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    drawHexagon(graphics, x, y, size) {
        const points = [];
        for (let i = 0; i < 6; i++) {
            const angle = (i * Math.PI) / 3;
            points.push(x + size * Math.cos(angle));
            points.push(y + size * Math.sin(angle));
        }
        graphics.strokePoints(points, true);
    }

    createAmbientParticles() {
        // Subtle floating particles
        for (let i = 0; i < 15; i++) {
            const particle = this.add.circle(
                Phaser.Math.Between(0, this.scale.width),
                Phaser.Math.Between(0, this.scale.height),
                Phaser.Math.Between(1, 3),
                this.uiColors.neonBlue,
                0.3
            );
            particle.setDepth(-80);
            
            // Floating animation
            this.tweens.add({
                targets: particle,
                x: particle.x + Phaser.Math.Between(-100, 100),
                y: particle.y + Phaser.Math.Between(-100, 100),
                alpha: 0.1,
                duration: Phaser.Math.Between(8000, 15000),
                repeat: -1,
                yoyo: true,
                ease: 'Sine.easeInOut'
            });
        }
    }

    createCyberGrid() {
        const gridGraphics = this.add.graphics();
        gridGraphics.setDepth(-70);
        
        // Subtle grid lines
        gridGraphics.lineStyle(1, this.uiColors.neonBlue, 0.05);
        
        const gridSize = 50;
        
        // Vertical lines
        for (let x = 0; x <= this.scale.width; x += gridSize) {
            gridGraphics.beginPath();
            gridGraphics.moveTo(x, 0);
            gridGraphics.lineTo(x, this.scale.height);
            gridGraphics.strokePath();
        }
        
        // Horizontal lines
        for (let y = 0; y <= this.scale.height; y += gridSize) {
            gridGraphics.beginPath();
            gridGraphics.moveTo(0, y);
            gridGraphics.lineTo(this.scale.width, y);
            gridGraphics.strokePath();
        }
    }

    createLayoutContainers() {
        // Main content container
        this.contentContainer = this.add.container(0, 0);
        this.contentContainer.setDepth(10);
        
        // Header container
        this.headerContainer = this.add.container(0, 0);
        this.headerContainer.setDepth(20);
        
        // Sidebar container
        this.sidebarContainer = this.add.container(0, 0);
        this.sidebarContainer.setDepth(15);
        
        // Floating elements container
        this.floatingContainer = this.add.container(0, 0);
        this.floatingContainer.setDepth(30);
    }

    createModernHeader() {
        // Header background with glassmorphism effect
        const headerBg = this.add.graphics();
        headerBg.fillStyle(this.uiColors.bgGlass, 0.3);
        headerBg.fillRoundedRect(0, 0, this.scale.width, this.layout.headerHeight, 0);
        headerBg.lineStyle(1, this.uiColors.neonBlue, 0.3);
        headerBg.strokeRoundedRect(0, 0, this.scale.width, this.layout.headerHeight, 0);
        this.headerContainer.add(headerBg);
        
        // Main title with enhanced styling
        const title = this.add.text(
            this.scale.width / 2,
            40,
            "CYBER ACADEMY",
            {
                fontSize: '42px',
                fontFamily: 'Courier, monospace',
                fill: '#00ffff',
                stroke: '#000000',
                strokeThickness: 3,
                fontStyle: 'bold',
                shadow: {
                    offsetX: 2,
                    offsetY: 2,
                    color: '#ff00ff',
                    blur: 8,
                    fill: true
                }
            }
        ).setOrigin(0.5);
        this.headerContainer.add(title);
        
        // Subtitle with better positioning
        const subtitle = this.add.text(
            this.scale.width / 2,
            70,
            "ROBOT COMMAND CENTER",
            {
                fontSize: '18px',
                fontFamily: 'Courier, monospace',
                fill: '#ffd700',
                stroke: '#000000',
                strokeThickness: 2,
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);
        this.headerContainer.add(subtitle);
        
        // Player status bar
        this.createPlayerStatusBar();
        
        // Title glow animation
        this.tweens.add({
            targets: title,
            alpha: 0.8,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createPlayerStatusBar() {
        const progress = this.progressTracker.getProgressSummary();
        const character = this.progressTracker.getCharacter();
        const charType = this.progressTracker.getCharacterType();
        
        // Status bar background
        const statusBg = this.add.graphics();
        statusBg.fillStyle(this.uiColors.bgCard, 0.8);
        statusBg.fillRoundedRect(this.layout.padding, 90, this.scale.width - (this.layout.padding * 2), 25, 12);
        statusBg.lineStyle(1, this.uiColors.primary, 0.5);
        statusBg.strokeRoundedRect(this.layout.padding, 90, this.scale.width - (this.layout.padding * 2), 25, 12);
        this.headerContainer.add(statusBg);
        
        // Player name and level
        let playerInfo = `Welcome back, ${character?.name || 'Young Scholar'}!`;
        if (charType) {
            playerInfo += ` | Level ${progress.characterLevel} ${charType.name}`;
        }
        
        const playerText = this.add.text(
            this.layout.padding + 15,
            102,
            playerInfo,
            {
                fontSize: '14px',
                fontFamily: 'Courier, monospace',
                fill: '#ffffff',
                fontStyle: 'bold'
            }
        ).setOrigin(0, 0.5);
        this.headerContainer.add(playerText);
        
        // Coins display (right side)
        const coinsText = this.add.text(
            this.scale.width - this.layout.padding - 15,
            102,
            `💰 ${this.progressTracker.getCoinBalance()} Coins`,
            {
                fontSize: '14px',
                fontFamily: 'Courier, monospace',
                fill: '#ffd700',
                fontStyle: 'bold'
            }
        ).setOrigin(1, 0.5);
        this.headerContainer.add(coinsText);
        
        // Store reference for updates
        this.playerCoinsText = coinsText;
    }

    createModernSidebar() {
        const sidebarX = this.scale.width - this.layout.sidebarWidth;
        
        // Sidebar background
        const sidebarBg = this.add.graphics();
        sidebarBg.fillStyle(this.uiColors.bgCard, 0.4);
        sidebarBg.fillRoundedRect(sidebarX, this.layout.headerHeight, this.layout.sidebarWidth, this.scale.height - this.layout.headerHeight, 0);
        sidebarBg.lineStyle(1, this.uiColors.neonBlue, 0.3);
        sidebarBg.strokeRoundedRect(sidebarX, this.layout.headerHeight, this.layout.sidebarWidth, this.scale.height - this.layout.headerHeight, 0);
        this.sidebarContainer.add(sidebarBg);
        
        // Character display card
        this.createCharacterCard(sidebarX + 20, this.layout.headerHeight + 20);
        
        // Quick actions
        this.createQuickActions(sidebarX + 20, this.layout.headerHeight + 200);
        
        // Progress summary
        this.createProgressSummary(sidebarX + 20, this.layout.headerHeight + 350);
    }

    createCharacterCard(x, y) {
        const character = this.progressTracker.getCharacter();
        const charType = this.progressTracker.getCharacterType();
        
        if (!character || !charType) return;
        
        // Get progress data
        const progress = this.progressTracker.getProgressSummary();
        
        // Enhanced card background with better styling
        const cardBg = this.add.graphics();
        cardBg.fillStyle(charType.baseColor, 0.15);
        cardBg.fillRoundedRect(x, y, 240, 200, 12);
        cardBg.lineStyle(2, charType.accentColor, 0.8);
        cardBg.strokeRoundedRect(x, y, 240, 200, 12);
        this.sidebarContainer.add(cardBg);
        
        // Inner glow effect
        const innerGlow = this.add.graphics();
        innerGlow.fillStyle(charType.accentColor, 0.1);
        innerGlow.fillRoundedRect(x + 4, y + 4, 232, 192, 8);
        this.sidebarContainer.add(innerGlow);
        
        // Robot sprite display (with fallback for missing textures)
        let robotSprite;
        try {
            // Try to create sprite with character texture
            const textureKey = `${charType.id}_idle`;
            if (this.textures.exists(textureKey)) {
                robotSprite = this.add.sprite(x + 120, y + 60, textureKey)
                    .setScale(2.5)
                    .setOrigin(0.5);
            } else {
                // Fallback: Create a styled robot representation using graphics
                robotSprite = this.createRobotGraphic(x + 120, y + 60, charType);
            }
        } catch (error) {
            console.warn('EducationalMenuScene: Could not load robot sprite, using fallback:', error);
            // Fallback: Create a styled robot representation using graphics
            robotSprite = this.createRobotGraphic(x + 120, y + 60, charType);
        }
        this.sidebarContainer.add(robotSprite);
        
        // Add upgrade indicators around the robot
        this.addUpgradeIndicators(x + 120, y + 60, charType);
        
        // Character name and type
        const nameText = this.add.text(x + 120, y + 110, character.name, {
            fontSize: '16px',
            fontFamily: 'Courier, monospace',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);
        this.sidebarContainer.add(nameText);
        
        const typeText = this.add.text(x + 120, y + 130, charType.name, {
            fontSize: '12px',
            fontFamily: 'Courier, monospace',
            fill: charType.accentColor,
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.sidebarContainer.add(typeText);
        
        // Level and experience
        const levelText = this.add.text(x + 120, y + 150, `Level ${progress.characterLevel}`, {
            fontSize: '14px',
            fontFamily: 'Courier, monospace',
            fill: '#ffd700',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.sidebarContainer.add(levelText);
        
        // Experience bar with better styling
        const expBarBg = this.add.graphics();
        expBarBg.fillStyle(0x374151);
        expBarBg.fillRoundedRect(x + 20, y + 170, 200, 10, 5);
        expBarBg.lineStyle(1, charType.accentColor, 0.5);
        expBarBg.strokeRoundedRect(x + 20, y + 170, 200, 10, 5);
        this.sidebarContainer.add(expBarBg);
        
        const expProgress = progress.expNeededForNextLevel > 0 ? 
            Math.min(progress.characterExperience / progress.expNeededForNextLevel, 1) : 0;
        const expBar = this.add.graphics();
        expBar.fillStyle(charType.accentColor);
        expBar.fillRoundedRect(x + 20, y + 170, 200 * expProgress, 10, 5);
        this.sidebarContainer.add(expBar);
        
        // Experience text
        const expText = this.add.text(x + 120, y + 185, 
            `${progress.characterExperience}/${progress.expNeededForNextLevel} XP`, {
            fontSize: '10px',
            fontFamily: 'Courier, monospace',
            fill: '#e5e7eb'
        }).setOrigin(0.5);
        this.sidebarContainer.add(expText);
        
        // Enhanced floating animation for robot
        this.tweens.add({
            targets: robotSprite,
            y: y + 55,
            duration: 2500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Subtle rotation animation
        this.tweens.add({
            targets: robotSprite,
            rotation: 0.1,
            duration: 4000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Store reference for updates
        this.characterCardElements = {
            robotSprite,
            expBar,
            expText,
            levelText
        };
    }
    
    addUpgradeIndicators(centerX, centerY, charType) {
        // Get equipped items from progress tracker
        const progress = this.progressTracker.getProgressSummary();
        const equippedItems = progress.equippedItems || {};
        
        // Define upgrade positions around the robot
        const upgradePositions = [
            { x: centerX - 40, y: centerY - 30, type: 'weapon', icon: '⚔️' },
            { x: centerX + 40, y: centerY - 30, type: 'shield', icon: '🛡️' },
            { x: centerX - 40, y: centerY + 30, type: 'power', icon: '⚡' },
            { x: centerX + 40, y: centerY + 30, type: 'tech', icon: '🔧' }
        ];
        
        upgradePositions.forEach(pos => {
            const hasUpgrade = equippedItems[pos.type] !== null && equippedItems[pos.type] !== undefined;
            
            if (hasUpgrade) {
                // Create upgrade indicator
                const upgradeBg = this.add.circle(pos.x, pos.y, 12, charType.accentColor, 0.8);
                upgradeBg.setStrokeStyle(2, charType.accentColor);
                this.sidebarContainer.add(upgradeBg);
                
                const upgradeIcon = this.add.text(pos.x, pos.y, pos.icon, {
                    fontSize: '16px'
                }).setOrigin(0.5);
                this.sidebarContainer.add(upgradeIcon);
                
                // Pulsing animation for upgrades
                this.tweens.add({
                    targets: [upgradeBg, upgradeIcon],
                    alpha: 0.6,
                    scale: 0.9,
                    duration: 1500,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
            }
        });
    }

    createQuickActions(x, y) {
        const actions = [
            { icon: '🔧', text: 'Robot Shop', color: this.uiColors.neonGreen, action: () => this.openShop() },
            { icon: '💰', text: 'Daily Coins', color: this.uiColors.neonYellow, action: () => this.claimDailyReward() },
            { icon: '📊', text: 'Progress', color: this.uiColors.neonPurple, action: () => this.showProgressDashboard() }
        ];
        
        actions.forEach((action, index) => {
            const buttonY = y + (index * 50);
            
            // Button background
            const buttonBg = this.add.graphics();
            buttonBg.fillStyle(action.color, 0.2);
            buttonBg.fillRoundedRect(x, buttonY, 240, 40, 8);
            buttonBg.lineStyle(1, action.color, 0.6);
            buttonBg.strokeRoundedRect(x, buttonY, 240, 40, 8);
            
            // Use safe interactive setup
            if (this.safeSetInteractive(buttonBg, null, { useHandCursor: true })) {
                this.sidebarContainer.add(buttonBg);
                
                // Button text
                const buttonText = this.add.text(x + 20, buttonY + 20, `${action.icon} ${action.text}`, {
                    fontSize: '14px',
                    fontFamily: 'Courier, monospace',
                    fill: '#ffffff',
                    fontStyle: 'bold'
                }).setOrigin(0, 0.5);
                this.sidebarContainer.add(buttonText);
                
                // Hover effects
                buttonBg.on('pointerover', () => {
                    buttonBg.clear();
                    buttonBg.fillStyle(action.color, 0.4);
                    buttonBg.fillRoundedRect(x, buttonY, 240, 40, 8);
                    buttonBg.lineStyle(2, action.color, 1);
                    buttonBg.strokeRoundedRect(x, buttonY, 240, 40, 8);
                });
                
                buttonBg.on('pointerout', () => {
                    buttonBg.clear();
                    buttonBg.fillStyle(action.color, 0.2);
                    buttonBg.fillRoundedRect(x, buttonY, 240, 40, 8);
                    buttonBg.lineStyle(1, action.color, 0.6);
                    buttonBg.strokeRoundedRect(x, buttonY, 240, 40, 8);
                });
                
                buttonBg.on('pointerdown', action.action);
            }
        });
    }

    createProgressSummary(x, y) {
        const progress = this.progressTracker.getProgressSummary();
        
        // Summary card background
        const summaryBg = this.add.graphics();
        summaryBg.fillStyle(this.uiColors.bgCard, 0.3);
        summaryBg.fillRoundedRect(x, y, 240, 120, 12);
        summaryBg.lineStyle(1, this.uiColors.info, 0.5);
        summaryBg.strokeRoundedRect(x, y, 240, 120, 12);
        this.sidebarContainer.add(summaryBg);
        
        // Title
        const titleText = this.add.text(x + 120, y + 20, 'PROGRESS SUMMARY', {
            fontSize: '12px',
            fontFamily: 'Courier, monospace',
            fill: this.uiColors.info,
            fontStyle: 'bold'
        }).setOrigin(0.5);
        this.sidebarContainer.add(titleText);
        
        // Stats
        const stats = [
            `Score: ${progress.totalScore}`,
            `Weeks: ${progress.weeksCompleted.length}/6`,
            `Accuracy: ${progress.overallAccuracy}%`
        ];
        
        stats.forEach((stat, index) => {
            const statText = this.add.text(x + 20, y + 45 + (index * 20), stat, {
                fontSize: '11px',
                fontFamily: 'Courier, monospace',
                fill: '#ffffff'
            });
            this.sidebarContainer.add(statText);
        });
    }

    createMainContent() {
        const contentX = this.layout.padding;
        const contentY = this.layout.headerHeight + this.layout.padding;
        const contentWidth = this.layout.sidebarWidth > 0 ? 
            this.scale.width - this.layout.sidebarWidth - (this.layout.padding * 2) : 
            this.scale.width - (this.layout.padding * 2);
        
        // Main content background
        const contentBg = this.add.graphics();
        contentBg.fillStyle(this.uiColors.bgCard, 0.1);
        contentBg.fillRoundedRect(contentX, contentY, contentWidth, this.scale.height - contentY - this.layout.padding, 16);
        this.contentContainer.add(contentBg);
        
        // Create week selection cards
        this.createWeekCards(contentX + 20, contentY + 20, contentWidth - 40);
    }

    createWeekCards(x, y, maxWidth) {
        const weeks = [
            { number: 1, title: "Math Battles", theme: "Number Games", color: this.uiColors.success, icon: "⚔️", difficulty: "Easy" },
            { number: 2, title: "Word Adventures", theme: "Language Fun", color: this.uiColors.warning, icon: "📚", difficulty: "Easy" },
            { number: 3, title: "Science Fun", theme: "Cool Experiments", color: this.uiColors.neonPurple, icon: "🔬", difficulty: "Medium" },
            { number: 4, title: "History Mystery", theme: "Time Detective", color: this.uiColors.error, icon: "🚀", difficulty: "Medium" },
            { number: 5, title: "Super Challenge", theme: "All Subjects", color: this.uiColors.info, icon: "👑", difficulty: "Hard" },
            { number: 6, title: "Final Game", theme: "Big Challenge", color: this.uiColors.accent, icon: "🎓", difficulty: "Expert" }
        ];
        
        // Calculate card layout
        const cardsPerRow = maxWidth > 800 ? 3 : (maxWidth > 500 ? 2 : 1);
        const cardWidth = (maxWidth - (this.layout.cardSpacing * (cardsPerRow - 1))) / cardsPerRow;
        const cardHeight = 140;
        
        weeks.forEach((week, index) => {
            const row = Math.floor(index / cardsPerRow);
            const col = index % cardsPerRow;
            const cardX = x + (col * (cardWidth + this.layout.cardSpacing));
            const cardY = y + (row * (cardHeight + this.layout.cardSpacing));
            
            this.createWeekCard(week, cardX, cardY, cardWidth, cardHeight);
        });
    }

    createWeekCard(week, x, y, width, height) {
        const isUnlocked = this.progressTracker.isWeekUnlocked(week.number);
        const isCompleted = this.progressTracker.progress.weeksCompleted.includes(week.number);
        
        // Card container
        const cardContainer = this.add.container(x, y);
        this.contentContainer.add(cardContainer);
        
        // Card background with glassmorphism
        const cardBg = this.add.graphics();
        const bgColor = isUnlocked ? week.color : this.uiColors.bgCard;
        const bgAlpha = isUnlocked ? 0.2 : 0.1;
        
        cardBg.fillStyle(bgColor, bgAlpha);
        cardBg.fillRoundedRect(0, 0, width, height, 12);
        cardBg.lineStyle(2, isUnlocked ? week.color : this.uiColors.textMuted, isUnlocked ? 0.6 : 0.3);
        cardBg.strokeRoundedRect(0, 0, width, height, 12);
        cardContainer.add(cardBg);
        
        // Status indicator
        let statusIcon = "🔒";
        let statusColor = this.uiColors.textMuted;
        if (isCompleted) {
            statusIcon = "✅";
            statusColor = this.uiColors.success;
        } else if (isUnlocked) {
            statusIcon = "🎮";
            statusColor = this.uiColors.warning;
        }
        
        const statusText = this.add.text(width - 15, 15, statusIcon, {
            fontSize: '20px'
        }).setOrigin(1, 0);
        cardContainer.add(statusText);
        
        // Week number and icon
        const weekNumber = this.add.text(20, 25, week.number.toString(), {
            fontSize: '24px',
            fontFamily: 'Courier, monospace',
            fill: isUnlocked ? '#ffffff' : '#64748b',
            fontStyle: 'bold'
        });
        cardContainer.add(weekNumber);
        
        const weekIcon = this.add.text(50, 25, week.icon, {
            fontSize: '24px'
        });
        cardContainer.add(weekIcon);
        
        // Week title
        const titleText = this.add.text(20, 55, week.title, {
            fontSize: '18px',
            fontFamily: 'Courier, monospace',
            fill: isUnlocked ? '#ffffff' : '#64748b',
            fontStyle: 'bold'
        });
        cardContainer.add(titleText);
        
        // Theme description
        const themeText = this.add.text(20, 75, week.theme, {
            fontSize: '12px',
            fontFamily: 'Courier, monospace',
            fill: isUnlocked ? '#e2e8f0' : '#64748b'
        });
        cardContainer.add(themeText);
        
        // Difficulty badge
        const difficultyBg = this.add.graphics();
        const difficultyColor = this.getDifficultyColor(week.difficulty);
        difficultyBg.fillStyle(difficultyColor, 0.3);
        difficultyBg.fillRoundedRect(20, 100, 80, 20, 10);
        difficultyBg.lineStyle(1, difficultyColor, 0.8);
        difficultyBg.strokeRoundedRect(20, 100, 80, 20, 10);
        cardContainer.add(difficultyBg);
        
        const difficultyText = this.add.text(60, 110, week.difficulty, {
            fontSize: '10px',
            fontFamily: 'Courier, monospace',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        cardContainer.add(difficultyText);
        
        // Play button (if unlocked)
        if (isUnlocked) {
            // Use Rectangle instead of Graphics for better interactive stability
            const playButton = this.add.rectangle(width - 50, height - 22, 60, 25, week.color, 0.8);
            playButton.setStrokeStyle(2, week.color, 1);
            
            // Use standard setInteractive instead of safeSetInteractive for Rectangle objects
            playButton.setInteractive({ useHandCursor: true });
            cardContainer.add(playButton);
            
            console.log(`Successfully set interactive for Week ${week.number} play button (Rectangle)`);
            
            const playText = this.add.text(width - 50, height - 22, 'PLAY', {
                fontSize: '12px',
                fontFamily: 'Courier, monospace',
                fill: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            cardContainer.add(playText);
            
            // Simplified hover effects that don't require redrawing
            playButton.on('pointerover', () => {
                console.log(`Hovering over Week ${week.number} play button`);
                
                // Scale effect for card
                this.tweens.add({
                    targets: cardContainer,
                    scaleX: 1.02,
                    scaleY: 1.02,
                    duration: 200,
                    ease: 'Power2.easeOut'
                });
                
                // Change button appearance without redrawing
                playButton.setFillStyle(week.color, 1);
                playButton.setStrokeStyle(3, week.color, 1);
                
                // Scale button slightly
                this.tweens.add({
                    targets: playButton,
                    scaleX: 1.05,
                    scaleY: 1.05,
                    duration: 150,
                    ease: 'Power2.easeOut'
                });
                
                // Add glow effect using a separate graphics object
                if (!playButton.glowEffect) {
                    const glow = this.add.graphics();
                    glow.fillStyle(week.color, 0.3);
                    glow.fillRoundedRect(width - 85, height - 40, 70, 35, 15);
                    cardContainer.add(glow);
                    glow.setDepth(-1);
                    playButton.glowEffect = glow;
                }
            });
            
            playButton.on('pointerout', () => {
                // Reset card scale
                this.tweens.add({
                    targets: cardContainer,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 200,
                    ease: 'Power2.easeOut'
                });
                
                // Reset button appearance
                playButton.setFillStyle(week.color, 0.8);
                playButton.setStrokeStyle(2, week.color, 1);
                
                // Reset button scale
                this.tweens.add({
                    targets: playButton,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 150,
                    ease: 'Power2.easeOut'
                });
                
                // Remove glow effect
                if (playButton.glowEffect) {
                    playButton.glowEffect.destroy();
                    playButton.glowEffect = null;
                }
            });
            
            playButton.on('pointerdown', () => {
                console.log(`Starting Week ${week.number}: ${week.title}`);
                
                // Visual feedback for click
                this.tweens.add({
                    targets: playButton,
                    scaleX: 0.95,
                    scaleY: 0.95,
                    duration: 100,
                    yoyo: true,
                    ease: 'Power2.easeOut',
                    onComplete: () => {
                        // Start the week after animation
                        this.startWeek(week.number);
                    }
                });
            });
            
            // Make the entire card clickable for better UX
            if (this.safeSetInteractive(cardBg, null, { useHandCursor: true })) {
                console.log(`Successfully set interactive for Week ${week.number} card background`);
                
                cardBg.on('pointerover', () => {
                    cardBg.clear();
                    cardBg.fillStyle(week.color, 0.3);
                    cardBg.fillRoundedRect(0, 0, width, height, 12);
                    cardBg.lineStyle(2, week.color, 0.8);
                    cardBg.strokeRoundedRect(0, 0, width, height, 12);
                    
                    // Change cursor to pointer
                    this.input.setDefaultCursor('pointer');
                });
                
                cardBg.on('pointerout', () => {
                    cardBg.clear();
                    cardBg.fillStyle(week.color, 0.2);
                    cardBg.fillRoundedRect(0, 0, width, height, 12);
                    cardBg.lineStyle(2, week.color, 0.6);
                    cardBg.strokeRoundedRect(0, 0, width, height, 12);
                    
                    // Reset cursor
                    this.input.setDefaultCursor('default');
                });
                
                // Card click handler (alternative to play button)
                cardBg.on('pointerdown', () => {
                    console.log(`Card clicked for Week ${week.number}: ${week.title}`);
                    this.startWeek(week.number);
                });
            } else {
                console.warn('EducationalMenuScene: Failed to set interactive on card background for week', week.number);
            }
        }
        
        // Entrance animation
        cardContainer.setAlpha(0);
        cardContainer.setScale(0.8);
        this.tweens.add({
            targets: cardContainer,
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            duration: 600,
            delay: week.number * 100,
            ease: 'Back.easeOut'
        });
    }

    getDifficultyColor(difficulty) {
        switch (difficulty) {
            case 'Easy': return this.uiColors.success;
            case 'Medium': return this.uiColors.warning;
            case 'Hard': return this.uiColors.error;
            case 'Expert': return this.uiColors.neonPurple;
            default: return this.uiColors.info;
        }
    }

    createFloatingActions() {
        // Floating action button for daily reward
        const dailyReward = this.progressTracker.claimDailyReward();
        const hasReward = dailyReward !== null;
        
        if (hasReward) {
            const fabBg = this.add.circle(this.scale.width - 80, this.scale.height - 80, 30, this.uiColors.neonYellow, 0.9);
            fabBg.setStrokeStyle(2, this.uiColors.neonYellow);
            
            // Use safe interactive setup
            if (this.safeSetInteractive(fabBg, null, { useHandCursor: true })) {
                this.floatingContainer.add(fabBg);
                
                const fabIcon = this.add.text(this.scale.width - 80, this.scale.height - 80, '💰', {
                    fontSize: '24px'
                }).setOrigin(0.5);
                this.floatingContainer.add(fabIcon);
                
                // Pulsing animation
                this.tweens.add({
                    targets: [fabBg, fabIcon],
                    scaleX: 1.1,
                    scaleY: 1.1,
                    duration: 1000,
                    yoyo: true,
                    repeat: -1,
                    ease: 'Sine.easeInOut'
                });
                
                fabBg.on('pointerdown', () => {
                    this.claimDailyReward(dailyReward);
                    fabBg.destroy();
                    fabIcon.destroy();
                });
            }
        }
        
        // Help button
        const helpBg = this.add.circle(this.scale.width - 80, this.scale.height - 140, 25, this.uiColors.info, 0.8);
        helpBg.setStrokeStyle(2, this.uiColors.info);
        
        // Use safe interactive setup
        if (this.safeSetInteractive(helpBg, null, { useHandCursor: true })) {
            this.floatingContainer.add(helpBg);
            
            const helpIcon = this.add.text(this.scale.width - 80, this.scale.height - 140, '?', {
                fontSize: '20px',
                fontFamily: 'Courier, monospace',
                fill: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            this.floatingContainer.add(helpIcon);
            
            helpBg.on('pointerdown', () => {
                this.showHelpModal();
            });
        }
    }

    addAmbientEffects() {
        // Subtle screen glow effect
        const glowOverlay = this.add.graphics();
        glowOverlay.fillGradientStyle(
            this.uiColors.neonBlue, this.uiColors.neonBlue,
            0x000000, 0x000000,
            0.05, 0, 0, 0.05
        );
        glowOverlay.fillRect(0, 0, this.scale.width, this.scale.height);
        glowOverlay.setDepth(-60);
        
        // Animate glow
        this.tweens.add({
            targets: glowOverlay,
            alpha: 0.3,
            duration: 3000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    // Helper methods for actions
    openShop() {
        console.log('Opening Robot Shop...');
        
        // Store reference to this scene for updates
        this.registry.set('educationalMenuScene', this);
        
        this.cameras.main.fadeOut(500, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            this.scene.start('ShopScene');
        });
    }

    showHelpModal() {
        // Create help modal with modern design
        const modalBg = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.8)
            .setOrigin(0, 0)
            .setDepth(100);
        
        // Use safe interactive setup for modal background
        if (this.safeSetInteractive(modalBg, null)) {
            const modalPanel = this.add.graphics();
            modalPanel.fillStyle(this.uiColors.bgCard, 0.95);
            modalPanel.fillRoundedRect(this.scale.width / 2 - 300, this.scale.height / 2 - 200, 600, 400, 16);
            modalPanel.lineStyle(2, this.uiColors.neonBlue, 0.8);
            modalPanel.strokeRoundedRect(this.scale.width / 2 - 300, this.scale.height / 2 - 200, 600, 400, 16);
            modalPanel.setDepth(101);
            
            const helpTitle = this.add.text(this.scale.width / 2, this.scale.height / 2 - 150, 'HOW TO PLAY', {
                fontSize: '24px',
                fontFamily: 'Courier, monospace',
                fill: '#00ffff',
                fontStyle: 'bold'
            }).setOrigin(0.5).setDepth(102);
            
            const helpText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 50, 
                'Welcome to Cyber Academy!\n\n' +
                '🎮 Click on game cards to play\n' +
                '💰 Collect coins by playing games\n' +
                '🔧 Use coins to upgrade your robot\n' +
                '📊 Check your progress anytime\n' +
                '🏆 Complete all 6 games to win!\n\n' +
                'Have fun learning!', {
                fontSize: '16px',
                fontFamily: 'Courier, monospace',
                fill: '#ffffff',
                align: 'center',
                lineSpacing: 8
            }).setOrigin(0.5).setDepth(102);
            
            const closeBtn = this.add.rectangle(this.scale.width / 2, this.scale.height / 2 + 150, 120, 40, this.uiColors.error, 0.8)
                .setStrokeStyle(2, this.uiColors.error)
                .setDepth(103);
            
            // Use safe interactive setup for close button
            if (this.safeSetInteractive(closeBtn, null, { useHandCursor: true })) {
                const closeBtnText = this.add.text(this.scale.width / 2, this.scale.height / 2 + 150, 'CLOSE', {
                    fontSize: '16px',
                    fontFamily: 'Courier, monospace',
                    fill: '#ffffff',
                    fontStyle: 'bold'
                }).setOrigin(0.5).setDepth(103);
                
                closeBtn.on('pointerdown', () => {
                    modalBg.destroy();
                    modalPanel.destroy();
                    helpTitle.destroy();
                    helpText.destroy();
                    closeBtn.destroy();
                    closeBtnText.destroy();
                });
                
                modalBg.on('pointerdown', () => {
                    closeBtn.emit('pointerdown');
                });
            }
        }
    }

    claimDailyReward(reward) {
        // If reward is passed, use it; otherwise try to claim
        if (!reward) {
            reward = this.progressTracker.claimDailyReward();
            if (!reward) return; // No reward available
        }
        
        // Update coin display
        if (this.playerCoinsText) {
            this.playerCoinsText.setText(`💰 ${this.progressTracker.getCoinBalance()} Coins`);
        }
        
        // Modern reward notification with glassmorphism
        const notificationBg = this.add.graphics();
        notificationBg.fillStyle(this.uiColors.bgCard, 0.9);
        notificationBg.fillRoundedRect(this.scale.width / 2 - 200, this.scale.height / 2 - 100, 400, 200, 16);
        notificationBg.lineStyle(2, this.uiColors.neonYellow, 0.8);
        notificationBg.strokeRoundedRect(this.scale.width / 2 - 200, this.scale.height / 2 - 100, 400, 200, 16);
        notificationBg.setDepth(200);
        
        const rewardTitle = this.add.text(this.scale.width / 2, this.scale.height / 2 - 60, 
            '🎉 Daily Coins Claimed! 🎉', {
            fontSize: '24px',
            fontFamily: 'Courier, monospace',
            fill: '#ffd700',
            stroke: '#000000',
            strokeThickness: 2,
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(201);
        
        const rewardDetails = this.add.text(this.scale.width / 2, this.scale.height / 2 - 10, 
            `+${reward.coins} Robot Coins\n🔥 Streak: ${reward.streak} days${reward.isNewRecord ? '\n🏆 New Record!' : ''}`, {
            fontSize: '18px',
            fontFamily: 'Courier, monospace',
            fill: '#ffffff',
            align: 'center',
            lineSpacing: 8
        }).setOrigin(0.5).setDepth(201);
        
        const tipText = this.add.text(this.scale.width / 2, this.scale.height / 2 + 40, 
            '💡 Use coins to upgrade your robot!', {
            fontSize: '14px',
            fontFamily: 'Courier, monospace',
            fill: '#00ffff',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(201);
        
        // Sparkle effects
        for (let i = 0; i < 12; i++) {
            const sparkle = this.add.text(
                this.scale.width / 2 + Phaser.Math.Between(-150, 150),
                this.scale.height / 2 + Phaser.Math.Between(-80, 80),
                '✨', {
                fontSize: '20px'
            }).setDepth(202);
            
            this.tweens.add({
                targets: sparkle,
                alpha: 0,
                scale: 2,
                rotation: Math.PI * 2,
                duration: 2000,
                ease: 'Power2.easeOut',
                onComplete: () => sparkle.destroy()
            });
        }
        
        // Auto-dismiss notification
        this.tweens.add({
            targets: [notificationBg, rewardTitle, rewardDetails, tipText],
            alpha: 0,
            y: '-=100',
            duration: 3000,
            delay: 2000,
            onComplete: () => {
                notificationBg.destroy();
                rewardTitle.destroy();
                rewardDetails.destroy();
                tipText.destroy();
            }
        });
    }

    startWeek(weekNumber) {
        console.log(`EducationalMenuScene: Starting Week ${weekNumber}`);
        
        // Prevent multiple clicks
        if (this.isTransitioning) {
            console.log('Already transitioning, ignoring click');
            return;
        }
        this.isTransitioning = true;
        
        // Enhanced transition effect with loading indicator
        const transitionOverlay = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0)
            .setOrigin(0, 0)
            .setDepth(1000);
        
        // Loading text
        const loadingText = this.add.text(this.scale.width / 2, this.scale.height / 2, 
            `🚀 LOADING WEEK ${weekNumber}...`, {
            fontSize: '24px',
            fontFamily: 'Courier, monospace',
            fill: '#00ffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(1001).setAlpha(0);
        
        // Spinning loading indicator
        const loadingSpinner = this.add.text(this.scale.width / 2, this.scale.height / 2 + 50, '⚙️', {
            fontSize: '32px'
        }).setOrigin(0.5).setDepth(1001).setAlpha(0);
        
        this.tweens.add({
            targets: transitionOverlay,
            alpha: 1,
            duration: 600,
            ease: 'Power2.easeInOut',
            onComplete: () => {
                // Show loading text
                this.tweens.add({
                    targets: [loadingText, loadingSpinner],
                    alpha: 1,
                    duration: 300
                });
                
                // Spin the loading indicator
                this.tweens.add({
                    targets: loadingSpinner,
                    rotation: Math.PI * 2,
                    duration: 1000,
                    repeat: -1,
                    ease: 'Linear'
                });
                
                // Delay before scene transition for better UX
                this.time.delayedCall(800, () => {
                    this.performSceneTransition(weekNumber);
                });
            }
        });
    }
    
    performSceneTransition(weekNumber) {
        console.log(`EducationalMenuScene: Performing transition to Week ${weekNumber}`);
        
        // Clean up any corrupted interactive objects before transition
        if (window.cleanupCorruptedInteractives) {
            window.cleanupCorruptedInteractives();
        }
        
        // Clean up this scene's interactive objects
        this.children.list.forEach(child => {
            if (child.input) {
                try {
                    child.removeAllListeners();
                } catch (error) {
                    console.warn('EducationalMenuScene: Error removing listeners during cleanup:', error.message);
                }
            }
        });
        
        // Fade out and transition
        this.cameras.main.fadeOut(800, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            switch (weekNumber) {
                case 1:
                    this.scene.start('Week1MathScene');
                    break;
                default:
                    console.warn(`Week ${weekNumber} not implemented yet`);
                    this.showComingSoonMessage(`Week ${weekNumber}`);
            }
        });
    }
    
    showComingSoonMessage(weekTitle) {
        // Reset transition flag
        this.isTransitioning = false;
        
        // Create coming soon modal
        const modalBg = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.8)
            .setOrigin(0, 0)
            .setDepth(1100);
        
        // Use safe interactive setup for modal background
        this.safeSetInteractive(modalBg);
        
        const modalPanel = this.add.graphics();
        modalPanel.fillStyle(this.uiColors.bgCard, 0.95);
        modalPanel.fillRoundedRect(this.scale.width / 2 - 300, this.scale.height / 2 - 150, 600, 300, 16);
        modalPanel.lineStyle(2, this.uiColors.warning, 0.8);
        modalPanel.strokeRoundedRect(this.scale.width / 2 - 300, this.scale.height / 2 - 150, 600, 300, 16);
        modalPanel.setDepth(1101);
        
        const comingSoonTitle = this.add.text(this.scale.width / 2, this.scale.height / 2 - 80, 
            '🚧 COMING SOON! 🚧', {
            fontSize: '28px',
            fontFamily: 'Courier, monospace',
            fill: '#fbbf24',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(1102);
        
        const weekInfo = this.add.text(this.scale.width / 2, this.scale.height / 2 - 20, 
            `${weekTitle}\n\nThis exciting adventure is still under development!\nFor now, try Week 1: Math Battles to start your journey.`, {
            fontSize: '16px',
            fontFamily: 'Courier, monospace',
            fill: '#ffffff',
            align: 'center',
            lineSpacing: 8
        }).setOrigin(0.5).setDepth(1102);
        
        const closeBtn = this.add.graphics();
        closeBtn.fillStyle(this.uiColors.primary, 0.8);
        closeBtn.fillRoundedRect(this.scale.width / 2 - 60, this.scale.height / 2 + 80, 120, 40, 12);
        closeBtn.lineStyle(2, this.uiColors.primary);
        closeBtn.strokeRoundedRect(this.scale.width / 2 - 60, this.scale.height / 2 + 80, 120, 40, 12);
        
        // Use relative coordinates for hit area (0,0 origin) instead of absolute screen coordinates
        // Use safe interactive setup without custom hit area to let Phaser auto-detect
        if (this.safeSetInteractive(closeBtn, null, { useHandCursor: true })) {
            closeBtn.setDepth(1102);
            
            const closeBtnText = this.add.text(this.scale.width / 2, this.scale.height / 2 + 100, 'OK', {
                fontSize: '16px',
                fontFamily: 'Courier, monospace',
                fill: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5).setDepth(1103);
            
            // Close button interactions
            closeBtn.on('pointerdown', () => {
                modalBg.destroy();
                modalPanel.destroy();
                comingSoonTitle.destroy();
                weekInfo.destroy();
                closeBtn.destroy();
                closeBtnText.destroy();
            });
            
            modalBg.on('pointerdown', () => {
                closeBtn.emit('pointerdown');
            });
        } else {
            console.warn('EducationalMenuScene: Failed to set interactive on close button in coming soon modal');
        }
        
        // Entrance animation
        modalPanel.setAlpha(0);
        modalPanel.setScale(0.8);
        this.tweens.add({
            targets: modalPanel,
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            duration: 400,
            ease: 'Back.easeOut'
        });
    }
    
    showErrorMessage(message) {
        // Reset transition flag
        this.isTransitioning = false;
        
        console.error('EducationalMenuScene Error:', message);
        
        // Show error modal (similar to coming soon but with error styling)
        const modalBg = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.8)
            .setOrigin(0, 0)
            .setDepth(1100);
        
        // Use safe interactive setup for error modal background
        this.safeSetInteractive(modalBg);
        
        const modalPanel = this.add.graphics();
        modalPanel.fillStyle(this.uiColors.bgCard, 0.95);
        modalPanel.fillRoundedRect(this.scale.width / 2 - 250, this.scale.height / 2 - 100, 500, 200, 16);
        modalPanel.lineStyle(2, this.uiColors.error, 0.8);
        modalPanel.strokeRoundedRect(this.scale.width / 2 - 250, this.scale.height / 2 - 100, 500, 200, 16);
        modalPanel.setDepth(1101);
        
        const errorTitle = this.add.text(this.scale.width / 2, this.scale.height / 2 - 50, 
            '⚠️ ERROR', {
            fontSize: '24px',
            fontFamily: 'Courier, monospace',
            fill: '#ef4444',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(1102);
        
        const errorText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 10, 
            message, {
            fontSize: '16px',
            fontFamily: 'Courier, monospace',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5).setDepth(1102);
        
        const closeBtn = this.add.graphics();
        closeBtn.fillStyle(this.uiColors.error, 0.8);
        closeBtn.fillRoundedRect(this.scale.width / 2 - 60, this.scale.height / 2 + 40, 120, 40, 12);
        
        // Use safe interactive setup without custom hit area to let Phaser auto-detect
        if (this.safeSetInteractive(closeBtn, null, { useHandCursor: true })) {
            closeBtn.setDepth(1102);
            
            const closeBtnText = this.add.text(this.scale.width / 2, this.scale.height / 2 + 60, 'CLOSE', {
                fontSize: '16px',
                fontFamily: 'Courier, monospace',
                fill: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5).setDepth(1103);
            
            closeBtn.on('pointerdown', () => {
                modalBg.destroy();
                modalPanel.destroy();
                errorTitle.destroy();
                errorText.destroy();
                closeBtn.destroy();
                closeBtnText.destroy();
            });
            
            modalBg.on('pointerdown', () => {
                closeBtn.emit('pointerdown');
            });
        } else {
            console.warn('EducationalMenuScene: Failed to set interactive on close button in error modal');
        }
    }

    showProgressDashboard() {
        const progress = this.progressTracker.getProgressSummary();
        const charType = this.progressTracker.getCharacterType();
        
        // Create modern modal overlay
        const modalBg = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.8)
            .setOrigin(0, 0)
            .setDepth(100);

        // Use safe interactive setup for progress dashboard modal background
        this.safeSetInteractive(modalBg);

        const modalPanel = this.add.graphics();
        modalPanel.fillStyle(this.uiColors.bgCard, 0.95);
        modalPanel.fillRoundedRect(this.scale.width / 2 - 350, this.scale.height / 2 - 250, 700, 500, 16);
        modalPanel.lineStyle(2, charType ? charType.accentColor : this.uiColors.neonBlue, 0.8);
        modalPanel.strokeRoundedRect(this.scale.width / 2 - 350, this.scale.height / 2 - 250, 700, 500, 16);
        modalPanel.setDepth(101);

        // Progress dashboard content
        let yPos = this.scale.height / 2 - 200;
        
        const dashboardTitle = this.add.text(this.scale.width / 2, yPos, "📊 PROGRESS DASHBOARD", {
            fontSize: '28px',
            fontFamily: 'Courier, monospace',
            fill: '#ffffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5).setDepth(102);

        yPos += 50;
        if (charType) {
            const playerInfo = this.add.text(this.scale.width / 2, yPos, 
                `${charType.icon} ${progress.playerName} - Level ${progress.characterLevel} ${charType.name}`, {
                fontSize: '20px',
                fontFamily: 'Courier, monospace',
                fill: charType.accentColor,
                fontStyle: 'bold'
            }).setOrigin(0.5).setDepth(102);
            yPos += 30;

            // Experience bar
            const expProgress = progress.expNeededForNextLevel > 0 ? 
                Math.min(progress.characterExperience / progress.expNeededForNextLevel, 1) : 0;
            const expBarBg = this.add.graphics();
            expBarBg.fillStyle(0x374151);
            expBarBg.fillRoundedRect(this.scale.width / 2 - 150, yPos, 300, 12, 6);
            expBarBg.setDepth(102);
            
            const expBar = this.add.graphics();
            expBar.fillStyle(charType.accentColor);
            expBar.fillRoundedRect(this.scale.width / 2 - 150, yPos, 300 * expProgress, 12, 6);
            expBar.setDepth(103);
            
            const expText = this.add.text(this.scale.width / 2, yPos + 25, 
                `Experience: ${progress.characterExperience}/${progress.expNeededForNextLevel}`, {
                fontSize: '14px',
                fontFamily: 'Courier, monospace',
                fill: '#e5e7eb'
            }).setOrigin(0.5).setDepth(102);
            yPos += 50;
        }

        // Progress stats in a grid layout
        const stats = [
            { label: 'Total Score', value: progress.totalScore, icon: '🎯' },
            { label: 'Weeks Completed', value: `${progress.weeksCompleted.length}/6`, icon: '📚' },
            { label: 'Badges Earned', value: progress.badges, icon: '🏆' },
            { label: 'Coins Earned', value: progress.totalCoinsEarned, icon: '💰' },
            { label: 'Current Streak', value: `${progress.currentStreak} days`, icon: '🔥' },
            { label: 'Overall Accuracy', value: `${progress.overallAccuracy}%`, icon: '🎯' }
        ];

        // Create stats grid
        const statsPerRow = 2;
        const statWidth = 300;
        const statHeight = 40;
        const statSpacing = 20;

        stats.forEach((stat, index) => {
            const row = Math.floor(index / statsPerRow);
            const col = index % statsPerRow;
            const statX = this.scale.width / 2 - (statWidth + statSpacing) / 2 + col * (statWidth + statSpacing);
            const statY = yPos + row * (statHeight + statSpacing);

            // Stat background
            const statBg = this.add.graphics();
            statBg.fillStyle(this.uiColors.bgGlass, 0.3);
            statBg.fillRoundedRect(statX - statWidth/2, statY, statWidth, statHeight, 8);
            statBg.lineStyle(1, this.uiColors.neonBlue, 0.5);
            statBg.strokeRoundedRect(statX - statWidth/2, statY, statWidth, statHeight, 8);
            statBg.setDepth(102);

            // Stat text
            const statText = this.add.text(statX, statY + 20, 
                `${stat.icon} ${stat.label}: ${stat.value}`, {
                fontSize: '14px',
                fontFamily: 'Courier, monospace',
                fill: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5).setDepth(103);
        });

        yPos += Math.ceil(stats.length / statsPerRow) * (statHeight + statSpacing) + 30;

        // Subject accuracies
        const subjectTitle = this.add.text(this.scale.width / 2, yPos, "SUBJECT PERFORMANCE", {
            fontSize: '18px',
            fontFamily: 'Courier, monospace',
            fill: '#fbbf24',
            fontStyle: 'bold'
        }).setOrigin(0.5).setDepth(102);

        yPos += 30;
        const subjects = [
            { name: 'Math', key: 'math', icon: '🔢' },
            { name: 'Reading', key: 'reading', icon: '📖' },
            { name: 'Science', key: 'science', icon: '🔬' },
            { name: 'History', key: 'history', icon: '🏛️' }
        ];
        
        subjects.forEach((subject, index) => {
            const accuracy = progress.subjectAccuracies[subject.key] || 0;
            const subjectY = yPos + (index * 25);
            
            // Subject accuracy bar
            const accuracyBarBg = this.add.graphics();
            accuracyBarBg.fillStyle(0x374151);
            accuracyBarBg.fillRoundedRect(this.scale.width / 2 - 100, subjectY, 200, 16, 8);
            accuracyBarBg.setDepth(102);
            
            const accuracyBar = this.add.graphics();
            const accuracyColor = accuracy >= 80 ? this.uiColors.success : 
                                 accuracy >= 60 ? this.uiColors.warning : this.uiColors.error;
            accuracyBar.fillStyle(accuracyColor);
            accuracyBar.fillRoundedRect(this.scale.width / 2 - 100, subjectY, 200 * (accuracy / 100), 16, 8);
            accuracyBar.setDepth(103);
            
            const subjectText = this.add.text(this.scale.width / 2 - 120, subjectY + 8, 
                `${subject.icon} ${subject.name}`, {
                fontSize: '12px',
                fontFamily: 'Courier, monospace',
                fill: '#ffffff'
            }).setOrigin(1, 0.5).setDepth(103);
            
            const accuracyText = this.add.text(this.scale.width / 2 + 120, subjectY + 8, 
                `${accuracy}%`, {
                fontSize: '12px',
                fontFamily: 'Courier, monospace',
                fill: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0, 0.5).setDepth(103);
        });

        // Close button
        const closeBtn = this.add.graphics();
        closeBtn.fillStyle(this.uiColors.error, 0.8);
        closeBtn.fillRoundedRect(this.scale.width / 2 - 60, this.scale.height / 2 + 200, 120, 40, 12);
        closeBtn.lineStyle(2, this.uiColors.error);
        closeBtn.strokeRoundedRect(this.scale.width / 2 - 60, this.scale.height / 2 + 200, 120, 40, 12);
        closeBtn.setDepth(102);

        // Use safe interactive setup for close button
        if (this.safeSetInteractive(closeBtn, null, { useHandCursor: true })) {
            const closeBtnText = this.add.text(this.scale.width / 2, this.scale.height / 2 + 220, "CLOSE", {
                fontSize: '16px',
                fontFamily: 'Courier, monospace',
                fill: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5).setDepth(103);

            // Close button interactions
            closeBtn.on('pointerover', () => {
                closeBtn.clear();
                closeBtn.fillStyle(this.uiColors.error, 1);
                closeBtn.fillRoundedRect(this.scale.width / 2 - 60, this.scale.height / 2 + 200, 120, 40, 12);
                closeBtn.lineStyle(2, this.uiColors.error);
                closeBtn.strokeRoundedRect(this.scale.width / 2 - 60, this.scale.height / 2 + 200, 120, 40, 12);
            });
            
            closeBtn.on('pointerout', () => {
                closeBtn.clear();
                closeBtn.fillStyle(this.uiColors.error, 0.8);
                closeBtn.fillRoundedRect(this.scale.width / 2 - 60, this.scale.height / 2 + 200, 120, 40, 12);
                closeBtn.lineStyle(2, this.uiColors.error);
                closeBtn.strokeRoundedRect(this.scale.width / 2 - 60, this.scale.height / 2 + 200, 120, 40, 12);
            });
            
            closeBtn.on('pointerdown', () => {
                // Destroy all modal elements
                modalBg.destroy();
                modalPanel.destroy();
                dashboardTitle.destroy();
                closeBtnText.destroy();
                closeBtn.destroy();
                
                // Clean up other elements created in this method
                this.children.list.forEach(child => {
                    if (child.depth >= 102 && child.depth <= 103) {
                        child.destroy();
                    }
                });
            });

            // Close on overlay click
            modalBg.on('pointerdown', () => {
                closeBtn.emit('pointerdown');
            });
        }

        // Entrance animation
        modalPanel.setAlpha(0);
        modalPanel.setScale(0.8);
        this.tweens.add({
            targets: modalPanel,
            alpha: 1,
            scaleX: 1,
            scaleY: 1,
            duration: 400,
            ease: 'Back.easeOut'
        });
    }

    // Method to update character card when upgrades are purchased
    updateCharacterCard() {
        if (!this.characterCardElements) return;
        
        const progress = this.progressTracker.getProgressSummary();
        const charType = this.progressTracker.getCharacterType();
        
        // Add null checks to prevent errors
        if (!progress || !charType) {
            console.warn('EducationalMenuScene: Missing progress or character type data');
            return;
        }
        
        // Update level text
        if (this.characterCardElements.levelText) {
            this.characterCardElements.levelText.setText(`Level ${progress.characterLevel || 1}`);
        }
        
        // Update experience bar
        const expProgress = progress.expNeededForNextLevel > 0 ? 
            Math.min((progress.characterExperience || 0) / progress.expNeededForNextLevel, 1) : 0;
        
        if (this.characterCardElements.expBar) {
            this.characterCardElements.expBar.clear();
            this.characterCardElements.expBar.fillStyle(charType.accentColor);
            this.characterCardElements.expBar.fillRoundedRect(
                this.characterCardElements.expBar.x, 
                this.characterCardElements.expBar.y, 
                200 * expProgress, 10, 5
            );
        }
        
        // Update experience text
        if (this.characterCardElements.expText) {
            this.characterCardElements.expText.setText(
                `${progress.characterExperience || 0}/${progress.expNeededForNextLevel || 100} XP`
            );
        }
        
        // Update coin display in header
        if (this.playerCoinsText) {
            this.playerCoinsText.setText(`💰 ${this.progressTracker.getCoinBalance()} Coins`);
        }
        
        // Refresh upgrade indicators
        this.refreshUpgradeIndicators();
        
        // Visual feedback for update
        if (this.characterCardElements.robotSprite) {
            this.tweens.add({
                targets: this.characterCardElements.robotSprite,
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 200,
                yoyo: true,
                ease: 'Power2.easeOut'
            });
        }
    }
    
    refreshUpgradeIndicators() {
        // Remove existing upgrade indicators
        if (this.upgradeIndicators) {
            this.upgradeIndicators.forEach(indicator => {
                if (indicator.bg) indicator.bg.destroy();
                if (indicator.icon) indicator.icon.destroy();
            });
        }
        this.upgradeIndicators = [];
        
        // Re-add upgrade indicators with current equipment
        if (this.characterCardElements && this.characterCardElements.robotSprite) {
            const charType = this.progressTracker.getCharacterType();
            const robotSprite = this.characterCardElements.robotSprite;
            this.addUpgradeIndicators(robotSprite.x, robotSprite.y, charType);
        }
    }
    
    // Method called when returning from shop
    onReturnFromShop() {
        console.log('Returned from shop, updating character card...');
        this.updateCharacterCard();
        
        // Show purchase confirmation if items were bought
        const recentPurchases = this.registry.get('recentPurchases');
        if (recentPurchases && recentPurchases.length > 0) {
            this.showPurchaseConfirmation(recentPurchases);
            this.registry.set('recentPurchases', []); // Clear after showing
        }
    }
    
    showPurchaseConfirmation(purchases) {
        // Create purchase confirmation modal
        const modalBg = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.7)
            .setOrigin(0, 0)
            .setDepth(1200);
        
        // Use safe interactive setup for modal background
        if (this.safeSetInteractive(modalBg, null)) {
            const modalPanel = this.add.graphics();
            modalPanel.fillStyle(this.uiColors.bgCard, 0.95);
            modalPanel.fillRoundedRect(this.scale.width / 2 - 250, this.scale.height / 2 - 150, 500, 300, 16);
            modalPanel.lineStyle(2, this.uiColors.success, 0.8);
            modalPanel.strokeRoundedRect(this.scale.width / 2 - 250, this.scale.height / 2 - 150, 500, 300, 16);
            modalPanel.setDepth(1201);
            
            const successTitle = this.add.text(this.scale.width / 2, this.scale.height / 2 - 100, 
                '🎉 UPGRADES INSTALLED! 🎉', {
                fontSize: '24px',
                fontFamily: 'Courier, monospace',
                fill: '#10b981',
                fontStyle: 'bold',
                stroke: '#000000',
                strokeThickness: 2
            }).setOrigin(0.5).setDepth(1202);
            
            let purchaseText = 'Your robot has been enhanced with:\n\n';
            purchases.forEach(purchase => {
                purchaseText += `• ${purchase.name} (+${purchase.bonus} ${purchase.type})\n`;
            });
            purchaseText += '\nYour robot is now more powerful!';
            
            const purchaseInfo = this.add.text(this.scale.width / 2, this.scale.height / 2 - 20, 
                purchaseText, {
                fontSize: '14px',
                fontFamily: 'Courier, monospace',
                fill: '#ffffff',
                align: 'center',
                lineSpacing: 6
            }).setOrigin(0.5).setDepth(1202);
            
            const closeBtn = this.add.graphics();
            closeBtn.fillStyle(this.uiColors.success, 0.8);
            closeBtn.fillRoundedRect(this.scale.width / 2 - 60, this.scale.height / 2 + 100, 120, 40, 12);
            closeBtn.lineStyle(2, this.uiColors.success);
            closeBtn.strokeRoundedRect(this.scale.width / 2 - 60, this.scale.height / 2 + 100, 120, 40, 12);
            closeBtn.setDepth(1202);
            
            // Use safe interactive setup for close button
            if (this.safeSetInteractive(closeBtn, null, { useHandCursor: true })) {
                const closeBtnText = this.add.text(this.scale.width / 2, this.scale.height / 2 + 120, 'AWESOME!', {
                    fontSize: '14px',
                    fontFamily: 'Courier, monospace',
                    fill: '#ffffff',
                    fontStyle: 'bold'
                }).setOrigin(0.5).setDepth(1203);
                
                // Close button interactions
                closeBtn.on('pointerdown', () => {
                    modalBg.destroy();
                    modalPanel.destroy();
                    successTitle.destroy();
                    purchaseInfo.destroy();
                    closeBtn.destroy();
                    closeBtnText.destroy();
                });
                
                modalBg.on('pointerdown', () => {
                    closeBtn.emit('pointerdown');
                });
                
                // Auto-dismiss after 5 seconds
                this.time.delayedCall(5000, () => {
                    if (modalBg && modalBg.active) {
                        closeBtn.emit('pointerdown');
                    }
                });
            }
            
            // Sparkle effects
            for (let i = 0; i < 15; i++) {
                const sparkle = this.add.text(
                    this.scale.width / 2 + Phaser.Math.Between(-200, 200),
                    this.scale.height / 2 + Phaser.Math.Between(-120, 120),
                    '✨', {
                    fontSize: '16px'
                }).setDepth(1204);
                
                this.tweens.add({
                    targets: sparkle,
                    alpha: 0,
                    scale: 2,
                    rotation: Math.PI * 2,
                    duration: 2000,
                    ease: 'Power2.easeOut',
                    onComplete: () => sparkle.destroy()
                });
            }
            
            // Entrance animation
            modalPanel.setAlpha(0);
            modalPanel.setScale(0.8);
            this.tweens.add({
                targets: modalPanel,
                alpha: 1,
                scaleX: 1,
                scaleY: 1,
                duration: 400,
                ease: 'Back.easeOut'
            });
        }
    }

    // Update method for responsive layout changes
    updateLayout() {
        this.calculateLayout();
        // Could rebuild UI elements here if needed for true responsiveness
    }
    
    // Update method to prevent hitAreaCallback errors
    update() {
        // Preventive cleanup of corrupted Graphics objects
        if (this.children && this.children.list) {
            this.children.list.forEach(child => {
                if (child.type === 'Graphics' && child.input && 
                    child.input.hitAreaCallback && 
                    typeof child.input.hitAreaCallback !== 'function') {
                    try {
                        // Immediately disable corrupted Graphics input
                        child.input = null;
                    } catch (error) {
                        // Silent cleanup in update loop
                    }
                }
            });
        }
    }

    // Cleanup method
    destroy() {
        // Clean up containers
        if (this.contentContainer) this.contentContainer.destroy();
        if (this.headerContainer) this.headerContainer.destroy();
        if (this.sidebarContainer) this.sidebarContainer.destroy();
        if (this.floatingContainer) this.floatingContainer.destroy();
        
        super.destroy();
    }

    createRobotGraphic(x, y, charType) {
        // Create a container for the robot graphic
        const robotContainer = this.add.container(x, y);
        
        // Robot body (main chassis)
        const body = this.add.graphics();
        body.fillStyle(charType.baseColor, 0.8);
        body.fillRoundedRect(-20, -15, 40, 30, 8);
        body.lineStyle(2, charType.accentColor, 1);
        body.strokeRoundedRect(-20, -15, 40, 30, 8);
        robotContainer.add(body);
        
        // Robot head
        const head = this.add.graphics();
        head.fillStyle(charType.baseColor, 0.9);
        head.fillRoundedRect(-15, -35, 30, 20, 6);
        head.lineStyle(2, charType.accentColor, 1);
        head.strokeRoundedRect(-15, -35, 30, 20, 6);
        robotContainer.add(head);
        
        // Robot eyes (glowing)
        const leftEye = this.add.circle(-8, -25, 3, charType.accentColor, 1);
        const rightEye = this.add.circle(8, -25, 3, charType.accentColor, 1);
        robotContainer.add(leftEye);
        robotContainer.add(rightEye);
        
        // Robot arms
        const leftArm = this.add.graphics();
        leftArm.fillStyle(charType.baseColor, 0.7);
        leftArm.fillRoundedRect(-30, -10, 12, 20, 4);
        leftArm.lineStyle(1, charType.accentColor, 0.8);
        leftArm.strokeRoundedRect(-30, -10, 12, 20, 4);
        robotContainer.add(leftArm);
        
        const rightArm = this.add.graphics();
        rightArm.fillStyle(charType.baseColor, 0.7);
        rightArm.fillRoundedRect(18, -10, 12, 20, 4);
        rightArm.lineStyle(1, charType.accentColor, 0.8);
        rightArm.strokeRoundedRect(18, -10, 12, 20, 4);
        robotContainer.add(rightArm);
        
        // Robot legs
        const leftLeg = this.add.graphics();
        leftLeg.fillStyle(charType.baseColor, 0.7);
        leftLeg.fillRoundedRect(-15, 15, 10, 15, 3);
        leftLeg.lineStyle(1, charType.accentColor, 0.8);
        leftLeg.strokeRoundedRect(-15, 15, 10, 15, 3);
        robotContainer.add(leftLeg);
        
        const rightLeg = this.add.graphics();
        rightLeg.fillStyle(charType.baseColor, 0.7);
        rightLeg.fillRoundedRect(5, 15, 10, 15, 3);
        rightLeg.lineStyle(1, charType.accentColor, 0.8);
        rightLeg.strokeRoundedRect(5, 15, 10, 15, 3);
        robotContainer.add(rightLeg);
        
        // Character type indicator (icon in center)
        const typeIcon = this.add.text(0, -5, charType.icon, {
            fontSize: '24px'
        }).setOrigin(0.5);
        robotContainer.add(typeIcon);
        
        // Add subtle glow effect
        const glow = this.add.graphics();
        glow.fillStyle(charType.accentColor, 0.1);
        glow.fillCircle(0, 0, 35);
        robotContainer.add(glow);
        robotContainer.sendToBack(glow);
        
        // Add pulsing animation to eyes
        this.tweens.add({
            targets: [leftEye, rightEye],
            alpha: 0.5,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Add subtle glow animation
        this.tweens.add({
            targets: glow,
            alpha: 0.2,
            scale: 1.1,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        return robotContainer;
    }

    // Helper method to safely set interactive properties
    safeSetInteractive(gameObject, hitArea, options = {}) {
        try {
            // Ensure the game object is valid and not destroyed
            if (!gameObject || !gameObject.scene || gameObject.scene !== this) {
                console.warn('EducationalMenuScene: Attempted to set interactive on invalid or destroyed object');
                return false;
            }
            
            // More thorough cleanup of existing interactive state
            if (gameObject.input) {
                // Remove all event listeners first
                gameObject.removeAllListeners();
                
                // Clear any corrupted hitAreaCallback
                if (gameObject.input.hitAreaCallback && typeof gameObject.input.hitAreaCallback !== 'function') {
                    console.warn('EducationalMenuScene: Detected corrupted hitAreaCallback, clearing it');
                    gameObject.input.hitAreaCallback = null;
                    gameObject.input.hitArea = null;
                }
                
                // Remove interactive state
                gameObject.removeInteractive();
            }
            
            // Apply interactive state immediately (no delay to avoid timing issues)
            return this.applyInteractiveState(gameObject, hitArea, options);
            
        } catch (error) {
            console.error('EducationalMenuScene: Error in safeSetInteractive:', error);
            // Try to clean up the object if there was an error
            try {
                if (gameObject && gameObject.removeInteractive) {
                    gameObject.removeInteractive();
                }
            } catch (cleanupError) {
                console.warn('EducationalMenuScene: Could not clean up after setInteractive error:', cleanupError.message);
            }
            return false;
        }
    }
    
    // Helper method to apply interactive state
    applyInteractiveState(gameObject, hitArea, options) {
        try {
            // Validate the game object is still valid
            if (!gameObject || !gameObject.scene || gameObject.scene !== this) {
                console.warn('EducationalMenuScene: Game object became invalid during interactive setup');
                return false;
            }
            
            // Ensure we have valid options
            const safeOptions = {
                useHandCursor: true,
                ...options
            };
            
            // Set interactive with proper error handling
            if (hitArea) {
                // If a custom hit area is provided, ensure we have a proper callback
                if (hitArea instanceof Phaser.Geom.Rectangle) {
                    gameObject.setInteractive(hitArea, Phaser.Geom.Rectangle.Contains, safeOptions);
                } else if (hitArea instanceof Phaser.Geom.Circle) {
                    gameObject.setInteractive(hitArea, Phaser.Geom.Circle.Contains, safeOptions);
                } else if (hitArea instanceof Phaser.Geom.Polygon) {
                    gameObject.setInteractive(hitArea, Phaser.Geom.Polygon.Contains, safeOptions);
                } else {
                    // For other shapes or invalid hit areas, use auto-detection
                    console.warn('EducationalMenuScene: Unknown hit area type, using auto-detection');
                    gameObject.setInteractive(safeOptions);
                }
            } else {
                // Use auto-detection - safest approach for Graphics objects
                gameObject.setInteractive(safeOptions);
            }
            
            // Validate that the interactive setup was successful
            if (gameObject.input) {
                if (gameObject.input.hitAreaCallback && typeof gameObject.input.hitAreaCallback !== 'function') {
                    console.warn('EducationalMenuScene: Interactive setup resulted in corrupted hitAreaCallback, removing interactive');
                    gameObject.removeInteractive();
                    return false;
                }
                
                // Additional validation for Graphics objects
                if (gameObject.type === 'Graphics' && gameObject.input.hitArea) {
                    // For Graphics objects, ensure the hit area is properly set
                    if (!gameObject.input.hitArea || typeof gameObject.input.hitArea !== 'object') {
                        console.warn('EducationalMenuScene: Graphics object has invalid hit area, removing interactive');
                        gameObject.removeInteractive();
                        return false;
                    }
                }
            }
            
            return true;
        } catch (error) {
            console.error('EducationalMenuScene: Error applying interactive state:', error);
            // Clean up on error
            try {
                if (gameObject && gameObject.removeInteractive) {
                    gameObject.removeInteractive();
                }
            } catch (cleanupError) {
                console.warn('EducationalMenuScene: Could not clean up after interactive error:', cleanupError.message);
            }
            return false;
        }
    }
}