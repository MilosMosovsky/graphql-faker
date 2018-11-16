import { examples as exampleMaps } from "../maps";
import { error } from "./error";
import { matchValue, validateFunction, directivesObj } from "./common";

function exampleFuns(config) {
  return directivesObj(config).example || {};
}

const resolveValues = obj => (typeof obj === "string" ? [] : obj.values);

function createKeyMatcher({
  fieldMap,
  type,
  name,
  field,
  fields,
  error,
  config
}) {
  let matchedValues;
  const example = exampleFuns(config);
  const $resolveExampleValues = example.resolveValues || resolveValues;
  const ctx = { type, name, field, fields, error, config };
  return function matchFakeByKey(key) {
    let obj = fieldMap[key];
    // allow more fine grained mapping on type of field
    obj = obj[type] || obj.default || obj;

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
      if (matchValue(value, name, ctx)) {
        matchedValues = $resolveExampleValues(obj);
        return value;
      }
    });
    return matchedValues;
  };
}

function resolveFromFieldMap({
  config,
  error,
  fieldMap,
  createKeyMatcher,
  type,
  field,
  fields
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
    fields,
    config,
    error
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
export const resolveExample = ({ field, type, fields, config }): any[] => {
  const $exampleMaps = config.exampleMaps || exampleMaps;

  const typeMap = $exampleMaps.typeMap || {};
  const fieldMap = $exampleMaps.fieldMap || {};

  const typeExamples = typeMap[type] || {};
  const typeFieldMatch = typeExamples[field];
  const $error = config.error || error;

  if (typeFieldMatch) return typeFieldMatch;
  const example = exampleFuns(config);
  const $createKeyMatcher = example.createKeyMatcher || createKeyMatcher;
  const ctx = {
    type,
    field,
    fields,
    error: $error,
    config
  };

  return resolveFromFieldMap({
    createKeyMatcher: $createKeyMatcher,
    fieldMap,
    ...ctx
  });
};
