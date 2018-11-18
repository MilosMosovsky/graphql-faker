# Directives

TODO: Rename to resolvers! Add factory methods

## @sample

The `SampleValue` class resolves a field with a `@sample` directive to a value.

## @mock

The `resolveMock` function creates an instance of `MockValue` and uses it to resolve the field value.

The `MockValue` class resolves an mock field value. It uses the `@mock` directive values of the field and lookup in an `mocks` map in the `config` object. Alternatively it may also use a `mockValue` in another map, such as for `fakes` and `examples` (as fallback)

## @fake (WIP)

The `resolveFake` function creates an instance of `MockValue` and uses it to resolve the field value.

The `FakeValue` class resolves an mock field value. It uses the `@fake` directive values of the field and lookup in an `fake` map in the `config` object.
