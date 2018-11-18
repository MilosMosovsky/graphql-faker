# Resolve

- `fakes`
- `examples`
- `map` default maps used for `fakes` and `examples`

## fakes

Resolves a field to a fake value using a fake definition found by lookup strategy in a map.

The `FakeResolver` class resolves an example field value. It uses field meta data to lookup in an `examples` map in the `config` object to extract a value from a matching entry.

## examples

The `resolveExample` function creates an instance of `Example` and uses it to resolve the field value.

The `ExampleResolver` class resolves an example field value. It uses field meta data to lookup in an `examples` map in the `config` object to extract a value from a matching entry.

## maps

Includes maps for `fakes` and `examples`.

TODO: move examples map to example directive!
