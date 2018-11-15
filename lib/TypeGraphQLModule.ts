import { Module } from '@nestjs/common';
import { MetadataScanner } from '@nestjs/core/metadata-scanner';
import { SchemaBuilder } from './SchemaBuilder';
import { ResolversExplorerService } from './services/resolvers-explorer.service';
import { ScalarsExplorerService } from './services/scalars-explorer.service';

@Module({
  providers: [
    SchemaBuilder,
    MetadataScanner,
    ResolversExplorerService,
    ScalarsExplorerService,
  ],
  exports: [SchemaBuilder],
})
export class TypeGraphQLModule {}
