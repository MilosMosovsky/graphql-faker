const escapeStrRegexp = require("escape-string-regexp");

export function validateFunction({ method, functionName, func, data, error }) {
  if (typeof func !== "function") {
    error(`${method}: missing or invalid ${functionName} function`, {
      [functionName]: func,
      ...data
    });
  }
}

export function matchName(matchItem, name, ctx: any = {}) {
  const regExpPattern =
    typeof matchItem === "string" ? escapeStrRegexp(matchItem) : matchItem;
  const opts = ctx.regExpOpts || "i";
  const regExp = new RegExp(regExpPattern, opts);
  return regExp.test(name);
}

export function directivesObj(config) {
  const resolvers = config.resolvers || {};
  return resolvers.directives || {};
}

export function mapsFor(name, defaultMap, config) {
  const maps = config.maps || {};
  return maps[name] || defaultMap || {};
}

function resolveMatches(obj, { key }) {
  if (typeof obj === "string") {
    return [obj];
  }
  return obj.match || obj.matches || [key];
}

function resolveObj(obj, { fieldType }) {
  // allow more fine grained mapping on type of field
  return (
    obj[fieldType] ||
    obj[fieldType.toLowerCase()] ||
    obj.default ||
    obj.any ||
    obj
  );
}

export function funsFor(name, config) {
  return directivesObj(config)[name] || {};
}

export function validateMatches(matches, key, obj, error, ctx) {
  return Array.isArray(matches)
    ? true
    : error(`resolveArray: ${key} missing matches array. Invalid ${matches}`, {
        key,
        obj,
        matches,
        ...ctx
      });
}

export function resolveFromFieldMap({
  fieldMap,
  functions,
  type,
  typeName,
  field,
  fieldName,
  fieldType,
  fields,
  config,
  error,
  log
}) {
  const createKeyMatcher = functions.createKeyMatcher || {};

  validateFunction({
    method: "resolveFromFieldMap",
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
    typeName,
    field,
    fieldName,
    fieldType,
    fields,
    config,
    error,
    log,
    functions
  });

  const keys = Object.keys(fieldMap);
  let result;
  const key = keys.find(key => {
    result = matchKey(key);
    return Boolean(result);
  });

  return key ? result : null;
}

const identity = obj => obj;

export const hasMatches = obj =>
  Object.values(obj).find((val: any) => val.matches);

export function resolveMapByTypeName(typeMap, typeName, ctx) {
  const hit = typeMap[typeName] || {};
  let result;
  Object.keys(typeMap).find(typeName => {
    const obj = typeMap[typeName];
    const matches = resolveMatches(obj, { key: typeName });
    result = matchResult(obj, matches, identity, typeName, typeName, ctx);
    return result;
  });
  return result || hit;
}

export function resolveTypeFieldMap(typeMap, typeName, fieldName, ctx) {
  const map = resolveMapByTypeName(typeMap, typeName, ctx);
  return map[fieldName];
}

export function matchResult(obj, matches, resolveResult, name, type, ctx) {
  let result;
  // todo: make generic
  matches.find(matchItem => {
    if (matchName(matchItem, name, ctx)) {
      result = resolveResult(obj, type, ctx);
      return matchItem;
    }
  });
  return result;
}

export function createKeyMatcher({
  fieldMap,
  type,
  typeName,
  fieldName,
  fieldType,
  field,
  fields,
  error,
  config,
  functions
}) {
  let result;
  const { resolveResult, isValidResult } = functions;

  const ctx = {
    type,
    typeName,
    fieldName,
    fieldType,
    field,
    fields,
    error,
    config
  };

  return key => {
    let matches;
    let obj = fieldMap[key];
    obj = resolveObj(obj, { fieldType });
    if (isValidResult(obj)) {
      result = obj;
      return key;
    }

    matches = matches || resolveMatches(obj, { key });
    validateMatches(matches, key, obj, error, ctx);

    result = matchResult(
      obj,
      matches,
      resolveResult,
      fieldName,
      fieldType,
      ctx
    );
  };
  return result;
}
