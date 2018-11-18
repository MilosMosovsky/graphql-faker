import { PrimitiveValue } from "./PrimitiveValue";

describe("PrimitiveValue", () => {
  describe("instance", () => {
    const type = {};
    const field = {};
    const config = {};
    const directives = {};

    const resolver = new PrimitiveValue({ type, field, directives }, config);
    test("is defined", () => {
      expect(resolver).toBeDefined();
    });
  });
});
