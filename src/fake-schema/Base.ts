import { schemaResolvers, log } from "./utils";
import { createFakers } from "../fakers";
import { GraphQLSchema, GraphQLLeafType, GraphQLEnumType } from "graphql";
import { MockValue } from "./field/directives/mock/MockValue";
import { DefaultValue } from "./field/value/DefaultValue";

export class Base {
  getRandomItem: Function;
  getRandomInt: Function;
  fakeValue: Function;
  typeFakers: any;
  typeMapValues: any[];
  schema: GraphQLSchema;
  config: any;

  setSchema(schema) {
    this.schema = schema;
    return this;
  }

  constructor(config, schema?) {
    this.setSchema(schema);
    const schemaRes = schemaResolvers(config);
    const $createFakers = schemaRes.createFakers || createFakers;
    const fake = $createFakers(config);

    if (this.isEnabled("logging")) {
      config.log = config.log || log;
    }
    this.config = config;
    this.typeFakers = schemaRes.typeFakers || fake.typeFakers;
    this.getRandomItem = schemaRes.getRandomItem || fake.getRandomItem;
    this.getRandomInt = schemaRes.getRandomInt || fake.getRandomInt;
    this.fakeValue = schemaRes.fakeValue || fake.fakeValue;
  }

  isEnabled(name) {
    const enabled = this.config.enabled;
    return enabled[name];
  }

  // get value or Error instance injected by the proxy
  getCurrentSourceProperty(source, path) {
    return source && source[path!.key];
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

  resolveMockValue({ genValue }, { type, field }) {
    return new MockValue({ genValue }, { type, field }, this.config).resolve();
  }

  resolveDefaultValue({ genValue, getLeafResolver }) {
    return new DefaultValue(
      {
        genValue,
        getLeafResolver
      },
      this.config,
      this
    ).resolve();
  }
}
