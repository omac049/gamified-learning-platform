import { Scene } from "phaser";
import { SaveManager } from "../utils/SaveManager.js";

export class IntroScene extends Scene {
    constructor() {
        super("IntroScene");
        this.saveManager = new SaveManager();
        
        // 80s Retro theme colors
        this.retroColors = {
            neonPink: 0xff00ff,
            neonBlue: 0x00ffff,
            neonGreen: 0x00ff00,
            neonYellow: 0xffff00,
            neonOrange: 0xff8000,
            darkPurple: 0x2d1b69,
            darkBlue: 0x0a0a1a,
            retroGold: 0xffd700
        };
        
        this.glitchEffects = [];
    }

    create() {
        console.log("IntroScene: Creating 80s retro gaming landing page");
        
        // Create retro synthwave background
        this.createRetroBackground();
        
        // Create animated grid floor
        this.createRetroGrid();
        
        // Create neon title with glitch effects
        this.createRetroTitle();
        
        // Create retro UI elements (removed robot showcase)
        this.createRetroUI();
        
        // Create particle effects
        this.createRetroParticles();
        
        // Create navigation with arcade styling
        this.createRetroNavigation();
        
        // Start entrance animation
        this.showRetroEntranceAnimation();
        
        // Check for existing save data
        this.checkExistingSaveData();
    }

