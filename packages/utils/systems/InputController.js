import { GameSystem } from './GameSystem.js';
import { GameConfig } from '../../shared/index.js';

/**
 * Input Controller System - Handles all input with clear bindings
 * Manages keyboard, mouse, crosshair, and weapon switching
 */
export class InputController extends GameSystem {
    constructor(scene, config = {}) {
        super(scene, config);

        // Input state
        this.keys = {};
        this.mouse = {
            x: 0,
            y: 0,
            isDown: false,
            justPressed: false,
            justReleased: false
        };
        
        // Weapon system
        this.currentWeapon = 'rapidFire';
        this.weaponSwitchCooldown = 0;
        this.lastWeaponSwitch = 0;
        
        // Crosshair
        this.crosshair = null;
        this.crosshairEnabled = true;
        
        // Input bindings
        this.keyBindings = {
            // Movement
            moveUp: ['W', 'UP'],
            moveDown: ['S', 'DOWN'],
            moveLeft: ['A', 'LEFT'],
            moveRight: ['D', 'RIGHT'],
            
            // Combat
            fire: ['SPACE', 'MOUSE_LEFT'],
            reload: ['R'],
            
            // Weapons
            weapon1: ['ONE'],
            weapon2: ['TWO'],
            weapon3: ['THREE'],
            weapon4: ['FOUR'],
            nextWeapon: ['Q', 'MOUSE_WHEEL_UP'],
            prevWeapon: ['E', 'MOUSE_WHEEL_DOWN'],
            
            // Abilities
            ability1: ['SHIFT'],
            ability2: ['CTRL'],
            ability3: ['ALT'],
            ability4: ['TAB'],
            ability5: ['F'],
            
            // UI
            pause: ['ESC', 'P'],
            inventory: ['I'],
            map: ['M'],
            
            // Debug
            debug: ['BACKTICK']
        };
        
        // Action mappings
        this.actionMappings = {
            moveUp: 'movement',
            moveDown: 'movement',
            moveLeft: 'movement',
            moveRight: 'movement',
            fire: 'combat',
            reload: 'combat',
            weapon1: 'weaponSwitch',
            weapon2: 'weaponSwitch',
            weapon3: 'weaponSwitch',
            weapon4: 'weaponSwitch',
            nextWeapon: 'weaponSwitch',
            prevWeapon: 'weaponSwitch',
            ability1: 'ability',
            ability2: 'ability',
            ability3: 'ability',
            ability4: 'ability',
            ability5: 'ability'
        };
        
        // Input state tracking
        this.inputState = {
            movement: { x: 0, y: 0 },
            firing: false,
            lastFireTime: 0,
            weaponSwitchRequested: null,
            abilityRequested: null
        };
        
        // Available weapons
        this.availableWeapons = Object.keys(GameConfig.weapons);
        this.currentWeaponIndex = 0;
        
        // Input history for combos
        this.inputHistory = [];
        this.maxHistoryLength = 10;
        
        // Touch support
        this.touchEnabled = false;
        this.touchControls = {
            movementJoystick: null,
            fireButton: null,
            weaponButton: null,
            abilityButtons: []
        };
    }

    async onInit() {
        this.log('Initializing Input Controller...');
        
        // Set up keyboard input
        this.setupKeyboardInput();
        
        // Set up mouse input
        this.setupMouseInput();
        
        // Create crosshair
        this.createCrosshair();
        
        // Set up touch controls if needed
        this.setupTouchControls();
        
        // Set up event listeners
        this.setupEventListeners();
        
        this.log('Input Controller initialized');
    }

    setupKeyboardInput() {
        // Create key objects for all bindings
        const allKeys = new Set();
        Object.values(this.keyBindings).forEach(keys => {
            keys.forEach(key => {
                if (!key.startsWith('MOUSE_')) {
                    allKeys.add(key);
                }
            });
        });
        
        // Create Phaser key objects
        allKeys.forEach(keyCode => {
            try {
                this.keys[keyCode] = this.scene.input.keyboard.addKey(keyCode);
            } catch (error) {
                this.warn(`Failed to create key binding for: ${keyCode}`);
            }
        });
        
        // Set up key event listeners
        this.scene.input.keyboard.on('keydown', this.onKeyDown, this);
        this.scene.input.keyboard.on('keyup', this.onKeyUp, this);
    }

    setupMouseInput() {
        // Mouse movement
        this.scene.input.on('pointermove', this.onMouseMove, this);
        
        // Mouse buttons
        this.scene.input.on('pointerdown', this.onMouseDown, this);
        this.scene.input.on('pointerup', this.onMouseUp, this);
        
        // Mouse wheel
        this.scene.input.on('wheel', this.onMouseWheel, this);
        
        // Prevent context menu
        this.scene.input.mouse.disableContextMenu();
    }

