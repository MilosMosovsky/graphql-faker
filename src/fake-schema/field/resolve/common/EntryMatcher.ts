import { BaseMapResolver } from "./BaseMapResolver";

const escapeStrRegexp = require("escape-string-regexp");

export class EntryMatcher extends BaseMapResolver {
  resolveResult: Function;

  constructor(ctx: any, config = {}) {
    super(ctx, config);
    this.resolveResult = ctx.functions.resolveResult;
  }

  resolveMatches(obj, { key }) {
    if (typeof obj === "string") {
      return [obj];
    }
    return obj.match || obj.matches || [key];
  }

  matchResult(obj, matches) {
    let result;
    // todo: make generic
    matches.find(matchItem => {
      if (this.matchName(matchItem)) {
        result = this.resolveResult(obj);
        return matchItem;
      }
    });
    return result;
  }

  matchName(matchItem) {
    const { regExpOpts, fieldName } = this.ctx;
    const regExpPattern =
      typeof matchItem === "string" ? escapeStrRegexp(matchItem) : matchItem;
    const opts = regExpOpts || "i";
    const regExp = new RegExp(regExpPattern, opts);
    return regExp.test(fieldName);
  }
}
