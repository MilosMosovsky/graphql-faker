import {
  isLeafType,
  isAbstractType,
  GraphQLAbstractType,
  GraphQLOutputType,
  GraphQLList,
  GraphQLNonNull
} from "graphql";

import { getFakeDirectives } from "../utils";
import { Base } from "../Base";
import { ArrayValue } from "./value/ArrayValue";
import { PrimitiveValue } from "./value/PrimitiveValue";

export class FieldResolver extends Base {
  field: any;
  objectType: any;
  fields: string[];
  genRandom: Function;
  genValue: Function;

  constructor(schema, field, objectType, fields, config) {
    super(config, schema);
    this.objectType = objectType;
    this.fields = fields;
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
    const getItem = ctx.getItem || this.getRandomItem;
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
    const genRandom = () => this.getRandomItem(examples.values, this.config);

    return () => ({
      ...genRandom(),
      $example: true
    });
  }

  resolveLeafType(type, directives) {
    new PrimitiveValue({ type, field: this.field, directives }, this.config);
  }

  arrayResolver(functions, sample) {
    return new ArrayValue({ functions, sample }, this.config).resolver;
  }
}
