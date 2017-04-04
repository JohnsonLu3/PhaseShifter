var game = new Phaser.Game(800, 600, Phaser.AUTO, '', { preload: preload, create: create, update: update });
var w = 2560;
var h = 640;
var player; 

function preload() {
    game.load.tilemap('mapdata', 'assets/levels/level0.json', null, Phaser.Tilemap.TILED_JSON);
    game.load.image('tiles', 'assets/levels/tilesheet.png');
    game.load.spritesheet('player', "assets/phaser.png", 32,32);
}

var map;
var layer;

function create() {
    game.stage.backgroundColor = '#787878';

    // Load level from mapdata
    map = game.add.tilemap('mapdata');
    map.addTilesetImage('tilesheet', 'tiles');

    // start physics and set up cursor
    game.physics.startSystem(Phaser.Physics.ARCADE);
    cursors = game.input.keyboard.createCursorKeys();

    game.physics.startSystem(Phaser.Physics.ARCADE);
    //game.world.setBounds(0, 0, w, h);

    cursors = game.input.keyboard.createCursorKeys();
    setControls();

    layer = map.createLayer('mapdata');
    // create player
    player = new Player();
    //game.camera.follow(player);
}

function update() {
    //game.physics.arcade.collide(player, layer);
    playerMovement();
}

/**
 *  playerMovement
 *      Update the player movements based on the
 *      the controls that are pressed. Also players
 *      the correct animation / facing / shift state
 */
function playerMovement(){

    if(ZKey.isDown){
        // call shoot function
    }

    if(XKey.isDown && player.body.touching.down){
        // player jump
        playShiftAnimation('jump');
        player.body.velocity.y = -150;

    }

    if(LeftKey.isDown){
        // player move left
        updateFacing(0);
        playShiftAnimation('walk');
        player.body.velocity.x = -100;

    }else if(RightKey.isDown){
        // player move right
        updateFacing(1);
        playShiftAnimation('walk');
        player.body.velocity.x = 100;
    
    }else{
        // reset velocity
        player.animations.stop();
        player.body.velocity.x = 0;
    
    }
}

/**
 *  setControls
 *      Set up controls for the player to use
 *      Shift, Z, X, LEFT, RIGHT
 */
function setControls(){
    ShiftKey = game.input.keyboard.addKey(Phaser.Keyboard.SHIFT).onDown.add(flipShiftFlag, this);           // shift ability
    ZKey     = game.input.keyboard.addKey(Phaser.Keyboard.Z);                                               // Shoot Button
    XKey     = game.input.keyboard.addKey(Phaser.Keyboard.X);                                               // Jump  Button
    LeftKey  = game.input.keyboard.addKey(Phaser.Keyboard.LEFT);                                            // Walk  Left
    RightKey = game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);                                           // Walk  Right
}

/**
 *  
 *  listener for fliping the shift bit in Player
 */
function flipShiftFlag(){
    
    player.shiftState = !player.shiftState;             // TEMP CODE to test animations
    return;
}

/**
 *  playShiftAnimation
 *  @param {*} animationToPlay 
 * 
 *  Takes an animation state, eg: jump, walk, idle
 *  based on the player shiftstate it plays the correct animation
 *  
 */
function playShiftAnimation(animationToPlay){

    if(animationToPlay === "die"){
        player.animations.play("die");
        return;
    }

    if(player.shiftState === false){
        player.animations.play( animationToPlay + '_B' );       // Blue State
    }else{
        player.animations.play( animationToPlay + '_R' );       // Red State
    }

    return;
}

/**
 *  updateFacing
 *      update the player's sprite's facing position
 */
function updateFacing(facingFlag){

    if(player.facing === facingFlag){
        // player is already facing the same direction
    }else{
        player.scale.x *= -1;
        player.facing  =  facingFlag;   
    }

    return;
}