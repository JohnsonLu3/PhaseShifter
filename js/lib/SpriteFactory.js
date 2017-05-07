/**
 * This factory object contains functions that create enemy sprites.
 */
var SpriteFactory = {

    /**
     * This function loads all the scripts and the assets needed by this factory object.
     * This must be called before starting any of the level game states!
     */
    initFactory: function() {
      this.loadSprites();
      this.loadScripts();  
    },

    /**
     * This function loads all the sprite images into Phaser's cache.
     */
    loadSprites: function() {
        game.load.spritesheet("drone", "assets/Drone.png", 32, 32);
        game.load.spritesheet('turret', "assets/turret.png", 64,64);
        game.load.spritesheet('platform', "assets/platform.png", 64, 32);
        game.load.spritesheet('exitDoor' , 'assets/closingDoor.png', 64, 64);
        game.load.image('jumpPlatform', 'assets/jumpPlatform.png');
    },

    /**
     * This function loads all the sprite JS files into Phaser's cache.
     */
    loadScripts: function() {
        game.load.script('customSprite_script', 'js/characters/customSprite.js');
        game.load.script('playerSprite_script', 'js/characters/playerSprite.js');
        game.load.script('platforms', 'js/characters/platforms.js');
        game.load.script('jumpPlatform_script', 'js/characters/JumpPlatform.js');
        game.load.script('drone', 'js/characters/drone.js');
    },
    
    /**
     * This function creates a Turret and places it in the game world.
     * @param {Phaser.Game} game - Reference to the game object
     * @param {number} x - The x coordinate at which to create the Drone
     * @param {number} y - The y coordinate at which to create the Drone
     * @param {Array} phaseObjects - The array of objects that can change phases
     * @param {Phaser.Group} droneGroup - The group of Drone objects
     */
    makeDrone: function(game, x, y, player, phaseObjects, droneGroup) {
        var newDrone = new Drone(game, x, y, player);
        phaseObjects.push(newDrone);
        droneGroup.add(newDrone);
        return newDrone;
    },

    /**
     * This function creates an exit door and places it in the game world.
     * @param {Phaser.Game} game - Reference to the game object.
     * @param {number} x - The x coordinate at which to create the door.
     * @param {number} y - The y coordinate at which to create the door.
     * @param {boolean} open - True if the door begins opened, or false if it begins closed.
     */
    makeExitDoor: function(game, x, y, open) {
        var newExitDoor;
        if(open === true) {
            newExitDoor = game.add.sprite(x, y, 'exitDoor', 0);
        } else {
            newExitDoor = game.add.sprite(x, y, 'exitDoor', 5);
        }
        game.physics.arcade.enableBody(newExitDoor);
        newExitDoor.body.setSize(28, 46, 16, 18);
        newExitDoor.animations.add('open', [4, 3, 2, 1, 0], 5, false);
        return newExitDoor;
    },
    
    /**
     * This function creates a jump platform and places it in the game world.
     * @param {Phaser.Game} game - Reference to the game object
     * @param {number} x - The x coordinate at which to create the platform
     * @param {number} y - The y coordinate at which to create the platform
     * @param {number} jumpHeight - The player's new jump height when they jump from the platform
     * @param {Player} player - Reference to the player
     * @param {Phaser.Group} jumpPlatformGroup - The group of jump platforms
     */
    makeJumpPlatform: function(game, x, y, jumpHeight, jumpPlatformGroup) {
        var newJumpPlatform = new JumpPlatform(game, x, y, jumpHeight);
        jumpPlatformGroup.add(newJumpPlatform);
        return newJumpPlatform;
    },

    /**
     * This function creates a phase-changing platform and places it in the game world.
     * @param {Phaser.Game} game - Reference to the game object
     * @param {number} x - The x coordinate at which to create the platform
     * @param {number} y - The y coordinate at which to create the platform
     * @param {Array} phaseObjects - The array of objects that can change phases
     * @param {Array} phasePlatforms - The array of phase-changing platforms
     */
    makePlatform: function(game, x, y, interval, state, phaseObjects, phasePlatforms) {
        var newPlatform = new Platform(game, x, y, interval, state);
        phasePlatforms.push(newPlatform);
        phaseObjects.push(newPlatform);
        return newPlatform;
    },

    /**
     * This function creates a Turret and places it in the game world.
     * @param {Phaser.Game} game - Reference to the game object
     * @param {number} x - The x coordinate at which to create the Turret
     * @param {number} y - The y coordinate at which to create the Turret
     * @param {Array} phaseObjects - The array of objects that can change phases
     * @param {Phaser.Group} turretGroup - The group of Turret objects
     */
    makeTurret: function(game, x,  y, player, phaseObjects, turretGroup) {
        var newTurret = new Turret(game, x, y, player);
        phaseObjects.push(newTurret);
        turretGroup.add(newTurret);
        return newTurret;
    },
    
}