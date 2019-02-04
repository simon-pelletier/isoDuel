
var Obstacle = {

  // Contains all Obstacle objects
  obstacleTab: new Array(),
  // Temporary Table of Obstacles
  obstacleTabTemporaire: new Array(),
  // Number of obstacle pictures available in 'img'
  numberImagesObstacles: 7,

  // Initialize Obstacle objects
  initObstacle: function(type, img, positionX, positionY){
    this.type = type;
    this.img = img;
    this.positionX = positionX;
    this.positionY = positionY;
    this.imageSetup();
  },

  // Generates placement of obstacles by avoiding overlaps on the Temporary Table
  obstacleGen: function(){
    var img = Helpers.getRandomNumber(1,this.numberImagesObstacles);
    var x = Helpers.getRandomNumber(1, Helpers.xMap);
    var y =Helpers.getRandomNumber(1, Helpers.yMap);

    var obstaclesNumber = Number(Helpers.obstacleNumber);

    for (var i = 0; i < Helpers.obstacleNumber; i++){
      var isAlreadySet = 0;

      var maxX = Number(Helpers.xMap) + 1;
      var maxY = Number(Helpers.yMap) + 1;

      var img = Helpers.getRandomNumber(1,this.numberImagesObstacles);
      var x = Helpers.getRandomNumber(1, maxX);
      var y =Helpers.getRandomNumber(1, maxY);

      for (var j = 0; j < this.obstacleTabTemporaire.length; j++){
        if (x == this.obstacleTabTemporaire[j].positionX && y == this.obstacleTabTemporaire[j].positionY){
          Helpers.obstacleNumber = Helpers.obstacleNumber + 1;
          isAlreadySet = 1;
        } else {

        }
      }
      if (isAlreadySet == 0){
        var obstacleTemp = Object.create(Obstacle);
        obstacleTemp.initObstacle('fixe', 'ob' + img + '.png', x, y);
        this.obstacleTabTemporaire.push(obstacleTemp);
        Helpers.allCoords.push({'x': x, 'y': y});
      }
    }
    this.obstacleTabTemporaire.sort(function (a, b) {
      return (b.positionX) - (a.positionX);
    });

    // Then create the final table
    this.obstacleTab = this.obstacleTabTemporaire;
  },

  // Sets the image associated with obstacles in html object
  imageSetup: function(){
    var obstacleImg = new Image();
    obstacleImg.src = 'img/' + this.img;
    this.img = obstacleImg;
  }

}
