let faker = require("faker");

export function randomFunctions(fakerOpts: any = {}) {
  // Random section
  return {
    number: {
      args: ["min", "max", "precision"],
      func: (min, max, precision) => {
        const opts = {
          ...fakerOpts.number,
          ...{ min, max, precision }
        };
        return faker.random.number(opts);
      }
    },
    float: {
      args: ["min", "max", "precision"],
      func: (min, max, precision) => {
        const opts = {
          ...fakerOpts.number,
          ...{ min, max, precision }
        };
        return faker.random.number(opts);
      }
    },
    uuid: () => faker.random.uuid(),
    word: {
      args: ["type"],
      func: type => {
        const opts = {
          ...fakerOpts.word,
          ...{ type }
        };
        return faker.random.word(opts.type);
      }
    },
    words: {
      args: ["count"],
      func: count => {
        const opts = {
          ...fakerOpts.words,
          ...{ count }
        };
        return faker.random.words(opts.count);
      }
    },
    alpha: {
      args: ["length", "upcase"],
      func: (count, upcase) => {
        const opts = {
          ...fakerOpts.alpha,
          ...{ count, upcase }
        };
        return faker.random.alpha(opts);
      }
    },
    alphaNumeric: {
      args: ["count"],
      func: count => {
        const opts = {
          ...fakerOpts.alphaNumeric,
          ...{ count }
        };
        return faker.random.alphaNumeric(opts);
      }
    },
    hexaDecimal: {
      args: ["count"],
      func: count => {
        const opts = {
          ...fakerOpts.hexaDecimal,
          ...{ count }
        };
        return faker.random.hexaDecimal(opts);
      }
    },
    arrayElement: {
      args: ["items"],
      func: (items = []) => {
        const opts = {
          ...fakerOpts.arrayElement,
          ...{ items }
        };
        return faker.random.arrayElement(opts.items);
      }
    },
    arrayElements: {
      args: ["items", "maxCount"],
      func: (items = [], maxCount) => {
        const opts = {
          ...fakerOpts.arrayElements,
          ...{ items, maxCount }
        };
        return faker.random.arrayElements(opts.items, opts.maxCount);
      }
    },
    locale: () => faker.random.locale()
  };
}
