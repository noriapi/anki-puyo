import { resolve } from "path";
import { mergeConfig } from "vite";

import base from "./vite.config.base";

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
