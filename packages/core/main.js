import { Game } from 'phaser';
import { Preloader } from './preloader.js';
import {
  IntroScene,
  CharacterSelectScene,
  EducationalMenuScene,
  ShopScene,
  Week1MathScene,
  Week2ReadingScene,
  Week3ScienceScene,
  Week4HistoryScene,
  Week5CrossoverScene,
  Week6FinalScene,
} from '../scenes/index.js';

console.log('Main: Starting Gamified Learning Platform');

// AudioContext fix for user interaction requirement
let audioContextUnlocked = false;

function unlockAudioContext() {
  if (audioContextUnlocked) return;

  console.log('Main: Attempting to unlock AudioContext...');

  // Try to resume the audio context if it exists
  if (window.game && window.game.sound && window.game.sound.context) {
    if (window.game.sound.context.state === 'suspended') {
      window.game.sound.context
        .resume()
        .then(() => {
          console.log('Main: AudioContext successfully resumed!');
          audioContextUnlocked = true;
        })
        .catch(err => {
          console.warn('Main: Failed to resume AudioContext:', err);
        });
    } else {
      console.log('Main: AudioContext already running');
      audioContextUnlocked = true;
    }
  }
}

// Add user interaction listeners to unlock audio
function addAudioUnlockListeners() {
  const unlockEvents = [
    'click',
    'touchstart',
    'touchend',
    'pointerdown',
    'keydown',
  ];

  const unlockHandler = () => {
    unlockAudioContext();

    // Remove listeners after first interaction from document and canvas
    unlockEvents.forEach(event => {
      document.removeEventListener(event, unlockHandler, true);
      if (window.game && window.game.canvas) {
        window.game.canvas.removeEventListener(event, unlockHandler, true);
      }
    });
  };

  // Add listeners for all interaction types
  unlockEvents.forEach(event => {
    document.addEventListener(event, unlockHandler, true);
  });

  console.log('Main: Audio unlock listeners added to document');

  // Also add listeners to the game canvas when it's available
  const addCanvasListeners = () => {
    if (game && game.canvas) {
      unlockEvents.forEach(event => {
        game.canvas.addEventListener(event, unlockHandler, true);
      });
      console.log('Main: Audio unlock listeners added to game canvas');
    } else {
      // Retry after a short delay
      setTimeout(addCanvasListeners, 100);
    }
  };

  // Try to add canvas listeners after a short delay
  setTimeout(addCanvasListeners, 500);
}

// More information about config: https://newdocs.phaser.io/docs/3.70.0/Phaser.Types.Core.GameConfig
const config = {
  type: Phaser.AUTO,
  width: 1024,
  height: 768,
  parent: 'phaser-container',
  backgroundColor: '#1a0033',
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH,
    min: {
      width: 800,
      height: 600,
    },
    max: {
      width: 1600,
      height: 1200,
    },
  },
  scene: [
    Preloader,
    IntroScene,
    CharacterSelectScene,
    EducationalMenuScene,
    ShopScene,
    Week1MathScene,
    Week2ReadingScene,
    Week3ScienceScene,
    Week4HistoryScene,
    Week5CrossoverScene,
    Week6FinalScene,
  ],
  physics: {
    default: 'arcade',
    arcade: {
      gravity: { y: 500 },
      debug: false,
    },
  },
  // Audio configuration to prevent warnings
  audio: {
    disableWebAudio: false,
    noAudio: false,
  },
};

console.log('Main: Creating Phaser game instance');
console.log(
  `     Phaser v${Phaser.VERSION} (${Phaser.RENDERER_TYPE} | ${
    Phaser.AUDIO_TYPE
  })  ` + `https://phaser.io`
);

const game = new Game(config);

// Make game globally accessible for audio context management
window.game = game;

// Add audio unlock listeners immediately
addAudioUnlockListeners();

