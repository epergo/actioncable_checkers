$('#match').ready(function() {

});

function drawBoard(board) {
  setBoardSize();
  var board_w = $('#board').attr('width');
  var board_h = $('#board').attr('height');
  var cell_size = board_w / 10;

  $('#board').drawRect({
    fillStyle: '#000',
    x: 0, y: 0,
    width: board_w,
    height: board_w
  });

  var color = '#F5F6CE';
  for (var r = 0; r < board.status.length; r++) {
    var row = board.status[r];
    var color_c = color;
    for (var c = 0; c < row.length; c++) {
      $('#board').drawRect({
        fillStyle: color_c,
        x: (r * cell_size) + cell_size / 2, y: (c * cell_size) + cell_size / 2,
        width: cell_size,
        height: cell_size
      });

      var cell_content = board.status[c][r];
      var piece_color;
      if (cell_content != '0') {
        if (cell_content == '2') {
          piece_color = '#FAFAFA';
        } else {
          piece_color = '#3B240B';
        }
        $('#board').drawEllipse({
          fillStyle: piece_color,
          x: (r * cell_size) + cell_size / 2, y: (c * cell_size) + cell_size / 2,
          width: cell_size - cell_size / 3, height: cell_size - cell_size / 3
        });
      }
      color_c = swapColor(color_c);
    }
    color = swapColor(color);
  }
}

function swapColor(color) {
  if (color == '#F5F6CE') {
    color = 'black'
  } else {
    color = '#F5F6CE'
  }
  return color;
}

function setBoardSize() {
  var w = window.innerWidth / 2;
  var h = window.innerHeight / 2;
  $('#board').attr('width', w);
  $('#board').attr('height', w);
}