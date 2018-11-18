import { GraphQLSchema, GraphQLLeafType, GraphQLEnumType } from "graphql";
import { MockValue } from "./field/directives/mock";
import { DefaultValue } from "./field/value";
import { Random } from "./field/util";
import { TypeFakers } from "./field/directives/fake/fakers";
import { Base } from "../Base";
import { IRandom } from "./field/util/Random";

export class FakeBase extends Base {
  typeFakers: any;
  random: any;
  typeMapValues: any[];
  schema: GraphQLSchema;

  constructor(config, schema?) {
    super(config);
    this.setSchema(schema);
  }

  setSchema(schema) {
    this.schema = schema;
    return this;
  }

  // should be used by subclass over typeFakers
  getTypeFakers() {
    this.typeFakers = this.typeFakers || new TypeFakers(this.config);
    return this.typeFakers;
  }

  // used by: FieldResolver and this class
  getRandom({ field, type }): IRandom {
    this.random = this.random || new Random({ field, type }, this.config);
    return this.random;
  }

  // used by DefaultValue and PrimitiveValue
  fakeValue() {
    return this.typeFakers.resolveValue();
  }

  // get value or Error instance injected by the proxy
  // used by: FakeSchema and FakeResolver
  getCurrentSourceProperty(source, path) {
    return source && source[path!.key];
  }

  getLeafResolver(args: { field: any; type: GraphQLLeafType }) {
    const { field, type } = args;
    const config = this.config;
    const types = config.types || {};
    const functions = config.functions || {};
    const getItem = functions.getItem || this.getRandom({ field, type }).item;
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
