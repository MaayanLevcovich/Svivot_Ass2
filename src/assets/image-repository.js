/**
 * Define an object to hold all our images for the game so images
 * are only ever created once. This type of object is known as a
 * singleton.
 */
function ImageRepository() {
  // Define images
  this.background = new Image();
  this.spaceship = new Image();
  this.bullet = new Image();
  this.enemy = new Image();
  this.enemyBullet = new Image();
  this.specialAbility = new Image();

  // Ensure all images have loaded before starting the game
  var numImages = 6;
  var numLoaded = 0;
  
  function imageLoaded() {
    numLoaded++;
    if (numLoaded === numImages) {
      window.init();
    }
  }
  
  this.background.onload = function() {
    imageLoaded();
  }
  this.spaceship.onload = function() {
    imageLoaded();
  }
  this.bullet.onload = function() {
    imageLoaded();
  }
  this.enemy.onload = function() {
    imageLoaded();
  }
  this.enemyBullet.onload = function() {
    imageLoaded();
  }
  this.specialAbility.onload = function() {
    imageLoaded();
  }

  // Set images src
  this.background.src = "src/assets/imgs/bg.png";
  this.spaceship.src = "src/assets/imgs/ship.png";
  this.bullet.src = "src/assets/imgs/bullet.png";
  this.enemy.src = "src/assets/imgs/enemy.png";
  this.enemyBullet.src = "src/assets/imgs/bullet_enemy.png";
  this.specialAbility.src = "src/assets/imgs/heart.png";
}