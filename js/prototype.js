/**
 * This is the JS file that is imported into the HTML document. 
 */
// Dimensions of the game screen. 
var gameW = 1140, gameH = 640;

// Create the Phaser Game object.
var game = new Phaser.Game(gameW, gameH, Phaser.AUTO, 'game');

// A global timer, this is used in order to keep track of things such as intervals for enemy phase changes.
var globalTimer = 0;

// This is the music object. We will need to change this variable when we switch levels.
var music;

// These are the flags for the music and sounds
var musicFlag;
var soundFlag;

// Declare the Main object
var Main = function() {};

// Define the functions required by Phaser
Main.prototype = {
    preload: function() {
        // Load the JS file for the splash screen
        game.load.script('splash_script', 'js/states/Splash.js');

        // Load splash screen assets
        game.load.image('splashScreenBackground', 'assets/splash_screen.png', 1140, 640);
        game.load.image('loadingBar', 'assets/loading.png', 387, 23);

        this.loadUtils();
    },

    create: function() {
        // Add splashState as a game state
        game.state.add('splash_state', SplashState);
        // Start the splashState state
        game.state.start('splash_state');
    },

    // Loads all the files in ../js/lib/
    loadUtils: function() {
        game.load.script('playerUtils_script', 'js/lib/PlayerUtils.js');
        game.load.script('gameUtils_script', 'js/lib/GameUtils.js');
        game.load.script('enemyUtils_script', 'js/lib/EnemyUtils.js');
        game.load.script('functions_script', 'js/lib/functions.js');
        game.load.script('buttonHandlers_script', 'js/lib/ButtonHandlers.js');
        game.load.script('controlKeys_script', 'js/lib/ControlKeys.js');
        game.load.script('spriteFactory_script', 'js/lib/SpriteFactory.js');
    }
}


// Add the Main object to the game as a state.
game.state.add('Main', Main);
// Start the Main state
game.state.start('Main');