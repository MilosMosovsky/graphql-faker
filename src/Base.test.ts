import { Base } from "./Base";

describe("Base", () => {
  const enable = { logging: true };
  const base = new Base({ enable });

  describe("instance", () => {
    test("schema", () => {
      expect(base).toBeDefined();
    });

    describe("error", () => {
      test("throws", () => {
        try {
          base.error("x");
        } catch (err) {
          expect(err).toBeDefined();
        }
      });
    });

    describe("isEnabled", () => {
      test("enabled", () => {
        expect(base.isEnabled("logging")).toBe(true);
      });

      test("not enabled", () => {
        const base = new Base({});
        expect(base.isEnabled("logging")).toBe(false);
      });
    });
    describe("rootPath", () => {
      test("is a path", () => {
        expect(base.rootPath).toMatch(/src\//);
      });
    });
  });
});
