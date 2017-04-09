/**
 * This object contains various functions that affect the game or objects in it, except the player.
 */
var GameUtils = {
    
    /**
     * Set the anchor points of an array of objects to their centers.
     */
    setAnchorToCenter: function(objects) {
        objects.forEach(function(object) {
            object.anchor.set(0.5);
        });
    },

    makeScreenTitle: function(screenName) {
        // Text that will indicate which screen the player is seeing
        game.add.text(0, 0, screenName, {fill: 'white'});
    },

    makeBackButton: function(lastState) {
        var buttonX = 75, buttonY = 75;
        // Back button at the top left corner that will take the player to the previous game state
        var back_button = game.add.button(buttonX, buttonY, 'smallButton',
            function() {game.state.start(lastState)}
        );
        var back_text = game.add.text(buttonX, buttonY, 'Back', {fill: 'white'});
        this.setAnchorToCenter([back_button, back_text]);
    },

    makeHelpButton: function() {
        var buttonX, buttonY;
        var pause_button = game.add.button(buttonX, buttonY, 'helpButton',
            function() {game.state.start(helpScreen)}
        );
    },

    makePauseMenu: function() {
        var resume_button;
        var quit_button;
    },

    changeKey: function(keyToChange) {},

    getKeyMapping: function(key) {
        return "hello";
    },
        
    buildKeys: function() {
        game.input.keyboard.addKey(Phaser.Keyboard.SHIFT);           // shift ability
        game.input.keyboard.addKey(Phaser.Keyboard.Z);                                               // Shoot Button
        game.input.keyboard.addKey(Phaser.Keyboard.X);                                               // Jump  Button
        game.input.keyboard.addKey(Phaser.Keyboard.LEFT);                                            // Walk  Left
        game.input.keyboard.addKey(Phaser.Keyboard.RIGHT);                                           // Walk  Right
        game.input.keyboard.addKey(Phaser.Keyboard.ESC);
    },

    getSetting: function(setting) {
        return "YES";
    },

    toggleSetting: function(setting) {
        if(setting == "YES")
            return "NO";
        else
            return "YES";
    },
    /**
     *  pauseGame
     *      Pauses the game when ever the 
     *      ESC key is pressed. Pressing
     *      the key again unpause the game.
     */
    pauseGame: function() {
        // NEED TO SHOW A PAUSE MENU WHERE YOU CAN GO BACK TO THE MAIN MAIN
        if(game.paused === true){
            game.paused = false;
        } else {
            game.paused = true;
        }
    }

}