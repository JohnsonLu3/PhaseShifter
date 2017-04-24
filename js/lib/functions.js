
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
            // Temporary
            EnemyUtils.playDroneExplodeSound();
            turret.animations.play("die");
            turret.animations.currentAnim.onComplete.add(function(){turret.kill()});
        }

    }
    
}

/**
 * This function is called when a bullet is in contact with a drone.
 * @param {*} drone The drone who collided with the bullet
 * @param {*} bullet The bullet which was in contact with the drone.
 */


function recieveDamageD(drone, bullet)
{
    if (drone.shiftState === bullet.phase)
    {   
        EnemyUtils.playDroneExplodeSound();
        bullet.kill();
        drone.explode();
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
