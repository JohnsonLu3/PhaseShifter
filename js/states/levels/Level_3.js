/**
 * The game state for level 3.
 * This is called by the levelSelectState when the user clicks on the third level icon.
 * Alternatively, this is called when the user completes the previous level and continues to play.
 */

// A global timer, this is used in order to keep track of things such as intervals for enemy phase changes.
var globalTimer = 0;

var Level_3 = function() {};
Level_3.prototype = {

    /**
     * This function loads all the images to render for this level.
     */
    loadImages: function() {
        // These are for the map
        game.load.tilemap('mapdata', 'assets/levels/level2.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('collisionTiles', 'assets/levels/tilesheet2.png');
        game.load.image('hazardTiles', 'assets/levels/hazards.png');
        //game.load.image('backgroundTiles', 'assets/levels/backgrounds.png');

        // These are for the various objects and sprites
        game.load.spritesheet('player', "assets/phaser.png", 64,64);
        game.load.spritesheet('bullet', "assets/bullets.png", 16,16);
        game.load.spritesheet('enemyBullet', "assets/enemyBullets.png", 16,16);
        game.load.spritesheet('heart', "assets/battery_32x32.png", 32, 32);
    },

    init: function() {
        this.w = 5120;
        this.h = 2400;
        
        GameLoseState.setCurrentLevel(3);
        GameUtils.makeCheatText();
    },

    preload: function() {
        this.loadImages();
        
        // Initialize the SpriteFactory
        SpriteFactory.initFactory();
    },

    create: function() {

        // Set background color
        game.stage.backgroundColor = '#BFC8CC';

        // Set world dimensions
        game.world.setBounds(0, 0, this.w, this.h);      

        // Add the tilemap and the tilesets
        this.map = game.add.tilemap('mapdata');
        this.map.addTilesetImage('tilesheet2', 'collisionTiles');
        this.map.addTilesetImage('hazards', 'hazardTiles');

        // Create tile layers
        this.hazard = this.map.createLayer("hazards");
        this.layer = this.map.createLayer("Collisions");

        // Set the tiles in the map to be collidable
        this.map.setCollisionBetween(0, 250, true, "Collisions");
        this.map.setCollisionBetween(0, 250, true, "hazards");

        // Create all the groups for the level
        this.createGroups();

        // Start physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // make an exitDoor
        this.exitDoor = SpriteFactory.makeExitDoor(game, 3850, 415, true);

        // Create player
        this.player = new Player(game, 32, this.h-1400, 'player', 0, 5);
        this.phaseObjects.push(this.player);
        game.camera.follow(this.player);
        this.healthBar = PlayerUtils.spawnLifeBar(this.player);


        // Create other level sprites
        this.createLevelPlatforms();
        this.createEnemies();

        // Set up controls
        ControlKeys.setControls(this.player);

        // Stop the music!
        music.stop();
        if(musicFlag === true) {
            // Change music
            music = game.add.audio('level3');
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

        //Collisions.
        //Kill all bullets that hit solid ground.
        game.physics.arcade.collide(game.enemyBullets, this.layer, function(bullet,layer) { bullet.kill() }, null, this);
        game.physics.arcade.collide(this.player.playerBullets, this.layer, function(bullet,layer) { bullet.kill() }, null, this);

        //Resolve interactions between playerBullets and enemies and between enemyBullets and players.
        game.physics.arcade.overlap(this.turretGroup, this.player.playerBullets, recieveDamage, null, this);
        game.physics.arcade.overlap(this.droneGroup, this.player.playerBullets, recieveDamageD, null, this);
        game.physics.arcade.overlap(this.player, game.enemyBullets, function(p, b) { PlayerUtils.receiveBulletDamage(p, b, this.healthBar)}, null, this);

        //Drone overlaps with player logic. Only take damage if states are the same.
        game.physics.arcade.overlap(this.player, this.droneGroup, function(player, drone) {
            if (drone.shiftState === player.shiftState) {
                PlayerUtils.takeDamage(player, this.healthBar);
                drone.explode();
                EnemyUtils.playDroneExplodeSound();
            }
        }, null, this);

        //Collide player with phase platforms if they are in the same phase.
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
            } else {
                if(this.player.iFrames % 2 === 0) {
                    this.player.visible = 1;
                }
            }
        } else {
            this.player.visible = 1;
        }
    },

    render: function() {
        //game.debug.bodyInfo(this.player, 32, 32);
        //game.debug.body(phasePlatforms[0]);
        //game.debug.body(this.player);
    },

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
    },

    checkWinCondition: function () {
        if(game.physics.arcade.overlap(this.player, this.exitDoor)) {
            game.world.width = gameW;                       // Reset game world cords
            game.world.height = gameH;                      // because the camera messes with it
            LevelTransitionState.setNextLevel(4);
            game.state.start('levelTransition_state');
        }
    },
    
    createLevelPlatforms:function(){
        // Jumps to first platform.
        SpriteFactory.makePlatform(game, (24 * 32), (30 * 32), 500, 1, this.phaseObjects, this.phasePlatforms);
        SpriteFactory.makePlatform(game, (27 * 32), (27 * 32), 500, 1, this.phaseObjects, this.phasePlatforms);
        //Jumps to second platform.
        SpriteFactory.makePlatform(game, (37 * 32), (22 * 32), 350, 1, this.phaseObjects, this.phasePlatforms);
        SpriteFactory.makePlatform(game, (39 * 32), (20 * 32), 350, 1, this.phaseObjects, this.phasePlatforms);
        //Jumps to third platform.
        SpriteFactory.makePlatform(game, (48 * 32), (16 * 32), 275, 0, this.phaseObjects, this.phasePlatforms);
        SpriteFactory.makePlatform(game, (50 * 32), (14 * 32), 275, 1, this.phaseObjects, this.phasePlatforms);
        SpriteFactory.makePlatform(game, (52 * 32), (12 * 32), 275, 0, this.phaseObjects, this.phasePlatforms);
        //Final Jumps to last platform
        SpriteFactory.makePlatform(game, (64 * 32), (9 * 32), 117, 0, this.phaseObjects, this.phasePlatforms);
        SpriteFactory.makePlatform(game, (70 * 32), (7 * 32), 350, 0, this.phaseObjects, this.phasePlatforms);
        SpriteFactory.makePlatform(game, (76 * 32), (5 * 32), 175, 0, this.phaseObjects, this.phasePlatforms);
    },

    createEnemies: function() {
        SpriteFactory.makeTurret(game, 800, 1455, this.player, this.phaseObjects, this.turretGroup);
        SpriteFactory.makeTurret(game, 1000, 1455, this.player, this.phaseObjects, this.turretGroup);
        SpriteFactory.makeTurret(game, 1200,1455, this.player, this.phaseObjects, this.turretGroup);
        SpriteFactory.makeTurret(game, 1400, 1455, this.player, this.phaseObjects, this.turretGroup);
        SpriteFactory.makeTurret(game, 1600,1455, this.player, this.phaseObjects, this.turretGroup);
        SpriteFactory.makeTurret(game, 1800, 1455, this.player, this.phaseObjects, this.turretGroup);
        SpriteFactory.makeTurret(game, 2000,1455, this.player, this.phaseObjects, this.turretGroup);
        SpriteFactory.makeTurret(game, 2200,1455, this.player, this.phaseObjects, this.turretGroup);
        SpriteFactory.makeTurret(game, 2400,1455, this.player, this.phaseObjects, this.turretGroup);

        SpriteFactory.makeDrone(game, 600,900,this.player, this.phaseObjects, this.droneGroup);
        SpriteFactory.makeDrone(game, 800, 1400, this.player, this.phaseObjects, this.droneGroup);
        SpriteFactory.makeDrone(game, 1500, 1400, this.player, this.phaseObjects, this.droneGroup);
        SpriteFactory.makeDrone(game, 2200, 1400, this.player, this.phaseObjects, this.droneGroup);
    }

};



