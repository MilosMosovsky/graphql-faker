import { createIdl } from ".";
import * as path from "path";

describe("createIdlApi", () => {
  const fileName = path.join(__dirname, "typedefs", "default-schema.graphql");
  const api = createIdl(fileName);

  describe("api", () => {
    test("is defined", () => {
      expect(api).toBeDefined();
    });
  });
});
