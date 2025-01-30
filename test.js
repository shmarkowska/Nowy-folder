import { 
  generateEnemyData, 
  generateObstacleData, 
  shouldSpawnHealthPack, 
  ENEMY_DEFINITIONS 
} from './procedural.js';

/**
 * @param {number} totalSpawns
 * @param {number} playerLevel
 * @param {number} screenWidth
 * @param {number} screenHeight
 * @returns {object}
 */
function runEnemySpawnTest(totalSpawns, playerLevel, screenWidth, screenHeight) {
  const spawnCounts = {};
  ENEMY_DEFINITIONS.forEach(def => {
    if (def.minLevel <= playerLevel) {
      spawnCounts[def.texture] = 0;
    }
  });

  for (let i = 0; i < totalSpawns; i++) {
    const enemy = generateEnemyData(playerLevel, screenWidth, screenHeight);
    if (spawnCounts.hasOwnProperty(enemy.type)) {
      spawnCounts[enemy.type]++;
    }
  }

  return spawnCounts;
}

/**
 * @param {number} numberOfObstacles
 * @param {number} screenWidth
 * @param {number} screenHeight
 * @returns {object}
 */
function runObstaclePlacementTest(numberOfObstacles, screenWidth, screenHeight) {
  const obstacles = generateObstacleData(numberOfObstacles, screenWidth, screenHeight);
  let outOfBounds = 0;

  obstacles.forEach(obs => {
    if (obs.x < 50 || obs.x > screenWidth - 50 || obs.y < 50 || obs.y > screenHeight - 50) {
      outOfBounds++;
    }
  });

  return { total: obstacles.length, outOfBounds };
}

/**
 * @param {number} simulationRuns
 * @param {number} dropChance
 * @returns {number}
 */
function runHealthPackDropTest(simulationRuns, dropChance) {
  let drops = 0;

  for (let i = 0; i < simulationRuns; i++) {
    if (shouldSpawnHealthPack(dropChance)) {
      drops++;
    }
  }

  return (drops / simulationRuns) * 100;
}

/**
 * @param {number} playerLevel
 * @param {number} screenWidth
 * @param {number} screenHeight
 * @returns {number}
 */
function simulateSurvival(playerLevel, screenWidth, screenHeight) {
  let playerHP = 100;
  let xp = 0;
  let level = playerLevel;
  let nextLevelXp = 100;
  const totalEnemiesToSimulate = 100;

  for (let enemyCount = 0; enemyCount < totalEnemiesToSimulate; enemyCount++) {
    const enemy = generateEnemyData(level, screenWidth, screenHeight);
    const damage = enemy.hp / 2;
    const xpGain = enemy.xpValue;

    playerHP -= damage;
    xp += xpGain;

    if (xp >= nextLevelXp) {
      level++;
      xp -= nextLevelXp;
      nextLevelXp = Math.floor(nextLevelXp * 1.5);
    }

    if (playerHP <= 0) {
      return level;
    }
  }
  return level;
}

/**
 * @param {number} simulationRuns
 * @param {number} initialPlayerLevel
 * @param {number} screenWidth
 * @param {number} screenHeight
 * @returns {number}
 */
function runSurvivalTest(simulationRuns, initialPlayerLevel, screenWidth, screenHeight) {
  let totalLevelAtDeath = 0;

  for (let i = 0; i < simulationRuns; i++) {
    const levelAtDeath = simulateSurvival(initialPlayerLevel, screenWidth, screenHeight);
    totalLevelAtDeath += levelAtDeath;
  }

  return totalLevelAtDeath / simulationRuns;
}

function runTests() {
const playerLevel = 1;
const screenWidth = 800;
const screenHeight = 600;
const totalEnemySpawns = 5000;
const numberOfObstacles = 20;
const simulationRunsForDrops = 5000;
const simulationRunsForSurvival = 500;
const dropChance = 0.05;


  console.log("Starting procedural generation tests...");

  //enemy spawn testing
  const enemyCounts = runEnemySpawnTest(totalEnemySpawns, playerLevel, screenWidth, screenHeight);
  console.log(`\nEnemy spawn frequencies over ${totalEnemySpawns} spawns:`);
  console.table(enemyCounts);

  //obstacle testing
  const obstacleTest = runObstaclePlacementTest(numberOfObstacles, screenWidth, screenHeight);
  console.log(`\nObstacle Placement Test:`);
  console.log(`Total Obstacles Placed: ${obstacleTest.total}`);
  console.log(`Obstacles Out of Bounds: ${obstacleTest.outOfBounds}`);

  //health pack testing
  const healthPackRate = runHealthPackDropTest(simulationRunsForDrops, dropChance);
  console.log(`\nHealth Pack Drop Rate over ${simulationRunsForDrops} simulated enemy deaths:`);
  console.log(`Average Drop Rate: ${healthPackRate.toFixed(2)}%`);

  //survival testing
  const avgLevelAtDeath = runSurvivalTest(simulationRunsForSurvival, 1, screenWidth, screenHeight);
  console.log(`\nAverage level at death over ${simulationRunsForSurvival} survival simulations: ${avgLevelAtDeath.toFixed(2)}`);
  console.log("\nProcedural generation tests completed.");
}

runTests();
