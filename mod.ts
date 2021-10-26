import { Application, Router } from "https://deno.land/x/oak@v9.0.1/mod.ts";
import endpoints from "./endpoints.ts";

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

app.use(router.routes());
app.use(router.allowedMethods());

await app.listen({ port: 8000 });
