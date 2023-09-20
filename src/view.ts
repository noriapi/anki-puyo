import type { FixedLengthArray } from "type-fest";

const fArray = <T, U extends number>(value: () => T, size: U) =>
  Array.from(Array(size), value) as unknown as FixedLengthArray<T, U>;

const mapFArray = <T, U, V extends number>(
  arr: FixedLengthArray<T, V>,
  fn: (value: T) => U
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

export type Next<T> = FixedLengthArray<T, 2>;

const makeNext = <T>(value: T): Next<T> => fArray(() => value, 2);

export const parseNext = (s: string, defaultCell: AbstractCell) => {
  const next = makeNext(defaultCell);

  for (const [idx, c] of abstractCells(s).slice(0, next.length).entries()) {
    next[idx] = c;
  }

  return next;
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

export type Data<T> = {
  board: Board<T>;
  next1: Next<T>;
  next2: Next<T>;
};

const mapData = <T, U>(data: Data<T>, fn: (cell: T) => U): Data<U> => ({
  board: mapFArray(data.board, (row) => mapFArray(row, fn)),
  next1: mapFArray(data.next1, fn),
  next2: mapFArray(data.next2, fn),
});

export type AbstractData = Data<AbstractCell>;
export type MaterialData = Data<string>;

export const parseData = (
  boardSrc: string,
  nextSrc: string,
  defaultCell: AbstractCell
): AbstractData => {
  const next1Src = nextSrc.slice(0, 2);
  const next2Src = nextSrc.slice(2, undefined);

  return {
    board: parseBoard(boardSrc, defaultCell),
    next1: parseNext(next1Src, defaultCell),
    next2: parseNext(next2Src, defaultCell),
  };
};

export const cellsSet = <T>(data: Data<T>): Set<T> =>
  new Set([data.board.flat(), data.next1, data.next2].flat());

const shuffle = (array: any[]) => {
  for (let i = array.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [array[i], array[j]] = [array[j], array[i]];
  }
};

export type TagMap = Map<AbstractCell, string>;

const colorizeRandom = (
  cells: Set<AbstractCell>,
  random_options: Set<string>
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
  fixed_cells: TagMap
): Set<AbstractCell> =>
  new Set(
    Array.from(cells).flatMap((cell) => (fixed_cells.has(cell) ? [] : [cell]))
  );

export const tagMapFromObj = (obj: Record<string, AbstractCell[]>) =>
  new Map(
    Object.entries(obj).flatMap(([tag, cells]): [AbstractCell, string][] =>
      cells.map((cell) => [cell, tag])
    )
  );

const materializeRandom = (
  cells: Set<AbstractCell>,
  fixed_cells: TagMap,
  random_options: Set<string>
): TagMap => {
  const restCells = filterRestCells(cells, fixed_cells);
  const colorMap = colorizeRandom(restCells, random_options);
  return new Map([...fixed_cells, ...colorMap]);
};

export const materializeDataRandom = (
  data: AbstractData,
  fixed_cells: TagMap,
  random_options: Set<string>
) => {
  const cells = cellsSet(data);
  const materialMap = materializeRandom(cells, fixed_cells, random_options);

  const materialData: MaterialData = mapData(
    data,
    (cell) => materialMap.get(cell)!
  );

  return [materialData, materialMap] as const;
};

const setCell = (cell: HTMLTableCellElement, value: string) => {
  cell.setAttribute("class", value);
};

export const drawMaterial = (
  data: MaterialData,
  getCell: {
    board: (col: number, row: number) => HTMLTableCellElement;
    next1: (num: number) => HTMLTableCellElement;
    next2: (num: number) => HTMLTableCellElement;
  }
) => {
  data.board.forEach((row, rowNum) => {
    row.forEach((material, colNum) => {
      const cell = getCell.board(colNum, rowNum);
      setCell(cell, material);
    });
  });

  data.next1.forEach((material, num) => {
    const cell = getCell.next1(num);
    setCell(cell, material);
  });

  data.next2.forEach((material, num) => {
    const cell = getCell.next2(num);
    setCell(cell, material);
  });
};
