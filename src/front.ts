import {
  AbstractCell,
  AnkiPuyo,
  Board,
  Next,
  drawBoard,
  drawNext,
  extractMsgCells,
  mapBoard,
  mapNext,
  materializeRandom,
  parseBoard,
  parseNextList,
  replaceMsgCells,
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
const DEFAULT_CELL = " " as AbstractCell;

const getFrontBoard = () => {
  const src =
    document
      .querySelector<HTMLDivElement>("#front-board-src")
      ?.innerHTML.replaceAll("<br>", "\n") ?? "";

  return parseBoard(src, DEFAULT_CELL);
};

const getFrontNext = () => {
  const src =
    document
      .querySelector<HTMLDivElement>("#front-next-src")
      ?.innerHTML.replaceAll("<br>", "\n") ?? "";

  return parseNextList(src, DEFAULT_CELL);
};

const getFrontMsgHtml = () => {
  return (
    document.querySelector<HTMLDivElement>("#front-msg-src")?.innerHTML ?? ""
  );
};

const getBackBoard = () => {
  const src =
    document
      .querySelector<HTMLDivElement>("#back-board-src")
      ?.innerHTML.replaceAll("<br>", "\n") ?? "";

  return parseBoard(src, DEFAULT_CELL);
};

const getBackNext = () => {
  const src =
    document
      .querySelector<HTMLDivElement>("#back-next-src")
      ?.innerHTML.replaceAll("<br>", "\n") ?? "";

  return parseNextList(src, DEFAULT_CELL);
};

const getBackMsgHtml = () => {
  return (
    document.querySelector<HTMLDivElement>("#back-msg-src")?.innerHTML ?? ""
  );
};

const drawFrontBoard = (board: Board<string>) => {
  const table = document.querySelector<HTMLTableElement>("#front-board")!;
  drawBoard(board, table);
};

const getFrontNextTable = (index: number): HTMLTableElement => {
  const container = document.querySelector<HTMLDivElement>("#front-nexts")!;

  const table = container.querySelector<HTMLTableElement>(
    `table:nth-child(${index + 1})`
  );

  if (table) {
    return table;
  } else {
    container.insertAdjacentHTML(
      "beforeend",
      `
<table class="front next">
  <tr>
    <td></td>
  </tr>

  <tr>
    <td></td>
  </tr>
</table>
`
    );

    return getFrontNextTable(index);
  }
};

const drawFrontNext = (index: number, next: Next<string>) => {
  const table = getFrontNextTable(index);
  drawNext(next, table);
};

const drawFrontNextList = (nexts: Next<string>[]) => {
  nexts.forEach((next, index) => drawFrontNext(index, next));
};

const setFrontMsgHtml = (html: string) => {
  const el = document.querySelector<HTMLDivElement>("#front-msg")!;
  el.innerHTML = html;
};

const isBack = () => {
  const el = document.querySelector("#back-view");
  return Boolean(el);
};

const isFront = () => !isBack();

const makeAnkiPuyo = (): AnkiPuyo => {
  const frontBoard = getFrontBoard();
  const frontNextList = getFrontNext();
  const frontMsgHtml = getFrontMsgHtml();
  const backBoard = getBackBoard();
  const backNextList = getBackNext();
  const backMsgHtml = getBackMsgHtml();

  const cells = new Set([
    ...frontBoard.flat(),
    ...frontNextList.flat(),
    ...extractMsgCells(frontMsgHtml),
    ...backBoard.flat(),
    ...backNextList.flat(),
    ...extractMsgCells(backMsgHtml),
  ]);

  const map = materializeRandom(
    cells,
    tagMapFromObj(FIXED_CELLS),
    new Set(RANDOM_TAGS)
  );

  const getTag = (cell: AbstractCell) => map.get(cell) ?? "";

  const realFrontBoard = mapBoard(frontBoard, getTag);
  const realFrontNextList = frontNextList.map((next) => mapNext(next, getTag));
  const realBackBoard = mapBoard(backBoard, getTag);
  const realBackNextList = backNextList.map((next) => mapNext(next, getTag));

  const getHtml = (cell: AbstractCell, original: string) => {
    const tag = map.get(cell);
    return typeof tag !== "undefined"
      ? `<span class="${tag}">　</span>`
      : original;
  };

  const realFrontMsgHtml = replaceMsgCells(frontMsgHtml, getHtml);
  const realBackMsgHtml = replaceMsgCells(backMsgHtml, getHtml);

  return {
    realFrontBoard,
    realFrontNextList,
    realBackBoard,
    realBackNextList,
    realFrontMsgHtml,
    realBackMsgHtml,
  };
};

const drawAnkiPuyo = (ankiPuyo: AnkiPuyo) => {
  drawFrontBoard(ankiPuyo.realFrontBoard);
  drawFrontNextList(ankiPuyo.realFrontNextList);
  setFrontMsgHtml(ankiPuyo.realFrontMsgHtml);
};

const main = () => {
  if (window.AnkiPuyo == null || isFront()) {
    window.AnkiPuyo = makeAnkiPuyo();
  }

  drawAnkiPuyo(window.AnkiPuyo);
};

main();
