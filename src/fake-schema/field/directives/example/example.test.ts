import { resolveExample } from ".";

// re-align `typeFieldMap` and `fieldMap` (resolve examples and fakes), using a generic `resultResolver`.
// Allow `matches` list for both, using `resolveMatches`

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

import { resolveValues, ExampleResolver } from "./ExampleResolver";

describe("ExampleResolver", () => {
  const field = {
    name: "firstName",
    type: "String"
  };
  const type = "Person";
  const resolver = new ExampleResolver({ field, type });

  describe("resolver", () => {
    test("is defined", () => {
      expect(resolver).toBeDefined();
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
