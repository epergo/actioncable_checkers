"use strict";

// Match creator will always be 'white'

var EMPTY = '0';
var BLACK = '1';
var WHITE = '2';

var you_are = BLACK;
var your_id;
var game_board = {};
var game_board_backup = {};
var board_w;
var board_h;
var cell_size;
var selected_color = '#8A0808';
var selected_piece = [];
var piece_size;
var move_done = false;

function initGame(board, owner, user_id) {
  game_board = copyArrayByValue(board.status);
  game_board_backup = copyArrayByValue(board.status);
  your_id = user_id;

  if (owner) {
    you_are = WHITE;
  }

  setBoardSize();
  drawBoard();
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
      drawBoard();
      // Save selected
      selected_piece = [row, column];
      // Mark piece as selected (red color)
      drawPiece(getDrawPosition(row), getDrawPosition(column), piece_size, selected_color);
    }
  }

  if (cell_content == 0 && selected_piece.length > 0) {
    if (canMoveThere(selected_piece, [row, column])) {
      // Move done, update board
      drawBoard();

      // Flag
      move_done = true;
    }
  }
}

function canMoveThere(selected, destination) {
  // Distnace
  var d1 = Math.abs(destination[0] - selected[0]);
  var d2 = Math.abs(destination[1] - selected[1]);

  if (d1 == d2 && d1 == 1) {
    return normal_move(selected, destination);
  }

  if (d1 == d2 && d1 == 2) {
    // Trying to kill, huh?
    return kill_move(selected, destination);
  }
}

function kill_move(selected, destination) {
  // Intermediate cells
  var i_row = (destination[0] - selected[0]) / 2 + selected[0];
  var i_col = (destination[1] - selected[1]) / 2 + selected[1];
  var content = game_board[i_col][i_row];
  if (content != 0 && content != you_are) {
    game_board[i_col][i_row] = EMPTY;
    game_board[destination[1]][destination[0]] = game_board[selected[1]][selected[0]];

    return true;
  }

  return false;
}

function normal_move(selected, destination) {
  // Make the move
  game_board[destination[1]][destination[0]] = game_board[selected[1]][selected[0]];
  game_board[selected[1]][selected[0]] = EMPTY;
  return true;
}

function getDrawPosition(axis) {
  return (axis * cell_size) + cell_size / 2
}

function drawBoard() {
  var color = '#F6E3CE';
  for (var r = 0; r < game_board.length; r++) {
    var row = game_board[r];
    var color_c = color;
    for (var c = 0; c < row.length; c++) {
      drawCell((r * cell_size) + cell_size / 2, (c * cell_size) + cell_size / 2, color_c, cell_size);

      var cell_content = game_board[c][r];
      var piece_color;
      if (cell_content != EMPTY) {
        if (cell_content == WHITE) {
          piece_color = '#FAFAFA';
        } else {
          piece_color = '#6E6E6E';
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
  if (color == '#F6E3CE') {
    color = '#3B240B'
  } else {
    color = '#F6E3CE'
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
  if (whomoves() == your_id && !move_done) {
    return true;
  }

  return false;
}

function whomoves() {
  return $('#turn_of').attr('data-turnid');
}

function resetBoard() {
  if (whomoves() == your_id) {
    for (var i = 0; i < 10; i++) {
      for (var j = 0; j < 10; j++) {
        game_board[i][j] = game_board_backup[i][j];
      }
    }

    move_done = false;
    drawBoard();
  }
}

function copyArrayByValue(to_copy) {
  var result = [];
  for (var i = 0; i < 10; i++) {
    result[i] = to_copy[i].slice();
  }
  return result;
}

function update_players() {
  var p1 = $('.match_info').attr('data-user-creator');
  var p2 = $('.match_info').attr('data-user-opponent');
  $('#players').html(p1 + ' VS ' + p2);
}

/* ===== ACTION CABLE ===== */

$('#game').ready(function() {
  // Fill VS
  update_players();

  // Subscribe to game room channel
  App.game_room = App.cable.subscriptions.create('GameRoomsChannel', {
    game_room_id: $('.match_info').attr('data-matchid'),
    connected: function() {
      this.perform('follow', {
        game_room_id: this.game_room_id,
        user: $('#game').attr('data-username')
      });
    },
    received: function(data) {
      if (data.what == 'new_user') {
        // Log it
        $('#game_log').append('<p>A user has joined --> ' + data.user + '</p>');

        if ($('.match_info').attr('data-user-opponent') == "" && data.user != $('.match_info').attr('data-user-creator')) {
          $('.match_info').attr('data-user-opponent', data.user);
        }
        // Update 'VS' text
        update_players();
      } else if (data.what == 'update_data') {
        // Log it
        $('#game_log').append('<p>New move received</p>');

        game_board = copyArrayByValue(JSON.parse(data.board).status);
        $('#turn_of').html(data.turn_n);
        $('#turn_of').attr('data-turnid', data.turn);

        move_done = false;

        // Paint updated game board
        drawBoard();
      }
    },
    sendMove: function() {
      if (whomoves() == your_id && move_done) {
        this.perform('send_move', {
          game_board: game_board,
          game_room_id: this.game_room_id
        });
      }
    }
  });
});