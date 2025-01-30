class MovementSpeedPowerUp {
    constructor() {
        this.name = 'Movement Speed';
        this.description = 'Increases player movement speed by 10%.';
    }

    apply(player) {

        player.speedMultiplier *= 1.1;
    }
}

export default MovementSpeedPowerUp;
