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
     * This function creates and returns an array of health sprite objects.
     */
    spawnLifeBar: function(player) {
        var healthBar = [];
        for(var x = 0; x < player.health; x++){
            var heart = game.add.sprite((x*32) + 8, 16, 'heart');
            heart.hit = false;
            heart.fixedToCamera = true;
            healthBar.push(heart);
        }

        return healthBar
    },

    /**
    * This function is called when an enemy bullet is in contact with a player.
    * @param {*} turret The player, which was just in contact with the bullet.
    * @param {*} bullet The bullet, which is in contact with the player.
    * @param {*} healthBar The health bar array for the level
    */
    receiveDamage: function(player, bullet, healthBar) {
        if(player.invulnerable === false) {
            if (player.shiftState === bullet.phase) {
                bullet.kill()
                player.health--;
                if (healthBar[player.health] != null) {
                    healthBar[player.health].kill();
                }
                this.playDamageSound();
            }
        }
    },

    /**
     *  playerMovement
     *      Update the player movements based on the
     *      the controls that are pressed. Also players
     *      the correct animation / facing / shift state
     */
    handlePlayerMovement: function(player) {

        if(ControlKeys.shootKey.isDown || ControlKeys.shootKey2.isDown) {
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
        
        } else if(player.isAlive && !player.jumping) {
            // reset velocity
            player.body.velocity.x = 0;
        
        } else {
            player.body.velocity.x = 0;
        }

        //Play the proper animation, uninterruptable
        if (player.body.velocity.y != 0 && !onPlatform && player.isAlive) {
            PlayerUtils.stopWalkSound();
            player.playAnimation("jump");
        }
        else if (player.body.velocity.x != 0 && player.isAlive) {
            PlayerUtils.playWalkSound();
            player.playAnimation("walk");
        }
        else if (player.isAlive) {
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

    /**
     * This function checks to see if the player's health has been depleted.
     */
    checkPlayerDeath: function(player) {
        if(player.health === 0 && player.isAlive){                     // Kill player
            player.isAlive = false;                   
            player.animations.play('die');
            this.playDeathSound();
            player.animations.currentAnim.onComplete.add(function () { 
                game.world.width = gameW;                       // Reset game world cords
                game.world.height = gameH;                      // because the camera messes with it
                game.state.start('gameLose_state');
            });
        }   
    },
}