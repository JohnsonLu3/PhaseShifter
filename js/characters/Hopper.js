/**
 * This is an enemy that jumps towards the player if the player approaches it.
 */
var Hopper = function(game, x, y, player) {
    // Construct this as an Enemy
    Enemy.call(this,game,x,y+20,'turret',100,2,player);

    // Start with a random wait duration:
    this.waitDuration = Math.round(Math.random() * 100);

    // Hopper velocities
    this.moveSpeed = 200;
    this.jumpSpeed = 300;
    
    //Enable physics
    game.physics.arcade.enable(this);

    // Set the size
    this.body.setSize(40, 40, 0, 0);

    //Add various animations to this sprite.


}

Hopper.prototype = Object.create(Enemy.prototype);
Hopper.prototype = {
    constructor: Hopper,
    /**
     * This function returns true if the Hopper sees the player, false otherwise
     */
    seePlayer: function() {
        var xRange = 400;
        var yRange = 200;
        // Return true if the player is within the sight bounds AND if the player is at the same height or higher than the Hopper
        if ((Math.abs(this.x - this.player.x) < xRange) && (this.player.y - this.y) < yRange && (this.player.y >= this.y)) {
            return true;
        }
        else {
            return false;
        }
    },
    /**
     * This function is called at each update loop of the game
     */
    update: function() {
        // The Hopper is on "cooldown" and is on the ground
        if(this.waitDuration > 0 && this.body.blocked.down) {
            this.waitDuration--;
        }

        // The Hopper is ready to jump
        else {
            // Reset the jump cooldown
            this.waitDuration = Math.round(Math.random() * 100);
            // Jump towards the player
            this.hop();
        }
    },
    /**
     * 
     */
    hop: function() {
        // The player is to the right
        if(this.player.x > this.x) {
            this.body.velocity.x = this.moveSpeed;
        }

        // The player is to the left
        else {
            this.body.velocity.x = -this.moveSpeed;
        }

        // JUMP!!
        this.body.velocity.y = -this.jumpSpeed;
    }
};

