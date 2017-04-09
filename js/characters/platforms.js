/**
 * Platform will represent a phase platform, you will only be allowed to stand on these platforms when your phase is equal to the phase of the platform.
 * @param {*} game The game instance for where to add the platform to.
 * @param {*} x X position of the platform.
 * @param {*} y Y position of the platform
 * @param {*} interval The interval of the platform, the amount of frames that must pass before changing phase.
 */
var Platform = function (game, x, y, interval) {
    CustomSprite.call(this, game, x, y, 'platform', interval);
    game.physics.arcade.enable(this);
    this.body.immovable = true;
    this.body.setSize(25, 3, 4, 6);
}

Platform.prototype = Object.create(CustomSprite.prototype);
Platform.prototype.constructor = Platform;
Platform.prototype.changePhase = function () {
    if (this.interval != 0) {
        if (globalTimer % this.interval == 0 && globalTimer != this.lastShift) {
            this.shiftState = !this.shiftState;
            this.lastShift = globalTimer;
        }
    }
    if (this.shiftState) {
        this.loadTexture('platform', 1);
    }
    else {
        this.loadTexture('platform', 0);
    }
}