
/**
 * The game state object for the level select screen.
 * This is called when the user clicks on the play button in the main menu screen.
 */
var LevelSelectState = function() {};
LevelSelectState.prototype = {
    preload: function() {
        // Load level files
        this.loadLevelScript(1);
        this.loadLevelScript(2);
        this.loadLevelScript(3);
        this.loadLevelScript(4);
        
        // Load menu button
        game.load.image('menu', 'assets/buttons/smallButton_150x60.png', 150, 60);
    },

    create: function() {
        GameUtils.makeScreenTitle('Level Select');
        GameUtils.makeBackButton('mainMenu_state');

        // This object contains the properties of the button text
        this.buttonTextProp = {
            fill: 'white'
        };

        this.addLevelStates();
        this.makeButtons();
        this.addButtons();

        // Create the pause menu so that it can be shown in game
        GameUtils.makePauseMenu();
        GameUtils.makeCheatText();
    },
    
    // Manually make buttons for now
    makeButtons: function() {
        this.level_1_button = game.make.button(game.world.centerX, 200, 'largeButton', 
            function() {game.state.start('level_1_state')}
        );
        this.level_1_text = game.make.text(game.world.centerX, 200, 'Level 1', this.buttonTextProp);
        
        this.level_2_button = game.make.button(game.world.centerX, 300, 'largeButton',
            function() {game.state.start('level_2_state')}
        );
        this.level_2_text = game.make.text(game.world.centerX, 300, 'Level 2', this.buttonTextProp);

        this.level_3_button = game.make.button(game.world.centerX, 400, 'largeButton', 
            function() {game.state.start('level_3_state')}
        );
        this.level_3_text = game.make.text(game.world.centerX, 400, 'Level 3', this.buttonTextProp);

        this.level_4_button = game.make.button(game.world.centerX, 500, 'largeButton',
            function() {game.state.start('level_4_state')}
        );
        this.level_4_text = game.make.text(game.world.centerX, 500, 'Level 4', this.buttonTextProp);

        // Center the game objects
        GameUtils.setAnchorToCenter([this.level_1_button, this.level_1_text,
                                     this.level_2_button, this.level_2_text, 
                                     this.level_3_button, this.level_3_text,
                                     this.level_4_button, this.level_4_text]);
    },

    // Add buttons to screen
    addButtons: function() {
        game.add.existing(this.level_1_button);
        game.add.existing(this.level_1_text);
        
        game.add.existing(this.level_2_button);
        game.add.existing(this.level_2_text);

        game.add.existing(this.level_3_button);
        game.add.existing(this.level_3_text);

        game.add.existing(this.level_4_button);
        game.add.existing(this.level_4_text);
        
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
        game.state.add('level_2_state', Level_2);
        game.state.add('level_3_state', Level_3);
        game.state.add('level_4_state', Level_4);
    }

};