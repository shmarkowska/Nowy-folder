class DamagePowerUp {
    constructor() {
        this.name = 'Damage';
        this.description = 'Increases projectile damage by 50%.';
    }

    apply(player) {

        player.projectileDamage *= 1.5;
    }
}

export default DamagePowerUp;