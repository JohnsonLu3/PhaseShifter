/**
 * This object contains several functions that affect the player.
 */
var PlayerUtils = {

    /**
     * 
     */
    collidePlatform: function(game, player, platform) {
        if (game.physics.arcade.collide(player, platform)) {
                playerPosition = player.y + player.height;
                platformPosition = platform.y;
                if (playerPosition - platformPosition < 15 && player.body.velocity.y > 0) {
                    //Snap player back to top of platform.
                    player.y -= playerPosition - platformPosition;
                }
            }
    },

    /**
     * 
     */
    recieveDamage: function(player, bullet) {
        if (player.phase == bullet.phase) {
            bullet.kill()
            player.damage(1);
            if (player.alive)
                playerHP.text = "Player\'s Health " + player.health;
            else
                playerHP.text = "Player is dead";
        }
    }
}