//Superclass of all enemies, have no attack or unique behavior of its own, define attack to use. Has knowledge of player location.
var Enemy = function(game,x,y,asset,interval,hp, player)
{
    customSprite.call(this, game, x, y,asset,interval);
    this.health = hp;
    this.player = player;
    this.cooldownAmt = 20;
    this.cooldown = 0;
}

Enemy.prototype = Object.create(customSprite.prototype);
Enemy.prototype.constructor = Enemy;
Enemy.prototype.setCooldown = function(num)
{
    if (num > 0)
    {
        this.cooldownAmt = num;
    }
}
//Generic update loop, see if it will change phase, and attempt to attack the player.
Enemy.prototype.update = function()
{
    this.changePhase();
    if(this.cooldown == 0)
    {
        this.attack(this.player);
        this.cooldown = this.cooldownAmt
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

//Turret enemy, aims at player and attempts to fire at him.

var Turret = function(game,x,y,player)
{
    Enemy.call(this,game,x,y,'turret',50,2,player);
    //Default bullet speed.
    this.bulletSpeed = 200;
}
Turret.prototype = Object.create(Enemy.prototype);
Turret.prototype.constructor = Turret;
Turret.prototype.setSpeed = function(speed)
{
    if (speed > 0)
    {
        this.bulletSpeed = speed;
    }
}
Turret.prototype.attack = function()
{
    var boundX = this.x - 600;
    var maxX = this.x + 600;
    var boundY = this.y - 300;
    var maxY = this.y + 300;
    if (this.alive && this.player.x > boundX && this.player.x < maxX && this.player.y > boundY && this.player.y < maxY)
    {
        var bullet = enemyBullets.getFirstDead();
        if (bullet != null) {
            //Setting back to being alive.
            bullet.reset(this.x + (0.5 * this.width), this.y + (0.5 * this.height));
            //Set the phase and color of this bullet.
            bullet.phase = this.phase;
            if (bullet.phase)
                bullet.tint = PINK;
            else
                bullet.tint = BLUE;
            //Move the bullet towards the player
            game.physics.arcade.moveToXY(bullet, this.player.x + 0.5 * this.player.width, this.player.y + 0.5* this.player.height ,this.bulletSpeed);    
        }
        
    }
}




