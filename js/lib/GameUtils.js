/**
 * This object contains various functions that affect the game or objects in it, except the player.
 */
var GameUtils = {
    /**
     *  pauseGame
     *      Pauses the game when ever the 
     *      ESC key is pressed. Pressing
     *      the key again unpause the game.
     */
    pauseGame: function() {
        // NEED TO SHOW A PAUSE MENU WHERE YOU CAN GO BACK TO THE MAIN MAIN
        if(game.paused === true){
            game.paused = false;
        } else {
            game.paused = true;
        }
    },
    /**
     * Change the phase of all the phase objects
     */
    updatePhases: function() {
        for (var i = 0 ; i <phaseObjects.length; i++) {
            phaseObjects[i].update();
        }
    }
}