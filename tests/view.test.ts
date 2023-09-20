import { describe, expect, test } from "vitest";
import {
  AbstractCell,
  AbstractData,
  Board,
  TagMap,
  cellsSet,
  filterRestCells,
  materializeDataRandom,
  parseBoard,
  parseNext,
} from "../src/view";
import { FixedLengthArray } from "type-fest";

const cell = (char: string) => char as AbstractCell;
const cells = <T extends number>(cells: FixedLengthArray<string, T>) =>
  cells as FixedLengthArray<AbstractCell, T>;
const board = (rows: Board<string>) => rows as Board<AbstractCell>;

test("parseNext", () => {
  expect(parseNext("", cell(" "))).toStrictEqual(cells([" ", " "]));
  expect(parseNext("", cell("A"))).toStrictEqual(cells(["A", "A"]));
  expect(parseNext("A", cell(" "))).toStrictEqual(cells(["A", " "]));
  expect(parseNext(" A", cell(" "))).toStrictEqual(cells([" ", "A"]));
});

describe("parseBoard", () => {
  test("empty", () => {
    expect(parseBoard("", cell(" "))).toStrictEqual(
      board([
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
      ])
    );
  });

  test("lower to higher", () => {
    expect(parseBoard("A", cell(" "))).toStrictEqual(
      board([
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        ["A", " ", " ", " ", " ", " "],
      ])
    );
  });

  test("GTR", () => {
    expect(
      parseBoard(
        `
C
BAC A
BBACCA
AACAAB`,
        cell(" ")
      )
    ).toStrictEqual(
      board([
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        ["C", " ", " ", " ", " ", " "],
        ["B", "A", "C", " ", "A", " "],
        ["B", "B", "A", "C", "C", "A"],
        ["A", "A", "C", "A", "A", "B"],
      ])
    );
  });
});

test("cellsSet", () => {
  const data: AbstractData = {
    board: board([
      [" ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " "],
      [" ", " ", " ", " ", " ", " "],
      ["C", "_", "_", "_", "_", "_"],
      ["B", "A", "C", "X", "A", "X"],
      ["B", "B", "A", "C", "C", "A"],
      ["A", "A", "C", "A", "A", "B"],
    ]),
    nexts: [cells(["A", "A"]), cells(["B", "_"])],
  };
  const set = cellsSet(data);
  expect(set).toStrictEqual(new Set(["A", "B", "C", "X", " ", "_"]));
});

test("filterRestCells", () => {
  const set = new Set(cells(["A", "B", "C", "X", " ", "_"]));
  const map: TagMap = new Map([
    [cell(" "), "empty"],
    [cell("_"), "empty"],
    [cell("X"), "gray"],
  ]);

  expect(filterRestCells(set, map)).toStrictEqual(new Set(["A", "B", "C"]));
});

describe("materializeDataRandom", () => {
  test("no map", () => {
    const data: AbstractData = {
      board: board([
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        [" ", " ", " ", " ", " ", " "],
        ["C", "_", "_", "_", "_", "_"],
        ["B", "A", "C", "X", "A", "X"],
        ["B", "B", "A", "C", "C", "A"],
        ["A", "A", "C", "A", "A", "B"],
      ]),
      nexts: [cells(["A", "A"]), cells(["B", "_"])],
    };
    const map: TagMap = new Map([
      [cell(" "), "empty"],
      [cell("_"), "empty"],
      [cell("X"), "gray"],
    ]);

    const [matData] = materializeDataRandom(data, map, new Set());

    data.board.forEach((row, rowIdx) => {
      row.forEach((cell, colIdx) => {
        const expectedMat = map.get(cell);
        if (typeof expectedMat === "string") {
          expect(matData.board[rowIdx][colIdx]).toBe(expectedMat);
        }
      });
    });
  });
});
