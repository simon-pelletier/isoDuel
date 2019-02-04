
var Character = {

  // Player position at spawn
  p1x: 0,
  p1y: 0,
  p2x: 0,
  p2y: 0,

  // Spawn distance between the two players // in tiles
  difference: 6,

  // Both players (object)
  player1: undefined,
  player2: undefined,

  // Player name (string)
  player1name: undefined,
  player2name: undefined,

  // Initialize Character objects
  initCharacter: function(id, name, avatar, positionX, positionY, health, state){
    this.id = id;
    this.name = name;
    this.avatar = avatar;
    this.positionX = positionX;
    this.positionY = positionY;
    this.health = health;
    this.inventaire = Weapon.hand;
    this.state = state;

    // Displays the container of the player's life
    var life = $('<div></div>')
    .addClass('life')
    .css('width', '200px')
    .css('height', '30px')
    .css('overflow', 'hidden')
    .css('margin', '0 auto')
    .attr('id', 'lifeB' + this.id)
    .appendTo('body');

    // Displays the player's life bar
    var lifeBar = $('<div></div>')
    .attr('id', 'life' + this.id)
    .css('background-color', '#60a343')
    .css('width', '200px')
    .css('height', '50px')
    .css('margin-left', (this.health*2)-200 + 'px')
    .appendTo('#lifeB' + this.id);

    // Avatar creation and player display
    this.avatarGen();
    this.showPlayer();
  },

  avatarGen: function(){
    // Turn this.avatar into an image object
    var avatarImg = new Image();
    avatarImg.src = 'img/' + this.avatar + '.png';
    this.avatar = avatarImg;
  },

  isOnWeapon(){
    // Compares the position of the player and the 4 ground weapons
    // Move to -5000; -5000 weapons taken into inventory
    // Drop the current weapon in inventory if! = American fist
    if (this.positionX-1 == Weapon.axe.positionX && this.positionY-1 == Weapon.axe.positionY){
      Ui.message(this.name + ' takes the axe !');
      this.avatar.src = 'img/player' + this.id + 'axe.png';
      Weapon.axe.positionX = -5000;
      Weapon.axe.positionY = -5000;
      this.dropWeapon(this.positionX-1,this.positionY-1);
      this.inventaire = Weapon.axe;
    } else if (this.positionX-1 == Weapon.bow.positionX && this.positionY-1 == Weapon.bow.positionY){
      Ui.message(this.name + ' takes the bow !');
      this.avatar.src = 'img/player' + this.id + 'bow.png';
      Weapon.bow.positionX = -5000;
      Weapon.bow.positionY = -5000;
      this.dropWeapon(this.positionX-1,this.positionY-1);
      this.inventaire = Weapon.bow;
    } else if (this.positionX-1 == Weapon.colt.positionX && this.positionY-1 == Weapon.colt.positionY){
      Ui.message(this.name + ' takes the colt !');
      this.avatar.src = 'img/player' + this.id + 'colt.png';
      Weapon.colt.positionX = -5000;
      Weapon.colt.positionY = -5000;
      this.dropWeapon(this.positionX-1,this.positionY-1);
      this.inventaire = Weapon.colt;
    } else if (this.positionX-1 == Weapon.plasmaGun.positionX && this.positionY-1 == Weapon.plasmaGun.positionY){
      Ui.message(this.name + ' takes the Plasma Gun ! Take care !');
      this.avatar.src = 'img/player' + this.id + 'plasmaGun.png';
      Weapon.plasmaGun.positionX = -5000;
      Weapon.plasmaGun.positionY = -5000;
      this.dropWeapon(this.positionX-1,this.positionY-1);
      this.inventaire = Weapon.plasmaGun;
    } else {

    }

    // Shows the player
    this.showPlayer();
  },

  dropWeapon: function(x, y){
    // Play a drop sound
    Character.soundPlay("sounds/drop.wav");

    // Position the weapons that are dropped
    if(this.inventaire.name == 'Axe'){
      Weapon.axe.positionX = x;
      Weapon.axe.positionY = y;
    }
    if(this.inventaire.name == 'Bow'){
      Weapon.bow.positionX = x;
      Weapon.bow.positionY = y;
    }
    if(this.inventaire.name == 'Colt'){
      Weapon.colt.positionX = x;
      Weapon.colt.positionY = y;
    }
    if(this.inventaire.name == 'PlasmaGun'){
      Weapon.plasmaGun.positionX = x;
      Weapon.plasmaGun.positionY = y;
    }
  },

  // Sets the coordinates of the players avoiding overlaps
  playerSpawn: function(){
    var isFree = true;
    do{
      this.spawnCoord();
      for (var i = 0; i < Helpers.allCoords.length; i++){
        if ((this.p1x == Helpers.allCoords[i].x && this.p1y == Helpers.allCoords[i].y) || (this.p2x == Helpers.allCoords[i].x && this.p2y == Helpers.allCoords[i].y) || (Math.abs(this.p1x - this.p2x) < this.difference && Math.abs(this.p1y - this.p2y) < this.difference)){
          isFree = false;
          i = Helpers.allCoords.length;
        } else {
          isFree = true;
        }
      }
    } while (isFree == false);
    Helpers.allCoords.push({'x':this.p1x, 'y':this.p1y});
    Helpers.allCoords.push({'x':this.p2x, 'y':this.p2y});

    // Generates the player object 1
    this.player1 = Object.create(Character);
    this.player1.initCharacter('1', this.player1name, 'player1', this.p1x, this.p1y, 100, 'stay');

    // Generates the player object 2
    this.player2 = Object.create(Character);
    this.player2.initCharacter('2', this.player2name, 'player2', this.p2x, this.p2y, 100, 'stay');
  },

  spawnCoord: function(){
    // Generate random spawn positions
    this.p1x = Helpers.getRandomNumber(1,Helpers.xMap);
    this.p1y = Helpers.getRandomNumber(1,Helpers.yMap);

    this.p2x = Helpers.getRandomNumber(1,Helpers.xMap);
    this.p2y = Helpers.getRandomNumber(1,Helpers.yMap);
  },

  showPlayer: function(){
    // Display UI name
    $('#name' + this.id).html(this.name).css('font-size', '1.8em').css('color', 'white');
    // Display UI Inventory
    $('#bag' + this.id).html(this.inventaire.name).css('color', '#69c4d1').css('margin-bottom', '50px');

    // Creates and adds to the DOM the image of the inventory and its container
    var bagImageContainer = $('<div></div>')
    .addClass('boxCurrentWeapon')
    .attr('id', 'boxCurrentWeapon' + this.id)
    .appendTo('#bag' + this.id);

    var bagImage = $('<img>')
    .attr('src', this.inventaire.img.src)
    .addClass('currentWeapon')
    .appendTo('#boxCurrentWeapon' + this.id);
  },

  // Check if players are within shooting range
  isWithinRange: function(ennemi, turn){
    Board.endTurn = 3;
    this.state = 'stay';

    var playerObj = this;
    var player = this.id;

    var returnTemp = new Array();
    var result = 0;

    var differenceX = Math.abs(ennemi.positionX - this.positionX);
    var differenceY = Math.abs(ennemi.positionY - this.positionY);

    var diffXreel = ennemi.positionX - this.positionX;
    var diffYreel = ennemi.positionY - this.positionY;

    // If they are, display the attack button
    if ((differenceY == 0 && differenceX <= this.inventaire.distance) || (differenceX == 0 && differenceY <= this.inventaire.distance)){

      // Check if there are no obstacles on the way between the players
      if (differenceX == 0){
        if (diffYreel > 0){
          for (var i = 0; i <= diffYreel; i++){
            for (var j = 0; j < Obstacle.obstacleTab.length; j++){
              if ((this.positionY+i) == Obstacle.obstacleTab[j].positionY && this.positionX == Obstacle.obstacleTab[j].positionX){
                returnTemp.push(1);
              } else {
                returnTemp.push(0);
              }
            }
          }
        } else if (diffYreel < 0){
          for (var i = 0; i >= diffYreel; i--){
            for (var j = 0; j < Obstacle.obstacleTab.length; j++){
              if ((this.positionY+i) == Obstacle.obstacleTab[j].positionY && this.positionX == Obstacle.obstacleTab[j].positionX){
                returnTemp.push(1);
              } else {
                returnTemp.push(0);
              }
            }
          }
        }
      } else if (differenceY == 0){
        if (diffXreel > 0){
          for (var i = 0; i <= diffXreel; i++){
            for (var j = 0; j < Obstacle.obstacleTab.length; j++){
              if ((this.positionX+i) == Obstacle.obstacleTab[j].positionX && this.positionY == Obstacle.obstacleTab[j].positionY){
                returnTemp.push(1);
              } else {
                returnTemp.push(0);
              }
            }
          }
        } else if (diffXreel < 0){
          for (var i = 0; i >= diffXreel; i--){
            for (var j = 0; j < Obstacle.obstacleTab.length; j++){
              if ((this.positionX+i) == Obstacle.obstacleTab[j].positionX && this.positionY == Obstacle.obstacleTab[j].positionY){
                returnTemp.push(1);
              } else {
                returnTemp.push(0);
              }
            }
          }
        }
      }

      // Analyze the results in array
      for (var i = 0; i < returnTemp.length; i++){
        // An obstacle on the road will add 1 to the result
        result += returnTemp[i];
      }

      // If the result is 0, there are no obstacles
      if (result == 0){
        // Display the attack button
        var choixAttaque = $('<button></button>')
        .attr('id', 'attaque')
        .addClass('choiceBtn')
        .text('ATTACK')
        .css('background-color', 'white')
        .one('click', function(event) {
          event.preventDefault();
          playerObj.attack(turn, player, this, ennemi);
        })
        .appendTo('#actions');
      }
    }

    // Display the defense button
    var choixDefense = $('<button></button>')
    .attr('id', 'defense')
    .addClass('choiceBtn')
    .text('DEFEND')
    .css('background-color', 'white')
    .one('click', function(event) {
      event.preventDefault();
      playerObj.defend(turn, player, this);
    })
    .appendTo('#actions');

    // Display the wait button
    var choixAttente = $('<button></button>')
    .attr('id', 'attente')
    .addClass('choiceBtn')
    .text('WAIT')
    .css('background-color', 'white')
    .one('click', function(event) {
      event.preventDefault();
      playerObj.wait(turn, player);
    })
    .appendTo('#actions');

  },

  // Action wait
  wait: function(turn, player){
    // Play the yawning sound
    Character.soundPlay("sounds/wait.wav");

    // Empty Dom Actions buttons
    $('#actions').empty();
    // Move to the next turn
    Board.changeTurn(turn);
  },

  // Action attack
  attack: function(turn, player, playerObj, ennemi){
    // Empty Dom Actions buttons
    $('#actions').empty();

    // Change player status
    this.state = 'attack';

    // Reset blood anim timer
    Board.bloodAnimX = 0;
    Board.bloodTimer = 0;

    // Play sounds according to the weapon used
    if (this.inventaire.name == 'American fist'){
      Character.soundPlay("sounds/fist.wav");
      Character.soundPlay("sounds/hurt4.wav");
    }
    if (this.inventaire.name == 'Axe'){
      Character.soundPlay("sounds/axe.wav");
      Character.soundPlay("sounds/hurt2.wav");
    }
    if (this.inventaire.name == 'Colt'){
      Character.soundPlay("sounds/colt.wav");
      Character.soundPlay("sounds/hurt1.wav");
    }
    if (this.inventaire.name == 'Bow'){
      Character.soundPlay("sounds/bow.wav");
      Character.soundPlay("sounds/hurt3.wav");
    }
    if (this.inventaire.name == 'PlasmaGun'){
      Character.soundPlay("sounds/plasmaGun.wav");
      Character.soundPlay("sounds/hurt3.wav");
    }

    // Decrements the life of the attacked player
    if (ennemi.state == 'defend'){
      ennemi.health -= this.inventaire.damages / 2;
      Ui.message(ennemi.name + ' takes ' + (this.inventaire.damages / 2) + ' damages ! <br/>Shield is life !');
    } else {
      ennemi.health -= this.inventaire.damages;
      Ui.message(ennemi.name + ' takes ' + this.inventaire.damages + ' damages !');
    }

    // Descend the life bar via css
    var ennemiName = ennemi.id;

    // Depending on the player is left or right
    if (ennemi.id == 1){
      // Move the life bar via css
      $('#life' + ennemiName )
      .css('margin-left', (ennemi.health*2)-200 + 'px');
    } else if (ennemi.id == 2){
      // Move the life bar via css
      $('#life' + ennemiName )
      .css('margin-left', 200-(ennemi.health*2) + 'px');
    }

    // Move to the next turn
    Board.changeTurn(turn);
  },

  soundPlay: function(sound){
    if (Ui.soundStatus == true){
      $.playSoundLoop(sound);
    }
  },

  // Action attack
  defend: function(turn, player, playerObj){
    // Play the shield sound
    Character.soundPlay("sounds/shield.wav");
    // Empty Dom Actions buttons
    $('#actions').empty();
    // Change player status
    this.state = 'defend';
    // Move to the next turn
    Board.changeTurn(turn);
  },

  isTooClose: function(){
    var player1X = Number(this.player1.positionX);
    var player1Y = Number(this.player1.positionY);
    var player2X = Number(this.player2.positionX)+1;
    var player2Xi = Number(this.player2.positionX)-1;
    var player2Y = Number(this.player2.positionY)+1;
    var player2Yi = Number(this.player2.positionY)-1;
    if ((player1X == player2X && player1Y == this.player2.positionY)
        || (player1X == player2Xi && player1Y == this.player2.positionY)
        || (player1Y == player2Y && player1X == this.player2.positionX)
        || (player1Y == player2Yi && player1X == this.player2.positionX)){
      Ui.duelToDeath('Duel To Death !!!');
      Ui.duel = 1;
      return true;
    } else {
      return false;
    }
  },

}
