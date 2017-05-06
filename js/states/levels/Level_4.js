/**
 * The game state for level 4.
 * This is called by the levelSelectState when the user clicks on the level 4 icon.
 */

var platform;

// A global timer, this is used in order to keep track of things such as intervals for enemy phase changes.
var globalTimer = 0;
var onPlatform = false;

var Level_4 = function() {};
Level_4.prototype = {
    
    /**
     * This function sets the dimensions of the level
     */
    init: function() {
        this.w = 1600;
        this.h = 2720;
    },

    preload: function() {

        this.loadImages();

        // Initialize the SpriteFactory
        SpriteFactory.initFactory();
    },

    create: function() {

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
        
        // Add an exitDoor
        this.exitDoor = game.add.sprite((2 * 32), (19 * 32), 'exitDoor');
        
        

        // Create player and UI
        this.player = new Player(game, (1 * 32), (74 * 32), 'player', 0, 5);
        phaseObjects.push(this.player);
        game.camera.follow(this.player);
        this.uiFrame = GameUtils.makeUIFrame();
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
        game.physics.arcade.collide(this.player, this.hazard, this.takeDamage, null, this);

        // Check for game win
        this.checkWinCondition();
        
        // Check for cheats
        GameUtils.checkCheats(this.player);

        // Collisions
        // Kill all bullets that hit solid ground.
        game.physics.arcade.collide(game.enemyBullets, this.layer, function(bullet,layer) { bullet.kill() }, null, this);
        game.physics.arcade.collide(this.player.playerBullets, this.layer, function(bullet,layer) { bullet.kill() }, null, this);

        // Resolve interactions between playerBullets and enemies and between enemyBullets and players.
        game.physics.arcade.overlap(this.turretGroup, this.player.playerBullets, recieveDamage, null, this);
        game.physics.arcade.overlap(this.droneGroup, this.player.playerBullets, recieveDamageD, null, this);
        game.physics.arcade.overlap(this.player, game.enemyBullets, function(p, b) {PlayerUtils.receiveDamage(p, b, this.healthBar)}, null, this);
        game.physics.arcade.overlap(this.player, this.jumpPlatformGroup, function(p, jp) {p.jumpBoost == true; p.jumpHeight = jp.newJumpHeight;});
        
        //Drone overlaps with player logic. Only take damage if states are the same.
        game.physics.arcade.overlap(this.player, droneGroup, function(player,drone) {
            if (drone.shiftState === player.shiftState) {
                this.takeDamage(player);
                drone.explode();
                EnemyUtils.playDroneExplodeSound();
            }
        }, null, this);

        //Collide player with phase platforms if they are in the same phase.
        for (var i = 0; i < phasePlatforms.length; i++) {
            if (this.player.shiftState === phasePlatforms[i].shiftState) {   
                if (!onPlatform) {
                    onPlatform = game.physics.arcade.collide(this.player, phasePlatforms[i]);
                }
            }
        }
        
        //Deal with player movement after checking for platform collision.
        PlayerUtils.handlePlayerMovement(this.player);

        // Check for, and handle, the player falling to the bottom of the map.
        PlayerUtils.checkFallOffWorld(this.player, this.h, this.healthBar);

        // Check for, and handle, player death
        PlayerUtils.checkPlayerDeath(this.player);

        onPlatform = false;

        if (iFrames > 0) {
            iFrames--;

            if(iFrames % 5 === 0) {
                this.player.visible = 0;
            } else if(iFrames % 2 === 0){
                this.player.visible = 1;
            }
        } else {
            this.player.visible = 1;
        }
    },

    render: function() {
        game.debug.text(this.player.jumpHeight, 10, 100);
        game.debug.text(game.physics.arcade.overlap(this.player, this.jumpPlatformGroup), 10, 120);
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
        game.load.image('exitDoor' , 'assets/exitDoor.png', 64, 64);
        game.load.spritesheet('player', "assets/phaser.png", 64,64);
        game.load.spritesheet('bullet', "assets/bullets.png", 16,16);
        game.load.spritesheet('enemyBullet', "assets/enemyBullets.png", 16,16);
        game.load.spritesheet('heart', "assets/battery_32x32.png", 32, 32);

        // UI??
        game.load.image('UI_frame', 'assets/UI_frame.png', 1140, 640);
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
        // Create a game group which will contain all special phase platforms.
        this.phasePlatforms = new Array();
    },

    checkWinCondition: function () {
        if (this.player.overlap(this.exitDoor)){
            game.world.width = gameW;                       // Reset game world cords
            game.world.height = gameH;                      // because the camera messes with it
            game.state.start('gameWin_state');
        }
    },

    /**
     * This function adds phase changing platforms to the map.
     */
    createLevelPlatforms:function(){

        SpriteFactory.makeJumpPlatform(game, (25 * 32), (74 * 32) + 19, -1000, this.player, this.jumpPlatformGroup);
        
        /*
        // starting area
        this.spawnPlatforms(47, 66, 0, 1 );
        this.spawnPlatforms(47, 62, 0, 0 );
        this.spawnPlatforms(47, 58, 0, 1 );

        // large gap
        this.spawnPlatforms(110, 64, 0, 1 );
        this.spawnPlatforms(120, 64, 0, 0 );
        
        // rise
        this.spawnPlatforms(158, 60, 0, 1 );
        this.spawnPlatforms(154, 56, 0, 0 );
        this.spawnPlatforms(158, 52, 0, 1 );
        this.spawnPlatforms(154, 48, 0, 0 );
        this.spawnPlatforms(158, 44, 0, 1 );
        this.spawnPlatforms(154, 40, 0, 0 );
        this.spawnPlatforms(158, 36, 0, 1 );
        this.spawnPlatforms(154, 32, 0, 0 );

        // spike pit
        this.spawnPlatforms(77, 30, 0, 1 );
        this.spawnPlatforms(72, 27, 0, 0 );
        this.spawnPlatforms(62, 27, 0, 1 );
        this.spawnPlatforms(52, 27, 0, 0 );
        this.spawnPlatforms(42, 27, 0, 1 );
        this.spawnPlatforms(32, 27, 0, 0 );
        */
    },

    /**
     * This function adds drones to the map.
     */
    createDrones: function() {

    },

    /**
     * This function adds turrets to the map.
     */
    createTurrets: function() {
        // Initial ascent
        SpriteFactory.makeTurret(game, (39 * 32), (53 * 32) + 13, this.player, this.phaseObjects, this.turretGroup);
        SpriteFactory.makeTurret(game, (39 * 32), (58 * 32) + 13, this.player, this.phaseObjects, this.turretGroup);
        SpriteFactory.makeTurret(game, (39 * 32), (63 * 32) + 13, this.player, this.phaseObjects, this.turretGroup);

    },

    takeDamage: function(player)
    {
        if (iFrames == 0){
            player.health--;
            if (this.healthBar[player.health] != null) {
                this.healthBar[player.health].kill();
            }
            iFrames = 30;
            PlayerUtils.playDamageSound();
        }
    },
};



