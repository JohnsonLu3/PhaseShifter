/**
 * The game state object for the level select screen.
 * This is called when the user clicks on the play button in the main menu screen.
 */
var LevelSelectState = function() {};
LevelSelectState.prototype = {
    init: function() {},
    preload: function() {
        // Load levels
        game.load.script('level_1_script', 'js/states/levels/Level_1.js');
    },
    create: function() {
        // Add the Level_1 state
        game.state.add('level_1_state', Level_1);
        // Start the level for now
        game.state.start('level_1_state');
    }
};