// Additional audio context handling when game is ready
game.events.once('ready', () => {
  console.log('Main: Game ready, setting up audio context handling');

  // Add input callback for audio context unlocking - check if input exists first
  if (game.input && game.input.on) {
    game.input.on('pointerdown', () => {
      unlockAudioContext();
    });
    console.log('Main: Input event listeners added successfully');
  } else {
    console.warn(
      'Main: Game input not available yet, will try alternative approach'
    );

    // Alternative approach: use scene-level input handling
    game.events.on('step', () => {
      if (game.input && game.input.on && !audioContextUnlocked) {
        game.input.on('pointerdown', () => {
          unlockAudioContext();
        });
        console.log('Main: Input event listeners added via step event');
      }
    });
  }

  // Check audio context state periodically
  const checkAudioContext = () => {
    if (game.sound && game.sound.context) {
      if (game.sound.context.state === 'suspended' && !audioContextUnlocked) {
        console.log(
          'Main: AudioContext still suspended, waiting for user interaction'
        );
      }
    }
  };

  // Check every 2 seconds for the first 10 seconds
  let checkCount = 0;
  const audioCheckInterval = setInterval(() => {
    checkAudioContext();
    checkCount++;
    if (checkCount >= 5 || audioContextUnlocked) {
      clearInterval(audioCheckInterval);
    }
  }, 2000);
});

// Global error handling with enhanced hitAreaCallback protection
window.addEventListener('error', event => {
  console.error('Main: Global error caught:', event.error);

  // Specific handling for hitAreaCallback errors
  if (
    event.error &&
    event.error.message &&
    event.error.message.includes('hitAreaCallback is not a function')
  ) {
    console.error(
      'Main: HitAreaCallback error detected - this indicates an interactive object with corrupted hit area'
    );
    console.error('Main: Stack trace:', event.error.stack);
    console.warn(
      'Main: This error has been suppressed to prevent console flooding'
    );

    // Try to prevent the error from cascading
    event.preventDefault();
    return false;
  }

  // Handle other Phaser input-related errors
  if (
    event.error &&
    event.error.message &&
    (event.error.message.includes('pointWithinHitArea') ||
      event.error.message.includes('hitTest') ||
      event.error.message.includes('InputManager') ||
      event.error.message.includes('InputPlugin'))
  ) {
    console.error(
      'Main: Phaser input system error detected:',
      event.error.message
    );
    console.warn('Main: Input error suppressed to maintain game stability');
    event.preventDefault();
    return false;
  }
});

// Additional error handling for unhandled promise rejections
window.addEventListener('unhandledrejection', event => {
  console.error('Main: Unhandled promise rejection:', event.reason);

  if (
    event.reason &&
    event.reason.message &&
    (event.reason.message.includes('hitAreaCallback') ||
      event.reason.message.includes('pointWithinHitArea'))
  ) {
    console.error('Main: HitAreaCallback promise rejection detected');
    console.warn(
      'Main: Promise rejection suppressed to maintain game stability'
    );
    event.preventDefault();
  }
});

