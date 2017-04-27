/**
 * The game state for the controls screen.
 * This is called by MainMenuState when the player clicks on the controls button.
 */
var ControlsState = function() {};
ControlsState.prototype = {
    init: function() {},

    preload: function() {
        this.textProp = {fill: 'white', font: '24px Arial'};
        this.col1_label = 300, this.col2_label = 700;
        this.col1_button = 480, this.col2_button = 860;
        this.row1 = 200, this.row2 = 300, this.row3 = 400;
        this.makeLabels();
        this.makeButtons();
        this.addLabelsAndButtons();
    },

    create: function() {
        GameUtils.makeScreenTitle('Controls');
        GameUtils.makeBackButton('mainMenu_state');
        this.lastKey = undefined;
        this.keyToChange = undefined;
        this.labelToChange = undefined;
        this.isChanging = false;
    },

    makeLabels: function() {
        // Labels for the controls
        this.left_label =        game.make.text(this.col1_label, this.row1, 'Move Left', this.textProp);
        this.right_label =       game.make.text(this.col1_label, this.row2, 'Move Right', this.textProp);
        this.phaseShift_label =  game.make.text(this.col1_label, this.row3, 'Phase Shift', this.textProp);
        this.jump_label =        game.make.text(this.col2_label, this.row1, 'Jump', this.textProp);
        this.shoot_label =       game.make.text(this.col2_label, this.row2, 'Shoot', this.textProp);
        GameUtils.setAnchorToCenter([this.left_label, this.right_label, this.phaseShift_label, this.jump_label, this.shoot_label]);

        // Labels for the buttons
        this.leftButton_label =         game.make.text(this.col1_button, this.row1, ControlKeys.getKeyMapping('leftKey2'), this.textProp);
        this.rightButton_label =        game.make.text(this.col1_button, this.row2, ControlKeys.getKeyMapping('rightKey2'), this.textProp);
        this.phaseShiftButton_label =   game.make.text(this.col1_button, this.row3, ControlKeys.getKeyMapping('phaseShiftKey'), this.textProp);
        this.jumpButton_label =         game.make.text(this.col2_button, this.row1, ControlKeys.getKeyMapping('jumpKey2'), this.textProp);
        this.shootButton_label =        game.make.text(this.col2_button, this.row2, ControlKeys.getKeyMapping('shootKey2'), this.textProp);
        GameUtils.setAnchorToCenter([this.leftButton_label, this.rightButton_label, this.phaseShiftButton_label, this.jumpButton_label, this.shootButton_label]);

        // Label for a hint
        this.hint_label = game.make.text(game.world.centerX, 500, 'Hint: Use your left hand to control movement and your right hand to shoot and phase shift', this.textProp);
        GameUtils.setAnchorToCenter([this.hint_label]);
    },

    makeButtons: function() {
        this.left_button =          game.make.button(this.col1_button, this.row1, 'smallButton', function() {this.handleButton('leftKey', this.leftButton_label)}, this);
        this.right_button =         game.make.button(this.col1_button, this.row2, 'smallButton', function() {this.handleButton('rightKey', this.rightButton_label)}, this);
        this.phaseShift_button =    game.make.button(this.col1_button, this.row3, 'smallButton', function() {this.handleButton('phaseShiftKey', this.phaseShiftButton_label)}, this);
        this.jump_button =          game.make.button(this.col2_button, this.row1, 'smallButton', function() {this.handleButton('jumpKey', this.jumpButton_label)}, this);
        this.shoot_button =         game.make.button(this.col2_button, this.row2, 'smallButton', function() {this.handleButton('shootKey', this.shootButton_label)}, this);
        GameUtils.setAnchorToCenter([this.left_button, this.right_button, this.phaseShift_button, this.jump_button, this.shoot_button]);
    },

    addLabelsAndButtons: function() {
        // Add labels
        game.add.existing(this.left_label);
        game.add.existing(this.right_label);
        game.add.existing(this.phaseShift_label);
        game.add.existing(this.jump_label);
        game.add.existing(this.shoot_label);
        // Add buttons
        game.add.existing(this.left_button);
        game.add.existing(this.right_button);
        game.add.existing(this.phaseShift_button);
        game.add.existing(this.jump_button);
        game.add.existing(this.shoot_button);
        // Add button labels
        game.add.existing(this.leftButton_label);
        game.add.existing(this.rightButton_label);
        game.add.existing(this.phaseShiftButton_label);
        game.add.existing(this.jumpButton_label);
        game.add.existing(this.shootButton_label);
        // Add hint label
        game.add.existing(this.hint_label);
    }
}