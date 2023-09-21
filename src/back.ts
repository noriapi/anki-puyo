import { AnkiPuyo, Board, Next, drawBoard, drawNext } from "./view";

const drawBackBoard = (board: Board<string>) => {
  const table = document.querySelector<HTMLTableElement>("#back-board")!;
  drawBoard(board, table);
};

const drawBackNext = (index: number, next: Next<string>) => {
  const table = document.querySelector<HTMLTableElement>(
    `#back-next${index + 1}`
  );
  if (table) drawNext(next, table);
};

const setBackMsgHtml = (html: string) => {
  const el = document.querySelector<HTMLDivElement>("#back-msg")!;
  el.innerHTML = html;
};

const drawAnkiPuyo = (ankiPuyo: AnkiPuyo) => {
  drawBackBoard(ankiPuyo.realBackBoard);
  ankiPuyo.realBackNextList.forEach((next, index) => {
    drawBackNext(index, next);
  });
  setBackMsgHtml(ankiPuyo.realBackMsgHtml);
};

const main = () => {
  const ankiPuyo = window.AnkiPuyo;
  if (ankiPuyo) {
    drawAnkiPuyo(ankiPuyo);
  }
};

main();
