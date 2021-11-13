import {
  assertEquals,
  assertStringIncludes,
  IResponse,
  superoak,
} from "./deps.ts";
import { createServer } from "./server.ts";

const app = createServer(["git", "cat"]);

Deno.test("no stdin", async () => {
  const request = await superoak(app);
  await request.post("/git?args=status").expect((res: IResponse) => {
    assertEquals(res.status, 200);
    assertStringIncludes(res.body.stdout, "On branch");
  });
});

Deno.test({
  name: "yes stdin",
  ignore: Deno.build.os === "windows",
  fn: async () => {
    const request = await superoak(app);
    await request.post("/cat").send("asdf").expect((res: IResponse) => {
      assertEquals(res.status, 200);
      assertStringIncludes(res.body.stdout, "asdf");
    });
  },
});
