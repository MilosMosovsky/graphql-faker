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

import { resolveValues } from "./ExampleValue";

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
