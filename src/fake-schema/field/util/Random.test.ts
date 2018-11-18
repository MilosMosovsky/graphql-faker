import { Random } from "./Random";

describe("Random", () => {
  const field = {};
  const type = {};
  const config = {};
  const random = new Random({ field, type }, config);

  describe("instance", () => {
    describe("getRandomInt", () => {
      const value = random.getRandomInt(1, 5);

      test("value", () => {
        expect(value).toBeGreaterThanOrEqual(1);
        expect(value).toBeGreaterThanOrEqual(5);
      });
    });

    describe("getRandomItem", () => {});

    describe("createArray", () => {});
  });
});
