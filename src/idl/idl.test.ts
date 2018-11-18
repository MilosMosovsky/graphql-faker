import { createIdl, readIdl } from ".";
import * as path from "path";

const rootPath = path.join(__dirname, "..");

const fileName = path.join(rootPath, "typedefs", "default-schema.graphql");

const idls = {
  valid: readIdl(fileName),
  invalid: {}
};

describe("createIdlApi", () => {
  const api = createIdl(fileName);

  describe("api", () => {
    test("is defined", () => {
      expect(api).toBeDefined();
    });

    describe("readIdl", () => {
      describe("valid file", () => {
        const idl = readIdl(fileName);
        test("can parse IDL source", () => {
          expect(idl).toBeDefined();
        });
      });

      describe("invalid file", () => {
        test("can parse IDL source", () => {
          try {
            readIdl("oops");
          } catch (err) {
            expect(err).toBeDefined();
          }
        });
      });
    });

    describe("saveIdl", () => {
      api.saveIDL(idls.valid);
      test("can save valid IDL", () => {
        expect(api).toBeDefined();
      });
    });
  });
});
