var Helpers = {

  // Contains all placed item coordinates
  allCoords: new Array(),

  // Size of the map
  xMap: 10,
  yMap: 10,

  // Number of obstacles
  obstacleNumber: 20,

  // returns a random number between min (included) and max (excluded)
  getRandomNumber: function(min, max){
    return Math.floor(min + Math.random()*(max - min));
  },

  // returns x and y coordinates if they are not taken
  generateCoords: function(){
    var isFree = true;
    do{
      var xT = Helpers.getRandomNumber(1,Helpers.xMap) +1;
      var yT = Helpers.getRandomNumber(1,Helpers.yMap) +1;
      for (var i = 0; i < this.allCoords.length; i++){
        if (xT == this.allCoords[i].x && yT == this.allCoords[i].y){
          isFree = false;
          i = this.allCoords.length;
        } else {
          isFree = true;
        }
      }
    } while (isFree == false);
    this.allCoords.push({'x':xT, 'y':yT});
    return (xT-1) + ';' + (yT-1);
  }
}
