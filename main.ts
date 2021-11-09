import { createServer } from "./server.ts";
import { log } from "./deps.ts";

const endpoints = Deno.args;

if (endpoints.length === 0) {
  log.error("No endpoints specified");
  Deno.exit(1);
}

await createServer(endpoints).listen({ port: 8000 });
