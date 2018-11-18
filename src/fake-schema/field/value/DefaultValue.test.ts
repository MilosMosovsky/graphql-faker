import { DefaultValue } from "./DefaultValue";

describe("DefaultValue", () => {
  describe("instance", () => {
    const functions = {};
    const field = {};
    const config = {};

    const resolver = new DefaultValue(functions, { field }, config);
    test("is defined", () => {
      expect(resolver).toBeDefined();
    });
  });
});
