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
        // Load all the JS files
        game.load.script('level_1_script', 'js/states/levels/Level_1.js');
    },
    create: function() {
        // Add level_1 as a game state
        game.state.add('level_1_state', level_1);
        // Start the level_1 state
        game.state.start('level_1_state');
    }
}

// Add the Main object to the game as a state.
game.state.add('Main', Main);
// Start the Main state
game.state.start('Main');