/**
 * This object contains several functions that affect the enemies.
 */
var EnemyUtils = {
    /**
     * This function initializes all the Phaser.Sound objects for the enemies.
     * This must be called before any of the enemy sounds can be played.
     */
    initSFX: function() {
        this.droneExplodeSound = game.add.audio('drone_explode');
    },

    playDroneExplodeSound: function() {
        if(soundFlag === true) {
            this.droneExplodeSound.play();
        }
    }
}