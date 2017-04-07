/**
 * The game state for the help screen.
 * This is called the level states when the user clicks on the help button.
 */
var HelpState = function() {};

HelpState.prototype = {
    init: function() {},
    preload: function() {},
    create: function() {
        GameUtils.makeScreenTitle('Help');
    }
}