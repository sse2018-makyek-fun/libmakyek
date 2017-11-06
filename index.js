var constant = require('./constant');
var validation = require('./validation');
var HasPlacementJudger = require('./hasPlacementJudger');
var StoneFlipJudger = require('./stoneFlipJudger');

var RAD_DIRECTIONS = [[1,0],[1,-1],[0,-1],[-1,-1],[-1,0],[-1,1],[0,1],[1,1]];

function ReversiBoard(size, onUpdate) {
  if (size % 2 !== 0 || size <= 0) {
    throw new Error('invalid size');
  }
  this.size = size;
  this.fnOnUpdate = onUpdate;
  this.clearBoard();
}

/**
 * Clear the board to initial state.
 */
ReversiBoard.prototype.clearBoard = function () {
  this.board = [];
  for (var i = 0; i < this.size; i++) {
    var row = [];
    for (var j = 0; j < this.size; j++) {
      row.push(constant.STATE_EMPTY);
    }
    this.board.push(row);
  }
  var beginPos = this.size / 2 - 1;
  this.board[beginPos][beginPos] = constant.STATE_BLACK;
  this.board[beginPos][beginPos + 1] = constant.STATE_WHITE;
  this.board[beginPos + 1][beginPos] = constant.STATE_WHITE;
  this.board[beginPos + 1][beginPos + 1] = constant.STATE_BLACK;
};

/**
 * Check whether there is an available placement for a specific player.
 */
ReversiBoard.prototype.hasAvailablePlacement = function (side) {
  validation.checkPlayerSide(side);
  var iterations = [
    // 0         1         2             3             4        5
    // startRow, startCol, directionRow, directionCol, nextRow, nextCol
    [0, 0, 0, 1, 1, 0],               // right
    [0, 0, 1, 0, 0, 1],               // down
    [0, this.size - 1, 1, 1, 0, -1],  // right-down
    [1, 0, 1, 1, 1, 0],               // right-down
    [0, 0, 1, -1, 0, 1],              // left-down
    [1, this.size - 1, 1, -1, 1, 0],  // left-down
  ];
  var judger = new HasPlacementJudger(side);
  for (var i = 0; i < iterations.length; i++) {
    var iteration = iterations[i];
    var row = iteration[0];
    var col = iteration[1];
    while (row >= 0 && col >= 0 && row < this.size && col < this.size) {
      var cRow = row;
      var cCol = col;
      // asc order
      judger.reset();
      while (cRow >= 0 && cCol >= 0 && cRow < this.size && cCol < this.size) {
        var result = judger.next(this.board[cRow][cCol]);
        if (result) {
          return true;
        }
        cRow += iteration[2];
        cCol += iteration[3];
      }
      // desc order
      cRow -= iteration[2];
      cCol -= iteration[3];
      judger.reset();
      while (cRow >= 0 && cCol >= 0 && cRow < this.size && cCol < this.size) {
        var result = judger.next(this.board[cRow][cCol]);
        if (result) {
          return true;
        }
        cRow -= iteration[2];
        cCol -= iteration[3];
      }
      // prepare for next iteration
      row += iteration[4];
      col += iteration[5];
    }
  }
  return false;
};

/**
 * Check whether a stone can be placed at a specified place.
 */
ReversiBoard.prototype.canPlaceAt = function (side, row, col) {
  validation.checkPlayerSide(side);
  if (row < 0 || col < 0 || row >= this.size || col >= this.size) {
    return false;
  }
  if (this.board[row][col] !== constant.STATE_EMPTY) {
    return false;
  }
  var judger = new StoneFlipJudger(side);
  for (var i = 0; i < RAD_DIRECTIONS.length; i++) {
    var direction = RAD_DIRECTIONS[i];
    var cRow = row + direction[0];
    var cCol = col + direction[1];
    judger.reset();
    while (cRow >= 0 && cCol >= 0 && cRow < this.size && cCol < this.size) {
      var result = judger.next(this.board[cRow][cCol]);
      if (result === 0) {
        break;
      } else if (result > 0) {
        return true;
      }
      // else: result === -1
      cRow += direction[0];
      cCol += direction[1];
    }
  }
  return false;
};

ReversiBoard.prototype._placeAt = function (side, row, col) {
  this.board[row][col] = side;
  this.fnOnUpdate && this.fnOnUpdate(side, row, col);
};

/**
 * Place a stone at specific position.
 *
 * The position must be validated via canPlaceAt before calling this function,
 * otherwise the behavior is unexpected.
 */
ReversiBoard.prototype.placeAt = function (side, row, col) {
  validation.checkPlayerSide(side);
  this._placeAt(side, row, col);
  var judger = new StoneFlipJudger(side);
  for (var i = 0; i < RAD_DIRECTIONS.length; i++) {
    var direction = RAD_DIRECTIONS[i];
    // pre-walk to see how many stones can be flipped
    var cRow = row + direction[0];
    var cCol = col + direction[1];
    var flipStones = 0;
    judger.reset();
    while (cRow >= 0 && cCol >= 0 && cRow < this.size && cCol < this.size) {
      var result = judger.next(this.board[cRow][cCol]);
      if (result >= 0) {
        flipStones = result;
        break;
      }
      cRow += direction[0];
      cCol += direction[1];
    }
    // flip stones
    if (flipStones > 0) {
      var cRow = row + direction[0];
      var cCol = col + direction[1];
      while (flipStones > 0) {
        this._placeAt(side, cRow, cCol);
        flipStones--;
        cRow += direction[0];
        cCol += direction[1];
      }
    }
  }
};

module.exports = {
  Board: ReversiBoard,
  STATE_EMPTY: constant.STATE_EMPTY,
  STATE_BLACK: constant.STATE_BLACK,
  STATE_WHITE: constant.STATE_WHITE,
};
