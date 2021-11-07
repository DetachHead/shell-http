import { IResponse, superoak } from "superoak";
import { createServer } from "./server.ts";
import { assertEquals, assertStringIncludes } from "std/testing/asserts.ts";

Deno.test("no stdin", async () => {
  const app = createServer(["git"]);
  const request = await superoak(app);
  await request.post("/git?args=status").expect((res: IResponse) => {
    assertEquals(res.status, 200);
    assertStringIncludes(res.body.stdout, "On branch");
  });
});
