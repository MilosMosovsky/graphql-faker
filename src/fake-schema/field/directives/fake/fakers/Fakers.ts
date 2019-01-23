//import * as faker from 'faker';
const faker = require("faker");
import { createFakeFunctions } from "./functions";
export { createFakeFunctions };
import { resolveFakes } from "../../../resolve";
import { Base } from "../../../../../Base";

export const createFakers = config => new Fakers(config);

// TODO: needs major rewrite/refactor!!!
// Start by making it a class with a contstructor
export class Fakers extends Base {
  faker: any;
  config: any;
  fakeFunctions: any;
  resolveFakes: Function;
  error: Function;

  constructor(config) {
    super(config);
    this.fakeFunctions = createFakeFunctions(config);
    const resolvers = config.resolvers || {};
    const directives = resolvers.directives || {};
    const { fake } = directives;

    this.resolveFakes = fake.resolveFakes || resolveFakes;
    this.error = config.error;
    this.faker = config.faker || faker;

    const { fakeFunctions } = this;
    Object.keys(fakeFunctions).forEach(key => {
      var value = fakeFunctions[key];
      if (typeof fakeFunctions[key] === "function")
        fakeFunctions[key] = { args: [], func: value };
    });
  }

  // TODO: move to directive/fake
  // TODO: needs major rewrite/refactor!!!
  resolveValue({ type, options, locale }, ctx: any = {}) {
    const { field, fields } = ctx;
    const typeName = type; // ctx.type ??
    const resolvedFake = this.resolveFakes({
      type: typeName,
      field,
      fields,
      config: this.config
    });
    const fakeType = typeName || resolvedFake.type;
    options = options || resolvedFake.options || {};

    const fakeGenerator = this.fakeFunctions[fakeType];
    if (!fakeGenerator) {
      this.error(`Could not find a matching fake generator for: ${fakeType}`, {
        type,
        field,
        fakeType,
        resolvedFake
      });
    }

    const argNames = fakeGenerator.args;

    //TODO: add check
    const callArgs = argNames.map(name => options[name]);
    let { faker } = this;
    const localeBackup = faker.locale;
    //faker.setLocale(locale || localeBackup);
    locale = locale || localeBackup;
    const result = fakeGenerator.func(...callArgs);
    //faker.setLocale(localeBackup);
    locale = localeBackup;
    return result;
  }
}