// Enhanced Phaser input system protection
// Disable aggressive InputManager override to avoid suppressing valid input events
if (false && typeof Phaser !== 'undefined' && Phaser.Input) {
  // Override the problematic method with error protection
  const originalPointWithinHitArea =
    Phaser.Input.InputManager.prototype.pointWithinHitArea;
  if (originalPointWithinHitArea) {
    Phaser.Input.InputManager.prototype.pointWithinHitArea = function (
      gameObject,
      x,
      y
    ) {
      try {
        // Immediate check for Graphics objects with any input issues
        if (gameObject.type === 'Graphics' && gameObject.input) {
          // For Graphics objects, always use a safe fallback approach
          if (
            !gameObject.input.hitAreaCallback ||
            typeof gameObject.input.hitAreaCallback !== 'function' ||
            !gameObject.input.hitArea
          ) {
            console.warn(
              'Main: Graphics object with problematic input detected, using safe fallback'
            );

            // Immediately clean up the Graphics object input
            try {
              gameObject.input = null;
            } catch (cleanupError) {
              console.warn(
                'Main: Graphics cleanup failed:',
                cleanupError.message
              );
            }

            return false;
          }
        }

        // Check if hitAreaCallback exists and is a function
        if (
          gameObject.input &&
          gameObject.input.hitAreaCallback &&
          typeof gameObject.input.hitAreaCallback !== 'function'
        ) {
          console.warn('Main: Detected corrupted hitAreaCallback on object:', {
            type: gameObject.type,
            scene: gameObject.scene ? gameObject.scene.scene.key : 'unknown',
            x: gameObject.x,
            y: gameObject.y,
            callbackType: typeof gameObject.input.hitAreaCallback,
            hitAreaType: gameObject.input.hitArea
              ? gameObject.input.hitArea.constructor.name
              : 'none',
            isGraphics: gameObject.type === 'Graphics',
          });

          // Immediately clean up the corrupted object
          try {
            // For Graphics objects, be more aggressive in cleanup
            if (gameObject.type === 'Graphics') {
              console.log(
                'Main: Immediately cleaning up corrupted Graphics object'
              );

              // Remove all event listeners first
              if (gameObject.removeAllListeners) {
                gameObject.removeAllListeners();
              }

              // Clear all input properties
              gameObject.input.hitAreaCallback = null;
              gameObject.input.hitArea = null;
              gameObject.input.enabled = false;
              gameObject.input.cursor = null;
              gameObject.input.useHandCursor = false;

              // Remove from input manager
              if (gameObject.input.gameObject) {
                gameObject.input.gameObject = null;
              }

              // Disable the entire input object
              gameObject.input = null;

              console.log(
                'Main: Successfully cleaned up corrupted Graphics object'
              );
            } else {
              // For non-Graphics objects, use standard cleanup
              gameObject.input.hitAreaCallback = null;
              gameObject.input.hitArea = null;
              gameObject.removeInteractive();
            }
          } catch (cleanupError) {
            console.warn(
              'Main: Could not clean up corrupted interactive object:',
              cleanupError.message
            );

            // Last resort: try to completely disable the object's input
            try {
              if (gameObject.input) {
                gameObject.input = null;
              }
            } catch (lastResortError) {
              console.error(
                'Main: Last resort cleanup failed:',
                lastResortError.message
              );
            }
          }

          return false;
        }

        // Additional validation for Graphics objects
        if (
          gameObject.type === 'Graphics' &&
          gameObject.input &&
          gameObject.input.hitArea
        ) {
          // Ensure Graphics objects have valid hit areas
          if (
            !gameObject.input.hitArea ||
            typeof gameObject.input.hitArea !== 'object'
          ) {
            console.warn(
              'Main: Graphics object has invalid hit area, cleaning up'
            );
            try {
              gameObject.input = null;
            } catch (error) {
              console.warn(
                'Main: Error cleaning up Graphics hit area:',
                error.message
              );
            }
            return false;
          }

          // Additional check for Graphics objects with absolute coordinate hit areas
          if (gameObject.input.hitArea instanceof Phaser.Geom.Rectangle) {
            const { hitArea } = gameObject.input;

            // Check if hit area coordinates seem to be absolute instead of relative
            if (hitArea.x > 100 || hitArea.y > 100) {
              console.warn(
                'Main: Graphics object appears to have absolute coordinate hit area, cleaning up'
              );
              try {
                gameObject.input = null;
              } catch (error) {
                console.warn(
                  'Main: Error cleaning up Graphics absolute hit area:',
                  error.message
                );
              }
              return false;
            }
          }
        }

        return originalPointWithinHitArea.call(this, gameObject, x, y);
      } catch (error) {
        console.warn('Main: Protected hitAreaCallback error:', {
          message: error.message,
          objectType: gameObject ? gameObject.type : 'unknown',
          scene:
            gameObject && gameObject.scene
              ? gameObject.scene.scene.key
              : 'unknown',
          isGraphics: gameObject ? gameObject.type === 'Graphics' : false,
          stack: error.stack,
        });

        // If we get here, something went very wrong - clean up the object
        try {
          if (gameObject && gameObject.input) {
            gameObject.input = null;
          }
        } catch (finalCleanupError) {
          console.error(
            'Main: Final cleanup failed:',
            finalCleanupError.message
          );
        }

        return false;
      }
    };
  }

  // Enhanced global cleanup function for scene transitions
  window.cleanupCorruptedInteractives = function () {
    let cleanedCount = 0;
    let graphicsCleanedCount = 0;
    if (game && game.scene && game.scene.scenes) {
      game.scene.scenes.forEach(scene => {
        if (scene && scene.children && scene.children.list) {
          scene.children.list.forEach(child => {
            // Check for corrupted hitAreaCallback
            if (
              child.input &&
              child.input.hitAreaCallback &&
              typeof child.input.hitAreaCallback !== 'function'
            ) {
              console.warn(
                'Main: Cleaning up corrupted interactive object in scene:',
                scene.scene.key
              );
              try {
                // Special handling for Graphics objects
                if (child.type === 'Graphics') {
                  console.log('Main: Cleaning up corrupted Graphics object');

                  // Remove all event listeners
                  if (child.removeAllListeners) {
                    child.removeAllListeners();
                  }

                  // Clear all input properties aggressively
                  child.input.hitAreaCallback = null;
                  child.input.hitArea = null;
                  child.input.enabled = false;
                  child.input.cursor = null;
                  child.input.useHandCursor = false;

                  if (child.input.gameObject) {
                    child.input.gameObject = null;
                  }

                  // Completely remove input object for Graphics
                  child.input = null;

                  graphicsCleanedCount++;
                } else {
                  // Standard cleanup for other objects
                  child.removeAllListeners();
                  child.removeInteractive();
                }
                cleanedCount++;
              } catch (error) {
                console.warn('Main: Error during cleanup:', error.message);

                // Last resort cleanup
                try {
                  if (child.input) {
                    child.input = null;
                  }
                } catch (lastResortError) {
                  console.error(
                    'Main: Last resort cleanup failed:',
                    lastResortError.message
                  );
                }
              }
            }

            // Additional check for Graphics objects with invalid hit areas
            if (
              child.type === 'Graphics' &&
              child.input &&
              child.input.hitArea
            ) {
              if (
                !child.input.hitArea ||
                typeof child.input.hitArea !== 'object'
              ) {
                console.warn(
                  'Main: Found Graphics object with invalid hit area, cleaning up'
                );
                try {
                  child.removeInteractive();
                  graphicsCleanedCount++;
                  cleanedCount++;
                } catch (error) {
                  console.warn(
                    'Main: Error cleaning up Graphics hit area:',
                    error.message
                  );
                  // Force cleanup
                  try {
                    child.input = null;
                  } catch (forceError) {
                    console.error(
                      'Main: Force cleanup failed:',
                      forceError.message
                    );
                  }
                }
              }
            }

            // Special check for EducationalMenuScene Graphics objects
            if (
              scene.scene.key === 'EducationalMenuScene' &&
              child.type === 'Graphics' &&
              child.input
            ) {
              // Proactively check for potential issues
              if (
                child.input.hitAreaCallback &&
                typeof child.input.hitAreaCallback !== 'function'
              ) {
                console.warn(
                  'Main: Proactive cleanup of EducationalMenuScene Graphics object'
                );
                try {
                  child.input = null;
                  graphicsCleanedCount++;
                  cleanedCount++;
                } catch (error) {
                  console.warn(
                    'Main: Proactive cleanup failed:',
                    error.message
                  );
                }
              }
            }
          });
        }
      });
    }
    if (cleanedCount > 0) {
      console.log(
        `Main: Cleaned up ${cleanedCount} corrupted interactive objects (${graphicsCleanedCount} Graphics objects)`
      );
    }
    return cleanedCount;
  };
}

