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
    },

    /**
     *  playerMovement
     *      Update the player movements based on the
     *      the controls that are pressed. Also players
     *      the correct animation / facing / shift state
     */
    handlePlayerMovement: function(player) {

        if(ControlKeys.shootKey.isDown || ControlKeys.shootKey2.isDown){
            player.fire();
        }

        if((ControlKeys.jumpKey.isDown || ControlKeys.jumpKey2.isDown) && player.isAlive && (player.body.blocked.down || onPlatform ) ) {
            // player jump
            
            player.jumping = true;

            player.body.velocity.y = player.jumpHeight;
        }

        if((ControlKeys.leftKey.isDown || ControlKeys.leftKey2.isDown ) && player.isAlive) {
            // player move left

            this.updateFacing(false, player);

            player.body.velocity.x = -player.walkingSpeed;

        } else if((ControlKeys.rightKey.isDown || ControlKeys.rightKey2.isDown )  && player.isAlive) {
            // player move right

            this.updateFacing(true, player);

            player.body.velocity.x = player.walkingSpeed;
        
        } else if(player.isAlive && !player.jumping){
            // reset velocity
            player.body.velocity.x = 0;
        
        }else{
            player.body.velocity.x = 0;
        }

        //Play the proper animation, uninterruptable
        if (player.body.velocity.y != 0 && !onPlatform && player.isAlive){
            PlayerUtils.stopWalkSound();
            player.playAnimation("jump");
        }
        else if (player.body.velocity.x != 0 && player.isAlive)
        {
            PlayerUtils.playWalkSound();
            player.playAnimation("walk");
        }
        else if (player.isAlive)
        {
            PlayerUtils.stopWalkSound();
            player.playAnimation("idle");
        }
    },

    /**
     *  updateFacing
     *      update the player's sprite's facing position
     */
    updateFacing: function(facingFlag, player){

        if(player.facing === facingFlag){
            // player is already facing the same direction
        } else {
            player.scale.x *= -1;
            player.facing  =  facingFlag;   
        }
    },
}