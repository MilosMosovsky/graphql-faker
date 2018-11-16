import { fakes as fakeMaps } from "../maps";
import { error } from "./error";
import { matchValue, validateFunction, directivesObj } from "./common";

function exampleFuns(config) {
  return directivesObj(config).fake || {};
}

export const resolveFakeType = ({ value, key }: any = {}) => {
  key = key || value;
  return typeof value === "string" ? key : value.type;
};

export const resolveFakeOptions = ({ value }: any = {}) => {
  return typeof value === "string" ? {} : value.options;
};

export function resolveFromTypeFieldMap({
  typeFieldMap,
  type,
  field,
  fields,
  fieldType,
  fieldName,
  resolvers,
  config,
  error,
  log
}) {
  const ctx = { type, field, fieldType, fieldName, fields, error, config, log };

  const value = typeFieldMap[fieldName];
  const { resolveFakeType, resolveFakeOptions } = resolvers;
  if (typeof resolveFakeType !== "function") {
    error(
      "resolveFromTypeFieldMap: missing or invalid resolveFakeType function",
      {
        resolveFakeType,
        resolvers,
        config
      }
    );
  }
  const data = { resolvers, config };
  const validateCtx = {
    method: "resolveFromTypeFieldMap",
    data,
    error
  };

  validateFunction({
    ...validateCtx,
    func: resolveFakeType,
    functionName: "resolveFakeType"
  });
  validateFunction({
    ...validateCtx,
    func: resolveFakeOptions,
    functionName: "resolveFakeOptions"
  });

  const fakeType = value ? resolveFakeType({ value, ...ctx }) : field;
  const options = resolveFakeOptions({ value, error, config }) || {};
  return { type: fakeType, options };
}

export function createKeyMatcher({
  fieldMap,
  type,
  field,
  fieldName,
  fieldType,
  fields,
  error,
  config,
  log
}) {
  // ie. fake definition to be resolved
  let matchedValue;
  const ctx = { type, fieldName, fieldType, field, fields, error, config, log };
  return function matchFakeByKey(key) {
    let obj = fieldMap[key];
    // allow more fine grained mapping on type of field
    // TODO: move to common
    obj = obj.__types || obj;
    obj = obj[fieldType] || obj[fieldType.lowercase()] || obj.default || obj;

    const matches = Array.isArray(obj) ? obj : obj.match || obj.matches;
    if (!Array.isArray(matches)) {
      error(
        `matchFakeByKey: ${key} missing matches array. Invalid ${matches}`,
        {
          key,
          obj,
          matches,
          ...ctx
        }
      );
    }
    matches.find(value => {
      if (matchValue(value, fieldName, ctx)) {
        matchedValue = obj.values;
        return value;
      }
    });
    return matchedValue;
  };
}

export function resolveFromFieldMap({
  fieldMap,
  type,
  name,
  // fieldName,
  fieldType,
  field,
  fields,
  log,
  error,
  config
}) {
  const resolvers = config.resolvers || {};
  const fake = resolvers.fake || {};
  const $createKeyMatcher = fake.createKeyMatcher || createKeyMatcher;
  const ctx = { type, name, field, fieldType, fields, error, config, log };
  validateFunction({
    method: "resolveFieldMap",
    func: $createKeyMatcher,
    functionName: "createKeyMatcher",
    data: { config },
    error
  });

  let value;
  const matchKey = $createKeyMatcher({
    fieldMap,
    ...ctx
  });
  const keys = Object.keys(fieldMap);
  const key = keys.find(key => {
    value = matchKey(key);
    return Boolean(value);
  });
  return { value, key };
}

// TODO: test and make DRY (remove duplication - see resolveFake)
export const resolveFake = ({ type, field, fields = [], config = {} }: any) => {
  const maps = config.maps || {};
  const $fakeMaps = maps.fakes || fakeMaps;
  const typeMap = $fakeMaps.typeMap || {};
  const fieldMap = $fakeMaps.fieldMap || {};
  const log = config.log || console.log;
  const fieldType = field.type;
  const fieldName = field.name;

  const typeFieldMap = typeMap[type];

  const fake = exampleFuns(config);
  const $resolveFakeType = fake.resolveFakeType || resolveFakeType;
  const $resolveFakeOptions = fake.resolveFakeOptions || resolveFakeOptions;
  const $resolveFromFieldMap = fake.resolveFromFieldMap || resolveFromFieldMap;
  const $resolveFromTypeFieldMap =
    fake.resolveFromTypeFieldMap || resolveFromTypeFieldMap;

  const $error = config.error || error;
  let options = {};
  const ctx = {
    error: $error,
    config,
    log,
    type,
    field,
    fields,
    fieldType,
    fieldName
  };

  if (typeFieldMap) {
    const resolvers = {
      resolveFakeType: $resolveFakeType,
      resolveFakeOptions: $resolveFakeOptions
    };
    return $resolveFromTypeFieldMap({
      typeFieldMap,
      resolvers,
      ...ctx
    });
  }
  const { value, key } = $resolveFromFieldMap({
    fieldMap,
    ...ctx
  });

  return key
    ? {
        type: resolveFakeType({ value, key, ...ctx }),
        options: resolveFakeOptions({ value, ...ctx })
      }
    : { type, options };
};
