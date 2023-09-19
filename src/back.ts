import {
  AbstractCell,
  AbstractData,
  drawMaterial,
  materializeDataRandom,
  parseData,
} from "./view";

const getData = () => {
  const boardSrc =
    document
      .querySelector<HTMLDivElement>("#back-board-src")
      ?.innerHTML.replace("<br>", "\n") ?? "";
  const next1Src =
    document
      .querySelector<HTMLDivElement>("#back-next1-src")
      ?.innerHTML.replace("<br>", "\n") ?? "";
  const next2Src =
    document
      .querySelector<HTMLDivElement>("#back-next2-src")
      ?.innerHTML.replace("<br>", "\n") ?? "";

  return parseData(
    boardSrc,
    next1Src,
    next2Src,
    window.DEFAULT_CELL as AbstractCell
  );
};

const materializeRandom = (data: AbstractData) => {
  const map = window.materialMap;
  const mapTags = new Set(map.values());
  const options = window.RANDOM_TAGS.filter((tag) => !mapTags.has(tag));

  return materializeDataRandom(data, map, new Set(options));
};

const drawFront = () => {
  const data = window.materialData;

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
  drawFront();

  const data = getData();
  const [materialData, _] = materializeRandom(data);

  const boardEl = document.querySelector<HTMLTableElement>("#back-board")!;
  const next1El = document.querySelector<HTMLTableElement>("#back-next1")!;
  const next2El = document.querySelector<HTMLTableElement>("#back-next2")!;

  drawMaterial(materialData, {
    board: (col, row) => boardEl.rows[row].cells[col],
    next1: (num) => next1El.rows[num].cells[0],
    next2: (num) => next2El.rows[num].cells[0],
  });
};

main();
