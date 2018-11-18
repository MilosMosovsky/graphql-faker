import * as path from "path";
import { createServerSchema } from ".";

const idl = `
  type Person {
    name: String
  }
`;

describe("createSchemaApi", () => {
  const readIDL = async () => idl;
  const serverSchema = createServerSchema({ readIDL });

  describe("build schema", () => {
    const schema = serverSchema.build({ idl });

    test("schema", () => {
      expect(schema).toBeDefined();
    });

    describe("readAST", () => {
      describe("call with filepath", () => {
        const filepath = path.join(
          __dirname,
          "../..",
          "typedefs/default-schema.graphql"
        );
        const result = serverSchema.readAST(filepath);
        test("result", () => {
          expect(result).toBeDefined();
        });
      });
    });
  });
});
