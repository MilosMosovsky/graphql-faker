import { BaseMapResolver } from "./BaseMapResolver";

// re-align `typeFieldMap` and `fieldMap` (resolve examples and fakes), using a generic `resultResolver`.
// Allow `matches` list for both, using `resolveMatches`
describe("BaseMapResolver", () => {
  const ctx: any = {};
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
  const resolver = new BaseMapResolver(ctx, config);

  describe("resolversMap", () => {
    const { resolversMap } = resolver;
    test("is defined", () => {
      expect(resolversMap).toBeDefined();
    });
  });

  describe("mapsFor", () => {
    const fakes = resolver.mapsFor("fakes");
    test("fakes", () => {
      expect(fakes.x).toBe(1);
    });
  });

  describe("funsFor", () => {
    const fakes = resolver.funsFor("fakes");
    test("fakes", () => {
      expect(typeof fakes.resolveResult).toEqual("function");
    });
  });
});
