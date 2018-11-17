export interface GraphQLAppliedDiretives {
  isApplied(directiveName: string): boolean;
  getAppliedDirectives(): Array<string>;
  getDirectiveArgs(directiveName: string): { [argName: string]: any };
}

export type MockArgs = {
  value: any;
};

export type FakeArgs = {
  type: string;
  options: { [key: string]: any };
  locale: string;
};

export type ExamplesArgs = {
  values: [any];
};

export type SampleArgs = {
  min?: number;
  max?: number;
  // percentage as: 0 to 1, such as 0.5 for 50% chance
  empty?: number;
};

export type DirectiveArgs = {
  fake?: FakeArgs;
  examples?: ExamplesArgs;
  sample?: SampleArgs;
  mock?: MockArgs;
};
