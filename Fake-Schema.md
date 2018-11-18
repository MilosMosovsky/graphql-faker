# Fake schema generation

Create a fake schema using fake (or mock) value resolvers for the schema.

## FakeSchema

Create a fake schema instance with methods to create fake (or mock) value resolvers for the schema.

### resolveTypeMapValues

`resolveTypeMapValues` iterates all the values of the types and resolve each depending on type.

### addFakeProperties

Iterate field values for object type and set `resolve` function on the field to appropriate resolver function depending on field type, either:

- `getRelayMutationResolver` if field is a relay mutation
- `getFieldResolver` default field resolver

### isRelayMutation

Determines if field is a relay mutation, a non-null `input` field of `object` type

### getFieldResolver

Creates and returns new `FieldResolver` instance with a method to resolve the field

### getRelayMutationResolver

Returns function to resolve a relay mutation

## FieldResolver

### resolver

Returns a `resolve` function that can resolve the value of a schema type field

### getResolver

Returns an appropriate resolver function for a given field type

### abstractTypeResolver

Returns a resolver function for an abstract type

### fieldResolver

Returns a resolver for a field, either a `Leaf` or `Complex` type resolver

### resolveComplexType

Returns a resolver for a complex field (such as an array/list)

### getDefaultComplexResolver

Returns a generic resolver for any value not handled by specific resolver. By default this resolver function returns an empty object `{}`.

### getExamplesResolver

Returns a resolver function that resolves to a value using the `@examples` directive

### resolveLeafType

Creates an instance of `PrimitiveValue` and returns a resolver function that can resolve a primitive (leaf) field to a value.

### arrayResolver

Creates an instance of `ArrayValue` and returns a resolver function that can resolve an array field to a value.

## Value

The value resolvers can be found in `src/fake-schema/field/value`. They each have the responsibility of creating and returning a resolver function for a field of the given type, selecting a strategy based on the field including directives and directive values.

### PrimitiveValue

The `PrimitiveValue` class ...

### ArrayValue

The `ArrayValue` class resolves an array by default using `SampleValue` resolver (using `@sample` directive)

### DefaultValue

The `DefaultValue` class resolves a field to a value by trying various strategies

First tries using `fakeValue`, which looks up in `fakes` and `examples` maps for a field match to be resolved.

If `fakeValue` is unable to resolve field to a value or throws an error, it falls back to a leaf type resolver via `getLeafResolver`, resolving field based on the primitive type.

## Directives

### Example

The `resolveExample` function creates an instance of `Example` and uses it to resolve the field value.

The `ExampleValue` class resolves an example field value. It uses the `@example` directive values of the field and lookup in an `examples` map in the `config` object.

### Mock

The `resolveMock` function creates an instance of `MockValue` and uses it to resolve the field value.

The `MockValue` class resolves an mock field value. It uses the `@mock` directive values of the field and lookup in an `mocks` map in the `config` object. Alternatively it may also use a `mockValue` in another map, such as for `fakes` and `examples` (as fallback)

### Fake (WIP)

The `resolveFake` function creates an instance of `MockValue` and uses it to resolve the field value.

The `FakeValue` class resolves an mock field value. It uses the `@fake` directive values of the field and lookup in an `fake` map in the `config` object.

## Fakers

The fakers are used by `FakeValue` to resolve a field to a fake value, using [FakerJS](https://github.com/marak/Faker.js/). You can override FakeValue or any of the faker infrastructure to generate your own fake values according to your particular needs.

### TypeFakers

Creates fakers for types, including primtives (`ID`, `String`, `Int`, `Float`, ...) and custom scalars (such as `Date`, `Money` etc.)

### Fakers

#### fakeValue

Creates a fake value using a faker selected for the specific field, based on the `@fake` directive or by using field meta data (name/type) lookup in map.

### Random

Includes functions to generate random int value or selecting a random item from a list

- `getRandomInt`
- `getRandomItem`

### FakeResolver

Resolves a field to a fake value using a fake definition found by lookup strategy in a map.

### FakeResolver

Resolves a field to a fake value using a fake definition found by lookup strategy in a map.

### maps

Includes maps for `fakes` and `examples`.

TODO: move examples map to example directive!

### functions

Faker function wrappers for each [FakerJS API section](https://github.com/marak/Faker.js/#api-methods)
