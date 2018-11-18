# Value

The value resolvers can be found in `src/fake-schema/field/value`. They each have the responsibility of creating and returning a resolver function for a field of the given type, selecting a strategy based on the field including directives and directive values.

## PrimitiveValue

The `PrimitiveValue` class ...

## ArrayValue

The `ArrayValue` class resolves an array by default using `SampleValue` resolver (using `@sample` directive)

## DefaultValue

The `DefaultValue` class resolves a field to a value by trying various strategies

First tries using `fakeValue`, which looks up in `fakes` and `examples` maps for a field match to be resolved.

If `fakeValue` is unable to resolve field to a value or throws an error, it falls back to a leaf type resolver via `getLeafResolver`, resolving field based on the primitive type.
