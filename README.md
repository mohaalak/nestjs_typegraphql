## Description

This is a [TypeGraphQL](https://github.com/19majkel94/type-graphql) module for [Nest](https://github.com/nestjs/nest).

## How to use

I manually combine both decorators of [Nestjs Graphql](https://github.com/nestjs/graphql) with TypeGraphql.
idea is that the typegraphql will create the graphql schema but Nestjs will provide the resolvers and other run times.

first install it

```
npm install nest-type-graphql
```

This module can only build a GraphQLSchema it does not run a graphQL server , you can simply run a graphql server yourself.
for example for apollo server you can make it this way

```typescript
@Module({
  imports: [TypeGraphQLModule],
})
export class ApolloMdoule implements OnModuleInit {
  apolloServer: ApolloServer;
  constructor(
    private readonly appRefHost: ApplicationReferenceHost,
    private readonly graphQLFactory: SchemaBuilder,
  ) {}
  async onModuleInit() {
    if (!this.appRefHost) {
      return;
    }

    const httpServer = this.appRefHost.applicationRef;
    if (!httpServer) {
      return;
    }

    const app = httpServer.getInstance();
    const schema = await this.graphQLFactory.build();

    this.apolloServer = new ApolloServer({ schema, playground: true });
    this.apolloServer.applyMiddleware({
      app,
    });
  }
}
```

## Changes to TypeGraphQL Decorators

cause the resolvers function is provided by NestJs
you cannot use

- [@Authorized()](https://19majkel94.github.io/type-graphql/docs/authorization.html)
- [Validation](https://19majkel94.github.io/type-graphql/docs/validation.html)
- [Middleware and Guards](https://19majkel94.github.io/type-graphql/docs/middlewares.html) from typegraphql
  but you can use Guard, Interceptors,Pipes from Nestjs.
- also there is no @Ctx decorator you can use @Context decorator.

## Changes to Nestjs GraphQL

- @Resolver does not accept name anymore
- @Query and @Mutation does not accept name as a field in decorator but you can pass it in options that you provide to decorator.
- @ResolveProperty is removed use @FieldResolver
- @Args does not accept name and it will provide the whole arguments input but you can use @Arg for a named argument
  also if you want to use pipe in @Args and @Arg you should pass an array of pipes to pieps key in options
- Also you should read the [typegraphql manual](https://19majkel94.github.io/type-graphql/docs/getting-started.html)

## Scalar Type

for scalar type you can use @Scalar but it does not accept name anymore you should provide it in class but it accept a type funciton like typegraphQL it

```typescript
@Scalar(type => Date)
export class DateScalar {
  name = 'Date';
  description = 'Date custom scalar type';

  parseValue(value) {
    return new Date(value); // value from the client
  }

  serialize(value) {
    return value.getTime(); // value sent to the client
  }

  parseLiteral(ast) {
    if (ast.kind === Kind.INT) {
      return parseInt(ast.value, 10); // ast value is always in string format
    }
    return null;
  }
}
```

then you should use provide it in a module so it will be created and for using this scalar in schema you can use type that you provided in decorator so for this scalar we can simply write this input type

```typescript
@ObjectType()
class User {
  @Field()
  registrationDate: Date;
}
```

## See The [Example](https://github.com/mohaalak/nestjs_type_graphql_example)

## Todos

- @Subsciption decorator is missing and it's cause the NestJS and Typegraphql has 2 types of signature
