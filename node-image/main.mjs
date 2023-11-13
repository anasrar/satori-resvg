import { readFile, writeFile } from "node:fs/promises";
import { html } from "satori-html";
import satori from "satori";
import { Resvg } from "@resvg/resvg-js";

const template = html(`
<div style="display: flex; flex-flow: column nowrap; align-items: stretch; width: 600px; height: 400px; backgroundImage: linear-gradient(to right, #0f0c29, #302b63, #24243e); color: #000;">
  <div style="display: flex; flex: 1 0; flex-flow: row nowrap; justify-content: center; align-items: center;">
    <img style="border: 8px solid rgba(255, 255, 255, 0.2); border-radius: 50%;" src="https://placekitten.com/240/240" alt="animals" />
  </div>
  <div style="display: flex; justify-content: center; align-items: center; margin: 6px; padding: 12px; border-radius: 4px; background: rgba(255, 255, 255, 0.2); color: #fff; font-size: 22px;">
    The quick brown fox jumps over the lazy dog.
  </div>
</div>
`);

// convert html to svg
const svg = await satori(template, {
  width: 600,
  height: 400,
  fonts: [
    {
      name: "VictorMono",
      data: await readFile("../fonts/VictorMono-Bold.ttf"),
      weight: 700,
      style: "normal",
    },
  ],
});

// render png
const resvg = new Resvg(svg, {
  background: "rgba(238, 235, 230, .9)",
});
const pngData = resvg.render();
const pngBuffer = pngData.asPng();

await writeFile("./output.png", pngBuffer);
