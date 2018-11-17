import { SampleArgs } from "../types";
import { Base } from "../Base";

export class ArrayResolver extends Base {
  resolveItem: Function;
  getCount: (min: number, max: number) => number;
  min: number;
  max: number;
  empty: number;

  constructor(functions: any, sample: SampleArgs, config: any = {}) {
    super(config);
    const { resolveItem, getCount } = functions;
    this.resolveItem = resolveItem;
    this.getCount = getCount;
    const directives = config.directives || {};
    let opts = directives.sample || {};
    const defaultOpts = {
      min: 1,
      max: 10,
      empty: 0.2
    };

    const options = {
      ...opts,
      ...sample,
      ...defaultOpts
    } as SampleArgs;

    let { min, max, empty } = options;
    if (min > max) {
      max = ++min;
    }
    this.min = min;
    this.max = max;
    this.empty = empty;
  }

  get resolver() {
    const { min, max, empty } = this;
    return (...args) => {
      const rand = Math.random();
      if (rand < empty) {
        return [];
      }
      let length = this.getCount(min, max);
      const result = [];

      while (length-- !== 0) result.push(this.resolveItem(...args));
      return result;
    };
  }
}
