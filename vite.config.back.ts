import { resolve } from "path";
import { mergeConfig } from "vite";

import base from "./vite.config.base";

export default mergeConfig(base, {
  build: {
    rollupOptions: {
      input: {
        back: resolve(__dirname, "back.html"),
      },
    },
    emptyOutDir: false,
  },
});
