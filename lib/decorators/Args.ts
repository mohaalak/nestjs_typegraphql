// tslint:disable:unified-signatures
import { PipeTransform, Type } from '@nestjs/common';
import { Args as ArgsTypeGraphql } from 'type-graphql';
import { GqlParamtype } from '../enums/gql-paramtype.enum';
import { ReturnTypeFunc } from 'type-graphql/decorators/types';
import { PARAM_ARGS_METADATA } from '../graphql.constants';
import { assignMetadata } from '.';

interface Pipes {
  pipes: (Type<PipeTransform> | PipeTransform)[];
}

export function Args(): ParameterDecorator;
export function Args(options: Pipes): ParameterDecorator;
export function Args(
  paramTypeFunction?: ReturnTypeFunc | Pipes,
  options?: Pipes,
): ParameterDecorator {
  const pipes =
    typeof paramTypeFunction !== 'function' ? paramTypeFunction : options;
  const typeArgs =
    typeof paramTypeFunction === 'function'
      ? ArgsTypeGraphql(paramTypeFunction)
      : ArgsTypeGraphql();

  return (target, key, index) => {
    typeArgs(target, key, index);
    const args =
      Reflect.getMetadata(PARAM_ARGS_METADATA, target.constructor, key) || {};

    const paramPipes = pipes ? (pipes.pipes ? pipes.pipes : []) : [];

    Reflect.defineMetadata(
      PARAM_ARGS_METADATA,
      assignMetadata(args, GqlParamtype.ARGS, index, undefined, ...paramPipes),
      target.constructor,
      key,
    );
  };
}
