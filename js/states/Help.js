/**
 * The game state for the help screen.
 * This is called the level states when the user clicks on the help button.
 */
var HelpState = function() {};

HelpState.prototype = {
    init: function() {
        textProp = {
            fontSize: 14,
            fill: 'white'
        };
        this.col1 = 30;
        this.col2 = 560;
        devBio1 = 'Most stickers on laptop';
        devBio2 = 'Only has one sticker on laptop';
        devBio3 = 'Stickerless';
        energyText = 'This is energy. It is the lifeblood of all robots. Taking damage causes you to lose energy, and losing all of it causes Phaser to shut down. Don\'t let that happen!'; 
        phasingText = 'Many objects in this world have one of two phases, represented by the colors red and blue. Phaser will interact with objects that he shares colors with.';
        playerText = 'This is Phaser. He\'s a robot who kicks evil robot butt.';
        enemyText = 'This is a turret. It\'s the most basic of enemies you will face as Phaser.';

        this.greeting_label = game.make.text(game.world.centerX, 20, 'Hello!');
        this.devHeader_label = game.make.text(game.world.centerX, 600, 'Developers:\nJohnson Lu: ' + devBio1 + 
                                                                   '\nJohn Benedict Vera: ' + devBio2 + 
                                                                   '\nJonathan Yin: ' + devBio3, textProp);
        this.player_label = game.make.text(this.col1, 200, playerText, textProp);
        this.energy_label = game.make.text(this.col1, 300, energyText, textProp);
        this.phasing_label = game.make.text(this.col1, 400, phasingText, textProp);
        this.enemy_label = game.make.text(this.col1, 500, enemyText, textProp);
        GameUtils.setAnchorToCenter([this.devHeader_label]);
    },
    preload: function() {
        game.add.existing(this.greeting_label);
        game.add.existing(this.devHeader_label);
        game.add.existing(this.player_label);
        game.add.existing(this.energy_label);
        game.add.existing(this.phasing_label);
        game.add.existing(this.enemy_label);

        game.load.spritesheet('player', "assets/phaser.png", 32,32);
        game.load.spritesheet('bullet', "assets/bullets.png", 16,16);
        game.load.spritesheet('heart', "assets/battery_32x32.png", 32, 32);
        game.load.image('platform', "assets/platform.png", 64, 16);
        game.load.spritesheet('turret', "assets/turret.png", 32, 32);
        
    },
    create: function() {
        GameUtils.makeScreenTitle('Help');
        GameUtils.makeBackButton('mainMenu_state');
        game.add.sprite(this.col1, 150, 'player').scale.setTo(1.5);
        game.add.sprite(this.col1, 250, 'heart').scale.setTo(1.5);
        game.add.sprite(this.col1, 350, 'platform').scale.setTo(1.5);
        game.add.sprite(this.col1, 450, 'turret').scale.setTo(1.5);
    }
}