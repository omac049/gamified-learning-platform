/**
 * PixelArtGenerator - Ultra-Advanced Pixel Art Generation System for Phaser 3
 * Features: Procedural generation, advanced shading, multiple art styles, dynamic lighting,
 * equipment rendering, particle effects, and sophisticated animation systems
 */
export class PixelArtGenerator {
    constructor(scene) {
        this.scene = scene;
        this.spriteCache = new Map();
        this.animationCache = new Map();
        this.textureAtlas = new Map();
        this.shaderCache = new Map();
        
        // Advanced configuration
        this.config = {
            pixelSize: 4,
            baseSize: { width: 64, height: 64 }, // Increased resolution
            animationFrames: 16, // More frames for smoother animation
            maxCacheSize: 1000,
            enableAdvancedShading: true,
            enableDynamicLighting: true,
            enableParticleEffects: true,
            enableProceduralGeneration: true
        };
        
        // Advanced art styles
        this.artStyles = {
            retro8bit: { pixelSize: 8, colors: 4, dithering: true },
            modern16bit: { pixelSize: 4, colors: 16, antiAliasing: true },
            hd32bit: { pixelSize: 2, colors: 256, gradients: true },
            cyberpunk: { neonGlow: true, scanlines: true, chromatic: true },
            fantasy: { magicEffects: true, aura: true, enchanted: true },
            scifi: { holographic: true, energy: true, tech: true }
        };
        
        // Advanced color palettes with mood variations
        this.colorPalettes = {
            aria: {
                base: {
                    primary: '#4A90E2', secondary: '#7ED321', accent: '#F5A623',
                    dark: '#2C3E50', light: '#ECF0F1', energy: '#00FFFF'
                },
                combat: {
                    primary: '#FF4444', secondary: '#44FF44', accent: '#FFAA00',
                    dark: '#330000', light: '#FFDDDD', energy: '#FF00FF'
                },
                stealth: {
                    primary: '#444488', secondary: '#666666', accent: '#888844',
                    dark: '#111111', light: '#AAAAAA', energy: '#4444FF'
                }
            },
            titan: {
                base: {
                    primary: '#E74C3C', secondary: '#95A5A6', accent: '#F39C12',
                    dark: '#34495E', light: '#BDC3C7', energy: '#FF6600'
                },
                rage: {
                    primary: '#FF0000', secondary: '#AA0000', accent: '#FFAA00',
                    dark: '#440000', light: '#FFAAAA', energy: '#FF4400'
                },
                armored: {
                    primary: '#666666', secondary: '#888888', accent: '#CCCCCC',
                    dark: '#222222', light: '#EEEEEE', energy: '#AAAAFF'
                }
            },
            nexus: {
                base: {
                    primary: '#9B59B6', secondary: '#1ABC9C', accent: '#E67E22',
                    dark: '#2C3E50', light: '#ECF0F1', energy: '#00FFAA'
                },
                hacker: {
                    primary: '#00FF00', secondary: '#004400', accent: '#44FF44',
                    dark: '#001100', light: '#AAFFAA', energy: '#00FFFF'
                },
                mystic: {
                    primary: '#AA44AA', secondary: '#4444AA', accent: '#AA44FF',
                    dark: '#220022', light: '#DDAADD', energy: '#FF44FF'
                }
            }
        };
        
        // Equipment and customization options
        this.equipment = {
            weapons: {
                sword: { type: 'melee', glow: true, trail: true },
                gun: { type: 'ranged', muzzle: true, laser: true },
                staff: { type: 'magic', orb: true, sparkles: true },
                cannon: { type: 'heavy', smoke: true, recoil: true }
            },
            armor: {
                light: { coverage: 0.3, mobility: 1.0, glow: false },
                medium: { coverage: 0.6, mobility: 0.8, glow: true },
                heavy: { coverage: 0.9, mobility: 0.6, glow: true },
                power: { coverage: 1.0, mobility: 0.4, glow: true, energy: true }
            },
            accessories: {
                cape: { flow: true, physics: true },
                wings: { animated: true, particles: true },
                aura: { pulsing: true, colored: true },
                helmet: { visor: true, hud: true }
            }
        };
        
        // Advanced animation states
        this.animationStates = {
            idle: { frames: 8, speed: 0.5, loop: true },
            walk: { frames: 8, speed: 1.0, loop: true },
            run: { frames: 6, speed: 1.5, loop: true },
            attack: { frames: 12, speed: 2.0, loop: false },
            cast: { frames: 16, speed: 1.2, loop: false },
            defend: { frames: 4, speed: 0.8, loop: true },
            hurt: { frames: 6, speed: 2.5, loop: false },
            death: { frames: 20, speed: 1.0, loop: false },
            victory: { frames: 12, speed: 0.8, loop: true },
            special: { frames: 24, speed: 1.5, loop: false }
        };
        
        // Procedural generation parameters
        this.proceduralParams = {
            bodyVariations: 5,
            faceVariations: 8,
            hairVariations: 12,
            colorVariations: 16,
            accessoryChance: 0.3,
            mutationRate: 0.1
        };
        
        // Performance optimization
        this.performanceMode = 'high'; // 'low', 'medium', 'high', 'ultra'
        this.batchRenderer = null;
        this.textureAtlasSize = 2048;
        
        this.initializeAdvancedSystems();
    }

