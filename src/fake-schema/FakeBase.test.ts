import { FakeBase } from "./FakeBase";

describe("FakeBase", () => {
  const base = new FakeBase();

  describe("instance", () => {
    test("is defined", () => {
      expect(base).toBeDefined();
    });
  });
});
