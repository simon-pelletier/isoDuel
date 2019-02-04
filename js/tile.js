
var Tile = {

  // Size of the tiles in pixels
  width: 100,
  height: 300,

  // Number of Tiles images available in the 'img' folder
  tileNumber: 6,

  // Table containing all Tile objects
  myTiles: new Array(),

  // Initializes Tile objects
  initTile: function(type, image){
    this.type = type;
    this.image = image;
  },

  // Distribute tiles on the map randomly
  tileDistribution: function(column, row){
    for (var i = 0; i < column; i++){
      for (var j = 0; j < row; j++){
        var myTilesTemp = Object.create(Tile);
        // Creates the tile object
        myTilesTemp.initTile('ground', 'img/grass' + Helpers.getRandomNumber(1,this.tileNumber) + '.png');
        // Push the tile into an array
        this.myTiles.push(myTilesTemp);
      }
    }
  }
}
