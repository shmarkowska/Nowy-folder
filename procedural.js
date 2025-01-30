//this file is a part of testing - test.js uses this as imitation of real game code. 
//node.js needs game screen to run, but it would not be possible with how many iterations run in test.js, 
//so this file imitates game screen with many attributes and game mechanics.
export const ENEMY_DEFINITIONS = [
    { texture: 'enemy1', hp: 10, speed: 80, xpValue: 20, minLevel: 1 },
    { texture: 'enemy2', hp: 20, speed: 90, xpValue: 50, minLevel: 2 },
    { texture: 'enemy3', hp: 40, speed: 100, xpValue: 100, minLevel: 3 },
    { texture: 'enemy4', hp: 60, speed: 110, xpValue: 180, minLevel: 4 },
    { texture: 'enemy5', hp: 120, speed: 120, xpValue: 300, minLevel: 5 }
  ];
  
  /**
   * @param {number} playerLevel
   * @param {number} screenWidth 
   * @param {number} screenHeight
   * @returns {object}
   */
  export function generateEnemyData(playerLevel, screenWidth, screenHeight) {
    let x, y;
    const edge = Math.floor(Math.random() * 4);
    switch (edge) {
      case 0: x = Math.random() * screenWidth; y = 0; break;
      case 1: x = Math.random() * screenWidth; y = screenHeight; break;
      case 2: x = 0; y = Math.random() * screenHeight; break;
      case 3: x = screenWidth; y = Math.random() * screenHeight; break;
    }
  
    const availableDefs = ENEMY_DEFINITIONS.filter(def => def.minLevel <= playerLevel);
    const def = availableDefs[Math.floor(Math.random() * availableDefs.length)];
  
    const enemyData = {
      type: def.texture,
      x: x,
      y: y,
      hp: def.hp,
      maxHp: def.hp,
      speed: def.speed,
      xpValue: def.xpValue
    };
  
    return enemyData;
  }
  /**
   * @param {number} numberOfObstacles
   * @param {number} screenWidth
   * @param {number} screenHeight
   * @returns {Array}
   */
  export function generateObstacleData(numberOfObstacles, screenWidth, screenHeight) {
    let obstacles = [];
    for (let i = 0; i < numberOfObstacles; i++) {
      const x = 50 + Math.random() * (screenWidth - 100);
      const y = 50 + Math.random() * (screenHeight - 100);
      obstacles.push({ x, y });
    }
    return obstacles;
  }

  /**
   * @param {number} dropChance
   * @returns {boolean}
   */
  export function shouldSpawnHealthPack(dropChance = 0.05) {
    return Math.random() <= dropChance;
  }
  