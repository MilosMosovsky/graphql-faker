# Resolve

Resolve `@fake` and `@examples` using other means (than schema directives), such as config map lookups.

- `fakes`
- `examples`
- `maps` default maps used for `fakes` and `examples`

## fakes

Resolves a field to a fake value using a fake definition found by lookup strategy in a map.

The `resolveFakes` function creates an instance of `FakesMapResolver` and uses it to resolve the field value.

The `FakesMapResolver` class resolves an example field value. It uses field meta data to lookup in an `examples` map in the `config` object to extract a value from a matching entry.

The fake definition can include the name of the faker to use and the options (arguments) to pass to the faker function.

These properties can act as defaults if the field has a `@fake` directive or be used stand-alone for the `DefaultType` resolver, if no directive is defined for the field.

## examples

Resolves a field to a example values using definition found by lookup strategy in a map.

The `resolveExample` function creates an instance of `ExamplesMapResolver` and uses it to resolve the field value.

The `ExamplesMapResolver` class resolves an example field value. It uses field meta data to lookup in an `examples` map in the `config` object to extract a value from a matching entry.

These properties can act as defaults if the field has a `@examples` directive or be used stand-alone for the `DefaultType` resolver, if no directive is defined for the field.

## maps

Includes maps for `fakes` and `examples`.

`examples`

```js
const typeMap = {
  Car: {
    brand: [
      "Ford",
      "Porsche",
      "Audi"
      // ...
    ]
  }
};
```

`fakes`

```js
export const typeMap = {
  Product: {
    name: "productName",
    category: "productCategory",
    price: {
      type: "money",
      options: {
        minMoney: 10,
        maxMoney: 1000,
        decimalPlaces: 2
      }
    }
  }
};
```
