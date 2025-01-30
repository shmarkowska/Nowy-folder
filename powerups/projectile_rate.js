class ProjectileRatePowerUp {
    constructor() {
        this.name = 'Projectile Rate';
        this.description = 'Increases rate of fire by decreasing shooting interval by 10%.';
    }

    apply(player) {

        player.shootingInterval = Math.max(player.shootingInterval * 0.9, 200);
    }
}

export default ProjectileRatePowerUp;
