import { readFileSync, writeFileSync } from "node:fs";
import { marked } from "marked";

const markdown = readFileSync(
  new URL("../README.md", import.meta.url),
  "utf-8",
);
const body = marked.parse(markdown);

const html = `<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <title>Project Write-Up</title>
    <style>
      body {
        max-width: 720px;
        margin: 40px auto;
        padding: 0 20px;
        font-family: system-ui, sans-serif;
        line-height: 1.6;
        color: #1a1a1a;
      }
      pre {
        background: #f4f4f4;
        padding: 12px;
        overflow-x: auto;
      }
      code {
        background: #f4f4f4;
        padding: 2px 4px;
      }
      img {
        max-width: 100%;
      }
    </style>
  </head>
  <body>
    ${body}
  </body>
</html>
`;

writeFileSync(new URL("../dist/writeup.html", import.meta.url), html);
