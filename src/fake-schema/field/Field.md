# Field

Infrastructure to resolve a field to a fake or mock value

## FieldResolver

### resolver

Returns a `resolver` function that can resolve the value of a schema type field

### getResolver

Returns an appropriate `resolver` function for a given field type

### abstractTypeResolver

Returns a `resolver` function for an abstract type

### fieldResolver

Returns a `resolver` function for a field, either a `Leaf` or `Complex` type resolver

### resolveComplexType

Returns a `resolver` function for a complex field (such as an array/list)

### getDefaultComplexResolver

Returns a generic resolver for any value not handled by specific `resolver`. By default this `resolver` function returns an empty object `{}`.

### getExamplesResolver

Returns a resolver function that resolves to a value using the `@examples` directive

### resolveLeafType

Creates an instance of `PrimitiveValue` and returns a `resolver` function that can resolve a primitive (leaf) field to a value.

### arrayResolver

Creates an instance of `ArrayValue` and returns a `resolver` function that can resolve an array field to a value.

## type

See [Type resolvers](./Type/Type.md)

- `ArrayType`
- `PrimitiveType`
- `DefaultType`

## directives

See [Directives](./directives/Directives.md)

- `@sample`
- `@mock`
- `@fake`

Note: The `@example` directive is so simple to resolve that it doesn't need it's own resolver class.

## resolve

See [Resolve](./resolve/Resolve.md)
