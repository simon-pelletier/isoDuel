
var Board = {

  // Game turn indicator element (animated sprite)
  indicator: undefined,

  // Shadow of game board (img)
  shadow: undefined,

  // Blood sprite and animation configuration
  blood: undefined,
  bloodTimer: 0,
  bloodAnimX: 0,

  // Shield (img)
  shield: undefined,

  // Array of the game board
  myMap: undefined,

  // Game Tour Variables
  turn: 0,
  endTurn: 0,

  // Configuring the tile display
  tileColumnOffset: 100, // pixels
  tileRowOffset: 50, // pixels

  originX: 0, // offset from left
  originY: 0, // offset from top

  Xtiles: 0, // Number of tiles in X-dimension
  Ytiles: 0, // Number of tiles in Y-dimension

  // Selected tile variables
  selectedTileX: -1,
  selectedTileY: -1,

  context: undefined,
  canvas: undefined,

  // Array of the tiles images
  tileImages: undefined,

  // Global Animation Setup
  startAnimationX: 0,
  decalageHover: 15,
  spriteSpeed: 50, // 50 by default
  spriteWidth: 100,
  frameNumber: 48-1,
  animationStartTab: undefined,
  baseAnimationStartTab: 0,
  spriteFullWidth: undefined,

  // Game status
  activated: true,

  // Obstacles status
  showObstacle: true,

  // On load the game board
  load: function() {
    // Create and place obstacles
    Obstacle.obstacleGen();

    // Spawn of the weapons
    Weapon.weaponSpawn();

    // Spawn of the players
    Character.playerSpawn();

    // Create arrays
    this.tileImages = new Array();
    this.myMap = new Array();

    // Distribute tiles on the map
    Tile.tileDistribution(Helpers.xMap,Helpers.yMap);

    // Setup Global sprite animations
    this.animationStartTab = new Array();
    this.spriteFullWidth = this.spriteWidth * this.frameNumber;

    for (var a = 0; a < this.frameNumber; a++){
      this.animationStartTab.push(this.baseAnimationStartTab);
      this.baseAnimationStartTab = this.baseAnimationStartTab + 100;
    }

    // Generate the map
    this.generateMap();

    // Load all the images before we run the app
    var loadedImages = 0;
    var totalImages = Tile.myTiles.length;
    var self = this;
    for(var i = 0; i < Tile.myTiles.length; i++) {
      this.tileImages[i] = new Image();
      this.tileImages[i].onload = function() {
        if(++loadedImages >= totalImages) {
          self.run();
        }
      };
      this.tileImages[i].type = 'none';
      this.tileImages[i].src = Tile.myTiles[i].image;
    }

    // Create some image objects
    this.indicator = new Image();
    this.indicator.src = 'img/indicator.png';

    this.blood = new Image();
    this.blood.src = 'img/blood.png';

    this.shield = new Image();
    this.shield.src = 'img/shield.png';

    this.shadow = new Image();
    this.shadow.src = 'img/shadow.png';

    // Change the cursor
    $('body').css('cursor', 'crosshair');
  },

  // Generate the map (in rows and columns)
  generateMap: function(){
    var mySeed = 0;
    for (var i = 0; i < Helpers.xMap; i++){
      var myRowMap = new Array();
      for (var j = 0; j < Helpers.yMap; j++){
        var tileSelected = Helpers.getRandomNumber(0, Tile.myTiles.length)
        myRowMap.push(tileSelected);
        mySeed += tileSelected + '';
      }
      this.myMap.push(myRowMap);
    }
  },

  // When the game starts
  run: function() {
    // Setup canvas and context
    this.canvas = $('#isocanvas');
    this.context = this.canvas[0].getContext("2d");

    this.Xtiles = Helpers.xMap;
    this.Ytiles = Helpers.yMap;

    // Update the size of the canvas on resizing the window
    var self = this;
    $(window).on('resize', function(){
      self.updateCanvasSize();
    });

    // Get the tile selected on mouse move
    $(window).on('mousemove', function(e) {
      e.pageX = (e.pageX / Zoom.scale) - self.tileColumnOffset / 2 - self.originX;
      e.pageY = (e.pageY / Zoom.scale) - self.tileRowOffset / 2 - self.originY;

      tileX = Math.round(e.pageX / self.tileColumnOffset - e.pageY / self.tileRowOffset);
      tileY = Math.round(e.pageX / self.tileColumnOffset + e.pageY / self.tileRowOffset);
      self.selectedTileX = tileX;
      self.selectedTileY = tileY;
    });

    // Update canvas size once
    this.updateCanvasSize();

    // Launch zoom and move
    Zoom.zoomCanvas();

    // Loop for the Global Animation
    (function loop() {
      self.animateTiles();
      self.startAnimationX += self.spriteWidth;
      if (self.startAnimationX >= self.spriteFullWidth){
        self.startAnimationX = 0;
      }
      if (Board.activated == true){
        setTimeout(loop, self.spriteSpeed);
      }
    })();
  },

  // Update the canvas size
  updateCanvasSize: function() {
    // Get the windows size
    var width = $(window).width();
    var height = $(window).height();

    // And paste it on canvas size
    this.context.canvas.width  = width;
    this.context.canvas.height = height;

    // Update the origin points
    this.originX = ((width / 2) / Zoom.scale) - this.Xtiles * this.tileColumnOffset / 2;
    this.originY = (height / 2) / Zoom.scale;


  },

  // When the game turn change
  changeTurn: function(turn){
    this.turn = turn;
    this.endTurn = 0;
  },

  // Global Animation LOOP function
  animateTiles: function(){
    this.context.canvas.width = this.context.canvas.width;

    // Zoom by scale
    Board.context.scale(Zoom.scale, Zoom.scale);

    // Draw the board shadow
    this.context.drawImage(this.shadow, this.originX-30, this.originY-150);

    // Draw the ground with tiles
    for(var Xi = (this.Xtiles - 1); Xi >= 0; Xi--) {
      for(var Yi = 0; Yi < this.Ytiles; Yi++) {
        var idxA = this.myMap[Xi][Yi];
          if (this.selectedTileX == Xi && this.selectedTileY == Yi){
            this.drawTile(this.selectedTileX, this.selectedTileY, -(this.decalageHover), 0);
          } else {
            this.drawTile(Xi, Yi, 0, 0);
          }
      }
    }

    // When the game is OVER
    if (Character.player1.health <= 0){
      Ui.endGame(Character.player2);
    }
    if (Character.player2.health <= 0){
      Ui.endGame(Character.player1);
    }


    // PLAYER 1 TURN
    if (this.turn == 1 && this.endTurn == 0){
      Board.endTurn = 1;

      if(Character.isTooClose() == true){
        Character.player1.isWithinRange(Character.player2, 2);
      } else {
        $(window).one('click', function(event) {

          event.preventDefault();
          self.selectedTileX = tileX;
          self.selectedTileY = tileY;

          var Xa = Number(tileX+1);
          var Xb = Number(Character.player1.positionX);
          var Ya = Number(tileY+1);
          var Yb = Number(Character.player1.positionY);

          if ((Xa <= Xb+3 && Ya == Yb) && (Xa >= Xb-3 && Ya == Yb) || (Ya <= Yb+3 && Xa == Xb) && (Ya >= Yb-3 && Xa == Xb)){
              if (Board.isRoadFree(Xb, Yb, Xa, Ya, 1) == 0){
                Character.player1.positionX = this.selectedTileX+1;
                Character.player1.positionY = this.selectedTileY+1;
                Character.player1.isOnWeapon();
                Character.player1.isWithinRange(Character.player2, 2);
                Character.soundPlay("sounds/move.wav");
              } else {
                Character.soundPlay("sounds/error.wav");
                Board.endTurn = 0;
              }
          } else {
            Character.soundPlay("sounds/error.wav");
            Board.endTurn = 0;
          }
        });
      }
    }

    // PLAYER 2 TURN
    if (this.turn == 2 && this.endTurn == 0){
      Board.endTurn = 1;

      if(Character.isTooClose() == true){
        Character.player2.isWithinRange(Character.player1, 1);
      } else {
        $(window).one('click', function(event) {

          event.preventDefault();
          self.selectedTileX = tileX;
          self.selectedTileY = tileY;

          var Xa = Number(tileX+1);
          var Xb = Number(Character.player2.positionX);
          var Ya = Number(tileY+1);
          var Yb = Number(Character.player2.positionY);

          if ((Xa <= Xb+3 && Ya == Yb) && (Xa >= Xb-3 && Ya == Yb) || (Ya <= Yb+3 && Xa == Xb) && (Ya >= Yb-3 && Xa == Xb)){
            if (Board.isRoadFree(Xb, Yb, Xa, Ya, 2) == 0){
              Character.player2.positionX = this.selectedTileX+1;
              Character.player2.positionY = this.selectedTileY+1;
              Character.player2.isOnWeapon();
              Character.player2.isWithinRange(Character.player1, 1);
              Character.soundPlay("sounds/move.wav");
            } else {
              Character.soundPlay("sounds/error.wav");
              Board.endTurn = 0;
            }
          } else {
            Character.soundPlay("sounds/error.wav");
            Board.endTurn = 0;
          }
        });
      }
    }

    // Draw Diamond when mouse is over a tile
    if(this.isCursorOnMap()) {
      this.drawDiamond(this.selectedTileX, this.selectedTileY, 'white');
    }

    // Draw the shield if players are in defense mode
    if (Character.player1.state == 'defend'){
      this.drawPlayers(this.shield, Character.player1.positionX, Character.player1.positionY);
    }
    if (Character.player2.state == 'defend'){
      this.drawPlayers(this.shield, Character.player2.positionX, Character.player2.positionY);
    }

    // Draw the path and the range of the player 1
    if (this.turn == 1){
      if (Board.endTurn == 1){
        this.drawPath(Character.player1);
      } else {
        this.drawRange(Character.player1);
      }
    }

    // Draw the path and the range of the player 2
    if (this.turn == 2){
      if (Board.endTurn == 1){
        this.drawPath(Character.player2);
      } else {
        this.drawRange(Character.player2);
      }
    }

    // Draw the 4 weapons on the map
    this.drawElements(Weapon.axe.img, Weapon.axe.positionX, Weapon.axe.positionY);
    this.drawElements(Weapon.bow.img, Weapon.bow.positionX, Weapon.bow.positionY);
    this.drawElements(Weapon.colt.img, Weapon.colt.positionX, Weapon.colt.positionY);
    this.drawElements(Weapon.plasmaGun.img, Weapon.plasmaGun.positionX, Weapon.plasmaGun.positionY);

    // Draw the players
    this.drawPlayers(Character.player1.avatar, Character.player1.positionX, Character.player1.positionY);
    this.drawPlayers(Character.player2.avatar, Character.player2.positionX, Character.player2.positionY);

    // Draw Obstacles
    if (this.showObstacle == true){
      for (var o = 0; o < Obstacle.obstacleTab.length; o++){
        this.drawObstacles(Obstacle.obstacleTab[o].img, Obstacle.obstacleTab[o].positionX, Obstacle.obstacleTab[o].positionY);
      }
    } else {
      for (var o = 0; o < Obstacle.obstacleTab.length; o++){
        this.drawObstaclesHidden(Obstacle.obstacleTab[o].img, Obstacle.obstacleTab[o].positionX, Obstacle.obstacleTab[o].positionY);
      }
    }


    // Draw the player 1 turn indicator
    if (this.turn == 1){
      this.drawIndicator(Character.player1);
      if(Character.touche == 1 && this.bloodTimer < 48){
        this.bloodAnimX += self.spriteWidth;
        this.drawBlood(Character.player1);
        this.bloodTimer++;
      }
    }
    // Draw the player 2 turn indicator
    if (this.turn == 2 && this.bloodTimer < 48){
      this.drawIndicator(Character.player2);
      if(Character.touche == 1){
        this.bloodAnimX += self.spriteWidth;
        this.drawBlood(Character.player2);
        this.bloodTimer++;
      }
    }
  },

  // Check if the path is free
  isRoadFree: function(pX, pY, tX, tY, player){
    if (player == 1){
      if(tX == Character.player2.positionX && tY == Character.player2.positionY){
        return 1;
      }
    }
    if (player == 2){
      if(tX == Character.player1.positionX && tY == Character.player1.positionY){
        return 1;
      }
    }

    if ((tY <= 0 || tY > Helpers.yMap) || (tX <= 0 || tX > Helpers.xMap)){
      return 1;
    } else {
      var returnTemp = new Array();
      var result = 0;
      if(pX == tX){
        var diff = tY - pY;
        if (diff > 0){
          for (var i = 0; i <= diff; i++){
            for (var j = 0; j < Obstacle.obstacleTab.length; j++){
              if ((pY + i) == Obstacle.obstacleTab[j].positionY && pX == Obstacle.obstacleTab[j].positionX){
                returnTemp.push(1);
              } else {
                returnTemp.push(0);
              }
            }
          }
        } else if (diff < 0){
          for (var i = 0; i >= diff; i--){
            for (var j = 0; j < Obstacle.obstacleTab.length; j++){
              if ((pY + i) == Obstacle.obstacleTab[j].positionY && pX == Obstacle.obstacleTab[j].positionX){
                returnTemp.push(1);
              } else {
                returnTemp.push(0);
              }
            }
          }
        }
      } else if (pY == tY){
        var diff = tX - pX;
        if (diff > 0){
          for (var i = 0; i <= diff; i++){
            for (var j = 0; j < Obstacle.obstacleTab.length; j++){
              if ((pX + i) == Obstacle.obstacleTab[j].positionX && pY == Obstacle.obstacleTab[j].positionY){
                returnTemp.push(1);
              } else {
                returnTemp.push(0);
              }
            }
          }
        } else if (diff < 0){
          for (var i = 0; i >= diff; i--){
            for (var j = 0; j < Obstacle.obstacleTab.length; j++){
              if ((pX + i) == Obstacle.obstacleTab[j].positionX && pY == Obstacle.obstacleTab[j].positionY){
                returnTemp.push(1);
              } else {
                returnTemp.push(0);
              }
            }
          }
        }
      }
      for (var i = 0; i < returnTemp.length; i++){
        result += returnTemp[i];
      }
      return result;
    }
  },

  // Drawing Elements functions - weapon, indicator, player, tiles, diamond, range...
  drawElements: function(elt, Xi, Yi){
    var offX = Xi * this.tileColumnOffset / 2 + Yi * this.tileColumnOffset / 2 + this.originX;
    var offY = Yi * this.tileRowOffset / 2 - Xi * this.tileRowOffset / 2 + this.originY;
    sX = this.startAnimationX;
    this.context.drawImage(elt, sX, 0, 100, 200, offX, offY-135, 100, 200);
  },

  drawObstacles: function(elt, Xi, Yi){
    var offX = Xi * this.tileColumnOffset / 2 + Yi * this.tileColumnOffset / 2 + this.originX;
    var offY = Yi * this.tileRowOffset / 2 - Xi * this.tileRowOffset / 2 + this.originY;
    this.context.drawImage(elt, offX-100, offY-135);
  },

  drawObstaclesHidden: function(elt, Xi, Yi){
    this.context.globalAlpha = 0.4;
    var offX = Xi * this.tileColumnOffset / 2 + Yi * this.tileColumnOffset / 2 + this.originX;
    var offY = Yi * this.tileRowOffset / 2 - Xi * this.tileRowOffset / 2 + this.originY;
    this.context.drawImage(elt, offX-100, offY-135);

  },

  drawPlayers: function(elt, Xi, Yi){
    var offX = Xi * this.tileColumnOffset / 2 + Yi * this.tileColumnOffset / 2 + this.originX;
    var offY = Yi * this.tileRowOffset / 2 - Xi * this.tileRowOffset / 2 + this.originY;
    this.context.drawImage(elt, offX-100, offY-135);
  },

  drawIndicator: function(player){
    var offX = player.positionX * this.tileColumnOffset / 2 + player.positionY * this.tileColumnOffset / 2 + this.originX;
    var offY = player.positionY * this.tileRowOffset / 2 - player.positionX * this.tileRowOffset / 2 + this.originY;
    sX = this.startAnimationX;
    this.context.drawImage(this.indicator, sX, 0, 100, 200, offX-100, offY-135, 100, 200);
  },

  drawBlood: function(player){
    var offX = player.positionX * this.tileColumnOffset / 2 + player.positionY * this.tileColumnOffset / 2 + this.originX;
    var offY = player.positionY * this.tileRowOffset / 2 - player.positionX * this.tileRowOffset / 2 + this.originY;
    sX = this.startAnimationX;
    this.context.drawImage(this.blood, sX, 0, 100, 200, offX-100, offY-150, 100, 200);
  },

  isCursorOnMap: function() {
    return (this.selectedTileX >= 0 && this.selectedTileX < this.Xtiles &&
            this.selectedTileY >= 0 && this.selectedTileY < this.Ytiles);
  },

  drawTile: function(Xi, Yi, dec, sX) {
    var offX = Xi * this.tileColumnOffset / 2 + Yi * this.tileColumnOffset / 2 + this.originX;
    var offY = Yi * this.tileRowOffset / 2 - Xi * this.tileRowOffset / 2 + this.originY;
    var imageIndex = this.myMap[Xi][Yi];
    this.context.drawImage(this.tileImages[imageIndex], offX, offY - 135 - dec);
  },

  drawDiamond: function(Xi, Yi, color) {
    var offX = Xi * this.tileColumnOffset / 2 + Yi * this.tileColumnOffset / 2 + this.originX;
    var offY = Yi * this.tileRowOffset / 2 - Xi * this.tileRowOffset / 2 + this.originY;
    this.drawLine(offX, offY + this.tileRowOffset / 2, offX + this.tileColumnOffset / 2, offY, color);
    this.drawLine(offX + this.tileColumnOffset / 2, offY, offX + this.tileColumnOffset, offY + this.tileRowOffset / 2, color);
    this.drawLine(offX + this.tileColumnOffset, offY + this.tileRowOffset / 2, offX + this.tileColumnOffset / 2, offY + this.tileRowOffset, color);
    this.drawLine(offX + this.tileColumnOffset / 2, offY + this.tileRowOffset, offX, offY + this.tileRowOffset / 2, color);
  },

  drawRangeDiamond: function(Xi, Yi, color, size) {
    var offX = Xi * this.tileColumnOffset / 2 + Yi * this.tileColumnOffset / 2 + this.originX;
    var offY = Yi * this.tileRowOffset / 2 - Xi * this.tileRowOffset / 2 + this.originY;
    var radius = 5;
    this.context.beginPath();
    this.context.arc(offX + this.tileColumnOffset / 2, offY + this.tileRowOffset / 2, radius, 0, 2 * Math.PI, false);
    this.context.fillStyle = 'red';
    this.context.fill();
  },

  drawRange: function(player){
    var Xi = player.positionX-1;
    var Yi = player.positionY-1;
    var color = 'red';
    var offX = Xi * this.tileColumnOffset / 2 + Yi * this.tileColumnOffset / 2 + this.originX;
    var offY = Yi * this.tileRowOffset / 2 - Xi * this.tileRowOffset / 2 + this.originY;

    var range = player.inventaire.distance;

    //AXE X
    for (var i = 0; i > -range; i--){
      if (Xi+i-1 >= 0 && Xi+i-1 < Helpers.xMap){
        var isSomething = 0;
        for (var o = 0; o < Obstacle.obstacleTab.length; o++){
          if (Xi+i-1 == Obstacle.obstacleTab[o].positionX-1 && Yi == Obstacle.obstacleTab[o].positionY-1){
            isSomething = 1;
          }
        }
        if (isSomething == 0){
          this.drawRangeDiamond(Xi+i-1, Yi, color, 20);
        } else {
          i = -range;
        }
      }
    }

    for (var k = 0; k < range; k++){
      if (Xi+k+1 >= 0 && Xi+k+1 < Helpers.xMap){
        var isSomething = 0;
        for (var o = 0; o < Obstacle.obstacleTab.length; o++){
          if (Xi+k+1 == Obstacle.obstacleTab[o].positionX-1 && Yi == Obstacle.obstacleTab[o].positionY-1){
            isSomething = 1;
          }
        }
        if (isSomething == 0){
          this.drawRangeDiamond(Xi+k+1, Yi, color, 20);
        } else {
          k = range;
        }
      }
    }

    //AXE Y
    for (var j = 0; j > -range; j--){
      if (Yi+j-1 >= 0 && Yi+j-1 < Helpers.yMap){
        var isSomething = 0;
        for (var o = 0; o < Obstacle.obstacleTab.length; o++){
          if (Yi+j-1 == Obstacle.obstacleTab[o].positionY-1 && Xi == Obstacle.obstacleTab[o].positionX-1){
            isSomething = 1;
          }
        }
        if (isSomething == 0){
          this.drawRangeDiamond(Xi, Yi+j-1, color, 20);
        } else {
          j = -range;
        }
      }
    }

    for (var h = 0; h < range; h++){
      if (Yi+h+1 >= 0 && Yi+h+1 < Helpers.yMap){
        var isSomething = 0;
        for (var o = 0; o < Obstacle.obstacleTab.length; o++){
          if (Yi+h+1 == Obstacle.obstacleTab[o].positionY-1 && Xi == Obstacle.obstacleTab[o].positionX-1){
            isSomething = 1;
          }
        }
        if (isSomething == 0){
          this.drawRangeDiamond(Xi, Yi+h+1, color, 20);
        } else {
          h = range;
        }
      }
    }

  },

  drawPath: function(player){
    var Xi = player.positionX-1;
    var Yi = player.positionY-1;
    var color = 'white';
    var offX = Xi * this.tileColumnOffset / 2 + Yi * this.tileColumnOffset / 2 + this.originX;
    var offY = Yi * this.tileRowOffset / 2 - Xi * this.tileRowOffset / 2 + this.originY;

    //AXE X
    for (var i = 0; i > -4; i--){
      if (Xi+i >= 0 && Xi+i < Helpers.xMap){
        var isSomething = 0;
        for (var o = 0; o < Obstacle.obstacleTab.length; o++){
          if (Xi+i == Obstacle.obstacleTab[o].positionX-1 && Yi == Obstacle.obstacleTab[o].positionY-1){
            isSomething = 1;
          }
        }
        if (isSomething == 0){
          this.drawDiamond(Xi+i, Yi, color);
        } else {
          i = -4;
        }
      }
    }

    for (var k = 0; k < 4; k++){
      if (Xi+k >= 0 && Xi+k < Helpers.xMap){
        var isSomething = 0;
        for (var o = 0; o < Obstacle.obstacleTab.length; o++){
          if (Xi+k == Obstacle.obstacleTab[o].positionX-1 && Yi == Obstacle.obstacleTab[o].positionY-1){
            isSomething = 1;
          }
        }
        if (isSomething == 0){
          this.drawDiamond(Xi+k, Yi, color);
        } else {
          k = 4;
        }
      }
    }

    //AXE Y
    for (var j = 0; j > -4; j--){
      if (Yi+j >= 0 && Yi+j < Helpers.yMap){
        var isSomething = 0;
        for (var o = 0; o < Obstacle.obstacleTab.length; o++){
          if (Yi+j == Obstacle.obstacleTab[o].positionY-1 && Xi == Obstacle.obstacleTab[o].positionX-1){
            isSomething = 1;
          }
        }
        if (isSomething == 0){
          this.drawDiamond(Xi, Yi+j, color);
        } else {
          j = -4;
        }
      }
    }

    for (var h = 0; h < 4; h++){
      if (Yi+h >= 0 && Yi+h < Helpers.yMap){
        var isSomething = 0;
        for (var o = 0; o < Obstacle.obstacleTab.length; o++){
          if (Yi+h == Obstacle.obstacleTab[o].positionY-1 && Xi == Obstacle.obstacleTab[o].positionX-1){
            isSomething = 1;
          }
        }
        if (isSomething == 0){
          this.drawDiamond(Xi, Yi+h, color);
        } else {
          h = 4;
        }
      }
    }

  },

  drawLine: function(x1, y1, x2, y2, color) {
    color = typeof color !== 'undefined' ? color : 'white';
    this.context.strokeStyle = color;
    this.context.beginPath();
    this.context.lineWidth = 1;
    this.context.moveTo(x1, y1);
    this.context.lineTo(x2, y2);
    this.context.stroke();
  },

  // Randomly selects a player to start
  play: function(){
    this.turn = Helpers.getRandomNumber(1,3);
  }

}
