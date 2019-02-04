
var Zoom = {

  // Scale
  scale: 1,

  // Moving status
  move: false,

  // Backrgound resize
  updateSize: function(){
    var x = $(window).width();
    var y = $(window).height();
    if (x > y){
      $('#background').css('min-width', x + 'px')
      .css('height', 'auto');
    } else {
      $('#background').css('min-height', y + 'px')
      .css('width', 'auto');
    }
  },

  background: function(){
    $(window).on('resize', function(){
      Zoom.updateSize();
    });
    Zoom.updateSize();
  },

  // When move or zoom canvas
  zoomCanvas: function(){

    // On window mouseDown
    $(window).bind('mousedown', function(e) {
      if( e.which == 2 ) {
        e.preventDefault();
        // Start moving
        Ui.move = true;
        $('body').css('cursor', 'all-scroll');
      }
    });

    // On window mouseUp
    $(window).bind('mouseup', function(e) {
      if( e.which == 2 ) {
        e.preventDefault();
        // Stop moving
        Ui.move = false;
        $('body').css('cursor', 'crosshair');
      }
    });

    // On window mouseMove
    $(window).on('mousemove', function(e) {
      if(Ui.move == true){
        var width = $(window).width();
        var height = $(window).height();
        Board.originX = ((e.clientX*2 - (width / 2)) / Zoom.scale) - Board.Xtiles * Board.tileColumnOffset / 2;
        Board.originY = (e.clientY*2 - (height / 2)) / Zoom.scale;
      }

    });

    // On scrolling
    $(window).bind('wheel mousewheel DOMMouseScroll', function(event){
      var width = $(window).width();
      var height = $(window).height();
      if (event.originalEvent.wheelDelta > 0 || event.originalEvent.detail < 0) {
        if (Zoom.scale < 1.5){
          Zoom.scale += 0.1;
          Board.originX = ((width / 2) / Zoom.scale) - Board.Xtiles * Board.tileColumnOffset / 2;
          Board.originY = (height / 2) / Zoom.scale;
        }
      }
      else {
        if (Zoom.scale > 0.4){
          Zoom.scale -= 0.1;
          Board.originX = ((width / 2) / Zoom.scale) - Board.Xtiles * Board.tileColumnOffset / 2;
          Board.originY = (height / 2) / Zoom.scale;
        }
      }
    });

  }
}
