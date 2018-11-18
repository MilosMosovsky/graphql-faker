import { resolveExamples } from ".";

// re-align `typeFieldMap` and `fieldMap` (resolve examples and fakes), using a generic `resultResolver`.
// Allow `matches` list for both, using `resolveMatches`

describe("resolveExample", () => {
  const field = {
    name: "firstName",
    type: "String"
  };
  const type = "Person";
  const example = resolveExamples({ field, type });

  describe("example", () => {
    test("is defined", () => {
      expect(example).toBeDefined();
    });
  });
});

import { resolveResult, ExamplesResolver } from "./ExamplesMapResolver";

describe("ExampleResolver", () => {
  const field = {
    name: "firstName",
    type: "String"
  };
  const type = "Person";
  const resolver = new ExamplesResolver({ field, type });

  describe("resolver", () => {
    test("is defined", () => {
      expect(resolver).toBeDefined();
    });
  });
});

describe("resolveResult", () => {
  const obj = {
    values: ["x", "y"]
  };
  const values = resolveResult(obj);

  describe("values", () => {
    test("is defined", () => {
      expect(values).toBeDefined();
    });
  });
});
