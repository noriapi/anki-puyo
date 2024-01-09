import { AnkiPuyo, Board, drawBoard, drawNext, Next } from "./view";

const drawBackBoard = (board: Board<string>) => {
  const table = document.querySelector<HTMLTableElement>("#back-board")!;
  drawBoard(board, table);
};

const getBackNextTable = (index: number): HTMLTableElement => {
  const container = document.querySelector<HTMLDivElement>("back-nexts")!;

  const table = container.querySelector<HTMLTableElement>(
    `table:nth-child(${index + 1})`,
  );

  if (table) {
    return table;
  } else {
    container.insertAdjacentHTML(
      "beforeend",
      `
<table class="back next">
  <tr>
    <td></td>
  </tr>

  <tr>
    <td></td>
  </tr>
</table>
`,
    );

    return getBackNextTable(index);
  }
};

const drawBackNext = (index: number, next: Next<string>) => {
  const table = getBackNextTable(index);
  drawNext(next, table);
};

const drawBackNextList = (nexts: Next<string>[]) => {
  nexts.forEach((next, index) => drawBackNext(index, next));
};

const setBackMsgHtml = (html: string) => {
  const el = document.querySelector<HTMLDivElement>("#back-msg")!;
  el.innerHTML = html;
};

const drawAnkiPuyo = (ankiPuyo: AnkiPuyo) => {
  drawBackBoard(ankiPuyo.realBackBoard);
  drawBackNextList(ankiPuyo.realBackNextList);
  setBackMsgHtml(ankiPuyo.realBackMsgHtml);
};

const main = () => {
  const ankiPuyo = window.AnkiPuyo;
  if (ankiPuyo) {
    drawAnkiPuyo(ankiPuyo);
  }
};

main();
