var Drone = function(game,x,y,player)
{
    this.aVelocity = 200;
    this.hasSight = false;
    Enemy.call(this, game, x, y, "drone", 0, 1, player);
    //console.log(this);
    //The drone will attempt to smash into the player, it starts slow but accelerates towards to the player.
    this.speed = 5;
    this.acceleration = 2;
    this.attack = function () {
        if (this.hasSight) {
            //Accelerate
            this.speed += this.acceleration;
            var angle = game.physics.arcade.angleBetween(this, this.player);
            console.log(this.body.angle - angle);
        }
        else {
            // Slow down, lose 20 % of velocity every frame. 
            this.body.velocity.x *= 0.8;
            this.body.velocity.y *= 0.8;
        }
    }
    //Add Animations. The IDLE and ATTACK animations are identical.
    this.animations.add("attacking_R", [0,1,2,3,4,5], 10, true);
    this.animations.add("attacking_B", [6,7,8,9,10,11], 10, true);
    //Dying
    this.animations.add("dying", [12,13,14,15,16],10,false);    
}
Drone.prototype = Object.create(Enemy.prototype);
Drone.prototype.contructor = Drone;

//Longer range than the turret
Drone.prototype.seePlayer = function()
{
    var boundX = this.x - 700;
    var maxX = this.x + 700;
    var boundY = this.y - 400;
    var maxY = this.y + 400;
    return this.alive && this.player.x > boundX && this.player.x < maxX && this.player.y > boundY && this.player.y < maxY
}

Drone.prototype.update = function()
{
    this.changePhase();
    this.playAnimation("attacking");
    if (this.seePlayer()){
        if (this.player.x > this.x)
        {
            
            this.scale.x = -1 * Math.abs(this.scale.x);
        }
        else
        {
            this.scale.x = Math.abs(this.scale.x);
        }
        this.hasSight = true;
    }
    else
    {
        this.hasSight = false;
    }
    this.attack();
}

