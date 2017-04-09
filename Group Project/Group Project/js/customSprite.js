//Subclass of phaser sprite in order to add our own attributes to it. General super class of phase changing
//objects. 
var customSprite = function(game, x, y, asset, interval)
{
    Phaser.Sprite.call(this, game, x, y,asset);
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
 * Also remember to set the prototype constructor back to customSprite.
 * 
 */
customSprite.prototype = Object.create(Phaser.Sprite.prototype);
customSprite.prototype.constructor = customSprite;
customSprite.prototype.setPhase = function(phase)
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
customSprite.prototype.changePhase = function()
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
customSprite.prototype.update = function()
{
    this.changePhase();
}

customSprite.prototype.setInterval = function(num)
{
    this.interval = num;
}