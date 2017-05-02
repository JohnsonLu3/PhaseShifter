/**
 * This factory object contains functions that create enemy sprites.
 */
var EnemyFactory = {
    
    /**
     * This function creates a Turret and places it in the game world.
     * @param {Phaser.Game} game - Reference to the game object
     * @param {number} x - The x coordinate at which to create the Drone
     * @param {number} y - The y coordinate at which to create the Drone
     * @param {Array} phaseObjects - The array of objects that can change phases
     * @param {Phaser.Group} droneGroup - The group of Drone objects
     */
    makeDrone: function(game, x, y, player, phaseObjects, droneGroup) {
        var newDrone = new Drone(game, x, y, player);
        phaseObjects.push(newDrone);
        droneGroup.add(newDrone);
    },

    /**
     * This function creates a Turret and places it in the game world.
     * @param {Phaser.Game} game - Reference to the game object
     * @param {number} x - The x coordinate at which to create the Turret
     * @param {number} y - The y coordinate at which to create the Turret
     * @param {Array} phaseObjects - The array of objects that can change phases
     * @param {Phaser.Group} turretGroup - The group of Turret objects
     */
    makeTurret: function(game, x,  y, player, phaseObjects, turretGroup) {
        var newTurret = new Turret(game, x, y, player);
        phaseObjects.push(newTurret);
        turretGroup.add(newTurret);
    },
    
}