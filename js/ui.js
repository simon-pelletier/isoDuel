var Ui = {

  // Messages display time
  messageDuration: 2000, // ms

  // Title of the game
  title: 'ISODUEL',

  // Minimum and maximum map size (in tiles)
  minMapSize: 9,
  maxMapSize: 15,

  // Minimum and maximum number of obstacles on the map
  minObstacles: 0,
  maxObstacles: 50,

  // Status of the duel mode
  duel: 0,

  // Ambient sound
  myAudio: undefined,

  // Sound statuts
  soundStatus: true,

  // Launches a new game
  newGame: function(){
    this.myAudio = new Audio('sounds/background.mp3');
    this.myAudio.addEventListener('ended', function() {
        this.currentTime = 0;
        this.play();
    }, false);

    // Position and resize background
    Zoom.background();

    // Ambiant sound volume
    this.myAudio.volume = 0.5;

    // Hide the players infos
    $('#p1bg').hide();
    $('#p2bg').hide();

    // Launch the start menu
    this.showStartMenu();
    // Show range inputs values
    this.showVal();
  },

  // Button for sound On
  soundOn: function(){
    $('#soundControl').html('');
    var soundOn = $('<img/>')
    .attr('id', 'soundControlContent')
    .css('cursor','pointer')
    .click(function(){
      Ui.soundOff();
      Ui.soundStatus = false;
      Ui.myAudio.pause();
    })
    .attr('src', 'img/soundOn.png');
    $('#soundControl').append(soundOn);
  },

  // Button for sound Off
  soundOff: function(){
    $('#soundControl').html('');
    var soundOff = $('<img/>')
    .attr('id', 'soundControlContent')
    .css('cursor','pointer')
    .click(function(){
      Ui.soundStatus = true;
      Ui.soundOn();
      Ui.myAudio.play();
    })
    .attr('src', 'img/soundOff.png');
    $('#soundControl').append(soundOff);
  },

  // Button for obstacles On
  obstacleOn: function(){
    $('#obControl').html('');
    var obOn = $('<img/>')
    .attr('id', 'obControlContent')
    .css('cursor','pointer')
    .click(function(){
      Ui.obstacleOff();
      Board.showObstacle = false;
    })
    .attr('src', 'img/obOn.png');
    $('#obControl').append(obOn);
  },

  // Button for obstacles Off
  obstacleOff: function(){
    $('#obControl').html('');
    var obOff = $('<img/>')
    .attr('id', 'obControlContent')
    .css('cursor','pointer')
    .click(function(){
      Ui.obstacleOn();
      Board.showObstacle = true;
    })
    .attr('src', 'img/obOff.png');
    $('#obControl').append(obOff);
  },

  // Show the input values at the start menu
  showVal: function(){
    $('#mapSizeValue').html('Map Size : ' + $('#mapSizeRange').val());
    $('#nbObstaclesValue').html('Obstacles number : ' + $('#nbObstaclesRange').val());
  },

  modifyVal: function(){
    if ($('#mapSizeRange').val() < 12 ){
      this.maxObstacles = 25;
      $('#nbObstaclesRange').remove();

      var nbObstacles = $('<input></input>')
      .attr('type', 'range')
      .attr('min', this.minObstacles)
      .attr('max', this.maxObstacles)
      .attr('value', '15')
      .attr('step', '5')
      .attr('onchange', 'Ui.showVal()')
      .addClass('rangeType')
      .attr('id', 'nbObstaclesRange');
      $('#nbObstacles').append(nbObstacles);
    } else {
      this.maxObstacles = 50;
      $('#nbObstaclesRange').remove();

      var nbObstacles = $('<input></input>')
      .attr('type', 'range')
      .attr('min', this.minObstacles)
      .attr('max', this.maxObstacles)
      .attr('value', '25')
      .attr('step', '5')
      .attr('onchange', 'Ui.showVal()')
      .addClass('rangeType')
      .attr('id', 'nbObstaclesRange');
      $('#nbObstacles').append(nbObstacles);
    }
    this.showVal();
  },

  // Setup the new game
  setupGame: function(){
    // Reset the turns and mods
    Ui.duel = 0;
    Board.endTurn = 0;

    // Send the names of the players
    Character.player1name = $('#p1name').val();
    Character.player2name = $('#p2name').val();

    // Send the size of the map
    Helpers.xMap = Number($('#mapSizeRange').val());
    Helpers.yMap = Number($('#mapSizeRange').val());

    // Sets the number of obstacles
    Helpers.obstacleNumber = Number($('#nbObstaclesRange').val());

    // Set the sounds On
    this.soundOn();

    // Set the obstacles On
    this.obstacleOn();

    // Show the players infos
    $('#p1bg').show();
    $('#p2bg').show();

    // Randomly select a player to start
    Board.play();

    // Remove the Ui div
    $('#ui').remove();
  },

  // When the game is Over
  endGame: function(player){
    // Stop the game board animation
    Board.activated = false;

    // Play the victory sound
    Character.soundPlay("sounds/win.wav");

    // Remove the game elements
    $('#actions').remove();
    $('#isocanvas').remove();
    $('#info1').remove();
    $('#info2').remove();
    $('#obControl').html('');
    $('#soundControl').html('');
    console.log(player.avatar);
    console.log(player.avatar.src);

    // Remove the looser
    if(player.id == 1){
      $('#p2bg').remove();
      $('#lifeB2').remove();
    } else {
      $('#p1bg').remove();
      $('#lifeB1').remove();
    }


    // Show the Winner pseudo
    $('#winner').html(player.name + ' win !!!<br/>');

    // Shows the restart button
    var button = $('<button></button>')
    .text('PLAY AGAIN')
    .addClass('btn')
    .one('click', function(event) {
      event.preventDefault();
      // On click -> Reload the page
      location.reload();
    })
    .attr('id', 'playAgainButton');
    $('#winner').append(button);
  },

  // Displays the start menu
  showStartMenu: function(){
    var uiContainer = $('<div></div>')
    .attr('id', 'ui');
    $('body').append(uiContainer);

    var title = $('<h1></h1>')
    .text(this.title)
    .attr('id', 'titleGame');
    $('#ui').append(title);

    var playerNames = $('<div></div>')
    .attr('id', 'playerNames');
    $('#ui').append(playerNames);


    var p1 = $('<input></input>')
    .val('Player 1')
    .attr('id', 'p1name')
    .attr('onClick', 'SelectAll("p1name")');
    $('#playerNames').append(p1);

    var p2 = $('<input></input>')
    .val('Player 2')
    .attr('id', 'p2name')
    .attr('onClick', 'SelectAll("p2name")');
    $('#playerNames').append(p2);

    var mapSetup = $('<div></div>')
    .attr('id', 'mapSetup');
    $('#ui').append(mapSetup);

    var mapSizeValue = $('<div></div>')
    .attr('id', 'mapSizeValue');
    $('#mapSetup').append(mapSizeValue);

    var mapSize = $('<div></div>')
    .attr('id', 'mapSize');
    $('#mapSetup').append(mapSize);

    var nbObstaclesValue = $('<div></div>')
    .attr('id', 'nbObstaclesValue');
    $('#mapSetup').append(nbObstaclesValue);

    var nbObstacles = $('<div></div>')
    .attr('id', 'nbObstacles');
    $('#mapSetup').append(nbObstacles);

    var mapSize = $('<input></input>')
    .attr('type', 'range')
    .attr('min', this.minMapSize)
    .attr('max', this.maxMapSize)
    .attr('value', '12')
    .attr('step', '3')
    .attr('onchange', 'Ui.showVal(); Ui.modifyVal();')
    .addClass('rangeType')
    .attr('id', 'mapSizeRange');
    $('#mapSize').append(mapSize);

    var nbObstacles = $('<input></input>')
    .attr('type', 'range')
    .attr('min', this.minObstacles)
    .attr('max', this.maxObstacles)
    .attr('value', '25')
    .attr('step', '5')
    .attr('onchange', 'Ui.showVal()')
    .addClass('rangeType')
    .attr('id', 'nbObstaclesRange');
    $('#nbObstacles').append(nbObstacles);

    // On click -> launch the game
    var button = $('<button></button>')
    .addClass('btn')
    .text('PLAY')
    .one('click', function(event) {
      event.preventDefault();
      // Start the music
      Ui.myAudio.play();
      // Setup the game
      Ui.setupGame();
      // Load the game board
      Board.load();
    })
    .attr('id', 'playButton');
    $('#ui').append(button);
  },

  // When players are side by side
  duelToDeath: function(msg){
    // Announces the beginning of the duel
    if (this.duel == 0){
      $('#message').html(msg).css('visibility', 'visible');
      setTimeout(function() {
        $('#message').html('');
      }, this.messageDuration*2);
    }
  },

  // Displays game messages
  message: function(msg){
    $('#message').html(msg).css('visibility', 'visible');
    setTimeout(function() {
      $('#message').html('');
    }, this.messageDuration);
  },

}
