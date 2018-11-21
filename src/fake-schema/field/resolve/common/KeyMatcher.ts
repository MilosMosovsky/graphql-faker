import { EntryMatcher } from "./EntryMatcher";

export function createKeyMatcher(ctx: any, config: any = {}) {
  return new KeyMatcher(ctx, config);
}

export class KeyMatcher extends EntryMatcher {
  ctx: any;
  fieldMap: any;
  fieldType: string;
  typeName: string;
  functions: any;
  isValidResult: (result: any) => boolean;

  constructor(ctx: any = {}, config = {}) {
    super(ctx, config);
    const { fieldMap, fieldType, typeName, functions } = ctx;
    if (!functions) {
      this.error("missing functions entry on context");
    }
    this.functions = functions;
    const { isValidResult } = functions;
    this.isValidResult = isValidResult;

    this.fieldMap = fieldMap;
    this.fieldType = fieldType;
    this.typeName = typeName;
  }

  resolveObj(obj) {
    const { fieldType } = this;
    // allow more fine grained mapping on type of field
    return (
      obj[fieldType] ||
      obj[fieldType.toLowerCase()] ||
      obj.default ||
      obj.any ||
      obj
    );
  }

  get resolver() {
    let result;
    const { isValidResult, fieldMap } = this;
    return key => {
      let matches;
      let obj = fieldMap[key];
      obj = this.resolveObj(obj);
      if (isValidResult(obj)) {
        result = obj;
        return key;
      }

      matches = matches || this.resolveMatches(obj, { key });
      this.validateMatches(matches, key, obj);

      result = this.matchResult(obj, matches);
    };
    return result;
  }

  resolveMatches(obj, { key }) {
    if (typeof obj === "string") {
      return [obj];
    }
    return obj.match || obj.matches || [key];
  }

  validateMatches(matches, key, obj) {
    return Array.isArray(matches)
      ? true
      : this.error(
          `resolveArray: ${key} missing matches array. Invalid ${matches}`,
          {
            key,
            obj,
            matches,
            ...this.ctx
          }
        );
  }
}
