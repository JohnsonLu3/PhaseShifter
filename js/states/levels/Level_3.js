/**
 * The game state for level 3.
 * This is called by the levelSelectState when the user clicks on the first level icon.
 */

 var platform;
//phaseObjects, phasePlatforms
// A global timer, this is used in order to keep track of things such as intervals for enemy phase changes.
var globalTimer = 0;
// Collection of all phase objects in the game, used for calling update each frame.
var phaseObjects = new Array();
// Create a game group which will contain all special phase platforms.
var phasePlatform = new Array();
var exitDoor;
var onPlatform = false;
var enemyGroup;
//Group consisting of all drones.
var droneGroup;

var Level_3 = function() {};
Level_3.prototype = {
    
    /**
     * This function loads all the images to render for this level.
     */
    loadImages: function() {
        game.load.tilemap('mapdata', 'assets/levels/SpikesAndFalls.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('collisionTiles', 'assets/levels/tilesheet2.png');
        game.load.image('hazardTiles', 'assets/levels/hazards.png');
        game.load.image('exitDoor' , 'assets/exitDoor.png', 64, 64);
        game.load.spritesheet('player', "assets/phaser.png", 64,64);
        game.load.spritesheet('bullet', "assets/bullets.png", 16,16);
        game.load.spritesheet("drone", "assets/Drone.png", 32, 32);
        game.load.spritesheet('turret', "assets/turret.png", 64,64);
        game.load.spritesheet('heart', "assets/battery_32x32.png", 32, 32);
        game.load.spritesheet('platform', "assets/platform.png", 64, 32);
    },

    /**
     * This function loads all the JS files for the objects in this level.
     */
    loadScripts: function() {
        game.load.script('customSprite_script', 'js/characters/customSprite.js');
        game.load.script('functs', 'js/lib/functions.js');
        game.load.script('playerSprite_script', 'js/characters/playerSprite.js');
        game.load.script('platforms', 'js/characters/platforms.js');
        game.load.script('drone', 'js/characters/drone.js');
    },
    
    init: function() {
        this.w = 5120;                      // size of level W and H 
        this.h = 2400;                   
    },

    preload: function() {
        this.loadImages();
        this.loadScripts();
    },

    create: function() {
        // Create a group for all enemy bullets, this will greatly simplify the collision detections
        game.enemyBullets = game.add.group();
        game.enemyBullets.enableBody = true;
        game.enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
        //Add a max of 100 bullets that all enemies can shoot.
        game.enemyBullets.createMultiple(100, 'bullet');
        game.enemyBullets.setAll('checkWorldBounds', true);
        game.enemyBullets.setAll('outOfBoundsKill', true);            

        // Load level from mapdata
        this.map = game.add.tilemap('mapdata');
        this.map.addTilesetImage('hazards', 'hazardTiles');
        this.map.addTilesetImage('tilesheet2', 'collisionTiles');
        game.world.setBounds(0, 0, this.w, this.h);
        this.hazard = this.map.createLayer('hazards');
        this.layer = this.map.createLayer('Collisions');
        this.map.setCollisionBetween(0, 400, true, this.layer);
        this.map.setCollisionBetween(0, 400, true, this.hazard);


        //Add group above the tile layer.
        enemyGroup = game.add.group();
        droneGroup = game.add.group();
        // Start physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // make an exitDoor
        exitDoor = game.add.sprite(32, (31 * 32), 'exitDoor');


        // Create player
        this.player = new Player(game, 32, this.h - (16 * 32), 'player', 0, 5);
        phaseObjects.push(this.player);
        game.camera.follow(this.player);
        this.healthBar = PlayerUtils.spawnLifeBar(this.player);


        this.addDrone( 1970, 900, this.player);
        this.addDrone( 2350, 950, this.player);
        this.addDrone( 2620, 850, this.player);

        this.addTurret(2280, 1938, this.player);
        this.addTurret(3080, 1906, this.player);
        this.addTurret(4293, 2002, this.player);
        this.addTurret(4500, 2002, this.player);
        this.addTurret(4600, 2002, this.player);
        this.addTurret(4525, 1010, this.player);
        this.addTurret(3862, 1010, this.player);
        this.addTurret(3170, 1010, this.player);

        if (iFrames > 0){
            iFrames--;
            
            if(iFrames % 2 === 0){
                    this.player.visible = 0;
                }else{
                    //this.player.visible = 1;
                }
            }

        // Spawn Platforms that can shift phases
        this.createLevelPlatforms();

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

        this.checkWinCondition();
        
        // Check for cheats
        GameUtils.checkCheats(this.player);

        //Collisions.
        //Kill all bullets that hit solid ground.
        game.physics.arcade.collide(game.enemyBullets, this.layer,function(bullet,layer)
        {
            bullet.kill()
        },null,this);
        
        game.physics.arcade.collide(this.player.playerBullets, this.layer,function(bullet,layer)
        {
            bullet.kill()
        },null,this);

        //Resolve interactions between playerBullets and enemies and between enemyBullets and players.
        game.physics.arcade.overlap(enemyGroup, this.player.playerBullets, recieveDamage, null, this);
        game.physics.arcade.overlap(droneGroup, this.player.playerBullets, recieveDamageD, null, this);
        game.physics.arcade.overlap(this.player, game.enemyBullets, function(p, b) {PlayerUtils.receiveDamage(p, b, this.healthBar)}, null, this);

        //Drone overlaps with player logic. Only take damage if states are the same.
        game.physics.arcade.overlap(this.player,droneGroup, function(player,drone)
        {
            if (drone.shiftState === player.shiftState)
            {
                this.takeDamage(player);
                drone.explode();
                EnemyUtils.playDroneExplodeSound();
            }
        }, null, this);

        //Collide player with phase platforms if they are in the same phase.
        for (var i = 0; i < phasePlatforms.length; i++)
        {
            if (this.player.shiftState === phasePlatforms[i].shiftState)
            {   
                if (!onPlatform)
                {
                    onPlatform = game.physics.arcade.collide(this.player, phasePlatforms[i]);
                }
            }
        }
        //Deal with player movement after checking for platform collision.
        PlayerUtils.handlePlayerMovement(this.player);

        if(this.player.y > this.h - 70){          // Player loses all their health if they touch the bottom of the screen
            this.player.health = 0;


            for(heart in this.healthBar){             // kill all heart sprites in healthbar
                this.healthBar[heart].kill();
            }
        }

        // Check for, and handle, player death
        PlayerUtils.checkPlayerDeath(this.player);

        onPlatform = false;

        if (iFrames > 0){
            iFrames--;

            if(iFrames % 5 === 0){
                    this.player.visible = 0;
                }else{
                    if(iFrames % 2 === 0){
                        this.player.visible = 1;
                    }
                }
            }else{
                this.player.visible = 1;
            }

    },

    render: function() {},

    checkWinCondition: function () {
        if (this.player.overlap(exitDoor)){
            game.world.width = gameW;                       // Reset game world cords
            game.world.height = gameH;                      // because the camera messes with it
            game.state.start('gameWin_state');
        }
    },

    spawnPlatforms: function(x, y, interval, state){
        platform = new Platform(game,x*32, y*32,  interval, state);
        phasePlatforms.push(platform);
        phaseObjects.push(platform);
    },

    createLevelPlatforms:function(){
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
    },

    takeDamage: function(player)
    {
        if (iFrames == 0){
            player.health--;
            if (this.healthBar[player.health] != null) {
                this.healthBar[player.health].kill();
            }
            iFrames = 30;   
        }
    },
    /**
     * This function adds a turret to the current game world.
     * @param {*} x The x position of the turret to be added.
     * @param {*} y The y position of the turret to be added.
     * @param {*} player A reference to the player character.
     */
    addTurret : function (x, y, player)
    {
        var newTurret = new Turret(game, x,y,player);
        phaseObjects.push(newTurret);
        enemyGroup.add(newTurret);

    },

    /**
     * This function adds a drone to the world.
     * @param {*} x The x position of the drone.
     * @param {*} y The y position of the drone.
     * @parmam {*} player A reference to the player character.
     */
    addDrone : function(x,y,player)
    {
        var newDrone = new Drone(game, x, y, player);
        phaseObjects.push(newDrone);
        droneGroup.add(newDrone)
    }
};



