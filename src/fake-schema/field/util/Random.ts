const faker = require("faker");

import { resolveExamples } from "../resolve";
import { Base } from "../../../Base";

export interface IRandom {
  item: (array: any[]) => any;
  int: (min: number, max: number) => number;
}

export class Random extends Base {
  faker: any;
  config: any;
  field: any;
  type: any;

  constructor({ field, type }, config) {
    super(config);
    this.field = field;
    this.type = type;
    this.faker = faker;
  }

  // TODO: move to directive/fake
  int(min: number, max: number) {
    return this.faker.random.number({ min, max });
  }

  item(array: any[]) {
    if (!Array.isArray(array)) {
      array = this.createArray();
    }
    return array[this.int(0, array.length - 1)];
  }

  createArray() {
    return resolveExamples({
      field: this.field,
      type: this.type,
      config: this.config
    });
  }
}
