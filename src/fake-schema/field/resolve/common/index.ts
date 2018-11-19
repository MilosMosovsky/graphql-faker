import { TypeMap } from "./TypeMap";

export const hasMatches = (obj: any = {}) =>
  Object.values(obj).find((val: any) => val.matches);

export function resolveTypeFieldMap(
  typeMap,
  typeName,
  fieldName,
  ctx,
  config = {}
) {
  const map = new TypeMap(ctx, config).resolve(typeMap, typeName);
  return map[fieldName];
}
