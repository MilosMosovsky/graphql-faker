# Mocking

Set `mocking: true` on the config object to enable mocking of values (static, predictable values)
Mocking will use the first value of `@examples` and a static value for each type it can resolve.

## @mock directive

You can add mock values directly in the schema via the `@mock` directive:

```js
type Person {
  name: String @fake(type: firstName) @mock(value: 'John')
}
```

## mock configuration

You can add your own mock values in a `mock` map on config:

```js
const config = {
  enable: {
    mocking: true
  },
  mocks: {
    // fallback values for fields without match
    __types: {
      Int: 2,
      String: "hi"
    },
    Person: {
      name: "mike",
      age: 32
    },
    // any count field
    count: 21
  }
};
```

Currently the `mocks` maps require a "direct hit" on type/field name to be resolved. If no hit, it falls back to use the generic mocked type values.

## Advanced mocking

You can extend the mocking mechanics to be more flexible using the same infrastructure used for resolving fakers and examples (see `src/fakers/resolve`). Look especially at the generic resolver functions in `common.ts`.

Advanced mocking configuration using similar mechanics could look something like this:

```js
mocks: {
  Person: {
    name: {
      matches: ["name", "first"];
      value: "mike";
    },
    active: {
      boolean: {
        value: true
      },
      string: {
        value: 'yes'
      }
    }
  }
}
```

You can also opt to reuse the faker maps to include a mock value to be used when mocking is enabled.

```js
const config = {
  maps: {
    fakers: {
      category: {
        // explicit type mapping
        string: {
          faker: "productCategory", // used when NOT mocking: true
          mockValue: "shoes" // used when mocking: true
        }
      }
    }
  }
};
```

Please feel free to make a PR to make this happen.
