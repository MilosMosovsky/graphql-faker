import { EntryMatcher } from "./EntryMatcher";

describe("EntryMatcher", () => {
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

  const obj = {};
  const matches = ["label", "caption"];

  describe("new", () => {
    test("invalid ctx throws", () => {
      expect(() => new EntryMatcher(ctx.invalid, config)).toThrow();
    });

    test("valid ctx does not throw", () => {
      expect(() => new EntryMatcher(ctx.valid, config)).not.toThrow();
    });
  });

  describe("instance", () => {
    const entryMatcher = new EntryMatcher(ctx.valid, config);
    test("defined", () => {
      expect(entryMatcher).toBeDefined();
    });

    describe("resolveMatches", () => {
      const obj = {};
      const key = "name";
      const resolved = entryMatcher.resolveMatches(obj, { key });
      test("resolved", () => {
        expect(resolved).toBeDefined();
      });
    });

    describe("matchResult", () => {
      const result = entryMatcher.matchResult(obj, matches);

      test("result matched", () => {
        expect(result).toBeDefined();
      });
    });

    describe("matchName", () => {
      const matchItem = {};
      const matched = entryMatcher.matchName(matchItem);

      test("item matched", () => {
        expect(matched).toBeDefined();
      });
    });
  });
});
