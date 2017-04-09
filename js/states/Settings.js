/**
 * The game state object for the settings screen.
 * This is called when the user clicks on the settings button in the main menu screen.
 */
var SettingsState = {
    
    init: function() {

    },

    preload: function() {
        this.col1 = 480;
        this.col2 = 680;
        this.row1 = 200;
        this.row2 = 300;
        this.textProp = {fill:'white'};
        
        this.makeLabels();
        this.makeButtons();
        this.addLabelsAndButtons();
    },

    create: function() {
        GameUtils.makeScreenTitle('Settings');
        GameUtils.makeBackButton('mainMenu_state');
    },
    
    makeLabels: function() {
        this.sound_label = game.make.text(this.col1, this.row1, 'Sounds:', this.textProp);
        this.music_label = game.make.text(this.col1, this.row2, 'Music', this.textProp);
        GameUtils.setAnchorToCenter([this.sound_label, this.music_label]);

        this.soundButton_label = game.make.text(this.col2, this.row1, GameUtils.getSetting('sound'), this.textProp);
        this.musicButton_label = game.make.text(this.col2, this.row2, 'YES', this.textProp);
        GameUtils.setAnchorToCenter([this.soundButton_label, this.musicButton_label]);

        
        this.sound_button = game.make.button(this.col2, this.row1, 'smallButton', this.handleSoundButton);
        this.music_button = game.make.button(this.col2, this.row2, 'smallButton', this.handleMusicButton);
        GameUtils.setAnchorToCenter([this.sound_button, this.music_button]);
    },
    
    makeButtons: function() {
    },
    
    addLabelsAndButtons: function() {
        game.add.existing(this.sound_label);
        game.add.existing(this.music_label);

        game.add.existing(this.sound_button);
        game.add.existing(this.music_button);

        game.add.existing(this.soundButton_label);
        game.add.existing(this.musicButton_label);
    },

    handleSoundButton: function() {
        //var newText = GameUtils.toggleSetting('sound');
        //this.soundButton_label.setText(newText);
    },

    handleMusicButton: function() {
        //var newText = GameUtils.toggleSetting('music');
        //this.musicButton_label.setText('NO');
    }
};