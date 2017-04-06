/**
 * The game state for the splash screen.
 * This is called upon game start by prototype.js
 */

// Declare the splashState object
var SplashState = function () {};

SplashState.prototype = {
    // Functions that load necessary assets
    loadImages: function () {
        game.load.image('playButton', 'assets/buttons/playbutton.png', 250, 100);
        game.load.image('controlsButton', 'assets/buttons/controlbutton.png', 150, 60);
        game.load.image('helpButton', 'assets/buttons/QuestionBlock_32x32.png', 32, 32);
        game.load.image('settingsButton', 'assets/buttons/settings.png', 150, 60);
        game.load.image('largeButton', 'assets/buttons/LargeButton_250x100.png', 250, 100);
        game.load.image('smallButton', 'assets/buttons/smallButton_150x60.png', 150, 60);
    },

    loadBGM: function () {},

    loadSFX: function () {},

    loadFonts: function () {},

    loadScripts: function() {
        // Load menu files
        game.load.script('mainMenu_script', 'js/states/MainMenu.js');
        game.load.script('controls_script', 'js/states/Controls.js');
        game.load.script('levelSelect_script', 'js/states/LevelSelect.js');
        game.load.script('gameWin_script', 'js/states/GameWin.js');
        game.load.script('gameLose_script', 'js/states/GameLose.js');
        // Load utility files
        game.load.script('playerUtils_script', 'js/lib/PlayerUtils.js');
        game.load.script('gameUtils_script', 'js/lib/GameUtils.js');
        game.load.script('functions_script', 'js/lib/functions.js');
    },

    // Add menu game states to the game
    addMenuStates: function() {
        game.state.add('mainMenu_state', MainMenuState);
        game.state.add('levelSelect_state', LevelSelectState);
        game.state.add('controls_state', ControlsState);
    },

    // Called before preload and create
    init: function () {
        this.loadingBar = game.make.sprite(game.world.centerX - (387 / 2), 510, 'loadingBar');
        this.gameLogo   = game.make.sprite(game.world.centerX - 250, 0, 'gameLogo');
        this.status     = game.make.text(game.world.centerX, 550, 'Loading', {fill: 'white'});

    },

    // Called before create
    preload: function () {
        game.add.existing(this.gameLogo);
        game.add.existing(this.loadingBar);
        game.add.existing(this.status);
        this.load.setPreloadSprite(this.loadingBar);

        // Load all assets
        this.loadScripts();
        this.loadImages();
        this.loadBGM();
        this.loadSFX();
        this.loadFonts();
    },

    // Called at state start
    create: function () {
        // Add menu game states
        this.addMenuStates();
        this.status.setText('Ready!');
        
        // Wait for 5 seconds so that the user can admire the splash screen
        setTimeout (function() {
            // Start the MainMenuState state
            game.state.start('mainMenu_state');
        }, 5000);
        
    }
};
