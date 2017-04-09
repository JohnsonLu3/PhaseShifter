var game;
var player;
var turret;
var phaseObjects = new Array();
var phasePlatforms = new Array();
var enemyBullets;
var playerBullets;
var enemyHP;
var playerHP;
var globalTimer = 0;
var platforms;
var PINK = 0xff69b4;
var BLUE = 0x0000ff;
var NO_COLOR = 0xFFFFFF;


//Start of the test.

function initialize()
{
    game = new Phaser.Game(800,600, Phaser.AUTO, '', ({preload : preload, create : create, update : update}));
}

function preload() {
    //CENTERS THE GAME. 
    game.scale.pageAlignHorizontally = true;
    game.scale.pageAlignVertically = true;
    game.load.image('sky', 'assets/sky.png');
    game.load.image('ground', 'assets/platform.png');
    game.load.image('star', 'assets/star.png');
    game.load.image('bullet', 'assets/bullets.png')
    game.load.spritesheet('dude', 'assets/dude.png', 32, 48);
    game.load.spritesheet('turret', 'assets/baddie.png', 32 ,32);

}
function create() {
    score = 0;
    game.physics.startSystem(Phaser.Physics.ARCADE);
    game.add.sprite(0,0,'sky');
    //Platforms are a part of a group containing the ground + 2 platforms
    platforms = game.add.group();
    //Enable physics for each body in this group.
    platforms.enableBody = true;
    //Create the ground.
    var ground = platforms.create(0, game.world.height - 64, 'ground');
    //Scale ground to fit bottom of screen.
    ground.scale.setTo(2,2);
    //Ground will not move
    ground.body.immovable = true;
    var ledge = new customSprite(game,400, 400, 'ground', 200);
    //Push to phase objects
    phasePlatforms.push(ledge);
    phaseObjects.push(ledge);
    game.physics.arcade.enable(ledge);
    ledge.body.immovable = true;
    var ledge = new customSprite(game,-150, 250, 'ground', 200);
    //push to phase objects
    phasePlatforms.push(ledge);
    phaseObjects.push(ledge);
    game.physics.arcade.enable(ledge);
    ledge.body.immovable = true;
    //Loads the player character.
    player = new Player(game,32, game.world.height - 150, 'dude', 0, 5);
    playerHP = game.add.text(16,48, "Player'\s health: " + player.health,{ fontSize: '32px', fill: '#000' });
    //Enable physics to this player character.
    game.physics.arcade.enable(player);
    //Physics properties
    player.body.gravity.y = 300;
    player.body.collideWorldBounds = 0.2;
    //Animations
    //Use frames 0,1,2,3 at 10 fps and loop animation
    player.animations.add('left', [0,1,2,3], 10 ,true);
    player.animations.add('right', [5,6,7,8], 10, true);
    player.animations.add('die', [0,4,5,9,0,4,5,9,0,4,5,9,10], 10, false);
    //Lets create a turret enemy!
    turret = new Turret(game,500,game.world.height - 150, player);
    //Set cooldown so it fires more slowly.
    turret.setCooldown(150);
    phaseObjects.push(turret);
    game.physics.arcade.enable(turret);
    turret.body.gravity.y = 300;
    enemyHP = game.add.text(16, 16, 'Turret\'s health: ' + turret.health, { fontSize: '32px', fill: '#000' });
    //Add some bullets to be shot by the turret and the player.
    enemyBullets = game.add.group();
    playerBullets = game.add.group();
    //Enable arcade physics on bullet to allow usage of useful physics engine functions
    enemyBullets.enableBody = true;
    enemyBullets.physicsBodyType = Phaser.Physics.ARCADE;
    playerBullets.enableBody = true;
    playerBullets.physicsBodyType = Phaser.Physics.ARCADE;
    //Create 25 instances of the bullet sprite and put it into enemyBullet group.
    enemyBullets.createMultiple(25, 'bullet');
    //Create up to 10 instances of bullet in the playerBullet group.
    playerBullets.createMultiple(10, 'bullet');
    //This will automatically kill bullets when they reach out of bounds.
    enemyBullets.setAll('checkWorldBounds', true);
    enemyBullets.setAll('outOfBoundsKill', true);
    playerBullets.setAll('checkWorldBounds', true);
    playerBullets.setAll('outOfBoundsKill', true);    

    this.key1 = this.game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR);
    this.key1.onDown.add(function()
    {
        player.changePhase();
    }
    )
    this.key2 = this.game.input.keyboard.addKey(Phaser.Keyboard.Z);
    this.key2.onDown.add(function()
    {
        player.fire();
    }
    )
}

function update()
{
    //Update global timer.
    globalTimer++;
    updatePhases();
    if (player.cooldown > 0)
        player.cooldown--;
    if (turret.cooldown > 0)
        turret.cooldown--;
    var length =  phasePlatforms.length;
    for (var i = 0 ; i <  length; i++)
    {
        checkPlatform = phasePlatforms[i];
        game.physics.arcade.overlap(checkPlatform,enemyBullets, function(plat,bullet)
        {
            bullet.kill();
        },null, this);
        game.physics.arcade.overlap(checkPlatform,playerBullets, function(plat,bullet)
        {
            bullet.kill();
        },null, this);
        if (checkPlatform.phase == player.phase)
            collidePlatform(game,player,phasePlatforms[i]); 
    }
    game.physics.arcade.collide(player, platforms);
    game.physics.arcade.collide(turret, platforms);
    game.physics.arcade.overlap(turret, playerBullets, recieveDamage, null, this);
    game.physics.arcade.overlap(player, enemyBullets, recieveDamageP, null, this);
    game.physics.arcade.overlap(platforms, playerBullets, function(plat,bullet)
        {
            bullet.kill();
        }, null, this);
    game.physics.arcade.overlap(platforms, enemyBullets, function(plat,bullet)
        {
            bullet.kill();
        }, null, this);
    cursors = game.input.keyboard.createCursorKeys();
    //Enable keyboard input
    player.body.velocity.x = 0;
    if (cursors.left.isDown)
        {
        // Move left
            player.body.velocity.x = -player.walkingSpeed;
           player.animations.play('left');
           player.dirRight = false;
     }
    else if (cursors.right.isDown)
    {
        //move right
        player.body.velocity.x = player.walkingSpeed;
        player.animations.play('right');
        player.dirRight = true;
    }
    else
    {
        //Stand Still
        player.animations.stop();
        //Set sprite to look at player
        player.frame = 4;
    }

    // Jumping
    if (cursors.up.isDown && player.body.touching.down)
    {
        player.body.velocity.y = -350;
    }
    globalTimer++;

}

function updatePhases()
{
    for (var i = 0 ; i <phaseObjects.length; i++)
    {
        phaseObjects[i].update();
    }
}

function recieveDamage(turret, bullet)
{
    if (turret.phase == bullet.phase)
    {
        bullet.kill()
        turret.damage(1);
        if (turret.alive)
            enemyHP.text = "Turret\'s Health " + turret.health;
        else
            enemyHP.text = "Turret is dead";
    }
}

function recieveDamageP(player, bullet)
{
    if (player.phase == bullet.phase)
    {
        bullet.kill()
        player.damage(1);
        if (player.alive)
            playerHP.text = "Player\'s Health " + player.health;
        else
            playerHP.text = "Player is dead";
    }
}

