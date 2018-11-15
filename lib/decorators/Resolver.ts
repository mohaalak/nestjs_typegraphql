// tslint:disable:unified-signatures
import { Resolver as TypeGraphResovler, ClassType } from 'type-graphql';
import {
  ResolverClassOptions,
  ClassTypeResolver,
} from 'type-graphql/decorators/types';
import { ReflectMetadata } from '@nestjs/common';
import {
  RESOLVER_TYPE_METADATA,
  RESOLVER_NAME_METADATA,
} from '../graphql.constants';

export function Resolver(options: ResolverClassOptions): ClassDecorator;
export function Resolver(
  typeFunc: ClassTypeResolver,
  options?: ResolverClassOptions,
): ClassDecorator;
export function Resolver(
  objectType: ClassType,
  options?: ResolverClassOptions,
): ClassDecorator;
export function Resolver(
  objectTypeOrTypeFuncOrMaybeOptions?: any,
  maybeOptions?: ResolverClassOptions,
): ClassDecorator {
  const typeResolver = TypeGraphResovler(
    objectTypeOrTypeFuncOrMaybeOptions,
    maybeOptions,
  );

  const objectTypeOrTypeFunc: Function | undefined =
    typeof objectTypeOrTypeFuncOrMaybeOptions === 'function'
      ? objectTypeOrTypeFuncOrMaybeOptions
      : undefined;
  const options: ResolverClassOptions =
    (typeof objectTypeOrTypeFuncOrMaybeOptions === 'function'
      ? maybeOptions
      : objectTypeOrTypeFuncOrMaybeOptions) || {};

  return (target, key?, descriptor?) => {
    typeResolver(target);
    const getObjectType = objectTypeOrTypeFunc
      ? objectTypeOrTypeFunc.prototype
        ? () => objectTypeOrTypeFunc as ClassType
        : (objectTypeOrTypeFunc as ClassTypeResolver)
      : () => {
          throw new Error(
            `No provided object type in '@Resolver' decorator for class '${
              target.name
            }!'`,
          );
        };
    const name = getObjectType().name;

    ReflectMetadata(RESOLVER_TYPE_METADATA, name)(target, key, descriptor);
    ReflectMetadata(RESOLVER_NAME_METADATA, name)(target, key, descriptor);
  };
}
