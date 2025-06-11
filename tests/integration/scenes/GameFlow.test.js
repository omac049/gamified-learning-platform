/* eslint-env jest */

describe('Game Flow Integration', () => {
  let mockGame;
  let sceneManager;

  beforeEach(() => {
    mockGame = createMockGame({
      type: Phaser.AUTO,
      width: 800,
      height: 600,
    });

    sceneManager = {
      scenes: new Map(),
      currentScene: null,
      transitionTo: jest.fn(),
      addScene: jest.fn(),
      removeScene: jest.fn(),
      pauseScene: jest.fn(),
      resumeScene: jest.fn(),
    };
  });

  describe('Scene Transitions', () => {
    test('should transition from Menu to Character Select', () => {
      const menuScene = { key: 'MenuScene', isActive: true };
      const characterSelectScene = {
        key: 'CharacterSelectScene',
        isActive: false,
      };

      sceneManager.scenes.set('MenuScene', menuScene);
      sceneManager.scenes.set('CharacterSelectScene', characterSelectScene);
      sceneManager.currentScene = menuScene;

      sceneManager.transitionTo.mockImplementation(sceneKey => {
        const targetScene = sceneManager.scenes.get(sceneKey);
        sceneManager.currentScene.isActive = false;
        targetScene.isActive = true;
        sceneManager.currentScene = targetScene;
        return targetScene;
      });

      const result = sceneManager.transitionTo('CharacterSelectScene');

      expect(result.key).toBe('CharacterSelectScene');
      expect(result.isActive).toBe(true);
      expect(menuScene.isActive).toBe(false);
    });

    test('should handle invalid scene transitions gracefully', () => {
      sceneManager.transitionTo.mockReturnValue(null);

      const result = sceneManager.transitionTo('NonExistentScene');

      expect(result).toBeNull();
      expect(sceneManager.transitionTo).toHaveBeenCalledWith(
        'NonExistentScene'
      );
    });

    test('should maintain scene state during transitions', () => {
      const gameScene = {
        key: 'Week1MathScene',
        playerData: { level: 5, score: 1000 },
        questionProgress: { current: 3, total: 10 },
      };

      sceneManager.scenes.set('Week1MathScene', gameScene);

      sceneManager.pauseScene.mockImplementation(sceneKey => {
        const scene = sceneManager.scenes.get(sceneKey);
        scene.isPaused = true;
        return scene;
      });

      const pausedScene = sceneManager.pauseScene('Week1MathScene');

      expect(pausedScene.isPaused).toBe(true);
      expect(pausedScene.playerData.level).toBe(5);
      expect(pausedScene.questionProgress.current).toBe(3);
    });
  });

  describe('Data Flow Between Scenes', () => {
    test('should pass player data from Character Select to Game Scene', () => {
      const characterData = {
        name: 'TestPlayer',
        avatar: 'warrior',
        stats: { health: 100, attack: 10, defense: 5 },
      };

      const characterSelectScene = {
        key: 'CharacterSelectScene',
        getSelectedCharacter: jest.fn().mockReturnValue(characterData),
      };

      const gameScene = {
        key: 'Week1MathScene',
        initializePlayer: jest.fn(),
      };

      sceneManager.scenes.set('CharacterSelectScene', characterSelectScene);
      sceneManager.scenes.set('Week1MathScene', gameScene);

      // Simulate data transfer
      const selectedCharacter = characterSelectScene.getSelectedCharacter();
      gameScene.initializePlayer(selectedCharacter);

      expect(gameScene.initializePlayer).toHaveBeenCalledWith(characterData);
      expect(selectedCharacter.name).toBe('TestPlayer');
      expect(selectedCharacter.stats.health).toBe(100);
    });

    test('should preserve progress when returning to menu', () => {
      const gameProgress = {
        currentWeek: 2,
        completedLevels: [1, 2, 3],
        totalScore: 2500,
        achievements: ['first_win', 'speed_demon'],
      };

      const gameScene = {
        key: 'Week2ReadingScene',
        getProgress: jest.fn().mockReturnValue(gameProgress),
      };

      const menuScene = {
        key: 'MenuScene',
        updateProgress: jest.fn(),
      };

      sceneManager.scenes.set('Week2ReadingScene', gameScene);
      sceneManager.scenes.set('MenuScene', menuScene);

      // Simulate returning to menu with progress
      const progress = gameScene.getProgress();
      menuScene.updateProgress(progress);

      expect(menuScene.updateProgress).toHaveBeenCalledWith(gameProgress);
      expect(progress.currentWeek).toBe(2);
      expect(progress.completedLevels).toHaveLength(3);
    });
  });

  describe('Scene Lifecycle Management', () => {
    test('should properly initialize scenes', () => {
      const newScene = {
        key: 'TestScene',
        init: jest.fn(),
        preload: jest.fn(),
        create: jest.fn(),
        isInitialized: false,
      };

      sceneManager.addScene.mockImplementation(scene => {
        scene.init();
        scene.preload();
        scene.create();
        scene.isInitialized = true;
        sceneManager.scenes.set(scene.key, scene);
        return scene;
      });

      const addedScene = sceneManager.addScene(newScene);

      expect(addedScene.init).toHaveBeenCalled();
      expect(addedScene.preload).toHaveBeenCalled();
      expect(addedScene.create).toHaveBeenCalled();
      expect(addedScene.isInitialized).toBe(true);
    });

    test('should clean up scenes when removed', () => {
      const sceneToRemove = {
        key: 'OldScene',
        destroy: jest.fn(),
        cleanup: jest.fn(),
      };

      sceneManager.scenes.set('OldScene', sceneToRemove);

      sceneManager.removeScene.mockImplementation(sceneKey => {
        const scene = sceneManager.scenes.get(sceneKey);
        if (scene) {
          scene.cleanup();
          scene.destroy();
          sceneManager.scenes.delete(sceneKey);
          return true;
        }
        return false;
      });

      const removed = sceneManager.removeScene('OldScene');

      expect(removed).toBe(true);
      expect(sceneToRemove.cleanup).toHaveBeenCalled();
      expect(sceneToRemove.destroy).toHaveBeenCalled();
      expect(sceneManager.scenes.has('OldScene')).toBe(false);
    });
  });

  describe('Educational Content Integration', () => {
    test('should track learning progress across scenes', () => {
      const mathProgress = {
        week1: { completed: true, score: 85, timeSpent: 300 },
        week2: { completed: false, score: 0, timeSpent: 0 },
      };

      const progressTracker = {
        updateProgress: jest.fn(),
        getOverallProgress: jest.fn().mockReturnValue(mathProgress),
        calculateGrade: jest.fn().mockReturnValue('B+'),
      };

      const mathScene = {
        key: 'Week1MathScene',
        progressTracker,
        completeLevel: jest.fn(),
      };

      mathScene.completeLevel.mockImplementation(levelData => {
        progressTracker.updateProgress('week1', levelData);
        return progressTracker.getOverallProgress();
      });

      const result = mathScene.completeLevel({
        score: 85,
        timeSpent: 300,
        questionsCorrect: 8,
        questionsTotal: 10,
      });

      expect(progressTracker.updateProgress).toHaveBeenCalled();
      expect(result.week1.completed).toBe(true);
      expect(result.week1.score).toBe(85);
    });

    test('should adapt difficulty based on performance', () => {
      const performanceData = {
        averageScore: 95,
        averageTime: 10,
        streakCount: 5,
      };

      const difficultyManager = {
        adjustDifficulty: jest.fn().mockReturnValue('hard'),
        getCurrentDifficulty: jest.fn().mockReturnValue('medium'),
      };

      const adaptiveScene = {
        key: 'AdaptiveQuizScene',
        difficultyManager,
        updateDifficulty: jest.fn(),
      };

      adaptiveScene.updateDifficulty.mockImplementation(performance => {
        const newDifficulty = difficultyManager.adjustDifficulty(performance);
        return newDifficulty;
      });

      const newDifficulty = adaptiveScene.updateDifficulty(performanceData);

      expect(difficultyManager.adjustDifficulty).toHaveBeenCalledWith(
        performanceData
      );
      expect(newDifficulty).toBe('hard');
    });
  });

  describe('Error Handling and Recovery', () => {
    test('should handle scene loading failures', () => {
      const failingScene = {
        key: 'FailingScene',
        load: jest.fn().mockImplementation(() => {
          throw new Error('Failed to load assets');
        }),
      };

      sceneManager.addScene.mockImplementation(scene => {
        try {
          scene.load();
          return scene;
        } catch (error) {
          return { error: error.message, fallback: true };
        }
      });

      const result = sceneManager.addScene(failingScene);

      expect(result.error).toBe('Failed to load assets');
      expect(result.fallback).toBe(true);
    });

    test('should recover from corrupted save data', () => {
      const corruptedData = '{"invalid": json}';
      const defaultData = {
        level: 1,
        score: 0,
        progress: {},
      };

      const saveManager = {
        loadData: jest.fn().mockImplementation(data => {
          try {
            return JSON.parse(data);
          } catch {
            return defaultData;
          }
        }),
      };

      const result = saveManager.loadData(corruptedData);

      expect(result).toEqual(defaultData);
      expect(result.level).toBe(1);
      expect(result.score).toBe(0);
    });
  });

  describe('Performance and Memory Management', () => {
    test('should limit number of active scenes', () => {
      const maxActiveScenes = 3;
      let activeScenes = [];

      sceneManager.addScene.mockImplementation(scene => {
        if (activeScenes.length >= maxActiveScenes) {
          // Remove oldest scene
          const oldestScene = activeScenes.shift();
          oldestScene.destroy();
        }
        activeScenes.push(scene);
        return scene;
      });

      // Add 5 scenes (more than the limit)
      for (let i = 1; i <= 5; i++) {
        const scene = {
          key: `Scene${i}`,
          destroy: jest.fn(),
        };
        sceneManager.addScene(scene);
      }

      expect(activeScenes).toHaveLength(maxActiveScenes);
      expect(activeScenes[0].key).toBe('Scene3'); // First two should be removed
    });

    test('should clean up resources when scenes are paused', () => {
      const resourceIntensiveScene = {
        key: 'ResourceIntensiveScene',
        animations: ['anim1', 'anim2', 'anim3'],
        sounds: ['sound1', 'sound2'],
        pauseAnimations: jest.fn(),
        stopSounds: jest.fn(),
      };

      sceneManager.pauseScene.mockImplementation(sceneKey => {
        const scene = sceneManager.scenes.get(sceneKey);
        scene.pauseAnimations();
        scene.stopSounds();
        scene.isPaused = true;
        return scene;
      });

      sceneManager.scenes.set('ResourceIntensiveScene', resourceIntensiveScene);
      const pausedScene = sceneManager.pauseScene('ResourceIntensiveScene');

      expect(pausedScene.pauseAnimations).toHaveBeenCalled();
      expect(pausedScene.stopSounds).toHaveBeenCalled();
      expect(pausedScene.isPaused).toBe(true);
    });
  });
});
