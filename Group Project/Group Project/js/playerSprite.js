
var Player = function(game, x, y, asset, interval, hp)
{
    //Player will subclass customSprite.
    customSprite.call(this, game, x, y,asset,interval);
    this.health = hp;
    this.cooldown = 0;
    //Remember the last direction we ran, we will fire bullets in that direction.
    this.dirRight = true;
    this.cooldownAmt = 20;
    this.bulletSpeed = 250;
    this.walkingSpeed = 150;
}

/**
 * Modify player to be different than the customSprite.
 */
Player.prototype = Object.create(customSprite.prototype);
Player.prototype.constructor = Player;
Player.prototype.setCoolDown = function(cooldown)
{
    if (cooldown > 0)
    {
        this.cooldownAmt = cooldown;
    }
}
Player.prototype.setSpeed = function(speed)
{
    this.bulletSpeed = speed;
}
Player.prototype.setWalkSpeed = function(speed)
{
    this.walkingSpeed = speed;
}
Player.prototype.changePhase = function()
{
    if (this.phase)
    {
       this.tint =  BLUE;
    }
    else
    {
       this.tint = PINK;
    }
    this.phase = !this.phase;
}
Player.prototype.setHealth = function(health)
{
    if (health > 0)
    {
        this. health = health;
    }
}
//Player has no update method, its all controlled by the player.
Player.prototype.update = function(){};
//Fire a bullet from the player
Player.prototype.fire = function(){
    var bullet = playerBullets.getFirstDead();
    if (this.cooldown == 0 && bullet != null && this.alive)
    {
        //Setting back to being alive.
        bullet.reset(this.x + (0.5 * this.width),this.y + (0.5 * this.height));
        //Set the phase and color of this bullet.
        bullet.phase = this.phase;
        if (bullet.phase)
            bullet.tint = PINK;
        else
            bullet.tint = BLUE;
        if (this.dirRight)
        {
            bullet.body.velocity.x = 250;
        }
        else
        {
            bullet.body.velocity.x = -250;
        }
        this.cooldown = 20;
    }
};
