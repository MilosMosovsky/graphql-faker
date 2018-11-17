import { GraphQLSchema } from "graphql";
import { FakeSchema } from "./FakeSchema";

export function fakeSchema(
  schema: GraphQLSchema,
  config: any = {}
): GraphQLSchema {
  return new FakeSchema(schema, config).schema;
}

export { FakeSchema } from "./FakeSchema";