    createCrosshair() {
        if (!this.crosshairEnabled) return;
        
        // Create crosshair graphics
        this.crosshair = this.scene.add.graphics();
        this.crosshair.setDepth(1500);
        
        // Draw crosshair
        this.updateCrosshair();
        
        // Hide system cursor
        this.scene.input.setDefaultCursor('none');
    }

    updateCrosshair() {
        if (!this.crosshair) return;
        
        this.crosshair.clear();
        
        const x = this.mouse.x;
        const y = this.mouse.y;
        const size = 10;
        const thickness = 2;
        const gap = 3;
        
        // Get weapon color
        const weaponConfig = GameConfig.weapons[this.currentWeapon];
        const color = weaponConfig ? weaponConfig.color : 0xffffff;
        
        this.crosshair.lineStyle(thickness, color, 0.8);
        
        // Draw crosshair lines
        // Top
        this.crosshair.lineBetween(x, y - gap - size, x, y - gap);
        // Bottom
        this.crosshair.lineBetween(x, y + gap, x, y + gap + size);
        // Left
        this.crosshair.lineBetween(x - gap - size, y, x - gap, y);
        // Right
        this.crosshair.lineBetween(x + gap, y, x + gap + size, y);
        
        // Add center dot
        this.crosshair.fillStyle(color, 0.6);
        this.crosshair.fillCircle(x, y, 1);
    }

    setupTouchControls() {
        // Check if touch is available
        if (!this.scene.input.touch) return;
        
        this.touchEnabled = true;
        
        // Create virtual joystick for movement
        this.createVirtualJoystick();
        
        // Create touch fire button
        this.createTouchFireButton();
        
        // Create weapon switch button
        this.createTouchWeaponButton();
    }

    createVirtualJoystick() {
        const x = 100;
        const y = this.scene.cameras.main.height - 100;
        const radius = 50;
        
        // Joystick base
        const base = this.scene.add.circle(x, y, radius, 0x333333, 0.5);
        base.setDepth(1100);
        base.setScrollFactor(0);
        
        // Joystick stick
        const stick = this.scene.add.circle(x, y, radius * 0.4, 0x666666, 0.8);
        stick.setDepth(1101);
        stick.setScrollFactor(0);
        
        // Make interactive
        base.setInteractive();
        
        let isDragging = false;
        let startX = x;
        let startY = y;
        
        base.on('pointerdown', (pointer) => {
            isDragging = true;
            startX = pointer.x;
            startY = pointer.y;
        });
        
        this.scene.input.on('pointermove', (pointer) => {
            if (!isDragging) return;
            
            const distance = Phaser.Math.Distance.Between(startX, startY, pointer.x, pointer.y);
            const maxDistance = radius * 0.8;
            
            if (distance <= maxDistance) {
                stick.setPosition(pointer.x, pointer.y);
            } else {
                const angle = Phaser.Math.Angle.Between(startX, startY, pointer.x, pointer.y);
                stick.setPosition(
                    startX + Math.cos(angle) * maxDistance,
                    startY + Math.sin(angle) * maxDistance
                );
            }
            
            // Update movement input
            const normalizedX = (stick.x - x) / maxDistance;
            const normalizedY = (stick.y - y) / maxDistance;
            
            this.inputState.movement.x = normalizedX;
            this.inputState.movement.y = normalizedY;
        });
        
        this.scene.input.on('pointerup', () => {
            if (!isDragging) return;
            
            isDragging = false;
            stick.setPosition(x, y);
            this.inputState.movement.x = 0;
            this.inputState.movement.y = 0;
        });
        
        this.touchControls.movementJoystick = { base, stick };
    }

    createTouchFireButton() {
        const x = this.scene.cameras.main.width - 100;
        const y = this.scene.cameras.main.height - 100;
        const radius = 40;
        
        const button = this.scene.add.circle(x, y, radius, 0xff4444, 0.7);
        button.setDepth(1100);
        button.setScrollFactor(0);
        button.setInteractive();
        
        // Add fire icon
        const icon = this.scene.add.text(x, y, '🔥', {
            fontSize: '24px'
        }).setOrigin(0.5).setDepth(1101).setScrollFactor(0);
        
        button.on('pointerdown', () => {
            this.inputState.firing = true;
            button.setAlpha(1);
        });
        
        button.on('pointerup', () => {
            this.inputState.firing = false;
            button.setAlpha(0.7);
        });
        
        this.touchControls.fireButton = { button, icon };
    }

