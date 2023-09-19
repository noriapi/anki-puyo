import base from "./vite.config.base";

import { defineConfig } from "vite";
import { resolve } from "path";

export default defineConfig({
  ...base,
  build: {
    rollupOptions: {
      input: {
        back: resolve(__dirname, "back.html"),
      },
    },
    emptyOutDir: false,
  },
});