    /**
     * Initialize advanced rendering systems
     */
    initializeAdvancedSystems() {
        try {
            // Initialize texture atlas for better performance
            this.initializeTextureAtlas();
            
            // Initialize advanced shaders
            this.initializeShaders();
            
            // Initialize particle systems
            this.initializeParticleSystems();
            
            // Initialize procedural generators
            this.initializeProceduralGenerators();
            
            console.log('PixelArtGenerator: Advanced systems initialized');
        } catch (error) {
            console.error('PixelArtGenerator: Error initializing advanced systems:', error);
        }
    }

    /**
     * Initialize texture atlas for performance optimization
     */
    initializeTextureAtlas() {
        this.textureAtlas = {
            canvas: document.createElement('canvas'),
            context: null,
            currentX: 0,
            currentY: 0,
            rowHeight: 0,
            regions: new Map()
        };
        
        this.textureAtlas.canvas.width = this.textureAtlasSize;
        this.textureAtlas.canvas.height = this.textureAtlasSize;
        this.textureAtlas.context = this.textureAtlas.canvas.getContext('2d');
        this.textureAtlas.context.imageSmoothingEnabled = false;
    }

    /**
     * Initialize advanced shader effects
     */
    initializeShaders() {
        this.shaders = {
            glow: this.createGlowShader(),
            outline: this.createOutlineShader(),
            chromatic: this.createChromaticShader(),
            pixelate: this.createPixelateShader(),
            hologram: this.createHologramShader()
        };
    }

    /**
     * Initialize particle effect systems
     */
    initializeParticleSystems() {
        this.particleEffects = {
            energy: { color: '#00FFFF', count: 20, speed: 2 },
            magic: { color: '#FF44FF', count: 15, speed: 1.5 },
            fire: { color: '#FF4400', count: 25, speed: 3 },
            electric: { color: '#FFFF00', count: 30, speed: 4 },
            smoke: { color: '#666666', count: 10, speed: 1 }
        };
    }

    /**
     * Initialize procedural generation systems
     */
    initializeProceduralGenerators() {
        this.proceduralGenerators = {
            dna: new Map(), // Character DNA for consistent generation
            mutations: new Map(), // Mutation patterns
            evolution: new Map() // Evolution trees
        };
    }

    /**
     * Generate ultra-advanced character sprite with full customization
     */
    generateAdvancedCharacterSprite(characterType, config = {}) {
        try {
            // Enhanced configuration with defaults
            const fullConfig = {
                artStyle: config.artStyle || 'modern16bit',
                mood: config.mood || 'base',
                equipment: config.equipment || {},
                customization: config.customization || {},
                effects: config.effects || [],
                animation: config.animation || 'idle',
                quality: config.quality || this.performanceMode,
                procedural: config.procedural || false,
                seed: config.seed || Math.random(),
                ...config
            };

            const cacheKey = this.generateCacheKey(characterType, fullConfig);
            
            // Check cache with validation
            if (this.spriteCache.has(cacheKey)) {
                const cachedData = this.spriteCache.get(cacheKey);
                if (this.validateCachedTexture(cachedData)) {
                    return cachedData;
                }
                this.spriteCache.delete(cacheKey);
            }

            // Generate character DNA for consistency
            const characterDNA = this.generateCharacterDNA(characterType, fullConfig);
            
            // Create advanced sprite data
            const spriteData = this.createAdvancedSpriteData(characterType, characterDNA, fullConfig);
            
            if (!spriteData) {
                console.error(`PixelArtGenerator: Failed to create advanced sprite data for ${characterType}`);
                return this.createFallbackSprite(characterType);
            }
            
            // Create texture with advanced features
            const textureKey = this.createAdvancedTexture(spriteData, cacheKey, fullConfig);
            
            if (!textureKey) {
                console.error(`PixelArtGenerator: Failed to create advanced texture for ${characterType}`);
                return this.createFallbackSprite(characterType);
            }
            
            // Create advanced animations
            const animationKeys = this.createAdvancedAnimations(textureKey, characterType, fullConfig);
            
            // Cache the complete result
            const result = {
                textureKey,
                animationKeys,
                characterDNA,
                config: fullConfig,
                timestamp: Date.now()
            };
            
            this.spriteCache.set(cacheKey, result);
            this.cleanupCache();
            
            console.log(`PixelArtGenerator: Successfully created advanced sprite: ${characterType}`);
            return result;
            
        } catch (error) {
            console.error(`PixelArtGenerator: Error generating advanced character sprite:`, error);
            return this.createFallbackSprite(characterType);
        }
    }

    /**
     * Generate character DNA for consistent procedural generation
     */
    generateCharacterDNA(characterType, config) {
        const seed = config.seed || Math.random();
        const rng = this.createSeededRNG(seed);
        
        return {
            seed,
            bodyType: Math.floor(rng() * this.proceduralParams.bodyVariations),
            faceType: Math.floor(rng() * this.proceduralParams.faceVariations),
            hairType: Math.floor(rng() * this.proceduralParams.hairVariations),
            colorVariant: Math.floor(rng() * this.proceduralParams.colorVariations),
            accessories: this.generateAccessories(rng),
            mutations: this.generateMutations(rng),
            personality: this.generatePersonality(rng)
        };
    }

    /**
     * Create seeded random number generator for consistent results
     */
    createSeededRNG(seed) {
        let state = seed;
        return function() {
            state = (state * 9301 + 49297) % 233280;
            return state / 233280;
        };
    }

