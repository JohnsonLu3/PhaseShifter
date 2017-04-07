/**
 * This object contains all the callback functions for the various buttons.
 */

var ButtonHandlers = {
    
    playButtonHandler: function() {
        game.state.start('levelSelect_state');
    },

    settingsButtonHandler: function() {
        game.state.start('settings_state');
    },

    controlsButtonHandler: function() {
        game.state.start('controls_state');
    },
    
    /**
     * Handler for the levels screen buttons.
     * Loads the level, then starts it.
     */
    levelHandler: function(levelNumber) {
        game.state.start('level_' + levelNumber + '_state');
    }
};