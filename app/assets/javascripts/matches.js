// Match creator will always be 'white'
var game_board = {};
var you_are = '1';
var board_w;
var cell_size;
var selected_color = '#8A0808';
var piece_size;

$('#match').ready(function() {

});

function initGame(board, owner) {
  game_board = board.status;

  if (owner) {
    you_are = '2';
  }

  setBoardSize();
  drawBoard(game_board);
  $('#board').on('click', clickEvents);
}

function clickEvents(event) {
  var elemLeft = this.offsetLeft;
  var elemTop = this.offsetTop;
  var x = event.pageX - elemLeft;
  var y = event.pageY - elemTop;

  var row = Math.floor(x / cell_size);
  var column = Math.floor(y / cell_size);

  var cell_content = game_board[column][row];
  if (cell_content != 0) {
    if (cell_content == you_are) {
      drawBoard(game_board);
      drawPiece(getDrawPosition(row), getDrawPosition(column), piece_size, selected_color);
    }
  }
}

function getDrawPosition(axis) {
  return (axis * cell_size) + cell_size / 2
}

function drawBoard(board) {
  var color = '#F5F6CE';
  for (var r = 0; r < board.length; r++) {
    var row = board[r];
    var color_c = color;
    for (var c = 0; c < row.length; c++) {
      drawCell((r * cell_size) + cell_size / 2, (c * cell_size) + cell_size / 2, color_c, cell_size);

      var cell_content = board[c][r];
      var piece_color;
      if (cell_content != '0') {
        if (cell_content == '2') {
          piece_color = '#FAFAFA';
        } else {
          piece_color = '#3B240B';
        }
        drawPiece(getDrawPosition(r), getDrawPosition(c), piece_size, piece_color);
      }
      color_c = swapColor(color_c);
    }
    color = swapColor(color);
  }
}

function drawCell(x, y, color, size) {
  $('#board').drawRect({
    fillStyle: color,
    x: x, y: y,
    width: size,
    height: size
  });
}

function drawPiece(x, y, size, color) {
  $('#board').drawEllipse({
    fillStyle: color,
    x: x, y: y,
    width: size, height: size
  });
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

  board_w = w;
  board_h = h;
  cell_size = board_w / 10;
  piece_size = cell_size - cell_size / 3;
}