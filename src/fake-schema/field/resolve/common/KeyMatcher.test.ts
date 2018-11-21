import { createKeyMatcher, KeyMatcher } from "./KeyMatcher";

// re-align `typeFieldMap` and `fieldMap` (resolve examples and fakes), using a generic `resultResolver`.
// Allow `matches` list for both, using `resolveMatches`

describe("FieldMap", () => {
  const ctx: any = {
    valid: {
      functions: {
        createKeyMatcher: () => ({})
      }
    },
    invalid: {}
  };
  const config = {
    resolvers: {
      maps: {
        fakes: {
          resolveResult: () => 1
        }
      }
    },
    maps: {
      fakes: {
        x: 1
      },
      examples: {
        x: 2
      }
    }
  };

  describe("new", () => {
    test("invalid ctx throws", () => {
      expect(() => new KeyMatcher(ctx.invalid, config)).toThrow();
    });

    test("valid ctx does not throw", () => {
      expect(() => new KeyMatcher(ctx.valid, config)).not.toThrow();
    });
  });
});

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
