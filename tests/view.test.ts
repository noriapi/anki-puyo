import { FixedLengthArray } from "type-fest";
import { describe, expect, test } from "vitest";

import {
  AbstractCell,
  Board,
  extractMsgCells,
  filterRestCells,
  parseBoard,
  parseNext,
  parseNextList,
  replaceMsgCells,
  TagMap,
} from "../src/view";

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

describe("parseNextList", () => {
  test.each([
    {
      s: "ABCD",
      defaultCell: cell(" "),
      expected: [cells(["A", "B"]), cells(["C", "D"])],
    },

    {
      s: "ABC ",
      defaultCell: cell(" "),
      expected: [cells(["A", "B"]), cells(["C", " "])],
    },

    {
      s: "AB\nCD",
      defaultCell: cell(" "),
      expected: [cells(["A", "B"]), cells(["C", "D"])],
    },

    {
      s: "A \nCD",
      defaultCell: cell(" "),
      expected: [cells(["A", " "]), cells(["C", "D"])],
    },

    {
      s: "A \n D",
      defaultCell: cell(" "),
      expected: [cells(["A", " "]), cells([" ", "D"])],
    },

    {
      s: "A\n D",
      defaultCell: cell(" "),
      expected: [cells(["A", " "]), cells(["D", " "])],
    },
  ])(
    "parseNextList($s, $defaultCell) -> $expected",
    ({ s, defaultCell, expected }) => {
      expect(parseNextList(s, defaultCell)).toStrictEqual(expected);
    },
  );
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
      ]),
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
      ]),
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
        cell(" "),
      ),
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
      ]),
    );
  });
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

test("extractMsgCells", () => {
  expect(extractMsgCells("abc{{A}}def{{ B }}")).toStrictEqual(["A", "B"]);
});

test("replaceMsgCells", () => {
  const map = new Map([
    [cell("A"), "X"],
    [cell("C"), "Z"],
  ]);
  expect(
    replaceMsgCells(
      "abc{{A}}def{{ B }}ghi{{ C }}",
      (cell, original) => map.get(cell) ?? original,
    ),
  ).toBe("abcXdef{{ B }}ghiZ");
});
