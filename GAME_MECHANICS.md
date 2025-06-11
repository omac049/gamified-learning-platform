# 🤖 Combat System Game Mechanics Documentation

## Overview

This document provides detailed technical information about the Universal Combat System implemented across multiple subjects in the Cyber Academy Robot Command Center. The system transforms educational content into epic robot battles with character progression and equipment integration.

## ⚔️ Universal Combat System

### 1. **Core Combat Loop**

- **Answer Selection**: Player chooses answers to educational questions
- **Combat Resolution**: Correct answers trigger player robot attacks, incorrect answers trigger enemy attacks
- **Stat Integration**: Character stats (attack, defense, speed, accuracy, luck, intelligence) affect all combat
- **Visual Feedback**: Robot animations, damage numbers, and screen effects provide immediate feedback
- **Progression**: XP and coin rewards based on performance with character bonuses

### 2. **Character System**

- **Three Unique Characters**: ARIA (Stealth), TITAN (Tank), NEXUS (Tech)
- **Level Progression**: Each level increases all combat stats
- **Stat Scaling**: Base stats + level bonuses + equipment effects
- **Cross-Subject Benefits**: Character builds affect performance in all subjects

### 3. **Equipment Integration**

#### **Weapon Effects**

```javascript
Plasma Sword: +25% attack power
Neural Disruptor: +50% attack power
Quantum Cannon: +100% attack power

Combat Impact:
- Increases damage from correct answers
- Affects score multipliers
- Visual weapon effects on robot
```

#### **Shield Effects**

```javascript
Energy Barrier: +25 defense
Adaptive Armor: +35 defense
Quantum Shield: +50 defense

Combat Impact:
- Reduces penalties from wrong answers
- Provides damage mitigation
- Visual shield effects during enemy attacks
```

#### **Tech Effects**

```javascript
Hint Scanner: +25% accuracy
Time Dilator: +15 second bonus
Answer Analyzer: +35% accuracy

Combat Impact:
- Provides hint assistance
- Extends time limits
- Improves answer precision
```

#### **Core Effects**

```javascript
XP Amplifier: +50% intelligence
Coin Magnet: +100% luck
Streak Keeper: Protects answer streaks

Combat Impact:
- Boosts experience gains
- Increases coin rewards
- Prevents streak loss on wrong answers
```

## 🎯 Subject-Specific Combat Integration

### **Week 1: Math Combat Arena**

```javascript
Combat Mechanics:
- Calculation-based damage scaling
- Math power system integration
- Arithmetic operation themes
- Stat bonuses for TITAN character

Question Types:
- Basic arithmetic (addition, subtraction)
- Multiplication and division
- Word problems with combat themes
- Progressive difficulty scaling

Visual Elements:
- Mathematical damage calculations
- Number-based attack effects
- Calculator-style UI elements
- Geometric combat patterns
```

### **Week 2: Reading Combat Arena**

```javascript
Combat Mechanics:
- Comprehension-based accuracy bonuses
- Reading speed affects time bonuses
- Vocabulary challenges
- Stat bonuses for ARIA character

Question Types:
- Reading comprehension passages
- Vocabulary definitions
- Story analysis questions
- Character motivation queries

Visual Elements:
- Text-based attack animations
- Word collection mechanics
- Literary-themed combat effects
- Cyber-enhanced reading interface
```

### **Week 3: Science Combat Lab** (Combat-Ready Framework)

```javascript
Combat Mechanics:
- Experimental accuracy bonuses
- Scientific method integration
- Tech equipment synergy
- Stat bonuses for NEXUS character

Planned Question Types:
- Scientific method steps
- Experiment analysis
- Chemical reactions
- Physics calculations

Planned Visual Elements:
- Laboratory-themed combat arena
- Experimental equipment integration
- Chemical reaction effects
- Scientific instrument UI
```

## 🤖 Character Stat System

### **Base Stat Calculations**

```javascript
// Level scaling formula
baseStats = {
    attackPower: 1.0 + (level - 1) * 0.05,  // +5% per level
    defense: (level - 1) * 2,               // +2 defense per level
    speed: 30 + (level - 1) * 1,            // +1 second per level
    accuracy: (level - 1) * 3,              // +3% accuracy per level
    luck: (level - 1) * 2,                  // +2% luck per level
    energy: 100 + (level - 1) * 5,          // +5 energy per level
    intelligence: (level - 1) * 3           // +3% intelligence per level
}

// Character type bonuses
ARIA: +10% attack, +15% accuracy, +5 speed
TITAN: +20% attack, +10 defense, +20 energy
NEXUS: +20% intelligence, +10% accuracy, +10% luck
```

### **Equipment Stat Bonuses**

```javascript
// Applied after base stats calculation
applyEquipmentStatsBonus(stats) {
    // Weapon bonuses to attack power
    // Shield bonuses to defense
    // Tech bonuses to accuracy/speed
    // Core bonuses to intelligence/luck/energy
    return enhancedStats;
}
```

## ⚡ Combat Resolution System

### **Correct Answer Flow**

```javascript
1. Player selects correct answer
2. Calculate damage: baseDamage × characterStats.attackPower
3. Apply equipment multipliers
4. Player robot performs attack animation
5. Enemy takes damage with visual feedback
6. Create floating damage numbers
7. Award score bonus with stat multipliers
8. Grant XP with intelligence bonus
9. Award coins with luck bonus
10. Check for enemy defeat and spawn new enemy
```

### **Incorrect Answer Flow**

