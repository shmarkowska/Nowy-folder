class AutoAimProjectilePowerUp {
  constructor() {
    this.name = 'Auto-Aim Projectile';
    this.description = 'Adds an automatic projectile that targets random enemies every 2 seconds.';
  }

  apply(scene) {

    scene.autoAimProjectileCount = (scene.autoAimProjectileCount || 0) + 1;

    if (!scene.autoAimProjectiles) {
      scene.autoAimProjectiles = scene.physics.add.group();
    }

    if (!scene._autoAimOverlapSet) {
      scene.physics.add.overlap(
        scene.autoAimProjectiles,
        scene.enemies,
        (proj, en) => scene.hitEnemyWithAutoAimProjectile(proj, en),
        undefined,
        scene
      );

      scene._autoAimOverlapSet = true;
    }

    scene.autoAimProjectiles.createCallback = (proj) => {

      proj.setCircle(5); 
    };

    if (typeof scene.hitEnemyWithAutoAimProjectile !== 'function') {
      console.log("AutoAimProjectilePowerUp: Overwriting fallback method with real logic...");
      scene.hitEnemyWithAutoAimProjectile = (projectile, enemy) => {
        console.log("Auto-aim projectile collision detected. Dealing damage...");
        enemy.hp -= scene.player.projectileDamage;
        projectile.destroy();

        if (enemy.hp <= 0) {
          const x = enemy.x;
          const y = enemy.y;
          enemy.destroy();
          scene.player.gainXp(enemy.xpValue, scene);
          scene.trySpawnHealthPack(x, y);
        }
      };
    }

    if (!scene.autoAimProjectileEvent) {
      if (typeof scene.startAutoAimProjectiles === 'function') {
        scene.startAutoAimProjectiles();
      }
      }
    }
  }

export default AutoAimProjectilePowerUp;
