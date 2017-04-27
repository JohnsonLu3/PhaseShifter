/**
 * The game state for level 1.
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

var Level_1 = function() {};
Level_1.prototype = {

    /**
     * This function loads all the images to render for this level.
     */
    loadImages: function() {
        game.load.tilemap('mapdata', 'assets/levels/level0.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'assets/levels/tilesheet.png');
        game.load.image('exitDoor' , 'assets/exitDoor.png', 64, 64);
        game.load.spritesheet('player', "assets/phaser.png", 64,64);
        game.load.spritesheet('bullet', "assets/bullets.png", 16,16);
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
    },

    init: function() {
        this.w = 2560;                      // size of level W and H 
        this.h = 640;                   
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
        this.map.addTilesetImage('tilesheet', 'tiles');
        this.map.setCollisionBetween(0, 40);
        game.world.setBounds(0, 0, this.w, this.h);
        this.layer = this.map.createLayer('Tile Layer 1');
        //Add group above the tile layer.
        enemyGroup = game.add.group();
        // Start physics
        game.physics.startSystem(Phaser.Physics.ARCADE);

        // make an exitDoor
        exitDoor = game.add.sprite(2500, 323, 'exitDoor');

        // Create player
        this.player = new Player(game, 32, game.world.height - 300, 'player', 0, 5);
        phaseObjects.push(this.player);
        game.camera.follow(this.player);
        this.healthBar = PlayerUtils.spawnLifeBar(this.player);

        this.addTurret(750,332,this.player);
        this.addTurret(1150, 332, this.player);

        //Create a platform.
        platform = new Platform(game,400,400, 200);
        phaseObjects.push(platform);
        phasePlatforms.push(platform);

        // Spawn Platforms that can shift phases
        this.spawnPlatforms(46, 12 ,0, 1);
        this.spawnPlatforms(49, 12 ,0 * 1000, 0);
        this.spawnPlatforms(52, 12 ,0, 1);

        // Set up cursors
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

        // Check for win condition (ends game)
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
        game.physics.arcade.overlap(this.player, game.enemyBullets, function(p, b) {PlayerUtils.receiveDamage(p, b, this.healthBar)}, null, this);
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

        // Check for, and handle, the player falling to the bottom of the map.
        PlayerUtils.checkFallOffWorld(this.player, this.h, this.healthBar);

        // Check for, and handle, player death
        PlayerUtils.checkPlayerDeath(this.player);

        onPlatform = false;
        
    },

    render: function() {
        //game.debug.bodyInfo(this.player, 32, 32);
        //game.debug.body(phasePlatforms[0]);
        //game.debug.body(this.player);
    },

    checkWinCondition: function () {
        if (this.player.overlap(exitDoor)){
            game.world.width = gameW;                       // Reset game world cords
            game.world.height = gameH;                      // because the camera messes with it
            LevelTransitionState.setNextLevel(2);
            game.state.start('levelTransition_state');
        }
    },

    spawnPlatforms: function(x, y, interval ,state){
        platform = new Platform(game,x*32, y*32, interval, state);
        phasePlatforms.push(platform);
        phaseObjects.push(platform);
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

    }
};