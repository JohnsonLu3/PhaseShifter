/**
 * This is the JS file that is imported into the HTML document. 
 */
// Dimensions of the game screen. 
var gameW = 1140, gameH = 640;

// Create the Phaser Game object.
var game = new Phaser.Game(gameW, gameH, Phaser.AUTO, 'game');

// Declare the Main object
var Main = function() {};

// Define the functions required by Phaser
Main.prototype = {
    preload: function() {
        // Load the JS file for the splash screen
        game.load.script('splash_script', 'js/states/Splash.js');
        
    },
    create: function() {
        // Add splashState as a game state
        game.state.add('splash_state', SplashState);
        // Start the splashState state
        game.state.start('splash_state');
    }
}

// Add the Main object to the game as a state.
game.state.add('Main', Main);
// Start the Main state
game.state.start('Main');