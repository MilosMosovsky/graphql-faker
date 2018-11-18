# Design and Architecture

This project has been designed specifically as a set of building blocks that are pre-configured to work together but are easy to extend and re-compose as needed.

## Main Classes

- [FakeSchema](#FakeSchema)

### TODO

- [Server](#Server) currently `createServerApi`
- [Runner](#Runner) currently `run`
- [Proxy](#Runner) currently `proxyMiddleware`
- [IDL](#IDL) currently `createIdlApi`
- [Schema](#Schema) currently `createSchemaApi`

## Fake schema design

### Base

`Base` class which adds supports for logging and error handling, utility functions for looking up specific objects in `config` and so on. When done right, should include all the base functionality needed for all classes in the project.

We might introduce a `FakeBase` to include extra utilities needed for classes used in `fakeSchema`

### FakeSchema

See [Fake Schema](./Fake-Schema.md)
