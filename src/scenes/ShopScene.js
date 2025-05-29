import { Scene } from "phaser";
import { ProgressTracker } from "../utils/ProgressTracker.js";

export class ShopScene extends Scene {
    constructor() {
        super("ShopScene");
        this.progressTracker = new ProgressTracker();
        this.currentCategory = 'armor';
        this.selectedItem = null;
        this.shopItems = this.initializeShopItems();
    }

    init() {
        this.cameras.main.fadeIn(1000, 0, 0, 0);
    }

    create() {
        // Background
        this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x1a1a2e)
            .setOrigin(0, 0);
        
        // Shop title
        this.add.text(this.scale.width / 2, 50, "🔧 ROBOT UPGRADE SHOP 🔧", {
            fontSize: '32px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffd700',
            stroke: '#000000',
            strokeThickness: 4
        }).setOrigin(0.5);
        
        // Character info display
        this.createCharacterInfoDisplay();
        
        // Coin balance display
        this.coinBalanceText = this.add.text(this.scale.width - 20, 20, 
            `🪙 ${this.progressTracker.getCoinBalance()} Coins`, {
            fontSize: '20px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffd700',
            stroke: '#000000',
            strokeThickness: 2
        }).setOrigin(1, 0);
        
        // Create category tabs
        this.createCategoryTabs();
        
        // Create item display area
        this.createItemDisplay();
        
        // Create item details panel
        this.createDetailsPanel();
        
        // Create navigation buttons
        this.createNavigationButtons();
        
