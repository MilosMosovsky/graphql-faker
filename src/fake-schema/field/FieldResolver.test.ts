import {
  FieldResolver,
  createFieldResolver,
  getFieldResolver
} from "./FieldResolver";
import { GraphQLObjectType, GraphQLAbstractType } from "graphql";

const schema = {};
const ctx = {};
const config = {};

describe("createFieldResolver", () => {
  const fr = createFieldResolver(schema, ctx, config);

  describe("instance", () => {
    test("is defined", () => {
      expect(fr).toBeDefined();
    });
  });
});

describe("getFieldResolver", () => {
  const resolver = getFieldResolver(schema, ctx, config);
  describe("resolver", () => {
    test("is defined", () => {
      expect(resolver).toBeDefined();
    });
  });
});

const personObjType: GraphQLObjectType = {
  name: "Person",
  description: "an object",
  isTypeOf: () => true,
  getFields: () => ({}),
  getInterfaces: () => [],
  toString: () => "x",
  extensionASTNodes: [
    {
      kind: "TypeExtensionDefinition",
      definition: {
        name: {
          kind: "Name",
          value: "Person"
        },
        kind: "ObjectTypeDefinition",
        fields: []
      }
    }
  ]
};

const userUnionType: GraphQLAbstractType = {
  name: "User",
  description: "a vehicle",
  getTypes: () => [personObjType],
  toString: () => "x",
  resolveType: () => "union"
};

describe("FieldResolver", () => {
  describe("instance", () => {
    const fr = new FieldResolver(schema, ctx, config);
    test("is defined", () => {
      expect(fr).toBeDefined();
    });

    describe("getResolver", () => {
      const resolver = fr.getResolver(personObjType);
      test("is defined", () => {
        expect(resolver).toBeDefined();
      });
    });

    describe("abstractTypeResolver", () => {
      const resolver = fr.abstractTypeResolver(userUnionType);
      test("is defined", () => {
        expect(resolver).toBeDefined();
      });
    });
  });
});
