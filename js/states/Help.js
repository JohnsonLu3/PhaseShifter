/**
 * The game state for the help screen.
 * This is called the level states when the user clicks on the help button.
 */
var HelpState = function() {};

HelpState.prototype = {
    init: function() {
        this.devBio1 = '';
        this.devBio2 = '';
        this.devBio3 = '';
        this.playerBio = '';
        this.enemyBio = '';
        this.storyBio = '';
    },
    preload: function() {},
    create: function() {
        GameUtils.makeScreenTitle('Help');
    }
}