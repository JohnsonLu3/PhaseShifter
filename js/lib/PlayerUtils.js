/**
 * This object contains several functions that affect the player.
 */
var PlayerUtils = {


    /**
     * This function initializes the Phaser.Sound objects for the player sounds.
     * This must be called before calling any of the other sound effect functions!
     */
    initSFX: function() {
        this.shiftSound = game.add.audio('shift');
        this.damageSound = game.add.audio('phaser_damage');
        this.walkSound = game.add.audio('phaser_walking');
        this.deathSound = game.add.audio('phaser_death');
    },

    
    /**
     * This function changes the player's phase and plays the phase shift sound.
     */
    phaseShift: function(player) {
        player.changePhase();
        if(soundFlag === true) {
            // Note that the 3rd parameter is the volume, between 0 and 1.
            // The phase shift sound is too loud, so we're compensating for that here.
            this.shiftSound.play('', 0, 0.5);
        }
    },

    playDamageSound: function() {
        if(soundFlag === true) {
            this.damageSound.play();
        }
    },
    
    playWalkSound: function() {
        if(soundFlag === true) {
            // Note that the 3rd parameter is the volume, between 0 and 1.
            // The walk sound is too loud, so we're compensating for that here.
            this.walkSound.play('', 0, 0.5, false, false);
        }
    },

    stopWalkSound: function() {
        this.walkSound.stop();
    },

    playDeathSound: function() {
        if(soundFlag === true) {
            this.deathSound.play();
        }  
    }
}