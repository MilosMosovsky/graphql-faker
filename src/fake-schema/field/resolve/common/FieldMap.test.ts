import { FieldMap } from "./FieldMap";

describe("FieldMap", () => {
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

  const fieldMap = new FieldMap(ctx, config);

  describe("instance", () => {
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
