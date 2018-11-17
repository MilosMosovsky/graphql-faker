# TODO

- Use classes to make it easier to extend internal mechanics
- pass around a context (`ctx`) object instead of a series of arguments
- add a `mockValue` option for fakers and examples resolver maps to be used when `mocking: true`
- add `matches` option for resolving `typeMap` (see `resolveMapByTypeName` - mostly implemented)

## WIP

Started refactoring to classes. See `FakeSchema` class. Needs much more work and to be split into more fine-grained classes, such as one class to handle each directive etc, as base class for core functionality such as logging etc.

Utility functions also mostly need to go into the `Base` class to make it easy to override them for each class.
