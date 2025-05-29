/**
 * PixelArtGenerator - Advanced pixel art character generation for Phaser 3
 * Creates detailed, animated character sprites with customization options
 */
export class PixelArtGenerator {
    constructor(scene) {
        this.scene = scene;
        this.spriteCache = new Map();
        this.animationCache = new Map();
        
        // Pixel art configuration
        this.pixelSize = 4; // Scale factor for pixel art
        this.baseSize = { width: 32, height: 32 }; // Base sprite size
        this.animationFrames = 8; // Frames per animation
        
        // Color palettes for different character types
        this.colorPalettes = {
            aria: {
                primary: '#4A90E2',    // Blue
                secondary: '#7ED321',  // Green
                accent: '#F5A623',     // Orange
                dark: '#2C3E50',       // Dark blue
                light: '#ECF0F1'       // Light gray
            },
            titan: {
                primary: '#E74C3C',    // Red
                secondary: '#95A5A6',  // Gray
                accent: '#F39C12',     // Orange
                dark: '#34495E',       // Dark gray
                light: '#BDC3C7'       // Light gray
            },
            nexus: {
                primary: '#9B59B6',    // Purple
                secondary: '#1ABC9C',  // Teal
                accent: '#E67E22',     // Orange
                dark: '#2C3E50',       // Dark
                light: '#ECF0F1'       // Light
            }
        };
    }

    /**
     * Generate a detailed character sprite with animations
     */
    generateCharacterSprite(characterType, config = {}) {
        const cacheKey = `${characterType}_${JSON.stringify(config)}`;
        
        if (this.spriteCache.has(cacheKey)) {
            return this.spriteCache.get(cacheKey);
        }

        const palette = this.colorPalettes[characterType] || this.colorPalettes.aria;
        const spriteData = this.createCharacterSpriteData(characterType, palette, config);
        
        // Create texture from sprite data
        const texture = this.createTextureFromData(spriteData, cacheKey);
        
        // Cache the result
        this.spriteCache.set(cacheKey, texture);
        
        return texture;
    }

    /**
     * Create sprite data for character
     */
    createCharacterSpriteData(characterType, palette, config) {
        const { width, height } = this.baseSize;
        const frames = [];
        
        // Generate different animation frames
        for (let frame = 0; frame < this.animationFrames; frame++) {
            const frameData = this.createCharacterFrame(characterType, palette, frame, config);
            frames.push(frameData);
        }
        
        return {
            frames,
            width: width * this.pixelSize,
            height: height * this.pixelSize,
            frameWidth: width * this.pixelSize,
            frameHeight: height * this.pixelSize
        };
    }

    /**
     * Create a single animation frame
     */
    createCharacterFrame(characterType, palette, frameIndex, config) {
        const { width, height } = this.baseSize;
        const canvas = document.createElement('canvas');
        canvas.width = width * this.pixelSize;
        canvas.height = height * this.pixelSize;
        const ctx = canvas.getContext('2d');
        
        // Disable image smoothing for pixel art
        ctx.imageSmoothingEnabled = false;
        
        // Draw character based on type
        switch (characterType) {
            case 'aria':
                this.drawAriaFrame(ctx, palette, frameIndex, config);
                break;
            case 'titan':
                this.drawTitanFrame(ctx, palette, frameIndex, config);
                break;
            case 'nexus':
                this.drawNexusFrame(ctx, palette, frameIndex, config);
                break;
            default:
                this.drawDefaultFrame(ctx, palette, frameIndex, config);
        }
        
        return canvas;
    }

    /**
     * Draw Aria character frame (Cyber Specialist)
     */
    drawAriaFrame(ctx, palette, frameIndex, config) {
        const animOffset = Math.sin(frameIndex * 0.785) * 2; // Subtle animation
        
        // Body
        this.drawPixelRect(ctx, 12, 16 + animOffset, 8, 12, palette.primary);
        
        // Head
        this.drawPixelRect(ctx, 10, 6 + animOffset, 12, 10, palette.light);
        
        // Helmet/Visor
        this.drawPixelRect(ctx, 8, 4 + animOffset, 16, 8, palette.primary);
        this.drawPixelRect(ctx, 10, 6 + animOffset, 12, 4, palette.secondary);
        
        // Arms
        this.drawPixelRect(ctx, 6, 18 + animOffset, 4, 8, palette.primary);
        this.drawPixelRect(ctx, 22, 18 + animOffset, 4, 8, palette.primary);
        
        // Legs
        this.drawPixelRect(ctx, 10, 28 + animOffset, 4, 8, palette.dark);
        this.drawPixelRect(ctx, 18, 28 + animOffset, 4, 8, palette.dark);
        
        // Weapon/Tool
        this.drawPixelRect(ctx, 26, 16 + animOffset, 4, 2, palette.accent);
        
        // Energy effects (animated)
        if (frameIndex % 4 < 2) {
            this.drawPixelRect(ctx, 4, 12 + animOffset, 2, 2, palette.secondary);
            this.drawPixelRect(ctx, 26, 12 + animOffset, 2, 2, palette.secondary);
        }
    }

