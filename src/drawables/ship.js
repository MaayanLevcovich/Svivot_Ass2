
/**
 * Create the Ship object that the player controls. The ship is
 * drawn on the "ship" canvas and uses dirty rectangles to move
 * around the screen.
 */
function Ship() {
  this.speed = 3;
  this.bulletPool = new Pool(30);
  var fireRate = 15;
  var counter = 0;
  this.collidableWith = "enemyBullet";
  this.type = "ship";
  this.lives = PLAYER_LIVES;

  this.init = function(x, y, width, height) {
    // Default variables
    this.initialX = this.x = x;
    this.initialY = this.y = y;
    this.width = width;
    this.height = height;
    this.alive = true;
    this.isColliding = false;
    this.bulletPool.init("bullet");
  };

  this.draw = function() {
    this.context.drawImage(imageRepository.spaceship, this.x, this.y);
  };

  this.move = function() {
    counter++;
    // Determine if the action is move action
    if (KEY_STATUS.left || KEY_STATUS.right ||
      KEY_STATUS.down || KEY_STATUS.up) {
      // The ship moved, so erase it's current image so it can
      // be redrawn in it's new location
      this.context.clearRect(this.x, this.y, this.width, this.height);

      // Update x and y according to the direction to move and
      // redraw the ship. Change the else if's to if statements
      // to have diagonal movement.
      if (KEY_STATUS.left) {
        this.x -= this.speed;
        if (this.x <= 0) // Kep player within the screen
          this.x = 0;
      } else if (KEY_STATUS.right) {
        this.x += this.speed;
        if (this.x >= this.canvasWidth - this.width)
          this.x = this.canvasWidth - this.width;
      } else if (KEY_STATUS.up) {
        this.y -= this.speed;

        var highestLimit = this.canvasHeight * SHIP_MOVEMENT_LIMIT_MULTIPLAYER;
        if (this.y <= (this.canvasHeight - highestLimit)) {
          this.y = (this.canvasHeight - highestLimit);
        }

      } else if (KEY_STATUS.down) {
        this.y += this.speed;
        
        if (this.y >= this.canvasHeight - this.height)
          this.y = this.canvasHeight - this.height;
      }
    }

    if (this.isColliding) {
      // Erase old position so it can
      // be redrawn in it's new location
      this.context.clearRect(this.x, this.y, this.width, this.height);

      this.x = this.initialX;
      this.y = this.initialY;
      this.decreaseLife();
    }

    if (!this.alive) {
      game.gameOver();
    } else {
      this.draw();
    }

    if (KEY_STATUS.space && counter >= fireRate && !this.isColliding) {
      this.fire();
      counter = 0;
    }
  };

  this.fire = function() {
    this.bulletPool.getTwo(this.x+6, this.y, 3,
      this.x+33, this.y, 3);
    game.laser.get();
  };

  this.decreaseLife = function () {
    this.lives -= 1;
    this.alive = this.lives > 0;
    this.isColliding = false;
  };
}
Ship.prototype = new Drawable();
