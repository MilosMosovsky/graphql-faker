import { TypeMapResolver } from "resolve-type-maps";

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

export class FakesMapResolver extends TypeMapResolver {
  constructor(ctx = {}, config = {}) {
    super(ctx, config);
    this.init({
      mapName: "fakes",
      functions: {
        resolveResult,
        isValidResult
      }
    });
  }
}
