import { Injectable } from '@nestjs/common';
import { addResolveFunctionsToSchema } from 'graphql-tools';

import { DelegatesExplorerService } from './services/delegates-explorer.service';
import { ResolversExplorerService } from './services/resolvers-explorer.service';
import { ScalarsExplorerService } from './services/scalars-explorer.service';
import { buildSchema, BuildSchemaOptions } from 'type-graphql';
import { GraphQLSchema } from 'graphql';
import { BaseExplorerService } from './services/base-explorer.service';
import { ModulesContainer } from '@nestjs/core/injector/modules-container';

@Injectable()
export class SchemaBuilder {
  constructor(
    private readonly resolversExplorerService: ResolversExplorerService,
    private readonly scalarsExplorerService: ScalarsExplorerService,
  ) {}

  async build(options?: BuildSchemaOptions): Promise<GraphQLSchema> {
    try {
      const scalars = this.scalarsExplorerService.explore();
      const schema = await buildSchema({
        emitSchemaFile: true,
        // typegraphql have a validation that cannot send an empty resolvers array or an empty string to it
        resolvers: ['**/*.undfined.undfiend.js'],
        ...options,
        scalarsMap: scalars,
      });

      const resolvers = this.resolversExplorerService.explore();

      addResolveFunctionsToSchema({
        schema,
        resolvers,
      });
      return schema;
    } catch (e) {
      console.error(e);
    }
  }
}
