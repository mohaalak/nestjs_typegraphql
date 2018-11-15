// tslint:disable:unified-signatures
import { AdvancedOptions, ReturnTypeFunc } from 'type-graphql/decorators/types';
import { FieldResolver as TypeGraphQLFieldResolver } from 'type-graphql';
import { ReflectMetadata } from '@nestjs/common';
import {
  RESOLVER_NAME_METADATA,
  RESOLVER_PROPERTY_METADATA,
} from '../graphql.constants';
import { getTypeDecoratorParams } from 'type-graphql/helpers/decorators';
export function FieldResolver(): MethodDecorator;

export function FieldResolver(options: AdvancedOptions): MethodDecorator;
export function FieldResolver(
  returnTypeFunction?: ReturnTypeFunc,
  options?: AdvancedOptions,
): MethodDecorator;
export function FieldResolver(
  returnTypeFuncOrOptions?: any,
  maybeOptions?: AdvancedOptions,
): MethodDecorator {
  const TypeFieldResolver = TypeGraphQLFieldResolver(
    returnTypeFuncOrOptions,
    maybeOptions,
  );
  const { options } = getTypeDecoratorParams(
    returnTypeFuncOrOptions,
    maybeOptions,
  );
  return (target, key?, descriptor?) => {
    TypeFieldResolver(target, key, descriptor);
    ReflectMetadata(RESOLVER_NAME_METADATA, options.name || key)(
      target,
      key,
      descriptor,
    );
    ReflectMetadata(RESOLVER_PROPERTY_METADATA, true)(target, key, descriptor);
  };
}
