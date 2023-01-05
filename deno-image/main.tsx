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

const template = (
  <div
    style={{
      display: "flex",
      flexFlow: "column nowrap",
      alignItems: "stretch",
      width: "600px",
      height: "400px",
      backgroundImage: "linear-gradient(to top, #7028e4 0%, #e5b2ca 100%)",
      color: "#000",
    }}
  >
    <div
      style={{
        display: "flex",
        flex: "1 0",
        flexFlow: "row nowrap",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <img
        style={{
          border: "8px solid rgba(255, 255, 255, 0.2)",
          borderRadius: "50%",
        }}
        src="https://placeimg.com/240/240/animals"
        alt="animals"
      />
    </div>
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        margin: "6px",
        padding: "12px",
        borderRadius: "4px",
        background: "rgba(255, 255, 255, 0.2)",
        color: "#fff",
        fontSize: "22px",
      }}
    >
      The quick brown fox jumps over the lazy dog.
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
