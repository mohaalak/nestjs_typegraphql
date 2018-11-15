import { Inject, Injectable } from '@nestjs/common';
import { ModulesContainer } from '@nestjs/core/injector/modules-container';
import { GraphQLScalarType, GraphQLScalarTypeConfig } from 'graphql';

import { SCALAR_TYPE_METADATA } from '../graphql.constants';
import { BaseExplorerService } from './base-explorer.service';

@Injectable()
export class ScalarsExplorerService extends BaseExplorerService {
  constructor(private readonly modulesContainer: ModulesContainer) {
    super();
  }

  explore() {
    const modules = this.getModules(this.modulesContainer, []);
    return this.flatMap<any>(modules, instance => this.filterScalar(instance));
  }

  filterScalar<T extends GraphQLScalarTypeConfig<any, any>>(instance: T) {
    if (!instance) {
      return undefined;
    }
    const type = Reflect.getMetadata(
      SCALAR_TYPE_METADATA,
      instance.constructor,
    );
    const bindContext = (fn: Function | undefined) =>
      fn ? fn.bind(instance) : undefined;

    return type
      ? {
          type,
          scalar: new GraphQLScalarType({
            name: instance.name,
            description: instance.description,
            parseValue: bindContext(instance.parseValue),
            serialize: bindContext(instance.serialize),
            parseLiteral: bindContext(instance.parseLiteral),
          }),
        }
      : undefined;
  }
}
