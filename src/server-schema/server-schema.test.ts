import { createServerSchema } from ".";

const idl = `
  type Person {
    name: String
  }
`;

describe("createSchemaApi", () => {
  describe("with idl", () => {
    const readIDL = async () => idl;
    const { build } = createServerSchema({ readIDL });
    const schema = build({ idl });

    test("schema", () => {
      expect(schema).toBeDefined();
    });
  });
});
