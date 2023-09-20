import { drawMaterial } from "./view";

const drawFront = () => {
  const data = window.frontMaterialData;

  const boardEl = document.querySelector<HTMLTableElement>("#front-board")!;
  const next1El = document.querySelector<HTMLTableElement>("#front-next1")!;
  const next2El = document.querySelector<HTMLTableElement>("#front-next2")!;

  drawMaterial(data, {
    board: (col, row) => boardEl.rows[row].cells[col],
    next1: (num) => next1El.rows[num].cells[0],
    next2: (num) => next2El.rows[num].cells[0],
  });
};

const drawBack = () => {
  const data = window.backMaterialData;

  const boardEl = document.querySelector<HTMLTableElement>("#back-board")!;
  const next1El = document.querySelector<HTMLTableElement>("#back-next1")!;
  const next2El = document.querySelector<HTMLTableElement>("#back-next2")!;

  drawMaterial(data, {
    board: (col, row) => boardEl.rows[row].cells[col],
    next1: (num) => next1El.rows[num].cells[0],
    next2: (num) => next2El.rows[num].cells[0],
  });
};

const main = () => {
  drawFront();
  drawBack();
};

main();
