function EnemiesFireLogic(enemyPool) {
  this.enemyPool = enemyPool;

  this.randomEnemyShoot = function () {
    var liveEnemies = this.enemyPool.getPool();
    var enemyThatShouldFire = Math.floor(Math.random() * (liveEnemies.length - 1));

    liveEnemies.forEach(function (enemy, index) {
      enemy.shouldFire = index === enemyThatShouldFire
    })
  }
}