import { ExampleResolver } from "./ExampleResolver";

// re-align `typeFieldMap` and `fieldMap` (resolve examples and fakes), using a generic `resultResolver`.
// Allow `matches` list for both, using `resolveMatches`
export const resolveExample = ({
  field,
  type,
  fields = [],
  config = {}
}: any): any[] => {
  return new ExampleResolver({
    field,
    type,
    fields,
    config
  }).resolve();
};
