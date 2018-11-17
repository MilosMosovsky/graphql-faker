import { fakes as fakeMaps } from "../maps";
import { error } from "./error";
import {
  resolveFromFieldMap,
  createKeyMatcher,
  mapsFor,
  funsFor
} from "./common";

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

// re-align `typeFieldMap` and `fieldMap` (resolve examples and fakes), using a generic `resultResolver`.
// Allow `matches` list for both, using `resolveMatches`
export const resolveFake = ({ type, field, fields = [], config = {} }: any) => {
  const $error = config.error || error;
  const log = config.log || console.log;
  const typeName = typeof type === "string" ? type : type.name;
  const fieldName = field.name;
  const fieldType = field.type;

  const funs = funsFor("fakes", config);
  const maps = mapsFor("fakes", fakeMaps, config);

  const typeMap = maps.typeMap || {};
  const fieldMap = maps.fieldMap || {};

  const typeFakes = typeMap[typeName] || {};
  const typeFieldMap = typeFakes[fieldName];

  const $createKeyMatcher = funs.createKeyMatcher || createKeyMatcher;
  const $resolveFromFieldMap = funs.resolveFromFieldMap || resolveFromFieldMap;

  const ctx = {
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

  const functions = {
    createKeyMatcher: $createKeyMatcher,
    resolveResult,
    isValidResult
  };

  let result;
  if (typeFieldMap) {
    result = $resolveFromFieldMap({
      fieldMap: typeFieldMap,
      functions,
      ...ctx
    });
  }

  return (
    result ||
    $resolveFromFieldMap({
      fieldMap,
      functions,
      ...ctx
    })
  );
};
