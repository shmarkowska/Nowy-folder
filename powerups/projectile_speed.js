class ProjectileSpeedPowerUp {
    constructor() {
        this.name = 'Projectile Speed';
        this.description = 'Increases projectile speed by 20%.';
    }

    apply(player) {

        player.projectileSpeed *= 1.2;
    }
}

export default ProjectileSpeedPowerUp;
