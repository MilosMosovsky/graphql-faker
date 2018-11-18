import { log } from "./utils";
import { GraphQLSchema, GraphQLLeafType, GraphQLEnumType } from "graphql";
import { MockValue } from "./field/directives/mock";
import { DefaultValue } from "./field/value";

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
    this.config = config;
    this.setSchema(schema);
    if (this.isEnabled("logging")) {
      config.log = config.log || log;
    }
  }

  isEnabled(name) {
    const enabled = this.config.enabled;
    return enabled[name];
  }

  // get value or Error instance injected by the proxy
  getCurrentSourceProperty(source, path) {
    return source && source[path!.key];
  }

  getLeafResolver(type: GraphQLLeafType) {
    const config = this.config;
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
