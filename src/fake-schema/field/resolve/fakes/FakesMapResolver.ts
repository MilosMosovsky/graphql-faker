import { MapResolver } from "../MapResolver";

export const isValidResult = value => {
  return typeof value === "string" || value.faker;
};

export const resolveResult = ({ value, key }: any = {}) => {
  key = key || value;
  const $default = { faker: key, options: {} };
  if (value.faker) {
    return { faker: value.faker, options: value.options || {} };
  }
  return $default;
};

export class FakesMapResolver extends MapResolver {
  constructor(ctx = {}, config = {}) {
    super("fakes", ctx, config);
    this.functions = {
      ...this.functions,
      // TODO: make configurable?
      resolveResult,
      isValidResult
    };
  }
}
