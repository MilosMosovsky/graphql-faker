import { EntryMatcher } from "./EntryMatcher";

const identity = obj => obj;

export class TypeMap extends EntryMatcher {
  constructor(ctx: any, config = {}) {
    super(ctx, config);
    this.resolveResult = identity;
  }

  resolve(typeMap, typeName) {
    const hit = typeMap[typeName] || {};
    let result;
    Object.keys(typeMap).find(typeName => {
      const obj = typeMap[typeName];
      const matches = this.resolveMatches(obj, { key: typeName });
      result = this.matchResult(obj, matches);
      return result;
    });
    return result || hit;
  }
}
