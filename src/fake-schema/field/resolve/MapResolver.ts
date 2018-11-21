import * as maps from "./maps";
import { BaseMapResolver } from "./common/BaseMapResolver";
import { resolveFromFieldMap } from "./common/FieldMap";
import { createKeyMatcher } from "./common/KeyMatcher";

export class MapResolver extends BaseMapResolver {
  fieldMap: any;
  context: any;
  typeFieldMap: any;
  resolveFromFieldMap: Function;
  functions: any;

  constructor(confName, ctx: any = {}, config: any = {}) {
    super(ctx, config);
    const { type, field } = ctx;
    const error = config.error;
    const log = config.log || console.log;
    const typeName = typeof type === "string" ? type : type.name;
    const fieldName = field.name;
    const fieldType = field.type;

    const confMap = this.mapsFor(confName, maps);
    const funs = this.funsFor(confName);

    const typeMap = confMap.typeMap || {};
    this.fieldMap = confMap.fieldMap || {};

    const typeExamples = typeMap[typeName] || {};
    this.typeFieldMap = typeExamples[fieldName];

    const createKeyMatcher = funs.createKeyMatcher || this.createKeyMatcher;
    this.resolveFromFieldMap = funs.resolveFromFieldMap || resolveFromFieldMap;

    this.functions = {
      createKeyMatcher
    };

    this.context = {
      functions: this.functions,
      type,
      field,
      typeName,
      fieldName,
      fieldType,
      config,
      error,
      log
    };
  }

  protected get createKeyMatcher() {
    return createKeyMatcher;
  }

  protected resolveMap(map) {
    if (!map) return;
    return this.resolveFromFieldMap({
      fieldMap: map,
      ...this.context
    });
  }

  resolve() {
    return this.resolveMap(this.typeFieldMap) || this.resolveMap(this.fieldMap);
  }
}
