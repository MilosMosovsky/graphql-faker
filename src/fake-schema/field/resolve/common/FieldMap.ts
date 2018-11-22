import { Base } from "../../../../Base";

export function resolveFromFieldMap(ctx, config?) {
  return new FieldMap(ctx, config).resolve();
}

export class FieldMap extends Base {
  // functions,
  // type,
  // typeName,
  // field,
  // fieldName,
  // fieldType,
  // fields,
  // config,
  // error,
  // log
  fieldMap: any;
  ctx: any;
  createKeyMatcher: Function;
  matchKey: (key: string) => any;

  constructor(ctx: any, config = {}) {
    super(config);
    this.ctx = ctx;
    const { fieldMap, functions } = ctx;
    if (!functions) {
      this.error("missing functions entry on context");
    }
    if (!fieldMap) {
      this.error("missing fieldMap");
    }
    this.fieldMap = fieldMap;
    this.createKeyMatcher = functions.createKeyMatcher;
    this.matchKey = this.createKeyMatcher(this.ctx);
  }

  resolve() {
    this.validateFunction({
      method: "resolve",
      data: {
        config: this.config
      },
      func: this.createKeyMatcher,
      functionName: "createKeyMatcher",
      error: this.error
    });

    const keys = Object.keys(this.fieldMap);
    let result;
    const key = keys.find(key => {
      result = this.matchKey(key);
      return Boolean(result);
    });

    return key ? result : null;
  }
}
