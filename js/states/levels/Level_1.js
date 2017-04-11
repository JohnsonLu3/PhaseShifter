/**
 * The game state for level 1.
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

var healthBar = [];
var menuButton;                             // for the pause menu
var menuText;
var PauseText;
var onPlatform = false;
var enemyGroup;

var Level_1 = function() {};
Level_1.prototype = {
    init: function() {
        this.w = 2560;                      // size of level W and H 
        this.h = 640;                   
    },
    preload: function() {
        // Load images
        game.load.tilemap('mapdata', 'assets/levels/level0.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'assets/levels/tilesheet.png');
        game.load.image('menu', 'assets/buttons/smallButton_150x60.png', 150, 60);
        game.load.spritesheet('player', "assets/phaser.png", 64,64);
        game.load.spritesheet('bullet', "assets/bullets.png", 16,16);
        game.load.image('exitDoor' , 'assets/exitDoor.png', 64, 64);

        game.load.spritesheet('turret', "assets/turret.png", 64,64);

        game.load.spritesheet('heart', "assets/battery_32x32.png", 32, 32);
        game.load.spritesheet('platform', "assets/platform.png", 64, 32);

        // Load necessary JS files
        game.load.script('customSprite_script', 'js/characters/customSprite.js');
        //game.load.script('player_script', 'js/characters/player.js');
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
        this.map.addTilesetImage('tilesheet', 'tiles');
        this.map.setCollisionBetween(0, 40);
        game.world.setBounds(0, 0, this.w, this.h);
        this.layer = this.map.createLayer('Tile Layer 1');
        //Add group above the tile layer.
        enemyGroup = game.add.group();
        // Start physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Set up cursors
        var cursors = game.input.keyboard.createCursorKeys();
        this.setControls();
        GameUtils.buildKeys();

        // make an exitDoor
        exitDoor = game.add.sprite(2500, 323, 'exitDoor');

        // Create player
        this.player = new Player(game, 32, game.world.height - 300, 'player', 0, 5);
        phaseObjects.push(this.player);
        game.camera.follow(this.player);


        this.addTurret(750,332,this.player);
        this.addTurret(1150, 332, this.player);
        
        //Create a platform.
        platform = new Platform(game,400,400, 200);
        phaseObjects.push(platform);
        phasePlatforms.push(platform);
        //console.log(phasePlatforms);
        //console.log(this.platform);

        this.spawnLifeBar();

        // Spawn Platforms that can shift phases
        this.spawnPlatforms(46, 12 );
        this.spawnPlatforms(49, 12 );
        this.spawnPlatforms(52, 12 );

        // Add lisitener for menubutton press
        game.input.onDown.add(this.levelSelect, self);

    },

    update: function() {
        globalTimer++;
        updatePhases();
        game.physics.arcade.collide(this.player, this.layer);

        this.checkWinCondition();


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

        if(this.player.y > 610){                  // Player loses all their health if they touch the bottom of the screen
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

    setControls: function() {
        ShiftKey = ControlKeys.phaseShiftKey.onDown.add(this.flipShiftFlag, this);//game.input.keyboard.addKey(Phaser.Keyboard.SHIFT).onDown.add(this.flipShiftFlag, this);           // shift ability
        ZKey     = ControlKeys.shootKey;//game.input.keyboard.addKey(Phaser.Keyboard.Z);                                               // Shoot Button
        XKey     = ControlKeys.jumpKey//game.input.keyboard.addKey(Phaser.Keyboard.X);                                               // Jump  Button
        LeftKey  = ControlKeys.leftKey;//game.input.keyboard.addKey(Phaser.Keyboard.LEFT);                                            // Walk  Left
        RightKey = ControlKeys.rightKey;//game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);                                           // Walk  Right
        EscKey   = ControlKeys.pauseKey.onDown.add(this.pauseGame, this);
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

            this.player.body.velocity.y = -300;
        }

        if(LeftKey.isDown && this.player.isAlive) {
            // player move left

            this.updateFacing(false);

            this.player.body.velocity.x = -150;

        } else if(RightKey.isDown && this.player.isAlive) {
            // player move right

            this.updateFacing(true);

            this.player.body.velocity.x = 150;
        
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

    /**
     *  pauseGame
     *      Pauses the game when ever the 
     *      ESC key is pressed. Pressing
     *      the key again unpause the game.
     */
    pauseGame: function(){
        // NEED TO SHOW A PAUSE MENU WHERE YOU CAN GO BACK TO THE MAIN MAIN
        if(game.paused === true){
            game.paused = false;                            // unpause game
            game.world.remove(PauseText);
            game.world.remove(menuText);
            game.world.remove(menubutton);

        } else {
            game.paused = true;                             // pause game
            PauseText = game.add.text(game.camera.x + gameW/2, 20, 'Paused', { font: '30px Arial', fill: '#fff' });
            PauseText.anchor.setTo(0.5, 0.5);

            menubutton = game.add.sprite(game.camera.x + gameW/2, gameH/2, 'menu');
            menubutton.anchor.setTo(0.5, 0.5);
            
            menuText = game.add.text(game.camera.x + gameW/2, gameH/2, 'Level Select', {font: '24px Arial', fill: 'white'});
            menuText.anchor.setTo(0.5, 0.5);

        }
    },

    levelSelect: function(event){

        if(game.paused === true){
            var mouseX = event.x + 65;          // add weird offset
            var mouseY = event.y + 24;

            if( mouseX + game.camera.x >  menubutton.x && mouseX + game.camera.x < menubutton.x + 150
                && mouseY + game.camera.y >  menubutton.y - 60 && mouseY + game.camera.y < menubutton.y + 60 ){
                // CALL STATE SWITCH
                game.paused = false;
                game.world.width = gameW;                       // Reset game world cords
                game.world.height = gameH;                      // because the camera messes with it
                game.state.start('levelSelect_state');
                
            }
        }
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

    spawnPlatforms: function(x, y){
        platform = new Platform(game,x*32, y*32, ((Math.random()/2) + 0.5) * 300);
        phasePlatforms.push(platform);
        phaseObjects.push(platform);
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
            player.health--;
            if (healthBar[player.health] != null)
            {
                healthBar[player.health].kill();
            }

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



