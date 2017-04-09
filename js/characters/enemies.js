//Superclass of all enemies, have no attack or unique behavior of its own, define attack to use. Has knowledge of player location.
var Enemy = function(game,x,y,asset,interval,hp, player)
{
    CustomSprite.call(this, game, x, y,asset,interval);
    this.anchor.setTo(.5,.5);
    this.health = hp;
    this.player = player;
    this.cooldownAmt = 20;
    this.cooldown = 0;
}

Enemy.prototype = Object.create(CustomSprite.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.setCooldown = function(num)
{
    if (num > 0)
    {
        this.cooldownAmt = num;
    }
}

//Generic method for determining if the enemy can see the player, used for determining if we should attack. Implementation specific to various enemies
Enemy.prototype.seePlayer = function()
{
    return false;
}


//Generic update loop, see if it will change phase, and attempt to attack the player.
Enemy.prototype.update = function()
{
    this.changePhase();
    if (this.seePlayer()){
        if (this.player.x > this.x)
        {
            
            this.scale.x = -1 * Math.abs(this.scale.x);
        }
        else
        {
            this.scale.x = Math.abs(this.scale.x);
        }
        this.playAnimation("attacking");
        if (this.cooldown == 0) {
            this.attack(this.player);
            this.cooldown = this.cooldownAmt;
        }
        else
        {
            this.cooldown--;
        }
    }
    else
    {
        this.playAnimation("idle");
        if (this.cooldown > 0)
            this.cooldown--;
    }
}


Enemy.prototype.attack = function(){}
Enemy.prototype.setHealth = function(health)
{
    if (health > 0)
    {
        this. health = health;
    }
}

Enemy.prototype.playAnimation = function(name)
{
    if (name === "die")
    {
        this.animations.play("die");
    }
    else
    {
        if (this.shiftState) {
            //We are in the red state, play red variation of animation.
            this.animations.play(name + "_R");
        }
        else {
            // Play the blue variation of the animation.
            this.animations.play(name + "_B");
        }
    }
}





