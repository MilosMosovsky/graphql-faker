import { FakeBase } from "../../../../FakeBase";
const faker = require("faker");

export const createTypeFakers = config => new TypeFakers(config).resolvers;

// TODO: needs major rewrite/refactor!!!
export class TypeFakers extends FakeBase {
  opts: any;
  faker: any;

  constructor(config: any = {}) {
    super(config);
    const types = config.types || {};
    this.faker = config.faker || faker;
    this.opts = {
      ...this.defaults,
      ...types
    };
  }

  get defaults() {
    return {
      Int: { min: 0, max: 99999 },
      Float: { min: 0, max: 99999, precision: 0.01 },
      String: {},
      Boolean: {},
      ID: { max: 9999999999, separator: ":" }
    };
  }

  get primitives() {
    const { opts, faker } = this;
    return {
      Int: {
        defaultOptions: opts.Int,
        generator: options => {
          options.precision = 1;
          return () => faker.random.number(options);
        }
      },
      Float: {
        defaultOptions: opts.Float,
        generator: options => {
          return () => faker.random.number(options);
        }
      },
      String: {
        defaultOptions: opts.String,
        generator: () => {
          return () => "string";
        }
      },
      Boolean: {
        defaultOptions: opts.Boolean,
        generator: () => {
          return () => faker.random.boolean();
        }
      },
      ID: {
        defaultOptions: opts.ID,
        generator: options => {
          return parentType =>
            new Buffer(
              parentType.name +
                options.separator +
                faker.random.number(options).toString()
            ).toString("base64");
        }
      }
    };
  }

  get customScalars() {
    const { opts, config } = this;
    return typeof config.scalars === "function" ? config.scalars(opts) : {};
  }

  get resolvers() {
    return {
      ...this.primitives,
      ...this.customScalars
    };
  }
}
