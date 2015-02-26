var socket = io();

// there's always exactly twelve notes
// { position : 0 to 12, index : 0 to however many ballz }
socket.on('update', function(opts){
  var $ball = $('.stripe-' + opts.index);
  $ball.css({
    top : opts.position/12 * 100 + '%'
  });
});


// { index : 0 to however many ballz }
socket.on('beat', function(opts){
  var $ball = $('.stripe-' + opts.index);
  $ball.addClass('beat');
  setTimeout(function(){
    $ball.removeClass('beat');
  }, 500);
});
