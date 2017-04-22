/**
 * The game state for level 2.
 * This is called by the levelSelectState when the user clicks on the first level icon.
 */

 var turretTEST;
 var platform;
 //phaseObjects, phasePlatforms
// A global timer, this is used in order to keep track of things such as intervals for enemy phase changes.
var globalTimer = 0;
// Collection of all phase objects in the game, used for calling update each frame.
var phaseObjects = new Array();
// Create a game group which will contain all special phase platforms.
var phasePlatform = new Array();
var exitDoor;
// Number of invincibility frames player has
var iFrames = 0;

var healthBar = [];
var menuButton;                             // for the pause menu
var menuText;
var PauseText;
var onPlatform = false;
var enemyGroup;

var Level_2 = function() {};
Level_2.prototype = {
    init: function() {
        this.w = 5120;                      // size of level W and H 
        this.h = 2400;                   
    },
    preload: function() {
        // Load images
        game.load.tilemap('mapdata', 'assets/levels/level2.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('collisionTiles', 'assets/tilesheet2.png');
        game.load.image('menu', 'assets/buttons/smallButton_150x60.png', 150, 60);
        game.load.spritesheet('player', "assets/phaser.png", 64,64);
        game.load.spritesheet('bullet', "assets/bullets.png", 16,16);
        game.load.image('exitDoor' , 'assets/exitDoor.png', 64, 64);
        game.load.image('hazardTiles', 'assets/levels/hazards.png');
        game.load.spritesheet('turret', "assets/turret.png", 64,64);

        game.load.spritesheet('heart', "assets/battery_32x32.png", 32, 32);
        game.load.spritesheet('platform', "assets/platform.png", 64, 32);

        // Load necessary JS files
        game.load.script('customSprite_script', 'js/characters/customSprite.js');
        game.load.script('functs', 'js/lib/functions.js');
        game.load.script('playerSprite_script', 'js/characters/playerSprite.js');
        game.load.script('platforms', 'js/characters/platforms.js');
    },
    create: function() {
        // Change background color
        game.stage.backgroundColor = '#787878';
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
        this.hazard = this.map.createLayer("hazards");
        this.layer = this.map.createLayer("walkable");
        this.map.addTilesetImage('tilesheet2', 'collisionTiles');
        this.map.addTilesetImage('hazards', 'hazardTiles');
        this.map.setCollisionBetween(0, 250, true, "walkable");
        this.map.setCollisionBetween(0, 250, true, "hazards");
        game.world.setBounds(0, 0, this.w, this.h);

        //Add group above the tile layer.
        enemyGroup = game.add.group();
        // Start physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Set up cursors
        var cursors = game.input.keyboard.createCursorKeys();
        this.setControls();

        // make an exitDoor
        exitDoor = game.add.sprite(3850, 415, 'exitDoor');

        // Create player
        this.player = new Player(game, 32, this.h-1400, 'player', 0, 5);
        phaseObjects.push(this.player);
        game.camera.follow(this.player);


        this.addTurret(800,1455,this.player);
        this.addTurret(1000, 1455, this.player);
        this.addTurret(1200,1455,this.player);
        this.addTurret(1400, 1455, this.player);
        this.addTurret(1600,1455,this.player);
        this.addTurret(1800, 1455, this.player);
        this.addTurret(2000,1455,this.player);
        this.addTurret(2200,1455,this.player);
        this.addTurret(2400,1455,this.player);

        this.spawnLifeBar();

        // Spawn Platforms that can shift phases
        this.createLevelPlatforms();

        // Add lisitener for menubutton press
        game.input.onDown.add(GameUtils.pauseMenuHandler, self);

    },

    update: function() {
        globalTimer++;
        game.physics.arcade.collide(this.player, this.layer);
        game.physics.arcade.collide(this.player, this.hazard, this.takeDamage, null, this);

        this.checkWinCondition();
        this.checkCheats();

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
        game.physics.arcade.overlap(this.player, game.enemyBullets, this.recieveDamageP, null, this);
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
        this.playerMovement();

        if(this.player.y > this.h - 70){          // Player loses all their health if they touch the bottom of the screen
            this.player.health = 0;


            for(heart in healthBar){             // kill all heart sprites in healthbar
                healthBar[heart].kill();
            }
        }

        if(this.player.health === 0 && this.player.isAlive){                     // Kill player
            this.player.isAlive = false;                   
            this.player.animations.play('die');
            this.player.animations.currentAnim.onComplete.add(function () { 
                game.world.width = gameW;                       // Reset game world cords
                game.world.height = gameH;                      // because the camera messes with it
                game.state.start('gameLose_state');
            });
        }

        onPlatform = false;
        if (iFrames > 0)
            iFrames--;
        
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
            game.state.start('gameWin_state');
        }
    },

    // Cheat handler
    checkCheats: function() {
        if(Cheat1Key.isDown) {
            game.state.start('level_1_state');
        }
        else if(Cheat2Key.isDown) {
            game.state.start('level_2_state');
        }
        else if (Cheat3Key.isDown) {
            game.state.start('level_3_state');
        }
        // Toggle invincibility
        else if (CheatIKey.isDown) {
            this.player.invulnerable = !this.player.invulnerable;
        }

    },

    /**
     * This sets all the key mappings
     */
    setControls: function() {
        ShiftKey = ControlKeys.phaseShiftKey.onDown.add(this.flipShiftFlag, this);  // shift ability
        ZKey     = ControlKeys.shootKey;                                            // Shoot Button
        XKey     = ControlKeys.jumpKey                                              // Jump  Button
        LeftKey  = ControlKeys.leftKey;                                             // Walk  Left
        RightKey = ControlKeys.rightKey;                                            // Walk  Right
        EscKey   = ControlKeys.pauseKey.onDown.add(GameUtils.pauseGame, this);           // Pause menu

        // Cheat Keys
        Cheat1Key = ControlKeys.oneKey;
        Cheat2Key = ControlKeys.twoKey;
        Cheat3Key = ControlKeys.threeKey;
        CheatIKey = ControlKeys.invincibilityKey;
    },

    flipShiftFlag: function() {
        this.player.changePhase();
    },
    

    /**
     *  playerMovement
     *      Update the player movements based on the
     *      the controls that are pressed. Also players
     *      the correct animation / facing / shift state
     */
    playerMovement: function() {
        if(ZKey.isDown){
            this.player.fire();
        }

        if(XKey.isDown && this.player.isAlive && (this.player.body.blocked.down || onPlatform )) {
            // player jump
            
            this.player.jumping = true;

            this.player.body.velocity.y = this.player.jumpHeight;
        }

        if(LeftKey.isDown && this.player.isAlive) {
            // player move left

            this.updateFacing(false);

            this.player.body.velocity.x = -this.player.walkingSpeed;

        } else if(RightKey.isDown && this.player.isAlive) {
            // player move right
            this.updateFacing(true);

            this.player.body.velocity.x = this.player.walkingSpeed;
        
        } else if(this.player.isAlive && !this.player.jumping){
            // reset velocity
            this.player.body.velocity.x = 0;
        
        }else{
            this.player.body.velocity.x = 0;
        }

        //Play the proper animation, uninterruptable
        if (this.player.body.velocity.y != 0 && !onPlatform && this.player.isAlive){
            //console.log(this.player.body.velocity.y);
            this.player.playAnimation("jump");
        }
        else if (this.player.body.velocity.x != 0 && this.player.isAlive)
        {
            this.player.playAnimation("walk");
        }
        else if (this.player.isAlive)
        {
            this.player.playAnimation("idle");
        }
    },


    /**
     *  updateFacing
     *      update the player's sprite's facing position
     */
    updateFacing: function(facingFlag){

        if(this.player.facing === facingFlag){
            // player is already facing the same direction
        } else {
            this.player.scale.x *= -1;
            this.player.facing  =  facingFlag;   
        }

        return;
    },

    spawnLifeBar: function(){
            // create health;
        for(var x = 0; x < 10; x++){
                heart = game.add.sprite((x*32) + 8, 16, 'heart');
                heart.hit = false;
                heart.fixedToCamera = true;

                healthBar.push(heart);
        }
    },

    spawnPlatforms: function(x, y, interval, state){
        platform = new Platform(game,x*32, y*32,  interval, state);
        phasePlatforms.push(platform);
        phaseObjects.push(platform);
    },

    createLevelPlatforms:function(){
        // Jumps to first platform.
        this.spawnPlatforms(24, 30, 500, 1 );
        this.spawnPlatforms(27, 27, 500, 1 );
        //Jumps to second platform.
        this.spawnPlatforms(37, 22, 350, 1 );
        this.spawnPlatforms(39, 20, 350, 1 );
        //Jumps to third platform.
        this.spawnPlatforms(48, 16, 275, 0 );
        this.spawnPlatforms(50, 14 , 275, 1 );
        this.spawnPlatforms(52, 12, 275, 0 );
        //Final Jumps to last platform
        this.spawnPlatforms(64, 9, 117, 0 );
        this.spawnPlatforms(70, 7, 350, 0 );
        this.spawnPlatforms(76, 5, 175, 0 );
 

    },
    
/**
 * This function is called when an enemy bullet is in contact with a player.
 * @param {*} turret The player, which was just in contact with the bullet.
 * @param {*} bullet The bullet, which is in contact with the player.
 */
    recieveDamageP: function (player, bullet)
    {
        if (player.shiftState === bullet.phase) {
            bullet.kill()
            this.takeDamage(player);

        }
    },

    takeDamage: function(player)
    {
        if (iFrames == 0){
            player.health--;
            if (healthBar[player.health] != null) {
                healthBar[player.health].kill();
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

    }
};



