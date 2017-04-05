/**
 * The game state for the splash screen.
 * This is called upon game start by prototype.js
 */

// Declare the splashState object
var SplashState = function () {};

SplashState.prototype = {
    // Functions that load necessary assets
    loadImages: function () {},
    loadBGM: function () {},
    loadSFX: function () {},
    loadFonts: function () {},

    // Called before preload and create
    init: function () {},
    // Called before create
    preload: function () {
        // Load menu files
        game.load.script('mainMenu_script', 'js/states/MainMenu.js');
        game.load.script('controls_script', 'js/states/Controls.js');
        game.load.script('levelSelect_script', 'js/states/LevelSelect.js');
        game.load.script('gameWin_script', 'js/states/GameWin.js');
        game.load.script('gameLose_script', 'js/states/GameLose.js');
    },
    // Called at state start
    create: function () {

        // Load assets
        this.loadImages();
        this.loadBGM();
        this.loadSFX();
        this.loadFonts();
        
        //game.state.add('levelSelect_state', LevelSelectState);
        //game.state.start('levelSelect_state');

        
        // Add MainMenuState as a game state
        game.state.add('mainMenu_state', MainMenuState);
        // Start the MainMenuState state
        game.state.start('mainMenu_state');
        
    }
};
