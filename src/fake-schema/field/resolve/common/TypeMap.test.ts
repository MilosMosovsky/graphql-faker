import { TypeMap } from "./TypeMap";

describe("TypeMap", () => {
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

  const typeMap = new TypeMap(ctx, config);

  describe("instance", () => {
    test("defined", () => {
      expect(typeMap).toBeDefined();
    });

    describe("resolve", () => {
      const maps: any = config.maps.fakes;
      const resolved = typeMap.resolve(maps.typeMap, "Person");

      test("resolved", () => {
        expect(resolved).toBeDefined();
      });
    });
  });
});
