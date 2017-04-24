/**
 * This object contains several functions that affect the player.
 */
var PlayerUtils = {
    /**
     * This function initializes the Phaser.Sound objects for the player sounds.
     * This must be called before calling any of the other sound effect functions!
     */
    initSFX: function() {
        this.damageSound = game.add.audio('phaser_damage');
    },

    playDamageSound: function() {
        this.damageSound.play();
    }
    
}