/**
 * This object contains all the key mappings for the game controls.
 */
var ControlKeys = {
    
    // Primary controls
    'leftKey':          game.input.keyboard.addKey(Phaser.Keyboard.A),
    'rightKey':         game.input.keyboard.addKey(Phaser.Keyboard.D),
    'phaseShiftKey':    game.input.keyboard.addKey(Phaser.Keyboard.SHIFT),
    'jumpKey':          game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
    'shootKey':         game.input.keyboard.addKey(Phaser.Keyboard.CONTROL),
    'pauseKey':         game.input.keyboard.addKey(Phaser.Keyboard.ESC),

    // Secondary controls
    'leftKey2':          game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
    'rightKey2':         game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
    'jumpKey2':          game.input.keyboard.addKey(Phaser.Keyboard.X),
    'shootKey2':         game.input.keyboard.addKey(Phaser.Keyboard.Z),
    
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
    },

    /**
     * This function initializes the keys whose callback functions must only be called once.
     */
    setControls: function(player) {
        this.invincibilityKey.onDown.add(function() {GameUtils.handleInvulnerability(player)}, this);
        this.phaseShiftKey.onDown.add(function() {PlayerUtils.phaseShift(player)}, this);
        this.pauseKey.onDown.add(GameUtils.pauseGame, this);

        // Add listener for menubutton press
        game.input.onDown.add(GameUtils.pauseMenuHandler, self);
    }
    
};