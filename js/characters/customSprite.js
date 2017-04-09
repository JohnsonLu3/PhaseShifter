/**
 * Subclass of Phaser.Sprite in order to add our own attributes to it.
 * General super class of phase changing objects.
 * @param {*} game      The Phaser.Game object
 * @param {*} x         The initial x-position of the sprite
 * @param {*} y         The initial y-position of the sprite
 * @param {*} asset     The image asset to initialize the sprite with
 * @param {*} interval  The time before the sprite will change phases. (0 will make the sprite never phase change)
 */
var CustomSprite = function(game, x, y, asset, interval) {
    // Call superclass constructor
    Phaser.Sprite.call(this, game, x, y, asset);
    // Set interval
    this.interval = interval;
    //Random phase
    this.shiftState;
    // Remember the frame when you last shifted
    this.lastShift;
    if (Math.random() > 0.5)
    {
        //Color is sprite specific, switching between frames.

        //this.tint = PINK;
        //this.tint = NO_COLOR;
        this.shiftState = true;
    }
    else
    {
        //this.tint = BLUE;
        this.shiftState = false;
    }
    //Display sprite if possible
    game.add.existing(this);
}
/**
 * Set prototype to Phaser.Sprite in order to inherit methods.
 * Also remember to set the prototype constructor back to CustomSprite.
 * 
 */
CustomSprite.prototype = Object.create(Phaser.Sprite.prototype);
CustomSprite.prototype.constructor = CustomSprite;
CustomSprite.prototype.setPhase = function(phase)
{
    this.shiftState = phase;
}
CustomSprite.prototype.changePhase = function()
{
    if (this.interval != 0) {
        if (globalTimer % this.interval == 0 && globalTimer != this.lastShift) {
            this.shiftState = !this.shiftState;
            this.lastShift = globalTimer;
        }
    }
}
//The most basic form of update, simply check if its time to change phase.
CustomSprite.prototype.update = function()
{
    this.changePhase();
}

CustomSprite.prototype.setInterval = function(num)
{
    this.interval = num;
}






