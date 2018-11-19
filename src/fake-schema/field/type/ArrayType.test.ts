import { ArrayType } from "./ArrayType";

describe("ArrayValue", () => {
  describe("instance", () => {
    const functions = {};
    const sample = {};
    const config = {};

    const resolver = new ArrayType({ functions, sample }, config);
    test("is defined", () => {
      expect(resolver).toBeDefined();
    });
  });
});
