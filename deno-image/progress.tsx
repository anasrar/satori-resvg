import React from "https://esm.sh/react@18.2.0";
import satori, { init } from "npm:satori@0.0.44/wasm";
import initYoga from "npm:yoga-wasm-web@0.2.0";
import { Resvg } from "npm:@resvg/resvg-js@2.2.0";
import cacheDir from "https://deno.land/x/cache_dir@0.2.0/mod.ts";

const wasm = await Deno.readFile(
  `${cacheDir()}/deno/npm/registry.npmjs.org/yoga-wasm-web/0.2.0/dist/yoga.wasm`,
);
const yoga =
  await (initYoga as unknown as (wasm: Uint8Array) => Promise<unknown>)(wasm);
init(yoga);

const currentTime = new Date();
const currentYear = new Date(`${currentTime.getFullYear()}, 1, 1`);
const nextYear = new Date(`${currentTime.getFullYear() + 1}, 1, 1`)

const year = nextYear.getTime() - currentYear.getTime();
const progress = ~~((currentTime.getTime() - currentYear.getTime()) / year * 100);

const template = (
  <div
    style={{
      display: "flex",
      flexFlow: "column nowrap",
      justifyContent: "center",
      alignItems: "center",
      width: "600px",
      height: "400px",
      background: "#fff",
      color: "#000",
    }}
  >
    <div
      style={{
        display: "flex",
        flexFlow: "row nowrap",
        justifyContent: "center",
        width: "320px",
        height: "75px",
        alignItems: "center",
        border: "4px solid #000",
        color: "#fff",
        background: `linear-gradient(to right, green ${progress}%, #404040 ${progress}%)`,
        fontSize: "24px",
      }}
    >
      {progress}%
    </div>
  </div>
);

// convert html to svg
const svg = await satori(
  template,
  {
    width: 600,
    height: 400,
    fonts: [
      {
        name: "VictorMono",
        data: await Deno.readFile("../fonts/VictorMono-Bold.ttf"),
        weight: 700,
        style: "normal",
      },
    ],
  },
);

// render png
const resvg = new Resvg(svg, {
  background: "rgba(238, 235, 230, .9)",
});
const pngData = resvg.render();
const pngBuffer = pngData.asPng();

await Deno.writeFile("./output.png", pngBuffer);

// ffi block, need to force exit
Deno.exit(0);
