# Design and Architecture

This project has been designed specifically as a set of building blocks that are pre-configured to work together but are easy to extend and re-compose as needed.

## Main Classes

- [FakeSchema](#FakeSchema) `fakeSchema`
- [Server](#Server) `createServer`

### TODO

- [Runner](#Runner) `createRunner`
- [Proxy](#Runner) currently `proxyMiddleware` function
- [IDL](#IDL) `createIdl`
- [ServerSchema](#ServerSchema) currently `createServerSchema`

## Fake schema design

### Base

`Base` class which adds supports for logging and error handling, utility functions for looking up specific objects in `config` and so on. When done right, should include all the base functionality needed for all classes in the project.

We might introduce a `FakeBase` to include extra utilities needed for classes used in `fakeSchema`

### FakeBase

Extends `Base` class and provides some key methods for use in classes that resolve schema fields to values.

- `setSchema`
- `getLeafResolver`
- `getTypeFakers`
- `getRandom`
- `fakeValue`
- `getCurrentSourceProperty` (move to subclass?)

### Server

Use `createServer` to create a `Server` class instance. Extend the `Server` class to customize it to your needs.

The main `configure` method:

- `configure(schemaIDL: Source, extensionIDL: Source, config = {}, optionsCB)`

Configures each of the `app` endpoints:

- `/graphql`
- `/editor`
- `/userIdl`

Using:

- `configGraphQL()`
- `configEditor()`
- `configUserIdl()`

To run the configured server, call the `run` method:

- `run({open, port})`

### Runner

Call the `run` method on the `Runner` instance to run the server.

### IDL

- `readIDL(filepath)`
- `saveIDL(idl)`

## ServerSchema

- `build`
