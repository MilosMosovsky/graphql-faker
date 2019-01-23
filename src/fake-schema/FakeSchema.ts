import {
  isAbstractType,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLInputObjectType,
  GraphQLNonNull,
  GraphQLNamedType
} from "graphql";

import {
  astToJSON,
  isScalarField,
  setScalarType,
  useFakeProperties
} from "./utils";
import { FieldResolver } from "./field/FieldResolver";

import { FakeBase } from "./FakeBase";

type TypeMap = {
  [typeName: string]: GraphQLNamedType;
};

export class FakeSchema extends FakeBase {
  mutationType: GraphQLObjectType;
  typeMap: TypeMap;
  typeMapValues: any[];
  stdTypeNames: string[];

  constructor(schema: GraphQLSchema, config: any = {}) {
    super(schema, config);
    this.stdTypeNames = Object.keys(this.getTypeFakers);
    this.mutationType = schema.getMutationType();
    const jsonType = schema.getTypeMap()["examples__JSON"];
    jsonType["parseLiteral"] = astToJSON;
    this.typeMap = schema.getTypeMap();
    this.typeMapValues = Object.values(this.typeMap);
    this.resolveTypeMapValues();
  }

  resolveTypeMapValues() {
    for (const type of this.typeMapValues) {
      if (isScalarField(type, this.stdTypeNames)) {
        setScalarType(type as GraphQLScalarType);
      }
      if (useFakeProperties(type)) {
        this.addFakeProperties(type as GraphQLObjectType);
      }
      if (isAbstractType(type)) {
        type.resolveType = obj => obj.__typename;
      }
    }
  }

  protected isMutation(objectType) {
    return objectType === this.mutationType;
  }

  protected useRelayMutation(field, objectType) {
    return this.isMutation(objectType) && this.isRelayMutation(field);
  }

  protected addFakeProperties(objectType: GraphQLObjectType) {
    const fields = objectType.getFields();
    const values = Object.values(fields);
    for (const field of values) {
      field.resolve = this.useRelayMutation(field, objectType)
        ? this.getRelayMutationResolver()
        : this.getFieldResolver(field, objectType);
    }
  }

  protected isRelayMutation(field) {
    const args = field.args;
    if (args.length !== 1 || args[0].name !== "input") return false;

    const inputType = args[0].type;
    // TODO: check presence of 'clientMutationId'
    return (
      inputType instanceof GraphQLNonNull &&
      inputType.ofType instanceof GraphQLInputObjectType &&
      field.type instanceof GraphQLObjectType
    );
  }

  getFieldResolver(field, objectType, fields?: string[]) {
    return new FieldResolver(
      this.schema,
      { field, objectType, fields },
      this.config
    ).resolver;
  }

  getRelayMutationResolver() {
    return (source, args, _1, info) => {
      const value = this.getCurrentSourceProperty(source, info.path);
      if (value instanceof Error) return value;
      return { ...args["input"], ...value };
    };
  }
}