    createTouchWeaponButton() {
        const x = this.scene.cameras.main.width - 180;
        const y = this.scene.cameras.main.height - 100;
        const radius = 30;
        
        const button = this.scene.add.circle(x, y, radius, 0x4444ff, 0.7);
        button.setDepth(1100);
        button.setScrollFactor(0);
        button.setInteractive();
        
        // Add weapon icon
        const weaponConfig = GameConfig.weapons[this.currentWeapon];
        const icon = this.scene.add.text(x, y, weaponConfig.icon, {
            fontSize: '20px'
        }).setOrigin(0.5).setDepth(1101).setScrollFactor(0);
        
        button.on('pointerdown', () => {
            this.switchToNextWeapon();
            button.setAlpha(1);
        });
        
        button.on('pointerup', () => {
            button.setAlpha(0.7);
        });
        
        this.touchControls.weaponButton = { button, icon };
    }

    setupEventListeners() {
        // Listen for game state changes
        this.on('gameStateChanged', this.onGameStateChanged);
        this.on('weaponChanged', this.onWeaponChanged);
        this.on('mathQuizStarted', this.onMathQuizStarted);
        this.on('mathQuizCompleted', this.onMathQuizCompleted);
    }

    onUpdate(time, delta) {
        // Update input state
        this.updateMovementInput();
        this.updateCombatInput(time);
        this.updateWeaponSwitching(time);
        this.updateAbilityInput();
        
        // Update crosshair
        if (this.crosshair) {
            this.updateCrosshair();
        }
        
        // Update touch controls
        this.updateTouchControls();
        
        // Process input history
        this.processInputHistory();
    }

    updateMovementInput() {
        let x = 0;
        let y = 0;
        
        // Keyboard movement
        if (this.isActionPressed('moveUp')) y -= 1;
        if (this.isActionPressed('moveDown')) y += 1;
        if (this.isActionPressed('moveLeft')) x -= 1;
        if (this.isActionPressed('moveRight')) x += 1;
        
        // Touch movement (already handled in touch controls)
        if (this.touchEnabled) {
            x = this.inputState.movement.x;
            y = this.inputState.movement.y;
        }
        
        // Normalize diagonal movement
        if (x !== 0 && y !== 0) {
            const length = Math.sqrt(x * x + y * y);
            x /= length;
            y /= length;
        }
        
        this.inputState.movement.x = x;
        this.inputState.movement.y = y;
        
        // Emit movement event
        if (x !== 0 || y !== 0) {
            this.emit('playerMovement', {
                x: x,
                y: y,
                magnitude: Math.sqrt(x * x + y * y)
            });
        }
    }

    updateCombatInput(time) {
        const firing = this.isActionPressed('fire') || this.inputState.firing;
        const weaponConfig = GameConfig.weapons[this.currentWeapon];
        
        if (firing && weaponConfig) {
            const timeSinceLastFire = time - this.inputState.lastFireTime;
            
            if (timeSinceLastFire >= weaponConfig.fireRate) {
                this.emit('weaponFired', {
                    weaponType: this.currentWeapon,
                    targetX: this.mouse.x,
                    targetY: this.mouse.y,
                    fireTime: time
                });
                
                this.inputState.lastFireTime = time;
            }
        }
        
        // Reload
        if (this.isActionJustPressed('reload')) {
            this.emit('weaponReload', {
                weaponType: this.currentWeapon
            });
        }
    }

    updateWeaponSwitching(time) {
        // Check weapon number keys
        for (let i = 1; i <= 4; i++) {
            if (this.isActionJustPressed(`weapon${i}`)) {
                const weaponIndex = i - 1;
                if (weaponIndex < this.availableWeapons.length) {
                    this.switchToWeapon(weaponIndex);
                }
            }
        }
        
        // Check next/prev weapon
        if (this.isActionJustPressed('nextWeapon')) {
            this.switchToNextWeapon();
        }
        
        if (this.isActionJustPressed('prevWeapon')) {
            this.switchToPrevWeapon();
        }
    }

    updateAbilityInput() {
        const abilities = Object.keys(GameConfig.abilities);
        
        for (let i = 1; i <= 5; i++) {
            if (this.isActionJustPressed(`ability${i}`)) {
                const abilityIndex = i - 1;
                if (abilityIndex < abilities.length) {
                    const abilityKey = abilities[abilityIndex];
                    this.emit('abilityRequested', {
                        ability: abilityKey,
                        inputMethod: 'keyboard'
                    });
                }
            }
        }
    }

