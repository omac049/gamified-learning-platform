export class EventManager {
    constructor(progressTracker, powerUpManager) {
        this.progressTracker = progressTracker;
        this.powerUpManager = powerUpManager;
        this.activeEvents = new Map();
        this.eventHistory = [];
        
        // Event definitions
        this.events = {
            // Bonus Events
            doubleRewards: {
                id: 'doubleRewards',
                name: 'Double Rewards Hour',
                description: 'All rewards are doubled for the next 10 minutes!',
                icon: '💰',
                type: 'bonus',
                duration: 600000, // 10 minutes
                rarity: 'common',
                effects: {
                    coinMultiplier: 2.0,
                    experienceMultiplier: 2.0
                },
                triggerCondition: { type: 'random', chance: 0.15 }
            },
            
            luckyStreak: {
                id: 'luckyStreak',
                name: 'Lucky Streak',
                description: 'Next 5 correct answers give bonus rewards!',
                icon: '🍀',
                type: 'bonus',
                duration: -1, // Until 5 correct answers
                rarity: 'uncommon',
                effects: {
                    bonusPerCorrect: 25,
                    streakTarget: 5
                },
                triggerCondition: { type: 'streak', value: 3 }
            },
            
            powerUpRain: {
                id: 'powerUpRain',
                name: 'Power-Up Rain',
                description: 'Random power-ups appear more frequently!',
                icon: '🌧️',
                type: 'bonus',
                duration: 300000, // 5 minutes
                rarity: 'rare',
                effects: {
                    powerUpDropRate: 0.3
                },
                triggerCondition: { type: 'questions_answered', value: 20 }
            },
            
            // Challenge Events
            speedChallenge: {
                id: 'speedChallenge',
                name: 'Speed Challenge',
                description: 'Answer 10 questions in under 2 minutes for mega rewards!',
                icon: '⚡',
                type: 'challenge',
                duration: 120000, // 2 minutes
                rarity: 'uncommon',
                effects: {
                    questionsRequired: 10,
                    timeLimit: 120000,
                    rewards: { coins: 200, experience: 150, powerUp: 'timeFreeze' }
                },
                triggerCondition: { type: 'accuracy', value: 80, questions: 10 }
            },
            
            perfectRound: {
                id: 'perfectRound',
                name: 'Perfect Round',
                description: 'Get the next 5 questions perfect for special rewards!',
                icon: '🎯',
                type: 'challenge',
                duration: -1, // Until completed or failed
                rarity: 'rare',
                effects: {
                    questionsRequired: 5,
                    perfectRequired: true,
                    rewards: { coins: 150, experience: 100, powerUp: 'shield' }
                },
                triggerCondition: { type: 'streak', value: 5 }
            },
            
            subjectMastery: {
                id: 'subjectMastery',
                name: 'Subject Mastery Challenge',
                description: 'Prove your mastery in a specific subject!',
                icon: '🏆',
                type: 'challenge',
                duration: 900000, // 15 minutes
                rarity: 'epic',
                effects: {
                    subjectFocus: true,
                    accuracyRequired: 85,
                    questionsRequired: 15,
                    rewards: { coins: 300, experience: 250, powerUp: 'studyBoost' }
                },
                triggerCondition: { type: 'subject_accuracy', value: 75, questions: 10 }
            },
            
            // Special Events
            mysteryBox: {
                id: 'mysteryBox',
                name: 'Mystery Box',
                description: 'A mysterious box appears! Answer correctly to open it.',
                icon: '📦',
                type: 'special',
                duration: 0, // Instant
                rarity: 'rare',
                effects: {
                    randomReward: true,
                    possibleRewards: [
                        { type: 'coins', value: 100 },
                        { type: 'experience', value: 75 },
                        { type: 'powerUp', value: 'hint' },
                        { type: 'powerUp', value: 'doubleCoins' },
                        { type: 'cosmetic', value: 'special' }
                    ]
                },
                triggerCondition: { type: 'random', chance: 0.08 }
            },
            
            characterBoost: {
                id: 'characterBoost',
                name: 'Character Boost',
                description: 'Your character feels energized! Abilities are enhanced.',
                icon: '⭐',
                type: 'special',
                duration: 480000, // 8 minutes
                rarity: 'uncommon',
                effects: {
                    characterAbilityBoost: 1.5,
                    cooldownReduction: 0.5
                },
                triggerCondition: { type: 'ability_use', count: 3 }
            },
            
            // Seasonal/Time-based Events
            morningBonus: {
                id: 'morningBonus',
                name: 'Early Bird Bonus',
                description: 'Morning learning gives extra rewards!',
                icon: '🌅',
                type: 'timed',
                duration: 3600000, // 1 hour
                rarity: 'common',
                effects: {
                    coinMultiplier: 1.3,
                    experienceMultiplier: 1.2
                },
                triggerCondition: { type: 'time_of_day', start: 6, end: 10 }
            },
            
            weekendWarrior: {
                id: 'weekendWarrior',
                name: 'Weekend Warrior',
                description: 'Weekend learning earns bonus points!',
                icon: '🎮',
                type: 'timed',
                duration: 172800000, // 48 hours
                rarity: 'common',
                effects: {
                    weekendBonus: 1.25
                },
                triggerCondition: { type: 'day_of_week', days: [0, 6] } // Sunday, Saturday
            }
        };
        
        // Event tracking
        this.eventStats = {
            eventsTriggered: 0,
            challengesCompleted: 0,
            bonusesEarned: 0,
            lastEventTime: 0
        };
    }

    // Check for event triggers
    checkEventTriggers(eventData = {}) {
        const triggeredEvents = [];
        const currentTime = Date.now();
        
        // Prevent event spam (minimum 30 seconds between events)
        if (currentTime - this.eventStats.lastEventTime < 30000) {
            return triggeredEvents;
        }
        
        Object.values(this.events).forEach(event => {
            // Skip if event is already active
            if (this.activeEvents.has(event.id)) return;
            
            // Check if event should trigger
            if (this.shouldTriggerEvent(event, eventData)) {
                triggeredEvents.push(event);
                this.triggerEvent(event);
            }
        });
        
        if (triggeredEvents.length > 0) {
            this.eventStats.lastEventTime = currentTime;
        }
        
        return triggeredEvents;
    }

    // Check if event should trigger
    shouldTriggerEvent(event, eventData) {
        const condition = event.triggerCondition;
        const progress = this.progressTracker.progress;
        
        switch (condition.type) {
            case 'random':
                return Math.random() < condition.chance;
                
            case 'streak':
                return eventData.currentStreak >= condition.value;
                
            case 'questions_answered':
                return progress.sessionStats.questionsAnswered >= condition.value;
                
            case 'accuracy':
                if (progress.sessionStats.questionsAnswered < condition.questions) return false;
                const accuracy = (progress.sessionStats.correctAnswers / progress.sessionStats.questionsAnswered) * 100;
                return accuracy >= condition.value;
                
            case 'subject_accuracy':
                const subjectStats = eventData.subjectStats;
                if (!subjectStats || subjectStats.total < condition.questions) return false;
                const subjectAccuracy = (subjectStats.correct / subjectStats.total) * 100;
                return subjectAccuracy >= condition.value;
                
            case 'ability_use':
                return progress.characterProgression.specialAbilitiesUsed >= condition.count;
                
            case 'time_of_day':
                const hour = new Date().getHours();
                return hour >= condition.start && hour < condition.end;
                
            case 'day_of_week':
                const day = new Date().getDay();
                return condition.days.includes(day);
                
            default:
                return false;
        }
    }

    // Trigger an event
    triggerEvent(event) {
        const activation = {
            id: event.id,
            event: event,
            startTime: Date.now(),
            endTime: event.duration > 0 ? Date.now() + event.duration : -1,
            progress: {},
            completed: false
        };
        
        // Initialize event-specific progress tracking
        if (event.type === 'challenge') {
            activation.progress = {
                questionsAnswered: 0,
                correctAnswers: 0,
                timeRemaining: event.effects.timeLimit || -1
            };
        }
        
        this.activeEvents.set(event.id, activation);
        this.eventStats.eventsTriggered++;
        
        console.log(`Event triggered: ${event.name}`);
        return activation;
    }

    // Update active events
    updateEvents(eventData = {}) {
        const completedEvents = [];
        const expiredEvents = [];
        const currentTime = Date.now();
        
        this.activeEvents.forEach((activation, eventId) => {
            const event = activation.event;
            
            // Check if event has expired
            if (activation.endTime > 0 && currentTime > activation.endTime) {
                expiredEvents.push(activation);
                this.activeEvents.delete(eventId);
                return;
            }
            
            // Update event progress
            if (event.type === 'challenge') {
                this.updateChallengeProgress(activation, eventData);
                
                // Check if challenge is completed
                if (this.isChallengeCompleted(activation)) {
                    completedEvents.push(activation);
                    this.completeEvent(activation);
                }
            }
            
            // Handle special event logic
            if (event.type === 'special') {
                this.handleSpecialEvent(activation, eventData);
            }
        });
        
        return { completed: completedEvents, expired: expiredEvents };
    }

    // Update challenge progress
    updateChallengeProgress(activation, eventData) {
        const event = activation.event;
        
        if (eventData.questionAnswered) {
            activation.progress.questionsAnswered++;
            
            if (eventData.isCorrect) {
                activation.progress.correctAnswers++;
            }
            
            // Check for failure conditions
            if (event.effects.perfectRequired && !eventData.isCorrect) {
                this.failEvent(activation);
            }
        }
        
        // Update time remaining for timed challenges
        if (event.effects.timeLimit) {
            activation.progress.timeRemaining = Math.max(0, 
                activation.endTime - Date.now());
        }
    }

    // Check if challenge is completed
    isChallengeCompleted(activation) {
        const event = activation.event;
        const progress = activation.progress;
        
        // Check question requirements
        if (event.effects.questionsRequired && 
            progress.questionsAnswered < event.effects.questionsRequired) {
            return false;
        }
        
        // Check accuracy requirements
        if (event.effects.accuracyRequired) {
            const accuracy = progress.questionsAnswered > 0 
                ? (progress.correctAnswers / progress.questionsAnswered) * 100 
                : 0;
            if (accuracy < event.effects.accuracyRequired) {
                return false;
            }
        }
        
        // Check perfect requirements
        if (event.effects.perfectRequired) {
            return progress.correctAnswers === event.effects.questionsRequired;
        }
        
        return true;
    }

    // Complete an event
    completeEvent(activation) {
        const event = activation.event;
        activation.completed = true;
        
        // Award rewards
        if (event.effects.rewards) {
            this.awardEventRewards(event.effects.rewards);
        }
        
        // Handle special completions
        if (event.type === 'challenge') {
            this.eventStats.challengesCompleted++;
        }
        
        this.activeEvents.delete(activation.id);
        this.eventHistory.push({
            ...activation,
            completedAt: Date.now()
        });
        
        console.log(`Event completed: ${event.name}`);
    }

    // Fail an event
    failEvent(activation) {
        const event = activation.event;
        activation.failed = true;
        
        this.activeEvents.delete(activation.id);
        this.eventHistory.push({
            ...activation,
            failedAt: Date.now()
        });
        
        console.log(`Event failed: ${event.name}`);
    }

    // Handle special events
    handleSpecialEvent(activation, eventData) {
        const event = activation.event;
        
        if (event.id === 'mysteryBox' && eventData.isCorrect) {
            this.openMysteryBox(activation);
        }
    }

    // Open mystery box
    openMysteryBox(activation) {
        const event = activation.event;
        const possibleRewards = event.effects.possibleRewards;
        const reward = possibleRewards[Math.floor(Math.random() * possibleRewards.length)];
        
        this.awardEventRewards(reward);
        this.completeEvent(activation);
    }

    // Award event rewards
    awardEventRewards(rewards) {
        if (rewards.coins) {
            this.progressTracker.awardCoins(rewards.coins, 'Event Reward');
        }
        
        if (rewards.experience) {
            this.progressTracker.awardCharacterExperience(rewards.experience);
        }
        
        if (rewards.powerUp) {
            const inventory = this.progressTracker.progress.inventory.powerUps;
            if (!inventory[rewards.powerUp]) {
                inventory[rewards.powerUp] = 0;
            }
            inventory[rewards.powerUp]++;
        }
        
        this.eventStats.bonusesEarned++;
    }

    // Get active event effects
    getActiveEffects() {
        const effects = {
            coinMultiplier: 1.0,
            experienceMultiplier: 1.0,
            powerUpDropRate: 0.1,
            characterAbilityBoost: 1.0,
            cooldownReduction: 1.0,
            specialEffects: []
        };
        
        this.activeEvents.forEach(activation => {
            const event = activation.event;
            
            if (event.effects.coinMultiplier) {
                effects.coinMultiplier *= event.effects.coinMultiplier;
            }
            
            if (event.effects.experienceMultiplier) {
                effects.experienceMultiplier *= event.effects.experienceMultiplier;
            }
            
            if (event.effects.powerUpDropRate) {
                effects.powerUpDropRate = Math.max(effects.powerUpDropRate, event.effects.powerUpDropRate);
            }
            
            if (event.effects.characterAbilityBoost) {
                effects.characterAbilityBoost *= event.effects.characterAbilityBoost;
            }
            
            if (event.effects.cooldownReduction) {
                effects.cooldownReduction *= event.effects.cooldownReduction;
            }
            
            if (event.effects.weekendBonus || event.effects.bonusPerCorrect) {
                effects.specialEffects.push(event.id);
            }
        });
        
        return effects;
    }

    // Get active events for UI
    getActiveEvents() {
        const activeEvents = [];
        
        this.activeEvents.forEach(activation => {
            const timeRemaining = activation.endTime > 0 
                ? Math.max(0, activation.endTime - Date.now())
                : -1;
            
            activeEvents.push({
                id: activation.id,
                name: activation.event.name,
                description: activation.event.description,
                icon: activation.event.icon,
                type: activation.event.type,
                timeRemaining,
                progress: activation.progress,
                rarity: activation.event.rarity
            });
        });
        
        return activeEvents.sort((a, b) => {
            const typeOrder = { challenge: 1, bonus: 2, special: 3, timed: 4 };
            return typeOrder[a.type] - typeOrder[b.type];
        });
    }

    // Get event history
    getEventHistory(limit = 10) {
        return this.eventHistory
            .slice(-limit)
            .reverse()
            .map(event => ({
                name: event.event.name,
                type: event.event.type,
                completed: event.completed,
                failed: event.failed,
                timestamp: event.completedAt || event.failedAt || event.startTime
            }));
    }

    // Get event statistics
    getEventStats() {
        return {
            ...this.eventStats,
            activeEvents: this.activeEvents.size,
            successRate: this.eventStats.challengesCompleted / Math.max(1, this.eventStats.eventsTriggered) * 100
        };
    }

    // Force trigger event (for testing/admin)
    forceTriggerEvent(eventId) {
        const event = this.events[eventId];
        if (!event) return null;
        
        return this.triggerEvent(event);
    }

    // Clean up expired events
    cleanupExpiredEvents() {
        const currentTime = Date.now();
        const toRemove = [];
        
        this.activeEvents.forEach((activation, eventId) => {
            if (activation.endTime > 0 && currentTime > activation.endTime) {
                toRemove.push(eventId);
            }
        });
        
        toRemove.forEach(eventId => {
            const activation = this.activeEvents.get(eventId);
            this.activeEvents.delete(eventId);
            
            this.eventHistory.push({
                ...activation,
                expiredAt: currentTime
            });
        });
    }

    // Get upcoming events (predictive)
    getUpcomingEvents() {
        const upcoming = [];
        const currentHour = new Date().getHours();
        const currentDay = new Date().getDay();
        
        Object.values(this.events).forEach(event => {
            if (event.triggerCondition.type === 'time_of_day') {
                const condition = event.triggerCondition;
                if (currentHour < condition.start) {
                    upcoming.push({
                        event: event,
                        timeUntil: (condition.start - currentHour) * 3600000,
                        type: 'scheduled'
                    });
                }
            }
        });
        
        return upcoming.sort((a, b) => a.timeUntil - b.timeUntil);
    }
} 