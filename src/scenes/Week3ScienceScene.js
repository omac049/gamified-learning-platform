import { Scene } from "phaser";
import { QuestionManager } from "../utils/QuestionManager.js";
import { ProgressTracker } from "../utils/ProgressTracker.js";

export class Week3ScienceScene extends Scene {
    constructor() {
        super("Week3ScienceScene");
        this.questionManager = new QuestionManager();
        this.progressTracker = new ProgressTracker();
        
        // Game state
        this.score = 0;
        this.experimentsCompleted = 0;
        this.blocksCollected = 0;
        this.currentExperiment = null;
        this.isGameActive = true;
        this.player = null;
        this.blocks = null;
        this.experimentStations = null;
        this.coinsEarned = 0;
        this.equippedEffects = null;
        this.inventory = {
            dirt: 0,
            stone: 0,
            water: 0,
            fire: 0,
            plant: 0,
            crystal: 0
        };
    }

    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        
        // Get equipped item effects
        this.equippedEffects = this.progressTracker.getEquippedEffects();
    }

    create() {
        // Create the Minecraft-style science world
        this.createWorld();
        
        // Create player character
        this.createPlayer();
        
        // Create collectible blocks
        this.createBlocks();
        
        // Create experiment stations
        this.createExperimentStations();
        
        // Create UI
        this.createUI();
        
        // Set up physics and interactions
        this.setupPhysics();
        
        // Create controls
        this.createControls();
        
        // Show welcome message
        this.showWelcomeMessage();
    }

    createWorld() {
        // Sky background with gradient
        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x87CEEB)
            .setOrigin(0, 0);
        
        // Add clouds
        for (let i = 0; i < 6; i++) {
            const x = Phaser.Math.Between(0, this.scale.width);
            const y = Phaser.Math.Between(50, 150);
            this.createCloud(x, y);
        }
        
        // Ground layer (grass blocks)
        for (let x = 0; x < this.scale.width; x += 40) {
            this.add.rectangle(x + 20, this.scale.height - 20, 40, 40, 0x228B22)
                .setStrokeStyle(2, 0x000000);
        }
        
        // Underground layer (dirt blocks)
        for (let x = 0; x < this.scale.width; x += 40) {
            this.add.rectangle(x + 20, this.scale.height - 60, 40, 40, 0x8B4513)
                .setStrokeStyle(2, 0x000000);
        }
        
        // Title
        this.add.text(this.scale.width / 2, 50, "⛏️ SCIENCE QUEST & CRAFT ⛏️", {
            fontSize: '28px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Create decorative structures
        this.createStructures();
    }

    createCloud(x, y) {
        const cloud = this.add.ellipse(x, y, 60, 30, 0xffffff, 0.8);
        
        // Floating animation
        this.tweens.add({
            targets: cloud,
            x: x + 100,
            duration: Phaser.Math.Between(15000, 25000),
            repeat: -1,
            yoyo: true,
            ease: 'Sine.easeInOut'
        });
    }

    createStructures() {
        // Laboratory building
        const labX = 150;
        const labY = this.scale.height - 200;
        
        // Lab walls
        for (let i = 0; i < 4; i++) {
            for (let j = 0; j < 3; j++) {
                this.add.rectangle(labX + (i * 40), labY + (j * 40), 40, 40, 0x696969)
                    .setStrokeStyle(2, 0x000000);
            }
        }
        
        // Lab sign
        this.add.text(labX + 60, labY - 20, "🔬 LAB", {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Greenhouse
        const greenhouseX = 700;
        const greenhouseY = this.scale.height - 180;
        
        // Greenhouse structure
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 2; j++) {
                this.add.rectangle(greenhouseX + (i * 40), greenhouseY + (j * 40), 40, 40, 0x90EE90, 0.7)
                    .setStrokeStyle(2, 0x228B22);
            }
        }
        
        // Greenhouse sign
        this.add.text(greenhouseX + 40, greenhouseY - 20, "🌱 GREENHOUSE", {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
    }

    createPlayer() {
        // Get character color from cosmetics
        let playerColor = 0x4169E1; // Default blue
        const equippedCosmetic = this.progressTracker.progress.equippedItems.cosmetic;
        
        switch(equippedCosmetic) {
            case 'redCharacter': playerColor = 0xef4444; break;
            case 'blueCharacter': playerColor = 0x3b82f6; break;
            case 'greenCharacter': playerColor = 0x10b981; break;
        }
        
        // Minecraft-style character (blocky)
        this.player = this.add.rectangle(100, this.scale.height - 120, 25, 35, playerColor);
        this.player.setStrokeStyle(2, 0x000000);
        
        // Add physics body
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);
        this.player.body.setBounce(0.2);
        
        // Player properties with equipped effects
        this.player.speed = 150 * (this.equippedEffects.speedMultiplier || 1);
        
        // Player label
        this.add.text(this.player.x, this.player.y - 25, "SCIENTIST", {
            fontSize: '10px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
    }

    createBlocks() {
        this.blocks = this.physics.add.group();
        
        // Define block types and their properties
        const blockTypes = [
            { type: 'dirt', color: 0x8B4513, icon: '🟫', x: 300, y: 300 },
            { type: 'stone', color: 0x696969, icon: '🪨', x: 450, y: 250 },
            { type: 'water', color: 0x0000FF, icon: '💧', x: 600, y: 350 },
            { type: 'fire', color: 0xFF4500, icon: '🔥', x: 200, y: 200 },
            { type: 'plant', color: 0x228B22, icon: '🌿', x: 750, y: 280 },
            { type: 'crystal', color: 0x9370DB, icon: '💎', x: 500, y: 180 }
        ];
        
        blockTypes.forEach(blockData => {
            // Create physics body using a graphics object instead of null sprite
            const block = this.physics.add.existing(this.add.rectangle(blockData.x, blockData.y, 30, 30, blockData.color));
            block.setStrokeStyle(2, 0x000000);
            block.body.setSize(30, 30);
            
            // Add block icon
            const blockIcon = this.add.text(blockData.x, blockData.y, blockData.icon, {
                fontSize: '16px'
            }).setOrigin(0.5);
            
            // Store references
            block.icon = blockIcon;
            block.blockType = blockData.type;
            
            // Add floating animation
            this.tweens.add({
                targets: [block, blockIcon],
                y: blockData.y - 10,
                duration: 2000,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            this.blocks.add(block);
        });
    }

    createExperimentStations() {
        this.experimentStations = this.physics.add.group();
        
        // Define experiment stations
        const stations = [
            { 
                x: 150, 
                y: this.scale.height - 160, 
                type: 'chemistry', 
                icon: '⚗️',
                color: 0x9370DB,
                title: 'Chemistry Lab'
            },
            { 
                x: 700, 
                y: this.scale.height - 140, 
                type: 'biology', 
                icon: '🔬',
                color: 0x228B22,
                title: 'Biology Station'
            },
            { 
                x: 400, 
                y: this.scale.height - 180, 
                type: 'physics', 
                icon: '⚡',
                color: 0xFFD700,
                title: 'Physics Lab'
            },
            { 
                x: 550, 
                y: this.scale.height - 160, 
                type: 'astronomy', 
                icon: '🌟',
                color: 0x4169E1,
                title: 'Observatory'
            }
        ];
        
        stations.forEach(stationData => {
            // Create physics body using a graphics object instead of null sprite
            const station = this.physics.add.existing(this.add.circle(stationData.x, stationData.y, 25, stationData.color));
            station.setStrokeStyle(3, 0xffffff);
            station.body.setCircle(25);
            
            // Add station icon
            const stationIcon = this.add.text(stationData.x, stationData.y, stationData.icon, {
                fontSize: '20px'
            }).setOrigin(0.5);
            
            // Add station label
            const stationLabel = this.add.text(stationData.x, stationData.y + 40, stationData.title, {
                fontSize: '12px',
                fontFamily: 'Arial, sans-serif',
                fill: '#ffffff',
                stroke: '#000000',
                strokeThickness: 1
            }).setOrigin(0.5);
            
            // Store references
            station.icon = stationIcon;
            station.label = stationLabel;
            station.stationType = stationData.type;
            station.title = stationData.title;
            
            // Add pulsing animation
            this.tweens.add({
                targets: [station, stationIcon],
                scaleX: 1.1,
                scaleY: 1.1,
                duration: 1500,
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
            
            this.experimentStations.add(station);
        });
    }

    createUI() {
        // Coin balance (top right)
        this.coinBalanceText = this.add.text(this.scale.width - 20, 20, 
            `🪙 ${this.progressTracker.getCoinBalance()}`, {
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffd700',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(1, 0);

        // Score display (below coins)
        this.scoreText = this.add.text(this.scale.width - 20, 50, `Score: ${this.score}`, {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(1, 0);

        // Session coins earned
        this.sessionCoinsText = this.add.text(this.scale.width - 20, 75, 
            `Session: +${this.coinsEarned} 🪙`, {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            fill: '#10b981',
            stroke: '#000000',
            strokeThickness: 1
        }).setOrigin(1, 0);
        
        // Experiments completed
        this.experimentsText = this.add.text(20, 80, `Experiments: ${this.experimentsCompleted}/4`, {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        });
        
        // Blocks collected
        this.blocksText = this.add.text(20, 110, `Blocks: ${this.blocksCollected}/6`, {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        });

        // Inventory display
        this.inventoryText = this.add.text(20, 140, this.getInventoryDisplay(), {
            fontSize: '12px',
            fontFamily: 'Arial, sans-serif',
            fill: '#fbbf24',
            stroke: '#000000',
            strokeThickness: 1
        });

        // Active power-up indicator
        this.powerUpText = this.add.text(20, 200, '', {
            fontSize: '12px',
            fontFamily: 'Arial, sans-serif',
            fill: '#fbbf24',
            stroke: '#000000',
            strokeThickness: 1
        });

        this.updatePowerUpDisplay();
        
        // Instructions
        this.add.text(this.scale.width / 2, this.scale.height - 20, 
            "Arrow Keys: Move | Collect blocks and visit experiment stations to learn science! Earn coins for discoveries!", {
            fontSize: '12px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 1,
            align: 'center'
        }).setOrigin(0.5);
    }

    getInventoryDisplay() {
        let display = "Inventory: ";
        Object.entries(this.inventory).forEach(([type, count]) => {
            if (count > 0) {
                const icons = {
                    dirt: '🟫', stone: '🪨', water: '💧', 
                    fire: '🔥', plant: '🌿', crystal: '💎'
                };
                display += `${icons[type]}${count} `;
            }
        });
        return display;
    }

    updatePowerUpDisplay() {
        const activePowerUp = this.progressTracker.progress.equippedItems.powerUp;
        if (activePowerUp) {
            let powerUpText = '';
            switch(activePowerUp) {
                case 'extraTime': powerUpText = '⏰ Extra Time Active'; break;
                case 'shield': powerUpText = '🛡️ Shield Active'; break;
                case 'doubleCoins': powerUpText = '💰 Double Coins Active'; break;
                case 'slowMotion': powerUpText = '🐌 Slow Motion Active'; break;
            }
            this.powerUpText.setText(powerUpText);
        }
    }

    setupPhysics() {
        // Player collects blocks
        this.physics.add.overlap(this.player, this.blocks, this.collectBlock, null, this);
        
        // Player interacts with experiment stations
        this.physics.add.overlap(this.player, this.experimentStations, this.startExperiment, null, this);
    }

    createControls() {
        // Keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // WASD controls
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');
        
        // Touch/mouse controls for mobile
        this.input.on('pointerdown', (pointer) => {
            if (pointer.x < this.scale.width / 2) {
                // Left side - move left
                this.player.body.setVelocityX(-this.player.speed);
            } else {
                // Right side - move right
                this.player.body.setVelocityX(this.player.speed);
            }
        });
    }

    update() {
        if (!this.isGameActive) return;
        
        // Player movement
        if (this.cursors.left.isDown || this.wasd.A.isDown) {
            this.player.body.setVelocityX(-this.player.speed);
        } else if (this.cursors.right.isDown || this.wasd.D.isDown) {
            this.player.body.setVelocityX(this.player.speed);
        } else {
            this.player.body.setVelocityX(0);
        }
        
        if (this.cursors.up.isDown || this.wasd.W.isDown) {
            this.player.body.setVelocityY(-this.player.speed);
        } else if (this.cursors.down.isDown || this.wasd.S.isDown) {
            this.player.body.setVelocityY(this.player.speed);
        } else {
            this.player.body.setVelocityY(0);
        }
    }

    collectBlock(player, block) {
        // Add to inventory
        this.inventory[block.blockType]++;
        this.blocksCollected++;
        
        // Calculate coin reward
        const coinsEarned = this.progressTracker.calculateCoinReward('easy', 0);
        this.progressTracker.awardCoins(coinsEarned, 'Block Collection');
        this.coinsEarned += coinsEarned;
        
        // Update score and UI
        this.score += 25;
        this.coinBalanceText.setText(`🪙 ${this.progressTracker.getCoinBalance()}`);
        this.sessionCoinsText.setText(`Session: +${this.coinsEarned} 🪙`);
        this.scoreText.setText(`Score: ${this.score}`);
        this.blocksText.setText(`Blocks: ${this.blocksCollected}/6`);
        this.inventoryText.setText(this.getInventoryDisplay());
        
        // Show feedback
        const blockIcons = {
            dirt: '🟫', stone: '🪨', water: '💧', 
            fire: '🔥', plant: '🌿', crystal: '💎'
        };
        this.showFeedback(`Collected ${blockIcons[block.blockType]} ${block.blockType}! (+${coinsEarned} coins)`, 0x10b981, player.x, player.y - 30);
        this.showCoinCollection(coinsEarned, player.x, player.y - 50);
        
        // Remove block
        block.graphic.destroy();
        block.icon.destroy();
        block.destroy();
        
        // Check if all blocks collected
        if (this.blocksCollected >= 6) {
            this.showFeedback("All blocks collected! Visit experiment stations to learn!", 0xffd700, player.x, player.y - 60);
        }
    }

    startExperiment(player, station) {
        if (!this.isGameActive) return;
        
        // Check if player has required materials (at least 2 different block types)
        const materialCount = Object.values(this.inventory).filter(count => count > 0).length;
        if (materialCount < 2) {
            this.showFeedback("Collect more blocks to start experiments!", 0xef4444, player.x, player.y - 30);
            return;
        }
        
        this.currentStation = station;
        this.showExperimentQuestion(station);
    }

    showExperimentQuestion(station) {
        this.isGameActive = false;
        
        // Get science question matching station type
        let question = this.questionManager.getRandomScienceQuestion();
        
        // Try to get a question matching the station type
        const scienceQuestions = this.questionManager.scienceQuestions;
        const matchingQuestions = scienceQuestions.filter(q => q.type === station.stationType);
        if (matchingQuestions.length > 0) {
            question = matchingQuestions[Math.floor(Math.random() * matchingQuestions.length)];
        }
        
        this.currentQuestion = question;
        
        // Create experiment overlay
        const overlay = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.8)
            .setOrigin(0, 0)
            .setInteractive({ useHandCursor: false });
        
        // Experiment panel
        const panel = this.add.rectangle(
            this.scale.width / 2,
            this.scale.height / 2,
            700,
            400,
            0x1e3a8a
        ).setStrokeStyle(4, 0xffffff);
        
        // Station title
        let yPos = this.scale.height / 2 - 150;
        
        this.add.text(this.scale.width / 2, yPos, `🔬 ${station.title.toUpperCase()} 🔬`, {
            fontSize: '24px',
            fontFamily: 'Arial, sans-serif',
            fill: '#fbbf24',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        yPos += 40;
        this.add.text(this.scale.width / 2, yPos, "Science Experiment Challenge!", {
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        yPos += 50;
        this.add.text(this.scale.width / 2, yPos, question.question, {
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            fontStyle: 'bold',
            wordWrap: { width: 600 },
            align: 'center'
        }).setOrigin(0.5);
        
        // Answer choices
        yPos += 80;
        const choices = question.choices;
        const buttonWidth = 150;
        const buttonHeight = 40;
        const spacing = 160;
        const startX = this.scale.width / 2 - (spacing * 1.5);
        
        choices.forEach((choice, index) => {
            const x = startX + (index * spacing);
            
            const button = this.add.rectangle(x, yPos, buttonWidth, buttonHeight, 0x10b981)
                .setStrokeStyle(2, 0xffffff)
                .setInteractive({ useHandCursor: true });
            
            this.add.text(x, yPos, choice, {
                fontSize: '14px',
                fontFamily: 'Arial, sans-serif',
                fill: '#ffffff',
                fontStyle: 'bold',
                wordWrap: { width: buttonWidth - 10 },
                align: 'center'
            }).setOrigin(0.5);
            
            button.on('pointerover', () => button.setFillStyle(0x059669));
            button.on('pointerout', () => button.setFillStyle(0x10b981));
            button.on('pointerdown', () => {
                this.checkExperimentAnswer(choice, overlay, panel);
            });
        });
    }

    checkExperimentAnswer(selectedAnswer, overlay, panel) {
        const isCorrect = this.questionManager.checkAnswer(selectedAnswer, this.currentQuestion.answer);
        
        if (isCorrect) {
            // Award coins for correct science answer
            const coinsEarned = this.progressTracker.calculateCoinReward('medium', 0);
            this.progressTracker.recordAnswer('science', true, 0, 'medium');
            this.coinsEarned += coinsEarned;
            
            this.experimentsCompleted++;
            this.score += 100;
            
            // Update UI
            this.coinBalanceText.setText(`🪙 ${this.progressTracker.getCoinBalance()}`);
            this.sessionCoinsText.setText(`Session: +${this.coinsEarned} 🪙`);
            this.scoreText.setText(`Score: ${this.score}`);
            this.experimentsText.setText(`Experiments: ${this.experimentsCompleted}/4`);
            
            this.showFeedback(`🧪 Experiment Success! +100 points, +${coinsEarned} coins`, 0x10b981);
            this.showCoinCollection(coinsEarned, this.scale.width / 2, this.scale.height / 2 + 100);
            
            // Check if all experiments completed
            if (this.experimentsCompleted >= 4) {
                this.progressTracker.completeWeek(3);
                this.endGame(true);
            }
        } else {
            this.progressTracker.recordAnswer('science', false);
            this.showFeedback(`❌ Try again! Correct answer: ${this.currentQuestion.answer}`, 0xef4444);
        }
        
        // Close overlay
        overlay.destroy();
        panel.destroy();
        this.isGameActive = true;
    }

    showCoinCollection(amount, x, y) {
        // Create floating coin animation
        const coinIcon = this.add.text(x, y, `+${amount} 🪙`, {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffd700',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        // Animate coin floating up and fading
        this.tweens.add({
            targets: coinIcon,
            y: y - 50,
            alpha: 0,
            scale: 1.2,
            duration: 1000,
            ease: 'Power2',
            onComplete: () => coinIcon.destroy()
        });
    }

    showFeedback(text, color, x = null, y = null) {
        const feedbackX = x || this.scale.width / 2;
        const feedbackY = y || this.scale.height / 2 + 100;
        
        const feedback = this.add.text(feedbackX, feedbackY, text, {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            fill: color,
            fontStyle: 'bold',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: feedback,
            alpha: 0,
            y: feedbackY - 50,
            duration: 2000,
            onComplete: () => feedback.destroy()
        });
    }

    showWelcomeMessage() {
        const welcome = this.add.text(this.scale.width / 2, this.scale.height / 2, 
            "⛏️ SCIENCE QUEST & CRAFT! ⛏️\n\nExplore the science realm and conduct experiments!\nCollect blocks and visit experiment stations!\n\nUse arrow keys or WASD to move around!\n\nGood luck, Young Scientist!", {
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 3,
            align: 'center',
            backgroundColor: '#1e3a8a',
            padding: { x: 20, y: 15 }
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: welcome,
            alpha: 0,
            duration: 5000,
            delay: 2000,
            onComplete: () => welcome.destroy()
        });
    }

    endGame(victory) {
        this.isGameActive = false;
        
        // Show end game screen
        const overlay = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.8)
            .setOrigin(0, 0);
        
        const panel = this.add.rectangle(
            this.scale.width / 2,
            this.scale.height / 2,
            500,
            400,
            0x1e3a8a
        ).setStrokeStyle(4, 0xffffff);
        
        let yPos = this.scale.height / 2 - 150;
        
        if (victory) {
            this.add.text(this.scale.width / 2, yPos, "🏆 SCIENCE MASTER! 🏆", {
                fontSize: '28px',
                fontFamily: 'Arial, sans-serif',
                fill: '#ffd700',
                fontStyle: 'bold'
            }).setOrigin(0.5);
        } else {
            this.add.text(this.scale.width / 2, yPos, "🔬 Keep Exploring! 🔬", {
                fontSize: '28px',
                fontFamily: 'Arial, sans-serif',
                fill: '#ef4444',
                fontStyle: 'bold'
            }).setOrigin(0.5);
        }
        
        yPos += 60;
        this.add.text(this.scale.width / 2, yPos, `Final Score: ${this.score}`, {
            fontSize: '20px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        yPos += 30;
        this.add.text(this.scale.width / 2, yPos, `Experiments Completed: ${this.experimentsCompleted}/4`, {
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        yPos += 30;
        const accuracy = this.progressTracker.getAccuracy('science');
        this.add.text(this.scale.width / 2, yPos, `Science Accuracy: ${accuracy}%`, {
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        // Buttons
        yPos += 80;
        
        if (!victory) {
            const tryAgainBtn = this.add.rectangle(this.scale.width / 2 - 80, yPos, 140, 40, 0x10b981)
                .setStrokeStyle(2, 0xffffff)
                .setInteractive({ useHandCursor: true });
            
            this.add.text(this.scale.width / 2 - 80, yPos, "Try Again", {
                fontSize: '16px',
                fontFamily: 'Arial, sans-serif',
                fill: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);
            
            tryAgainBtn.on('pointerdown', () => {
                this.scene.restart();
            });
        }
        
        const menuBtn = this.add.rectangle(
            victory ? this.scale.width / 2 : this.scale.width / 2 + 80, 
            yPos, 
            140, 
            40, 
            0x6366f1
        ).setStrokeStyle(2, 0xffffff)
         .setInteractive({ useHandCursor: true });
        
        this.add.text(
            victory ? this.scale.width / 2 : this.scale.width / 2 + 80, 
            yPos, 
            "Main Menu", {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        menuBtn.on('pointerdown', () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('EducationalMenuScene');
            });
        });
    }
} 