
/**
 * This function is called when a bullet is in contact with a turret.
 * @param {*} turret The turret who collided with the bullet
 * @param {*} bullet The bullet which was in contact with the turret.
 */


function recieveDamage(turret, bullet)
{
    if (turret.shiftState === bullet.phase)
    {
        bullet.kill();
        turret.health--;
        if(turret.health == 0){
            turret.animations.play("die");
            turret.animations.currentAnim.onComplete.add(function(){turret.kill()});
        }

    }
    
}

/**
 * This function is called when an enemy bullet is in contact with a player.
 * @param {*} turret The player, which was just in contact with the bullet.
 * @param {*} bullet The bullet, which is in contact with the player.
 */
function recieveDamageP(player, bullet)
{
    if (player.shiftState === bullet.phase)
    {
        bullet.kill()
        player.health--;
        if (player.health == 0)
        {
            player.animations.play("die");
            player.animations.currentAnim.onComplete.add(function(){player.kill()});
        }
        
    }
}


/**
 * Change the phase of all the phase objects
 */
function updatePhases() {
    for (var i = 0 ; i <phaseObjects.length; i++) {
        phaseObjects[i].update();
    }
}

/**
 * Function called to allow collision between phase platforms and the player. 
 */
function collidePlatform(game, player, platform)
{
    if (game.physics.arcade.collide(player, platform))
        {
            playerPosition = player.y + player.height;
            platformPosition = platform.y
            //console.log(playerPosition - platformPosition);
            if (playerPosition - platformPosition < 15 && player.body.velocity.y > 0)
            {
                //Snap player back to top of platform.
                player.y -= playerPosition - platformPosition;
            }
        }
}
