/**
 * The game state object for the game win screen.
 * This is called when the player fulfills the win condition of a level.
 */
var GameWinState = function() {};
GameWinState.prototype = {
    textProp: {
        font: '30px Arial',
        fill: 'white'
    },

    init: function() {},

    preload: function() {
        this.win_text = game.make.text(game.world.centerX, 200, "A winner is you!", this.textProp);
        this.thanks_text = game.make.text(game.world.centerX, 250, "Thank you for playing", this.textProp);
        this.yayButton_text = game.make.text(game.world.centerX, 350, "Yay!", this.textProp);
        this.yayButton = game.make.button(game.world.centerX, 350, 'largeButton', function() {
            music.stop();
            game.state.start('mainMenu_state');
        }, this);

        GameUtils.setAnchorToCenter([this.win_text, this.thanks_text, this.yayButton, this.yayButton_text]);
    },

    create: function() {
        GameUtils.makeMenuFrame();
        GameUtils.makeScreenTitle('Game Win');

        game.add.existing(this.win_text);
        game.add.existing(this.thanks_text);
        game.add.existing(this.yayButton);
        game.add.existing(this.yayButton_text);
        
    }
};