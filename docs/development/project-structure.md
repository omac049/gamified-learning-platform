# Project Structure Documentation

## Overview

This document describes the reorganized project structure for the Gamified Learning Platform, designed to improve navigation, maintainability, and onboarding experience.

## Directory Structure

```
gamified-learning-platform/
├── docs/                           # 📚 All documentation consolidated here
│   ├── README.md                   # Main project documentation
│   ├── api/                        # API documentation
│   │   └── PixelArtGenerator-Advanced.md
│   ├── fixes/                      # Bug fixes and solutions
│   │   ├── console-errors/         # Console error fixes
│   │   │   ├── comprehensive-fix.md
│   │   │   ├── fix-summary.md
│   │   │   ├── hitarea-fixes-complete.md
│   │   │   ├── hitarea-final-fix.md
│   │   │   └── hitarea-fix-summary.md
│   │   ├── arena-loading-fix.md
│   │   ├── enemy-interaction-fix.md
│   │   ├── fixes-applied.md
│   │   └── gameplay-fixes-summary.md
│   ├── guides/                     # User and developer guides
│   │   ├── game-mechanisms.md
│   │   ├── ui-ux-improvements.md
│   │   └── enhanced-battle-arena.md
│   └── development/                # Development documentation
│       ├── project-structure.md   # This file
│       └── contributing.md         # Contribution guidelines
├── packages/                       # 📦 All source code organized by domain
│   ├── core/                       # Core game initialization
│   │   ├── index.js               # Barrel exports
│   │   ├── main.js                # Main game entry point
│   │   └── preloader.js           # Asset preloader
│   ├── scenes/                     # Game scenes
│   │   ├── index.js               # Barrel exports
│   │   ├── Week1MathScene.js      # Educational scenes
│   │   ├── Week2ReadingScene.js
│   │   ├── Week3ScienceScene.js
│   │   ├── Week4HistoryScene.js
│   │   ├── Week5CrossoverScene.js
│   │   ├── Week6FinalScene.js
│   │   ├── EducationalMenuScene.js
│   │   ├── CharacterSelectScene.js
│   │   ├── ShopScene.js
│   │   ├── IntroScene.js
│   │   ├── MainScene.js
│   │   ├── GameOverScene.js
│   │   ├── SplashScene.js
│   │   ├── MenuScene.js
│   │   └── HudScene.js
│   ├── gameobjects/                # Game entities and objects
│   │   ├── index.js               # Barrel exports
│   │   ├── EnhancedUI.js          # UI components
│   │   ├── EnhancedPlayer.js      # Player entities
│   │   ├── BlueEnemy.js           # Enemy entities
│   │   ├── Bullet.js              # Projectiles
│   │   └── Player.js              # Base player class
│   ├── utils/                      # Utility modules organized by purpose
│   │   ├── index.js               # Main barrel exports
│   │   ├── managers/              # Game state managers
│   │   │   ├── index.js           # Barrel exports
│   │   │   ├── QuestionManager.js
│   │   │   ├── ProgressTracker.js
│   │   │   ├── AchievementManager.js
│   │   │   ├── EventManager.js
│   │   │   ├── PowerUpManager.js
│   │   │   ├── AdaptiveDifficultyManager.js
│   │   │   └── SaveManager.js
│   │   ├── optimization/          # Performance and optimization
│   │   │   ├── index.js           # Barrel exports
│   │   │   ├── ObjectPoolManager.js
│   │   │   ├── PerformanceMonitor.js
│   │   │   └── RealTimeCombatManager.js
│   │   └── graphics/              # Graphics and visual effects
│   │       ├── index.js           # Barrel exports
│   │       ├── PixelArtGenerator.js
│   │       ├── AdvancedParticleManager.js
│   │       └── FXManager.js
│   └── shared/                     # Shared types and constants
│       ├── types/                 # TypeScript type definitions
│       ├── constants/             # Game constants
│       └── interfaces/            # Shared interfaces
├── public/                         # Static assets
├── node_modules/                   # Dependencies
├── index.html                      # Main HTML entry point
├── package.json                    # Project configuration
├── vite.config.js                  # Build configuration
└── style.css                      # Global styles
```

