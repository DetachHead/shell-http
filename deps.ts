//prod
export { Application, Router } from "https://deno.land/x/oak@v9.0.1/mod.ts";
export { default as logger } from "https://deno.land/x/oak_logger@1.0.0/mod.ts";
export * as log from "https://deno.land/std@0.105.0/log/mod.ts";
export { green, yellow } from "https://deno.land/std@0.105.0/fmt/colors.ts";

//dev
//TODO: fix this when ts 4.5 is released
export { superoak } from "https://deno.land/x/superoak@4.4.0/mod.ts";
export type { IResponse } from "https://deno.land/x/superoak@4.4.0/mod.ts";
export {
  assertEquals,
  assertStringIncludes,
} from "https://deno.land/std@0.105.0/testing/asserts.ts";
