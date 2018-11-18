import { createTypeFakers, TypeFakers } from "./TypeFakers";

describe("createTypeFakers", () => {
  const config = {};
  const api = createTypeFakers(config);

  describe("api", () => {
    test("is defined", () => {
      expect(api).toBeDefined();
    });
  });
});

describe("TypeFakers", () => {
  const config = {};
  const api = new TypeFakers(config);

  describe("api", () => {
    test("is defined", () => {
      expect(api).toBeDefined();
    });
  });
});