        // Show initial category
        this.showCategory('armor');
    }

    initializeShopItems() {
        return {
            armor: [
                // ARIA Cyber Armor Upgrades
                {
                    id: 'aria_defense_1',
                    name: 'ARIA Defense Matrix Mk1',
                    description: 'Basic cyber defense upgrade (+5% defense, +3% analysis)',
                    price: 100,
                    icon: '🛡️',
                    color: 0x3b82f6,
                    permanent: true,
                    mechType: 'aria',
                    armorType: 'defense',
                    level: 1,
                    bonuses: { defense: 5, analysis: 3 }
                },
                {
                    id: 'aria_defense_2',
                    name: 'ARIA Defense Matrix Mk2',
                    description: 'Advanced cyber defense (+10% defense, +6% analysis)',
                    price: 200,
                    icon: '🛡️',
                    color: 0x3b82f6,
                    permanent: true,
                    mechType: 'aria',
                    armorType: 'defense',
                    level: 2,
                    requires: 'aria_defense_1',
                    bonuses: { defense: 10, analysis: 6 }
                },
                {
                    id: 'aria_power_1',
                    name: 'ARIA Neural Core Mk1',
                    description: 'Enhanced processing power (+8% reading, +5% efficiency)',
                    price: 150,
                    icon: '⚡',
                    color: 0x00ffff,
                    permanent: true,
                    mechType: 'aria',
                    armorType: 'power',
                    level: 1,
                    bonuses: { reading: 8, efficiency: 5 }
                },
                {
                    id: 'aria_weapon_1',
                    name: 'ARIA Cyber Weapons Mk1',
                    description: 'Advanced hacking tools (+10% cyber damage)',
                    price: 120,
                    icon: '⚔️',
                    color: 0x60a5fa,
                    permanent: true,
                    mechType: 'aria',
                    armorType: 'weapon',
                    level: 1,
                    bonuses: { cyberDamage: 10 }
                },
                
                // TITAN Heavy Armor Upgrades
                {
                    id: 'titan_defense_1',
                    name: 'TITAN Armor Plating Mk1',
                    description: 'Heavy armor plating (+15% defense, +5% courage)',
                    price: 120,
                    icon: '🛡️',
                    color: 0xef4444,
                    permanent: true,
                    mechType: 'titan',
                    armorType: 'defense',
                    level: 1,
                    bonuses: { defense: 15, courage: 5 }
                },
                {
                    id: 'titan_defense_2',
                    name: 'TITAN Armor Plating Mk2',
                    description: 'Reinforced heavy armor (+25% defense, +10% courage)',
                    price: 250,
                    icon: '🛡️',
                    color: 0xef4444,
                    permanent: true,
                    mechType: 'titan',
                    armorType: 'defense',
                    level: 2,
                    requires: 'titan_defense_1',
                    bonuses: { defense: 25, courage: 10 }
                },
                {
                    id: 'titan_power_1',
                    name: 'TITAN Reactor Core Mk1',
                    description: 'Enhanced power reactor (+10% math, +8% strength)',
                    price: 180,
                    icon: '⚡',
                    color: 0xffa500,
                    permanent: true,
                    mechType: 'titan',
                    armorType: 'power',
                    level: 1,
                    bonuses: { math: 10, strength: 8 }
                },
                {
                    id: 'titan_weapon_1',
                    name: 'TITAN Weapon Systems Mk1',
                    description: 'Heavy assault weapons (+15% physical damage)',
                    price: 140,
                    icon: '⚔️',
                    color: 0x7f1d1d,
                    permanent: true,
                    mechType: 'titan',
                    armorType: 'weapon',
                    level: 1,
                    bonuses: { physicalDamage: 15 }
                },
                
                // NEXUS Tech Upgrades
                {
                    id: 'nexus_defense_1',
                    name: 'NEXUS Shield Generator Mk1',
                    description: 'Energy shield system (+8% defense, +7% technology)',
                    price: 110,
                    icon: '🛡️',
                    color: 0x10b981,
                    permanent: true,
                    mechType: 'nexus',
                    armorType: 'defense',
                    level: 1,
                    bonuses: { defense: 8, technology: 7 }
                },
                {
                    id: 'nexus_defense_2',
                    name: 'NEXUS Shield Generator Mk2',
                    description: 'Advanced energy shields (+15% defense, +12% technology)',
                    price: 220,
                    icon: '🛡️',
                    color: 0x10b981,
                    permanent: true,
                    mechType: 'nexus',
                    armorType: 'defense',
                    level: 2,
                    requires: 'nexus_defense_1',
                    bonuses: { defense: 15, technology: 12 }
                },
                {
                    id: 'nexus_power_1',
                    name: 'NEXUS Quantum Core Mk1',
                    description: 'Quantum processing upgrade (+12% science, +8% innovation)',
                    price: 160,
                    icon: '⚡',
                    color: 0xfbbf24,
                    permanent: true,
                    mechType: 'nexus',
                    armorType: 'power',
                    level: 1,
                    bonuses: { science: 12, innovation: 8 }
                },
                {
                    id: 'nexus_weapon_1',
                    name: 'NEXUS Tech Weapons Mk1',
                    description: 'Advanced tech weaponry (+12% tech damage)',
                    price: 130,
                    icon: '⚔️',
                    color: 0x047857,
                    permanent: true,
                    mechType: 'nexus',
                    armorType: 'weapon',
                    level: 1,
                    bonuses: { techDamage: 12 }
                }
            ],
            powerUps: [
                {
                    id: 'extraTime',
                    name: 'Extra Time',
                    description: 'Adds 30 seconds to any timed challenge',
                    price: 15,
                    icon: '⏰',
                    color: 0x4ade80,
                    consumable: true
                },
                {
                    id: 'hintBoost',
                    name: 'Hint Boost',
                    description: 'Get a helpful hint for any question',
                    price: 10,
                    icon: '💡',
                    color: 0xfbbf24,
                    consumable: true
                },
                {
                    id: 'shield',
                    name: 'Shield',
                    description: 'Protects you from one wrong answer',
                    price: 20,
                    icon: '🛡️',
                    color: 0x3b82f6,
                    consumable: true
                },
                {
                    id: 'doubleCoins',
                    name: 'Double Coins',
                    description: 'Earn 2x coins for the next level',
                    price: 25,
                    icon: '💰',
                    color: 0xffd700,
                    consumable: true
                },
                {
                    id: 'slowMotion',
                    name: 'Slow Motion',
                    description: 'Slows down time for better precision',
                    price: 30,
                    icon: '🐌',
                    color: 0x8b5cf6,
                    consumable: true
                }
            ],
            cosmetics: [
                {
                    id: 'redCharacter',
                    name: 'Red Hero',
                    description: 'Change your character to red',
                    price: 50,
                    icon: '🔴',
                    color: 0xef4444,
                    permanent: true
                },
                {
                    id: 'blueCharacter',
                    name: 'Blue Hero',
                    description: 'Change your character to blue',
                    price: 50,
                    icon: '🔵',
                    color: 0x3b82f6,
                    permanent: true
                },
                {
                    id: 'greenCharacter',
                    name: 'Green Hero',
                    description: 'Change your character to green',
                    price: 50,
                    icon: '🟢',
                    color: 0x10b981,
                    permanent: true
                },
                {
                    id: 'crownHat',
                    name: 'Royal Crown',
                    description: 'Wear a golden crown',
                    price: 100,
                    icon: '👑',
                    color: 0xffd700,
                    permanent: true
                },
                {
                    id: 'wizardHat',
                    name: 'Wizard Hat',
                    description: 'Magical wizard hat',
                    price: 75,
                    icon: '🧙',
                    color: 0x8b5cf6,
                    permanent: true
                },
                {
                    id: 'sparkleTrail',
                    name: 'Sparkle Trail',
                    description: 'Leave sparkles behind you',
                    price: 80,
                    icon: '✨',
                    color: 0xfbbf24,
                    permanent: true
                }
            ],
            tools: [
                {
                    id: 'speedBoost',
                    name: 'Speed Boost',
                    description: 'Move 50% faster in all games',
                    price: 150,
                    icon: '💨',
                    color: 0x06b6d4,
                    permanent: true
                },
                {
                    id: 'jumpBoost',
                    name: 'Jump Boost',
                    description: 'Jump 30% higher in platformers',
                    price: 120,
                    icon: '🦘',
                    color: 0x10b981,
                    permanent: true
                },
                {
                    id: 'scoreMultiplier',
                    name: 'Score Multiplier',
                    description: 'Earn 25% more points',
                    price: 200,
                    icon: '📈',
                    color: 0xfbbf24,
                    permanent: true
                },
                {
                    id: 'coinMagnet',
                    name: 'Coin Magnet',
                    description: 'Automatically collect nearby coins',
                    price: 175,
                    icon: '🧲',
                    color: 0xef4444,
                    permanent: true
                },
                {
                    id: 'autoHint',
                    name: 'Auto Hint',
                    description: 'Automatically shows hints after 10 seconds',
                    price: 250,
                    icon: '🤖',
                    color: 0x8b5cf6,
                    permanent: true
                }
            ],
            decorations: [
                {
                    id: 'rainbowTrail',
                    name: 'Rainbow Trail',
                    description: 'Leave a colorful rainbow behind you',
                    price: 60,
                    icon: '🌈',
                    color: 0xfbbf24,
                    permanent: true
                },
                {
                    id: 'starField',
                    name: 'Star Field',
                    description: 'Surround yourself with twinkling stars',
                    price: 90,
                    icon: '⭐',
                    color: 0xffd700,
                    permanent: true
                },
                {
                    id: 'fireAura',
                    name: 'Fire Aura',
                    description: 'Burn with determination',
                    price: 85,
                    icon: '🔥',
                    color: 0xef4444,
                    permanent: true
                },
                {
                    id: 'iceAura',
                    name: 'Ice Aura',
                    description: 'Cool and collected energy',
                    price: 85,
                    icon: '❄️',
                    color: 0x06b6d4,
                    permanent: true
                }
            ]
        };
    }

    createCategoryTabs() {
        const categories = [
            { id: 'armor', name: 'Mech Armor', icon: '🛡️' },
            { id: 'powerUps', name: 'Power-Ups', icon: '⚡' },
            { id: 'cosmetics', name: 'Cosmetics', icon: '🎨' },
            { id: 'tools', name: 'Tools', icon: '🔧' },
            { id: 'decorations', name: 'Decorations', icon: '🎭' }
        ];

        this.categoryTabs = {};
        const tabWidth = 150; // Slightly smaller to fit 5 tabs
        const startX = (this.scale.width - (categories.length * tabWidth)) / 2;

        categories.forEach((category, index) => {
            const x = startX + (index * tabWidth);
            const y = 120;

            const tab = this.add.rectangle(x, y, tabWidth - 10, 50, 0x374151)
                .setStrokeStyle(2, 0x6b7280)
                .setInteractive({ useHandCursor: true });

            const tabText = this.add.text(x, y, `${category.icon} ${category.name}`, {
                fontSize: '13px', // Slightly smaller font
                fontFamily: 'Arial, sans-serif',
                fill: '#ffffff',
                fontStyle: 'bold'
            }).setOrigin(0.5);

            this.categoryTabs[category.id] = { tab, tabText };

            tab.on('pointerover', () => {
                if (this.currentCategory !== category.id) {
                    tab.setFillStyle(0x4b5563);
                }
            });

            tab.on('pointerout', () => {
                if (this.currentCategory !== category.id) {
                    tab.setFillStyle(0x374151);
                }
            });

            tab.on('pointerdown', () => {
                this.showCategory(category.id);
            });
        });
    }

    createItemDisplay() {
        this.itemDisplayArea = this.add.group();
        this.itemDisplayBounds = {
            x: 50,
            y: 180,
            width: this.scale.width - 350,
            height: 300
        };
    }

    createDetailsPanel() {
        // Details panel background
        this.detailsPanel = this.add.rectangle(
            this.scale.width - 150,
            this.scale.height / 2,
            280,
            400,
            0x1f2937
        ).setStrokeStyle(2, 0x6b7280);

        this.detailsPanelContent = this.add.group();
    }

    createNavigationButtons() {
        // Back to menu button
        const backBtn = this.add.rectangle(50, this.scale.height - 40, 120, 35, 0x6366f1)
            .setStrokeStyle(2, 0xffffff)
            .setInteractive({ useHandCursor: true });

        this.add.text(50, this.scale.height - 40, "← Back", {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        backBtn.on('pointerdown', () => {
            this.cameras.main.fadeOut(500, 0, 0, 0);
            this.cameras.main.once('camerafadeoutcomplete', () => {
                this.scene.start('EducationalMenuScene');
            });
        });

        // Inventory button
        const inventoryBtn = this.add.rectangle(200, this.scale.height - 40, 120, 35, 0x10b981)
            .setStrokeStyle(2, 0xffffff)
            .setInteractive({ useHandCursor: true });

        this.add.text(200, this.scale.height - 40, "📦 Inventory", {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        inventoryBtn.on('pointerdown', () => {
            this.showInventory();
        });
    }

    showCategory(categoryId) {
        // Update current category
        this.currentCategory = categoryId;

        // Update tab appearances
        Object.keys(this.categoryTabs).forEach(id => {
            const { tab, tabText } = this.categoryTabs[id];
            if (id === categoryId) {
                tab.setFillStyle(0x059669);
                tabText.setFill('#ffffff');
            } else {
                tab.setFillStyle(0x374151);
                tabText.setFill('#d1d5db');
            }
        });

        // Clear current items
        this.itemDisplayArea.clear(true);

        // Get items for this category
        let items = this.shopItems[categoryId];
        
        // For armor category, sort items to prioritize current character's items
        if (categoryId === 'armor') {
            const currentMechType = this.progressTracker.getCharacterTypeId();
            items = [...items].sort((a, b) => {
                // Prioritize items for current mech type
                const aIsForCurrentMech = a.mechType === currentMechType;
                const bIsForCurrentMech = b.mechType === currentMechType;
                
                if (aIsForCurrentMech && !bIsForCurrentMech) return -1;
                if (!aIsForCurrentMech && bIsForCurrentMech) return 1;
                
                // Then sort by mech type alphabetically
                if (a.mechType !== b.mechType) {
                    return a.mechType.localeCompare(b.mechType);
                }
                
                // Then by armor type and level
                if (a.armorType !== b.armorType) {
                    return a.armorType.localeCompare(b.armorType);
                }
                
                return a.level - b.level;
            });
        }

        // Display items
        const itemsPerRow = 4;
        const itemWidth = 120;
        const itemHeight = 100;
        const spacing = 20;
        
        let currentY = this.itemDisplayBounds.y;

        // For armor category, add section headers
        if (categoryId === 'armor') {
            const currentMechType = this.progressTracker.getCharacterTypeId();
            const mechTypes = ['aria', 'titan', 'nexus'];
            
            mechTypes.forEach(mechType => {
                const mechItems = items.filter(item => item.mechType === mechType);
                if (mechItems.length === 0) return;
                
                // Add section header
                const isCurrentMech = mechType === currentMechType;
                const headerColor = isCurrentMech ? '#00ff00' : '#ffffff';
                const headerText = isCurrentMech ? 
                    `🤖 ${mechType.toUpperCase()} ARMOR (YOUR ROBOT) ⭐` : 
                    `🤖 ${mechType.toUpperCase()} ARMOR`;
                
                this.add.text(this.itemDisplayBounds.x, currentY, headerText, {
                    fontSize: '16px',
                    fontFamily: 'Arial, sans-serif',
                    fill: headerColor,
                    fontStyle: 'bold',
                    stroke: '#000000',
                    strokeThickness: 2
                });
                
                currentY += 30;
                
                // Display items for this mech type
                mechItems.forEach((item, index) => {
                    const row = Math.floor(index / itemsPerRow);
                    const col = index % itemsPerRow;
                    
                    const x = this.itemDisplayBounds.x + (col * (itemWidth + spacing)) + itemWidth / 2;
                    const y = currentY + (row * (itemHeight + spacing)) + itemHeight / 2;

                    this.createItemCard(item, x, y, itemWidth, itemHeight);
                });
                
                // Calculate space needed for this section
                const rowsNeeded = Math.ceil(mechItems.length / itemsPerRow);
                currentY += (rowsNeeded * (itemHeight + spacing)) + 20;
            });
        } else {
            // Regular grid layout for other categories
            items.forEach((item, index) => {
                const row = Math.floor(index / itemsPerRow);
                const col = index % itemsPerRow;
                
                const x = this.itemDisplayBounds.x + (col * (itemWidth + spacing)) + itemWidth / 2;
                const y = this.itemDisplayBounds.y + (row * (itemHeight + spacing)) + itemHeight / 2;

                this.createItemCard(item, x, y, itemWidth, itemHeight);
            });
        }

        // Clear details panel
        this.clearDetailsPanel();
    }

    createItemCard(item, x, y, width, height) {
        // Check if player owns this item
        const owned = this.progressTracker.hasItem(item.id, this.currentCategory);
        const canAfford = this.progressTracker.getCoinBalance() >= item.price;
        
        // Check if item is for current character (for armor items)
        const currentMechType = this.progressTracker.getCharacterTypeId();
        const isForCurrentMech = !item.mechType || item.mechType === currentMechType;
        const isRecommended = item.mechType === currentMechType;

        // Card background with enhanced colors
        let cardColor = 0x374151; // Default gray
        let strokeColor = 0x6b7280; // Default stroke
        
        if (owned) {
            cardColor = 0x065f46; // Dark green for owned
            strokeColor = 0x10b981; // Green stroke
        } else if (isRecommended) {
            cardColor = canAfford ? 0x1e3a8a : 0x7f1d1d; // Blue if affordable, red if not
            strokeColor = canAfford ? 0x3b82f6 : 0xef4444; // Bright blue or red stroke
        } else if (!isForCurrentMech) {
            cardColor = 0x4b5563; // Darker gray for incompatible
            strokeColor = 0x9ca3af; // Light gray stroke
        } else if (!canAfford) {
            cardColor = 0x7f1d1d; // Red for unaffordable
            strokeColor = 0xef4444; // Red stroke
        }

        const card = this.add.rectangle(x, y, width, height, cardColor)
            .setStrokeStyle(2, strokeColor)
            .setInteractive({ useHandCursor: true });

        // Add recommendation indicator for current mech items
        if (isRecommended && !owned) {
            this.add.text(x - width/2 + 8, y - height/2 + 8, "⭐", {
                fontSize: '12px'
            }).setOrigin(0, 0);
        }

        // Add incompatible indicator
        if (!isForCurrentMech) {
            this.add.text(x - width/2 + 8, y - height/2 + 8, "❌", {
                fontSize: '10px'
            }).setOrigin(0, 0);
        }

        // Item icon
        this.add.text(x, y - 20, item.icon, {
            fontSize: '24px'
        }).setOrigin(0.5);

        // Item name with better wrapping
        this.add.text(x, y + 5, item.name, {
            fontSize: '12px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            fontStyle: 'bold',
            wordWrap: { width: width - 10 },
            align: 'center'
        }).setOrigin(0.5);

        // Price or owned status
        if (owned) {
            this.add.text(x, y + 25, item.consumable ? 
                `Owned: ${this.progressTracker.progress.inventory.powerUps[item.id] || 0}` : 
                'OWNED', {
                fontSize: '10px',
                fontFamily: 'Arial, sans-serif',
                fill: '#10b981',
                fontStyle: 'bold'
            }).setOrigin(0.5);
        } else {
            const priceColor = canAfford ? (isRecommended ? '#00ff00' : '#ffd700') : '#ef4444';
            this.add.text(x, y + 25, `🪙 ${item.price}`, {
                fontSize: '12px',
                fontFamily: 'Arial, sans-serif',
                fill: priceColor,
                fontStyle: 'bold'
            }).setOrigin(0.5);
        }

        // Add to display group
        this.itemDisplayArea.add(card);

        // Enhanced click handler
        card.on('pointerdown', () => {
            this.selectItem(item);
        });

        // Enhanced hover effects
        card.on('pointerover', () => {
            if (!owned || item.consumable) {
                if (isRecommended) {
                    card.setStrokeStyle(3, 0x00ff00); // Green for recommended
                } else {
                    card.setStrokeStyle(3, 0xfbbf24); // Yellow for others
                }
            }
        });

        card.on('pointerout', () => {
            card.setStrokeStyle(2, strokeColor);
        });
    }

    selectItem(item) {
        this.selectedItem = item;
        this.showItemDetails(item);
    }

    showItemDetails(item) {
        this.clearDetailsPanel();

        const panelX = this.scale.width - 200;
        let yPos = 200;

        // Item icon and name
        this.detailsPanelContent.add(
            this.add.text(panelX, yPos, `${item.icon} ${item.name}`, {
                fontSize: '18px',
                fontFamily: 'Arial, sans-serif',
                fill: '#ffd700',
                fontStyle: 'bold'
            }).setOrigin(0.5)
        );

        yPos += 30;

        // Item description
        this.detailsPanelContent.add(
            this.add.text(panelX, yPos, item.description, {
                fontSize: '12px',
                fontFamily: 'Arial, sans-serif',
                fill: '#ffffff',
                wordWrap: { width: 180 },
                align: 'center'
            }).setOrigin(0.5)
        );

        yPos += 50;

        // Price
        this.detailsPanelContent.add(
            this.add.text(panelX, yPos, `💰 ${item.price} Coins`, {
                fontSize: '14px',
                fontFamily: 'Arial, sans-serif',
                fill: '#ffd700',
                fontStyle: 'bold'
            }).setOrigin(0.5)
        );

        yPos += 30;

        // Show armor bonuses if it's an armor item
        if (item.bonuses) {
            this.detailsPanelContent.add(
                this.add.text(panelX, yPos, "BONUSES:", {
                    fontSize: '12px',
                    fontFamily: 'Arial, sans-serif',
                    fill: '#00ff00',
                    fontStyle: 'bold'
                }).setOrigin(0.5)
            );
            yPos += 20;

            Object.entries(item.bonuses).forEach(([stat, value]) => {
                this.detailsPanelContent.add(
                    this.add.text(panelX, yPos, `+${value}% ${stat.toUpperCase()}`, {
                        fontSize: '11px',
                        fontFamily: 'Arial, sans-serif',
                        fill: '#ffffff'
                    }).setOrigin(0.5)
                );
                yPos += 15;
            });
            yPos += 10;
        }

        // Check requirements for armor items
        let canPurchase = true;
        let requirementText = "";
        
        if (item.requires) {
            const hasRequirement = this.progressTracker.hasItem(item.requires, 'armor');
            canPurchase = hasRequirement;
            
            this.detailsPanelContent.add(
                this.add.text(panelX, yPos, "REQUIRES:", {
                    fontSize: '12px',
                    fontFamily: 'Arial, sans-serif',
                    fill: '#ff6b6b',
                    fontStyle: 'bold'
                }).setOrigin(0.5)
            );
            yPos += 20;

            // Find the required item name
            const requiredItem = this.shopItems.armor.find(armor => armor.id === item.requires);
            const reqName = requiredItem ? requiredItem.name : item.requires;
            
            this.detailsPanelContent.add(
                this.add.text(panelX, yPos, hasRequirement ? `✅ ${reqName}` : `❌ ${reqName}`, {
                    fontSize: '11px',
                    fontFamily: 'Arial, sans-serif',
                    fill: hasRequirement ? '#00ff00' : '#ff6b6b'
                }).setOrigin(0.5)
            );
            yPos += 25;
        }

        // Show mech type requirement for armor
        if (item.mechType) {
            const currentMech = this.progressTracker.getCharacterTypeId();
            const isCorrectMech = currentMech === item.mechType;
            
            this.detailsPanelContent.add(
                this.add.text(panelX, yPos, "MECH TYPE:", {
                    fontSize: '12px',
                    fontFamily: 'Arial, sans-serif',
                    fill: '#60a5fa',
                    fontStyle: 'bold'
                }).setOrigin(0.5)
            );
            yPos += 20;

            this.detailsPanelContent.add(
                this.add.text(panelX, yPos, isCorrectMech ? `✅ ${item.mechType.toUpperCase()}` : `❌ Need ${item.mechType.toUpperCase()}`, {
                    fontSize: '11px',
                    fontFamily: 'Arial, sans-serif',
                    fill: isCorrectMech ? '#00ff00' : '#ff6b6b'
                }).setOrigin(0.5)
            );
            yPos += 25;

            if (!isCorrectMech) {
                canPurchase = false;
            }
        }

        yPos += 10;

        // Purchase/Use button
        const owned = this.progressTracker.hasItem(item.id, this.currentCategory);
        const canAfford = this.progressTracker.getCoinBalance() >= item.price;

        if (owned && item.consumable) {
            // Use button for consumable items
            const useBtn = this.add.rectangle(panelX, yPos, 200, 40, 0x10b981)
                .setStrokeStyle(2, 0xffffff)
                .setInteractive({ useHandCursor: true });

            this.detailsPanelContent.add(useBtn);
            this.detailsPanelContent.add(
                this.add.text(panelX, yPos, "Use Item", {
                    fontSize: '16px',
                    fontFamily: 'Arial, sans-serif',
                    fill: '#ffffff',
                    fontStyle: 'bold'
                }).setOrigin(0.5)
            );

            useBtn.on('pointerdown', () => {
                this.useItem(item);
            });
        } else if (!owned && canPurchase) {
            // Purchase button
            const btnColor = canAfford ? 0x059669 : 0x7f1d1d;
            const purchaseBtn = this.add.rectangle(panelX, yPos, 200, 40, btnColor)
                .setStrokeStyle(2, 0xffffff)
                .setInteractive({ useHandCursor: canAfford });

            this.detailsPanelContent.add(purchaseBtn);
            this.detailsPanelContent.add(
                this.add.text(panelX, yPos, canAfford ? "Purchase" : "Not Enough Coins", {
                    fontSize: '16px',
                    fontFamily: 'Arial, sans-serif',
                    fill: '#ffffff',
                    fontStyle: 'bold'
                }).setOrigin(0.5)
            );

            if (canAfford) {
                purchaseBtn.on('pointerdown', () => {
                    this.purchaseItem(item);
                });
            }
        } else if (owned) {
            // Already owned (permanent item)
            this.detailsPanelContent.add(
                this.add.text(panelX, yPos, "✅ OWNED", {
                    fontSize: '16px',
                    fontFamily: 'Arial, sans-serif',
                    fill: '#10b981',
                    fontStyle: 'bold'
                }).setOrigin(0.5)
            );
        } else {
            // Requirements not met
            this.detailsPanelContent.add(
                this.add.text(panelX, yPos, "❌ REQUIREMENTS NOT MET", {
                    fontSize: '14px',
                    fontFamily: 'Arial, sans-serif',
                    fill: '#ff6b6b',
                    fontStyle: 'bold'
                }).setOrigin(0.5)
            );
        }
    }

    purchaseItem(item) {
        if (this.progressTracker.purchaseItem(item.id, this.currentCategory, item.price)) {
            // Update coin display
            this.coinBalanceText.setText(`🪙 ${this.progressTracker.getCoinBalance()} Coins`);
            
            // Show purchase success
            this.showPurchaseSuccess(item);
            
            // Refresh the category display
            this.showCategory(this.currentCategory);
            
            // Update details panel
            this.showItemDetails(item);
        }
    }

    useItem(item) {
        if (this.progressTracker.usePowerUp(item.id)) {
            this.showItemUsed(item);
            this.showCategory(this.currentCategory);
            this.showItemDetails(item);
        }
    }

    showPurchaseSuccess(item) {
        const successText = this.add.text(this.scale.width / 2, this.scale.height / 2, 
            `🎉 Purchased ${item.name}! 🎉`, {
            fontSize: '24px',
            fontFamily: 'Arial, sans-serif',
            fill: '#10b981',
            stroke: '#000000',
            strokeThickness: 3,
            backgroundColor: '#1f2937',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        this.tweens.add({
            targets: successText,
            alpha: 0,
            y: this.scale.height / 2 - 50,
            duration: 2000,
            onComplete: () => successText.destroy()
        });
    }

    showItemUsed(item) {
        const usedText = this.add.text(this.scale.width / 2, this.scale.height / 2, 
            `✨ ${item.name} Activated! ✨`, {
            fontSize: '20px',
            fontFamily: 'Arial, sans-serif',
            fill: '#fbbf24',
            stroke: '#000000',
            strokeThickness: 3,
            backgroundColor: '#1f2937',
            padding: { x: 20, y: 10 }
        }).setOrigin(0.5);

        this.tweens.add({
            targets: usedText,
            alpha: 0,
            y: this.scale.height / 2 - 50,
            duration: 2000,
            onComplete: () => usedText.destroy()
        });
    }

    showInventory() {
        // This could open a separate inventory scene or overlay
        // For now, we'll show a simple summary
        const inventory = this.progressTracker.getInventorySummary();
        
        let inventoryText = "📦 YOUR INVENTORY 📦\n\n";
        
        // Power-ups
        inventoryText += "⚡ Power-Ups:\n";
        Object.entries(inventory.powerUps).forEach(([key, count]) => {
            if (count > 0) {
                const item = this.shopItems.powerUps.find(item => item.id === key);
                inventoryText += `  ${item?.icon || '•'} ${item?.name || key}: ${count}\n`;
            }
        });
        
        // Other items
        ['cosmetics', 'tools', 'decorations'].forEach(category => {
            if (inventory[category].length > 0) {
                inventoryText += `\n${category === 'cosmetics' ? '🎨' : category === 'tools' ? '🔧' : '🎭'} ${category.charAt(0).toUpperCase() + category.slice(1)}:\n`;
                inventory[category].forEach(itemId => {
                    const item = this.shopItems[category].find(item => item.id === itemId);
                    inventoryText += `  ${item?.icon || '•'} ${item?.name || itemId}\n`;
                });
            }
        });

        const inventoryOverlay = this.add.rectangle(0, 0, this.scale.width, this.scale.height, 0x000000, 0.8)
            .setOrigin(0, 0)
            .setInteractive({ useHandCursor: false });

        const inventoryPanel = this.add.rectangle(
            this.scale.width / 2,
            this.scale.height / 2,
            600,
            400,
            0x1f2937
        ).setStrokeStyle(3, 0xffd700);

        const inventoryDisplay = this.add.text(this.scale.width / 2, this.scale.height / 2 - 50, inventoryText, {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            align: 'left',
            wordWrap: { width: 550 }
        }).setOrigin(0.5);

        const closeBtn = this.add.rectangle(this.scale.width / 2, this.scale.height / 2 + 150, 120, 40, 0xef4444)
            .setStrokeStyle(2, 0xffffff)
            .setInteractive({ useHandCursor: true });

        this.add.text(this.scale.width / 2, this.scale.height / 2 + 150, "Close", {
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0.5);

        closeBtn.on('pointerdown', () => {
            inventoryOverlay.destroy();
            inventoryPanel.destroy();
            inventoryDisplay.destroy();
            closeBtn.destroy();
        });
    }

    clearDetailsPanel() {
        this.detailsPanelContent.clear(true);
    }

    createCharacterInfoDisplay() {
        const character = this.progressTracker.getCharacter();
        const characterType = this.progressTracker.getCharacterType();
        
        if (!character || !characterType) {
            // Show message if no character selected
            this.add.text(20, 80, "⚠️ No robot selected. Visit Character Selection first!", {
                fontSize: '16px',
                fontFamily: 'Arial, sans-serif',
                fill: '#ff6b6b',
                stroke: '#000000',
                strokeThickness: 2
            });
            return;
        }
        
        // Character info background
        const infoBg = this.add.rectangle(150, 85, 280, 50, 0x1f2937, 0.9)
            .setStrokeStyle(2, characterType.baseColor);
        
        // Character icon and name
        this.add.text(60, 85, `${characterType.icon} ${character.name}`, {
            fontSize: '18px',
            fontFamily: 'Arial, sans-serif',
            fill: '#ffffff',
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);
        
        // Character type and level
        const level = this.progressTracker.getCharacterLevel();
        this.add.text(200, 75, `${characterType.name} - Level ${level}`, {
            fontSize: '14px',
            fontFamily: 'Arial, sans-serif',
            fill: characterType.accentColor,
            fontStyle: 'bold'
        }).setOrigin(0, 0.5);
        
        // Show relevant bonuses
        const bonuses = Object.entries(characterType.bonusMultipliers)
            .filter(([key]) => key !== 'coins')
            .map(([key, value]) => `+${Math.round((value - 1) * 100)}% ${key}`)
            .join(' | ');
            
        this.add.text(200, 95, bonuses, {
            fontSize: '11px',
            fontFamily: 'Arial, sans-serif',
            fill: '#00ff00',
            alpha: 0.9
        }).setOrigin(0, 0.5);
    }
} 