## Key Improvements

### 1. Documentation Consolidation
- **Before**: Documentation scattered across multiple directories
- **After**: All documentation centralized in `docs/` with logical categorization
- **Benefits**: 
  - Easy to find and maintain documentation
  - Clear separation between code and docs
  - Better organization for different types of documentation

### 2. Package-Based Architecture
- **Before**: Flat `src/` directory with mixed concerns
- **After**: Clear package boundaries with domain-specific organization
- **Benefits**:
  - Easier to understand what each module does
  - Better separation of concerns
  - Scalable architecture for future growth

### 3. Barrel Exports
- **Before**: Direct imports from individual files
- **After**: Centralized exports through `index.js` files
- **Benefits**:
  - Cleaner import statements
  - Better API surface control
  - Easier refactoring and reorganization

## Import Patterns

### Old Pattern
```javascript
import { QuestionManager } from './utils/QuestionManager.js';
import { PixelArtGenerator } from './utils/PixelArtGenerator.js';
import { Week1MathScene } from './scenes/Week1MathScene.js';
```

### New Pattern
```javascript
import { QuestionManager, PixelArtGenerator } from '@utils';
import { Week1MathScene } from '@scenes';
```

### Available Aliases
- `@packages` - Root packages directory
- `@core` - Core game modules
- `@scenes` - Game scenes
- `@gameobjects` - Game objects and entities
- `@utils` - Utility modules
- `@shared` - Shared types and constants

## Package Descriptions

### Core (`packages/core/`)
Contains the fundamental game initialization and configuration files:
- `main.js` - Primary game entry point with Phaser configuration
- `preloader.js` - Asset loading and initialization
- `index.js` - Barrel exports for core modules

### Scenes (`packages/scenes/`)
All Phaser scenes organized by functionality:
- Educational scenes (Week1-6)
- Menu and navigation scenes
- UI scenes (HUD, Shop, Character Select)

### Game Objects (`packages/gameobjects/`)
Phaser game objects and entities:
- Player classes and variants
- Enemy entities
- Projectiles and interactive objects
- UI components

### Utils (`packages/utils/`)
Utility modules organized by purpose:

#### Managers (`packages/utils/managers/`)
Game state and logic managers:
- Question and progress tracking
- Achievement and event systems
- Save/load functionality

#### Optimization (`packages/utils/optimization/`)
Performance and optimization utilities:
- Object pooling for memory management
- Performance monitoring
- Real-time combat optimization

#### Graphics (`packages/utils/graphics/`)
Visual effects and rendering utilities:
- Advanced pixel art generation
- Particle systems
- Visual effects management

### Shared (`packages/shared/`)
Common types, constants, and interfaces used across packages:
- Type definitions
- Game constants
- Shared interfaces and contracts

## Migration Benefits

1. **Improved Navigation**: Clear directory structure makes it easy to find specific functionality
2. **Better Onboarding**: New developers can quickly understand the codebase organization
3. **Enhanced Maintainability**: Logical separation makes it easier to maintain and update code
4. **Scalability**: Package-based structure supports future growth and feature additions
5. **Cleaner Imports**: Barrel exports reduce import complexity and improve readability

## Development Workflow

### Adding New Features
1. Identify the appropriate package for your feature
2. Create new files in the relevant package directory
3. Update the package's `index.js` to export new modules
4. Use the established import patterns in your code

### Updating Documentation
1. All documentation goes in the `docs/` directory
2. Choose the appropriate subdirectory based on content type
3. Update this structure document if adding new documentation categories

### Build Process
The build process automatically handles the new structure through:
- Vite configuration with path aliases
- Barrel exports for clean imports
- Optimized bundling for production

## Future Considerations

- Consider adding TypeScript definitions in `packages/shared/types/`
- Potential for micro-frontend architecture with package-based boundaries
- Plugin system could leverage the package structure
- Testing organization should mirror the package structure 