import { AnkiPuyo } from "./view";

declare global {
  interface Window {
    AnkiPuyo?: AnkiPuyo;
  }
}
