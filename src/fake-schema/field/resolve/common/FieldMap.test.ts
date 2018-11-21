import { FieldMap } from "./FieldMap";

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
      expect(() => new FieldMap(ctx.invalid, config)).toThrow();
    });

    test("valid ctx does not throw", () => {
      expect(() => new FieldMap(ctx.valid, config)).not.toThrow();
    });
  });

  describe("instance", () => {
    const fieldMap = new FieldMap(ctx.valid, config);
    test("defined", () => {
      expect(fieldMap).toBeDefined();
    });

    describe("resolve", () => {
      const resolved = fieldMap.resolve();

      test("resolved", () => {
        expect(resolved).toBeDefined();
      });
    });
  });
});

describe("resolveFromFieldMap", () => {});
