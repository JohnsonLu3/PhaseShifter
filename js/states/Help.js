/**
 * The game state for the help screen.
 * This is called the level states when the user clicks on the help button.
 */
var HelpState = function() {};

HelpState.prototype = {
    init: function() {
        textProp = {
            fontSize: 14,
            fill: 'white',
            wordWrap: true,
            wordWrapWidth: 570
        };
        this.col1 = 270;
        this.col2 = 330;
        this.textBound = 900;
        devBio1 = 'Most stickers on laptop';
        devBio2 = 'Only has one sticker on laptop';
        devBio3 = 'Stickerless';
        energyText = 'This is energy. It is the lifeblood of all robots. Taking damage causes you to lose energy, and losing all of it causes Phaser to shut down. Don\'t let that happen!'; 
        phasingText = 'Many objects in this world have one of two phases, represented by the colors red and blue. Phaser will interact with objects that he shares colors with.';
        playerText = 'This is Phaser. He\'s a robot who kicks evil robot butt.';
        enemyText = 'This is a turret. It\'s the most basic of enemies you will face as Phaser.';

        this.devHeader_label = game.make.text(this.col1, 450, 'Developers:\nJohnson Lu: ' + devBio1 + 
                                                                   '\nJohn Benedict Vera: ' + devBio2 + 
                                                                   '\nJonathan Yin: ' + devBio3, {fontSize: 14, fill: 'white'});
        
        this.player_label = game.make.text(this.col2, 60, playerText, textProp);
        //this.player_label.setTextBounds(this.col2, 60, this.textBound, 100);
        this.energy_label = game.make.text(this.col2, 150, energyText, textProp);
        //this.energy_label.setTextBounds(this.col2, 120, this.textBound, 160);
        this.phasing_label = game.make.text(this.col2, 250, phasingText, textProp);
        //this.phasing_label.setTextBounds(this.col2, 180, this.textBound, 240);
        this.enemy_label = game.make.text(this.col2, 360, enemyText, textProp);
        //this.enemy_label.setTextBounds(this.col2, 260, this.textBound, 320);
    },
    preload: function() {

        game.load.spritesheet('player', "assets/phaser.png", 64, 64);
        game.load.spritesheet('bullet', "assets/bullets.png", 16, 16);
        game.load.spritesheet('heart', "assets/battery_32x32.png", 32, 32);
        game.load.spritesheet('platform', "assets/platform.png", 64, 32);
        game.load.spritesheet('turret', "assets/turret.png", 64, 64);
        
    },
    create: function() {
        GameUtils.makeWideMenuFrame();
        GameUtils.makeScreenTitle('Help');
        GameUtils.makeBackButton('mainMenu_state');
        game.add.sprite(this.col1, 60, 'player').anchor.setTo(0.5);
        game.add.sprite(this.col1, 160, 'heart').anchor.setTo(0.5);
        game.add.sprite(this.col1, 245, 'platform', 0).anchor.setTo(0.5);
        game.add.sprite(this.col1, 275, 'platform', 1).anchor.setTo(0.5);
        game.add.sprite(this.col1, 360, 'turret', 21).anchor.setTo(0.5);
        
        game.add.existing(this.devHeader_label);
        game.add.existing(this.player_label);
        game.add.existing(this.energy_label);
        game.add.existing(this.phasing_label);
        game.add.existing(this.enemy_label);
    }
}