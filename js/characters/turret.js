//Turret enemy, aims at player and attempts to fire at him.

var Turret = function(game,x,y,player)
{
    Enemy.call(this,game,x,y+20,'turret',100,2,player);
    //Fire a bullet every 2 seconds.
    this.cooldownAmt = 70;
    //Default bullet speed.
    this.bulletSpeed = 275;
    //Enable physics on turret enemies.
    this.body.setSize(40, 40, 0, 0);
    //Add various animations to this sprite.

    //IDLE
    this.animations.add("idle_R", [21,22,23,24,25,26,27], 10, true);
    this.animations.add("idle_B", [43,44,45,46,47,48,49], 10 ,true);

    //ATTACKING
    this.animations.add("attacking_R", [29,30,31,32,33,34], 10, true);
    this.animations.add("attacking_B", [50,51,52,53,54,55], 10, true);

    //DYING
    this.animations.add("die", [56,57,58,59,60,61,62], 20, false);

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


Turret.prototype.seePlayer = function()
{
    var boundX = this.x - 600;
    var maxX = this.x + 600;
    var boundY = this.y - 300;
    var maxY = this.y + 300;
    return this.alive && this.player.x > boundX && this.player.x < maxX && this.player.y > boundY && this.player.y < maxY
}

Turret.prototype.attack = function () {
    var bullet = game.enemyBullets.getFirstDead();
    if (bullet != null) {
        //Setting back to being alive.
        bullet.reset(this.x + (0.5 * this.width), this.y);
        //Set the phase and color of this bullet.
        bullet.phase = this.shiftState;
        if (bullet.phase)
        {
            bullet.loadTexture('enemyBullet', 0);
        }
        else
        {
            bullet.loadTexture('enemyBullet', 1);
        }
        //Move the bullet towards the player
        game.physics.arcade.moveToXY(bullet, this.player.x + 0.5 * this.player.width, this.player.y - 5, this.bulletSpeed);

        EnemyUtils.playTurretAttackSound();
    }

}

