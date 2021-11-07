import { createServer } from "./server.ts";
import * as log from "std/log/mod.ts";

const endpoints = Deno.args;

if (endpoints.length === 0) {
  log.error("No endpoints specified");
  Deno.exit(1);
}

await createServer(endpoints).listen({ port: 8000 });
