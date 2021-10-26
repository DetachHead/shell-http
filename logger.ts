import { Middleware } from "https://deno.land/x/oak@v9.0.1/middleware.ts";
import * as log from "https://deno.land/std@0.105.0/log/mod.ts";
import {
  cyan,
  green,
  red,
  yellow,
} from "https://deno.land/std@0.105.0/fmt/colors.ts";
import { format } from "https://deno.land/std@0.105.0/datetime/mod.ts";

export const logger: Middleware = async (ctx, next) => {
  const { request, response } = ctx;

  let error: unknown;
  try {
    await next();
  } catch (err) {
    error = err;
  }
  const status = response.status;

  const logString = `[${
    format(new Date(), "MM-dd-yyyy hh:mm:ss.SSS")
  }] finished ${request.method} ${request.url}" Status: ${status} ${
    ctx.respond ? "" : "No response from Oak"
  }`;

  log.info(
    (status >= 500 || error
      ? red
      : status >= 400
      ? yellow
      : status >= 300
      ? cyan
      : status >= 200
      ? green
      : red)(logString),
  );
  if (error) {
    log.error(error);
    log.error("Request body " + await request.body().value);
    log.error(request.headers);
    throw error;
  }
};
