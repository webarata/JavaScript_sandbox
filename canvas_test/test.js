(function() {
  'use strict';

  const GAME = {
    MAX_BULLET: 5,
    BULLET_SPPET: 8,
    INTERVAL_MS: 100,
    PLAYER_SPEED: 5,
    ENEMY_COUNT: 5
  };

  const KeyCode = {
    SPACE: 32,
    LEFT: 37,
    RIGHT: 39,
    UP: 38,
    DOWN: 40
  };

  /* Canvas要素の定義など */
  const canvas = document.getElementById('canvas');
  const ctx = canvas.getContext('2d');

  class Field {
    constructor(width, height) {
      this.width = width;
      this.height = height;
    }
  }

  class Player {
    constructor(x, y, speed, field) {
      this.x = x;
      this.y = y;
      this.speed = speed;
      this.field = field;

      this.size = 10;

      this.bulletList = new Array(GAME.MAX_BULLET);
      for (let i = 0; i < GAME.MAX_BULLET; i++) {
        this.bulletList[i] = new Bullet(0, 0, 0, false);
      }
    }

    moveLeft() {
      this.x = this.x - this.speed;
      if (this.x < 0) {
        this.x = 0;
      }
    }

    moveRight() {
      this.x = this.x + this.speed;
      if (this.x >= this.field.width) {
        this.x = this.field.width;
      }
    }

    moveUp() {
      this.y = this.y - this.speed;
      if (this.y < 0) {
        this.y = 0;
      }
    }

    moveDown() {
      this.y = this.y + this.speed;
      if (this.y >= this.field.height) {
        this.y = this.field.height;
      }
    }
  }

  class Bullet {
    constructor(x, y, speed, live) {
      this.x = x;
      this.y = y;
      this.speed = speed;
      this.live = live;
    }
  }

  class Enemy {
    constructor(x, y, field) {
      this.x = x;
      thix.y = y;
      this.field = field;
    }
  }

  class Controller {
    constructor() {
      this.keyMap = new Map();

      document.addEventListener("keydown", this.onKeyDown.bind(this));
      document.addEventListener("keyup", this.onKeyUp.bind(this));

      const field = new Field(canvas.width, canvas.height);
      this.player = new GAME.Player(50, 200, GAME.PLAYER_SPEED, field);

      this.isShotOk = false;
      this.beforeShotTime = new Date();

      this.enemyList = new Array(GAME.ENEMY_COUNT);
    }

    onKeyDown(event) {
      this.keyMap.set(event.keyCode, true);
    }

    onKeyUp(event) {
      this.keyMap.set(event.keyCode, false);
    }

    movePlayer() {
      if (this.keyMap.get(KeyCode.LEFT)) this.player.moveLeft();
      if (this.keyMap.get(KeyCode.RIGHT)) this.player.moveRight();
      if (this.keyMap.get(KeyCode.UP)) this.player.moveUp();
      if (this.keyMap.get(KeyCode.DOWN)) this.player.moveDown();
    }

    drawPlayer() {
      ctx.beginPath();
      ctx.arc(this.player.x, this.player.y, this.player.size, 0, Math.PI * 2, true);
      ctx.fill();
    }

    updateShotInterval() {
      let nowTime = new Date();
      let interval = nowTime - this.beforeShotTime;
      if (!this.keyMap.get(KeyCode.SPACE)) return;
      if (interval > GAME.INTERVAL_MS) {
        this.isShotOk = true;
        this.beforeShotTime = nowTime;
      } else {
        this.isShotOk = false;
      }
    }

    checkShot() {
      if (!this.isShotOk) return;
      if (this.keyMap.get(KeyCode.SPACE)) {
        for (let i = 0; i < GAME.MAX_BULLET; i++) {
          if (!this.player.bulletList[i].live) {
            this.player.bulletList[i] = new GAME.Bullet(this.player.x, this.player.y, GAME.BULLET_SPPET, true);
            return;
          }
        }
      }
    }

    drawBullet() {
      for (let i = 0; i < this.player.bulletList.length; i++) {
        const bullet = this.player.bulletList[i];
        if (bullet.live) {
          bullet.y = bullet.y - bullet.speed;
          if (bullet.y < 0) {
            bullet.live = false;
          } else {
            ctx.beginPath();
            ctx.moveTo(bullet.x, bullet.y - 5);
            ctx.fillRect(bullet.x - 1, bullet.y - 3 , 3, 3);
          }
        }
      }
    }
  }

  GAME.Player = Player;
  GAME.Bullet = Bullet;
  GAME.Field = Field;
  GAME.Controller = Controller;

  const controller = new GAME.Controller();

  function mainLoop() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    controller.updateShotInterval();
    controller.checkShot();
    controller.movePlayer();
    controller.drawPlayer();
    controller.drawBullet();

    requestAnimationFrame(mainLoop);
  }

  requestAnimationFrame(mainLoop);
})();