    updateTouchControls() {
        if (!this.touchEnabled) return;
        
        // Update weapon button icon
        if (this.touchControls.weaponButton) {
            const weaponConfig = GameConfig.weapons[this.currentWeapon];
            this.touchControls.weaponButton.icon.setText(weaponConfig.icon);
        }
    }

    processInputHistory() {
        // Clean old entries
        const currentTime = Date.now();
        this.inputHistory = this.inputHistory.filter(entry => 
            currentTime - entry.timestamp < 2000 // Keep last 2 seconds
        );
        
        // Check for combo patterns
        this.checkForCombos();
    }

    checkForCombos() {
        // Example combo: Up, Up, Down, Down, Left, Right, Left, Right
        const konamiCode = ['moveUp', 'moveUp', 'moveDown', 'moveDown', 
                           'moveLeft', 'moveRight', 'moveLeft', 'moveRight'];
        
        if (this.inputHistory.length >= konamiCode.length) {
            const recent = this.inputHistory.slice(-konamiCode.length);
            const matches = recent.every((entry, index) => 
                entry.action === konamiCode[index]
            );
            
            if (matches) {
                this.emit('comboExecuted', {
                    combo: 'konami',
                    effect: 'cheat_mode'
                });
                
                // Clear history to prevent repeated triggers
                this.inputHistory = [];
            }
        }
    }

    // Weapon switching methods
    switchToWeapon(index) {
        if (index < 0 || index >= this.availableWeapons.length) return;
        
        const newWeapon = this.availableWeapons[index];
        if (newWeapon === this.currentWeapon) return;
        
        if (this.canSwitchWeapon()) {
            this.currentWeapon = newWeapon;
            this.currentWeaponIndex = index;
            this.lastWeaponSwitch = Date.now();
            
            this.emit('weaponChanged', {
                weapon: this.currentWeapon,
                index: this.currentWeaponIndex,
                config: GameConfig.weapons[this.currentWeapon]
            });
            
            this.log(`Switched to weapon: ${this.currentWeapon}`);
        }
    }

    switchToNextWeapon() {
        const nextIndex = (this.currentWeaponIndex + 1) % this.availableWeapons.length;
        this.switchToWeapon(nextIndex);
    }

    switchToPrevWeapon() {
        const prevIndex = (this.currentWeaponIndex - 1 + this.availableWeapons.length) % this.availableWeapons.length;
        this.switchToWeapon(prevIndex);
    }

    canSwitchWeapon() {
        const timeSinceLastSwitch = Date.now() - this.lastWeaponSwitch;
        return timeSinceLastSwitch >= GameConfig.timing.weaponSwitchCooldown;
    }

    // Input checking methods
    isActionPressed(action) {
        const keys = this.keyBindings[action];
        if (!keys) return false;
        
        return keys.some(key => {
            if (key === 'MOUSE_LEFT') {
                return this.mouse.isDown;
            } else if (key.startsWith('MOUSE_')) {
                return false; // Handle other mouse buttons if needed
            } else {
                const keyObj = this.keys[key];
                return keyObj && keyObj.isDown;
            }
        });
    }

    isActionJustPressed(action) {
        const keys = this.keyBindings[action];
        if (!keys) return false;
        
        return keys.some(key => {
            if (key === 'MOUSE_LEFT') {
                return this.mouse.justPressed;
            } else if (key.startsWith('MOUSE_')) {
                return false; // Handle other mouse buttons if needed
            } else {
                const keyObj = this.keys[key];
                return keyObj && Phaser.Input.Keyboard.JustDown(keyObj);
            }
        });
    }

    isActionJustReleased(action) {
        const keys = this.keyBindings[action];
        if (!keys) return false;
        
        return keys.some(key => {
            if (key === 'MOUSE_LEFT') {
                return this.mouse.justReleased;
            } else if (key.startsWith('MOUSE_')) {
                return false; // Handle other mouse buttons if needed
            } else {
                const keyObj = this.keys[key];
                return keyObj && Phaser.Input.Keyboard.JustUp(keyObj);
            }
        });
    }

    // Event handlers
    onKeyDown(event) {
        // Add to input history
        const action = this.getActionFromKey(event.code);
        if (action) {
            this.inputHistory.push({
                action,
                timestamp: Date.now(),
                type: 'keydown'
            });
            
            // Limit history length
            if (this.inputHistory.length > this.maxHistoryLength) {
                this.inputHistory.shift();
            }
        }
        
        // Handle special keys
        if (this.isActionJustPressed('debug')) {
            this.emit('debugToggle');
        }
        
        if (this.isActionJustPressed('pause')) {
            this.emit('gamePause');
        }
    }

