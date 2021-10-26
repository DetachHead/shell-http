import { Application, Router } from "oak";
import { logger } from "/logger.ts";
import endpoints from "/endpoints.ts";
import * as log from "std/log/mod.ts";
import { green, yellow } from "std/fmt/colors.ts";

const router = new Router();
const app = new Application();

for (const endpoint of endpoints) {
  router.post(`/${endpoint}`, async (ctx) => {
    const args: string[] = ctx.request.url.searchParams.getAll("args");
    const stdin = ctx.request.hasBody
      ? await ctx.request.body({ type: "bytes" }).value
      : undefined;
    const process = Deno.run({
      cmd: [endpoint, ...args],
      stdout: "piped",
      stderr: "piped",
      stdin: "piped",
    });
    if (typeof stdin !== "undefined") {
      await process.stdin?.write(stdin);
    }
    process.stdin?.close();
    await process.status();
    const decoder = new TextDecoder();
    ctx.response.body = {
      stdout: decoder.decode(await process.output()),
      stderr: decoder.decode(await process.stderrOutput()),
    };
  });
}

app.use(logger);
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", ({ hostname, port, secure }) => {
  const url = `${secure ? "https://" : "http://"}${
    hostname ?? "localhost"
  }:${port}`;

  log.info(yellow("Listening on:") + " " + green(url));
});

await app.listen({ port: 8000 });
