import { AbstractCell, AnkiPuyo, Board, MaterialData, TagMap } from "./view";

declare global {
  interface Window {
    AnkiPuyo?: AnkiPuyo;
  }
}
