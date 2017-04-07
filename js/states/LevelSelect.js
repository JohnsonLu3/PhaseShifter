/**
 * The game state object for the level select screen.
 * This is called when the user clicks on the play button in the main menu screen.
 */
var LevelSelectState = function() {};
LevelSelectState.prototype = {
    init: function() {},
    preload: function() {
        // Load level files
        this.loadLevelScript(1);
    },

    create: function() {
        GameUtils.makeScreenTitle('Level Select');
        
        this.addLevelStates();
        this.makeButtons();
        this.addButtons();
    },
    
    // Manually make buttons for now
    makeButtons: function() {
        this.level_1_button = game.make.button(game.world.centerX, 300, 'largeButton', 
        //ButtonHandlers.levelHandler(1)
        function() {game.state.start('level_1_state')}
        );
        this.level_1_text = game.make.text(game.world.centerX, 300, 'Level 1', {fill: 'white'});

        GameUtils.setAnchorToCenter([this.level_1_button, this.level_1_text]);
    },

    // Add buttons to screen
    addButtons: function() {
        game.add.existing(this.level_1_button);
        game.add.existing(this.level_1_text);
    },
    
    // Load the file of levelNumber
    loadLevelScript: function(levelNumber) {
        var scriptString = 'level_' + levelNumber + '_script';
        var dirString = 'js/states/levels/Level_' + levelNumber + '.js';
        game.load.script(scriptString, dirString);
    },

    // NOTE: There must be a way to refer to a callback function with a String.
    // For now, we'll manually load every game state.
    addLevelStates: function() {
        game.state.add('level_1_state', Level_1);
    }
};