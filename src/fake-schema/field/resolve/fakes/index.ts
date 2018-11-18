import { FakesResolver } from "./FakesResolver";

// re-align `typeFieldMap` and `fieldMap` (resolve examples and fakes), using a generic `resultResolver`.
// Allow `matches` list for both, using `resolveMatches`
// re-align `typeFieldMap` and `fieldMap` (resolve examples and fakes), using a generic `resultResolver`.
// Allow `matches` list for both, using `resolveMatches`
export const resolveFakes = ({
  type,
  field,
  fields = [],
  config = {}
}: any) => {
  return new FakesResolver({ type, field, fields, config }).resolve();
};
