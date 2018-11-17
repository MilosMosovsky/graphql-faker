import { SampleArgs } from "../../../types";

export class SampleValue {
  resolveItem: Function;
  getCount: (min: number, max: number) => number;

  min: number;
  max: number;
  empty: number;
  options: any;

  constructor({ sample, functions }) {
    const { getCount, resolveItem } = functions;
    this.getCount = getCount;
    this.resolveItem = resolveItem;

    this.options = {
      ...sample,
      ...this.defaultOpts
    } as SampleArgs;
    let { min, max, empty } = this.options;
    if (min > max) {
      max = ++min;
    }
    this.min = min;
    this.max = max;
    this.empty = empty;
  }

  get defaultOpts() {
    return {
      min: 1,
      max: 10,
      empty: 0.2
    };
  }

  resolver() {
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
