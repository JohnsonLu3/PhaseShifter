/**
 * This object represents a platfrom that, when jumped from, will change the player's jump height.
 * @param {Phaser.Game} game - The reference to the Phaser game object.
 * @param {number} x - The x coordinate of the platform in the game world.
 * @param {number} y - The y coordinate of the platform in the game world.
 * @param {number} jumpHeight - The velocity at which the player will jump from this platform.
 * @param {Player} player - The reference to the player sprite.
 */
var JumpPlatform = function (game, x, y, newJumpHeight) {
    // Call the parent object constructor
    Phaser.Sprite.call(this, game, x, y, 'jumpPlatform');

    // Set the bounds of the platform
    this.width = 60;
    this.height = 15;
    this.xOffset = 2;
    this.yOffset = 17;

    // Initialize the physics of the platform
    game.physics.arcade.enable(this);
    this.body.immovable = true;
    this.body.setSize(60, 15, 2, 17);

    // Set this platform's new jump height
    this.newJumpHeight = newJumpHeight;

    game.add.existing(this);
}

JumpPlatform.prototype = Object.create(Phaser.Sprite.prototype);
JumpPlatform.prototype.constructor = JumpPlatform;

JumpPlatform.prototype.handleJumpBoost = function(player) {
    player.jumpBoost = true;
    player.jumpHeight = this.newJumpHeight;
}


