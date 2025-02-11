import Player from './modules/player.js';
import { spawnEnemy } from './modules/enemies.js';
import { spawnObstacles } from './modules/obstacles.js';
import { trySpawnHealthPack } from './modules/healthpacks.js';
import MovementSpeedPowerUp from './powerups/movement_speed.js';
import ProjectileRatePowerUp from './powerups/projectile_rate.js';
import DamagePowerUp from './powerups/damage.js';
import ProjectileSpeedPowerUp from './powerups/projectile_speed.js';
import OrbitingProjectilePowerUp from './powerups/orbiting_projectile.js';
import AutoAimProjectilePowerUp from './powerups/auto_aim_projectile.js';

class MainScene extends Phaser.Scene {
  constructor() {
    super({ key: 'MainScene' });

    this.lastShotTime = 0;
    this.spawnInterval = 2000;
    this.minSpawnInterval = 500;
    this.orbitingProjectiles = [];
    this.autoAimProjectileCount = 0;
    this.autoAimProjectileEvent = null;
  }

  preload() {
    this.load.image('bg', 'assets/bg.png');
    this.load.image('playerfront', 'assets/playerfront.png');
    this.load.image('playerback', 'assets/playerback.png');
    this.load.image('projectile', 'assets/mainprojectile.png');  
    this.load.image('autoAimProjectile', 'assets/autoprojectile.png'); 
    this.load.image('orbitingProjectile', 'assets/orbprojectile.png');  
    this.load.image('healthPack', 'assets/healthpacksmall.png');  
    this.load.image('obstacle', 'assets/barrel.png'); 
  
    this.load.image('enemy1', 'assets/enemy1.png');
    this.load.image('enemy2', 'assets/enemy2.png');
    this.load.image('enemy3', 'assets/enemy3.png');
    this.load.image('enemy4', 'assets/enemy4.png');
    this.load.image('enemy5', 'assets/enemy5.png');
  }

