import { ArrayValue } from "./ArrayValue";

describe("ArrayValue", () => {
  describe("instance", () => {
    const functions = {};
    const sample = {};
    const config = {};

    const resolver = new ArrayValue({ functions, sample }, config);
    test("is defined", () => {
      expect(resolver).toBeDefined();
    });
  });
});
