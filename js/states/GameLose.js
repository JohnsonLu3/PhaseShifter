/**
 * The game state object for the game lose screen.
 * This is called when the player fulfills the lose conditions of a level.
 */
var GameLoseState = {
    currentLevelID: '',
    textProp : {
        fill: 'white',
        boundsAlignH: 'center',
        boundsAlignV: 'center'
    },

    init: function() {},

    preload: function() {
        this.lose_text = game.make.text(game.world.centerX, 200, "Oh no, you have lost.\nTry again?", this.textProp);
        this.lose_text.anchor.setTo(0.5);
        this.makeRetryButtons();
    },

    create: function() {
        GameUtils.makeMenuFrame();
        //GameUtils.makeBackButton('mainMenu_state');
        GameUtils.makeScreenTitle('Game Lose');
        game.add.existing(this.lose_text);
        this.addRetryButtons();
    },

    setCurrentLevel: function(level) {
        this.currentLevelID = 'level_' + level + '_state';
    },

    makeRetryButtons: function() {
        var yesX = game.world.centerX, yesY = 360;
        var noX = game.world.centerX, noY = 500;
        this.retryButtonYes =     game.make.button(yesX, yesY, 'largeButton', function() {
            music.stop();
            game.state.start(this.currentLevelID);
        }, this);
        this.retryButtonYesText = game.make.text(yesX, yesY, "YES!", this.textProp);
        this.retryButtonNo =      game.make.button(noX, noY, 'largeButton', function() {
            music.stop();
            game.state.start('mainMenu_state');
        }, this);
        this.retryButtonNoText =  game.make.text(noX, noY, "No...", this.textProp);

        GameUtils.setAnchorToCenter([this.retryButtonYes, this.retryButtonYesText,
                                     this.retryButtonNo, this.retryButtonNoText]);
    },

    addRetryButtons: function() {
        game.add.existing(this.retryButtonYes);
        game.add.existing(this.retryButtonYesText);
        game.add.existing(this.retryButtonNo);
        game.add.existing(this.retryButtonNoText);
    }

};