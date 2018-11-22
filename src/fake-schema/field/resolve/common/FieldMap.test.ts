import { FieldMap, resolveFromFieldMap } from "./FieldMap";

const ctx: any = {
  valid: {
    functions: {
      createKeyMatcher: () => ({})
    },
    fieldMap: {}
  },
  invalid: {},
  missingFunctions: {
    fieldMap: {}
  },
  missingFieldMap: {
    functions: {}
  }
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
describe("FieldMap", () => {
  describe("new", () => {
    test("missing functions throws", () => {
      expect(() => new FieldMap(ctx.missingFunctions, config)).toThrow();
    });

    test("missing fieldMap throws", () => {
      expect(() => new FieldMap(ctx.missingFieldMap, config)).toThrow();
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

describe("resolveFromFieldMap", () => {
  const resolved = resolveFromFieldMap(ctx.valid);

  test("resolved", () => {
    expect(resolved).toBeDefined();
  });
});
