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
    '........',
    '........',
    'XXXX....',
    '....XXXX',
    'OOOO....',
    '....OOOO',
    '........',
    '........',
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

const hasAvailablePlacementTestCases = [
  {
    board: [
      '........',
      '........',
      'XXXX....',
      '....XXXX',
      'OOOO....',
      '....OOOO',
      '........',
      '........',
    ],
    side: makyek.STATE_BLACK,
    result: true,
  },
  {
    board: [
      '........',
      '........',
      '........',
      '........',
      '........',
      'XXXX....',
      'OOOOXXXX',
      'XXXXXXXX',
    ],
    side: makyek.STATE_BLACK,
    result: true,
  },
  {
    board: [
      '........',
      '........',
      '........',
      '........',
      '........',
      'XXXXX...',
      'OOOOXXXX',
      'XXXXXXXX',
    ],
    side: makyek.STATE_BLACK,
    result: false,
  },
];

hasAvailablePlacementTestCases.forEach((item, id) => {
  test(`hasAvailablePlacement${id}`, t => {
    const board = new makyek.Board(8);
    board.board = transformVisualBoard(item.board);
    t.is(board.hasAvailablePlacement(item.side), item.result);
  });
});

const canPlaceAtTeestCases = [
  {
    board: [
      'XXXXXXXX',
      'XXXXXXXX',
      'OOOOOOOO',
      '........',
      '........',
      '........',
      '........',
      'OOOOOOOO',
    ],
    command: [makyek.STATE_WHITE, 0, 0, 1],
    result: false,
  },
  {
    board: [
      'XXXXXXXX',
      'XXXXXXXX',
      'OOOOOOOO',
      '........',
      '........',
      '........',
      '........',
      'OOOOOOOO',
    ],
    command: [makyek.STATE_BLACK, 0, 0, 1],
    result: false,
  },
  {
    board: [
      'XXXXXXXX',
      'XXXXXXXX',
      'OOOOOOOO',
      '........',
      '........',
      '........',
      '........',
      'OOOOOOOO',
    ],
    command: [makyek.STATE_BLACK, 7, 0, 3],
    result: false,
  },
  {
    board: [
      'XXXXXXXX',
      'XXXXXXXX',
      'OOOOOOOO',
      '........',
      '........',
      '........',
      '........',
      'OOOOOOOO',
    ],
    command: [makyek.STATE_BLACK, 7, 0, 0],
    result: true,
  },
];

canPlaceAtTeestCases.forEach((item, id) => {
  test(`canPlaceAt${id}`, t => {
    const board = new makyek.Board(8);
    board.board = transformVisualBoard(item.board);
    t.is(board.canPlaceAt(...item.command), item.result);
  });
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
  {
    beforeBoard: [
      'O.O.....',
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
    command: [makyek.STATE_WHITE, 1, 2, 4],
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
