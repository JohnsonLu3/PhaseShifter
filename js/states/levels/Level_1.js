/**
 * The game state for level 1.
 * This is called by the levelSelectState when the user clicks on the first level icon.
 */

var healthBar = [];
var menuButton;                             // for the pause menu
var menuText;
var PauseText;

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
        game.load.spritesheet('player', "assets/phaser.png", 32,32);
        game.load.spritesheet('bullet', "assets/bullets.png", 16,16);
        game.load.spritesheet('heart', "assets/battery_32x32.png", 32, 32);
        game.load.spritesheet('platform', "assets/platform.png", 32, 16);

        // Load necessary JS files
        game.load.script('customSprite_script', 'js/characters/customSprite.js');
        game.load.script('player_script', 'js/characters/player.js');
        //game.load.script('playerSprite_script', 'js/characters/playerSprite.js');
    },
    create: function() {
        // Change background color
        game.stage.backgroundColor = '#787878';

        // Load level from mapdata
        this.map = game.add.tilemap('mapdata');
        this.map.addTilesetImage('tilesheet', 'tiles');
        this.map.setCollisionBetween(0, 40);
        game.world.setBounds(0, 0, this.w, this.h);
        this.layer = this.map.createLayer('Tile Layer 1');

        // Start physics
        game.physics.startSystem(Phaser.Physics.ARCADE);
        
        // Set up cursors
        var cursors = game.input.keyboard.createCursorKeys();
        this.setControls();
        GameUtils.buildKeys();

        // Create player
        this.player = Player();
        game.camera.follow(this.player);

        this.spawnLifeBar();

        // Spawn Platforms that can shift phases
        this.spawnPlatforms(46, 12 );
        this.spawnPlatforms(49, 12 );
        this.spawnPlatforms(52, 12 );

        // Add lisitener for menubutton press
        game.input.onDown.add(this.levelSelect, self);
    },

    update: function() {
        game.physics.arcade.collide(this.player, this.layer);
        this.playerMovement();

        if(this.player.y > 610){                  // Player loses all their health if they touch the bottom of the screen
            this.player.health = 0;


            for(heart in healthBar){             // kill all heart sprites in healthbar
                healthBar[heart].kill();
            }
        }

        if(this.player.health === 0 && this.player.isAlive){                     // Kill player
            this.player.isAlive = false;
            this.player.body.velocity.x = 0;
            this.player.body.velocity.y = 0;                        
            this.player.animations.play('die');
        }
    },

    render: function() {
        //game.debug.bodyInfo(this.player, 32, 32);
        //game.debug.body(this.player);
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
        this.player.phase = !this.player.phase;
    },
    

    /**
     *  playerMovement
     *      Update the player movements based on the
     *      the controls that are pressed. Also players
     *      the correct animation / facing / shift state
     */
    playerMovement: function() {
        if(ZKey.isDown && this.player.isAlive){
            // call shoot function
            
        }

        if(XKey.isDown && this.player.body.blocked.down && this.player.isAlive) {
            // player jump
            this.player.jumping = true;
            this.playShiftAnimation('jump');
            this.player.body.velocity.y = -225;
        }

        if(LeftKey.isDown && this.player.isAlive) {
            // player move left
            this.updateFacing(0);
            if(!this.player.jumping)
                this.playShiftAnimation('walk');
            this.player.body.velocity.x = -150;

        } else if(RightKey.isDown && this.player.isAlive) {
            // player move right
            this.updateFacing(1);
            if(!this.player.jumping)
                this.playShiftAnimation('walk');
            this.player.body.velocity.x = 150;
        
        } else if(this.player.isAlive && !this.player.jumping){
            // reset velocity
            this.playShiftAnimation('idle');
            this.player.body.velocity.x = 0;
        
        }else{
            this.player.body.velocity.x = 0;
        }
    },

    /**
     *  playShiftAnimation
     *  @param {*} animationToPlay 
     * 
     *  Takes an animation state, eg: jump, walk, idle
     *  based on the player phase it plays the correct animation
     *  
     */
    playShiftAnimation: function(animationToPlay) {

        if(animationToPlay === "die"){
            this.player.animations.play('die');
            return;
        }

        if(this.player.phase === false){
            this.player.animations.play( animationToPlay + '_B' );       // Blue State
        } else {
            this.player.animations.play( animationToPlay + '_R' );       // Red State
        }

        return;
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
            PauseText   = game.add.text(game.camera.x + gameW/2 - 30, 20, 'Paused', { font: '30px Arial', fill: '#fff' });
            
            menubutton = game.add.sprite(gameW/2-150/2 + 16, gameH/2-60, 'menu');
            menuText = game.add.text(menubutton.x + 8, menubutton.y + 16, 'Level Select', {font: '24px Arial', fill: 'white'});

        }
    },

    levelSelect: function(event){
        if( event.x >  menubutton.x && event.x < menubutton.x + 150 && event.y >  menubutton.y && event.y < menubutton.y + 60 ){
            // CALL STATE SWITCH
            game.paused = false;
            game.world.width = gameW;                       // Reset game world cords
            game.world.height = gameH;                      // because the camera messes with it
            game.state.start('levelSelect_state');
            
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
        platform = game.add.sprite(x * 32, y * 32, 'platform');
        game.physics.arcade.enable(platform);
    }
};



