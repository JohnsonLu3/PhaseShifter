function Player(){
    // The player and its settings
    player = game.add.sprite(32, game.world.height - 300, 'player');

    player.health = 100;         
    player.shiftState = false;       // Player shiftState    0 = Blue    1 = Red
    player.facing = 1;              // Player facing        0 = left    1 = Right
    player.anchor.setTo(.5,.5);

    //  We need to enable physics on the player
    game.physics.arcade.enable(player);
    //  Adjust the player hit box
    player.body.setSize(14, 24, 8, 6);

    //  Player physics properties. Give the little guy a slight bounce.
    player.body.gravity.y = 350;
    player.body.collideWorldBounds = true;

    
    // Idle
    player.animations.add('idle_B', [0, 1, 2, 3, 4, 5, 6], 10, true);
    player.animations.add('idle_R', [7, 8, 9, 10, 11, 12, 13], 10, true);

    // Walk
    player.animations.add('walk_B', [14, 15, 16, 17, 18, 19, 20], 10, false);
    player.animations.add('walk_R', [21, 22, 23, 24, 25, 26, 27], 10, false);

    // Jump
    player.animations.add('jump_B', [28, 29, 30, 31, 32, 33, 34], 10, false);
    player.animations.add('jump_R', [35, 36, 37, 38, 39, 40, 41], 10, false);

    // Die
    player.animations.add('die', [42, 43, 44, 45, 46, 47, 48], 10, false);

    return player;
}