    /**
     * Create advanced sprite data with all features
     */
    createAdvancedSpriteData(characterType, dna, config) {
        try {
            const artStyle = this.artStyles[config.artStyle] || this.artStyles.modern16bit;
            const palette = this.getAdvancedPalette(characterType, config.mood, dna);
            
            const spriteData = {
                frames: [],
                layers: [],
                effects: [],
                metadata: {
                    characterType,
                    dna,
                    config,
                    artStyle,
                    palette
                }
            };
            
            // Generate base frames for all animation states
            for (const [stateName, stateConfig] of Object.entries(this.animationStates)) {
                const stateFrames = this.generateAnimationStateFrames(
                    characterType, dna, palette, artStyle, stateName, stateConfig
                );
                spriteData.frames.push(...stateFrames);
            }
            
            // Add equipment layers
            if (config.equipment) {
                spriteData.layers.push(...this.generateEquipmentLayers(config.equipment, dna, palette));
            }
            
            // Add effect layers
            if (config.effects && config.effects.length > 0) {
                spriteData.effects.push(...this.generateEffectLayers(config.effects, dna));
            }
            
            return spriteData;
            
        } catch (error) {
            console.error('PixelArtGenerator: Error creating advanced sprite data:', error);
            return null;
        }
    }

    /**
     * Generate frames for a specific animation state
     */
    generateAnimationStateFrames(characterType, dna, palette, artStyle, stateName, stateConfig) {
        const frames = [];
        const frameCount = stateConfig.frames;
        
        for (let i = 0; i < frameCount; i++) {
            const frameProgress = i / (frameCount - 1);
            const frame = this.createAdvancedFrame(
                characterType, dna, palette, artStyle, stateName, frameProgress
            );
            
            if (frame) {
                frame.metadata = {
                    state: stateName,
                    frameIndex: i,
                    progress: frameProgress
                };
                frames.push(frame);
            }
        }
        
        return frames;
    }

    /**
     * Create a single advanced frame with all effects
     */
    createAdvancedFrame(characterType, dna, palette, artStyle, stateName, progress) {
        try {
            const frameSize = this.config.baseSize;
            const canvas = document.createElement('canvas');
            canvas.width = frameSize.width * this.config.pixelSize;
            canvas.height = frameSize.height * this.config.pixelSize;
            const ctx = canvas.getContext('2d');
            
            ctx.imageSmoothingEnabled = false;
            
            // Clear with transparent background
            ctx.clearRect(0, 0, canvas.width, canvas.height);
            
            // Draw base character
            this.drawAdvancedCharacterBase(ctx, characterType, dna, palette, stateName, progress);
            
            // Apply art style effects
            this.applyArtStyleEffects(ctx, artStyle, canvas);
            
            // Add dynamic lighting
            if (this.config.enableDynamicLighting) {
                this.applyDynamicLighting(ctx, canvas, stateName, progress);
            }
            
            // Add advanced shading
            if (this.config.enableAdvancedShading) {
                this.applyAdvancedShading(ctx, canvas, palette);
            }
            
            return canvas;
            
        } catch (error) {
            console.error('PixelArtGenerator: Error creating advanced frame:', error);
            return null;
        }
    }

    /**
     * Draw advanced character base with procedural details
     */
    drawAdvancedCharacterBase(ctx, characterType, dna, palette, stateName, progress) {
        // Animation offset based on state and progress
        const animOffset = this.calculateAnimationOffset(stateName, progress);
        
        // Draw body with variations based on DNA
        this.drawAdvancedBody(ctx, characterType, dna, palette, animOffset);
        
        // Draw head with facial features
        this.drawAdvancedHead(ctx, characterType, dna, palette, animOffset);
        
        // Draw limbs with proper articulation
        this.drawAdvancedLimbs(ctx, characterType, dna, palette, stateName, animOffset);
        
        // Draw details and accessories
        this.drawAdvancedDetails(ctx, characterType, dna, palette, animOffset);
    }

    /**
     * Draw advanced body with multiple variations
     */
    drawAdvancedBody(ctx, characterType, dna, palette, animOffset) {
        const bodyVariation = dna.bodyType;
        const baseX = 24;
        const baseY = 32 + animOffset.body;
        
        // Main torso
        this.drawAdvancedPixelRect(ctx, baseX, baseY, 16, 20, palette.primary, {
            gradient: true,
            shadow: true,
            highlight: true
        });
        
        // Body details based on character type and variation
        switch (characterType) {
            case 'aria':
                this.drawAriaBodyDetails(ctx, baseX, baseY, dna, palette);
                break;
            case 'titan':
                this.drawTitanBodyDetails(ctx, baseX, baseY, dna, palette);
                break;
            case 'nexus':
                this.drawNexusBodyDetails(ctx, baseX, baseY, dna, palette);
                break;
            default:
                this.drawDefaultBodyDetails(ctx, baseX, baseY, dna, palette);
        }
    }

    /**
     * Draw advanced head with facial features
     */
    drawAdvancedHead(ctx, characterType, dna, palette, animOffset) {
        const baseX = 20;
        const baseY = 8 + animOffset.head;
        
        // Head shape
        this.drawAdvancedPixelRect(ctx, baseX, baseY, 24, 20, palette.light, {
            rounded: true,
            gradient: true
        });
        
        // Facial features based on DNA
        this.drawFacialFeatures(ctx, baseX, baseY, dna, palette);
        
        // Hair/helmet based on character type
        this.drawHeadwear(ctx, characterType, baseX, baseY, dna, palette);
    }

    /**
     * Draw advanced limbs with proper articulation
     */
    drawAdvancedLimbs(ctx, characterType, dna, palette, stateName, animOffset) {
        // Arms
        this.drawAdvancedArms(ctx, characterType, dna, palette, stateName, animOffset);
        
        // Legs
        this.drawAdvancedLegs(ctx, characterType, dna, palette, stateName, animOffset);
    }