    createRetroBackground() {
        // Synthwave gradient background
        const bg = this.add.graphics();
        
        // Main synthwave gradient (dark purple to dark blue)
        bg.fillGradientStyle(
            this.retroColors.darkPurple, this.retroColors.darkPurple,
            this.retroColors.darkBlue, this.retroColors.darkBlue,
            1
        );
        bg.fillRect(0, 0, this.scale.width, this.scale.height);
        
        // Neon horizon line
        const horizonY = this.scale.height * 0.7;
        bg.lineStyle(4, this.retroColors.neonPink, 0.8);
        bg.beginPath();
        bg.moveTo(0, horizonY);
        bg.lineTo(this.scale.width, horizonY);
        bg.strokePath();
        
        // Glowing horizon effect
        bg.lineStyle(8, this.retroColors.neonPink, 0.3);
        bg.beginPath();
        bg.moveTo(0, horizonY);
        bg.lineTo(this.scale.width, horizonY);
        bg.strokePath();
        
        // Animated neon stars
        for (let i = 0; i < 15; i++) {
            const x = Phaser.Math.Between(50, this.scale.width - 50);
            const y = Phaser.Math.Between(50, horizonY - 100);
            const star = this.add.text(x, y, '✦', {
                fontSize: '16px',
                fill: '#00ffff'
            }).setAlpha(0.7);
            
            this.tweens.add({
                targets: star,
                alpha: 0.3,
                scale: 1.5,
                duration: Phaser.Math.Between(2000, 4000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
    }

    createRetroGrid() {
        // Perspective grid floor (classic 80s synthwave)
        const gridGraphics = this.add.graphics();
        const gridStartY = this.scale.height * 0.7;
        const gridLines = 20;
        const gridSpacing = 30;
        
        // Vertical perspective lines
        for (let i = 0; i <= gridLines; i++) {
            const x = (this.scale.width / gridLines) * i;
            const alpha = i === 0 || i === gridLines ? 0.8 : 0.4;
            
            gridGraphics.lineStyle(2, this.retroColors.neonBlue, alpha);
            gridGraphics.beginPath();
            gridGraphics.moveTo(x, gridStartY);
            
            // Perspective effect - lines converge toward center
            const centerX = this.scale.width / 2;
            const perspectiveX = centerX + (x - centerX) * 0.3;
            gridGraphics.lineTo(perspectiveX, this.scale.height);
            gridGraphics.strokePath();
        }
        
        // Horizontal lines with perspective
        for (let i = 0; i < 8; i++) {
            const y = gridStartY + (i * gridSpacing);
            const scale = 1 - (i * 0.1); // Perspective scaling
            const alpha = 0.6 - (i * 0.05);
            
            gridGraphics.lineStyle(2, this.retroColors.neonBlue, alpha);
            gridGraphics.beginPath();
            
            const lineWidth = this.scale.width * scale;
            const startX = (this.scale.width - lineWidth) / 2;
            
            gridGraphics.moveTo(startX, y);
            gridGraphics.lineTo(startX + lineWidth, y);
            gridGraphics.strokePath();
        }
        
        // Animate grid with subtle movement
        this.tweens.add({
            targets: gridGraphics,
            y: -10,
            duration: 4000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createRetroTitle() {
        // Main neon title with 80s styling - moved higher for better spacing
        const titleY = 80;
        
        // Glitch background effect
        const glitchBg = this.add.rectangle(this.scale.width / 2, titleY, 800, 80, 0x000000, 0.3);
        
        // Main title with neon glow effect - reduced size for better spacing
        const mainTitle = this.add.text(this.scale.width / 2, titleY - 15, "CYBER BATTLE", {
            fontSize: '42px',
            fontFamily: 'Courier, monospace',
            fill: '#00ffff',
            stroke: '#ff00ff',
            strokeThickness: 3,
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Subtitle with retro styling
        const subtitle = this.add.text(this.scale.width / 2, titleY + 15, "ACADEMY 2085", {
            fontSize: '24px',
            fontFamily: 'Courier, monospace',
            fill: '#ffff00',
            stroke: '#ff8000',
            strokeThickness: 2,
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Neon glow animation
        this.tweens.add({
            targets: [mainTitle, subtitle],
            alpha: 0.7,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Glitch effect for title
        this.time.addEvent({
            delay: 3000,
            callback: () => this.createGlitchEffect(mainTitle),
            loop: true
        });
    }

    createRetroUI() {
        // System status display (top left for better balance)
        const statusX = 150;
        const statusY = 60;
        
        const statusPanel = this.add.rectangle(statusX, statusY, 260, 100, 0x000000, 0.7)
            .setStrokeStyle(2, this.retroColors.neonGreen);
        
        this.add.text(statusX, statusY - 35, "BATTLE SYSTEMS", {
            fontSize: '12px',
            fontFamily: 'Courier, monospace',
            fill: '#00ff00',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.add.text(statusX, statusY - 15, "NEURAL LINK: ACTIVE", {
            fontSize: '10px',
            fontFamily: 'Courier, monospace',
            fill: '#00ffff'
        }).setOrigin(0.5);
        
        this.add.text(statusX, statusY, "COMBAT PROTOCOLS: READY", {
            fontSize: '10px',
            fontFamily: 'Courier, monospace',
            fill: '#00ffff'
        }).setOrigin(0.5);
        
        this.add.text(statusX, statusY + 15, "FIGHTER SELECTION: PENDING", {
            fontSize: '10px',
            fontFamily: 'Courier, monospace',
            fill: '#ffff00'
        }).setOrigin(0.5);
        
        // Blinking cursor effect
        const cursor = this.add.text(statusX + 110, statusY + 15, "_", {
            fontSize: '10px',
            fontFamily: 'Courier, monospace',
            fill: '#00ff00'
        });
        
        this.tweens.add({
            targets: cursor,
            alpha: 0,
            duration: 500,
            yoyo: true,
            repeat: -1
        });
        
        // Mission timer display (top right)
        const timerX = this.scale.width - 150;
        const timerY = 60;
        
        const timerPanel = this.add.rectangle(timerX, timerY, 260, 100, 0x000000, 0.7)
            .setStrokeStyle(2, this.retroColors.neonPink);
        
        this.add.text(timerX, timerY - 35, "BATTLE TIMER", {
            fontSize: '12px',
            fontFamily: 'Courier, monospace',
            fill: '#ff00ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Create animated time display
        const timeDisplay = this.add.text(timerX, timerY - 10, "2085.12.25", {
            fontSize: '14px',
            fontFamily: 'Courier, monospace',
            fill: '#00ffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        const clockDisplay = this.add.text(timerX, timerY + 10, "00:00:00", {
            fontSize: '12px',
            fontFamily: 'Courier, monospace',
            fill: '#ffff00'
        }).setOrigin(0.5);
        
        this.add.text(timerX, timerY + 30, "CYBER TIME ACTIVE", {
            fontSize: '9px',
            fontFamily: 'Courier, monospace',
            fill: '#cccccc'
        }).setOrigin(0.5);
        
        // Animate the clock
        let seconds = 0;
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                seconds++;
                const hours = Math.floor(seconds / 3600).toString().padStart(2, '0');
                const mins = Math.floor((seconds % 3600) / 60).toString().padStart(2, '0');
                const secs = (seconds % 60).toString().padStart(2, '0');
                clockDisplay.setText(`${hours}:${mins}:${secs}`);
            },
            loop: true
        });
        
        // Add retro decorative elements
        this.createRetroDecorations();
    }

    createRetroDecorations() {
        // Corner decorative elements
        const corners = [
            { x: 50, y: 50 },
            { x: this.scale.width - 50, y: 50 },
            { x: 50, y: this.scale.height - 50 },
            { x: this.scale.width - 50, y: this.scale.height - 50 }
        ];
        
        corners.forEach((corner, index) => {
            // Retro corner brackets
            const bracket = this.add.text(corner.x, corner.y, '◢', {
                fontSize: '20px',
                fontFamily: 'Courier, monospace',
                fill: this.retroColors.neonYellow,
                alpha: 0.6
            }).setOrigin(0.5);
            
            // Rotate brackets for different corners
            bracket.setRotation((index * Math.PI) / 2);
            
            this.tweens.add({
                targets: bracket,
                alpha: 0.3,
                duration: 2000 + (index * 200),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
        
        // Side decorative lines
        const sideLines = [
            { x1: 0, y1: this.scale.height / 2, x2: 30, y2: this.scale.height / 2 },
            { x1: this.scale.width - 30, y1: this.scale.height / 2, x2: this.scale.width, y2: this.scale.height / 2 }
        ];
        
        sideLines.forEach((line, index) => {
            const graphics = this.add.graphics();
            graphics.lineStyle(3, this.retroColors.neonGreen, 0.6);
            graphics.beginPath();
            graphics.moveTo(line.x1, line.y1);
            graphics.lineTo(line.x2, line.y2);
            graphics.strokePath();
            
            this.tweens.add({
                targets: graphics,
                alpha: 0.3,
                duration: 1800 + (index * 300),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        });
    }

    createRetroParticles() {
        // Digital rain effect
        for (let i = 0; i < 20; i++) {
            const x = Phaser.Math.Between(0, this.scale.width);
            const chars = ['0', '1', '0', '1', '█', '▓', '▒', '░'];
            const char = Phaser.Utils.Array.GetRandom(chars);
            
            const particle = this.add.text(x, -20, char, {
                fontSize: '12px',
                fontFamily: 'Courier, monospace',
                fill: '#00ff00',
                alpha: 0.6
            });
            
            this.tweens.add({
                targets: particle,
                y: this.scale.height + 50,
                duration: Phaser.Math.Between(3000, 8000),
                repeat: -1,
                delay: Phaser.Math.Between(0, 5000),
                onRepeat: () => {
                    particle.x = Phaser.Math.Between(0, this.scale.width);
                    particle.setText(Phaser.Utils.Array.GetRandom(chars));
                }
            });
        }
    }

    createRetroNavigation() {
        const navY = this.scale.height - 80;
        
        // Navigation section header
        this.add.text(this.scale.width / 2, navY - 40, "BATTLE CONTROL", {
            fontSize: '16px',
            fontFamily: 'Courier, monospace',
            fill: '#ff00ff',
            fontStyle: 'bold',
            stroke: '#ffffff',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Button container for better spacing
        const buttonSpacing = 240;
        const startX = this.scale.width / 2 - (buttonSpacing / 2);
        
        // Instructions button with retro arcade styling
        const instructionsButton = this.add.rectangle(startX, navY, 200, 45, 0x000000, 0.8)
            .setStrokeStyle(3, this.retroColors.neonBlue)
            .setInteractive({ useHandCursor: true });
        
        const instructionsText = this.add.text(startX, navY, "HOW TO PLAY", {
            fontSize: '16px',
            fontFamily: 'Courier, monospace',
            fill: '#00ffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Instructions button glow effect
        const instructionsGlow = this.add.rectangle(startX, navY, 210, 55, this.retroColors.neonBlue, 0.1);
        
        // Start button with retro arcade styling
        const startButton = this.add.rectangle(startX + buttonSpacing, navY, 200, 45, 0x000000, 0.8)
            .setStrokeStyle(3, this.retroColors.neonPink)
            .setInteractive({ useHandCursor: true });
        
        const startText = this.add.text(startX + buttonSpacing, navY, ">> ENTER BATTLE <<", {
            fontSize: '14px',
            fontFamily: 'Courier, monospace',
            fill: '#ff00ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Start button glow effect
        const startGlow = this.add.rectangle(startX + buttonSpacing, navY, 210, 55, this.retroColors.neonPink, 0.1);
        
        // Instructions button animations
        instructionsButton.on('pointerover', () => {
            instructionsButton.setStrokeStyle(4, this.retroColors.neonYellow);
            instructionsText.setFill('#ffff00');
            instructionsGlow.setAlpha(0.2);
        });
        
        instructionsButton.on('pointerout', () => {
            instructionsButton.setStrokeStyle(3, this.retroColors.neonBlue);
            instructionsText.setFill('#00ffff');
            instructionsGlow.setAlpha(0.1);
        });
        
        instructionsButton.on('pointerdown', () => {
            this.showGameplayInstructions();
        });
        
        // Start button animations
        startButton.on('pointerover', () => {
            startButton.setStrokeStyle(4, this.retroColors.neonYellow);
            startText.setFill('#ffff00');
            startGlow.setAlpha(0.2);
        });
        
        startButton.on('pointerout', () => {
            startButton.setStrokeStyle(3, this.retroColors.neonPink);
            startText.setFill('#ff00ff');
            startGlow.setAlpha(0.1);
        });
        
        startButton.on('pointerdown', () => {
            this.startCyberMission();
        });
        
        // Pulsing animations for both buttons
        this.tweens.add({
            targets: [instructionsGlow, startGlow],
            alpha: 0.05,
            duration: 1500,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Instructions - positioned at very bottom
        this.add.text(this.scale.width / 2, navY + 35, "CLICK TO PLAY • HAVE FUN LEARNING", {
            fontSize: '9px',
            fontFamily: 'Courier, monospace',
            fill: '#cccccc'
        }).setOrigin(0.5);
    }

    createGlitchEffect(target) {
        // Digital glitch effect
        const originalX = target.x;
        const originalY = target.y;
        
        this.tweens.add({
            targets: target,
            x: originalX + Phaser.Math.Between(-5, 5),
            y: originalY + Phaser.Math.Between(-2, 2),
            duration: 50,
            yoyo: true,
            repeat: 3,
            onComplete: () => {
                target.x = originalX;
                target.y = originalY;
            }
        });
    }

    showRetroEntranceAnimation() {
        // Fade in with scanline effect
        const scanline = this.add.rectangle(0, 0, this.scale.width, 4, this.retroColors.neonBlue)
            .setOrigin(0, 0);
        
        this.tweens.add({
            targets: scanline,
            y: this.scale.height,
            duration: 1000,
            ease: 'Power2.easeOut',
            onComplete: () => {
                scanline.destroy();
            }
        });
        
        // Fade in all elements with stagger
        const elements = this.children.list.filter(child => 
            child !== scanline && child.alpha !== undefined
        );
        
        elements.forEach(element => element.setAlpha(0));
        
        this.tweens.add({
            targets: elements,
            alpha: 1,
            duration: 800,
            ease: 'Power2.easeOut',
            stagger: 30
        });
    }

    checkExistingSaveData() {
        const saveData = this.saveManager.loadData();
        if (saveData && saveData.character) {
            this.showReturningPlayerWelcome(saveData);
        } else {
            this.showNewPlayerWelcome();
        }
    }

    showReturningPlayerWelcome(saveInfo) {
        // Welcome back message with retro styling - positioned to avoid overlap
        const welcomeY = 180; // Moved higher to avoid robot showcase
        
        const welcomePanel = this.add.rectangle(this.scale.width / 2, welcomeY, 400, 60, 0x000000, 0.8)
            .setStrokeStyle(2, this.retroColors.neonGreen)
            .setDepth(1000); // High Z-order to appear above other elements
        
        const welcomeTitle = this.add.text(this.scale.width / 2, welcomeY - 15, "WELCOME BACK, CYBER WARRIOR", {
            fontSize: '14px',
            fontFamily: 'Courier, monospace',
            fill: '#00ff00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5).setDepth(1001);
        
        const agentText = this.add.text(this.scale.width / 2, welcomeY + 5, `FIGHTER: ${saveInfo.character.name.toUpperCase()}`, {
            fontSize: '12px',
            fontFamily: 'Courier, monospace',
            fill: '#00ffff',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5).setDepth(1001);
        
        // Auto-hide after 3 seconds
        this.time.delayedCall(3000, () => {
            this.tweens.add({
                targets: [welcomePanel, welcomeTitle, agentText],
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    welcomePanel.destroy();
                    welcomeTitle.destroy();
                    agentText.destroy();
                }
            });
        });
    }

    showNewPlayerWelcome() {
        // New player introduction with retro styling - positioned to avoid overlap
        const introY = 180; // Moved higher to avoid robot showcase
        
        const introPanel = this.add.rectangle(this.scale.width / 2, introY, 500, 60, 0x000000, 0.8)
            .setStrokeStyle(2, this.retroColors.neonBlue)
            .setDepth(1000); // High Z-order to appear above other elements
        
        const introTitle = this.add.text(this.scale.width / 2, introY - 15, "INITIALIZING BATTLE INTERFACE...", {
            fontSize: '14px',
            fontFamily: 'Courier, monospace',
            fill: '#00ffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5).setDepth(1001);
        
        const introSubtext = this.add.text(this.scale.width / 2, introY + 5, "SELECT YOUR FIGHTER TO BEGIN", {
            fontSize: '12px',
            fontFamily: 'Courier, monospace',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5).setDepth(1001);
        
        // Auto-hide after 4 seconds
        this.time.delayedCall(4000, () => {
            this.tweens.add({
                targets: [introPanel, introTitle, introSubtext],
                alpha: 0,
                duration: 500,
                onComplete: () => {
                    introPanel.destroy();
                    introTitle.destroy();
                    introSubtext.destroy();
                }
            });
        });
    }

    startCyberMission() {
        console.log("IntroScene: Starting cyber mission");
        
        // Check if player already has character data
        const saveData = this.saveManager.loadData();
        const hasExistingCharacter = saveData && saveData.character && saveData.character.name;
        
        // Transition to appropriate scene
        this.cameras.main.fadeOut(800, 0, 0, 0);
        this.cameras.main.once('camerafadeoutcomplete', () => {
            if (hasExistingCharacter) {
                console.log("IntroScene: Returning player detected, going to main menu");
                this.scene.start('EducationalMenuScene');
            } else {
                console.log("IntroScene: New player detected, going to character creation");
                this.scene.start('CharacterSelectScene');
            }
        });
    }

    showGameplayInstructions() {
        // Create instructions overlay
        const overlay = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.9)
            .setOrigin(0, 0);
        
        // Use safe interactive setup for overlay
        overlay.setInteractive({ useHandCursor: false });
        
        // Instructions panel
        const panelWidth = 700;
        const panelHeight = 500;
        const panel = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, panelWidth, panelHeight, 0x000000, 0.9)
            .setStrokeStyle(4, this.retroColors.neonGreen);
        
        // Panel glow effect
        const panelGlow = this.add.rectangle(this.scale.width / 2, this.scale.height / 2, panelWidth + 20, panelHeight + 20, this.retroColors.neonGreen, 0.1);
        
        // Instructions title
        this.add.text(this.scale.width / 2, this.scale.height / 2 - 220, "CYBER BATTLE ACADEMY", {
            fontSize: '24px',
            fontFamily: 'Courier, monospace',
            fill: '#00ff00',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        this.add.text(this.scale.width / 2, this.scale.height / 2 - 195, "HOW TO PLAY", {
            fontSize: '18px',
            fontFamily: 'Courier, monospace',
            fill: '#00ffff',
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);
        
        // Instructions content
        const instructionsText = `GOAL: Win 6 fun games!
        
GAME 1: MATH BATTLES
• Solve math problems to win fights!
• Beat the bad guys with numbers!
• Get coins when you win!

GAME 2: WORD ADVENTURES  
• Jump around and learn about words!
• Find letters and make words!
• Collect fun prizes!

GAME 3: SCIENCE FUN
• Build cool things!
• Learn how things work!
• Do fun experiments!

GAME 4: HISTORY MYSTERY
• Be a detective!
• Solve puzzles about the past!
• Find out what happened long ago!

GAME 5: SUPER CHALLENGE
• Play all kinds of games!
• Make your robot stronger!
• Learn lots of new things!

GAME 6: BIG FINAL GAME
• Use everything you learned!
• Beat the biggest challenge!
• Become a super smart hero!

HOW TO PLAY: Click with your mouse!
SAVING: Don't worry - we save your games!`;
        
        this.add.text(this.scale.width / 2, this.scale.height / 2 - 50, instructionsText, {
            fontSize: '12px',
            fontFamily: 'Courier, monospace',
            fill: '#ffffff',
            align: 'left',
            lineSpacing: 5,
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(0.5);
        
        // Close button
        const closeButton = this.add.rectangle(this.scale.width / 2, this.scale.height / 2 + 200, 150, 40, 0x000000, 0.8)
            .setStrokeStyle(3, this.retroColors.neonPink)
            .setInteractive({ useHandCursor: true });
        
        const closeText = this.add.text(this.scale.width / 2, this.scale.height / 2 + 200, ">> CLOSE <<", {
            fontSize: '14px',
            fontFamily: 'Courier, monospace',
            fill: '#ff00ff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Close button interactions
        closeButton.on('pointerover', () => {
            closeButton.setStrokeStyle(4, this.retroColors.neonYellow);
            closeText.setFill('#ffff00');
        });
        
        closeButton.on('pointerout', () => {
            closeButton.setStrokeStyle(3, this.retroColors.neonPink);
            closeText.setFill('#ff00ff');
        });
        
        closeButton.on('pointerdown', () => {
            // Remove all instruction elements
            overlay.destroy();
            panel.destroy();
            panelGlow.destroy();
            closeButton.destroy();
            closeText.destroy();
            // Remove all text elements created for instructions
            this.children.list.forEach(child => {
                if (child.type === 'Text' && child.text && 
                    (child.text.includes('CYBER BATTLE ACADEMY') || 
                     child.text.includes('HOW TO PLAY') ||
                     child.text.includes('GOAL:'))) {
                    child.destroy();
                }
            });
        });
        
        // Entrance animation for instructions
        const instructionElements = [overlay, panelGlow, panel, closeButton, closeText];
        instructionElements.forEach(element => element.setAlpha(0));
        
        this.tweens.add({
            targets: instructionElements,
            alpha: 1,
            duration: 500,
            ease: 'Power2.easeOut',
            stagger: 50
        });
    }
} 