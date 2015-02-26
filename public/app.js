var socket = io();

// there's always exactly twelve notes
// { position : 0 to 12, index : 0 to however many ballz }
socket.on('update', function(opts){
  var $ball = $('.stripe-' + opts.index).find('.ball');
  $ball.css({
    bottom : opts.position/12 * 100 + '%'
  });
  $ball.addClass('move');
  setTimeout(function(){
    $ball.removeClass('move');
  }, 200);
});


// { index : 0 to however many ballz }
socket.on('beat', function(opts){
  var $ball = $('.stripe-' + opts.index).find('.ball');
  $ball.addClass('beat');
  setTimeout(function(){
    $ball.removeClass('beat');
  }, 200);
});
