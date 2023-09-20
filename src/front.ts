import {
  AbstractCell,
  AbstractData,
  MaterialData,
  drawMaterial,
  materializeDataRandom,
  parseData,
  tagMapFromObj,
} from "./view";

//! 変換先の CSS タグ名と変換元の文字のリストのレコード
const FIXED_CELLS = {
  empty: [" ", "_"],
  gray: ["X"],
} as unknown as Record<string, AbstractCell[]>;

//! ランダムに選択される CSS タグのリスト
const RANDOM_TAGS = ["red", "yellow", "green", "blue", "purple"];

//! 未指定のセルにあてがう文字
const DEFAULT_CELL = " ";

window.RANDOM_TAGS = RANDOM_TAGS;
window.DEFAULT_CELL = DEFAULT_CELL;

const getFrontData = () => {
  const boardSrc =
    document
      .querySelector<HTMLDivElement>("#front-board-src")
      ?.innerHTML.replaceAll("<br>", "\n") ?? "";
  const nextSrc =
    document
      .querySelector<HTMLDivElement>("#front-next-src")
      ?.innerHTML.replaceAll("<br>", "\n") ?? "";

  return parseData(boardSrc, nextSrc, window.DEFAULT_CELL as AbstractCell);
};

const getBackData = () => {
  const boardSrc =
    document
      .querySelector<HTMLDivElement>("#back-board-src")
      ?.innerHTML.replaceAll("<br>", "\n") ?? "";
  const nextSrc =
    document
      .querySelector<HTMLDivElement>("#back-next-src")
      ?.innerHTML.replaceAll("<br>", "\n") ?? "";

  return parseData(boardSrc, nextSrc, window.DEFAULT_CELL as AbstractCell);
};

const materializeRandom = (front: AbstractData, back: AbstractData) => {
  return materializeDataRandom(
    [front, back],
    tagMapFromObj(FIXED_CELLS),
    new Set(RANDOM_TAGS)
  );
};

export const draw = (data: MaterialData) => {
  const boardEl = document.querySelector<HTMLTableElement>("#front-board")!;
  const next1El = document.querySelector<HTMLTableElement>("#front-next1")!;
  const next2El = document.querySelector<HTMLTableElement>("#front-next2")!;

  drawMaterial(data, {
    board: (col, row) => boardEl.rows[row].cells[col],
    next1: (num) => next1El.rows[num].cells[0],
    next2: (num) => next2El.rows[num].cells[0],
  });
};

const main = () => {
  const front = getFrontData();
  const back = getBackData();
  const [[frontMaterialData, backMaterialData], materialMap] =
    materializeRandom(front, back);
  window.materialMap = materialMap;
  window.frontMaterialData = frontMaterialData;
  window.backMaterialData = backMaterialData;
  draw(frontMaterialData);
};

main();
