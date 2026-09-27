import { svelte } from "@sveltejs/vite-plugin-svelte";
import { defineConfig } from "vite";

// https://vite.dev/config/
export default defineConfig(({ command }) => ({
  // GitHub Pages serves this project at /<repo-name>/, so assets need that base path in production.
  base: command === "build" ? "/user-interface-cs-5167/" : "/",
  plugins: [svelte()],
}));
