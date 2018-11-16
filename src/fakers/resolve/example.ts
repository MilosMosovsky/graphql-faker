import { examples as exampleMaps } from "../maps";
import { error } from "./error";
import { matchValue, validateFunction, directivesObj } from "./common";

function exampleFuns(config) {
  return directivesObj(config).example || {};
}

export const resolveValues = (obj, fieldType?: string) => {
  if (Array.isArray(obj)) return obj;
  if (obj.values) return obj.values;

  obj = obj.__types || obj;
  if (fieldType) {
    obj = obj[fieldType] || obj[fieldType.toLowerCase()] || obj.default || obj;
  }
  return resolveValues(obj, fieldType);
};

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
  const $resolveValues = example.resolveValues || resolveValues;
  const ctx = { type, fieldName, fieldType, field, fields, error, config };
  return function matchFakeByKey(key) {
    let obj = fieldMap[key];
    let matches = obj.match || obj.matches;
    // allow more fine grained mapping on type of field
    obj = obj.__types || obj;
    obj = obj[fieldType] || obj[fieldType.toLowerCase()] || obj.default || obj;

    if (Array.isArray(obj)) {
      matchedValues = obj;
      return key;
    }
    matches = matches || obj.match || obj.matches || [key];
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
        matchedValues = $resolveValues(obj, fieldType);
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

// re-align `typeFieldMap` and `fieldMap` (resolve examples and fakes), using a generic `resultResolver`.
// Allow `matches` list for both, using `resolveMatches`
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
  const fieldName = field.name;
  const fieldType = field.type;

  if (typeFieldMatch) return resolveValues(typeFieldMatch, fieldType);
  const example = exampleFuns(config);
  const $createKeyMatcher = example.createKeyMatcher || createKeyMatcher;
  const ctx = {
    type,
    field,
    fieldName,
    fieldType,
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
