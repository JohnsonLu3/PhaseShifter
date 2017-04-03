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

    layer = map.createLayer('mapdata');
    // create player
    player = new Player();
    //game.camera.follow(player);
}

function update() {
    //game.physics.arcade.collide(player, layer);
}