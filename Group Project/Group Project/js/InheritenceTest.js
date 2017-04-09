var game;

function initialize()
{
    game = new Phaser.Game(800,600, PHASER.AUTO, '', ({preload : preload, create : create, update : update}));
}

//Define subclasses of phaser's sprite class.
function Player(game,x,y,key,frame)
{
    Phaser.Sprite.call(this,game,x,y,key,frame);
    this.hp = hp;
}
Player.prototype = Object.create(Phaser.Sprite);
Player.prototype.constructor = Player;



function preload() {
    //CENTERS THE GAME. 
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('enemy', 'assets/baddie.png', 32 ,32);

}
function create()
{

}

function update()
{

}