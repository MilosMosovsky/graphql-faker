import { createKeyMatcher } from "./KeyMatcher";

// re-align `typeFieldMap` and `fieldMap` (resolve examples and fakes), using a generic `resultResolver`.
// Allow `matches` list for both, using `resolveMatches`
describe("createKeyMatcher", () => {
  // fieldMap,
  // type,
  // typeName,
  // fieldName,
  // fieldType,
  // field,
  // fields,
  // error,
  // config,
  // functions

  // const type = "Person";
  // const field = {
  //   type: "String",
  //   name: "firstName"
  // };

  const ctx: any = {};
  const key = "x";
  const matchKey = createKeyMatcher(ctx).resolver;
  const value = matchKey(key);

  describe("value", () => {
    test("is defined", () => {
      expect(value).toBeDefined();
    });
  });
});
