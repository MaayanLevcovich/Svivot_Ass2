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
    this.topSpeed = speed + SPEED_INCREASE_FACTOR * 4;
    this.fireSpeed = -speed;
    this.topFireSpeed = this.fireSpeed - FIRE_SPEED_INCREASE_FACTOR * 4;
    this.speedX = speed;
    this.speedY = 0;
    this.alive = true;
    this.leftEdge = this.x - 130;
    this.rightEdge = this.x + 220;
    this.score = 0;
    this.colorDelta = 0;

    this.speedIntervalHandle = setInterval(this.increaseSpeed, 5000);
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
    else if (this.x + this.width >= this.rightEdge) {
      this.speedX = -this.speed;
    }

    if (!this.isColliding) {
      this.context.drawImage(imageRepository.enemy, this.x, this.y);

      var imageData = this.context.getImageData(this.x, this.y, this.width, this.height);
      this.addColorDelta(imageData);
      
      if (this.shouldFire && this.canFire()) {
        this.fire();
      }

      return false;
    }
    else {
      game.playerScore += this.score;
      game.explosion.get();
      return true;
    }
  };

  /*
   * Fires a bullet
   */
  this.fire = function() {
    game.enemyBulletPool.get(this.x+this.width/2, this.y+this.height, this.fireSpeed);
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

    clearInterval(this.speedIntervalHandle);
  };

  var self = this;
  this.increaseSpeed = function() {
    var newSpeed = self.speed + SPEED_INCREASE_FACTOR;

    self.speed = newSpeed >= self.topSpeed ? self.topSpeed : newSpeed;
    self.speedX = self.speedX > 0 ? self.speed : -self.speed;

    var newFireSpeed = self.fireSpeed - FIRE_SPEED_INCREASE_FACTOR;
    self.fireSpeed =  newFireSpeed >= self.topFireSpeed ? self.topFireSpeed : newFireSpeed;
  };

  /**
   * Adds delta to rgb data of the image
   * @param imageData
   */
  this.addColorDelta = function (imageData) {
    var data = imageData.data;

    for (var i = 0; i < data.length; i += 4) {
      data[i] += this.colorDelta;
      data[i + 1] += this.colorDelta;
      data[i + 2] += this.colorDelta;
    }

    this.context.putImageData(imageData, this.x, this.y)
  };
}
Enemy.prototype = new Drawable();