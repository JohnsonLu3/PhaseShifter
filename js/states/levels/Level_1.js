/**
 * The game state for level 1.
 * This is called by the levelSelectState when the user clicks on the first level icon.
 */

var healthBar = [];

var Level_1 = function() {};
Level_1.prototype = {
    init: function() {
        this.w = 2560;
        this.h = 640;
    },
    preload: function() {
        // Load images
        game.load.tilemap('mapdata', 'assets/levels/level0.json', null, Phaser.Tilemap.TILED_JSON);
        game.load.image('tiles', 'assets/levels/tilesheet.png');
        game.load.spritesheet('player', "assets/phaser.png", 32,32);
        game.load.spritesheet('bullet', "assets/bullets.png", 16,16);
        game.load.spritesheet('heart', "assets/battery_32x32.png", 32, 32);

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

        // Create player
        this.player = Player();
        //this.player = new Player(game, 32, game.world.height - 300, 'player', 0, 5);
        game.camera.follow(this.player);

        this.spawnLifeBar();
    },

    update: function() {
        game.physics.arcade.collide(this.player, this.layer);
        this.playerMovement();

        if(this.player.y > 620){
            this.player.health -= 100;
        }

        if(this.player.health <= 0){
            this.playShiftAnimation("die");
        }
    },

    render: function() {
        //game.debug.bodyInfo(player, 32, 32);
        //game.debug.body(player);
    },

    setControls: function() {
        ShiftKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT).onDown.add(this.flipShiftFlag, this);      // shift ability
        ZKey     = game.input.keyboard.addKey(Phaser.Keyboard.Z);                                               // Shoot Button
        XKey     = game.input.keyboard.addKey(Phaser.Keyboard.X);                                               // Jump  Button
        LeftKey  = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);                                            // Walk  Left
        RightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);                                           // Walk  Right
        EscKey   = game.input.keyboard.addKey(Phaser.Keyboard.ESC).onDown.add(this.pauseGame, this);
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
        if(ZKey.isDown){
            // call shoot function
            this.playShiftAnimation('die');
        }

        if(XKey.isDown && this.player.body.blocked.down) {
            // player jump
            this.playShiftAnimation('jump');
            this.player.body.velocity.y = -225;
        }

        if(LeftKey.isDown) {
            // player move left
            this.updateFacing(0);
            this.playShiftAnimation('walk');
            this.player.body.velocity.x = -150;

        } else if(RightKey.isDown) {
            // player move right
            this.updateFacing(1);
            this.playShiftAnimation('walk');
            this.player.body.velocity.x = 150;
        
        } else {
            // reset velocity
            this.playShiftAnimation('idle');
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
            game.paused = false;
        } else {
            game.paused = true;
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
    }
};



