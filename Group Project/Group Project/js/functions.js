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

function updatePhases()
{
    for (var i = 0 ; i <phaseObjects.length; i++)
    {
        phaseObjects[i].update();
    }
}

function recieveDamage(turret, bullet)
{
    if (turret.phase == bullet.phase)
    {
        bullet.kill()
        turret.damage(1);
        if (turret.alive)
            enemyHP.text = "Turret\'s Health " + turret.health;
        else
            enemyHP.text = "Turret is dead";
    }
}

function recieveDamageP(player, bullet)
{
    if (player.phase == bullet.phase)
    {
        bullet.kill()
        player.damage(1);
        if (player.alive)
            playerHP.text = "Player\'s Health " + player.health;
        else
            playerHP.text = "Player is dead";
    }
}