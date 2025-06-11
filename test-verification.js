// Test Verification Script for Mobile Enhancements
// Run this in browser console to verify all features

console.log('🧪 STARTING MOBILE ENHANCEMENT VERIFICATION...\n');

// Test 1: Check if character sprites exist
console.log('📋 TEST 1: Character Sprites');
const spriteTests = [
  '/assets/characters/aria_idle.svg',
  '/assets/characters/titan_idle.svg',
  '/assets/characters/nexus_idle.svg',
];

spriteTests.forEach(async (sprite, index) => {
  try {
    const response = await fetch(sprite);
    if (response.ok) {
      console.log(`✅ ${sprite} - Found`);
    } else {
      console.log(`❌ ${sprite} - Not Found (${response.status})`);
    }
  } catch (error) {
    console.log(`❌ ${sprite} - Error: ${error.message}`);
  }
});

// Test 2: Mobile Detection
console.log('\n📋 TEST 2: Mobile Detection');
const isMobile =
  /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(
    navigator.userAgent
  );
const hasTouch = 'ontouchstart' in window || navigator.maxTouchPoints > 0;
console.log(`📱 Mobile Detected: ${isMobile ? '✅ Yes' : '❌ No'}`);
console.log(`👆 Touch Support: ${hasTouch ? '✅ Yes' : '❌ No'}`);
console.log(`📐 Screen Size: ${screen.width}x${screen.height}`);
console.log(`🖼️ Viewport: ${window.innerWidth}x${window.innerHeight}`);
console.log(`🔍 Device Pixel Ratio: ${window.devicePixelRatio || 1}`);

// Test 3: Game Loading
console.log('\n📋 TEST 3: Game Loading');
if (window.game) {
  console.log('✅ Phaser Game Instance: Found');
  console.log(
    `🎮 Game Size: ${window.game.config.width}x${window.game.config.height}`
  );
  console.log(
    `🎯 Renderer: ${window.game.renderer.type === 0 ? 'Canvas' : 'WebGL'}`
  );

  // Check if InputController exists
  const currentScene = window.game.scene.getScenes(true)[0];
  if (currentScene && currentScene.inputController) {
    console.log('✅ InputController: Found');
    console.log(
      `📱 Touch Enabled: ${currentScene.inputController.touchEnabled ? '✅ Yes' : '❌ No'}`
    );

    // Check touch controls
    const { touchControls } = currentScene.inputController;
    console.log(
      `🕹️ Virtual Joystick: ${touchControls.movementJoystick ? '✅ Yes' : '❌ No'}`
    );
    console.log(
      `🔥 Fire Button: ${touchControls.fireButton ? '✅ Yes' : '❌ No'}`
    );
    console.log(
      `🔄 Weapon Button: ${touchControls.weaponButton ? '✅ Yes' : '❌ No'}`
    );
    console.log(
      `⚡ Ability Buttons: ${touchControls.abilityButtons.length} found`
    );
    console.log(
      `⏸️ Pause Button: ${touchControls.pauseButton ? '✅ Yes' : '❌ No'}`
    );
  } else {
    console.log('❌ InputController: Not Found');
  }
} else {
  console.log('❌ Phaser Game Instance: Not Found');
}

// Test 4: Performance Check
console.log('\n📋 TEST 4: Performance');
if ('memory' in performance) {
  const { memory } = performance;
  console.log(
    `💾 Used Memory: ${Math.round(memory.usedJSHeapSize / 1024 / 1024)}MB`
  );
  console.log(
    `💾 Total Memory: ${Math.round(memory.totalJSHeapSize / 1024 / 1024)}MB`
  );
  console.log(
    `💾 Memory Limit: ${Math.round(memory.jsHeapSizeLimit / 1024 / 1024)}MB`
  );
} else {
  console.log('📊 Memory API: Not Available');
}

// Test 5: Battery (if available)
console.log('\n📋 TEST 5: Battery Status');
if ('getBattery' in navigator) {
  navigator.getBattery().then(battery => {
    console.log(`🔋 Battery Level: ${Math.round(battery.level * 100)}%`);
    console.log(`🔌 Charging: ${battery.charging ? '✅ Yes' : '❌ No'}`);
  });
} else {
  console.log('🔋 Battery API: Not Available');
}

// Test 6: Touch Events (if on mobile)
if (hasTouch) {
  console.log('\n📋 TEST 6: Touch Event Test');
  console.log('👆 Touch the screen to test touch events...');

  let touchTestCount = 0;
  const touchTestHandler = e => {
    touchTestCount++;
    console.log(
      `✅ Touch Event ${touchTestCount}: ${e.type} - ${e.touches.length} touches`
    );

    if (touchTestCount >= 3) {
      document.removeEventListener('touchstart', touchTestHandler);
      document.removeEventListener('touchmove', touchTestHandler);
      document.removeEventListener('touchend', touchTestHandler);
      console.log('✅ Touch Events: Working properly');
    }
  };

  document.addEventListener('touchstart', touchTestHandler);
  document.addEventListener('touchmove', touchTestHandler);
  document.addEventListener('touchend', touchTestHandler);
}

console.log('\n🎉 VERIFICATION COMPLETE!');
console.log('📊 Check the results above to ensure all features are working.');
console.log(
  '🔧 If any tests fail, check the console for detailed error messages.'
);

// Return summary
setTimeout(() => {
  console.log('\n📋 QUICK SUMMARY:');
  console.log(`📱 Mobile Ready: ${isMobile && hasTouch ? '✅' : '❌'}`);
  console.log(`🎮 Game Loaded: ${window.game ? '✅' : '❌'}`);
  console.log(
    `🕹️ Touch Controls: ${window.game && window.game.scene.getScenes(true)[0]?.inputController?.touchEnabled ? '✅' : '❌'}`
  );
  console.log('🚀 Platform Status: Ready for testing!');
}, 2000);
