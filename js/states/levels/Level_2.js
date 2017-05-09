/**
 * The game state for level 2.
 * This is called by the levelSelectState when the user clicks on the level 2 icon.
 * Alternatively, this is called when the user completes level 1 and continues to play.
 */
// A global timer, this is used in order to keep track of things such as intervals for enemy phase changes.
var globalTimer = 0;

var Level_2 = function() {};
Level_2.prototype = {
    
    /**
     * This function loads all the images to render for this level.
     */
    loadImages: function() {
        game.load.tilemap('mapdata', 'assets/levels/hangman.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('collisionTiles', 'assets/levels/tilesheet2.png');
        game.load.image('hazardTiles', 'assets/levels/hazards.png');
        game.load.image('backgroundTiles', 'assets/levels/backgrounds.png');
        game.load.spritesheet('player', "assets/phaser.png", 64,64);
        game.load.spritesheet('bullet', "assets/bullets.png", 16,16);
        game.load.spritesheet('enemyBullet', "assets/enemyBullets.png", 16,16);
        game.load.spritesheet('heart', "assets/battery_32x32.png", 32, 32);
    },
    
    init: function() {
        this.w = 5120;
        this.h = 2400;
        
        GameLoseState.setCurrentLevel(2);
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

        // Set the world dimensions
        game.world.setBounds(0, 0, this.w, this.h);

        // Add the tilemap and the tilesets
        this.map = game.add.tilemap('mapdata');
        this.map.addTilesetImage('hazards', 'hazardTiles');
        this.map.addTilesetImage('tilesheet2', 'collisionTiles');
        this.map.addTilesetImage('backgrounds', 'backgroundTiles');

        // Create tile layers
        this.map.createLayer('background');
        this.hazard = this.map.createLayer('hazards');
        this.layer = this.map.createLayer('Collisions');
        
        // Set all the tiles in the map to be collidable
        this.map.setCollisionBetween(0, 400, true, this.layer);
        this.map.setCollisionBetween(0, 400, true, this.hazard);

        // Create all the groups for the level
        this.createGroups();

        // Start physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // Create an exit door
        this.exitDoor = SpriteFactory.makeExitDoor(game, (157 * 32), (44 * 32), true);

        // Create player and UI
        this.player = new Player(game, 32, this.h - (16 * 32), 'player', 0, 5);
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
            music = game.add.audio('level2');
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

    render: function() {},

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
    },

    checkWinCondition: function () {
        if (game.physics.arcade.overlap(this.player, this.exitDoor)) {
            game.world.width = gameW;                       // Reset game world cords
            game.world.height = gameH;                      // because the camera messes with it
            LevelTransitionState.setNextLevel(3);
            game.state.start('levelTransition_state');
        }
    },

    /**
     * This function adds platforms to the map.
     */
    createLevelPlatforms:function(){
        // starting area
        SpriteFactory.makePlatform(game, (17 * 32), (54 * 32), 0, 1, this.phaseObjects, this.phasePlatforms);
        SpriteFactory.makePlatform(game, (17 * 32), (58 * 32), 0, 0, this.phaseObjects, this.phasePlatforms);
        
        // large gap
        var clr = 0;
        for(var x = 17; x < 36; x+=4){
            SpriteFactory.makePlatform(game, (x * 32), (50 * 32), 300, clr, this.phaseObjects, this.phasePlatforms);
            if(clr === 0) {
                clr = 1;
            } else {
                clr = 0;
            }
        }

        SpriteFactory.makePlatform(game, (61 * 32), (52 * 32), 0, 0, this.phaseObjects, this.phasePlatforms);

        SpriteFactory.makePlatform(game, (71 * 32), (47 * 32), 0, 1, this.phaseObjects, this.phasePlatforms);

        SpriteFactory.makePlatform(game, (69 * 32), (50 * 32), 0, 0, this.phaseObjects, this.phasePlatforms);

        SpriteFactory.makePlatform(game, (81 * 32), (44 * 32), 0, 0, this.phaseObjects, this.phasePlatforms);
        SpriteFactory.makePlatform(game, (79 * 32), (44 * 32), 0, 0, this.phaseObjects, this.phasePlatforms);

        SpriteFactory.makePlatform(game, (97 * 32), (41 * 32), 0, 1, this.phaseObjects, this.phasePlatforms);
        SpriteFactory.makePlatform(game, (91 * 32), (41 * 32), 0, 1, this.phaseObjects, this.phasePlatforms);

        // rise
        for(var y = 9; y < 40; y += 3) {
            SpriteFactory.makePlatform(game, (106 * 32), (y * 32), 300, clr, this.phaseObjects, this.phasePlatforms);
                if(clr === 0) {
                    clr = 1;
                } else {
                    clr = 0;
                }
        }

        // fall        
        for(var y = 9; y < 36; y+=6){
            for(var x = 150; x < 160; x+=2){
                SpriteFactory.makePlatform(game, (x * 32), (y * 32), 500, clr, this.phaseObjects, this.phasePlatforms);
                if(clr === 0){
                    clr = 1;
                } else {
                    clr = 0;
                }
            }
        }
    },

    /**
     * This function adds all the enemies to the map.
     */
    createEnemies: function() {
        SpriteFactory.makeDrone(game, (25 * 32), (55 * 32), this.player, this.phaseObjects, this.droneGroup);
        SpriteFactory.makeDrone(game, (24 * 32), (42 * 32), this.player, this.phaseObjects, this.droneGroup);
        SpriteFactory.makeDrone(game, (40 * 32), (46 * 32), this.player, this.phaseObjects, this.droneGroup);

        SpriteFactory.makeDrone(game, (114 * 32), (33 * 32), this.player, this.phaseObjects, this.droneGroup);
        SpriteFactory.makeDrone(game, (99 * 32), (22 * 32), this.player, this.phaseObjects, this.droneGroup);
        SpriteFactory.makeDrone(game, (100 * 32), (4 * 32), this.player, this.phaseObjects, this.droneGroup);
        SpriteFactory.makeDrone(game, (157 * 32), (5 * 32), this.player, this.phaseObjects, this.droneGroup);
        SpriteFactory.makeDrone(game, (143 * 32), (29 * 32), this.player, this.phaseObjects, this.droneGroup);

        SpriteFactory.makeTurret(game, (51 * 32) + 10, (50 * 32) + 12, this.player, this.phaseObjects, this.turretGroup);

        SpriteFactory.makeTurret(game, (145 * 32) + 10, (7 * 32) + 12, this.player, this.phaseObjects, this.turretGroup);
        SpriteFactory.makeTurret(game, (130 * 32) + 10, (7 * 32) + 12, this.player, this.phaseObjects, this.turretGroup);
        SpriteFactory.makeTurret(game, (116 * 32) + 10, (7 * 32) + 12, this.player, this.phaseObjects, this.turretGroup);

    }
};