// Global safe setInteractive function
window.safeSetInteractive = function (
  gameObject,
  hitArea = null,
  options = {}
) {
  if (!gameObject || !gameObject.setInteractive) {
    console.warn('Main: safeSetInteractive called with invalid object');
    return false;
  }

  try {
    // Remove any existing interactive setup first
    if (gameObject.input) {
      gameObject.removeInteractive();
    }

    // Set default options if none provided
    const safeOptions = {
      useHandCursor: true,
      ...options,
    };

    // Apply interactive setup based on hit area type
    if (hitArea) {
      if (hitArea instanceof Phaser.Geom.Rectangle) {
        gameObject.setInteractive(
          hitArea,
          Phaser.Geom.Rectangle.Contains,
          safeOptions
        );
      } else if (hitArea instanceof Phaser.Geom.Circle) {
        gameObject.setInteractive(
          hitArea,
          Phaser.Geom.Circle.Contains,
          safeOptions
        );
      } else {
        // For other hit area types, let Phaser auto-detect
        gameObject.setInteractive(safeOptions);
      }
    } else {
      // No hit area specified, use auto-detection
      gameObject.setInteractive(safeOptions);
    }

    // Verify the setup was successful
    if (
      gameObject.input &&
      gameObject.input.hitAreaCallback &&
      typeof gameObject.input.hitAreaCallback !== 'function'
    ) {
      console.warn(
        'Main: safeSetInteractive resulted in corrupted hitAreaCallback, removing interactive'
      );
      gameObject.removeInteractive();
      return false;
    }

    return true;
  } catch (error) {
    console.error('Main: Error in safeSetInteractive:', error);
    try {
      gameObject.removeInteractive();
    } catch (cleanupError) {
      console.warn(
        'Main: Could not clean up after setInteractive error:',
        cleanupError.message
      );
    }
    return false;
  }
};

