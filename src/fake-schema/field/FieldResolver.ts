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
import { ArrayResolver } from "./ArrayResolver";

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
    const { field, fields } = this;
    const fakeResolver = this.getResolver(field.type, field, fields);
    return (source, _0, _1, info) => {
      if (source && source.$example && source[field.name]) {
        return source[field.name];
      }

      const value = this.getCurrentSourceProperty(source, info.path);
      return value !== undefined ? value : fakeResolver(this.objectType);
    };
  }

  getResolver(type: GraphQLOutputType, field, fields?: string[]) {
    if (type instanceof GraphQLNonNull)
      return this.getResolver(type.ofType, field, fields);
    if (type instanceof GraphQLList) {
      const fakeDirectives = getFakeDirectives(field);
      const functions = {
        getItem: this.getResolver(type.ofType, field, fields)
      };
      return this.arrayResolver(functions, fakeDirectives.sample);
    }

    if (isAbstractType(type)) return this.abstractTypeResolver(type);

    return this.fieldResolver(type, field, fields);
  }

  abstractTypeResolver(type: GraphQLAbstractType, ctx: any = {}) {
    const getItem = ctx.getItem || this.getRandomItem;
    const possibleTypes = this.schema.getPossibleTypes(type);
    return () => ({ __typename: getItem(possibleTypes, this.config) });
  }

  fieldResolver(type: GraphQLOutputType, field, fields: string[]) {
    const directives = {
      ...getFakeDirectives(type),
      ...getFakeDirectives(field)
    };
    const { examples } = directives;
    const ctx = {
      type,
      field,
      fields
    };

    this.genRandom = () =>
      this.getRandomItem(examples.values, this.config, ctx);
    this.genValue = () => examples.values[0];

    if (isLeafType(type)) {
      this.resolveLeafType(type, directives, ctx);
    } else {
      // TODO: error on fake directive
      if (examples) {
        return () => ({
          ...this.genRandom(),
          $example: true
        });
      }
      return () => ({});
    }
  }

  resolveLeafType(type, directives, ctx) {
    const { fake, examples, mock } = directives;
    const { field } = this;
    if (this.isEnabled("mocking")) {
      if (mock) return () => mock.value;
      if (examples) return () => examples.values;
      return () =>
        this.resolveMockValue({ genValue: this.genValue }, { type, field });
    }
    if (examples) return () => this.genRandom();
    if (fake) {
      return () => this.fakeValue(fake.type, fake.options, fake.locale, ctx);
    }
    const functions = {
      genValue: this.genRandom,
      getLeafResolver: this.getLeafResolver
    };
    return () => {
      this.resolveDefaultValue(functions, ctx);
    };
  }

  arrayResolver(functions, sample) {
    return new ArrayResolver(functions, sample, this.config).resolver;
  }
}
