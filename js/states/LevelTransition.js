/**
 * This is the game state for the transition between levels.
 */
var LevelTransitionState = {
    
    // This is the next level's ID
    nextLevel: '',
    nextLevelID: '',

    /**
     * This object contains the styling for the text in this screen
     */
    textProp: {
        fill: 'white',
    },


    init: function() {},

    preload: function() {
        this.makeLabels();
        this.makeNextButton();
    },

    create: function() {
        GameUtils.makeMenuFrame();
        GameUtils.makeScreenTitle('Level Transition');
        GameUtils.makeBackButton('mainMenu_state')

        this.addLabelsAndButtons();
    },

    /**
     * This function creates the ID for the next level.
     * Note: This function MUST be called before starting this game state.
     */
    setNextLevel: function(nextLevel) {
        this.nextLevel = nextLevel;
        this.nextLevelID = 'level_' + nextLevel + '_state';
    },

    /**
     * This function creates the labels to display on the screen
     */
    makeLabels: function() {
            this.congratulations_label = game.make.text(game.world.centerX, 200, 'Level Complete!', this.textProp);
            this.nextLevel_label =       game.make.text(game.world.centerX, 250, 'Next Level:', this.textProp);
            this.nextLevelButton_label = game.make.text(game.world.centerX, game.world.centerY, 'Level ' + this.nextLevel, this.textProp);
            GameUtils.setAnchorToCenter([this.congratulations_label, this.nextLevel_label, this.nextLevelButton_label]);
    },

    /**
     * This function creates buttons for the next level
     */
    makeNextButton: function() {
        this.nextLevel_button = game.make.button(game.world.centerX, game.world.centerY, 'smallButton', function() {
            music.stop();
            game.state.start(this.nextLevelID);
        }, this);
        this.nextLevel_button.anchor.setTo(0.5);
    },

     /**
     * This function adds the labels and buttons to the game screen
     */
    addLabelsAndButtons: function() {
        game.add.existing(this.congratulations_label);
        game.add.existing(this.nextLevel_label);
        game.add.existing(this.nextLevel_button);
        game.add.existing(this.nextLevelButton_label);
    },
}