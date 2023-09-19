import { MaterialData, TagMap } from "./view";

declare global {
  interface Window {
    RANDOM_TAGS: string[];
    DEFAULT_CELL: string;
    materialData: MaterialData;
    materialMap: TagMap;
  }
}