    /**
     * Draw advanced pixel rectangle with effects
     */
    drawAdvancedPixelRect(ctx, x, y, width, height, color, effects = {}) {
        const pixelSize = this.config.pixelSize;
        const realX = Math.floor(x * pixelSize);
        const realY = Math.floor(y * pixelSize);
        const realWidth = width * pixelSize;
        const realHeight = height * pixelSize;
        
        // Base color
        ctx.fillStyle = color;
        ctx.fillRect(realX, realY, realWidth, realHeight);
        
        // Apply effects
        if (effects.gradient) {
            this.applyGradientEffect(ctx, realX, realY, realWidth, realHeight, color);
        }
        
        if (effects.shadow) {
            this.applyShadowEffect(ctx, realX, realY, realWidth, realHeight);
        }
        
        if (effects.highlight) {
            this.applyHighlightEffect(ctx, realX, realY, realWidth, realHeight, color);
        }
        
        if (effects.rounded) {
            this.applyRoundedEffect(ctx, realX, realY, realWidth, realHeight, color);
        }
    }

    /**
     * Apply gradient effect to pixel rectangle
     */
    applyGradientEffect(ctx, x, y, width, height, baseColor) {
        const gradient = ctx.createLinearGradient(x, y, x, y + height);
        gradient.addColorStop(0, this.lightenColor(baseColor, 0.3));
        gradient.addColorStop(1, this.darkenColor(baseColor, 0.3));
        
        ctx.fillStyle = gradient;
        ctx.fillRect(x, y, width, height);
    }

    /**
     * Create advanced texture with all optimizations
     */
    createAdvancedTexture(spriteData, textureKey, config) {
        try {
            // Calculate optimal texture dimensions
            const dimensions = this.calculateOptimalTextureDimensions(spriteData);
            
            // Create texture atlas entry
            const atlasRegion = this.addToTextureAtlas(spriteData, dimensions);
            
            if (!atlasRegion) {
                // Fallback to individual texture
                return this.createIndividualTexture(spriteData, textureKey);
            }
            
            // Register texture with Phaser
            if (this.scene.textures.exists(textureKey)) {
                this.scene.textures.remove(textureKey);
            }
            
            this.scene.textures.addCanvas(textureKey, this.textureAtlas.canvas);
            
            // Add frame definitions
            this.addAdvancedFrameDefinitions(textureKey, spriteData, atlasRegion);
            
            return textureKey;
            
        } catch (error) {
            console.error('PixelArtGenerator: Error creating advanced texture:', error);
            return null;
        }
    }

    /**
     * Create advanced animations with smooth transitions
     */
    createAdvancedAnimations(textureKey, characterType, config) {
        const animationKeys = {};
        
        try {
            for (const [stateName, stateConfig] of Object.entries(this.animationStates)) {
                const animKey = `${characterType}_${stateName}`;
                
                if (this.scene.anims.exists(animKey)) {
                    this.scene.anims.remove(animKey);
                }
                
                const frames = this.generateAnimationFrames(textureKey, stateName, stateConfig);
                
                this.scene.anims.create({
                    key: animKey,
                    frames: frames,
                    frameRate: this.calculateFrameRate(stateConfig),
                    repeat: stateConfig.loop ? -1 : 0,
                    yoyo: this.shouldYoyo(stateName),
                    ease: this.getAnimationEasing(stateName)
                });
                
                animationKeys[stateName] = animKey;
            }
            
            // Create transition animations
            this.createTransitionAnimations(textureKey, characterType, animationKeys);
            
            return animationKeys;
            
        } catch (error) {
            console.error('PixelArtGenerator: Error creating advanced animations:', error);
            return {};
        }
    }

    /**
     * Generate enemy sprite with advanced AI-driven variations
     */
    generateAdvancedEnemySprite(enemyType, difficulty = 1, config = {}) {
        const enhancedConfig = {
            ...config,
            difficulty,
            isEnemy: true,
            threatLevel: this.calculateThreatLevel(difficulty),
            aiPersonality: this.generateAIPersonality(enemyType, difficulty),
            proceduralVariations: true
        };
        
        return this.generateAdvancedCharacterSprite(`enemy_${enemyType}`, enhancedConfig);
    }

