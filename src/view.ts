import type { FixedLengthArray } from "type-fest";

const fArray = <T, U extends number>(value: () => T, size: U) =>
  Array.from(Array(size), value) as unknown as FixedLengthArray<T, U>;

const mapFArray = <T, U, V extends number>(
  arr: FixedLengthArray<T, V>,
  fn: (value: T) => U,
): FixedLengthArray<U, V> => arr.map(fn) as unknown as FixedLengthArray<U, V>;

interface AbstractCellBrand {
  readonly AbstractCell: unique symbol;
}

export type AbstractCell = string & AbstractCellBrand;

const abstractCells = (s: string) => s.split("") as AbstractCell[];

export type Row<T> = FixedLengthArray<T, 6>;

const makeRow = <T>(value: T): Row<T> => fArray(() => value, 6);

export type Board<T> = FixedLengthArray<Row<T>, 12>;

const makeBoard = <T>(value: T): Board<T> => fArray(() => makeRow(value), 12);

export const mapBoard = <T, U>(board: Board<T>, fn: (cell: T) => U): Board<U> =>
  mapFArray(board, (row) => mapFArray(row, fn));

export type Next<T> = FixedLengthArray<T, 2>;

const makeNext = <T>(value: T): Next<T> => fArray(() => value, 2);

export const mapNext = <T, U>(next: Next<T>, fn: (cell: T) => U): Next<U> =>
  mapFArray(next, fn);

export const parseNext = (s: string, defaultCell: AbstractCell) => {
  const next = makeNext(defaultCell);

  for (const [idx, c] of abstractCells(s).slice(0, next.length).entries()) {
    next[idx] = c;
  }

  return next;
};

export const parseNextList = (
  s: string,
  defaultCell: AbstractCell,
): Next<AbstractCell>[] => {
  const twos = s.replace(/[\r\n]/gm, "").match(/.{1,2}/g);

  return twos?.map((two) => parseNext(two, defaultCell)) ?? [];
};

const parseRow = (s: string, defaultCell: AbstractCell) => {
  const row = makeRow(defaultCell);

  for (const [idx, c] of abstractCells(s).slice(0, row.length).entries()) {
    row[idx] = c;
  }

  return row;
};

export const parseBoard = (s: string, defaultCell: AbstractCell) => {
  const board = makeBoard(defaultCell);

  // 下から読む
  for (const [idx, line] of s
    .split("\n")
    .reverse()
    .slice(0, board.length)
    .entries()) {
    board[board.length - 1 - idx] = parseRow(line, defaultCell);
  }

  return board;
};

export function shuffle(array: any[]) {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
    [array[i], array[j]] = [array[j], array[i]];
  }
}

export type TagMap = Map<AbstractCell, string>;

const colorizeRandom = (
  cells: Set<AbstractCell>,
  random_options: Set<string>,
): TagMap => {
  const optsSet = new Set(random_options);
  let additonalColorCount = 0;
  while (optsSet.size < cells.size) {
    optsSet.add(`color${additonalColorCount++}`);
  }
  const optsArr = Array.from(optsSet);
  shuffle(optsArr);

  return new Map(Array.from(cells).map((c, idx) => [c, optsArr[idx]]));
};

export const filterRestCells = (
  cells: Set<AbstractCell>,
  fixed_cells: TagMap,
): Set<AbstractCell> =>
  new Set(
    Array.from(cells).flatMap((cell) => (fixed_cells.has(cell) ? [] : [cell])),
  );

export const tagMapFromObj = (obj: Record<string, AbstractCell[]>) =>
  new Map(
    Object.entries(obj).flatMap(([tag, cells]): [AbstractCell, string][] =>
      cells.map((cell) => [cell, tag]),
    ),
  );

export const materializeRandom = (
  cells: Set<AbstractCell>,
  fixed_cells: TagMap,
  random_options: Set<string>,
): TagMap => {
  const restCells = filterRestCells(cells, fixed_cells);
  const colorMap = colorizeRandom(restCells, random_options);
  return new Map([...fixed_cells, ...colorMap]);
};

const setCell = (cell: HTMLTableCellElement, value: string) => {
  cell.setAttribute("class", value);
};

export const drawBoard = (board: Board<string>, table: HTMLTableElement) => {
  board.forEach((row, rowNum) => {
    row.forEach((material, colNum) => {
      const cell = table.rows[rowNum].cells[colNum];
      setCell(cell, material);
    });
  });
};

export const drawNext = (next: Next<string>, table: HTMLTableElement) => {
  next.forEach((material, num) => {
    const cell = table.rows[num].cells[0];
    setCell(cell, material);
  });
};

const MSG_CELL_RE = /\{\{\s*(\S)\s*\}\}/gm;

export const extractMsgCells = (msg: string) => {
  return Array.from(
    msg.matchAll(MSG_CELL_RE),
    (match) => match[1] as AbstractCell,
  );
};

export const replaceMsgCells = (
  msg: string,
  map: (cell: AbstractCell, original: string) => string,
) => {
  return msg.replaceAll(MSG_CELL_RE, (match, cell: AbstractCell) =>
    map(cell, match),
  );
};

export interface AnkiPuyo {
  realFrontBoard: Board<string>;
  realFrontNextList: Next<string>[];
  realFrontMsgHtml: string;
  realBackBoard: Board<string>;
  realBackNextList: Next<string>[];
  realBackMsgHtml: string;
}
