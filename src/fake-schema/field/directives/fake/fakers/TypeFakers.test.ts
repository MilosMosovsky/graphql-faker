import { createTypeFakers } from "./TypeFakers";

describe("createTypeFakers", () => {
  const config = {};
  const api = createTypeFakers(config);

  describe("api", () => {
    test("is defined", () => {
      expect(api).toBeDefined();
    });
  });
});
