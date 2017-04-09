// Dimensions of the game screen. 
var gameW = 1140, gameH = 640;

// A global timer, this is used in order to keep track of things such as intervals for enemy phase changes.
var globalTimer = 0;

// Collection of all phase objects in the game, used for calling update each frame.
var phaseObjects = game.add.group();

// Create a game group which will contain all special phase platforms.

var phasePlatform = game.add.group();