console.log('Main: Game initialization complete');

// Game ready callback - setup scene event listeners here
game.events.once('ready', () => {
  console.log('Main: Game ready!');

  // Now that the game is ready, set up cleanup systems
  if (game && game.scene) {
    console.log('Main: Setting up cleanup systems');

    // Add scene-level input handling for audio context unlocking
    // Use a safer approach to access scenes
    if (game.scene.scenes && Array.isArray(game.scene.scenes)) {
      game.scene.scenes.forEach(scene => {
        if (scene && scene.input && scene.input.on) {
          scene.input.on('pointerdown', () => {
            unlockAudioContext();
          });
          console.log(
            'Main: Added audio unlock handler to scene:',
            scene.scene ? scene.scene.key : 'unknown'
          );
        }
      });
    } else {
      console.log(
        'Main: Scene array not available yet, will add handlers when scenes are created'
      );
    }

    // Listen for new scenes being added and add input handlers
    if (game.scene.on) {
      game.scene.on('add', scene => {
        if (scene && scene.input && scene.input.on) {
          scene.input.on('pointerdown', () => {
            unlockAudioContext();
          });
          console.log(
            'Main: Added audio unlock handler to new scene:',
            scene.scene ? scene.scene.key : 'unknown'
          );
        }
      });
    }

    // Override scene manager methods to add cleanup
    const originalSceneStart = game.scene.start;
    if (originalSceneStart) {
      game.scene.start = function (key, data) {
        console.log('Main: Scene transition to:', key);
        // Clean up before starting new scene
        if (window.cleanupCorruptedInteractives) {
          window.cleanupCorruptedInteractives();
        }

        // Add input handler to the new scene when it starts
        const newScene = this.getScene(key);
        if (newScene && newScene.input && newScene.input.on) {
          newScene.input.on('pointerdown', () => {
            unlockAudioContext();
          });
        }

        return originalSceneStart.call(this, key, data);
      };
    }

    const originalSceneStop = game.scene.stop;
    if (originalSceneStop) {
      game.scene.stop = function (key, data) {
        console.log('Main: Scene stopping:', key);
        // Clean up before stopping scene
        if (window.cleanupCorruptedInteractives) {
          window.cleanupCorruptedInteractives();
        }
        return originalSceneStop.call(this, key, data);
      };
    }

    // Periodic cleanup to prevent accumulation of corrupted objects
    setInterval(() => {
      if (window.cleanupCorruptedInteractives) {
        const cleanedCount = window.cleanupCorruptedInteractives();
        if (cleanedCount > 0) {
          console.log(
            `Main: Periodic cleanup removed ${cleanedCount} corrupted interactive objects`
          );
        }
      }
    }, 5000); // Run every 5 seconds

    // More frequent cleanup for EducationalMenuScene specifically
    setInterval(() => {
      if (game && game.scene && game.scene.getScene) {
        const scene = game.scene.getScene('EducationalMenuScene');
        if (
          scene &&
          scene.scene &&
          scene.scene.isActive &&
          scene.scene.isActive()
        ) {
          let cleanedCount = 0;
          if (scene.children && scene.children.list) {
            scene.children.list.forEach(child => {
              if (
                child.type === 'Graphics' &&
                child.input &&
                child.input.hitAreaCallback &&
                typeof child.input.hitAreaCallback !== 'function'
              ) {
                console.warn(
                  'Main: EducationalMenuScene specific cleanup of Graphics object'
                );
                try {
                  child.input = null;
                  cleanedCount++;
                } catch (error) {
                  console.warn(
                    'Main: EducationalMenuScene cleanup failed:',
                    error.message
                  );
                }
              }
            });
          }
          if (cleanedCount > 0) {
            console.log(
              `Main: EducationalMenuScene specific cleanup removed ${cleanedCount} Graphics objects`
            );
          }
        }
      }
    }, 2000); // Run every 2 seconds for EducationalMenuScene

    // Add cleanup on mouse events to prevent errors during interaction
    if (game.canvas) {
      game.canvas.addEventListener(
        'mousemove',
        () => {
          // Quick cleanup before mouse move processing
          if (game && game.scene && game.scene.getScene) {
            const scene = game.scene.getScene('EducationalMenuScene');
            if (
              scene &&
              scene.scene &&
              scene.scene.isActive &&
              scene.scene.isActive() &&
              scene.children &&
              scene.children.list
            ) {
              scene.children.list.forEach(child => {
                if (
                  child.type === 'Graphics' &&
                  child.input &&
                  child.input.hitAreaCallback &&
                  typeof child.input.hitAreaCallback !== 'function'
                ) {
                  try {
                    child.input = null;
                  } catch (error) {
                    // Silent cleanup on mouse events
                  }
                }
              });
            }
          }
        },
        { passive: true }
      );
    }
  } else {
    console.warn('Main: Game scene manager not available in ready callback');
  }
});

