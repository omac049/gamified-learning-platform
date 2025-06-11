# Contributing to Gamified Learning Platform

Thank you for your interest in contributing to the Gamified Learning Platform! This guide will help you get started and ensure consistency across the project.

## Table of Contents

- [Getting Started](#getting-started)
- [Development Setup](#development-setup)
- [Coding Standards](#coding-standards)
- [Commit Message Guidelines](#commit-message-guidelines)
- [Pull Request Process](#pull-request-process)
- [Project Structure](#project-structure)
- [Testing Guidelines](#testing-guidelines)

## Getting Started

1. Fork the repository
2. Clone your fork: `git clone https://github.com/YOUR_USERNAME/gamified-learning-platform.git`
3. Install dependencies: `npm install`
4. Start development server: `npm run dev`

## Development Setup

### Prerequisites

- Node.js (v18 or higher)
- npm (v9 or higher)

### Installation

```bash
# Install dependencies
npm install

# Set up git hooks (for automatic linting/formatting)
npm run prepare
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues automatically
- `npm run format` - Format code with Prettier
- `npm run format:check` - Check if code is formatted correctly

## Coding Standards

### JavaScript Style Guide

We follow the [Airbnb JavaScript Style Guide](https://github.com/airbnb/javascript) with some modifications for game development:

- Use ES6+ features
- Prefer `const` over `let`, avoid `var`
- Use arrow functions for callbacks
- Use template literals for string interpolation
- Use destructuring when appropriate

### Code Formatting

- **Prettier** handles automatic formatting
- **ESLint** enforces code quality rules
- Code is automatically formatted on commit via git hooks

### Naming Conventions

#### Files and Directories

- Use kebab-case for file names: `combat-system.js`
- Use PascalCase for class files: `CombatSystem.js`
- Use camelCase for utility files: `mathHelpers.js`

#### Variables and Functions

- Use camelCase: `playerHealth`, `calculateDamage()`
- Use PascalCase for classes: `CombatSystem`, `QuestionManager`
- Use UPPER_SNAKE_CASE for constants: `MAX_HEALTH`, `GAME_CONFIG`

#### Phaser-specific Conventions

- Scene classes use PascalCase: `MainMenuScene`, `CombatScene`
- Game objects use PascalCase: `PlayerCharacter`, `EnemySprite`
- Configuration objects use camelCase: `gameConfig`, `sceneConfig`

### Documentation

#### JSDoc Comments

Use JSDoc for all public methods and classes:

```javascript
/**
 * Calculates damage based on player stats and question difficulty
 * @param {number} baseDamage - Base damage value
 * @param {Object} playerStats - Player's current stats
 * @param {number} questionDifficulty - Difficulty level (1-5)
 * @returns {number} Final damage amount
 */
function calculateDamage(baseDamage, playerStats, questionDifficulty) {
  // Implementation
}
```

#### Inline Comments

- Use `//` for single-line comments
- Explain complex logic, not obvious code
- Keep comments up-to-date with code changes

### Error Handling

- Use try-catch blocks for async operations
- Provide meaningful error messages
- Log errors appropriately (console.warn for development, proper logging for production)

```javascript
try {
  const result = await fetchQuestionData();
  return result;
} catch (error) {
  console.error('Failed to fetch question data:', error);
  throw new Error('Unable to load questions. Please try again.');
}
```

## Commit Message Guidelines

We follow [Conventional Commits](https://www.conventionalcommits.org/) specification:

### Format

```
<type>[optional scope]: <description>

[optional body]

[optional footer(s)]
```

### Types

- `feat`: New feature
- `fix`: Bug fix
- `docs`: Documentation changes
- `style`: Code style changes (formatting, etc.)
- `refactor`: Code refactoring
- `test`: Adding or updating tests
- `chore`: Maintenance tasks

### Examples

```
feat(combat): add special abilities system
fix(ui): resolve mobile responsiveness issues
docs(readme): update installation instructions
refactor(scenes): extract common scene utilities
```

### Scope Guidelines

- `combat`: Combat system related
- `ui`: User interface components
- `scenes`: Phaser scenes
- `questions`: Question management
- `progress`: Progress tracking
- `config`: Configuration files

## Pull Request Process

### Before Submitting

1. **Run quality checks:**

   ```bash
   npm run lint
   npm run format:check
   npm run build
   ```

2. **Test your changes:**

   - Verify the game runs without errors
   - Test on different screen sizes (if UI changes)
   - Ensure educational content is age-appropriate

3. **Update documentation:**
   - Update relevant markdown files
   - Add JSDoc comments for new functions
   - Update CHANGELOG.md if applicable

### PR Template

When creating a pull request, include:

- **Description**: What changes were made and why
- **Type of Change**: Bug fix, new feature, documentation, etc.
- **Testing**: How the changes were tested
- **Screenshots**: For UI changes
- **Breaking Changes**: Any breaking changes and migration notes

### Review Process

1. All PRs require at least one review
2. Automated checks must pass (linting, formatting, build)
3. Changes should be tested in the browser
4. Educational content should be reviewed for appropriateness

## Project Structure

```
gamified-learning-platform/
├── packages/
│   ├── core/           # Core game logic
│   ├── scenes/         # Phaser scenes
│   ├── gameobjects/    # Custom game objects
│   ├── utils/          # Utility functions
│   └── shared/         # Shared constants and types
├── public/             # Static assets
├── docs/               # Documentation
├── dist/               # Build output
└── *.md               # Project documentation
```

### Module Organization

- **Core**: Game initialization, main loop, core systems
- **Scenes**: Individual game screens (menu, combat, etc.)
- **Game Objects**: Reusable game entities (player, enemies, UI)
- **Utils**: Helper functions and utilities
- **Shared**: Constants, configurations, and shared types

## Testing Guidelines

### Manual Testing Checklist

- [ ] Game loads without console errors
- [ ] All scenes transition correctly
- [ ] Combat system works as expected
- [ ] Questions display and validate correctly
- [ ] Progress saves and loads properly
- [ ] UI is responsive on different screen sizes
- [ ] Educational content is appropriate for 3rd-4th grade

### Browser Testing

Test in at least:

- Chrome (latest)
- Firefox (latest)
- Safari (if on macOS)
- Mobile browsers (iOS Safari, Chrome Mobile)

## Questions or Issues?

- Check existing [Issues](https://github.com/your-repo/issues)
- Create a new issue with detailed description
- Join our discussions in the project repository

Thank you for contributing to making learning more engaging for students!
