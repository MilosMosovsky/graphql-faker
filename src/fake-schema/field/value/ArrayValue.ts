import { SampleArgs } from "../../types";
import { SampleValue } from "../directives/sample/SampleValue";
import { Base } from "../../Base";

type ArrayResolverOpts = {
  functions: any;
  sample: SampleArgs;
};

// currently simply wraps SampleValue but could be extended to have other resolve mechanisms...
export class ArrayValue extends Base {
  sample: SampleArgs;
  functions: any;

  constructor({ functions, sample }: ArrayResolverOpts, config: any = {}) {
    super(config);
    this.sample = sample;
    this.functions = functions;
  }

  get resolver() {
    const { sample, functions } = this;
    return new SampleValue({ sample, functions }, this.config).resolver;
  }
}
