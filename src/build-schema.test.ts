import { createSchemaApi } from "./build-schema";

const idl = `
  type Person {
    name: String
  }
`;

describe("createSchemaApi", () => {
  describe("with idl", () => {
    const readIDL = async () => idl;
    const { buildServerSchema } = createSchemaApi({ readIDL });
    const schema = buildServerSchema({ idl });

    test("schema", () => {
      expect(schema).toBeDefined();
    });
  });
});
