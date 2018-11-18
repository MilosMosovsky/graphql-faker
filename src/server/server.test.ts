import { createServer } from ".";

const idl = `
  type Person {
    name: String
  }
`;

describe("createServerApi", () => {
  const readIDL = async () => idl;
  const saveIDL = async () => undefined;
  const IDL = { readIDL, saveIDL };
  const corsOptions = {};
  const opts = {};
  const api = createServer({ corsOptions, opts, IDL });

  describe("api", () => {
    test("is defined", () => {
      expect(api).toBeDefined();
    });
  });
});
