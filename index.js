const constant = require('./constant');
const validation = require('./validation');

const DIRECTIONS = [[-1, 0], [1, 0], [0, -1], [0, 1], [-1, -1], [-1, 1], [1, -1], [1, 1]];

function MakyekBoard(onUpdate) {
  this.size = 12;
  this.fnOnUpdate = onUpdate;
  this.clearBoard();
}

/**
 * Clear the board to initial state.
 */
MakyekBoard.prototype.clearBoard = function () {
  this.board = [];
  for (let i = 0; i < this.size; i++) {
    const boardRow = [];
    for (let j = 0; j < this.size; j++) {
      boardRow.push(constant.STATE_EMPTY);
    }
    this.board.push(boardRow);
  }

  for (let i = 0; i < 3; i++) {
    this.board[2][2 + i] = constant.STATE_WHITE;
    this.board[6][6 + i] = constant.STATE_WHITE;
    this.board[5][3 + i] = constant.STATE_BLACK;
    this.board[9][7 + i] = constant.STATE_BLACK;
  }
  for (let i = 0; i < 2; i++) {
    this.board[8 + i][2] = constant.STATE_WHITE;
    this.board[2 + i][9] = constant.STATE_BLACK;
  }
};

/**
 * Check whether the position is in range of board.
 */
MakyekBoard.prototype.inBound = function (x, y) {
  return x >= 0 && x < this.size && y >= 0 && y < this.size;
};

/**
 * Check whether there is an available placement for a specific player.
 */
MakyekBoard.prototype.hasAvailablePlacement = function (side) {
  validation.checkPlayerSide(side);

  for (let i = 0; i < 8; i++) {
    for (let x = 0; x < this.size; x++) {
      for (let y = 0; y < this.size; y++) {
        if (this.board[x][y] !== side) {
          continue;
        }
        const newX = x + DIRECTIONS[i][0];
        const newY = y + DIRECTIONS[i][1];
        if (this.inBound(newX, newY) && this.board[newX][newY] === constant.STATE_EMPTY) {
          return true;
        }
      }
    }
  }

  return false;
};

/**
 * Check whether a stone can be placed at a specified place.
 */
MakyekBoard.prototype.canPlaceAt = function (side, x, y, option) {
  validation.checkPlayerSide(side);
  validation.checkPlayerOption(option);

  if (this.board[x][y] !== side) {
    return false;
  }

  const newX = x + DIRECTIONS[option][0];
  const newY = y + DIRECTIONS[option][1];
  return !(!this.inBound(newX, newY) || this.board[newX][newY] !== constant.STATE_EMPTY);
};

MakyekBoard.prototype.getOtherSide = function (side) {
  return constant.STATE_REVERSE - side;
};

/**
 * Place a stone at specific position.
 *
 * The position must be validated via canPlaceAt before calling this function,
 * otherwise the behavior is unexpected.
 */
MakyekBoard.prototype.placeAt = function (side, x, y, option) {
  validation.checkPlayerSide(side);
  validation.checkPlayerOption(option);

  const newX = x + DIRECTIONS[option][0];
  const newY = y + DIRECTIONS[option][1];

  this.board[x][y] = constant.STATE_EMPTY;
  this.board[newX][newY] = side;

  const otherSide = this.getOtherSide(side);

  // Intervention
  const interventionDir = [[1, 0], [0, 1]];
  for (let i = 0; i < 2; i++) {
    const x1 = newX + interventionDir[i][0];
    const y1 = newY + interventionDir[i][1];
    const x2 = newX - interventionDir[i][0];
    const y2 = newY - interventionDir[i][1];
    if (this.inBound(x1, y1) && this.inBound(x2, y2) &&
      this.board[x1][y1] === otherSide && this.board[x2][y2] === otherSide) {
      this.board[x1][y1] = side;
      this.board[x2][y2] = side;
    }
  }

  // Custodian
  const custodianDir = [[1, 0], [-1, 0], [0, 1], [0, -1]];
  for (let i = 0; i < 4; i++) {
    const x1 = newX + custodianDir[i][0];
    const y1 = newY + custodianDir[i][1];
    const x2 = newX + (custodianDir[i][0] * 2);
    const y2 = newY + (custodianDir[i][1] * 2);
    if (this.inBound(x1, y1) && this.inBound(x2, y2) &&
      this.board[x1][y1] === otherSide && this.board[x2][y2] === side) {
      this.board[x1][y1] = side;
    }
  }

  if (this.fnOnUpdate) {
    this.fnOnUpdate(side, x, y, option);
  }
};

/**
 * Count stones.
 */
MakyekBoard.prototype.count = function () {
  const analytics = {};
  analytics[constant.STATE_EMPTY] = 0;
  analytics[constant.STATE_BLACK] = 0;
  analytics[constant.STATE_WHITE] = 0;
  for (let i = 0; i < this.size; i++) {
    for (let j = 0; j < this.size; j++) {
      analytics[parseInt(this.board[i][j], 10)]++;
    }
  }
  return analytics;
};

module.exports = {
  Board: MakyekBoard,
  STATE_EMPTY: constant.STATE_EMPTY,
  STATE_BLACK: constant.STATE_BLACK,
  STATE_WHITE: constant.STATE_WHITE,
};
