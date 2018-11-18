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

## Field

See [Field](./Field.md)
