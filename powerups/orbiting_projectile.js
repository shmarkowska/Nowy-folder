class OrbitingProjectilePowerUp {
    constructor() {
        this.name = 'Orbiting Projectile';
        this.description = 'Adds an orbiting projectile around the player that damages enemies.';
    }

    apply(scene) {

        scene.addOrbitingProjectile();
    }
}

export default OrbitingProjectilePowerUp;