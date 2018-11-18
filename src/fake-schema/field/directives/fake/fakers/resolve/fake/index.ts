import { FakeResolver } from "./FakeResolver";

// re-align `typeFieldMap` and `fieldMap` (resolve examples and fakes), using a generic `resultResolver`.
// Allow `matches` list for both, using `resolveMatches`
// re-align `typeFieldMap` and `fieldMap` (resolve examples and fakes), using a generic `resultResolver`.
// Allow `matches` list for both, using `resolveMatches`
export const resolveFake = ({ type, field, fields = [], config = {} }: any) => {
  return new FakeResolver({ type, field, fields, config }).resolve();
};
