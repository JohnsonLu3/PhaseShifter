/**
 * The game state object for the game win screen.
 * This is called when the player fulfills the win condition of a level.
 */
var GameWinState = function() {};
GameWinState.prototype = {
    init: function() {},
    preload: function() {},
    create: function() {
        GameUtils.makeBackButton('mainMenu_state');
        GameUtils.makeScreenTitle('Game Win');
    }
};