/**
 *
 * @param {Phaser.Scene} scene
 * @param {number} x
 * @param {number} y
 * @param {number} [dropChance=0.05]
 */
export function trySpawnHealthPack(scene, x, y, dropChance = 1) {
    if (Math.random() <= dropChance) {
      const hpPack = scene.healthPacks.create(x, y, 'healthPack');
      hpPack.setImmovable(true);
      scene.time.addEvent({
        delay: 10000,
        callback: () => hpPack.destroy()
      });
    }
  }
  