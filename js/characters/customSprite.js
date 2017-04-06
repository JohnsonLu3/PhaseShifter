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
    this.phase;
    if (Math.random() > 0.5)
    {
        this.tint = PINK;
        //this.tint = NO_COLOR;
        this.phase = true;
    }
    else
    {
        this.tint = BLUE;
        this.phase = false;
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
    this.phase = phase;
    if (phase)
    {
        this.tint = PINK;
    }
    else
    {
        this.tint = BLUE;
    }
}
CustomSprite.prototype.changePhase = function()
{
    if (this.interval != 0) {
        if (globalTimer % this.interval == 0) {
            if (this.phase) {
                this.tint = BLUE;
            }
            else {
                this.tint = PINK;
            }
            this.phase = !this.phase;
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