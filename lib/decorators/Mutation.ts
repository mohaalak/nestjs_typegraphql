// tslint:disable:unified-signatures
import { AdvancedOptions, ReturnTypeFunc } from 'type-graphql/decorators/types';
import { getTypeDecoratorParams } from 'type-graphql/helpers/decorators';
import { Mutation as TypeGraphQLMutation } from 'type-graphql';
import { ReflectMetadata } from '@nestjs/common';
import {
  RESOLVER_TYPE_METADATA,
  RESOLVER_NAME_METADATA,
} from '../graphql.constants';
import { Resolvers } from '../enums/resolvers.enum';
export function Mutation(): MethodDecorator;

export function Mutation(options: AdvancedOptions): MethodDecorator;
export function Mutation(
  returnTypeFunc: ReturnTypeFunc,
  options?: AdvancedOptions,
): MethodDecorator;
export function Mutation(
  returnTypeFuncOrOptions?: any,
  maybeOptions?: AdvancedOptions,
): MethodDecorator {
  const { options, returnTypeFunc } = getTypeDecoratorParams(
    returnTypeFuncOrOptions,
    maybeOptions,
  );
  const typeMutation = TypeGraphQLMutation(
    returnTypeFuncOrOptions,
    maybeOptions,
  );
  return (target, key?, descriptor?) => {
    typeMutation(target, key, descriptor);
    const name = options.name || undefined;
    ReflectMetadata(RESOLVER_TYPE_METADATA, Resolvers.MUTATION)(
      target,
      key,
      descriptor,
    );
    ReflectMetadata(RESOLVER_NAME_METADATA, name)(target, key, descriptor);
  };
}
