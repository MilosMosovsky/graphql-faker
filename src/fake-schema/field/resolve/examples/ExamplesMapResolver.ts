import { TypeMapResolver } from "resolve-type-maps";

export const isValidResult = Array.isArray;

export const resolveResult = obj => {
  if (Array.isArray(obj)) return obj;
  if (obj.values) return obj.values;
};

export class ExamplesMapResolver extends TypeMapResolver {
  constructor(ctx = {}, config = {}) {
    super(ctx, config);
    this.init({
      mapName: "examples",
      functions: {
        isValidResult,
        resolveResult
      }
    });
  }
}
