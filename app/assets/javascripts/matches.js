"use strict";

// Match creator will always be 'white'

var EMPTY = '0';
var BLACK = '1';
var WHITE = '2';

var you_are = BLACK;
var game_board = {};
var board_w;
var board_h;
var cell_size;
var selected_color = '#8A0808';
var selected_piece = [];
var piece_size;

$('#match').ready(function() {

});

function initGame(board, owner) {
  game_board = board.status;

  if (owner) {
    you_are = WHITE;
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
  if (canIMove() && cell_content != 0) {
    if (cell_content == you_are) {
      // This cleans any previously selected piece
      drawBoard(game_board);
      // Save selected
      selected_piece = [row, column];
      // Mark piece as selected (red color)
      drawPiece(getDrawPosition(row), getDrawPosition(column), piece_size, selected_color);
    }
  }

  if (cell_content == 0 && selected_piece.length > 0) {
    if (canMoveThere(selected_piece, [row, column])) {
      // Move done, update board
      drawBoard(game_board);
    }
  }
}

function canMoveThere(selected, destination) {
  var d1 = Math.abs(destination[0] - selected[0]) == 1;
  var d2 = Math.abs(destination[1] - selected[1]) == 1;
  if (d1 && d2) {
    // Make the move
    game_board[destination[1]][destination[0]] = game_board[selected[1]][selected[0]];
    game_board[selected[1]][selected[0]] = EMPTY;
    return true;
  }

  return false;
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
      if (cell_content != EMPTY) {
        if (cell_content == WHITE) {
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

function canIMove() {
  if (whomoves() == you_are) {
    return true;
  }

  return false;
}

function whomoves() {
  return $('#turn_of').attr('data-turnid');
}