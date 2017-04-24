/**
 * The game state for the splash screen.
 * This is called upon game start by prototype.js
 */

// Declare the splashState object
var SplashState = function () {};

SplashState.prototype = {
    // Functions that load necessary assets
    loadImages: function () {
        game.load.image('playButton', 'assets/buttons/playbutton.png', 250, 100);
        game.load.image('controlsButton', 'assets/buttons/controlbutton.png', 150, 60);
        game.load.image('helpButton', 'assets/buttons/QuestionBlock_32x32.png', 32, 32);
        game.load.image('settingsButton', 'assets/buttons/settings.png', 150, 60);
        game.load.image('largeButton', 'assets/buttons/LargeButton_250x100.png', 250, 100);
        game.load.image('smallButton', 'assets/buttons/smallButton_150x60.png', 150, 60);
    },

    loadBGM: function () {
        game.load.audio('theme', 'assets/bgm/Super Power Cool Dude.mp3');
        game.load.audio('level1', 'assets/bgm/Level Up.mp3');
    },

    loadSFX: function () {
        game.load.audio('phaser_walking', 'assets/sfx/phaser_walking.mp3');
        game.load.audio('shift', 'assets/sfx/shift.mp3');
        game.load.audio('phaser_death', 'assets/sfx/phaser_death.mp3');
        game.load.audio('phaser_damage', 'assets/sfx/phaser_damage.mp3');
        game.load.audio('phaser_attack', 'assets/sfx/phaser_attack.ogg');
        game.load.audio('drone_explode', 'assets/sfx/drone_explode.mp3');
    },

    loadFonts: function () {},

    loadScripts: function() {
        // Load menu files
        game.load.script('mainMenu_script', 'js/states/MainMenu.js');
        game.load.script('controls_script', 'js/states/Controls.js');
        game.load.script('settings_script', 'js/states/Settings.js');
        game.load.script('levelSelect_script', 'js/states/LevelSelect.js');
        game.load.script('gameWin_script', 'js/states/GameWin.js');
        game.load.script('gameLose_script', 'js/states/GameLose.js');
        game.load.script('help_script', 'js/states/Help.js');
    },

    // Add menu game states to the game
    addMenuStates: function() {
        game.state.add('mainMenu_state', MainMenuState);
        game.state.add('levelSelect_state', LevelSelectState);
        game.state.add('controls_state', ControlsState);
        game.state.add('settings_state', SettingsState);
        game.state.add('gameWin_state', GameWinState);
        game.state.add('gameLose_state', GameLoseState);
        game.state.add('help_state', HelpState);
    },

    // Called before preload and create
    init: function () {
        this.loadingBar = game.make.sprite(game.world.centerX - (387 / 2), 510, 'loadingBar');
        this.gameLogo   = game.make.sprite(game.world.centerX, 250, 'gameLogo');
        this.status     = game.make.text(game.world.centerX, 550, 'Loading', {fill: 'white'});
        GameUtils.setAnchorToCenter([this.gameLogo, this.status]);
    },

    // Called before create
    preload: function () {
        // Add assets to the screen
        game.add.existing(this.gameLogo);
        game.add.existing(this.loadingBar);
        game.add.existing(this.status);

        // Set the loading bar to grow as files are loaded
        this.load.setPreloadSprite(this.loadingBar);

        // Change background color
        game.stage.backgroundColor = '#787878';

        // Load all assets
        this.loadScripts();
        this.loadImages();
        this.loadBGM();
        this.loadSFX();
        this.loadFonts();
    },

    // Called at state start
    create: function () {
        // Add menu game states
        this.addMenuStates();
        this.status.setText('Ready!');

        // Wait for a bit so that the user can admire the splash screen
        setTimeout (function() {
            // Start the MainMenuState state
            game.state.start('mainMenu_state');
        }, 1000);
        
        // Make sure the music and sound flags are true
        musicFlag = true;
        soundFlag = true;

        // Make sure to initialize SFX objects!
        PlayerUtils.initSFX();
        EnemyUtils.initSFX();
    }
};
