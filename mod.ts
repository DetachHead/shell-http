import { Application, Router } from "oak";
import logger from "oak_logger";
import * as log from "std/log/mod.ts";
import { green, yellow } from "std/fmt/colors.ts";
import os from "dos";

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

app.use(logger.logger);
app.use(logger.responseTime);
app.use(router.routes());
app.use(router.allowedMethods());

app.addEventListener("listen", ({ hostname, port, secure }) => {
  const displayHostname = os.platform() !== "windows"
    ? hostname
    : undefined ?? "localhost";
  // noinspection HttpUrlsUsage
  const url = `${secure ? "https://" : "http://"}${displayHostname}:${port}`;

  log.info(yellow("Listening on:") + " " + green(url));
});

await app.listen({ port: 8000 });
