import { examples as exampleMaps } from "../maps";
import { error } from "./error";
import { matchValue, validateFunction, directivesObj } from "./common";

function exampleFuns(config) {
  return directivesObj(config).example || {};
}

export const resolveValues = obj => (typeof obj === "string" ? [] : obj.values);

export function createKeyMatcher({
  fieldMap,
  type,
  fieldName,
  fieldType,
  field,
  fields,
  error,
  config
}) {
  let matchedValues;
  const example = exampleFuns(config);
  const $resolveExampleValues = example.resolveValues || resolveValues;
  const ctx = { type, fieldName, fieldType, field, fields, error, config };
  return function matchFakeByKey(key) {
    let obj = fieldMap[key];
    // allow more fine grained mapping on type of field
    obj = obj.__types || obj;
    obj = obj[fieldType] || obj[fieldType.lowercase()] || obj.default || obj;

    if (Array.isArray(obj)) {
      matchedValues = obj;
      return key;
    }
    const matches = obj.match || obj.matches || [key];
    if (!Array.isArray(matches)) {
      error(`resolveArray: ${key} missing matches array. Invalid ${matches}`, {
        key,
        obj,
        matches,
        ...ctx
      });
    }
    matches.find(value => {
      if (matchValue(value, fieldName, ctx)) {
        matchedValues = $resolveExampleValues(obj);
        return value;
      }
    });
    return matchedValues;
  };
}

export function resolveFromFieldMap({
  fieldMap,
  createKeyMatcher,
  type,
  field,
  fieldName,
  fieldType,
  fields,
  config,
  error,
  log
}) {
  validateFunction({
    method: "resolveExample",
    data: {
      config
    },
    func: createKeyMatcher,
    functionName: "createKeyMatcher",
    error
  });

  const matchKey = createKeyMatcher({
    fieldMap,
    type,
    field,
    fieldName,
    fieldType,
    fields,
    config,
    error,
    log
  });
  const keys = Object.keys(fieldMap);
  let values;
  const key = keys.find(key => {
    values = matchKey(key);
    return Boolean(values);
  });

  return key ? values : null;
}

// TODO: split into separate functions for resolving typeMap and fieldMap similar to resolveFake
export const resolveExample = ({
  field,
  type,
  fields = [],
  config = {}
}: any): any[] => {
  const maps = config.maps || {};
  const $exampleMaps = maps.examples || exampleMaps;

  const typeMap = $exampleMaps.typeMap || {};
  const fieldMap = $exampleMaps.fieldMap || {};

  const typeExamples = typeMap[type] || {};
  const typeFieldMatch = typeExamples[field];
  const $error = config.error || error;
  const log = config.log || console.log;

  if (typeFieldMatch) return typeFieldMatch;
  const example = exampleFuns(config);
  const $createKeyMatcher = example.createKeyMatcher || createKeyMatcher;
  const ctx = {
    type,
    field,
    fieldName: field.name,
    fieldType: field.type,
    fields,
    config,
    error: $error,
    log
  };

  return resolveFromFieldMap({
    createKeyMatcher: $createKeyMatcher,
    fieldMap,
    ...ctx
  });
};
