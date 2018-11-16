import { resolveFake, resolveFakeOptions, resolveFakeType } from "./fake";

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

describe("resolveFakeType", () => {
  const type = "lorem";
  const value = {
    type
  };
  const fakeType = resolveFakeType({ value });

  describe("fakeType", () => {
    test("is defined", () => {
      expect(fakeType).toEqual(type);
    });
  });
});

describe("resolveFakeOptions", () => {
  const options = {
    count: 1
  };

  const value = {
    options
  };
  const fakeOpts = resolveFakeOptions({ value });

  describe("fakeOpts", () => {
    test("is defined", () => {
      expect(fakeOpts).toEqual(options);
    });
  });
});
