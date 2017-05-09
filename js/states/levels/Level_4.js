/**
 * The game state for level 4.
 * This is called by the levelSelectState when the user clicks on the level 4 icon.
 * Alternatively, this is called when the user completes the previous level and continues to play.
 */

// A global timer, this is used in order to keep track of things such as intervals for enemy phase changes.
var globalTimer = 0;

var Level_4 = function() {};
Level_4.prototype = {
    
    /**
     * This function sets the dimensions of the level
     */
    init: function() {
        this.w = 1600;
        this.h = 2720;
        this.gameWin = false;
        
        GameLoseState.setCurrentLevel(4);
        GameUtils.makeCheatText();
    },

    preload: function() {

        this.loadImages();

        // Initialize the SpriteFactory
        SpriteFactory.initFactory();
    },

    create: function() {

        // Set background color
        game.stage.backgroundColor = '#A7A866';

        // Set world dimensions
        game.world.setBounds(0, 0, this.w, this.h);

        // Add the tilemap and tilesets
        this.map = game.add.tilemap('mapdata');
        this.map.addTilesetImage('tilesheet2', 'world_layer_tiles');
        this.map.addTilesetImage('hazards', 'hazard_layer_tiles');
        //this.map.addTilesetImage('backgrounds', 'backgroundTiles');

        // Create tile layers
        this.layer = this.map.createLayer('world_layer');
        this.hazard = this.map.createLayer('hazards_layer');
        //this.background_layer = this.map.createLayer('background');
        
        // Set the tiles in the map to be collidable
        this.map.setCollisionBetween(0, 400, true, this.layer);
        this.map.setCollisionBetween(0, 400, true, this.hazard);

        // Create all the groups for the level
        this.createGroups();
        
        // Start physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Add an exit door
        this.exitDoor = SpriteFactory.makeExitDoor(game, (2 * 32), (19 * 32), false);
        
        // Create player and UI
        this.player = new Player(game, (1 * 32), (74 * 32), 'player', 0, 5);
        this.phaseObjects.push(this.player);
        game.camera.follow(this.player);
        this.healthBar = PlayerUtils.spawnLifeBar(this.player);

        // Create other level sprites
        this.createLevelPlatforms();
        this.createDrones();
        this.createTurrets();

        // Set up controls
        ControlKeys.setControls(this.player);

        // Stop the music!
        music.stop();
        if(musicFlag === true) {
            // Change music
            music = game.add.audio('level1');
            music.loop = true;
            // Note that the 3rd parameter is the volume, between 0 and 1.
            // The music is too loud, so we are compensating for that here.
            music.play('', 0, 0.4);
        }
    },

    update: function() {
        globalTimer++;
        game.physics.arcade.collide(this.player, this.layer);
        game.physics.arcade.collide(this.player, this.hazard, function(p, h) {PlayerUtils.takeDamage(p, this.healthBar)}, null, this);

        // Check for game win
        this.checkWinCondition();
        
        // Check for cheats
        GameUtils.checkCheats(this.player);

        // Collisions
        // Kill all bullets that hit solid ground.
        game.physics.arcade.collide(game.enemyBullets, this.layer, function(bullet,layer) { bullet.kill() }, null, this);
        game.physics.arcade.collide(this.player.playerBullets, this.layer, function(bullet,layer) { bullet.kill() }, null, this);

        // Resolve overlap interactions
        game.physics.arcade.overlap(this.turretGroup, this.player.playerBullets, recieveDamage, null, this);
        game.physics.arcade.overlap(this.droneGroup, this.player.playerBullets, recieveDamageD, null, this);
        game.physics.arcade.overlap(this.player, game.enemyBullets, function(p, b) {PlayerUtils.receiveBulletDamage(p, b, this.healthBar)}, null, this);
        game.physics.arcade.overlap(this.player, this.jumpPlatformGroup, function(p, jp) {jp.handleJumpBoost(p)});
        
        // Drone overlaps with player logic. Only take damage if states are the same.
        game.physics.arcade.overlap(this.player, this.droneGroup, function(player, drone) {
            if (drone.shiftState === player.shiftState) {
                PlayerUtils.takeDamage(player, this.healthBar);
                drone.explode();
                EnemyUtils.playDroneExplodeSound();
            }
        }, null, this);

        // Collide player with phase platforms if they are in the same phase.
        for (var i = 0; i < this.phasePlatforms.length; i++) {
            if (this.player.shiftState === this.phasePlatforms[i].shiftState) {
                if (!this.player.onPlatform) {
                    this.player.onPlatform = game.physics.arcade.collide(this.player, this.phasePlatforms[i]);
                }
            }
        }

        //Deal with player movement after checking for platform collision.
        PlayerUtils.handlePlayerMovement(this.player);

        // Check for, and handle, the player falling to the bottom of the map.
        PlayerUtils.checkFallOffWorld(this.player, this.h, this.healthBar);

        // Check for, and handle, player death
        PlayerUtils.checkPlayerDeath(this.player);

        this.player.onPlatform = false;

        if (this.player.iFrames > 0) {
            this.player.iFrames--;
            if(this.player.iFrames % 5 === 0) {
                this.player.visible = 0;
            } else if(this.player.iFrames % 2 === 0){
                this.player.visible = 1;
            }
        } else {
            this.player.visible = 1;
        }
    },

    render: function() {
        //game.debug.text("game win: " + this.gameWin, 10, 100);
        //game.debug.text(this.player.jumpHeight, 10, 100);
        //game.debug.text(game.physics.arcade.overlap(this.player, this.jumpPlatformGroup), 10, 120);
        //game.debug.text("onPlatform: " + onPlatform, 10, 140);
        //game.debug.text("player phase: " + this.player.shiftState, 10, 160);
        //game.debug.body(phasePlatforms[0]);
    },

    /**
     * This function loads all the images to render for this level.
     */
    loadImages: function() {
        // These are for the map
        game.load.tilemap('mapdata', 'assets/levels/level4.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('world_layer_tiles', 'assets/levels/tilesheet2.png');
        game.load.image('hazard_layer_tiles', 'assets/levels/hazards.png');
        //game.load.image('backgroundTiles', 'assets/levels/backgrounds.png');

        // These are for the various objects and sprites
        game.load.spritesheet('player', "assets/phaser.png", 64,64);
        game.load.spritesheet('bullet', "assets/bullets.png", 16,16);
        game.load.spritesheet('enemyBullet', "assets/enemyBullets.png", 16,16);
        game.load.spritesheet('heart', "assets/battery_32x32.png", 32, 32);
    },

    /**
     * This function creates all the Phaser.Group objects needed for the level.
     */
    createGroups: function() {
        // Create a group for all enemy bullets, this will greatly simplify the collision detections
        game.enemyBullets = game.add.group();
        game.enemyBullets.enableBody = true;
        game.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;

        //Add a max of 100 bullets that all enemies can shoot.
        game.enemyBullets.createMultiple(100, 'enemyBullet');
        game.enemyBullets.setAll('checkWorldBounds', true);
        game.enemyBullets.setAll('outOfBoundsKill', true);

        //Add group above the tile layer.
        this.turretGroup = game.add.group();
        this.droneGroup = game.add.group();
        this.jumpPlatformGroup = game.add.group();
        
        // Collection of all phase objects in the game, used for calling update each frame.
        this.phaseObjects = new Array();
        // Create an array which will contain all special phase platforms.
        this.phasePlatforms = new Array();
        // Array of enemies in the final room
        this.finalRoomArray = new Array();
    },

    checkWinCondition: function () {
        // Set a flag
        var allDead = true;

        // Check if all the enemies in the final room are dead
        for(var i = 0; i < this.finalRoomArray.length; i++) {
            if(this.finalRoomArray[i].alive === true) {
                allDead = false;
            }
        }

        // Open the exit door if all enemies in the final room are dead
        if(allDead === true && this.gameWin === false) {
            this.exitDoor.animations.play("open");
            this.gameWin = true;
        }
        
        // Check to see if the player touches the exit
        if (game.physics.arcade.overlap(this.player, this.exitDoor) && (this.gameWin === true)) {
            game.world.width = gameW;                       // Reset game world cords
            game.world.height = gameH;                      // because the camera messes with it
            game.state.start('gameWin_state');
        }
    },

    /**
     * This function adds platforms to the map.
     */
    createLevelPlatforms:function(){

        //Initial ascent
        SpriteFactory.makeJumpPlatform(game, (33 * 32), (74 * 32) + 20, -700, this.jumpPlatformGroup);
        SpriteFactory.makeJumpPlatform(game, (29 * 32), (64 * 32) + 20, -550, this.jumpPlatformGroup);
        SpriteFactory.makeJumpPlatform(game, (33 * 32), (59 * 32) + 20, -550, this.jumpPlatformGroup);
        
        // High Jump 1
        SpriteFactory.makeJumpPlatform(game, (2 * 32), (64 * 32) + 20, -1060, this.jumpPlatformGroup);
        //SpriteFactory.makeJumpPlatform(game, (4 * 32) - 10, (64 * 32) + 20, -1060, this.jumpPlatformGroup);

        // High Jump 2
        SpriteFactory.makeJumpPlatform(game, (42 * 32), (39 * 32) + 20, -980, this.jumpPlatformGroup);
        SpriteFactory.makeJumpPlatform(game, (44 * 32), (39 * 32) + 20, -980, this.jumpPlatformGroup);

        // Final Room
        SpriteFactory.makePlatform(game, (15 * 32), (27 * 32) + 10, 0, 0, this.phaseObjects, this.phasePlatforms).scale.setTo(6, 1);
        SpriteFactory.makePlatform(game, (9 * 32), (25 * 32) + 20, 0, 1, this.phaseObjects, this.phasePlatforms).scale.setTo(2, 1);
        SpriteFactory.makePlatform(game, (29 * 32), (25 * 32) + 20, 0, 1, this.phaseObjects, this.phasePlatforms).scale.setTo(2, 1);
        SpriteFactory.makePlatform(game, (17 * 32), (15 * 32) - 12, 0, 1, this.phaseObjects, this.phasePlatforms).scale.setTo(4, 1);
        SpriteFactory.makePlatform(game, (12 * 32), (20 * 32) + 20, 0, 0, this.phaseObjects, this.phasePlatforms).scale.setTo(2, 1);
        SpriteFactory.makePlatform(game, (26 * 32), (20 * 32) + 20, 0, 0, this.phaseObjects, this.phasePlatforms).scale.setTo(2, 1);
        SpriteFactory.makeJumpPlatform(game, (13 * 32) + 2, (25 * 32) + 20, -600, this.jumpPlatformGroup);
        SpriteFactory.makeJumpPlatform(game, (27 * 32) + 2, (25 * 32) + 20, -600, this.jumpPlatformGroup);
        
    },

    /**
     * This function adds drones to the map.
     */
    createDrones: function() {
        // Tight hallway
        SpriteFactory.makeDrone(game, (31 * 32), (37 * 32), this.player, this.phaseObjects, this.droneGroup);
    },

    /**
     * This function adds turrets to the map.
     */
    createTurrets: function() {
        // Initial ascent
        SpriteFactory.makeTurret(game, (39 * 32), (53 * 32) + 13, this.player, this.phaseObjects, this.turretGroup);
        SpriteFactory.makeTurret(game, (39 * 32), (58 * 32) + 13, this.player, this.phaseObjects, this.turretGroup);
        SpriteFactory.makeTurret(game, (39 * 32), (63 * 32) + 13, this.player, this.phaseObjects, this.turretGroup);

        // Drop
        SpriteFactory.makeTurret(game, (9 * 32), (54 * 32) + 13, this.player, this.phaseObjects, this.turretGroup);
        SpriteFactory.makeTurret(game, (20 * 32), (57 * 32) + 13, this.player, this.phaseObjects, this.turretGroup);

        // Final room
        this.finalRoomArray.push(SpriteFactory.makeTurret(game, (10 * 32), (15 * 32) + 13, this.player, this.phaseObjects, this.turretGroup));
        this.finalRoomArray.push(SpriteFactory.makeTurret(game, (32 * 32), (15 * 32) + 13, this.player, this.phaseObjects, this.turretGroup));
        this.finalRoomArray.push(SpriteFactory.makeTurret(game, (21 * 32), (19 * 32) + 13, this.player, this.phaseObjects, this.turretGroup));
        this.finalRoomArray.push(SpriteFactory.makeTurret(game, (8 * 32), (22 * 32) + 13, this.player, this.phaseObjects, this.turretGroup));
        this.finalRoomArray.push(SpriteFactory.makeTurret(game, (34 * 32), (22 * 32) + 13, this.player, this.phaseObjects, this.turretGroup));
    }
};



