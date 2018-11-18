import { examples as exampleMaps } from "../fake/fakers/maps";
import { error } from "../fake/fakers/resolve/error";
import {
  createKeyMatcher,
  resolveFromFieldMap,
  funsFor,
  mapsFor
} from "../common";

export const isValidExample = Array.isArray;

export const resolveValues = obj => {
  if (Array.isArray(obj)) return obj;
  if (obj.values) return obj.values;
};

export class ExampleValue {
  typeFieldMap: any;
  fieldMap: any;
  resolveFromFieldMap: any;
  ctx: any;
  functions: any;

  constructor({ field, type, fields = [], config = {} }: any) {
    const $error = config.error || error;
    const log = config.log || console.log;
    const typeName = typeof type === "string" ? type : type.name;
    const fieldName = field.name;
    const fieldType = field.type;

    const $exampleMaps = mapsFor("examples", exampleMaps, config);
    const typeMap = $exampleMaps.typeMap || {};
    this.fieldMap = $exampleMaps.fieldMap || {};

    const typeExamples = typeMap[typeName] || {};
    this.typeFieldMap = typeExamples[fieldName];

    const funs = funsFor("examples", config);

    const $createKeyMatcher = funs.createKeyMatcher || createKeyMatcher;
    this.resolveFromFieldMap = funs.resolveFromFieldMap || resolveFromFieldMap;

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

    this.functions = {
      createKeyMatcher: $createKeyMatcher,
      // TODO: make configurable?
      isValidResult: isValidExample,
      resolveResult: resolveValues
    };
  }

  resolve() {
    let result;
    const rest = { functions: this.functions, ...this.ctx };

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
