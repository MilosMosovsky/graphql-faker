import { GraphQLSchema } from "graphql";
import { FakeSchema } from "./FakeSchema";

export function fakeSchema(
  schema: GraphQLSchema,
  config: any = {}
): FakeSchema {
  return new FakeSchema(schema, config);
}

export { FakeSchema } from "./FakeSchema";
