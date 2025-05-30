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
        graphics.fillPoints ? graphics.fillPoints(points, true) : graphics.strokePoints(points, true);
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
            `Week: ${progress.weeksCompleted.length}/6`,
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
            { number: 1, title: "Math Combat Arena", theme: "Epic Robot Battles", color: this.uiColors.success, icon: "⚔️", difficulty: "Easy", status: "✅ Full Combat" },
            { number: 2, title: "Reading Combat Arena", theme: "Cyber Battle Challenges", color: this.uiColors.warning, icon: "📚", difficulty: "Easy", status: "✅ Full Combat" },
            { number: 3, title: "Science Combat Lab", theme: "Experimental Battles", color: this.uiColors.neonPurple, icon: "🔬", difficulty: "Medium", status: "🔄 Combat Ready" },
            { number: 4, title: "History Battle Arena", theme: "Time War Missions", color: this.uiColors.error, icon: "🚀", difficulty: "Medium", status: "⏳ Combat Planned" },
            { number: 5, title: "Multi-Subject Combat", theme: "Ultimate Challenge", color: this.uiColors.info, icon: "👑", difficulty: "Hard", status: "⏳ Boss Battles" },
            { number: 6, title: "Final Robot War", theme: "Legendary Battle", color: this.uiColors.accent, icon: "🎓", difficulty: "Expert", status: "⏳ Epic Finale" }
        ];
        
        // Calculate card layout
        const cardsPerRow = maxWidth > 800 ? 3 : (maxWidth > 500 ? 2 : 1);
        const cardWidth = (maxWidth - (this.layout.cardSpacing * (cardsPerRow - 1))) / cardsPerRow;
        const cardHeight = 160; // Increased height for combat status
        
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
        
        // Combat status badge (new feature)
        if (week.status) {
            const statusBg = this.add.graphics();
            let statusBgColor = this.uiColors.success;
            if (week.status.includes('⏳')) statusBgColor = this.uiColors.warning;
            if (week.status.includes('🔄')) statusBgColor = this.uiColors.info;
            
            statusBg.fillStyle(statusBgColor, 0.3);
            statusBg.fillRoundedRect(110, 100, width - 130, 20, 10);
            statusBg.lineStyle(1, statusBgColor, 0.8);
            statusBg.strokeRoundedRect(110, 100, width - 130, 20, 10);
            cardContainer.add(statusBg);
            
            const statusDisplayText = this.add.text(110 + (width - 130) / 2, 110, week.status, {
                fontSize: '9px',
                fontFamily: 'Courier, monospace',
                fill: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            cardContainer.add(statusDisplayText);
        }
        
        // Make the entire card clickable if unlocked
        if (isUnlocked) {
            console.log(`Setting up interactive for Week ${week.number}: ${week.title}`);
            
            // Create invisible clickable area that covers the entire card
            const clickArea = this.add.rectangle(width/2, height/2, width, height, 0x000000, 0);
            clickArea.setInteractive({ useHandCursor: true });
            cardContainer.add(clickArea);
            
            // Add visual feedback on hover
            clickArea.on('pointerover', () => {
                console.log(`Hovering over Week ${week.number}`);
                
                // Highlight the card
                cardBg.clear();
                cardBg.fillStyle(week.color, 0.4);
                cardBg.fillRoundedRect(0, 0, width, height, 12);
                cardBg.lineStyle(3, week.color, 1);
                cardBg.strokeRoundedRect(0, 0, width, height, 12);
                
                // Scale effect
                this.tweens.add({
                    targets: cardContainer,
                    scaleX: 1.05,
                    scaleY: 1.05,
                    duration: 200,
                    ease: 'Power2.easeOut'
                });
            });
            
            clickArea.on('pointerout', () => {
                // Reset card appearance
                cardBg.clear();
                cardBg.fillStyle(bgColor, bgAlpha);
                cardBg.fillRoundedRect(0, 0, width, height, 12);
                cardBg.lineStyle(2, week.color, 0.6);
                cardBg.strokeRoundedRect(0, 0, width, height, 12);
                
                // Reset scale
                this.tweens.add({
                    targets: cardContainer,
                    scaleX: 1,
                    scaleY: 1,
                    duration: 200,
                    ease: 'Power2.easeOut'
                });
            });
            
            clickArea.on('pointerdown', () => {
                console.log(`🎮 STARTING Week ${week.number}: ${week.title}`);
                
                // Prevent multiple clicks
                if (this.isTransitioning) {
                    console.log('Already transitioning, ignoring click');
                    return;
                }
                
                // Visual feedback for click
                this.tweens.add({
                    targets: cardContainer,
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
            
            // Add a "PLAY" button for extra clarity
            const playButton = this.add.rectangle(width - 50, height - 22, 60, 25, week.color, 0.9);
            playButton.setStrokeStyle(2, week.color, 1);
            cardContainer.add(playButton);
            
            const playText = this.add.text(width - 50, height - 22, 'PLAY', {
                fontSize: '12px',
                fontFamily: 'Courier, monospace',
                fill: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            cardContainer.add(playText);
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
        try {
            // Safety check for scene readiness
            if (!this.add || !this.scale || !this.uiColors) {
                console.warn('EducationalMenuScene: Cannot show help modal - scene not ready');
                return;
            }
            
            // Create help modal with modern design
            const modalBg = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.8)
                .setOrigin(0, 0)
                .setDepth(100);
            
            // Use safe interactive setup for modal background
            if (this.safeSetInteractive(modalBg, null)) {
                const modalPanel = this.add.graphics();
                modalPanel.fillStyle(this.uiColors.bgCard, 0.95);
                modalPanel.fillRoundedRect(this.scale.width / 2 - 350, this.scale.height / 2 - 250, 700, 500, 16);
                modalPanel.lineStyle(2, this.uiColors.neonBlue, 0.8);
                modalPanel.strokeRoundedRect(this.scale.width / 2 - 350, this.scale.height / 2 - 250, 700, 500, 16);
                modalPanel.setDepth(101);
                
                // Help title with cyber styling
                const helpTitle = this.add.text(this.scale.width / 2, this.scale.height / 2 - 200, '🤖 CYBER ACADEMY COMBAT GUIDE ⚔️', {
                    fontSize: '24px',
                    fontFamily: 'Courier, monospace',
                    fill: '#00ffff',
                    fontStyle: 'bold',
                    stroke: '#000000',
                    strokeThickness: 2
                }).setOrigin(0.5).setDepth(102);
                
                // Combat system explanation
                const helpContent = `🎮 UNIVERSAL COMBAT SYSTEM
    
    ⚔️ ROBOT BATTLES IN EVERY SUBJECT:
    • Math Combat Arena: Solve equations to power robot attacks
    • Reading Combat Arena: Answer questions to trigger epic battles
    • Science Combat Lab: Experiments fuel your robot's abilities
    • All subjects feature the same combat mechanics!
    
    🤖 CHARACTER PROGRESSION:
    • ARIA (Stealth): High speed and accuracy bonuses
    • TITAN (Tank): Maximum defense and attack power
    • NEXUS (Tech): Intelligence and energy optimization
    
    ⚡ EQUIPMENT EFFECTS:
    • Weapons: Increase attack power across ALL subjects
    • Shields: Boost defense in every combat scenario
    • Tech: Enhance accuracy and special abilities
    • Cores: Provide energy and intelligence bonuses
    
    🏆 PROGRESSION SYSTEM:
    • Gain XP from correct answers in any subject
    • Level up to unlock new equipment and abilities
    • Equipment purchases affect ALL learning areas
    • Character builds matter in every game mode
    
    🎯 COMBAT MECHANICS:
    • Correct answers = Your robot attacks enemies
    • Incorrect answers = Enemy robots attack you
    • Damage based on your character stats and equipment
    • Visual feedback with attack animations and effects
    
    💰 REWARDS & UPGRADES:
    • Earn coins from victories in any subject
    • Purchase equipment that works everywhere
    • Unlock new combat abilities and animations
    • Build the ultimate educational warrior robot!
    
    Press ESC or click CLOSE to return to the academy!`;
                
                const helpText = this.add.text(this.scale.width / 2, this.scale.height / 2 - 50, helpContent, {
                    fontSize: '12px',
                    fontFamily: 'Courier, monospace',
                    fill: '#ffffff',
                    align: 'left',
                    lineSpacing: 4,
                    wordWrap: { width: 650 },
                    stroke: '#000000',
                    strokeThickness: 1
                }).setOrigin(0.5).setDepth(102);
                
                // Close button with cyber styling
                const closeButton = this.add.rectangle(this.scale.width / 2, this.scale.height / 2 + 200, 200, 50, 0x000000, 0.8)
                    .setStrokeStyle(3, this.uiColors.neonGreen)
                    .setDepth(102);
                
                const closeText = this.add.text(this.scale.width / 2, this.scale.height / 2 + 200, '>> CLOSE GUIDE <<', {
                    fontSize: '16px',
                    fontFamily: 'Courier, monospace',
                    fill: '#00ff00',
                    fontStyle: 'bold'
                }).setOrigin(0.5).setDepth(103);
                
                // Safe interactive setup for close button
                if (this.safeSetInteractive(closeButton, null)) {
                    closeButton.on('pointerover', () => {
                        closeButton.setStrokeStyle(4, this.uiColors.neonYellow);
                        closeText.setFill('#ffff00');
                    });
                    
                    closeButton.on('pointerout', () => {
                        closeButton.setStrokeStyle(3, this.uiColors.neonGreen);
                        closeText.setFill('#00ff00');
                    });
                    
                    closeButton.on('pointerdown', () => {
                        // Clean up modal elements
                        [modalBg, modalPanel, helpTitle, helpText, closeButton, closeText].forEach(element => {
                            if (element && element.destroy) {
                                element.destroy();
                            }
                        });
                    });
                }
                
                // ESC key to close
                if (this.input && this.input.keyboard) {
                    const escKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.ESC);
                    const escHandler = () => {
                        [modalBg, modalPanel, helpTitle, helpText, closeButton, closeText].forEach(element => {
                            if (element && element.destroy) {
                                element.destroy();
                            }
                        });
                        escKey.off('down', escHandler);
                    };
                    escKey.on('down', escHandler);
                }
                
                // Entrance animation
                [modalBg, modalPanel, helpTitle, helpText, closeButton, closeText].forEach((element, index) => {
                    if (element) {
                        element.setAlpha(0);
                        this.tweens.add({
                            targets: element,
                            alpha: 1,
                            duration: 300,
                            delay: index * 50,
                            ease: 'Power2.easeOut'
                        });
                    }
                });
            }
        } catch (error) {
            console.error('EducationalMenuScene: Error showing help modal:', error);
            // Show simple alert as fallback
            if (window.alert) {
                window.alert('Help system temporarily unavailable. Please try again.');
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
                case 2:
                    this.scene.start('Week2ReadingScene');
                    break;
                case 3:
                    this.scene.start('Week3ScienceScene');
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

    /**
     * Creates a super detailed, animated robot graphic for each character type
     * This is the most advanced procedural robot generator ever created!
     */
    createRobotGraphic(x, y, charType) {
        try {
            // Safety checks
            if (!this.add || !charType) {
                console.warn('EducationalMenuScene: Cannot create robot graphic - scene not ready or invalid charType');
                return this.createSimpleRobotFallback(x, y, charType);
            }
            
            console.log(`Creating ultra-detailed robot graphic for ${charType.name} at (${x}, ${y})`);
            
            // Create main container for the robot
            const robotContainer = this.add.container(x, y);
            
            // Robot specifications based on character type
            const robotSpecs = this.getRobotSpecifications(charType);
            
            // Create robot components in layers with error handling
            try {
                this.createRobotShadow(robotContainer, robotSpecs);
                this.createRobotBase(robotContainer, robotSpecs);
                this.createRobotTorso(robotContainer, robotSpecs);
                this.createRobotArms(robotContainer, robotSpecs);
                this.createRobotHead(robotContainer, robotSpecs);
                this.createRobotDetails(robotContainer, robotSpecs);
                this.createRobotWeapons(robotContainer, robotSpecs);
                this.createRobotEffects(robotContainer, robotSpecs);
                this.createRobotAnimations(robotContainer, robotSpecs);
            } catch (componentError) {
                console.error('EducationalMenuScene: Error creating robot components:', componentError);
                // Continue with what we have
            }
            
            return robotContainer;
            
        } catch (error) {
            console.error('EducationalMenuScene: Error creating robot graphic:', error);
            return this.createSimpleRobotFallback(x, y, charType);
        }
    }

    /**
     * Create a simple fallback robot when advanced creation fails
     */
    createSimpleRobotFallback(x, y, charType) {
        try {
            if (!this.add) {
                console.error('EducationalMenuScene: Cannot create fallback robot - scene not ready');
                return null;
            }
            
            const container = this.add.container(x, y);
            const color = charType?.baseColor || 0x4A90E2;
            
            // Simple robot shape
            const body = this.add.graphics();
            body.fillStyle(color, 0.8);
            body.fillRoundedRect(-15, -20, 30, 40, 5);
            
            const head = this.add.graphics();
            head.fillStyle(color, 0.9);
            head.fillCircle(0, -30, 12);
            
            container.add([body, head]);
            
            // Simple animation
            this.tweens.add({
                targets: container,
                y: y - 5,
                duration: 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            return container;
            
        } catch (error) {
            console.error('EducationalMenuScene: Error creating fallback robot:', error);
            return null;
        }
    }

    /**
     * Get detailed specifications for each robot type
     */
    getRobotSpecifications(charType) {
        const baseSpecs = {
            scale: 1.0,
            primaryColor: charType.baseColor,
            accentColor: charType.accentColor,
            glowColor: charType.accentColor,
            size: { width: 60, height: 80 }
        };

        switch (charType.id) {
            case 'aria':
                return {
                    ...baseSpecs,
                    type: 'stealth',
                    primaryColor: 0x3b82f6,
                    accentColor: 0x00ffff,
                    glowColor: 0x00ffff,
                    features: {
                        sleek: true,
                        angular: true,
                        transparent: true,
                        dataStreams: true,
                        holographicDisplay: true,
                        neuralInterface: true
                    },
                    weapons: ['neural_disruptor', 'data_lance'],
                    specialEffects: ['digital_particles', 'code_streams', 'hologram_flicker']
                };
                
            case 'titan':
                return {
                    ...baseSpecs,
                    type: 'heavy',
                    primaryColor: 0xef4444,
                    accentColor: 0xffa500,
                    glowColor: 0xff6600,
                    size: { width: 70, height: 90 },
                    features: {
                        bulky: true,
                        armored: true,
                        mechanical: true,
                        steamVents: true,
                        heavyPlating: true,
                        powerCore: true
                    },
                    weapons: ['plasma_cannon', 'missile_pods'],
                    specialEffects: ['steam_vents', 'power_surges', 'armor_glow']
                };
                
            case 'nexus':
                return {
                    ...baseSpecs,
                    type: 'tech',
                    primaryColor: 0x10b981,
                    accentColor: 0xfbbf24,
                    glowColor: 0x00ff88,
                    features: {
                        modular: true,
                        crystalline: true,
                        energyBased: true,
                        quantumCore: true,
                        techInterface: true,
                        adaptiveArmor: true
                    },
                    weapons: ['quantum_beam', 'tech_drones'],
                    specialEffects: ['quantum_particles', 'energy_waves', 'crystal_resonance']
                };
                
            default:
                return baseSpecs;
        }
    }

    /**
     * Create dynamic shadow with depth
     */
    createRobotShadow(container, specs) {
        const shadow = this.add.graphics();
        shadow.fillStyle(0x000000, 0.3);
        shadow.fillEllipse(0, 45, specs.size.width * 0.8, 15);
        
        // Add shadow blur effect
        shadow.setBlendMode(Phaser.BlendModes.MULTIPLY);
        container.add(shadow);
        
        // Animate shadow breathing
        this.tweens.add({
            targets: shadow,
            scaleX: 1.1,
            alpha: 0.2,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    /**
     * Create the robot's base/legs with character-specific design
     */
    createRobotBase(container, specs) {
        const base = this.add.graphics();
        
        if (specs.features?.bulky) {
            // TITAN - Heavy tank treads
            base.fillStyle(specs.primaryColor, 0.9);
            base.fillRoundedRect(-25, 25, 50, 20, 5);
            
            // Tread details
            base.fillStyle(specs.accentColor, 0.8);
            for (let i = -20; i <= 20; i += 8) {
                base.fillRect(i, 28, 4, 14);
            }
            
            // Hydraulic supports
            base.lineStyle(4, specs.accentColor, 0.9);
            base.beginPath();
            base.moveTo(-15, 25);
            base.lineTo(-10, 10);
            base.moveTo(15, 25);
            base.lineTo(10, 10);
            base.strokePath();
            
        } else if (specs.features?.sleek) {
            // ARIA - Hovering base with energy field
            base.fillStyle(specs.primaryColor, 0.7);
            base.fillEllipse(0, 35, 40, 12);
            
            // Energy field rings
            base.lineStyle(2, specs.glowColor, 0.6);
            for (let i = 0; i < 3; i++) {
                base.strokeEllipse(0, 35, 45 + i * 5, 15 + i * 2);
            }
            
            // Hover particles
            this.createHoverParticles(container, specs);
            
        } else if (specs.features?.modular) {
            // NEXUS - Crystalline legs with tech interfaces
            base.fillStyle(specs.primaryColor, 0.8);
            
            // Hexagonal leg segments
            for (let side = -1; side <= 1; side += 2) {
                const legX = side * 15;
                this.drawHexagon(base, legX, 30, 8);
                this.drawHexagon(base, legX, 40, 6);
                
                // Tech connectors
                base.lineStyle(2, specs.accentColor, 0.9);
                base.beginPath();
                base.moveTo(legX, 22);
                base.lineTo(legX, 48);
                base.strokePath();
            }
            
            // Central power distribution
            base.fillStyle(specs.glowColor, 0.6);
            base.fillCircle(0, 35, 5);
        }
        
        container.add(base);
        
        // Add base glow effect
        const baseGlow = this.add.graphics();
        baseGlow.lineStyle(3, specs.glowColor, 0.4);
        baseGlow.strokeEllipse(0, 35, specs.size.width * 0.7, 20);
        baseGlow.setBlendMode(Phaser.BlendModes.ADD);
        container.add(baseGlow);
        
        // Animate base glow
        this.tweens.add({
            targets: baseGlow,
            alpha: 0.2,
            scaleX: 1.2,
            scaleY: 1.2,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    /**
     * Create the robot's torso with advanced detailing
     */
    createRobotTorso(container, specs) {
        const torso = this.add.graphics();
        
        if (specs.features?.bulky) {
            // TITAN - Heavy armored torso
            torso.fillStyle(specs.primaryColor, 0.95);
            torso.fillRoundedRect(-20, -10, 40, 35, 8);
            
            // Armor plating
            torso.fillStyle(specs.accentColor, 0.8);
            torso.fillRoundedRect(-18, -8, 36, 8, 4);
            torso.fillRoundedRect(-18, 5, 36, 8, 4);
            torso.fillRoundedRect(-18, 18, 36, 5, 2);
            
            // Power core
            torso.fillStyle(specs.glowColor, 0.9);
            torso.fillCircle(0, 5, 6);
            
            // Ventilation grilles
            torso.lineStyle(2, specs.accentColor, 0.7);
            for (let i = -15; i <= 15; i += 5) {
                torso.beginPath();
                torso.moveTo(i, -5);
                torso.lineTo(i, 20);
                torso.strokePath();
            }
            
        } else if (specs.features?.sleek) {
            // ARIA - Sleek, angular torso with data streams
            torso.fillStyle(specs.primaryColor, 0.8);
            
            // Angular torso shape
            const torsoPath = [
                -15, -10,
                15, -10,
                20, 0,
                15, 25,
                -15, 25,
                -20, 0
            ];
            torso.fillPoints(torsoPath, true);
            
            // Data stream channels
            torso.lineStyle(2, specs.glowColor, 0.8);
            for (let i = 0; i < 4; i++) {
                const y = -5 + i * 8;
                torso.beginPath();
                torso.moveTo(-12, y);
                torso.lineTo(12, y);
                torso.strokePath();
            }
            
            // Neural interface
            torso.fillStyle(specs.glowColor, 0.9);
            torso.fillCircle(0, 0, 4);
            
        } else if (specs.features?.modular) {
            // NEXUS - Crystalline modular torso
            torso.fillStyle(specs.primaryColor, 0.85);
            
            // Main crystal structure
            this.drawHexagon(torso, 0, 5, 18);
            
            // Smaller crystal modules
            this.drawHexagon(torso, -10, -5, 8);
            this.drawHexagon(torso, 10, -5, 8);
            this.drawHexagon(torso, 0, 20, 10);
            
            // Energy conduits
            torso.lineStyle(3, specs.accentColor, 0.9);
            torso.beginPath();
            torso.moveTo(-10, -5);
            torso.lineTo(0, 5);
            torso.lineTo(10, -5);
            torso.moveTo(0, 5);
            torso.lineTo(0, 20);
            torso.strokePath();
            
            // Quantum core
            torso.fillStyle(specs.glowColor, 1.0);
            torso.fillCircle(0, 5, 3);
        }
        
        container.add(torso);
        
        // Add torso details and effects
        this.createTorsoDetails(container, specs);
    }

    /**
     * Create detailed robot arms with weapons
     */
    createRobotArms(container, specs) {
        [-1, 1].forEach(side => {
            const arm = this.add.graphics();
            const armX = side * 25;
            
            if (specs.features?.bulky) {
                // TITAN - Heavy mechanical arms
                arm.fillStyle(specs.primaryColor, 0.9);
                arm.fillRoundedRect(armX - 4, -5, 8, 25, 4);
                
                // Shoulder joint
                arm.fillStyle(specs.accentColor, 0.9);
                arm.fillCircle(armX, -5, 6);
                
                // Hydraulic details
                arm.lineStyle(2, specs.accentColor, 0.8);
                arm.beginPath();
                arm.moveTo(armX - 2, 0);
                arm.lineTo(armX + 2, 0);
                arm.moveTo(armX - 2, 10);
                arm.lineTo(armX + 2, 10);
                arm.strokePath();
                
            } else if (specs.features?.sleek) {
                // ARIA - Sleek energy arms
                arm.fillStyle(specs.primaryColor, 0.7);
                
                // Angular arm segments
                const armPath = [
                    armX - 3, -5,
                    armX + 3, -5,
                    armX + 4, 5,
                    armX + 2, 20,
                    armX - 2, 20,
                    armX - 4, 5
                ];
                arm.fillPoints(armPath, true);
                
                // Energy conduits
                arm.lineStyle(2, specs.glowColor, 0.8);
                arm.beginPath();
                arm.moveTo(armX, -5);
                arm.lineTo(armX, 20);
                arm.strokePath();
                
            } else if (specs.features?.modular) {
                // NEXUS - Modular crystal arms
                arm.fillStyle(specs.primaryColor, 0.8);
                
                // Segmented crystal arm
                this.drawHexagon(arm, armX, -2, 5);
                this.drawHexagon(arm, armX, 8, 6);
                this.drawHexagon(arm, armX, 18, 4);
                
                // Tech connectors
                arm.lineStyle(2, specs.accentColor, 0.9);
                arm.beginPath();
                arm.moveTo(armX, 3);
                arm.lineTo(armX, 14);
                arm.strokePath();
            }
            
            container.add(arm);
            
            // Add arm animations
            this.tweens.add({
                targets: arm,
                rotation: side * 0.1,
                duration: 3000 + Math.random() * 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }

    /**
     * Create detailed robot head with character personality
     */
    createRobotHead(container, specs) {
        const head = this.add.graphics();
        
        if (specs.features?.bulky) {
            // TITAN - Heavy armored head
            head.fillStyle(specs.primaryColor, 0.95);
            head.fillRoundedRect(-12, -35, 24, 20, 6);
            
            // Visor
            head.fillStyle(specs.glowColor, 0.9);
            head.fillRoundedRect(-10, -32, 20, 6, 3);
            
            // Antenna array
            head.lineStyle(3, specs.accentColor, 0.9);
            head.beginPath();
            head.moveTo(-8, -35);
            head.lineTo(-8, -42);
            head.moveTo(8, -35);
            head.lineTo(8, -42);
            head.strokePath();
            
            // Status lights
            head.fillStyle(specs.accentColor, 1.0);
            head.fillCircle(-6, -28, 2);
            head.fillCircle(6, -28, 2);
            
        } else if (specs.features?.sleek) {
            // ARIA - Sleek angular head
            head.fillStyle(specs.primaryColor, 0.8);
            
            // Angular head shape
            const headPath = [
                -10, -35,
                10, -35,
                12, -25,
                8, -15,
                -8, -15,
                -12, -25
            ];
            head.fillPoints(headPath, true);
            
            // Holographic visor
            head.fillStyle(specs.glowColor, 0.7);
            head.fillPoints([
                -8, -32,
                8, -32,
                10, -26,
                6, -20,
                -6, -20,
                -10, -26
            ], true);
            
            // Data streams
            head.lineStyle(1, specs.glowColor, 0.8);
            for (let i = 0; i < 3; i++) {
                const y = -30 + i * 4;
                head.beginPath();
                head.moveTo(-6, y);
                head.lineTo(6, y);
                head.strokePath();
            }
            
        } else if (specs.features?.modular) {
            // NEXUS - Crystalline head
            head.fillStyle(specs.primaryColor, 0.85);
            
            // Main crystal head
            this.drawHexagon(head, 0, -25, 12);
            
            // Sensor array
            this.drawHexagon(head, -8, -30, 4);
            this.drawHexagon(head, 8, -30, 4);
            this.drawHexagon(head, 0, -35, 3);
            
            // Quantum interface
            head.fillStyle(specs.glowColor, 1.0);
            head.fillCircle(0, -25, 3);
        }
        
        container.add(head);
        
        // Add head effects
        this.createHeadEffects(container, specs);
    }

    /**
     * Create additional robot details and decorations
     */
    createRobotDetails(container, specs) {
        const details = this.add.graphics();
        
        // Character-specific details
        if (specs.features?.dataStreams) {
            // ARIA - Flowing data streams
            this.createDataStreams(container, specs);
        }
        
        if (specs.features?.steamVents) {
            // TITAN - Steam vents and heat effects
            this.createSteamVents(container, specs);
        }
        
        if (specs.features?.quantumCore) {
            // NEXUS - Quantum energy effects
            this.createQuantumEffects(container, specs);
        }
        
        // Universal details
        this.createStatusIndicators(container, specs);
        this.createEnergyReadouts(container, specs);
    }

    /**
     * Create character-specific weapons
     */
    createRobotWeapons(container, specs) {
        specs.weapons?.forEach((weapon, index) => {
            const weaponX = (index - 0.5) * 30;
            const weaponY = 15;
            
            switch (weapon) {
                case 'neural_disruptor':
                    this.createNeuralDisruptor(container, weaponX, weaponY, specs);
                    break;
                case 'plasma_cannon':
                    this.createPlasmaCannon(container, weaponX, weaponY, specs);
                    break;
                case 'quantum_beam':
                    this.createQuantumBeam(container, weaponX, weaponY, specs);
                    break;
            }
        });
    }

    /**
     * Create special effects for each robot type
     */
    createRobotEffects(container, specs) {
        specs.specialEffects?.forEach(effect => {
            switch (effect) {
                case 'digital_particles':
                    this.createDigitalParticles(container, specs);
                    break;
                case 'steam_vents':
                    this.createSteamVentEffects(container, specs);
                    break;
                case 'quantum_particles':
                    this.createQuantumParticleEffects(container, specs);
                    break;
            }
        });
    }

    /**
     * Create complex animations for the robot
     */
    createRobotAnimations(container, specs) {
        // Idle breathing animation
        this.tweens.add({
            targets: container,
            scaleY: 1.02,
            duration: 2500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Subtle rotation
        this.tweens.add({
            targets: container,
            rotation: 0.05,
            duration: 4000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Character-specific animations
        if (specs.features?.sleek) {
            // ARIA - Phase shifting effect
            this.tweens.add({
                targets: container,
                alpha: 0.8,
                duration: 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
        
        if (specs.features?.bulky) {
            // TITAN - Power surge effect
            this.time.addEvent({
                delay: 3000,
                callback: () => this.createPowerSurge(container, specs),
                loop: true
            });
        }
        
        if (specs.features?.modular) {
            // NEXUS - Crystal resonance
            this.createCrystalResonance(container, specs);
        }
    }

    // Helper methods for specific effects
    createHoverParticles(container, specs) {
        for (let i = 0; i < 8; i++) {
            const particle = this.add.graphics();
            particle.fillStyle(specs.glowColor, 0.6);
            particle.fillCircle(0, 0, 2);
            
            const angle = (i / 8) * Math.PI * 2;
            const radius = 25;
            particle.setPosition(Math.cos(angle) * radius, 35 + Math.sin(angle) * 5);
            
            container.add(particle);
            
            this.tweens.add({
                targets: particle,
                rotation: Math.PI * 2,
                duration: 4000,
                repeat: -1,
                ease: 'Linear'
            });
        }
    }

    createDataStreams(container, specs) {
        for (let i = 0; i < 5; i++) {
            const stream = this.add.graphics();
            stream.lineStyle(1, specs.glowColor, 0.7);
            
            const startY = -30 + i * 15;
            stream.beginPath();
            stream.moveTo(-15, startY);
            stream.lineTo(15, startY);
            stream.strokePath();
            
            container.add(stream);
            
            this.tweens.add({
                targets: stream,
                alpha: 0.3,
                duration: 800 + i * 200,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    createQuantumEffects(container, specs) {
        const quantumField = this.add.graphics();
        quantumField.lineStyle(2, specs.glowColor, 0.5);
        
        for (let i = 0; i < 6; i++) {
            const angle = (i / 6) * Math.PI * 2;
            const radius = 35;
            quantumField.strokeCircle(
                Math.cos(angle) * 10,
                Math.sin(angle) * 10,
                radius - i * 5
            );
        }
        
        container.add(quantumField);
        
        this.tweens.add({
            targets: quantumField,
            rotation: Math.PI * 2,
            duration: 8000,
            repeat: -1,
            ease: 'Linear'
        });
    }

    createPowerSurge(container, specs) {
        const surge = this.add.graphics();
        surge.lineStyle(4, specs.glowColor, 1.0);
        surge.strokeRect(-25, -35, 50, 70);
        surge.setBlendMode(Phaser.BlendModes.ADD);
        
        container.add(surge);
        
        this.tweens.add({
            targets: surge,
            alpha: 0,
            scaleX: 1.5,
            scaleY: 1.5,
            duration: 500,
            ease: 'Power2.easeOut',
            onComplete: () => surge.destroy()
        });
    }

    createCrystalResonance(container, specs) {
        this.time.addEvent({
            delay: 2000,
            callback: () => {
                const resonance = this.add.graphics();
                resonance.lineStyle(2, specs.glowColor, 0.8);
                
                for (let i = 0; i < 6; i++) {
                    this.drawHexagon(resonance, 0, 0, 20 + i * 8);
                }
                
                resonance.setBlendMode(Phaser.BlendModes.ADD);
                container.add(resonance);
                
                this.tweens.add({
                    targets: resonance,
                    alpha: 0,
                    scaleX: 2,
                    scaleY: 2,
                    duration: 1500,
                    ease: 'Power2.easeOut',
                    onComplete: () => resonance.destroy()
                });
            },
            loop: true
        });
    }

    // Additional helper methods for weapons and effects
    createNeuralDisruptor(container, x, y, specs) {
        const weapon = this.add.graphics();
        weapon.fillStyle(specs.accentColor, 0.9);
        weapon.fillRoundedRect(x - 3, y, 6, 15, 2);
        
        weapon.lineStyle(2, specs.glowColor, 0.8);
        weapon.beginPath();
        weapon.moveTo(x, y);
        weapon.lineTo(x, y + 15);
        weapon.strokePath();
        
        container.add(weapon);
    }

    createPlasmaCannon(container, x, y, specs) {
        const weapon = this.add.graphics();
        weapon.fillStyle(specs.primaryColor, 0.9);
        weapon.fillRoundedRect(x - 5, y, 10, 20, 3);
        
        weapon.fillStyle(specs.glowColor, 1.0);
        weapon.fillCircle(x, y + 18, 3);
        
        container.add(weapon);
    }

    createQuantumBeam(container, x, y, specs) {
        const weapon = this.add.graphics();
        weapon.fillStyle(specs.accentColor, 0.8);
        
        this.drawHexagon(weapon, x, y + 10, 8);
        
        weapon.lineStyle(2, specs.glowColor, 1.0);
        weapon.beginPath();
        weapon.moveTo(x, y);
        weapon.lineTo(x, y + 20);
        weapon.strokePath();
        
        container.add(weapon);
    }

    createStatusIndicators(container, specs) {
        const indicators = this.add.graphics();
        
        // Health indicator
        indicators.fillStyle(0x00ff00, 0.8);
        indicators.fillCircle(-20, -40, 2);
        
        // Energy indicator
        indicators.fillStyle(0x0088ff, 0.8);
        indicators.fillCircle(-15, -40, 2);
        
        // System status
        indicators.fillStyle(specs.glowColor, 0.8);
        indicators.fillCircle(-10, -40, 2);
        
        container.add(indicators);
        
        // Blinking animation
        this.tweens.add({
            targets: indicators,
            alpha: 0.4,
            duration: 1000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createEnergyReadouts(container, specs) {
        // Energy level bars
        for (let i = 0; i < 3; i++) {
            const bar = this.add.graphics();
            bar.fillStyle(specs.glowColor, 0.6);
            bar.fillRect(15, -35 + i * 4, 8, 2);
            
            container.add(bar);
            
            this.tweens.add({
                targets: bar,
                alpha: 0.3,
                duration: 500 + i * 200,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    createTorsoDetails(container, specs) {
        const details = this.add.graphics();
        
        // Add character-specific torso details
        if (specs.features?.holographicDisplay) {
            details.fillStyle(specs.glowColor, 0.5);
            details.fillRoundedRect(-8, -5, 16, 10, 2);
            
            // Holographic scan lines
            details.lineStyle(1, specs.glowColor, 0.7);
            for (let i = 0; i < 5; i++) {
                details.beginPath();
                details.moveTo(-6, -3 + i * 2);
                details.lineTo(6, -3 + i * 2);
                details.strokePath();
            }
        }
        
        container.add(details);
    }

    createHeadEffects(container, specs) {
        // Scanning beam effect
        const scanBeam = this.add.graphics();
        scanBeam.lineStyle(2, specs.glowColor, 0.8);
        scanBeam.beginPath();
        scanBeam.moveTo(-10, -28);
        scanBeam.lineTo(10, -28);
        scanBeam.strokePath();
        
        container.add(scanBeam);
        
        // Animate scanning
        this.tweens.add({
            targets: scanBeam,
            alpha: 0.3,
            duration: 1200,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createDigitalParticles(container, specs) {
        for (let i = 0; i < 12; i++) {
            const particle = this.add.graphics();
            particle.fillStyle(specs.glowColor, 0.7);
            particle.fillRect(0, 0, 2, 2);
            
            const angle = Math.random() * Math.PI * 2;
            const radius = 30 + Math.random() * 20;
            particle.setPosition(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius
            );
            
            container.add(particle);
            
            this.tweens.add({
                targets: particle,
                x: particle.x + (Math.random() - 0.5) * 40,
                y: particle.y + (Math.random() - 0.5) * 40,
                alpha: 0.2,
                duration: 2000 + Math.random() * 1000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    createSteamVentEffects(container, specs) {
        // Steam particles
        for (let i = 0; i < 6; i++) {
            const steam = this.add.graphics();
            steam.fillStyle(0xffffff, 0.4);
            steam.fillCircle(0, 0, 3);
            
            steam.setPosition(-15 + i * 6, 20);
            container.add(steam);
            
            this.tweens.add({
                targets: steam,
                y: steam.y - 30,
                alpha: 0,
                scaleX: 2,
                scaleY: 2,
                duration: 2000,
                repeat: -1,
                delay: i * 300,
                ease: 'Power2.easeOut'
            });
        }
    }

    createQuantumParticleEffects(container, specs) {
        for (let i = 0; i < 8; i++) {
            const particle = this.add.graphics();
            particle.fillStyle(specs.glowColor, 0.8);
            particle.fillCircle(0, 0, 1);
            
            const angle = (i / 8) * Math.PI * 2;
            const radius = 40;
            particle.setPosition(
                Math.cos(angle) * radius,
                Math.sin(angle) * radius
            );
            
            container.add(particle);
            
            this.tweens.add({
                targets: particle,
                rotation: Math.PI * 2,
                duration: 3000,
                repeat: -1,
                ease: 'Linear'
            });
            
            this.tweens.add({
                targets: particle,
                alpha: 0.3,
                scale: 2,
                duration: 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    /**
     * Create steam vents for TITAN robot
     */
    createSteamVents(container, specs) {
        // Steam vent positions on the robot
        const ventPositions = [
            { x: -15, y: 10 },
            { x: 15, y: 10 },
            { x: -10, y: -5 },
            { x: 10, y: -5 }
        ];

        ventPositions.forEach((pos, index) => {
            const vent = this.add.graphics();
            vent.fillStyle(specs.accentColor, 0.8);
            vent.fillCircle(pos.x, pos.y, 3);
            
            // Vent opening
            vent.fillStyle(0x000000, 0.6);
            vent.fillCircle(pos.x, pos.y, 2);
            
            container.add(vent);
            
            // Create steam particles periodically
            this.time.addEvent({
                delay: 1000 + index * 250,
                callback: () => this.createSteamParticle(container, pos.x, pos.y, specs),
                loop: true
            });
        });
    }

    /**
     * Create individual steam particle
     */
    createSteamParticle(container, x, y, specs) {
        const steam = this.add.graphics();
        steam.fillStyle(0xffffff, 0.6);
        steam.fillCircle(x, y, 2);
        
        container.add(steam);
        
        this.tweens.add({
            targets: steam,
            y: y - 25,
            alpha: 0,
            scaleX: 2,
            scaleY: 2,
            duration: 1500,
            ease: 'Power2.easeOut',
            onComplete: () => steam.destroy()
        });
    }
}