console.log('Main: Game initialization complete');

// Override Graphics setInteractive to prevent hitAreaCallback issues
if (Phaser.GameObjects && Phaser.GameObjects.Graphics) {
  const originalSetInteractive =
    Phaser.GameObjects.Graphics.prototype.setInteractive;
  if (originalSetInteractive) {
    Phaser.GameObjects.Graphics.prototype.setInteractive = function (
      hitArea,
      callback,
      dropZone
    ) {
      try {
        console.log(
          'Main: Graphics setInteractive called, using safe auto-detection'
        );

        // For Graphics objects, always use auto-detection to prevent hitAreaCallback issues
        // Ignore any custom hit areas or callbacks that might cause problems
        const safeOptions = {};

        // Extract options from the first parameter if it's an options object
        if (
          hitArea &&
          typeof hitArea === 'object' &&
          !hitArea.x &&
          !hitArea.y &&
          !hitArea.width &&
          !hitArea.height
        ) {
          // First parameter is options object
          Object.assign(safeOptions, hitArea);
        } else if (callback && typeof callback === 'object' && !callback.call) {
          // Second parameter is options object
          Object.assign(safeOptions, callback);
        }

        // Always use auto-detection for Graphics objects
        return originalSetInteractive.call(this, safeOptions);
      } catch (error) {
        console.error(
          'Main: Error in Graphics setInteractive override:',
          error
        );

        // Fallback: try the original method with just options
        try {
          return originalSetInteractive.call(this, { useHandCursor: true });
        } catch (fallbackError) {
          console.error(
            'Main: Graphics setInteractive fallback failed:',
            fallbackError
          );
          return this;
        }
      }
    };
  }
}
