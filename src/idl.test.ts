import { createIdlApi } from "./idl";
import * as path from "path";

describe("createIdlApi", () => {
  const fileName = path.join(__dirname, "typedefs", "default-schema.graphql");
  const api = createIdlApi(fileName);

  describe("api", () => {
    test("is defined", () => {
      expect(api).toBeDefined();
    });
  });
});
