import { Scene } from "phaser";
import { QuestionManager, ProgressTracker } from "../utils/managers/index.js";

export class Week6FinalScene extends Scene {
    constructor() {
        super("Week6FinalScene");
        this.questionManager = new QuestionManager();
        this.progressTracker = new ProgressTracker();
        
        // Game state
        this.score = 0;
        this.currentStage = 1;
        this.totalStages = 4;
        this.questionsAnswered = 0;
        this.correctAnswers = 0;
        this.isGameActive = true;
        this.player = null;
        this.boss = null;
        this.bossHealth = 100;
        this.maxBossHealth = 100;
        this.coinsEarned = 0;
        this.equippedEffects = null;
        this.stageSubjects = ['math', 'reading', 'science', 'history'];
        this.currentSubject = 'math';
        this.graduationUnlocked = false;
        this.finalBossDefeated = false;
        this.achievementsEarned = [];
    }

    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
        
        // Get equipped item effects
        this.equippedEffects = this.progressTracker.getEquippedEffects();
    }

    create() {
        // Create the epic final battle arena
        this.createBattleArena();
        
        // Create player character
        this.createPlayer();
        
        // Create final boss
        this.createFinalBoss();
        
        // Create UI
        this.createUI();
        
        // Set up physics and interactions
        this.setupPhysics();
        
        // Create controls
        this.createControls();
        
        // Show welcome message
        this.showWelcomeMessage();
    }

    createBattleArena() {
        // Epic gradient background
        const gradient = this.add.graphics();
        gradient.fillGradientStyle(0x000080, 0x000080, 0x4B0082, 0x8B0000, 1);
        gradient.fillRect(0, 0, this.scale.width, this.scale.height);
        
        // Add dramatic lighting effects
        for (let i = 0; i < 40; i++) {
            const x = Phaser.Math.Between(0, this.scale.width);
            const y = Phaser.Math.Between(0, this.scale.height);
            const light = this.add.circle(x, y, Phaser.Math.Between(2, 5), 0xffd700, 0.6);
            
            this.tweens.add({
                targets: light,
                alpha: 0.1,
                scale: 1.5,
                duration: Phaser.Math.Between(2000, 4000),
                yoyo: true,
                repeat: -1,
                ease: 'Sine.easeInOut'
            });
        }
        
        // Battle arena platform
        const platform = this.add.rectangle(this.scale.width / 2, this.scale.height - 50, this.scale.width, 100, 0x2d3748);
        platform.setStroke(3, 0xffd700);
        
        // Title
        this.add.text(this.scale.width / 2, 50, "⚔️ FINAL CHALLENGE ⚔️", {
            fontSize: '28px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffd700',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Stage indicator
        this.stageIndicator = this.add.text(this.scale.width / 2, 80, `🌟 STAGE ${this.currentStage}: ${this.currentSubject.toUpperCase()} MASTERY`, {
            fontSize: '16px',
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
            case 'redCharacter': playerColor = 0xff4444; break;
            case 'blueCharacter': playerColor = 0x4444ff; break;
            case 'greenCharacter': playerColor = 0x44ff44; break;
        }
        
        // Epic hero character
        this.player = this.add.circle(200, this.scale.height - 120, 20, playerColor);
        this.player.setStroke(3, 0xffd700);
        
        // Add crown (graduation cap)
        this.playerCrown = this.add.polygon(200, this.scale.height - 150, [
            0, -15, -12, -5, 12, -5
        ], 0x000000);
        this.playerCrown.setStroke(2, 0xffd700);
        
        // Add magical aura
        this.playerAura = this.add.circle(200, this.scale.height - 120, 25, 0xffd700, 0.3);
        
        // Add physics body
        this.physics.add.existing(this.player);
        this.player.body.setCollideWorldBounds(true);
        this.player.body.setSize(40, 40);
        
        // Player properties with equipped effects
        this.player.speed = 120 * (this.equippedEffects.speedMultiplier || 1);
        
        // Player label
        this.add.text(this.player.x, this.player.y - 60, "GRADUATE", {
            fontSize: '12px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffd700',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Pulsing aura animation
        this.tweens.add({
            targets: this.playerAura,
            scaleX: 1.2,
            scaleY: 1.2,
            alpha: 0.1,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
    }

    createFinalBoss() {
        // Epic final boss - Knowledge Dragon
        this.boss = this.add.circle(700, this.scale.height - 150, 40, 0x8B0000);
        this.boss.setStroke(4, 0x000000);
        
        // Boss eyes
        this.add.circle(690, this.scale.height - 160, 5, 0xff0000);
        this.add.circle(710, this.scale.height - 160, 5, 0xff0000);
        
        // Boss crown/horns
        this.add.polygon(700, this.scale.height - 190, [
            0, -20, -10, -5, -5, 0, 0, -10, 5, 0, 10, -5
        ], 0x000000);
        
        // Boss label
        this.add.text(700, this.scale.height - 220, "KNOWLEDGE DRAGON", {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ff0000',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Boss health bar background
        this.bossHealthBg = this.add.rectangle(700, this.scale.height - 250, 200, 20, 0x666666);
        this.bossHealthBg.setStroke(2, 0x000000);
        
        // Boss health bar
        this.bossHealthBar = this.add.rectangle(700, this.scale.height - 250, 200, 20, 0xff0000);
        
        // Boss health text
        this.bossHealthText = this.add.text(700, this.scale.height - 250, `${this.bossHealth}/${this.maxBossHealth}`, {
            fontSize: '12px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        // Boss breathing animation
        this.tweens.add({
            targets: this.boss,
            scaleX: 1.1,
            scaleY: 1.1,
            duration: 2000,
            yoyo: true,
            repeat: -1,
            ease: 'Sine.easeInOut'
        });
        
        // Add physics body
        this.physics.add.existing(this.boss);
        this.boss.body.setSize(80, 80);
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
        
        // Progress display
        this.progressText = this.add.text(20, 110, `Stage: ${this.currentStage}/${this.totalStages}`, {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffd700',
            stroke: '#000000',
            strokeThickness: 2
        });
        
        // Accuracy display
        this.accuracyText = this.add.text(20, 140, `Accuracy: ${this.questionsAnswered > 0 ? Math.round((this.correctAnswers / this.questionsAnswered) * 100) : 0}%`, {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
        });

        // Questions answered
        this.questionsText = this.add.text(20, 170, `Questions: ${this.questionsAnswered}`, {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 2
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
        
        // Attack button
        this.attackBtn = this.add.rectangle(this.scale.width / 2, this.scale.height - 40, 200, 30, 0xff0000)
            .setStroke(2, 0xffd700)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(this.scale.width / 2, this.scale.height - 40, "⚔️ CHALLENGE THE DRAGON", {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        this.attackBtn.on('pointerdown', () => {
            if (this.isGameActive) {
                this.startBossBattle();
            }
        });
        
        // Instructions
        this.add.text(this.scale.width / 2, this.scale.height - 10, 
            "Click to challenge the Knowledge Dragon! Answer questions to deal damage!", {
            fontSize: '11px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            stroke: '#000000',
            strokeThickness: 1,
            align: 'center'
        }).setOrigin(0.5);
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
        // Player can interact with boss
        this.physics.add.overlap(this.player, this.boss, this.startBossBattle, null, this);
    }

    createControls() {
        // Keyboard controls
        this.cursors = this.input.keyboard.createCursorKeys();
        
        // WASD controls
        this.wasd = this.input.keyboard.addKeys('W,S,A,D');
        
        // Spacebar for attack
        this.spaceKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);
        
        this.spaceKey.on('down', () => {
            if (this.isGameActive) {
                this.startBossBattle();
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
        
        // Update accessories position
        this.playerCrown.x = this.player.x;
        this.playerCrown.y = this.player.y - 30;
        this.playerAura.x = this.player.x;
        this.playerAura.y = this.player.y;
    }

    startBossBattle() {
        if (!this.isGameActive) return;
        
        this.showBossQuestion();
    }

    showBossQuestion() {
        this.isGameActive = false;
        
        // Get question based on current stage/subject
        let question;
        switch(this.currentSubject) {
            case 'math':
                question = this.questionManager.getRandomMathQuestion();
                break;
            case 'reading':
                question = this.questionManager.getRandomReadingQuestion();
                break;
            case 'science':
                question = this.questionManager.getRandomScienceQuestion();
                break;
            case 'history':
                question = this.questionManager.getRandomHistoryQuestion();
                break;
            default:
                question = this.questionManager.getRandomMixedQuestion();
        }
        
        this.currentQuestion = question;
        
        // Create battle overlay
        const overlay = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.8)
            .setOrigin(0, 0)
            .setInteractive({ useHandCursor: false });
        
        // Battle panel
        const panel = this.add.rectangle(
            this.scale.width / 2,
            this.scale.height / 2,
            700,
            450,
            0x8B0000
        ).setStroke(4, 0xffd700);
        
        // Battle title
        let yPos = this.scale.height / 2 - 180;
        
        this.add.text(this.scale.width / 2, yPos, `🐲 DRAGON BATTLE - STAGE ${this.currentStage} 🐲`, {
            fontSize: '24px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffd700',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        yPos += 40;
        this.add.text(this.scale.width / 2, yPos, `${this.currentSubject.toUpperCase()} MASTERY CHALLENGE`, {
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        yPos += 50;
        
        // Handle reading questions differently (with passage)
        if (this.currentSubject === 'reading' && question.passage) {
            this.add.text(this.scale.width / 2, yPos, question.passage, {
                fontSize: '14px',
                fontFamily: 'Arial, sans-serif',
                fill: '#ffffff',
                wordWrap: { width: 600 },
                align: 'center'
            }).setOrigin(0.5);
            yPos += 80;
        }
        
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
            
            const button = this.add.rectangle(x, yPos, buttonWidth, buttonHeight, 0xff4444)
                .setStroke(2, 0xffd700)
                .setInteractive({ useHandCursor: true });
            
            this.add.text(x, yPos, choice, {
                fontSize: '14px',
                fontFamily: 'Arial, sans-serif',
                fill: '#ffffff',
                fontStyle: 'bold',
                wordWrap: { width: buttonWidth - 10 },
                align: 'center'
            }).setOrigin(0.5);
            
            button.on('pointerover', () => button.setFillStyle(0xcc3333));
            button.on('pointerout', () => button.setFillStyle(0xff4444));
            button.on('pointerdown', () => {
                this.checkBossAnswer(choice, overlay, panel);
            });
        });
    }

    checkBossAnswer(selectedAnswer, overlay, panel) {
        const isCorrect = this.questionManager.checkAnswer(selectedAnswer, this.currentQuestion.answer);
        
        this.questionsAnswered++;
        
        if (isCorrect) {
            this.correctAnswers++;
            
            // Deal damage to boss
            const damage = 25;
            this.bossHealth = Math.max(0, this.bossHealth - damage);
            
            // Award coins
            const coinsEarned = this.progressTracker.calculateCoinReward('hard', 0);
            this.progressTracker.recordAnswer(this.currentSubject, true, 0, 'hard');
            this.coinsEarned += coinsEarned;
            
            this.score += 200;
            
            // Update UI
            this.coinBalanceText.setText(`🪙 ${this.progressTracker.getCoinBalance()}`);
            this.sessionCoinsText.setText(`Session: +${this.coinsEarned} 🪙`);
            this.scoreText.setText(`Score: ${this.score}`);
            this.accuracyText.setText(`Accuracy: ${Math.round((this.correctAnswers / this.questionsAnswered) * 100)}%`);
            this.questionsText.setText(`Questions: ${this.questionsAnswered}`);
            
            // Update boss health bar
            const healthPercent = this.bossHealth / this.maxBossHealth;
            this.bossHealthBar.setScale(healthPercent, 1);
            this.bossHealthText.setText(`${this.bossHealth}/${this.maxBossHealth}`);
            
            this.showFeedback(`⚔️ Critical Hit! ${damage} damage dealt! +${coinsEarned} coins`, 0x10b981);
            this.showCoinCollection(coinsEarned, this.scale.width / 2, this.scale.height / 2 + 100);
            
            // Check if stage completed
            if (this.bossHealth <= 0) {
                this.completeStage();
            }
        } else {
            this.progressTracker.recordAnswer(this.currentSubject, false);
            this.accuracyText.setText(`Accuracy: ${Math.round((this.correctAnswers / this.questionsAnswered) * 100)}%`);
            this.questionsText.setText(`Questions: ${this.questionsAnswered}`);
            this.showFeedback(`❌ Miss! Correct answer: ${this.currentQuestion.answer}`, 0xef4444);
        }
        
        // Close overlay
        overlay.destroy();
        panel.destroy();
        this.isGameActive = true;
    }

    completeStage() {
        this.currentStage++;
        
        if (this.currentStage <= this.totalStages) {
            // Move to next subject
            this.currentSubject = this.stageSubjects[this.currentStage - 1];
            this.bossHealth = this.maxBossHealth; // Reset boss health
            
            // Update UI
            this.stageIndicator.setText(`🌟 STAGE ${this.currentStage}: ${this.currentSubject.toUpperCase()} MASTERY`);
            this.progressText.setText(`Stage: ${this.currentStage}/${this.totalStages}`);
            this.bossHealthBar.setScale(1, 1);
            this.bossHealthText.setText(`${this.bossHealth}/${this.maxBossHealth}`);
            
            this.showFeedback(`🎉 Stage ${this.currentStage - 1} Complete! Moving to ${this.currentSubject.toUpperCase()}!`, 0xffd700);
        } else {
            // All stages completed - final boss defeated!
            this.finalBossDefeated = true;
            this.progressTracker.completeWeek(6);
            this.startGraduationCeremony();
        }
    }

    startGraduationCeremony() {
        this.isGameActive = false;
        
        // Create graduation overlay
        const overlay = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000080, 0.95)
            .setOrigin(0, 0);
        
        // Add celebratory confetti
        for (let i = 0; i < 100; i++) {
            const x = Phaser.Math.Between(0, this.scale.width);
            const y = Phaser.Math.Between(-100, 0);
            const colors = [0xff0000, 0x00ff00, 0x0000ff, 0xffff00, 0xff00ff, 0x00ffff, 0xffd700];
            const confetti = this.add.rectangle(x, y, 6, 12, colors[i % colors.length]);
            
            this.tweens.add({
                targets: confetti,
                y: this.scale.height + 100,
                x: x + Phaser.Math.Between(-50, 50),
                rotation: Phaser.Math.Between(0, 6.28),
                duration: Phaser.Math.Between(3000, 6000),
                ease: 'Linear'
            });
        }
        
        // Graduation panel
        const panel = this.add.rectangle(
            this.scale.width / 2,
            this.scale.height / 2,
            700,
            500,
            0x1e3a8a
        ).setStroke(4, 0xffd700);
        
        let yPos = this.scale.height / 2 - 200;
        
        this.add.text(this.scale.width / 2, yPos, "🎓 GRADUATION CEREMONY! 🎓", {
            fontSize: '32px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffd700',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        yPos += 60;
        this.add.text(this.scale.width / 2, yPos, "🏆 KNOWLEDGE MASTER ACHIEVED! 🏆", {
            fontSize: '20px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff'
        }).setOrigin(0.5);
        
        yPos += 50;
        
        // Calculate final statistics
        const totalAccuracy = Math.round((this.correctAnswers / this.questionsAnswered) * 100);
        const mathAccuracy = this.progressTracker.getAccuracy('math');
        const readingAccuracy = this.progressTracker.getAccuracy('reading');
        const scienceAccuracy = this.progressTracker.getAccuracy('science');
        const historyAccuracy = this.progressTracker.getAccuracy('history');
        const overallAccuracy = Math.round((mathAccuracy + readingAccuracy + scienceAccuracy + historyAccuracy) / 4);
        
        this.add.text(this.scale.width / 2, yPos, 
            `📊 FINAL REPORT CARD 📊\n\n` +
            `Final Challenge Score: ${this.score}\n` +
            `Final Challenge Accuracy: ${totalAccuracy}%\n` +
            `Questions Answered: ${this.questionsAnswered}\n\n` +
            `📚 SUBJECT MASTERY 📚\n` +
            `Math: ${mathAccuracy}% | Reading: ${readingAccuracy}%\n` +
            `Science: ${scienceAccuracy}% | History: ${historyAccuracy}%\n` +
            `Overall Accuracy: ${overallAccuracy}%\n\n` +
            `🪙 Total Coins Earned: ${this.progressTracker.getCoinBalance()}\n` +
            `🏅 Weeks Completed: 6/6`, {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        // Award final achievements
        this.awardFinalAchievements(overallAccuracy);
        
        // Continue to certificate
        this.time.delayedCall(5000, () => {
            this.showGraduationCertificate(overallAccuracy);
        });
    }

    awardFinalAchievements(overallAccuracy) {
        // Award achievements based on performance
        if (overallAccuracy >= 90) {
            this.achievementsEarned.push("🏆 PERFECT SCHOLAR");
            this.progressTracker.awardCoins(100, "Perfect Scholar Achievement");
        }
        if (overallAccuracy >= 80) {
            this.achievementsEarned.push("🥇 HONOR STUDENT");
            this.progressTracker.awardCoins(75, "Honor Student Achievement");
        }
        if (this.questionsAnswered >= 50) {
            this.achievementsEarned.push("📚 KNOWLEDGE SEEKER");
            this.progressTracker.awardCoins(50, "Knowledge Seeker Achievement");
        }
        if (this.finalBossDefeated) {
            this.achievementsEarned.push("🐲 DRAGON SLAYER");
            this.progressTracker.awardCoins(100, "Dragon Slayer Achievement");
        }
        
        this.achievementsEarned.push("🎓 GRADUATE");
        this.progressTracker.awardCoins(200, "Graduation Achievement");
    }

    showGraduationCertificate(overallAccuracy) {
        // Clear previous content
        this.children.removeAll();
        
        // Certificate background
        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0xffffff)
            .setOrigin(0, 0);
        
        // Certificate border
        this.add.rectangle(this.scale.width / 2, this.scale.height / 2, 
            this.scale.width - 40, this.scale.height - 40, 0xffffff)
            .setStroke(8, 0xffd700);
        
        // Inner border
        this.add.rectangle(this.scale.width / 2, this.scale.height / 2, 
            this.scale.width - 80, this.scale.height - 80, 0xffffff)
            .setStroke(4, 0x000080);
        
        let yPos = 80;
        
        // Certificate header
        this.add.text(this.scale.width / 2, yPos, "🎓 CERTIFICATE OF COMPLETION 🎓", {
            fontSize: '28px',
            fontFamily: 'Arial, sans-serif',
            fill: '#000080',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        yPos += 60;
        this.add.text(this.scale.width / 2, yPos, "This certifies that", {
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif',
            fill: '#000000'
        }).setOrigin(0.5);
        
        yPos += 40;
        this.add.text(this.scale.width / 2, yPos, "YOUNG SCHOLAR", {
            fontSize: '32px',
            fontFamily: 'Arial, sans-serif',
            fill: '#000080',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        yPos += 50;
        this.add.text(this.scale.width / 2, yPos, 
            "has successfully completed the\n6-Week Gamified Learning Adventure\nwith distinction", {
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif',
            fill: '#000000',
            align: 'center'
        }).setOrigin(0.5);
        
        yPos += 80;
        this.add.text(this.scale.width / 2, yPos, 
            `🏆 ACHIEVEMENTS EARNED 🏆\n${this.achievementsEarned.join(' | ')}\n\n` +
            `📊 FINAL GRADE: ${this.getLetterGrade(overallAccuracy)} (${overallAccuracy}%)\n` +
            `🎯 TOTAL SCORE: ${this.score} points\n` +
            `🪙 COINS EARNED: ${this.progressTracker.getCoinBalance()}`, {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            fill: '#000080',
            align: 'center'
        }).setOrigin(0.5);
        
        yPos += 120;
        this.add.text(this.scale.width / 2, yPos, 
            `Awarded on ${new Date().toLocaleDateString()}\n\nGameified Learning Academy`, {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            fill: '#000000',
            align: 'center'
        }).setOrigin(0.5);
        
        // Add decorative elements
        this.add.text(100, 150, "🌟", { fontSize: '24px' });
        this.add.text(this.scale.width - 100, 150, "🌟", { fontSize: '24px' });
        this.add.text(100, this.scale.height - 150, "🏆", { fontSize: '24px' });
        this.add.text(this.scale.width - 100, this.scale.height - 150, "🏆", { fontSize: '24px' });
        
        // Continue button
        const continueBtn = this.add.rectangle(
            this.scale.width / 2,
            this.scale.height - 50,
            200,
            40,
            0x000080
        ).setStroke(2, 0xffd700)
         .setInteractive({ useHandCursor: true });
        
        this.add.text(this.scale.width / 2, this.scale.height - 50, "🎉 CELEBRATE!", {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        continueBtn.on('pointerdown', () => {
            this.endGame(true);
        });
    }

    getLetterGrade(percentage) {
        if (percentage >= 97) return "A+";
        if (percentage >= 93) return "A";
        if (percentage >= 90) return "A-";
        if (percentage >= 87) return "B+";
        if (percentage >= 83) return "B";
        if (percentage >= 80) return "B-";
        if (percentage >= 77) return "C+";
        if (percentage >= 73) return "C";
        if (percentage >= 70) return "C-";
        return "Needs Improvement";
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
        const feedbackY = y || this.scale.height / 2 + 150;
        
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
            "⚔️ FINAL CHALLENGE! ⚔️\n\nFace the Knowledge Dragon!\nProve your mastery across all subjects!\nDefeat the boss to graduate!\n\nClick the dragon or press SPACEBAR to attack!\nAnswer questions correctly to deal damage!\n\nGood luck, Graduate!", {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            stroke: '#000080',
            strokeThickness: 3,
            align: 'center',
            backgroundColor: '#1e3a8a',
            padding: { x: 20, y: 15 }
        }).setOrigin(0.5);
        
        this.tweens.add({
            targets: welcome,
            alpha: 0,
            duration: 6000,
            delay: 3000,
            onComplete: () => welcome.destroy()
        });
    }

    endGame(victory) {
        this.isGameActive = false;
        
        // Show final celebration screen
        const overlay = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.8)
            .setOrigin(0, 0);
        
        const panel = this.add.rectangle(
            this.scale.width / 2,
            this.scale.height / 2,
            500,
            400,
            0x000080
        ).setStroke(4, 0xffd700);
        
        let yPos = this.scale.height / 2 - 150;
        
        this.add.text(this.scale.width / 2, yPos, "🎓 CONGRATULATIONS! 🎓", {
            fontSize: '28px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffd700',
            fontStyle: 'bold'
        }).setOrigin(0.5);
        
        yPos += 60;
        this.add.text(this.scale.width / 2, yPos, 
            "You have successfully completed\nthe 6-Week Learning Adventure!\n\n" +
            "🌟 All subjects mastered\n" +
            "🐲 Knowledge Dragon defeated\n" +
            "🏆 Certificate earned\n" +
            "🎯 Ready for 4th grade!", {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            align: 'center'
        }).setOrigin(0.5);
        
        // Menu button
        yPos += 120;
        const menuBtn = this.add.rectangle(this.scale.width / 2, yPos, 200, 40, 0x6366f1)
            .setStroke(2, 0xffffff)
            .setInteractive({ useHandCursor: true });
        
        this.add.text(this.scale.width / 2, yPos, "Return to Menu", {
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