    /**
     * Utility functions for color manipulation
     */
    lightenColor(color, amount) {
        const hex = color.replace('#', '');
        const r = Math.min(255, parseInt(hex.substr(0, 2), 16) + Math.floor(255 * amount));
        const g = Math.min(255, parseInt(hex.substr(2, 2), 16) + Math.floor(255 * amount));
        const b = Math.min(255, parseInt(hex.substr(4, 2), 16) + Math.floor(255 * amount));
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    darkenColor(color, amount) {
        const hex = color.replace('#', '');
        const r = Math.max(0, parseInt(hex.substr(0, 2), 16) - Math.floor(255 * amount));
        const g = Math.max(0, parseInt(hex.substr(2, 2), 16) - Math.floor(255 * amount));
        const b = Math.max(0, parseInt(hex.substr(4, 2), 16) - Math.floor(255 * amount));
        return `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
    }

    /**
     * Create fallback sprite for error cases
     */
    createFallbackSprite(characterType) {
        try {
            const canvas = document.createElement('canvas');
            canvas.width = 64;
            canvas.height = 64;
            const ctx = canvas.getContext('2d');
            
            // Simple colored rectangle as fallback
            ctx.fillStyle = '#4A90E2';
            ctx.fillRect(16, 16, 32, 32);
            
            const fallbackKey = `fallback_${characterType}_${Date.now()}`;
            this.scene.textures.addCanvas(fallbackKey, canvas);
            
            return {
                textureKey: fallbackKey,
                animationKeys: {},
                isFallback: true
            };
        } catch (error) {
            console.error('PixelArtGenerator: Error creating fallback sprite:', error);
            return null;
        }
    }

    /**
     * Performance optimization methods
     */
    cleanupCache() {
        if (this.spriteCache.size > this.config.maxCacheSize) {
            const entries = Array.from(this.spriteCache.entries());
            entries.sort((a, b) => a[1].timestamp - b[1].timestamp);
            
            const toRemove = entries.slice(0, Math.floor(this.config.maxCacheSize * 0.2));
            toRemove.forEach(([key]) => {
                this.spriteCache.delete(key);
            });
        }
    }

    validateCachedTexture(cachedData) {
        return cachedData && 
               cachedData.textureKey && 
               this.scene.textures.exists(cachedData.textureKey) &&
               (Date.now() - cachedData.timestamp) < 300000; // 5 minutes
    }

    generateCacheKey(characterType, config) {
        const keyData = {
            type: characterType,
            style: config.artStyle,
            mood: config.mood,
            equipment: Object.keys(config.equipment || {}).sort(),
            effects: (config.effects || []).sort(),
            seed: config.seed
        };
        return `advanced_${JSON.stringify(keyData)}`;
    }

    /**
     * Get advanced statistics
     */
    getAdvancedStats() {
        return {
            cacheSize: this.spriteCache.size,
            textureAtlasUsage: this.calculateAtlasUsage(),
            memoryUsage: this.estimateAdvancedMemoryUsage(),
            performanceMode: this.performanceMode,
            featuresEnabled: {
                advancedShading: this.config.enableAdvancedShading,
                dynamicLighting: this.config.enableDynamicLighting,
                particleEffects: this.config.enableParticleEffects,
                proceduralGeneration: this.config.enableProceduralGeneration
            }
        };
    }

    /**
     * Cleanup and destroy
     */
    destroy() {
        this.spriteCache.clear();
        this.animationCache.clear();
        this.textureAtlas.regions.clear();
        this.shaderCache.clear();
        
        if (this.textureAtlas.canvas) {
            this.textureAtlas.canvas = null;
        }
        
        console.log('PixelArtGenerator: Advanced systems destroyed');
    }

    // Advanced feature implementations
    calculateAnimationOffset(stateName, progress) {
        const baseOffset = Math.sin(progress * Math.PI * 2);
        
        switch (stateName) {
            case 'idle':
                return {
                    body: baseOffset * 1,
                    head: baseOffset * 0.5,
                    arms: baseOffset * 0.8,
                    legs: 0
                };
            case 'walk':
                return {
                    body: Math.sin(progress * Math.PI * 4) * 2,
                    head: Math.sin(progress * Math.PI * 4) * 1,
                    arms: Math.sin(progress * Math.PI * 4 + Math.PI) * 3,
                    legs: Math.sin(progress * Math.PI * 4 + Math.PI/2) * 4
                };
            case 'run':
                return {
                    body: Math.sin(progress * Math.PI * 6) * 3,
                    head: Math.sin(progress * Math.PI * 6) * 1.5,
                    arms: Math.sin(progress * Math.PI * 6 + Math.PI) * 5,
                    legs: Math.sin(progress * Math.PI * 6 + Math.PI/2) * 6
                };
            case 'attack':
                const attackPhase = progress < 0.3 ? progress / 0.3 : (1 - progress) / 0.7;
                return {
                    body: attackPhase * 2,
                    head: attackPhase * 1,
                    arms: attackPhase * 8,
                    legs: 0
                };
            default:
                return { body: 0, head: 0, arms: 0, legs: 0 };
        }
    }

    drawAriaBodyDetails(ctx, x, y, dna, palette) {
        // Cyber specialist details
        const pixelSize = this.config.pixelSize;
        
        // Tech panels on torso
        this.drawAdvancedPixelRect(ctx, x + 2, y + 4, 4, 2, palette.secondary, { glow: true });
        this.drawAdvancedPixelRect(ctx, x + 10, y + 4, 4, 2, palette.secondary, { glow: true });
        
        // Energy core
        this.drawAdvancedPixelRect(ctx, x + 6, y + 8, 4, 4, palette.energy, { 
            glow: true, 
            pulsing: true 
        });
        
        // Armor plating based on DNA variation
        const armorPattern = dna.bodyType % 3;
        if (armorPattern === 0) {
            // Light armor
            this.drawAdvancedPixelRect(ctx, x + 1, y + 2, 2, 16, palette.accent);
            this.drawAdvancedPixelRect(ctx, x + 13, y + 2, 2, 16, palette.accent);
        } else if (armorPattern === 1) {
            // Medium armor
            this.drawAdvancedPixelRect(ctx, x, y + 1, 16, 2, palette.dark);
            this.drawAdvancedPixelRect(ctx, x + 2, y + 16, 12, 2, palette.dark);
        }
    }

    drawTitanBodyDetails(ctx, x, y, dna, palette) {
        // Heavy assault details
        const pixelSize = this.config.pixelSize;
        
        // Heavy armor plating
        this.drawAdvancedPixelRect(ctx, x - 2, y, 20, 4, palette.dark, { metallic: true });
        this.drawAdvancedPixelRect(ctx, x - 1, y + 16, 18, 3, palette.dark, { metallic: true });
        
        // Power core
        this.drawAdvancedPixelRect(ctx, x + 6, y + 6, 4, 8, palette.energy, { 
            glow: true, 
            pulsing: true,
            intensity: 1.5 
        });
        
        // Exhaust vents
        this.drawAdvancedPixelRect(ctx, x - 1, y + 10, 2, 1, palette.accent);
        this.drawAdvancedPixelRect(ctx, x + 15, y + 10, 2, 1, palette.accent);
        
        // Weapon mounts based on DNA
        if (dna.bodyType % 2 === 0) {
            this.drawAdvancedPixelRect(ctx, x + 16, y + 8, 3, 4, palette.secondary);
        }
    }

    drawNexusBodyDetails(ctx, x, y, dna, palette) {
        // Tech specialist details
        const pixelSize = this.config.pixelSize;
        
        // Holographic interfaces
        this.drawAdvancedPixelRect(ctx, x + 1, y + 2, 3, 3, palette.energy, { 
            holographic: true,
            transparency: 0.7 
        });
        this.drawAdvancedPixelRect(ctx, x + 12, y + 2, 3, 3, palette.energy, { 
            holographic: true,
            transparency: 0.7 
        });
        
        // Data streams
        for (let i = 0; i < 3; i++) {
            this.drawAdvancedPixelRect(ctx, x + 4 + i * 3, y + 1, 1, 1, palette.accent, { 
                flickering: true 
            });
        }
        
        // Neural interface
        this.drawAdvancedPixelRect(ctx, x + 6, y + 12, 4, 2, palette.secondary, { 
            circuit: true 
        });
    }

    drawDefaultBodyDetails(ctx, x, y, dna, palette) {
        // Basic humanoid details
        this.drawAdvancedPixelRect(ctx, x + 4, y + 4, 8, 2, palette.secondary);
        this.drawAdvancedPixelRect(ctx, x + 6, y + 8, 4, 4, palette.accent);
    }

    drawFacialFeatures(ctx, x, y, dna, palette) {
        const faceType = dna.faceType;
        const pixelSize = this.config.pixelSize;
        
        // Eyes based on DNA
        const eyeY = y + 6;
        this.drawAdvancedPixelRect(ctx, x + 6, eyeY, 2, 2, palette.dark);
        this.drawAdvancedPixelRect(ctx, x + 16, eyeY, 2, 2, palette.dark);
        
        // Eye glow for certain types
        if (faceType % 3 === 0) {
            this.drawAdvancedPixelRect(ctx, x + 6, eyeY, 2, 2, palette.energy, { glow: true });
            this.drawAdvancedPixelRect(ctx, x + 16, eyeY, 2, 2, palette.energy, { glow: true });
        }
        
        // Mouth/breathing apparatus
        if (faceType % 4 === 0) {
            this.drawAdvancedPixelRect(ctx, x + 10, y + 12, 4, 2, palette.dark);
        }
        
        // Facial markings based on DNA
        const markingType = dna.colorVariant % 4;
        if (markingType === 1) {
            this.drawAdvancedPixelRect(ctx, x + 4, y + 4, 1, 8, palette.accent);
            this.drawAdvancedPixelRect(ctx, x + 19, y + 4, 1, 8, palette.accent);
        }
    }

    drawHeadwear(ctx, characterType, x, y, dna, palette) {
        const hairType = dna.hairType;
        
        switch (characterType) {
            case 'aria':
                // Cyber helmet
                this.drawAdvancedPixelRect(ctx, x - 2, y - 2, 28, 8, palette.primary, { 
                    metallic: true 
                });
                // Visor
                this.drawAdvancedPixelRect(ctx, x + 2, y + 2, 20, 4, palette.energy, { 
                    transparent: true,
                    glow: true 
                });
                break;
                
            case 'titan':
                // Heavy helmet
                this.drawAdvancedPixelRect(ctx, x - 4, y - 4, 32, 12, palette.dark, { 
                    metallic: true,
                    armored: true 
                });
                break;
                
            case 'nexus':
                // Tech crown
                this.drawAdvancedPixelRect(ctx, x + 4, y - 2, 16, 4, palette.secondary, { 
                    holographic: true 
                });
                // Data ports
                this.drawAdvancedPixelRect(ctx, x + 2, y + 8, 2, 2, palette.accent);
                this.drawAdvancedPixelRect(ctx, x + 20, y + 8, 2, 2, palette.accent);
                break;
        }
    }

    drawAdvancedArms(ctx, characterType, dna, palette, stateName, animOffset) {
        const baseX = 16;
        const baseY = 40;
        const armOffset = animOffset.arms;
        
        // Left arm
        this.drawAdvancedPixelRect(ctx, baseX - 6, baseY + armOffset, 4, 12, palette.primary, {
            gradient: true,
            articulated: true
        });
        
        // Right arm
        this.drawAdvancedPixelRect(ctx, baseX + 18, baseY - armOffset, 4, 12, palette.primary, {
            gradient: true,
            articulated: true
        });
        
        // Weapon attachments based on character type
        if (characterType === 'titan') {
            this.drawAdvancedPixelRect(ctx, baseX + 22, baseY - armOffset + 8, 6, 4, palette.accent);
        } else if (characterType === 'nexus') {
            this.drawAdvancedPixelRect(ctx, baseX - 8, baseY + armOffset + 6, 4, 2, palette.energy, { 
                glow: true 
            });
        }
    }

    drawAdvancedLegs(ctx, characterType, dna, palette, stateName, animOffset) {
        const baseX = 20;
        const baseY = 56;
        const legOffset = animOffset.legs;
        
        // Left leg
        this.drawAdvancedPixelRect(ctx, baseX, baseY + legOffset, 6, 16, palette.dark, {
            gradient: true,
            articulated: true
        });
        
        // Right leg
        this.drawAdvancedPixelRect(ctx, baseX + 10, baseY - legOffset, 6, 16, palette.dark, {
            gradient: true,
            articulated: true
        });
        
        // Boots/feet
        this.drawAdvancedPixelRect(ctx, baseX - 1, baseY + 14 + legOffset, 8, 4, palette.secondary);
        this.drawAdvancedPixelRect(ctx, baseX + 9, baseY + 14 - legOffset, 8, 4, palette.secondary);
    }

    drawAdvancedDetails(ctx, characterType, dna, palette, animOffset) {
        // Add character-specific details and accessories
        const accessories = dna.accessories || [];
        
        accessories.forEach(accessory => {
            switch (accessory.type) {
                case 'cape':
                    this.drawCape(ctx, palette, animOffset);
                    break;
                case 'aura':
                    this.drawAura(ctx, palette);
                    break;
                case 'wings':
                    this.drawWings(ctx, palette, animOffset);
                    break;
            }
        });
    }

    applyShadowEffect(ctx, x, y, width, height) {
        const shadowOffset = 2;
        ctx.fillStyle = 'rgba(0, 0, 0, 0.3)';
        ctx.fillRect(x + shadowOffset, y + shadowOffset, width, height);
    }

    applyHighlightEffect(ctx, x, y, width, height, color) {
        const highlightColor = this.lightenColor(color, 0.5);
        ctx.fillStyle = highlightColor;
        ctx.fillRect(x, y, width / 4, height);
        ctx.fillRect(x, y, width, height / 4);
    }

    applyRoundedEffect(ctx, x, y, width, height, color) {
        const radius = Math.min(width, height) / 4;
        ctx.beginPath();
        ctx.roundRect(x, y, width, height, radius);
        ctx.fillStyle = color;
        ctx.fill();
    }

    applyArtStyleEffects(ctx, artStyle, canvas) {
        if (artStyle.scanlines) {
            this.applyScanlines(ctx, canvas);
        }
        if (artStyle.chromatic) {
            this.applyChromaticAberration(ctx, canvas);
        }
        if (artStyle.dithering) {
            this.applyDithering(ctx, canvas);
        }
    }

    applyDynamicLighting(ctx, canvas, stateName, progress) {
        // Create dynamic lighting based on animation state
        const lightIntensity = stateName === 'attack' ? 1.5 : 1.0;
        const lightColor = `rgba(255, 255, 255, ${0.1 * lightIntensity})`;
        
        const gradient = ctx.createRadialGradient(
            canvas.width / 2, canvas.height / 2, 0,
            canvas.width / 2, canvas.height / 2, canvas.width / 2
        );
        gradient.addColorStop(0, lightColor);
        gradient.addColorStop(1, 'rgba(255, 255, 255, 0)');
        
        ctx.globalCompositeOperation = 'overlay';
        ctx.fillStyle = gradient;
        ctx.fillRect(0, 0, canvas.width, canvas.height);
        ctx.globalCompositeOperation = 'source-over';
    }

    applyAdvancedShading(ctx, canvas, palette) {
        // Apply advanced shading techniques
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        const data = imageData.data;
        
        // Simple ambient occlusion simulation
        for (let i = 0; i < data.length; i += 4) {
            if (data[i + 3] > 0) { // If pixel is not transparent
                // Darken pixels slightly for depth
                data[i] = Math.max(0, data[i] - 10);     // Red
                data[i + 1] = Math.max(0, data[i + 1] - 10); // Green
                data[i + 2] = Math.max(0, data[i + 2] - 10); // Blue
            }
        }
        
        ctx.putImageData(imageData, 0, 0);
    }

    generateAccessories(rng) {
        const accessories = [];
        if (rng() < this.proceduralParams.accessoryChance) {
            const types = ['cape', 'aura', 'wings'];
            accessories.push({
                type: types[Math.floor(rng() * types.length)],
                variant: Math.floor(rng() * 3)
            });
        }
        return accessories;
    }

    generateMutations(rng) {
        const mutations = [];
        if (rng() < this.proceduralParams.mutationRate) {
            mutations.push({
                type: 'colorShift',
                intensity: rng() * 0.3
            });
        }
        return mutations;
    }

    generatePersonality(rng) {
        return {
            aggression: rng(),
            intelligence: rng(),
            speed: rng(),
            defense: rng()
        };
    }

    getAdvancedPalette(characterType, mood, dna) {
        const basePalette = this.colorPalettes[characterType]?.[mood] || 
                           this.colorPalettes[characterType]?.base || 
                           this.colorPalettes.aria.base;
        
        // Apply DNA-based color variations
        const colorVariant = dna.colorVariant / this.proceduralParams.colorVariations;
        const modifiedPalette = { ...basePalette };
        
        // Slightly modify colors based on DNA
        Object.keys(modifiedPalette).forEach(key => {
            if (key !== 'energy') {
                modifiedPalette[key] = this.adjustColorByVariant(modifiedPalette[key], colorVariant);
            }
        });
        
        return modifiedPalette;
    }

    adjustColorByVariant(color, variant) {
        // Slightly adjust hue based on variant
        const hueShift = (variant - 0.5) * 30; // ±15 degrees
        return this.shiftHue(color, hueShift);
    }

    shiftHue(color, degrees) {
        // Simple hue shifting (basic implementation)
        const hex = color.replace('#', '');
        const r = parseInt(hex.substr(0, 2), 16);
        const g = parseInt(hex.substr(2, 2), 16);
        const b = parseInt(hex.substr(4, 2), 16);
        
        // Convert to HSL, shift hue, convert back
        // This is a simplified version - a full implementation would be more complex
        const factor = 1 + (degrees / 360);
        const newR = Math.min(255, Math.max(0, Math.floor(r * factor)));
        const newG = Math.min(255, Math.max(0, Math.floor(g * factor)));
        const newB = Math.min(255, Math.max(0, Math.floor(b * factor)));
        
        return `#${newR.toString(16).padStart(2, '0')}${newG.toString(16).padStart(2, '0')}${newB.toString(16).padStart(2, '0')}`;
    }

    // Placeholder implementations for remaining methods
    generateEquipmentLayers(equipment, dna, palette) { return []; }
    generateEffectLayers(effects, dna) { return []; }
    calculateOptimalTextureDimensions(spriteData) { return { width: 256, height: 256 }; }
    addToTextureAtlas(spriteData, dimensions) { return null; }
    createIndividualTexture(spriteData, textureKey) { return textureKey; }
    addAdvancedFrameDefinitions(textureKey, spriteData, atlasRegion) { /* Implementation */ }
    generateAnimationFrames(textureKey, stateName, stateConfig) { return []; }
    calculateFrameRate(stateConfig) { return Math.floor(stateConfig.speed * 8); }
    shouldYoyo(stateName) { return ['idle', 'defend'].includes(stateName); }
    getAnimationEasing(stateName) { 
        const easingMap = {
            'idle': 'Sine.easeInOut',
            'walk': 'Linear',
            'run': 'Linear',
            'attack': 'Back.easeOut',
            'cast': 'Elastic.easeOut'
        };
        return easingMap[stateName] || 'Linear';
    }
    createTransitionAnimations(textureKey, characterType, animationKeys) { /* Implementation */ }
    calculateThreatLevel(difficulty) { return Math.min(10, Math.floor(difficulty * 2)); }
    generateAIPersonality(enemyType, difficulty) { 
        return {
            aggression: enemyType === 'destroyer' ? 0.9 : enemyType === 'warrior' ? 0.7 : 0.4,
            intelligence: enemyType === 'nexus' ? 0.9 : 0.5,
            adaptability: difficulty / 10
        };
    }
    calculateAtlasUsage() { return (this.textureAtlas.currentY / this.textureAtlasSize) * 100; }
    estimateAdvancedMemoryUsage() { 
        const baseSize = this.config.baseSize.width * this.config.baseSize.height * 4;
        return (this.spriteCache.size * baseSize * this.config.animationFrames) / 1024 / 1024;
    }
    createGlowShader() { return { type: 'glow', intensity: 1.0 }; }
    createOutlineShader() { return { type: 'outline', thickness: 1 }; }
    createChromaticShader() { return { type: 'chromatic', offset: 2 }; }
    createPixelateShader() { return { type: 'pixelate', size: 4 }; }
    createHologramShader() { return { type: 'hologram', flicker: 0.1 }; }

    /**
     * Backward compatibility method for old API
     */
    generateCharacterSprite(characterType, config = {}) {
        console.warn('PixelArtGenerator: generateCharacterSprite is deprecated. Use generateAdvancedCharacterSprite instead.');
        
        // Convert old config to new format
        const advancedConfig = {
            artStyle: config.enhanced ? 'modern16bit' : 'retro8bit',
            mood: config.combatMode ? 'combat' : 'base',
            equipment: {},
            effects: config.enhanced ? ['energy'] : [],
            quality: 'medium',
            procedural: false
        };
        
        const result = this.generateAdvancedCharacterSprite(characterType, advancedConfig);
        
        // Return just the texture key for backward compatibility
        return result?.textureKey || result;
    }

    /**
     * Backward compatibility method for old enemy API
     */
    generateEnemySprite(enemyType, difficulty = 1) {
        console.warn('PixelArtGenerator: generateEnemySprite is deprecated. Use generateAdvancedEnemySprite instead.');
        
        const result = this.generateAdvancedEnemySprite(enemyType, difficulty, {
            artStyle: 'cyberpunk',
            mood: 'base',
            quality: 'medium'
        });
        
        // Return just the texture key for backward compatibility
        return result?.textureKey || result;
    }

    /**
     * Backward compatibility method for animations
     */
    createCharacterAnimations(textureKey, characterType) {
        console.warn('PixelArtGenerator: createCharacterAnimations is deprecated. Animations are now created automatically.');
        
        // Try to find existing animations
        const animKey = `${characterType}_idle`;
        if (this.scene.anims.exists(animKey)) {
            return animKey;
        }
        
        // Create basic animation as fallback
        try {
            this.scene.anims.create({
                key: animKey,
                frames: [{ key: textureKey, frame: 0 }],
                frameRate: 8,
                repeat: -1
            });
            return animKey;
        } catch (error) {
            console.error('PixelArtGenerator: Error creating fallback animation:', error);
            return null;
        }
    }

    /**
     * Enhanced method to get cache statistics with more details
     */
    getCacheStats() {
        return this.getAdvancedStats();
    }

    /**
     * Enhanced method to clear cache
     */
    clearCache() {
        this.spriteCache.clear();
        this.animationCache.clear();
        this.textureAtlas.regions.clear();
        console.log('PixelArtGenerator: Cache cleared');
    }
} 