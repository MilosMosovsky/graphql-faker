import { examples as exampleMaps } from "../maps";
import { error } from "./error";
import {
  createKeyMatcher,
  resolveFromFieldMap,
  funsFor,
  mapsFor
} from "./common";

export const isValidExample = Array.isArray;

export const resolveValues = obj => {
  if (Array.isArray(obj)) return obj;
  if (obj.values) return obj.values;
};

// re-align `typeFieldMap` and `fieldMap` (resolve examples and fakes), using a generic `resultResolver`.
// Allow `matches` list for both, using `resolveMatches`
export const resolveExample = ({
  field,
  type,
  fields = [],
  config = {}
}: any): any[] => {
  const $error = config.error || error;
  const log = config.log || console.log;
  const typeName = typeof type === "string" ? type : type.name;
  const fieldName = field.name;
  const fieldType = field.type;

  const $exampleMaps = mapsFor("examples", exampleMaps, config);
  const typeMap = $exampleMaps.typeMap || {};
  const fieldMap = $exampleMaps.fieldMap || {};

  const typeExamples = typeMap[typeName] || {};
  const typeFieldMap = typeExamples[fieldName];

  const funs = funsFor("examples", config);

  const $createKeyMatcher = funs.createKeyMatcher || createKeyMatcher;
  const $resolveFromFieldMap = funs.resolveFromFieldMap || resolveFromFieldMap;

  const ctx = {
    type,
    field,
    typeName,
    fieldName,
    fieldType,
    fields,
    config,
    error: $error,
    log
  };

  const functions = {
    createKeyMatcher: $createKeyMatcher,
    // TODO: make configurable?
    isValidResult: isValidExample,
    resolveResult: resolveValues
  };

  let result;
  if (typeFieldMap) {
    result = $resolveFromFieldMap({
      fieldMap: typeFieldMap,
      functions,
      ...ctx
    });
  }

  return (
    result ||
    $resolveFromFieldMap({
      fieldMap,
      functions,
      ...ctx
    })
  );
};
