# fakers

## TypeFakers

Creates fakers for types, including primtives (`ID`, `String`, `Int`, `Float`, ...) and custom scalars (such as `Date`, `Money` etc.)

## Fakers

### createFakers

Factory mehod to create a `Fakers` class instance

### Fakers.resolveValue

Fakers method to create fake value using a faker (from `Fakers` instance) selected for the specific field.

The faker selected based on the `@fake` directive. A lookup is made in the `fakes` map (see resolve - fakes below), using field meta data (name/type) to find default options to be used.

The options of the `@fake` directive are merged on top of the default fake options and the faker is called to generate the fake value.

## Random

Includes functions to generate random int value or selecting a random item from a list

- `getRandomInt` generate random integer value within a range (`min`, `max`)
- `getRandomItem` get a random item from an `array`

## functions

Faker function wrappers for each [FakerJS API section](https://github.com/marak/Faker.js/#api-methods)
