import { Kind, GraphQLObjectType, GraphQLScalarType } from "graphql";

export function astToJSON(ast) {
  switch (ast.kind) {
    case Kind.NULL:
      return null;
    case Kind.INT:
      return parseInt(ast.value, 10);
    case Kind.FLOAT:
      return parseFloat(ast.value);
    case Kind.STRING:
    case Kind.BOOLEAN:
      return ast.value;
    case Kind.LIST:
      return ast.values.map(astToJSON);
    case Kind.OBJECT:
      return ast.fields.reduce((object, { name, value }) => {
        object[name.value] = astToJSON(value);
        return object;
      }, {});
  }
}

export function schemaResolvers(config) {
  const resolvers = config.resolvers || {};
  return resolvers.schema || {};
}

export function useFakeProperties(type) {
  return type instanceof GraphQLObjectType && !type.name.startsWith("__");
}

export function isScalarField(type, stdTypeNames) {
  return type instanceof GraphQLScalarType && !stdTypeNames.includes(type.name);
}

export function setScalarType(type: GraphQLScalarType) {
  type.serialize = value => value;
  type.parseLiteral = astToJSON;
  type.parseValue = x => x;
}

export function getItem(array: any[], { index = 0 }: any = {}) {
  return array[index];
}

export function log(msg: string, { method, data }: any = {}) {
  const id = method ? `[${method}]` : "";
  const info = `${id}${msg}`;
  console.log(...[info, data || ""]);
}
