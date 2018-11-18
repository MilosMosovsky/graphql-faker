import { createFakers, Fakers } from "./Fakers";

describe("createFakers", () => {
  const config = {};
  const api = createFakers(config);

  describe("api", () => {
    test("is defined", () => {
      expect(api).toBeDefined();
    });
  });
});

describe("Fakers", () => {
  const config = {};
  const api = new Fakers(config);

  describe("api", () => {
    test("is defined", () => {
      expect(api).toBeDefined();
    });
  });
});
