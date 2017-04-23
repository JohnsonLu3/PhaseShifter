var Drone = function(game,x,y,player)
{
    this.aDirection = 1;
    this.aVelocity = 200;
    this.hasSight = false;
    this.canAct = true;
    Enemy.call(this, game, x, y, "drone", 100, 1, player);
    //console.log(this);
    //The drone will attempt to smash into the player, it starts slow but accelerates towards to the player.
    this.speed = 5;
    this.acceleration = 2;
    this.attack = function () {
        if (this.hasSight) {
            //Increase speed of the drone.
            var currentFacing = this.body.rotation;
            currentFacing += 180;
            if (currentFacing > 360)
            {
                currentFacing -= 360;
            }
            var angleBetween = game.physics.arcade.angleBetween(this,this.player);
            if (angleBetween < 0)
            {
                angleBetween += 2 * Math.PI;
            }
            //Convert rads to degrees.
            currentFacing = Math.floor(currentFacing);
            angleBetween *= (180/Math.PI);
            angleBetween = Math.floor(angleBetween);
            if (Math.abs(currentFacing - angleBetween) < 45)
            {
                //Speed up if drone is nearly locked to player.
                this.speed += this.acceleration;
            }
            else
            {
                //Reduce speed to allow better turning.
                if (this.speed > 5)
                {
                    this.speed--;
                }
            }
            if (Math.abs(currentFacing - angleBetween) < 20)
            {
                this.aDirection = 0;
            }
            else{
               var facingQuad = Math.floor((currentFacing / 90)) + 1;
               var angleQuad = Math.floor((angleBetween / 90)) + 1;
               //console.log("FACING QUAD ",facingQuad);
               //console.log("ANGLE QUAD", angleQuad);
                if (angleQuad - facingQuad === 1 || angleQuad - facingQuad === -3)
                {
                    this.aDirection = 1;
                }
                else if (angleQuad === facingQuad)
                {
                    if (angleBetween > currentFacing)
                    {
                        this.aDirection = 1;
                    }
                    else
                    {
                        this.aDirection = -1;
                    }
                }
                else
                {
                    this.aDirection = -1;
                }
            }
            this.body.angularVelocity = this.aVelocity * this.aDirection;
            //Start Moving.
            this.body.velocity.y = Math.sin(currentFacing * Math.PI/180) * this.speed;
            this.body.velocity.x = Math.cos(currentFacing * Math.PI/180) * this.speed;
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
    this.animations.add("die", [12,13,14,15,16],10,false);    

    this.explode =  function()
    {
        this.canAct = false;
        this.body.velocity.x = 0;
        this.body.velocity.y = 0;
        this.playAnimation("die");
        this.animations.currentAnim.onComplete.add(function (drone) {
            drone.kill();
        });
    }
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
    if (this.canAct) {
        this.changePhase();
        this.playAnimation("attacking");
        if (this.seePlayer()) {
            this.hasSight = true;
        }
        else {
            this.hasSight = false;
        }
        this.attack();
    }
}

