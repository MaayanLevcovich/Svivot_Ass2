/**
 * Initialize the Game and start it.
 */
var game = new Game();

function init() {
  game.init();
}

var imageRepository = new ImageRepository();

/**
 * Ensure the game sound has loaded before starting the game
 */
function checkReadyState() {
  if (game.backgroundAudio.readyState === 4) {
    window.clearInterval(game.checkAudio);
    document.getElementById('loading').style.display = "none";
    game.start();
  }
}

/**
 * The animation loop. Calls the requestAnimationFrame shim to
 * optimize the game loop and draws all game objects. This
 * function must be a gobal function and cannot be within an
 * object.
 */
function animate() {
  document.getElementById('score').innerHTML = game.playerScore;
  document.getElementById('lives').innerHTML = game.ship.lives;

  var enemy = game.enemyPool.getPool()[0];

  if (enemy) {
    document.getElementById('enemyTopSpeed').innerHTML = enemy.topSpeed;
    document.getElementById('enemySpeed').innerHTML = enemy.speed;
  }
  
  // Insert objects into quadtree
  game.quadTree.clear();
  game.quadTree.insert(game.ship);
  game.quadTree.insert(game.ship.bulletPool.getPool());
  game.quadTree.insert(game.enemyPool.getPool());
  game.quadTree.insert(game.enemyBulletPool.getPool());
  game.quadTree.insert(game.specialAbilityPool.getPool());

  detectCollision();

  // No more enemies
  if (game.enemyPool.getPool().length === 0) {
    game.gameOver();
  }

  // Animate game objects
  if (game.ship.alive && game.enemyPool.getPool().length !== 0 && game.time >= 0) {
    requestAnimFrame( animate );

    game.enemyFireLogic.randomEnemyShoot();

    game.background.draw();
    game.ship.move();
    game.ship.bulletPool.animate();
    game.specialAbilityPool.animate();
    game.enemyPool.animate();
    game.enemyBulletPool.animate();
  }
}

function detectCollision() {
  var objects = [];
  game.quadTree.getAllObjects(objects);

  for (var x = 0, len = objects.length; x < len; x++) {
    game.quadTree.findObjects(obj = [], objects[x]);

    for (y = 0, length = obj.length; y < length; y++) {

      // DETECT COLLISION ALGORITHM
      if (objects[x].collidableWith === obj[y].type &&
        (objects[x].x < obj[y].x + obj[y].width &&
        objects[x].x + objects[x].width > obj[y].x &&
        objects[x].y < obj[y].y + obj[y].height &&
        objects[x].y + objects[x].height > obj[y].y)) {
        objects[x].isColliding = true;
        objects[x].collidingWith = obj[y];
        obj[y].isColliding = true;
        obj[y].collidingWith = objects[x];
      }
    }
  }
};

// Creates the array to hold the KEY_CODES and sets all their values
// to true. Checking true/flase is the quickest way to check status
// of a key press and which one was pressed when determining
// when to move and which direction.
KEY_STATUS = {};
for (code in KEY_CODES) {
  KEY_STATUS[KEY_CODES[code]] = false;
}

/**
 * Sets up the document to listen to onkeydown events (fired when
 * any key on the keyboard is pressed down). When a key is pressed,
 * it sets the appropriate direction to true to let us know which
 * key it was.
 */
document.onkeydown = function(e) {
  // Firefox and opera use charCode instead of keyCode to
  // return which key was pressed.
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = true;
  }
};
/**
 * Sets up the document to listen to ownkeyup events (fired when
 * any key on the keyboard is released). When a key is released,
 * it sets teh appropriate direction to false to let us know which
 * key it was.
 */
document.onkeyup = function(e) {
  var keyCode = (e.keyCode) ? e.keyCode : e.charCode;
  if (KEY_CODES[keyCode]) {
    e.preventDefault();
    KEY_STATUS[KEY_CODES[keyCode]] = false;
  }
};

/**
 * requestAnim shim layer by Paul Irish
 * Finds the first API that works to optimize the animation loop,
 * otherwise defaults to setTimeout().
 */
window.requestAnimFrame = (function(){
  return  window.requestAnimationFrame       ||
    window.webkitRequestAnimationFrame ||
    window.mozRequestAnimationFrame    ||
    window.oRequestAnimationFrame      ||
    window.msRequestAnimationFrame     ||
    function(/* function */ callback, /* DOMElement */ element){
      window.setTimeout(callback, 1000 / 60);
    };
})();