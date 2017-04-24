/**
 * The game state for the main menu.
 * This is called by SplashState automatically after the assets have loaded.
 */
var MainMenuState = function() {};
MainMenuState.prototype = {
    /**
     * Called before preload and create.
     * Declare stuff here that are only used once to keep things organized.
     */
    init: function() {
        this.playButton =       game.make.button(game.world.centerX, 300, 'playButton', ButtonHandlers.playButtonHandler);
        this.controlsButton =   game.make.button(game.world.centerX, 640 - 230, 'controlsButton', ButtonHandlers.controlsButtonHandler);
        this.settingsButton =   game.make.button(game.world.centerX, 640 - 130, 'settingsButton', ButtonHandlers.settingsButtonHandler);
        GameUtils.setAnchorToCenter([this.playButton, this.controlsButton, this.settingsButton]);
        this.helpButton = game.make.button(100, 550, 'helpButton', ButtonHandlers.helpButtonHandler);
    },

    // First* function called by Phaser
    preload: function() {
        game.add.existing(this.playButton);
        game.add.existing(this.controlsButton);
        game.add.existing(this.settingsButton);
        game.add.existing(this.helpButton);
    },

    // Called by Phaser when the game state is started
    create: function() {
        GameUtils.makeScreenTitle('Main Menu');

        this.initMusic();
        
    },

    /**
     * This function handles the music for the menus.
     */
    initMusic: function() {
        // Set the music to the theme on first start up and when transitioning from a level
        if (music === undefined || music.key != 'theme') {
            music = game.add.audio('theme');
            music.loop = true;
        }
        // Play music!
        if (musicFlag === true && music.isPlaying === false) {
            // Note that the 3rd parameter is the volume, between 0 and 1.
            // The music is too loud, so we are compensating for that here.
            music.play('', 0, 0.5);
        }
    }
};