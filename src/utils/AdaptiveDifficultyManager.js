export class AdaptiveDifficultyManager {
    constructor(progressTracker) {
        this.progressTracker = progressTracker;
        
        // Difficulty levels
        this.difficultyLevels = {
            beginner: {
                id: 'beginner',
                name: 'Beginner',
                multiplier: 0.8,
                timeBonus: 1.5,
                hintAvailable: true,
                maxQuestions: 5
            },
            easy: {
                id: 'easy',
                name: 'Easy',
                multiplier: 1.0,
                timeBonus: 1.2,
                hintAvailable: true,
                maxQuestions: 7
            },
            medium: {
                id: 'medium',
                name: 'Medium',
                multiplier: 1.2,
                timeBonus: 1.0,
                hintAvailable: false,
                maxQuestions: 10
            },
            hard: {
                id: 'hard',
                name: 'Hard',
                multiplier: 1.5,
                timeBonus: 0.8,
                hintAvailable: false,
                maxQuestions: 12
            },
            expert: {
                id: 'expert',
                name: 'Expert',
                multiplier: 2.0,
                timeBonus: 0.6,
                hintAvailable: false,
                maxQuestions: 15
            }
        };
        
        // Performance tracking
        this.sessionPerformance = {
            questionsAnswered: 0,
            correctAnswers: 0,
            averageResponseTime: 0,
            streakCount: 0,
            strugglingTopics: [],
            strongTopics: []
        };
        
        // Adaptive parameters
        this.adaptiveSettings = {
            adjustmentThreshold: 3, // Questions before adjustment
            accuracyTarget: 0.75, // Target 75% accuracy
            responseTimeTarget: 15000, // 15 seconds target
            streakBonus: 3, // Consecutive correct answers for difficulty increase
            struggleThreshold: 2 // Consecutive wrong answers for difficulty decrease
        };
    }

    // Get current difficulty for a subject
    getCurrentDifficulty(subject) {
        const stats = this.progressTracker.progress.subjectStats[subject];
        if (!stats || stats.total === 0) {
            return this.difficultyLevels.easy; // Start with easy
        }
        
        const accuracy = stats.correct / stats.total;
        const characterType = this.progressTracker.getCharacterType();
        
        // Character-specific difficulty adjustments
        let difficultyModifier = 0;
        if (characterType?.bonusMultipliers[subject]) {
            difficultyModifier = 0.1; // Slightly harder for character strengths
        }
        
        // Determine difficulty based on accuracy
        if (accuracy >= 0.9 + difficultyModifier) {
            return this.difficultyLevels.expert;
        } else if (accuracy >= 0.8 + difficultyModifier) {
            return this.difficultyLevels.hard;
        } else if (accuracy >= 0.7 + difficultyModifier) {
            return this.difficultyLevels.medium;
        } else if (accuracy >= 0.5) {
            return this.difficultyLevels.easy;
        } else {
            return this.difficultyLevels.beginner;
        }
    }

    // Adjust difficulty based on recent performance
    adjustDifficultyDynamic(subject, recentAnswers) {
        const currentDifficulty = this.getCurrentDifficulty(subject);
        
        // Analyze recent performance (last 5 answers)
        const recentCorrect = recentAnswers.filter(answer => answer.correct).length;
        const recentAccuracy = recentCorrect / recentAnswers.length;
        const avgResponseTime = recentAnswers.reduce((sum, answer) => sum + answer.responseTime, 0) / recentAnswers.length;
        
        let newDifficultyId = currentDifficulty.id;
        
        // Increase difficulty if performing well
        if (recentAccuracy >= 0.8 && avgResponseTime < this.adaptiveSettings.responseTimeTarget) {
            newDifficultyId = this.getNextDifficultyLevel(currentDifficulty.id, 1);
        }
        // Decrease difficulty if struggling
        else if (recentAccuracy < 0.5 || avgResponseTime > this.adaptiveSettings.responseTimeTarget * 2) {
            newDifficultyId = this.getNextDifficultyLevel(currentDifficulty.id, -1);
        }
        
        return this.difficultyLevels[newDifficultyId];
    }

    // Get next difficulty level
    getNextDifficultyLevel(currentId, direction) {
        const levels = ['beginner', 'easy', 'medium', 'hard', 'expert'];
        const currentIndex = levels.indexOf(currentId);
        const newIndex = Math.max(0, Math.min(levels.length - 1, currentIndex + direction));
        return levels[newIndex];
    }

    // Calculate rewards based on difficulty
    calculateRewards(difficulty, responseTime, isCorrect) {
        if (!isCorrect) return { coins: 0, experience: 0, bonus: 0 };
        
        const baseCoins = 10;
        const baseExperience = 15;
        
        // Apply difficulty multiplier
        let coins = Math.floor(baseCoins * difficulty.multiplier);
        let experience = Math.floor(baseExperience * difficulty.multiplier);
        
        // Time bonus
        const timeBonus = responseTime < 10000 ? difficulty.timeBonus : 1.0;
        coins = Math.floor(coins * timeBonus);
        experience = Math.floor(experience * timeBonus);
        
        // Character bonuses
        const characterType = this.progressTracker.getCharacterType();
        if (characterType?.bonusMultipliers.coins) {
            coins = Math.floor(coins * characterType.bonusMultipliers.coins);
        }
        if (characterType?.bonusMultipliers.experience) {
            experience = Math.floor(experience * characterType.bonusMultipliers.experience);
        }
        
        return {
            coins,
            experience,
            bonus: Math.floor((coins + experience) * 0.1),
            difficulty: difficulty.name,
            timeBonus: timeBonus > 1.0
        };
    }

    // Record answer for adaptive learning
    recordAnswer(subject, question, userAnswer, correctAnswer, responseTime) {
        const isCorrect = userAnswer === correctAnswer;
        
        // Update session performance
        this.sessionPerformance.questionsAnswered++;
        if (isCorrect) {
            this.sessionPerformance.correctAnswers++;
            this.sessionPerformance.streakCount++;
        } else {
            this.sessionPerformance.streakCount = 0;
        }
        
        // Update average response time
        const totalTime = this.sessionPerformance.averageResponseTime * (this.sessionPerformance.questionsAnswered - 1) + responseTime;
        this.sessionPerformance.averageResponseTime = totalTime / this.sessionPerformance.questionsAnswered;
        
        // Track struggling/strong topics
        if (question.type) {
            if (isCorrect) {
                this.addToStrongTopics(question.type);
            } else {
                this.addToStrugglingTopics(question.type);
            }
        }
        
        return {
            isCorrect,
            difficulty: this.getCurrentDifficulty(subject),
            sessionAccuracy: this.sessionPerformance.correctAnswers / this.sessionPerformance.questionsAnswered,
            streak: this.sessionPerformance.streakCount
        };
    }

    // Add to struggling topics
    addToStrugglingTopics(topic) {
        const existing = this.sessionPerformance.strugglingTopics.find(t => t.topic === topic);
        if (existing) {
            existing.count++;
        } else {
            this.sessionPerformance.strugglingTopics.push({ topic, count: 1 });
        }
        
        // Sort by count
        this.sessionPerformance.strugglingTopics.sort((a, b) => b.count - a.count);
    }

    // Add to strong topics
    addToStrongTopics(topic) {
        const existing = this.sessionPerformance.strongTopics.find(t => t.topic === topic);
        if (existing) {
            existing.count++;
        } else {
            this.sessionPerformance.strongTopics.push({ topic, count: 1 });
        }
        
        // Sort by count
        this.sessionPerformance.strongTopics.sort((a, b) => b.count - a.count);
    }

    // Get personalized recommendations
    getRecommendations() {
        const recommendations = [];
        
        // Struggling topics recommendations
        if (this.sessionPerformance.strugglingTopics.length > 0) {
            const topStruggle = this.sessionPerformance.strugglingTopics[0];
            recommendations.push({
                type: 'practice',
                message: `Consider practicing ${topStruggle.topic} problems`,
                priority: 'high',
                action: 'practice_topic',
                data: { topic: topStruggle.topic }
            });
        }
        
        // Performance-based recommendations
        const accuracy = this.sessionPerformance.correctAnswers / this.sessionPerformance.questionsAnswered;
        if (accuracy < 0.6) {
            recommendations.push({
                type: 'difficulty',
                message: 'Try easier questions to build confidence',
                priority: 'medium',
                action: 'reduce_difficulty'
            });
        } else if (accuracy > 0.9) {
            recommendations.push({
                type: 'challenge',
                message: 'Ready for harder challenges!',
                priority: 'low',
                action: 'increase_difficulty'
            });
        }
        
        // Character-specific recommendations
        const characterType = this.progressTracker.getCharacterType();
        if (characterType) {
            recommendations.push({
                type: 'character',
                message: `Use your ${characterType.name} abilities for bonus points!`,
                priority: 'low',
                action: 'use_ability'
            });
        }
        
        return recommendations;
    }

    // Get session summary
    getSessionSummary() {
        const accuracy = this.sessionPerformance.questionsAnswered > 0 
            ? this.sessionPerformance.correctAnswers / this.sessionPerformance.questionsAnswered 
            : 0;
        
        return {
            questionsAnswered: this.sessionPerformance.questionsAnswered,
            accuracy: Math.round(accuracy * 100),
            averageResponseTime: Math.round(this.sessionPerformance.averageResponseTime / 1000),
            bestStreak: this.sessionPerformance.streakCount,
            strongTopics: this.sessionPerformance.strongTopics.slice(0, 3),
            strugglingTopics: this.sessionPerformance.strugglingTopics.slice(0, 3),
            recommendations: this.getRecommendations()
        };
    }

    // Reset session data
    resetSession() {
        this.sessionPerformance = {
            questionsAnswered: 0,
            correctAnswers: 0,
            averageResponseTime: 0,
            streakCount: 0,
            strugglingTopics: [],
            strongTopics: []
        };
    }

    // Get difficulty settings for UI
    getDifficultySettings(subject) {
        const currentDifficulty = this.getCurrentDifficulty(subject);
        return {
            current: currentDifficulty,
            available: Object.values(this.difficultyLevels),
            canIncrease: currentDifficulty.id !== 'expert',
            canDecrease: currentDifficulty.id !== 'beginner'
        };
    }
} 