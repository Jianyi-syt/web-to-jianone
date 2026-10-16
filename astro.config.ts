import { defineConfig } from "astro/config";
import tailwindcss from "@tailwindcss/vite";
import { copyFile, mkdir } from "node:fs/promises";

export default defineConfig({
  site: "https://jianone.com",
  base: "/",
  output: "static",
  outDir: "./dist",
  build: { format: "file", inlineStylesheets: "always" },
  vite: { plugins: [tailwindcss()] },
  integrations: [{
    name: "root-html-copies",
    hooks: {
      "astro:build:done": async ({ dir }) => {
        await mkdir(new URL('./images/', import.meta.url), { recursive: true });
        await copyFile(new URL('images/jian-avatar.png', dir), new URL('./images/jian-avatar.png', import.meta.url));
        // 仅复制本站生成的 HTML，dist 仍是独立可部署的目录。
        const pages = ["index", "about", "projects", "notes", "now", "test-project", "test-note"];
        await Promise.all(pages.map(page => copyFile(
          new URL(`${page}.html`, dir),
          new URL(`./${page}.html`, import.meta.url),
        )));
      },
    },
  }],
});