  create() {
    const bg = this.add.image(0, 0, 'bg').setOrigin(0, 0);
    bg.setDisplaySize(this.cameras.main.width, this.cameras.main.height);

    this.player = new Player(
      this,
      this.cameras.main.width / 2,
      this.cameras.main.height / 2
    );
  
    this.player.sprite.setTexture('playerfront');
    
    this.enemies = this.physics.add.group();
    this.projectiles = this.physics.add.group();
    this.orbitingProjectilesGroup = this.physics.add.group();
    this.healthPacks = this.physics.add.group();
    this.obstacles = this.physics.add.staticGroup();

    this.autoAimProjectiles = this.physics.add.group();

    this.cursors = this.input.keyboard.createCursorKeys();
    this.wKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.W);
    this.aKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.A);
    this.sKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.S);
    this.dKey = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.D);

    //UI
    this.hpText = this.add.text(
      16,
      this.cameras.main.height - 60,
      `HP: ${this.player.hp}/${this.player.maxHp}`,
      { fontSize: '30px', fill: '#0a0303', backgroundColor: 'rgba(255, 255, 255, 0.7)' }
    );
    this.levelText = this.add.text(
      16,
      this.cameras.main.height - 31,
      `Level: ${this.player.level} | XP: ${this.player.xp}/${this.player.nextLevelXp}`,
      { fontSize: '20px', fill: '#0a0303', backgroundColor: 'rgba(255, 255, 255, 0.7)' }
    );

    //spawn event
    this.spawnEnemyEvent = this.time.addEvent({
      delay: this.spawnInterval,
      callback: () => spawnEnemy(this, this.player),
      loop: true
    });

    //increase spawn rate
    this.increaseSpawnRateEvent = this.time.addEvent({
      delay: 10000,
      callback: this.increaseSpawnRate,
      callbackScope: this,
      loop: true
    });

    //collision event
    this.physics.add.overlap(this.projectiles, this.enemies, (proj, en) => this.hitEnemy(proj, en));
    this.physics.add.collider(this.player.sprite, this.enemies, (pl, en) => this.enemyHitsPlayer(pl, en));
    this.physics.add.overlap(this.orbitingProjectilesGroup, this.enemies, (orb, en) => this.hitEnemyWithOrbitingProjectile(orb, en));
    this.physics.add.overlap(this.player.sprite, this.healthPacks, (pl, hp) => this.collectHealthPack(pl, hp));

    this.physics.add.collider(this.player.sprite, this.obstacles);
    this.physics.add.collider(this.enemies, this.obstacles);

    this.physics.add.overlap(
      this.autoAimProjectiles,
      this.enemies,
      (projectile, enemy) => {

        enemy.hp -= this.player.projectileDamage;
        projectile.destroy();
    
        if (enemy.hp <= 0) {
          const x = enemy.x;
          const y = enemy.y;
          enemy.destroy();
          this.gainXp(enemy.xpValue);
          trySpawnHealthPack(this, x, y, 0.1);
        }
      }
    );

    //powerup ui
    this.createPowerUpSelectionUI();

    //obstacle
    spawnObstacles(this, 10);
  }

  createPowerUpSelectionUI() {
    this.powerUpSelectionContainer = document.getElementById('powerUpSelection');
    if (!this.powerUpSelectionContainer) {
      console.warn("No #powerUpSelection in HTML.");
      return;
    }
    Object.assign(this.powerUpSelectionContainer.style, {
      position: 'absolute',
      top: '50%',
      left: '50%',
      transform: 'translate(-50%, -50%)',
      backgroundColor: 'rgba(0, 0, 0, 0.8)',
      color: 'white',
      padding: '20px',
      display: 'none',
      zIndex: 1000
    });
  }

  update(time) {
    //WSAD keys for movement
    this.player.sprite.setVelocity(0);
  
    if (this.cursors.left.isDown || this.aKey.isDown) {
      this.player.sprite.setVelocityX(-160 * this.player.speedMultiplier);
    } else if (this.cursors.right.isDown || this.dKey.isDown) {
      this.player.sprite.setVelocityX(160 * this.player.speedMultiplier);
    }
  
    //texture change depending on movinng upwards or downwards
    if (this.cursors.up.isDown || this.wKey.isDown) {
      this.player.sprite.setVelocityY(-160 * this.player.speedMultiplier);
      this.player.sprite.setTexture('playerback');
    } else if (this.cursors.down.isDown || this.sKey.isDown) {
      this.player.sprite.setVelocityY(160 * this.player.speedMultiplier);
      this.player.sprite.setTexture('playerfront');
    }
  
    if (time > this.lastShotTime + this.player.shootingInterval) {
      this.shootProjectile();
      this.lastShotTime = time;
    }
  
      this.enemies.children.iterate((enemy) => {
        if (!enemy) return;
      
        const angle = Phaser.Math.Angle.Between(
          enemy.x, enemy.y,
          this.player.sprite.x, this.player.sprite.y
        );
        enemy.setVelocity(
          Math.cos(angle) * (enemy.speed || 100),
          Math.sin(angle) * (enemy.speed || 100)
        );
      });
      
    this.updateOrbitingProjectiles();
  }
  increaseSpawnRate() {
    if (this.spawnInterval > this.minSpawnInterval) {
      this.spawnInterval -= 200;
      this.spawnEnemyEvent.reset({
        delay: this.spawnInterval,
        callback: () => spawnEnemy(this, this.player),
        loop: true
      });
    }
  }

  shootProjectile() {
    const mouseX = this.input.activePointer.worldX;
    const mouseY = this.input.activePointer.worldY;
    const angle = Phaser.Math.Angle.Between(this.player.sprite.x, this.player.sprite.y, mouseX, mouseY);

    const projectile = this.physics.add.sprite(this.player.sprite.x, this.player.sprite.y, 'projectile');
    this.projectiles.add(projectile);
    projectile.setVelocity(
      Math.cos(angle) * this.player.projectileSpeed,
      Math.sin(angle) * this.player.projectileSpeed
    );

    this.time.addEvent({
      delay: 3000,
      callback: () => projectile.destroy()
    });
  }

  //projectile hits
  hitEnemy(projectile, enemy) {
    enemy.hp -= this.player.projectileDamage;
    projectile.destroy();
    if (enemy.hp <= 0) {
      const x = enemy.x;
      const y = enemy.y;
      enemy.destroy();
      this.gainXp(enemy.xpValue);
      trySpawnHealthPack(this, x, y, 0.1);
    }
  }

  //orbiting projectile
  hitEnemyWithOrbitingProjectile(orbitProj, enemy) {
    enemy.hp -= this.player.projectileDamage;
    if (enemy.hp <= 0) {
      const x = enemy.x;
      const y = enemy.y;
      enemy.destroy();
      this.gainXp(enemy.xpValue);
      trySpawnHealthPack(this, x, y, 0.1);
    }
  }

  gainXp(amount) {
    this.player.xp += amount;
    if (this.player.xp >= this.player.nextLevelXp) {
      this.player.level++;
      this.player.xp -= this.player.nextLevelXp;
      this.player.nextLevelXp = Math.floor(this.player.nextLevelXp * 1.5);
      this.showPowerUpSelection();
    }
    if (this.hpText) {
      this.hpText.setText(`HP: ${this.player.hp}/${this.player.maxHp}`);
    }
    if (this.levelText) {
      this.levelText.setText(`Level: ${this.player.level} | XP: ${this.player.xp}/${this.player.nextLevelXp}`);
    }
  }

  enemyHitsPlayer(playerSprite, enemySprite) {
    this.player.hp -= 10;
    if (this.player.hp < 0) this.player.hp = 0;
    enemySprite.destroy();

    if (this.hpText) {
      this.hpText.setText(`HP: ${this.player.hp}/${this.player.maxHp}`);
    }
    if (this.player.hp <= 0) {
      this.scene.pause();
      alert("Game Over!");
    }
  }

  collectHealthPack(playerSprite, pack) {
    if (this.player.hp < this.player.maxHp) {
      this.player.hp += 10;
      if (this.player.hp > this.player.maxHp) {
        this.player.hp = this.player.maxHp;
      }
      if (this.hpText) {
        this.hpText.setText(`HP: ${this.player.hp}/${this.player.maxHp}`);
      }
    }
    pack.destroy();
  }

  trySpawnHealthPack(x, y) {
    trySpawnHealthPack(this, x, y, 0.1);
  }

  //powerup sys
  showPowerUpSelection() {
    const allPowerUps = [
      MovementSpeedPowerUp,
      ProjectileRatePowerUp,
      DamagePowerUp,
      ProjectileSpeedPowerUp,
      OrbitingProjectilePowerUp,
      AutoAimProjectilePowerUp
    ];
    this.powerUpOptions = Phaser.Utils.Array.Shuffle(allPowerUps).slice(0, 2);

    if (!this.powerUpSelectionContainer) {
      console.warn("No #powerUpSelection container found in HTML.");
      return;
    }

    this.powerUpSelectionContainer.innerHTML = '<h3>Choose a Power-Up:</h3>';
    this.powerUpOptions.forEach((PowerUpClass, index) => {
      const powerUpInstance = new PowerUpClass();
      const button = document.createElement('button');
      button.innerText = `${powerUpInstance.name}: ${powerUpInstance.description}`;
      button.style.margin = '5px';
      button.onclick = () => this.selectPowerUp(index);
      this.powerUpSelectionContainer.appendChild(button);
    });

    this.powerUpSelectionContainer.style.display = 'block';
    this.scene.pause();
  }

  selectPowerUp(index) {
    const selectedPowerUp = new this.powerUpOptions[index]();
    selectedPowerUp.apply(this); // Overwrites fallback logic, sets up auto-aim

    if (this.powerUpSelectionContainer) {
      this.powerUpSelectionContainer.innerHTML = '';
      this.powerUpSelectionContainer.style.display = 'none';
    }
    this.scene.resume();
  }

  addOrbitingProjectile() {
    const orb = this.physics.add.sprite(this.player.sprite.x, this.player.sprite.y, 'orbitingProjectile');
    orb.setCircle(7);
    this.orbitingProjectilesGroup.add(orb);
    this.orbitingProjectiles.push({
      sprite: orb,
      angle: 0,
      radius: 50,
      speed: 0.02
    });
  }

  updateOrbitingProjectiles() {
    this.orbitingProjectiles.forEach((proj) => {
      proj.angle += proj.speed;
      const offsetX = Math.cos(proj.angle) * proj.radius;
      const offsetY = Math.sin(proj.angle) * proj.radius;
      proj.sprite.x = this.player.sprite.x + offsetX;
      proj.sprite.y = this.player.sprite.y + offsetY;
    });
  }

  startAutoAimProjectiles() {
    if (this.autoAimProjectileEvent) return;

    // Fire auto-aim projectiles every 2 seconds
    this.autoAimProjectileEvent = this.time.addEvent({
      delay: 2000,
      callback: this.fireAutoAimProjectiles,
      callbackScope: this,
      loop: true
    });
  }

  fireAutoAimProjectiles() {
    for (let i = 0; i < this.autoAimProjectileCount; i++) {
      if (this.enemies.getChildren().length > 0) {
        const enemy = Phaser.Utils.Array.GetRandom(this.enemies.getChildren());
        const angle = Phaser.Math.Angle.Between(this.player.sprite.x, this.player.sprite.y, enemy.x, enemy.y);

        const projectile = this.autoAimProjectiles.create(
          this.player.sprite.x,
          this.player.sprite.y,
          'autoAimProjectile'
        );

        projectile.setVelocity(
          Math.cos(angle) * this.player.projectileSpeed,
          Math.sin(angle) * this.player.projectileSpeed
        );

        this.time.addEvent({
          delay: 3000,
          callback: () => projectile.destroy()
        });
      }
    }
  }
}

const config = {
  type: Phaser.AUTO,
  width: window.innerWidth,
  height: window.innerHeight,
  backgroundColor: '#2d2d2d',
  physics: {
    default: 'arcade',
    arcade: {
      debug: false
    }
  },
  scene: MainScene
};

const game = new Phaser.Game(config);
window.addEventListener('resize', () => game.scale.resize(window.innerWidth, window.innerHeight));
