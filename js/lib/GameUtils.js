/**
 * This object contains various functions that affect the game or objects in it.
 */
var GameUtils = {
    
    /**
     * Set the anchor points of an array of objects to their centers.
     */
    setAnchorToCenter: function(objects) {
        objects.forEach(function(object) {
            object.anchor.set(0.5);
        });
    },

    makeScreenTitle: function(screenName) {
        // Text that will indicate which screen the player is seeing
        game.add.text(0, 0, screenName, {fill: 'white'});
    },

    makeBackButton: function(lastState) {
        var buttonX = 75, buttonY = 75;
        // Back button at the top left corner that will take the player to the previous game state
        var back_button = game.add.button(buttonX, buttonY, 'smallButton',
            function() {game.state.start(lastState)}
        );
        var back_text = game.add.text(buttonX, buttonY, 'Back', {fill: 'white'});
        this.setAnchorToCenter([back_button, back_text]);
    },

    makeHelpButton: function() {
        var buttonX, buttonY;
        var pause_button = game.add.button(buttonX, buttonY, 'helpButton',
            function() {game.state.start(helpScreen)}
        );
    },

    makePauseMenu: function() {
        PauseText = game.make.text(0, 0, 'Paused', { font: '30px Arial', fill: '#fff' });
        PauseText.anchor.setTo(0.5, 0.5);

        menubutton = game.make.sprite(0, 0, 'menu');
        menubutton.anchor.setTo(0.5, 0.5);
            
        menuText = game.make.text(0, 0, 'Level Select', {font: '24px Arial', fill: 'white'});
        menuText.anchor.setTo(0.5, 0.5);
    },

    /**
     *  pauseGame
     *      Pauses the game when ever the 
     *      ESC key is pressed. Pressing
     *      the key again unpause the game.
     */
    pauseGame: function(){
        // NEED TO SHOW A PAUSE MENU WHERE YOU CAN GO BACK TO THE MAIN MAIN
        if(game.paused === true){
            game.paused = false;                            // unpause game
            game.world.remove(PauseText);
            game.world.remove(menuText);
            game.world.remove(menubutton);

        } else {
            // Update the positions of the menu elements
            PauseText.x = game.camera.x + gameW/2;
            PauseText.y = game.camera.y + 20;
            menubutton.x = game.camera.x + gameW/2;
            menubutton.y = game.camera.y + gameH/2;
            menuText.x = game.camera.x + gameW/2;
            menuText.y = game.camera.y + gameH/2;
            // Show the menu
            game.add.existing(PauseText);
            game.add.existing(menubutton);
            game.add.existing(menuText);
            game.paused = true;
        }
    },

    /**
     * This function acts as the handler for the pause menu.
     * If the player clicks on the level select button, they are taken back to that screen.
     */
    pauseMenuHandler: function(event){
        if(game.paused === true){
            var mouseX = event.x + 65;          // add weird offset
            var mouseY = event.y + 24;

            if( mouseX + game.camera.x >  menubutton.x && mouseX + game.camera.x < menubutton.x + 150
                && mouseY + game.camera.y >  menubutton.y - 60 && mouseY + game.camera.y < menubutton.y + 60 ){
                // CALL STATE SWITCH
                game.paused = false;
                // Revert music back to theme
                music.stop();
                if(musicFlag === true) {
                    music = game.add.audio("theme");
                    music.loop = true;
                    music.play();
                }
                
                game.world.width = gameW;                       // Reset game world cords
                game.world.height = gameH;                      // because the camera messes with it
                game.state.start('levelSelect_state');
                
            }
        }
    },

    /**
     * This function checks for, and handles, any cheats that we may include, except for invulnerability.
     */
    checkCheats: function(player) {
        if(ControlKeys.oneKey.isDown) {
            game.state.start('level_1_state');
        }
        else if(ControlKeys.twoKey.isDown) {
            game.state.start('level_2_state');
        }
        else if (ControlKeys.threeKey.isDown) {
            game.state.start('level_3_state');
        }
    },

    /**
     * This function is called when the invulnerability key is pressed.
     */
    handleInvulnerability: function(player) {
        // Make invulnerability text if needed
        if(this.invulnerability_label === undefined) {
            this.invulnerability_label = game.make.text(0, 0, "Phaser is INVULNERABLE (to bullets at least)", {font: '18px Arial', fill: 'white'});
            this.invulnerability_label.fixedToCamera = true;
        }
        // Toggle invincibility
        player.invulnerable = !player.invulnerable;

        // Display or remove text
        if (player.invulnerable === true) {
            // Update text location
            game.add.existing(this.invulnerability_label);
        }
        else {
            game.world.remove(this.invulnerability_label);
        }
    }
}