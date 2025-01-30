//parameters
export const ENEMY_DEFINITIONS = [
  { texture: 'enemy1', hp: 10, speed: 80, xpValue: 20, minLevel: 1 },
  { texture: 'enemy2', hp: 20, speed: 90, xpValue: 50, minLevel: 200 },
  { texture: 'enemy3', hp: 40, speed: 100, xpValue: 100, minLevel: 200 },
  { texture: 'enemy4', hp: 60, speed: 110, xpValue: 180, minLevel: 200 },
  { texture: 'enemy5', hp: 120, speed: 120, xpValue: 300, minLevel: 200 }
];

export function spawnEnemy(scene, player) {
  const width = scene.cameras.main.width;
  const height = scene.cameras.main.height;

  let x, y;
  const edge = Phaser.Math.Between(0, 3);
  switch (edge) {
    case 0: x = Phaser.Math.Between(0, width);  y = 0;                break;
    case 1: x = Phaser.Math.Between(0, width);  y = height;           break;
    case 2: x = 0;                           y = Phaser.Math.Between(0, height); break;
    case 3: x = width;                       y = Phaser.Math.Between(0, height); break;
  }

  const availableDefs = ENEMY_DEFINITIONS.filter(def => def.minLevel <= player.level);
  const def = Phaser.Utils.Array.GetRandom(availableDefs);

  const enemy = scene.enemies.create(x, y, def.texture);
  enemy.hp = def.hp;
  enemy.maxHp = def.hp;
  enemy.speed = def.speed;
  enemy.xpValue = def.xpValue;

  return enemy;
}