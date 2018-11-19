import { PrimitiveType } from "./PrimitiveType";

describe("PrimitiveValue", () => {
  describe("instance", () => {
    const type = {};
    const field = {};
    const config = {};
    const directives = {};

    const resolver = new PrimitiveType({ type, field, directives }, config);
    test("is defined", () => {
      expect(resolver).toBeDefined();
    });
  });
});