    /**
     * Draw Titan character frame (Heavy Assault)
     */
    drawTitanFrame(ctx, palette, frameIndex, config) {
        const animOffset = Math.sin(frameIndex * 0.785) * 1;
        
        // Body (larger)
        this.drawPixelRect(ctx, 10, 14 + animOffset, 12, 16, palette.primary);
        
        // Head
        this.drawPixelRect(ctx, 12, 4 + animOffset, 8, 10, palette.light);
        
        // Armor plating
        this.drawPixelRect(ctx, 8, 12 + animOffset, 16, 4, palette.secondary);
        this.drawPixelRect(ctx, 6, 16 + animOffset, 20, 2, palette.dark);
        
        // Arms (bulky)
        this.drawPixelRect(ctx, 4, 16 + animOffset, 6, 10, palette.primary);
        this.drawPixelRect(ctx, 22, 16 + animOffset, 6, 10, palette.primary);
        
        // Legs (thick)
        this.drawPixelRect(ctx, 8, 30 + animOffset, 6, 8, palette.dark);
        this.drawPixelRect(ctx, 18, 30 + animOffset, 6, 8, palette.dark);
        
        // Heavy weapon
        this.drawPixelRect(ctx, 28, 14 + animOffset, 6, 8, palette.accent);
        
        // Exhaust/Steam effects
        if (frameIndex % 3 === 0) {
            this.drawPixelRect(ctx, 2, 20 + animOffset, 2, 2, palette.light);
            this.drawPixelRect(ctx, 28, 20 + animOffset, 2, 2, palette.light);
        }
    }

    /**
     * Draw Nexus character frame (Tech Specialist)
     */
    drawNexusFrame(ctx, palette, frameIndex, config) {
        const animOffset = Math.sin(frameIndex * 0.785) * 3;
        
        // Body (sleek)
        this.drawPixelRect(ctx, 12, 16 + animOffset, 8, 12, palette.primary);
        
        // Head
        this.drawPixelRect(ctx, 10, 6 + animOffset, 12, 10, palette.light);
        
        // Tech interface
        this.drawPixelRect(ctx, 8, 4 + animOffset, 16, 6, palette.secondary);
        
        // Arms (with tech attachments)
        this.drawPixelRect(ctx, 6, 18 + animOffset, 4, 8, palette.primary);
        this.drawPixelRect(ctx, 22, 18 + animOffset, 4, 8, palette.primary);
        this.drawPixelRect(ctx, 4, 20 + animOffset, 2, 4, palette.accent);
        this.drawPixelRect(ctx, 26, 20 + animOffset, 2, 4, palette.accent);
        
        // Legs
        this.drawPixelRect(ctx, 10, 28 + animOffset, 4, 8, palette.dark);
        this.drawPixelRect(ctx, 18, 28 + animOffset, 4, 8, palette.dark);
        
        // Holographic displays (animated)
        const glowFrame = frameIndex % 6;
        if (glowFrame < 3) {
            this.drawPixelRect(ctx, 2, 8 + animOffset, 4, 4, palette.secondary);
            this.drawPixelRect(ctx, 26, 8 + animOffset, 4, 4, palette.secondary);
        }
        
        // Data streams
        if (frameIndex % 2 === 0) {
            this.drawPixelRect(ctx, 14, 2 + animOffset, 2, 2, palette.accent);
            this.drawPixelRect(ctx, 16, 4 + animOffset, 2, 2, palette.accent);
        }
    }

    /**
     * Draw default character frame
     */
    drawDefaultFrame(ctx, palette, frameIndex, config) {
        const animOffset = Math.sin(frameIndex * 0.785) * 2;
        
        // Basic humanoid shape
        this.drawPixelRect(ctx, 12, 16 + animOffset, 8, 12, palette.primary);
        this.drawPixelRect(ctx, 10, 6 + animOffset, 12, 10, palette.light);
        this.drawPixelRect(ctx, 6, 18 + animOffset, 4, 8, palette.primary);
        this.drawPixelRect(ctx, 22, 18 + animOffset, 4, 8, palette.primary);
        this.drawPixelRect(ctx, 10, 28 + animOffset, 4, 8, palette.dark);
        this.drawPixelRect(ctx, 18, 28 + animOffset, 4, 8, palette.dark);
    }

    /**
     * Draw a pixel-perfect rectangle
     */
    drawPixelRect(ctx, x, y, width, height, color) {
        ctx.fillStyle = color;
        ctx.fillRect(
            Math.floor(x * this.pixelSize),
            Math.floor(y * this.pixelSize),
            width * this.pixelSize,
            height * this.pixelSize
        );
    }

