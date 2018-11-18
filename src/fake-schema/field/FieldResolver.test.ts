import { FieldResolver } from "./FieldResolver";

describe("FieldResolver", () => {
  const schema = {};
  const ctx = {};
  const config = {};

  describe("instance", () => {
    const fr = new FieldResolver(schema, ctx, config);
    test("is defined", () => {
      expect(fr).toBeDefined();
    });
  });
});
