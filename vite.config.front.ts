import base from "./vite.config.base";

import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  ...base,
  build: {
    rollupOptions: {
      input: {
        front: resolve(__dirname, "front.html"),
      },
    },
    emptyOutDir: false,
  },
});