    /**
     * Create Phaser texture from sprite data
     */
    createTextureFromData(spriteData, textureKey) {
        // Create sprite sheet canvas
        const sheetWidth = spriteData.frameWidth * spriteData.frames.length;
        const sheetHeight = spriteData.frameHeight;
        
        const sheetCanvas = document.createElement('canvas');
        sheetCanvas.width = sheetWidth;
        sheetCanvas.height = sheetHeight;
        const sheetCtx = sheetCanvas.getContext('2d');
        
        // Draw all frames to sprite sheet
        spriteData.frames.forEach((frame, index) => {
            sheetCtx.drawImage(
                frame,
                index * spriteData.frameWidth,
                0
            );
        });
        
        // Create Phaser texture
        if (this.scene.textures.exists(textureKey)) {
            this.scene.textures.remove(textureKey);
        }
        
        this.scene.textures.addCanvas(textureKey, sheetCanvas);
        
        // Add frame configuration for animations
        this.scene.textures.get(textureKey).add('__BASE', 0, 0, 0, 
            spriteData.frameWidth, spriteData.frameHeight);
        
        // Add individual frames
        for (let i = 0; i < spriteData.frames.length; i++) {
            this.scene.textures.get(textureKey).add(
                `frame_${i}`,
                0,
                i * spriteData.frameWidth,
                0,
                spriteData.frameWidth,
                spriteData.frameHeight
            );
        }
        
        return textureKey;
    }

    /**
     * Create animations for character
     */
    createCharacterAnimations(textureKey, characterType) {
        const animKey = `${characterType}_anim`;
        
        if (this.scene.anims.exists(animKey)) {
            return animKey;
        }
        
        // Create idle animation
        const frames = [];
        for (let i = 0; i < this.animationFrames; i++) {
            frames.push({ key: textureKey, frame: `frame_${i}` });
        }
        
        this.scene.anims.create({
            key: animKey,
            frames: frames,
            frameRate: 8,
            repeat: -1
        });
        
        // Create additional animations
        this.createCombatAnimations(textureKey, characterType);
        
        return animKey;
    }

    /**
     * Create combat-specific animations
     */
    createCombatAnimations(textureKey, characterType) {
        // Attack animation
        this.scene.anims.create({
            key: `${characterType}_attack`,
            frames: [
                { key: textureKey, frame: 'frame_0' },
                { key: textureKey, frame: 'frame_2' },
                { key: textureKey, frame: 'frame_4' },
                { key: textureKey, frame: 'frame_0' }
            ],
            frameRate: 12,
            repeat: 0
        });
        
        // Damage animation
        this.scene.anims.create({
            key: `${characterType}_damage`,
            frames: [
                { key: textureKey, frame: 'frame_1' },
                { key: textureKey, frame: 'frame_3' }
            ],
            frameRate: 10,
            repeat: 2
        });
        
        // Victory animation
        this.scene.anims.create({
            key: `${characterType}_victory`,
            frames: [
                { key: textureKey, frame: 'frame_0' },
                { key: textureKey, frame: 'frame_2' },
                { key: textureKey, frame: 'frame_4' },
                { key: textureKey, frame: 'frame_6' }
            ],
            frameRate: 6,
            repeat: -1
        });
    }

    /**
     * Generate enemy sprites with variations
     */
    generateEnemySprite(enemyType, difficulty = 1) {
        const enemyPalettes = {
            scout: {
                primary: '#FF6B6B',
                secondary: '#4ECDC4',
                accent: '#45B7D1',
                dark: '#2C3E50',
                light: '#95A5A6'
            },
            warrior: {
                primary: '#E74C3C',
                secondary: '#34495E',
                accent: '#F39C12',
                dark: '#2C3E50',
                light: '#BDC3C7'
            },
            destroyer: {
                primary: '#8E44AD',
                secondary: '#E74C3C',
                accent: '#F1C40F',
                dark: '#2C3E50',
                light: '#ECF0F1'
            }
        };
        
        const palette = enemyPalettes[enemyType] || enemyPalettes.scout;
        const config = { difficulty, isEnemy: true };
        
        return this.generateCharacterSprite(`enemy_${enemyType}`, config);
    }

    /**
     * Clear sprite cache
     */
    clearCache() {
        this.spriteCache.clear();
        this.animationCache.clear();
    }

    /**
     * Get cache statistics
     */
    getCacheStats() {
        return {
            spritesGenerated: this.spriteCache.size,
            animationsCreated: this.animationCache.size,
            memoryUsage: this.estimateMemoryUsage()
        };
    }

    /**
     * Estimate memory usage of cached sprites
     */
    estimateMemoryUsage() {
        const avgSpriteSize = this.baseSize.width * this.baseSize.height * this.pixelSize * this.pixelSize * 4; // RGBA
        return (this.spriteCache.size * avgSpriteSize * this.animationFrames) / 1024 / 1024; // MB
    }
} 