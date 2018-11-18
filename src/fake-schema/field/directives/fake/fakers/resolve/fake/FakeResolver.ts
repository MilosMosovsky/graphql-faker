import { fakes as fakeMaps } from "../../../maps";
import {
  resolveTypeFieldMap,
  resolveFromFieldMap,
  createKeyMatcher,
  mapsFor,
  funsFor
} from "../common";

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

// TODO: Almost same as for Example, extract into BaseResolver class
export class FakeResolver {
  fieldMap: any;
  ctx: any;
  typeFieldMap: any;
  resolveFromFieldMap: Function;
  functions: any;

  constructor({ type, field, fields = [], config = {} }: any) {
    const $error = config.error;
    const log = config.log || console.log;
    const typeName = typeof type === "string" ? type : type.name;
    const fieldName = field.name;
    const fieldType = field.type;

    const funs = funsFor("fakes", config);
    const maps = mapsFor("fakes", fakeMaps, config);

    const typeMap = maps.typeMap || {};
    this.fieldMap = maps.fieldMap || {};

    this.ctx = {
      type,
      field,
      typeName,
      fieldName,
      fieldType,
      fields,
      config,
      error: $error,
      log
    };

    this.typeFieldMap = resolveTypeFieldMap(
      typeMap,
      typeName,
      fieldName,
      this.ctx
    );
    const $createKeyMatcher = funs.createKeyMatcher || createKeyMatcher;
    this.resolveFromFieldMap = funs.resolveFromFieldMap || resolveFromFieldMap;
    this.functions = {
      createKeyMatcher: $createKeyMatcher,
      resolveResult,
      isValidResult
    };
  }

  resolve() {
    let result;
    const rest = {
      functions: this.functions,
      ...this.ctx
    };
    if (this.typeFieldMap) {
      result = this.resolveFromFieldMap({
        fieldMap: this.typeFieldMap,
        ...rest
      });
    }

    return (
      result ||
      this.resolveFromFieldMap({
        fieldMap: this.fieldMap,
        ...rest
      })
    );
  }
}
