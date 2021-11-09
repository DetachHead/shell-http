import { Application, green, log, logger, Router, yellow } from "./deps.ts";

export const createServer = (commands: string[]): Application => {
  const app = new Application();
  const router = new Router();
  for (const command of commands) {
    if (command === "") {
      log.error("Empty endpoint specified");
      Deno.exit(1);
    }
    router.post(`/${command}`, async (ctx) => {
      const args: string[] = ctx.request.url.searchParams.getAll("args");
      const stdin = ctx.request.hasBody
        ? await ctx.request.body({ type: "bytes" }).value
        : undefined;
      const process = Deno.run({
        cmd: [command, ...args],
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
      await process.close();
    });
  }
  app.use(logger.logger);
  app.use(logger.responseTime);
  app.use(router.routes());
  app.use(router.allowedMethods());

  app.addEventListener("listen", ({ hostname, port, secure }) => {
    const displayHostname = Deno.build.os !== "windows"
      ? hostname
      : undefined ?? "localhost";
    // noinspection HttpUrlsUsage
    const url = `${secure ? "https://" : "http://"}${displayHostname}:${port}`;

    log.info(yellow("Listening on:") + " " + green(url));
  });

  return app;
};
