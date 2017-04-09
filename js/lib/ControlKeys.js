/**
 * This object contains all the key mappings for the game controls.
 */
var ControlKeys = {
    
    'leftKey':          game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
    'rightKey':         game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
    'phaseShiftKey':    game.input.keyboard.addKey(Phaser.Keyboard.SHIFT),
    'jumpKey':          game.input.keyboard.addKey(Phaser.Keyboard.X),
    'shootKey':         game.input.keyboard.addKey(Phaser.Keyboard.Z),
    'pauseKey':         game.input.keyboard.addKey(Phaser.Keyboard.ESC),

    changeKey: function(keyToChange, newKeyCode) {
        this[keyToChange] = game.input.keyboard.addKey(newKeyCode);
    },

    getKeyMapping: function(key) {
        var keyValue = this[key].keyCode;
        for(var k in Phaser.KeyCode) {
            var check = Phaser.KeyCode[k];
            if(check == keyValue)
                return k;
        }
        return;
    }
};