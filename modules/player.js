export default class Player {
    constructor(scene, x, y) {
      this.sprite = scene.physics.add.sprite(x, y, 'playerfront');
      this.sprite.setTexture('playerfront');
      this.sprite.setCollideWorldBounds(true);
  
      this.maxHp = 100;
      this.hp = this.maxHp;
      this.xp = 0;
      this.level = 1;
      this.nextLevelXp = 100;
  
      this.projectileDamage = 10;
      this.projectileSpeed = 400;
      this.shootingInterval = 2000;
      this.speedMultiplier = 1;
      this.updateUI(scene);
    }

    /**
     * 
     * @param {number} amount
     * @param {Phaser.Scene} scene
     */
    takeDamage(amount, scene) {
        this.hp -= amount;
        if (this.hp < 0) this.hp = 0;
        this.updateUI(scene);

        if (this.hp <= 0) {
            scene.scene.pause();
            alert("Game Over!");
        }
    }

    /**
     * 
     * @param {number} amount
     * @param {Phaser.Scene} scene
     */
    gainXp(amount, scene) {
        this.xp += amount;
        if (this.xp >= this.nextLevelXp) {
            this.level++;
            this.xp -= this.nextLevelXp;
            this.nextLevelXp = Math.floor(this.nextLevelXp * 1.5);
            scene.showPowerUpSelection();
        }
        this.updateUI(scene);
    }

    /**
     * 
     * @param {Phaser.Scene} scene
     */
    updateUI(scene) {
        if (scene.hpText) {
            scene.hpText.setText(`HP: ${this.hp}/${this.maxHp}`);
        }
        if (scene.levelText) {
            scene.levelText.setText(`Level: ${this.level} | XP: ${this.xp}/${this.nextLevelXp}`);
        }
    }
}
