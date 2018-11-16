import { fakeSchema } from "./fake-schema";
import { createSchemaApi } from "./build-schema";

const idl = `
  type Person {
    name: String
  }
`;

describe("fakeSchema", () => {
  const readIDL = async () => idl;
  const { buildServerSchema } = createSchemaApi({ readIDL });
  const schema = buildServerSchema({ idl });

  describe("schema and no config", () => {
    const fakedSchema = fakeSchema(schema);

    test("schema", () => {
      expect(fakedSchema).toBeDefined();
    });
  });
});
