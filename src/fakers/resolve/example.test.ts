import { resolveExample, resolveValues } from "./example";

describe("resolveExample", () => {
  const field = {
    name: "firstName",
    type: "String"
  };
  const type = "Person";
  const example = resolveExample({ field, type });

  describe("example", () => {
    test("is defined", () => {
      expect(example).toBeDefined();
    });
  });
});

describe("resolveValues", () => {
  const obj = {
    values: ["x", "y"]
  };
  const values = resolveValues(obj);

  describe("values", () => {
    test("is defined", () => {
      expect(values).toBeDefined();
    });
  });
});
