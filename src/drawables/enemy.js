/**
 * Create the Enemy ship object.
 */
function Enemy() {
  this.alive = false;
  this.collidableWith = "bullet";
  this.type = "enemy";
  this.shouldFire = false;

  /*
   * Sets the Enemy values
   */
  this.spawn = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.speedX = speed;
    this.speedY = 0;
    this.alive = true;
    this.leftEdge = this.x - 130;
    this.rightEdge = this.x + 130;

    var self = this;
    this.speedTimerHandle = setTimeout(function() { self.speedX = (self.speedX * 2) % 8 }, 5000);
  };

  /*
   * Move the enemy
   */
  this.draw = function() {
    this.context.clearRect(this.x-1, this.y, this.width+1, this.height);
    this.x += this.speedX;
    this.y += this.speedY;
    if (this.x <= this.leftEdge) {
      this.speedX = this.speed;
    }
    else if (this.x >= this.rightEdge + this.width) {
      this.speedX = -this.speed;
    }

    if (!this.isColliding) {
      this.context.drawImage(imageRepository.enemy, this.x, this.y);
      
      if (this.shouldFire && this.canFire()) {
        this.fire();
      }

      return false;
    }
    else {
      game.playerScore += 10;
      game.explosion.get();
      return true;
    }
  };

  /*
   * Fires a bullet
   */
  this.fire = function() {
    game.enemyBulletPool.get(this.x+this.width/2, this.y+this.height, -2.5);
  };

  var lowerBound = this.canvasHeight * 0.75;
  this.canFire = function() {
    var onScreenBullet = game.enemyBulletPool.getPool()[0];
    return (!onScreenBullet || onScreenBullet.y >= lowerBound)
  };

  /*
   * Resets the enemy values
   */
  this.clear = function() {
    this.x = 0;
    this.y = 0;
    this.speed = 0;
    this.speedX = 0;
    this.speedY = 0;
    this.alive = false;
    this.isColliding = false;
  };
}
Enemy.prototype = new Drawable();