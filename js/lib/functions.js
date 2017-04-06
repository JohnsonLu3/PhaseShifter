



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

