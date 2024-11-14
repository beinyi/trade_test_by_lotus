import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import tsconfigPaths from "vite-tsconfig-paths";
import * as path from "path";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: [
      { find: "@store/", replacement: path.resolve(__dirname, "src/store/*") },
      {
        find: "@modules/",
        replacement: path.resolve(__dirname, "src/modules/*"),
      },
      {
        find: "@shared/",
        replacement: path.resolve(__dirname, "src/shared/*"),
      },
      {
        find: "@core/",
        replacement: path.resolve(__dirname, "src/core/*"),
      },
    ],
  },
});