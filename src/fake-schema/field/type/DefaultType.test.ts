import { DefaultType } from "./DefaultType";

describe("DefaultValue", () => {
  describe("instance", () => {
    const functions = {};
    const field = {};
    const config = {};

    const resolver = new DefaultType(functions, { field }, config);
    test("is defined", () => {
      expect(resolver).toBeDefined();
    });
  });
});
