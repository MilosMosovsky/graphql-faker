const faker = require("faker");

import { resolveExample } from "./resolve";

export class Random {
  faker: any;
  config: any;
  field: any;
  type: any;

  constructor({ field, type }, config) {
    this.config = config;
    this.field = field;
    this.type = type;
    this.faker = faker;
  }

  // TODO: move to directive/fake
  getRandomInt(min: number, max: number) {
    return this.faker.random.number({ min, max });
  }

  getRandomItem(array: any[]) {
    if (!Array.isArray(array)) {
      array = this.createArray();
    }
    return array[this.getRandomInt(0, array.length - 1)];
  }

  createArray() {
    return resolveExample({
      field: this.field,
      type: this.type,
      config: this.config
    });
  }
}
