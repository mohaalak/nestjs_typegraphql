// tslint:disable:unified-signatures
import { Resolvers } from '../enums/resolvers.enum';
import { Query as TypeGraphQLQuery } from 'type-graphql';
import { AdvancedOptions, ReturnTypeFunc } from 'type-graphql/decorators/types';
import { getTypeDecoratorParams } from 'type-graphql/helpers/decorators';
import {
  RESOLVER_TYPE_METADATA,
  RESOLVER_NAME_METADATA,
} from '../graphql.constants';
import { ReflectMetadata } from '@nestjs/common';

export function Query(): MethodDecorator;
export function Query(options: AdvancedOptions): MethodDecorator;
export function Query(
  returnTypeFunc: ReturnTypeFunc,
  options?: AdvancedOptions,
): MethodDecorator;
export function Query(
  returnTypeFuncOrOptions?: any,
  maybeOptions?: AdvancedOptions,
): MethodDecorator {
  const typeQuery = TypeGraphQLQuery(returnTypeFuncOrOptions, maybeOptions);
  const { options } = getTypeDecoratorParams(
    returnTypeFuncOrOptions,
    maybeOptions,
  );
  return (target, key?, descriptor?) => {
    typeQuery(target, key, descriptor);
    const name = options.name || undefined;
    ReflectMetadata(RESOLVER_TYPE_METADATA, Resolvers.QUERY)(
      target,
      key,
      descriptor,
    );
    ReflectMetadata(RESOLVER_NAME_METADATA, name)(target, key, descriptor);
  };
}
