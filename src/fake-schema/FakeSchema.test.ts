import { fakeSchema } from ".";
import { createServerSchema } from "../server-schema";

const idl = `
  type Person {
    name: String
  }
`;

describe("fakeSchema", () => {
  const readIDL = async () => idl;
  const serverSchema = createServerSchema({ readIDL });
  const schema = serverSchema.build({ idl });

  describe("schema - no config", () => {
    const fakedSchema = fakeSchema(schema);

    test("schema", () => {
      expect(fakedSchema).toBeDefined();
    });
  });

  describe("schema - with config", () => {
    const config = {};
    const fakedSchema = fakeSchema(schema, config);

    test("schema", () => {
      expect(fakedSchema).toBeDefined();
    });
  });
});
