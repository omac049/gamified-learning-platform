require('jest-canvas-mock');

// Mock Phaser globally
global.Phaser = {
  Scene: class MockScene {
    constructor() {
      this.add = {
        text: jest.fn().mockReturnThis(),
        image: jest.fn().mockReturnThis(),
        sprite: jest.fn().mockReturnThis(),
        graphics: jest.fn().mockReturnThis(),
        container: jest.fn().mockReturnThis(),
      };
      this.input = {
        keyboard: {
          createCursorKeys: jest.fn(),
          addKey: jest.fn(),
        },
        on: jest.fn(),
      };
      this.physics = {
        add: {
          sprite: jest.fn().mockReturnThis(),
        },
        world: {
          setBounds: jest.fn(),
        },
      };
      this.cameras = {
        main: {
          setBounds: jest.fn(),
          startFollow: jest.fn(),
        },
      };
      this.scene = {
        start: jest.fn(),
        stop: jest.fn(),
        pause: jest.fn(),
        resume: jest.fn(),
        get: jest.fn(),
      };
      this.events = {
        on: jest.fn(),
        emit: jest.fn(),
        off: jest.fn(),
      };
      this.time = {
        addEvent: jest.fn(),
        delayedCall: jest.fn(),
      };
      this.tweens = {
        add: jest.fn(),
        create: jest.fn(),
      };
      this.sound = {
        add: jest.fn().mockReturnValue({
          play: jest.fn(),
          stop: jest.fn(),
          setVolume: jest.fn(),
        }),
        play: jest.fn(),
      };
    }

    create() {}
    update() {}
    preload() {}
  },
  Game: class MockGame {
    constructor(config) {
      this.config = config;
      this.scene = {
        add: jest.fn(),
        start: jest.fn(),
        stop: jest.fn(),
        getScene: jest.fn(),
        getScenes: jest.fn().mockReturnValue([]),
      };
      this.canvas = document.createElement('canvas');
      this.renderer = {
        type: 1, // WebGL
      };
    }
  },
  GameObjects: {
    Sprite: class MockSprite {
      constructor() {
        this.x = 0;
        this.y = 0;
        this.setOrigin = jest.fn().mockReturnThis();
        this.setScale = jest.fn().mockReturnThis();
        this.setTint = jest.fn().mockReturnThis();
        this.setVisible = jest.fn().mockReturnThis();
        this.destroy = jest.fn();
      }
    },
    Text: class MockText {
      constructor() {
        this.text = '';
        this.setText = jest.fn().mockReturnThis();
        this.setOrigin = jest.fn().mockReturnThis();
        this.setStyle = jest.fn().mockReturnThis();
        this.destroy = jest.fn();
      }
    },
    Graphics: class MockGraphics {
      constructor() {
        this.fillStyle = jest.fn().mockReturnThis();
        this.fillRect = jest.fn().mockReturnThis();
        this.strokeRect = jest.fn().mockReturnThis();
        this.clear = jest.fn().mockReturnThis();
        this.destroy = jest.fn();
      }
    },
  },
  Math: {
    Distance: {
      Between: jest.fn((x1, y1, x2, y2) =>
        Math.sqrt((x2 - x1) ** 2 + (y2 - y1) ** 2)
      ),
    },
    Angle: {
      Between: jest.fn((x1, y1, x2, y2) => Math.atan2(y2 - y1, x2 - x1)),
    },
    Clamp: jest.fn((value, min, max) => Math.max(min, Math.min(max, value))),
  },
  Utils: {
    Array: {
      GetRandom: jest.fn(array => array[0]),
      Shuffle: jest.fn(array => array),
    },
  },
  Input: {
    Keyboard: {
      KeyCodes: {
        SPACE: 32,
        ENTER: 13,
        ESC: 27,
        W: 87,
        A: 65,
        S: 83,
        D: 68,
        UP: 38,
        DOWN: 40,
        LEFT: 37,
        RIGHT: 39,
      },
    },
  },
  AUTO: 'AUTO',
  WEBGL: 'WEBGL',
  CANVAS: 'CANVAS',
};

// Mock window and document for browser environment
Object.defineProperty(window, 'location', {
  value: {
    href: 'http://localhost:3000',
    origin: 'http://localhost:3000',
  },
  writable: true,
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
global.localStorage = localStorageMock;

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn(),
};

// Setup test utilities
global.createMockScene = () => new Phaser.Scene();
global.createMockGame = config => new Phaser.Game(config);

// Mock performance API
global.performance = {
  now: jest.fn(() => Date.now()),
  mark: jest.fn(),
  measure: jest.fn(),
};

// Mock requestAnimationFrame
global.requestAnimationFrame = jest.fn(cb => setTimeout(cb, 16));
global.cancelAnimationFrame = jest.fn(id => clearTimeout(id));
