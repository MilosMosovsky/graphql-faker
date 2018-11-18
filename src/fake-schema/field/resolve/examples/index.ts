import { ExamplesResolver } from "./ExamplesResolver";

// re-align `typeFieldMap` and `fieldMap` (resolve examples and fakes), using a generic `resultResolver`.
// Allow `matches` list for both, using `resolveMatches`
export const resolveExamples = ({
  field,
  type,
  fields = [],
  config = {}
}: any): any[] => {
  return new ExamplesResolver({
    field,
    type,
    fields,
    config
  }).resolve();
};
