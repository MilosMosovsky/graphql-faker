import { createServer } from ".";
import { readIdl } from "../idl";

const _idl = `
  type Person {
    name: String
  }
`;

const _schemaIdl = `
  type Person {
    name: String
  }
`;

const _extIdl = `
type Person {
  name: String
}
`;

describe("createServerApi", () => {
  let store: any = {};
  const readIDL = readIdl;
  const saveIDL = async idl => (store.saved = idl);
  const IDL = { readIDL, saveIDL };
  const corsOptions = {};
  const opts = {};
  const server = createServer({ corsOptions, opts, IDL });

  describe("server", () => {
    const schemaIDL = readIdl(_schemaIdl);
    const extensionIDL = readIdl(_extIdl);

    test("is defined", () => {
      expect(server).toBeDefined();
    });

    describe("configure", () => {
      const callbackFn = () => {
        console.log("configured");
      };
      server.configure(schemaIDL, extensionIDL, callbackFn);
    });

    describe("configure", () => {
      const callbackFn = () => {
        console.log("configured");
      };
      server.configure(schemaIDL, extensionIDL, callbackFn);
    });
  });
});
