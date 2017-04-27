/**
 * Platform will represent a phase platform, you will only be allowed to stand on these platforms when your phase is equal to the phase of the platform.
 * @param {*} game The game instance for where to add the platform to.
 * @param {*} x X position of the platform.
 * @param {*} y Y position of the platform
 * @param {*} interval The interval of the platform, the amount of frames that must pass before changing phase.
 */
var Platform = function (game, x, y, interval, state) {
    CustomSprite.call(this, game, x, y, 'platform', interval, state);
    game.physics.arcade.enable(this);
    this.body.immovable = true;
    this.body.setSize(60, 8, 2, 12);
    this.flicker = false;
    this.animations.add("flicker", [0,1], 30, true);
    
}

Platform.prototype = Object.create(CustomSprite.prototype);
Platform.prototype.constructor = Platform;
Platform.prototype.changePhase = function () {
    if (this.interval != 0) {
        //One second in warning before platform will change.
        if ((globalTimer % this.interval) - this.interval > -60 && (globalTimer % this.interval) - this.interval < 0)
        {
            this.flicker = true;
        }
        else
        {
            this.flicker = false;
        }
        if (globalTimer % this.interval == 0 && globalTimer != this.lastShift) {
            this.shiftState = !this.shiftState;
            this.lastShift = globalTimer;
        }
    }
    if (!this.flicker)
    {
        if (this.shiftState) {
            this.loadTexture('platform', 1);
        }
        else {
            this.loadTexture('platform', 0);
        }
    }
    else
    {
        this.animations.play("flicker");
    }
}