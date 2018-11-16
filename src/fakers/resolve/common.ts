const escapeStrRegexp = require("escape-string-regexp");

export function validateFunction({ method, functionName, func, data, error }) {
  if (typeof func !== "function") {
    error(`${method}: missing or invalid ${functionName} function`, {
      [functionName]: func,
      ...data
    });
  }
}

export function matchValue(value, name, ctx: any = {}) {
  const regExpPattern =
    typeof value === "string" ? escapeStrRegexp(value) : value;
  const opts = ctx.regExpOpts || "i";
  const regExp = new RegExp(regExpPattern, opts);
  return regExp.test(name);
}

export function directivesObj(config) {
  const resolvers = config.resolvers || {};
  return resolvers.directives || {};
}
