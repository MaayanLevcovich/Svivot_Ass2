/**
 * Creates the Special Ability object. These are
 * drawn on the "main" canvas.
 */
function SpecialAbility() {
  this.alive = false; // Is true if the bullet is currently in use
  
  this.spawn = function(x, y, speed) {
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.alive = true;
  };
  
  this.draw = function() {
    this.context.clearRect(this.x-1, this.y-1, this.width+2, this.height+2);
    this.y -= this.speed;

    if (this.isColliding) {
      return true;
    }
    else if (this.y >= this.canvasHeight) {
      return true;
    }
    else {
      this.context.drawImage(imageRepository.specialAbility, this.x, this.y);
      return false;
    }
  };

  /*
   * Resets the bullet values
   */
  this.clear = function() {
    this.x = 0;
    this.y = 0;
    this.speed = 0;
    this.alive = false;
    this.isColliding = false;
  };
}
SpecialAbility.prototype = new Drawable();
