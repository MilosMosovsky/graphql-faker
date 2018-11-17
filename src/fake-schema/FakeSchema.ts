import {
  isLeafType,
  isAbstractType,
  GraphQLSchema,
  GraphQLObjectType,
  GraphQLScalarType,
  GraphQLAbstractType,
  GraphQLOutputType,
  GraphQLInputObjectType,
  GraphQLList,
  GraphQLNonNull,
  GraphQLEnumType,
  GraphQLLeafType
} from "graphql";

import {
  createFakers
  // createFakeFunctions,
  // createTypeFakers,
  // maps
} from "../fakers";
import {
  MockArgs,
  DirectiveArgs,
  ExamplesArgs,
  FakeArgs,
  GraphQLAppliedDiretives,
  SampleArgs
} from "./types";
import {
  getItem,
  schemaResolvers,
  log,
  astToJSON,
  isScalarField,
  setScalarType,
  useFakeProperties
} from "./utils";

export class FakeSchema {
  getRandomItem: Function;
  getRandomInt: Function;
  fakeValue: Function;
  mutationType: GraphQLObjectType;
  schema: GraphQLSchema;
  config: any;
  typeFakers: any;

  constructor(schema: GraphQLSchema, config: any = {}) {
    this.schema = schema;
    this.config = config;
    const schemaRes = schemaResolvers(config);
    const $createFakers = schemaRes.createFakers || createFakers;
    const fake = $createFakers(config);

    if (this.isEnabled("logging")) {
      config.log = config.log || log;
    }

    this.typeFakers = schemaRes.typeFakers || fake.typeFakers;
    this.getRandomItem = schemaRes.getRandomItem || fake.getRandomItem;
    this.getRandomInt = schemaRes.getRandomInt || fake.getRandomInt;
    this.fakeValue = schemaRes.fakeValue || fake.fakeValue;

    const stdTypeNames = Object.keys(this.typeFakers);

    this.mutationType = schema.getMutationType();
    const jsonType = schema.getTypeMap()["examples__JSON"];
    jsonType["parseLiteral"] = astToJSON;
    const typeMap = schema.getTypeMap();
    const values = Object.values(typeMap);
    for (const type of values) {
      if (isScalarField(type, stdTypeNames)) {
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

  isMutation(objectType) {
    return objectType === this.mutationType;
  }

  useRelayMutation(field, objectType) {
    return this.isMutation(objectType) && this.isRelayMutation(field);
  }

  addFakeProperties(objectType: GraphQLObjectType) {
    const fields = objectType.getFields();
    const values = Object.values(fields);
    for (const field of values) {
      field.resolve = this.useRelayMutation(field, objectType)
        ? this.getRelayMutationResolver()
        : this.getFieldResolver(field, objectType);
    }
  }

  isRelayMutation(field) {
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
    const fakeResolver = this.getResolver(field.type, field, fields);
    return (source, _0, _1, info) => {
      if (source && source.$example && source[field.name]) {
        return source[field.name];
      }

      const value = this.getCurrentSourceProperty(source, info.path);
      return value !== undefined ? value : fakeResolver(objectType);
    };
  }

  getRelayMutationResolver() {
    return (source, args, _1, info) => {
      const value = this.getCurrentSourceProperty(source, info.path);
      if (value instanceof Error) return value;
      return { ...args["input"], ...value };
    };
  }

  // get value or Error instance injected by the proxy
  getCurrentSourceProperty(source, path) {
    return source && source[path!.key];
  }

  getResolver(type: GraphQLOutputType, field, fields?: string[]) {
    if (type instanceof GraphQLNonNull)
      return this.getResolver(type.ofType, field, fields);
    if (type instanceof GraphQLList)
      return this.arrayResolver(
        this.getResolver(type.ofType, field, fields),
        this.getFakeDirectives(field)
      );

    if (isAbstractType(type)) return this.abstractTypeResolver(type);

    return this.fieldResolver(type, field, fields);
  }

  abstractTypeResolver(type: GraphQLAbstractType, ctx: any = {}) {
    const getItem = ctx.getItem || this.getRandomItem;
    const possibleTypes = this.schema.getPossibleTypes(type);
    return () => ({ __typename: getItem(possibleTypes, this.config) });
  }

  resolveDefaultValue({ genValue, getLeafResolver, ctx }) {
    // try resolving value based purely on type and field
    const { type } = ctx;
    try {
      const exValue = genValue();
      const value = exValue || this.fakeValue(null, null, null, ctx);
      // if no value returned, fallback to using leaf resolver
      return value !== undefined ? value : getLeafResolver(type, this.config);
    } catch (err) {
      // if error on resolve, fallback to using leaf resolver (ie. generic value by field type)
      return getLeafResolver(type, this.config);
    }
  }

  fieldResolver(type: GraphQLOutputType, field, fields: string[]) {
    const directiveToArgs = {
      ...this.getFakeDirectives(type),
      ...this.getFakeDirectives(field)
    };
    const { fake, examples, mock } = directiveToArgs;
    const ctx = {
      type,
      field,
      fields
    };

    const genRandom = () =>
      this.getRandomItem(examples.values, this.config, ctx);
    const genValue = () => examples.values[0];
    const getLeafResolver = this.getLeafResolver;

    if (isLeafType(type)) {
      if (this.isEnabled("mocking")) {
        if (mock) return () => mock.value;
        if (examples) return () => examples.values;
        return () => this.resolveMockValue({ genValue, type, field });
      }
      if (examples) return () => genRandom();
      if (fake) {
        return () => this.fakeValue(fake.type, fake.options, fake.locale, ctx);
      }
      return () => {
        this.resolveDefaultValue({ genValue: genRandom, getLeafResolver, ctx });
      };
    } else {
      // TODO: error on fake directive
      if (examples) {
        return () => ({
          ...genRandom(),
          $example: true
        });
      }
      return () => ({});
    }
  }

  arrayResolver(itemResolver, { sample }: DirectiveArgs, config: any = {}) {
    const directives = config.directives || {};
    let opts = directives.sample || {};
    const defaultOpts = {
      min: 1,
      max: 10,
      empty: 0.2
    };

    const options = {
      ...opts,
      ...sample,
      ...defaultOpts
    } as SampleArgs;

    let { min, max, empty } = options;
    if (min > max) {
      max = ++min;
    }

    return (...args) => {
      const rand = Math.random();
      if (rand < empty) {
        return [];
      }
      let length = this.getRandomInt(min, max);
      const result = [];

      while (length-- !== 0) result.push(itemResolver(...args));
      return result;
    };
  }

  getFakeDirectives(object: any) {
    const directives = object["appliedDirectives"] as GraphQLAppliedDiretives;
    if (!directives) return {};

    const result = {} as DirectiveArgs;

    if (directives.isApplied("mock"))
      result.mock = directives.getDirectiveArgs("mock") as MockArgs;

    if (directives.isApplied("fake"))
      result.fake = directives.getDirectiveArgs("fake") as FakeArgs;

    if (directives.isApplied("examples"))
      result.examples = directives.getDirectiveArgs("examples") as ExamplesArgs;

    if (directives.isApplied("sample"))
      result.sample = directives.getDirectiveArgs("sample") as SampleArgs;

    return result;
  }

  getTypeFaker(type, opts) {
    const typeFaker = this.typeFakers[type.name];
    if (typeFaker) {
      const typeFakerGenOpts = {
        ...typeFaker.defaultOptions,
        ...opts
      };
      return typeFaker.generator(typeFakerGenOpts);
    } else {
      return () => `<${type.name}>`;
    }
  }

  isEnabled(name) {
    const enabled = this.config.enabled;
    return enabled[name];
  }

  resolveMockValue({ genValue, type, field }) {
    const mockMap = this.isEnabled("mocking") ? this.config.mocks : {};
    const ctx = {
      functions: {
        getItem,
        getTypeFaker: () => {
          return () => {
            let map = mockMap[type.name] || {};
            let res = map[field.name] || map;
            res = map[field.type] || res;
            if (res) return res;

            if (!res) {
              map = mockMap.__types;
              return map[field.type];
            }
          };
        }
      }
    };
    const getLeafResolver = this.getLeafResolver;
    return this.resolveDefaultValue({ genValue, getLeafResolver, ctx });
  }

  getLeafResolver(type: GraphQLLeafType, config: any = {}) {
    const types = config.types || {};
    const functions = config.functions || {};
    const getItem = functions.getItem || this.getRandomItem;
    const typeFaker = functions.getTypeFaker || this.getTypeFaker;

    const opts = types[type.name];
    if (type instanceof GraphQLEnumType) {
      const values = type.getValues().map(x => x.value);
      return () => getItem(values);
    }
    return typeFaker(type, opts);
  }
}
