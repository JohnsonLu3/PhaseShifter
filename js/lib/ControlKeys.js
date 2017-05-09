/**
 * This object contains all the key mappings for the game controls.
 */
var ControlKeys = {
    
    // Primary controls
    'leftKey':          game.input.keyboard.addKey(Phaser.Keyboard.A),
    'rightKey':         game.input.keyboard.addKey(Phaser.Keyboard.D),
    'upKey':            game.input.keyboard.addKey(Phaser.Keyboard.W),
    'downKey':          game.input.keyboard.addKey(Phaser.Keyboard.S),
    'phaseShiftKey':    game.input.keyboard.addKey(Phaser.Keyboard.SHIFT),
    'jumpKey':          game.input.keyboard.addKey(Phaser.Keyboard.SPACEBAR),
    'shootKey':         game.input.keyboard.addKey(Phaser.Keyboard.CONTROL),
    'pauseKey':         game.input.keyboard.addKey(Phaser.Keyboard.ESC),

    // Secondary controls
    'leftKey2':         game.input.keyboard.addKey(Phaser.Keyboard.LEFT),
    'rightKey2':        game.input.keyboard.addKey(Phaser.Keyboard.RIGHT),
    'upKey2':            game.input.keyboard.addKey(Phaser.Keyboard.UP),
    'downKey2':          game.input.keyboard.addKey(Phaser.Keyboard.DOWN),
    'jumpKey2':         game.input.keyboard.addKey(Phaser.Keyboard.X),
    'shootKey2':        game.input.keyboard.addKey(Phaser.Keyboard.Z),
    
    // Cheat keys
    'oneKey':           game.input.keyboard.addKey(Phaser.Keyboard.ONE),
    'twoKey':           game.input.keyboard.addKey(Phaser.Keyboard.TWO),
    'threeKey':         game.input.keyboard.addKey(Phaser.Keyboard.THREE),
    'fourKey':          game.input.keyboard.addKey(Phaser.Keyboard.FOUR),
    'invincibilityKey': game.input.keyboard.addKey(Phaser.Keyboard.I),
    'flyKey':           game.input.keyboard.addKey(Phaser.Keyboard.O),

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
        this.phaseShiftKey.onDown.add(function() {PlayerUtils.phaseShift(player)}, this);
        this.pauseKey.onDown.add(GameUtils.pauseGame, this);
        this.shootKey.onDown.add(function() {player.fire()});
        this.shootKey2.onDown.add(function() {player.fire()});

        // Cheats
        this.invincibilityKey.onDown.add(function() {GameUtils.handleInvulnerability(player)}, this);
        this.flyKey.onDown.add(function() {GameUtils.handleFlying(player), this});

        // Add listener for menubutton press
        game.input.onDown.add(GameUtils.pauseMenuHandler, self);

        // Make sure that the key presses don't propagate up to the browser
        game.input.keyboard.addKeyCapture(Phaser.Keyboard.CONTROL);
        game.input.keyboard.addKeyCapture(Phaser.Keyboard.SHIFT);
        game.input.keyboard.addKeyCapture(Phaser.Keyboard.SPACEBAR);
    }
    
};