```javascript
1. Player selects incorrect answer
2. Calculate penalty: basePenalty - characterStats.defense
3. Apply equipment damage reduction
4. Enemy robot performs attack animation
5. Player receives penalty with visual feedback
6. Create floating penalty numbers
7. Reset streak (unless Streak Keeper equipped)
8. Apply score penalty
9. Continue combat with feedback
```

### **Damage Calculation Examples**

```javascript
// Math Combat Example
baseDamage = 25
characterAttack = 1.2 (Level 5 TITAN)
weaponBonus = 1.5 (Neural Disruptor)
finalDamage = 25 × 1.2 × 1.5 = 45 damage

// Reading Combat Example
baseDamage = 25
characterAttack = 1.1 (Level 3 ARIA)
accuracyBonus = 1.25 (Answer Analyzer)
finalDamage = 25 × 1.1 × 1.25 = 34 damage
```

## 🎮 Visual Combat System

### **Robot Graphics System**

```javascript
// Character-specific robot designs
createRobotGraphic(charType) {
    specs = getRobotSpecifications(charType);
    // Create base, torso, head, weapons
    // Apply character-specific colors and features
    // Add equipment visual effects
    return robotContainer;
}

// Robot specifications by character
ARIA: Sleek, angular, stealth-focused design
TITAN: Bulky, armored, heavy assault design
NEXUS: Modular, crystalline, tech-focused design
```

### **Combat Animations**

```javascript
// Player attack sequence
performPlayerAttack(damage) {
    1. Robot moves forward with attack animation
    2. Create attack effect at enemy position
    3. Enemy reacts with hit animation
    4. Display floating damage number
    5. Screen shake for impact feedback
    6. Return robot to idle position
}

// Enemy attack sequence
performEnemyAttack(penalty) {
    1. Enemy robot moves forward
    2. Create attack effect at player position
    3. Player robot reacts with hit animation
    4. Display floating penalty number
    5. Screen shake for impact
    6. Return enemy to idle position
}
```

### **Visual Effects System**

```javascript
// Attack effects
createAttackEffect(x, y, color) {
    // Expanding circle with particles
    // Color-coded by damage type
    // Particle burst animation
}

// Floating numbers
createFloatingDamageNumber(x, y, damage, color) {
    // Animated text rising and fading
    // Color indicates damage/penalty type
    // Size scales with damage amount
}

// Equipment effects
applyEquipmentVisuals(robot, equippedItems) {
    // Weapon glow effects
    // Shield shimmer animations
    // Tech scanner overlays
    // Core energy pulsing
}
```

## 📊 Progression Integration

### **Experience System**

```javascript
// Base XP with intelligence multiplier
addExperience(baseAmount) {
    stats = getCharacterStats();
    multiplier = 1 + (stats.intelligence / 100);
    finalXP = Math.floor(baseAmount × multiplier);
    awardCharacterExperience(finalXP);
}

// Subject-specific XP bonuses
Math: Base 15 XP per correct answer
Reading: Base 15 XP per correct answer
Science: Base 20 XP per correct answer (planned)
```

### **Coin System**

```javascript
// Base coins with luck multiplier
addCoins(baseAmount, reason) {
    stats = getCharacterStats();
    multiplier = 1 + (stats.luck / 100);
    finalCoins = Math.floor(baseAmount × multiplier);
    awardCoins(finalCoins, reason);
}

// Subject-specific coin rewards
Math: 10 coins per correct answer
Reading: 10 coins per correct answer
Bonus: Equipment effects can double rewards
```

### **Streak System**

```javascript
// Streak tracking with protection
onCorrectAnswer() {
    streak++;
    maxStreak = Math.max(maxStreak, streak);
    // Apply streak bonuses at milestones
}

onIncorrectAnswer() {
    if (!hasStreakKeeper()) {
        streak = 0;
    } else {
        streak = Math.max(1, streak); // Protect streak
        showStreakKeeperEffect();
    }
}
```

## 🔧 Technical Implementation

### **Event-Driven Architecture**

```javascript
// Subject scenes emit events
this.events.emit('subjectAnswerCorrect', {
  subject: 'math',
  difficulty: 'medium',
  timeSpent: 3000,
});

// Combat system responds to events
this.events.on('subjectAnswerCorrect', data => {
  damage = this.combatSystem.onCorrectAnswer(data);
  // Handle combat resolution
});
```

### **Modular Integration**

```javascript
// Any scene can integrate combat
class WeekXScene extends Scene {
  create() {
    this.combatSystem = new CombatSystem(this, {}, this.progressTracker);
    this.combatSystem.init();
    this.setupCombatEventListeners();
  }

  setupCombatEventListeners() {
    this.events.on('subjectAnswerCorrect', this.onCorrectAnswer);
    this.events.on('subjectAnswerIncorrect', this.onIncorrectAnswer);
  }
}
```

### **Performance Optimizations**

```javascript
// Reusable combat system across subjects
// Efficient robot graphics with containers
// Throttled animation updates
// Memory management with proper cleanup
// Object pooling for particles and effects
```

## 🌟 Future Enhancements

### **Phase 2: Advanced Combat**

- Special abilities per character type
- Boss battles with unique mechanics
- Weapon-specific attack animations
- Combo system for answer streaks

### **Phase 3: Multiplayer Combat**

- Robot vs Robot PvP battles
- Team-based combat scenarios
- Tournament mode with rankings
- Guild system integration

### **Phase 4: Advanced Progression**

- Prestige system for max-level characters
- Legendary equipment tiers
- Achievement-based unlocks
- Seasonal combat events

---

**The Universal Combat System transforms every educational interaction into an epic battle, making learning an adventure where knowledge is power!** ⚔️🤖✨