    onKeyUp(event) {
        // Handle key release events if needed
    }

    onMouseMove(pointer) {
        this.mouse.x = pointer.x;
        this.mouse.y = pointer.y;
        
        this.emit('crosshairMoved', {
            x: this.mouse.x,
            y: this.mouse.y
        });
    }

    onMouseDown(pointer) {
        this.mouse.isDown = true;
        this.mouse.justPressed = true;
        
        // Reset just pressed flag after a frame
        this.scene.time.delayedCall(16, () => {
            this.mouse.justPressed = false;
        });
    }

    onMouseUp(pointer) {
        this.mouse.isDown = false;
        this.mouse.justReleased = true;
        
        // Reset just released flag after a frame
        this.scene.time.delayedCall(16, () => {
            this.mouse.justReleased = false;
        });
    }

    onMouseWheel(pointer, gameObjects, deltaX, deltaY, deltaZ) {
        if (deltaY > 0) {
            this.switchToNextWeapon();
        } else if (deltaY < 0) {
            this.switchToPrevWeapon();
        }
    }

    getActionFromKey(keyCode) {
        for (const [action, keys] of Object.entries(this.keyBindings)) {
            if (keys.includes(keyCode)) {
                return action;
            }
        }
        return null;
    }

    // Event handlers for game state
    onGameStateChanged(data) {
        // Adjust input handling based on game state
        if (data.state === 'paused') {
            this.disableGameplayInput();
        } else if (data.state === 'playing') {
            this.enableGameplayInput();
        }
    }

    onWeaponChanged(data) {
        // Update UI or other systems when weapon changes
        this.log(`Weapon changed to: ${data.weapon}`);
    }

    onMathQuizStarted() {
        // Disable combat input during math quiz
        this.disableCombatInput();
    }

    onMathQuizCompleted() {
        // Re-enable combat input after math quiz
        this.enableCombatInput();
    }

    // Input state management
    disableGameplayInput() {
        this.gameplayInputEnabled = false;
    }

    enableGameplayInput() {
        this.gameplayInputEnabled = true;
    }

    disableCombatInput() {
        this.combatInputEnabled = false;
    }

    enableCombatInput() {
        this.combatInputEnabled = true;
    }

    // Public API
    getCurrentWeapon() {
        return this.currentWeapon;
    }

    getMovementInput() {
        return this.inputState.movement;
    }

    getMousePosition() {
        return { x: this.mouse.x, y: this.mouse.y };
    }

    setCrosshairEnabled(enabled) {
        this.crosshairEnabled = enabled;
        
        if (this.crosshair) {
            this.crosshair.setVisible(enabled);
        }
        
        if (enabled) {
            this.scene.input.setDefaultCursor('none');
        } else {
            this.scene.input.setDefaultCursor('default');
        }
    }

    addCustomKeyBinding(action, keys) {
        this.keyBindings[action] = keys;
        
        // Create key objects for new bindings
        keys.forEach(key => {
            if (!key.startsWith('MOUSE_') && !this.keys[key]) {
                try {
                    this.keys[key] = this.scene.input.keyboard.addKey(key);
                } catch (error) {
                    this.warn(`Failed to create key binding for: ${key}`);
                }
            }
        });
    }

    getInputMetrics() {
        return {
            totalKeysTracked: Object.keys(this.keys).length,
            inputHistoryLength: this.inputHistory.length,
            currentWeapon: this.currentWeapon,
            weaponSwitchCooldownRemaining: Math.max(0, 
                GameConfig.timing.weaponSwitchCooldown - (Date.now() - this.lastWeaponSwitch)
            ),
            touchEnabled: this.touchEnabled,
            crosshairEnabled: this.crosshairEnabled
        };
    }

    onCleanup() {
        // Remove event listeners
        this.scene.input.keyboard.off('keydown', this.onKeyDown, this);
        this.scene.input.keyboard.off('keyup', this.onKeyUp, this);
        this.scene.input.off('pointermove', this.onMouseMove, this);
        this.scene.input.off('pointerdown', this.onMouseDown, this);
        this.scene.input.off('pointerup', this.onMouseUp, this);
        this.scene.input.off('wheel', this.onMouseWheel, this);
        
        // Clean up crosshair
        if (this.crosshair) {
            this.crosshair.destroy();
        }
        
        // Clean up touch controls
        Object.values(this.touchControls).forEach(control => {
            if (control && control.destroy) {
                control.destroy();
            }
        });
        
        // Restore cursor
        this.scene.input.setDefaultCursor('default');
    }
} 