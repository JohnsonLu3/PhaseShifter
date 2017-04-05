/**
 * The game state for the splash screen.
 * This is called upon game start by prototype.js
 */

// Declare the splashState object
var splashState = function () {};

splashState.prototype = {
    // Functions that load necessary assets
    loadImages: function () {},
    loadBGM: function () {},
    loadSFX: function () {},
    loadFonts: function () {},

    // Called before preload and create
    init: function () {

    },
    // Called before create
    preload: function () {

    },
    // Called at state start
    create: function () {

        this.loadImages();
        this.loadBGM();
        this.loadSFX();
        this.loadFonts();
    }
}
