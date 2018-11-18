import { resolveFake } from "./";

// re-align `typeFieldMap` and `fieldMap` (resolve examples and fakes), using a generic `resultResolver`.
// Allow `matches` list for both, using `resolveMatches`
describe("resolveFake", () => {
  const type = "Person";
  const field = {
    type: "String",
    name: "firstName"
  };
  const fake = resolveFake({ type, field });

  describe("fake", () => {
    test("is defined", () => {
      expect(fake).toBeDefined();
    });
  });

  describe("with fields and config", () => {
    const config = {
      maps: {
        fakes: {
          fieldMap: {
            word: ["firstName"]
          }
        }
      }
    };
    const fields = ["firstName", "lastName"];

    const fake = resolveFake({ type, field, fields, config });

    describe("fake", () => {
      test("is defined", () => {
        expect(fake).toBeDefined();
      });
    });
  });
});

import { resolveResult } from "./FakeResolver";
describe("resolveResult", () => {
  const type = "lorem";
  const value = {
    type
  };
  const fakeType = resolveResult({ value });

  describe("fakeType", () => {
    test("is type", () => {
      expect(fakeType).toEqual(type);
    });
  });
});
