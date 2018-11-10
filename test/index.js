import test from 'ava';
import makyek from '../index';

function transformVisualBoard(visualBoard) {
  const board = [];
  for (let i = 0; i < visualBoard.length; i++) {
    const curRow = [];
    board.push(curRow);
    for (let j = 0; j < visualBoard.length; j++) {
      if (visualBoard[i][j] === '.') {
        curRow.push(makyek.STATE_EMPTY);
      } else if (visualBoard[i][j] === 'O') {
        curRow.push(makyek.STATE_BLACK);
      } else if (visualBoard[i][j] === 'X') {
        curRow.push(makyek.STATE_WHITE);
      }
    }
  }
  return board;
}

test('constructor', t => {
  const visualBoard = [
    'XXXXXXXX',
    '........',
    'XXXXXXXX',
    '........',
    '........',
    'OOOOOOOO',
    '........',
    'OOOOOOOO',
  ];
  const realBoard = transformVisualBoard(visualBoard);
  const board = new makyek.Board(8);
  t.deepEqual(board.board, realBoard);
});

test('inBound', t => {
  const size = 8;
  const board = new makyek.Board(size);
  t.is(board.inBound(-1, 0), false);
  t.is(board.inBound(size, 0), false);
  t.is(board.inBound(0, -1), false);
  t.is(board.inBound(0, size), false);
  t.is(board.inBound(0, 0), true);
});

test('hasAvailablePlacement1', t => {
  const board = new makyek.Board(8);
  const visualBoard = [
    'XXXXXXXX',
    '........',
    'XXXXXXXX',
    '........',
    '........',
    'OOOOOOOO',
    '........',
    'OOOOOOOO',
  ];
  board.board = transformVisualBoard(visualBoard);
  t.is(board.hasAvailablePlacement(makyek.STATE_BLACK), true);
});

test('hasAvailablePlacement2', t => {
  const board = new makyek.Board(8);
  const visualBoard = [
    'XXXXXXXX',
    'XXXXXXXX',
    'OOOOOOOO',
    '........',
    '........',
    '........',
    '........',
    'OOOOOOOO',
  ];
  board.board = transformVisualBoard(visualBoard);
  t.is(board.hasAvailablePlacement(makyek.STATE_WHITE), false);
});

test('canPlaceAt1', t => {
  const board = new makyek.Board(8);
  const visualBoard = [
    'XXXXXXXX',
    'XXXXXXXX',
    'OOOOOOOO',
    '........',
    '........',
    '........',
    '........',
    'OOOOOOOO',
  ];
  board.board = transformVisualBoard(visualBoard);
  t.is(board.canPlaceAt(makyek.STATE_WHITE, 0, 0, 1), false);
});

test('canPlaceAt2', t => {
  const board = new makyek.Board(8);
  const visualBoard = [
    'XXXXXXXX',
    'XXXXXXXX',
    'OOOOOOOO',
    '........',
    '........',
    '........',
    '........',
    'OOOOOOOO',
  ];
  board.board = transformVisualBoard(visualBoard);
  t.is(board.canPlaceAt(makyek.STATE_BLACK, 0, 0, 1), false);
});

test('canPlaceAt3', t => {
  const board = new makyek.Board(8);
  const visualBoard = [
    'XXXXXXXX',
    'XXXXXXXX',
    'OOOOOOOO',
    '........',
    '........',
    '........',
    '........',
    'OOOOOOOO',
  ];
  board.board = transformVisualBoard(visualBoard);
  t.is(board.canPlaceAt(makyek.STATE_BLACK, 7, 0, 3), false);
});

test('canPlaceAt4', t => {
  const board = new makyek.Board(8);
  const visualBoard = [
    'XXXXXXXX',
    'XXXXXXXX',
    'OOOOOOOO',
    '........',
    '........',
    '........',
    '........',
    'OOOOOOOO',
  ];
  board.board = transformVisualBoard(visualBoard);
  t.is(board.canPlaceAt(makyek.STATE_BLACK, 7, 0, 0), true);
});

const placeAtTestCases = [
  {
    beforeBoard: [
      'O.O.....',
      '.X......',
      '........',
      '........',
      '........',
      '........',
      '........',
      'OOOOOOOO',
    ],
    afterBoard: [
      'XXX.....',
      '........',
      '........',
      '........',
      '........',
      '........',
      '........',
      'OOOOOOOO',
    ],
    command: [makyek.STATE_WHITE, 1, 1, 0],
  },
  {
    beforeBoard: [
      'XO......',
      '..X.....',
      '........',
      '........',
      '........',
      '........',
      '........',
      'OOOOOOOO',
    ],
    afterBoard: [
      'XXX.....',
      '........',
      '........',
      '........',
      '........',
      '........',
      '........',
      'OOOOOOOO',
    ],
    command: [makyek.STATE_WHITE, 1, 2, 0],
  },
  {
    beforeBoard: [
      'XO.OX...',
      '..X.....',
      '........',
      '........',
      '........',
      '........',
      '........',
      'OOOOOOOO',
    ],
    afterBoard: [
      'XXXXX...',
      '........',
      '........',
      '........',
      '........',
      '........',
      '........',
      'OOOOOOOO',
    ],
    command: [makyek.STATE_WHITE, 1, 2, 0],
  },
  {
    beforeBoard: [
      '..O.....',
      'XO.X....',
      '..O.....',
      '........',
      '........',
      '........',
      '........',
      'OOOOOOOO',
    ],
    afterBoard: [
      '..X.....',
      'XXX.....',
      '..X.....',
      '........',
      '........',
      '........',
      '........',
      'OOOOOOOO',
    ],
    command: [makyek.STATE_WHITE, 1, 3, 2],
  },
];

placeAtTestCases.forEach((item, id) => {
  test(`placeAt${id}`, t => {
    const board = new makyek.Board(8);
    board.board = transformVisualBoard(item.beforeBoard);
    board.placeAt(...item.command);

    const realBoard = transformVisualBoard(item.afterBoard);
    t.deepEqual(board.board, realBoard);
  });
});

test('count', t => {
  const board = new makyek.Board(8);
  const visualBoard = [
    '.XXXX...',
    '........',
    '.OOO....',
    '........',
    '........',
    '........',
    '........',
    '.......O',
  ];
  board.board = transformVisualBoard(visualBoard);
  t.deepEqual(board.count(), {
    [makyek.STATE_EMPTY]: (8 * 8) - 8,
    [makyek.STATE_WHITE]: 4,
    [makyek.STATE_BLACK]: 4,
  });
});
