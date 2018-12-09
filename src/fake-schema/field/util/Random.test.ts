import { Random } from "./Random";

describe("Random", () => {
  const field = {};
  const type = {};
  const config = {};
  const random = new Random({ field, type }, config);

  describe("instance", () => {
    describe("int", () => {
      const value = random.int(1, 5);

      test("value", () => {
        expect(value).toBeGreaterThanOrEqual(1);
      });
    });

    describe("item", () => {
      const list = [1, 5];
      const value = random.item(list);

      test("random item is in list", () => {
        expect(list).toContain(value);
      });
    });

    describe("createArray", () => {
      const value = random.createArray();
      console.log({ value });

      test("random item is in list", () => {
        expect([]).toContain(value);
      });
    });
  });
});
