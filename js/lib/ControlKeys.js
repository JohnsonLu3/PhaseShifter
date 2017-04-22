/**
 * This object contains all the key mappings for the game controls.
 */
var ControlKeys = {
    
    'leftKey':          game.input.keyboard.addKey(Phaser.Keyboard.A),
    'rightKey':         game.input.keyboard.addKey(Phaser.Keyboard.D),
    'leftKey2':          game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
    'rightKey2':         game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
    'phaseShiftKey':    game.input.keyboard.addKey(Phaser.Keyboard.SHIFT),
    'jumpKey':          game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
    'jumpKey2':          game.input.keyboard.addKey(Phaser.Keyboard.X),
    'shootKey':         game.input.keyboard.addKey(Phaser.Keyboard.CONTROL),
    'shootKey2':         game.input.keyboard.addKey(Phaser.Keyboard.Z),
    'pauseKey':         game.input.keyboard.addKey(Phaser.Keyboard.ESC),
    
    // Cheat keys
    'oneKey':           game.input.keyboard.addKey(Phaser.Keyboard.ONE),
    'twoKey':           game.input.keyboard.addKey(Phaser.Keyboard.TWO),
    'threeKey':         game.input.keyboard.addKey(Phaser.Keyboard.THREE),
    'invincibilityKey': game.input.keyboard.addKey(Phaser.Keyboard.I),

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