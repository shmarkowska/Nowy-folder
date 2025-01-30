/**
 * 
 *
 * @param {Phaser.Scene} scene
 * @param {number} numberOfObstacles
 */
export function spawnObstacles(scene, numberOfObstacles) {
    const width = scene.cameras.main.width;
    const height = scene.cameras.main.height;
  
    for (let i = 0; i < numberOfObstacles; i++) {
      const x = Phaser.Math.Between(50, width - 50);
      const y = Phaser.Math.Between(50, height - 50);
      scene.obstacles.create(x, y, 'obstacle');
    }
  }
  