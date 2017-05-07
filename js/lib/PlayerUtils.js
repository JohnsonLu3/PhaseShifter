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
        this.attackSound = game.add.audio('phaser_attack');
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

    playAttackSound: function() {
        if(soundFlag === true) {
            this.attackSound.play('', 0, 0.7);
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
    * @param {Player} player - The player, which was just in contact with the bullet.
    * @param {Phaser.Sprite} bullet - The bullet, which is in contact with the player.
    * @param {Phaser.Sprite[]} healthBar - The health bar array for the level
    */
    receiveBulletDamage: function(player, bullet, healthBar) {
        if(player.invulnerable === false) {
            if (player.shiftState === bullet.phase) {
                bullet.kill()
                this.takeDamage(player, healthBar);
            }
        }
    },

    /**
     * This function is called whenever the player is damaged.
     */
    takeDamage: function(player, healthBar) {
        if(player.iFrames === 0) {
            player.health--;
            if (healthBar[player.health] != null) {
                healthBar[player.health].kill();
            }
            player.iFrames = 30;
            this.playDamageSound();
        }
    },

    /**
     * This function is called when the player heals any damage by touching a health pack.
     * @param {Player} player - The player, who has just touched a health pack.
     * @param {Phaser.Sprite} healthPack - The health pack that the player touched.
     * @param {Phaser.Sprite[]} healthBar - The health bar array for the level.
     */
    healDamage: function(player, healthPack, healthBar) {

    },

    /**
     *  playerMovement
     *      Update the player movements based on the
     *      the controls that are pressed. Also players
     *      the correct animation / facing / shift state
     */
    handlePlayerMovement: function(player, jumpPlatformGroup) {

        // Stop player movement
        player.body.velocity.x = 0;
        if(player.flying === true) {
            player.body.velocity.y = 0;
        }

        // Make sure to reset the player's jump height to the original
        if(player.jumpBoost === false) {
            player.jumpHeight = player.JUMP_HEIGHT;
        }

        // Check for flying flag
        if(player.flying === false) {

            // The player is touching the ground or a platform
            if((ControlKeys.jumpKey.isDown || ControlKeys.jumpKey2.isDown) && player.isAlive && (player.body.blocked.down || player.onPlatform )) {
                player.body.gravity.y = 800;
                player.jumping = true;
                jumpTimer -= 75;
                if(jumpTimer >  (player.jumpHeight)){
                     player.body.velocity.y  =  jumpTimer;
                }
            }
            // The player is jumping and holding down the jump key 
            else if((ControlKeys.jumpKey.isDown || ControlKeys.jumpKey2.isDown) && player.isAlive && player.jumping) {
                jumpTimer -= 75;
                if(jumpTimer >  (player.jumpHeight)) {
                     player.body.velocity.y  =  jumpTimer;
                }
            } 
            // The player is not jumping
            else {
                player.jumping = false;
                player.jumpBoost = false;
                jumpTimer = 0;
                player.body.gravity.y = 1000;
            }

        } else {
            // Fly up
            if((ControlKeys.upKey.isDown || ControlKeys.upKey2.isDown) && player.isAlive) {
                player.body.velocity.y = -player.walkingSpeed;
            }
        
            // Fly down
            else if((ControlKeys.downKey.isDown || ControlKeys.downKey2.isDown) && player.isAlive) {
                player.body.velocity.y = player.walkingSpeed;
            }
       }

        // Move left
        if((ControlKeys.leftKey.isDown || ControlKeys.leftKey2.isDown ) && player.isAlive) {
            this.updateFacing(false, player);
            player.body.velocity.x = -player.walkingSpeed;
        } 
        
        // Move right
        else if((ControlKeys.rightKey.isDown || ControlKeys.rightKey2.isDown )  && player.isAlive) {
            this.updateFacing(true, player);
            player.body.velocity.x = player.walkingSpeed;
        }

        // Play the proper animation and sounds (uninterruptable)
        if (player.body.velocity.y != 0 && !player.onPlatform && player.isAlive) {
            this.stopWalkSound();
            player.playAnimation("jump");
        }
        else if (player.body.velocity.x != 0 && player.isAlive) {
            this.playWalkSound();
            player.playAnimation("walk");
        }
        else if (player.isAlive) {
            this.stopWalkSound();
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
     * This function checks to see if the player touches the bottom of the game world.
     */
    checkFallOffWorld: function(player, h, healthBar) {
        if(player.y > h - 70){                  // Player loses all their health if they touch the bottom of the screen
            player.health = 0;

            for(heart in healthBar){             // kill all heart sprites in healthbar
                healthBar[heart].kill();
            }
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