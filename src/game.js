
/**
 * Creates the Game object which will hold all objects and data for
 * the game.
 */
function Game() {
  /*
   * Gets canvas information and context and sets up all game
   * objects.
   * Returns true if the canvas is supported and false if it
   * is not. This is to stop the animation script from constantly
   * running on browsers that do not support the canvas.
   */
  this.init = function() {
    // Get the canvas elements
    this.bgCanvas = document.getElementById('background');
    this.shipCanvas = document.getElementById('ship');
    this.mainCanvas = document.getElementById('main');

    // Test to see if canvas is supported. Only need to
    // check one canvas
    if (this.bgCanvas.getContext) {
      this.bgContext = this.bgCanvas.getContext('2d');
      this.shipContext = this.shipCanvas.getContext('2d');
      this.mainContext = this.mainCanvas.getContext('2d');

      // Initialize objects to contain their context and canvas
      // information
      Background.prototype.context = this.bgContext;
      Background.prototype.canvasWidth = this.bgCanvas.width;
      Background.prototype.canvasHeight = this.bgCanvas.height;

      Ship.prototype.context = this.shipContext;
      Ship.prototype.canvasWidth = this.shipCanvas.width;
      Ship.prototype.canvasHeight = this.shipCanvas.height;

      Bullet.prototype.context = this.mainContext;
      Bullet.prototype.canvasWidth = this.mainCanvas.width;
      Bullet.prototype.canvasHeight = this.mainCanvas.height;

      Enemy.prototype.context = this.mainContext;
      Enemy.prototype.canvasWidth = this.mainCanvas.width;
      Enemy.prototype.canvasHeight = this.mainCanvas.height;

      SpecialAbility.prototype.context = this.mainContext;
      SpecialAbility.prototype.canvasWidth = this.mainCanvas.width;
      SpecialAbility.prototype.canvasHeight = this.mainCanvas.height;

      // Initialize the background object
      this.background = new Background();
      this.background.init(0,0); // Set draw point to 0,0

      // Initialize the ship object
      this.ship = new Ship();
      
      // Set the ship to start near the bottom middle of the canvas
      this.shipStartX = this.shipCanvas.width/2 - imageRepository.spaceship.width;
      this.shipStartY = this.shipCanvas.height/4*3 + imageRepository.spaceship.height*2;
      
      this.ship.init(this.shipStartX, this.shipStartY,
        imageRepository.spaceship.width, imageRepository.spaceship.height);

      // Initialize the enemy pool object
      this.enemyPool = new Pool(20);
      this.enemyPool.init("enemy");
      this.enemyFireLogic = new EnemiesFireLogic(this.enemyPool);
      this.spawnWave();

      this.enemyBulletPool = new Pool(2);
      this.enemyBulletPool.init("enemyBullet");
      
      this.specialAbilityPool = new Pool(1);
      this.specialAbilityPool.init("specialAbility");

      this.specialAbilityHandle = setInterval(this.dropSpecialAbility, 5000);

      // Start QuadTree
      this.quadTree = new QuadTree({x:0,y:0,width:this.mainCanvas.width,height:this.mainCanvas.height});

      this.playerScore = 0;

      // Audio files
      this.laser = new SoundPool(10);
      this.laser.init("laser");

      this.explosion = new SoundPool(20);
      this.explosion.init("explosion");

      this.backgroundAudio = new Audio("src/assets/sounds/kick_shock.wav");
      this.backgroundAudio.loop = true;
      this.backgroundAudio.volume = .25;
      this.backgroundAudio.load();

      this.checkAudio = window.setInterval(function(){checkReadyState()},1000);
      this.time = INITIAL_TIME;

      var self = this;
      var timerDiv = document.getElementById('timer');
      this.timer = window.setInterval(function () {
        timerDiv.innerHTML = self.time;
        self.time -= 1;

        if (self.time < 0) {
          self.gameOver();
        }
      }, 1000)
    }
  };

  // Spawn a new wave of enemies
  this.spawnWave = function() {
    var numOfShips = 20;
    var numOfCols = 5;
    var initialSpeed = 2;
    var height = imageRepository.enemy.height;
    var width = imageRepository.enemy.width;
    var initialX = 130;
    var x = initialX;
    var y = 30;
    var spacer = -height * 1.5;
    var score = 20;
    var colorDelta = 0;

    for (var i = 1; i <= numOfShips; i++) {
      var enemy = this.enemyPool.get(x,y,initialSpeed);

      if (enemy) {
        enemy.score = score;
        enemy.colorDelta = colorDelta;
      }

      x += width + 25;
      if (i % numOfCols == 0) {
        x = initialX;
        y -= spacer;
        score -= 5;
        colorDelta += 30;
      }
    }
  };

  var self = this;
  this.dropSpecialAbility = function () {
    var y = 0;
    var x = Math.floor(Math.random() * (self.mainCanvas.width + 1));
    var speed = -2.5;
    self.specialAbilityPool.get(x, y, speed);
  };

  // Start the animation loop
  this.start = function() {
    this.ship.draw();
    this.backgroundAudio.play();
    animate();
  };

  // Restart the game
  this.restart = function() {
    document.getElementById('game-over').style.display = "none";
    this.bgContext.clearRect(0, 0, this.bgCanvas.width, this.bgCanvas.height);
    this.shipContext.clearRect(0, 0, this.shipCanvas.width, this.shipCanvas.height);
    this.mainContext.clearRect(0, 0, this.mainCanvas.width, this.mainCanvas.height);

    this.quadTree.clear();

    this.background.init(0,0);
    this.ship.init(this.shipStartX, this.shipStartY,
      imageRepository.spaceship.width, imageRepository.spaceship.height);

    this.enemyPool.init("enemy");
    this.spawnWave();
    this.enemyBulletPool.init("enemyBullet");
    this.specialAbilityPool.init("specialAbility");

    this.specialAbilityHandle = setInterval(this.dropSpecialAbility, 5000);

    this.playerScore = 0;
    this.ship.lives = PLAYER_LIVES;

    this.backgroundAudio.currentTime = 0;
    this.backgroundAudio.play();

    this.start();
  };

  // Game over
  this.gameOver = function() {
    this.backgroundAudio.pause();
    clearInterval(this.specialAbilityHandle);
    clearInterval(this.timer);

    document.getElementById('game-over').style.display = "block";

    if (this.ship.lives == 0 ){
      // you lost
    } else if (this.playerScore < 100) {
      // you can do better
    } else if (this.playerScore < 250) {
      // winner
    } else if (this.playerScore >= 250) {
      // champion
    }
  };
}
