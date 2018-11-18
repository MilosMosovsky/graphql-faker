import { createServer } from ".";
import { readIdl } from "../idl";

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

    describe("configEditor", () => {
      server.configEditor();
      test("app has /server route handler", () => {
        expect(server.routes.editor).toBe(true);
      });
    });

    describe("configEditor", () => {
      server.configGraphQL();
      test("app has /editor route handler", () => {
        expect(server.routes.graphql).toBe(true);
      });
    });

    describe("configUserIdl", () => {
      server.configUserIdl();
      test("app has /user-idl route handler", () => {
        expect(server.routes.userIdl).toBe(true);
      });
    });

    describe("configure", () => {
      const callbackFn = () => {
        console.log("configured");
      };
      server.configure(schemaIDL, extensionIDL, callbackFn);

      test("app is ready and listens on port", () => {
        expect(server.app).toBeDefined();
      });

      test("app has /graphql route handlers", () => {
        expect(server.routes.graphql).toBe(true);
      });

      test("app has /editor route handler", () => {
        expect(server.routes.editor).toBe(true);
      });

      test("app has /user-idl route handlers", () => {
        expect(server.routes.userIdl).toBe(true);
      });

      describe("run", () => {
        describe("default", () => {
          server.run();

          test("app listening on port", () => {
            expect(server.app).toBeDefined();
          });
        });

        describe("open", () => {
          server.run({ open: true });

          test("opened browser after start", () => {
            expect(server.opened).toBe(true);
          });
        });

        describe("server.shutdown", () => {
          server.exitOnShutdown = false;
          server.shutdown();

          test("was shutdown", () => {
            expect(server.wasShutdown).toBe(true);
          });
        });
      });
    });
  });
});
