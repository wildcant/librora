## Goals

- Schema first with type safety.
- Simplicity and good DX.
- Scalable project structure following a few best practices.
- Stablish boundaries between database access, business logic and resolvers (e.g. using eslint rules).

references:

Type safe resolvers with GraphQL Code Generator ->

- https://www.youtube.com/watch?v=tHMaNmqPIC4
- https://the-guild.dev/graphql/codegen/plugins/presets/near-operation-file-preset

Merge GraphQL resolvers with GraphQL Tools ->

- https://www.youtube.com/watch?v=6Jd5nKQrqcU
- https://the-guild.dev/graphql/tools/docs/schema-merging

Data source APIs -> https://www.prisma.io/docs/reference/api-reference/prisma-client-reference

Split resolvers and types to have type safe resolvers and avoid names collision.

## Useful Links

- https://github.com/kriasoft/relay-starter-kit#readme

## TODOs

[ ] Try tests with [vitest](https://vitest.dev/guide/) https://www.hubburu.com/articles/testing_apollo_server_with_vitest
[ ] Add generator script to create a new modules.
[ ] Add reservations module, try xstate to have more complex logic and learn about event driven architectures.
[ ] Standardize the way to work with Computed Columns when mapping a graphql query to an sql query. see [join-monster](https://join-monster.readthedocs.io/en/latest/field-metadata/#computed-columns) for reference. See also an [article](https://productionreadygraphql.com/blog/2020-05-21-graphql-to-sql) about it this topic.

## Known problems

- typescript-resolvers plugin won't generate native typescript enums :( See https://github.com/dotansimha/graphql-code-generator/issues/8296

## Resources

- Free postgres (20MB) at elephantsql.com
