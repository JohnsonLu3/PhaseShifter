
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
        GameUtils.makeMenuFrame();
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
    },
    
    // Manually make buttons for now
    makeButtons: function() {
        var button1x = game.world.centerX, button1y = 114 + 14;
        var button2x = game.world.centerX, button2y = 228 + 14;
        var button3x = game.world.centerX, button3y = 342 + 14;
        var button4x = game.world.centerX, button4y = 456 + 14;
        
        this.level_1_button = game.make.button(button1x, button1y, 'largeButton', 
            function() {game.state.start('level_1_state')}
        );
        this.level_1_text = game.make.text(button1x, button1y, 'Level 1', this.buttonTextProp);
        
        this.level_2_button = game.make.button(button2x, button2y, 'largeButton',
            function() {game.state.start('level_2_state')}
        );
        this.level_2_text = game.make.text(button2x, button2y, 'Level 2', this.buttonTextProp);

        this.level_3_button = game.make.button(button3x, button3y, 'largeButton', 
            function() {game.state.start('level_3_state')}
        );
        this.level_3_text = game.make.text(button3x, button3y, 'Level 3', this.buttonTextProp);

        this.level_4_button = game.make.button(button4x, button4y, 'largeButton',
            function() {game.state.start('level_4_state')}
        );
        this.level_4_text = game.make.text(button4x, button4y, 'Level 4', this.buttonTextProp);

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