/**
 * The game state for the main menu.
 * This is called by SplashState automatically after the assets have loaded.
 */
var MainMenuState = function() {};
MainMenuState.prototype = {
    init: function() {

    },
    preload: function() {

    },
    create: function() {
        // Add the level select and controls screens to the game states
        game.state.add('levelSelect_state', LevelSelectState);
        game.state.add('controls_state', ControlsState);

        // Start the level select state for now
        game.state.start('levelSelect_state');
    }
};