import {
  isLeafType,
  isAbstractType,
  GraphQLAbstractType,
  GraphQLOutputType,
  GraphQLList,
  GraphQLNonNull
} from "graphql";

import { getFakeDirectives } from "../utils";
import { FakeBase } from "../FakeBase";
import { ArrayValue } from "./value/ArrayValue";
import { PrimitiveValue } from "./value/PrimitiveValue";

export function createFieldResolver(schema, ctx, config): FieldResolver {
  return new FieldResolver(schema, ctx, config);
}

export function getFieldResolver(schema, ctx, config): Function {
  return createFieldResolver(schema, ctx, config).resolver;
}

export class FieldResolver extends FakeBase {
  type: any;
  field: any;
  objectType: any;
  fields: string[];
  ctx: any;

  constructor(schema, ctx, config) {
    super(config, schema);
    this.ctx = ctx;
    const { objectType, type, field } = ctx;
    this.objectType = objectType;
    this.type = type;
    this.field = field;
  }

  get resolver() {
    const { field } = this;
    const fakeResolver = this.getResolver(field.type);
    return (source, _0, _1, info) => {
      if (source && source.$example && source[field.name]) {
        return source[field.name];
      }

      const value = this.getCurrentSourceProperty(source, info.path);
      return value !== undefined ? value : fakeResolver(this.objectType);
    };
  }

  getResolver(type: GraphQLOutputType) {
    const { field } = this;
    if (type instanceof GraphQLNonNull) return this.getResolver(type.ofType);
    if (type instanceof GraphQLList) {
      const fakeDirectives = getFakeDirectives(field);
      const functions = {
        getItem: this.getResolver(type.ofType)
      };
      return this.arrayResolver(functions, fakeDirectives.sample);
    }

    if (isAbstractType(type)) return this.abstractTypeResolver(type);

    return this.fieldResolver(type);
  }

  abstractTypeResolver(type: GraphQLAbstractType, ctx: any = {}) {
    const getItem = ctx.getItem || this.getRandom(ctx).item;
    const possibleTypes = this.schema.getPossibleTypes(type);
    return () => ({ __typename: getItem(possibleTypes, this.config) });
  }

  fieldResolver(type: GraphQLOutputType) {
    const { field } = this;
    const directives = {
      ...getFakeDirectives(type),
      ...getFakeDirectives(field)
    };
    isLeafType(type)
      ? this.resolveLeafType(type, directives)
      : this.resolveComplexType(directives);
  }

  resolveComplexType(directives) {
    const { examples } = directives;

    // TODO: error on fake directive
    if (examples) {
      return this.getExamplesResolver(examples);
    }
    return this.getDefaultComplexResolver();
  }

  getDefaultComplexResolver() {
    return () => ({});
  }

  getExamplesResolver(examples) {
    const genRandom = () => this.getRandom(this.ctx).item(examples.values);

    return () => ({
      ...genRandom(),
      $example: true
    });
  }

  resolveLeafType(type, directives) {
    return new PrimitiveValue(
      { type, field: this.field, directives },
      this.config
    ).resolver;
  }

  arrayResolver(functions, sample) {
    return new ArrayValue({ functions, sample }, this.config).resolver;
  }
}
