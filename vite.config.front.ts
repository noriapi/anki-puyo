import base from "./vite.config.base";

import { mergeConfig } from "vite";
import { resolve } from "path";

export default mergeConfig(base, {
  build: {
    rollupOptions: {
      input: {
        front: resolve(__dirname, "front.html"),
      },
    },
    emptyOutDir: false,
  },
});
